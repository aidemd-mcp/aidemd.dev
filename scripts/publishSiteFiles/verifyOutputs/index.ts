import type { PublishReport, SiteFile } from '@/types/siteFiles';
import type { SitePage } from '@/types/sitePage';
import fileError from './shared/fileError';
import readPublishedFile from './shared/readPublishedFile';
import verifyFeed from './verifyFeed';
import verifyLlmsFiles from './verifyLlmsFiles';
import verifyMarkdownCopies from './verifyMarkdownCopies';
import verifySecurityTxt from './verifySecurityTxt';
import verifyShareImages from './verifyShareImages';

/**
 * Reads every planned file back from disk and checks it. Each file must be present,
 * non-empty and byte-identical to what was planned (so a failed or partial write is
 * caught), then each family is checked against the page list: llms files, feed,
 * security.txt, markdown copies and share images. Any broken rule throws, naming the
 * file and the rule, and the error propagates unchanged so the build stops. Returns
 * what was verified, by kind.
 */
export default async function verifyOutputs({
  publicDir,
  pages,
  files,
  now,
}: {
  publicDir: string;
  pages: SitePage[];
  files: SiteFile[];
  now: Date;
}): Promise<PublishReport> {
  // Step 1: Read every planned file back; it must be whole
  const onDisk = new Map<string, Buffer>();
  for (const file of files) {
    const bytes = await readPublishedFile({ publicDir, file: file.path });
    if (bytes.length === 0) throw fileError(file.path, 'is empty');
    if (!bytes.equals(Buffer.from(file.content))) throw fileError(file.path, 'differs from the planned content');
    onDisk.set(file.path, bytes);
  }

  // Step 2: Check each family against the page list
  const read = (filePath: string): string => onDisk.get(filePath)?.toString('utf8') ?? '';
  verifyLlmsFiles({ llmsTxt: read('llms.txt'), llmsFullTxt: read('llms-full.txt'), pages });
  const xml = read('feed.xml');
  verifyFeed({ xml, pages });
  verifySecurityTxt({ text: read('.well-known/security.txt'), now });
  await verifyMarkdownCopies({ publicDir, pages, files });
  await verifyShareImages({ publicDir, pages });

  // Step 3: Report what was verified
  return {
    files: files.length,
    markdownCopies: pages.filter((page) => page.markdownUrl).length,
    shareImages: files.filter((file) => file.path === 'og.png' || file.path.startsWith('og/')).length,
    feedEntries: xml.split('<entry>').length - 1,
  };
}
