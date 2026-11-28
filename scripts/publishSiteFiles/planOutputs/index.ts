import type { OutputSources, SiteFile } from '@/types/siteFiles';

/** Drops the leading slash of a root-relative address so it is relative to public/. */
function toPublicPath(address: string): string {
  return address.replace(/^\//, '');
}

/**
 * Lists every file the pre-deploy step writes, as paths relative to public/ with
 * their content: llms.txt, llms-full.txt, feed.xml, security.txt, one markdown
 * copy per page that has a `markdownUrl`, and one file per share image. The list
 * follows the page list, so adding or removing a page changes it with no other
 * edit. Throws when two files share a path, since the later write would silently
 * replace the earlier.
 */
export default function planOutputs(input: OutputSources): SiteFile[] {
  const { pages, llms, feedXml, securityTxt, markdown, images } = input;

  const markdownFiles = pages.flatMap((page): SiteFile[] => {
    if (!page.markdownUrl) return [];
    const content = markdown.get(page.urlPath);
    if (content === undefined) throw new Error(`planOutputs: no markdown for ${page.urlPath}`);
    return [{ path: toPublicPath(page.markdownUrl), content }];
  });

  const files: SiteFile[] = [
    { path: 'llms.txt', content: llms.llmsTxt },
    { path: 'llms-full.txt', content: llms.llmsFullTxt },
    { path: 'feed.xml', content: feedXml },
    { path: '.well-known/security.txt', content: securityTxt },
    ...markdownFiles,
    ...images.map((image): SiteFile => ({ path: toPublicPath(image.address), content: image.png })),
  ];

  const seen = new Set<string>();
  for (const file of files) {
    if (seen.has(file.path)) throw new Error(`planOutputs: two files share the path ${file.path}`);
    seen.add(file.path);
  }
  return files;
}
