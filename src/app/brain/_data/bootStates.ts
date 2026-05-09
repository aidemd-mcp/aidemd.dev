// no tests

export type BootStateId = "ok" | "no-brain-aide" | "no-mcp-entry" | "mcp-drift";

export interface BootStateEntry {
  id: BootStateId;
  kind: "ok" | "no-brain-aide" | "no-mcp-entry" | "mcp-drift";
  what: string;
  fix: string;
}

export const BOOT_STATES: readonly BootStateEntry[] = [
  {
    id: "ok",
    kind: "ok",
    what: "brain.aide + .mcp.json agree.",
    fix: "pipeline proceeds.",
  },
  {
    id: "no-brain-aide",
    kind: "no-brain-aide",
    what: ".aide/config/brain.aide is missing.",
    fix: "npx @aidemd-mcp/server@latest init",
  },
  {
    id: "no-mcp-entry",
    kind: "no-mcp-entry",
    what: ".mcp.json has no brain entry, or args still have null.",
    fix: "/aide:brain config → npx @aidemd-mcp/server@latest sync → restart",
  },
  {
    id: "mcp-drift",
    kind: "mcp-drift",
    what: "brain.aide and .mcp.json disagree.",
    fix: "npx @aidemd-mcp/server@latest sync → restart",
  },
];
