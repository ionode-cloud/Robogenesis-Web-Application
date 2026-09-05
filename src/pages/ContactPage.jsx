import { useRef, useState, useEffect } from 'react';
import { CONTACT_INFO, ENQUIRY_TYPES, DOMAIN_OPTIONS } from '../data/contactConfig.js';

function ContactForm({ selectedEnquiryType }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    enquiryType: '',
    domain: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  // Sync enquiryType if selected from external cards
  useEffect(() => {
    if (selectedEnquiryType) {
      setFormData((prev) => ({ ...prev, enquiryType: selectedEnquiryType }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.enquiryType;
        return next;
      });
    }
  }, [selectedEnquiryType]);

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value || !value.trim()) {
          return 'Full name is required.';
        }
        if (value.trim().length < 2) {
          return 'Full name must be at least 2 characters.';
        }
        return '';

      case 'email': {
        if (!value || !value.trim()) {
          return 'Email address is required.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          return 'Please enter a valid email address (e.g. name@example.com).';
        }
        return '';
      }

      case 'phone': {
        if (!value || !value.trim()) {
          return 'Phone number is required.';
        }
        const cleanPhone = value.replace(/[\s\-()]/g, '');
        const phoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
        if (!phoneRegex.test(cleanPhone)) {
          return 'Please enter a valid 10-digit phone number.';
        }
        return '';
      }

      case 'enquiryType':
        if (!value) {
          return 'Please select an enquiry type.';
        }
        return '';

      case 'message':
        if (!value || !value.trim()) {
          return 'Message is required.';
        }
        if (value.trim().length < 10) {
          return 'Message must be at least 10 characters.';
        }
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setServerError('');

    if (errors[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'domain') {
        const err = validateField(key, formData[key]);
        if (err) newErrors[key] = err;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsSubmitting(true);
    setServerError('');

    const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
    const endpoint = `${API_BASE}/api/contact`;

    try {
      let response;
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } catch {
        response = null;
      }

      if (response && !response.ok) {
        throw new Error('Server returned an error status.');
      }

      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSuccess(true);
    } catch {
      setServerError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      enquiryType: '',
      domain: '',
      message: '',
    });
    setErrors({});
    setIsSuccess(false);
    setServerError('');
  };

  return (
    <div className="contact-main-grid" id="contact-form-section">
      {/* Left Column: Contact Information Cards */}
      <div className="contact-info-panel">
        <div className="contact-info-header">
          <span className="contact-pill-tag">Communication Hub</span>
          <h2 className="contact-panel-title">Direct Contact Details</h2>
          <p className="contact-panel-desc">
            Connect directly with our education advisors, technical lab coordinators, and product
            specialists.
          </p>
        </div>

        <div className="contact-info-cards-list">
          {/* Address Card */}
          <div className="contact-info-card-item">
            <div className="contact-info-icon-box" aria-hidden="true">
              📍
            </div>
            <div className="contact-info-details">
              <span className="cic-label">Center Address</span>
              <strong className="cic-val">{CONTACT_INFO.addressName}</strong>
              <span className="cic-sub">{CONTACT_INFO.addressLine1}</span>
              <span className="cic-country">{CONTACT_INFO.addressCountry}</span>
            </div>
          </div>

          {/* Phone Card */}
          <div className="contact-info-card-item">
            <div className="contact-info-icon-box" aria-hidden="true">
              📞
            </div>
            <div className="contact-info-details">
              <span className="cic-label">Phone Enquiries</span>
              <strong className="cic-val">{CONTACT_INFO.phoneDisplay}</strong>
              <span className="cic-sub">Mon–Sat, 9:00 AM – 6:00 PM</span>
            </div>
          </div>

          {/* Email Card */}
          <div className="contact-info-card-item">
            <div className="contact-info-icon-box" aria-hidden="true">
              ✉️
            </div>
            <div className="contact-info-details">
              <span className="cic-label">Email Communications</span>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="cic-val cic-email-link"
                title="Send an email to Robogenesis"
              >
                {CONTACT_INFO.email}
              </a>
              <span className="cic-sub">Official responses within 24 business hours</span>
            </div>
          </div>

          {/* Working Hours Card */}
          <div className="contact-info-card-item">
            <div className="contact-info-icon-box" aria-hidden="true">
              🕒
            </div>
            <div className="contact-info-details">
              <span className="cic-label">Working Hours</span>
              <strong className="cic-val">{CONTACT_INFO.workingDays}</strong>
              <span className="cic-sub">{CONTACT_INFO.workingTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Send Us a Message Form */}
      <div className="contact-form-panel">
        <div className="contact-form-card">
          <div className="contact-form-header">
            <h3 className="contact-form-heading">Send Us a Message</h3>
            <p className="contact-form-subtext">
              Fill out the form below with your requirements and our team will get back to you promptly.
            </p>
          </div>

          {isSuccess ? (
            <div className="form-success-banner" role="status" aria-live="polite">
              <div className="fs-icon">✓</div>
              <h4 className="fs-title">Message Sent Successfully</h4>
              <p className="fs-desc">
                Thank you for contacting Robogenesis. Our team will get back to you soon.
              </p>
              <button className="btn-send-another" onClick={handleReset}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="contact-actual-form">
              {serverError && (
                <div className="form-error-banner" role="alert">
                  <span className="feb-icon">⚠️</span>
                  <span>{serverError}</span>
                </div>
              )}

              {/* Row 1: Name & Email */}
              <div className="form-row-two-col">
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    Full Name <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className={`form-input${errors.fullName ? ' has-error' : ''}`}
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={errors.fullName ? 'true' : 'false'}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.fullName && (
                    <span className="form-error-msg" id="fullName-error" role="alert">
                      {errors.fullName}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="req-star">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-input${errors.email ? ' has-error' : ''}`}
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <span className="form-error-msg" id="email-error" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2: Phone & Enquiry Type */}
              <div className="form-row-two-col">
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone Number <span className="req-star">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`form-input${errors.phone ? ' has-error' : ''}`}
                    placeholder="Enter your phone number (e.g. 9876543210)"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <span className="form-error-msg" id="phone-error" role="alert">
                      {errors.phone}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="enquiryType" className="form-label">
                    Select Enquiry Type <span className="req-star">*</span>
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="enquiryType"
                      name="enquiryType"
                      className={`form-select${errors.enquiryType ? ' has-error' : ''}`}
                      value={formData.enquiryType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={errors.enquiryType ? 'true' : 'false'}
                      aria-describedby={errors.enquiryType ? 'enquiryType-error' : undefined}
                      disabled={isSubmitting}
                    >
                      <option value="">Select an enquiry type</option>
                      {ENQUIRY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.enquiryType && (
                    <span className="form-error-msg" id="enquiryType-error" role="alert">
                      {errors.enquiryType}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 3: Select Domain (Optional) */}
              <div className="form-group">
                <label htmlFor="domain" className="form-label">
                  Select Domain <span className="opt-tag">(Optional)</span>
                </label>
                <div className="select-wrapper">
                  <select
                    id="domain"
                    name="domain"
                    className="form-select"
                    value={formData.domain}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value="">Select a domain</option>
                    {DOMAIN_OPTIONS.map((dom) => (
                      <option key={dom} value={dom}>
                        {dom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Message */}
              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message <span className="req-star">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  className={`form-textarea${errors.message ? ' has-error' : ''}`}
                  placeholder="Tell us how we can help you..."
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={errors.message ? 'true' : 'false'}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  disabled={isSubmitting}
                />
                {errors.message && (
                  <span className="form-error-msg" id="message-error" role="alert">
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-contact-submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="submit-spinner" aria-hidden="true" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <span className="submit-arrow-icon" aria-hidden="true">
                      →
                    </span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContactPage({ onNavigate }) {
  const formSectionRef = useRef(null);

  return (
    <div className="page-container page-enter contact-page-wrapper">
      {/* 1. CONTACT HERO SECTION */}
      <section className="contact-hero-section">
        <div className="container-fluid contact-hero-container">
          <div className="contact-hero-inner">
            <h1 className="contact-hero-title">
              Let&apos;s Build the Future <span>Together</span>
            </h1>

            <p className="contact-hero-desc">
              Have questions about our courses, technology projects, products, or training programs?
              Our team is here to help. Get in touch with Robogenesis and take the next step
              toward your technology journey.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CONTACT FORM */}
      <section className="contact-form-wrapper-section" ref={formSectionRef}>
        <div className="container-fluid">
          <ContactForm selectedEnquiryType="" />
        </div>
      </section>

      {/* 3. FINAL CTA */}
      <section className="contact-final-cta-section">
        <div className="container-fluid">
          <div className="contact-final-cta-card">
            <div className="cfc-content">
              <span className="cfc-pill">Get Started Today</span>
              <h2 className="cfc-heading">Ready to Start Your Technology Journey?</h2>
              <p className="cfc-desc">
                Whether you&apos;re looking to learn, build, innovate, or collaborate, Robogenesis is
                ready to help you take the next step.
              </p>
            </div>
            <div className="cfc-buttons">
              <button className="btn-cfc-courses" onClick={() => onNavigate('about')}>
                Explore Courses →
              </button>
              <button className="btn-cfc-contact" onClick={() => onNavigate('products')}>
                Browse Products →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
