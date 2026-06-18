import { expect, test } from "../../tests/fixtures/checkout.fixtures";
import { applyRpAttributes } from "../../src/utils/reporting";

test("@smoke checkout rejects empty billing form", async ({ app, page }) => {
  applyRpAttributes({
    feature: "checkout",
    type: "negative",
    priority: "P0",
    risk: "high",
    area: "ecommerce",
    testCaseId: "checkout.place-order.empty-billing",
    description: "Clicking Place Order with empty billing fields surfaces WooCommerce required-field errors."
  });

  const productName = "Black Printed Coffee Mug";

  await test.step("Add a product so the cart is not empty", async () => {
    await app.flows.purchase.addProductToCart(productName);
  });

  await test.step("Proceed to checkout", async () => {
    await app.flows.purchase.goToCheckoutFromCart();
  });

  await test.step("Click Place Order without filling in any billing fields", async () => {
    await app.pages.checkout.placeOrderButton().click();
  });

  await test.step("Verify at least one required-field error is shown", async () => {
    const errors = app.pages.checkout.errorListItems();
    await expect(errors.first()).toBeVisible({ timeout: 15_000 });
    const count = await errors.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const messages = await errors.allInnerTexts();
    console.log(`Validation errors (${count}):\n - ${messages.join("\n - ")}`);

    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach("checkout-validation-errors", {
      body: screenshot,
      contentType: "image/png"
    });
  });
});
