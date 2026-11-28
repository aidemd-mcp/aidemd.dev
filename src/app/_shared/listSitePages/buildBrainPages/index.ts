import templateLabels from '@/data/learn/templateLabels';
import { OG_DESCRIPTION, PAGE_TITLE_A, PAGE_TITLE_B } from '@/app/brain/_data/brainCopy';
import type { SitePage } from '@/types/sitePage';
import fixedPageCopy from '../fixedPageCopy';
import attachOgImage from '../shared/attachOgImage';

/**
 * The /brain page and its /brain/recipes sibling, titled from the /brain copy
 * module so the list and the pages share one source. Neither carries dates or
 * a markdown copy; both share the site card.
 */
export default function buildBrainPages(): [SitePage, SitePage] {
  const home = { name: templateLabels.breadcrumbHome, urlPath: '/' };
  const brain = { name: fixedPageCopy.brainCrumb, urlPath: '/brain/' };

  return [
    attachOgImage({
      urlPath: '/brain/',
      kind: 'brain',
      title: PAGE_TITLE_A,
      description: OG_DESCRIPTION,
      breadcrumb: [home, brain],
    }),
    attachOgImage({
      urlPath: '/brain/recipes/',
      kind: 'brainRecipes',
      title: PAGE_TITLE_B,
      description: OG_DESCRIPTION,
      breadcrumb: [
        home,
        brain,
        { name: fixedPageCopy.brainRecipesCrumb, urlPath: '/brain/recipes/' },
      ],
    }),
  ];
}
