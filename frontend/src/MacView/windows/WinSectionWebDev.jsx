import OsWindow from '../OsWindow.jsx';
import WebDevPage from '../../pages/WebDevPage.jsx';

export default function WinSectionWebDev({
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
      id="win-section-web-development"
      title="🌐 Web Development — Full-Stack & Modern Architecture"
      isOpen={isOpen}
      isMinimized={isMinimized}
      isFocused={isFocused}
      zIndex={zIndex}
      initialWidth={1100}
      initialHeight={720}
      initialTop={64}
      initialLeft={120}
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
        <WebDevPage
          onNavigate={(page) => {
            if (onOpenWin) {
              onOpenWin('win-section-' + page);
            }
          }}
          onOpenOs={null}
        />
      </div>
    </OsWindow>
  );
}
