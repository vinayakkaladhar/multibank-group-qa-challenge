
import { Page, Locator, expect } from '@playwright/test';
import { homepageHeroHeading } from '../../data/multibank/content';

export class HomePage {
  readonly page: Page;
  readonly heroSection: Locator;

  constructor(page: Page) {
    this.page = page;

    const heroHeading = page.getByRole('heading', {
      name: homepageHeroHeading,
      exact: true
    });

    this.heroSection = page.locator('section').filter({
      has: heroHeading
    });
  }

  async bannerVisible() {
    await expect(this.heroSection.first()).toBeVisible();

    await expect(
      this.heroSection.getByRole('heading', {
        name: homepageHeroHeading,
        exact: true
      })
    ).toBeVisible();
  }

  async verifyHeroContent() {
    await this.bannerVisible();

    await expect(
      this.heroSection.getByText(
        /simple, secure and speedy/i
      )
    ).toBeVisible();
  }
}
