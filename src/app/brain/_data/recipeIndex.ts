// no tests

export type RecipeKey =
  | "quickstart"
  | "flow"
  | "states"
  | "mcp"
  | "orient"
  | "configsec"
  | "fs"
  | "notion";

export interface RecipeMeta {
  id: RecipeKey;
  label: string;
  subtitle: string;
}

export const RECIPE_INDEX: readonly RecipeMeta[] = [
  { id: "quickstart", label: "01 · quickstart",          subtitle: "install + wire obsidian" },
  { id: "flow",       label: "02 · the config flow",     subtitle: "wiring vs. seeding" },
  { id: "states",     label: "03 · boot states",         subtitle: "the four reporter codes" },
  { id: "mcp",        label: "04 · mcp surface",         subtitle: "what your server exposes" },
  { id: "orient",     label: "05 · writing orientation", subtitle: "the runtime briefing" },
  { id: "configsec",  label: "06 · writing aide-config", subtitle: "wiring + seeding script" },
  { id: "fs",         label: "07 · recipe: filesystem",  subtitle: "minimum-viable brain" },
  { id: "notion",     label: "08 · recipe: notion",      subtitle: "two-slot worked example" },
];
