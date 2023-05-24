import { Injectable, Logger } from "@nestjs/common";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";
import { MetricQueryDto, MetricsQueryDto } from "../../../common/types/dto/metrics.dto";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { IMetric, MetricPreviewType } from "@traceo/types";
import { Metric } from "../../../db/entities/metric.entity";
import { Brackets, EntityManager } from "typeorm";
import { ClickhouseService } from "../../../common/services/clickhouse/clickhouse.service";

export type AggregateTimeSeries = { minute: number, value: number }[];

@Injectable()
export class MetricsQueryService {
  private readonly logger: Logger;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly clickhouseService: ClickhouseService
  ) {
    this.logger = new Logger(MetricsQueryService.name);
  }

  public async getProjectMetrics(
    projectId: string,
    query: MetricsQueryDto
  ): Promise<ApiResponse<IMetric[]>> {
    try {
      const queryBuilder = this.entityManager
        .getRepository(Metric)
        .createQueryBuilder("metric")
        .innerJoinAndSelect("metric.project", "project", "project.id = :projectId", {
          projectId
        });

      if (query?.search) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("LOWER(metric.name) LIKE LOWER(:search)", {
              search: `%${query.search}%`
            }).orWhere("LOWER(metric.description) LIKE LOWER(:search)", {
              search: `%${query.search}%`
            });
          })
        );
      }

      const metrics = await queryBuilder.getMany();
      return new ApiResponse("success", undefined, metrics);
    } catch (err) {
      this.logger.error(`[${this.getProjectMetrics.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async getMetricGraphPayload(
    projectId: string,
    metricId: string,
    from: number,
    to: number
  ): Promise<ApiResponse<MetricPreviewType>> {
    if (!projectId || !metricId) {
      throw new Error("Project and metric ids are required!");
    }

    try {
      const metric = await this.entityManager.getRepository(Metric).findOneBy({
        id: metricId,
        project: {
          id: projectId
        }
      });

      const response = await this.mapAggregateDataSource(projectId, {
        from, to,
        fields: metric.series.map((e) => e.field)
      })

      return new ApiResponse("success", undefined, {
        options: metric,
        datasource: response
      });
    } catch (err) {
      this.logger.error(`[${this.getMetricGraphPayload.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  /**
   * TODO: aggregate results from time series in clickhouse query instead here. 
   */
  private async mapAggregateDataSource(projectId: string, query: MetricQueryDto) {
    let response = {};

    for (const field of query.fields) {
      const aggregatedMetric = await this.clickhouseService.aggregateMetrics(projectId, field, {
        from: query.from, to: query.to, fields: []
      });

      response["time"] = aggregatedMetric.map(({ minute }) => minute);
      response[field] = aggregatedMetric.map(({ value }) => value);
    }

    return response;
  }
}
