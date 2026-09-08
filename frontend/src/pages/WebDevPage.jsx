import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

const WEB_SOLUTIONS = [
  {
    id: 'mern-stack',
    title: 'MERN Stack Architecture',
    category: 'Frontend & UI/UX',
    badge: 'Flagship Architecture',
    icon: '🌐',
    color: '#15BCDF',
    description: 'Complete end-to-end applications built on MongoDB, Express.js, React 19, and Node.js with component-driven state architecture, JWT authentication, and zero-latency client rendering.',
    highlights: [
      'React 19 with Concurrent Rendering & Suspense',
      'Express.js High-Throughput RESTful Controller Layers',
      'MongoDB Document Data Modeling & Index Optimization',
      'Role-Based Access Control (RBAC) & Secure JWT Auth',
      'Reusable Atomic UI Components & Dynamic Micro-interactions',
      'State Management via Zustand & React Context',
    ],
    technologies: ['React 19', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Zustand'],
    metrics: '< 80ms Response Time',
    deliverables: 'Production-ready full-stack repo, API docs, database schemas, and deployment script.',
  },
  {
    id: 'nextjs-frontends',
    title: 'Next.js 15 & High-Performance Frontends',
    category: 'Frontend & UI/UX',
    badge: 'Ultra-Fast Performance',
    icon: '⚡',
    color: '#0a84ff',
    description: 'Server-side rendering (SSR), Incremental Static Regeneration (ISR), dynamic streaming routes, and Core Web Vitals optimization achieving near 100% Google Lighthouse scores.',
    highlights: [
      'Next.js 15 App Router & Server Components',
      'Edge Middleware & Dynamic Routing',
      'Incremental Static Regeneration (ISR) for instant cache',
      'Zero-Cumulative Layout Shift (CLS) & Sub-second LCP',
      'TypeScript strict typing & lint automation',
      'Mobile-first responsive layout with fluid typography',
    ],
    technologies: ['Next.js 15', 'TypeScript', 'Vite', 'TailwindCSS', 'Framer Motion'],
    metrics: '100% Lighthouse Score',
    deliverables: 'SEO-optimized frontend codebase, responsive layout matrix, and edge deployment configuration.',
  },
  {
    id: 'backend-apis',
    title: 'High-Throughput APIs & Microservices',
    category: 'Backend & APIs',
    badge: 'Scalable Systems',
    icon: '🛡️',
    color: '#30d158',
    description: 'RESTful and GraphQL endpoints engineered for high concurrency, schema validation, rate-limiting, and microservice decoupling using Node.js and Python FastAPI.',
    highlights: [
      'RESTful & GraphQL API Specifications (OpenAPI 3.0)',
      'Python FastAPI & Node.js Async Microservice Daemons',
      'PostgreSQL Relational Storage & Connection Pooling',
      'Rate Limiting, CORS Hardening & DDoS Mitigation',
      'Automated API Contract Testing with Postman & Jest',
      'Distributed Caching Layers using Redis',
    ],
    technologies: ['REST / GraphQL', 'PostgreSQL', 'FastAPI', 'Node.js', 'Redis', 'Docker'],
    metrics: '10,000+ Req/Sec Capacity',
    deliverables: 'Microservice services, Swagger / OpenAPI interactive documentation, and database migration scripts.',
  },
  {
    id: 'cloud-devops',
    title: 'Cloud Infrastructure, DevOps & Hosting',
    category: 'Cloud & DevOps',
    badge: 'Production Grade',
    icon: '☁️',
    color: '#ff9f0a',
    description: 'Production deployments on AWS Cloud (EC2, S3, CloudFront) and Hostinger VPS with Docker containerization, automated GitHub Actions CI/CD, SSL encryption, and 99.9% uptime SLA.',
    highlights: [
      'AWS EC2, S3 & CloudFront Global CDN Acceleration',
      'Hostinger VPS Tuning, NGINX Reverse Proxy & SSL',
      'Docker Multi-Stage Containerization & Compose Stacks',
      'GitHub Actions CI/CD Automated Build & Test Pipelines',
      'Automated SSL Certbot Renewal & Firewall Hardening',
      'Automated Daily Database Backups & Health Probes',
    ],
    technologies: ['AWS Cloud', 'Hostinger VPS', 'NGINX', 'Docker', 'GitHub Actions', 'Linux'],
    metrics: '99.99% Uptime SLA',
    deliverables: 'Docker Compose recipes, CI/CD workflow YAMLs, server provisioning scripts, and SSL setup.',
  },
  {
    id: 'realtime-telemetry',
    title: 'Real-Time Telemetry & WebSockets',
    category: 'Databases & Real-Time',
    badge: 'Low-Latency Sync',
    icon: '📡',
    color: '#bf5af2',
    description: 'Bi-directional WebSockets and Redis pub/sub brokering for live sensor streaming, IoT device monitoring, live user collaborations, and low-latency state synchronization.',
    highlights: [
      'Bi-directional Socket.io & Native WebSockets Engine',
      'Redis Pub/Sub Event Brokering across distributed nodes',
      'Robotics & IoT Sensor Telemetry Live Streaming Dashboards',
      'Sub-20ms WebSocket round-trip transmission latency',
      'Connection Reconnect Heartbeats & State Re-sync',
      'Real-time Charting with Canvas & SVG Acceleration',
    ],
    technologies: ['WebSockets', 'Redis Pub/Sub', 'Socket.io', 'IoT Telemetry', 'TimeSeries DB'],
    metrics: '< 20ms Frame Latency',
    deliverables: 'WebSocket server gateway, real-time client adapter, and telemetry charting widgets.',
  },
  {
    id: 'interactive-3d-web',
    title: 'Interactive 3D Web & Canvas Visualizers',
    category: '3D & WebGL',
    badge: 'Immersive Experiences',
    icon: '🔮',
    color: '#ff375f',
    description: 'GPU-accelerated WebGL visuals, Three.js kinetic scenes, custom canvas animations, and interactive 3D product visualizers that captivate audiences with buttery 60 FPS motion.',
    highlights: [
      'Three.js 3D Mesh Rendering & Orbit Controls',
      'Custom WebGL Fragment & Vertex Shaders',
      'Dynamic Lighting, Ambient Occlusion & Bloom Effects',
      'Responsive Canvas Auto-scaling & High-DPI Support',
      'Kinetic Hardware Simulation & Interactive Product Demos',
      'Smooth Scroll-Linked Camera Choreography',
    ],
    technologies: ['Three.js', 'WebGL', 'Canvas API', 'GLSL Shaders', 'Web Audio API'],
    metrics: '60+ FPS Hardware Acceleration',
    deliverables: 'Interactive 3D scene modules, asset loaders, fallback CSS states, and touch gesture controls.',
  },
];

const CATEGORIES = [
  'All Solutions',
  'Frontend & UI/UX',
  'Backend & APIs',
  'Cloud & DevOps',
  'Databases & Real-Time',
  '3D & WebGL',
];

const LIVE_PROJECTS = [
  {
    id: 'chilika-ev',
    title: 'Chilika EV',
    category: 'EV & Mobility',
    icon: '🚗',
    url: 'https://chilikaev.ionode.cloud',
    description: 'Comprehensive electric vehicle telemetry and fleet management platform engineered with live battery state-of-charge tracking, intelligent route range estimation, regenerative braking diagnostics, and real-time charging station reservation architecture.',
    tags: ['React', 'Node.js', 'MongoDB', 'IoT'],
  },
  {
    id: 'smart-campus',
    title: 'Smart Campus Assist',
    category: 'EdTech & Campus',
    icon: '🎓',
    url: 'https://smartcampus-assist.ionode.cloud/',
    description: 'Interactive institutional portal featuring centralized student query resolution, AI-powered campus navigation assistance, automated laboratory equipment booking, event scheduling notifications, and secure multi-department academic records communication pipelines.',
    tags: ['MERN Stack', 'REST API', 'WebSockets'],
  },
  {
    id: 'water-dispenser',
    title: 'Water Dispension',
    category: 'IoT & Automation',
    icon: '💧',
    url: 'https://water-dispenser.ionode.cloud/',
    description: 'Automated contactless water dispensing ecosystem integrating cloud telemetry, ultrasonic fluid reservoir monitoring, precise volume rationing protocols, automated filtration health indicators, and scheduled UV sterilization status alerts for campuses.',
    tags: ['IoT', 'React', 'Node.js', 'MQTT'],
  },
  {
    id: 'air-quality',
    title: 'Air Quality Monitor',
    category: 'Environmental IoT',
    icon: '🌬️',
    url: 'https://aqi-bput.ionode.cloud/',
    description: 'Live atmospheric sensing system tracking particulate matter PM2.5, PM10, carbon emissions, humidity, and temperature with high-frequency WebSocket updates, historical pollution heatmaps, and automated environmental hazard alerts.',
    tags: ['AQI Sensors', 'Real-Time', 'WebSockets', 'Charts'],
  },
  {
    id: 'solar-efficiency',
    title: 'Solar Efficiency Monitoring',
    category: 'Energy & Solar Tech',
    icon: '☀️',
    url: 'https://solar-monitoring.ionode.cloud/',
    description: 'Industrial photovoltaic analytics dashboard delivering live solar irradiance tracking, inverter power output graphs, automated panel thermal loss alerts, peak hour generation forecasting, and predictive maintenance performance analytics.',
    tags: ['Solar IoT', 'Telemetry', 'Node.js', 'Dashboard'],
  },
  {
    id: 'conveyor-belt',
    title: 'Conveyor Belt Breakdown System',
    category: 'Industrial Automation',
    icon: '⚙️',
    url: 'https://conveyerbelt.ionode.cloud/',
    description: 'Predictive industrial failure detection portal featuring continuous motor vibration telemetry, acoustic anomaly recognition, automated emergency belt stop triggers, and proactive maintenance scheduling to prevent costly manufacturing downtimes.',
    tags: ['Predictive Maintenance', 'ML', 'IoT', 'Alerts'],
  },
  {
    id: 'train-ticket',
    title: 'Train Ticket Booking',
    category: 'Transport & Booking',
    icon: '🚆',
    url: 'https://train-ticket-booking.ionode.cloud/',
    description: 'High-throughput railway reservation system built with real-time seat availability matrices, automated PNR status tracking, dynamic fare calculation engines, secure payment processing, and instant digital e-ticket generation pipelines.',
    tags: ['Full-Stack', 'PostgreSQL', 'React', 'REST API'],
  },
  {
    id: 'solar-cleaning-robot',
    title: 'Solar Cleaning Robot',
    category: 'Robotics & Solar',
    icon: '🤖',
    url: 'https://solar-cleaning-kit.ionode.cloud/',
    description: 'Robotic cleaning kit command interface orchestrating autonomous panel traversal, dry microfiber dust brushing, real-time battery voltage monitoring, remote emergency overrides, and clean surface efficiency verification logs.',
    tags: ['Robotics', 'IoT', 'React', 'Node.js'],
  },
  {
    id: 'bus-tracking',
    title: 'Bus Tracking System',
    category: 'Smart Transport',
    icon: '🚌',
    url: 'https://livebustrack.ionode.cloud/',
    description: 'Real-time municipal fleet tracking architecture featuring live GPS coordinates streaming, route progression indicators, estimated arrival time countdowns, passenger congestion heatmaps, and instant transit disruption alerts for commuters.',
    tags: ['GPS Tracking', 'WebSockets', 'Maps API', 'Live Data'],
  },
];

function WebSolutionModal({ solution, onClose, onNavigate }) {
  useEffect(() => {
    if (!solution) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = orig;
    };
  }, [solution, onClose]);

  if (!solution) return null;

  const modalEl = (
    <div
      className="course-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="web-sol-modal-title"
    >
      <div
        className="course-modal-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ '--modal-accent': solution.color }}
      >
        <button
          className="course-modal-close"
          onClick={onClose}
          aria-label="Close details modal"
        >
          ✕
        </button>

        <div className="course-modal-header">
          <div className="course-modal-icon-wrap" style={{ borderColor: solution.color }}>
            <span className="course-modal-icon">{solution.icon}</span>
          </div>
          <div>
            <div className="course-modal-badges">
              <span className="course-modal-pill">{solution.category}</span>
              <span className="course-modal-pill duration" style={{ color: solution.color, borderColor: solution.color }}>
                {solution.metrics}
              </span>
              <span className="course-modal-pill track">{solution.badge}</span>
            </div>
            <h2 className="course-modal-title" id="web-sol-modal-title">
              {solution.title}
            </h2>
          </div>
        </div>

        <p className="course-modal-desc">{solution.description}</p>

        <div className="course-modal-section">
          <h3 className="course-modal-subtitle">Architectural Highlights &amp; Capabilities</h3>
          <ul className="course-modal-highlights">
            {solution.highlights.map((item, idx) => (
              <li key={idx}>
                <span className="highlight-bullet">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="course-modal-section">
          <h3 className="course-modal-subtitle">Tech Stack &amp; Frameworks</h3>
          <div className="modal-tech-pills">
            {solution.technologies.map((t) => (
              <span key={t} className="tech-pill-item">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="course-modal-section" style={{ background: 'rgba(21, 188, 223, 0.04)', padding: '14px 18px', borderRadius: '8px', border: '1px solid rgba(21, 188, 223, 0.15)' }}>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#15BCDF', marginBottom: '4px', fontWeight: 700 }}>
            Production Deliverables
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary, #6b7280)', margin: 0 }}>
            {solution.deliverables}
          </p>
        </div>

        <div className="course-modal-actions" style={{ marginTop: '24px' }}>
          <button
            className="btn-primary"
            onClick={() => {
              onClose();
              if (onNavigate) {
                onNavigate('contact', {
                  enquiryType: 'Web Architecture Consultation',
                  domain: 'Web Development',
                  sourceTab: 'Web Development',
                  message: `I am interested in discussing and implementing a web architecture project (${solution.title}).`,
                });
              }
            }}
          >
            <span>Inquire About This Architecture</span>
            <span className="btn-arrow">→</span>
          </button>

        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalEl, document.body) : null;
}

export default function WebDevPage({ onNavigate, onOpenOs }) {
  const [activeCategory, setActiveCategory] = useState('All Solutions');
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [previewError, setPreviewError] = useState({});
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const solutionsRef = useRef(null);
  const solutionsScrollRef = useRef(null);
  const pauseTimeoutRef = useRef(null);
  const isPausedRef = useRef(false);
  isPausedRef.current = isAutoScrollPaused;
  const projectsRef = useRef(null);

  const filteredSolutions = activeCategory === 'All Solutions'
    ? WEB_SOLUTIONS
    : WEB_SOLUTIONS.filter((s) => s.category === activeCategory);

  const repeatCount = 4;
  const streamSolutions = useMemo(() => {
    const items = [];
    for (let r = 0; r < repeatCount; r++) {
      WEB_SOLUTIONS.forEach((sol) => {
        items.push({
          ...sol,
          _streamKey: `${sol.id}-rep-${r}`,
        });
      });
    }
    return items;
  }, []);

  // Smooth continuous auto-scrolling
  useEffect(() => {
    const container = solutionsScrollRef.current;
    if (!container) return;

    let animationFrameId;
    let lastTimestamp = null;
    const speed = 36; // px per second

    const initSetW = container.scrollWidth / repeatCount;
    if (container.scrollLeft === 0 && initSetW > 0) {
      container.scrollLeft = initSetW;
    }

    const step = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (!isPausedRef.current && container) {
        const currentSetW = container.scrollWidth / repeatCount;
        if (currentSetW > 0) {
          if (container.scrollLeft === 0) {
            container.scrollLeft = currentSetW;
          }

          container.scrollLeft += speed * Math.min(elapsed, 0.1);

          // Wrap seamlessly forward
          if (container.scrollLeft >= currentSetW * (repeatCount - 1)) {
            container.scrollLeft -= currentSetW;
          } else if (container.scrollLeft <= 10) {
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
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [repeatCount]);

  // Wrap-around on manual drag/touch/wheel scroll
  const handleContainerScroll = () => {
    const container = solutionsScrollRef.current;
    if (!container) return;
    const currentSetW = container.scrollWidth / repeatCount;
    if (currentSetW > 0) {
      if (container.scrollLeft >= currentSetW * (repeatCount - 1)) {
        container.scrollLeft -= currentSetW;
      } else if (container.scrollLeft <= 10) {
        container.scrollLeft += currentSetW;
      }
    }
  };

  const temporarilyPause = () => {
    setIsAutoScrollPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsAutoScrollPaused(false);
    }, 4000);
  };

  const handleScrollLeft = () => {
    temporarilyPause();
    if (solutionsScrollRef.current) {
      // 360px card + 24px gap = 384px
      solutionsScrollRef.current.scrollBy({ left: -384, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    temporarilyPause();
    if (solutionsScrollRef.current) {
      solutionsScrollRef.current.scrollBy({ left: 384, behavior: 'smooth' });
    }
  };

  const scrollToSolutions = () => {
    if (solutionsRef.current) {
      solutionsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleIframeError = (id) => {
    setPreviewError((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="web-dev-page-wrapper">
      {/* ================================================================
          SECTION 1: HERO & ANIMATION SHOWCASE
          ================================================================ */}
      <section className="web-dev-hero-section" id="web-hero">
        <div className="web-dev-hero-glow" />
        <div className="container-fluid web-dev-hero-container">
          <div className="web-dev-hero-grid">
            <div className="web-dev-hero-content">
              <h1 className="web-dev-hero-title">
                Architecting High-Speed, <br />
                <span className="accent-text-cyan">Interactive &amp; Modern Web Experiences</span>
              </h1>
              <div className="web-dev-hero-paragraphs">
                <p className="web-dev-lead-text">
                  We engineer resilient, scalable, and highly interactive enterprise-grade digital web platforms.
                  Bridging responsive modern frontend architectures with high-throughput backend
                  microservices, real-time WebSocket telemetry, and resilient cloud deployments.
                </p>
                <p className="web-dev-sub-text">
                  From interactive, reactive single-page applications built on React 19 and Next.js 15 to
                  robust Node.js/Python APIs and automated DevOps pipelines hosted on AWS and
                  Hostinger, we build the kinetic, interactive layer between silicon and intelligence.
                </p>
              </div>
              <div className="web-dev-tech-row">
                <span className="tech-badge">INTERACTIVE UI/UX</span>
                <span className="tech-badge">MERN STACK</span>
                <span className="tech-badge">REACT 19</span>
                <span className="tech-badge">NEXT.JS 15</span>
                <span className="tech-badge">NODE.JS</span>
                <span className="tech-badge">AWS CLOUD</span>
                <span className="tech-badge">HOSTINGER</span>
                <span className="tech-badge">DEVOPS CI/CD</span>
              </div>
              <div className="web-dev-hero-actions">
                <button
                  className="btn-primary"
                  onClick={() => onNavigate?.('contact', {
                    enquiryType: 'Web Architecture Consultation',
                    domain: 'Web Development',
                    sourceTab: 'Web Development',
                    message: 'I would like to start a custom web development and cloud architecture project.',
                  })}
                >
                  <span>Start a Web Project</span>
                  <span className="btn-arrow">→</span>
                </button>
                <button className="btn-secondary" onClick={scrollToSolutions}>
                  <span>Explore Capabilities</span>
                  <span className="btn-arrow">↓</span>
                </button>

                {onOpenOs && (
                  <button className="os-window-header-pill" onClick={onOpenOs}>
                    <span>Virtual Lab</span>
                    <span className="os-pill-action">RoboLab</span>
                  </button>
                )}
              </div>
            </div>
            <div className="web-dev-hero-visual">
              <div className="web-dev-frame-container">
                <div className="web-video-frame">
                  <img
                    src="/web-animation.webp"
                    alt="RoboLab Web Development Motion Visualizer"
                    className="web-video-element"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 2: FULL-STACK WEB SOLUTIONS & ARCHITECTURES
          ================================================================ */}
      <section ref={solutionsRef} className="web-dev-solutions-section" id="web-solutions">
        <div className="container-fluid web-dev-solutions-container">
          <div className="section-header-center">
            <h2 className="section-heading-lg">
              End-to-End <span>Web Development Capabilities</span>
            </h2>
            <p className="section-desc-center">
              From reactive client interfaces to mission-critical backend infrastructures, explore our full-stack engineering specializations tailored for modern applications.
            </p>
          </div>


          {/* Auto-Scrolling Solutions Stream with Left & Right Navigation Buttons */}
          <div
            className="web-solutions-stream-wrapper"
            onMouseEnter={() => setIsAutoScrollPaused(true)}
            onMouseLeave={() => setIsAutoScrollPaused(false)}
            onTouchStart={() => setIsAutoScrollPaused(true)}
            onTouchEnd={() => setIsAutoScrollPaused(false)}
          >
            {/* Left Button */}
            <button
              className="web-carousel-btn web-carousel-left"
              onClick={handleScrollLeft}
              aria-label="Scroll left"
              title="Previous capabilities"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Right Button */}
            <button
              className="web-carousel-btn web-carousel-right"
              onClick={handleScrollRight}
              aria-label="Scroll right"
              title="Next capabilities"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Scrollable Viewport */}
            <div
              className="web-solutions-viewport"
              ref={solutionsScrollRef}
              onScroll={handleContainerScroll}
            >
              <div className="web-solutions-track">
                {streamSolutions.map((sol) => (
                  <div
                    key={sol._streamKey}
                    className="web-solution-card"
                    onClick={() => setSelectedSolution(sol)}
                    style={{ '--card-accent': sol.color }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedSolution(sol);
                      }
                    }}
                  >
                    <div className="solution-card-top">
                      <div className="solution-icon-wrap" style={{ borderColor: sol.color }}>
                        <span className="solution-icon">{sol.icon}</span>
                      </div>
                      <span className="solution-metric-badge">{sol.metrics}</span>
                    </div>
                    <div className="solution-card-body">
                      <span className="solution-track-tag">{sol.badge}</span>
                      <h3 className="solution-card-title">{sol.title}</h3>
                      <p className="solution-card-desc">{sol.description}</p>
                    </div>
                    <div className="solution-card-tags">
                      {sol.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="mini-tech-tag">{tech}</span>
                      ))}
                      {sol.technologies.length > 4 && (
                        <span className="mini-tech-tag more">+{sol.technologies.length - 4}</span>
                      )}
                    </div>
                    <div className="solution-card-footer">
                      <button
                        className="solution-action-btn"
                        onClick={(e) => { e.stopPropagation(); setSelectedSolution(sol); }}
                        aria-label={`Explore solution ${sol.title}`}
                      >
                        <span>View Architecture</span>
                        <span className="arrow">→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* ================================================================
          SECTION 3: LIVE PROJECTS — DEPLOYED & PRODUCTION READY
          ================================================================ */}
      <section ref={projectsRef} className="web-live-projects-section" id="live-projects">
        <div className="container-fluid web-live-projects-container">
          <div className="section-header-center">
            <h2 className="section-heading-lg">
              Projects with <span className="accent-text-cyan">Live Preview</span>
            </h2>
            <p className="section-desc-center">
              Real-world deployed applications — click <strong>⊞ Preview</strong> to see it inline, or <strong>Open ↗</strong> to visit the live site.
            </p>
          </div>

          <div className="live-projects-grid">
            {LIVE_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                className={`live-project-card${selectedProject === proj.id ? ' expanded' : ''}`}
              >
                {/* Card Header */}
                <div className="lp-card-header">
                  <div className="lp-card-meta">
                    <span className="lp-card-icon">{proj.icon}</span>
                    <div>
                      <h3 className="lp-card-title">{proj.title}</h3>
                      <span className="lp-card-category">{proj.category}</span>
                    </div>
                  </div>
                  <div className="lp-card-actions">
                    <button
                      className={`lp-preview-btn${selectedProject === proj.id ? ' is-active' : ''}`}
                      onClick={() =>
                        setSelectedProject(selectedProject === proj.id ? null : proj.id)
                      }
                      title={selectedProject === proj.id ? 'Close preview' : 'Open live preview'}
                    >
                      {selectedProject === proj.id ? '✕ Close' : '⊞ Preview'}
                    </button>
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lp-open-btn"
                      title={`Open ${proj.title} in new tab`}
                    >
                      Open ↗
                    </a>
                  </div>
                </div>

                {/* Project Description */}
                <div className="lp-card-body">
                  <p className="lp-card-desc">{proj.description}</p>
                </div>
                {selectedProject === proj.id && (
                  <div className="lp-iframe-wrap">
                    <div className="lp-iframe-bar">
                      <div className="lp-iframe-bar-left">
                        <span className="lp-bar-dot red" />
                        <span className="lp-bar-dot yellow" />
                        <span className="lp-bar-dot green" />
                        <span className="lp-iframe-bar-url">🔒 {new URL(proj.url).hostname}</span>
                      </div>
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lp-iframe-bar-link"
                      >
                        Open site in new tab ↗
                      </a>
                    </div>
                    {previewError[proj.id] ? (
                      <div className="lp-iframe-fallback">
                        <div className="lp-fallback-icon">🔒</div>
                        <p>This site prevents embedded preview.</p>
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lp-open-btn"
                        >
                          Open Live Site ↗
                        </a>
                      </div>
                    ) : (
                      <iframe
                        src={proj.url}
                        title={proj.title}
                        className="lp-iframe"
                        loading="lazy"
                        onError={() => handleIframeError(proj.id)}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      />
                    )}
                  </div>
                )}

                {/* Card Footer */}
                <div className="lp-card-footer">
                  <div className="lp-tags">
                    {proj.tags.map((t) => (
                      <span key={t} className="mini-tech-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Conversion CTA Card */}
          <div className="web-conversion-card">
            <div className="web-conversion-content">
              <span className="conversion-badge">READY TO LAUNCH</span>
              <h3 className="conversion-title">Ready to Build or Scale Your Web Platform?</h3>
              <p className="conversion-desc">
                Discuss your system architecture, custom API requirements, and deployment stack with our technical team. We engineer tailored web solutions from concept to live production.
              </p>
            </div>
            <div className="web-conversion-actions">
              <button
                className="btn-primary-large"
                onClick={() => onNavigate?.('contact', {
                  enquiryType: 'Web Architecture Consultation',
                  domain: 'Web Development',
                  sourceTab: 'Web Development',
                  message: 'Requesting technical consultation for web platform architecture, APIs, and cloud deployment.',
                })}
              >
                <span>Initiate Web Project Consultation</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedSolution && (
        <WebSolutionModal
          solution={selectedSolution}
          onClose={() => setSelectedSolution(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
