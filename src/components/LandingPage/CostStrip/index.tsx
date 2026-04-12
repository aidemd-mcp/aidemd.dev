const CostStrip = () => {
  return (
    <section className="w-full py-14 px-4 border-t border-b border-zinc-800">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <p className="text-base text-zinc-300 leading-relaxed">
          Tax attorneys charge{" "}
          <strong className="text-zinc-100">$200–$1,000 per hour</strong>
          {" "}
          <span className="text-zinc-500 text-sm">(Harness Wealth, 2025)</span>
          . A six-month fractional specialist engagement runs{" "}
          <strong className="text-zinc-100">$30,000–$60,000</strong> at the low
          end{" "}
          <span className="text-zinc-500 text-sm">(Geisheker Group, 2026)</span>
          . AIDE is free via <code className="text-zinc-300 font-mono">npx</code>.
        </p>
      </div>
    </section>
  );
};

export default CostStrip;
