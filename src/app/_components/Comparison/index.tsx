import { COMPARISON_ROWS } from "@/data/comparison";
import ComparisonRow from "./ComparisonRow";

/**
 * Comparison section — eyebrow + title + 3-col table.
 *
 * Does NOT use SectionHeader — the eyebrow+title format from variant-editorial
 * replaces it for this section only.
 *
 * Column order: Dimension | AIDE | OpenSpec (AIDE is the emphasized middle column).
 */
export default function Comparison() {
  return (
    <div>
      {/* Eyebrow + title */}
      <p
        className="font-mono uppercase text-[11px] text-[color:var(--color-accent)] mb-[12px]"
        style={{ letterSpacing: "1.5px" }}
      >
        AIDE vs. SPEC-FIRST ALTERNATIVES
      </p>
      <h2 className="text-[22px] font-semibold text-[color:var(--color-fg)] mb-[28px]">
        Heavier. More opinionated. More hands-off.
      </h2>

      {/* Table — overflow-x-auto at mobile so page doesn't scroll horizontally */}
      <div className="overflow-x-auto">
      <div
        className="overflow-hidden min-w-[480px]"
        style={{
          borderRadius: "8px",
          border: "1px solid rgba(232,223,206,0.12)",
          background: "var(--color-card-2)",
        }}
      >
        {/* Header row */}
        <div
          className="grid font-mono"
          style={{
            gridTemplateColumns: "1.2fr 1fr 1fr",
            background: "var(--color-card)",
            borderBottom: "1px solid rgba(232,223,206,0.12)",
          }}
        >
          <div
            className="text-[color:var(--color-dim)] text-[11px] uppercase"
            style={{ padding: "14px 24px", letterSpacing: "1.5px" }}
          >
            Dimension
          </div>
          <div
            className="text-[color:var(--color-accent)] text-[11px] uppercase"
            style={{ padding: "14px 24px", letterSpacing: "1.5px" }}
          >
            AIDE
          </div>
          <div
            className="text-[color:var(--color-dim)] text-[11px] uppercase"
            style={{ padding: "14px 24px", letterSpacing: "1.5px" }}
          >
            OpenSpec
          </div>
        </div>

        {/* Data rows */}
        {COMPARISON_ROWS.map((row, i) => (
          <ComparisonRow
            key={row.dimension}
            dimension={row.dimension}
            aide={row.aide}
            openspec={row.openspec}
            isLast={i === COMPARISON_ROWS.length - 1}
          />
        ))}
      </div>
      </div>
    </div>
  );
}
