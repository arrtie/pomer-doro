/** @format */

import { test, expect } from "@playwright/test";

test.describe("when the user prefers dark mode", () => {
  test.use({ colorScheme: "dark" });

  test("the background color should be black", async ({ page }) => {
    await page.goto("/pomer-doro");
    await expect(page.locator("html")).toHaveAttribute(
      "data-color-scheme",
      "dark"
    );
    await expect(page.locator("html")).toHaveCSS(
      "background-color",
      "rgb(21, 27, 35)"
    );
  });
});

test.describe("when the user prefers light mode", () => {
  test.use({ colorScheme: "light" });

  test("the background color should be white", async ({ page }) => {
    await page.goto("/pomer-doro");
    await expect(page.locator("html")).toHaveAttribute(
      "data-color-scheme",
      "light"
    );
    await expect(page.locator("html")).toHaveCSS(
      "background-color",
      "rgb(250, 250, 250)"
    );
  });
});
