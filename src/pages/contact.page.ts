import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { type ContactInquiry } from "../models/contact";

export class ContactPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open("/contact/");
    await this.waitForLoaded();
  }

  async waitForLoaded(): Promise<void> {
    await this.waitForPath("contact");
    await this.waitForVisible(this.form());
  }

  form(): Locator {
    return this.page.locator("form.srfm-form").first();
  }

  emailField(): Locator {
    return this.page.getByPlaceholder("Your Email").first();
  }

  subjectField(): Locator {
    return this.page.getByPlaceholder("Subject").first();
  }

  messageField(): Locator {
    return this.page.getByPlaceholder("Message").first();
  }

  submitButton(): Locator {
    return this.page.locator("#srfm-submit-btn").or(this.page.getByRole("button", { name: /Send Message/i })).first();
  }

  successBanner(): Locator {
    return this.page
      .locator(".srfm-success-box-description, .srfm-success-box.in-page")
      .first();
  }

  fieldErrors(): Locator {
    return this.page.locator(".srfm-error-message:not([hidden])");
  }

  invalidEmailField(): Locator {
    return this.form().locator("input[type='email']:invalid").first();
  }

  async fillInquiry(inquiry: ContactInquiry): Promise<void> {
    await this.emailField().fill(inquiry.email);
    await this.subjectField().fill(inquiry.subject);
    await this.messageField().fill(inquiry.message);
  }

  async submit(): Promise<void> {
    await this.submitButton().click();
  }
}
