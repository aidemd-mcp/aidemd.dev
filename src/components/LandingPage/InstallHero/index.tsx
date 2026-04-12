import buildInstallConfig from "@/service/install/buildInstallConfig";
import CodeBlock from "@/components/shared/CodeBlock";
import TroubleshootingCallout from "@/components/LandingPage/TroubleshootingCallout";

const InstallHero = () => {
  const { mcpConfig, commandSequence } = buildInstallConfig();
  const jsonCode = JSON.stringify(mcpConfig, null, 2);

  return (
    <header id="install" className="w-full py-20 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
            AIDE collapses the specialist hire into the agent loop.
          </h1>
          <p className="text-base text-zinc-400 leading-relaxed">
            A research agent studies your domain, persists findings to your
            brain, and six specialized agents — spec-writer, researcher, domain
            expert, architect, implementor, QA — draw from that brain across
            every session. Works with Claude Code today.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-zinc-500 font-mono">
            Paste this into your project&apos;s <code className="text-zinc-300">.mcp.json</code>
          </p>
          <CodeBlock code={jsonCode} language="json" />
        </div>

        <ol className="flex flex-col gap-6">
          {commandSequence.map((step) => (
            <li key={step.step} className="flex gap-4 items-start">
              <span className="flex-none w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 text-sm font-mono font-semibold flex items-center justify-center mt-0.5">
                {step.step}
              </span>
              <div className="flex flex-col gap-2 flex-1">
                <p className="text-sm text-zinc-300">{step.instruction}</p>
                {step.code && step.step !== 1 && (
                  <CodeBlock code={step.code} />
                )}
              </div>
            </li>
          ))}
        </ol>

        <TroubleshootingCallout />
      </div>
    </header>
  );
};

export default InstallHero;
