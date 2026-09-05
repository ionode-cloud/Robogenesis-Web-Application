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

function getPageFromHash() {
  try {
    const raw = typeof window !== 'undefined' ? window.location.hash : '';
    const clean = raw.replace(/^#\/?/, '').toLowerCase().trim();
    if (VALID_PAGES.includes(clean)) {
      return clean;
    }
    const saved = localStorage.getItem('robogenesis_current_page');
    if (saved && VALID_PAGES.includes(saved)) {
      return saved;
    }
    return 'home';
  } catch {
    return 'home';
  }
}

function getInitialOsMode() {
  try {
    const raw = typeof window !== 'undefined' ? window.location.hash : '';
    const clean = raw.replace(/^#\/?/, '').toLowerCase().trim();
    // If explicitly navigated to a non-home web page via direct URL link
    if (VALID_PAGES.includes(clean) && clean !== 'home') {
      return false;
    }
    return true; // First show Mac View by default
  } catch {
    return true;
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(getPageFromHash);
  const [scrolled, setScrolled] = useState(false);
  const [osMode, setOsMode] = useState(getInitialOsMode);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sync state with browser hash on initial load and keep URL hash populated
  useEffect(() => {
    try {
      localStorage.setItem('robogenesis_current_page', currentPage);
    } catch {
      // Ignored
    }

    if (osMode) {
      const cleanHash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase().trim();
      if (cleanHash !== 'os') {
        window.location.hash = '#/os';
      }
    } else {
      const cleanHash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase().trim();
      if (cleanHash !== currentPage && cleanHash !== 'os') {
        window.location.hash = `#/${currentPage}`;
      }
    }
  }, [currentPage, osMode]);

  // Sync with browser hash history
  useEffect(() => {
    const onHashChange = () => {
      const clean = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase().trim();
      if (clean === 'os') {
        setOsMode(true);
        return;
      }
      if (VALID_PAGES.includes(clean)) {
        setCurrentPage(clean);
        setOsMode(false);
        try {
          localStorage.setItem('robogenesis_current_page', clean);
        } catch {
          // Ignored
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
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
    window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenOs = useCallback(() => {
    setOsMode(true);
  }, []);

  const handleCloseOs = useCallback(() => {
    setOsMode(false);
    window.location.hash = `#/${currentPage}`;
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
