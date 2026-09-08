import OsWindow from '../OsWindow.jsx';
import HomePage from '../../pages/HomePage.jsx';

export default function WinSectionHome({
  isOpen,
  isMinimized,
  isFocused,
  zIndex,
  onClose,
  onMin,
  onFocus,
  onOpenWin,
}) {
  return (
    <OsWindow
      id="win-section-home"
      title="🏠 Home — Autonomous Robotics Ecosystem"
      isOpen={isOpen}
      isMinimized={isMinimized}
      isFocused={isFocused}
      zIndex={zIndex}
      initialWidth={1100}
      initialHeight={720}
      initialTop={48}
      initialLeft={60}
      onClose={onClose}
      onMin={onMin}
      onFocus={onFocus}
      bodyStyle={{
        padding: 0,
        background: '#070c18',
        color: '#ffffff',
        overflowY: 'auto',
      }}
    >
      <div className="os-page-embed">
        <HomePage
          onNavigate={(page) => {
            if (onOpenWin) {
              onOpenWin('win-section-' + page);
            }
          }}
          onOpenOs={() => {}}
        />
      </div>
    </OsWindow>
  );
}
