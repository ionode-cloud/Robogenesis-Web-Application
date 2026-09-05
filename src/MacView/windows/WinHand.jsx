import OsWindow from '../OsWindow.jsx';

export default function WinHand({ isOpen, isFocused, zIndex, onClose, onMin, onFocus, onSetWallpaper }) {
  return (
    <OsWindow
      id="win-hand"
      title="🦾 Kinetic Robotic Hand — 3D Visualizer"
      isOpen={isOpen}
      isFocused={isFocused}
      zIndex={zIndex}
      initialWidth={720}
      initialHeight={500}
      initialTop={60}
      initialLeft={100}
      onClose={onClose}
      onMin={onMin}
      onFocus={onFocus}
      bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', background: '#ffffff' }}
    >
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
      <div
        style={{
          padding: '12px 20px',
          background: 'rgba(0,0,0,0.04)',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#000000',
          fontSize: '13px',
        }}
      >
        <div>
          <strong>Kinetic Hand Model v3.8</strong> · 42-DOF Kinetic Articulation
        </div>
        <button
          style={{
            padding: '4px 12px',
            borderRadius: '999px',
            background: '#000',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 600,
          }}
          onClick={() => onSetWallpaper(0)}
        >
          Set as Desktop Wallpaper
        </button>
      </div>
    </OsWindow>
  );
}
