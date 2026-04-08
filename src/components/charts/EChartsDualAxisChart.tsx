import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";

export interface DualAxisData {
  name: string | number;
  [key: string]: string | number;
}

export interface DualAxisSeries {
  name: string;
  dataKey: string;
  color: string;
  yAxisId: "left" | "right";
}

export interface EChartsDualAxisChartProps {
  data: DualAxisData[];
  series: DualAxisSeries[];
  title?: string;
  xAxisLabel?: string;
  leftYAxisLabel?: string;
  rightYAxisLabel?: string;
  height?: number | string;
  width?: number | string;
}

/**
 * ECharts dual-axis chart with independent zoom for each axis
 * Perfect for comparing metrics with different scales
 *
 * Features:
 * - Independent left and right Y-axis zoom
 * - X-axis zoom and pan
 * - Smooth animations
 * - Full theme customization
 * - Responsive design
 */
export const EChartsDualAxisChart: React.FC<EChartsDualAxisChartProps> = ({
  data,
  series,
  title,
  xAxisLabel,
  leftYAxisLabel,
  rightYAxisLabel,
  height = 400,
  width = "100%",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current || !data.length || !series.length) return;

    // Initialize ECharts instance
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current, "light");
    }

    const chart = chartRef.current;

    // Prepare series configuration
    const chartSeries = series.map((s) => ({
      name: s.name,
      type: "line",
      data: data.map((d) => d[s.dataKey]),
      yAxisId: s.yAxisId === "left" ? 0 : 1,
      itemStyle: {
        color: s.color,
      },
      lineStyle: {
        color: s.color,
        width: 2,
      },
      smooth: true,
      animation: true,
      animationDuration: 300,
      symbolSize: 4,
      showSymbol: false,
      hoverSymbolSize: 6,
    }));

    // Calculate Y-axis domains for each axis
    const leftSeriesData = series
      .filter((s) => s.yAxisId === "left")
      .flatMap((s) => data.map((d) => Number(d[s.dataKey])))
      .filter((v) => !isNaN(v));

    const rightSeriesData = series
      .filter((s) => s.yAxisId === "right")
      .flatMap((s) => data.map((d) => Number(d[s.dataKey])))
      .filter((v) => !isNaN(v));

    const leftYMin = Math.min(...leftSeriesData);
    const leftYMax = Math.max(...leftSeriesData);
    const rightYMin = Math.min(...rightSeriesData);
    const rightYMax = Math.max(...rightSeriesData);

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
        trigger: "axis",
        backgroundColor: "rgba(0, 7, 27, 0.8)",
        borderColor: "#2264e3",
        textStyle: {
          color: "#ffffff",
        },
        axisPointer: {
          type: "cross",
          lineStyle: {
            color: "#2264e3",
            width: 1,
          },
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
        type: "category",
        name: xAxisLabel,
        data: data.map((d) => d.name),
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
      yAxis: [
        {
          type: "value",
          name: leftYAxisLabel,
          position: "left",
          min: leftYMin,
          max: leftYMax,
          axisLine: {
            lineStyle: {
              color: "#008fec",
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
        {
          type: "value",
          name: rightYAxisLabel,
          position: "right",
          min: rightYMin,
          max: rightYMax,
          axisLine: {
            lineStyle: {
              color: "#82ca9d",
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
      ],
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: 0,
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
  }, [data, series, title, xAxisLabel, leftYAxisLabel, rightYAxisLabel]);

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

export default EChartsDualAxisChart;
