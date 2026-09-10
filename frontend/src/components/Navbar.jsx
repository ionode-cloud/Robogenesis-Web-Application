import { useRef, useEffect, useState } from 'react';
import {
  FiUser,
  FiShield,
  FiMail,
  FiEdit3,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiZap,
  FiMenu,
  FiX,
  FiHome,
  FiInfo,
  FiCpu,
  FiBox,
  FiCode,
  FiGlobe,
} from 'react-icons/fi';
import logoImg from '../assets/logo.png';
import LoginModal from './LoginModal.jsx';

const NAV_LINKS = [
  { id: 'home', label: 'Home', icon: FiHome },
  { id: 'about', label: 'About', icon: FiInfo },
  { id: 'domains', label: 'Domains', icon: FiCpu },
  { id: 'products', label: 'Products', icon: FiBox },
  { id: 'web-development', label: 'Web Development', icon: FiCode },
  { id: 'contact', label: 'Contact', icon: FiMail },
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
  const userMenuRef = useRef(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login');
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('robogenesis_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('robogenesis_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('robogenesis_user');
    localStorage.removeItem('robogenesis_token');
  };

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Listen for global open login requests
  useEffect(() => {
    const handleOpenReq = () => {
      setModalMode('login');
      setIsLoginOpen(true);
    };
    window.addEventListener('robogenesis_open_login', handleOpenReq);
    return () => window.removeEventListener('robogenesis_open_login', handleOpenReq);
  }, []);

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
          {/* RoboLab mode pill */}
          <button
            className="os-window-header-pill dark-theme"
            onClick={onOpenOs}
            style={{ fontSize: '12px' }}
          >
            <span>RoboLab</span>
            <span className="os-pill-action">ENTER</span>
          </button>

          {/* User Account Button & Anchored Dropdown Menu */}
          <div className="nav-user-menu-wrap" ref={userMenuRef}>
            <button
              className={`nav-person-btn${userMenuOpen ? ' active' : ''}`}
              onClick={() => setUserMenuOpen((prev) => !prev)}
              aria-label="User Account Menu"
              aria-expanded={userMenuOpen}
              title={
                user?.role === 'admin'
                  ? `Administrator (${user.email})`
                  : user
                  ? `${user.name} (${user.email})`
                  : 'Account Options'
              }
            >
              {user ? (
                <span className="nav-user-badge">{user.initials || 'RG'}</span>
              ) : (
                <FiUser size={18} className="nav-person-svg" />
              )}
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="nav-user-dropdown" role="menu" aria-label="Account Options">
                {user ? (
                  <>
                    {/* User Profile Header */}
                    <div className="nav-dropdown-header">
                      <div className="nav-dropdown-avatar">
                        <span>{user.initials || 'RG'}</span>
                        <span className="nav-dropdown-online-dot" />
                      </div>
                      <div className="nav-dropdown-user-info">
                        <span className="nav-dropdown-name">{user.name}</span>
                        <span className="nav-dropdown-email">{user.email}</span>
                        <span className={`nav-dropdown-badge ${user.role === 'admin' ? 'admin' : 'member'}`}>
                          {user.role === 'admin' ? (
                            <>
                              <FiShield size={11} style={{ marginRight: 4 }} />
                              Administrator
                            </>
                          ) : (
                            <>
                              <FiZap size={11} style={{ marginRight: 4 }} />
                              {user.labAccess || 'Lab Member'}
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="nav-dropdown-divider" />

                    {/* Admin vs Regular User Actions */}
                    {user.role === 'admin' ? (
                      <button
                        type="button"
                        className="nav-dropdown-item highlight"
                        onClick={() => {
                          setUserMenuOpen(false);
                          if (onNavigate) {
                            onNavigate('admin');
                          } else {
                            window.location.href = '/admin';
                          }
                        }}
                      >
                        <span className="nav-dropdown-icon">
                          <FiShield size={17} />
                        </span>
                        <div className="nav-dropdown-item-text">
                          <span className="nav-dropdown-item-title">Admin Dashboard</span>
                          <span className="nav-dropdown-item-sub">Access backend & user management</span>
                        </div>
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="nav-dropdown-item highlight"
                          onClick={() => {
                            setUserMenuOpen(false);
                            setIsLoginOpen(true);
                          }}
                        >
                          <span className="nav-dropdown-icon">
                            <FiMail size={17} />
                          </span>
                          <div className="nav-dropdown-item-text">
                            <span className="nav-dropdown-item-title">My Enquiries History</span>
                            <span className="nav-dropdown-item-sub">View status & submissions popup</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          className="nav-dropdown-item"
                          onClick={() => {
                            setUserMenuOpen(false);
                            onNavigate?.('contact');
                          }}
                        >
                          <span className="nav-dropdown-icon">
                            <FiEdit3 size={17} />
                          </span>
                          <div className="nav-dropdown-item-text">
                            <span className="nav-dropdown-item-title">Submit New Enquiry</span>
                            <span className="nav-dropdown-item-sub">Contact engineering lab</span>
                          </div>
                        </button>
                      </>
                    )}

                    <div className="nav-dropdown-divider" />

                    {/* Sign Out Action */}
                    <button
                      type="button"
                      className="nav-dropdown-item danger"
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <span className="nav-dropdown-icon">
                        <FiLogOut size={17} />
                      </span>
                      <div className="nav-dropdown-item-text">
                        <span className="nav-dropdown-item-title">Sign Out</span>
                      </div>
                    </button>
                  </>
                ) : (
                  /* Guest (Not Logged In) */
                  <>
                    <div className="nav-dropdown-header guest">
                      <div className="nav-dropdown-avatar guest">
                        <FiUser size={20} />
                      </div>
                      <div className="nav-dropdown-user-info">
                        <span className="nav-dropdown-name">Robogenesis Portal</span>
                        <span className="nav-dropdown-email">Sign in to track enquiries</span>
                      </div>
                    </div>

                    <div className="nav-dropdown-divider" />

                    <button
                      type="button"
                      className="nav-dropdown-item highlight"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setModalMode('login');
                        setIsLoginOpen(true);
                      }}
                    >
                      <span className="nav-dropdown-icon">
                        <FiLogIn size={17} />
                      </span>
                      <div className="nav-dropdown-item-text">
                        <span className="nav-dropdown-item-title">Sign In</span>
                        <span className="nav-dropdown-item-sub">Access your account & enquiries popup</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="nav-dropdown-item"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setModalMode('signup');
                        setIsLoginOpen(true);
                      }}
                    >
                      <span className="nav-dropdown-icon">
                        <FiUserPlus size={17} />
                      </span>
                      <div className="nav-dropdown-item-text">
                        <span className="nav-dropdown-item-title">Create Account</span>
                        <span className="nav-dropdown-item-sub">Register as a new member</span>
                      </div>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={onToggleMobile}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Mobile menu backdrop */}
        {mobileOpen && (
          <div
            className="mobile-menu-backdrop"
            onClick={onToggleMobile}
            aria-hidden="true"
          />
        )}

        {/* Mobile menu drawer */}
        <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
          <div className="mobile-nav-links">
            {NAV_LINKS.map((l) => {
              const IconComp = l.icon;
              return (
                <button
                  key={l.id}
                  className={`mobile-nav-link${currentPage === l.id ? ' active' : ''}`}
                  onClick={() => {
                    onNavigate(l.id);
                    onToggleMobile();
                  }}
                >
                  <span className="mobile-nav-link-icon">
                    <IconComp size={18} />
                  </span>
                  <span className="mobile-nav-link-text">{l.label}</span>
                </button>
              );
            })}

            <div className="mobile-menu-divider" />

            <button
              className="mobile-nav-link highlight-robolab"
              onClick={() => {
                onOpenOs();
                onToggleMobile();
              }}
            >
              <span className="mobile-nav-link-icon">
                <FiZap size={18} />
              </span>
              <span className="mobile-nav-link-text">Enter RoboLab</span>
              <span className="mobile-nav-link-badge">OS</span>
            </button>

            <button
              className="mobile-nav-link highlight-account"
              onClick={() => {
                onToggleMobile();
                if (user?.role === 'admin') {
                  if (onNavigate) {
                    onNavigate('admin');
                  } else {
                    window.location.href = '/admin';
                  }
                } else {
                  setIsLoginOpen(true);
                }
              }}
            >
              <span className="mobile-nav-link-icon">
                {user?.role === 'admin' ? <FiShield size={18} /> : <FiUser size={18} />}
              </span>
              <span className="mobile-nav-link-text">
                {user?.role === 'admin'
                  ? 'Admin Panel'
                  : user
                  ? `Account (${user.name})`
                  : 'Sign In / Account'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Login & Account Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        user={user}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        onOpenAdmin={() => onNavigate('admin')}
        onNavigate={onNavigate}
        initialMode={modalMode}
      />
    </header>
  );
}
