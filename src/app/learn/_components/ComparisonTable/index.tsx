import templateLabels from "@/data/learn/templateLabels";
import type { ComparisonCell, ComparisonTable as ComparisonTableRecord } from "@/types/learn";

interface ComparisonTableProps {
  table: ComparisonTableRecord;
}

const CAPTION_ID = "comparison-caption";

/** A cell's visible string: its text, plus " (as of <date>)" when it carries a date. */
function formatCell(cell: ComparisonCell): string {
  return cell.asOf ? `${cell.text} (${templateLabels.asOfPrefix} ${cell.asOf})` : cell.text;
}

/**
 * A semantic comparison table. The caption is a paragraph the table is labelled
 * by, because docs prose styles a paragraph and has no caption style. The first
 * cell of each row is its row header; every dated number shows its as-of date.
 */
export default function ComparisonTable({ table }: ComparisonTableProps) {
  return (
    <>
      <p id={CAPTION_ID}>{table.caption}</p>
      <table aria-labelledby={CAPTION_ID}>
        <thead>
          <tr>
            {table.columns.map((column, index) => (
              <th key={index} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.cells.map((cell, cellIndex) =>
                cellIndex === 0 ? (
                  <th key={cellIndex} scope="row">
                    {formatCell(cell)}
                  </th>
                ) : (
                  <td key={cellIndex}>{formatCell(cell)}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
