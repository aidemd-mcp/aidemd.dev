'use client';

import { useState, useEffect } from 'react';
import cn from '@/lib/cn';
import CopyChip from '@/app/brain/_components/primitives/CopyChip';
import { BACKEND_PRESETS, type PresetKey } from '@/app/brain/_data/backendPresets';

/**
 * Interactive brain.aide skeleton generator.
 * JSX source: brain-shared.jsx lines 158–276.
 *
 * Props: none.
 * State:
 *   - backend: which preset is active (default 'obsidian')
 *   - name: the name label (default preset.name, resets when backend changes)
 *   - overrideOrient: whether the user is overriding orientation (default false)
 *   - orient: the orientation text (refreshed from preset unless override is on)
 *
 * Layout: 2-column grid — LEFT controls, RIGHT live preview.
 * When overrideOrient flips on: immediately seeds orient from active preset.
 * When backend changes: always updates name; updates orient only if !overrideOrient.
 */
export default function SkeletonGenerator() {
  const [backend, setBackend] = useState<PresetKey>('obsidian');
  const [name, setName] = useState<string>(BACKEND_PRESETS.obsidian.name);
  const [overrideOrient, setOverrideOrient] = useState<boolean>(false);
  const [orient, setOrient] = useState<string>(BACKEND_PRESETS.obsidian.orientation);

  // Matches JSX lines 165–168: on backend change, always refresh name;
  // refresh orient only when override is NOT active.
  useEffect(() => {
    setName(BACKEND_PRESETS[backend].name);
    if (!overrideOrient) setOrient(BACKEND_PRESETS[backend].orientation);
  }, [backend]); // eslint-disable-line react-hooks/exhaustive-deps

  const preset = BACKEND_PRESETS[backend];

  // Build argLines block: ~ entries collapse to bare `-` (with optional comment), strings to `- "..."`.
  // Matches JSX lines 170–176.
  const argsBlock = preset.argLines
    .map((l) => {
      const isNull = l.startsWith('~');
      const comment = isNull ? l.slice(1).trim() : '';
      return isNull
        ? `    -${comment ? '   ' + comment : ''}`
        : `    - ${l}`;
    })
    .join('\n');

  // Composed file string matching JSX lines 178–212.
  const file = `---
name: ${name}
mcpServerConfig:
  command: ${preset.command}
  args:
${argsBlock}
---

<!-- aide-orientation-start -->
${(overrideOrient ? orient : preset.orientation).trim()}
<!-- aide-orientation-end -->

<!-- aide-config-start -->
${preset.config.trim()}
<!-- aide-config-end -->

<!-- aide-playbook-index-start -->
# Coding Playbook
<!-- (your playbook root hub goes here) -->
<!-- aide-playbook-index-end -->

<!-- aide-study-playbook-start -->
# Study Playbook
<!-- (your navigation methodology goes here) -->
<!-- aide-study-playbook-end -->

<!-- aide-update-playbook-start -->
# Update Playbook
<!-- (your maintenance methodology goes here) -->
<!-- aide-update-playbook-end -->

<!-- aide-research-index-start -->
# Research
<!-- (your research index goes here) -->
<!-- aide-research-index-end -->`;

  function handleBackendClick(key: PresetKey) {
    setBackend(key);
    setOverrideOrient(false);
  }

  function handleOverrideChange(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setOverrideOrient(checked);
    // JSX line 247: when checking override, immediately seed orient from active preset.
    if (checked) setOrient(preset.orientation);
  }

  return (
    <div className="border border-[color:var(--color-border)] rounded-[8px] font-mono bg-[color:var(--color-card)]">
      {/* header bar */}
      <div className="px-[16px] py-[12px] border-b border-[color:var(--color-border)] text-[11px] text-[color:var(--color-accent)] tracking-[1.5px] uppercase">
        SKELETON GENERATOR · live
      </div>

      {/* 2-col grid: controls | preview — stacks to single col below md */}
      <div className="p-[16px] grid grid-cols-1 md:grid-cols-[220px_1fr] gap-[16px]">
        {/* LEFT — controls */}
        <div className="flex flex-col gap-[14px]">
          {/* backend selector */}
          <div>
            <div className="text-[11px] text-[color:var(--color-dim)] mb-[6px]">backend</div>
            <div className="flex flex-col gap-[4px]">
              {(Object.keys(BACKEND_PRESETS) as PresetKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleBackendClick(k)}
                  className={cn(
                    'text-left px-[10px] py-[6px] font-mono text-[12px] border rounded-[4px] cursor-pointer transition-colors',
                    backend === k
                      ? 'bg-[color:var(--color-accent)] text-[#0d0b08] border-[color:var(--color-accent)]'
                      : 'bg-transparent text-[color:var(--color-fg)] border-[color:var(--color-border)]'
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* name input */}
          <div>
            <div className="text-[11px] text-[color:var(--color-dim)] mb-[6px]">name (label)</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-[8px] py-[6px] bg-[color:var(--color-card-2)] border border-[color:var(--color-border)] rounded-[4px] text-[color:var(--color-fg)] font-mono text-[12px] outline-none"
            />
          </div>

          {/* override orientation checkbox */}
          <label className="flex items-center gap-[6px] text-[11px] text-[color:var(--color-dim)] cursor-pointer">
            <input
              type="checkbox"
              checked={overrideOrient}
              onChange={handleOverrideChange}
            />
            override orientation
          </label>

          {/* orientation textarea — shown only when override is active */}
          {overrideOrient && (
            <textarea
              value={orient}
              onChange={(e) => setOrient(e.target.value)}
              rows={8}
              className="w-full p-[8px] bg-[color:var(--color-card-2)] border border-[color:var(--color-border)] rounded-[4px] text-[color:var(--color-fg)] font-mono text-[11px] resize-vertical outline-none"
            />
          )}
        </div>

        {/* RIGHT — preview */}
        <div>
          <div className="flex justify-between items-center text-[11px] text-[color:var(--color-dim)] mb-[6px]">
            <span>.aide/config/brain.aide</span>
            <CopyChip text={file} />
          </div>
          <pre className="m-0 px-[14px] py-[12px] bg-[color:var(--color-card-2)] border border-[color:var(--color-border)] rounded-[4px] text-[11.5px] leading-[1.6] text-[color:var(--color-fg)] overflow-auto whitespace-pre max-h-[420px]">
            {file}
          </pre>
        </div>
      </div>
    </div>
  );
}
