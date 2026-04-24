import AideFrame from "./AideFrame";
import InstallLine from "./InstallLine";
import Typewriter from "./Typewriter";

const HEADLINE = "Your intent is the contract every agent works from.";

/**
 * Marketing hero section — 2-column grid.
 * Left: breadcrumb, animated headline, dim comment block, install line, chips.
 * Right: AideFrame with yaml-style .aide preview content (verbatim from variant-terminal.jsx lines 66-80).
 */
export default function Hero() {
  return (
    <section
      className="px-[20px] md:px-[64px] pt-[50px] pb-[40px]"
      aria-label="Hero"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-[48px] items-start">
        {/* Left column */}
        <div>
          {/* Breadcrumb */}
          <div className="text-[12px] text-[color:var(--color-accent)] tracking-[2px] mb-[16px]">
            ~/aidemd.dev ∙ main ∙ a6f9c3d
          </div>

          {/* Animated headline — CLS-safe via Typewriter */}
          <h1
            className="text-[36px] font-semibold leading-[1.2] tracking-[-0.5px] m-0"
            style={{ letterSpacing: "-0.5px" }}
          >
            <Typewriter text={HEADLINE} speed={40} />
          </h1>

          {/* Dim comment block (variant-terminal.jsx lines 50-53) */}
          <pre
            className="text-[14px] leading-[1.7] mt-[28px] text-[color:var(--color-dim)] whitespace-pre-wrap font-mono"
            aria-label="Framework description"
          >
            {`# AIDE is Autonomous Intent-Driven Engineering.\n# AIDEMD is a spec-first framework for agentic development.\n# heavier than OpenSpec. more opinionated.\n# designed to leave you at 0% code review.`}
          </pre>

          {/* Install line */}
          <div className="mt-[28px]">
            <InstallLine />
          </div>

          {/* Chips */}
          <div className="mt-[22px] flex items-center gap-[20px] text-[11px] text-[color:var(--color-dim)]">
            <span className="text-[color:var(--color-accent)]">[✓]</span>
            <span>works with Claude Code</span>
            <span className="text-[color:var(--color-accent)]">[✓]</span>
            <span>MCP-native</span>
            <span className="text-[color:var(--color-accent)]">[✓]</span>
            <span>Obsidian vault as the brain</span>
          </div>
        </div>

        {/* Right column — .aide preview */}
        <div>
          <AideFrame title="src/service/retention/.aide">
            <div className="text-[color:var(--color-dim)]">---</div>
            <div>
              <span className="text-[color:var(--color-dim)]">scope:</span>{" "}
              src/service/retention
            </div>
            <div>
              <span className="text-[color:var(--color-dim)]">intent: </span>
              {">"}
            </div>
            <div className="pl-[12px]">
              Bring lapsed customers back by referencing something
            </div>
            <div className="pl-[12px]">
              they actually did — not a templated "we miss you".
            </div>
            <div className="text-[color:var(--color-dim)]">outcomes:</div>
            <div className="pl-[12px] text-[color:var(--color-dim)]">desired:</div>
            <div className="pl-[24px]">
              <span className="text-[color:var(--color-accent)]">- </span>
              Opens with factual order-history reference
            </div>
            <div className="pl-[24px]">
              <span className="text-[color:var(--color-accent)]">- </span>
              Body under 80 words
            </div>
            <div className="pl-[12px] text-[color:var(--color-dim)]">undesired:</div>
            <div className="pl-[24px]">
              <span className="text-[color:var(--color-todo)]">- </span>
              Fabricated references
            </div>
            <div className="pl-[24px]">
              <span className="text-[color:var(--color-todo)]">- </span>
              Guilt-trip language
            </div>
            <div className="text-[color:var(--color-dim)]">---</div>
            <div className="mt-[8px]">## Strategy</div>
            <div className="text-[color:var(--color-dim)]">
              Opener specificity drives 64% of reopens...
            </div>
          </AideFrame>
        </div>
      </div>
    </section>
  );
}
