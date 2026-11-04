
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/multibank/HomePage';
import { WhyMultiBankPage } from '../pages/multibank/WhyMultiBankPage';
import {
  baseUrl,
  whyMultiBankUrl
} from '../data/multibank/content';

test.describe('Content & Links', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  // CNT-001: Marketing banner / hero
  test('@smoke CNT-001: Marketing banner renders in expected region',
    async ({ page }) => {
      const home = new HomePage(page);
      await home.verifyHeroContent();
    }
  );

  // CNT-002: Not available in supplied homepage DOM
  test('CNT-002: App Store link resolves', async () => {
    test.skip(
      true,
      'App Store link was not present in the inspected mb.io homepage DOM'
    );
  });

  // CNT-003: Not available in supplied homepage DOM
  test('CNT-003: Google Play link resolves', async () => {
    test.skip(
      true,
      'Google Play link was not present in the inspected mb.io homepage DOM'
    );
  });

  // CNT-004: Company page loads
  test('CNT-004: About Us - Why MultiBank page loads',
    async ({ page }) => {
      await page.goto(whyMultiBankUrl);

      await expect(page).toHaveURL(/\/en\/company\/?$/);

      await expect(
        page.getByRole('heading', {
          name: 'Why MultiBank Group?',
          exact: true
        })
      ).toBeVisible();
    }
  );

  // CNT-005: Company page components
  test('CNT-005: Why MultiBank components render',
    async ({ page }) => {
      await page.goto(whyMultiBankUrl);

      const why = new WhyMultiBankPage(page);

      await why.verifyMainContent();
      await why.verifySectionText();
    }
  );

  // CNT-006: No obvious empty content
  test('CNT-006: Homepage sections contain meaningful content',
    async ({ page }) => {
      const sections = page.locator('section');

      const count = await sections.count();

      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const section = sections.nth(i);

        await expect(section).toBeVisible();

        const text = (await section.innerText()).trim();

        expect(text.length).toBeGreaterThan(0);
      }

      const headings = page.locator('h1, h2, h3');

      expect(await headings.count()).toBeGreaterThan(0);

      const visibleImages = page.locator('img:visible');

      const imageCount = await visibleImages.count();

      for (let i = 0; i < imageCount; i++) {
        const image = visibleImages.nth(i);

        await expect(image).toBeVisible();

        const hasSource = await image.evaluate(
          (img: HTMLImageElement) =>
            Boolean(img.currentSrc || img.src)
        );

        expect(hasSource).toBeTruthy();
      }
    }
  );

});
