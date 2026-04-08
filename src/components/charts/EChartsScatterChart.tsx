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

    // Professional color palette: Blues, Reds, Blacks, Whites
    const defaultColors = [
      "#0066cc", // Deep Blue
      "#cc0000", // Deep Red
      "#1a1a1a", // Black
      "#ffffff", // White
      "#0099ff", // Bright Blue
      "#ff3333", // Bright Red
      "#333333", // Dark Gray
      "#e6e6e6", // Light Gray
      "#003d99", // Navy Blue
      "#990000", // Dark Red
    ];

    // Prepare series configuration
    const chartSeries = series.map((s, index) => ({
      name: s.name,
      type: "scatter",
      data: s.data,
      itemStyle: {
        color: s.color || defaultColors[index % defaultColors.length],
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

    // Build chart option with modern design
    const option: EChartsOption = {
      title: title
        ? {
            text: title,
            left: "center",
            top: "8px",
            textStyle: {
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "system-ui, -apple-system, sans-serif",
            },
          }
        : undefined,
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        borderColor: "rgba(8, 143, 236, 0.3)",
        borderWidth: 1,
        textStyle: {
          color: "#e2e8f0",
          fontSize: 12,
          fontFamily: "system-ui, -apple-system, sans-serif",
        },
        padding: [8, 12],
        formatter: (params: any) => {
          if (params.componentSubType === "scatter") {
            return `<div style="font-weight: 500;">${params.name}</div><div style="margin-top: 4px;">X: ${params.value[0].toFixed(2)}</div><div>Y: ${params.value[1].toFixed(2)}</div>`;
          }
          return params.name;
        },
      },
      legend: {
        data: series.map((s) => s.name),
        textStyle: {
          color: "#cbd5e1",
          fontSize: 12,
          fontFamily: "system-ui, -apple-system, sans-serif",
        },
        bottom: 12,
        itemGap: 16,
        icon: "circle",
      },
      grid: {
        left: "12%",
        right: "12%",
        top: title ? "18%" : "12%",
        bottom: "18%",
        containLabel: false,
        backgroundColor: "rgba(15, 23, 42, 0.4)",
        borderColor: "rgba(8, 143, 236, 0.1)",
        borderWidth: 1,
      },
      xAxis: {
        type: "value",
        name: xAxisLabel,
        nameTextStyle: {
          color: "#94a3b8",
          fontSize: 11,
        },
        min: xMin - xPadding,
        max: xMax + xPadding,
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(8, 143, 236, 0.2)",
            width: 1,
          },
        },
        axisLabel: {
          color: "#94a3b8",
          fontSize: 11,
          margin: 8,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(8, 143, 236, 0.08)",
            width: 1,
            type: "dashed",
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        name: yAxisLabel,
        nameTextStyle: {
          color: "#94a3b8",
          fontSize: 11,
        },
        min: yMin - yPadding,
        max: yMax + yPadding,
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(8, 143, 236, 0.2)",
            width: 1,
          },
        },
        axisLabel: {
          color: "#94a3b8",
          fontSize: 11,
          margin: 8,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(8, 143, 236, 0.08)",
            width: 1,
            type: "dashed",
          },
        },
        axisTick: {
          show: false,
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
            color: "#94a3b8",
          },
          handleStyle: {
            color: "#008fec",
            borderColor: "rgba(8, 143, 236, 0.3)",
          },
          fillerColor: "rgba(8, 143, 236, 0.15)",
          backgroundColor: "rgba(8, 143, 236, 0.05)",
          borderColor: "rgba(8, 143, 236, 0.1)",
        },
      ],
      series: series.map((s) => ({
        name: s.name,
        type: "scatter",
        data: s.data,
        itemStyle: {
          color: s.color || "#008fec",
          borderWidth: 0,
          opacity: 0.8,
        },
        symbolSize,
        animation: true,
        animationDuration: 400,
        animationEasing: "cubicOut" as const,
        emphasis: {
          itemStyle: {
            borderWidth: 2,
            borderColor: s.color || "#008fec",
            opacity: 1,
          },
        },
      })) as EChartsOption["series"],
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
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        borderRadius: "12px",
        border: "1px solid rgba(8, 143, 236, 0.15)",
        boxShadow:
          "0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
      }}
    />
  );
};

export default EChartsScatterChart;
