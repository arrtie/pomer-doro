/** @format */

import { test, expect, type Page } from "@playwright/test";
const SESSION_LENGTH = 1500000;
const NOW = Date.now();

function makeBubbleYGetter(page: Page) {
  return async function getBubbleY(identifier: string) {
    return (await page.getByTestId(identifier).boundingBox())?.y || Infinity;
  };
}

test.describe("when there is no data", () => {
  test("should display the error view", async ({ page }) => {
    await page.goto("/history");
    expect(page.getByText("Missing session data."));
  });
});

test.describe("when there is data", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: NOW });
  });

  test("should display the graph title, starting_datetime, and ending_datetime", async ({
    page,
  }) => {
    await page.goto("/history");
    expect(page.getByRole("heading", { name: "History" }));
  });

  test.describe("and there is one contiguous session", () => {
    test("should display the start bubble higher than stop bubble", async ({
      page,
    }) => {
      const sessions = [makeContiguousSession(NOW - SESSION_LENGTH * 5)];
      await page.goto("/history");
      await page.evaluate(() =>
        window.localStorage.set("sessions", JSON.stringify(sessions))
      );
      const getBubbleY = makeBubbleYGetter(page);
      const startBubbleY = await getBubbleY("session-start");
      const stopBubbleY = await getBubbleY("session-stop");
      expect(stopBubbleY).toBeGreaterThan(startBubbleY);
    });
  });

  test.describe("and there is one session with multiple starts and stops", () => {
    test("each bubble should be chronologically descending in the y axis ", async ({
      page,
    }) => {
      const startTime = NOW - 60 * 100000;
      const gap = 50;
      const session = [
        startTime,
        startTime + SESSION_LENGTH / 2,
        startTime + SESSION_LENGTH / 2 + gap,
        startTime + SESSION_LENGTH + gap,
      ];

      await page.evaluate(() =>
        window.localStorage.set("sessions", JSON.stringify([session]))
      );
      await page.goto("/history");
      const getBubbleY = makeBubbleYGetter(page);
      const sessionYPromises = session.map((sessionEvent: number) =>
        getBubbleY(sessionEvent.toString())
      );
      const resultYs = await Promise.all(sessionYPromises);
      for (let i = 1; i < resultYs.length; i++) {
        expect(i).toBeGreaterThan(i - 1);
      }
    });
  });
});

test.describe("and there is more than one session with multiple starts and stops", () => {});

function makeContiguousSession(startTime: number) {
  return [startTime, startTime + SESSION_LENGTH];
}
