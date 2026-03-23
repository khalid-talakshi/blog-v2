import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend, Tooltip, type MouseHandlerDataParam, ReferenceArea } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { CustomTooltip } from './ChartTooltip';
import { FaMagnifyingGlassMinus } from "react-icons/fa6";
import {  useGraphZoom } from '../hooks/useGraphZoom';
import {type Trace} from '../types/'

export interface Props {
  traces: Trace[]
}

export default function Chart({ traces }: Props) {
  const {left, right, zoomOut, zoom, onMouseDown, onMouseMove, refAreaLeft, refAreaRight, bottom, top} = useGraphZoom(traces)

  const lines = traces?.map((trace) => (
    <Line dataKey={trace.y} dot={false} data={trace.data} name={trace.name} stroke={trace.color || undefined} />
  ))

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-2 border border-white w-full rounded-xl text-sm px-2 py-1'>
        <div onClick={zoomOut}><FaMagnifyingGlassMinus /></div>
      </div>
      <LineChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }} responsive onMouseDown={onMouseDown} onMouseUp={zoom} onMouseMove={onMouseMove}>
        <CartesianGrid strokeDasharray="2 2" stroke='gray' />
        {lines}
        <XAxis dataKey="distance" allowDecimals={false} type="number" tickCount={4} domain={[left, right]} allowDataOverflow />
        <YAxis dataKey="speed" domain={[bottom, top]} />
        <Legend />
        <Tooltip shared={true} content={<CustomTooltip />} />
        {refAreaLeft && refAreaRight ? (
          <ReferenceArea
            x1={refAreaLeft}
            x2={refAreaRight}
            strokeOpacity={0.3}
            stroke='red'
          />
        ) : null}
        <RechartsDevtools />
      </LineChart>
    </div>
  )
}
