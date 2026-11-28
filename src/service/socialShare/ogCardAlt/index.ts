import type { OgCardInput } from '@/types/socialShare';
import chooseCardLayout from '../chooseCardLayout';
import ogImageConfig from '../ogImageConfig';

/**
 * The alt text for a page's share card. The site card keeps its canonical alt
 * word for word; a page card's alt names the page's title (and section when the
 * record has one) and calls the mascot Expo. Title and section are inserted as
 * given, never trimmed or shortened. Returns `null` for pages this module never
 * draws a card for. Playwright-free: the metadata helper imports it directly.
 */
export default function ogCardAlt(page: OgCardInput): string | null {
  const layout = chooseCardLayout(page.kind);
  if (layout === null) return null;
  if (layout === 'site') return ogImageConfig().alt;

  const subject = page.section ? `"${page.title}" (${page.section})` : `"${page.title}"`;
  return `AIDEMD.DEV share card for ${subject}, with Expo, the AIDEMD mascot.`;
}
