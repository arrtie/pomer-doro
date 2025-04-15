/** @format */

import Circle, { type ICircle } from "./Circle";
import Rectangle, { type IRectangle } from "./Rectangle";

interface IDumbbell {
  startProps: ICircle;
  spanProps: IRectangle;
  endProps: ICircle;
}

export default function Dumbbell({
  startProps,
  spanProps,
  endProps,
}: IDumbbell) {
  return (
    <g>
      <Circle {...startProps} />
      <Rectangle {...spanProps} />
      <Circle {...endProps} />
    </g>
  );
}
