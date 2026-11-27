import { test, expect, Page } from '@playwright/test';

async function freezeAnimations(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
      }
    `,
  });
}

const HERO_HEADLINE = 'Your intent is the contract every agent works from.';

test('home renders', async ({ page }) => {
  // The hero headline is revealed by a JS timer; reduced motion renders it finished.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect
    .poll(() => page.locator('h1 span.absolute').textContent(), { timeout: 5000 })
    .toBe(HERO_HEADLINE);
  await freezeAnimations(page);
  await expect(page).toHaveScreenshot('home.png');
});

test('docs index renders', async ({ page }) => {
  await page.goto('/docs/');
  await freezeAnimations(page);
  await expect(page).toHaveScreenshot('docs-index.png');
});

test('docs aide-spec renders', async ({ page }) => {
  await page.goto('/docs/methodology/aide-spec/');
  await freezeAnimations(page);
  await expect(page).toHaveScreenshot('docs-aide-spec.png');
});
