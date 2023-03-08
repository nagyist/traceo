import { localStorageService } from "../../../lib/localStorage";
import { LocalStorage } from "../../../lib/localStorage/types";
import dateUtils from "../../../utils/date";
import { statisticUtils } from "../../../utils/statistics";
import { normalizePlotData } from "../utils";
import { ErrorDetails } from "@traceo/types";
import { FC, useMemo } from "react";
import { BaseChart } from "../BaseChart";
import { BaseTooltip } from "../BaseTooltip";
import { BaseXAxis } from "../BaseXAxis";
import { BaseYAxis } from "../BaseYAxis";

interface Props {
  errors: ErrorDetails[];
}

const PLOT_COLOR = "#04785A";

const IncidentsListChart: FC<Props> = ({ errors }) => {
  const plotType = localStorageService.get<any>(LocalStorage.PlotType) || "bar";

  const dataSource = useMemo(() => {
    return normalizePlotData(statisticUtils.parseIncidentsTablePlotData(errors));
  }, [errors]);

  return (
    <BaseChart
      height="50px"
      dataset={{
        source: dataSource
      }}
      tooltip={BaseTooltip()}
      grid={{
        left: "20px",
        right: "10px",
        top: "10px",
        bottom: "10px"
      }}
      xAxis={BaseXAxis({
        show: false,
        pointerFormatter: (v) => dateUtils.formatDate(Number(v), "MMM D, YYYY")
      })}
      yAxis={BaseYAxis({
        axisLabel: {
          showMinLabel: false,
          color: "#CCCCDC",
          fontSize: 10
        },
        min: 0,
        max: (e) => {
          return e.max;
        },
        interval: 99999
      })}
      series={{
        name: "Errors",
        type: plotType,
        color: PLOT_COLOR,
        showSymbol: false,
        itemStyle: {
          borderColor: PLOT_COLOR,
          borderWidth: 2
        },
        areaStyle: {
          color: PLOT_COLOR,
          opacity: 0.4
        },
        barWidth: 10,
        barGap: "5%"
      }}
    />
  );
};

export default IncidentsListChart;