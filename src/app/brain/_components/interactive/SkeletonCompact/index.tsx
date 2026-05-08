'use client';

import { useState } from 'react';
import cn from '@/lib/cn';
import CopyChip from '@/app/brain/_components/primitives/CopyChip';
import { BACKEND_PRESETS, type PresetKey } from '@/app/brain/_data/backendPresets';

/**
 * Compact brain.aide skeleton generator for the Cookbook sticky right rail.
 * JSX source: brain-variant-cookbook.jsx lines 271–322.
 *
 * Props: NONE — this component owns its own backend toggle.
 * State:
 *   - backend: which preset is active (default 'obsidian')
 *
 * Layout (vertical):
 *   1. Horizontal row of 3 flex-1 backend buttons
 *   2. Label row: "brain.aide preview" + CopyChip
 *   3. <pre> with the composed file
 *
 * The compact file is simpler than SkeletonGenerator:
 *   - orientation always comes from preset (no override)
 *   - the four seed sections are summarized as a single line "(... four seed sections ...)"
 */
export default function SkeletonCompact() {
  const [backend, setBackend] = useState<PresetKey>('obsidian');
  const preset = BACKEND_PRESETS[backend];

  // Build argLines block: ~ entries → bare `-`, strings → `- "..."`.
  // Matches JSX lines 275–278.
  const argsBlock = preset.argLines
    .map((l) => {
      const isNull = l.startsWith('~');
      return isNull ? '    -' : `    - ${l}`;
    })
    .join('\n');

  // Compact file — four seed sections collapsed to one summary line (JSX line 295).
  const file = `---
name: ${preset.name}
mcpServerConfig:
  command: ${preset.command}
  args:
${argsBlock}
---

<!-- aide-orientation-start -->
${preset.orientation.trim()}
<!-- aide-orientation-end -->

<!-- aide-config-start -->
${preset.config.trim()}
<!-- aide-config-end -->

(... four seed sections ...)`;

  return (
    <div>
      {/* 3 backend buttons, each flex-1 */}
      <div className="flex gap-[4px] mb-[12px]">
        {(Object.keys(BACKEND_PRESETS) as PresetKey[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setBackend(k)}
            className={cn(
              'flex-1 px-[8px] py-[6px] font-mono text-[11px] border rounded-[4px] cursor-pointer transition-colors',
              backend === k
                ? 'bg-[color:var(--color-accent)] text-[#0d0b08] border-[color:var(--color-accent)]'
                : 'bg-transparent text-[color:var(--color-fg)] border-[color:var(--color-border)]'
            )}
          >
            {k}
          </button>
        ))}
      </div>

      {/* label row */}
      <div className="flex justify-between items-center text-[10px] text-[color:var(--color-dim)] mb-[6px]">
        <span>brain.aide preview</span>
        <CopyChip text={file} />
      </div>

      {/* preview */}
      <pre className="m-0 px-[12px] py-[10px] bg-[color:var(--color-card-2)] border border-[color:var(--color-border)] rounded-[4px] text-[10.5px] leading-[1.55] text-[color:var(--color-fg)] overflow-auto whitespace-pre max-h-[480px]">
        {file}
      </pre>
    </div>
  );
}
