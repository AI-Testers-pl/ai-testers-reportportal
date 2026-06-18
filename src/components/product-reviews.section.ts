import { type Locator, type Page } from "@playwright/test";
import { type ProductReview } from "../models/review";

export class ProductReviewsSection {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  reviewsTab(): Locator {
    return this.page.locator("li.reviews_tab a, a[href='#tab-reviews']").first();
  }

  ratingStar(stars: ProductReview["rating"]): Locator {
    return this.page
      .locator(`p.stars a.star-${stars}`)
      .or(this.page.getByRole("radio", { name: new RegExp(`${stars} of 5 stars`, "i") }))
      .first();
  }

  commentField(): Locator {
    return this.page.getByLabel(/Your review/i).first();
  }

  authorField(): Locator {
    return this.page.getByLabel(/^Name\b/i).first();
  }

  emailField(): Locator {
    return this.page.getByLabel(/^Email\b/i).first();
  }

  submitButton(): Locator {
    return this.page.locator("#commentform").getByRole("button", { name: /Submit/i }).first();
  }

  validationError(): Locator {
    return this.page
      .locator(".woocommerce-error, .wc-block-components-notice-banner.is-error, #wp-die-message")
      .first();
  }

  reviewByAuthor(author: string): Locator {
    return this.page.locator(".commentlist li, ol.commentlist li").filter({ hasText: author }).first();
  }

  async openReviewsTab(): Promise<void> {
    const tab = this.reviewsTab();
    if (await tab.count() > 0 && await tab.isVisible().catch(() => false)) {
      await tab.click();
    }
    await this.commentField().scrollIntoViewIfNeeded();
  }

  async selectRating(stars: ProductReview["rating"]): Promise<void> {
    await this.ratingStar(stars).click();
  }

  async fillReview(review: ProductReview): Promise<void> {
    await this.openReviewsTab();
    await this.selectRating(review.rating);
    await this.commentField().fill(review.comment);
    if (review.author !== undefined) {
      await this.authorField().fill(review.author);
    }
    if (review.email !== undefined) {
      await this.emailField().fill(review.email);
    }
  }

  async submit(): Promise<void> {
    await this.submitButton().click();
  }
}
