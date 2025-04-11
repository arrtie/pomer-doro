/** @format */

import { afterEach, beforeEach, describe, expect, it, test, vi } from "vitest";
import TimeManager, {
  type TimeManagerRequest,
  TimeEvent,
} from "./TimeManagerSubject";
import Pomodoro from "./Pomodoro";
import Observer from "@src/patterns/Observer";

const TOTAL_POM_TIME = 1500000;

const makeTimeUpdate = (props?: Partial<TimeEvent>) => {
  return new TimeEvent({
    isPaused: true,
    remainingTime: TOTAL_POM_TIME,
    elapsedTime: 0,
    isDone: false,
    ...props,
  });
};

const setupTimeManager = (pom = new Pomodoro()) => {
  const expected: { value: undefined | TimeEvent } = {
    value: undefined,
  };
  const tm = new TimeManager(pom);
  tm.attach(
    new Observer((data) => {
      expected.value = data;
    })
  );
  return {
    tm,
    expected,
  };
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("#start", () => {
  describe("when called", () => {
    const date = Date.now();

    beforeEach(() => {
      vi.setSystemTime(date);
    });

    it("should emit starting data", async () => {
      const { tm, expected } = setupTimeManager();
      tm.request("start")();
      expect(expected.value).toEqual(
        makeTimeUpdate({
          isPaused: false,
          remainingTime: TOTAL_POM_TIME,
          elapsedTime: 0,
        })
      );
    });

    describe("when half the total Pomodoro time has elapsed", () => {
      it("should emit an event with elapsedTime of half the total time, remainingTime is half the total time, isPaused is false, isDone is undefined", async () => {
        const timeOffset = TOTAL_POM_TIME / 2;
        const { tm, expected } = setupTimeManager();
        tm.request("start")();
        vi.advanceTimersByTime(timeOffset);
        expect(expected.value).toEqual(
          makeTimeUpdate({
            isPaused: false,
            remainingTime: timeOffset,
            elapsedTime: timeOffset,
            isDone: undefined,
          })
        );
      });
    });

    describe("when the total Pomodoro time has elapsed", () => {
      it("should emit a final event with elapsedTime as the total time, remainingTime is 0, isPaused is true, isDone is true", async () => {
        const { tm, expected } = setupTimeManager();
        tm.request("start")();
        vi.advanceTimersByTime(TOTAL_POM_TIME);
        expect(expected.value).toEqual(
          makeTimeUpdate({
            isPaused: true,
            remainingTime: 0,
            elapsedTime: TOTAL_POM_TIME,
            isDone: true,
          })
        );
      });
    });

    describe("when more the total Pomodoro time has elapsed", () => {
      it("should emit a final event with elapsedTime as the total time, remainingTime is 0, isPaused is true, isDone is true", async () => {
        const timeOffset = TOTAL_POM_TIME + 5678;
        const { tm, expected } = setupTimeManager();
        const startRequest = tm.request("start");
        startRequest();
        vi.advanceTimersByTime(timeOffset);
        expect(expected.value).toEqual(
          makeTimeUpdate({
            isPaused: true,
            remainingTime: 0,
            elapsedTime: TOTAL_POM_TIME,
            isDone: true,
          })
        );
      });
    });
  });
});

describe("#stop", () => {
  const date = Date.now();

  beforeEach(() => {
    vi.setSystemTime(date);
  });

  it("should not emit data", async () => {
    const { tm, expected } = setupTimeManager();
    const stopRequest = tm.request("stop");
    stopRequest();
    expect(expected.value).toBeUndefined();
  });

  describe("when play is pressed then pause is pressed", () => {
    it("should emit data", async () => {
      const timeOffset = 10000;
      const { tm, expected } = setupTimeManager();
      tm.request("start")();
      vi.advanceTimersByTime(timeOffset);
      tm.request("stop")();
      expect(expected.value).toEqual(
        makeTimeUpdate({
          remainingTime: TOTAL_POM_TIME - timeOffset,
          elapsedTime: timeOffset,
        })
      );
    });
  });
});

describe("#reset", () => {
  const date = Date.now();

  beforeEach(() => {
    vi.setSystemTime(date);
  });

  describe("when reset is called", () => {
    it("should emit the default data", async () => {
      const { tm, expected } = setupTimeManager();
      tm.request("reset")();

      expect(expected.value).toEqual(makeTimeUpdate());
    });
  });

  describe("when play then reset is called", () => {
    it("should emit the default data", async () => {
      const timeOffset = 10000;
      const { tm, expected } = setupTimeManager();
      tm.request("start")();
      vi.advanceTimersByTime(timeOffset);
      tm.request("reset")();

      expect(expected.value).toEqual(makeTimeUpdate());
    });
  });
});

describe("when sequenced", () => {
  const date = Date.now();

  beforeEach(() => {
    vi.setSystemTime(date);
  });

  test("when start, pause, start, pause", async () => {
    const { tm, expected } = setupTimeManager();

    const requesters = {
      start: tm.request("start"),
      stop: tm.request("stop"),
      reset: tm.request("reset"),
    } satisfies Record<TimeManagerRequest, () => void>;

    (
      [
        { requestType: "start", delay: 0 },
        { requestType: "stop", delay: 10000 },
        { requestType: "start", delay: 0 },
        { requestType: "stop", delay: 30000 },
      ] as { requestType: TimeManagerRequest; delay: number }[]
    ).reduce((timePassed, { requestType, delay }) => {
      vi.advanceTimersByTime(delay);
      requesters[requestType]();
      expect(expected.value).toEqual(
        makeTimeUpdate({
          isPaused: requestType === "stop",
          elapsedTime: timePassed + delay,
          remainingTime: 25 * 60 * 1000 - timePassed - delay,
        })
      );
      return timePassed + delay;
    }, 0);
  });
});
