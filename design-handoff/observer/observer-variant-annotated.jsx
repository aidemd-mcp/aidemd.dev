// /observer — Variant B: annotated capture.
// Hero copy beside the capture; numbered callouts on the capture link (#anchor) to the matching sections below,
// which highlight via CSS :target. Then how it knows / local / setup → closing action.
// Requires observer-shared.jsx. Exported from ObserverV2Annotated in observer-v2-variants.jsx; markup unchanged.

// Callout positions are % of the capture frame — retune once the real capture lands.
// Placed on observer-capture-aidemd.png (1440×1180).
const O2_PINS = [
  { n: 1, to: 'b-rail', x: 9.6, y: 57.2, label: 'pipeline rail' },
  { n: 2, to: 'b-own', x: 32.2, y: 15.3, label: 'one live session per project' },
  { n: 3, to: 'b-states', x: 61.6, y: 15.3, label: 'a session waiting for you' },
  { n: 4, to: 'b-quiet', x: 67.4, y: 64, label: 'quiet 25 min · maybe stuck' },
];

function ObserverVariantAnnotated({ menuOpen, slot = 'obs2-capture' }) {
  return (
    <div className="o2 vb">
      <O2Nav menuOpen={menuOpen} />
      <div className="o2-in">
        <header className="hero">
          <div><HeroCopy /></div>
          <div>
            <Capture pins={O2_PINS} />
            <nav className="keys" aria-label="callouts">{O2_PINS.map((p) => <a key={p.n} href={'#' + p.to}><i>{p.n}</i>{p.label}</a>)}</nav>
          </div>
        </header>
        <div className="anno">
          <SecRail n="1" id="b-rail" />
          <SecOwn n="2" id="b-own" />
          <SecStates n="3" id="b-states" />
          <SecQuiet n="4" id="b-quiet" />
        </div>
        <div className="tail">
          <SecHow />
          <SecLocal />
          <SecSetup />
        </div>
        <Close />
        <O2Foot />
      </div>
    </div>
  );
}

Object.assign(window, { ObserverVariantAnnotated, O2_PINS });
