import {
  HomeIcon,
  AboutIcon,
  TerminalIcon,
  DomainsIcon,
  MessagesIcon,
  PhotosIcon,
  ProductsIcon,
  WebDevIcon,
} from './MacIcons.jsx';

export default function MacOSDock({
  openWindows = new Set(),
  minimizedWindows = new Set(),
  focusedWindow = null,
  onOpenWin,
  onMinWin,
  onCycleWallpaper,
}) {
  const handleDockItemClick = (id) => {
    if (!openWindows.has(id)) {
      onOpenWin(id);
    } else if (minimizedWindows.has(id)) {
      // Minimized: clicking restores and brings to focus
      onOpenWin(id);
    } else if (focusedWindow === id) {
      // Open and currently focused: clicking dock icon minimizes it
      if (onMinWin) {
        onMinWin(id);
      } else {
        onOpenWin(id);
      }
    } else {
      // Open but background: clicking brings it to front and focuses
      onOpenWin(id);
    }
  };

  const getItemClass = (id) => {
    const isOpen = openWindows.has(id);
    const isMin = minimizedWindows.has(id);
    const isFoc = focusedWindow === id && !isMin;
    return `os-dock-icon${isOpen ? ' active' : ''}${isMin ? ' minimized' : ''}${isFoc ? ' focused' : ''}`;
  };

  return (
    <div className="os-dock">
      {/* 1. Home (with Hand embedded inside) */}
      <div
        className={getItemClass('win-section-home')}
        onClick={() => handleDockItemClick('win-section-home')}
        title="Home (Kinetic Hand)"
      >
        <HomeIcon />
        <span className="os-dock-tooltip">
          {minimizedWindows.has('win-section-home') ? 'Home (Minimized)' : 'Home'}
        </span>
      </div>

      {/* 2. About (with A.R.I.A Head embedded inside) */}
      <div
        className={getItemClass('win-section-about')}
        onClick={() => handleDockItemClick('win-section-about')}
        title="About (A.R.I.A Head)"
      >
        <AboutIcon />
        <span className="os-dock-tooltip">
          {minimizedWindows.has('win-section-about') ? 'About (Minimized)' : 'About'}
        </span>
      </div>

      {/* 3. Domains (with Neural Brain embedded inside) */}
      <div
        className={getItemClass('win-section-domains')}
        onClick={() => handleDockItemClick('win-section-domains')}
        title="Domains (Neural Brain)"
      >
        <DomainsIcon />
        <span className="os-dock-tooltip">
          {minimizedWindows.has('win-section-domains') ? 'Domains (Minimized)' : 'Domains'}
        </span>
      </div>

      {/* 4. Products (with VaultShield Coin embedded inside) */}
      <div
        className={getItemClass('win-section-products')}
        onClick={() => handleDockItemClick('win-section-products')}
        title="Products (VaultShield Token)"
      >
        <ProductsIcon />
        <span className="os-dock-tooltip">
          {minimizedWindows.has('win-section-products') ? 'Products (Minimized)' : 'Products'}
        </span>
      </div>

      {/* 5. Web Development (Full-Stack & Cloud Architecture) */}
      <div
        className={getItemClass('win-section-web-development')}
        onClick={() => handleDockItemClick('win-section-web-development')}
        title="Web Development"
      >
        <WebDevIcon />
        <span className="os-dock-tooltip">
          {minimizedWindows.has('win-section-web-development') ? 'Web Dev (Minimized)' : 'Web Development'}
        </span>
      </div>

      {/* 6. Contact (with Earth Telemetry embedded inside) */}
      <div
        className={getItemClass('win-section-contact')}
        onClick={() => handleDockItemClick('win-section-contact')}
        title="Contact (Earth Telemetry)"
      >
        <MessagesIcon />
        <span className="os-dock-tooltip">
          {minimizedWindows.has('win-section-contact') ? 'Contact (Minimized)' : 'Contact'}
        </span>
      </div>

      {/* 6. Console (Developer Terminal) */}
      <div
        className={getItemClass('win-console')}
        onClick={() => handleDockItemClick('win-console')}
        title="Console (Code Runner)"
      >
        <TerminalIcon />
        <span className="os-dock-tooltip">
          {minimizedWindows.has('win-console') ? 'Console (Minimized)' : 'Console'}
        </span>
      </div>

      {/* 7. Wallpaper Gallery */}
      <div
        className="os-dock-icon"
        onClick={onCycleWallpaper}
        title="Change Wallpaper"
      >
        <PhotosIcon />
        <span className="os-dock-tooltip">Wallpaper</span>
      </div>
    </div>
  );
}
