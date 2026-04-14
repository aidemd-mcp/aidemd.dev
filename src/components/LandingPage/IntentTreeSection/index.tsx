/** Static folder-tree diagram showing cascading .aide intent specs through an example content-pipeline application. */

type TreeLine = {
  text: string;
  annotation?: string;
};

const treeLines: TreeLine[] = [
  { text: "content-pipeline/" },
  { text: "├── .aide/" },
  { text: "│   └── intent.aide", annotation: "← project-wide intent" },
  { text: "├── src/" },
  { text: "│   ├── .aide", annotation: "← narrows to content domain" },
  { text: "│   └── service/" },
  { text: "│       ├── ingest/" },
  { text: "│       │   ├── .aide", annotation: "← narrows to ingestion" },
  { text: "│       │   ├── index.ts" },
  { text: "│       │   ├── parseFeed/" },
  { text: "│       │   │   ├── .aide", annotation: "← narrows to feed parsing" },
  { text: "│       │   │   └── index.ts" },
  { text: "│       │   └── normalize/" },
  { text: "│       │       └── index.ts", annotation: "(helper — no spec)" },
  { text: "│       ├── transform/" },
  { text: "│       │   ├── .aide", annotation: "← narrows to transformation" },
  { text: "│       │   └── index.ts" },
  { text: "│       └── publish/" },
  { text: "│           ├── .aide", annotation: "← narrows to publishing" },
  { text: "│           └── index.ts" },
];

const IntentTreeSection = () => {
  return (
    <section className="w-full py-16 px-4 border-t border-zinc-800">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-zinc-100">
            Intent cascades through the project tree
          </h2>
          <p className="text-sm text-zinc-500">
            Agents read from root to leaf — each spec narrows the parent&apos;s intent, so every module carries the full context of the project above it.
          </p>
        </div>

        <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4">
          <pre className="text-sm font-mono leading-relaxed overflow-x-auto">
            {treeLines.map((line, index) => {
              const isAideFile =
                line.text.includes(".aide") && !line.annotation?.startsWith("(");
              const isHelperLine = line.annotation?.startsWith("(");

              return (
                <div key={index}>
                  <span className={isAideFile ? "text-zinc-200" : "text-zinc-400"}>
                    {line.text}
                  </span>
                  {line.annotation && (
                    <span
                      className={
                        isHelperLine ? "text-zinc-600" : "text-zinc-500"
                      }
                    >
                      {"  "}
                      {line.annotation}
                    </span>
                  )}
                </div>
              );
            })}
          </pre>
        </div>
      </div>
    </section>
  );
};

export default IntentTreeSection;
