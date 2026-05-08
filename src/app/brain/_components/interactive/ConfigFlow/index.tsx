'use client';

import { useState } from 'react';
import cn from '@/lib/cn';
import Callout from '@/app/brain/_components/primitives/Callout';

type FlowState = 'null' | 'string' | 'seeded';

const BUTTONS: { id: FlowState; label: string }[] = [
  { id: 'null', label: 'args last entry: YAML null' },
  { id: 'string', label: 'args last entry: "/Users/me/vault"' },
  { id: 'seeded', label: 'after restart + seed' },
];

// Verbatim step tuples from JSX lines 304–317.
const WIRING_STEPS: [string, string][] = [
  ['1', 'read brain.aide → quote last args entry'],
  ['2', 'YAML null detected — ask user for value'],
  ['3', 'edit brain.aide → land resolved value'],
  ['4', 'run npx aidemd-mcp sync'],
  ['STOP', 'emit "restart Claude Code" message and end'],
];

const SEEDING_STEPS: [string, string][] = [
  ['1', 'read brain.aide → string detected, brain wired'],
  ['2', 'verify mcp__brain__* tools loaded in session'],
  ['3', 'for each: presence-check via list tool'],
  ['4', 'if missing → write_note from seed-section bytes'],
  ['5', 'emit completion summary; brain ready'],
];

interface FlowColProps {
  label: string;
  active: boolean;
  steps: [string, string][];
}

/**
 * Single column in the WIRING/SEEDING grid.
 * Active: card bg, accent border, opacity 1.
 * Inactive: transparent bg, border, opacity 0.4.
 * Matches JSX lines 328–347 (FlowCol component).
 */
function FlowCol({ label, active, steps }: FlowColProps) {
  return (
    <div
      className={cn(
        'px-[16px] py-[14px] border rounded-[6px] transition-all duration-200',
        active
          ? 'bg-[color:var(--color-card)] border-[color:var(--color-accent)]'
          : 'bg-transparent border-[color:var(--color-border)]'
      )}
      style={{ opacity: active ? 1 : 0.4 }}
    >
      <div
        className={cn(
          'text-[11px] tracking-[1.5px] mb-[10px]',
          active
            ? 'text-[color:var(--color-accent)]'
            : 'text-[color:var(--color-dim)]'
        )}
      >
        {label}{active ? ' · runs' : ' · skipped'}
      </div>
      {steps.map(([n, s], i) => (
        <div key={i} className="flex gap-[10px] py-[5px] text-[12px] text-[color:var(--color-fg)]">
          <span className="text-[color:var(--color-accent)] w-[30px] text-[10px] shrink-0">{n}</span>
          <span>{s}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * /aide:brain config flow visualizer.
 * JSX source: brain-shared.jsx lines 279–326.
 *
 * Props: none.
 * State:
 *   - state: 'null' | 'string' | 'seeded' (default 'null')
 *
 * Behavior:
 *   - state === 'null': WIRING column active, SEEDING column inactive (opacity 0.4)
 *   - state === 'string': SEEDING column active, WIRING column inactive (opacity 0.4)
 *   - state === 'seeded': BOTH columns inactive (opacity 0.4), success callout renders below
 *
 * The seeded callout body matches JSX line 321 verbatim.
 */
export default function ConfigFlow() {
  const [state, setState] = useState<FlowState>('null');

  const isWiring = state === 'null';
  const isSeeding = state === 'string';

  return (
    <div className="font-mono text-[12.5px]">
      {/* state buttons */}
      <div className="flex flex-wrap gap-[6px] mb-[14px]">
        {BUTTONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setState(s.id)}
            className={cn(
              'px-[12px] py-[6px] font-mono text-[11px] border rounded-[4px] cursor-pointer transition-colors',
              state === s.id
                ? 'bg-[color:var(--color-accent)] text-[#0d0b08] border-[color:var(--color-accent)]'
                : 'bg-transparent text-[color:var(--color-fg)] border-[color:var(--color-border)]'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 2-column WIRING / SEEDING grid — stacks to single col below md */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
        <FlowCol label="WIRING flow" active={isWiring} steps={WIRING_STEPS} />
        <FlowCol label="SEEDING flow" active={isSeeding} steps={SEEDING_STEPS} />
      </div>

      {/* success callout — only in seeded state (JSX lines 319–323) */}
      {state === 'seeded' && (
        <Callout kind="success" className="mt-[14px]">
          <span className="text-[color:var(--color-good)]">✓</span>{' '}
          brain wired and seeded — boot reporter shows{' '}
          <span className="text-[color:var(--color-good)]">ok</span>
          . you can now run{' '}
          <span className="text-[color:var(--color-accent)]">/aide</span>{' '}
          normally.
        </Callout>
      )}
    </div>
  );
}
