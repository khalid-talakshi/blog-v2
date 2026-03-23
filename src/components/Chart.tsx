import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend, Tooltip, type MouseHandlerDataParam, ReferenceArea } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { CustomTooltip } from './ChartTooltip';
import { useState, useCallback } from 'react'
import { FaMagnifyingGlassMinus } from "react-icons/fa6";


interface Trace {
  name: string
  data: any
  x: string
  y: string
  color: string
}

type ZoomAndHighlightState = {
  left: string | number;
  right: string | number;
  refAreaLeft: string | number | undefined;
  refAreaRight: string | number | undefined;
  refCoordLeft: { x: number | string, y: number | string } | undefined;
  refCoordRight: { x: number | string, y: number | string } | undefined;
  top: string | number;
  bottom: string | number;
  top2: string | number;
  bottom2: string | number;
  animation: boolean;
};

const initialState: ZoomAndHighlightState = {
  left: 'dataMin',
  right: 'dataMax',
  refAreaLeft: undefined,
  refAreaRight: undefined,
  top: 'dataMax+1',
  bottom: 'dataMin-1',
  top2: 'dataMax+20',
  bottom2: 'dataMin-20',
  animation: true,
  refCoordLeft: undefined,
  refCoordRight: undefined
};

const getAxisYDomain = (
  from: { x: number | string, y: number | string } | undefined,
  to: { x: number | string, y: number | string } | undefined,
  xref: string,
  yref: string,
  offset: number,
  traces: Trace[]
): (number | string)[] => {
  if (from != null && to != null) {
    console.log('from', from, 'to', to)
    console.log('map', traces[0].data.map(x => x[xref]).findIndex(x => x === from.x));
    console.log('map2', traces[1].data.map(x => x[xref]).findIndex(x => x === from.x));
    const firstIndex = traces.map((trace) => trace.data.findIndex(d => d[xref] === from)).filter((x) => x)
    const lastIndex = traces.map((trace) => [...trace.data].reverse().findIndex(d => d[xref] === to)).filter((x) => x)

    console.log('firstIndex', firstIndex, 'lastIndex', lastIndex)
    const top = Math.min(traces.map((trace) => Math.min(trace.data.slice(firstIndex, lastIndex).map(x => x[yref]))))
    const bottom = Math.max(traces.map((trace) => Math.max(trace.data.slice(firstIndex, lastIndex).map(x => x[yref]))))
    console.log([bottom, top])

    return [(bottom | 0) - offset, (top | 0) + offset];
  }
  return [initialState.bottom, initialState.top];
};

const getAxisXDomain = (from: string | number | undefined, to: string | number | undefined, ref: string, data: any) => {
  console.log('from', from, 'to', to)
  if (from != null && to != null) {
    const left = data[from][ref]
    console.log(data[from])
    const right = data[to][ref]
    console.log(data[to])
    return [left, right]
  }
  return [initialState.left, initialState.right]
}

export interface Props {
  traces: Trace[]
}

export default function Chart({ traces }: Props) {
  const [zoomGraph, setZoomGraph] = useState<ZoomAndHighlightState>(initialState);

  const zoom = useCallback(() => {
    setZoomGraph((prev: ZoomAndHighlightState): ZoomAndHighlightState => {
      let { refAreaLeft, refAreaRight, refCoordLeft, refCoordRight } = prev;

      if (refAreaLeft === refAreaRight || !refAreaRight) {
        return {
          ...prev,
          refAreaLeft: undefined,
          refAreaRight: undefined,
        };
      }

      if (refAreaLeft && refAreaRight && refAreaLeft > refAreaRight)
        [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

      const [bottom, top] = getAxisYDomain(refCoordLeft, refCoordRight, 'speed', 'distance', 1, traces);
      const [left, right] = getAxisXDomain(refAreaLeft, refAreaRight, 'distance', traces[0].data);

      return {
        ...prev,
        refAreaLeft: undefined,
        refAreaRight: undefined,
        left: left ?? initialState.left,
        right: right ?? initialState.right,
        bottom,
        top,
        bottom2,
        top2,
      };
    });
  }, [setZoomGraph]);

  const zoomOut = useCallback(() => {
    setZoomGraph(initialState);
  }, [setZoomGraph]);

  const onMouseDown = useCallback(
    (e: MouseHandlerDataParam) => {
      setZoomGraph((prev: ZoomAndHighlightState): ZoomAndHighlightState => ({ ...prev, refAreaLeft: e.activeLabel || 0, refCoordLeft: e.activeCoordinate }));
    },
    [setZoomGraph],
  );

  const onMouseMove = useCallback(
    (e: MouseHandlerDataParam) => {
      setZoomGraph(prev => {
        if (prev.refAreaLeft) {
          console.log(e)
          return { ...prev, refAreaRight: e.activeLabel || undefined, refCoordRight: e.activeCoordinate || undefined };
        }
        return prev;
      });
    },
    [setZoomGraph],
  );

  const { refAreaLeft, refAreaRight, left, right, top, bottom, top2, bottom2 } = zoomGraph;
  console.log(left, right)

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
