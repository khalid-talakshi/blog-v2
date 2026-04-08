import { useRef } from "react";
import {
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ReferenceArea as RechartsReferenceArea,
  Scatter,
  ScatterChart,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import { CustomTooltip } from "./ChartTooltip";
import { useGraphZoom2D } from "../hooks/useGraphZoom2D";
import { ZoomControls } from "./ZoomControls";
import { type Trace } from "../types";

export interface Props {
  traces: Trace[];
  offset?: number;
}

export function ScatterGraph({ traces }: Props): JSX.Element {
  const chartRef = useRef<HTMLDivElement>(null);
  const firstTrace = traces[0];

  // Calculate data domain from traces
  const allData = traces.flatMap((t) => t.data);
  const xValues = allData
    .map((d) => Number(d[firstTrace.x]))
    .filter((v) => !isNaN(v));
  const yValues = allData
    .map((d) => Number(d[firstTrace.y]))
    .filter((v) => !isNaN(v));

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  const {
    left,
    right,
    top,
    bottom,
    areaLeft,
    areaRight,
    areaTop,
    areaBottom,
    start,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    zoomOut,
  } = useGraphZoom2D({
    axisLock: "both",
    xKey: firstTrace.x,
    yKey: firstTrace.y,
    xDomain: [xMin, xMax],
    yDomain: [yMin, yMax],
    chartRef,
  });

  // For ScatterChart, we need to combine all data into one array
  // and use different Scatter components for each trace
  const combinedData = firstTrace.data;

  const lines = traces?.map((trace) => (
    <Scatter
      dataKey={trace.y}
      data={trace.data}
      name={trace.name}
      stroke={trace.color || undefined}
      key={trace.name}
    />
  ));

  return (
    <div className="flex flex-col gap-2">
      <ZoomControls onZoomOut={zoomOut} />
      <div
        ref={chartRef}
        style={{
          cursor: start ? "crosshair" : "default",
        }}
      >
        <ScatterChart
          data={combinedData}
          style={{ width: "100%", aspectRatio: 1.618 }}
          responsive
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          {lines}
          <XAxis
            dataKey={firstTrace.x}
            allowDecimals={false}
            domain={[left, right]}
            type="number"
            tickCount={4}
            allowDataOverflow
            id="x1"
          />
          <YAxis dataKey={firstTrace.y} domain={[bottom, top]} id="y1" />
          <Legend />
          <Tooltip shared={true} content={<CustomTooltip />} />
          {areaLeft !== undefined &&
          areaRight !== undefined &&
          areaTop !== undefined &&
          areaBottom !== undefined ? (
            <RechartsReferenceArea
              x1={areaLeft}
              x2={areaRight}
              y1={areaBottom}
              y2={areaTop}
              yAxisId="y1"
              strokeOpacity={0.3}
              stroke="red"
              fill="red"
              fillOpacity={0.1}
            />
          ) : null}
          <RechartsDevtools />
        </ScatterChart>
      </div>
    </div>
  );
}
