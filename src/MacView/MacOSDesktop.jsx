import { useEffect, useState, useRef, useCallback } from 'react';
import { useOsWindowManager } from '../hooks/useOsWindowManager.js';
import MacOSMenubar from './MacOSMenubar.jsx';
import MacOSDock from './MacOSDock.jsx';
import WallpaperLayer from './WallpaperLayer.jsx';

import WinSectionHome from './windows/WinSectionHome.jsx';
import WinSectionAbout from './windows/WinSectionAbout.jsx';
import WinSectionDomains from './windows/WinSectionDomains.jsx';
import WinSectionProducts from './windows/WinSectionProducts.jsx';
import WinSectionContact from './windows/WinSectionContact.jsx';
import WinConsole from './windows/WinConsole.jsx';
import {
  HomeIcon,
  AboutIcon,
  DomainsIcon,
  ProductsIcon,
  MessagesIcon,
  TerminalIcon,
} from './MacIcons.jsx';

const DESKTOP_ITEMS = [
  { id: 'win-section-home', title: 'Home', subtitle: 'Kinetic Hand', Icon: HomeIcon },
  { id: 'win-section-about', title: 'About', subtitle: 'A.R.I.A Head', Icon: AboutIcon },
  { id: 'win-section-domains', title: 'Domains', subtitle: 'Neural Brain', Icon: DomainsIcon },
  { id: 'win-section-products', title: 'Products', subtitle: 'Hardware Kits', Icon: ProductsIcon },
  { id: 'win-section-contact', title: 'Contact', subtitle: 'Earth Orbit', Icon: MessagesIcon },
  { id: 'win-console', title: 'Console', subtitle: 'Code Terminal', Icon: TerminalIcon },
];

function calculateDefaultPositions(width, height) {
  const isMobile = width < 768;
  const iconW = isMobile ? 74 : 88;
  const iconH = isMobile ? 76 : 88;
  const startX = isMobile ? 12 : 20;
  const startY = isMobile ? 48 : 58;
  const gapY = isMobile ? 8 : 14;
  const gapX = isMobile ? 8 : 16;

  const positions = {};
  const maxRows = Math.max(1, Math.floor((height - startY - 76) / (iconH + gapY)));

  DESKTOP_ITEMS.forEach((item, index) => {
    const col = Math.floor(index / maxRows);
    const row = index % maxRows;
    const x = startX + col * (iconW + gapX);
    const y = startY + row * (iconH + gapY);
    positions[item.id] = { x, y };
  });

  return positions;
}

