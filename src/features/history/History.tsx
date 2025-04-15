/** @format */

import { useEffect, useState } from "react";
import { styled } from "styled-components";
import Dumbbell from "./Dumbbell";

const Visualization = styled.svg`
  height: 100%;
  width: 100%;
  background: pink;
`;

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

function makeDumbbellFromSession(startTime?: number, endTime?: number) {
  return makeDumbbell({ x: 50, y1: 100, y2: 200, radius: 8 });
}

export default function History() {
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    const localSession = JSON.parse(
      window.localStorage.getItem("sessions") ?? "[4, 1500004]"
    );
    setSessions(localSession);
  }, []);

  return sessions.length === 0 ? (
    <p>Missing session data.</p>
  ) : (
    <Visualization>
      {sessions.map(() => (
        <Dumbbell {...makeDumbbellFromSession()} />
      ))}
    </Visualization>
  );
}
