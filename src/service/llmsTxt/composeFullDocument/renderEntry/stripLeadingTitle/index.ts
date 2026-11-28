/**
 * Drops the page text's own H1 when it only repeats the entry title, because
 * renderEntry already opens the entry with that title. Any other text — a
 * different H1, an H2 first, or the same H1 appearing later — is returned untouched.
 */
export default function stripLeadingTitle({
  markdown,
  title,
}: {
  markdown: string;
  title: string;
}): string {
  const lines = markdown.split('\n');
  const firstIndex = lines.findIndex(line => line.trim() !== '');
  if (firstIndex === -1) return markdown;
  if (lines[firstIndex] !== `# ${title}`) return markdown;

  const rest = lines.slice(firstIndex + 1);
  const bodyIndex = rest.findIndex(line => line.trim() !== '');
  if (bodyIndex === -1) return '';
  return rest.slice(bodyIndex).join('\n');
}
