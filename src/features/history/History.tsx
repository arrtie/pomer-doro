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

const generateFakeSessions = () => {
  const now = new Date().setHours(13, 0, 0, 0);
  const refPoint = [now - 1500000, now];
  const before = refPoint.map((timestamp) => timestamp - 2500000);
  const beforeBefore = refPoint.map((timestamp) => timestamp - 5000000);
  return [beforeBefore, before, refPoint];
};

export default function History() {
  const [sessions, setSessions] = useState<number[][]>([]);
  useEffect(() => {
    const localSessions = JSON.parse(
      window.localStorage.getItem("sessions") ??
        JSON.stringify(generateFakeSessions())
    );

    setSessions(localSessions);
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
            <YAxis viz={viz} tickCount={5} />
            {sessions.map((session) => (
              <DumbbellController
                key={session[0]}
                viz={viz}
                session={session}
              />
            ))}
          </>
        );
      }}
    />
  );
}
