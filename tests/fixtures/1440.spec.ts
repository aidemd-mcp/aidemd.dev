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

test('home renders', async ({ page }) => {
  await page.goto('/');
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
