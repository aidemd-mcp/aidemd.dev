import type { Metadata } from "next";
import { ogImage } from "@/service/socialShare";
import observerCopy from "../observerCopy";

const PAGE_URL = "https://aidemd.dev/observer/";

/**
 * Page metadata for /observer, built from `observerCopy` and the site's shared
 * `ogImage` config.
 *
 * Restates every shared field (canonical, og:url, og:site_name, og:type, image,
 * twitter card) because a page-level `openGraph`/`twitter` replaces the root
 * layout's objects instead of merging with them. The title is absolute so the
 * root `%s | aidemd.dev` template does not apply. The OG image is the hero
 * capture; its relative URL resolves against the root `metadataBase`.
 */
const observerMetadata: Metadata = {
  title: { absolute: observerCopy.meta.title },
  description: observerCopy.meta.description,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: ogImage.siteName,
    title: observerCopy.meta.title,
    description: observerCopy.meta.description,
    images: [
      {
        url: observerCopy.capture.src1x,
        width: observerCopy.capture.width,
        height: observerCopy.capture.height,
        alt: observerCopy.capture.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: observerCopy.meta.title,
    description: observerCopy.meta.description,
    images: [observerCopy.capture.src1x],
  },
};

export default observerMetadata;
