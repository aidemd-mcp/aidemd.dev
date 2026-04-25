/**
 * Three quickstart steps rendered as TermStep cards in the Quickstart section.
 * Flow: init scaffolds artifacts → brain config connects the knowledge base → /aide runs the full pipeline.
 */
export const QUICKSTART_STEPS: readonly { n: number; cmd: string; note: string }[] = [
  { n: 1, cmd: 'npx @aidemd-mcp/server@latest init', note: 'scaffolds .aide/ and .claude/ artifacts' },
  { n: 2, cmd: '/aide:brain config', note: 'to configure your shared knowledge base' },
  { n: 3, cmd: '/aide', note: 'interview → spec → research → plan → build → qa' },
] as const;
