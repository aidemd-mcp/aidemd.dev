import { describe, expect, it } from 'vitest';
import type { FaqItem } from '@/types/learn';
import buildFaqPage from './index';

function makeFaqItem(overrides: Partial<FaqItem> = {}): FaqItem {
  return {
    question: 'What is intent-driven engineering?',
    answer: [{ kind: 'text', text: 'A way of building from a written intent.' }],
    ...overrides,
  };
}

describe('buildFaqPage', () => {
  it('keeps question strings byte-identical', () => {
    const question = '  Is it   spec-driven? ';
    const node = buildFaqPage([makeFaqItem({ question })]);
    expect(node.mainEntity[0].name).toBe(question);
  });

  it('yields only the visible words of an answer that contains a link run', () => {
    const node = buildFaqPage([
      makeFaqItem({
        answer: [
          { kind: 'text', text: 'Read ' },
          { kind: 'link', text: 'the hooks docs', href: '/docs/hooks/' },
          { kind: 'text', text: ' first.' },
        ],
      }),
    ]);
    const text = node.mainEntity[0].acceptedAnswer.text;
    expect(text).toBe('Read the hooks docs first.');
    expect(text).not.toContain('/docs/hooks/');
  });

  it('preserves count and order', () => {
    const faq = [
      makeFaqItem({ question: 'First?' }),
      makeFaqItem({ question: 'Second?' }),
      makeFaqItem({ question: 'Third?' }),
    ];
    const node = buildFaqPage(faq);
    expect(node['@type']).toBe('FAQPage');
    expect(node.mainEntity.map((entry) => entry.name)).toEqual(['First?', 'Second?', 'Third?']);
    expect(node.mainEntity.every((entry) => entry['@type'] === 'Question')).toBe(true);
    expect(node.mainEntity.every((entry) => entry.acceptedAnswer['@type'] === 'Answer')).toBe(true);
  });
});
