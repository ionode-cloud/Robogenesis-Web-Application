import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PRODUCTS, PRODUCT_CATEGORIES } from '../data/products.js';

const HAND_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4';

// Top curated featured products across categories for high-impact home showcase
const FEATURED_PRODUCT_IDS = [1, 7, 4, 10, 2, 8, 5, 11];

// 6 Core Specialized Technology Domains for Home Showcase
const DOMAIN_CARDS = [
  {
    id: 'iot',
    icon: '📡',
    accentColor: '#30d158',
    tag: 'HARDWARE & TELEMETRY',
    title: 'Internet of Things (IoT)',
    description: 'Deploy low-power sensor arrays, ESP32 nodes, LoRaWAN gateways, and real-time MQTT telemetry pipelines to cloud dashboards.',
    highlights: ['ESP32 NodeMCU', 'LoRaWAN Mesh', 'MQTT Protocol', 'Edge Gateways'],
    projectsCount: '10 Capstone Projects',
  },
  {
    id: 'aiml',
    icon: '🧠',
    accentColor: '#bf5af2',
    tag: 'NEURAL VISION & TINYML',
    title: 'AI & Machine Learning',
    description: 'On-device neural vision, YOLO object detection models, TinyML inference engines, and deep neural networks operating without cloud latency.',
    highlights: ['Edge AI Vision', 'YOLOv8 Detection', 'PyTorch Models', 'Facial Recognition'],
    projectsCount: '10 Capstone Projects',
  },
  {
    id: 'web-development',
    icon: '💻',
    accentColor: '#0a84ff',
    tag: 'FULL-STACK & TELEMETRY',
    title: 'Modern Web Development',
    description: 'High-throughput telemetry portals, WebSockets real-time control streams, responsive digital twins, and modern React architectures.',
    highlights: ['React 19 & Vite', 'WebSockets Stream', 'Cloud Microservices', 'Interactive Dashboards'],
    projectsCount: '10 Capstone Projects',
  },
  {
    id: 'robotics',
    icon: '🤖',
    accentColor: '#ff9f0a',
    tag: 'AUTONOMOUS ROBOTICS',
    title: 'Robotics & Automation',
    description: 'Multi-DOF robotic arms, autonomous mobile rovers, LiDAR SLAM waypoint navigation, and MoveIt kinematic solvers built on ROS2.',
    highlights: ['ROS2 Framework', 'Nav2 Waypoints', 'LiDAR SLAM', 'Kinematic Solvers'],
    projectsCount: 'Autonomous Systems',
  },
  {
    id: 'embedded',
    icon: '⚙️',
    accentColor: '#ff375f',
    tag: 'ARM & HIGH-SPEED PCB',
    title: 'Embedded Systems & VLSI',
    description: 'ARM Cortex-M4/M7 architecture, STM32 bare-metal and FreeRTOS kernel design, and multi-layer impedance-matched PCB engineering.',
    highlights: ['ARM Cortex-M4', 'STM32 Microchips', 'FreeRTOS Kernel', 'KiCad Multi-Layer'],
    projectsCount: 'Industrial Hardware',
  },
  {
    id: 'digital-twin',
    icon: '🔬',
    accentColor: '#00f0ff',
    tag: 'SIMULATION & PHYSICS',
    title: 'Digital Twin & Simulation',
    description: 'Real-time physical dynamics in NVIDIA Isaac Sim and Gazebo to stress-test kinematic balance and autonomous algorithms before fabrication.',
    highlights: ['Isaac Sim', 'Gazebo Physics', 'Swarm Autonomy', 'Biomimetic Tendons'],
    projectsCount: 'Advanced R&D Lab',
  },
];

