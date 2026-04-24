/**
 * Verbatim port from design_handoff_aidemd_site/prototypes/variant-terminal.jsx lines 172-174.
 * Three quickstart steps rendered as TermStep cards in the Quickstart section.
 */
export const QUICKSTART_STEPS: readonly { n: number; cmd: string; note: string }[] = [
  { n: 1, cmd: 'npx @aidemd-mcp/server@latest init', note: 'scaffolds .aide/ and connects obsidian' },
  { n: 2, cmd: '/aide:research <domain>', note: 'or drop your own notes into the vault' },
  { n: 3, cmd: '/aide', note: 'interview → spec → research → plan → build → qa' },
] as const;
