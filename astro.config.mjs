/** @format */

// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  server: { host: true },
  site: "https://arrtie.github.io",
  base: "/pomer-doro",
  devToolbar: {
    enabled: false,
  },
});
