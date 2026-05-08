// no tests

export interface MCPToolEntry {
  sig: string;
  why: string;
  required: boolean;
}

export const MCP_TOOLS: readonly MCPToolEntry[] = [
  {
    sig: "mcp__brain__read_<unit>",
    why: "load a single artifact by relative identifier (path, page id, slug). Used everywhere — every reference walk starts here.",
    required: true,
  },
  {
    sig: "mcp__brain__list_<unit>",
    why: "enumerate the contents of a folder/page. Used for presence-checks during seeding and for browsing.",
    required: true,
  },
  {
    sig: "mcp__brain__write_<unit>",
    why: "create or overwrite an artifact body. The integration's aide-config prose calls this during seeding.",
    required: true,
  },
  {
    sig: "mcp__brain__search",
    why: "full-text or keyword query across the brain. Strongly recommended; the strategist falls back to walking link graphs without it.",
    required: false,
  },
  {
    sig: "mcp__brain__delete_<unit>",
    why: "remove an artifact. Optional — humans usually do this in the brain UI.",
    required: false,
  },
];
