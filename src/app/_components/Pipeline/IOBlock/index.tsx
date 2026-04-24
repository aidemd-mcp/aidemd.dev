interface IOBlockProps {
  label: "reads" | "writes";
  items: string[];
}

/**
 * Reads/Writes block in the stage panel right column.
 * Uppercase 10px label + stacked items with left accent or dim border.
 */
export default function IOBlock({ label, items }: IOBlockProps) {
  const isWrite = label === "writes";

  return (
    <div>
      <div
        className="font-mono text-[10px] text-[color:var(--color-dim)] uppercase mb-[6px]"
        style={{ letterSpacing: "1.5px" }}
      >
        {label}
      </div>
      <div className="flex flex-col gap-[4px]">
        {items.map((item, i) => (
          <div
            key={i}
            className="font-mono text-[12px] text-[color:var(--color-fg)] bg-[color:var(--color-bg)] border border-[color:var(--color-border)] rounded-[4px]"
            style={{
              padding: "6px 10px",
              borderLeft: `2px solid ${isWrite ? "var(--color-accent)" : "var(--color-dim)"}`,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
