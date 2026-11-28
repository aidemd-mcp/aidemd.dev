import type { GlossaryTerm, LearnCopy } from '@/types/learn';
import type { DefinedTermNode, DefinedTermSetNode } from '@/types/structuredData';
import flattenRichText from '@/service/structuredData/flattenRichText';
import resolveAbsoluteUrl from '@/service/structuredData/resolveAbsoluteUrl';

/**
 * The DefinedTerm records, built from the same glossary items the page
 * renders, so names and descriptions equal the visible text and each `url`
 * lands on the term's stable anchor. A one-term glossary block is a bare
 * DefinedTerm; a block of several is one DefinedTermSet named by its section
 * heading. A copy with no glossary block yields no records.
 */
export default function buildDefinedTerms(copy: LearnCopy): (DefinedTermNode | DefinedTermSetNode)[] {
  const pageUrl = resolveAbsoluteUrl(`/learn/${copy.slug}/`);
  const toDefinedTerm = (term: GlossaryTerm): DefinedTermNode => ({
    '@type': 'DefinedTerm',
    name: term.term,
    description: flattenRichText(term.definition),
    url: `${pageUrl}#${term.id}`,
  });

  return copy.sections.flatMap((section) =>
    section.blocks.flatMap((block): (DefinedTermNode | DefinedTermSetNode)[] => {
      if (block.kind !== 'glossary') return [];
      if (block.terms.length === 1) return [toDefinedTerm(block.terms[0])];
      return [
        {
          '@type': 'DefinedTermSet',
          '@id': `${pageUrl}#${section.id}`,
          name: section.heading,
          hasDefinedTerm: block.terms.map(toDefinedTerm),
        },
      ];
    }),
  );
}
