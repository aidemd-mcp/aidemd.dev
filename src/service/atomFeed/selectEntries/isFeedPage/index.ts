import type { SitePage, SitePageKind } from '@/types/sitePage';

/** The docs and /learn page families; the index kinds drop out on their own while they carry no date. */
const FEED_KINDS = ['docsIndex', 'docsSection', 'doc', 'learnIndex', 'learn'] as const satisfies readonly SitePageKind[];

/** Narrows a page to one the feed can list: a feed kind with a proven last-modified date. */
export default function isFeedPage(page: SitePage): page is SitePage & { modified: string } {
  return (FEED_KINDS as readonly SitePageKind[]).includes(page.kind) && page.modified !== undefined;
}
