// no tests

export const HERO_A_EYEBROW = "# a guide for backend authors";

export const HERO_A_LINE_1 = "wire any backend";

export const HERO_A_LINE_2 = "as a brain.";

export const HERO_A_SUBHEAD =
  "The brain.aide file is a plugin interface. It tells AIDE how to launch your storage backend over MCP and how to talk to it once it's live. Bundled today: an Obsidian default. This page walks you through wiring that default, then shows you how to author your own — a Notion brain, a flat-filesystem brain, anything that can speak MCP.";

/** Inline accent word within HERO_A_SUBHEAD — exactly this substring gets the accent span. */
export const HERO_A_SUBHEAD_ACCENT = "brain.aide";

export const HERO_A_CHECKS: [string, string, string] = [
  "5-step walkthrough",
  "3 worked examples",
  "live skeleton generator",
];

export const HERO_B_EYEBROW = "# brain.aide cookbook";

/** Trailing space is intentional — this token precedes the accent span. */
export const HERO_B_LINE_1 = "recipes for the ";

/** Renders inside an accent-colored span. */
export const HERO_B_LINE_2 = "brain";

/** Leading space + trailing period — this token follows the accent span. */
export const HERO_B_LINE_3 = " plugin interface.";

export const HERO_B_SUBHEAD_LINES: [string, string] = [
  "# pick a recipe from the rail. each one stands alone — no need to read top-to-bottom.",
  "# the skeleton generator on the right stays sticky so you can experiment as you read.",
];

export const SECTION_TITLES: Record<"01" | "02" | "03" | "04" | "05", string> = {
  "01": "install + scaffold the default",
  "02": "wire it: /aide:brain config",
  "03": "seed the entry-point artifacts",
  "04": "verify with the boot reporter",
  "05": "build your own backend",
};

export const SECTION_SUBHEADS: Record<"01" | "02" | "03" | "04" | "05", string> = {
  "01": "# the cli writes .aide/config/brain.aide pre-filled with the obsidian template.",
  "02": "# the config flow has two paths. the one that runs depends on what's in args.",
  "03": "# the four seed sections in brain.aide become four files inside your brain.",
  "04": "# at session start the orchestrator checks brain.aide vs .mcp.json. four states.",
  "05": "# everything above worked with bundled obsidian. now write one for your storage.",
};

export const FOOTER_LINE =
  "© 2026 TetsuKodai Group LLC · ● brain plugin interface";

export const FOOTER_TRIO: [string, string, string] = ["github ↗", "npm ↗", "discuss"];

export const PAGE_TITLE_A = "brain.aide — wire any backend as a brain";

export const PAGE_TITLE_B =
  "brain.aide cookbook — recipes for the brain plugin interface";

export const OG_DESCRIPTION =
  "A guide for backend authors. Wire the bundled Obsidian default, then learn how to author your own brain plugin.";

export const EXTERNAL_GITHUB_URL = "https://github.com/aidemd-mcp/server";

export const EXTERNAL_NPM_URL = "https://www.npmjs.com/package/@aidemd-mcp/server";

export const OBSIDIAN_MCP_PACKAGE = "@bitbonsai/mcpvault";
