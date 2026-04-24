import TopBar from "./_components/TopBar";
import Hero from "./_components/Hero";
import AsciiDivider from "./_components/AsciiDivider";
import SectionHeader from "./_components/SectionHeader";
import SectionObserver from "./_components/SectionObserver";
import ThreeLayerModel from "./_components/ThreeLayerModel";
import Pipeline from "./_components/Pipeline";
import IntentTree from "./_components/IntentTree";
import VaultBrain from "./_components/VaultBrain";
import CliDemo from "./_components/CliDemo";
import Comparison from "./_components/Comparison";
import Quickstart from "./_components/Quickstart";
import Footer from "./_components/Footer";
import { ExpoTipProvider } from "@/components/Expo/ExpoTipContext";
import Expo from "@/components/Expo";

export default function HomePage() {
  return (
    <ExpoTipProvider>
      <a href="#main" className="skip-link">Skip to main content</a>
      <TopBar sticky />

      <main id="main" className="max-w-[var(--layout-max-width)] mx-auto">

      {/* Hero owns its own section+padding — no wrapper padding added here */}
      <SectionObserver id="hero">
        <Hero />
      </SectionObserver>

      <AsciiDivider />

      {/* §01 three-layer model */}
      <SectionObserver id="threeLayerModel">
        <section aria-label="three-layer model" className="px-[20px] md:px-[64px] py-[40px]">
          <SectionHeader num="01" title="three-layer model" />
          <ThreeLayerModel />
        </section>
      </SectionObserver>

      <AsciiDivider />

      {/* §02 the agent pipeline */}
      <SectionObserver id="pipeline">
        <section aria-label="the agent pipeline" className="px-[20px] md:px-[64px] py-[40px]">
          <SectionHeader num="02" title="the agent pipeline" />
          <div className="font-mono text-[13px] text-[color:var(--color-dim)] mt-[8px] mb-[28px] leading-[1.6] max-w-[780px]">
            # each stage runs in a fresh context. no agent carries conversation from<br />
            # the last. handoff is via files: .aide, plan.aide, todo.aide, brain notes.<br />
            # click a stage to see its i/o.
          </div>
          <Pipeline />
        </section>
      </SectionObserver>

      <AsciiDivider />

      {/* §03 the cascading intent tree */}
      <SectionObserver id="intentTree">
        <section aria-label="the cascading intent tree" className="px-[20px] md:px-[64px] py-[40px]">
          <SectionHeader num="03" title="the cascading intent tree" />
          <div className="font-mono text-[13px] text-[color:var(--color-dim)] mt-[8px] mb-[24px] leading-[1.6] max-w-[780px]">
            # hierarchy of .aide specs rooted at the project level. each child<br />
            # narrows its parent. agents walk root→leaf before judging validity.
          </div>
          <IntentTree />
        </section>
      </SectionObserver>

      <AsciiDivider />

      {/* §04 the brain — your obsidian vault */}
      <SectionObserver id="vaultBrain">
        <section aria-label="the brain — your obsidian vault" className="px-[20px] md:px-[64px] py-[40px]">
          <SectionHeader num="04" title="the brain — your obsidian vault" />
          <div className="font-mono text-[13px] text-[color:var(--color-dim)] mt-[8px] mb-[28px] leading-[1.6]">
            # research/ — domain notes read by the strategist.<br />
            # coding-playbook/ — convention notes read by the architect + implementor.
          </div>
          <VaultBrain />
        </section>
      </SectionObserver>

      <AsciiDivider />

      {/* §05 the cli demo */}
      <SectionObserver id="cliDemo">
        <section id="cli-demo" aria-label="the cli demo" className="px-[20px] md:px-[64px] py-[40px]">
          <SectionHeader num="05" title="the cli demo" />
          <div className="font-mono text-[13px] text-[color:var(--color-dim)] mt-[8px] mb-[28px] leading-[1.6] max-w-[780px]">
            # run /aide once. the pipeline interviews, specs, researches, plans,<br />
            # builds, and validates — agents hand off via files, never conversation.
          </div>
          <CliDemo />
        </section>
      </SectionObserver>

      <AsciiDivider />

      {/* Comparison — uses its own eyebrow+title instead of §-numbered SectionHeader */}
      <SectionObserver id="comparison">
        <section aria-label="AIDE vs spec-first alternatives" className="px-[20px] md:px-[64px] py-[40px]">
          <Comparison />
        </section>
      </SectionObserver>

      <AsciiDivider />

      {/* §07 quickstart — SectionHeader is embedded inside Quickstart */}
      <SectionObserver id="quickstart">
        <section id="quickstart" aria-label="quickstart" className="px-[20px] md:px-[64px] py-[40px]">
          <Quickstart />
        </section>
      </SectionObserver>

      <Footer />
    </main>
    <Expo />
    </ExpoTipProvider>
  );
}
