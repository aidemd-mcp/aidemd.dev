import type { SitePage } from '@/types/sitePage';
import fileError from '../shared/fileError';
import listFilesUnder from '../shared/listFilesUnder';
import readPublishedFile from '../shared/readPublishedFile';
import assertPngCard from './assertPngCard';

const CARD_PREFIX = '/og/';
const SITE_CARD = '/og.png';

/** Drops the leading slash of a root-relative address so it is relative to public/. */
function toPublicPath(address: string): string {
  return address.replace(/^\//, '');
}

/**
 * Checks the share images on disk against the page list. `og.png` and every page's
 * generated `/og/` card must exist and be a PNG of 1200 by 630; every file under
 * og/ must be some page's `ogImage` (no orphan card); a page whose `ogImage` is a
 * committed capture (such as /observer) must have that file present. Throws naming
 * the file and the broken rule.
 */
export default async function verifyShareImages({
  publicDir,
  pages,
}: {
  publicDir: string;
  pages: SitePage[];
}): Promise<void> {
  const generated = pages.map((page) => page.ogImage).filter((image) => image.startsWith(CARD_PREFIX));
  const cards = new Set<string>([SITE_CARD, ...generated]);

  for (const address of cards) {
    const file = toPublicPath(address);
    assertPngCard({ file, bytes: await readPublishedFile({ publicDir, file }) });
  }

  const orphan = (await listFilesUnder({ publicDir, folder: 'og' })).find((file) => !cards.has(`/${file}`));
  if (orphan) throw fileError(orphan, 'is a share card of no page in the page list');

  // Committed captures (not generated here) must at least exist
  for (const page of pages) {
    if (cards.has(page.ogImage)) continue;
    const file = toPublicPath(page.ogImage);
    if ((await readPublishedFile({ publicDir, file })).length === 0) throw fileError(file, 'is empty');
  }
}
