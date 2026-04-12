type PipelineNode = {
  step: number;
  label: string;
  annotation: string;
};

const nodes: PipelineNode[] = [
  {
    step: 1,
    label: "spec-writer",
    annotation: "Turns research and requirements into outcome-checked intent specs that travel with the repo.",
  },
  {
    step: 2,
    label: "researcher",
    annotation: "Studies the domain — legal, clinical, tax, compliance — and writes findings to the brain.",
  },
  {
    step: 3,
    label: "domain expert",
    annotation: "Reads the brain and answers domain questions in context so every agent session starts informed.",
  },
  {
    step: 4,
    label: "architect",
    annotation: "Reads the coding playbook from the brain and produces a step-by-step implementation plan.",
  },
  {
    step: 5,
    label: "implementor",
    annotation: "Executes the plan top-to-bottom, checks each step, and writes production-quality code.",
  },
  {
    step: 6,
    label: "QA",
    annotation: "Validates output against the intent spec and produces a fix-loop todo when anything drifts.",
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
            <div key={node.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-none">
                  <span className="text-xs font-mono text-zinc-400">{node.step}</span>
                </div>
                {index < nodes.length - 1 && (
                  <div className="w-px flex-1 bg-zinc-800 mt-1" />
                )}
              </div>
              <div className="flex flex-col gap-0.5 pb-8">
                <span className="text-sm font-semibold font-mono text-zinc-200">{node.label}</span>
                <span className="text-sm text-zinc-500">{node.annotation}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-5 flex flex-col gap-3">
          <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            brain — shared infrastructure
          </p>
          <p className="text-sm text-zinc-500">
            Persistent Obsidian vault shared across every agent and every session. Not a pipeline stage — a knowledge layer the pipeline reads and writes.
          </p>
          <ul className="flex flex-col gap-1 text-xs font-mono text-zinc-500">
            <li>
              <span className="text-zinc-400">researcher</span>
              {" "}writes findings to{" "}
              <span className="text-zinc-400">brain</span>
            </li>
            <li>
              <span className="text-zinc-400">domain expert</span>
              {" "}reads context from{" "}
              <span className="text-zinc-400">brain</span>
            </li>
            <li>
              <span className="text-zinc-400">architect</span>
              {" "}reads coding playbook from{" "}
              <span className="text-zinc-400">brain</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Mechanisms
          </p>
          <ul className="flex flex-col gap-2 text-sm text-zinc-500">
            <li>
              <span className="text-zinc-400">Fix loop:</span>{" "}
              QA produces a todo, implementor fixes one item per session in clean context, QA re-validates.
            </li>
            <li>
              <span className="text-zinc-400">Resume mid-pipeline:</span>{" "}
              Orchestrator detects state from file existence and picks up where the last session left off.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
