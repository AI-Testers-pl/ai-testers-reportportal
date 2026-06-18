import { test as base, expect } from "@playwright/test";
import { ContactFlow } from "../../src/flows/contact.flow";
import { PurchaseFlow } from "../../src/flows/purchase.flow";
import { ReviewFlow } from "../../src/flows/review.flow";
import { CartPage } from "../../src/pages/cart.page";
import { CheckoutPage } from "../../src/pages/checkout.page";
import { ContactPage } from "../../src/pages/contact.page";
import { ProductPage } from "../../src/pages/product.page";
import { ShopPage } from "../../src/pages/shop.page";

type CheckoutApp = {
  pages: {
    shop: ShopPage;
    cart: CartPage;
    checkout: CheckoutPage;
    contact: ContactPage;
    product: ProductPage;
  };
  flows: {
    purchase: PurchaseFlow;
    contact: ContactFlow;
    review: ReviewFlow;
  };
};

type CheckoutFixtures = {
  app: CheckoutApp;
};

export const test = base.extend<CheckoutFixtures>({
  app: async ({ page }, use) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const contactPage = new ContactPage(page);
    const productPage = new ProductPage(page);

    const purchaseFlow = new PurchaseFlow({
      shopPage,
      cartPage,
      checkoutPage
    });
    const contactFlow = new ContactFlow({ contactPage });
    const reviewFlow = new ReviewFlow({ productPage });

    await use({
      pages: {
        shop: shopPage,
        cart: cartPage,
        checkout: checkoutPage,
        contact: contactPage,
        product: productPage
      },
      flows: {
        purchase: purchaseFlow,
        contact: contactFlow,
        review: reviewFlow
      }
    });
  }
});

export { expect };
