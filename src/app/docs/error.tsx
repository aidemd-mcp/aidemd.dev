"use client";

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DocsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <p className="font-mono text-sm text-red-400 mb-2">Docs Error</p>
        <p className="text-zinc-300 text-sm mb-6">
          {error.message || "Failed to load documentation."}
        </p>
        <button
          onClick={reset}
          className="font-mono text-xs text-zinc-400 border border-zinc-700 rounded px-3 py-1.5 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
