import { useCallback, useState, useRef } from "react";
import { type MouseHandlerDataParam } from "recharts";

type AxisLock = "x" | "y" | "both";

interface ZoomState2d {
  left: string | number;
  right: string | number;
  top: string | number;
  bottom: string | number;
  areaLeft?: string | number;
  areaRight?: string | number;
  areaTop?: string | number;
  areaBottom?: string | number;
  start: boolean;
}

interface ChartBounds {
  x: number;
  y: number;
  width: number;
  height: number;
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
  start: false,
};

interface UseGraphZoom2DOptions {
  axisLock?: AxisLock;
  xKey?: string;
  yKey?: string;
  xDomain?: [number, number];
  yDomain?: [number, number];
  chartRef?: React.RefObject<HTMLDivElement>;
}

/**
 * Convert pixel coordinates to data coordinates
 * @param pixelX - X pixel coordinate relative to chart
 * @param pixelY - Y pixel coordinate relative to chart
 * @param bounds - Chart bounds (x, y, width, height)
 * @param xDomain - X-axis data domain [min, max]
 * @param yDomain - Y-axis data domain [min, max]
 * @returns Data coordinates [dataX, dataY]
 */
const pixelToData = (
  pixelX: number,
  pixelY: number,
  bounds: ChartBounds,
  xDomain: [number, number],
  yDomain: [number, number],
): [number, number] => {
  // Normalize pixel coordinates to 0-1 range
  const normalizedX = (pixelX - bounds.x) / bounds.width;
  const normalizedY = (pixelY - bounds.y) / bounds.height;

  // Clamp to 0-1
  const clampedX = Math.max(0, Math.min(1, normalizedX));
  const clampedY = Math.max(0, Math.min(1, normalizedY));

  // Convert to data coordinates
  const [xMin, xMax] = xDomain;
  const [yMin, yMax] = yDomain;

  const dataX = xMin + clampedX * (xMax - xMin);
  // Y is inverted in SVG (0 at top, increases downward)
  const dataY = yMax - clampedY * (yMax - yMin);

  return [dataX, dataY];
};

