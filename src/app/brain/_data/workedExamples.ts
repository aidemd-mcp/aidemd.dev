// no tests

export type WorkedExampleKey = "filesystem" | "notion" | "obsidian";

export interface WorkedExample {
  label: string;
  blurb: string;
  /** Single string with tool names joined by ` · ` separators. */
  tools: string;
  orient: string;
  config: string;
  args: string;
}

export const WORKED_EXAMPLES: Record<WorkedExampleKey, WorkedExample> = {
  filesystem: {
    label: "minimum-viable filesystem",
    blurb:
      "A flat folder of markdown files. The simplest brain you can build — useful as a learning reference and for solo developers who don't want a separate app.",
    tools:
      "mcp__brain__read_file · mcp__brain__list_dir · mcp__brain__write_file · mcp__brain__grep",
    orient: `Your brain is a plain-markdown folder. Use mcp__brain__read_file
to open files by path relative to the brain root.

Entry-point artifacts:
  coding-playbook/coding-playbook.md
  coding-playbook/study-playbook.md
  coding-playbook/update-playbook.md
  research/research.md`,
    config: `Required value: absolute path to the brain root folder.
WIRING: ask user (offer to mkdir), edit args[1], sync, STOP.
SEEDING: write each artifact via mcp__brain__write_file from the seed bytes.`,
    args: `args:\n  - "@example/fs-brain-mcp"\n  -                              # ← brain root path`,
  },
  notion: {
    label: "notion (end-to-end)",
    blurb:
      "Two unwired slots: integration token and root page ID. The seed step creates pages instead of files; orientation tells agents to stay inside the configured root.",
    tools:
      "mcp__brain__read_page · mcp__brain__list_children · mcp__brain__create_page · mcp__brain__search",
    orient: `Your brain is a Notion workspace. Use mcp__brain__read_page
by ID or relative slug. Search via mcp__brain__search.

Entry-point pages (nested under the root):
  coding-playbook/coding-playbook
  coding-playbook/study-playbook
  coding-playbook/update-playbook
  research/research

Stay inside the configured root page.`,
    config: `Required: integration token + root page ID.
WIRING: ask user for both, edit args[2] and args[4], sync, STOP.
SEEDING: create nested pages via mcp__brain__create_page from seed bytes.`,
    args: `args:\n  - "@example/notion-brain-mcp"\n  - "--token"\n  -                            # ← integration token\n  - "--root"\n  -                            # ← root page ID`,
  },
  obsidian: {
    label: "obsidian (the bundled default)",
    blurb:
      "Reference implementation. Wikilink-aware. Single unwired slot for the vault path. Ships with @bitbonsai/mcpvault.",
    tools:
      "mcp__brain__read_note · mcp__brain__list_directory · mcp__brain__write_note · mcp__brain__search_notes",
    orient: `Your brain is an Obsidian vault. Read notes with
mcp__brain__read_note and search with mcp__brain__search_notes.

Wikilinks resolve relative to the vault root.

Entry-point artifacts: (the four standard paths)`,
    config: `Required: absolute path to vault.
WIRING: ask user (suggest common paths), edit args[1], sync, STOP.
SEEDING: write each artifact via mcp__brain__write_note.`,
    args: `args:\n  - "@bitbonsai/mcpvault"\n  -                              # ← vault path`,
  },
};
