import Link from "next/link";

type DocHubProps = {
  docs: { slug: string; title: string }[];
};

const DocHub = ({ docs }: DocHubProps) => {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-mono font-semibold text-zinc-100 mb-2">
          AIDE Canonical Docs
        </h1>
        <p className="text-sm text-zinc-400 mb-10">
          The byte-faithful, timestamped, archivable record of the AIDE
          methodology. Every page is a direct render of the source file in the{" "}
          <code className="text-zinc-300">.aide/</code> hub.
        </p>

        <ol className="flex flex-col gap-3">
          {docs.map((doc, index) => (
            <li key={doc.slug} className="flex gap-4 items-baseline">
              <span className="flex-none w-6 text-right text-xs font-mono text-zinc-600">
                {index + 1}
              </span>
              <Link
                href={`/docs/${doc.slug}`}
                className="text-zinc-300 hover:text-zinc-100 transition-colors underline underline-offset-2 font-mono text-sm"
              >
                {doc.title}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
};

export default DocHub;