export default function MacOSDesktop({ isOpen, onClose }) {
  const {
    openWindows,
    minimizedWindows,
    zIndexMap,
    focusedWindow,
    wallpaper,
    openMenu,
    openWin,
    minimizeWin,
    showOnlyWin,
    closeWin,
    focusWin,
    cycleWallpaper,
    setWallpaper,
    toggleMenu,
    closeAllMenus,
  } = useOsWindowManager();

  const [positions, setPositions] = useState(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;
    const isMobile = w < 768;
    const iconW = isMobile ? 74 : 88;
    const iconH = isMobile ? 76 : 88;
    const minX = 6;
    const maxX = Math.max(minX, w - iconW - 6);
    const minY = 44;
    const maxY = Math.max(minY, h - iconH - 74);
    const defs = calculateDefaultPositions(w, h);

    try {
      const saved = localStorage.getItem('robogenesis_icon_positions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          const clamped = {};
          DESKTOP_ITEMS.forEach((item) => {
            const p = parsed[item.id];
            if (p && typeof p.x === 'number' && typeof p.y === 'number') {
              clamped[item.id] = {
                x: Math.min(maxX, Math.max(minX, p.x)),
                y: Math.min(maxY, Math.max(minY, p.y)),
              };
            } else {
              clamped[item.id] = defs[item.id];
            }
          });
          return clamped;
        }
      }
    } catch {
      // Ignored
    }
    return defs;
  });

  const [draggingId, setDraggingId] = useState(null);
  const dragRef = useRef(null);

  // Clamp icon positions on viewport resize so they stay within visible bounds
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobile = w < 768;
      const iconW = isMobile ? 74 : 88;
      const iconH = isMobile ? 76 : 88;
      const minX = 6;
      const maxX = Math.max(minX, w - iconW - 6);
      const minY = 44;
      const maxY = Math.max(minY, h - iconH - 74);

      setPositions((prev) => {
        let changed = false;
        const next = { ...prev };
        DESKTOP_ITEMS.forEach((item) => {
          const pos = next[item.id];
          if (!pos) {
            const defs = calculateDefaultPositions(w, h);
            next[item.id] = defs[item.id];
            changed = true;
          } else {
            const clampedX = Math.min(maxX, Math.max(minX, pos.x));
            const clampedY = Math.min(maxY, Math.max(minY, pos.y));
            if (clampedX !== pos.x || clampedY !== pos.y) {
              next[item.id] = { x: clampedX, y: clampedY };
              changed = true;
            }
          }
        });
        return changed ? next : prev;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resetIconPositions = useCallback(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;
    const defs = calculateDefaultPositions(w, h);
    setPositions(defs);
    try {
      localStorage.removeItem('robogenesis_icon_positions');
    } catch {
      // Ignored
    }
  }, []);

  const handlePointerDown = (id, e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.stopPropagation();

    const currentPos = positions[id] || { x: 20, y: 58 };
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      initX: currentPos.x,
      initY: currentPos.y,
      hasMoved: false,
      pointerId: e.pointerId,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    setDraggingId(id);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current) return;
    if (e.pointerId !== dragRef.current.pointerId) return;

    const { id, startX, startY, initX, initY } = dragRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!dragRef.current.hasMoved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      dragRef.current.hasMoved = true;
    }

    if (dragRef.current.hasMoved) {
      const isMobile = window.innerWidth < 768;
      const iconW = isMobile ? 74 : 88;
      const iconH = isMobile ? 76 : 88;
      const minX = 6;
      const maxX = Math.max(minX, window.innerWidth - iconW - 6);
      const minY = 44; // Below menubar
      const maxY = Math.max(minY, window.innerHeight - iconH - 74); // Above dock

      const newX = Math.min(maxX, Math.max(minX, initX + dx));
      const newY = Math.min(maxY, Math.max(minY, initY + dy));

      setPositions((prev) => ({
        ...prev,
        [id]: { x: newX, y: newY },
      }));
    }
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current) return;
    const { id, hasMoved, pointerId } = dragRef.current;

    try {
      if (e.currentTarget?.hasPointerCapture?.(pointerId)) {
        e.currentTarget.releasePointerCapture(pointerId);
      }
    } catch {
      // Ignored
    }

    if (!hasMoved) {
      openWin(id);
    } else {
      setPositions((latest) => {
        try {
          localStorage.setItem('robogenesis_icon_positions', JSON.stringify(latest));
        } catch {
          // Ignored
        }
        return latest;
      });
    }

    dragRef.current = null;
    setDraggingId(null);
  };

  const handlePointerCancel = (e) => {
    if (!dragRef.current) return;
    try {
      if (e.currentTarget?.hasPointerCapture?.(dragRef.current.pointerId)) {
        e.currentTarget.releasePointerCapture(dragRef.current.pointerId);
      }
    } catch {
      // Ignored
    }
    dragRef.current = null;
    setDraggingId(null);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      closeAllMenus();
    }
  }, [isOpen, closeAllMenus]);

  if (!isOpen) return null;

  return (
    <div
      id="macos-overlay"
      className="active"
      onClick={closeAllMenus}
    >
      <WallpaperLayer wallpaper={wallpaper} />

      <MacOSMenubar
        openMenu={openMenu}
        onToggleMenu={toggleMenu}
        onCloseMenus={closeAllMenus}
        onCloseOs={onClose}
        onOpenWin={openWin}
        onShowOnlyWin={showOnlyWin}
        onCycleWallpaper={cycleWallpaper}
        onSetWallpaper={setWallpaper}
        onResetIcons={resetIconPositions}
      />

      {/* Freeform Draggable Desktop Shortcuts — Placeable anywhere on screen */}
      <div className="os-desktop-shortcuts" aria-label="Desktop Shortcuts">
        {DESKTOP_ITEMS.map((item) => {
          const IconComp = item.Icon;
          const pos = positions[item.id] || { x: 20, y: 58 };
          const isDragging = draggingId === item.id;

          return (
            <div
              key={item.id}
              className={`os-desktop-icon${isDragging ? ' dragging' : ''}`}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
              }}
              onPointerDown={(e) => handlePointerDown(item.id, e)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              title={`Drag anywhere to reposition or click to open ${item.title}`}
            >
              <div className="os-di-symbol">
                <IconComp
                  style={{
                    width: '100%',
                    height: '100%',
                    filter: 'drop-shadow(0 6px 14px rgba(0, 0, 0, 0.45))',
                    pointerEvents: 'none',
                  }}
                />
              </div>
              <div className="os-di-label">
                <span className="os-di-title">{item.title}</span>
                <span className="os-di-sub">{item.subtitle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Windows — Each section window embeds its 3D visualizer inside! */}
      {/* 1. Home (contains 42-DOF Kinetic Hand inside) */}
      <WinSectionHome
        isOpen={openWindows.has('win-section-home')}
        isMinimized={minimizedWindows.has('win-section-home')}
        isFocused={focusedWindow === 'win-section-home'}
        zIndex={zIndexMap['win-section-home']}
        onClose={() => closeWin('win-section-home')}
        onMin={() => minimizeWin('win-section-home')}
        onFocus={() => focusWin('win-section-home')}
        onOpenWin={openWin}
      />

      {/* 2. About (contains A.R.I.A Head 3D inside) */}
      <WinSectionAbout
        isOpen={openWindows.has('win-section-about')}
        isMinimized={minimizedWindows.has('win-section-about')}
        isFocused={focusedWindow === 'win-section-about'}
        zIndex={zIndexMap['win-section-about']}
        onClose={() => closeWin('win-section-about')}
        onMin={() => minimizeWin('win-section-about')}
        onFocus={() => focusWin('win-section-about')}
        onCloseOs={onClose}
        onOpenWin={openWin}
      />

      {/* 3. Domains (contains Neural Brain Mesh inside) */}
      <WinSectionDomains
        isOpen={openWindows.has('win-section-domains')}
        isMinimized={minimizedWindows.has('win-section-domains')}
        isFocused={focusedWindow === 'win-section-domains'}
        zIndex={zIndexMap['win-section-domains']}
        onClose={() => closeWin('win-section-domains')}
        onMin={() => minimizeWin('win-section-domains')}
        onFocus={() => focusWin('win-section-domains')}
        onOpenWin={openWin}
      />

      {/* 4. Products (contains VaultShield Coin Token inside) */}
      <WinSectionProducts
        isOpen={openWindows.has('win-section-products')}
        isMinimized={minimizedWindows.has('win-section-products')}
        isFocused={focusedWindow === 'win-section-products'}
        zIndex={zIndexMap['win-section-products']}
        onClose={() => closeWin('win-section-products')}
        onMin={() => minimizeWin('win-section-products')}
        onFocus={() => focusWin('win-section-products')}
        onOpenWin={openWin}
      />

      {/* 5. Contact (contains Planet Earth Orbit Telemetry inside) */}
      <WinSectionContact
        isOpen={openWindows.has('win-section-contact')}
        isMinimized={minimizedWindows.has('win-section-contact')}
        isFocused={focusedWindow === 'win-section-contact'}
        zIndex={zIndexMap['win-section-contact']}
        onClose={() => closeWin('win-section-contact')}
        onMin={() => minimizeWin('win-section-contact')}
        onFocus={() => focusWin('win-section-contact')}
        onCloseOs={onClose}
        onOpenWin={openWin}
      />

      {/* 6. Console (Developer Multi-Language Code Runner) */}
      <WinConsole
        isOpen={openWindows.has('win-console')}
        isMinimized={minimizedWindows.has('win-console')}
        isFocused={focusedWindow === 'win-console'}
        zIndex={zIndexMap['win-console']}
        onClose={() => closeWin('win-console')}
        onMin={() => minimizeWin('win-console')}
        onFocus={() => focusWin('win-console')}
        onOpenWin={openWin}
      />

      <MacOSDock
        openWindows={openWindows}
        minimizedWindows={minimizedWindows}
        focusedWindow={focusedWindow}
        onOpenWin={openWin}
        onMinWin={minimizeWin}
        onCycleWallpaper={cycleWallpaper}
      />
    </div>
  );
}
