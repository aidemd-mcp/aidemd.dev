import FooterCard from "@/app/brain/_components/primitives/FooterCard";
import {
  FOOTER_LINE,
  FOOTER_TRIO,
  EXTERNAL_GITHUB_URL,
  EXTERNAL_NPM_URL,
} from "@/app/brain/_data/brainCopy";

/**
 * Walkthrough footer block.
 * Matches brain-variant-walkthrough.jsx lines 186–197.
 * Renders: 2-col grid of two FooterCards (the spec + the source),
 * then a separator row with FOOTER_LINE left and FOOTER_TRIO links right.
 * "the spec" card → /docs/methodology/brain-aide/ (trailing slash).
 * "the source" card → EXTERNAL_GITHUB_URL (external).
 * Trio links: github → EXTERNAL_GITHUB_URL, npm → EXTERNAL_NPM_URL,
 * discuss → EXTERNAL_GITHUB_URL (v1 spec strategy: discuss maps to GitHub).
 * Server component.
 */
export default function WalkthroughFooter() {
  return (
    <div className="px-[24px] md:px-[64px] pt-[40px] pb-[60px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
        <FooterCard
          cta="docs/brain-aide.md →"
          title="the spec"
          body="The strict, byte-faithful contract for brain.aide — frontmatter schema, marker grammar, parser failure modes."
          href="/docs/methodology/brain-aide/"
        />
        <FooterCard
          cta="github ↗"
          title="the source"
          body="Reference implementation: @bitbonsai/mcpvault is the Obsidian brain shipping today. Read it as a template for your own."
          href={EXTERNAL_GITHUB_URL}
          external={true}
        />
      </div>
      <div className="mt-[30px] pt-[20px] border-t border-[color:var(--color-border)] flex flex-col md:flex-row md:justify-between gap-[12px] md:gap-0 text-[11px] text-[color:var(--color-dim-2)]">
        <div>
          {FOOTER_LINE.split("●")[0]}
          <span className="text-[color:var(--color-accent)]">●</span>
          {FOOTER_LINE.split("●")[1]}
        </div>
        <div className="flex gap-[20px]">
          <a
            href={EXTERNAL_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--color-dim-2)] no-underline hover:text-[color:var(--color-fg)]"
          >
            {FOOTER_TRIO[0]}
          </a>
          <a
            href={EXTERNAL_NPM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--color-dim-2)] no-underline hover:text-[color:var(--color-fg)]"
          >
            {FOOTER_TRIO[1]}
          </a>
          <a
            href={EXTERNAL_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--color-dim-2)] no-underline hover:text-[color:var(--color-fg)]"
          >
            {FOOTER_TRIO[2]}
          </a>
        </div>
      </div>
    </div>
  );
}
