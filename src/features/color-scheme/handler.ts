/** @format */

import { pipe } from "fp-ts/lib/function";
import { flatMap, map, none, some } from "fp-ts/lib/Option";

const testColorSchemeMatch = (colorScheme: "dark" | "light") => {
  return window.matchMedia(`(prefers-color-scheme: ${colorScheme})`).matches;
};

const getHTMLElement = () => document.querySelector("html");

export const queryColorSchemePreference = () => {
  return pipe(
    getHTMLElement(),
    (htmlEl) => (htmlEl == null ? none : some(htmlEl)),
    flatMap((htmlEl) =>
      htmlEl.dataset["colorScheme"] == null ? some(htmlEl) : none
    ),
    map((htmlEl) => {
      return () => {
        htmlEl.dataset["colorScheme"] = testColorSchemeMatch("light")
          ? "light"
          : "dark";
      };
    })
  );
};

export const themeSetter = () => {
  pipe(
    queryColorSchemePreference(),
    map((setter) => {
      setter();
    })
  );
};

export default themeSetter;
