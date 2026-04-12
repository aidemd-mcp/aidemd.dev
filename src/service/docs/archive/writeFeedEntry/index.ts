import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { FeedEntry } from "@/types/feed";

const FEED_PATH = path.resolve(process.cwd(), "public/feed.xml");

const FEED_ID = "https://aidemd.dev/docs/feed";
const FEED_TITLE = "aidemd.dev docs";
const ATOM_NS = "http://www.w3.org/2005/Atom";

/**
 * writeFeedEntry
 *
 * Appends a new Atom 1.0 entry to public/feed.xml.
 * Creates a valid Atom 1.0 feed if the file does not exist.
 * If the file exists, inserts the new entry before the closing </feed> tag.
 * The feed and its entries are append-only — existing entries are never mutated.
 *
 * Summary template (fixed, no variation):
 *   "aidemd.dev docs: <file> updated. Source commit <sha>. Live: <url>. Archived: <wayback-url>."
 *
 * GUID is the versioned URL (stable and unique per published version).
 *
 * @param entry - The feed entry to append
 */
export default async function writeFeedEntry(entry: FeedEntry): Promise<void> {
  const entryXml = renderEntry(entry);

  let existingContent: string | null = null;

  try {
    existingContent = await readFile(FEED_PATH, "utf-8");
  } catch (err) {
    const isNotFound =
      err instanceof Error && "code" in err && err.code === "ENOENT";
    if (!isNotFound) {
      throw err;
    }
  }

  let feedXml: string;

  if (existingContent === null) {
    feedXml = buildNewFeed(entryXml, entry.publishedAt);
  } else {
    feedXml = insertEntry(existingContent, entryXml, entry.publishedAt);
  }

  await writeFile(FEED_PATH, feedXml, "utf-8");
}

function renderEntry(entry: FeedEntry): string {
  return [
    `  <entry>`,
    `    <title>${escapeXml(entry.title)}</title>`,
    `    <id>${escapeXml(entry.id)}</id>`,
    `    <published>${escapeXml(entry.publishedAt)}</published>`,
    `    <link href="${escapeXml(entry.liveUrl)}"/>`,
    `    <summary>${escapeXml(entry.summary)}</summary>`,
    `  </entry>`,
  ].join("\n");
}

function buildNewFeed(entryXml: string, updatedAt: string): string {
  return [
    `<?xml version="1.0" encoding="utf-8"?>`,
    `<feed xmlns="${ATOM_NS}">`,
    `  <id>${escapeXml(FEED_ID)}</id>`,
    `  <title>${escapeXml(FEED_TITLE)}</title>`,
    `  <link href="${escapeXml(FEED_ID)}" rel="self"/>`,
    `  <updated>${escapeXml(updatedAt)}</updated>`,
    entryXml,
    `</feed>`,
  ].join("\n");
}

function insertEntry(
  existing: string,
  entryXml: string,
  updatedAt: string
): string {
  // Update the <updated> element to the latest publish time
  const withUpdatedTimestamp = existing.replace(
    /<updated>[^<]*<\/updated>/,
    `<updated>${escapeXml(updatedAt)}</updated>`
  );

  const closingTag = "</feed>";
  const insertionIndex = withUpdatedTimestamp.lastIndexOf(closingTag);

  if (insertionIndex === -1) {
    throw new Error(
      "feed.xml does not contain a closing </feed> tag — the file may be malformed"
    );
  }

  return (
    withUpdatedTimestamp.slice(0, insertionIndex) +
    entryXml +
    "\n" +
    withUpdatedTimestamp.slice(insertionIndex)
  );
}

function escapeXml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
