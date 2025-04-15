/** @format */

export interface IRectangle {
  x: number | string;
  y: number | string;
  width: number | string;
  height: number | string;
}

export default function Rectangle(props: IRectangle) {
  return <rect {...props} />;
}
