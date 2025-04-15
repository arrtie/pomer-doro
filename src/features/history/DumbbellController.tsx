/** @format */

import type { Viz } from "./Visualization";
import Dumbbell from "./Dumbbell";
import formatTimeHHMM from "./formatTime";

interface IDumbbell {
  x: number;
  y1: number;
  y2: number;
  radius: number;
  label1: string;
  label2: string;
}

function makeDumbbell(props: IDumbbell) {
  const { x, radius, label1, label2 } = props;
  const halfRadius = radius / 2;
  const quarterRadius = halfRadius / 2;
  const startY = props.y1;
  const endY = props.y2;
  const spanLength = endY - startY;

  const dumbballStats = {
    startProps: { cx: x, cy: startY, r: radius, "aria-label": label1 },
    spanProps: {
      x: x - quarterRadius,
      y: startY,
      width: halfRadius,
      height: spanLength,
    },
    endProps: { cx: x, cy: endY, r: radius, "aria-label": label2 },
  };
  return dumbballStats;
}

function makeDumbbellFromSession(viz: Viz, startAndStop: number[]) {
  const startTime = viz.timeframe.startTime;
  const { width } = viz.contentArea;
  const msToPxRatio = viz.msToPxRatio;
  const [start, stop] = startAndStop;
  const timeY1 = start - startTime;
  const timeY2 = stop - startTime;

  return makeDumbbell({
    x: width / 2,
    y1: timeY1 * msToPxRatio,
    y2: timeY2 * msToPxRatio,
    radius: 4,
    label1: formatTimeHHMM(timeY1),
    label2: formatTimeHHMM(timeY2),
  });
}
interface IDumbbellController {
  viz: Viz;
  session: number[];
}
export default function DumbbellController({
  viz,
  session,
}: IDumbbellController) {
  const { startProps, spanProps, endProps } = makeDumbbellFromSession(
    viz,
    session
  );
  return (
    <Dumbbell
      startProps={startProps}
      spanProps={spanProps}
      endProps={endProps}
    />
  );
}
