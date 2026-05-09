import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { buildFlexibleTextPattern } from "../utils/text";

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open("/cart/");
    await this.waitForLoaded();
  }

  async waitForLoaded(): Promise<void> {
    await this.waitForPath("cart");
    await this.waitForVisible(this.page.getByRole("heading", { name: "Cart", exact: true }));
  }

  productRow(productName: string): Locator {
    return this.page.getByRole("row").filter({ hasText: buildFlexibleTextPattern(productName) });
  }

  subtotalValue(): Locator {
    return this.page.locator(".cart-subtotal .woocommerce-Price-amount").first();
  }

  totalValue(): Locator {
    return this.page.locator(".order-total .woocommerce-Price-amount").first();
  }

  lineItemQuantityInput(): Locator {
    return this.page.getByRole("spinbutton", { name: /Product quantity/i }).first();
  }

  async proceedToCheckout(): Promise<void> {
    await this.waitForLoaded();
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/9f914c29-6b0a-45ab-9d1c-481613029d2d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        runId: "post-cleanup-debug",
        hypothesisId: "H7",
        location: "src/pages/cart.page.ts:proceedToCheckout:beforeClick",
        message: "Proceed to checkout before click",
        data: { currentUrl: this.page.url() },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
    const proceedToCheckoutLink = this.fallbackLocator(
      this.page.getByTestId("proceed-to-checkout"),
      this.page.getByRole("link", { name: /Proceed to checkout/i })
    );
    await proceedToCheckoutLink.click();
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/9f914c29-6b0a-45ab-9d1c-481613029d2d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        runId: "post-cleanup-debug",
        hypothesisId: "H7",
        location: "src/pages/cart.page.ts:proceedToCheckout:afterClick",
        message: "Proceed to checkout after click",
        data: { currentUrl: this.page.isClosed() ? "closed" : this.page.url() },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
  }
}
