import matter from 'gray-matter';
import type { DocFrontmatter } from '@/types/docs';

/** Extracts the first `# ` heading text from a markdown body, or returns undefined. */
function deriveFromFirstH1(body: string): string | undefined {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : undefined;
}

/**
 * Strips the first `# Heading` line from the body.
 * Called when the title is derived from the H1 so DocsTemplate's explicit
 * <h1> tag doesn't cause a double-heading in the rendered page.
 */
function stripFirstH1(body: string): string {
  return body.replace(/^#\s+.+\n?/m, '');
}

/**
 * Parses YAML frontmatter from a markdown file's raw content. Files without a
 * frontmatter block (e.g. .claude/commands/*.md and .claude/agents/*.md plain
 * markdown files) are treated as first-class — this function never throws on
 * missing or malformed frontmatter, returning a synthesized title instead.
 */
export default function parseDocFrontmatter(
  fileContents: string,
  slug: string,
): { frontmatter: DocFrontmatter; body: string } {
  try {
    const { data, content } = matter(fileContents);

    if (!data || Object.keys(data).length === 0) {
      // No frontmatter block — synthesize title from first H1 and strip it from body.
      const h1 = deriveFromFirstH1(content);
      return {
        frontmatter: { title: h1 ?? slug },
        body: h1 ? stripFirstH1(content) : content,
      };
    }

    // Prefer explicit title, then H1, then name (agent convention — no H1), then slug.
    const h1 = data.title ? undefined : deriveFromFirstH1(content);
    const bodyStripped = h1 ? stripFirstH1(content) : content;

    const frontmatter: DocFrontmatter = {
      title: data.title ?? h1 ?? data.name ?? slug,
      description: data.description,
      published: data.published,
      commit: data.commit,
    };

    return { frontmatter, body: bodyStripped };
  } catch {
    // gray-matter threw on unparseable content — treat the whole file as body.
    const h1 = deriveFromFirstH1(fileContents);
    return {
      frontmatter: { title: h1 ?? slug },
      body: h1 ? stripFirstH1(fileContents) : fileContents,
    };
  }
}
