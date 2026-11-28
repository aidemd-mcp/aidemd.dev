import type { Page } from 'playwright';
import type { TitleMeasure } from '@/types/socialShare';

const TITLE_SIZES = [64, 60, 56, 52, 48, 44];
const MAX_LINES = 3;
/** Must equal the title's CSS line-height in design.html. */
const LINE_HEIGHT = 1.08;
/** The bottom 120px of the 630px card stays clear of text. */
const BOTTOM_BAND_TOP = 510;

/**
 * Finds the largest title size that keeps the title within three lines, inside
 * its column and above the bottom band, and leaves that size applied. The
 * browser only measures; this function decides, so the rule is unit-testable.
 * Throws when even the smallest size does not fit.
 *
 * @param args.page - The Playwright Page with the page card filled.
 * @param args.urlPath - The page the card is for, named in the failure.
 * @returns The chosen font size in px.
 */
export default async function fitTitle({ page, urlPath }: { page: Page; urlPath: string }): Promise<number> {
  for (const size of TITLE_SIZES) {
    const measure: TitleMeasure = await page.evaluate(
      ({ fontSize, lineHeight }) => {
        const root = document.querySelector('#og-page')!;
        const title = root.querySelector<HTMLElement>('[data-slot="title"]')!;
        title.style.fontSize = `${fontSize}px`;
        const rect = title.getBoundingClientRect();
        return {
          lines: Math.round(rect.height / (fontSize * lineHeight)),
          overflowsWidth: title.scrollWidth > title.clientWidth,
          bottom: rect.bottom - root.getBoundingClientRect().top,
        };
      },
      { fontSize: size, lineHeight: LINE_HEIGHT },
    );
    if (measure.lines <= MAX_LINES && !measure.overflowsWidth && measure.bottom <= BOTTOM_BAND_TOP) return size;
  }
  throw new Error(
    `title for ${urlPath} does not fit: more than ${MAX_LINES} lines or wider than the column at the ${TITLE_SIZES[TITLE_SIZES.length - 1]}px floor`,
  );
}
