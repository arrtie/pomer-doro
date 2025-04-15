/** @format */

import Rectangle from "./Rectangle";
import formatTimeHHMM from "./formatTime";
import type { Viz } from "./Visualization";

interface IYAxis {
  viz: Viz;
  tickCount: number;
}

export default function YAxis({ viz, tickCount = 12 }: IYAxis) {
  const { width, height, y: contentY } = viz.contentArea;
  const { startTime, endTime } = viz.timeframe;
  const segmentCount = tickCount - 1;

  return Array(tickCount)
    .fill(null)
    .map((_, index) => {
      const isFirst = index === 0;
      const isLast = index === tickCount - 1;
      const tickY = (height / segmentCount) * index + contentY;
      const tickX = viz.x;
      const tickWidth = width / 100 + (index % 2) * 5;
      const tickHeight = 6;
      const label = isFirst
        ? formatTimeHHMM(new Date(startTime))
        : isLast
        ? formatTimeHHMM(new Date(endTime))
        : "";
      return (
        <g>
          <Rectangle
            x={tickX}
            y={tickY}
            width={tickWidth}
            height={tickHeight}
          />
          <text x={tickX + tickWidth + 4} y={tickY + tickHeight * 1.5}>
            {label.toString()}
          </text>
        </g>
      );
    });
}
