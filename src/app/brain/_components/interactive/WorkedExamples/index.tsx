'use client';

import { useState } from 'react';
import Chip from '@/app/brain/_components/primitives/Chip';
import Eyebrow from '@/app/brain/_components/primitives/Eyebrow';
import CodeBlock from '@/app/brain/_components/primitives/CodeBlock';
import { WORKED_EXAMPLES, type WorkedExampleKey } from '@/app/brain/_data/workedExamples';

/**
 * Worked examples tab surface for the Walkthrough §05 sub-C.
 * JSX source: brain-variant-walkthrough.jsx lines 251–334.
 *
 * Props: none.
 * State:
 *   - tab: WorkedExampleKey (default 'filesystem', per JSX line 252)
 *
 * Layout (vertical):
 *   1. Horizontal Chip strip across 3 keys — each Chip shows ex.label
 *   2. Body card:
 *      - ex.blurb paragraph
 *      - "MCP TOOLS EXPOSED" eyebrow + ex.tools accent line
 *      - 2-col grid: CodeBlock(frontmatter args) | CodeBlock(aide-orientation excerpt)
 *      - Full-width CodeBlock(aide-config excerpt)
 *
 * Data source: WORKED_EXAMPLES from _data/workedExamples.ts (NOT backendPresets).
 */
export default function WorkedExamples() {
  const [tab, setTab] = useState<WorkedExampleKey>('filesystem');
  const ex = WORKED_EXAMPLES[tab];

  return (
    <div>
      {/* tab strip */}
      <div className="flex gap-[6px] mb-[14px]">
        {(Object.keys(WORKED_EXAMPLES) as WorkedExampleKey[]).map((k) => (
          <Chip
            key={k}
            active={tab === k}
            onClick={() => setTab(k)}
          >
            {WORKED_EXAMPLES[k].label}
          </Chip>
        ))}
      </div>

      {/* body card */}
      <div className="bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-[8px] p-[22px]">
        {/* blurb */}
        <p className="text-[13px] text-[color:var(--color-fg)] leading-[1.7] mb-[14px] m-0">
          {ex.blurb}
        </p>

        {/* tools row */}
        <Eyebrow className="mb-[4px]">MCP TOOLS EXPOSED</Eyebrow>
        <div className="text-[12px] text-[color:var(--color-accent)] mb-[16px] font-mono">
          {ex.tools}
        </div>

        {/* 2-col grid: args | orientation — stacks to single col below md */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
          <CodeBlock label="frontmatter args" code={ex.args} />
          <CodeBlock label="aide-orientation (excerpt)" code={ex.orient} />
        </div>

        {/* full-width config */}
        <CodeBlock label="aide-config (excerpt)" code={ex.config} />
      </div>
    </div>
  );
}
