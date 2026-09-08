import { useState, useEffect } from 'react';
import logoImg from '../assets/robo-macview.png';
import {
  HomeIcon,
  AboutIcon,
  DomainsIcon,
  ProductsIcon,
  MessagesIcon,
  TerminalIcon,
  PhotosIcon,
  WebDevIcon,
} from './MacIcons.jsx';

export default function MacOSMenubar({
  openMenu,
  onToggleMenu,
  onCloseMenus,
  onCloseOs,
  onOpenWin,
  onShowOnlyWin,
  onCycleWallpaper,
  onSetWallpaper,
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
        {/* Brand Logo System Menu (Click logo to show menu) */}
        <div className={`os-mb-menu${openMenu === 'apple' ? ' open' : ''}`}>
          <button
            className="os-mb-menu-btn os-mb-brand-btn"
            onClick={() => onToggleMenu('apple')}
            title="Robogenesis OS Menu"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 6px',
              height: '36px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <img
                src={logoImg}
                alt="Robogenesis"
                className="os-mb-logo"
                style={{
                  height: '42px',
                  width: 'auto',
                  maxWidth: 'none',
                  flexShrink: 0,
                  display: 'block',
                  filter: 'drop-shadow(0 2px 6px rgba(255, 214, 10, 0.45))',
                }}
              />
            </div>
            <span
              className="os-mb-app-title"
              style={{
                fontWeight: 700,
                fontSize: '14.5px',
                letterSpacing: '-0.01em',
                color: '#ffffff',
                fontFamily: "'Outfit', sans-serif",
                userSelect: 'none',
              }}
            >
              Robogenesis
            </span>
          </button>

          <div className="os-mb-dropdown">
            <div className="os-mb-dd-item" onClick={() => handleAction(() => onOpenWin('win-section-about'))}>
              <span className="dd-icon"><AboutIcon style={{ width: '18px', height: '18px' }} /></span>
              <span>About Robogenesis</span>
            </div>
            <div className="os-mb-dd-item" onClick={() => handleAction(() => onOpenWin('win-section-home'))}>
              <span className="dd-icon"><HomeIcon style={{ width: '18px', height: '18px' }} /></span>
              <span>Home Section</span>
            </div>
            <div className="os-mb-dd-item" onClick={() => handleAction(() => onOpenWin('win-section-domains'))}>
              <span className="dd-icon"><DomainsIcon style={{ width: '18px', height: '18px' }} /></span>
              <span>Domains Section</span>
            </div>
            <div className="os-mb-dd-item" onClick={() => handleAction(() => onOpenWin('win-section-products'))}>
              <span className="dd-icon"><ProductsIcon style={{ width: '18px', height: '18px' }} /></span>
              <span>Products Catalog</span>
            </div>
            <div className="os-mb-dd-item" onClick={() => handleAction(() => onOpenWin('win-section-web-development'))}>
              <span className="dd-icon"><WebDevIcon style={{ width: '18px', height: '18px' }} /></span>
              <span>Web Development</span>
            </div>
            <div className="os-mb-dd-item" onClick={() => handleAction(() => onOpenWin('win-section-contact'))}>
              <span className="dd-icon"><MessagesIcon style={{ width: '18px', height: '18px' }} /></span>
              <span>Contact Team</span>
            </div>
            <div className="os-mb-dd-item" onClick={() => handleAction(() => onOpenWin('win-console'))}>
              <span className="dd-icon"><TerminalIcon style={{ width: '18px', height: '18px' }} /></span>
              <span>Developer Code Console</span>
            </div>
            <div className="os-mb-dd-sep" />
            <div className="os-mb-dd-item" onClick={() => handleAction(onCycleWallpaper)}>
              <span className="dd-icon"><PhotosIcon style={{ width: '18px', height: '18px' }} /></span>
              <span>Cycle Wallpaper</span>
            </div>
          </div>
        </div>
      </div>

      <div className="os-mb-right">
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
