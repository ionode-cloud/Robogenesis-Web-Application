import OsWindow from '../OsWindow.jsx';

export default function WinAbout({ isOpen, isFocused, zIndex, onClose, onMin, onFocus }) {
  return (
    <OsWindow
      id="win-about"
      title="About Robogenesis"
      isOpen={isOpen}
      isFocused={isFocused}
      zIndex={zIndex}
      initialWidth={620}
      initialHeight={440}
      initialTop={120}
      initialLeft={240}
      onClose={onClose}
      onMin={onMin}
      onFocus={onFocus}
    >
      <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>ROBOGENESIS</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
        Next-generation robotics, IoT infrastructure, embedded systems, and autonomous intelligence.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          background: 'rgba(255,255,255,0.06)',
          padding: '16px',
          borderRadius: '10px',
          textAlign: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>48+</div>
          <div style={{ fontSize: '11px', opacity: 0.6 }}>Projects</div>
        </div>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>8</div>
          <div style={{ fontSize: '11px', opacity: 0.6 }}>Domains</div>
        </div>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>248</div>
          <div style={{ fontSize: '11px', opacity: 0.6 }}>Active Units</div>
        </div>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>99.4%</div>
          <div style={{ fontSize: '11px', opacity: 0.6 }}>Uptime</div>
        </div>
      </div>
    </OsWindow>
  );
}
