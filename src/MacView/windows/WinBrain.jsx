import OsWindow from '../OsWindow.jsx';

export default function WinBrain({ isOpen, isFocused, zIndex, onClose, onMin, onFocus, onSetWallpaper }) {
  return (
    <OsWindow
      id="win-brain"
      title="🧠 Neural Cognitive Mesh — brain.html"
      isOpen={isOpen}
      isFocused={isFocused}
      zIndex={zIndex}
      initialWidth={720}
      initialHeight={500}
      initialTop={100}
      initialLeft={260}
      onClose={onClose}
      onMin={onMin}
      onFocus={onFocus}
      bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', background: '#EDEEF5' }}
    >
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_132049_036591b8-6e92-4760-b94c-a7ea6eef315c.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '16px',
            background: 'rgba(26,26,26,0.85)',
            backdropFilter: 'blur(8px)',
            padding: '6px 14px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '12px',
            color: '#9fff00',
            fontWeight: 700,
          }}
        >
          ● Synaptic Cognitive Pipeline · 4 TOPS Active
        </div>
      </div>
      <div
        style={{
          padding: '12px 20px',
          background: '#ffffff',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#1a1a1a',
          fontSize: '13px',
        }}
      >
        <div>
          <strong>Neuromorphic Brain Architecture</strong> · brain.html
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{
              padding: '5px 14px',
              borderRadius: '999px',
              background: '#1a1a1a',
              color: '#9fff00',
              fontSize: '12px',
              fontWeight: 700,
            }}
            onClick={() => onSetWallpaper(2)}
          >
            Set as Wallpaper
          </button>
          <a
            href="/brain.html"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '5px 14px',
              borderRadius: '999px',
              background: 'rgba(0,0,0,0.06)',
              color: '#000',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Open brain.html ↗
          </a>
        </div>
      </div>
    </OsWindow>
  );
}
