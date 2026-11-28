import type { GlossaryTerm, LearnBlock } from '@/types/learn';
import renderRichText from '../renderRichText';

/** Picks a fence one backtick longer than the longest backtick run in the code, never shorter than three. */
function chooseFence(code: string): string {
  const longestRun = Math.max(0, ...(code.match(/`+/g) ?? []).map((run) => run.length));
  return '`'.repeat(Math.max(3, longestRun + 1));
}

/** Writes one glossary entry as a bold term and its definition. */
function renderTerm(term: GlossaryTerm): string {
  return `- **${term.term}**: ${renderRichText(term.definition)}`;
}

/**
 * Renders one content block of a /learn section as markdown: a paragraph as
 * its prose, a list as dash lines, code as a fenced block with its language,
 * a glossary as one bold-term line per entry.
 */
export default function renderBlock(block: LearnBlock): string {
  switch (block.kind) {
    case 'paragraph':
      return renderRichText(block.text);
    case 'list':
      return block.items.map((item) => `- ${renderRichText(item)}`).join('\n');
    case 'code': {
      const fence = chooseFence(block.code);
      return `${fence}${block.lang}\n${block.code}\n${fence}`;
    }
    case 'glossary':
      return block.terms.map(renderTerm).join('\n');
  }
}
