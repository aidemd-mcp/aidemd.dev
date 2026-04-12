import { execSync } from "node:child_process";
import path from "node:path";
import type { CitationMeta } from "@/types/docs";

/**
 * Extracts citation metadata for a canonical `.aide/<slug>.md` file
 * by reading the git history of that specific file.
 *
 * - publishedAt: author timestamp of the last commit that touched the file (ISO 8601)
 * - sourceCommit: short SHA of the last commit
 * - versionedUrl: `/docs/<slug>?v=<sha>`
 * - previousVersionUrl: versioned URL of the prior commit, if one exists
 *
 * Never uses frontmatter dates — git history is authoritative.
 */
export default function extractCitationMeta(slug: string): CitationMeta {
  const relPath = path.join(".aide", `${slug}.md`).replace(/\\/g, "/");

  // Fetch the last two commits that touched this specific file.
  // Format: "<short-sha> <author-timestamp-unix>"
  const log = execSync(
    `git log --follow --format="%h %at" -2 -- "${relPath}"`,
    { encoding: "utf-8" },
  ).trim();

  if (!log) {
    throw new Error(
      `renderCanonical: no git history found for "${relPath}" — file may be untracked`,
    );
  }

  const lines = log.split("\n").map((l) => l.trim()).filter(Boolean);
  const [latestLine, previousLine] = lines;

  const [latestSha, latestTs] = latestLine.split(" ");
  const publishedAt = new Date(parseInt(latestTs, 10) * 1000).toISOString();
  const versionedUrl = `/docs/${slug}?v=${latestSha}`;

  let previousVersionUrl: string | undefined;
  if (previousLine) {
    const [previousSha] = previousLine.split(" ");
    previousVersionUrl = `/docs/${slug}?v=${previousSha}`;
  }

  return {
    publishedAt,
    sourceCommit: latestSha,
    versionedUrl,
    previousVersionUrl,
  };
}
