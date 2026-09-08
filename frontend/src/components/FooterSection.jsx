import { useState } from 'react';
import logoImg from '../assets/logo.png';

const EARTH_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4';

const FOOTER_COLS = [
  {
    title: 'Navigation',
    links: [
      { label: 'Home', page: 'home' },
      { label: 'About Us', page: 'about' },
      { label: 'Domains', page: 'domains' },
      { label: 'Products', page: 'products' },
      { label: 'Web Development', page: 'web-development' },
      { label: 'Get in Touch', page: 'contact' },
    ],
  },
  {
    title: 'Web Development',
    links: [
      { label: 'Engineering Ecosystem', page: 'web-development' },
      { label: 'Live Projects Preview', page: 'web-development' },
      { label: 'MERN Stack & React 19', page: 'web-development' },
      { label: 'Next.js 15 High-Speed', page: 'web-development' },
      { label: 'Cloud DevOps CI/CD', page: 'web-development' },
      { label: 'Real-Time WebSockets', page: 'web-development' },
    ],
  },
  {
    title: 'Robotics & Hardware',
    links: [
      { label: 'RG-247 Robotics Platform', page: 'products' },
      { label: 'Kinetic Bionic Hand v3.8', page: 'products' },
      { label: 'ROS2 Autonomous Nav', page: 'domains' },
      { label: 'SmartNode IoT Firmware', page: 'products' },
      { label: '3D Fabrication Suite', page: 'products' },
      { label: 'Hardware Registry (72+)', page: 'products' },
    ],
  },
  {
    title: 'Company & Labs',
    links: [
      { label: 'About Robogenesis', page: 'about' },
      { label: 'R&D Innovation Lab', page: 'about' },
      { label: 'Core Mission & Vision', page: 'about' },
      { label: 'Careers & Internships', page: 'about' },
      { label: 'Partner Inquiries', page: 'contact' },
      { label: 'contact@robogenesis.in', page: 'contact' },
    ],
  },
];

export default function FooterSection({ onOpenOs, onNavigate }) {
  const [nlEmail, setNlEmail] = useState('');
  const [nlStatus, setNlStatus] = useState(null);
  const [nlLoading, setNlLoading] = useState(false);

  const handleNlSubmit = async (e) => {
    e.preventDefault();
    if (!nlEmail || !nlEmail.trim()) return;

    setNlLoading(true);
    setNlStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: nlEmail.split('@')[0],
          email: nlEmail.trim(),
          phone: '',
          enquiryType: 'Newsletter Subscription',
          domain: 'Technical Briefings',
          sourceTab: 'Footer Newsletter',
          message: 'Subscriber requested monthly technical briefings on robotics, embedded AI, and web architecture.',
        }),
      });

      if (res.ok) {
        setNlStatus({ type: 'success', text: '✓ Subscribed! You will receive our technical briefings.' });
        setNlEmail('');
      } else {
        const data = await res.json().catch(() => ({}));
        setNlStatus({ type: 'error', text: data.error || 'Failed to subscribe.' });
      }
    } catch {
      setNlStatus({ type: 'error', text: 'Could not subscribe. Please try again.' });
    } finally {
      setNlLoading(false);
    }
  };

  return (
    <footer className="site-footer" id="footer">
      {/* Earth background video */}
      <div className="footer-earth-video-wrap">
        <video
          id="earthVideo"
          className="footer-earth-video"
          src={EARTH_VIDEO}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
      <div className="footer-overlay-gradient" />

      <div className="footer-container">
        <div className="footer-glass-card">
          {/* Brand row */}
          <div className="footer-brand-row">
            <div className="footer-brand-left">
              <a
                href="/home"
                className="footer-brand"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.('home');
                }}
              >
                <img src={logoImg} alt="Robogenesis Logo" className="footer-logo-img" />
                <span className="footer-brand-title">Robogenesis</span>
              </a>
              <p className="footer-brand-tagline">
                Pioneering the kinetic layer between silicon and intelligence — engineering advanced robotics, embedded IoT, high-performance web platforms, and automated cloud systems.
              </p>
            </div>

            {/* Desktop / Virtual Lab pill */}
            <div className="footer-brand-actions">
              <button
                className="os-window-header-pill"
                onClick={onOpenOs}
                style={{ flexShrink: 0 }}
                title="Launch Robogenesis Virtual Lab Desktop Mode"
              >
                <span>Virtual Lab</span>
                <span className="os-pill-action">RoboLab</span>
              </button>
            </div>
          </div>

          {/* Link columns */}
          <div className="footer-columns-grid">
            {FOOTER_COLS.map((col) => (
              <div key={col.title} className="fc-col">
                <h3>{col.title}</h3>
                <ul>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={`/${link.page}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate?.(link.page);
                        }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter & Socials */}
            <div className="newsletter-box">
              <h3>Engineering Updates</h3>
              <p className="nl-desc">
                Subscribe to our monthly technical briefings on robotics, web architecture, and embedded AI.
              </p>
              <form className="nl-input-row" onSubmit={handleNlSubmit}>
                <input
                  className="nl-input"
                  type="email"
                  placeholder="you@company.com"
                  required
                  aria-label="Email address"
                  value={nlEmail}
                  onChange={(e) => setNlEmail(e.target.value)}
                  disabled={nlLoading}
                />
                <button className="nl-submit-btn" type="submit" aria-label="Subscribe" disabled={nlLoading}>
                  {nlLoading ? '…' : '→'}
                </button>
              </form>
              {nlStatus && (
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: nlStatus.type === 'success' ? '#10b981' : '#ef4444',
                    fontWeight: 600,
                  }}
                >
                  {nlStatus.text}
                </div>
              )}

              {/* Direct Contact & Social */}
              <div className="footer-social-wrapper">
                <span className="footer-social-label">Connect with our engineers:</span>
                <div className="social-icons-row">
                  {[
                    { label: '𝕏', href: 'https://x.com', title: 'X (Twitter)' },
                    { label: 'in', href: 'https://linkedin.com', title: 'LinkedIn' },
                    { label: '⌥', href: 'https://github.com', title: 'GitHub' },
                    { label: '▶', href: 'https://youtube.com', title: 'YouTube' },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon-btn"
                      aria-label={s.title}
                      title={s.title}
                    >
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom-bar">
            <div className="footer-copyright-group">
              <span>© 2026 Robogenesis Technologies Pvt. Ltd. All rights reserved.</span>
              <span className="footer-status-pill">
                <span className="live-dot" style={{ width: 6, height: 6 }} />
                All Systems Operational
              </span>
            </div>
            <div className="footer-bottom-links">
              {['Privacy Policy', 'Terms of Service', 'Security Architecture', 'Compliance'].map((l) => (
                <a
                  key={l}
                  href={`/${l.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={(e) => e.preventDefault()}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
