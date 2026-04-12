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
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5 flex flex-col gap-4">
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              Rules packs
            </p>
            <ul className="flex flex-col gap-2 text-sm text-zinc-400">
              <li className="flex gap-2">
                <span className="text-zinc-600 mt-0.5">—</span>
                Flat files appended to every context window
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-600 mt-0.5">—</span>
                Static instructions — drift silently as code evolves
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-600 mt-0.5">—</span>
                No structure: conventions, warnings, and philosophy in one lump
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-600 mt-0.5">—</span>
                Agent cannot verify it followed the rules
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-600 mt-0.5">—</span>
                Examples: CLAUDE.md, AGENTS.md, .cursorrules
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-5 flex flex-col gap-4">
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              AIDE
            </p>
            <ul className="flex flex-col gap-2 text-sm text-zinc-300">
              <li className="flex gap-2">
                <span className="text-zinc-500 mt-0.5">+</span>
                Cascaded intent specs derived from research
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-500 mt-0.5">+</span>
                Research agent updates the brain as the domain changes
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-500 mt-0.5">+</span>
                Structured outcomes: desired, undesired, acceptance criteria
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-500 mt-0.5">+</span>
                QA agent checks outputs against stated intent
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-500 mt-0.5">+</span>
                Domain knowledge lives in the project, not in a chat window
              </li>
            </ul>
          </div>
        </div>

        <p className="text-sm text-zinc-500">
          The mechanical difference: rules packs are lumps. AIDE cascades
          research into outcome-checked intent specs that travel with the repo
          and are readable by every agent that touches it.
        </p>
      </div>
    </section>
  );
};

export default VsRulesPacks;
