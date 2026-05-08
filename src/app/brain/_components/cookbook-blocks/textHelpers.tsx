import type { ReactNode, CSSProperties } from "react";

/**
 * Inline paragraph wrapper. Matches JSX lines 221–223.
 * 13px, fg color, 1.7 line-height, bottom margin 12px.
 * Server component.
 */
export function P({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <p
      className="text-[13px] text-[color:var(--color-fg)] leading-[1.7] m-0 mb-[12px]"
      style={style}
    >
      {children}
    </p>
  );
}

/**
 * Bullet row with accent dot. Matches JSX lines 224–230.
 * 14px / 1fr two-column grid, accent · glyph on the left.
 * Server component.
 */
export function Bullet({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-[8px] text-[13px] text-[color:var(--color-fg)] leading-[1.65] my-[4px]" style={{ gridTemplateColumns: "14px 1fr" }}>
      <span className="text-[color:var(--color-accent)]">·</span>
      <span>{children}</span>
    </div>
  );
}

/**
 * Inline code span. Matches JSX lines 231–233.
 * 12.5px, accent foreground, slight card-bg + border treatment, 3px radius.
 * Server component.
 */
export function C({ children }: { children: ReactNode }) {
  return (
    <code className="font-mono text-[12.5px] px-[6px] py-[1px] bg-[rgba(232,223,206,0.06)] border border-[color:var(--color-border)] rounded-[3px] text-[color:var(--color-accent)]">
      {children}
    </code>
  );
}
