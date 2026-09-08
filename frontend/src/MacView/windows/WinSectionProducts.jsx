import OsWindow from '../OsWindow.jsx';
import ProductsPage from '../../pages/ProductsPage.jsx';

export default function WinSectionProducts({
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
      id="win-section-products"
      title="📦 Products — Hardware Kits & Edge Platforms"
      isOpen={isOpen}
      isMinimized={isMinimized}
      isFocused={isFocused}
      zIndex={zIndex}
      initialWidth={1100}
      initialHeight={720}
      initialTop={72}
      initialLeft={150}
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
        <ProductsPage
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
