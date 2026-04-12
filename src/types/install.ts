export type McpConfig = {
  mcpServers: {
    aide: {
      command: string;
      args: string[];
    };
  };
};

export type CommandStep = {
  step: number;
  instruction: string;
  code?: string;
};

export type InstallConfig =
  | {
      framework: "claude";
      mcpConfig: McpConfig;
      commandSequence: [CommandStep, CommandStep, CommandStep];
    };
