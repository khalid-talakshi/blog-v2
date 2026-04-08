import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { getEChartsTheme } from "../../utils/echartsTheme";
import type { Trace } from "../../types";

export interface EChartsLineChartProps {
  traces: Trace[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  enableZoom?: boolean;
  enablePan?: boolean;
  height?: number | string;
  width?: number | string;
}

/**
 * ECharts-based line chart component with zoom and pan support
 * Replaces Recharts LineChart with better interactivity
 *
 * Features:
 * - Single/Double axis zoom via mouse wheel or drag
 * - Pan support (move data around)
 * - Full theme customization matching your CSS variables
 * - Smooth animations
 * - Responsive design
 */
export const EChartsLineChart: React.FC<EChartsLineChartProps> = ({
  traces,
  title,
  xAxisLabel,
  yAxisLabel,
  enableZoom = true,
  enablePan = true,
  height = 400,
  width = "100%",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize chart
  useEffect(() => {
    if (!containerRef.current || !traces.length) return;

    // Initialize ECharts instance
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current, "light");
    }

    const chart = chartRef.current;

    // Prepare series data
    const series = traces.map((trace) => ({
      name: trace.name,
      type: "line",
      data: trace.data.map((d) => [d[trace.x], d[trace.y]]),
      stroke: trace.color,
      itemStyle: {
        color: trace.color,
      },
      lineStyle: {
        color: trace.color,
        width: 2,
      },
      smooth: true,
      animation: true,
      animationDuration: 300,
      symbolSize: 4,
      showSymbol: false,
      hoverSymbolSize: 6,
    }));

    // Calculate data domain
    const allData = traces.flatMap((t) =>
      t.data.map((d) => ({
        x: Number(d[traces[0].x]),
        y: Number(d[t.y]),
      })),
    );

    const xValues = allData.map((d) => d.x).filter((v) => !isNaN(v));
    const yValues = allData.map((d) => d.y).filter((v) => !isNaN(v));

    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    // Build chart option
    const option: echarts.EChartsOption = {
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
        data: traces.map((t) => t.name),
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
        min: xMin,
        max: xMax,
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
        min: yMin,
        max: yMax,
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
      dataZoom: enableZoom
        ? [
            {
              type: "inside",
              xAxisIndex: 0,
              start: 0,
              end: 100,
              zoomOnMouseWheel: true,
              moveOnMouseMove: enablePan,
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
          ]
        : undefined,
      series,
    };

    chart.setOption(option);
    setIsInitialized(true);

    // Handle window resize
    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [traces, title, xAxisLabel, yAxisLabel, enableZoom, enablePan]);

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

export default EChartsLineChart;
