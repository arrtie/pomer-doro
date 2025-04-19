/** @format */

import { useEffect, useState } from "react";
import Visualization from "./Visualization";
import YAxis from "./YAxis";
import DumbbellController from "./DumbbellController";
import getSessions from "./getSessions";
import { getFirstAndLast } from "./helpers";
const MIN_DURATION = 8 * 60 * 60 * 1000;

const containerProps = {
  width: 500,
  height: 500,
  padding: 8,
  x: 0,
  y: 0,
};

const timeframeProps = {
  msDuration: 24 * 60 * 60 * 1000,
  startTime: new Date().setHours(0, 0, 0, 0),
};

export default function History() {
  const [sessions, setSessions] = useState<number[][]>([]);
  const [timeframe, setTimeframe] = useState(timeframeProps);

  useEffect(() => {
    getSessions()
      .then((response) => response.json())
      .then((data) => {
        console.log("data: ", data);
        setSessions(data);
        const [first, last] = getFirstAndLast(data);
        if (first != null && last != null) {
          const duration = last - first;
          setTimeframe({
            startTime: first - 60 * 60 * 1000,
            msDuration: duration > MIN_DURATION ? duration : MIN_DURATION,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return sessions.length === 0 ? (
    <p>Missing session data.</p>
  ) : (
    <Visualization
      containerProps={containerProps}
      timeframeProps={timeframe}
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
