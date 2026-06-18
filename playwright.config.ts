import { defineConfig, devices, type ReporterDescription } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const baseURL = "https://playwrightworkshops.com";
const runProfile = process.env.TEST_PROFILE ?? "smoke";
const environment = process.env.TEST_ENV ?? (process.env.CI ? "ci" : "local");

function profileGrep() {
  if (runProfile === "all") {
    return /.*/;
  }
  return /@smoke/;
}

function buildReporters(): ReporterDescription[] {
  const reporters: ReporterDescription[] = [["list"], ["html", { open: "never" }]];

  const endpoint = process.env.REPORT_PORTAL_ENDPOINT;
  const apiKey = process.env.REPORT_PORTAL_API_KEY;
  const project = process.env.REPORT_PORTAL_PROJECT;
  const launchPrefix = process.env.REPORT_PORTAL_LAUNCH ?? "playwright-workshops-checkout";
  const launch = `${launchPrefix}-${runProfile}-${new Date().toISOString().slice(0, 10)}`;

  if (endpoint && apiKey && project) {
    reporters.push([
      "@reportportal/agent-js-playwright",
      {
        endpoint,
        apiKey,
        project,
        launch,
        mode: "DEFAULT",
        attributes: [
          { key: "framework", value: "playwright" },
          { key: "suite", value: "checkout" },
          { key: "profile", value: runProfile },
          { key: "environment", value: environment },
          { key: "browser", value: "chromium" },
          { key: "node", value: process.version },
          { key: "os", value: process.platform },
          { key: "ci", value: String(!!process.env.CI) }
        ]
      }
    ]);
  }

  return reporters;
}

export default defineConfig({
  testDir: "./tests",
  timeout: 120_000,
  fullyParallel: runProfile !== "smoke",
  workers: process.env.CI ? 2 : 3,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? (runProfile === "smoke" ? 1 : 2) : 0,
  grep: profileGrep(),
  maxFailures: process.env.CI && runProfile === "smoke" ? 2 : undefined,
  outputDir: "test-results",
  reporter: buildReporters(),
  metadata: {
    environment,
    runProfile
  },
  use: {
    baseURL,
    headless: process.env.HEADLESS === "true" || process.env.HEADLESS === "1",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15_000
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
