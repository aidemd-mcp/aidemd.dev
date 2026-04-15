import { existsSync, readFileSync } from "node:fs";
import archiveDoc from "@/service/docs/archive";
import type { ContentType } from "@/types/docs";

type VersionEntry = { publishedAt: string; sourceCommit: string };

export type ArchivePagesInput = {
  contentType: ContentType;
  urlPrefix: string;
  versionsPath: string;
};

/**
 * archivePages
 *
 * Reads the versions.json at `versionsPath`, then calls `archiveDoc` sequentially
 * for every entry found. Logs progress to stdout in the canonical format. Fails
 * fast on the first archival failure: logs which page failed and which pages were
 * not attempted, then re-throws so the caller (or `run.ts`) can exit nonzero and
 * block the deploy.
 *
 * If the versions.json file does not exist, logs a message and skips gracefully —
 * the MCP will ship these files in a future publish cycle.
 *
 * @param input.contentType - The content type being archived (docs, agents, commands, skills)
 * @param input.urlPrefix   - URL path prefix for this content type (e.g. "/docs", "/agents")
 * @param input.versionsPath - Absolute path to the versions.json file for this content type
 */
export default async function archivePages(
  input: ArchivePagesInput
): Promise<void> {
  const { contentType, urlPrefix, versionsPath } = input;
  const logPrefix = `archive-pages [${contentType}]`;

  if (!existsSync(versionsPath)) {
    console.log(`${logPrefix}: versions.json not found at ${versionsPath} — skipping`);
    return;
  }

  let raw: string;
  try {
    raw = readFileSync(versionsPath, "utf-8");
  } catch (err) {
    throw new Error(
      `${logPrefix}: could not read versions.json at ${versionsPath}: ${(err as Error).message}`
    );
  }

  const versions = JSON.parse(raw) as Record<string, VersionEntry>;
  const entries = Object.entries(versions);
  const total = entries.length;

  console.log(`${logPrefix}: ${total} pages discovered in versions.json`);

  for (let i = 0; i < entries.length; i++) {
    const [slug, { publishedAt, sourceCommit }] = entries[i];
    const docPath = slug === "index" ? urlPrefix : `${urlPrefix}/${slug}`;
    const versionedUrl = `https://aidemd.dev${docPath}?v=${sourceCommit}`;
    const position = i + 1;

    process.stdout.write(`  [${position}/${total}] ${slug} (${sourceCommit}) ... `);

    try {
      const result = await archiveDoc({
        slug,
        sourceCommit,
        publishedAt,
        versionedUrl,
        contentType,
      });
      console.log(`archived -> ${result.wayback}`);
    } catch (err) {
      console.log("FAILED");

      const remaining = entries.slice(i + 1).map(([s]) => s);
      const remainingMsg =
        remaining.length > 0
          ? `\n  Not attempted (${remaining.length}): ${remaining.join(", ")}`
          : "";

      throw new Error(
        `${logPrefix}: archival failed for "${slug}" (${sourceCommit}): ${(err as Error).message}${remainingMsg}`
      );
    }
  }

  console.log(`${logPrefix}: all ${total} pages archived successfully`);
}
