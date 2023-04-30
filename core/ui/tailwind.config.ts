import { Config } from "tailwindcss";
import { colors } from "@srpg-engine/colors/colors";

import defaultTheme from "tailwindcss/lib/public/default-theme";

/**
 * This is not a complete config, but is intended to be extend
 * the tailwind config for the project it is being used in.
 */
export const config = {
  /**
   * Points to this project's source files via the npm dependency
   * for the project it is being used in.
   */
  content: [
    "index.html",
    "src/**/*.{js,ts}",
    "node_modules/@srpg-engine/ui/src/**/*.ts",
  ],

  /**
   * Extends the default tailwind colors with our own
   */
  theme: {
    colors: {
      ...defaultTheme.colors,
      ...colors,
    },
  },
} satisfies Config;
