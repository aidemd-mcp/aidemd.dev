import type { Metadata } from "next";
import buildPageMetadata from "@/app/_shared/buildPageMetadata";
import findSitePage from "@/app/_shared/listSitePages/findSitePage";
import Walkthrough from "./_components/Walkthrough";

/**
 * Metadata comes from the site page list through the shared helper, never
 * hand-written (a hand-written openGraph object replaces the layout's whole one).
 */
export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(await findSitePage("/brain/"));
}

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
export default function BrainPage() {
  return <Walkthrough />;
}
