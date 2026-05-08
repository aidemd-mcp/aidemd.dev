// no tests

export type PresetKey = "obsidian" | "filesystem" | "notion";

export interface BackendPreset {
  name: string;
  command: string;
  argLines: string[];
  orientation: string;
  config: string;
}

export const BACKEND_PRESETS: Record<PresetKey, BackendPreset> = {
  obsidian: {
    name: "obsidian",
    command: "npx",
    argLines: [
      '"@bitbonsai/mcpvault"',
      "~  // ← absolute path to your vault",
    ],
    orientation: `Your brain is an Obsidian-backed knowledge store. Use \`mcp__brain__read_note\`
to open files by their brain-relative path. Use \`mcp__brain__search_notes\`
for keyword queries across every note in the store.

The store has four entry-point artifacts:
  - \`coding-playbook/coding-playbook.md\`
  - \`coding-playbook/study-playbook.md\`
  - \`coding-playbook/update-playbook.md\`
  - \`research/research.md\`

Start from the relevant entry-point for your task, follow references it lists
to deepen context, and stay in scope.`,
    config: `You are completing the wiring of an Obsidian brain. The required value is
the absolute path to the user's Obsidian vault, to be placed at the last
entry of \`mcpServerConfig.args\`.

Steps:
1. Read brain.aide and quote the last entry of args.
2. If YAML null → WIRING flow: ask for vault path, edit brain.aide, run sync, STOP.
3. If string path → SEEDING flow: write each entry-point artifact via
   \`mcp__brain__write_note\` from the seed-section bytes.`,
  },
  filesystem: {
    name: "filesystem",
    command: "npx",
    argLines: [
      '"@example/fs-brain-mcp"',
      "~  // ← absolute path to the brain root folder",
    ],
    orientation: `Your brain is a plain-markdown folder on disk. Use \`mcp__brain__read_file\`
to open files by relative path and \`mcp__brain__list_dir\` to enumerate.
Search is grep-based via \`mcp__brain__grep\`.

Entry-point artifacts:
  - \`coding-playbook/coding-playbook.md\`
  - \`coding-playbook/study-playbook.md\`
  - \`coding-playbook/update-playbook.md\`
  - \`research/research.md\`

There is no wikilink resolver — cross-references are plain relative paths.`,
    config: `You are completing the wiring of a filesystem brain. The required value
is the absolute path to the brain root folder.

Steps:
1. Read brain.aide and quote the last args entry.
2. If YAML null → WIRING flow: ask for the folder path (offer to mkdir it),
   edit brain.aide, run sync, STOP.
3. If string path → SEEDING flow: write each entry-point artifact via
   \`mcp__brain__write_file\` from the seed-section bytes.`,
  },
  notion: {
    name: "notion",
    command: "npx",
    argLines: [
      '"@example/notion-brain-mcp"',
      '"--token"',
      "~  // ← Notion integration token",
      '"--root"',
      "~  // ← root page ID",
    ],
    orientation: `Your brain is a Notion workspace. Use \`mcp__brain__read_page\` to load a
page by ID or relative slug. Use \`mcp__brain__search\` for full-text queries.
Use \`mcp__brain__list_children\` to enumerate a page's subpages.

Entry-point artifacts (created as nested pages under the root):
  - coding-playbook → coding-playbook
  - coding-playbook → study-playbook
  - coding-playbook → update-playbook
  - research → research

Stay inside the configured root page. Do not traverse upward.`,
    config: `You are completing the wiring of a Notion brain. Two values are required:
the integration token and the root page ID.

Steps:
1. Read brain.aide and quote args[2] and args[4].
2. If either is YAML null → WIRING flow: ask for the missing values
   (offer https://www.notion.so/my-integrations as a hint for the token),
   edit brain.aide, run sync, STOP.
3. If both are strings → SEEDING flow: create nested pages via
   \`mcp__brain__create_page\` and write each entry-point artifact's body
   from the seed-section bytes.`,
  },
};
