
import { Page, Locator, expect } from '@playwright/test';
import {
  whyMultiBankPageHeadings,
  whyMultiBankImageAlts
} from '../../data/multibank/content';

export class WhyMultiBankPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async headingsVisible() {
    for (const heading of whyMultiBankPageHeadings) {
      await expect(
        this.page.getByRole('heading', {
          name: heading,
          exact: true
        })
      ).toBeVisible();
    }
  }

  async sectionImagesVisible() {
    for (const alt of whyMultiBankImageAlts) {
      await expect(
        this.page.getByRole('img', { name: alt }).first()
      ).toBeVisible();
    }
  }

  async verifyMainContent() {
    const sections = this.page.locator('section');

    expect(await sections.count()).toBeGreaterThan(0);

    await this.headingsVisible();
    await this.sectionImagesVisible();

    await expect(
      this.page.getByRole('link', {
        name: 'Get in touch'
      })
    ).toBeVisible();
  }

  async verifySectionText() {
    await expect(
      this.page.getByText(/Founded in 2005/i)
    ).toBeVisible();

    await expect(
      this.page.getByText(/strict global oversight/i)
    ).toBeVisible();
  }
}
