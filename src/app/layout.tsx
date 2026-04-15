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
  title: "AIDE: Autonomous Intent-Driven Engineering -- Code is ephemeral. Intent is law.",
  description:
    "Describe what you want. AIDE cascades your intent through eight specialized agents and a persistent brain into working code. Self-serve via npx.",
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
      <head />
      <body className="min-h-full bg-zinc-950 text-zinc-100">
        <CanonicalTag />
        {children}
      </body>
    </html>
  );
}
