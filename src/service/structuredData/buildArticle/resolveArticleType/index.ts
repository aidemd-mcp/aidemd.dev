import type { ArticleNode } from '@/types/structuredData';
import type { SitePage } from '@/types/sitePage';

/**
 * The schema.org article type for a page kind: TechArticle for docs, Article for /learn.
 * Throws for any other kind, since only those two kinds get an article record.
 */
export default function resolveArticleType(kind: SitePage['kind']): ArticleNode['@type'] {
  if (kind === 'doc') return 'TechArticle';
  if (kind === 'learn') return 'Article';
  throw new Error(`structuredData: no article for page kind ${kind}`);
}
