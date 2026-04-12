import matter from "gray-matter";

export type ParsedSource = {
  frontmatter: Record<string, unknown>;
  body: string;
};

/**
 * Extracts YAML frontmatter from raw markdown source.
 * Preserves all frontmatter fields without modification.
 * Returns the frontmatter as a plain object and the markdown body without the frontmatter block.
 */
export default function parseFrontmatter(rawSource: string): ParsedSource {
  const { data, content } = matter(rawSource);
  return {
    frontmatter: data as Record<string, unknown>,
    body: content,
  };
}
