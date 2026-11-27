export type DocSection = 'methodology' | 'commands' | 'agents' | 'skills' | 'tools' | 'hooks';

export type DocRouteKey = `${DocSection}/${string}`;

export type DocRoute = {
  section: DocSection;
  /** Path relative to the content root without `.md`, in the file's own case (e.g. `aide/SKILL`, `Stop`); used for labels and titles. */
  slug: string;
  title: string;
  /** `/docs/<section>/<slug lowercased>`; every link, param and lookup that addresses a page uses it. */
  urlPath: string;
  absPath: string;
  order: number;
};

export type DocFrontmatter = {
  title?: string;
  description?: string;
  published?: string;
  commit?: string;
};

export type RenderedDoc = {
  route: DocRoute;
  frontmatter: DocFrontmatter;
  bodyHtml: string;
  commit: string;
  published: string;
};

export type DocRegistry = {
  routes: DocRoute[];
  getByKey: (key: DocRouteKey) => DocRoute | undefined;
};
