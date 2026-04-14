import buildInstallConfig from "@/service/install/buildInstallConfig";
import CodeBlock from "@/components/shared/CodeBlock";
import TroubleshootingCallout from "@/components/LandingPage/TroubleshootingCallout";

const InstallHero = () => {
  const { mcpConfig, commandSequence } = buildInstallConfig();
  const jsonCode = JSON.stringify(mcpConfig, null, 2);

  return (
    <header id="install" className="w-full py-20 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-10">
        <p className="text-base text-zinc-400 leading-relaxed">
          Ship code conversationally. A team of specialized agents translates
          your intent into production quality software through the AIDE
          cascading intent pipeline.
        </p>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-zinc-500 font-mono">
            Paste this into your project&apos;s{" "}
            <code className="text-zinc-300">.mcp.json</code>
          </p>
          <CodeBlock code={jsonCode} language="json" />
        </div>

        <ol className="flex flex-col gap-6">
          {commandSequence.map((step) => (
            <li key={step.step} className="flex flex-col gap-2">
              <div className="flex gap-4 items-start">
                <span className="flex-none w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 text-sm font-mono font-semibold flex items-center justify-center mt-0.5">
                  {step.step}
                </span>
                <p className="text-sm text-zinc-300 flex-1">
                  {step.instruction}
                </p>
              </div>
              {step.code && step.step !== 1 && <CodeBlock code={step.code} />}
            </li>
          ))}
        </ol>

        <TroubleshootingCallout />
      </div>
    </header>
  );
};

export default InstallHero;
