import { CartPage } from "../pages/cart.page";
import { CheckoutPage } from "../pages/checkout.page";
import { ShopPage } from "../pages/shop.page";
import { type ShippingInfo } from "../models/checkout";

export interface PurchaseFlowDependencies {
  shopPage: ShopPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
}

export class PurchaseFlow {
  readonly shopPage: ShopPage;
  readonly cartPage: CartPage;
  readonly checkoutPage: CheckoutPage;

  constructor(dependencies: PurchaseFlowDependencies) {
    this.shopPage = dependencies.shopPage;
    this.cartPage = dependencies.cartPage;
    this.checkoutPage = dependencies.checkoutPage;
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.shopPage.goto();
    await this.shopPage.openProduct(productName);
    await this.shopPage.addCurrentProductToCart();
    await this.cartPage.waitForLoaded();
  }

  async goToCheckoutFromCart(): Promise<void> {
    await this.cartPage.proceedToCheckout();
    await this.checkoutPage.waitForLoaded();
  }

  async addProductAndGoToCheckout(productName: string): Promise<void> {
    await this.addProductToCart(productName);
    await this.goToCheckoutFromCart();
  }

  async fillCheckoutForm(shipping: ShippingInfo): Promise<void> {
    await this.checkoutPage.fillShippingInfo(shipping);
  }
}
