interface RecipeWorkedProps {
  tools: string;
  slot: string;
  wiring: string;
  seeding: string;
}

/**
 * Worked-example block for filesystem/notion recipes.
 * Maps to JSX `<RecipeWorked/>` (lines 246–268).
 *
 * Layout (vertical):
 *   1. "MCP TOOLS EXPOSED" dim eyebrow + accent tools line
 *   2. "UNWIRED SLOT(S)" dim eyebrow + monospace slot block (card bg, border, 4px radius)
 *   3. 2-col grid: WIRING card + SEEDING card (both with accent border-left 2px)
 *
 * Server component.
 */
export default function RecipeWorked({
  tools,
  slot,
  wiring,
  seeding,
}: RecipeWorkedProps) {
  return (
    <div>
      {/* MCP TOOLS EXPOSED */}
      <div className="text-[11px] text-[color:var(--color-dim)] tracking-[1px] mb-[4px]">
        MCP TOOLS EXPOSED
      </div>
      <div className="text-[12px] text-[color:var(--color-accent)] font-mono mb-[18px]">
        {tools}
      </div>

      {/* UNWIRED SLOT(S) */}
      <div className="text-[11px] text-[color:var(--color-dim)] tracking-[1px] mb-[4px]">
        UNWIRED SLOT(S)
      </div>
      <div className="text-[13px] text-[color:var(--color-fg)] font-mono mb-[18px] px-[12px] py-[8px] bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded">
        {slot}
      </div>

      {/* WIRING + SEEDING 2-col grid — stacks to single col below md */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
        <div
          className="px-[16px] py-[14px] bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded"
          style={{ borderLeft: "2px solid var(--color-accent)" }}
        >
          <div className="text-[11px] text-[color:var(--color-accent)] tracking-[1.2px] mb-[8px]">
            WIRING
          </div>
          <div className="text-[12.5px] text-[color:var(--color-fg)] leading-[1.7]">
            {wiring}
          </div>
        </div>
        <div
          className="px-[16px] py-[14px] bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded"
          style={{ borderLeft: "2px solid var(--color-accent)" }}
        >
          <div className="text-[11px] text-[color:var(--color-accent)] tracking-[1.2px] mb-[8px]">
            SEEDING
          </div>
          <div className="text-[12.5px] text-[color:var(--color-fg)] leading-[1.7]">
            {seeding}
          </div>
        </div>
      </div>
    </div>
  );
}
