type PipelineNode = {
  label: string;
  annotation: string;
};

const nodes: PipelineNode[] = [
  {
    label: "Research Agent",
    annotation: "Studies your domain — legal, clinical, tax, compliance — and writes findings to the brain.",
  },
  {
    label: "Brain",
    annotation: "Persistent, project-scoped knowledge base. Every agent session starts from the same foundation.",
  },
  {
    label: "Intent Spec",
    annotation: "Outcome-checked contracts derived from the brain. Intent is the contract; code is ephemeral.",
  },
  {
    label: "Downstream Agents",
    annotation: "Planner, architect, implementor, QA — all read the brain and the intent spec before writing a line.",
  },
];

const HowItWorks = () => {
  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-zinc-100">How it works</h2>
          <p className="text-sm text-zinc-500">
            Intent is the contract. Code is ephemeral.
          </p>
        </div>

        <div className="flex flex-col gap-0">
          {nodes.map((node, index) => (
            <div key={node.label} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-none">
                  <span className="text-xs font-mono text-zinc-400">{index + 1}</span>
                </div>
                {index < nodes.length - 1 && (
                  <div className="w-px h-12 bg-zinc-800 mt-1" />
                )}
              </div>
              <div className="flex flex-col gap-0.5 pb-10">
                <span className="text-sm font-semibold text-zinc-200">{node.label}</span>
                <span className="text-sm text-zinc-500">{node.annotation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
