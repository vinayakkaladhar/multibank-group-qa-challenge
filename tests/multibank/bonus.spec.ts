import { test, expect } from '@playwright/test';

const baseUrl = 'https://mb.io/en';

test.describe('Visual Regression Tests', () => {

  test('BONUS-1: Homepage visual snapshot', async ({ page }) => {
    await page.setViewportSize({
      width: 1440,
      height: 900
    });

    await page.goto(baseUrl);

await expect(page).toHaveScreenshot('homepage.png', {
  fullPage: true,
  animations: 'disabled',
  maxDiffPixelRatio: 0.02
});
  });

});