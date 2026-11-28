import type { SiteFile } from '@/types/siteFiles';
import type { SitePage } from '@/types/sitePage';
import fileError from '../shared/fileError';
import listFilesUnder from '../shared/listFilesUnder';
import readPublishedFile from '../shared/readPublishedFile';

/** Drops the leading slash of a root-relative address so it is relative to public/. */
function toPublicPath(address: string): string {
  return address.replace(/^\//, '');
}

/**
 * Checks the markdown copies on disk against the page list. Every page with a
 * `markdownUrl` must have that file present, non-empty and byte-identical to the
 * planned content; every `.md` file under docs/ and learn/ must belong to some
 * page's `markdownUrl` (no orphan copy). Throws naming the file and the broken rule.
 */
export default async function verifyMarkdownCopies({
  publicDir,
  pages,
  files,
}: {
  publicDir: string;
  pages: SitePage[];
  files: SiteFile[];
}): Promise<void> {
  const expected = new Set<string>();

  for (const page of pages) {
    if (!page.markdownUrl) continue;
    const file = toPublicPath(page.markdownUrl);
    expected.add(file);

    const planned = files.find((candidate) => candidate.path === file);
    if (!planned) throw fileError(file, 'is not in the planned output');

    const onDisk = await readPublishedFile({ publicDir, file });
    if (onDisk.length === 0) throw fileError(file, 'is empty');
    if (!onDisk.equals(Buffer.from(planned.content))) {
      throw fileError(file, 'differs from the planned content (truncated or partial write)');
    }
  }

  for (const folder of ['docs', 'learn']) {
    const found = await listFilesUnder({ publicDir, folder });
    const orphan = found.find((file) => file.endsWith('.md') && !expected.has(file));
    if (orphan) throw fileError(orphan, 'is a markdown copy of no page in the page list');
  }
}
