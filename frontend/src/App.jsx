import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import FooterSection from './components/FooterSection.jsx';
import MacOSDesktop from './MacView/MacOSDesktop.jsx';
import DesktopRobotCompanion from './MacView/DesktopRobotCompanion.jsx';
import RobotLoader from './components/RobotLoader.jsx';

import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import DomainsPage from './pages/DomainsPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import WebDevPage from './pages/WebDevPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

const VALID_PAGES = ['home', 'about', 'domains', 'products', 'web-development', 'contact', 'admin'];

function parseCurrentRoute() {
  try {
    if (typeof window === 'undefined') {
      return { page: 'home', isOs: true };
    }

    // 1. Check if legacy hash was provided (e.g. #/products, #products, #/os)
    const rawHash = window.location.hash || '';
    const cleanHash = rawHash.replace(/^#\/?/, '').toLowerCase().trim();
    const hadHash = !!rawHash;

    // 2. Check pathname (e.g. /products, /about, /os, /)
    const rawPath = window.location.pathname || '';
    const cleanPath = rawPath.replace(/^\/+|\/+$/g, '').toLowerCase().trim();

    // Priority: if hash exists, migrate from hash; otherwise use pathname
    const target = (hadHash && cleanHash) ? cleanHash : cleanPath;

    if (target === 'os') {
      return { page: 'home', isOs: true };
    }

    if (target === 'admin') {
      try {
        const u = JSON.parse(localStorage.getItem('robogenesis_user') || 'null');
        if (u && u.role === 'admin') {
          return { page: 'admin', isOs: false };
        }
      } catch {
        // Fallback
      }
      return { page: 'home', isOs: false };
    }

    if (VALID_PAGES.includes(target)) {
      return { page: target, isOs: false };
    }

    // Root path: first show Mac View by default
    const saved = localStorage.getItem('robogenesis_current_page');
    const defaultPage = (saved && VALID_PAGES.includes(saved) && saved !== 'admin') ? saved : 'home';
    return { page: defaultPage, isOs: true };
  } catch {
    return { page: 'home', isOs: true };
  }
}

export default function App() {
  const [route] = useState(parseCurrentRoute);
  const [currentPage, setCurrentPage] = useState(route.page);
  const [scrolled, setScrolled] = useState(false);
  const [osMode, setOsMode] = useState(route.isOs);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Robot Walking Loader states
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [loaderText, setLoaderText] = useState(
    route.isOs ? 'Booting Robogenesis OS...' : 'Initializing Robogenesis System...'
  );

  // Initial mount / Page refresh loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      const exitTimer = setTimeout(() => {
        setIsLoading(false);
        setIsExiting(false);
      }, 320);
      return () => clearTimeout(exitTimer);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  // Sync state with clean URL path (remove # completely)
  useEffect(() => {
    try {
      localStorage.setItem('robogenesis_current_page', currentPage);
    } catch {
      // Ignored
    }

    const expectedPath = osMode ? '/os' : `/${currentPage}`;
    if (window.location.hash || window.location.pathname !== expectedPath) {
      window.history.replaceState(null, '', expectedPath);
    }
  }, [currentPage, osMode]);

  // Handle browser Back / Forward navigation (popstate) with clean transition & clean accidental hash
  useEffect(() => {
    const handlePopState = () => {
      const r = parseCurrentRoute();
      if (r.isOs) {
        setLoaderText('Switching to OS View...');
        setIsLoading(true);
        setIsExiting(false);

        setTimeout(() => {
          setOsMode(true);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
              setIsLoading(false);
              setIsExiting(false);
            }, 300);
          }, 350);
        }, 180);
      } else {
        // Switching between tabs: NO loader, instant smooth transition!
        setOsMode(false);
        setCurrentPage(r.page);
        try {
          localStorage.setItem('robogenesis_current_page', r.page);
        } catch {
          // Ignored
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const handleHashChange = () => {
      const r = parseCurrentRoute();
      if (r.isOs) {
        setOsMode(true);
        window.history.replaceState(null, '', '/os');
      } else {
        setOsMode(false);
        setCurrentPage(r.page);
        window.history.replaceState(null, '', `/${r.page}`);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Track scroll position for navbar glass styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [navParams, setNavParams] = useState(null);

  const navigateTo = useCallback((page, params = null) => {
    if (!VALID_PAGES.includes(page)) return;

    if (params) {
      setNavParams(params);
    } else if (page !== currentPage) {
      setNavParams(null);
    }

    if (currentPage === page && !osMode) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Switching between landing tabs: NO LOADING SCREEN!
    // Instant, smooth tab change so robot companion transition and content display immediately.
    setCurrentPage(page);
    setOsMode(false);
    try {
      localStorage.setItem('robogenesis_current_page', page);
    } catch {
      // Ignored
    }
    const newPath = `/${page}`;
    if (window.location.pathname !== newPath || window.location.hash) {
      window.history.pushState(null, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, osMode]);

  const handleOpenOs = useCallback(() => {
    setLoaderText('Booting RoboLab...');
    setIsLoading(true);
    setIsExiting(false);

    setTimeout(() => {
      setOsMode(true);
      if (window.location.pathname !== '/os' || window.location.hash) {
        window.history.pushState(null, '', '/os');
      }
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsLoading(false);
          setIsExiting(false);
        }, 300);
      }, 800);
    }, 150);
  }, []);

  const handleCloseOs = useCallback(() => {
    setLoaderText('Returning to RoboWeb...');
    setIsLoading(true);
    setIsExiting(false);

    setTimeout(() => {
      setOsMode(false);
      // Ensure we always return to the RoboWeb public landing page ('home'), never getting trapped in 'admin'
      const targetPage = (currentPage && currentPage !== 'admin' && VALID_PAGES.includes(currentPage))
        ? currentPage
        : 'home';
      setCurrentPage(targetPage);
      try {
        localStorage.setItem('robogenesis_current_page', targetPage);
      } catch {
        // Ignored
      }
      const newPath = `/${targetPage}`;
      if (window.location.pathname !== newPath || window.location.hash) {
        window.history.pushState(null, '', newPath);
      }
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsLoading(false);
          setIsExiting(false);
        }, 300);
      }, 800);
    }, 150);
  }, [currentPage]);

  return (
    <>
      {/* Global Robot Walking Loader */}
      {isLoading && (
        <RobotLoader
          text={loaderText}
          isExiting={isExiting}
        />
      )}

      {/* Landing Page Robot Companion (Scroll Tracking & Tab-to-Tab Transitions) */}
      {!osMode && currentPage !== 'admin' && (
        <DesktopRobotCompanion
          mode="landing"
          currentPage={currentPage}
        />
      )}

      {currentPage !== 'admin' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={navigateTo}
          scrolled={scrolled}
          onOpenOs={handleOpenOs}
          mobileOpen={mobileOpen}
          onToggleMobile={() => setMobileOpen((prev) => !prev)}
        />
      )}

      <main className={currentPage === 'admin' ? 'admin-viewport-root' : 'main-viewport'}>
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onOpenOs={handleOpenOs}
          />
        )}
        {currentPage === 'about' && (
          <AboutPage
            onNavigate={navigateTo}
            onOpenOs={handleOpenOs}
          />
        )}
        {currentPage === 'domains' && (
          <DomainsPage
            onNavigate={navigateTo}
          />
        )}
        {currentPage === 'products' && (
          <ProductsPage
            onNavigate={navigateTo}
          />
        )}
        {currentPage === 'web-development' && (
          <WebDevPage
            onNavigate={navigateTo}
            onOpenOs={handleOpenOs}
          />
        )}
        {currentPage === 'contact' && (
          <ContactPage
            onNavigate={navigateTo}
            navParams={navParams}
          />
        )}
        {currentPage === 'admin' && (
          <AdminPage
            onNavigate={navigateTo}
            onOpenLogin={() => {
              window.dispatchEvent(new CustomEvent('robogenesis_open_login'));
            }}
          />
        )}
      </main>

      {currentPage !== 'admin' && (
        <FooterSection
          onNavigate={navigateTo}
          onOpenOs={handleOpenOs}
        />
      )}

      <MacOSDesktop
        isOpen={osMode}
        onClose={handleCloseOs}
      />
    </>
  );
}

