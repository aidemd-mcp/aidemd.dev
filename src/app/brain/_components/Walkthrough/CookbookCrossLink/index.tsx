import FooterCard from "@/app/brain/_components/primitives/FooterCard";

/**
 * Cross-link block from /brain into /brain/recipes/.
 * Not in brain-variant-walkthrough.jsx — spec mandate per plan step 5.
 * Renders a single FooterCard with LOOKUP cta pointing at the cookbook route.
 * Trailing slash on href is intentional (next.config.mjs trailingSlash).
 * Server component.
 */
export default function CookbookCrossLink() {
  return (
    <div className="px-[64px] py-[32px] max-w-[1180px]">
      <FooterCard
        cta="LOOKUP"
        title="see the cookbook →"
        body="3-column rail/recipe/sticky-generator layout for returning readers."
        href="/brain/recipes/"
      />
    </div>
  );
}
