import type { OgCardInput } from '@/types/socialShare';
import chooseCardLayout from '../chooseCardLayout';
import ogImageConfig from '../ogImageConfig';
import hashCardInputs from './hashCardInputs';
import hashDesignSource from './hashDesignSource';

/**
 * The single formula for where a page's share image lives. The site card
 * keeps `/og.png`; a page card is `/og/<slug>-<hash>.png`, where the hash
 * covers the design source, title and section so a changed page or design gets
 * an address scrapers have not cached. Returns `null` for pages this module
 * never draws a card for. Playwright-free: the page list and the renderer both
 * call it, and the renderer refuses any record that disagrees.
 */
export default function ogCardAddress(page: OgCardInput): string | null {
  const layout = chooseCardLayout(page.kind);
  if (layout === null) return null;
  if (layout === 'site') return ogImageConfig().imagePath;

  const slug = page.urlPath.replace(/^\/+|\/+$/g, '').replace(/\//g, '-');
  const hash = hashCardInputs({
    designHash: hashDesignSource(),
    title: page.title,
    section: page.section,
  });
  return `/og/${slug}-${hash}.png`;
}
