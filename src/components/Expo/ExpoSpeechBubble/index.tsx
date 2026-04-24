'use client';

interface ExpoSpeechBubbleProps {
  title: string;
  body: string;
  onDismiss: () => void;
}

/**
 * Speech bubble pinned to the Expo sprite. Renders a card with accent-green
 * title, body text, close button, and a right-bottom arrow pointing at the sprite.
 */
export default function ExpoSpeechBubble({ title, body, onDismiss }: ExpoSpeechBubbleProps) {
  return (
    <div
      className="max-w-[calc(100vw-120px)] md:max-w-[280px]"
      style={{
        position: 'relative',
        borderRadius: '14px',
        padding: '14px 16px',
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        marginBottom: '12px',
        pointerEvents: 'auto',
      }}
    >
      {/* Close button */}
      <button
        onClick={onDismiss}
        aria-label="Dismiss Expo tip"
        style={{
          position: 'absolute',
          top: '10px',
          right: '12px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-dim)',
          fontSize: '14px',
          lineHeight: 1,
          padding: '2px 4px',
        }}
      >
        ×
      </button>

      {/* Title */}
      <p
        style={{
          margin: '0 0 6px',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--color-accent)',
          paddingRight: '20px',
        }}
      >
        {title}
      </p>

      {/* Body */}
      <p
        style={{
          margin: 0,
          fontSize: '13px',
          lineHeight: 1.5,
          color: 'var(--color-fg)',
        }}
      >
        {body}
      </p>

      {/* Arrow — right-bottom, points toward the sprite below-right */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: '-6px',
          bottom: '22px',
          width: '12px',
          height: '12px',
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          transform: 'rotate(-45deg)',
          borderLeft: 'none',
          borderBottom: 'none',
        }}
      />
    </div>
  );
}
