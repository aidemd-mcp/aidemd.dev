import { readFile } from 'node:fs/promises';
import path from 'node:path';
import fileError from '../fileError';

/**
 * Reads one published file from disk as bytes. `file` is relative to publicDir
 * with forward slashes. A file that is absent throws naming it; any other read
 * error propagates unchanged.
 */
export default async function readPublishedFile({
  publicDir,
  file,
}: {
  publicDir: string;
  file: string;
}): Promise<Buffer> {
  try {
    return await readFile(path.join(publicDir, file));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') throw fileError(file, 'is missing');
    throw error;
  }
}
