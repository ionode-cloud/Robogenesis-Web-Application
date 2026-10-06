import { useState, useEffect } from 'react';
import { useOsWindowManager } from '../hooks/useOsWindowManager.js';
import MacOSMenubar from './MacOSMenubar.jsx';
import MacOSDock from './MacOSDock.jsx';
import WallpaperLayer from './WallpaperLayer.jsx';

import WinSectionHome from './windows/WinSectionHome.jsx';
import WinSectionAbout from './windows/WinSectionAbout.jsx';
import WinSectionDomains from './windows/WinSectionDomains.jsx';
import WinSectionProducts from './windows/WinSectionProducts.jsx';
import WinSectionWebDev from './windows/WinSectionWebDev.jsx';
import WinSectionContact from './windows/WinSectionContact.jsx';
import WinConsole from './windows/WinConsole.jsx';
import DesktopRobotCompanion from './DesktopRobotCompanion.jsx';
import DateTimeWidget from './widgets/DateTimeWidget.jsx';
import WorkingStatusWidget from './widgets/WorkingStatusWidget.jsx';

// Helper: 6:00 AM (06:00) to 6:00 PM (18:00) is Morning; otherwise Night
const isMorningHour = () => {
  const h = new Date().getHours();
  return h >= 6 && h < 18;
};

export default function MacOSDesktop({ isOpen, onClose }) {
  const {
    openWindows,
    minimizedWindows,
    zIndexMap,
    focusedWindow,
    openMenu,
    openWin,
    minimizeWin,
    showOnlyWin,
    closeWin,
    focusWin,
    toggleMenu,
    closeAllMenus,
  } = useOsWindowManager();

  // Dynamic Theme Mode: 'morning' (#595CFF -> #C6F8FF) or 'night' (#211F2F -> #918CA9)
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const saved = localStorage.getItem('macos_theme_mode');
      if (saved === 'morning' || saved === 'night') return saved;
    } catch {
      // Ignored
    }
    return isMorningHour() ? 'morning' : 'night';
  });

  // Auto-check time of day every 30 seconds if user hasn't explicitly locked a preference
  useEffect(() => {
    const checkAutoTheme = () => {
      try {
        const manual = localStorage.getItem('macos_theme_manual');
        if (!manual) {
          setThemeMode(isMorningHour() ? 'morning' : 'night');
        }
      } catch {
        // Ignored
      }
    };
    const interval = setInterval(checkAutoTheme, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setThemeMode((prev) => {
      const next = prev === 'morning' ? 'night' : 'morning';
      try {
        localStorage.setItem('macos_theme_mode', next);
        localStorage.setItem('macos_theme_manual', 'true');
      } catch {
        // Ignored
      }
      return next;
    });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      try {
        localStorage.removeItem('robogenesis_icon_positions');
      } catch {
        // Ignored
      }
    } else {
      document.body.style.overflow = '';
      closeAllMenus();
    }
  }, [isOpen, closeAllMenus]);

  if (!isOpen) return null;

  return (
    <div
      id="macos-overlay"
      className={`active theme-${themeMode}`}
      data-theme={themeMode}
      onClick={closeAllMenus}
    >
      <WallpaperLayer />
      <DesktopRobotCompanion />

      {/* Desktop Widgets (Position 5: Working Status, Position 4: Date Time) */}
      <WorkingStatusWidget onOpenWin={openWin} />
      <DateTimeWidget />

      <MacOSMenubar
        openMenu={openMenu}
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
        onToggleMenu={toggleMenu}
        onCloseMenus={closeAllMenus}
        onCloseOs={onClose}
        onOpenWin={openWin}
        onShowOnlyWin={showOnlyWin}
      />

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

      {/* 5. Web Development (Full-Stack & Cloud Architecture) */}
      <WinSectionWebDev
        isOpen={openWindows.has('win-section-web-development')}
        isMinimized={minimizedWindows.has('win-section-web-development')}
        isFocused={focusedWindow === 'win-section-web-development'}
        zIndex={zIndexMap['win-section-web-development']}
        onClose={() => closeWin('win-section-web-development')}
        onMin={() => minimizeWin('win-section-web-development')}
        onFocus={() => focusWin('win-section-web-development')}
        onCloseOs={onClose}
        onOpenWin={openWin}
      />

      {/* 6. Contact (contains Planet Earth Orbit Telemetry inside) */}
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
      />
    </div>
  );
}
