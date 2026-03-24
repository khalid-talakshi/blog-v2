import {
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ReferenceArea,
  Scatter,
  ScatterChart,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import { CustomTooltip } from "./ChartTooltip";
import { FaMagnifyingGlassMinus } from "react-icons/fa6";
import { useGraphZoom2D } from "../hooks/useGraphZoom2D.ts";
import { type Trace } from "../types";

export interface Props {
  traces: Trace[];
  offset: number;
}

export function ScatterGraph({ traces, offset }: Props) {
  const {
    left,
    right,
    top,
    bottom,
    areaLeft,
    areaBottom,
    areaTop,
    areaRight,
    onMouseUp,
    onMouseDown,
    onMouseMove
  } = useGraphZoom2D("x1", "y1")

  const lines = traces?.map((trace) => (
    <Scatter
      dataKey={trace.y}
      data={trace.data}
      name={trace.name}
      stroke={trace.color || undefined}
      key={trace.name}
    />
  ));

  const firstTrace = traces[0];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 w-full rounded-xl text-sm px-2 py-1">
        <div
          className="hover:cursor-pointer hover:text-gray-400 transition ease-in-out duration-75"
        >
          <FaMagnifyingGlassMinus />
        </div>
      </div>
      <ScatterChart
        style={{ width: "100%", aspectRatio: 1.618 }}
        responsive
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
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
          id="x1"
        />
        <YAxis dataKey={firstTrace.y} domain={[bottom, top]} id="y1" />
        <Legend />
        <Tooltip shared={true} content={<CustomTooltip />} />
        {areaLeft && areaRight && areaTop && areaBottom ? (
          <ReferenceArea
            x1={areaLeft}
            x2={areaRight}
            y1={areaTop}
            y2={areaBottom}
            strokeOpacity={0.3}
            stroke="red"
          />
        ) : null}
        <RechartsDevtools />
      </ScatterChart>
    </div>
  );
}
