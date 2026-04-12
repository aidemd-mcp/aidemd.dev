import React from "react";

type DocLayoutProps = {
  children: React.ReactNode;
};

const DocLayout = ({ children }: DocLayoutProps) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-6 py-12 leading-relaxed text-base">
        {children}
      </div>
    </div>
  );
};

export default DocLayout;
