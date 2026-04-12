import type { CanonicalDoc } from "@/types/docs";
import readSource from "./readSource";
import parseFrontmatter from "./parseFrontmatter";
import renderMarkdown from "./renderMarkdown";
import extractCitationMeta from "./extractCitationMeta";
import diffCheck from "./diffCheck";

type RenderCanonicalInput = {
  slug: string;
};

/**
 * Transforms a canonical `.aide/<slug>.md` source file into a rendered
 * `CanonicalDoc` with byte-faithful HTML and git-authoritative citation metadata.
 *
 * Pipeline:
 *   readSource -> parseFrontmatter -> renderMarkdown -> extractCitationMeta -> diffCheck -> CanonicalDoc
 *
 * Throws on:
 * - missing source file
 * - untracked file with no git history
 * - byte-faithfulness divergence detected by diffCheck
 */
export default async function renderCanonical({
  slug,
}: RenderCanonicalInput): Promise<CanonicalDoc> {
  const rawSource = await readSource(slug);
  const { frontmatter, body } = parseFrontmatter(rawSource);
  const contentHtml = await renderMarkdown(body);
  const citationMeta = extractCitationMeta(slug);

  diffCheck(slug, body, contentHtml);

  const title =
    typeof frontmatter["title"] === "string" ? frontmatter["title"] : slug;

  return {
    slug,
    title,
    contentHtml,
    sourceText: rawSource,
    frontmatter,
    citationMeta,
  };
}
