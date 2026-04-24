import type { NoteEntry } from '@/types/vault';

/**
 * Verbatim port from design_handoff_aidemd_site/prototypes/shared.jsx
 * VaultBlock component (lines 528-538).
 * Consumed by the VaultBrain marketing section.
 */
export const VAULT_NOTES: {
  research: readonly NoteEntry[];
  playbook: readonly NoteEntry[];
} = {
  research: [
    { path: 'research/email-marketing/opener-patterns.md', preview: 'Subject + opener pair drives 64% of reopens. Specificity beats personalization tokens…' },
    { path: 'research/email-marketing/reactivation-windows.md', preview: '60-90 day window is the sweet spot. Past 120 days, reactivation rate halves.' },
    { path: 'research/email-marketing/tone-studies.md', preview: 'Three tone ladders (formal→warm→casual). Brand fit > absolute best performer.' },
  ],
  playbook: [
    { path: 'coding-playbook/structure/modularization.md', preview: 'Every helper gets its own subfolder. index.ts default export. Folder name = function name.' },
    { path: 'coding-playbook/patterns/orchestrator-helper.md', preview: 'The index.ts at any level is the orchestrator. Helpers are focused, independently testable.' },
    { path: 'coding-playbook/testing/unit-tests.md', preview: 'One test per outcome. Name the test after the desired behavior, not the function.' },
    { path: 'coding-playbook/errors/typed-errors.md', preview: 'Errors are values, not thrown. Result<T, E> at module boundaries.' },
  ],
};
