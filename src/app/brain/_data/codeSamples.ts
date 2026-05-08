// no tests

/** Verbatim from brain-variant-walkthrough.jsx lines 60–80 — the just-scaffolded brain.aide preview. */
export const SCAFFOLD_PREVIEW = `---
name: obsidian
mcpServerConfig:
  command: npx
  args:
    - "@bitbonsai/mcpvault"
    -                                # ← YAML null. unwired.
---

<!-- aide-orientation-start -->
Your brain is an Obsidian-backed knowledge store.
Use mcp__brain__read_note to open files...
<!-- aide-orientation-end -->

<!-- aide-config-start -->
You are completing the wiring of an Obsidian brain.
The required value is the absolute path to the
user's Obsidian vault...
<!-- aide-config-end -->

(...four seed sections...)`;

/** Verbatim from brain-variant-walkthrough.jsx lines 126–136 — the seed write call example. */
export const SEED_PREVIEW = `mcp__brain__write_note({
  path: "coding-playbook/coding-playbook.md",
  content: "<verbatim bytes from aide-playbook-index section>"
})

→ ✓ wrote
→ ✓ wrote coding-playbook/study-playbook.md
→ ✓ wrote coding-playbook/update-playbook.md
→ ✓ wrote research/research.md

✓ seeding complete. you can now run /aide.`;

/** Verbatim from brain-variant-cookbook.jsx lines 153–163 — aide-orientation good example. */
export const ORIENT_GOOD_SAMPLE = `Your brain is a Notion workspace. Use mcp__brain__read_page by ID or
slug; mcp__brain__search for keyword queries; mcp__brain__list_children
to enumerate.

Entry-point artifacts:
  - coding-playbook/coding-playbook
  - coding-playbook/study-playbook
  - coding-playbook/update-playbook
  - research/research

Stay inside the configured root page. Don't traverse upward.`;

/** Verbatim from brain-variant-cookbook.jsx lines 181–194 — aide-config skeleton. */
export const CONFIG_SKELETON_SAMPLE = `You are completing the wiring of a <NAME> brain.
Required: <list of unwired slot values>.

1. Read brain.aide and quote args[<N>].
2. If null → WIRING:
     - ask user for value (offer hints)
     - edit brain.aide
     - run sync
     - emit "restart Claude Code" and STOP
3. If string → SEEDING:
     - verify mcp__brain__* tools are loaded (else STOP)
     - presence-check each entry-point artifact via list tool
     - write any missing artifact via write tool, body = seed-section bytes
     - emit completion summary`;
