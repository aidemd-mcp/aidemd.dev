import { describe, it, expect } from 'vitest';
import stripLeadingTitle from './index';

describe('stripLeadingTitle', () => {
  it.each([
    {
      name: 'removes a matching H1 and the blank lines after it',
      markdown: '# Intro\n\n\nBody text.\n',
      expected: 'Body text.\n',
    },
    {
      name: 'removes a matching H1 after leading blank lines',
      markdown: '\n\n# Intro\n\nBody text.\n',
      expected: 'Body text.\n',
    },
    {
      name: 'keeps an H1 with different text',
      markdown: '# Other\n\nBody text.\n',
      expected: '# Other\n\nBody text.\n',
    },
    {
      name: 'keeps text that starts with an H2',
      markdown: '## Intro\n\nBody text.\n',
      expected: '## Intro\n\nBody text.\n',
    },
    {
      name: 'keeps an H1 that is not the first non-blank line',
      markdown: 'Lead paragraph.\n\n# Intro\n\nBody text.\n',
      expected: 'Lead paragraph.\n\n# Intro\n\nBody text.\n',
    },
    {
      name: 'leaves an internal matching H1 further down untouched',
      markdown: '# Intro\n\nBody.\n\n# Intro\n\nMore.\n',
      expected: 'Body.\n\n# Intro\n\nMore.\n',
    },
  ])('$name', ({ markdown, expected }) => {
    expect(stripLeadingTitle({ markdown, title: 'Intro' })).toBe(expected);
  });
});
