import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import GlobalScripts from "@/components/GlobalScripts";
import siteIdentity from "@/data/siteIdentity";
import fixedPageCopy from "@/app/_shared/listSitePages/fixedPageCopy";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  // next/font's generated fallback is an Arial-metric face: proportional, so
  // text wraps differently before the swap (hero headline CLS) and it captures
  // glyphs outside the latin subset (e.g. "→"). Use the metric-matched
  // monospace face declared in globals.css instead, then plain monospace.
  adjustFontFallback: false,
  fallback: ["JetBrains Mono Fallback", "ui-monospace", "monospace"],
});

export const viewport: Viewport = {
  themeColor: "#0d0b08",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteIdentity.url),
  title: {
    template: "%s | " + siteIdentity.siteName,
    default: fixedPageCopy.home.title + " | " + siteIdentity.siteName,
  },
  description: fixedPageCopy.home.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="bg-[color:var(--color-bg)] text-[color:var(--color-fg)] font-mono">
        <GlobalScripts />
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
