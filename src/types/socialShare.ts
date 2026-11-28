import type { SitePage } from '@/types/sitePage';

/** Canonical shape of the Open Graph image config for aidemd.dev. */
export type OgImageConfig = {
  title: string;
  description: string;
  siteName: string;
  /** Canonical site URL (trailing slash included). */
  url: string;
  /** Absolute URL of og.png on the deployed site. */
  imageUrl: string;
  /** Site-root-relative path, e.g. `/og.png`. Resolved against metadataBase by Next. */
  imagePath: string;
  /** Literal 1200 — TypeScript rejects any drift from the spec dimensions. */
  width: 1200;
  /** Literal 630 — TypeScript rejects any drift from the spec dimensions. */
  height: 630;
  alt: string;
};

/** Which card design a share image uses. */
export type OgCardLayout = 'site' | 'page';

/** The page fields a page-layout share card is drawn from. */
export type OgCardInput = Pick<SitePage, 'urlPath' | 'kind' | 'title' | 'section'>;

/** One share image to render: the site card, or a page card with its input. */
export type OgCardJob =
  | { layout: 'site'; address: string; label: string }
  | { layout: 'page'; address: string; label: string; page: OgCardInput };

/** A rendered share image and the address it is written to. */
export type OgCardImage = { address: string; png: Buffer };

/** The measured result of laying a title out on a card. */
export type TitleMeasure = { lines: number; overflowsWidth: boolean; bottom: number };
