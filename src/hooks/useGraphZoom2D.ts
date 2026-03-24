import { useCallback, useState } from "react";
import {
  useXAxisInverseScale,
  useYAxisInverseScale,
  type MouseHandlerDataParam,
} from "recharts";

interface ZoomState2d {
  left: string | number;
  right: string | number;
  top: string | number;
  bottom: string | number;
  areaLeft?: string | number;
  areaRight?: string | number;
  areaTop?: string | number;
  areaBottom?: string | number;
  start: boolean
}

const initialZoomState: ZoomState2d = {
  left: "dataMin",
  right: "dataMax",
  top: "dataMin + 0.25",
  bottom: "dataMax + 0.25",
  areaLeft: undefined,
  areaTop: undefined,
  areaBottom: undefined,
  areaRight: undefined,
  start: false
};

export const useGraphZoom2D = (xAxisId: string, yAxisId: string) => {
  const [zoomState, setZoomState] = useState(initialZoomState);

  const onMouseDown = useCallback(
    (e: MouseHandlerDataParam) => {
      console.log(e)
      if (e.activeCoordinate) {
        console.log(e.activeCoordinate)
        const pointX = e.activeCoordinate.x
        const pointY = e.activeCoordinate.y
        setZoomState(
          (prev: ZoomState2d): ZoomState2d => ({
            ...prev,
            areaLeft: pointX,
            areaRight: pointX,
            areaTop: pointY,
            areaBottom: pointY,
            start: true
          }),
        );
        console.log(zoomState)
      }
    },
    [setZoomState],
  );

  const onMouseMove = useCallback((e: MouseHandlerDataParam) => {
    if (e.activeCoordinate) {
      const pointX = e.activeCoordinate.x
      const pointY = e.activeCoordinate.y


      setZoomState(
        (prev: ZoomState2d): ZoomState2d => {
          const newState = prev
          newState.areaLeft = Math.min(pointX, Number(prev.areaLeft) || Number.MAX_SAFE_INTEGER)
          newState.areaRight = Math.max(pointX, Number(prev.areaRight) || Number.MIN_SAFE_INTEGER)
          newState.areaTop = Math.max(pointY, Number(prev.areaTop) || Number.MIN_SAFE_INTEGER)
          newState.areaBottom = Math.min(pointY, Number(prev.areaBottom) || Number.MAX_SAFE_INTEGER)
          return {
            ...prev,
            ...newState
          }
        },
      );
    }
  }, [setZoomState])

  const onMouseUp = useCallback(() => {
    setZoomState((prev) => ({
      ...prev,
      start: false
    }))
  }, [setZoomState])

  return {

    ...zoomState,
    onMouseUp,
    onMouseDown,
    onMouseMove
  }
};
