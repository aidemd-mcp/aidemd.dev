import { SECTION_INDEX_META, type DOCS_CATEGORIES } from '@/data/docsCategories';
import type { SitePage } from '@/types/sitePage';
import fixedPageCopy from '../../fixedPageCopy';
import attachOgImage from '../../shared/attachOgImage';
import toSingleLine from '../../shared/toSingleLine';

type DocsCategory = (typeof DOCS_CATEGORIES)[number];

/**
 * One docs section index (`/docs/<segment>/`). Title is the section label,
 * description the single-lined lede; no dates, no markdown copy and no section
 * label (the index card shows the index title). The last breadcrumb name is
 * the upper-cased label the docs trail renders today.
 */
export default function buildDocsSectionPage(category: DocsCategory): SitePage {
  const meta = SECTION_INDEX_META[category.section];
  const urlPath = `/docs/${category.urlSegment}/`;
  return attachOgImage({
    urlPath,
    kind: 'docsSection',
    title: meta.label,
    description: toSingleLine(meta.lede),
    breadcrumb: [
      { name: 'AIDE', urlPath: '/' },
      { name: fixedPageCopy.docsIndex.crumb, urlPath: '/docs/' },
      { name: meta.label.toUpperCase(), urlPath },
    ],
  });
}
