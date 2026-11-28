import learnIndex from '@/data/learn/learnIndex';
import templateLabels from '@/data/learn/templateLabels';
import type { SitePage } from '@/types/sitePage';
import attachOgImage from '../../shared/attachOgImage';

/**
 * The /learn/ index page record. Carries no dates (no single content source
 * dates the index) and no markdown copy (markdown copies are for docs and the
 * /learn answer pages).
 */
export default function buildLearnIndexPage(): SitePage {
  return attachOgImage({
    urlPath: '/learn/',
    kind: 'learnIndex',
    title: learnIndex.title,
    description: learnIndex.description,
    section: 'learn',
    breadcrumb: [
      { name: templateLabels.breadcrumbHome, urlPath: '/' },
      { name: templateLabels.breadcrumbLearn, urlPath: '/learn/' },
    ],
  });
}
