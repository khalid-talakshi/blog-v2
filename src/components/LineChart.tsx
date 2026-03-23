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
import { FaMagnifyingGlassMinus } from "react-icons/fa6";
import { useGraphZoom } from "../hooks/useGraphZoom";
import { type Trace } from "../types";

export interface Props {
  traces: Trace[];
  offset?: number
}

export default function LineGraph({ traces, offset }: Props) {
  const {
    left,
    right,
    zoomOut,
    zoom,
    onMouseDown,
    onMouseMove,
    refAreaLeft,
    refAreaRight,
    bottom,
    top,
  } = useGraphZoom(traces, offset);

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

  const firstTrace = traces[0]
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 w-full rounded-xl text-sm px-2 py-1">
        <div
          onClick={zoomOut}
          className="hover:cursor-pointer hover:text-gray-400 transition ease-in-out duration-75"
        >
          <FaMagnifyingGlassMinus />
        </div>
      </div>
      <LineChart
        style={{ width: "100%", aspectRatio: 1.618 }}
        responsive
        onMouseDown={onMouseDown}
        onMouseUp={zoom}
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
        />
        <YAxis dataKey={firstTrace.y} domain={[bottom, top]} />
        <Legend />
        <Tooltip shared={true} content={<CustomTooltip />} />
        {refAreaLeft && refAreaRight ? (
          <ReferenceArea
            x1={refAreaLeft}
            x2={refAreaRight}
            strokeOpacity={0.3}
            stroke="red"
          />
        ) : null}
        <RechartsDevtools />
      </LineChart>
    </div>
  );
}
