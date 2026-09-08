import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  shortTermCourses,
  longTermPrograms,
  whyChooseFeatures,
} from '../data/aboutCourses.js';
import { useScrollAnimation } from '../hooks/useScrollAnimation.js';

function CourseModal({ course, onClose, onNavigate }) {
  useEffect(() => {
    if (!course) return;
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
  }, [course, onClose]);

  if (!course) return null;

  const handleEnrollClick = () => {
    onClose();
    if (onNavigate) {
      onNavigate('contact', {
        enquiryType: 'Course Enquiry',
        domain: course.category || 'Engineering Education',
        sourceTab: 'About',
        message: `I would like to enquire about enrolling in the ${course.title} (${course.level || 'Program'}) course.`,
      });
    }
  };

  const modalElement = (
    <div
      className="course-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="course-modal-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ '--modal-accent': course.color || '#0a84ff' }}
      >
        <button
          className="course-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="course-modal-header">
          <div className="course-modal-icon-wrap" style={{ borderColor: course.color }}>
            <span className="course-modal-icon">{course.icon}</span>
          </div>
          <div>
            <div className="course-modal-badges">
              <span className="course-modal-pill">{course.category}</span>
              {course.duration && (
                <span className="course-modal-pill duration">{course.duration}</span>
              )}
              <span className="course-modal-pill track">{course.badge}</span>
            </div>
            <h2 className="course-modal-title">{course.name}</h2>
          </div>
        </div>

        <p className="course-modal-desc">{course.desc}</p>

        <div className="course-modal-section">
          <h3 className="course-modal-subtitle">Curriculum & Practical Highlights</h3>
          <ul className="course-modal-highlights">
            {course.highlights?.map((item, idx) => (
              <li key={idx}>
                <span className="highlight-bullet">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="course-modal-footer-meta">
          <div className="course-modal-meta-item">
            <span className="meta-label">Prerequisites:</span>
            <span className="meta-val">{course.prerequisites}</span>
          </div>
          <div className="course-modal-meta-item">
            <span className="meta-label">Training Mode:</span>
            <span className="meta-val">Classroom + Hands-On Lab Workstation</span>
          </div>
        </div>

        <div className="course-modal-actions">
          <button className="btn-primary modal-action-btn" onClick={handleEnrollClick}>
            Enroll / Request Syllabus →
          </button>
          <button className="btn-secondary modal-close-btn" onClick={onClose}>
            Back to Programs
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalElement, document.body)
    : null;
}

const trainingAreasList = [
  'Drone Technology',
  'Embedded Systems',
  'IoT',
  'C',
  'MERN Stack',
  'Frontend Development',
  'Backend Development',
  'DevOps',
  'AWS',
  'Hostinger',
  'Python',
  'Data Structures',
  'Software Testing',
  'Automation Testing',
];

const cycleStages = [
  {
    step: '01',
    name: 'Learn',
    icon: '📚',
    desc: 'Comprehensive training and hands-on skill development across cutting-edge engineering disciplines and tools.',
  },
  {
    step: '02',
    name: 'Research',
    icon: '🔬',
    desc: 'Deep exploration of emerging technologies, hypothesis validation, architectural design, and laboratory study.',
  },
  {
    step: '03',
    name: 'Build',
    icon: '🛠️',
    desc: 'Transforming research into working prototypes, custom PCBs, autonomous algorithms, and robust firmware.',
  },
  {
    step: '04',
    name: 'Innovate',
    icon: '🚀',
    desc: 'Delivering deployable, scalable real-world solutions that create meaningful industry impact and empower learners.',
  },
];

export default function AboutPage({ onNavigate, onOpenOs }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseFilter, setCourseFilter] = useState('all'); // 'all' | 'short' | 'long'

  // Scroll reveal animation hooks
  const [vmgRef, vmgVisible] = useScrollAnimation(0.1);
  const [bridgeRef, bridgeVisible] = useScrollAnimation(0.1);
  const [edTechRef, edTechVisible] = useScrollAnimation(0.1);
  const [whyRef, whyVisible] = useScrollAnimation(0.1);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const displayedCourses =
    courseFilter === 'short'
      ? shortTermCourses
      : courseFilter === 'long'
      ? longTermPrograms
      : [...longTermPrograms, ...shortTermCourses];

  return (
    <div className="page-container page-enter about-page-wrapper">
      {/* 1. HERO SECTION: ABOUT ROBOGENESIS */}
      <section className="about-hero-section" id="welcome">
        <div className="about-hero-ambient-glow" />
        <div className="container-fluid about-hero-container">
          <div className="about-hero-grid">
            {/* Left Column: Heading, Core Mission & R&D Lead */}
            <div className="about-hero-content">

              <h1 className="about-hero-title">
                About <span className="gradient-text">Robogenesis</span>
              </h1>

              <div className="about-hero-paragraphs">
                <p className="about-lead-paragraph">
                  <strong>Robogenesis</strong> is a <strong>Research & Development-driven technology company</strong> focused on transforming innovative ideas into practical, scalable, and real-world technology solutions. We work at the intersection of <strong>research, engineering, innovation, and education</strong>, developing solutions that address emerging technological challenges and create meaningful impact.
                </p>
                <p className="about-sub-paragraph">
                  Our R&D initiatives span emerging and applied technologies, with a strong emphasis on <strong>Embedded Systems, IoT, Artificial Intelligence & Machine Learning, Robotics, Automation, Drone Technology, Software Development, and other next-generation technologies</strong>. By combining research expertise with hands-on engineering, we aim to bridge the gap between conceptual innovation and practical implementation.
                </p>
              </div>

              {/* R&D Core Domains Badges */}
              <div className="about-categories-block">
                <span className="categories-label">Core Specialization Domains:</span>
                <div className="category-badges-row">
                  {[
                    'Embedded Systems',
                    'IoT',
                    'AI & Machine Learning',
                    'Robotics',
                    'Automation',
                    'Drone Technology',
                    'Software Development',
                    'Next-Gen Tech',
                  ].map((cat, idx) => (
                    <span key={idx} className="category-pill">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Hero Actions */}
              <div className="about-hero-actions">
                <button
                  className="btn-primary"
                  onClick={() => scrollToSection('vision-mission-goal')}
                >
                  <span>Our Mission & Vision</span>
                  <span className="btn-arrow">↓</span>
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => scrollToSection('edtech-training')}
                >
                  <span>Training Programs</span>
                  <span className="btn-arrow">→</span>
                </button>
                {onOpenOs && (
                  <button className="os-window-header-pill" onClick={onOpenOs}>
                    <span>Virtual Lab</span>
                    <span className="os-pill-action">RoboLab</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Hero Visualizer (hero.html) */}
            <div className="about-hero-visual">
              <div className="about-hero-frame-container">
                <img
                  src="/hero-animation.webp"
                  alt="Autonomous Kinetics 3D Orb Visualizer — hero.html"
                  className="about-hero-media"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR MISSION, VISION & COMMITMENT SECTION (INSTITUTIONAL PILLARS) */}
      <section
        ref={vmgRef}
        className={`vmg-section ${vmgVisible ? 'reveal-visible' : 'reveal-hidden'}`}
        id="vision-mission-goal"
      >
        <div className="container-fluid vmg-container">
          <div className="section-header-center">
            <div className="section-tag-row">
              <span className="section-tag-pill">Institutional Pillars</span>
            </div>
            <h2 className="section-heading-lg">
              Our <span>Mission, Vision & Commitment</span>
            </h2>
            <p className="section-desc-center">
              The foundational principles guiding our research initiatives, technical education, and societal impact.
            </p>
          </div>

          <div className="vmg-cards-grid">
            {/* Card 1: Our Mission */}
            <div className="vmg-card mission-card">
              <div className="vmg-card-top">
                <div className="vmg-icon-wrap">
                  <span className="vmg-icon">🎯</span>
                </div>
                <span className="vmg-badge mission-badge">Core Purpose</span>
              </div>
              <h3 className="vmg-card-title">Our <span>Mission</span></h3>
              <div className="vmg-card-content">
                <p>
                  Our mission is to <strong>drive technological innovation through research, engineering, and education</strong>, while creating practical solutions and developing technology professionals capable of solving real-world challenges.
                </p>
              </div>
              <div className="vmg-card-footer">
                <div className="vmg-tags-row">
                  <span className="vmg-footer-tag">✓ Technological Innovation</span>
                  <span className="vmg-footer-tag">✓ Practical Solutions</span>
                  <span className="vmg-footer-tag">✓ Real-World Problem Solving</span>
                </div>
              </div>
            </div>

            {/* Card 2: Our Vision */}
            <div className="vmg-card vision-card">
              <div className="vmg-card-top">
                <div className="vmg-icon-wrap">
                  <span className="vmg-icon">🔭</span>
                </div>
                <span className="vmg-badge vision-badge">Technological Horizon</span>
              </div>
              <h3 className="vmg-card-title">Our <span>Vision</span></h3>
              <div className="vmg-card-content">
                <p>
                  To establish Robogenesis as a <strong>leading technology innovation and R&D ecosystem</strong>, recognized for developing impactful solutions, advancing emerging technologies, and empowering the next generation of engineers, innovators, and technology professionals.
                </p>
              </div>
              <div className="vmg-card-footer">
                <div className="vmg-tags-row">
                  <span className="vmg-footer-tag">✓ Leading R&D Ecosystem</span>
                  <span className="vmg-footer-tag">✓ Emerging Tech Leadership</span>
                  <span className="vmg-footer-tag">✓ Empowering Innovators</span>
                </div>
              </div>
            </div>

            {/* Card 3: Our Commitment */}
            <div className="vmg-card commitment-card">
              <div className="vmg-card-top">
                <div className="vmg-icon-wrap">
                  <span className="vmg-icon">💎</span>
                </div>
                <span className="vmg-badge commitment-badge">Our Pledge</span>
              </div>
              <h3 className="vmg-card-title">Our <span>Commitment</span></h3>
              <div className="vmg-card-content">
                <p>
                  At Robogenesis, we are committed to building a culture of <strong>innovation, continuous learning, research excellence, and practical engineering</strong>. Whether it is developing a new technology solution or enabling an individual to build advanced technical skills, our goal remains the same — <strong>to transform ideas into innovation and innovation into real-world impact.</strong>
                </p>
              </div>
              <div className="vmg-card-footer">
                <div className="vmg-tags-row">
                  <span className="vmg-footer-tag">✓ Culture of Innovation</span>
                  <span className="vmg-footer-tag">✓ Research Excellence</span>
                  <span className="vmg-footer-tag">✓ Real-World Impact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BRIDGING RESEARCH, INNOVATION & EDUCATION SECTION */}
      <section
        ref={bridgeRef}
        className={`bridge-ecosystem-section ${bridgeVisible ? 'reveal-visible' : 'reveal-hidden'}`}
        id="bridging-ecosystem"
      >
        <div className="container-fluid">
          <div className="section-header-center">
            <div className="section-tag-row">
              <span className="section-tag-pill">Integrated Innovation Ecosystem</span>
            </div>
            <h2 className="section-heading-lg">
              Bridging Research, <span>Innovation & Education</span>
            </h2>
            <p className="section-desc-center">
              Robogenesis is built around a unique ecosystem where <strong>R&D and education work together</strong>. Our research and development activities provide practical exposure to emerging technologies, while our EdTech programs enable learners to gain the knowledge and hands-on experience required to work with those technologies.
            </p>
          </div>

          {/* 4-Step Cycle Flow: Learn → Research → Build → Innovate */}
          <div className="cycle-flow-grid">
            {cycleStages.map((stage, idx) => (
              <div key={stage.step} className="cycle-step-card">
                <div className="cycle-step-badge">Phase {stage.step}</div>
                <h3 className="cycle-step-title">
                  <span>{stage.icon}</span>
                  <span>{stage.name}</span>
                </h3>
                <p className="cycle-step-desc">{stage.desc}</p>
                {idx < cycleStages.length - 1 && (
                  <div className="cycle-arrow-indicator" aria-hidden="true">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EDTECH & TECHNOLOGY TRAINING SECTION */}
      <section
        ref={edTechRef}
        className={`courses-spec-section ${edTechVisible ? 'reveal-visible' : 'reveal-hidden'}`}
        id="edtech-training"
      >
        <div className="container-fluid courses-spec-container">
          <div className="section-header-center">
            <div className="section-tag-row">
              <span className="section-tag-pill">Hands-On Technical Education</span>
            </div>
            <h2 className="section-heading-lg">
              EdTech & <span>Technology Training</span>
            </h2>
            <p className="section-desc-center">
              Alongside our R&D activities, Robogenesis delivers <strong>advanced EdTech programs and industry-focused technical training</strong> designed to develop practical skills for the rapidly evolving technology landscape.
            </p>
            <p className="section-desc-center" style={{ marginTop: '4px' }}>
              Our programs are built around <strong>hands-on learning, real-world projects, practical implementation, and industry-relevant technologies</strong>, enabling students, professionals, and organizations to strengthen their technical capabilities and become innovation-ready.
            </p>
          </div>

          {/* Areas of Training Ribbon */}
          <div className="training-areas-ribbon">
            <span className="training-areas-header">Our areas of training include:</span>
            <div className="training-pills-wrap">
              {trainingAreasList.map((area, idx) => (
                <span key={idx} className="training-area-pill">
                  <span>•</span>
                  <span>{area}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Program Categories Switcher */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div className="course-tabs-control" role="tablist">
              <button
                className={`tab-btn ${courseFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCourseFilter('all')}
                role="tab"
                aria-selected={courseFilter === 'all'}
              >
                All Programs ({longTermPrograms.length + shortTermCourses.length})
              </button>
              <button
                className={`tab-btn ${courseFilter === 'long' ? 'active' : ''}`}
                onClick={() => setCourseFilter('long')}
                role="tab"
                aria-selected={courseFilter === 'long'}
              >
                Specialized Long-Term Programs ({longTermPrograms.length})
              </button>
              <button
                className={`tab-btn ${courseFilter === 'short' ? 'active' : ''}`}
                onClick={() => setCourseFilter('short')}
                role="tab"
                aria-selected={courseFilter === 'short'}
              >
                Short-Term Courses ({shortTermCourses.length})
              </button>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="course-subsection">
            <div className="courses-grid">
              {displayedCourses.map((course) => (
                <div
                  key={course.id}
                  className="course-card"
                  style={{ '--card-accent': course.color }}
                  onClick={() => setSelectedCourse(course)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedCourse(course);
                    }
                  }}
                >
                  <div className="course-card-top">
                    <div className="course-card-icon-wrap">
                      <span className="course-icon">{course.icon}</span>
                    </div>
                    {course.duration && (
                      <span className="course-duration-pill">{course.duration}</span>
                    )}
                  </div>

                  <div className="course-card-body">
                    <span className="course-track-tag">{course.badge}</span>
                    <h4 className="course-card-title">{course.name}</h4>
                    <p className="course-card-desc">{course.desc}</p>
                  </div>

                  <div className="course-card-footer">
                    <button
                      className="course-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCourse(course);
                      }}
                      aria-label={`Explore program ${course.name}`}
                    >
                      <span>Explore Program</span>
                      <span className="arrow">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE ROBOGENESIS? SECTION */}
      <section
        ref={whyRef}
        className={`why-choose-section ${whyVisible ? 'reveal-visible' : 'reveal-hidden'}`}
        id="why-choose"
      >
        <div className="container-fluid why-choose-container">
          <div className="section-header-center">
            <div className="section-tag-row">
              <span className="section-tag-pill">Key Differentiators</span>
            </div>
            <h2 className="section-heading-lg">
              Why Choose <span>Robogenesis?</span>
            </h2>
            <p className="section-desc-center">
              A transformative innovation environment combining seasoned mentorship, state-of-the-art lab hardware, and industry-oriented engineering.
            </p>
          </div>

          <div className="why-choose-grid">
            {whyChooseFeatures.map((feat) => (
              <div key={feat.id} className="why-card">
                <div className="why-card-header">
                  <div className="why-icon-wrap">
                    <span className="why-icon">{feat.icon}</span>
                  </div>
                  <div className="why-stat-pill">
                    <span className="stat-val">{feat.stat}</span>
                    <span className="stat-lbl">{feat.statLabel}</span>
                  </div>
                </div>

                <h3 className="why-card-title">{feat.title}</h3>
                <p className="why-card-desc">{feat.desc}</p>
                <div className="why-card-hover-indicator" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONCLUDING CTA SECTION */}
      <section className="about-cta-section" id="journey-cta">
        <div className="container-fluid about-cta-container">
          <div className="about-cta-card">
            <div className="cta-ambient-glow" />
            <div className="about-cta-content">
              <div className="cta-badge">
                <span className="pulse-dot" />
                <span>R&D Partnerships & Admissions Open</span>
              </div>
              <h2 className="cta-title">
                Transform Ideas Into <span>Real-World Impact</span>
              </h2>
              <p className="cta-desc">
                Whether you are developing prototype solutions in Drone Technology and Embedded IoT, or empowering your team with advanced technical skills, Robogenesis provides the exact research expertise, hardware, and engineering guidance to excel.
              </p>

              <div className="cta-actions-group">
                <button
                  className="btn-primary cta-main-btn"
                  onClick={() => scrollToSection('edtech-training')}
                >
                  Explore All Programs
                </button>
                <button
                  className="btn-secondary cta-alt-btn"
                  onClick={() => onNavigate('contact', {
                    enquiryType: 'Course Enquiry',
                    domain: 'Robotics & Advanced Tech',
                    sourceTab: 'About',
                    message: 'I would like to contact the admissions and technical R&D team.',
                  })}
                >
                  Contact Admissions & R&D Team →
                </button>
              </div>
            </div>

            <div className="cta-guarantees-row">
              <div className="cta-g-item">
                <span className="cg-check">✓</span>
                <span>R&D Prototyping Workstations</span>
              </div>
              <div className="cta-g-item">
                <span className="cg-check">✓</span>
                <span>Hands-on Hardware Kits</span>
              </div>
              <div className="cta-g-item">
                <span className="cg-check">✓</span>
                <span>Industry Verified Certification</span>
              </div>
              <div className="cta-g-item">
                <span className="cg-check">✓</span>
                <span>Career & Innovation Acceleration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Course Details Modal */}
      <CourseModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
}
