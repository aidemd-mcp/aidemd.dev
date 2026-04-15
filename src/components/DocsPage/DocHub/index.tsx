import Link from "next/link";
import type { ScaffoldTreeEntry } from "@/types/scaffold";

type DocHubProps = {
  entries: ScaffoldTreeEntry[];
};

function hrefFor(entry: ScaffoldTreeEntry): string {
  switch (entry.kind) {
    case "doc":
      return `/docs/${entry.slug}`;
    case "agent":
      return `/agents/${entry.slug}`;
    case "command":
      return `/commands/${entry.slug}`;
    case "skill":
      return `/skills/${entry.slug}`;
  }
}

const DocHub = ({ entries }: DocHubProps) => {
  const docs = entries.filter((e) => e.kind === "doc");
  const agents = entries.filter((e) => e.kind === "agent");
  const commands = entries.filter((e) => e.kind === "command");
  const skills = entries.filter((e) => e.kind === "skill");

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-mono font-semibold text-zinc-100 mb-2">
          AIDE Scaffold Tree
        </h1>
        <p className="text-sm text-zinc-400 mb-10">
          Browse the full <code className="text-zinc-300">aide_init</code>{" "}
          scaffold — exactly as it lands in a fresh project. Every leaf links to
          its rendered page.
        </p>

        <nav aria-label="Scaffold tree" className="font-mono text-sm">
          {/* .aide/ folder */}
          <ul className="flex flex-col gap-0.5">
            <li className="text-zinc-500 select-none">.aide/</li>
            <ul className="flex flex-col gap-0.5 ml-4">
              {docs.map((entry) => (
                <li key={entry.slug} className="flex items-center gap-2">
                  <span className="text-zinc-600 select-none">├─</span>
                  <Link
                    href={hrefFor(entry)}
                    className="text-zinc-300 hover:text-zinc-100 transition-colors underline underline-offset-2"
                  >
                    {entry.filename}
                  </Link>
                </li>
              ))}
            </ul>

            {/* .claude/ folder */}
            <li className="text-zinc-500 select-none mt-3">.claude/</li>
            <ul className="flex flex-col gap-0.5 ml-4">
              {/* agents/aide/ subfolder */}
              <li className="text-zinc-500 select-none">agents/aide/</li>
              <ul className="flex flex-col gap-0.5 ml-4">
                {agents.map((entry) => (
                  <li key={entry.slug} className="flex items-center gap-2">
                    <span className="text-zinc-600 select-none">├─</span>
                    <Link
                      href={hrefFor(entry)}
                      className="text-zinc-300 hover:text-zinc-100 transition-colors underline underline-offset-2"
                    >
                      {entry.filename}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* commands/aide/ subfolder */}
              <li className="text-zinc-500 select-none mt-2">commands/aide/</li>
              <ul className="flex flex-col gap-0.5 ml-4">
                {commands.map((entry) => (
                  <li key={entry.slug} className="flex items-center gap-2">
                    <span className="text-zinc-600 select-none">├─</span>
                    <Link
                      href={hrefFor(entry)}
                      className="text-zinc-300 hover:text-zinc-100 transition-colors underline underline-offset-2"
                    >
                      {entry.filename}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* skills/ subfolder */}
              <li className="text-zinc-500 select-none mt-2">skills/</li>
              <ul className="flex flex-col gap-0.5 ml-4">
                {skills.map((entry) => (
                  <li key={entry.slug} className="flex items-center gap-2">
                    <span className="text-zinc-600 select-none">├─</span>
                    <Link
                      href={hrefFor(entry)}
                      className="text-zinc-300 hover:text-zinc-100 transition-colors underline underline-offset-2"
                    >
                      {entry.slug}/SKILL.md
                    </Link>
                  </li>
                ))}
              </ul>
            </ul>
          </ul>
        </nav>
      </div>
    </main>
  );
};

export default DocHub;
