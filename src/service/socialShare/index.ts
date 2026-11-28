import type { OgImageConfig } from '@/types/socialShare';
import ogImageConfig from './ogImageConfig';

/**
 * Social share orchestrator for aidemd.dev.
 *
 * Resolves the canonical OgImageConfig once at module load and re-exports it
 * for consumption by src/app/layout.tsx, which composes the config into the
 * root metadata export so every statically-exported page carries the full
 * Open Graph and Twitter Card tag set.
 *
 * The render pipeline at renderOgCards/ is a build-time sibling called by
 * scripts/publishSiteFiles (the `site:publish` npm script, run through the
 * `prebuild` hook). ogCardAddress/ and
 * ogCardAlt/ are Playwright-free and are imported directly by the page list
 * and the metadata helper. None of the render pipeline is imported here —
 * keeping Playwright out of the Next.js build graph is the load-bearing
 * constraint that preserves the zero-runtime-Node-dependency contract from
 * the root intent.
 */
export const ogImage: OgImageConfig = ogImageConfig();

export default ogImage;
