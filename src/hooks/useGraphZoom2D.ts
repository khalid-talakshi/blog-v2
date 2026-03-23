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
};

export const useGraphZoom2D = (xAxisId: string, yAxisId: string) => {
  const [zoomState, setZoomState] = useState(initialZoomState);
  const xScale = useXAxisInverseScale(xAxisId);
  const yScale = useYAxisInverseScale(yAxisId);

  const onMouseDown = useCallback(
    (e: MouseHandlerDataParam) => {
      if (e.activeCoordinate && xScale && yScale) {
        const pointX = xScale(e.activeCoordinate.x) as number;
        const pointY = yScale(e.activeCoordinate.y) as number;
        setZoomState(
          (prev: ZoomState2d): ZoomState2d => ({
            ...prev,
            areaLeft: pointX,
            areaRight: pointX,
            areaTop: pointY,
            areaBottom: pointY,
          }),
        );
      }
    },
    [setZoomState],
  );
};
