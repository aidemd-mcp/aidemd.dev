import type { FixedPageCopy } from '@/types/sitePage';

/**
 * The words for the pages that have no copy module of their own: home, the
 * docs index and /privacy, plus the breadcrumb names of /brain, /brain/recipes
 * and /observer. Titles are a page's own title without the site suffix; the
 * metadata helper adds it. Drafted wording, flagged for founder review like
 * the /learn drafts.
 */
export default {
  home: {
    title: 'AIDE: intent-driven engineering for AI coding agents',
    description:
      'The canonical home of intent-driven AIDE and @aidemd-mcp/server: a short intent spec next to the code is the contract every agent plans, builds and tests against.',
    crumb: 'home',
  },
  docsIndex: {
    title: 'AIDE docs: the intent-driven methodology reference',
    description:
      'The canonical record of the intent-driven AIDE methodology. Every page is a direct render of the source files @aidemd-mcp/server ships.',
    crumb: 'DOCS',
  },
  privacy: {
    title: 'Privacy policy',
    description:
      'aidemd.dev collects only GA4 page-view analytics — no form inputs, no ad pixels, no PII beyond what GA4 records by default — and honors Do Not Track.',
    crumb: 'privacy',
  },
  brainCrumb: 'brain',
  brainRecipesCrumb: 'recipes',
  observerCrumb: 'observer',
} as const satisfies FixedPageCopy;
