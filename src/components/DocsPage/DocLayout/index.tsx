import React from "react";
import Link from "next/link";

type DocLayoutProps = {
  children: React.ReactNode;
};

const DocLayout = ({ children }: DocLayoutProps) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-4 text-sm font-mono">
          <Link
            href="/"
            className="text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            AIDE
          </Link>
          <span className="text-zinc-700">/</span>
          <Link
            href="/docs"
            className="text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Docs
          </Link>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-12 leading-relaxed text-base">
        {children}
      </div>
    </div>
  );
};

export default DocLayout;
