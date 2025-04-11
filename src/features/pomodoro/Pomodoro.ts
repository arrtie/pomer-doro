/** @format */

import { pipe } from "fp-ts/lib/function";
import { type Option, map, some, none, fold } from "fp-ts/lib/Option";

type Timestamp = number;

export default class Pomodoro {
  static TOTAL_TIME_IN_MIN = 25; // 25 minutes in milliseconds
  timestamps: Timestamp[] = [];
  durationInMin: number = Pomodoro.TOTAL_TIME_IN_MIN;
  durationInMs: number = Pomodoro.TOTAL_TIME_IN_MIN * 60 * 1000;

  constructor(options?: { durationInMin: number }) {
    if (options?.durationInMin != null) {
      this.durationInMin = options.durationInMin;
      this.durationInMs = options.durationInMin * 60 * 1000;
    }
  }

  getDurationInMs() {
    return this.durationInMs;
  }

  getTimestamps() {
    return this.timestamps;
  }
  // return the last timestamp if the length of timestamps is odd
  getLatestStart() {
    return this.timestamps.length % 2 !== 0
      ? this.timestamps.at(-1)
      : undefined;
  }

  getNow() {
    return Date.now();
  }

  getTimeSinceLatestStart() {
    return pipe(
      this.getLatestStart(),
      (latestStart) => (latestStart === undefined ? none : some(latestStart)),
      map((latestStart) => this.getNow() - latestStart)
    );
  }

  getTimestampTotal(): number {
    return this.timestamps.reduce(
      ({ total, lastStart }, timestamp) => {
        if (lastStart === undefined) {
          return { total, lastStart: timestamp };
        }
        return {
          total: total + (timestamp - lastStart),
          lastStart: undefined,
        };
      },
      { total: 0, lastStart: undefined } as {
        total: number;
        lastStart: undefined | number;
      }
    ).total;
  }
  // sum of timestamps and the time since the last start
  getElapsedTime(): number {
    return pipe(
      this.getTimeSinceLatestStart(),
      fold(
        () => 0,
        (timeSinceLatestStart) => timeSinceLatestStart
      ),
      (timeSinceLatestStart) => timeSinceLatestStart + this.getTimestampTotal()
    );
  }

  getRemainingTime() {
    return pipe(
      this.getTimeSinceLatestStart(),
      fold(
        () => 0,
        (timeSinceLatestStart) => timeSinceLatestStart
      ),
      (timeSinceLatestStart) =>
        this.getDurationInMs() -
        (timeSinceLatestStart + this.getTimestampTotal())
    );
  }

  addPlayTimeStamp(): Option<Timestamp> {
    return this.addTimeStamp("play");
  }

  addPauseTimeStamp(): Option<Timestamp> {
    return this.addTimeStamp("pause");
  }

  addTimeStamp(timeType: "pause" | "play"): Option<Timestamp> {
    return pipe(
      this.timestamps.length % 2 === 0 ? "play" : "pause",
      (allowedType) => {
        return allowedType === timeType ? some(this.getNow()) : none;
      },
      map((newTimestamp) => this.timestamps.push(newTimestamp))
    );
  }
}
