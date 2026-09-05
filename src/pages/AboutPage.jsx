import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  shortTermCourses,
  whyChooseFeatures,
} from '../data/aboutCourses.js';
import { useScrollAnimation } from '../hooks/useScrollAnimation.js';
import WinHeadAria from '../MacView/windows/WinHeadAria.jsx';

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
      onNavigate('contact');
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
              <span className="course-modal-pill duration">{course.duration}</span>
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
            Back to Courses
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalElement, document.body)
    : null;
}

export default function AboutPage({ onNavigate, onOpenOs }) {
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Scroll reveal animation hooks for distinct sections
  const [visionRef, visionVisible] = useScrollAnimation(0.12);
  const [whyRef, whyVisible] = useScrollAnimation(0.12);

  const scrollToCourses = () => {
    document.getElementById('courses-specialization')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page-container page-enter about-page-wrapper">
      {/* 1. ABOUT / WELCOME HERO SECTION */}
      <section className="about-hero-section" id="welcome">
        <div className="about-hero-ambient-glow" />
        <div className="container-fluid about-hero-container">
          <div className="about-hero-grid">
            {/* Left Column: Heading, readable paragraphs, category badges */}
            <div className="about-hero-content">

              <h1 className="about-hero-title">
                Welcome to <span className="gradient-text">Robogenesis</span>
              </h1>

              <div className="about-hero-paragraphs">
                <p className="about-lead-paragraph">
                  <strong>Robogenesis</strong> is a pioneering education hub committed to empowering individuals with cutting-edge skills in technology. Specializing in short and long-term courses, we offer comprehensive training in Drone Technology, Embedded Systems, Programming Languages (C, C++, Core Java, Python), Data Structures, and Soft Skills.
                </p>
                <p className="about-sub-paragraph">
                  Our long-term programs include Embedded IoT Master Course, Embedded Linux Application Development, Embedded Systems with Automotive, Embedded Systems with RTOS, and Software Testing (Manual and Automation). With expert instructors and hands-on learning, Robogenesis strives to prepare students for success in the dynamic world of technology and innovation. Join us to unleash your potential in the digital era.
                </p>
              </div>

              {/* Course Category Badges */}
              <div className="about-categories-block">
                <span className="categories-label">Key Training Domains:</span>
                <div className="category-badges-row">
                  {[
                    { label: 'IoT', tag: 'short' },
                    { label: 'Embedded Systems', tag: 'short' },
                    { label: 'C / C++ / Java / Python', tag: 'short' },
                    { label: 'Web Development', tag: 'long' },
                    { label: 'AI & ML', tag: 'short' },
                    { label: 'Full Stack Development', tag: 'short' },
                  ].map((cat, idx) => (
                    <button
                      key={idx}
                      className="category-pill"
                      onClick={scrollToCourses}
                      title={`Jump to ${cat.label}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Hero Actions */}
              <div className="about-hero-actions">
                <button className="btn-primary" onClick={scrollToCourses}>
                  <span>Explore Specializations</span>
                  <span className="btn-arrow">↓</span>
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => onNavigate('contact')}
                >
                  Admissions & Inquiries
                </button>
                {onOpenOs && (
                  <button className="os-window-header-pill" onClick={onOpenOs}>
                    <span>Virtual Lab</span>
                    <span className="os-pill-action">macOS</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: WinHeadAria Head Visual */}
            <div className="about-hero-visual">
              <WinHeadAria isInline={true} hideHeader={true} hideFooter={true} onOpenOs={onOpenOs} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. COURSES WE SPECIALIZE IN SECTION */}
      <section className="courses-spec-section" id="courses-specialization">
        <div className="container-fluid courses-spec-container">
          <div className="section-header-center">
            <div className="section-tag-row">
              <span className="section-tag-pill">Comprehensive Curriculums</span>
            </div>
            <h2 className="section-heading-lg">
              Courses We <span>Specialize In</span>
            </h2>
            <p className="section-desc-center">
              Targeted industry programs engineered to transform passionate learners into autonomous technology leaders.
            </p>
          </div>

          {/* Short-Term Courses */}
          <div className="course-subsection">

              <div className="courses-grid">
                {shortTermCourses.map((course) => (
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
                      <span className="course-duration-pill">{course.duration}</span>
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
                        aria-label={`Explore course ${course.name}`}
                      >
                        <span>Explore Course</span>
                        <span className="arrow">→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      {/* 3. OUR GOAL, MISSION & VISION SECTION (1 ROW, 3 CARDS) */}
      <section
        ref={visionRef}
        className={`vmg-section ${visionVisible ? 'reveal-visible' : 'reveal-hidden'}`}
        id="vision-mission-goal"
      >
        <div className="container-fluid vmg-container">
          <div className="section-header-center">
            <div className="section-tag-row">
              <span className="section-tag-pill">Institutional Pillars</span>
            </div>
            <h2 className="section-heading-lg">
              Our <span>Goal, Mission & Vision</span>
            </h2>
            <p className="section-desc-center">
              The foundational principles guiding our transformative technology education and student outcomes.
            </p>
          </div>

          <div className="vmg-cards-grid">
            {/* Card 1: Our Goal */}
            <div className="vmg-card goal-card">
              <div className="vmg-card-top">
                <div className="vmg-icon-wrap">
                  <span className="vmg-icon">🏁</span>
                </div>
                <span className="vmg-badge goal-badge">Driving Outcomes</span>
              </div>
              <h3 className="vmg-card-title">Our <span>Goal</span></h3>
              <div className="vmg-card-content">
                <p>
                  Our goal at Robogenesis is to be the forefront of transformative education, guiding individuals towards technical excellence. We aim to equip our students with practical skills in Drone Technology, Embedded Systems, and Programming, ensuring their readiness for the ever-evolving tech industry.
                </p>
                <p>
                  Committed to fostering innovation, our goal is to create a learning environment that encourages creativity, critical thinking, and adaptability. By setting the highest standards in education, we aspire to be the driving force behind successful careers and technological advancements, contributing significantly to the global tech landscape.
                </p>
              </div>
              <div className="vmg-card-footer goal-footer-action">
                <div className="vmg-tags-row">
                  <span className="vmg-footer-tag">✓ Practical Excellence</span>
                  <span className="vmg-footer-tag">✓ Career Readiness</span>
                </div>
                <button className="vmg-goal-btn" onClick={scrollToCourses} aria-label="Explore courses">
                  <span>Explore Courses</span>
                  <span className="arrow">→</span>
                </button>
              </div>
            </div>

            {/* Card 2: Our Mission */}
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
                  At Robogenesis, our mission is to cultivate a culture of continuous learning and technological mastery. We are dedicated to providing accessible, top-notch education in Drone Technology, Embedded Systems, and Programming, empowering individuals for success.
                </p>
                <p>
                  Fueled by innovation, we strive to bridge the skills gap and prepare our students for the dynamic tech landscape. Through expert guidance and hands-on experience, we aim to foster a community of tech-savvy professionals who lead, create, and adapt to the evolving demands of the digital era. Join us as we embark on a mission to shape future tech leaders.
                </p>
              </div>
              <div className="vmg-card-footer">
                <div className="vmg-tags-row">
                  <span className="vmg-footer-tag">✓ Continuous Learning</span>
                  <span className="vmg-footer-tag">✓ Bridging Skills Gap</span>
                </div>
              </div>
            </div>

            {/* Card 3: Our Vision */}
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
                  Robogenesis envisions a future where technological prowess is accessible to all, fostering innovation and empowerment. Our vision is to be a catalyst for individuals, propelling them into the forefront of technological excellence.
                </p>
                <p>
                  We aspire to create a dynamic learning ecosystem that transcends boundaries, nurturing a community of skilled professionals prepared to meet the challenges of a rapidly advancing digital era. With a focus on cutting-edge education, we strive to be the driving force behind technological innovation and progress, shaping a brighter tomorrow for individuals and industries alike.
                </p>
              </div>
              <div className="vmg-card-footer">
                <div className="vmg-tags-row">
                  <span className="vmg-footer-tag">✓ Accessible Excellence</span>
                  <span className="vmg-footer-tag">✓ Catalyst for Innovation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 6. WHY CHOOSE ROBOGENESIS? SECTION */}
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
              A transformative learning environment combining seasoned mentorship, state-of-the-art lab hardware, and a career-centric ethos.
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

      {/* 7. CONCLUDING CTA SECTION */}
      <section className="about-cta-section" id="journey-cta">
        <div className="container-fluid about-cta-container">
          <div className="about-cta-card">
            <div className="cta-ambient-glow" />
            <div className="about-cta-content">
              <div className="cta-badge">
                <span className="pulse-dot" />
                <span>Admissions Now Open · Batch 2026</span>
              </div>
              <h2 className="cta-title">
                Start Your <span>Technology Journey</span> Today
              </h2>
              <p className="cta-desc">
                Whether you’re stepping into Drone Technology, mastering Embedded IoT, or building carrier-grade Linux applications, Robogenesis provides the exact hardware, curriculum, and guidance to excel.
              </p>

              <div className="cta-actions-group">
                <button
                  className="btn-primary cta-main-btn"
                  onClick={scrollToCourses}
                >
                  Explore All Programs
                </button>
                <button
                  className="btn-secondary cta-alt-btn"
                  onClick={() => onNavigate('contact')}
                >
                  Contact Admissions / Counseling →
                </button>
              </div>
            </div>

            <div className="cta-guarantees-row">
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
                <span>Placement & Interview Prep</span>
              </div>
              <div className="cta-g-item">
                <span className="cg-check">✓</span>
                <span>Alumni Tech Network</span>
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
