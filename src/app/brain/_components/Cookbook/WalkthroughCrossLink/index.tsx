import Link from "next/link";

/**
 * RELATED card below the recipe rail. Maps to JSX RELATED block (lines 67–71).
 * Renders a card containing:
 *   - "RELATED" dim eyebrow
 *   - Link 1: "docs / brain-aide.md →" → /docs/methodology/brain-aide/ (accent)
 *   - Link 2: "all canonical docs →" → /docs/ (fg)
 *   - Link 3: "tutorial: wire your own backend →" → /brain/ (dim, for dual-discoverability)
 * Server component.
 */
export default function WalkthroughCrossLink() {
  return (
    <div className="mx-[22px] mt-[24px] mb-[40px] px-[14px] py-[14px] bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded">
      <div className="text-[10px] text-[color:var(--color-dim)] tracking-[1.2px] mb-[8px]">
        RELATED
      </div>
      <Link
        href="/docs/methodology/brain-aide/"
        className="block text-[12px] text-[color:var(--color-accent)] no-underline mb-[6px] hover:underline"
      >
        docs / brain-aide.md →
      </Link>
      <Link
        href="/docs/"
        className="block text-[12px] text-[color:var(--color-fg)] no-underline mb-[6px] hover:underline"
      >
        all canonical docs →
      </Link>
      <Link
        href="/brain/"
        className="block text-[12px] text-[color:var(--color-dim)] no-underline hover:underline"
      >
        tutorial: wire your own backend →
      </Link>
    </div>
  );
}
