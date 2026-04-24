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
 * The render script at renderOgImage/ is a build-time sibling invoked only
 * via the `og:render` npm script (through the `prebuild` hook). It is never
 * imported here — keeping Playwright out of the Next.js build graph is the
 * load-bearing constraint that preserves the zero-runtime-Node-dependency
 * contract from the root intent.
 */
export const ogImage: OgImageConfig = ogImageConfig();

export default ogImage;
