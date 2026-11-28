import type { LearnCopy } from '@/types/learn';
import type { StructuredDataInput } from '@/types/structuredData';

/**
 * Guards the /learn branch: the FAQ and glossary records must come from the copy
 * record this page renders, never another page's, so a mismatched or missing copy
 * fails the build instead of shipping the wrong text.
 */
export default function requireLearnCopy({ page, copy }: StructuredDataInput): LearnCopy {
  if (copy === undefined || page.urlPath !== `/learn/${copy.slug}/`) {
    throw new Error(`structuredData: /learn page ${page.urlPath} needs its own copy record`);
  }
  return copy;
}
