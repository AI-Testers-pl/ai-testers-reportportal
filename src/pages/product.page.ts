import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { ProductReviewsSection } from "../components/product-reviews.section";
import { toSlug } from "../utils/text";

export class ProductPage extends BasePage {
  readonly reviews: ProductReviewsSection;

  constructor(page: Page) {
    super(page);
    this.reviews = new ProductReviewsSection(page);
  }

  async goto(productNameOrSlug: string): Promise<void> {
    const slug = productNameOrSlug.includes("/") || productNameOrSlug.match(/^[a-z0-9-]+$/)
      ? productNameOrSlug
      : toSlug(productNameOrSlug);
    await this.open(`/product/${slug}/`);
    await this.waitForLoaded();
  }

  async waitForLoaded(): Promise<void> {
    await this.waitForPath("/product/");
    await this.waitForVisible(this.title());
  }

  title(): Locator {
    return this.page.locator("h1.product_title").first();
  }

  price(): Locator {
    return this.page.locator(".summary .price .woocommerce-Price-amount").first();
  }
}
