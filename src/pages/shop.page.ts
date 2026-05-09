import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { buildFlexibleTextPattern, toSlug } from "../utils/text";

export class ShopPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open("/shop-2/");
    await this.waitForLoaded();
  }

  async waitForLoaded(): Promise<void> {
    await this.waitForPath("shop");
    await this.waitForVisible(this.page.getByRole("heading", { name: /Shop/i }));
  }

  productLinkByName(productName: string): Locator {
    return this.page.getByRole("link", { name: buildFlexibleTextPattern(productName) }).first();
  }

  async openProduct(productName: string): Promise<void> {
    await this.waitForLoaded();
    const productLink = this.productLinkByName(productName);
    if ((await productLink.count()) > 0) {
      await productLink.click();
      return;
    }

    await this.page.goto(`/product/${toSlug(productName)}/`, { waitUntil: "domcontentloaded" });
  }

  async addCurrentProductToCart(): Promise<void> {
    const addToCartButton = this.fallbackLocator(
      this.page.getByTestId("add-to-cart"),
      this.page.getByRole("button", { name: /Add to cart/i })
    );
    const viewCartLink = this.fallbackLocator(
      this.page.getByTestId("view-cart"),
      this.page.getByRole("link", { name: /View cart/i })
    );

    await addToCartButton.click();
    await viewCartLink.click();
  }
}
