import logoImg from '../assets/logo.png';

const EARTH_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4';

const FOOTER_COLS = [
  {
    title: 'Robotics',
    links: ['RG-247 Platform', 'Kinetic Hand v3.8', 'ROS2 Firmware Stack', 'Nav2 Autonomous'],
  },
  {
    title: 'Embedded',
    links: ['SmartNode IoT v2', 'RTOS Firmware', 'PCB Design Suite', 'ESP32 / STM32'],
  },
  {
    title: 'AI & Vision',
    links: ['EdgeVision Module', 'YOLO On-Device', 'Neural Mesh Brain', 'A.R.I.A Head Agent'],
  },
  {
    title: 'Company',
    links: ['About Robogenesis', 'Engineering Blog', 'Careers', 'Contact Us'],
  },
];

export default function FooterSection({ onOpenOs, onNavigate }) {
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
            <a
              href="/home"
              className="footer-brand"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('home');
              }}
            >
              <img src={logoImg} alt="Robogenesis" className="footer-logo-img" />
            </a>
            <p className="footer-brand-tagline">
              Building the kinetic layer between silicon and intelligence — robotics, IoT, embedded AI, and 3D fabrication from one unified engineering lab.
            </p>

            {/* macOS pill */}
            <button className="os-window-header-pill" onClick={onOpenOs} style={{ flexShrink: 0 }}>
              <span style={{ fontSize: 12 }}> Desktop Mode</span>
              <span className="os-pill-action">OPEN</span>
            </button>
          </div>

          {/* Link columns */}
          <div className="footer-columns-grid">
            {FOOTER_COLS.map((col) => {
              return (
                <div key={col.title} className="fc-col">
                  <h3>{col.title}</h3>
                  <ul>
                    {col.links.map((l) => {
                      const targetPage =
                        l === 'Contact Us'
                          ? 'contact'
                          : col.title === 'Robotics'
                          ? 'products'
                          : col.title === 'Embedded' || col.title === 'AI & Vision'
                          ? 'domains'
                          : 'about';
                      return (
                        <li key={l}>
                          <a
                            href={`#${targetPage}`}
                            onClick={(e) => {
                              e.preventDefault();
                              onNavigate?.(targetPage);
                            }}
                          >
                            {l}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}

            {/* Newsletter */}
            <div className="newsletter-box">
              <h3>Engineering Updates</h3>
              <div className="nl-input-row">
                <input className="nl-input" type="email" placeholder="you@company.com" />
                <button className="nl-submit-btn">→</button>
              </div>

              {/* Social */}
              <div className="social-icons-row">
                {[
                  { label: '𝕏', href: '#' },
                  { label: 'in', href: '#' },
                  { label: '⌥', href: '#' },
                  { label: '▶', href: '#' },
                ].map((s) => (
                  <a key={s.label} href={s.href} className="social-icon-btn" aria-label={s.label}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom-bar">
            <span>© 2026 Robogenesis Technologies. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Privacy', 'Terms', 'Security', 'Cookies'].map((l) => (
                <a
                  key={l}
                  href={`/${l.toLowerCase()}`}
                  onClick={(e) => e.preventDefault()}
                  style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12.5 }}
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
