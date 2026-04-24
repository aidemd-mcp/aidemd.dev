"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Root-layout fallback canonical tag for routes that cannot set canonical via
 * generateMetadata (primarily `/`). Docs routes set their own canonical via
 * alternates.canonical in per-route generateMetadata (step 10).
 *
 * With trailingSlash: true in next.config, Next appends a trailing slash to
 * all pathnames. The href mirrors that convention: `/` stays `/` (no double
 * slash), all other pathnames use the pathname as-is (already slash-terminated).
 */
export default function CanonicalTag() {
  const pathname = usePathname();

  useEffect(() => {
    const canonicalUrl = `https://aidemd.dev${pathname === "/" ? "" : pathname}`;
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);
  }, [pathname]);

  return null;
}
