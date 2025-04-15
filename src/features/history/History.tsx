/** @format */

import { useEffect, useState } from "react";
import Dumbbell from "./Dumbbell";
import Visualization from "./Visualization";
import YAxis from "./YAxis";

interface MakeDumbbell {
  x: number;
  y1: number;
  y2: number;
  radius: number;
}

function makeDumbbell(props: MakeDumbbell) {
  const { x, radius } = props;
  const halfRadius = radius / 2;
  const quarterRadius = halfRadius / 2;
  const startY = props.y1;
  const endY = props.y2;
  const spanLength = endY - startY;

  const dumbballStats = {
    startProps: { cx: x, cy: startY, r: radius, "aria-label": "100" },
    spanProps: {
      x: x - quarterRadius,
      y: startY,
      width: halfRadius,
      height: spanLength,
    },
    endProps: { cx: x, cy: endY, r: radius, "aria-label": "100" },
  };
  return dumbballStats;
}

function makeDumbbellFromSession(start: number, stop: number) {
  const width = 500;
  const height = 500;
  const timeFrameInMs = 12 * 60 * 60 * 1000;
  const startingTime = new Date().setHours(8, 0, 0, 0);
  const pxToTimeRatio = height / timeFrameInMs;
  const timeY1 = start - startingTime;
  const timeY2 = stop - startingTime;

  return makeDumbbell({
    x: width / 2,
    y1: timeY1 * pxToTimeRatio,
    y2: timeY2 * pxToTimeRatio,
    radius: 4,
  });
}

const containerProps = {
  width: 500,
  height: 500,
  padding: 8,
  x: 0,
  y: 0,
};

const timeframeProps = {
  msDuration: 12 * 60 * 60 * 1000,
  startTime: new Date().setHours(8, 0, 0, 0),
};

export default function History() {
  const [sessions, setSessions] = useState<number[][]>([]);
  useEffect(() => {
    // const localSession = JSON.parse(
    //   window.localStorage.getItem("sessions") ?? "[4, 1500004]"
    // );
    const now = Date.now();
    const refPoint = [now - 1500000, now];
    const before = refPoint.map((timestamp) => timestamp - 2500000);
    const beforeBefore = refPoint.map((timestamp) => timestamp - 5000000);
    setSessions([beforeBefore, before, refPoint]);
  }, []);

  return sessions.length === 0 ? (
    <p>Missing session data.</p>
  ) : (
    <Visualization
      containerProps={containerProps}
      timeframeProps={timeframeProps}
      renderChildren={(viz) => {
        return (
          <>
            <YAxis viz={viz} tickCount={12} />
            {sessions.map((session) => (
              <Dumbbell {...makeDumbbellFromSession(session[0], session[1])} />
            ))}
          </>
        );
      }}
    />
  );
}
