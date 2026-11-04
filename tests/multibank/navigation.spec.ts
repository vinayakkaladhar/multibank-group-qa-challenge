import { test, expect } from '@playwright/test';
import { Navigation } from '../pages/multibank/Navigation';

import {
  navigationItems,
  headerActions,
  desktopViewports,
} from '../data/multibank/navigation';

const baseUrl = 'https://mb.io/en';

test.describe('Navigation & Layout', () => {

  for (const viewport of desktopViewports) {

    test.describe(
      `Desktop: ${viewport.width}x${viewport.height}`,
      () => {

        let nav: Navigation;

        test.beforeEach(async ({ page }) => {
          await page.setViewportSize(viewport);
          await page.goto(baseUrl);

          nav = new Navigation(page);
        });

        // NAV-001: Verify main navigation items
        test('NAV-001: Main navigation renders expected items', async () => {

          await nav.visible();

          for (const item of navigationItems) {
            await nav.navItemVisible(item.label);
          }
        });

        // NAV-002: Verify main navigation destinations
        test('NAV-002: Navigation items have correct destinations', async () => {

          await nav.visible();

          for (const item of navigationItems) {

            const href = await nav.hrefOf(item.label);

            expect(
              href,
              `${item.label} should have a valid href`
            ).not.toBeNull();

            expect(href).toMatch(item.pathPattern);
          }
        });

        // NAV-003: Verify header actions
        test('NAV-003: Sign in and Sign up are visible with correct destinations', async () => {

          for (const item of headerActions) {

            await nav.headerActionVisible(item.label);

            const href = await nav.headerActionHref(item.label);

            expect(
              href,
              `${item.label} should have a valid href`
            ).not.toBeNull();

            expect(href).toMatch(item.pathPattern);
          }
        });

   // NAV-004: Verify desktop layout stability
test('NAV-004: Desktop layout remains stable', async ({ page }) => {

  // Verify no horizontal overflow
  const bodyWidth = await page.locator('body').evaluate(
    body => body.scrollWidth
  );

  expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 1);

  // Verify essential page sections
  await expect(page.locator('header').first()).toBeVisible();
  await expect(page.locator('nav').first()).toBeVisible();
  await expect(page.locator('main').first()).not.toBeVisible();

});

        // NAV-005: Verify external navigation safety
        test('NAV-005: External navigation links are configured safely', async () => {

          await nav.visible();

          for (const item of navigationItems) {

            const href = await nav.hrefOf(item.label);

            if (!href) continue;

            const resolvedUrl = new URL(href, baseUrl);
            const isExternal =
              resolvedUrl.origin !== new URL(baseUrl).origin;

            if (isExternal) {

              const link = nav.getNavItems().filter({
                hasText: item.label,
              });

              const target = await link.getAttribute('target');
              const rel = await link.getAttribute('rel');

              if (target === '_blank') {
                expect(rel).toMatch(/noopener|noreferrer/i);
              }
            }
          }
        });

      }
    );
  }
});