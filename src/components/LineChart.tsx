import { useRef } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ReferenceArea,
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

export default function LineGraph({ traces }: Props): JSX.Element {
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
    bottom,
    top,
    areaLeft,
    areaRight,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    zoomOut,
  } = useGraphZoom2D({
    axisLock: "x",
    xKey: firstTrace.x,
    yKey: firstTrace.y,
    xDomain: [xMin, xMax],
    yDomain: [yMin, yMax],
    chartRef,
  });

  const lines = traces?.map((trace) => (
    <Line
      dataKey={trace.y}
      dot={false}
      data={trace.data}
      name={trace.name}
      stroke={trace.color || undefined}
      key={trace.name}
    />
  ));

  return (
    <div className="flex flex-col gap-2">
      <ZoomControls onZoomOut={zoomOut} />
      <div ref={chartRef}>
        <LineChart
          style={{ width: "100%", aspectRatio: 1.618 }}
          responsive
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          <CartesianGrid strokeDasharray="2 2" stroke="gray" />
          {lines}
          <XAxis
            dataKey={firstTrace.x}
            allowDecimals={false}
            type="number"
            tickCount={4}
            domain={[left, right]}
            allowDataOverflow
          />
          <YAxis dataKey={firstTrace.y} domain={[bottom, top]} />
          <Legend />
          <Tooltip shared={true} content={<CustomTooltip />} />
          {areaLeft !== undefined && areaRight !== undefined ? (
            <ReferenceArea
              x1={areaLeft}
              x2={areaRight}
              strokeOpacity={0.3}
              stroke="red"
            />
          ) : null}
          <RechartsDevtools />
        </LineChart>
      </div>
    </div>
  );
}
