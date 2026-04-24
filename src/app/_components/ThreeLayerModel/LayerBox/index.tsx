interface LayerBoxProps {
  label: string;
  title: string;
  body: string;
}

/**
 * A single layer card in the three-layer model section.
 * accent left-border, uppercase label, accent title, fg body.
 */
export default function LayerBox({ label, title, body }: LayerBoxProps) {
  return (
    <div className="bg-[color:var(--color-card)] border border-[color:var(--color-border)] border-l-2 border-l-[color:var(--color-accent)] rounded-[4px] p-[16px_18px]">
      <div className="text-[11px] uppercase tracking-[1px] text-[color:var(--color-dim)] mb-[8px]">
        {label}
      </div>
      <div className="text-[13px] text-[color:var(--color-accent)] font-mono mb-[10px]">
        {title}
      </div>
      <div className="text-[13px] leading-[1.6] text-[color:var(--color-fg)]">
        {body}
      </div>
    </div>
  );
}
