import type { LearnSlug } from '@/types/learn';

/**
 * The /learn pages whose FAQ and glossary get FAQPage and DefinedTerm records:
 * the definition page and the SDLC page. Other pages' FAQs render visibly with
 * no record.
 */
const richRecordSlugs = [
  'intent-driven-engineering',
  'open-source-agentic-sdlc-framework',
] as const satisfies readonly LearnSlug[];

export default richRecordSlugs;
