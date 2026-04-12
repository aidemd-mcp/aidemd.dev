const VsRulesPacks = () => {
  return (
    <section className="w-full py-16 px-4 border-t border-zinc-800">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-zinc-100">
            Not a rules pack
          </h2>
          <p className="text-sm text-zinc-500">
            CLAUDE.md, AGENTS.md, .cursorrules — and why AIDE is mechanically different.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5 flex flex-col gap-4 opacity-75 sm:opacity-100">
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              Rules packs
            </p>
            <ul className="flex flex-col gap-2 text-sm text-zinc-400">
              <li className="flex gap-2">
                <span className="text-zinc-500 mt-0.5">—</span>
                Flat files appended to every context window
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-500 mt-0.5">—</span>
                Static instructions — drift silently as code evolves
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-500 mt-0.5">—</span>
                No structure: conventions, warnings, and philosophy in one lump
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-500 mt-0.5">—</span>
                Agent cannot verify it followed the rules
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-500 mt-0.5">—</span>
                Examples: CLAUDE.md, AGENTS.md, .cursorrules
              </li>
            </ul>
          </div>

          <div className="sm:hidden flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">vs</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <div className="rounded-lg border border-zinc-600 bg-zinc-900/70 p-5 flex flex-col gap-4 border-l-[3px] border-l-zinc-500 sm:border-l sm:border-l-zinc-600">
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              AIDE
            </p>
            <ul className="flex flex-col gap-2 text-sm text-zinc-300">
              <li className="flex gap-2">
                <span className="text-emerald-500 mt-0.5">+</span>
                Intent specs cascade from research through the full six-agent pipeline
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 mt-0.5">+</span>
                Cross-project brain persists domain knowledge in an Obsidian vault filed by domain — not trapped in a chat window
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 mt-0.5">+</span>
                Auto-learning: when the fix loop closes, retro findings promote to the brain — rules packs cannot learn from their own failures
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 mt-0.5">+</span>
                QA checks every output against the intent spec — drift is caught at the spec boundary, not in review
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 mt-0.5">+</span>
                Coding playbook: architect navigates a structured convention hierarchy via a dedicated skill — rules packs are flat unstructured text
              </li>
            </ul>
          </div>
        </div>

        <p className="text-sm text-zinc-500">
          The mechanical difference: rules packs are static lumps — they cannot update themselves, cannot verify compliance, and cannot learn. AIDE cascades research into outcome-checked intent specs, and when the fix loop closes, retro findings promote to the brain so every future session starts smarter.
        </p>
      </div>
    </section>
  );
};

export default VsRulesPacks;
