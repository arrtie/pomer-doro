/** @format */

import { useEffect, useState } from "react";
import Visualization from "./Visualization";
import YAxis from "./YAxis";
import DumbbellController from "./DumbbellController";

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
    const now = new Date().setHours(13, 0, 0, 0);
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
            <YAxis viz={viz} tickCount={3} />
            {sessions.map((session) => (
              <DumbbellController viz={viz} session={session} />
            ))}
          </>
        );
      }}
    />
  );
}
