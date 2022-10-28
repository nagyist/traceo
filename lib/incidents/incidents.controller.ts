import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from '../auth/auth.model';
import { Incident } from '../db/entities/incident.entity';
import { AuthRequired } from '../libs/decorators/auth-required.decorator';
import { AuthAccount } from '../libs/decorators/auth-user.decorator';
import {
  IncidentQueryDto,
  IncidentUpdateDto,
  IncidentBatchUpdateDto
} from '../types/incident';
import { IncidentsQueryService } from './incidents-query/incidents-query.service';
import { IncidentsService } from './incidents.service';

@ApiTags('incidents')
@Controller('incidents')
export class IncidentsController {
  constructor(
    private readonly incidentsQueryService: IncidentsQueryService,
    private readonly incidentsService: IncidentsService,
  ) {}

  @Get('/:id')
  @AuthRequired()
  public async getIncident(@Param("id") id: string): Promise<Incident | null> {
    return await this.incidentsQueryService.getDto(id);
  }

  @Get()
  @AuthRequired()
  public async getIncidents(
    @Query("id") id: number,
    @Query() query: IncidentQueryDto
  ): Promise<Incident[]> {
    return await this.incidentsQueryService.listDto({
      appId: id,
      ...query
    });
  }

  @Get('/assigned/account')
  @AuthRequired()
  public async getAssignedIncidents(
    @Query() query: IncidentQueryDto,
    @AuthAccount() account: RequestUser,
  ): Promise<Incident[]> {
    return await this.incidentsQueryService.getAssignedIncidents(
      query,
      account,
    );
  }

  @Patch('/:id')
  @AuthRequired()
  public async updateIncident(
    @Param("id") id: string,
    @Body() body: IncidentUpdateDto,
  ): Promise<void> {
    return await this.incidentsService.updateIncident(id, body);
  }

  @Delete('/:id')
  @AuthRequired()
  public async deleteIncident(@Param("id") id: string): Promise<void> {
    return await this.incidentsService.removeIncident(id);
  }

  @Post('/batch')
  @AuthRequired()
  public async updateBatchIncidents(
    @Body() body: IncidentBatchUpdateDto,
  ): Promise<void> {
    return await this.incidentsService.updateBatchIncidents(body);
  }

  @Post('/remove/batch')
  @AuthRequired()
  public async removeBatchIncidents(
    @Body() body: IncidentBatchUpdateDto,
  ): Promise<void> {
    return await this.incidentsService.removeBatchIncidents(body);
  }
}