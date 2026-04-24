import LayerBox from "./LayerBox";

/**
 * §01 three-layer model — 3-column grid of LayerBox cards.
 * Copy verbatim from design_handoff_aidemd_site/prototypes/variant-terminal.jsx lines 92-94.
 */
export default function ThreeLayerModel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-[28px]">
      <LayerBox
        title="brain/"
        label="durable knowledge"
        body="External to project. Obsidian vault or MCP store. research/ for domain expertise, coding-playbook/ for your conventions."
      />
      <LayerBox
        title=".aide"
        label="the contract"
        body="Short structured brief next to the orchestrator. scope, intent, outcomes.desired, outcomes.undesired. No code."
      />
      <LayerBox
        title="src/"
        label="ephemeral code"
        body="If the intent changes, the code changes. The spec persists; the code is its current expression."
      />
    </div>
  );
}
