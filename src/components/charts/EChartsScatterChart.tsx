import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";

export interface ScatterData {
  name: string;
  data: Array<[number, number]>;
  color?: string;
}

export interface EChartsScatterChartProps {
  series: ScatterData[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number | string;
  width?: number | string;
  symbolSize?: number;
}

/**
 * ECharts scatter chart with zoom and pan support
 * Great for visualizing correlations and distributions
 *
 * Features:
 * - Mouse wheel zoom
 * - Pan support
 * - Customizable symbol size
 * - Full theme customization
 * - Responsive design
 */
export const EChartsScatterChart: React.FC<EChartsScatterChartProps> = ({
  series,
  title,
  xAxisLabel,
  yAxisLabel,
  height = 400,
  width = "100%",
  symbolSize = 8,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current || !series.length) return;

    // Initialize ECharts instance
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current, "light");
    }

    const chart = chartRef.current;

    // Prepare series configuration
    const chartSeries = series.map((s) => ({
      name: s.name,
      type: "scatter",
      data: s.data,
      itemStyle: {
        color: s.color || "#008fec",
      },
      symbolSize,
      animation: true,
      animationDuration: 300,
    }));

    // Calculate data domain
    const allData = series.flatMap((s) => s.data);
    const xValues = allData.map((d) => d[0]).filter((v) => !isNaN(v));
    const yValues = allData.map((d) => d[1]).filter((v) => !isNaN(v));

    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    // Add padding to domain
    const xPadding = (xMax - xMin) * 0.1;
    const yPadding = (yMax - yMin) * 0.1;

    // Build chart option
    const option: EChartsOption = {
      title: title
        ? {
            text: title,
            left: "center",
            textStyle: {
              color: "#008fec",
              fontSize: 16,
              fontWeight: "bold",
            },
          }
        : undefined,
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(0, 7, 27, 0.8)",
        borderColor: "#2264e3",
        textStyle: {
          color: "#ffffff",
        },
        formatter: (params: any) => {
          if (params.componentSubType === "scatter") {
            return `${params.name}<br/>X: ${params.value[0].toFixed(2)}<br/>Y: ${params.value[1].toFixed(2)}`;
          }
          return params.name;
        },
      },
      legend: {
        data: series.map((s) => s.name),
        textStyle: {
          color: "#ffffff",
        },
        bottom: 10,
      },
      grid: {
        left: "10%",
        right: "10%",
        top: title ? "15%" : "10%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        name: xAxisLabel,
        min: xMin - xPadding,
        max: xMax + xPadding,
        axisLine: {
          lineStyle: {
            color: "#2264e3",
          },
        },
        axisLabel: {
          color: "#ffffff",
        },
        splitLine: {
          lineStyle: {
            color: "#212f3f",
          },
        },
      },
      yAxis: {
        type: "value",
        name: yAxisLabel,
        min: yMin - yPadding,
        max: yMax + yPadding,
        axisLine: {
          lineStyle: {
            color: "#2264e3",
          },
        },
        axisLabel: {
          color: "#ffffff",
        },
        splitLine: {
          lineStyle: {
            color: "#212f3f",
          },
        },
      },
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: 0,
          yAxisIndex: 0,
          start: 0,
          end: 100,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          moveOnMouseWheel: false,
          preventDefaultMouseMove: true,
        },
        {
          type: "slider",
          xAxisIndex: 0,
          start: 0,
          end: 100,
          textStyle: {
            color: "#ffffff",
          },
          handleStyle: {
            color: "#008fec",
          },
          fillerColor: "rgba(0, 143, 236, 0.2)",
        },
      ],
      series: chartSeries as EChartsOption["series"],
    };

    chart.setOption(option);

    // Handle window resize
    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [series, title, xAxisLabel, yAxisLabel, symbolSize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width,
        height: typeof height === "number" ? `${height}px` : height,
        backgroundColor: "#00071b",
        borderRadius: "8px",
        border: "1px solid #2264e3",
      }}
    />
  );
};

export default EChartsScatterChart;
