import type { Page } from 'playwright';
import tagSrgb from '../tagSrgb/index';

/**
 * Captures the card element matched by `selector` on the loaded design page
 * and returns it as an sRGB-tagged PNG buffer.
 *
 * Selector-based capture (not viewport-clipped) is mandated by the spec's
 * Strategy decision #2 — the design HTML wraps each card in scaffolding that
 * the card selector (`#og` or `#og-page`) cleanly excludes. `omitBackground:
 * false` retains the card's background colour so the PNG carries the correct
 * sRGB pixels.
 *
 * Animations are disabled so the site card's endlessly blinking caret is
 * reset to its first frame; without that, two renders can catch different
 * frames and the same records would not give the same bytes.
 *
 * After the screenshot, `tagSrgb` splices a 13-byte sRGB chunk immediately
 * after the IHDR chunk. Playwright's default PNG output is color-space-
 * untagged; without this step the spec's `outcomes.desired[0]` (sRGB color
 * space) and `outcomes.undesired[0]` (not sRGB causes silent consumer
 * downgrade) are both violated.
 *
 * @param args.page     - The Playwright Page that has already navigated to the design source.
 * @param args.selector - CSS selector of the card to capture.
 * @returns The tagged PNG bytes; nothing is written to disk.
 */
export default async function captureOgElement({
  page,
  selector,
}: {
  page: Page;
  selector: string;
}): Promise<Buffer> {
  const screenshot = await page.locator(selector).screenshot({
    type: 'png',
    omitBackground: false,
    animations: 'disabled',
  });

  return tagSrgb(screenshot);
}
