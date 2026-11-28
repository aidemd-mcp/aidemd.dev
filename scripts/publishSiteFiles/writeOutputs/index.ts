import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { SiteFile } from '@/types/siteFiles';

/**
 * Writes each planned file under publicDir, creating parent folders as needed.
 * Strings are written as UTF-8 exactly as given (no newline translation); buffers
 * are written as bytes.
 */
export default async function writeOutputs({
  publicDir,
  files,
}: {
  publicDir: string;
  files: SiteFile[];
}): Promise<void> {
  await Promise.all(
    files.map(async (file) => {
      const target = path.join(publicDir, file.path);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, file.content);
    }),
  );
}
