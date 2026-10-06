import { useState, useEffect } from 'react';
import bulbLogoImg from '../assets/bulb-icon.png';
import {
  HomeIcon,
  AboutIcon,
  DomainsIcon,
  ProductsIcon,
  MessagesIcon,
  TerminalIcon,
  WebDevIcon,
} from './MacIcons.jsx';

export default function MacOSMenubar({
  openMenu,
  themeMode = 'morning',
  onToggleTheme,
  onToggleMenu,
  onCloseMenus,
  onCloseOs,
  onOpenWin,
  onShowOnlyWin,
}) {
  const [dateTimeStr, setDateTimeStr] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const datePart = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setDateTimeStr(`${datePart}  ${h}:${m}`);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = (cb) => {
    onCloseMenus();
    cb();
  };

  return (
    <div className="os-menubar" onClick={(e) => e.stopPropagation()}>
      <div className="os-mb-left">
        {/* 1. Bulb logo button: Toggles dropdown ONLY (isolated bulb icon, not whole logo) */}
        <div className={`os-mb-menu${openMenu === 'apple' ? ' open' : ''}`}>
          <button
            className="os-mb-menu-btn os-mb-bulb-btn"
            onClick={() => onToggleMenu('apple')}
            title="Robogenesis System Menu"
            aria-label="System Menu"
          >
            <img
              src={bulbLogoImg}
              alt="System Menu"
              className="os-mb-bulb-img"
            />
          </button>

          <div className="os-mb-dropdown">
            <div className="os-mb-dd-item" onClick={() => handleAction(() => onOpenWin('win-section-about'))}>
              <span className="dd-icon"><AboutIcon style={{ width: '16px', height: '16px' }} /></span>
              <span>About Robogenesis</span>
            </div>
            <div className="os-mb-dd-item" onClick={() => handleAction(() => onOpenWin('win-section-home'))}>
              <span className="dd-icon"><HomeIcon style={{ width: '16px', height: '16px' }} /></span>
              <span>Home Section</span>
            </div>
            <div className="os-mb-dd-item" onClick={() => handleAction(() => onOpenWin('win-section-domains'))}>
              <span className="dd-icon"><DomainsIcon style={{ width: '16px', height: '16px' }} /></span>
              <span>Domains Section</span>
            </div>
            <div className="os-mb-dd-item" onClick={() => handleAction(() => onOpenWin('win-section-products'))}>
              <span className="dd-icon"><ProductsIcon style={{ width: '16px', height: '16px' }} /></span>
              <span>Products Catalog</span>
            </div>
            <div className="os-mb-dd-item" onClick={() => handleAction(() => onOpenWin('win-section-web-development'))}>
              <span className="dd-icon"><WebDevIcon style={{ width: '16px', height: '16px' }} /></span>
              <span>Web Development</span>
            </div>
            <div className="os-mb-dd-item" onClick={() => handleAction(() => onOpenWin('win-section-contact'))}>
              <span className="dd-icon"><MessagesIcon style={{ width: '16px', height: '16px' }} /></span>
              <span>Contact Team</span>
            </div>
            <div className="os-mb-dd-item" onClick={() => handleAction(() => onOpenWin('win-console'))}>
              <span className="dd-icon"><TerminalIcon style={{ width: '16px', height: '16px' }} /></span>
              <span>Developer Code Console</span>
            </div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.18)', margin: '4px 0' }} />
            <div
              className="os-mb-dd-item"
              onClick={() =>
                handleAction(() => {
                  onToggleTheme && onToggleTheme();
                })
              }
            >
              <span className="dd-icon">{themeMode === 'morning' ? '🌙' : '☀️'}</span>
              <span>Switch to {themeMode === 'morning' ? 'Night' : 'Morning'} Theme</span>
            </div>
          </div>
        </div>

        {/* 2. "ROBOGENESIS" title button: Separate button for Home page ONLY */}
        <button
          className="os-mb-menu-btn os-mb-app-title-btn"
          onClick={() => {
            onCloseMenus();
            onOpenWin('win-section-home');
          }}
          title="Open Home Page"
        >
          <span className="os-mb-app-title">ROBOGENESIS</span>
        </button>
      </div>

      <div className="os-mb-right">
        {/* Dynamic Wallpaper Theme Toggle (Morning ☀️ / Night 🌙) */}
        <button
          className={`os-mb-theme-toggle ${themeMode === 'night' ? 'night' : 'morning'}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleTheme && onToggleTheme();
          }}
          title={`Theme: ${themeMode === 'morning' ? 'Morning ☀️ (#595CFF → #C6F8FF)' : 'Night 🌙 (#211F2F → #918CA9)'}. Click to switch.`}
          aria-label="Toggle Morning or Night theme"
        >
          <span className="os-mb-theme-icon">{themeMode === 'morning' ? '☀️' : '🌙'}</span>
          <span className="os-mb-theme-label">{themeMode === 'morning' ? 'Morning' : 'Night'}</span>
        </button>

        {/* Date and Time */}
        <span className="os-mb-clock" title="Date & Time">{dateTimeStr}</span>

        {/* Switch to RoboWeb Landing Page Button */}
        <button className="os-mb-landing-btn" onClick={onCloseOs} title="Switch to RoboWeb">
          <span className="os-mb-landing-text-desktop">RoboWeb ↗</span>
          <span className="os-mb-landing-text-mobile">RoboWeb ↗</span>
        </button>
      </div>
    </div>
  );
}
