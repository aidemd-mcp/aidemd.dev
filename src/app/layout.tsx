import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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
  title: "AIDE — Autonomous Intent-Driven Engineering",
  description:
    "The canonical methodology for agentic engineering. Install aidemd-mcp and give your AI agents byte-faithful, timestamped context.",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AIDE",
  url: "https://aidemd.dev",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: "https://aidemd.dev",
  name: "AIDE",
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="min-h-full bg-zinc-950 text-zinc-100">{children}</body>
    </html>
  );
}
