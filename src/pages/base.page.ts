import { type Locator, type Page } from "@playwright/test";

export abstract class BasePage {
  protected readonly page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }

  protected async open(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: "domcontentloaded" });
  }

  protected async waitForPath(pathFragment: string): Promise<void> {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/9f914c29-6b0a-45ab-9d1c-481613029d2d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        runId: "post-cleanup-debug",
        hypothesisId: "H6",
        location: "src/pages/base.page.ts:waitForPath:entry",
        message: "Start waitForPath",
        data: { pathFragment, currentUrl: this.page.url(), isClosed: this.page.isClosed() },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
    try {
      await this.page.waitForURL((url) => url.toString().includes(pathFragment), { timeout: 15_000 });
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/9f914c29-6b0a-45ab-9d1c-481613029d2d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          runId: "post-cleanup-debug",
          hypothesisId: "H6",
          location: "src/pages/base.page.ts:waitForPath:success",
          message: "waitForPath success",
          data: { pathFragment, currentUrl: this.page.url(), isClosed: this.page.isClosed() },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
    } catch (error) {
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/9f914c29-6b0a-45ab-9d1c-481613029d2d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          runId: "post-cleanup-debug",
          hypothesisId: "H6",
          location: "src/pages/base.page.ts:waitForPath:error",
          message: "waitForPath failed",
          data: {
            pathFragment,
            currentUrl: this.page.isClosed() ? "closed" : this.page.url(),
            isClosed: this.page.isClosed(),
            errorMessage: error instanceof Error ? error.message : "unknown"
          },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
      throw error;
    }
  }

  protected async waitForVisible(locator: Locator): Promise<void> {
    await locator.first().waitFor({ state: "visible", timeout: 15_000 });
  }

  protected fallbackLocator(primary: Locator, fallback: Locator): Locator {
    return primary.or(fallback).first();
  }
}
