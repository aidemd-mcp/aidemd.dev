'use client';

import { EXPO_TIPS } from '@/data/expoTips';
import { useExpoTip } from './ExpoTipContext';
import ExpoSpeechBubble from './ExpoSpeechBubble';

/**
 * Expo mascot — fixed bottom-right, pointer-events-none wrapper so underlying
 * content remains fully clickable. Resolves the current tip from EXPO_TIPS keyed
 * on activeSection. Speech bubble hides on dismiss; clicking the sprite re-opens it.
 */
export default function Expo() {
  const { activeSection, dismissed, setDismissed } = useExpoTip();
  const tip = EXPO_TIPS[activeSection];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 20,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: '10px',
      }}
    >
      {/* Speech bubble — only when not dismissed */}
      {!dismissed && (
        <ExpoSpeechBubble
          title={tip.title}
          body={tip.body}
          onDismiss={() => setDismissed(true)}
        />
      )}

      {/* Sprite button — clicking re-opens bubble when dismissed */}
      <button
        onClick={() => setDismissed(false)}
        aria-label="Open Expo tip"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          pointerEvents: 'auto',
          animation: 'expoFloat 4s ease-in-out infinite',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/expo-${tip.pose}.png`}
          alt="Expo mascot"
          className="w-[80px] md:w-[140px]"
          style={{ display: 'block' }}
        />
      </button>
    </div>
  );
}
