import type { LearnCopy } from '@/types/learn';
import type { SitePage } from '@/types/sitePage';

/** The one site identity record; `url` is the origin with no trailing slash. No profile or sameAs field exists. */
export type SiteIdentity = {
  name: string;
  siteName: string;
  url: string;
  logo: string;
  securityContact: string;
};

/** A reference to a graph node by `@id`. */
export type IdReference = { '@id': string };

/** The Organization node (no `sameAs`). */
export type OrganizationNode = {
  '@type': 'Organization';
  '@id': string;
  name: string;
  url: string;
  logo: string;
};

/** The WebSite node; `name` is the search-facing site name. */
export type WebSiteNode = {
  '@type': 'WebSite';
  '@id': string;
  name: string;
  url: string;
  publisher: IdReference;
};

/** A BreadcrumbList node. */
export type BreadcrumbListNode = {
  '@type': 'BreadcrumbList';
  itemListElement: { '@type': 'ListItem'; position: number; name: string; item: string }[];
};

/** An Article or TechArticle node; author, publisher and isPartOf are references only. */
export type ArticleNode = {
  '@type': 'Article' | 'TechArticle';
  headline: string;
  description: string;
  url: string;
  mainEntityOfPage: string;
  datePublished?: string;
  dateModified?: string;
  author: IdReference;
  publisher: IdReference;
  isPartOf: IdReference;
};

/** The /learn index CollectionPage node. */
export type CollectionPageNode = {
  '@type': 'CollectionPage';
  name: string;
  description: string;
  url: string;
  isPartOf: IdReference;
  publisher: IdReference;
};

/** A FAQPage node; each answer `text` is a plain string. */
export type FAQPageNode = {
  '@type': 'FAQPage';
  mainEntity: {
    '@type': 'Question';
    name: string;
    acceptedAnswer: { '@type': 'Answer'; text: string };
  }[];
};

/** A DefinedTerm node; `description` is a plain string. */
export type DefinedTermNode = {
  '@type': 'DefinedTerm';
  name: string;
  description: string;
  url: string;
  inDefinedTermSet?: IdReference;
};

/** A DefinedTermSet node holding its terms. */
export type DefinedTermSetNode = {
  '@type': 'DefinedTermSet';
  '@id': string;
  name: string;
  hasDefinedTerm: DefinedTermNode[];
};

/** Every node a page graph may contain. */
export type StructuredDataNode =
  | OrganizationNode
  | WebSiteNode
  | BreadcrumbListNode
  | ArticleNode
  | CollectionPageNode
  | FAQPageNode
  | DefinedTermNode
  | DefinedTermSetNode;

/** Input to the structured-data builder: the page, plus its /learn copy record when `page.kind` is `'learn'`. */
export type StructuredDataInput = { page: SitePage; copy?: LearnCopy };

/** The embedded JSON-LD document; every record uses the `@graph` form. */
export type JsonLdDocument = {
  '@context': 'https://schema.org';
  '@graph': StructuredDataNode[];
};
