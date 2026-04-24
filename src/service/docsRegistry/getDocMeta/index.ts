import { readFile } from 'node:fs/promises';
import type { DocRoute } from '@/types/docs';
import parseDocFrontmatter from '../parseDocFrontmatter';
import extractBodyFirstSentence from '../extractBodyFirstSentence';

/**
 * Cheap-read counterpart to `renderDoc`. Reads the markdown file at
 * `route.absPath`, extracts YAML frontmatter via `parseDocFrontmatter`, and
 * returns only the resolved `title` and `description`.
 *
 * Description resolution follows a three-source fallback chain:
 *  1. Frontmatter `description:` field — the explicit, curated description.
 *  2. First substantive sentence of the doc body — extracted by
 *     `extractBodyFirstSentence`, skipping headings, blockquotes, and lists.
 *  3. `undefined` — if neither source yields text (e.g. index/hub pages whose
 *     body is entirely bullet lists with no paragraph).
 *
 * Unlike `renderDoc` this accessor never invokes the Shiki highlighter and
 * never converts markdown to HTML — it is intended for consumers that need
 * title + description only, such as the llms.txt generator and any future
 * sitemap or meta-index surface. Prefer `renderDoc` when you need the full
 * rendered body.
 */
export default async function getDocMeta(
  route: DocRoute,
): Promise<{ title: string; description: string | undefined }> {
  const raw = await readFile(route.absPath, 'utf8');
  const { frontmatter, body } = parseDocFrontmatter(raw, route.slug);
  const description = frontmatter.description ?? extractBodyFirstSentence(body);
  return {
    title: frontmatter.title ?? route.slug,
    description,
  };
}
