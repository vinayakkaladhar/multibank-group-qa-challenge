
import { Page, Locator, expect } from '@playwright/test';

export class TradingPage {
  readonly page: Page;

  readonly spotMarketHeading: Locator;
  readonly categoryButtons: Locator;
  readonly marketTable: Locator;
  readonly marketRows: Locator;

  constructor(page: Page) {
    this.page = page;

    this.spotMarketHeading = page.getByRole('heading', {
      name: 'Spot market',
      exact: true
    });

this.categoryButtons = page.locator('button').filter({
  hasText: /^(Hot|Gainers|Losers)$/
});

    this.marketTable = page.getByRole('table');

    this.marketRows = this.marketTable.getByRole('row');
  }

  async navigate() {
    await this.page.goto('/en/explore');
    await expect(this.spotMarketHeading).toBeVisible();
  }

  async verifySpotMarketSection() {
    await expect(this.spotMarketHeading).toBeVisible();
    await expect(this.marketTable).toBeVisible();
  }

async getTradingPairs() {
  return await this.marketTable.locator('tbody tr').evaluateAll(rows =>
    rows
      .map(row =>
        Array.from(row.querySelectorAll('td')).map(
          cell => cell.innerText.trim()
        )
      )
      // Ignore empty placeholder rows
      .filter(cells => cells.some(cell => cell.length > 0))
  );
}

async verifyTradingPairData() {
  const pairs = await this.getTradingPairs();

  expect(pairs.length).toBeGreaterThan(0);

  for (const pair of pairs) {
    // Asset, price and percentage change
    expect(pair.length).toBeGreaterThanOrEqual(3);

    const asset = pair[0];
    const price = pair[1];
    const percentageChange = pair[2];

    // Asset must contain symbol and name
    expect(asset.trim()).not.toBe('');

    // Price must be a valid currency value
    expect(price).toMatch(/^\$[\d,]+(\.\d+)?$/);

    // Percentage change must be valid
    expect(percentageChange).toMatch(/^-?\d+(\.\d+)?%$/);
  }
}

  async getTradingPairCount() {
    return (await this.getTradingPairs()).length;
  }

async getCategories() {
  const categories = ['Hot', 'Gainers', 'Losers'];

  const visibleCategories = [];

  for (const category of categories) {
    const button = this.page.getByText(category, { exact: true });

    if (await button.first().isVisible()) {
      visibleCategories.push(category);
    }
  }

  return visibleCategories;
}

  async selectCategory(category: string) {
    await this.page.getByRole('button', {
      name: category,
      exact: true
    }).click();
  }

  async verifyCategorySelected(category: string) {
    const button = this.page.getByRole('button', {
      name: category,
      exact: true
    });

    await expect(button).toBeVisible();

    await expect(button).toHaveClass(/bg-|active|selected/);
  }

async debugCategories() {
  const buttons = await this.page.locator('button').evaluateAll(buttons =>
    buttons.map(button => ({
      text: button.innerText.trim(),
      ariaLabel: button.getAttribute('aria-label'),
      role: button.getAttribute('role'),
      className: button.className
    }))
  );

  console.log('ALL BUTTONS:', buttons);
}
}
