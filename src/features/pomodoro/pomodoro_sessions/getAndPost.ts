/** @format */

import { none, some, type Option } from "fp-ts/lib/Option";
import { setArrayData, getAllRecords } from "./indexdb";
import {
  dbName,
  objectStoreName,
  type PomodoroSession,
} from "./typesAndConstants";

export async function getPomodoroSessions(): Promise<
  Option<PomodoroSession[]>
> {
  return getAllRecords(dbName, objectStoreName)
    .then((dbSessions) => {
      if (dbSessions?.length == 0) {
        return none;
      }
      const timestamps = dbSessions.map((dbSession) => dbSession.data);
      return some(timestamps);
    })
    .catch(() => {
      console.error("Error getting pomodoro sessions");
      return none;
    });
}

export async function postPomodoroSession(pomodoroSession: number[]) {
  if (pomodoroSession.length < 2) {
    console.error("Pomodoro session must have at least 2 timestamps");
    return false;
  }
  return setArrayData(
    dbName,
    objectStoreName,
    pomodoroSession[0].toString(),
    pomodoroSession
  )
    .then(() => {
      return true;
    })
    .catch((error: unknown) => {
      console.error("Error posting pomodoro sessions", error);
      return false;
    });
}
