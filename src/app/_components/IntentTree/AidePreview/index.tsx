import type { AidePreview as AidePreviewData } from "@/types/intentTree";

interface AidePreviewProps {
  preview: AidePreviewData;
  depth: number;
}

/**
 * Yaml-style inline preview block rendered when a user clicks an intent node.
 * Margin-left follows the formula: 6 + depth * 18 + 28 px (from shared.jsx line 236).
 */
export default function AidePreview({ preview, depth }: AidePreviewProps) {
  const marginLeft = 6 + depth * 18 + 28;

  return (
    <div
      className="font-mono text-[12px] leading-[1.7] text-[color:var(--color-fg)] bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-[4px]"
      style={{
        marginLeft,
        marginTop: 4,
        marginBottom: 10,
        padding: "10px 14px",
        borderLeft: "2px solid var(--color-accent)",
        maxWidth: 720,
      }}
    >
      <div className="text-[color:var(--color-dim)]">---</div>
      <div>
        <span className="text-[color:var(--color-dim)]">scope: </span>
        {preview.scope}
      </div>
      <div>
        <span className="text-[color:var(--color-dim)]">intent: </span>
        <span className="text-[color:var(--color-fg)]">{preview.intent}</span>
      </div>
      <div className="text-[color:var(--color-dim)]">outcomes:</div>
      <div className="pl-[12px]">
        <div className="text-[color:var(--color-dim)]">desired:</div>
        {preview.desired.map((item, i) => (
          <div key={i} className="pl-[12px]">
            <span className="text-[color:var(--color-accent)]">- </span>
            {item}
          </div>
        ))}
        <div className="text-[color:var(--color-dim)]">undesired:</div>
        {preview.undesired.map((item, i) => (
          <div key={i} className="pl-[12px]">
            <span className="text-[color:var(--color-todo)]">- </span>
            {item}
          </div>
        ))}
      </div>
      <div className="text-[color:var(--color-dim)]">---</div>
    </div>
  );
}
