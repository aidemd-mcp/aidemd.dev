import type { PageDates } from '@/types/sitePage';

export type DocSection = 'methodology' | 'commands' | 'agents' | 'skills' | 'tools' | 'hooks';

export type DocRouteKey = `${DocSection}/${string}`;

export type DocRoute = PageDates & {
  section: DocSection;
  /** Path relative to the content root without `.md`, in the file's own case (e.g. `aide/SKILL`, `Stop`); used for labels and titles. */
  slug: string;
  title: string;
  /** `/docs/<section>/<slug lowercased>`; every link, param and lookup that addresses a page uses it. */
  urlPath: string;
  absPath: string;
  order: number;
  /** Short hash of the last commit touching the file, or the literal `uncommitted`. `published` and `modified` (from `PageDates`) come only from version history and are absent when unknown. */
  commit: string;
};

/** The route as the filesystem walk knows it, before version-history facts are attached. */
export type WalkedDocRoute = Omit<DocRoute, 'commit' | 'published' | 'modified'>;

export type DocFrontmatter = {
  title?: string;
  description?: string;
  commit?: string;
};

export type RenderedDoc = {
  route: DocRoute;
  frontmatter: DocFrontmatter;
  bodyHtml: string;
  commit: string;
  published?: string;
};

export type DocRegistry = {
  routes: DocRoute[];
  getByKey: (key: DocRouteKey) => DocRoute | undefined;
};
