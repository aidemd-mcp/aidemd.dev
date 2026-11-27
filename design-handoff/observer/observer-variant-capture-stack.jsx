// /observer — Variant A: capture-led stack.
// Short hero → capture full-width with the state legend beside it → sections as a two-column grid → closing action.
// Requires observer-shared.jsx. Exported from ObserverV2Stack in observer-v2-variants.jsx; markup unchanged.

function ObserverVariantCaptureStack({ menuOpen, slot = 'obs2-capture' }) {
  return (
    <div className="o2 va">
      <O2Nav menuOpen={menuOpen} />
      <div className="o2-in">
        <header className="hero"><HeroCopy /></header>
        <div className="capgrid"><Capture /><Legend /></div>
        <div className="sects">
          <SecRail />
          <SecOwn />
          <SecStates />
          <SecHow />
          <SecQuiet />
          <SecLocal />
          <div className="wide"><SecSetup /></div>
        </div>
        <Close />
        <O2Foot />
      </div>
    </div>
  );
}

Object.assign(window, { ObserverVariantCaptureStack });
