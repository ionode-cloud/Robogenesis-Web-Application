import OsWindow from '../OsWindow.jsx';

export default function WinCoin({ isOpen, isFocused, zIndex, onClose, onMin, onFocus, onSetWallpaper }) {
  return (
    <OsWindow
      id="win-coin"
      title="🪙 VaultShield™ Crypto Security — coin.html"
      isOpen={isOpen}
      isFocused={isFocused}
      zIndex={zIndex}
      initialWidth={720}
      initialHeight={500}
      initialTop={80}
      initialLeft={220}
      onClose={onClose}
      onMin={onMin}
      onFocus={onFocus}
      bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', background: '#0b0e17' }}
    >
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_003132_8b7edcb6-c64d-4a52-a9ca-879942e122ad.mp4"
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
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            padding: '6px 14px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '12px',
            color: '#a78bfa',
            fontWeight: 600,
          }}
        >
          ⚡ EAL6+ HSM Secure Enclave
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
          <strong>VaultShield 3D Hardware Token</strong> · Passkeys &amp; HSM
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{
              padding: '5px 14px',
              borderRadius: '999px',
              background: '#7342E2',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
            }}
            onClick={() => onSetWallpaper(3)}
          >
            Set as Wallpaper
          </button>
          <a
            href="/coin.html"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '5px 14px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Open coin.html ↗
          </a>
        </div>
      </div>
    </OsWindow>
  );
}
