import { execSync } from "node:child_process";

type ArtifactCitationMeta = {
  publishedAt: string;
  sourceCommit: string;
};

/**
 * Extracts citation metadata for a scaffold artifact source file by querying
 * git log for the most recent commit that touched the file.
 *
 * - publishedAt: ISO 8601 author timestamp of the most recent commit
 * - sourceCommit: short (7-char) SHA of that commit
 *
 * Falls back to the current date and an empty commit SHA if the file has no
 * git history (e.g. untracked new file during local development).
 */
export default function extractArtifactCitationMeta(
  sourcePath: string,
): ArtifactCitationMeta {
  try {
    const output = execSync(
      `git log -1 --format="%H %aI" -- "${sourcePath}"`,
      { cwd: process.cwd(), encoding: "utf-8" },
    ).trim();

    if (!output) {
      // File exists but has no git history — untracked or newly added.
      return {
        publishedAt: new Date().toISOString().slice(0, 10),
        sourceCommit: "",
      };
    }

    const spaceIdx = output.indexOf(" ");
    const fullSha = output.slice(0, spaceIdx);
    const isoTimestamp = output.slice(spaceIdx + 1);

    return {
      publishedAt: isoTimestamp,
      sourceCommit: fullSha.slice(0, 7),
    };
  } catch {
    // git not available or repo error — degrade gracefully.
    return {
      publishedAt: new Date().toISOString().slice(0, 10),
      sourceCommit: "",
    };
  }
}
