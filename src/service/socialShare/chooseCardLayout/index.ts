import type { SitePageKind } from '@/types/sitePage';
import type { OgCardLayout } from '@/types/socialShare';

/** One entry per page kind: a new kind is a compile error until it is placed here. */
const CARD_LAYOUT_BY_KIND: Record<SitePageKind, OgCardLayout | null> = {
  home: 'site',
  brain: 'site',
  brainRecipes: 'site',
  privacy: 'site',
  docsIndex: 'site',
  docsSection: 'page',
  doc: 'page',
  learnIndex: 'page',
  learn: 'page',
  observer: null,
};

/**
 * Decides which share card a page kind gets, so the address, alt and render
 * steps agree. `null` means this module never draws or writes a card for the
 * page.
 */
export default function chooseCardLayout(kind: SitePageKind): OgCardLayout | null {
  return CARD_LAYOUT_BY_KIND[kind];
}
