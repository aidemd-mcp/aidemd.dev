import templateLabels from '@/data/learn/templateLabels';
import type { SitePage } from '@/types/sitePage';
import fixedPageCopy from '../fixedPageCopy';
import attachOgImage from '../shared/attachOgImage';

/**
 * The /privacy page record. Carries no dates and no markdown copy; its share
 * image is the site card.
 */
export default function buildPrivacyPage(): SitePage {
  return attachOgImage({
    urlPath: '/privacy/',
    kind: 'privacy',
    title: fixedPageCopy.privacy.title,
    description: fixedPageCopy.privacy.description,
    breadcrumb: [
      { name: templateLabels.breadcrumbHome, urlPath: '/' },
      { name: fixedPageCopy.privacy.crumb, urlPath: '/privacy/' },
    ],
  });
}
