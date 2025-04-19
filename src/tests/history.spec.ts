/** @format */

import formatTimeHHMM from "@features/history/formatTime";
import { generateFakeSessions } from "@features/history/helpers";
import { test, expect, type Page } from "@playwright/test";

const SESSION_LENGTH = 1500000;
const NOW = Date.now();

function makeLocator(page: Page) {
  return async function getBubbleY(identifier: string) {
    return (await page.getByLabel(identifier).boundingBox())?.y || Infinity;
  };
}

function getBubble(identifier: string) {
  return (page: Page) => page.getByLabel(identifier);
}

test.describe("when there is no data", () => {
  test("should display the error view", async ({ page }) => {
    await page.goto("/pomer-doro/history");
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
    await page.goto("/pomer-doro/history");
    expect(page.getByRole("heading", { name: "History" }));
  });

  test.describe("and there is one contiguous session", () => {
    const sessions = generateFakeSessions(NOW);

    test.only("should display the start bubble higher than stop bubble", async ({
      page,
    }) => {
      await page.route("*/**/api/sessions.json", async (route) => {
        const json = sessions;
        await route.fulfill({ json });
      });
      await page.goto("/pomer-doro/history");
      const flatSessions = sessions.flat(1);
      const label1 = formatTimeHHMM(flatSessions[0]);
      const label2 = formatTimeHHMM(flatSessions[flatSessions.length - 1]);
      const startBubble = await getBubble(label1)(page).boundingBox();
      const stopBubble = await getBubble(label2)(page).boundingBox();
      expect(startBubble?.y).toBeLessThan(stopBubble?.y ?? -Infinity);
    });
  });

  test.skip("and there is one disjoint session", () => {
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

      await page.goto("/pomer-doro/history");
      const getBubbleY = makeLocator(page);
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

test.describe("and there is more than one disjoint session", () => {});
