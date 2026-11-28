import type { FaqItem } from '@/types/learn';
import type { FAQPageNode } from '@/types/structuredData';
import flattenRichText from '@/service/structuredData/flattenRichText';

/**
 * The FAQPage record, built from the same FAQ items the page renders, so every
 * question and answer equals the visible text and keeps its count and order.
 */
export default function buildFaqPage(faq: FaqItem[]): FAQPageNode {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: flattenRichText(item.answer) },
    })),
  };
}
