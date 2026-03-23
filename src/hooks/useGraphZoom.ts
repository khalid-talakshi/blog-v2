import { useState, useCallback } from "react";
import { type MouseHandlerDataParam } from "recharts";
import { type Trace } from "../types";

export type ZoomAndHighlightState = {
  left: string | number;
  right: string | number;
  refAreaLeft: string | number | undefined;
  refAreaRight: string | number | undefined;
  top: string | number;
  bottom: string | number;
  top2?: string | number;
  bottom2?: string | number;
  animation: boolean;
};

export const initialState: ZoomAndHighlightState = {
  left: "dataMin",
  right: "dataMax",
  refAreaLeft: undefined,
  refAreaRight: undefined,
  top: "dataMax + 0.25",
  bottom: "dataMin - 0.25",
  top2: "dataMax+20",
  bottom2: "dataMin-20",
  animation: true,
};

const getAxisYDomain = (
  from: ZoomAndHighlightState["refAreaLeft"],
  to: ZoomAndHighlightState["refAreaRight"],
  xref: string,
  yref: string,
  offset: number,
  traces: Trace[],
): (number | string)[] => {
  if (from != null && to != null) {
    const firstIndex = traces
      .map((trace) => trace.data.findIndex((d) => d[xref] === from))
      .filter((x) => x);
    const lastIndex = traces
      .map((trace) =>
        [...trace.data].reverse().findIndex((d) => d[xref] === to),
      )
      .filter((x) => x);

    console.log(firstIndex, lastIndex);

    const top = Math.min(
      traces.map((trace) =>
        Math.min(trace.data.slice(firstIndex, lastIndex).map((x) => x[yref])),
      ),
    );
    const bottom = Math.max(
      traces.map((trace) =>
        Math.max(trace.data.slice(firstIndex, lastIndex).map((x) => x[yref])),
      ),
    );

    return [(bottom | 0) - offset, (top | 0) + offset, from, to];
  }
  return [
    initialState.bottom,
    initialState.top,
    initialState.left,
    initialState.right,
  ];
};

export const useGraphZoom = (traces: Trace[]) => {
  const [zoomGraph, setZoomGraph] =
    useState<ZoomAndHighlightState>(initialState);

  const zoom = useCallback(() => {
    setZoomGraph((prev: ZoomAndHighlightState): ZoomAndHighlightState => {
      let { refAreaLeft, refAreaRight } = prev;

      if (refAreaLeft === refAreaRight || !refAreaRight) {
        return {
          ...prev,
          refAreaLeft: undefined,
          refAreaRight: undefined,
        };
      }

      if (refAreaLeft && refAreaRight && refAreaLeft > refAreaRight)
        [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

      const [bottom, top, left, right] = getAxisYDomain(
        refAreaLeft,
        refAreaRight,
        "distance",
        "speed",
        1,
        traces,
      );

      return {
        ...prev,
        refAreaLeft: undefined,
        refAreaRight: undefined,
        left: left ?? initialState.left,
        right: right ?? initialState.right,
        bottom,
        top,
      };
    });
  }, [setZoomGraph]);

  const zoomOut = useCallback(() => {
    setZoomGraph(initialState);
  }, [setZoomGraph]);

  const onMouseDown = useCallback(
    (e: MouseHandlerDataParam) => {
      setZoomGraph(
        (prev: ZoomAndHighlightState): ZoomAndHighlightState => ({
          ...prev,
          refAreaLeft: e.activeLabel || 0,
        }),
      );
    },
    [setZoomGraph],
  );

  const onMouseMove = useCallback(
    (e: MouseHandlerDataParam) => {
      setZoomGraph((prev) => {
        if (prev.refAreaLeft) {
          return { ...prev, refAreaRight: e.activeLabel || undefined };
        }
        return prev;
      });
    },
    [setZoomGraph],
  );

  return {
    ...zoomGraph,
    zoom,
    zoomOut,
    onMouseDown,
    onMouseMove,
  };
};
