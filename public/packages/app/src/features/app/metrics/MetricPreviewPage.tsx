import { MetricTableWrapper } from "./components/MetricTableWrapper";
import { useSelector } from "react-redux";
import { StoreState } from "../../../store/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../store";
import { loadMetric } from "./state/actions";
import { conditionClass } from "../../../core/utils/classes";
import { MetricPreviewHeader } from "./components/MetricPreviewHeader";
import { MetricPreviewCustomizeForm } from "./components/MetricPreviewCustomizeForm";
import { IMetric, DeepPartial } from "@traceo/types";
import { useImmer } from "use-immer";
import { toggleNavbar } from "../state/navbar/actions";
import { CompressOutlined, ExpandOutlined } from "@ant-design/icons";
import { getLocalStorageTimeLimit } from "../../../core/utils/localStorage";
import ReactMarkdown from "react-markdown";
import { Card, Space, Tooltip } from "@traceo/ui";
import { MetricPreviewPlot } from "../../../core/components/Plots";
import { Page } from "../../../core/components/Page";

export const MetricPreviewPage = () => {
  const DEFAULT_TIME_LIMIT = getLocalStorageTimeLimit() || 12;

  const { metricId, id } = useParams();
  const dispatch = useAppDispatch();
  const { metric, hasFetchedMetric } = useSelector((state: StoreState) => state.metrics);
  const [options, setOptions] = useImmer<DeepPartial<IMetric>>(metric?.options);
  const [isCustomizeMode, setCustomizeMode] = useState<boolean>(false);
  const [isExpandMode, setExpandMode] = useState<boolean>(false);
  const [timeLimit, setTimeLimit] = useState<number>(DEFAULT_TIME_LIMIT);

  const form: any = {};

  useEffect(() => {
    dispatch(
      loadMetric({
        appId: id,
        metricId,
        hrCount: timeLimit
      })
    );
  }, [timeLimit]);

  useEffect(() => {
    if (metric) {
      setOptions(metric.options);
    }
  }, [metric]);

  const isDescriptionVisible = options?.showDescription;

  const onExpand = () => {
    dispatch(toggleNavbar(true));
    setExpandMode(true);
  };

  const onCompress = () => {
    dispatch(toggleNavbar(false));
    setExpandMode(false);
  };

  return (
    <Page isLoading={!hasFetchedMetric || !metric?.options}>
      <Page.Content>
        <MetricPreviewHeader
          form={form}
          isCustomizeMode={isCustomizeMode}
          isExpandMode={isExpandMode}
          setCustomizeMode={setCustomizeMode}
          setOptions={setOptions}
          timeLimit={timeLimit}
          setTimeLimit={setTimeLimit}
        />

        <div className="w-full grid grid-cols-12">
          <div className={conditionClass(isCustomizeMode, "col-span-9", "col-span-12")}>
            {isDescriptionVisible && !isExpandMode && (
              <Card title="Description" className="h-min">
                <ReactMarkdown>{metric?.options?.description}</ReactMarkdown>
              </Card>
            )}

            <Card
              title="Graph"
              className="h-min"
              extra={
                <Space>
                  {!isExpandMode && !isCustomizeMode && (
                    <Tooltip title="Expand view">
                      <ExpandOutlined onClick={onExpand} />
                    </Tooltip>
                  )}

                  {isExpandMode && (
                    <Tooltip title="Compress view">
                      <CompressOutlined onClick={onCompress} />
                    </Tooltip>
                  )}
                </Space>
              }
            >
              <MetricPreviewPlot isExpandMode={isExpandMode} options={options} />
            </Card>

            {!isExpandMode && (
              <MetricTableWrapper metric={options} metricData={metric?.datasource} />
            )}
          </div>
          {isCustomizeMode && (
            <MetricPreviewCustomizeForm setOptions={setOptions} form={form} />
          )}
        </div>
      </Page.Content>
    </Page>
  );
};

export default MetricPreviewPage;