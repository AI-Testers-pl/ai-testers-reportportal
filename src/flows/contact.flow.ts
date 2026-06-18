import { ContactPage } from "../pages/contact.page";
import { type ContactInquiry } from "../models/contact";

export interface ContactFlowDependencies {
  contactPage: ContactPage;
}

export class ContactFlow {
  readonly contactPage: ContactPage;

  constructor(dependencies: ContactFlowDependencies) {
    this.contactPage = dependencies.contactPage;
  }

  async submitInquiry(inquiry: ContactInquiry): Promise<void> {
    await this.contactPage.goto();
    await this.contactPage.fillInquiry(inquiry);
    await this.contactPage.submit();
  }

  async submitEmptyForm(): Promise<void> {
    await this.contactPage.goto();
    await this.contactPage.submit();
  }
}
