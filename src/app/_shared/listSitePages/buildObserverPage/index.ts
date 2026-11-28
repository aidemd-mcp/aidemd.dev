import templateLabels from '@/data/learn/templateLabels';
import observerCopy from '@/app/observer/_data/observerCopy';
import type { SitePage } from '@/types/sitePage';
import fixedPageCopy from '../fixedPageCopy';

/**
 * The /observer page record. Its share image is the hero capture the page
 * already ships, not a generated card (socialShare draws none for this kind),
 * so it skips attachOgImage. Carries no dates and no markdown copy.
 */
export default function buildObserverPage(): SitePage {
  return {
    urlPath: '/observer/',
    kind: 'observer',
    title: observerCopy.meta.title,
    description: observerCopy.meta.description,
    ogImage: observerCopy.capture.src1x,
    breadcrumb: [
      { name: templateLabels.breadcrumbHome, urlPath: '/' },
      { name: fixedPageCopy.observerCrumb, urlPath: '/observer/' },
    ],
  };
}
