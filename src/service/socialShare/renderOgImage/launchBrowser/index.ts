import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';

/**
 * Launches a headless Chromium instance and opens a new page sized to the
 * canonical OG image dimensions (1200×630). deviceScaleFactor is fixed at 1
 * — a value of 2 would produce a 2400×1200 capture that verifyOutput rejects.
 *
 * deviceScaleFactor is set on the BrowserContext (not on the Page viewport),
 * which is the correct Playwright API for controlling the device pixel ratio.
 *
 * @returns The browser and page handles. Caller is responsible for closing the
 *   browser after the render pipeline completes (use try/finally).
 */
export default async function launchBrowser(): Promise<{ browser: Browser; page: Page }> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  return { browser, page };
}
