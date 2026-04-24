interface TermStepProps {
  n: number;
  cmd: string;
  note: string;
}

/**
 * Single quickstart step card.
 *
 * Rows: accent 11px "step {n}" label, 13px "$ {cmd}" command, dim 12px "# {note}" annotation.
 */
export default function TermStep({ n, cmd, note }: TermStepProps) {
  return (
    <div
      className="border border-[color:var(--color-border)] rounded-[4px] font-mono"
      style={{
        background: "var(--color-card)",
        padding: "14px 16px",
      }}
    >
      <div className="text-[color:var(--color-accent)] text-[11px] mb-[6px]">
        step {n}
      </div>
      <div className="text-[color:var(--color-fg)] text-[13px] mb-[6px]">
        $ {cmd}
      </div>
      <div className="text-[color:var(--color-dim)] text-[12px]"># {note}</div>
    </div>
  );
}
