import type { Metadata } from "next";
import buildPageMetadata from "@/app/_shared/buildPageMetadata";
import findSitePage from "@/app/_shared/listSitePages/findSitePage";
import Cookbook from "../_components/Cookbook";

/**
 * Metadata comes from the site page list through the shared helper, never
 * hand-written (a hand-written openGraph object replaces the layout's whole one).
 */
export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(await findSitePage("/brain/recipes/"));
}

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
export default function BrainRecipesPage() {
  return <Cookbook />;
}
