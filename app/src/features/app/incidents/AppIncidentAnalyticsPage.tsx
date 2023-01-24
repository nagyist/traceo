import { statisticUtils } from "../../../core/utils/statistics";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import AppIncidentNavigationPage from "./components/AppIncidentNavigationPage";
import dateUtils from "../../../core/utils/date";
import { Typography } from "core/ui-components/Typography";
import { Card } from "core/ui-components/Card";
import { AppIncidentsTodayPlot, AppOverviewPlot } from "core/components/Plots";
import { useMemo } from "react";

export const AppIncidentAnalyticsPage = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  const dataSource = useMemo(() => {
    return statisticUtils.parseIncidentsAnalyticsTodayPlotData(
      incident?.errorsDetails || []
    );
  }, [incident?.errorsDetails]);

  return (
    <AppIncidentNavigationPage>
      <div className="grid grid-cols-5 w-full mb-1">
        <div className="col-span-4 h-full">
          <Card title="Today">
            <AppIncidentsTodayPlot stats={dataSource?.data} />
          </Card>
        </div>
        <div className="col-span-1 ml-1">
          <div className="flex flex-col items-stretch h-full">
            <div className="h-full mb-1">
              <Card title="Errors count">
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
        </div>
      </div>
      <Card title="Total overview">
        <AppOverviewPlot stats={incident.errorsDetails} />
      </Card>
    </AppIncidentNavigationPage>
  );
};

export default AppIncidentAnalyticsPage;
