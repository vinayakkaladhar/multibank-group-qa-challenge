
import { test, expect } from '@playwright/test';
import { TradingPage } from '../pages/multibank/TradingPage';

test.describe('Trading Functionality', () => {

  let tradingPage: TradingPage;

  test.beforeEach(async ({ page }) => {
    tradingPage = new TradingPage(page);
    await tradingPage.navigate();
  });

  // Requirement 1:
  // Spot trading section renders and displays trading pairs

  test('TC01 - Spot trading section renders', async () => {
    await tradingPage.verifySpotMarketSection();
  });

  test('TC02 - Spot market displays trading pairs', async () => {
    const pairCount = await tradingPage.getTradingPairCount();

    expect(pairCount).toBeGreaterThan(0);
  });

  // Requirement 2:
  // Trading pairs are correctly grouped into categories

test('TC03 - Trading categories are displayed', async ({ page }) => {
  await expect(page.getByText('Hot', { exact: true })).toBeVisible();
  await expect(page.getByText('Gainers', { exact: true })).toBeVisible();
  await expect(page.getByText('Losers', { exact: true })).toBeVisible();

  const categories = await tradingPage.getCategories();

  expect(categories).toEqual(
    expect.arrayContaining(['Hot', 'Gainers', 'Losers'])
  );
});

  test('TC04 - Trading pairs can be filtered by category', async () => {
    const categories = ['Hot', 'Gainers', 'Losers'];

    for (const category of categories) {
      await tradingPage.selectCategory(category);

      await expect(
        tradingPage.marketTable
      ).toBeVisible();

      const pairCount = await tradingPage.getTradingPairCount();

      expect(pairCount).toBeGreaterThan(0);
    }
  });

  // Requirement 3:
  // Trading pair entries contain expected data fields

  test('TC05 - Trading pairs contain expected data fields', async () => {
    await tradingPage.verifyTradingPairData();
  });


test('TC06 - Trading pairs contain valid market information', async () => {
  const pairs = await tradingPage.getTradingPairs();

  expect(pairs.length).toBeGreaterThan(0);

  for (const pair of pairs) {
    expect(pair[0]).toMatch(/[A-Z]{2,}/);
    expect(pair[1]).toMatch(/^\$[\d,]+(\.\d+)?$/);
    expect(pair[2]).toMatch(/^-?\d+(\.\d+)?%$/);
  }
});


});
