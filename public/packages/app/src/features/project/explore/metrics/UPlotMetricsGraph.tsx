import { EXPLORE_PLOT_TYPE, ExploreSerieType, PLOT_TYPE, Setter, TimeRange } from "@traceo/types";
import { useMemo } from "react";
import BaseUPlotChart from "src/core/components/UPlot/BaseUPlotChart";
import { UPlotConfigBuilder } from "src/core/components/UPlot/UPlotConfigBuilder";
import { hook } from "src/core/components/UPlot/hooks";
import { getFillOpacity } from "src/core/components/UPlot/utils";
import { calculateOpacity } from "src/core/utils/colors";

interface Props {
  datasource: any[];
  series: ExploreSerieType[];
  onZoom?: Setter<TimeRange>;
  type: EXPLORE_PLOT_TYPE;
  stacked: boolean;
  markers: boolean;
}

const mapToUplotType: Record<EXPLORE_PLOT_TYPE, PLOT_TYPE> = {
  bar: PLOT_TYPE.BAR,
  area: PLOT_TYPE.LINE,
  line: PLOT_TYPE.LINE,
  points: PLOT_TYPE.POINTS
};

export const UPlotMetricsGraph = ({
  datasource = undefined,
  series = [],
  onZoom = undefined,
  type = "line",
  stacked = false,
  markers = false
}: Props) => {
  const configs = useMemo(() => {
    const chartType = mapToUplotType[type];
    const builder = new UPlotConfigBuilder();
    for (const serie of series) {
      builder.addSerie({
        type: chartType,
        stroke: serie.color,
        width: 1,
        fill: calculateOpacity(serie.color, getFillOpacity(type)),
        points: {
          show: markers
        },
        label: serie.name
      });
    }

    return builder
      .addBase({
        height: 400,
        stacked,
        data: datasource
      })
      .addLegend({
        show: true
      })
      .addAxe({ scale: "x", isTimeAxis: true })
      .addAxe({ scale: "y" })
      .addScale({
        x: {
          time: true,
          auto: false
        }
      })
      .addHook("setSelect", (self: uPlot) => hook.setSelect(self, onZoom))
      .addTooltip({})
      .build();
  }, [type, stacked, markers, datasource]);

  return <BaseUPlotChart configs={configs} />;
};
