import { describe, it, expect } from 'vitest';
import extractBodyFirstSentence from './index';

describe('extractBodyFirstSentence', () => {
  it('returns the first sentence from a plain paragraph', () => {
    const body = 'The quick brown fox jumps over the lazy dog. And then some more text follows.';
    expect(extractBodyFirstSentence(body)).toBe('The quick brown fox jumps over the lazy dog.');
  });

  it('returns the full paragraph if no sentence boundary exists', () => {
    const body = 'This is a single sentence with no trailing period break';
    expect(extractBodyFirstSentence(body)).toBe(
      'This is a single sentence with no trailing period break',
    );
  });

  it('skips leading blank lines before finding the paragraph', () => {
    const body = '\n\nActual content starts here. Second sentence.';
    expect(extractBodyFirstSentence(body)).toBe('Actual content starts here.');
  });

  it('skips ATX headings and returns the next paragraph', () => {
    const body = '## Section Heading\n\nFirst real paragraph. Second sentence.';
    expect(extractBodyFirstSentence(body)).toBe('First real paragraph.');
  });

  it('skips blockquotes and returns the next paragraph', () => {
    const body =
      '> **For agents: this file is a scaffold, not a reference.**\n\nReal paragraph. Second sentence.';
    expect(extractBodyFirstSentence(body)).toBe('Real paragraph.');
  });

  it('skips fenced code block delimiters', () => {
    const body = '```typescript\nconst x = 1;\n```\n\nReal paragraph here.';
    expect(extractBodyFirstSentence(body)).toBe('Real paragraph here.');
  });

  it('skips unordered list items', () => {
    const body = '- item one\n- item two\n\nFirst real paragraph.';
    expect(extractBodyFirstSentence(body)).toBe('First real paragraph.');
  });

  it('skips ordered list items', () => {
    const body = '1. First step\n2. Second step\n\nReal paragraph.';
    expect(extractBodyFirstSentence(body)).toBe('Real paragraph.');
  });

  it('skips table rows', () => {
    const body = '| Col A | Col B |\n| --- | --- |\n\nReal paragraph.';
    expect(extractBodyFirstSentence(body)).toBe('Real paragraph.');
  });

  it('strips bold markdown from the sentence', () => {
    const body =
      '**Autonomous Intent-Driven Engineering (AIDE)** puts intent at the center. More text.';
    expect(extractBodyFirstSentence(body)).toBe(
      'Autonomous Intent-Driven Engineering (AIDE) puts intent at the center.',
    );
  });

  it('strips italic markdown from the sentence', () => {
    const body = 'Code structured so understanding deepens *on demand*, not all at once. More.';
    expect(extractBodyFirstSentence(body)).toBe(
      'Code structured so understanding deepens on demand, not all at once.',
    );
  });

  it('strips link markdown from the sentence', () => {
    const body =
      'The verification loop of [AIDE](./aide-spec.md). Spec documents define what correct output looks like.';
    expect(extractBodyFirstSentence(body)).toBe('The verification loop of AIDE.');
  });

  it('strips image markdown from the sentence', () => {
    const body = 'See ![diagram](./diagram.png) for details. More text.';
    expect(extractBodyFirstSentence(body)).toBe('See diagram for details.');
  });

  it('strips backtick code from the sentence', () => {
    const body =
      'A short `.aide` doc lives next to the code it governs. And that doc is the contract.';
    expect(extractBodyFirstSentence(body)).toBe('A short .aide doc lives next to the code it governs.');
  });

  it('joins wrapped paragraph lines before extracting the first sentence', () => {
    const body =
      'This is the first line of a paragraph\nthat wraps onto the second line. Second sentence here.';
    expect(extractBodyFirstSentence(body)).toBe(
      'This is the first line of a paragraph that wraps onto the second line.',
    );
  });

  it('trims output at 200 characters at a word boundary', () => {
    const longSentence =
      'This is an extremely long sentence that goes on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on until it exceeds two hundred characters.';
    const result = extractBodyFirstSentence(longSentence);
    expect(result).not.toBeNull();
    expect(result!.length).toBeLessThanOrEqual(204); // 200 + "…"
    expect(result).toMatch(/…$/);
  });

  it('uses blockquote text as fallback when no regular paragraph exists', () => {
    // Models aide-template.md: blockquote intro, then ordered list steps, then headings.
    const body =
      '> **For agents: this file is a scaffold, not a reference.** If you are creating a new file.\n\n## How to use\n\n1. Create the file.\n2. Copy the template.';
    expect(extractBodyFirstSentence(body)).toBe(
      'For agents: this file is a scaffold, not a reference.',
    );
  });

  it('prefers regular paragraph over blockquote when both exist', () => {
    const body =
      '> **Agent:** This command is executed by the aide-implementor agent.\n\nExecute the implementation plan. This is the build phase.';
    // Regular paragraph comes after the blockquote — should be preferred.
    expect(extractBodyFirstSentence(body)).toBe('Execute the implementation plan.');
  });

  it('returns undefined when the body is entirely headings and lists (e.g. hub page)', () => {
    const body =
      '## Section One\n\n- [link one](./one.md)\n- [link two](./two.md)\n\n## Section Two\n\n- [link three](./three.md)';
    expect(extractBodyFirstSentence(body)).toBeUndefined();
  });

  it('returns undefined for empty body', () => {
    expect(extractBodyFirstSentence('')).toBeUndefined();
  });

  it('returns undefined for whitespace-only body', () => {
    expect(extractBodyFirstSentence('   \n\n  ')).toBeUndefined();
  });
});
