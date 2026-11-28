import { describe, expect, it } from 'vitest';
import type { ComparisonTable } from '@/types/learn';
import renderComparisonTable from './index';

describe('renderComparisonTable', () => {
  it('renders the caption, a blank line, then a GFM table with as-of dates and escaped pipes', () => {
    const table: ComparisonTable = {
      caption: 'How the tools compare.',
      columns: ['Tool', 'Stars'],
      rows: [
        { cells: [{ text: 'Spec Kit' }, { text: '90k', asOf: '2026-11-01' }] },
        { cells: [{ text: 'a | b' }, { text: 'none' }] },
      ],
    };
    expect(renderComparisonTable(table)).toBe(
      [
        'How the tools compare.',
        '',
        '| Tool | Stars |',
        '| --- | --- |',
        '| Spec Kit | 90k (as of 2026-11-01) |',
        '| a \\| b | none |',
      ].join('\n'),
    );
  });
});
