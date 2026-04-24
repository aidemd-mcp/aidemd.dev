export type DocSection = 'methodology' | 'commands' | 'agents' | 'skills';

export type DocRouteKey = `${DocSection}/${string}`;

export type DocRoute = {
  section: DocSection;
  slug: string;
  title: string;
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
