import type { MetadataRoute } from "next";
import siteIdentity from "@/data/siteIdentity";
import fixedPageCopy from "@/app/_shared/listSitePages/fixedPageCopy";

export const dynamic = "force-static";

/**
 * The web manifest, served at /manifest.webmanifest. `#0d0b08` is the layout
 * viewport's `themeColor`; the icons are written by `scripts/build-favicon.mjs`.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteIdentity.siteName,
    short_name: siteIdentity.siteName,
    description: fixedPageCopy.home.description,
    start_url: "/",
    display: "browser",
    background_color: "#0d0b08",
    theme_color: "#0d0b08",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
