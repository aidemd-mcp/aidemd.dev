import type { Page } from 'playwright';

const FONT_WEIGHTS = [400, 500, 600, 700];

/**
 * Forces each JetBrains Mono weight the design uses to load and throws when
 * one does not, so a missing font file fails the build instead of rendering a
 * fallback face into a card.
 *
 * @param page - The Playwright Page showing the design source.
 */
export default async function loadDesignFonts(page: Page): Promise<void> {
  for (const weight of FONT_WEIGHTS) {
    const loaded = await page.evaluate(async (fontWeight) => {
      const faces = await document.fonts.load(`${fontWeight} 16px "JetBrains Mono"`);
      return faces.filter((face) => face.status === 'loaded').length;
    }, weight);
    if (loaded === 0) throw new Error(`design font JetBrains Mono ${weight} did not load`);
  }
}
