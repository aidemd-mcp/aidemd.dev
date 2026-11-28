import type { RichText } from '@/types/learn';

/**
 * Yields exactly the words a visitor sees: the in-order concatenation of every
 * run's `text`, link runs included, link `href`s dropped. FAQ
 * `acceptedAnswer.text` and DefinedTerm `description` must equal this output,
 * so nothing is inserted between runs, trimmed or collapsed.
 */
export default function flattenRichText(text: RichText): string {
  return text.map((run) => run.text).join('');
}
