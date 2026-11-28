import { rm } from 'node:fs/promises';
import path from 'node:path';

/** The only entries under public/ this step owns; everything else there is committed or belongs to another step. */
const GENERATED_ENTRIES = [
  'og',
  'docs',
  'learn',
  '.well-known',
  'llms.txt',
  'llms-full.txt',
  'feed.xml',
  'og.png',
] as const;

/**
 * Removes every file this step generates from public/, and nothing else, so a
 * deleted page's old markdown copy or share card cannot survive into the deploy.
 * Missing entries are fine: the first run has nothing to clear.
 */
export default async function clearGeneratedOutput(publicDir: string): Promise<void> {
  await Promise.all(
    GENERATED_ENTRIES.map((entry) => rm(path.join(publicDir, entry), { recursive: true, force: true })),
  );
}
