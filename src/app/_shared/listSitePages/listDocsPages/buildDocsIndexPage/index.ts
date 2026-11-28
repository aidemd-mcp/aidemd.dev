import type { SitePage } from '@/types/sitePage';
import fixedPageCopy from '../../fixedPageCopy';
import attachOgImage from '../../shared/attachOgImage';

/**
 * The /docs/ index page record. Carries no dates, no markdown copy and no
 * section label: no single content source dates it, and the index card shows
 * the page's own title.
 */
export default function buildDocsIndexPage(): SitePage {
  const { title, description, crumb } = fixedPageCopy.docsIndex;
  return attachOgImage({
    urlPath: '/docs/',
    kind: 'docsIndex',
    title,
    description,
    breadcrumb: [
      { name: 'AIDE', urlPath: '/' },
      { name: crumb, urlPath: '/docs/' },
    ],
  });
}
