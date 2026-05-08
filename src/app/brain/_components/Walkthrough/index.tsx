import Hero from "@/app/brain/_components/Walkthrough/Hero";
import Divider from "@/app/brain/_components/walkthrough-blocks/Divider";
import Section01Install from "@/app/brain/_components/Walkthrough/Section01Install";
import Section02Wire from "@/app/brain/_components/Walkthrough/Section02Wire";
import Section03Seed from "@/app/brain/_components/Walkthrough/Section03Seed";
import Section04Verify from "@/app/brain/_components/Walkthrough/Section04Verify";
import Section05BuildOwn from "@/app/brain/_components/Walkthrough/Section05BuildOwn";
import CookbookCrossLink from "@/app/brain/_components/Walkthrough/CookbookCrossLink";
import WalkthroughFooter from "@/app/brain/_components/Walkthrough/WalkthroughFooter";

/**
 * Walkthrough variant orchestrator.
 * Imports and renders each section helper in scroll order, separated by Dividers.
 * No layout logic — ordering only. No TopBar (comes from layout in step 7).
 * Server component.
 */
export default function Walkthrough() {
  return (
    <div className="max-w-[var(--layout-max-width)] mx-auto">
      <Hero />
      <Divider />
      <Section01Install />
      <Divider />
      <Section02Wire />
      <Divider />
      <Section03Seed />
      <Divider />
      <Section04Verify />
      <Divider />
      <Section05BuildOwn />
      <Divider />
      <CookbookCrossLink />
      <WalkthroughFooter />
    </div>
  );
}
