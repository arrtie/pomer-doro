/** @format */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Pomodoro from "./Pomodoro";
import { none, match } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";

type TimestampEvent = {
  requestType: "start" | "stop";
  timeAdvanceBefore?: number;
  timeAdvanceAfter?: number;
};

function runSequence(pom: Pomodoro, requestSequence: TimestampEvent[]) {
  return requestSequence.reduce(
    (timePassed, { requestType, timeAdvanceBefore, timeAdvanceAfter }) => {
      if (timeAdvanceBefore != null) {
        vi.advanceTimersByTime(timeAdvanceBefore);
      }
      if (requestType === "start") {
        pom.addPlayTimeStamp();
      } else {
        pom.addPauseTimeStamp();
      }
      if (timeAdvanceAfter != null) {
        vi.advanceTimersByTime(timeAdvanceAfter);
      }
      return 0;
    },
    0
  );
}

const getSequenceTitle = (requestSequence: TimestampEvent[]) => {
  return requestSequence.map(({ requestType }) => requestType).join(", ");
};

const getExpected = (expected: number[]) => {
  return expected.join(", ");
};

beforeEach(() => {
  // tell vitest we use mocked time
  vi.useFakeTimers();
});

afterEach(() => {
  // restoring date after each test run
  vi.useRealTimers();
});

describe("#getDurationInMs", () => {
  describe("default time", () => {
    it("should be 1500000", async () => {
      const pom = new Pomodoro();
      expect(pom.getDurationInMs()).toEqual(1500000);
    });
  });

  describe("custom time", () => {
    const customDurationInMs = 2500000;
    const customDurationInMin = customDurationInMs / 60 / 1000;

    it(`should be ${customDurationInMs}`, async () => {
      const pom = new Pomodoro({ durationInMin: customDurationInMin });
      expect(pom.getDurationInMs()).toEqual(customDurationInMs);
    });
  });
});

describe("#getTimestamps", () => {
  const date = Date.now();

  beforeEach(() => {
    vi.setSystemTime(date);
  });

  describe("when empty", () => {
    it("should be an empty array", async () => {
      const pom = new Pomodoro();
      expect(pom.getTimestamps()).toEqual([]);
    });
  });

  interface TestableSequence {
    expected: number[];
    requestSequence: TimestampEvent[];
  }

  const testSequences: TestableSequence[] = [
    { requestSequence: [{ requestType: "stop" }], expected: [] },
    { requestSequence: [{ requestType: "start" }], expected: [date] },
    {
      requestSequence: [
        { requestType: "start", timeAdvanceAfter: 3333 },
        { requestType: "stop" },
      ],
      expected: [date, date + 3333],
    },
    {
      requestSequence: [
        { requestType: "start", timeAdvanceAfter: 3333 },
        { requestType: "stop" },
        { requestType: "start", timeAdvanceBefore: 6666 },
      ],
      expected: [date, date + 3333, date + 9999],
    },
    {
      requestSequence: [
        { requestType: "start", timeAdvanceAfter: 3333 },
        { requestType: "stop" },
        { requestType: "start", timeAdvanceBefore: 6666 },
        { requestType: "stop", timeAdvanceBefore: 10000 },
      ],
      expected: [date, date + 3333, date + 9999, date + 19999],
    },
  ];

  testSequences.forEach(({ requestSequence, expected }) => {
    describe(`when the request sequence is: ${getSequenceTitle(
      requestSequence
    )}`, () => {
      it(`should be ${getExpected(expected)}`, async () => {
        const pom = new Pomodoro();
        runSequence(pom, requestSequence);
        expect(pom.getTimestamps()).toEqual(expected);
      });
    });
  });
});

describe("#getTimestampTotal", () => {
  const date = Date.now();

  beforeEach(() => {
    vi.setSystemTime(date);
  });

  describe("when new", () => {
    it("should be 0", async () => {
      const pom = new Pomodoro();
      expect(pom.getTimestampTotal()).toEqual(0);
      expect(pom.timestamps).toEqual([]);
    });
  });

  describe("when addPlayStamp", () => {
    it("should be 0", async () => {
      const pom = new Pomodoro();
      pom.addPlayTimeStamp();
      expect(pom.getTimestampTotal()).toEqual(0);
      expect(pom.timestamps).toEqual([date]);
    });
  });

  describe("when stop, start, stop, start", () => {
    it("should be be the sum of the stop delays after the first start", async () => {
      const pom = new Pomodoro();
      [
        { requestType: "stop", delay: 10000 },
        { requestType: "start", delay: 10 },
        { requestType: "stop", delay: 30000 },
        { requestType: "start", delay: 0 },
      ].reduce((timePassed, { requestType, delay }) => {
        vi.advanceTimersByTime(delay);
        if (requestType === "start") {
          pom.addPlayTimeStamp();
        } else {
          pom.addPauseTimeStamp();
        }
        return timePassed + delay;
      }, 0);

      expect(pom.getTimestampTotal()).toEqual(30000);
    });
  });

  describe("when start, stop, start, stop", () => {
    it("should be be the sum of the delays", async () => {
      const pom = new Pomodoro();
      const elapsedTime = [
        { requestType: "start", delay: 0 },
        { requestType: "stop", delay: 10000 },
        { requestType: "start", delay: 0 },
        { requestType: "stop", delay: 30000 },
      ].reduce((timePassed, { requestType, delay }) => {
        vi.advanceTimersByTime(delay);
        if (requestType === "start") {
          pom.addPlayTimeStamp();
        } else {
          pom.addPauseTimeStamp();
        }
        return timePassed + delay;
      }, 0);

      expect(pom.getTimestampTotal()).toEqual(elapsedTime);
    });
  });
});

describe("#getTimeSinceLatestStart", () => {
  const date = Date.now();

  beforeEach(() => {
    vi.setSystemTime(date);
  });

  describe("when no starts", () => {
    it("should be 0", async () => {
      const pom = new Pomodoro();
      expect(pom.getTimeSinceLatestStart()).toEqual(none);
    });
  });

  describe("when started", () => {
    describe("and 30,000ms have elapsed", () => {
      it("should be 30,000", async () => {
        const pom = new Pomodoro();
        pom.addPlayTimeStamp();
        vi.advanceTimersByTime(30000);
        expect(
          pipe(
            pom.getTimeSinceLatestStart(),
            match(
              () => 0,
              (value) => value
            )
          )
        ).toEqual(30000);
      });
    });
  });
});
