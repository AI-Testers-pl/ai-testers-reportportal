import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { type ShippingInfo } from "../models/checkout";
import { buildFlexibleTextPattern } from "../utils/text";

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open("/checkout/");
    await this.waitForLoaded();
  }

  async waitForLoaded(): Promise<void> {
    await this.waitForPath("checkout");
    await this.waitForVisible(this.page.getByRole("heading", { name: /Checkout/i }));
    await this.waitForVisible(this.placeOrderButton());
  }

  async assertOnCheckout(): Promise<void> {
    await this.waitForPath("checkout");
  }

  orderSummaryProduct(productName: string): Locator {
    return this.page
      .locator(".woocommerce-checkout-review-order-table")
      .getByText(buildFlexibleTextPattern(productName));
  }

  orderSummaryRow(productName: string): Locator {
    return this.page
      .locator(".woocommerce-checkout-review-order-table tr")
      .filter({ hasText: buildFlexibleTextPattern(productName) })
      .first();
  }

  placeOrderButton(): Locator {
    return this.page.getByRole("button", { name: /Place order/i });
  }

  errorListItems(): Locator {
    return this.page.locator(".woocommerce-error li");
  }

  firstNameField(): Locator {
    return this.page.getByLabel("First name");
  }

  lastNameField(): Locator {
    return this.page.getByLabel("Last name");
  }

  streetAddressField(): Locator {
    return this.page.getByLabel("Street address");
  }

  addressLine2Field(): Locator {
    return this.page.getByLabel("Apartment, suite, unit, etc. (optional)");
  }

  cityField(): Locator {
    return this.page.getByLabel("Town / City");
  }

  zipField(): Locator {
    return this.page.getByLabel("ZIP Code");
  }

  phoneField(): Locator {
    return this.page.getByLabel("Phone (optional)");
  }

  emailField(): Locator {
    return this.page.getByLabel("Email address");
  }

  notesField(): Locator {
    return this.page.getByLabel("Order notes (optional)");
  }

  async fillShippingInfo(shipping: ShippingInfo): Promise<void> {
    await this.waitForLoaded();
    await this.firstNameField().fill(shipping.firstName);
    await this.lastNameField().fill(shipping.lastName);
    await this.page.locator("#billing_country").selectOption({ label: shipping.country });
    await this.streetAddressField().fill(shipping.addressLine1);
    await this.addressLine2Field().fill(shipping.addressLine2 ?? "");
    await this.cityField().fill(shipping.city);
    await this.page.locator("#billing_state").selectOption({ label: shipping.state });
    await this.zipField().fill(shipping.zip);
    await this.phoneField().fill(shipping.phone ?? "");
    await this.emailField().fill(shipping.email);
    await this.notesField().fill(shipping.orderNotes ?? "");
  }

  async placeOrder(): Promise<void> {
    await this.assertOnCheckout();
    await this.placeOrderButton().click();
  }
}
