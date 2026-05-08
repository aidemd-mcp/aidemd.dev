import type { Metadata } from "next";
import { ogImage } from "@/service/socialShare";
import Cookbook from "../_components/Cookbook";
import { PAGE_TITLE_B, OG_DESCRIPTION } from "../_data/brainCopy";

/**
 * /brain/recipes — cookbook: recipes for the brain plugin interface.
 *
 * Renders <Cookbook /> only. The <BrainFooter /> attribution line is
 * rendered by the shared brain layout (no WalkthroughFooter on this route).
 *
 * Canonical URL has a trailing slash (next.config.mjs: trailingSlash: true).
 *
 * No 'use client' — server component.
 */
export const metadata: Metadata = {
  title: PAGE_TITLE_B,
  description: OG_DESCRIPTION,
  alternates: {
    canonical: "https://aidemd.dev/brain/recipes/",
  },
  openGraph: {
    type: "article",
    url: "https://aidemd.dev/brain/recipes/",
    siteName: ogImage.siteName,
    title: PAGE_TITLE_B,
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
    title: PAGE_TITLE_B,
    description: OG_DESCRIPTION,
    images: [ogImage.imagePath],
  },
};

export default function BrainRecipesPage() {
  return <Cookbook />;
}
