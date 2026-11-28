import templateLabels from '@/data/learn/templateLabels';
import type { SitePage } from '@/types/sitePage';
import fixedPageCopy from '../fixedPageCopy';
import attachOgImage from '../shared/attachOgImage';

/**
 * The home page record. Carries no dates and no markdown copy; its share
 * image is the site card.
 */
export default function buildHomePage(): SitePage {
  return attachOgImage({
    urlPath: '/',
    kind: 'home',
    title: fixedPageCopy.home.title,
    description: fixedPageCopy.home.description,
    breadcrumb: [{ name: templateLabels.breadcrumbHome, urlPath: '/' }],
  });
}
