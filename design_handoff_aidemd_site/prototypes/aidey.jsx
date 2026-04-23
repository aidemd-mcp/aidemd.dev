// AIDEY — floating domain-expert mascot guide.
// Shows contextual tips as the user scrolls through the page.
// Uses the three pose crops from /assets.

const AIDEY_TIPS_DEFAULT = [
  { pose: 'wave', title: 'hey — i\'m AIDEY', body: 'your domain expert. i walk you through how intent becomes code, one stage at a time. click the pipeline stages or open any node in the intent tree.' },
  { pose: 'teach', title: 'the .aide is the contract', body: 'scope, intent, outcomes.desired, outcomes.undesired. if it doesn\'t serve the intent, it gets cut.' },
  { pose: 'read', title: 'the brain holds durable knowledge', body: 'domain research + your coding playbook live in an Obsidian vault. fill it once, reuse it across every project.' },
  { pose: 'teach', title: 'intent cascades', body: 'every child .aide inherits its parent. you never restate context — you narrow it.' },
  { pose: 'wave', title: 'that\'s it!', body: 'ready to install? scroll down for the one-liner.' },
];

function AideyGuide({ accent = '#c25a3a', palette, tips = AIDEY_TIPS_DEFAULT, variant = 'light' }) {
  const [idx, setIdx] = React.useState(0);
  const [open, setOpen] = React.useState(true);
  const tip = tips[idx];

  const bg = variant === 'dark' ? '#16120d' : '#fffdf7';
  const fg = variant === 'dark' ? '#e8dfce' : '#2a1f18';
  const dim = variant === 'dark' ? 'rgba(232,223,206,0.6)' : 'rgba(42,31,24,0.6)';
  const border = variant === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(42,31,24,0.12)';

  return (
    <div style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 20, display: 'flex', alignItems: 'flex-end', gap: 10, pointerEvents: 'none' }}>
      {open && (
        <div
          style={{
            pointerEvents: 'auto',
            background: bg,
            color: fg,
            border: `1px solid ${border}`,
            borderRadius: 14,
            padding: '14px 16px',
            width: 280,
            boxShadow: '0 18px 50px rgba(40,20,10,0.18)',
            position: 'relative',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ position: 'absolute', right: -6, bottom: 22, width: 12, height: 12, background: bg, borderRight: `1px solid ${border}`, borderBottom: `1px solid ${border}`, transform: 'rotate(-45deg)' }} />
          <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: 6, right: 8, background: 'transparent', border: 'none', color: dim, fontSize: 16, cursor: 'pointer', lineHeight: 1 }}>×</button>
          <div style={{ fontSize: 13, fontWeight: 600, color: accent, marginBottom: 4, letterSpacing: 0.2 }}>{tip.title}</div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: fg, marginBottom: 10 }}>{tip.body}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: dim }}>
            <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} style={navBtn(dim, idx === 0)}>←</button>
            <span>{idx + 1} / {tips.length}</span>
            <button onClick={() => setIdx((i) => Math.min(tips.length - 1, i + 1))} disabled={idx === tips.length - 1} style={navBtn(dim, idx === tips.length - 1)}>→</button>
          </div>
        </div>
      )}
      <div style={{ pointerEvents: 'auto', cursor: 'pointer' }} onClick={() => setOpen(true)} title="ask AIDEY">
        <img
          src={`assets/aidey-${tip.pose}.png`}
          alt="AIDEY"
          style={{
            width: 140,
            height: 'auto',
            filter: 'drop-shadow(0 8px 16px rgba(60,30,10,0.18))',
            animation: 'aideyFloat 4s ease-in-out infinite',
          }}
        />
      </div>
      <style>{`
        @keyframes aideyFloat {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
}

function navBtn(color, disabled) {
  return {
    background: 'transparent', border: 'none', color, fontSize: 14, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.3 : 1, padding: '2px 6px',
  };
}

// Tiny inline AIDEY (no bubble) — for decorative placements
function AideyInline({ pose = 'wave', size = 80 }) {
  return <img src={`assets/aidey-${pose}.png`} alt="" style={{ width: size, height: 'auto', display: 'block' }} />;
}

Object.assign(window, { AideyGuide, AideyInline, AIDEY_TIPS_DEFAULT });
