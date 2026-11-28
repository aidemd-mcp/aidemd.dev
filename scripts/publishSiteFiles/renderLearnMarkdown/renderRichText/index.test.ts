import { describe, expect, it } from 'vitest';
import type { RichText } from '@/types/learn';
import renderRichText from './index';

describe('renderRichText', () => {
  it('writes plain text runs as written, in order', () => {
    const text: RichText = [
      { kind: 'text', text: 'Intent first, ' },
      { kind: 'text', text: 'code second.' },
    ];
    expect(renderRichText(text)).toBe('Intent first, code second.');
  });

  it('writes a site link as a markdown link to the absolute URL', () => {
    const text: RichText = [
      { kind: 'text', text: 'See the ' },
      { kind: 'link', text: 'Stop hook', href: '/docs/hooks/' },
      { kind: 'text', text: '.' },
    ];
    expect(renderRichText(text)).toBe('See the [Stop hook](https://aidemd.dev/docs/hooks/).');
  });

  it('keeps an anchor on the absolute URL', () => {
    const text: RichText = [{ kind: 'link', text: 'terms', href: '/learn/spec-kit-alternatives/#glossary' }];
    expect(renderRichText(text)).toBe('[terms](https://aidemd.dev/learn/spec-kit-alternatives/#glossary)');
  });

  it('keeps an external https link as written', () => {
    const text: RichText = [{ kind: 'link', text: 'Spec Kit', href: 'https://github.com/github/spec-kit' }];
    expect(renderRichText(text)).toBe('[Spec Kit](https://github.com/github/spec-kit)');
  });

  it.each([
    ['a back\\slash', 'a back\\\\slash'],
    ['2 * 3', '2 \\* 3'],
    ['snake_case', 'snake\\_case'],
    ['[bracket]', '\\[bracket\\]'],
    ['<tag>', '\\<tag\\>'],
    ['# not a heading', '\\# not a heading'],
    ['mid # hash', 'mid # hash'],
  ])('escapes %j as %j', (input, expected) => {
    expect(renderRichText([{ kind: 'text', text: input }])).toBe(expected);
  });

  it('escapes the visible text of a link run', () => {
    const text: RichText = [{ kind: 'link', text: 'a_b', href: '/docs/' }];
    expect(renderRichText(text)).toBe('[a\\_b](https://aidemd.dev/docs/)');
  });
});
