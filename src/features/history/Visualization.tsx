/** @format */

import { styled } from "styled-components";
import type { ReactNode } from "react";

const Container = styled.svg`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background: pink;
`;

interface IBoundedBox {
  width: number;
  height: number;
  padding: number;
  x: number;
  y: number;
}

class BoundedBox implements IBoundedBox {
  width: number;
  height: number;
  padding: number;
  x: number;
  y: number;

  constructor(props: Partial<IBoundedBox>) {
    this.width = props.width ?? 0;
    this.height = props.height ?? 0;
    this.padding = props.padding ?? 0;
    this.x = props.x ?? 0;
    this.y = props.y ?? 0;
  }
}

class ContentArea extends BoundedBox {
  constructor(props: Partial<IBoundedBox> & { width: number; height: number }) {
    const { height, width, padding = 10, x = 0, y = 0 } = props;
    const newProps = {
      padding,
      x: x + padding,
      y: y + padding,
      height: height - 2 * padding,
      width: width - 2 * padding,
    };
    super(newProps);
  }
}

interface ITimeframe {
  startTime: number;
  msDuration: number;
}

class Timeframe {
  startTime: number;
  msDuration: number;
  endTime: number;

  constructor(props: ITimeframe) {
    this.startTime = props.startTime;
    this.msDuration = props.msDuration;
    this.endTime = props.startTime + props.msDuration;
  }
}

export class Viz extends BoundedBox {
  contentArea: ContentArea;
  timeframe: Timeframe;
  msToPxRatio: number;

  constructor(boxProps: IBoundedBox, timeframeProps: ITimeframe) {
    super(boxProps);
    this.contentArea = new ContentArea(boxProps);
    this.timeframe = new Timeframe(timeframeProps);
    this.msToPxRatio = this.contentArea.height / this.timeframe.msDuration;
  }
}

interface IVisualization {
  containerProps: IBoundedBox;
  timeframeProps: ITimeframe;
  renderChildren: (viz: Viz) => ReactNode;
}

export default function Visualization({
  containerProps,
  timeframeProps,
  renderChildren,
}: IVisualization) {
  const thisViz = new Viz(containerProps, timeframeProps);

  return (
    <Container width={thisViz.width} height={thisViz.height}>
      {renderChildren(thisViz)}
    </Container>
  );
}
