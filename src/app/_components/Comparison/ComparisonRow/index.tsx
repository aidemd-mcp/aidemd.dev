interface ComparisonRowProps {
  dimension: string;
  aide: string;
  openspec: string;
  isLast?: boolean;
}

/**
 * Single row in the comparison table.
 *
 * Column order: Dimension | AIDE | OpenSpec (AIDE in the middle — load-bearing).
 * Grid: grid-cols-[1.2fr_1fr_1fr]. Cell padding 14px 24px.
 * Dimension → dim 12px mono; AIDE → solid fg 13px weight-500; OpenSpec → dim 13px.
 */
export default function ComparisonRow({
  dimension,
  aide,
  openspec,
  isLast = false,
}: ComparisonRowProps) {
  return (
    <div
      className="grid font-mono"
      style={{
        gridTemplateColumns: "1.2fr 1fr 1fr",
        borderBottom: isLast ? "none" : "1px solid rgba(232,223,206,0.12)",
      }}
    >
      {/* Dimension */}
      <div
        className="text-[color:var(--color-dim)] text-[12px]"
        style={{ padding: "14px 24px" }}
      >
        {dimension}
      </div>
      {/* AIDE — emphasized middle column */}
      <div
        className="text-[color:var(--color-fg)] text-[13px] font-medium"
        style={{ padding: "14px 24px" }}
      >
        {aide}
      </div>
      {/* OpenSpec */}
      <div
        className="text-[color:var(--color-dim)] text-[13px]"
        style={{ padding: "14px 24px" }}
      >
        {openspec}
      </div>
    </div>
  );
}
