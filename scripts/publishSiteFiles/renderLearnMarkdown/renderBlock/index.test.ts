import { describe, expect, it } from 'vitest';
import type { LearnBlock } from '@/types/learn';
import renderBlock from './index';

describe('renderBlock', () => {
  it('renders a paragraph as its prose', () => {
    const block: LearnBlock = {
      kind: 'paragraph',
      text: [
        { kind: 'text', text: 'Read the ' },
        { kind: 'link', text: 'hooks', href: '/docs/hooks/' },
        { kind: 'text', text: '.' },
      ],
    };
    expect(renderBlock(block)).toBe('Read the [hooks](https://aidemd.dev/docs/hooks/).');
  });

  it('renders a list as one dash line per item', () => {
    const block: LearnBlock = {
      kind: 'list',
      items: [[{ kind: 'text', text: 'first' }], [{ kind: 'text', text: 'second' }]],
    };
    expect(renderBlock(block)).toBe('- first\n- second');
  });

  it('renders code as a fenced block with its language, verbatim', () => {
    const block: LearnBlock = { kind: 'code', lang: 'bash', code: 'npx @aidemd-mcp/server@latest sync\necho "_*"' };
    expect(renderBlock(block)).toBe('```bash\nnpx @aidemd-mcp/server@latest sync\necho "_*"\n```');
  });

  it('lengthens the fence when the code contains a triple backtick', () => {
    const block: LearnBlock = { kind: 'code', lang: 'md', code: '```ts\nx\n```' };
    expect(renderBlock(block)).toBe('````md\n```ts\nx\n```\n````');
  });

  it('renders a glossary as one bold-term line per entry', () => {
    const block: LearnBlock = {
      kind: 'glossary',
      terms: [
        { id: 'intent', term: 'Intent', definition: [{ kind: 'text', text: 'What counts as correct.' }] },
        { id: 'brief', term: 'Brief', definition: [{ kind: 'text', text: 'The shape it must take.' }] },
      ],
    };
    expect(renderBlock(block)).toBe('- **Intent**: What counts as correct.\n- **Brief**: The shape it must take.');
  });
});
