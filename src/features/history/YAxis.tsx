/** @format */

import Rectangle from "./Rectangle";
import type { Viz } from "./Visualization";

interface IYAxis {
  viz: Viz;
  tickCount: number;
}
export default function YAxis({ viz, tickCount = 12 }: IYAxis) {
  const { width, height } = viz;

  return Array(tickCount)
    .fill(null)
    .map((_, index) => (
      <Rectangle
        x="0"
        y={(height / tickCount) * (index + 1)}
        width={width / 100 + (index % 2) * 5}
        height="5"
      />
    ));
}
