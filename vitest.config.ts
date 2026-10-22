import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      browser: {
        enabled: true,
        headless: true,
        viewport: { width: 1280, height: 900 },
        provider: playwright(),
        instances: [{ browser: "chromium" }],
      },
    },
  }),
);
