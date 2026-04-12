import { describe, it, expect } from "vitest";
import buildInstallConfig from "./index";

describe("buildInstallConfig", () => {
  it("returns valid JSON (JSON.stringify does not throw)", () => {
    const config = buildInstallConfig();
    expect(() => JSON.stringify(config)).not.toThrow();
  });

  it("mcpConfig matches expected McpConfig shape", () => {
    const { mcpConfig } = buildInstallConfig();
    expect(mcpConfig).toHaveProperty("mcpServers");
    expect(mcpConfig.mcpServers).toHaveProperty("aide");
    expect(typeof mcpConfig.mcpServers.aide.command).toBe("string");
    expect(Array.isArray(mcpConfig.mcpServers.aide.args)).toBe(true);
  });

  it("commandSequence has exactly 3 steps", () => {
    const { commandSequence } = buildInstallConfig();
    expect(commandSequence).toHaveLength(3);
  });

  it("no version pinning in args (no version numbers in args array)", () => {
    const { mcpConfig } = buildInstallConfig();
    const args = mcpConfig.mcpServers.aide.args;
    // Version strings look like @1.2.3 or @^1.2.3 — none should appear
    const versionPattern = /@[\^~]?\d+\.\d+/;
    for (const arg of args) {
      expect(arg).not.toMatch(versionPattern);
    }
  });

  it('framework is "claude"', () => {
    const config = buildInstallConfig();
    expect(config.framework).toBe("claude");
  });
});
