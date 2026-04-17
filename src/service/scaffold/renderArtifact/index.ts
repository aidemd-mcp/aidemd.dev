import { readFile } from "node:fs/promises";
import type { ScaffoldArtifact } from "@/types/scaffold";
import renderMarkdown from "@/service/docs/renderCanonical/renderMarkdown";
import artifactMeta from "@/service/scaffold/artifactMeta";
import resolveSourcePath from "./resolveSourcePath";
import extractArtifactCitationMeta from "./extractArtifactCitationMeta";

type RenderArtifactInput = {
  slug: string;
  kind: ScaffoldArtifact["kind"];
};

/**
 * Resolves the source markdown file for a scaffold artifact, renders it to HTML,
 * and returns a fully populated ScaffoldArtifact ready for page display.
 *
 * Pipeline:
 *   resolveSourcePath -> readFile -> renderMarkdown -> artifactMeta -> extractArtifactCitationMeta -> ScaffoldArtifact
 *
 * Throws if the source file is missing or contains unsupported markdown constructs.
 */
export default async function renderArtifact({
  slug,
  kind,
}: RenderArtifactInput): Promise<ScaffoldArtifact> {
  const sourcePath = resolveSourcePath({ slug, kind });

  let sourceText: string;
  try {
    sourceText = await readFile(sourcePath, "utf-8");
  } catch (err) {
    const cause = err instanceof Error ? err.message : String(err);
    throw new Error(
      `renderArtifact: source file not found for ${kind} "${slug}" at ${sourcePath} — ${cause}`,
    );
  }

  const contentHtml = await renderMarkdown(sourceText, sourcePath);
  const meta = artifactMeta({ slug, kind });
  const { publishedAt, sourceCommit, previousCommit } = extractArtifactCitationMeta({ slug, kind });

  return {
    slug,
    kind,
    title: meta.title,
    description: meta.description,
    contentHtml,
    sourceText,
    publishedAt,
    commitSha: sourceCommit,
    previousCommit,
  };
}
