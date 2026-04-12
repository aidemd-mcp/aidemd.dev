const HallucinationEvidence = () => {
  return (
    <section className="w-full py-16 px-4 border-t border-zinc-800">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-zinc-100">
            The hallucination problem is not solved
          </h2>
          <p className="text-sm text-zinc-500">
            Evidence from peer-reviewed research, cited verbatim.
          </p>
        </div>

        <blockquote className="border-l-2 border-zinc-500 bg-zinc-900/30 rounded-r-lg pl-5 pr-4 py-4">
          <p className="text-base text-zinc-300 leading-relaxed italic">
            &ldquo;Purpose-built legal AI still hallucinates on over one in six
            queries.&rdquo;
          </p>
          <footer className="mt-2 text-sm text-zinc-500 not-italic">
            Stanford HAI / Dahl et al., 2024
          </footer>
        </blockquote>

        <p className="text-sm text-zinc-500 leading-relaxed">
          This is purpose-built legal AI — systems designed from the ground up
          for a single domain — and they still hallucinate one in six times.
          AIDE&apos;s answer is persistent, auditable research a human can verify
          before agents ship code, targeting operational domains where iteration
          is cheap, not regulated domains where errors are irreversible. The
          research documents the failure mode, not AIDE&apos;s track record.
        </p>
      </div>
    </section>
  );
};

export default HallucinationEvidence;
