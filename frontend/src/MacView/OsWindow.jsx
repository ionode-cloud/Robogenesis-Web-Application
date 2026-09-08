import { useState, useRef, useEffect } from 'react';

export default function OsWindow({
  id,
  title,
  isOpen,
  isMinimized = false,
  isFocused,
  zIndex,
  initialWidth = 680,
  initialHeight = 480,
  initialTop = 70,
  initialLeft = 120,
  onClose,
  onMin,
  onFocus,
  bodyStyle = {},
  isInline = false,
  hideTitleBar = false,
  children,
}) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [pos, setPos] = useState({ top: initialTop, left: initialLeft });
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isMax, setIsMax] = useState(false);
  const prevGeoRef = useRef({
    pos: { top: initialTop, left: initialLeft },
    size: { width: initialWidth, height: initialHeight },
  });
  const winRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        // Clamp existing pos and size to viewport
        setPos((prev) => ({
          top: Math.max(42, Math.min(prev.top, window.innerHeight - 150)),
          left: Math.max(0, Math.min(prev.left, window.innerWidth - 200)),
        }));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDownTitle = (e) => {
    if (e.target.closest('.os-win-btn')) return;
    onFocus();
    if (isMax || isMobile) return;

    const startX = e.clientX - pos.left;
    const startY = e.clientY - pos.top;

    const onMouseMove = (moveEvent) => {
      const maxX = Math.max(0, window.innerWidth - (typeof size.width === 'number' ? size.width : 400));
      const maxY = Math.max(30, window.innerHeight - (typeof size.height === 'number' ? size.height : 300));
      const nx = Math.max(0, Math.min(maxX, moveEvent.clientX - startX));
      const ny = Math.max(30, Math.min(maxY, moveEvent.clientY - startY));
      setPos({ top: ny, left: nx });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  };

  const handleTouchStartTitle = (e) => {
    if (e.target.closest('.os-win-btn')) return;
    onFocus();
    if (isMax || isMobile) return;
    if (!e.touches || e.touches.length === 0) return;

    const touch = e.touches[0];
    const startX = touch.clientX - pos.left;
    const startY = touch.clientY - pos.top;

    const onTouchMove = (moveEvent) => {
      if (!moveEvent.touches || moveEvent.touches.length === 0) return;
      const t = moveEvent.touches[0];
      const maxX = Math.max(0, window.innerWidth - (typeof size.width === 'number' ? size.width : 400));
      const maxY = Math.max(40, window.innerHeight - (typeof size.height === 'number' ? size.height : 300));
      const nx = Math.max(0, Math.min(maxX, t.clientX - startX));
      const ny = Math.max(40, Math.min(maxY, t.clientY - startY));
      setPos({ top: ny, left: nx });
    };

    const onTouchEnd = () => {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd);
  };

  const handleMouseDownResize = (e) => {
    e.stopPropagation();
    onFocus();
    if (isMax || isMobile) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const currentW = typeof size.width === 'number' ? size.width : (winRef.current?.offsetWidth || 600);
    const currentH = typeof size.height === 'number' ? size.height : (winRef.current?.offsetHeight || 400);

    const onMouseMove = (moveEvent) => {
      const maxW = window.innerWidth - pos.left - 10;
      const maxH = window.innerHeight - pos.top - 60;
      const newW = Math.min(maxW, Math.max(300, currentW + (moveEvent.clientX - startX)));
      const newH = Math.min(maxH, Math.max(200, currentH + (moveEvent.clientY - startY)));
      setSize({ width: newW, height: newH });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  };

  const toggleMaximize = () => {
    onFocus();
    if (isMobile) return;
    if (!isMax) {
      prevGeoRef.current = { pos, size };
      setIsMax(true);
    } else {
      setPos(prevGeoRef.current.pos);
      setSize(prevGeoRef.current.size);
      setIsMax(false);
    }
  };

  if (!isOpen) return null;

  let style;
  if (isInline) {
    style = {
      position: 'relative',
      top: 'auto',
      left: 'auto',
      width: '100%',
      maxWidth: '540px',
      height: '460px',
      minWidth: 0,
      minHeight: '380px',
      zIndex: 1,
      borderRadius: '20px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    };
  } else if (isMobile) {
    // Mobile full-width adaptive window with dvh dynamic viewport support
    style = {
      top: '44px',
      left: '6px',
      width: 'calc(100vw - 12px)',
      height: 'calc(100dvh - 44px - 66px)',
      maxWidth: 'calc(100vw - 12px)',
      minWidth: 0,
      minHeight: 0,
      zIndex: zIndex || 100,
      borderRadius: '14px',
    };
  } else if (isMax) {
    // Desktop Maximized
    style = {
      top: '42px',
      left: 0,
      width: '100vw',
      height: 'calc(100vh - 42px)',
      zIndex: zIndex || 200,
      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    };
  } else {
    // Desktop & Tablet Movable/Resizable with intelligent boundary clamping
    const maxW = Math.max(300, window.innerWidth - 16);
    const maxH = Math.max(220, window.innerHeight - 44 - 72);
    const clampedWidth = Math.min(
      typeof size.width === 'number' ? size.width : initialWidth,
      maxW
    );
    const clampedHeight = Math.min(
      typeof size.height === 'number' ? size.height : initialHeight,
      maxH
    );
    const clampedLeft = Math.max(8, Math.min(pos.left, window.innerWidth - clampedWidth - 8));
    const clampedTop = Math.max(44, Math.min(pos.top, window.innerHeight - clampedHeight - 68));
    style = {
      top: `${clampedTop}px`,
      left: `${clampedLeft}px`,
      width: `${clampedWidth}px`,
      height: `${clampedHeight}px`,
      zIndex: zIndex || 100,
    };
  }

  return (
    <div
      ref={winRef}
      id={id}
      className={`os-win open${isInline ? ' os-win-inline' : ''}${isFocused ? ' focused' : ''}${isMinimized ? ' os-win-minimized' : ''}`}
      style={{
        ...style,
        ...(isMinimized ? { pointerEvents: 'none' } : {}),
      }}
      onMouseDown={onFocus}
      onTouchStart={onFocus}
    >
      {!hideTitleBar && (
        <div
          className="os-win-titlebar"
          onMouseDown={handleMouseDownTitle}
          onTouchStart={handleTouchStartTitle}
        >
          <div
            className="os-win-btn os-wb-close"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.(e);
            }}
            title="Close"
          >
            <svg viewBox="0 0 12 12" className="os-wb-icon" fill="none">
              <path d="M3.5 3.5L8.5 8.5M8.5 3.5L3.5 8.5" stroke="#4d0000" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <div
            className="os-win-btn os-wb-min"
            onClick={(e) => {
              e.stopPropagation();
              onMin?.(e);
            }}
            title="Minimize"
          >
            <svg viewBox="0 0 12 12" className="os-wb-icon" fill="none">
              <path d="M2.5 6H9.5" stroke="#663e00" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>
          <div
            className="os-win-btn os-wb-max"
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximize();
            }}
            title={isMax ? 'Restore' : 'Zoom'}
            style={isMobile ? { opacity: 0.5, cursor: 'default' } : {}}
          >
            <svg viewBox="0 0 12 12" className="os-wb-icon" fill="none">
              <path
                d="M3.5 8.5L8.5 3.5M8.5 6.5V3.5H5.5M3.5 5.5V8.5H6.5"
                stroke="#004d11"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="os-win-title">{title}</div>
        </div>
      )}
      <div className="os-win-body" style={bodyStyle}>
        {children}
      </div>
      {!isMax && !isMobile && !isInline && (
        <div className="os-win-resize" onMouseDown={handleMouseDownResize} />
      )}
    </div>
  );
}
