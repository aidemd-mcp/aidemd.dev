import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BuildManifest, BuildManifestEntry } from "@/types/docs";

const MANIFEST_PATH = path.resolve(process.cwd(), "build-manifest.json");

/**
 * updateManifest
 *
 * Appends a new BuildManifestEntry to build-manifest.json keyed by slug.
 * Creates the file if it does not exist.
 * Never removes or mutates existing entries — the manifest is append-only.
 *
 * @param slug - The versioned doc slug (e.g. "aide-spec@v20260411")
 * @param entry - The entry to append
 */
export default async function updateManifest(
  slug: string,
  entry: BuildManifestEntry
): Promise<void> {
  let manifest: BuildManifest = {};

  try {
    const raw = await readFile(MANIFEST_PATH, "utf-8");
    manifest = JSON.parse(raw) as BuildManifest;
  } catch (err) {
    // File does not exist yet — start with an empty manifest
    const isNotFound =
      err instanceof Error && "code" in err && err.code === "ENOENT";
    if (!isNotFound) {
      throw err;
    }
  }

  // Append-only: never overwrite an existing entry
  if (!(slug in manifest)) {
    manifest[slug] = entry;
    await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
  }
}
