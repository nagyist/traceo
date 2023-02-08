import { ToolboxComponentOption, TooltipComponentOption } from "echarts";

export const tooltipOptions: TooltipComponentOption = {
  trigger: "axis",
  backgroundColor: "#ebebeb",
  borderColor: "#ebebeb",
  textStyle: {
    color: "#2d2d2d",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
  },
  axisPointer: {
    lineStyle: {
      color: "#ebebeb",
      type: "dashed",
      width: 1
    }
  }
}

export const toolboxOptions: ToolboxComponentOption = {
  bottom: 0,
  left: "center",
  itemSize: 16,
  feature: {
    dataZoom: {
      yAxisIndex: "none",
      title: {
        zoom: "zoom",
        back: "undo"
      }
    }
  },
  z: -1
}

export const splitLine = {
  show: true,
  lineStyle: {
    color: "#ebebeb",
    width: 1
  }
};

export const normalizePlotData = (plotData: { date: number; count: number }[]) => {
  return {
    x: plotData?.map((plot) => plot.date) || [],
    y: plotData?.map((plot) => plot.count) || []
  };
};
