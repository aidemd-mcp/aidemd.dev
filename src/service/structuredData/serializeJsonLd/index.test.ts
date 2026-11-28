import { describe, expect, it } from 'vitest';
import type { JsonLdDocument } from '@/types/structuredData';
import serializeJsonLd from './index';

function makeDocument(headline: string): JsonLdDocument {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is it?',
            acceptedAnswer: { '@type': 'Answer', text: headline },
          },
        ],
      },
    ],
  };
}

describe('serializeJsonLd', () => {
  it('escapes every < so page text cannot close the script block', () => {
    const document = makeDocument('</script><script>alert(1)</script>');

    const serialized = serializeJsonLd(document);

    expect(serialized).not.toContain('<');
    expect(serialized).toContain('\\u003c/script>');
    expect(serialized.split('\\u003c')).toHaveLength(4);
  });

  it('round-trips: parsing the output restores the original document', () => {
    const document = makeDocument('</script><script>alert(1)</script>');

    expect(JSON.parse(serializeJsonLd(document))).toEqual(document);
  });

  it('escapes an HTML comment opener in an answer', () => {
    const serialized = serializeJsonLd(makeDocument('before <!-- after'));

    expect(serialized).not.toContain('<');
    expect(serialized).toContain('\\u003c!--');
  });

  it('emits a single line with no indentation', () => {
    const serialized = serializeJsonLd(makeDocument('plain'));

    expect(serialized).not.toContain('\n');
    expect(serialized.startsWith('{"@context":"https://schema.org","@graph":[')).toBe(true);
  });
});
