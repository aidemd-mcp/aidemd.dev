import buildInstallConfig from "@/service/install/buildInstallConfig";
import CodeBlock from "@/components/shared/CodeBlock";
import Link from "next/link";

const InstallFooter = () => {
  const { mcpConfig, commandSequence } = buildInstallConfig();
  const jsonCode = JSON.stringify(mcpConfig, null, 2);

  return (
    <footer className="w-full border-t border-zinc-800 py-16 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-zinc-400 font-mono uppercase tracking-wider">
            Install
          </p>
          <CodeBlock code={jsonCode} language="json" />
        </div>

        <ol className="flex flex-col gap-4">
          {commandSequence.map((step) => (
            <li key={step.step} className="flex gap-4 items-start">
              <span className="flex-none w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 text-xs font-mono flex items-center justify-center mt-0.5">
                {step.step}
              </span>
              <div className="flex flex-col gap-2 flex-1">
                <p className="text-sm text-zinc-300">{step.instruction}</p>
                {step.code && (
                  <CodeBlock code={step.code} />
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="pt-4 border-t border-zinc-800">
          <Link
            href="/docs"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Read the canonical spec →
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default InstallFooter;
