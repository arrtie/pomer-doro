/** @format */

import Observer from "@src/patterns/Observer";
import {
  postPomodoroSession,
  getPomodoroSessions as getPomodoroSessionsFromDB,
} from "./pomodoro_sessions/getAndPost";
import { getCurrentTimeManager } from "./TimeManagerHelper";
import type { TimeEvent } from "./TimeManagerSubject";
import { pipe } from "fp-ts/lib/function";
import { map } from "fp-ts/lib/Option";
import Subject from "@src/patterns/Subject";

const timeManager = getCurrentTimeManager();
const pomCountSubject = new Subject<number>(0);

export const subscribeToPomCount = (observer: Observer<number>) => {
  pomCountSubject.attach(observer);
  return () => {
    pomCountSubject.detach(observer);
  };
};

const getPomodoroSessions = async () => {
  return getPomodoroSessionsFromDB();
};

const onDone = async () => {
  const postResult = await postPomodoroSession(timeManager.getTimestamps());
  if (!postResult) {
    console.error("Error saving pomodoro session");
    return;
  }
  console.log("Pomodoro session saved successfully");
  handleGetPomodoroSessions();
};

const handleGetPomodoroSessions = async () => {
  const sessions = await getPomodoroSessions();
  pipe(
    sessions,
    map((sessions) => {
      console.log("Pomodoro sessions retrieved successfully", sessions);
      const pomCount = sessions.length;
      pomCountSubject.setState(pomCount);
    })
  );
};

handleGetPomodoroSessions();

const successObserver = new Observer<TimeEvent>((data) => {
  if (data.isDone) {
    onDone();
  }
});

timeManager.attach(successObserver);
