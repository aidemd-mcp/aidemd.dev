import Link from "next/link";

const InstallFooter = () => {
  return (
    <footer className="w-full border-t border-zinc-800 py-16 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2">
              <code className="text-sm text-zinc-200 font-mono">npx @aidemd-mcp/server init</code>
            </div>
            <Link
              href="/#install"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              See full install instructions
            </Link>
          </div>
          <Link
            href="/docs"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Read the canonical spec &rarr;
          </Link>
        </div>

        <div className="border-t border-zinc-800 pt-4">
          <p className="text-xs text-zinc-600">
            &copy; 2026 TetsuKodai Group LLC
          </p>
        </div>
      </div>
    </footer>
  );
};

export default InstallFooter;
