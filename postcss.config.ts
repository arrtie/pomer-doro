/** @format */
import type { ProcessOptions } from "./node_modules/postcss/lib/postcss.d.ts";

module.exports = (
  ctx: ProcessOptions & { env: "production" | "development" }
) => ({
  parser: ctx.parser ? "sugarss" : false,
  map: ctx.env === "development" ? ctx.map : false,
  plugins: {
    autoprefixer: {},
  },
});
