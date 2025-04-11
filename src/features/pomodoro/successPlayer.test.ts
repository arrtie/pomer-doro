/** @format */

import { describe, expect, it } from "vitest";
import SuccessPlayer, { type PlayerEvent } from "./successPlayer";

const setupSuccessPlayer = (PublisherType: typeof SuccessPlayer) => {
  const expected: { value: undefined | PlayerEvent } = {
    value: undefined,
  };
  const pub = new PublisherType("tada");
  pub.subscribe((data: PlayerEvent) => {
    expected.value = data;
  });

  return {
    pub,
    expected,
  };
};

describe("#requestPlay", () => {
  describe("when called", () => {
    it("should emit play event", async () => {
      const { pub, expected } = setupSuccessPlayer(SuccessPlayer);
      const playRequest = pub.request("play");
      playRequest();
      expect(expected.value).toEqual({
        event: "play",
      });
    });
  });
});

describe("#requestPause", () => {
  describe("when called", () => {
    it("should emit pause event", async () => {
      const { pub, expected } = setupSuccessPlayer(SuccessPlayer);
      const pauseRequest = pub.request("pause");
      pauseRequest();
      expect(expected.value).toEqual({
        event: "pause",
      });
    });
  });
});
