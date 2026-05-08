import { MCP_TOOLS } from "@/app/brain/_data/mcpTools";

/**
 * Stacked list of MCP tool rows — 5 rows from MCP_TOOLS.
 * Matches brain-shared.jsx lines 371–399:
 * 2-col grid per row: 24px req/opt label column (left) + signature + dim why-line (right).
 * First row has border-top, all rows have border-bottom.
 * Server component.
 */
export default function MCPToolSurface() {
  return (
    <div className="font-mono">
      {MCP_TOOLS.map((t, i) => (
        <div
          key={t.sig}
          className="grid gap-[14px] px-[14px] py-[12px]"
          style={{
            gridTemplateColumns: "24px 1fr",
            borderTop: i === 0 ? "1px solid var(--color-border)" : "none",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div
            className="text-[11px]"
            style={{ color: t.required ? "var(--color-accent)" : "var(--color-dim)" }}
          >
            {t.required ? "req" : "opt"}
          </div>
          <div>
            <div className="text-[13px] text-[color:var(--color-fg)] mb-[4px]">{t.sig}</div>
            <div className="text-[12px] text-[color:var(--color-dim)] leading-[1.6]">{t.why}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
