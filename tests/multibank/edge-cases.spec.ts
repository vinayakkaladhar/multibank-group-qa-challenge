import { test, expect } from '@playwright/test';

const baseUrl = 'https://mb.io/en';

test.describe('Negative & Regression Tests', () => {

  // NEG-001: Invalid route handling
  test('NEG-001: Invalid route handling', async ({ page }) => {
    const response = await page.goto(
      `${baseUrl}/this-is-an-invalid-route-for-testing`
    );

    const status = response?.status() ?? 0;

    const errorMessage = page.getByText(
      /not found|404|page does not exist|page unavailable/i
    );

    const hasFriendlyError = await errorMessage
      .isVisible()
      .catch(() => false);

    expect(
      status >= 400 || hasFriendlyError,
      `Expected 4xx status or friendly error. Actual status: ${status}`
    ).toBeTruthy();
  });

  // NEG-003: Mobile viewport regression
  test('NEG-003: Homepage renders without horizontal scrolling on mobile', async ({ page }) => {
    await page.setViewportSize({
      width: 375,
      height: 812
    });

    await page.goto(baseUrl);

    await expect(page.locator('header')).toBeVisible();

    const sections = page.locator('section');
    expect(await sections.count()).toBeGreaterThan(0);
    await expect(sections.first()).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      viewportWidth: window.innerWidth
    }));

    expect(
      Math.max(dimensions.documentWidth, dimensions.bodyWidth)
    ).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
  });

});