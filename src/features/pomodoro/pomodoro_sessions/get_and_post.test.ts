/** @format */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPomodoroSessions, postPomodoroSession } from "./getAndPost";
import { none, some } from "fp-ts/lib/Option";
import type { PomodoroSession } from "./typesAndConstants";
import { setArrayData, getAllRecords } from "./indexdb";

vi.mock("./indexdb", () => ({
  setArrayData: vi.fn(() => Promise.resolve(true)),
  getAllRecords: vi.fn(() => Promise.resolve([])),
}));

const mockedSetArrayData = vi.mocked(setArrayData);
const mockedGetAllRecords = vi.mocked(getAllRecords);

function makePomodoroSession(): PomodoroSession {
  const someTime = Date.now();
  return [someTime, someTime + 1500000];
}

describe("postPomodoroSession", () => {
  describe("when the user posts an invalid pomodoro session", () => {
    describe("and it's an empty array", () => {
      const pomodoroSession: number[] = [];

      it("should return Promise<false>", async () => {
        const result = await postPomodoroSession(pomodoroSession);
        expect(result).toEqual(false);
      });
    });

    describe("and it's an array with only one element", () => {
      const pomodoroSession: number[] = [Date.now()];

      it("should return Promise<false>", async () => {
        const result = await postPomodoroSession(pomodoroSession);
        expect(result).toEqual(false);
      });
    });
  });

  describe("when the user posts a valid pomodoro session", () => {
    const pomodoroSession = makePomodoroSession();

    describe("and it's successful", () => {
      it("should return Promise<true>", async () => {
        const result = await postPomodoroSession(pomodoroSession);
        expect(result).toEqual(true);
      });
    });

    describe("and it fails", () => {
      beforeEach(() => {
        mockedSetArrayData.mockImplementation(() => {
          return Promise.reject(new Error("Error posting pomodoro session"));
        });
      });

      it("should return Promise<false>", async () => {
        const result = await postPomodoroSession(pomodoroSession);
        expect(result).toEqual(false);
      });
    });
  });
});

describe("getPomodoroSessions", () => {
  describe("when the user has no pomodoro sessions", () => {
    it("should return none", async () => {
      const result = await getPomodoroSessions();
      expect(result).toEqual(none);
    });
  });

  describe("when the user has a pomodoro session", () => {
    const pomodoroSession = makePomodoroSession();
    const pomRecord = {
      id: pomodoroSession[0].toString(),
      data: pomodoroSession,
      created_at: Date.now(),
    };

    beforeEach(() => {
      mockedGetAllRecords.mockImplementation(async () => {
        return [pomRecord];
      });
    });

    it("should return Some array of pomodoro sessions", async () => {
      const result = await getPomodoroSessions();

      expect(result).toEqual(some([pomRecord.data]));
    });
  });
});
