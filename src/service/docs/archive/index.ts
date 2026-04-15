import type { BuildManifestEntry, ContentType } from "@/types/docs";
import type { FeedEntry } from "@/types/feed";
import saveToWayback from "./saveToWayback";
import updateManifest from "./updateManifest";
import writeFeedEntry from "./writeFeedEntry";

export type ArchiveDocInput = {
  versionedUrl: string;
  slug: string;
  sourceCommit: string;
  publishedAt: string;
  contentType: ContentType;
};

/**
 * archiveDoc
 *
 * Orchestrates the publish-time archive pipeline:
 *   1. saveToWayback    — POST to Wayback Save Page Now, poll, return archive URL
 *   2. updateManifest   — Append new entry to build-manifest.json (append-only)
 *   3. writeFeedEntry   — Append Atom 1.0 entry to public/feed.xml (append-only)
 *
 * Each step blocks the next on failure. If Wayback fails after 3 retries,
 * this function throws and the publish is aborted. Silent failure is not an option.
 *
 * @returns The completed BuildManifestEntry including the Wayback archive URL
 */
export default async function archiveDoc(
  input: ArchiveDocInput
): Promise<BuildManifestEntry> {
  const { versionedUrl, slug, sourceCommit, publishedAt, contentType } = input;

  // Step 1: Submit to Wayback — throws on 4th failure, blocking the publish
  const waybackUrl = await saveToWayback(versionedUrl);

  // Step 2: Append to build-manifest.json
  const manifestEntry: BuildManifestEntry = {
    live: versionedUrl,
    sourceCommit,
    publishedAt,
    wayback: waybackUrl,
  };
  await updateManifest(slug, manifestEntry);

  // Step 3: Append to public/feed.xml
  const file = slug.includes("@") ? `${slug.split("@")[0]}.md` : `${slug}.md`;
  const summary =
    `aidemd.dev ${contentType}: ${file} updated. ` +
    `Source commit ${sourceCommit}. ` +
    `Live: ${versionedUrl}. ` +
    `Archived: ${waybackUrl}.`;

  const feedEntry: FeedEntry = {
    title: file,
    id: versionedUrl,
    publishedAt,
    liveUrl: versionedUrl,
    waybackUrl,
    summary,
  };
  await writeFeedEntry(feedEntry);

  return manifestEntry;
}
