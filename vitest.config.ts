/** @format */

/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    globals: true,
    include: ["**/*.test.?(c|m)[jt]s?(x)"],
  },
});
