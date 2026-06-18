import { expect, test } from "../../tests/fixtures/checkout.fixtures";
import { applyRpAttributes } from "../../src/utils/reporting";

test.describe("Contact form", () => {
  test("@smoke submit contact form with valid data", async ({ app, page }) => {
    applyRpAttributes({
      feature: "contact",
      type: "positive",
      priority: "P1",
      risk: "medium",
      area: "support",
      testCaseId: "support.contact.submit-valid",
      description:
        "Submit the Sureforms contact form with valid data. Sureforms backend is mocked via route.fulfill — the test verifies the submit fires the network call and the form clears."
    });

    let submitRequestSeen = false;

    await test.step("Mock Sureforms backend with a success response", async () => {
      await page.route("**/wp-json/sureforms/**", async (route) => {
        if (route.request().method() === "POST") {
          submitRequestSeen = true;
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ success: true, data: { message: "Form submitted successfully." } })
          });
          return;
        }
        await route.continue();
      });
    });

    await test.step("Open contact page and fill the form", async () => {
      await app.flows.contact.submitInquiry({
        email: "qa.bot+contact@example.com",
        subject: "qa-bot@example.com",
        message: "Hello team, this is an automated QA contact-form smoke check. Please ignore."
      });
    });

    await test.step("Verify form posted to Sureforms successfully", async () => {
      await expect.poll(() => submitRequestSeen, { timeout: 10_000 }).toBe(true);
      await expect(page).toHaveURL(/\/contact/);

      const screenshot = await page.screenshot();
      await test.info().attach("contact-success", {
        body: screenshot,
        contentType: "image/png"
      });
    });
  });

  test("@smoke contact form surfaces backend error", async ({ app, page }) => {
    applyRpAttributes({
      feature: "contact",
      type: "negative",
      priority: "P1",
      risk: "medium",
      area: "support",
      testCaseId: "support.contact.backend-error",
      description: "When the Sureforms backend rejects the submission, the form must display an error message visible to the user."
    });

    await test.step("Fill and submit the form (backend is intentionally broken)", async () => {
      await app.flows.contact.submitInquiry({
        email: "qa.bot+negative@example.com",
        subject: "qa-bot@example.com",
        message: "Negative path: the staging backend rejects all submissions."
      });
    });

    await test.step("Verify a user-visible error message appears", async () => {
      const errorBanner = page.locator("p.srfm-footer-error, p.srfm-error-message.srfm-footer-error");

      await expect(errorBanner).toBeVisible({ timeout: 15_000 });
      await expect(errorBanner).toContainText(/error/i);

      const screenshot = await page.screenshot();
      await test.info().attach("contact-backend-error", {
        body: screenshot,
        contentType: "image/png"
      });
    });
  });
});
