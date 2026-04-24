interface NoteCardProps {
  path: string;
  preview: string;
}

/**
 * Vault note card — accent left-border, card bg, path in accent mono 12px, preview in fg 13px.
 */
export default function NoteCard({ path, preview }: NoteCardProps) {
  return (
    <div className="bg-[color:var(--color-bg)] border border-[color:var(--color-border)] border-l-2 border-l-[color:var(--color-accent)] rounded-[4px] p-[14px_16px]">
      <div className="font-mono text-[12px] text-[color:var(--color-accent)] mb-[6px]">
        {path}
      </div>
      <div className="text-[13px] text-[color:var(--color-fg)] leading-[1.55]">
        {preview}
      </div>
    </div>
  );
}
