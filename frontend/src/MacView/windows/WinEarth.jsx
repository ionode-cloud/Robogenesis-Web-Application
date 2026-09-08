import OsWindow from '../OsWindow.jsx';

export default function WinEarth({ isOpen, isFocused, zIndex, onClose, onMin, onFocus, onSetWallpaper }) {
  return (
    <OsWindow
      id="win-earth"
      title="🌍 Global Earth Telemetry — Orbit Visualizer"
      isOpen={isOpen}
      isFocused={isFocused}
      zIndex={zIndex}
      initialWidth={700}
      initialHeight={480}
      initialTop={90}
      initialLeft={320}
      onClose={onClose}
      onMin={onMin}
      onFocus={onFocus}
      bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', background: '#000000' }}
    >
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '16px',
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            padding: '6px 14px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '12px',
            color: '#34d399',
            fontWeight: 600,
          }}
        >
          ● Orbital Telemetry: 400km LEO · Nominal
        </div>
      </div>
      <div
        style={{
          padding: '12px 20px',
          background: 'rgba(255,255,255,0.06)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#ffffff',
          fontSize: '13px',
        }}
      >
        <div>
          <strong>Planet Earth Autonomous Mesh</strong> · Global Telemetry
        </div>
        <button
          style={{
            padding: '5px 14px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #34d399, #06b6d4)',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 700,
          }}
          onClick={() => onSetWallpaper(4)}
        >
          Set as Desktop Wallpaper
        </button>
      </div>
    </OsWindow>
  );
}
