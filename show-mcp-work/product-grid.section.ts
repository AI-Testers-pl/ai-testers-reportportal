import { type Locator, type Page } from "@playwright/test";
import { type ProductCardSummary } from "./product-card";
import { buildFlexibleTextPattern } from "../src/utils/text";

export class ProductGridSection {
  private readonly page: Page;
  private readonly headingName: string;

  constructor(page: Page, headingName: string) {
    this.page = page;
    this.headingName = headingName;
  }

  root(): Locator {
    return this.page
      .locator(".uagb-container-inner-blocks-wrap")
      .filter({ has: this.page.getByRole("heading", { name: this.headingName, exact: true }) })
      .first();
  }

  heading(): Locator {
    return this.root().getByRole("heading", { name: this.headingName, exact: true });
  }

  grid(): Locator {
    return this.root().locator("ul.products").first();
  }

  cards(): Locator {
    return this.grid().locator("li.product");
  }

  cardByName(productName: string): Locator {
    return this.cards().filter({
      has: this.page.getByRole("heading", { name: buildFlexibleTextPattern(productName) })
    }).first();
  }

  cardName(card: Locator): Locator {
    return card.locator("h2").first();
  }

  cardCategory(card: Locator): Locator {
    return card.locator(".ast-woo-product-category").first();
  }

  cardPrice(card: Locator): Locator {
    return card.locator(".price").first();
  }

  cardLink(card: Locator): Locator {
    return card.locator("a.woocommerce-LoopProduct-link").first();
  }

  saleBadge(card: Locator): Locator {
    return card.locator(".onsale, .ast-onsale-card").first();
  }

  async count(): Promise<number> {
    return await this.cards().count();
  }

  async summarize(): Promise<ProductCardSummary[]> {
    const total = await this.cards().count();
    const summaries: ProductCardSummary[] = [];

    for (let i = 0; i < total; i += 1) {
      const card = this.cards().nth(i);
      const name = (await this.cardName(card).innerText()).trim();
      const category = (await this.cardCategory(card).innerText()).trim();
      const price = (await this.cardPrice(card).innerText()).trim();
      const url = (await this.cardLink(card).getAttribute("href")) ?? "";
      const onSale = (await this.saleBadge(card).count()) > 0;
      summaries.push({ name, category, price, url, onSale });
    }

    return summaries;
  }

  async openProduct(productName: string): Promise<void> {
    await this.cardByName(productName).scrollIntoViewIfNeeded();
    await this.cardLink(this.cardByName(productName)).click();
  }
}
