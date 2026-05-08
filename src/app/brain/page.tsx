import type { Metadata } from "next";
import { ogImage } from "@/service/socialShare";
import Walkthrough from "./_components/Walkthrough";
import { PAGE_TITLE_A, OG_DESCRIPTION } from "./_data/brainCopy";

/**
 * /brain — wire any backend as a brain.
 *
 * Renders <Walkthrough />, which contains the 5-step guide plus its own
 * WalkthroughFooter (the richer 2-col FooterCard grid + trio row). The
 * simpler <BrainFooter /> attribution line is rendered by the layout.
 *
 * Canonical URL has a trailing slash (next.config.mjs: trailingSlash: true).
 *
 * No 'use client' — server component.
 */
export const metadata: Metadata = {
  title: PAGE_TITLE_A,
  description: OG_DESCRIPTION,
  alternates: {
    canonical: "https://aidemd.dev/brain/",
  },
  openGraph: {
    type: "article",
    url: "https://aidemd.dev/brain/",
    siteName: ogImage.siteName,
    title: PAGE_TITLE_A,
    description: OG_DESCRIPTION,
    images: [
      {
        url: ogImage.imagePath,
        width: ogImage.width,
        height: ogImage.height,
        alt: ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE_A,
    description: OG_DESCRIPTION,
    images: [ogImage.imagePath],
  },
};

export default function BrainPage() {
  return <Walkthrough />;
}
