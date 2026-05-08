interface BodySectionCardProps {
  tag: string;
  who: string;
  what: string;
}

/**
 * Body section descriptor card used in §05 sub-B.
 * Matches brain-variant-walkthrough.jsx lines 240–249:
 * card background, 1px border, 2px left accent border, 4px radius.
 * Renders: <!-- tag-* --> accent eyebrow | dim who line | fg what body.
 * Server component.
 */
export default function BodySectionCard({ tag, who, what }: BodySectionCardProps) {
  return (
    <div
      className="px-[16px] py-[14px] bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded"
      style={{ borderLeft: "2px solid var(--color-accent)" }}
    >
      <div className="text-[12px] text-[color:var(--color-accent)] mb-[4px]">{`<!-- ${tag}-* -->`}</div>
      <div className="text-[11px] text-[color:var(--color-dim)] mb-[8px]">{who}</div>
      <div className="text-[12.5px] text-[color:var(--color-fg)] leading-[1.6]">{what}</div>
    </div>
  );
}
