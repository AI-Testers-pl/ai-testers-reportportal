import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "../src/pages/base.page";
import { ProductGridSection } from "./product-grid.section";

export class HomePage extends BasePage {
  readonly featuredProducts: ProductGridSection;
  readonly mostLovedProducts: ProductGridSection;

  constructor(page: Page) {
    super(page);
    this.featuredProducts = new ProductGridSection(page, "Our Featured Products");
    this.mostLovedProducts = new ProductGridSection(page, "Most Loved Products");
  }

  async goto(): Promise<void> {
    await this.open("/");
    await this.waitForLoaded();
  }

  async waitForLoaded(): Promise<void> {
    await this.waitForVisible(this.heroHeading());
  }

  heroHeading(): Locator {
    return this.page.getByRole("heading", { name: /We Print What You Want/i, level: 1 }).first();
  }

  heroSubheading(): Locator {
    return this.page.getByRole("heading", { name: /Best Quality Products/i }).first();
  }

  getStartedButton(): Locator {
    return this.page.getByRole("link", { name: /Get Started/i }).first();
  }

  primaryNavLink(name: "Home" | "All Products" | "About" | "Contact"): Locator {
    return this.page
      .getByRole("navigation", { name: /Primary Site Navigation/i })
      .getByRole("link", { name, exact: true })
      .first();
  }

  cartLink(): Locator {
    return this.fallbackLocator(
      this.page.getByRole("link", { name: /View Shopping Cart/i }),
      this.page.locator("a[href$='/cart/']")
    );
  }

  dealOfTheDayBanner(): Locator {
    return this.page
      .locator("div, section")
      .filter({ has: this.page.getByRole("heading", { name: /Deal of the Day!/i }) })
      .first();
  }

  dealOfTheDayShopNowButton(): Locator {
    return this.dealOfTheDayBanner().getByRole("link", { name: /Shop Now/i }).first();
  }

  testimonials(): Locator {
    return this.page
      .locator("div, section")
      .filter({ has: this.page.getByRole("heading", { name: /Our Happy Clients!/i }) })
      .first();
  }

  testimonialAuthors(): Locator {
    return this.testimonials().locator("cite, .testimonial-author, [class*='author']");
  }

  async openShop(): Promise<void> {
    await this.primaryNavLink("All Products").click();
  }

  async openContact(): Promise<void> {
    await this.primaryNavLink("Contact").click();
  }

  async openCart(): Promise<void> {
    await this.cartLink().click();
  }
}
