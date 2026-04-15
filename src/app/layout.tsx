import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import CanonicalTag from "@/components/shared/CanonicalTag";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIDEMD — Code is ephemeral. Intent is law.",
  description:
    "Describe what you want. AIDE cascades your intent through eight specialized agents and a persistent brain into working code. Self-serve via npx.",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AIDEMD",
  url: "https://aidemd.dev",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: "https://aidemd.dev",
  name: "AIDEMD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          id="ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          id="ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="min-h-full bg-zinc-950 text-zinc-100">
        <CanonicalTag />
        {children}
      </body>
    </html>
  );
}
