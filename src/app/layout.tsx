import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ExpoTipProvider } from "@/components/Expo/ExpoTipContext";
import Expo from "@/components/Expo";
import GlobalScripts from "@/components/GlobalScripts";
import CanonicalTag from "@/components/CanonicalTag";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | aidemd.dev",
    default: "aidemd.dev — The AIDE Methodology",
  },
  description:
    "aidemd.dev is the public, canonical home of the AIDE methodology and the @aidemd-mcp/server package. Treat a short intent spec as the contract every agent works from.",
  metadataBase: new URL("https://aidemd.dev"),
  openGraph: {
    type: "website",
    url: "https://aidemd.dev",
    siteName: "aidemd.dev",
    title: "aidemd.dev — The AIDE Methodology",
    description:
      "aidemd.dev is the public, canonical home of the AIDE methodology and the @aidemd-mcp/server package.",
  },
  twitter: {
    card: "summary_large_image",
    title: "aidemd.dev — The AIDE Methodology",
    description:
      "aidemd.dev is the public, canonical home of the AIDE methodology and the @aidemd-mcp/server package.",
  },
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
        <CanonicalTag />
        <ExpoTipProvider>
          {children}
          <Expo />
        </ExpoTipProvider>
      </body>
    </html>
  );
}
