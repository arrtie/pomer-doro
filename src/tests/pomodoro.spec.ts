/** @format */

import { test, expect, type Page } from "@playwright/test";

test.describe("when initially loaded", () => {
  test("before start", async ({ page }) => {
    await page.goto("/pomer-doro");
    await expect(page.getByTestId("remaining-time")).toHaveText("25:00");
  });

  test.describe("when has no pom history", () => {
    test("should have nothing displayed", async ({ page }) => {
      await page.goto("/pomer-doro");
      await expect(
        page.locator("data-testid=['pomodoro-session-count']")
      ).toHaveCount(0);
    });
  });
  // todo: add test for pom history != 0
});

test.describe("when start is clicked", () => {
  [
    { elapsedMinutes: "05:00", expected: "20:00" },
    { elapsedMinutes: "10:00", expected: "15:00" },
    { elapsedMinutes: "20:00", expected: "05:00" },
    { elapsedMinutes: "24:59", expected: "00:01" },
  ].forEach(({ elapsedMinutes, expected }) => {
    test.beforeEach(async ({ page }) => {
      await page.clock.install();
      await page.goto("/pomer-doro");
      await expect(page.getByTestId("remaining-time")).toHaveText("25:00");
      await page.getByRole("button", { name: "Start" }).click();
    });

    test.describe(`and ${elapsedMinutes} have elapsed`, () => {
      test(`the remaining time displayed should be ${expected}`, async ({
        page,
      }) => {
        await page.clock.fastForward(elapsedMinutes);
        await expect(page.getByTestId("remaining-time")).toHaveText(expected);
      });
    });
  });

  [
    { elapsedMinutes: "05:00", expected: "20:00" },
    { elapsedMinutes: "10:00", expected: "15:00" },
    { elapsedMinutes: "20:00", expected: "05:00" },
  ].forEach(({ elapsedMinutes, expected }) => {
    test.beforeEach(async ({ page }) => {
      await page.clock.install();
    });

    test.describe(`and ${elapsedMinutes} have elapsed`, () => {
      test.describe("and pause is clicked", () => {
        test(`the remaining time displayed should be ${expected}`, async ({
          page,
        }) => {
          await page.goto("/pomer-doro");
          await expect(page.getByTestId("remaining-time")).toHaveText("25:00");
          await page.getByRole("button", { name: "Start" }).click();
          await page.clock.fastForward(elapsedMinutes);
          await page.getByRole("button", { name: "Pause" }).click();
          await expect(page.getByTestId("remaining-time")).toHaveText(expected);
        });
      });
    });
  });

  test.describe("when the duration time has elapsed", () => {
    const startAndExhaust = async (page: Page) => {
      await page.clock.install();
      await page.goto("/pomer-doro");
      const startButton = page.getByRole("button", { name: "Start" });
      await startButton.click();
      await page.clock.fastForward("25:00");
    };

    test("should display the finished state with updated Pom Count", async ({
      page,
    }) => {
      await startAndExhaust(page);
      const resetButton = page.getByRole("button", { name: "Reset" });
      await expect(resetButton).toBeVisible();
      await expect(resetButton).toBeEnabled();
      await expect(page.getByRole("button", { name: "Pause" })).toBeDisabled();
      await expect(page.getByRole("button", { name: "Start" })).toBeDisabled();
      await expect(page.getByTestId("pomodoro-session-count")).toHaveText(
        "Poms completed: 1"
      );
    });

    test.describe("when the reset button is clicked", () => {
      test("should display the starting state", async ({ page }) => {
        await startAndExhaust(page);
        const resetButton = page.getByRole("button", { name: "Reset" });
        await expect(resetButton).toBeVisible();
        await resetButton.click();
        await expect(page.getByTestId("remaining-time")).toHaveText("25:00");
        await expect(resetButton).toBeDisabled();
        await expect(
          page.getByRole("button", { name: "Pause" })
        ).toBeDisabled();
        await expect(page.getByRole("button", { name: "Start" })).toBeEnabled();
      });
    });
  });
});
