import type { InstallConfig } from "../../../types/install";

const buildInstallConfig = (): InstallConfig => ({
  framework: "claude",
  mcpConfig: {
    mcpServers: {
      aide: {
        command: "npx",
        args: ["@aidemd-mcp/server"],
      },
    },
  },
  commandSequence: [
    {
      step: 1,
      instruction: "Paste this into your project's `.mcp.json`.",
      code: JSON.stringify(
        {
          mcpServers: {
            aide: {
              command: "npx",
              args: ["@aidemd-mcp/server"],
            },
          },
        },
        null,
        2
      ),
    },
    {
      step: 2,
      instruction: "Restart Claude Code so it loads the new MCP server.",
    },
    {
      step: 3,
      instruction: "Call `aide_init` from the tool palette.",
      code: "aide_init",
    },
  ],
});

export default buildInstallConfig;
