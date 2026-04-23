import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
      {/*
       * GlobalScripts (GA4 via next/script afterInteractive) and CanonicalTag
       * (footer-dot authority signal) are built in step 11 and imported here
       * once they exist. Omitting them for now keeps this step self-contained.
       */}
      <body className="bg-[color:var(--color-bg)] text-[color:var(--color-fg)] font-mono">
        {children}
      </body>
    </html>
  );
}
