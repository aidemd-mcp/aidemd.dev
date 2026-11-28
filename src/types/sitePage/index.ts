/** ISO 8601 author dates with offset (git `%aI`); each is absent when version history cannot prove it, never an empty string. */
export type PageDates = { published?: string; modified?: string };

/** One kind per site page family. */
export type SitePageKind =
  | 'home'
  | 'docsIndex'
  | 'docsSection'
  | 'doc'
  | 'brain'
  | 'brainRecipes'
  | 'observer'
  | 'privacy'
  | 'learnIndex'
  | 'learn';

/** One breadcrumb step; `urlPath` is root-relative with a trailing slash. */
export type BreadcrumbItem = { name: string; urlPath: string };

/**
 * One indexable site page. `urlPath` is root-relative with a trailing slash
 * (`'/'` for home, `'/docs/hooks/stop/'`); `markdownUrl` is root-relative and
 * present only when a markdown copy exists; `ogImage` is root-relative.
 * Absolute URLs are built by consumers from `siteIdentity.url`.
 */
export type SitePage = PageDates & {
  urlPath: string;
  title: string;
  description: string;
  kind: SitePageKind;
  markdownUrl?: string;
  ogImage: string;
  breadcrumb: BreadcrumbItem[];
  /** The section label a share card shows: `'learn'` on the /learn index and every /learn page, the docs section's lowercase label (e.g. `'methodology'`) on every doc page; absent on every other kind. */
  section?: string;
};

/** Title, description and breadcrumb name of a page with no copy module of its own. */
export type FixedPage = Pick<SitePage, 'title' | 'description'> & { crumb: string };

/** The fixed copy of every page that has no copy module of its own. */
export type FixedPageCopy = {
  home: FixedPage;
  docsIndex: FixedPage;
  privacy: FixedPage;
  brainCrumb: string;
  brainRecipesCrumb: string;
  observerCrumb: string;
};

/** A page's own share image when it is not a generated card (the /observer capture). */
export type PageImage = { width: number; height: number; alt: string };
