import { readFileSync } from "node:fs";
import path from "node:path";
import archiveDoc from "@/service/docs/archive";

type VersionEntry = { publishedAt: string; sourceCommit: string };

/**
 * archiveDocs
 *
 * Reads `.aide/docs/versions.json`, then calls `archiveDoc` sequentially for
 * every entry found. Logs progress to stdout in the canonical format. Fails
 * fast on the first archival failure: logs which doc failed and which docs
 * were not attempted, then re-throws so the caller (or `run.ts`) can exit
 * nonzero and block the deploy.
 *
 * No parameters — derives all inputs from versions.json and the project cwd.
 * Does not touch the manifest or feed directly; those side effects belong to
 * `archiveDoc`.
 */
export default async function archiveDocs(): Promise<void> {
  const versionsPath = path.join(process.cwd(), ".aide", "docs", "versions.json");

  let raw: string;
  try {
    raw = readFileSync(versionsPath, "utf-8");
  } catch (err) {
    throw new Error(
      `archive-docs: could not read versions.json at ${versionsPath}: ${(err as Error).message}`
    );
  }

  const versions = JSON.parse(raw) as Record<string, VersionEntry>;
  const entries = Object.entries(versions);
  const total = entries.length;

  console.log(`archive-docs: ${total} docs discovered in versions.json`);

  for (let i = 0; i < entries.length; i++) {
    const [slug, { publishedAt, sourceCommit }] = entries[i];
    const docPath = slug === "index" ? "/docs" : `/docs/${slug}`;
    const versionedUrl = `https://aidemd.dev${docPath}?v=${sourceCommit}`;
    const position = i + 1;

    process.stdout.write(`  [${position}/${total}] ${slug} (${sourceCommit}) ... `);

    try {
      const result = await archiveDoc({ slug, sourceCommit, publishedAt, versionedUrl });
      console.log(`archived -> ${result.wayback}`);
    } catch (err) {
      console.log("FAILED");

      const remaining = entries.slice(i + 1).map(([s]) => s);
      const remainingMsg =
        remaining.length > 0
          ? `\n  Not attempted (${remaining.length}): ${remaining.join(", ")}`
          : "";

      throw new Error(
        `archive-docs: archival failed for "${slug}" (${sourceCommit}): ${(err as Error).message}${remainingMsg}`
      );
    }
  }

  console.log(`archive-docs: all ${total} docs archived successfully`);
}
