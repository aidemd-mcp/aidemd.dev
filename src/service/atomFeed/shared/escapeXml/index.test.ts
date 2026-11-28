import { describe, it, expect } from 'vitest';
import escapeXml from './index';

describe('escapeXml', () => {
  it.each([
    ['&', '&amp;'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['"', '&quot;'],
    ["'", '&apos;'],
  ])('escapes %s', (raw, escaped) => {
    expect(escapeXml(raw)).toBe(escaped);
  });

  it('escapes every special character in running text', () => {
    expect(escapeXml('a & b < c')).toBe('a &amp; b &lt; c');
  });

  it('treats input as raw text and escapes an existing entity again', () => {
    expect(escapeXml('&amp;')).toBe('&amp;amp;');
  });

  it.each(['plain text', 'café', 'a — b', 'rocket 🚀', 'tab\there', 'line\nbreak', 'carriage\rreturn'])(
    'passes %j unchanged',
    (text) => {
      expect(escapeXml(text)).toBe(text);
    },
  );

  it.each(['\u0001', '\u000B', '\u0000', '￾', '\uD800', '\uDC00'])(
    'throws on forbidden character %j',
    (character) => {
      expect(() => escapeXml(`a${character}b`)).toThrow(/XML 1\.0 forbids/);
    },
  );

  it('names the offending code point', () => {
    expect(() => escapeXml('x\u0001')).toThrow('U+0001');
  });
});
