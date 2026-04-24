import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Dirent } from 'node:fs';
import type { DocSection, DocRoute } from '@/types/docs';

/** Extracts the first `# ` heading text from markdown content, or returns undefined. */
function extractFirstH1(content: string): string | undefined {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : undefined;
}

/** Resolves the directory containing a Dirent, handling both Node 20.1+ parentPath and the older path property. */
function direntDir(dirent: Dirent, fallback: string): string {
  const d = dirent as unknown as { parentPath?: string; path?: string };
  return d.parentPath ?? d.path ?? fallback;
}

/**
 * Recursively walks a single content root directory and returns one DocRoute
 * stub per .md file discovered. order is set to 0 and must be assigned by
 * orderRoutes after all roots are concatenated.
 */
export default async function walkDocsRoot({
  section,
  urlSegment,
  absRoot,
}: {
  section: DocSection;
  urlSegment: string;
  absRoot: string;
}): Promise<DocRoute[]> {
  let entries: Dirent[];

  try {
    // Cast through unknown to sidestep the Dirent<Buffer> vs Dirent<string>
    // generic mismatch in @types/node — at runtime name and parentPath are
    // always strings when withFileTypes: true is passed.
    entries = (await readdir(absRoot, {
      recursive: true,
      withFileTypes: true,
    })) as unknown as Dirent[];
  } catch {
    // Root directory does not exist — return empty rather than throwing so a
    // missing optional root does not abort the full registry build.
    return [];
  }

  const mdEntries = entries.filter(
    (dirent) => dirent.isFile() && String(dirent.name).endsWith('.md'),
  );

  const routes = await Promise.all(
    mdEntries.map(async (dirent) => {
      const dir = direntDir(dirent, absRoot);
      const absPath = path.join(dir, String(dirent.name));

      // Derive slug: relative path from absRoot, strip .md, normalise separators.
      const rel = path.relative(absRoot, absPath);
      const slug = rel.replace(/\\/g, '/').replace(/\.md$/, '');

      const urlPath = `/docs/${urlSegment}/${slug}`;

      // Read the file to extract the title from the first H1 heading.
      let title = slug;
      try {
        const content = await readFile(absPath, 'utf8');
        title = extractFirstH1(content) ?? slug;
      } catch {
        // If the file can't be read, fall back to slug — never throw.
      }

      return {
        section,
        slug,
        title,
        urlPath,
        absPath,
        order: 0,
      } satisfies DocRoute;
    }),
  );

  return routes;
}
