import type { SectionId } from '@/types/expo';

/**
 * Canonical ordered list of marketing section ids, matched against Expo tips.
 * The `docs` entry is appended last — it activates when the user navigates
 * into /docs/* rather than scrolling the marketing page.
 */
export const SECTION_IDS: readonly SectionId[] = [
  'hero',
  'threeLayerModel',
  'pipeline',
  'intentTree',
  'vaultBrain',
  'cliDemo',
  'comparison',
  'quickstart',
  'footer',
  'docs',
] as const;
