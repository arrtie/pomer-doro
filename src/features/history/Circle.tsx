/** @format */

import { styled } from "styled-components";

export interface ICircle {
  cx: number | string;
  cy: number | string;
  r: number | string;
  "aria-label": string;
}

const Bubble = styled.circle``;

export default function Circle(props: ICircle) {
  return <Bubble {...props} tabIndex={0} />;
}