export const useGraphZoom2D = (options: UseGraphZoom2DOptions = {}) => {
  const {
    axisLock = "both",
    xKey = "x",
    yKey = "y",
    xDomain = [0, 100],
    yDomain = [0, 100],
    chartRef,
  } = options;
  const [zoomState, setZoomState] = useState(initialZoomState);
  const chartBoundsRef = useRef<ChartBounds | null>(null);

  const onMouseDown = useCallback(
    (e: MouseHandlerDataParam) => {
      console.log("onMouseDown:", {
        activeLabel: e.activeLabel,
        activeCoordinate: e.activeCoordinate,
        activePayload: e.activePayload?.[0]?.payload,
      });

      // Try to get data coordinates from activePayload first
      if (e.activePayload && e.activePayload.length > 0) {
        const payload = e.activePayload[0].payload;
        const dataX = payload?.[xKey];
        const dataY = payload?.[yKey];

        if (dataX !== undefined && dataY !== undefined) {
          setZoomState(
            (prev: ZoomState2d): ZoomState2d => ({
              ...prev,
              areaLeft: axisLock === "y" ? undefined : dataX,
              areaRight: axisLock === "y" ? undefined : dataX,
              areaTop: axisLock === "x" ? undefined : dataY,
              areaBottom: axisLock === "x" ? undefined : dataY,
              start: true,
            }),
          );
          return;
        }
      }

      // Fallback: use pixel coordinates and convert to data coordinates
      if (e.activeCoordinate && chartRef?.current) {
        const svg = chartRef.current.querySelector("svg");
        if (svg) {
          const rect = svg.getBoundingClientRect();
          chartBoundsRef.current = {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
          };

          const [dataX, dataY] = pixelToData(
            e.activeCoordinate.x,
            e.activeCoordinate.y,
            chartBoundsRef.current,
            xDomain,
            yDomain,
          );

          console.log("Converted to data coordinates:", { dataX, dataY });

          setZoomState(
            (prev: ZoomState2d): ZoomState2d => ({
              ...prev,
              areaLeft: axisLock === "y" ? undefined : dataX,
              areaRight: axisLock === "y" ? undefined : dataX,
              areaTop: axisLock === "x" ? undefined : dataY,
              areaBottom: axisLock === "x" ? undefined : dataY,
              start: true,
            }),
          );
        }
      }
    },
    [axisLock, xKey, yKey, xDomain, yDomain, chartRef],
  );

  const onMouseMove = useCallback(
    (e: MouseHandlerDataParam) => {
      // Try activePayload first
      if (e.activePayload && e.activePayload.length > 0) {
        const payload = e.activePayload[0].payload;
        const dataX = payload?.[xKey];
        const dataY = payload?.[yKey];

        if (dataX !== undefined && dataY !== undefined) {
          setZoomState((prev: ZoomState2d): ZoomState2d => {
            if (!prev.start) return prev;

            const newState = { ...prev };

            if (axisLock !== "y") {
              const startX = Number(prev.areaLeft) ?? 0;
              newState.areaLeft = Math.min(startX, dataX);
              newState.areaRight = Math.max(startX, dataX);
            }

            if (axisLock !== "x") {
              const startY = Number(prev.areaTop) ?? 0;
              newState.areaTop = Math.max(startY, dataY);
              newState.areaBottom = Math.min(startY, dataY);
            }

            return newState;
          });
          return;
        }
      }

      // Fallback: use pixel coordinates
      if (e.activeCoordinate && chartBoundsRef.current) {
        const [dataX, dataY] = pixelToData(
          e.activeCoordinate.x,
          e.activeCoordinate.y,
          chartBoundsRef.current,
          xDomain,
          yDomain,
        );

        setZoomState((prev: ZoomState2d): ZoomState2d => {
          if (!prev.start) return prev;

          const newState = { ...prev };

          if (axisLock !== "y") {
            const startX = Number(prev.areaLeft) ?? 0;
            newState.areaLeft = Math.min(startX, dataX);
            newState.areaRight = Math.max(startX, dataX);
          }

          if (axisLock !== "x") {
            const startY = Number(prev.areaTop) ?? 0;
            newState.areaTop = Math.max(startY, dataY);
            newState.areaBottom = Math.min(startY, dataY);
          }

          return newState;
        });
      }
    },
    [axisLock, xKey, yKey, xDomain, yDomain],
  );

  const onMouseUp = useCallback(() => {
    setZoomState((prev) => {
      if (!prev.start) return prev;

      // Apply zoom if selection was made
      const hasXSelection =
        axisLock !== "y" &&
        prev.areaLeft !== undefined &&
        prev.areaRight !== undefined &&
        prev.areaLeft !== prev.areaRight;
      const hasYSelection =
        axisLock !== "x" &&
        prev.areaTop !== undefined &&
        prev.areaBottom !== undefined &&
        prev.areaTop !== prev.areaBottom;

      if (hasXSelection || hasYSelection) {
        console.log("Applying zoom:", {
          hasXSelection,
          hasYSelection,
          left: prev.areaLeft,
          right: prev.areaRight,
          top: prev.areaTop,
          bottom: prev.areaBottom,
        });

        return {
          ...prev,
          left: hasXSelection ? (prev.areaLeft as number) : prev.left,
          right: hasXSelection ? (prev.areaRight as number) : prev.right,
          top: hasYSelection ? (prev.areaTop as number) : prev.top,
          bottom: hasYSelection ? (prev.areaBottom as number) : prev.bottom,
          areaLeft: undefined,
          areaRight: undefined,
          areaTop: undefined,
          areaBottom: undefined,
          start: false,
        };
      }

      // Clear selection if no valid zoom
      console.log("No valid zoom selection");
      return {
        ...prev,
        areaLeft: undefined,
        areaRight: undefined,
        areaTop: undefined,
        areaBottom: undefined,
        start: false,
      };
    });

    // Clear refs
    chartBoundsRef.current = null;
  }, [axisLock]);

  const zoomOut = useCallback(() => {
    console.log("Zoom out");
    setZoomState(initialZoomState);
  }, []);

  return {
    ...zoomState,
    onMouseUp,
    onMouseDown,
    onMouseMove,
    zoomOut,
  };
};
