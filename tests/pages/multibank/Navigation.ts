import { Page, Locator, expect } from '@playwright/test';

export class Navigation {
  readonly page: Page;
  readonly navMain: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navMain = page.getByRole('navigation').first();
  }

  async visible(): Promise<void> {
    await expect(this.navMain).toBeVisible();
  }

  getNavItems(): Locator {
    return this.navMain.getByRole('link');
  }

  async navItemVisible(label: string): Promise<void> {
    await expect(
      this.navMain.getByRole('link', {
        name: label,
        exact: true,
      })
    ).toBeVisible();
  }

  async clickNavItem(label: string): Promise<void> {
    await this.navMain.getByRole('link', {
      name: label,
      exact: true,
    }).click();
  }

  async hrefOf(label: string): Promise<string | null> {
    return this.navMain.getByRole('link', {
      name: label,
      exact: true,
    }).getAttribute('href');
  }

  // Header actions are outside the main navigation landmark
  async headerActionVisible(label: string): Promise<void> {
    await expect(
      this.page.getByRole('link', {
        name: label,
        exact: true,
      })
    ).toBeVisible();
  }

  async headerActionHref(label: string): Promise<string | null> {
    return this.page.getByRole('link', {
      name: label,
      exact: true,
    }).getAttribute('href');
  }
}