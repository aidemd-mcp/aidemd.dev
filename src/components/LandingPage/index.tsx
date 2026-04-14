import Wordmark from "@/components/LandingPage/Wordmark";
import InstallHero from "@/components/LandingPage/InstallHero";
import CostStrip from "@/components/LandingPage/CostStrip";
import HowItWorks from "@/components/LandingPage/HowItWorks";
import VsRulesPacks from "@/components/LandingPage/VsRulesPacks";
import IntentTreeSection from "@/components/LandingPage/IntentTreeSection";
import InstallFooter from "@/components/shared/InstallFooter";

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Wordmark />
      <InstallHero />
      <CostStrip />
      <HowItWorks />
      <VsRulesPacks />
      <IntentTreeSection />
      <InstallFooter />
    </main>
  );
};

export default LandingPage;
