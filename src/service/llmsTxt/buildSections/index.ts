import type { LlmsEntry, LlmsPage, LlmsSection } from '@/types/llmsTxt';
import type { SitePageKind } from '@/types/sitePage';
import resolvePageUrl from './resolvePageUrl';

/** Returns the single page of `kind`, or throws naming the missing kind. */
function requireKind({ entries, kind }: { entries: LlmsEntry[]; kind: SitePageKind }): LlmsEntry {
  const entry = entries.find((candidate) => candidate.kind === kind);
  if (!entry) throw new Error(`Page list has no "${kind}" page`);
  return entry;
}

/**
 * Groups the site page list into the sections of llms.txt: one section per
 * docs section page (the section page, then its docs), then Learn, then
 * Optional (/observer and /brain). List order is kept throughout; nothing is
 * re-sorted. Home, the docs index, /brain recipes and /privacy are not placed.
 * Throws when the list cannot fill a section or a doc belongs to no section.
 */
export default function buildSections({ pages }: { pages: LlmsPage[] }): LlmsSection[] {
  const entries: LlmsEntry[] = pages.map((page) => ({ ...page, url: resolvePageUrl(page) }));

  const sectionPages = entries.filter((entry) => entry.kind === 'docsSection');
  if (sectionPages.length === 0) throw new Error('Page list has no "docsSection" page');

  const docs = entries.filter((entry) => entry.kind === 'doc');
  const orphan = docs.find(
    (doc) => !sectionPages.some((sectionPage) => doc.breadcrumb.some((item) => item.urlPath === sectionPage.urlPath)),
  );
  if (orphan) throw new Error(`Doc belongs to no docs section: ${orphan.urlPath}`);

  // Docs sections: the section page first, then the docs whose breadcrumb names it.
  const docsSections: LlmsSection[] = sectionPages.map((sectionPage) => ({
    heading: sectionPage.title,
    entries: [
      sectionPage,
      ...docs.filter((doc) => doc.breadcrumb.some((item) => item.urlPath === sectionPage.urlPath)),
    ],
  }));

  const learnSection: LlmsSection = {
    heading: 'Learn',
    entries: [requireKind({ entries, kind: 'learnIndex' }), ...entries.filter((entry) => entry.kind === 'learn')],
  };

  requireKind({ entries, kind: 'observer' });
  requireKind({ entries, kind: 'brain' });
  const optionalSection: LlmsSection = {
    heading: 'Optional',
    entries: entries.filter((entry) => entry.kind === 'observer' || entry.kind === 'brain'),
  };

  return [...docsSections, learnSection, optionalSection];
}
