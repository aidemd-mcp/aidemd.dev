"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Injects/updates the canonical <link> tag in the document head based on the
 *  current pathname. Required for static exports (`output: "export"`) where
 *  `alternates.canonical` in generateMetadata is unreliable. Returns null. */
export default function CanonicalTag() {
  const pathname = usePathname();

  useEffect(() => {
    const path = pathname === "/" ? "" : pathname.replace(/\/$/, "");
    const canonicalUrl = `https://aidemd.dev${path}`;
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
