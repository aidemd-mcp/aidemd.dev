import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import GlobalScripts from "@/components/GlobalScripts";
import { ogImage } from "@/service/socialShare";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// JSON-LD structured data — global across every route
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TetsuKodai Group LLC",
  url: "https://aidemd.dev",
  contactPoint: {
    "@type": "ContactPoint",
    url: "https://github.com/aidemd-mcp/server/issues",
    contactType: "customer support",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "aidemd.dev",
  url: "https://aidemd.dev",
};

export const viewport: Viewport = {
  themeColor: "#0d0b08",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | aidemd.dev",
    default: "aidemd.dev — The AIDE Methodology",
  },
  description:
    "aidemd.dev is the public, canonical home of the AIDE methodology and the @aidemd-mcp/server package. Treat a short intent spec as the contract every agent works from.",
  metadataBase: new URL("https://aidemd.dev"),
  alternates: { canonical: "https://aidemd.dev/" },
  openGraph: {
    type: "website",
    url: "https://aidemd.dev",
    siteName: ogImage.siteName,
    title: ogImage.title,
    description: ogImage.description,
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
    title: ogImage.title,
    description: ogImage.description,
    images: [ogImage.imagePath],
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
        <script
          id="ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          id="ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
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
