import { expect, test } from "../../tests/fixtures/checkout.fixtures";
import { applyRpAttributes } from "../../src/utils/reporting";

test.use({ trace: "on", screenshot: "on" });

test("@smoke add product to cart and verify subtotal", async ({ app, page }) => {
  applyRpAttributes({
    feature: "cart",
    type: "positive",
    priority: "P0",
    risk: "high",
    area: "ecommerce",
    testCaseId: "checkout.cart.add-product",
    description: "Add a single product to the cart and verify quantity + subtotal."
  });

  const productName = "Black Printed Coffee Mug";

  await test.step("Navigate to shop and add product to cart", async () => {
    console.log(`Adding product "${productName}" to cart`);
    await app.flows.purchase.addProductToCart(productName);
    console.log("Product added to cart, cart page loaded");

    const screenshot = await page.screenshot();
    await test.info().attach("cart-after-adding-product", {
      body: screenshot,
      contentType: "image/png"
    });
  });

  await test.step("Verify product is visible in cart", async () => {
    console.log(`Verifying product "${productName}" is visible in cart`);
    await expect(app.pages.cart.productRow(productName)).toBeVisible();
    console.log("Product row is visible");
  });

  await test.step("Verify quantity is 1", async () => {
    await expect(app.pages.cart.lineItemQuantityInput()).toHaveValue("1");
    console.log("Quantity input value is 1");
  });

  await test.step("Verify subtotal is $15.00", async () => {
    const subtotalText = await app.pages.cart.subtotalValue().innerText();
    console.log(`Subtotal value: ${subtotalText}`);
    expect(subtotalText).toContain("$15.00");
    console.log("Subtotal matches expected $15.00");

    const screenshot = await page.screenshot();
    await test.info().attach("cart-subtotal-verified", {
      body: screenshot,
      contentType: "image/png"
    });
  });
});
