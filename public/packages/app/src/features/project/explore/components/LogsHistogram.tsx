import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { useLogLevels } from "../../../../core/hooks/useLogLevels";
import { statisticUtils } from "../../../../core/utils/statistics";
import { useAppDispatch } from "../../../../store";
import { loadApplicationLogs } from "../state/actions";
import { LoadingOutlined } from "@ant-design/icons";
import { StoreState } from "@store/types";
import { Card, TimeRangePicker } from "@traceo/ui";
import dayjs from "dayjs";
import { useEffect, useMemo, lazy } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTimeRange } from "../../../../core/hooks/useTimeRange";
import { LogLevel } from "@traceo/types";
import { relativeTimeOptions } from "./utils";

const LazyLogsExplorePlot = lazy(
  () => import("../../../../core/components/Charts/Logs/LogsExploreChart")
);

export const LogsHistogram = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { logs, hasFetched } = useSelector((state: StoreState) => state.logs);
  const { levels, setLevels } = useLogLevels();
  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(30, "minute").unix(),
    to: dayjs().unix()
  });

  useEffect(() => {
    const props = {
      from: ranges[0],
      to: ranges[1],
      levels
    };

    dispatch(loadApplicationLogs(id, props));
  }, [levels, ranges]);

  const dataSource = useMemo(
    () => statisticUtils.parseLogs([ranges[0], ranges[1]], logs),
    [logs]
  );

  const legendItems = () => {
    const a = Object.values(LogLevel).reduce((acc, val) => {
      const name = val.charAt(0).toUpperCase() + val.slice(1);
      acc[name] = levels.includes(val);
      return acc;
    }, {});

    return a;
  };

  const renderToolbar = (
    <div className="flex flex-row gap-x-5 items-center">
      {!hasFetched && <LoadingOutlined />}
      <TimeRangePicker
        value={ranges}
        options={relativeTimeOptions}
        maxHourPeriod={3}
        submit={(val: [number, number]) => setRanges(val)}
      />
    </div>
  );

  return (
    <Card className="mb-0 h-full" title="Histogram" extra={renderToolbar}>
      <ConditionalWrapper isLoading={!hasFetched && !logs}>
        <LazyLogsExplorePlot
          legendItems={legendItems()}
          setLegendItems={setLevels}
          setRanges={setRanges}
          logs={dataSource}
          zoom={true}
        />
      </ConditionalWrapper>
    </Card>
  );
};