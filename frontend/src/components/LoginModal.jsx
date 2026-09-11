import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  FiX,
  FiMail,
  FiUser,
  FiLock,
  FiLogOut,
  FiEye,
  FiEyeOff,
  FiInbox,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
} from 'react-icons/fi';
import logoImg from '../assets/logo.png';
import { getApiUrl } from '../config/api.js';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, user, onLogout, onOpenAdmin, onNavigate, initialMode = 'login' }) {
  const [authMode, setAuthMode] = useState(initialMode); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text, needRegistration }
  const [userEnquiries, setUserEnquiries] = useState([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = origOverflow;
    };
  }, [isOpen, onClose]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setFeedback(null);
      setIsLoading(false);
      if (initialMode) {
        setAuthMode(initialMode);
      }
    }
  }, [isOpen, initialMode]);

  // If already logged in as admin, redirect directly to admin panel
  useEffect(() => {
    if (isOpen && user?.role === 'admin') {
      onClose();
      if (onOpenAdmin) {
        onOpenAdmin();
      } else {
        window.location.href = '/admin';
      }
    }
  }, [isOpen, user, onClose, onOpenAdmin]);

  const getApiEndpoint = (endpoint) => getApiUrl(endpoint);

  // Fetch enquiries submitted by logged-in user
  useEffect(() => {
    if (isOpen && user && user.role !== 'admin') {
      setLoadingEnquiries(true);
      const token = localStorage.getItem('robogenesis_token') || '';
      fetch(getApiEndpoint(`/api/contact/my-enquiries?email=${encodeURIComponent(user.email)}`), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserEnquiries(data.enquiries || []);
        })
        .catch((err) => {
          console.error('Failed to load enquiries:', err);
        })
        .finally(() => {
          setLoadingEnquiries(false);
        });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setFeedback({ type: 'error', text: 'Please fill in all required credentials.' });
      return;
    }
    if (authMode === 'signup' && !fullName.trim()) {
      setFeedback({ type: 'error', text: 'Please enter your full name.' });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      if (authMode === 'signup') {
        // Register user in backend
        const registerUrl = getApiEndpoint('/api/auth/register');
        const res = await fetch(registerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim(),
            password,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 405) {
            throw new Error('API server returned 405 (Method Not Allowed). Backend API route or serverless function is not active on this domain.');
          }
          throw new Error(data.error || 'Registration failed. Please try again.');
        }

        setFeedback({
          type: 'success',
          text: 'Account registered successfully! Please sign in with your credentials.',
        });

        // Switch to sign-in tab after short delay
        setTimeout(() => {
          setAuthMode('login');
          setPassword('');
        }, 1100);
      } else {
        // Sign in
        const loginUrl = getApiEndpoint('/api/auth/login');
        const res = await fetch(loginUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 405) {
            throw new Error('API server returned 405 (Method Not Allowed). Backend API route or serverless function is not active on this domain.');
          }
          if (data.needRegistration || res.status === 404 || (res.status === 400 && data.needRegistration)) {
            setFeedback({
              type: 'error',
              text: data.error || 'Account not found. You must register first before logging in!',
              needRegistration: true,
            });
            return;
          }
          throw new Error(data.error || 'Authentication failed. Please check your credentials.');
        }

        if (data.token) {
          localStorage.setItem('robogenesis_token', data.token);
        }

        setFeedback({
          type: 'success',
          text: data.user.role === 'admin'
            ? 'Administrator authenticated successfully!'
            : `Welcome back, ${data.user.name}!`,
        });

        setTimeout(() => {
          onLoginSuccess?.(data.user);
          onClose();
          if (data.user.role === 'admin') {
            if (onOpenAdmin) {
              onOpenAdmin();
            } else {
              window.location.href = '/admin';
            }
          }
        }, 850);
      }
    } catch (err) {
      const errMsg = err?.message || 'Authentication request failed.';
      setFeedback({
        type: 'error',
        text: errMsg.includes('Failed to fetch')
          ? 'Cannot connect to backend server. Please verify backend service is active.'
          : errMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div
      className="login-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-dialog-title"
    >
      <div className={`login-modal-card${user ? ' user-modal-expanded' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="login-modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <FiX size={18} />
        </button>

        {/* Already Logged In View: User Profile, Enquiries History & Sign Out */}
        {user ? (
          <div className="login-profile-view user-dashboard-view">
            <div className="user-profile-top-header">
              <div className="login-profile-avatar" style={{ margin: 0, width: '46px', height: '46px', fontSize: '15px' }}>
                <span>{user.initials || 'RG'}</span>
                <span className="live-status-dot" />
              </div>
              <div className="user-profile-info-text">
                <h2 className="login-modal-title" style={{ textAlign: 'left', margin: 0, fontSize: '17px' }}>
                  {user.name}
                </h2>
                <p className="login-profile-email" style={{ textAlign: 'left', margin: '2px 0 6px', fontSize: '12.5px' }}>
                  {user.email}
                </p>
                <div className="login-profile-badges" style={{ justifyContent: 'flex-start', margin: 0 }}>
                  <span className="login-profile-badge cyan" style={{ padding: '2px 8px', fontSize: '11px' }}>
                    {user.labAccess || 'Lab Member'}
                  </span>
                </div>
              </div>
            </div>

            {/* Enquiries History Section */}
            <div className="user-enquiries-section">
              <div className="user-enquiries-header">
                <div className="user-enquiries-title">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <FiMail size={16} /> My Enquiries History
                  </span>
                  <span className="user-enquiries-count-badge">{userEnquiries.length}</span>
                </div>
                <button
                  type="button"
                  className="btn-new-enquiry-link"
                  onClick={() => {
                    onClose();
                    onNavigate?.('contact');
                  }}
                  title="Submit a new enquiry"
                >
                  + New Enquiry
                </button>
              </div>

              {loadingEnquiries ? (
                <div className="user-enquiries-loading">
                  <p>Loading your enquiry submissions...</p>
                </div>
              ) : userEnquiries.length === 0 ? (
                <div className="user-enquiries-empty">
                  <div className="user-enquiries-empty-icon"><FiInbox size={38} /></div>
                  <p className="user-enquiries-empty-title">No Enquiries Submitted Yet</p>
                  <p className="user-enquiries-empty-desc">
                    Have a robotics question or custom hardware project? Reach out to our engineering lab and track review progress here.
                  </p>
                  <button
                    type="button"
                    className="btn-user-submit-enquiry"
                    onClick={() => {
                      onClose();
                      onNavigate?.('contact');
                    }}
                  >
                    Submit an Enquiry →
                  </button>
                </div>
              ) : (
                <div className="user-enquiries-list">
                  {userEnquiries.map((enq) => (
                    <div key={enq.id} className="user-enquiry-card">
                      <div className="user-enquiry-card-head">
                        <div>
                          <span className="user-enquiry-type-tag">
                            {enq.enquiryType || 'General Consultation'}
                          </span>
                          <span className="user-enquiry-domain-tag">
                            {enq.domain || 'Robotics'}
                          </span>
                          {enq.sourceTab && (
                            <span
                              className="user-enquiry-domain-tag"
                              style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <FiSend size={11} /> {enq.sourceTab}
                            </span>
                          )}
                        </div>
                        <span className={`user-enquiry-status-pill ${enq.status || 'new'}`}>
                          {enq.status === 'resolved'
                            ? 'Resolved'
                            : enq.status === 'in-review'
                            ? 'In Review'
                            : 'Pending Review'}
                        </span>
                      </div>
                      <p className="user-enquiry-message-text">{enq.message}</p>
                      <div className="user-enquiry-footer-meta">
                        <span>
                          {enq.submittedAt || enq.createdAt
                            ? new Date(enq.submittedAt || enq.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Submitted'}
                        </span>
                        <span style={{ color: '#94a3b8' }}>ID: {enq.id?.slice(0, 10)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Logout / Sign Out Button */}
            <div className="login-profile-actions" style={{ marginTop: '16px' }}>
              <button
                type="button"
                className="btn-login-signout"
                onClick={() => {
                  onLogout?.();
                  setFeedback({ type: 'success', text: 'You have been signed out.' });
                  onClose();
                }}
              >
                <FiLogOut size={16} />
                <span>Sign Out / Logout</span>
              </button>
            </div>
          </div>
        ) : (
          /* Authentication Form (Sign In / Sign Up) */
          <>
            <div className="login-modal-header">
              <div className="login-brand-icon-wrap">
                <img src={logoImg} alt="Robogenesis" className="login-logo-mini" />
              </div>
              <h2 className="login-modal-title" id="auth-dialog-title">
                {authMode === 'login' ? 'Sign In to Robogenesis' : 'Create Engineering Account'}
              </h2>
              <p className="login-modal-subtitle">
                {authMode === 'login'
                  ? 'Access your telemetry dashboards, lab simulations, and project deployments.'
                  : 'Join the robotics and web engineering ecosystem with unified platform access.'}
              </p>
            </div>

            {/* Auth Switcher Tabs */}
            <div className="login-tabs-row">
              <button
                type="button"
                className={`login-tab-btn${authMode === 'login' ? ' active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`login-tab-btn${authMode === 'signup' ? ' active' : ''}`}
                onClick={() => setAuthMode('signup')}
              >
                Create Account
              </button>
            </div>

            {/* Status Feedback */}
            {feedback && (
              <div className={`login-feedback-alert ${feedback.type}`} role="alert">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{feedback.type === 'success' ? '✓' : '⚠'}</span>
                  <span>{feedback.text}</span>
                </div>
                {feedback.needRegistration && (
                  <button
                    type="button"
                    className="btn-switch-register-inline"
                    onClick={() => {
                      setAuthMode('signup');
                      setFeedback(null);
                    }}
                  >
                    Register Free Account Now →
                  </button>
                )}
              </div>
            )}

            {/* Form */}
            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {authMode === 'signup' && (
                <div className="login-input-group">
                  <label htmlFor="auth-fullName">Full Name</label>
                  <div className="login-input-wrap">
                    <span className="login-input-icon"><FiUser size={16} /></span>
                    <input
                      type="text"
                      id="auth-fullName"
                      placeholder="e.g. Alex Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="login-input-group">
                <label htmlFor="auth-email">Email Address</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon"><FiMail size={16} /></span>
                  <input
                    type="email"
                    id="auth-email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="login-input-group">
                <div className="login-label-row">
                  <label htmlFor="auth-password">Password</label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      className="login-forgot-link"
                      onClick={() => alert('Password reset link sent to your registered email.')}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="login-input-wrap">
                  <span className="login-input-icon"><FiLock size={16} /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="auth-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="login-pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {authMode === 'login' ? (
                <label className="login-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember this device for 30 days</span>
                </label>
              ) : (
                <label className="login-checkbox-label">
                  <input type="checkbox" defaultChecked required />
                  <span>I agree to the Robogenesis Terms of Service &amp; Privacy Policy</span>
                </label>
              )}

              <button
                type="submit"
                className="btn-login-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="login-spinner" />
                ) : (
                  <span>{authMode === 'login' ? 'Sign In to Account →' : 'Create Free Account →'}</span>
                )}
              </button>
            </form>


          </>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
