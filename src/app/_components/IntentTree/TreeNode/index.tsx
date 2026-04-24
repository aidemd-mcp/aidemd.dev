"use client";

import { useState } from "react";
import type { IntentNode } from "@/types/intentTree";
import AidePreview from "../AidePreview";

interface TreeNodeProps {
  node: IntentNode;
  depth: number;
}

const ICON_MAP: Record<IntentNode["kind"], string> = {
  dir: "▸",
  intent: "◆",
  plan: "▦",
  todo: "☐",
  code: "·",
};

const COLOR_CLASS: Record<IntentNode["kind"], string> = {
  dir: "text-[color:var(--color-dim)]",
  intent: "text-[color:var(--color-accent)]",
  plan: "text-[color:var(--color-plan)]",
  todo: "text-[color:var(--color-todo)]",
  code: "text-[color:var(--color-dim)]",
};

/**
 * Recursive intent tree node.
 * open: defaults to depth < 2. showPreview: toggled on click if node has preview.
 * Caret rotates: ▾ open, ▸ closed.
 */
export default function TreeNode({ node, depth }: TreeNodeProps) {
  const [open, setOpen] = useState(depth < 2);
  const [showPreview, setShowPreview] = useState(false);

  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isAide = node.kind === "intent" || node.kind === "plan" || node.kind === "todo";
  const caret = hasChildren ? (open ? "▾" : "▸") : " ";
  const isClickable = hasChildren || Boolean(node.preview);

  function handleClick() {
    if (hasChildren) setOpen((prev) => !prev);
    if (node.preview) setShowPreview((prev) => !prev);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  }

  return (
    <div style={{ userSelect: "none" }}>
      <div
        onClick={isClickable ? handleClick : undefined}
        onKeyDown={isClickable ? handleKeyDown : undefined}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-expanded={isClickable && hasChildren ? open : undefined}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--color-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
        className="flex items-baseline gap-[8px] rounded-[4px] font-mono text-[13px] leading-[1.6] text-[color:var(--color-fg)] transition-[background] duration-[120ms]"
        style={{
          padding: "3px 6px",
          paddingLeft: 6 + depth * 18,
          cursor: isClickable ? "pointer" : "default",
        }}
      >
        <span className="w-[10px] text-[10px] text-[color:var(--color-dim)]">{caret}</span>
        <span className={`w-[10px] ${COLOR_CLASS[node.kind]}`}>{ICON_MAP[node.kind]}</span>
        <span
          className={isAide ? "text-[color:var(--color-fg)] font-semibold" : "text-[color:var(--color-dim)] font-normal"}
        >
          {node.name}
        </span>
        {node.note && (
          <span className="text-[12px] text-[color:var(--color-dim)] italic">
            — {node.note}
          </span>
        )}
      </div>

      {showPreview && node.preview && (
        <AidePreview preview={node.preview} depth={depth} />
      )}

      {open && hasChildren && (
        <div>
          {node.children!.map((child, i) => (
            <TreeNode key={child.name + i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
