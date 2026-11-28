import { readdir } from 'node:fs/promises';
import path from 'node:path';

/**
 * Lists every file under `publicDir/folder` as a path relative to publicDir with
 * forward slashes. A folder that does not exist holds no files, so it lists
 * none; any other read error propagates unchanged.
 */
export default async function listFilesUnder({
  publicDir,
  folder,
}: {
  publicDir: string;
  folder: string;
}): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(path.join(publicDir, folder), { recursive: true, withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(publicDir, path.join(entry.parentPath, entry.name)).split(path.sep).join('/'));
}
