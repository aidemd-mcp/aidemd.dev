import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Reads a canonical `.aide/<slug>.md` source file from the repository root.
 * Throws if the file does not exist.
 */
export default async function readSource(slug: string): Promise<string> {
  const filePath = path.join(process.cwd(), ".aide", "docs", `${slug}.md`);
  try {
    return await readFile(filePath, "utf-8");
  } catch (err) {
    const cause = err instanceof Error ? err.message : String(err);
    throw new Error(
      `renderCanonical: source file not found for slug "${slug}" at ${filePath} — ${cause}`,
    );
  }
}
