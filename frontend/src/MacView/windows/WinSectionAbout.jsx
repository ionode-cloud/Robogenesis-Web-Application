import OsWindow from '../OsWindow.jsx';
import AboutPage from '../../pages/AboutPage.jsx';

export default function WinSectionAbout({
  isOpen,
  isMinimized,
  isFocused,
  zIndex,
  onClose,
  onMin,
  onFocus,
  onOpenWin,
  onCloseOs,
}) {
  return (
    <OsWindow
      id="win-section-about"
      title="📖 About Robogenesis — A.R.I.A Architecture & Mission"
      isOpen={isOpen}
      isMinimized={isMinimized}
      isFocused={isFocused}
      zIndex={zIndex}
      initialWidth={1100}
      initialHeight={720}
      initialTop={56}
      initialLeft={90}
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
        <AboutPage
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
