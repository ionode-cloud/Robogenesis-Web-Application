import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import FooterSection from './components/FooterSection.jsx';
import MacOSDesktop from './MacView/MacOSDesktop.jsx';

import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import DomainsPage from './pages/DomainsPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ContactPage from './pages/ContactPage.jsx';

const VALID_PAGES = ['home', 'about', 'domains', 'products', 'contact'];

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

    if (VALID_PAGES.includes(target)) {
      return { page: target, isOs: false };
    }

    // Root path: first show Mac View by default
    const saved = localStorage.getItem('robogenesis_current_page');
    const defaultPage = (saved && VALID_PAGES.includes(saved)) ? saved : 'home';
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

  // Handle browser Back / Forward navigation (popstate) & clean any accidental hash
  useEffect(() => {
    const handlePopState = () => {
      const r = parseCurrentRoute();
      if (r.isOs) {
        setOsMode(true);
      } else {
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

  const navigateTo = useCallback((page) => {
    if (!VALID_PAGES.includes(page)) return;
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
  }, []);

  const handleOpenOs = useCallback(() => {
    setOsMode(true);
    if (window.location.pathname !== '/os' || window.location.hash) {
      window.history.pushState(null, '', '/os');
    }
  }, []);

  const handleCloseOs = useCallback(() => {
    setOsMode(false);
    const targetPage = VALID_PAGES.includes(currentPage) ? currentPage : 'home';
    const newPath = `/${targetPage}`;
    if (window.location.pathname !== newPath || window.location.hash) {
      window.history.pushState(null, '', newPath);
    }
  }, [currentPage]);

  return (
    <>
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        scrolled={scrolled}
        onOpenOs={handleOpenOs}
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen((prev) => !prev)}
      />

      <main className="main-viewport">
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
        {currentPage === 'contact' && (
          <ContactPage
            onNavigate={navigateTo}
          />
        )}
      </main>

      <FooterSection
        onNavigate={navigateTo}
        onOpenOs={handleOpenOs}
      />

      <MacOSDesktop
        isOpen={osMode}
        onClose={handleCloseOs}
      />
    </>
  );
}
