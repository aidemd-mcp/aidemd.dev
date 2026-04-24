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
