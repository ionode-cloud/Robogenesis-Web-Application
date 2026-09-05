import OsWindow from '../OsWindow.jsx';
import ContactPage from '../../pages/ContactPage.jsx';

export default function WinSectionContact({
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
      id="win-section-contact"
      title="💬 Contact — Connect With Engineering Team"
      isOpen={isOpen}
      isMinimized={isMinimized}
      isFocused={isFocused}
      zIndex={zIndex}
      initialWidth={1100}
      initialHeight={720}
      initialTop={80}
      initialLeft={180}
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
        <ContactPage
          onNavigate={(page) => {
            if (onOpenWin) {
              onOpenWin('win-section-' + page);
            }
          }}
        />
      </div>
    </OsWindow>
  );
}
