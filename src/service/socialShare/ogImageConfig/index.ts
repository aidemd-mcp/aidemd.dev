import type { OgImageConfig } from '@/types/socialShare';

/**
 * Returns the frozen canonical OgImageConfig for aidemd.dev. All meta-tag
 * consumers derive their values from this single source — drift is impossible
 * because Object.freeze prevents mutation and the literal width/height types
 * in OgImageConfig reject any value other than 1200×630 at compile time.
 */
export default function ogImageConfig(): OgImageConfig {
  return Object.freeze({
    title: "AIDEMD.DEV — intent is the source",
    description:
      "A byte-faithful record of the .aide methodology. Every .aide is a contract — scope, outcomes, guardrails — that cascades through your stack.",
    siteName: "AIDEMD.DEV",
    url: "https://aidemd.dev/",
    imageUrl: "https://aidemd.dev/og.png",
    imagePath: "/og.png",
    width: 1200,
    height: 630,
    alt: "Expo, the AIDEMD mascot, waving next to the tagline 'intent is the source.'",
  });
}
