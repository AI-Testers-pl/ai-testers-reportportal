import { expect, test } from "../../tests/fixtures/checkout.fixtures";
import { applyRpAttributes } from "../../src/utils/reporting";

test.use({ video: "on", trace: "on", screenshot: "on" });

test.describe("Product reviews", () => {
  const productSlug = "black-printed-coffee-mug";

  test("@smoke submit product review with valid data", async ({ app, page }) => {
    applyRpAttributes({
      feature: "review",
      type: "positive",
      priority: "P2",
      risk: "low",
      area: "social-proof",
      testCaseId: "social.review.submit-valid",
      description: "Submit a 4-star product review with author + email + comment."
    });

    const author = `QA Bot ${Date.now()}`;

    await test.step("Open product page", async () => {
      await app.pages.product.goto(productSlug);
      const before = await page.screenshot();
      await test.info().attach("review-before-submit", { body: before, contentType: "image/png" });
    });

    await test.step("Fill review with rating + comment + author + email", async () => {
      await app.flows.review.submitReview(productSlug, {
        rating: 4,
        comment: "Solid mug — sturdy, dishwasher safe, print holds up. Automated QA review.",
        author,
        email: "qa.bot+review@example.com"
      });
    });

    await test.step("Verify review entered the moderation queue", async () => {
      const awaitingApproval = page.getByText(/awaiting approval|awaiting moderation/i).first();
      await expect(awaitingApproval).toBeVisible({ timeout: 15_000 });

      const after = await page.screenshot();
      await test.info().attach("review-after-submit", { body: after, contentType: "image/png" });
    });
  });

  test("@smoke product review rejects missing author and email", async ({ app, page }) => {
    applyRpAttributes({
      feature: "review",
      type: "negative",
      priority: "P2",
      risk: "low",
      area: "social-proof",
      testCaseId: "social.review.missing-required",
      description: "Submitting a review without author/email must surface a WooCommerce error."
    });

    await test.step("Open product page", async () => {
      await app.pages.product.goto(productSlug);
    });

    await test.step("Fill only rating + comment, skip author/email", async () => {
      await app.pages.product.reviews.fillReview({
        rating: 3,
        comment: "Missing required fields test."
      });
      await app.pages.product.reviews.submit();
    });

    await test.step("Verify validation error or browser blocked submit", async () => {
      const validationError = app.pages.product.reviews.validationError();
      const invalidAuthor = page.locator("#author:invalid").first();
      const invalidEmail = page.locator("#email:invalid").first();

      const errorVisible = await validationError.isVisible().catch(() => false);
      const authorInvalid = await invalidAuthor.count() > 0;
      const emailInvalid = await invalidEmail.count() > 0;

      expect(errorVisible || authorInvalid || emailInvalid).toBe(true);

      const screenshot = await page.screenshot();
      await test.info().attach("review-validation", { body: screenshot, contentType: "image/png" });
    });
  });
});
