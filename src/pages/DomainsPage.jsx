import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { domainCategories, domainProjects } from '../data/domainProjects.js';

function ProjectDetailsModal({ project, onClose, onNavigate }) {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [project, onClose]);

  if (!project) return null;

  const handleInquireClick = () => {
    onClose();
    if (onNavigate) {
      onNavigate('contact');
    }
  };

  const modalElement = (
    <div
      className="project-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        className="project-modal-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ '--project-accent': project.accentColor || '#0a84ff' }}
      >
        {/* Modal Close Button */}
        <button
          className="project-modal-close"
          onClick={onClose}
          aria-label="Close project details modal"
        >
          ✕
        </button>

        {/* Modal Header Banner */}
        <div className="project-modal-hero-banner">
          <div className="pm-hero-bg-glow" />
          <div className="pm-hero-top-row">
            <span className="pm-number-pill">PROJECT {project.number}</span>
            <span className="pm-domain-pill">{project.domainName}</span>
          </div>
          <div className="pm-hero-title-row">
            <div className="pm-icon-wrap">
              <span className="pm-icon">{project.icon}</span>
            </div>
            <div>
              <h2 className="pm-title" id="project-modal-title">
                {project.title}
              </h2>
              <p className="pm-subtitle">{project.description}</p>
            </div>
          </div>
        </div>

        {/* Modal Body Scroll Content */}
        <div className="project-modal-content">
          {/* 1. Project Overview */}
          <div className="pm-section">
            <h3 className="pm-section-title">
              <span className="pm-sec-icon">📋</span> Project Overview
            </h3>
            <p className="pm-section-text">{project.overview}</p>
          </div>

          {/* 2. Problem Statement */}
          <div className="pm-section">
            <h3 className="pm-section-title">
              <span className="pm-sec-icon">⚠️</span> Problem Statement
            </h3>
            <div className="pm-callout-box">
              <p>{project.problemStatement}</p>
            </div>
          </div>

          {/* 3. Key Features */}
          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <div className="pm-section">
              <h3 className="pm-section-title">
                <span className="pm-sec-icon">⚡</span> Key Features & Capabilities
              </h3>
              <ul className="pm-features-list">
                {project.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="pm-feature-item">
                    <span className="pm-check-bullet">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. Technologies Used */}
          <div className="pm-section">
            <h3 className="pm-section-title">
              <span className="pm-sec-icon">🛠️</span> Technologies & Toolchain
            </h3>
            <div className="pm-tech-tags-wrap">
              {project.technologies?.map((tech, idx) => (
                <span key={idx} className="pm-tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* 5. How It Works */}
          {project.howItWorks && project.howItWorks.length > 0 && (
            <div className="pm-section">
              <h3 className="pm-section-title">
                <span className="pm-sec-icon">🔄</span> How It Works
              </h3>
              <div className="pm-steps-container">
                {project.howItWorks.map((step, idx) => (
                  <div key={idx} className="pm-step-item">
                    <div className="pm-step-num">{idx + 1}</div>
                    <div className="pm-step-text">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Benefits & Future Roadmap */}
          <div className="pm-two-col-grid">
            <div className="pm-col-card">
              <h4 className="pm-col-title">
                <span className="pm-mini-icon">🌟</span> Impact & Benefits
              </h4>
              <p className="pm-col-text">{project.benefits}</p>
            </div>
            <div className="pm-col-card">
              <h4 className="pm-col-title">
                <span className="pm-mini-icon">🚀</span> Future Improvements
              </h4>
              <p className="pm-col-text">{project.futureImprovements}</p>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="project-modal-footer">
          <button className="btn-primary pm-action-btn" onClick={handleInquireClick}>
            <span>Inquire / Build This Project</span>
            <span className="arrow">→</span>
          </button>
          <button className="btn-secondary pm-back-btn" onClick={onClose}>
            Back to Projects
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalElement, document.body)
    : modalElement;
}

const BRAIN_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_132049_036591b8-6e92-4760-b94c-a7ea6eef315c.mp4';

export default function DomainsPage({ onNavigate }) {
  const [activeDomain, setActiveDomain] = useState('iot');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  // 3-Card Auto-Scroll Carousel State (Right Side)
  const [cardIndex, setCardIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll the 3 cards one by one
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCardIndex((prev) => (prev + 1) % domainCategories.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Current domain metadata
  const currentCategory = useMemo(() => {
    return domainCategories.find((c) => c.id === activeDomain) || domainCategories[0];
  }, [activeDomain]);

  // Filter projects by currently active domain and search query
  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return domainProjects.filter((p) => {
      const matchDomain = p.domain === activeDomain;
      if (!matchDomain) return false;
      if (!q) return true;
      const inTitle = p.title.toLowerCase().includes(q);
      const inDesc = p.description.toLowerCase().includes(q);
      const inTech = p.technologies.some((t) => t.toLowerCase().includes(q));
      const inOverview = p.overview?.toLowerCase().includes(q);
      return inTitle || inDesc || inTech || inOverview;
    });
  }, [activeDomain, searchQuery]);

  // Calculated dynamic statistics
  const totalProjects = domainProjects.length;
  const totalDomains = domainCategories.length;
  const projectsPerDomain = Math.round(totalProjects / totalDomains);

  return (
    <div className="page-container page-enter domains-page-wrapper">
      {/* 1. DOMAIN HERO HEADER (FULL-WIDTH 3D NEURAL BRAIN BACKGROUND VIDEO) */}
      <section className="domain-hero-section" id="domain-hero">
        {/* Full-width Brain Video Background Layer (Like Home Tab) */}
        <div className="domain-video-layer">
          <div className="domain-video-wrapper">
            <video
              id="domainBgBrainVideo"
              className="domain-bg-video"
              src={BRAIN_VIDEO}
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
          <div className="domain-video-overlay" />
        </div>

        <div className="container-fluid domain-hero-container">
          <div className="domain-hero-split-grid">
            {/* Left Column: Text Content (Left Aligned) */}
            <div className="domain-hero-left">

              <h1 className="domain-hero-title">
                Explore Our <span>Domains</span>
              </h1>

              <p className="domain-hero-desc">
                At Robogenesis, we focus on developing practical and industry-relevant skills across multiple technology domains, including <strong>IoT, Artificial Intelligence & Machine Learning, and Web Development</strong>. Our project-based learning approach allows students to transform their theoretical knowledge into real-world applications through hands-on projects such as Smart Helmet, Smart Home Automation, Smart Agriculture Monitoring, Face Recognition, AI Chatbots, E-Commerce Platforms, Learning Management Systems, and more. By working with modern technologies, tools, and development frameworks, students gain valuable experience in problem-solving, innovation, programming, and system development, preparing them for successful careers in the rapidly evolving technology industry.
              </p>

              <div className="domain-hero-highlights">
                <button
                  className={`dhh-item${activeDomain === 'iot' ? ' active' : ''}`}
                  onClick={() => {
                    setActiveDomain('iot');
                    setCardIndex(0);
                  }}
                >
                  <span className="dhh-bullet">📡</span>
                  <span>Internet of Things</span>
                </button>
                <button
                  className={`dhh-item${activeDomain === 'aiml' ? ' active' : ''}`}
                  onClick={() => {
                    setActiveDomain('aiml');
                    setCardIndex(1);
                  }}
                >
                  <span className="dhh-bullet">🧠</span>
                  <span>AI & Machine Learning</span>
                </button>
                <button
                  className={`dhh-item${activeDomain === 'web-development' ? ' active' : ''}`}
                  onClick={() => {
                    setActiveDomain('web-development');
                    setCardIndex(2);
                  }}
                >
                  <span className="dhh-bullet">💻</span>
                  <span>Modern Web Development</span>
                </button>
              </div>
            </div>

            {/* Right Column: 3-Card Auto-Scrolling Carousel */}
            <div
              className="domain-hero-right"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="domain-carousel-wrapper">
                <div className="carousel-top-bar">
                  <div className="carousel-status-pill">
                    <span className="carousel-pulse-dot" />
                    <span>Domain Track {cardIndex + 1} of 3</span>
                  </div>
                  <div className="carousel-arrows">
                    <button
                      className="carousel-arrow-btn"
                      onClick={() => setCardIndex((prev) => (prev - 1 + domainCategories.length) % domainCategories.length)}
                      aria-label="Previous domain card"
                    >
                      ‹
                    </button>
                    <button
                      className="carousel-arrow-btn"
                      onClick={() => setCardIndex((prev) => (prev + 1) % domainCategories.length)}
                      aria-label="Next domain card"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <div className="carousel-viewport">
                  <div
                    className="carousel-track"
                    style={{ transform: `translateX(-${cardIndex * 100}%)` }}
                  >
                    {domainCategories.map((cat, idx) => {
                      const isActive = activeDomain === cat.id;
                      const count = domainProjects.filter((p) => p.domain === cat.id).length;
                      return (
                        <div
                          key={cat.id}
                          className="carousel-slide"
                          onClick={() => {
                            setActiveDomain(cat.id);
                            setCardIndex(idx);
                          }}
                        >
                          <div
                            className={`domain-feature-card carousel-card${isActive ? ' active' : ''}`}
                            style={{ '--domain-accent': cat.accentColor }}
                          >
                            <div className="dfc-header">
                              <div className="dfc-icon-badge">{cat.icon}</div>
                              <span className="dfc-pill-badge">{count} Projects</span>
                            </div>
                            <h3 className="dfc-name">{cat.name}</h3>
                            <div className="dfc-fullname">{cat.fullName}</div>
                            <p className="dfc-desc">{cat.description}</p>
                            <div className="dfc-footer">
                              <span className="dfc-status">
                                {isActive ? '● Active Track Selected' : 'Click to Explore Projects →'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Carousel Pagination Dots */}
                <div className="carousel-dots-row">
                  {domainCategories.map((cat, idx) => (
                    <button
                      key={cat.id}
                      className={`carousel-dot${cardIndex === idx ? ' active' : ''}`}
                      style={{ '--dot-accent': cat.accentColor }}
                      onClick={() => {
                        setCardIndex(idx);
                        setActiveDomain(cat.id);
                      }}
                      aria-label={`Jump to ${cat.name}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC DOMAIN STATISTICS */}
      <section className="domain-stats-strip" id="domain-stats">
        <div className="container-fluid">
          <div className="domain-stats-grid">
            <div className="domain-stat-box">
              <div className="stat-icon-wrap" style={{ color: '#0a84ff' }}>
                🚀
              </div>
              <div>
                <div className="stat-num">{totalProjects}+</div>
                <div className="stat-label">Projects Built</div>
              </div>
            </div>

            <div className="domain-stat-box">
              <div className="stat-icon-wrap" style={{ color: '#bf5af2' }}>
                🌐
              </div>
              <div>
                <div className="stat-num">{totalDomains}</div>
                <div className="stat-label">Technology Domains</div>
              </div>
            </div>

            <div className="domain-stat-box">
              <div className="stat-icon-wrap" style={{ color: '#30d158' }}>
                🎯
              </div>
              <div>
                <div className="stat-num">{projectsPerDomain}</div>
                <div className="stat-label">Projects per Domain</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DOMAIN NAVIGATION TABS & SEARCH BAR */}
      <nav className="domain-tabs-section" id="domain-tabs" aria-label="Domain categories">
        <div className="container-fluid domain-tabs-container">
          {/* Tab Navigation: [ IoT ]   [ AI/ML ]   [ Web Development ] */}
          <div className="domain-tabs-pills" role="tablist">
            {domainCategories.map((cat) => {
              const isActive = activeDomain === cat.id;
              const count = domainProjects.filter((p) => p.domain === cat.id).length;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  data-domain={cat.id}
                  className={`domain-tab-btn${isActive ? ' active' : ''}`}
                  onClick={() => setActiveDomain(cat.id)}
                >
                  <span className="tab-icon">{cat.icon}</span>
                  <span className="tab-name">{cat.name}</span>
                  <span className="tab-count-badge">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search & Filter Bar */}
          <div className="domain-search-wrapper">
            <div className="domain-search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder={`Search in ${currentCategory.name} (e.g. Arduino, React, Python)...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={`Search ${currentCategory.name} projects`}
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Active Domain Dynamic Status */}
          <div className="domain-active-meta">
            <span className="meta-dot" style={{ background: currentCategory.accentColor }} />
            <span>
              Showing <strong>{filteredProjects.length}</strong> {currentCategory.fullName} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
            </span>
          </div>
        </div>
      </nav>

      {/* 4. PROJECTS GRID SECTION */}
      <section className="domain-projects-section" id="domain-projects">
        <div className="container-fluid">
          {/* Subheading Bar */}
          <div className="domain-subheading-bar">
            <div className="ds-title-group">
              <h3>
                <span>{currentCategory.icon}</span>
                <span>{currentCategory.fullName}</span>
              </h3>
              <p>{currentCategory.description}</p>
            </div>
          </div>

          {/* Empty Search State */}
          {filteredProjects.length === 0 && (
            <div className="domain-empty-search">
              <div className="des-icon">🔍</div>
              <h4>No matching projects found</h4>
              <p>We couldn't find any projects matching &ldquo;{searchQuery}&rdquo; in {currentCategory.fullName}.</p>
              <button
                className="btn-secondary"
                onClick={() => setSearchQuery('')}
              >
                Clear Search Filter
              </button>
            </div>
          )}

          {/* 10 Projects Grid */}
          {filteredProjects.length > 0 && (
            <div className="projects-cards-grid">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="project-card"
                  style={{ '--card-accent': project.accentColor }}
                  onClick={() => setSelectedProject(project)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedProject(project);
                    }
                  }}
                >
                  <div>
                    {/* Card Header: Number + Domain badge */}
                    <div className="project-card-header">
                      <span className="project-number-badge">PROJECT {project.number}</span>
                      <span className="project-domain-tag">{project.domainName}</span>
                    </div>

                    {/* Project Visual / Icon */}
                    <div className="project-card-visual">
                      <span>{project.icon}</span>
                    </div>

                    {/* Body Content */}
                    <div className="project-card-body">
                      <h4 className="project-card-title">{project.title}</h4>
                      <p className="project-card-desc">{project.description}</p>

                      {/* Technology Tags (3-4 displayed) */}
                      <div className="project-tech-tags">
                        {project.technologies.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="tech-tag-pill">
                            {tag}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="tech-tag-pill more">
                            +{project.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: View Project Button */}
                  <div className="project-card-footer">
                    <button
                      className="project-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      aria-label={`View details for ${project.title}`}
                    >
                      <span>View Project</span>
                      <span className="arrow">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. CONCLUDING DOMAIN CTA SECTION */}
      <section className="domain-cta-section" id="domain-cta">
        <div className="container-fluid">
          <div className="domain-cta-card">
            <div className="domain-cta-glow" />
            <div className="domain-cta-content">
              <div className="domain-cta-badge">
                <span>Hands-on Engineering</span>
              </div>
              <h2 className="domain-cta-title">
                Have a project idea? <span>Let's build it together.</span>
              </h2>
              <p className="domain-cta-desc">
                Whether you’re stepping into Drone Technology, mastering Embedded IoT, or building carrier-grade Linux and AI applications, Robogenesis provides the exact hardware, curriculum, and guidance to excel.
              </p>
            </div>

            <div className="domain-cta-actions">
              <button
                className="btn-primary"
                onClick={() => onNavigate('contact')}
              >
                Let&apos;s Build Together →
              </button>
              <button
                className="btn-secondary"
                onClick={() => onNavigate('about')}
              >
                Explore Courses
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROJECT DETAILS MODAL */}
      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
}
