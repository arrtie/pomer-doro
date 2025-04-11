/** @format */

import TimeManagerSubject from "./TimeManagerSubject";
import Pomodoro from "./Pomodoro";

let currentManager: undefined | TimeManagerSubject = undefined;

export function getCurrentTimeManager() {
  if (currentManager) {
    return currentManager;
  }
  currentManager = new TimeManagerSubject(new Pomodoro());
  return currentManager;
}
