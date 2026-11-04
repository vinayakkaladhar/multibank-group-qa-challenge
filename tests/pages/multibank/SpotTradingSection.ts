import { Page, Locator, expect } from '@playwright/test';
import { requiredTradingFields } from '../../data/multibank/tradingPairs';

export class SpotTradingSection {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Main trading section
  section(): Locator {
    return this.page.getByRole('region', {
      name: /spot trading|markets?/i,
    });
  }

  // Verify trading section is visible
  async visible(): Promise<void> {
    await expect(this.section()).toBeVisible();
  }

  // Get trading categories
  categories(): Locator {
    return this.section().getByRole('tab');
  }

  // Select a trading category
  async selectCategory(category: string): Promise<void> {
    const tab = this.categories().getByText(category, {
      exact: true,
    });

    await expect(tab).toBeVisible();
    await tab.click();
  }

  // Verify selected category
  async categorySelected(category: string): Promise<void> {
    const tab = this.section().getByRole('tab', {
      name: category,
      exact: true,
    });

    await expect(tab).toHaveAttribute('aria-selected', 'true');
  }

  // Get trading table
  table(): Locator {
    return this.section().getByRole('table');
  }

  // Get trading rows (excluding header)
  pairRows(): Locator {
    return this.table().getByRole('row').filter({
      has: this.table().getByRole('cell'),
    });
  }

  // Get table headers
  tableHeaders(): Locator {
    return this.table().getByRole('columnheader');
  }

  // Verify required column headers
  async requiredHeadersPresent(): Promise<void> {
    for (const field of requiredTradingFields) {
      await expect(
        this.tableHeaders().filter({
          hasText: new RegExp(`^${field}$`, 'i'),
        })
      ).toBeVisible();
    }
  }

  // Get a cell by its column position
  cellInRow(row: Locator, columnIndex: number): Locator {
    return row.getByRole('cell').nth(columnIndex);
  }
}