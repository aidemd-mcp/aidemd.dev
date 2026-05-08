import Hero from "@/app/brain/_components/Cookbook/Hero";
import CookbookShell from "@/app/brain/_components/Cookbook/CookbookShell";

/**
 * Cookbook variant orchestrator. Server component.
 * Renders: <Hero/> → <CookbookShell/>
 * The max-w-[1480px] wrapper lives HERE (not in the layout) so the
 * Walkthrough route is unaffected.
 * TopBar and BrainFooter are NOT rendered here — those land in step 7 (layout).
 * WalkthroughCrossLink is composed inside CookbookShell's rail column per JSX.
 */
export default function Cookbook() {
  return (
    <div className="max-w-[1480px] mx-auto">
      <Hero />
      <CookbookShell />
    </div>
  );
}
