import path from 'node:path';
import launchBrowser from './launchBrowser';
import loadDesignSource from './loadDesignSource';
import captureOgElement from './captureOgElement';
import verifyOutput from './verifyOutput';

/**
 * Render pipeline orchestrator. Launches a headless Chromium instance, navigates
 * it to the local design source, captures the `.og` element as a 1200×630 PNG,
 * verifies the output meets spec constraints, and writes the result to
 * `public/og.png` in the project root.
 *
 * This function is the entry point for the `npm run og:render` script (wired via
 * `renderOgImage/run.mjs`) and is auto-invoked by the `prebuild` npm hook before
 * every `next build`. It is never imported by the Next.js application graph —
 * Playwright stays out of the bundle.
 *
 * Pipeline sequence:
 *   1. `launchBrowser()` — launches Chromium headless, opens a 1200×630 page.
 *   2. `loadDesignSource(page)` — navigates to `design/design.html` via
 *      `file://` URL; awaits `networkidle` + `document.fonts.ready`.
 *   3. Resolve `outPath` to `<cwd>/public/og.png`.
 *   4. `captureOgElement(page, outPath)` — screenshots `.og` selector to disk.
 *   5. `browser.close()` — always runs in `finally`, even on failure, so no
 *      Chromium process leaks when a helper throws.
 *   6. `verifyOutput(outPath)` — validates PNG signature, exact 1200×630
 *      dimensions, and byte size under 300 KB. Throws on any violation.
 *   7. Logs one line: `og.png rendered — <w>×<h>, <bytes> bytes`.
 *
 * Any error from a helper bubbles uncaught. The surrounding `prebuild` script
 * propagates the non-zero exit code and aborts `next build`. This is the drift
 * gate — a silently wrong card never reaches the deploy artifact.
 *
 * Prerequisites:
 *   - The Chromium browser binary must be installed before this script runs.
 *     On a fresh machine or CI runner, install it once with:
 *       `npx playwright install chromium`
 *     On Linux CI (e.g. GitHub Actions ubuntu-latest), add `--with-deps` to also
 *     install the OS libraries Chromium links against (libnss3, libatk1.0-0,
 *     etc.):
 *       `npx playwright install --with-deps chromium`
 *     CI coverage (the GitHub Actions step that runs this command automatically)
 *     is handled in step 6 of the implementation plan at `plan.aide`. A reader
 *     following this module's contract sees the local half here and the CI half
 *     there — both halves together form the full browser-install story.
 */
export default async function renderOgImage(): Promise<void> {
  const { browser, page } = await launchBrowser();

  try {
    await loadDesignSource(page);
    const outPath = path.resolve(process.cwd(), 'public/og.png');
    await captureOgElement(page, outPath);
  } finally {
    await browser.close();
  }

  const metrics = await verifyOutput(path.resolve(process.cwd(), 'public/og.png'));
  console.log(`og.png rendered — ${metrics.width}×${metrics.height}, ${metrics.bytes} bytes`);
}
