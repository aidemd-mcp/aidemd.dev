type FrictionMode = {
  symptom: string;
  fix: string;
};

const frictionModes: FrictionMode[] = [
  {
    symptom: "npx: command not found",
    fix: "Install Node.js from nodejs.org or fix your PATH so npx is on it.",
  },
  {
    symptom: "Node version error or unsupported engine",
    fix: "Upgrade to Node.js v18 or later.",
  },
  {
    symptom: "MCP server not loading after install",
    fix: "Fully quit Claude Code (not just close the window) and reopen it.",
  },
  {
    symptom: "npx resolves wrong version under nvm or Homebrew",
    fix: "Run nvm use in your project root, or fix your shell profile so the correct Node is first on PATH.",
  },
];

const TroubleshootingCallout = () => {
  return (
    <aside className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-5 py-4">
      <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-3">
        Troubleshooting
      </p>
      <ul className="flex flex-col gap-3">
        {frictionModes.map((mode) => (
          <li key={mode.symptom} className="flex flex-col gap-0.5">
            <span className="text-sm text-zinc-300 font-mono">{mode.symptom}</span>
            <span className="text-sm text-zinc-500">{mode.fix}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default TroubleshootingCallout;
