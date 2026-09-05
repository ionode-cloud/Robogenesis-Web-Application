import { useRef, useEffect } from 'react';
import logoImg from '../assets/logo.png';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'domains', label: 'Domains' },
  { id: 'products', label: 'Products' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({
  currentPage,
  onNavigate,
  scrolled,
  onOpenOs,
  mobileOpen,
  onToggleMobile,
}) {
  const pillRef = useRef(null);
  const pillBgRef = useRef(null);

  useEffect(() => {
    if (!pillRef.current || !pillBgRef.current) return;
    const pill = pillRef.current;
    const pillRect = pill.getBoundingClientRect();
    const activeEl = pill.querySelector('.nav-link.active');
    if (activeEl) {
      const activeRect = activeEl.getBoundingClientRect();
      pillBgRef.current.style.transform = `translateX(${activeRect.left - pillRect.left}px)`;
      pillBgRef.current.style.width = `${activeRect.width}px`;
    }
  }, [currentPage]);

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`} data-page={currentPage}>
      <div className="navbar-container">
        {/* Brand */}
        <a
          href="/home"
          className="navbar-brand"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
        >
          <div className="logo-container">
            <img src={logoImg} alt="Robogenesis" className="logo-img" />
          </div>
        </a>

        {/* Center pill nav */}
        <nav className="navbar-center">
          <div className="nav-pill" id="navPill" ref={pillRef}>
            <div className="active-pill-bg" ref={pillBgRef} />
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                className={`nav-link${currentPage === l.id ? ' active' : ''}`}
                onClick={() => onNavigate(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Right actions */}
        <div className="navbar-right">
          {/* macOS mode pill */}
          <button
            className="os-window-header-pill dark-theme"
            onClick={onOpenOs}
            style={{ fontSize: '12px' }}
          >
            <span>macOS View</span>
            <span className="os-pill-action">ENTER</span>
          </button>

          <button
            className="login-signup-btn"
            onClick={() => onNavigate('contact')}
          >
            Get in Touch
          </button>

          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={onToggleMobile}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="2" y1="2" x2="16" y2="16" />
                <line x1="16" y1="2" x2="2" y2="16" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="2" y1="5" x2="16" y2="5" />
                <line x1="2" y1="9" x2="16" y2="9" />
                <line x1="2" y1="13" x2="16" y2="13" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
          <div className="mobile-nav-links">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                className={`mobile-nav-link${currentPage === l.id ? ' active' : ''}`}
                onClick={() => {
                  onNavigate(l.id);
                  onToggleMobile();
                }}
              >
                {l.label}
              </button>
            ))}
            <button
              className="mobile-nav-link"
              onClick={() => {
                onOpenOs();
                onToggleMobile();
              }}
              style={{ color: '#0a84ff', fontWeight: 700 }}
            >
              Enter macOS View
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
