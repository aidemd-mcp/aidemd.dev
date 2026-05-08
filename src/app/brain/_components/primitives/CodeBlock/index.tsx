import cn from "@/lib/cn";
import CopyChip from "@/app/brain/_components/primitives/CopyChip";

interface CodeBlockProps {
  code: string;
  label?: string;
  maxHeight?: number;
  className?: string;
}

/**
 * Monospace code block with optional header bar.
 * When `label` is set: renders a header bar with the label on the left and a
 * CopyChip on the right, then the <pre> below.
 * When `label` is omitted: renders just the <pre>.
 * Matches the handoff CodePre (brain-shared.jsx lines 49–62):
 * cardDeep background, 1px border, 6px radius, 14px/16px pre padding,
 * 12.5px font, 1.65 line-height.
 * Server component — CopyChip handles its own client boundary.
 */
export default function CodeBlock({ code, label, maxHeight, className }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "my-[10px] border border-[color:var(--color-border)] rounded-[6px] overflow-hidden bg-[color:var(--color-card-2)]",
        className
      )}
    >
      {label && (
        <div className="flex justify-between items-center px-[12px] py-[8px] border-b border-[color:var(--color-border)] bg-[color:var(--color-card)] font-mono text-[11px] text-[color:var(--color-dim)]">
          <span>{label}</span>
          <CopyChip text={code} />
        </div>
      )}
      <pre
        className="m-0 px-[16px] py-[14px] text-[12.5px] leading-[1.65] overflow-auto text-[color:var(--color-fg)] whitespace-pre font-mono"
        style={maxHeight !== undefined ? { maxHeight } : undefined}
      >
        {code}
      </pre>
    </div>
  );
}
