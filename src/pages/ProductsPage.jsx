import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PRODUCTS, PRODUCT_CATEGORIES, WHY_CHOOSE_ITEMS } from '../data/products.js';

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
                    <span key={tech} className="product-tech-pill">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suitable For */}
              {product.suitableFor && (
                <div className="product-modal-section-group">
                  <h4 className="pm-section-label">Suitable For</h4>
                  <p className="product-modal-subtext">🎓 {product.suitableFor}</p>
                </div>
              )}

              {/* Overview */}
              <div className="product-modal-section-group">
                <h4 className="pm-section-label">Product Overview</h4>
                <p className="product-modal-overview-text">{product.overview}</p>
              </div>
            </div>
          </div>

          {/* Key Features & Benefits Grid */}
          <div className="product-modal-details-grid">
            {/* Key Features */}
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

            {/* Product Benefits */}
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

          {/* Technical Specifications */}
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

          {/* Components Included */}
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

          {/* Applications */}
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

          {/* Modal Bottom CTA */}
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

const COIN_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_003132_8b7edcb6-c64d-4a52-a9ca-879942e122ad.mp4';
const INITIAL_VISIBLE_COUNT = 8; // 2 rows of 4 cards

export default function ProductsPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const catalogRef = useRef(null);

  // Reset to 2 rows (8 cards) whenever category or search filter changes
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [selectedCategory, searchQuery]);

  // Smooth scroll to catalog
  const handleScrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Filter products by category AND search query
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return PRODUCTS.filter((product) => {
      // 1. Category match
      const categoryMatch =
        selectedCategory === 'all' || product.category === selectedCategory;

      if (!categoryMatch) return false;

      // 2. Search query match
      if (!query) return true;

      const nameMatch = product.name.toLowerCase().includes(query);
      const catMatch = product.categoryLabel.toLowerCase().includes(query);
      const descMatch = product.description.toLowerCase().includes(query);
      const techMatch = product.technologies.some((t) =>
        t.toLowerCase().includes(query)
      );
      const numberMatch = product.number.includes(query);

      return nameMatch || catMatch || descMatch || techMatch || numberMatch;
    });
  }, [selectedCategory, searchQuery]);

  // Sliced displayed products (2 rows = 8 cards initially)
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const remainingCount = filteredProducts.length - visibleCount;
  const hasMore = remainingCount > 0;

  // Load next 4 cards (1 more row)
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  // Collapse back to initial 2 rows (8 cards)
  const handleShowLess = () => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
              <button className="btn-products-explore" onClick={handleScrollToCatalog}>
                Explore Products
                <span className="btn-arrow-icon">↓</span>
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
          3. SEARCH & CATEGORY FILTER CONTROLS + PRODUCT GRID
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
              <div className="products-count-badge">
                Showing <strong>{displayedProducts.length}</strong> of {filteredProducts.length} Products
              </div>
            </div>

            {/* Search Box */}
            <div className="products-search-wrapper">
              <div className="products-search-box">
                <span className="products-search-icon">🔍</span>
                <input
                  type="text"
                  className="products-search-input"
                  placeholder="Search products by name, category, technology, or keyword (e.g. ESP32, Robot, Arduino)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                />
                {searchQuery && (
                  <button
                    className="products-search-clear"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
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

          {/* =========================================================================
              4. PRODUCT GRID (12 INITIAL PRODUCTS)
              ========================================================================= */}
          <div className="products-grid-container">
            {filteredProducts.length > 0 ? (
              <>
                <div className="products-cards-grid">
                  {displayedProducts.map((product) => {
                    const hasImgError = imageErrors[product.id];
                    return (
                      <div key={product.id} className="product-card">
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

                {/* View All / Load More Action Button */}
                {hasMore ? (
                  <div className="products-view-more-container">
                    <button
                      className="btn-products-view-all"
                      onClick={handleLoadMore}
                      id="btnProductsViewAll"
                    >
                      <span>View All Products</span>
                      <span className="view-more-count-badge">+{Math.min(4, remainingCount)} More</span>
                      <span className="view-more-arrow">↓</span>
                    </button>
                  </div>
                ) : filteredProducts.length > INITIAL_VISIBLE_COUNT ? (
                  <div className="products-view-more-container">
                    <button
                      className="btn-products-show-less"
                      onClick={handleShowLess}
                      id="btnProductsShowLess"
                    >
                      <span>Show Less</span>
                      <span className="view-more-arrow">↑</span>
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              /* Empty Search/Filter State */
              <div className="products-empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3>No products found</h3>
                <p>
                  We couldn&apos;t find any hardware kits matching &quot;{searchQuery}&quot; in the selected category.
                </p>
                <button className="btn-reset-filters" onClick={handleResetFilters}>
                  Reset Filters & Search
                </button>
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
                  onClick={() => onNavigate('contact')}
                >
                  Contact Us
                </button>
                <button
                  className="btn-enquiry-secondary"
                  onClick={() => onNavigate('contact')}
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

