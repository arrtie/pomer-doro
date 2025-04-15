/** @format */

import Rectangle from "./Rectangle";
import formatTimeHHMM from "./formatTime";
import type { Viz } from "./Visualization";

interface IYAxis {
  viz: Viz;
  tickCount: number;
}

interface ITick {
  label?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

function Tick({ x, y, height, width, label }: ITick) {
  return (
    <g>
      {label == null ? null : (
        <text x={x + width + 4} y={y + height * 1.5}>
          {label.toString()}
        </text>
      )}
      <Rectangle x={x} y={y} width={width} height={height} />
    </g>
  );
}

function shouldBeLong(i: number, last: number) {
  return i !== 0 && i !== last && i % 2 === 0;
}

export default function YAxis({ viz, tickCount = 12 }: IYAxis) {
  const { width, height, y: contentY } = viz.contentArea;
  const { startTime, endTime } = viz.timeframe;
  const segmentCount = tickCount - 1;
  const tickX = viz.x;
  const tickHeight = 3;

  return Array(tickCount)
    .fill(null)
    .map((_, index) => {
      const isFirst = index === 0;
      const isLast = index === tickCount - 1;
      const tickY = (height / segmentCount) * index + contentY;
      const tickWidth = shouldBeLong(index, tickCount - 1)
        ? viz.width
        : width / 100 + (index % 2) * 5;
      const label = isFirst
        ? formatTimeHHMM(startTime)
        : isLast
        ? formatTimeHHMM(endTime)
        : undefined;
      return (
        <Tick
          key={tickY}
          x={tickX}
          y={tickY}
          width={tickWidth}
          height={tickHeight}
          label={label}
        />
      );
    });
}