const TECH_ITEMS = [
  { icon: '🤖', label: 'ROS2 Jazzy' },
  { icon: '🧠', label: 'Neuromorphic AI' },
  { icon: '📡', label: 'LoRaWAN 5G' },
  { icon: '⚙️', label: '42-DOF Kinematics' },
  { icon: '🔬', label: 'Edge Inference' },
  { icon: '🛰️', label: 'LiDAR SLAM' },
  { icon: '💡', label: 'Embedded RTOS' },
  { icon: '🦾', label: 'Biomimetics' },
  { icon: '🔌', label: 'Multi-layer PCB' },
  { icon: '🌐', label: 'Isaac Sim' },
  { icon: '⚡', label: 'MPPT Energy' },
  { icon: '🎯', label: 'YOLO Vision' },
];

const PARTNER_ITEMS = [
  { label: 'NVIDIA Jetson', color: '#76b900' },
  { label: 'ROS2 Foundation', color: '#0a84ff' },
  { label: 'STMicroelectronics', color: '#03a8e0' },
  { label: 'ESP32 Ecosystem', color: '#e74c3c' },
  { label: 'Gazebo Sim', color: '#ff9f0a' },
  { label: 'OpenCV', color: '#30d158' },
  { label: 'TensorRT', color: '#76b900' },
  { label: 'Raspberry Pi', color: '#c51a4a' },
  { label: 'Arduino Pro', color: '#00979d' },
  { label: 'Qualcomm AI', color: '#3253dc' },
];

