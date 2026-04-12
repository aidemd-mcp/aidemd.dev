import { readFile } from "node:fs/promises";
import path from "node:path";

type HubEntry = {
  slug: string;
  title: string;
};

/**
 * Reads `.aide/index.md` and returns an ordered list of doc entries.
 *
 * Parses markdown links of the form `[title](./slug.md)` or `[title](slug.md)`.
 * The slug is the link href filename without the `.md` extension.
 * The title is the link text as written in the source.
 *
 * Throws if `.aide/index.md` cannot be read.
 */
export default async function renderHub(): Promise<HubEntry[]> {
  const indexPath = path.join(process.cwd(), ".aide", "docs", "index.md");
  const source = await readFile(indexPath, "utf-8");

  const entries: HubEntry[] = [];

  // Match markdown links: [link text](optional-./filename.md)
  const linkPattern = /\[([^\]]+)\]\(\.?\/?([\w.-]+\.md)\)/g;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(source)) !== null) {
    const title = match[1];
    const filename = match[2];
    const slug = filename.replace(/\.md$/, "");
    entries.push({ slug, title });
  }

  return entries;
}
