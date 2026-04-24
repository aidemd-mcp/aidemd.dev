"use client";

import { INTENT_TREE_ROOTS } from "@/data/intentTree";
import AideFrame from "@/app/_components/Hero/AideFrame";
import TreeNode from "./TreeNode";

/**
 * §03 intent cascades — interactive tree + aide_discover panel.
 * Left: scrollable tree with border/radius. Right: AideFrame showing ancestor chain.
 * Verbatim content from variant-terminal.jsx lines 124-139.
 */
export default function IntentTree() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-[24px]">
      {/* Tree column */}
      <div
        className="border border-[color:var(--color-border)] rounded-[6px]"
        style={{ padding: "14px 10px" }}
      >
        {INTENT_TREE_ROOTS.map((root, i) => (
          <TreeNode key={root.name + i} node={root} depth={0} />
        ))}
      </div>

      {/* AideFrame column */}
      <AideFrame title="aide_discover --path src/service/retention/draftOpener">
        <div className="text-[color:var(--color-dim)]"># ancestor chain (root → leaf):</div>

        <div className="text-[color:var(--color-accent)] mt-[6px]">◆ .aide/intent.aide</div>
        <div className="text-[color:var(--color-dim)] pl-[12px] text-[12px]">project-level intent</div>
        <div className="text-[color:var(--color-fg)] pl-[12px] text-[12px]">
          status:{" "}
          <span style={{ color: "#8cbe5a" }}>aligned</span>
        </div>

        <div className="text-[color:var(--color-accent)] mt-[6px]">◆ src/.aide</div>
        <div className="text-[color:var(--color-dim)] pl-[12px] text-[12px]">orchestrate email pipeline</div>
        <div className="text-[color:var(--color-fg)] pl-[12px] text-[12px]">
          status:{" "}
          <span style={{ color: "#8cbe5a" }}>aligned</span>
        </div>

        <div className="text-[color:var(--color-accent)] mt-[6px]">◆ src/service/retention/.aide</div>
        <div className="text-[color:var(--color-dim)] pl-[12px] text-[12px]">retention email strategy</div>
        <div className="text-[color:var(--color-fg)] pl-[12px] text-[12px]">
          status:{" "}
          <span style={{ color: "#8cbe5a" }}>aligned</span>
        </div>

        <div className="text-[color:var(--color-accent)] mt-[6px]">◆ src/service/retention/draftOpener/.aide</div>
        <div className="text-[color:var(--color-dim)] pl-[12px] text-[12px]">opener specificity</div>
        <div className="text-[color:var(--color-fg)] pl-[12px] text-[12px]">
          status:{" "}
          <span className="text-[color:var(--color-todo)]">pending</span>
        </div>

        <div className="mt-[8px] text-[color:var(--color-dim)]">---</div>
        <div className="text-[color:var(--color-dim)] text-[12px]">
          # 4 specs. inherited outcomes: 7 desired, 9 undesired.
        </div>
      </AideFrame>
    </div>
  );
}
