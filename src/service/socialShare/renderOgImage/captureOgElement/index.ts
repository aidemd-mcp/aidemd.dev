import type { Page } from 'playwright';
import tagSrgb from '../tagSrgb/index';

/**
 * Captures the `.og` element on the loaded design page and writes the result
 * to disk as a PNG file at `outPath`.
 *
 * Selector-based capture (not viewport-clipped) is mandated by the spec's
 * Strategy decision #2 — the design HTML wraps the card in scaffolding that
 * the `.og` selector cleanly excludes. `omitBackground: false` retains the
 * card's background colour so the PNG carries the correct sRGB pixels.
 *
 * After the screenshot, `tagSrgb` splices a 13-byte sRGB chunk immediately
 * after the IHDR chunk. Playwright's default PNG output is color-space-
 * untagged; without this step the spec's `outcomes.desired[0]` (sRGB color
 * space) and `outcomes.undesired[0]` (not sRGB causes silent consumer
 * downgrade) are both violated.
 *
 * @param page    - The Playwright Page that has already navigated to the design source.
 * @param outPath - Absolute filesystem path where the PNG will be written.
 */
export default async function captureOgElement(page: Page, outPath: string): Promise<void> {
  await page.locator('.og').screenshot({
    path: outPath,
    omitBackground: false,
    type: 'png',
  });

  await tagSrgb(outPath);
}
