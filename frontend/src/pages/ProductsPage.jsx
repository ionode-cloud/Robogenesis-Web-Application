import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PRODUCTS, PRODUCT_CATEGORIES, WHY_CHOOSE_ITEMS, PRODUCT_DESIGN_STEPS } from '../data/products.js';
import { ALL_PRODUCTS_LIST, PROJECT_CATEGORIES } from '../data/allProductsList.js';

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
      onNavigate('contact', {
        enquiryType: 'Product Enquiry',
        domain: product.categoryLabel || 'Robotics Hardware',
        sourceTab: 'Products',
        message: `I am interested in ordering or receiving quotation for ${product.name} (Ref #${product.number}).`,
      });
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
        {/* Modal Top Header Bar */}
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

        {/* Modal Scrollable Body */}
        <div className="product-modal-body">
          {/* Split Hero: Image + Quick Info */}
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

              {/* Price / Availability Card */}
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

            {/* Right Column: Name, Description, Technologies */}
            <div className="product-modal-info-col">
              <h2 id="modal-product-title" className="product-modal-title">
                {product.name}
              </h2>
              <p className="product-modal-lead-desc">{product.description}</p>

              {/* Tech Pills */}
              <div className="product-modal-section-group">
                <h4 className="pm-section-label">Technologies Supported</h4>
                <div className="product-modal-tech-pills">
                  {product.technologies.map((tech) => (
                    <span key={tech} className="product-modal-tech-pill">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Overview */}
              <div className="product-modal-section-group">
                <h4 className="pm-section-label">Engineering Overview</h4>
                <p className="pm-overview-text">{product.overview}</p>
              </div>

              {/* Suitable For */}
              {product.suitableFor && (
                <div className="product-modal-suitable-box">
                  <span className="suitable-badge">🎯 Intended Audience</span>
                  <p>{product.suitableFor}</p>
                </div>
              )}
            </div>
          </div>

          {/* Key Features */}
          {product.keyFeatures && product.keyFeatures.length > 0 && (
            <div className="product-modal-block">
              <h3 className="product-modal-block-title">
                <span>⚡</span> Key Engineering Features
              </h3>
              <ul className="product-modal-features-list">
                {product.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="feature-list-item">
                    <span className="feat-check-icon">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="product-modal-block">
              <h3 className="product-modal-block-title">
                <span>⚙️</span> Technical Specifications
              </h3>
              <div className="product-modal-specs-table">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="spec-table-row">
                    <div className="spec-label-col">{spec.label}</div>
                    <div className="spec-value-col">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Components Included */}
          {product.componentsIncluded && product.componentsIncluded.length > 0 && (
            <div className="product-modal-block">
              <h3 className="product-modal-block-title">
                <span>📦</span> Components & Hardware Included
              </h3>
              <div className="components-included-grid">
                {product.componentsIncluded.map((comp, idx) => (
                  <div key={idx} className="component-chip">
                    <span className="comp-dot">●</span>
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real-World Applications */}
          {product.applications && product.applications.length > 0 && (
            <div className="product-modal-block">
              <h3 className="product-modal-block-title">
                <span>🌐</span> Real-World Industry Applications
              </h3>
              <div className="applications-grid">
                {product.applications.map((app, idx) => (
                  <div key={idx} className="app-card-item">
                    <span className="app-arrow">➜</span>
                    <span>{app}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Learning Benefits */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="product-modal-block">
              <h3 className="product-modal-block-title">
                <span>🚀</span> Practical Value & Advantages
              </h3>
              <div className="benefits-cards-row">
                {product.benefits.map((benefit, idx) => (
                  <div key={idx} className="benefit-pill-box">
                    <div className="benefit-num">0{idx + 1}</div>
                    <div className="benefit-text">{benefit}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="product-modal-footer">
          <div className="modal-footer-notes">
            <span>🛡️ Fully tested & certified</span>
            <span>📖 Schematics & SDK included</span>
            <span>💬 Direct lab engineering support</span>
          </div>
          <div className="modal-footer-action-buttons">
            <button className="btn-modal-close" onClick={onClose}>
              Close Preview
            </button>
            <button className="btn-modal-enquire" onClick={handleEnquire}>
              Send Inquiry →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

const COIN_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_003132_8b7edcb6-c64d-4a52-a9ca-879942e122ad.mp4';
const INITIAL_TABLE_COUNT = 10; // 10 projects by default

export default function ProductsPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // Auto-scroll stream state for "Engineered for Real-World Development"
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const streamScrollRef = useRef(null);
  const isPausedRef = useRef(false);
  isPausedRef.current = isAutoScrollPaused;

  // Table directory state
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategory, setTableCategory] = useState('all');
  const [tableVisibleCount, setTableVisibleCount] = useState(INITIAL_TABLE_COUNT);

  const catalogRef = useRef(null);
  const designRef = useRef(null);
  const directoryRef = useRef(null);

  // Filtered 72-item directory products
  const filteredTableProducts = useMemo(() => {
    const query = tableSearch.trim().toLowerCase();
    return ALL_PRODUCTS_LIST.filter((item) => {
      const categoryMatch = tableCategory === 'all' || item.category === tableCategory;
      if (!categoryMatch) return false;
      if (!query) return true;
      const nameMatch = item.name.toLowerCase().includes(query);
      const domainMatch = item.domain.toLowerCase().includes(query);
      const catMatch = item.categoryLabel.toLowerCase().includes(query);
      const techMatch = item.technologies.some((t) => t.toLowerCase().includes(query));
      return nameMatch || domainMatch || catMatch || techMatch;
    });
  }, [tableSearch, tableCategory]);

  const displayedTableProducts = useMemo(() => {
    return filteredTableProducts.slice(0, tableVisibleCount);
  }, [filteredTableProducts, tableVisibleCount]);

  // Smooth scroll to catalog
  const handleScrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Smooth scroll to product design section
  const handleScrollToDesign = () => {
    if (designRef.current) {
      designRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Smooth scroll to projects registry table
  const handleScrollToDirectory = () => {
    if (directoryRef.current) {
      directoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Image error tracker
  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Dynamic Statistics
  const totalProducts = PRODUCTS.length;
  const categoriesCount = useMemo(() => {
    const cats = new Set(PRODUCTS.map((p) => p.category));
    return cats.size;
  }, []);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      return selectedCategory === 'all' || product.category === selectedCategory;
    });
  }, [selectedCategory]);

  // Dynamic repeat count for seamless infinite auto-scroll
  const repeatCount = useMemo(() => {
    if (!filteredProducts.length) return 1;
    return Math.max(3, Math.ceil(12 / filteredProducts.length));
  }, [filteredProducts.length]);

  // Multiplied products array for continuous auto-scrolling
  const streamProducts = useMemo(() => {
    if (!filteredProducts.length) return [];
    const items = [];
    for (let i = 0; i < repeatCount; i++) {
      filteredProducts.forEach((product) => {
        items.push({
          ...product,
          _streamKey: `rep${i}-${product.id}`,
        });
      });
    }
    return items;
  }, [filteredProducts, repeatCount]);

  // Continuous 60fps auto-scrolling animation
  useEffect(() => {
    const container = streamScrollRef.current;
    if (!container || !filteredProducts.length) return;

    let animationFrameId;
    let lastTimestamp = null;
    const speed = 40; // 40px per second - calm, readable glide

    // Position container at set 1 so backward scroll also wraps seamlessly
    const setW = container.scrollWidth / repeatCount;
    if (container.scrollLeft === 0 && setW > 0) {
      container.scrollLeft = setW;
    }

    const step = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (!isPausedRef.current && container) {
        const currentSetW = container.scrollWidth / repeatCount;
        if (currentSetW > 0) {
          container.scrollLeft += speed * Math.min(elapsed, 0.1);

          // Wrap seamlessly forward
          if (container.scrollLeft >= currentSetW * (repeatCount - 1)) {
            container.scrollLeft -= currentSetW;
          } else if (container.scrollLeft <= 4) {
            // Wrap seamlessly backward
            container.scrollLeft += currentSetW;
          }
        }
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [filteredProducts, repeatCount]);

  // Manual directional controls for the auto-scroll stream
  const handleScrollStreamLeft = () => {
    if (streamScrollRef.current) {
      streamScrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const handleScrollStreamRight = () => {
    if (streamScrollRef.current) {
      streamScrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  // Category counts
  const getCategoryCount = (catId) => {
    if (catId === 'all') return PRODUCTS.length;
    return PRODUCTS.filter((p) => p.category === catId).length;
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="page-container page-enter products-page-wrapper">
      {/* =========================================================================
          1. PRODUCTS HERO SECTION WITH 3D COIN BACKGROUND VIDEO
          ========================================================================= */}
      <section className="products-hero-section">
        {/* Full-width Coin Video Background Layer */}
        <div className="products-video-layer">
          <div className="products-video-wrapper">
            <video
              id="productsBgCoinVideo"
              className="products-bg-video"
              src={COIN_VIDEO}
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
          <div className="products-video-overlay" />
        </div>

        <div className="container-fluid products-hero-container">
          <div className="products-hero-inner">
            <h1 className="products-hero-title">
              Build. Innovate. <span>Create.</span>
            </h1>

            <p className="products-hero-desc">
              Explore our range of technology products and development solutions designed for
              students, developers, innovators, and technology enthusiasts. From IoT and embedded
              systems to robotics and automation, our products help transform ideas into
              real-world solutions.
            </p>

            <div className="products-hero-cta-group">
              <button className="btn-products-explore" onClick={handleScrollToDesign}>
                Engineering Lifecycle
                <span className="btn-arrow-icon">↓</span>
              </button>
              <button className="btn-products-design-link" onClick={handleScrollToCatalog}>
                <span>Hardware Catalog</span>
                <span className="btn-arrow-icon">⚡</span>
              </button>
              <button className="btn-products-design-link" onClick={handleScrollToDirectory}>
                <span>Projects Registry (72+)</span>
                <span className="btn-arrow-icon">📋</span>
              </button>
              <button
                className="btn-products-contact-hero"
                onClick={() => onNavigate('contact')}
              >
                Get Custom Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PRODUCT STATISTICS (DYNAMIC)
          ========================================================================= */}
      <section className="products-stats-section">
        <div className="container-fluid">
          <div className="products-stats-container">
            <div className="products-stat-card">
              <div className="products-stat-val">{totalProducts}+</div>
              <div className="products-stat-lbl">Technology Products</div>
              <div className="products-stat-sub">Hardware & dev boards</div>
            </div>

            <div className="products-stat-card">
              <div className="products-stat-val">{categoriesCount}</div>
              <div className="products-stat-lbl">Product Categories</div>
              <div className="products-stat-sub">Specialized domains</div>
            </div>

            <div className="products-stat-card">
              <div className="products-stat-val">IoT, Embedded</div>
              <div className="products-stat-lbl">& Robotics Hardware</div>
              <div className="products-stat-sub">Industry standard architectures</div>
            </div>

            <div className="products-stat-card">
              <div className="products-stat-val">100%</div>
              <div className="products-stat-lbl">Practical Learning</div>
              <div className="products-stat-sub">Hands-on engineering kits</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. ENGINEERING LIFECYCLE (HOW TO PRODUCT DESIGN: IDEA TO FINAL DEPLOYMENT)
          ========================================================================= */}
      <section className="product-design-section" ref={designRef} id="how-to-product-design">
        <div className="container-fluid">
          <div className="product-design-inner">
            <div className="product-design-header text-center">
              <span className="products-pill-tag design-methodology-pill">Engineering Lifecycle</span>
              <h2 className="product-design-title">
                How to Product Design: <span>Idea to Final Deployment</span>
              </h2>
              <p className="product-design-subtitle">
                Every Robogenesis technological system undergoes a disciplined four-stage engineering lifecycle.
                From initial concept discovery and empirical data acquisition to rapid fabrication and certified industrial deployment.
              </p>
            </div>

            {/* 4 Stage Cards Grid */}
            <div className="design-steps-grid">
              {PRODUCT_DESIGN_STEPS.map((step) => (
                <div
                  key={step.id}
                  className="design-step-card"
                  style={{ '--step-accent': step.accentColor }}
                >
                  {/* Card Header */}
                  <div className="design-step-card-header">
                    <div className="design-step-header-left">
                      <span
                        className="design-step-badge"
                        style={{
                          background: `${step.accentColor}18`,
                          color: step.accentColor,
                          borderColor: `${step.accentColor}40`,
                        }}
                      >
                        {step.badge}
                      </span>
                      <span className="design-step-subtitle">{step.subtitle}</span>
                    </div>
                    <div
                      className="design-step-icon-wrap"
                      style={{
                        background: `${step.accentColor}15`,
                        borderColor: `${step.accentColor}35`,
                      }}
                    >
                      <span className="design-step-icon">{step.icon}</span>
                    </div>
                  </div>

                  <h3 className="design-step-title">{step.title}</h3>
                  <p className="design-step-tagline">{step.tagline}</p>
                  <p className="design-step-description">{step.description}</p>

                  {/* Key Deliverables */}
                  <div className="design-step-deliverables">
                    <h4 className="design-step-list-heading">Key Deliverables</h4>
                    <ul className="design-step-list">
                      {step.deliverables.map((item, i) => (
                        <li key={i} className="design-step-list-item">
                          <span className="check-bullet" style={{ color: step.accentColor }}>✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack / Tools */}
                  <div className="design-step-tools">
                    <h4 className="design-step-list-heading">Technologies & Frameworks</h4>
                    <div className="design-step-pills">
                      {step.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="design-tech-pill"
                          style={{
                            borderColor: `${step.accentColor}35`,
                            color: step.accentColor,
                            background: `${step.accentColor}0e`,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA Banner */}
            <div className="product-design-cta-bar">
              <div className="product-design-cta-info">
                <h4>Have a custom hardware idea or engineering challenge?</h4>
                <p>
                  Our R&D engineering laboratory collaborates with startups, universities, and enterprise teams
                  to bring complex robotics, IoT, and EV embedded platforms from initial concept to turnkey production.
                </p>
              </div>
              <div className="product-design-cta-action">
                <button
                  className="btn-design-start"
                  onClick={() => onNavigate && onNavigate('contact', {
                    enquiryType: 'Custom Product Design',
                    domain: 'Robotics & Embedded Systems',
                    sourceTab: 'Products',
                    message: 'I would like to start a custom hardware/product design consultation.',
                  })}
                >
                  Start Your Product Design Journey →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. HARDWARE CATALOG: ENGINEERED FOR REAL-WORLD DEVELOPMENT
          ========================================================================= */}
      <section className="products-catalog-section" ref={catalogRef} id="products-catalog">
        <div className="container-fluid">
          <div className="products-catalog-header">
            <div className="products-header-top">
              <div>
                <span className="products-pill-tag">Hardware Catalog</span>
                <h2 className="products-section-title">
                  Engineered for <span>Real-World Development</span>
                </h2>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="products-categories-wrapper">
              <div className="products-category-pills" role="tablist">
                {PRODUCT_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  const count = getCategoryCount(cat.id);
                  return (
                    <button
                      key={cat.id}
                      role="tab"
                      aria-selected={isActive}
                      className={`product-category-tab${isActive ? ' active' : ''}`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <span className="cat-tab-icon">{cat.icon}</span>
                      <span className="cat-tab-label">{cat.label}</span>
                      <span className="cat-tab-count">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Product Auto-Scroll Stream */}
          <div className="products-grid-container">
            {filteredProducts.length > 0 ? (
              <div
                className="products-stream-viewport-wrapper"
                onMouseEnter={() => setIsAutoScrollPaused(true)}
                onMouseLeave={() => setIsAutoScrollPaused(false)}
                onTouchStart={() => setIsAutoScrollPaused(true)}
                onTouchEnd={() => setIsAutoScrollPaused(false)}
              >
                {/* Left Floating Arrow Button in Scrolling Product */}
                <button
                  className="stream-carousel-btn stream-carousel-left"
                  onClick={handleScrollStreamLeft}
                  aria-label="Scroll products left"
                  title="Scroll left"
                >
                  ‹
                </button>

                {/* Right Floating Arrow Button in Scrolling Product */}
                <button
                  className="stream-carousel-btn stream-carousel-right"
                  onClick={handleScrollStreamRight}
                  aria-label="Scroll products right"
                  title="Scroll right"
                >
                  ›
                </button>

                <div
                  className="products-stream-viewport"
                  ref={streamScrollRef}
                  id="productsStreamViewport"
                >
                  <div className="products-stream-track">
                    {streamProducts.map((product) => {
                      const hasImgError = imageErrors[product.id];
                      return (
                        <div key={product._streamKey} className="product-card catalog-stream-card">
                          {/* Card Header Media */}
                          <div className="product-card-media">
                            <div className="product-card-top-badges">
                              <span className="product-card-num-badge">#{product.number}</span>
                              <span className="product-card-category-badge">
                                {product.categoryLabel}
                              </span>
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

                          {/* Card Body */}
                          <div className="product-card-body">
                            <div className="product-card-cat-label">{product.categoryLabel}</div>
                            <h3 className="product-card-title">{product.name}</h3>
                            <p className="product-card-desc">{product.description}</p>

                            {/* Tech Pills */}
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

                            {/* Price / Action Row */}
                            <div className="product-card-footer">
                              <div className="product-card-price-info">
                                <span className="product-price-label">Price</span>
                                <span className="product-price-value">
                                  {product.price || 'Contact Us'}
                                </span>
                              </div>
                              <div className="product-card-actions">
                                <button
                                  className="btn-product-view-details"
                                  onClick={() => setSelectedProduct(product)}
                                  aria-label={`View details for ${product.name}`}
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
                </div>
              </div>
            ) : (
              /* Empty Filter State */
              <div className="products-empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3>No products found</h3>
                <p>We couldn&apos;t find any hardware kits in the selected category.</p>
                <button className="btn-reset-filters" onClick={() => setSelectedCategory('all')}>
                  Show All Products
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. COMPLETE PROJECT & PRODUCT DIRECTORY TABLE (72 INNOVATION SYSTEMS)
          ========================================================================= */}
      <section className="products-table-section" ref={directoryRef} id="products-directory-table">
        <div className="container-fluid">
          <div className="products-table-inner">
            <div className="products-table-header text-center">
              <span className="products-pill-tag">Comprehensive Catalog</span>
              <h2 className="products-table-title">
                Hardware Projects & <span>Product Solutions Registry</span>
              </h2>
              <p className="products-table-subtitle">
                Explore our catalog of 72+ specialized robotics, IoT systems, agricultural automations, 
                biomedical devices, and clean energy prototypes available for academic labs, startups, and industrial deployment.
              </p>
            </div>

            {/* Search & Category Filter Controls */}
            <div className="table-controls-bar">
              <div className="table-search-box">
                <span className="table-search-icon">🔍</span>
                <input
                  type="text"
                  className="table-search-input"
                  placeholder="Search 72+ products by name, domain, or technology (e.g. Helmet, Solar, Blind, IoT, Agriculture)..."
                  value={tableSearch}
                  onChange={(e) => {
                    setTableSearch(e.target.value);
                    setTableVisibleCount(INITIAL_TABLE_COUNT);
                  }}
                  aria-label="Search products directory"
                />
                {tableSearch && (
                  <button
                    className="table-search-clear"
                    onClick={() => setTableSearch('')}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="table-category-tabs" role="tablist">
                {PROJECT_CATEGORIES.map((cat) => {
                  const isActive = tableCategory === cat.id;
                  const count = cat.id === 'all'
                    ? ALL_PRODUCTS_LIST.length
                    : ALL_PRODUCTS_LIST.filter((p) => p.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`table-cat-btn ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        setTableCategory(cat.id);
                        setTableVisibleCount(INITIAL_TABLE_COUNT);
                      }}
                    >
                      <span className="table-cat-label">{cat.label}</span>
                      <span className="table-cat-badge">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Table Meta Bar */}
            <div className="table-meta-bar">
              <div className="table-count-info">
                Showing <strong>{displayedTableProducts.length}</strong> of {filteredTableProducts.length} Systems
                {filteredTableProducts.length < ALL_PRODUCTS_LIST.length && (
                  <span className="table-filtered-note"> (filtered from {ALL_PRODUCTS_LIST.length} total)</span>
                )}
              </div>
              {filteredTableProducts.length > INITIAL_TABLE_COUNT && (
                <div className="table-quick-toggle">
                  <button
                    className="btn-quick-view-all"
                    onClick={() => {
                      if (tableVisibleCount >= filteredTableProducts.length) {
                        setTableVisibleCount(INITIAL_TABLE_COUNT);
                      } else {
                        setTableVisibleCount(filteredTableProducts.length);
                      }
                    }}
                  >
                    {tableVisibleCount >= filteredTableProducts.length ? `Collapse to ${INITIAL_TABLE_COUNT}` : `Show All (${filteredTableProducts.length})`}
                  </button>
                </div>
              )}
            </div>

            {/* Responsive Table */}
            <div className="table-responsive-wrapper">
              <table className="products-directory-table">
                <thead>
                  <tr>
                    <th className="th-num">#</th>
                    <th className="th-name">Product / Project Name</th>
                    <th className="th-domain">Domain & Application</th>
                    <th className="th-tech">Key Technologies</th>
                    <th className="th-status">Lab Status</th>
                    <th className="th-action text-right">Inquire</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedTableProducts.length > 0 ? (
                    displayedTableProducts.map((item) => (
                      <tr key={item.id} className="directory-table-row">
                        <td className="td-num">
                          <span className="row-num-badge">{String(item.id).padStart(2, '0')}</span>
                        </td>
                        <td className="td-name">
                          <div className="product-name-block">
                            <span className="product-row-title">{item.name}</span>
                            <span className="product-row-category-mobile">{item.categoryLabel}</span>
                          </div>
                        </td>
                        <td className="td-domain">
                          <span className={`domain-tag-chip domain-${item.category}`}>
                            {item.domain}
                          </span>
                        </td>
                        <td className="td-tech">
                          <div className="table-tech-chips">
                            {item.technologies.map((tech, i) => (
                              <span key={i} className="table-tech-pill">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="td-status">
                          <span className={`status-pill status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            <span className="status-dot">●</span>
                            <span>{item.status}</span>
                          </span>
                        </td>
                        <td className="td-action text-right">
                          <button
                            className="btn-table-inquire"
                            onClick={() => onNavigate && onNavigate('contact', {
                              enquiryType: 'Product Enquiry',
                              domain: item.category || 'Robotics Hardware',
                              sourceTab: 'Products',
                              message: `Inquiring about ${item.name} (${item.code}).`,
                            })}
                            aria-label={`Inquire about ${item.name}`}
                          >
                            <span>Inquire</span>
                            <span className="inquire-arrow">→</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="td-empty">
                        <div className="directory-empty-state">
                          <span className="empty-state-icon">🔍</span>
                          <h4>No matching systems found</h4>
                          <p>We couldn&apos;t find any products matching &quot;{tableSearch}&quot; in this category.</p>
                          <button
                            className="btn-reset-table-filter"
                            onClick={() => {
                              setTableSearch('');
                              setTableCategory('all');
                              setTableVisibleCount(INITIAL_TABLE_COUNT);
                            }}
                          >
                            Reset Search & Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination / View More Controls */}
            {filteredTableProducts.length > INITIAL_TABLE_COUNT && (
              <div className="table-footer-controls">
                {tableVisibleCount < filteredTableProducts.length ? (
                  <div className="table-pagination-group">
                    <button
                      className="btn-table-load-more"
                      onClick={() => setTableVisibleCount((prev) => prev + 10)}
                      id="btnTableViewMore"
                    >
                      <span>View More Projects</span>
                      <span className="load-more-counter">+{Math.min(10, filteredTableProducts.length - tableVisibleCount)} More</span>
                      <span className="btn-arrow-down">↓</span>
                    </button>
                    <button
                      className="btn-table-show-all"
                      onClick={() => setTableVisibleCount(filteredTableProducts.length)}
                    >
                      View All {filteredTableProducts.length} Systems
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn-table-collapse"
                    onClick={() => {
                      setTableVisibleCount(INITIAL_TABLE_COUNT);
                      if (directoryRef.current) {
                        directoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    <span>Show Less (First 10)</span>
                    <span className="btn-arrow-up">↑</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. WHY CHOOSE ROBOGENESIS PRODUCTS?
          ========================================================================= */}
      <section className="why-choose-section">
        <div className="container-fluid">
          <div className="why-choose-container">
            <div className="why-choose-header text-center">
              <span className="products-pill-tag">The Robogenesis Standard</span>
              <h2 className="why-choose-title">
                Why Choose <span>Robogenesis Products?</span>
              </h2>
              <p className="why-choose-subtitle">
                Every hardware kit is engineered to provide students, researchers, and engineers with an
                uncompromising bridge between foundational theory and industrial application.
              </p>
            </div>

            <div className="why-choose-grid">
              {WHY_CHOOSE_ITEMS.map((item) => (
                <div key={item.id} className="why-choose-card">
                  <div className="why-choose-icon-box">{item.icon}</div>
                  <h3 className="why-choose-card-title">{item.title}</h3>
                  <p className="why-choose-card-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. PRODUCT ENQUIRY CTA SECTION
          ========================================================================= */}
      <section className="products-enquiry-section">
        <div className="container-fluid">
          <div className="products-enquiry-container">
            <div className="products-enquiry-card">
              <div className="products-enquiry-content">
                <span className="enquiry-tag-pill">Direct Manufacturer & Lab Support</span>
                <h2 className="products-enquiry-heading">
                  Interested in this product?
                </h2>
                <p className="products-enquiry-desc">
                  Contact Robogenesis to learn more about product availability, specifications, pricing,
                  and customization options. Whether you need a single lab kit or institutional bulk
                  orders, our engineering team is here to assist.
                </p>
              </div>

              <div className="products-enquiry-buttons">
                <button
                  className="btn-enquiry-primary"
                  onClick={() => onNavigate('contact', {
                    enquiryType: 'Product Quotation',
                    domain: 'Hardware Kits & Systems',
                    sourceTab: 'Products',
                    message: 'Requesting quotation and catalog availability for engineering lab products.',
                  })}
                >
                  Contact Us
                </button>
                <button
                  className="btn-enquiry-secondary"
                  onClick={() => onNavigate('contact', {
                    enquiryType: 'Product Enquiry',
                    domain: 'Robotics Kits',
                    sourceTab: 'Products',
                    message: 'Requesting technical consultation and order information for robotics products.',
                  })}
                >
                  Send Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. PRODUCT DETAILS MODAL
          ========================================================================= */}
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

