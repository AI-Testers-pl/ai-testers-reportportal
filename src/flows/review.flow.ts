import { ProductPage } from "../pages/product.page";
import { type ProductReview } from "../models/review";

export interface ReviewFlowDependencies {
  productPage: ProductPage;
}

export class ReviewFlow {
  readonly productPage: ProductPage;

  constructor(dependencies: ReviewFlowDependencies) {
    this.productPage = dependencies.productPage;
  }

  async submitReview(productNameOrSlug: string, review: ProductReview): Promise<void> {
    await this.productPage.goto(productNameOrSlug);
    await this.productPage.reviews.fillReview(review);
    await this.productPage.reviews.submit();
  }
}
