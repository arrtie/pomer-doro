/** @format */

import Pomodoro from "./Pomodoro";
import { pipe } from "fp-ts/lib/function";
import Subject from "@src/patterns/Subject";

export type TimeManagerRequest = "start" | "stop" | "reset";

interface ITimeManagerState {
  elapsedTime: number;
  isPaused: boolean;
  remainingTime: number;
  isDone: boolean;
}

export class TimeEvent implements ITimeManagerState {
  elapsedTime: number;
  isPaused: boolean;
  remainingTime: number;
  isDone: boolean;

  constructor(state: Partial<ITimeManagerState>) {
    this.elapsedTime = state.elapsedTime ?? 0;
    this.isPaused = state.isPaused ?? true;
    this.remainingTime = state.remainingTime ?? Infinity;
    this.isDone = state.isDone ?? false;
  }
}

export default class TimeManagerSubject extends Subject<TimeEvent> {
  pom: Pomodoro;
  timerId: ReturnType<typeof setTimeout> | null = null;

  constructor(pom: Pomodoro) {
    super(
      new TimeEvent({
        isPaused: true,
        isDone: false,
        elapsedTime: 0,
        remainingTime: pom.durationInMs,
      })
    );
    this.pom = pom;
  }

  _clearInterval() {
    if (this.timerId != null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
  _onInterval() {
    pipe(this.safelyDeriveTime(), (state) => {
      if (state.isDone) {
        this._clearInterval();
        this.pom.addPauseTimeStamp();
      }
      this.setState(state);
    });
  }

  _start() {
    const state = this.getState();
    if (!state.isPaused || state.isDone) {
      console.warn("unable to start");
      return;
    }

    pipe(this.pom.addPlayTimeStamp());

    this.setState(this.safelyDeriveTime());

    this.timerId = setInterval(this._onInterval.bind(this), 1000);
  }

  _stop() {
    const stopState = this.getState();

    if (!stopState.isPaused && this.timerId) {
      this._clearInterval();
      this.pom.addPauseTimeStamp();

      this.setState({ ...stopState, isPaused: true });
    }
  }

  _reset() {
    this.pom = new Pomodoro({ durationInMin: this.pom.durationInMin });
    this._clearInterval();
    this.setState(new TimeEvent({ remainingTime: this.pom.durationInMs }));
  }

  request(reqType: TimeManagerRequest) {
    if (reqType === "start") {
      return () => this._start();
    }
    if (reqType === "reset") {
      return () => this._reset();
    }

    return () => this._stop();
  }

  getRecordedTime() {
    return this.pom.getTimestampTotal();
  }

  getAllElapsedTime() {
    return this.pom.getElapsedTime();
  }

  getDurationInMs() {
    return this.pom.getDurationInMs();
  }

  deriveElapsedAndRemainingTime() {
    const elapsedTime = Math.round(this.getAllElapsedTime() / 1000) * 1000;
    return {
      elapsedTime,
      remainingTime: this.getDurationInMs() - elapsedTime,
    };
  }

  safelyDeriveTime() {
    const maxElapsedTime = this.getDurationInMs();
    return pipe(this.deriveElapsedAndRemainingTime(), (derivedTime) => {
      if (derivedTime.elapsedTime >= maxElapsedTime) {
        return {
          elapsedTime: maxElapsedTime,
          remainingTime: 0,
          isPaused: true,
          isDone: true,
        };
      }
      return { ...derivedTime, isPaused: false, isDone: false };
    });
  }

  getTimestamps() {
    return this.pom.getTimestamps();
  }
}
