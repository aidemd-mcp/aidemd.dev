interface SeedRowProps {
  path: string;
  fromTag: string;
}

/**
 * Single seeding artifact row used in §03.
 * Matches brain-variant-walkthrough.jsx lines 229–238:
 * 4-column grid — accent ◆ glyph | path (fg) | ← arrow (dim) | <!-- fromTag-* --> (dim).
 * Below md: collapses to 2-col (glyph | path + tag stacked), arrow hidden.
 * Server component.
 */
export default function SeedRow({ path, fromTag }: SeedRowProps) {
  return (
    <div className="text-[12px] items-start">
      {/* Mobile layout: glyph + stacked path/tag */}
      <div className="flex md:hidden gap-[10px] items-start py-[2px]">
        <span className="text-[color:var(--color-accent)] shrink-0">◆</span>
        <div className="flex flex-col gap-[2px] min-w-0">
          <span className="text-[color:var(--color-fg)] break-all">{path}</span>
          <span className="text-[color:var(--color-dim)] break-all">{`<!-- ${fromTag}-* -->`}</span>
        </div>
      </div>
      {/* Desktop layout: 4-col grid */}
      <div
        className="hidden md:grid gap-[10px] items-center"
        style={{ gridTemplateColumns: "20px 1fr 14px 1fr" }}
      >
        <span className="text-[color:var(--color-accent)]">◆</span>
        <span className="text-[color:var(--color-fg)]">{path}</span>
        <span className="text-[color:var(--color-dim)]">←</span>
        <span className="text-[color:var(--color-dim)]">{`<!-- ${fromTag}-* -->`}</span>
      </div>
    </div>
  );
}