function MarqueeTrack({ items, reverse = false, renderItem }) {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-track-outer${reverse ? ' marquee-reverse' : ''}`}>
      <div className="marquee-track-inner">
        {doubled.map((item, i) => (
          <div key={i} className="marquee-item">
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}

function MarqueeSection() {
  return (
    <section className="marquee-section" aria-label="Technologies and partners">
      <div className="marquee-header">
        <span className="marquee-label">Powering our stack</span>
      </div>

      {/* Row 1 — Tech stack */}
      <MarqueeTrack
        items={TECH_ITEMS}
        renderItem={(item) => (
          <>
            <span className="mq-icon">{item.icon}</span>
            <span className="mq-label">{item.label}</span>
          </>
        )}
      />

      {/* Row 2 — Partners (reverse) */}
      <MarqueeTrack
        items={PARTNER_ITEMS}
        reverse
        renderItem={(item) => (
          <>
            <span
              className="mq-dot"
              style={{ background: item.color }}
            />
            <span className="mq-label">{item.label}</span>
          </>
        )}
      />
    </section>
  );
}

function HeroSection({
  onOpenOs,
  onNavigateDomains,
  onNavigateContact,
  onNavigateAbout,
}) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  return (
    <section className="hero-section" id="hero">
      {/* Background video */}
      <div className="video-layer">
        <div className="video-wrapper">
          <video
            ref={videoRef}
            id="handVideo"
            className="bg-video"
            src={HAND_VIDEO}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>

      <div className="hero-content">
        <div className="hero-bottom">
          <h1 className="hero-title">
            Engineering the{' '}
            <span>Autonomous</span>
            {' '}Future
          </h1>
          <p className="hero-subtitle">
            Robotics · IoT · Embedded Systems · Neuromorphic AI · 3D Fabrication. Built from silicon to intelligence.
          </p>

          <div className="hero-cta-group">
            <button
              className="btn-primary"
              onClick={onNavigateDomains}
            >
              🔬 Explore Domains
            </button>
            <button
              className="btn-secondary"
              onClick={onNavigateContact}
            >
              💬 Start a Project
            </button>
            <button className="btn-secondary" onClick={onOpenOs}>
              macOS View
            </button>
          </div>

          <div className="hero-video-controls">
            <button className="hvc-btn" onClick={togglePlay}>
              {playing ? '⏸ Pause' : '▶ Play'}
            </button>
            <span>Kinetic Hand Model v3.8 · 42-DOF</span>
          </div>

          {onNavigateAbout && (
            <button
              className="scroll-down"
              onClick={onNavigateAbout}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ↓ Learn more about us
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function ProductDetailsModal({ product, onClose, onNavigate }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const handleEnquire = () => {
    onClose();
    if (onNavigate) {
      onNavigate('contact');
    }
  };

  const modalContent = (
    <div
      className="product-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      <div
        className="product-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="product-modal-top-bar">
          <div className="product-modal-meta-row">
            <span className="product-modal-num">REF #{product.number}</span>
            <span className="product-modal-cat-badge">{product.categoryLabel}</span>
            <span className="product-modal-stock-badge">● Available to Order</span>
          </div>
          <button
            className="product-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="product-modal-body">
          <div className="product-modal-split-hero">
            <div className="product-modal-image-col">
              <div className="product-modal-image-wrapper">
                {!imgError && product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-modal-image"
                    onError={() => setImgError(true)}
                    loading="lazy"
                  />
                ) : (
                  <div className="product-modal-image-fallback">
                    <span className="fallback-symbol">{product.fallbackIcon || '⚡'}</span>
                    <span className="fallback-text">{product.name}</span>
                  </div>
                )}
                <div className="product-modal-img-tag">{product.categoryLabel} Engineering Kit</div>
              </div>

              <div className="product-modal-pricing-box">
                <div className="product-modal-price-meta">
                  <span className="pmp-label">Pricing Status</span>
                  <span className="pmp-val">{product.price || 'Contact Us for Quotation'}</span>
                </div>
                <div className="product-modal-cta-buttons">
                  <button
                    className="product-modal-primary-btn"
                    onClick={handleEnquire}
                  >
                    Send Enquiry
                  </button>
                  <button
                    className="product-modal-secondary-btn"
                    onClick={handleEnquire}
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>

            <div className="product-modal-info-col">
              <h2 id="modal-product-title" className="product-modal-title">
                {product.name}
              </h2>
              <p className="product-modal-lead-desc">{product.description}</p>

              <div className="product-modal-section-group">
                <h4 className="pm-section-label">Technologies Supported</h4>
                <div className="product-modal-tech-pills">
                  {product.technologies.map((tech) => (
                    <span key={tech} className="product-tech-pill">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {product.suitableFor && (
                <div className="product-modal-section-group">
                  <h4 className="pm-section-label">Suitable For</h4>
                  <p className="product-modal-subtext">🎓 {product.suitableFor}</p>
                </div>
              )}

              <div className="product-modal-section-group">
                <h4 className="pm-section-label">Product Overview</h4>
                <p className="product-modal-overview-text">{product.overview}</p>
              </div>
            </div>
          </div>

          <div className="product-modal-details-grid">
            <div className="pm-detail-box">
              <h3 className="pm-box-heading">
                <span className="pm-box-icon">⭐</span> Key Features
              </h3>
              <ul className="pm-checklist">
                {product.keyFeatures.map((feat, idx) => (
                  <li key={idx}>
                    <span className="pm-check-icon">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pm-detail-box">
              <h3 className="pm-box-heading">
                <span className="pm-box-icon">💡</span> Product Benefits
              </h3>
              <ul className="pm-checklist">
                {product.benefits.map((benefit, idx) => (
                  <li key={idx}>
                    <span className="pm-check-icon">✦</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pm-specs-container">
            <h3 className="pm-box-heading">
              <span className="pm-box-icon">📋</span> Technical Specifications
            </h3>
            <div className="pm-specs-table-wrapper">
              <table className="pm-specs-table">
                <tbody>
                  {product.specifications.map((spec, idx) => (
                    <tr key={idx}>
                      <td className="pm-spec-label">{spec.label}</td>
                      <td className="pm-spec-value">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pm-components-container">
            <h3 className="pm-box-heading">
              <span className="pm-box-icon">📦</span> Components Included in the Kit
            </h3>
            <div className="pm-components-grid">
              {product.componentsIncluded.map((comp, idx) => (
                <div key={idx} className="pm-component-pill">
                  <span className="pm-comp-num">#{idx + 1}</span>
                  <span className="pm-comp-name">{comp}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pm-apps-container">
            <h3 className="pm-box-heading">
              <span className="pm-box-icon">🚀</span> Real-World Applications
            </h3>
            <div className="pm-apps-grid">
              {product.applications.map((app, idx) => (
                <div key={idx} className="pm-app-card">
                  <span className="pm-app-bullet">▸</span>
                  <p>{app}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="product-modal-bottom-cta">
            <div className="pmb-text">
              <h4>Ready to prototype with the {product.name}?</h4>
              <p>Get in touch with Robogenesis technical advisors for volume discounts and school/lab bundles.</p>
            </div>
            <div className="pmb-actions">
              <button className="product-modal-primary-btn" onClick={handleEnquire}>
                Send Enquiry
              </button>
              <button className="product-modal-secondary-btn" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default function HomePage({ onNavigate, onOpenOs }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Filtered products for home view (exactly 4 cards in 1 row)
  const displayedProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return PRODUCTS.filter((p) => FEATURED_PRODUCT_IDS.includes(p.id)).slice(0, 4);
    }
    return PRODUCTS.filter((p) => p.category === selectedCategory).slice(0, 4);
  }, [selectedCategory]);

  return (
    <div className="page-container page-enter home-page-wrapper">
      {/* 1. Interactive Hero with Kinetic Hand Video */}
      <HeroSection
        onOpenOs={onOpenOs}
        onNavigateDomains={() => onNavigate('domains')}
        onNavigateContact={() => onNavigate('contact')}
      />

      {/* 2. Animated Marquee Tech Strip */}
      <MarqueeSection />

      {/* 3. PRODUCT SECTION */}
      <section className="home-products-section" id="home-products" aria-label="Featured Hardware and Development Kits">
        <div className="home-section-container">
          <div className="home-section-header">
            <div className="home-section-header-left">
              <span className="home-section-tag">
                <span className="home-tag-dot home-tag-dot-orange" />
                HARDWARE & DEVELOPMENT KITS
              </span>
              <h2 className="home-section-title">
                Engineered Hardware <span>Built to Impress</span>
              </h2>
              <p className="home-section-subtitle">
                Production-ready developer kits, industrial IoT testbeds, and autonomous robotics platforms engineered for real-world innovation.
              </p>
            </div>

            <div className="home-section-header-right">
              <button
                className="btn-home-action"
                onClick={() => onNavigate('products')}
                aria-label="View full hardware catalog"
              >
                <span>View Full Catalog (20+ Kits)</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>

          <div className="home-products-filters" role="tablist" aria-label="Product categories">
            {PRODUCT_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`home-filter-tab${isActive ? ' active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className="filter-tab-icon">{cat.icon}</span>
                  <span className="filter-tab-label">{cat.id === 'all' ? 'All Featured' : cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="products-cards-grid home-products-grid">
            {displayedProducts.map((product) => {
              const hasImgError = imageErrors[product.id];
              return (
                <div key={product.id} className="product-card home-product-card">
                  <div className="product-card-media">
                    <div className="product-card-top-badges">
                      <span className="product-card-num-badge">#{product.number}</span>
                      <span className="product-card-category-badge">{product.categoryLabel}</span>
                    </div>

                    <div className="product-card-image-container">
                      {!hasImgError && product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-card-img"
                          onError={() => handleImageError(product.id)}
                          loading="lazy"
                        />
                      ) : (
                        <div className="product-card-img-fallback">
                          <span className="fallback-card-icon">{product.fallbackIcon || '⚡'}</span>
                          <span className="fallback-card-label">{product.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="product-card-body">
                    <div className="product-card-cat-label">{product.categoryLabel}</div>
                    <h3 className="product-card-title">{product.name}</h3>
                    <p className="product-card-desc">{product.description}</p>

                    <div className="product-card-tags">
                      {product.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="product-card-tech-pill">
                          {tech}
                        </span>
                      ))}
                      {product.technologies.length > 3 && (
                        <span className="product-card-tech-more">
                          +{product.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="product-card-footer">
                      <div className="product-card-price-info">
                        <span className="product-price-label">Availability</span>
                        <span className="product-price-value">{product.price || 'Available to Order'}</span>
                      </div>
                      <div className="product-card-actions">
                        <button
                          className="btn-product-view-details"
                          onClick={() => setSelectedProduct(product)}
                          aria-label={`View quick details for ${product.name}`}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="home-banner-card">
            <div className="home-banner-content">
              <div className="home-banner-icon">🧰</div>
              <div className="home-banner-text">
                <h3 className="home-banner-title">Looking for Customized Hardware or Bulk Lab Kits?</h3>
                <p className="home-banner-desc">
                  We design custom PCB configurations, component assortments, and institutional hardware kits for universities, engineering institutions, and corporate teams.
                </p>
              </div>
            </div>
            <div className="home-banner-actions">
              <button
                className="btn-banner-primary"
                onClick={() => onNavigate('products')}
              >
                Browse 20+ Hardware Kits →
              </button>
              <button
                className="btn-banner-secondary"
                onClick={() => onNavigate('contact')}
              >
                Request Custom Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DOMAINS SECTION */}
      <section className="home-domains-section" id="home-domains" aria-label="Specialized Technology Domains">
        <div className="home-section-container">
          <div className="home-section-header">
            <div className="home-section-header-left">
              <span className="home-section-tag">
                <span className="home-tag-dot" />
                SPECIALIZED DOMAINS
              </span>
              <h2 className="home-section-title">
                Pioneering Domains in <span>Hardware & Intelligence</span>
              </h2>
              <p className="home-section-subtitle">
                Comprehensive technology tracks spanning silicon architecture, intelligent edge perception, robotics kinematics, and connected IoT telemetry.
              </p>
            </div>

            <div className="home-section-header-right">
              <button
                className="btn-home-action"
                onClick={() => onNavigate('domains')}
                aria-label="Explore all domains and projects"
              >
                <span>Explore All Domains & Projects</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>

          <div className="home-domains-grid">
            {DOMAIN_CARDS.map((domain) => (
              <div
                key={domain.id}
                className="home-domain-card"
                style={{ '--domain-glow': domain.accentColor }}
                onClick={() => onNavigate('domains')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate('domains');
                  }
                }}
              >
                <div className="hdc-header">
                  <div className="hdc-icon-wrap" style={{ borderColor: `${domain.accentColor}33`, color: domain.accentColor }}>
                    <span className="hdc-icon">{domain.icon}</span>
                  </div>
                  <div className="hdc-badges">
                    <span className="hdc-tag">{domain.tag}</span>
                    <span className="hdc-count" style={{ color: domain.accentColor }}>{domain.projectsCount}</span>
                  </div>
                </div>

                <h3 className="hdc-title">{domain.title}</h3>
                <p className="hdc-desc">{domain.description}</p>

                <div className="hdc-tags">
                  {domain.highlights.map((tech) => (
                    <span key={tech} className="hdc-pill">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="hdc-footer">
                  <span className="hdc-action-link" style={{ color: domain.accentColor }}>
                    <span>Explore Track & Projects</span>
                    <span className="hdc-arrow">→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="home-domains-metrics">
            <div className="hdm-item">
              <div className="hdm-number">30+</div>
              <div className="hdm-label">Real-World Capstone Projects</div>
            </div>
            <div className="hdm-divider" />
            <div className="hdm-item">
              <div className="hdm-number">6</div>
              <div className="hdm-label">Interdisciplinary Engineering Tracks</div>
            </div>
            <div className="hdm-divider" />
            <div className="hdm-item">
              <div className="hdm-number">100%</div>
              <div className="hdm-label">Hands-On Code & Hardware Prototyping</div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Quick-View Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
