import dateUtils from "../../../core/utils/date";
import { statisticUtils } from "../../../core/utils/statistics";
import IncidentPageWrapper from "./components/IncidentPageWrapper";
import { StoreState } from "@store/types";
import { Typography, Card } from "@traceo/ui";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import IncidentsTodayChart from "../../../core/components/Charts/Incidents/IncidentsTodayChart";
import IncidentsOverviewChart from "../../../core/components/Charts/Incidents/IncidentsOverviewChart";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";

export const IncidentAnalyticsPage = () => {
  const { hasEventsFetched, events } = useSelector((state: StoreState) => state.incident);

  const dataSource = useMemo(() => {
    return statisticUtils.parseIncidentsAnalyticsTodayPlotData(events || []);
  }, [events]);

  return (
    <IncidentPageWrapper>
      <div className="grid grid-cols-5 w-full mb-1">
        <div className="col-span-4 h-full">
          <Card title="Today" className="h-full">
            <ConditionalWrapper isLoading={!hasEventsFetched}>
              <IncidentsTodayChart stats={dataSource?.data} />
            </ConditionalWrapper>
          </Card>
        </div>
        <div className="col-span-1 ml-1">
          <ConditionalWrapper isLoading={!hasEventsFetched}>
            <div className="flex flex-col items-stretch h-full">
              <div className="h-full mb-1">
                <Card title="Errors count" className="h-full">
                  <Typography size="xxl" weight="semibold">
                    {dataSource?.count}
                  </Typography>
                </Card>
              </div>
              <div className="h-full">
                <Card className="h-full" title="Last seen">
                  <Typography size="xxl" weight="semibold">
                    {dateUtils.formatDate(dataSource?.last, "HH:mm")}
                  </Typography>
                </Card>
              </div>
            </div>
          </ConditionalWrapper>
        </div>
      </div>
      <Card title="Total overview">
        <ConditionalWrapper isLoading={!hasEventsFetched}>
          <IncidentsOverviewChart stats={events} />
        </ConditionalWrapper>
      </Card>
    </IncidentPageWrapper>
  );
};

export default IncidentAnalyticsPage;