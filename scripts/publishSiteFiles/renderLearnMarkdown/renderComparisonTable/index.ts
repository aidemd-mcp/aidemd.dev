import templateLabels from '@/data/learn/templateLabels';
import type { ComparisonCell, ComparisonTable } from '@/types/learn';

/** Writes one cell as the page shows it: the text, then the as-of date in parentheses when it has one; `|` is escaped. */
function renderCell(cell: ComparisonCell): string {
  const text = cell.asOf ? `${cell.text} (${templateLabels.asOfPrefix} ${cell.asOf})` : cell.text;
  return text.replace(/\|/g, '\\|');
}

/** Joins cells into one GFM table row. */
function renderRow(cells: string[]): string {
  return `| ${cells.join(' | ')} |`;
}

/**
 * Renders a captioned comparison table as markdown: the caption as a
 * paragraph, a blank line, then a GFM table whose cells carry the same as-of
 * wording the page renders.
 */
export default function renderComparisonTable(table: ComparisonTable): string {
  const header = renderRow(table.columns.map((column) => column.replace(/\|/g, '\\|')));
  const separator = renderRow(table.columns.map(() => '---'));
  const rows = table.rows.map((row) => renderRow(row.cells.map(renderCell)));
  return `${table.caption}\n\n${[header, separator, ...rows].join('\n')}`;
}
