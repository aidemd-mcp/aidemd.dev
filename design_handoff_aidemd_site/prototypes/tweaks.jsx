// Tweaks panel — accent color + typography pairing.

function TweaksPanel({ tweaks, update }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    window.__setTweaksVisible = setVisible;
    return () => { window.__setTweaksVisible = null; };
  }, []);

  if (!visible) return null;

  const accents = [
    { name: 'terracotta', value: '#c25a3a' },
    { name: 'amber', value: '#e8a43a' },
    { name: 'ink', value: '#1a1410' },
    { name: 'forest', value: '#3d6b4a' },
    { name: 'electric', value: '#3a5df0' },
    { name: 'rose', value: '#c04870' },
  ];

  const pairings = [
    { id: 'editorial', name: 'Editorial', subtitle: 'Fraunces + Geist Mono' },
    { id: 'terminal', name: 'Terminal', subtitle: 'JetBrains Mono all the way' },
    { id: 'linear', name: 'Quiet', subtitle: 'Geist + Geist Mono' },
    { id: 'plex', name: 'Technical', subtitle: 'IBM Plex Sans + Mono' },
    { id: 'serif', name: 'Literary', subtitle: 'Newsreader + IBM Plex Mono' },
  ];

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 100,
      width: 280, background: '#1a1612', color: '#e8dfce',
      border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
      padding: '14px 16px', fontFamily: 'Geist, system-ui, sans-serif',
      boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
    }}>
      <div style={{ fontSize: 11, letterSpacing: 1.5, color: 'rgba(232,223,206,0.5)', marginBottom: 12, fontFamily: 'Geist Mono, monospace' }}>TWEAKS</div>

      <div style={{ fontSize: 12, marginBottom: 6, color: 'rgba(232,223,206,0.7)' }}>Accent color</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, marginBottom: 16 }}>
        {accents.map((a) => (
          <button key={a.value} onClick={() => update({ accent: a.value })} title={a.name}
            style={{
              height: 28, borderRadius: 6, background: a.value,
              border: tweaks.accent === a.value ? '2px solid #fff' : '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer',
            }} />
        ))}
      </div>

      <div style={{ fontSize: 12, marginBottom: 6, color: 'rgba(232,223,206,0.7)' }}>Typography pairing</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {pairings.map((p) => {
          const active = tweaks.typePairing === p.id;
          return (
            <button key={p.id} onClick={() => update({ typePairing: p.id })}
              style={{
                textAlign: 'left', padding: '8px 10px',
                background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: `1px solid ${active ? 'rgba(255,255,255,0.2)' : 'transparent'}`,
                borderRadius: 6, color: '#e8dfce', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(232,223,206,0.5)' }}>{p.subtitle}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function typeStack(pairing) {
  switch (pairing) {
    case 'terminal':
      return { sans: '"JetBrains Mono", monospace', mono: '"JetBrains Mono", monospace', display: '"JetBrains Mono", monospace' };
    case 'editorial':
      return { sans: 'Geist, system-ui, sans-serif', mono: '"Geist Mono", monospace', display: 'Fraunces, Georgia, serif' };
    case 'linear':
      return { sans: 'Geist, system-ui, sans-serif', mono: '"Geist Mono", monospace', display: 'Geist, system-ui, sans-serif' };
    case 'plex':
      return { sans: '"IBM Plex Sans", sans-serif', mono: '"IBM Plex Mono", monospace', display: '"IBM Plex Sans", sans-serif' };
    case 'serif':
      return { sans: '"Newsreader", Georgia, serif', mono: '"IBM Plex Mono", monospace', display: '"Newsreader", Georgia, serif' };
    default:
      return { sans: 'Geist, system-ui, sans-serif', mono: '"Geist Mono", monospace', display: 'Fraunces, Georgia, serif' };
  }
}

Object.assign(window, { TweaksPanel, typeStack });
