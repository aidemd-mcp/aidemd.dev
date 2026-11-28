import type {
  JsonLdDocument,
  StructuredDataInput,
  StructuredDataNode,
} from '@/types/structuredData';
import buildArticle from './buildArticle';
import buildBreadcrumbList from './buildBreadcrumbList';
import buildCollectionPage from './buildCollectionPage';
import buildDefinedTerms from './buildDefinedTerms';
import buildFaqPage from './buildFaqPage';
import buildSiteGraph from './buildSiteGraph';
import requireLearnCopy from './requireLearnCopy';
import richRecordSlugs from './richRecordSlugs';

/**
 * Builds the JSON-LD `@graph` record for one site page, keyed on `page.kind`:
 * home gets the Organization and WebSite identity; a doc gets TechArticle and
 * BreadcrumbList; a docs section gets BreadcrumbList; the /learn index gets
 * CollectionPage and BreadcrumbList; a /learn page gets Article and BreadcrumbList,
 * plus FAQPage and DefinedTerm records when its slug is in `richRecordSlugs`.
 * Every page node points at the identity by `@id`. Kinds that carry no record
 * throw. The module reads nothing but its input and the site identity record.
 */
export default function buildStructuredData(input: StructuredDataInput): JsonLdDocument {
  const { page } = input;
  const nodes: StructuredDataNode[] = [];

  switch (page.kind) {
    case 'home':
      // The one site identity: Organization + WebSite.
      nodes.push(...buildSiteGraph());
      break;
    case 'doc':
      // A docs page is a technical article titled by its H1, with its trail.
      nodes.push(
        buildArticle({ page, headline: page.title }),
        buildBreadcrumbList(page.breadcrumb),
      );
      break;
    case 'docsSection':
      // A section index is navigation: breadcrumb only.
      nodes.push(buildBreadcrumbList(page.breadcrumb));
      break;
    case 'learnIndex':
      // The /learn index has no single content source, so no article and no date.
      nodes.push(buildCollectionPage(page), buildBreadcrumbList(page.breadcrumb));
      break;
    case 'learn': {
      const copy = requireLearnCopy(input);
      nodes.push(
        buildArticle({ page, headline: copy.h1 }),
        buildBreadcrumbList(page.breadcrumb),
      );
      // Only the definition and SDLC pages get FAQ and glossary records.
      if (richRecordSlugs.some((slug) => slug === copy.slug)) {
        if (copy.faq !== undefined && copy.faq.length > 0) nodes.push(buildFaqPage(copy.faq));
        nodes.push(...buildDefinedTerms(copy));
      }
      break;
    }
    default:
      // Pages without a record must not call the builder.
      throw new Error(`structuredData: no record for page kind ${page.kind}`);
  }

  return { '@context': 'https://schema.org', '@graph': nodes };
}
