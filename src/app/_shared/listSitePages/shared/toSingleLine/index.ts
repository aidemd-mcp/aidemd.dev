/**
 * Collapses every whitespace run, newlines included, to one space and trims,
 * so a title or description is always the single line the llms.txt composer
 * and the metadata tags require.
 */
export default function toSingleLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}
