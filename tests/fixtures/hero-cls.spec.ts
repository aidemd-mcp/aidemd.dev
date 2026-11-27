import { test, expect } from '@playwright/test';

const HERO_HEADLINE = 'Your intent is the contract every agent works from.';

const VIEWPORTS = [
  { width: 1280, height: 900 },
  { width: 390, height: 844 },
];

for (const viewport of VIEWPORTS) {
  test(`hero has zero layout shifts at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.addInitScript(() => {
      const shifts: Array<{ value: number; hadRecentInput: boolean }> = [];
      (window as unknown as { __layoutShifts: typeof shifts }).__layoutShifts = shifts;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
          shifts.push({ value: shift.value, hadRecentInput: shift.hadRecentInput });
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    await page.goto('/');
    // One full reveal, the pause at full text, and the restart.
    await page.waitForTimeout(5000);

    const shifts = await page.evaluate(
      () => (window as unknown as { __layoutShifts: unknown[] }).__layoutShifts,
    );
    expect(shifts).toEqual([]);
  });
}

test('reduced motion renders the full headline statically', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const overlay = page.locator('h1 span.absolute');
  await expect.poll(() => overlay.textContent(), { timeout: 5000 }).toBe(HERO_HEADLINE);
  await page.waitForTimeout(1000);
  expect(await overlay.textContent()).toBe(HERO_HEADLINE);
});
