import type { LlmsPage } from '@/types/llmsTxt';
import type { SitePage } from '@/types/sitePage';

/**
 * Maps the page list, in list order, to the records the llms composer reads.
 * A `doc` or `learn` page carries its markdown text; every other kind carries
 * none. A doc or learn page with no markdown entry throws naming its urlPath,
 * so llms-full.txt can never silently omit a page.
 */
export default function buildLlmsPages({
  pages,
  markdown,
}: {
  pages: SitePage[];
  markdown: Map<string, string>;
}): LlmsPage[] {
  return pages.map((page) => {
    const { urlPath, title, description, kind, breadcrumb } = page;
    const record: LlmsPage = { urlPath, title, description, kind, breadcrumb };
    if (kind !== 'doc' && kind !== 'learn') return record;

    const text = markdown.get(urlPath);
    if (text === undefined) throw new Error(`buildLlmsPages: no markdown for ${urlPath}`);
    return { ...record, markdown: text };
  });
}
