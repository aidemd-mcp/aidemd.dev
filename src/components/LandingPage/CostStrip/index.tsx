const CostStrip = () => {
  return (
    <section className="w-full py-16 px-4 border-t border-b border-zinc-700">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
          The cost of not knowing
        </p>
        <p className="text-base text-zinc-300 leading-relaxed">
          A six-month fractional specialist engagement runs{" "}
          <strong className="text-zinc-100">$30,000–$60,000</strong> at the low
          end{" "}
          <span className="text-zinc-500 text-sm">(Geisheker Group, 2026)</span>
          . AIDEMD captures the same domain knowledge for free via{" "}
          <code className="text-zinc-300 font-mono">npx</code>.
        </p>
      </div>
    </section>
  );
};

export default CostStrip;
