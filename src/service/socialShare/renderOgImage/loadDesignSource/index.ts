import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { Page } from 'playwright';

/**
 * Navigates the Playwright page to the local design HTML source and waits for
 * both network idle and font readiness before returning.
 *
 * Resolution strategy: `import.meta.url` gives the absolute path of this file
 * at runtime; `fileURLToPath` converts it to a filesystem path; we then walk
 * two directories up to reach `socialShare/` and resolve the design file
 * relative to that anchor. Converting to a `file://` URL keeps Playwright
 * operating purely on disk — no HTTP server required.
 *
 * The `document.fonts.ready` wait is a belt-and-suspenders guard on top of
 * `font-display: block` in the design HTML. The headline's −1.4 px letter-
 * spacing is the spec's highest-risk metric if a fallback glyph swaps in
 * mid-capture.
 *
 * @param page - The Playwright Page instance to navigate.
 */
export default async function loadDesignSource(page: Page): Promise<void> {
  const thisFile = fileURLToPath(import.meta.url);
  // index.ts is at renderOgImage/loadDesignSource/index.ts
  // ../.. from here reaches socialShare/
  const socialShareDir = path.resolve(path.dirname(thisFile), '..', '..');
  const designHtmlPath = path.resolve(socialShareDir, 'design', 'design.html');
  const designUrl = `file://${designHtmlPath.replace(/\\/g, '/')}`;

  await page.goto(designUrl, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
}
