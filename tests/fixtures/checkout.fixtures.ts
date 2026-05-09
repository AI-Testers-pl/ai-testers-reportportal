import { test as base, expect } from "@playwright/test";
import { PurchaseFlow } from "../../src/flows/purchase.flow";
import { CartPage } from "../../src/pages/cart.page";
import { CheckoutPage } from "../../src/pages/checkout.page";
import { ShopPage } from "../../src/pages/shop.page";

type CheckoutApp = {
  pages: {
    shop: ShopPage;
    cart: CartPage;
    checkout: CheckoutPage;
  };
  flows: {
    purchase: PurchaseFlow;
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
    const purchaseFlow = new PurchaseFlow({
      shopPage,
      cartPage,
      checkoutPage
    });

    await use({
      pages: {
        shop: shopPage,
        cart: cartPage,
        checkout: checkoutPage
      },
      flows: {
        purchase: purchaseFlow
      }
    });
  }
});

export { expect };
