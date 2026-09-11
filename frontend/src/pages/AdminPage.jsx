import { useState, useEffect, useCallback } from 'react';
import {
  FiBarChart2,
  FiMail,
  FiUsers,
  FiKey,
  FiGlobe,
  FiLogOut,
  FiX,
  FiMenu,
  FiBell,
  FiShield,
  FiGrid,
  FiPackage,
  FiCpu,
  FiCode,
  FiBookOpen,
  FiHome,
  FiSend,
  FiMessageSquare,
  FiSearch,
  FiEye,
  FiEyeOff,
  FiTrash2,
  FiEdit2,
  FiPlusCircle,
  FiInbox,
  FiLoader,
} from 'react-icons/fi';
import logoImg from '../assets/logo.png';
import { SiGmail } from 'react-icons/si';
import { getApiBaseUrl } from '../config/api.js';

export default function AdminPage({ onNavigate, onOpenLogin }) {
  const API_BASE = getApiBaseUrl();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'enquiries' | 'users' | 'credentials'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [enquiries, setEnquiries] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminProfile, setAdminProfile] = useState(null);

  // Generate direct Gmail Compose URL for client enquiries
  const getGmailComposeUrl = (enquiry) => {
    if (!enquiry || !enquiry.email) return '#';
    const to = enquiry.email.trim();
    const domainStr = enquiry.domain ? ` (${enquiry.domain})` : '';
    const subject = `Regarding your Robogenesis Enquiry${domainStr}`;
    const body = `Dear ${enquiry.fullName || 'Client'},

Thank you for contacting Robogenesis regarding your enquiry${domainStr}.

Enquiry Details:
• Type: ${enquiry.enquiryType || 'General Consultation'}
• Domain: ${enquiry.domain || 'Robotics & Autonomous Systems'}
• Source: ${enquiry.sourceTab || 'Website'}
• Your Message: "${enquiry.message || ''}"

We are reviewing your requirements and would be delighted to assist you further.

Best regards,
Robogenesis Team
Autonomous Robotics & Smart Systems
`;

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Filter states
  const [enquirySearch, setEnquirySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');

  // Selected enquiry for detail modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Admin credentials state
  const [adminList, setAdminList] = useState([]);
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Administrator',
  });
  const [credMsg, setCredMsg] = useState(null);
  const [isSavingCred, setIsSavingCred] = useState(false);
  const [hiddenPasswords, setHiddenPasswords] = useState({});

  const togglePasswordVisibility = (id) => {
    setHiddenPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Authenticated state tracking
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('robogenesis_user') || 'null');
    } catch {
      return null;
    }
  });

  const token = localStorage.getItem('robogenesis_token') || '';
  const isAdmin = currentUser && currentUser.role === 'admin';

  // Logout Handler - Clears session and returns to landing page
  const handleLogout = () => {
    try {
      localStorage.removeItem('robogenesis_token');
      localStorage.removeItem('robogenesis_user');
      localStorage.setItem('robogenesis_current_page', 'home');
    } catch {
      // Ignored
    }

    if (onNavigate) {
      onNavigate('home');
    }

    // Redirect to landing page
    window.location.href = '/home';
  };

  const fetchAdminData = useCallback(async () => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const [enqRes, usersRes, credRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/enquiries`, { headers }),
        fetch(`${API_BASE}/api/admin/users`, { headers }),
        fetch(`${API_BASE}/api/admin/credentials`, { headers }),
      ]);

      if (enqRes.ok) {
        const enqData = await enqRes.json();
        setEnquiries(enqData.enquiries || []);
      }
      if (usersRes.ok) {
        const uData = await usersRes.json();
        setUsers(uData.users || []);
      }
      if (credRes.ok) {
        const cData = await credRes.json();
        const admins = cData.admins || [];
        setAdminList(admins);
        if (admins.length > 0) {
          setAdminProfile(admins[0]);
        }
      }
    } catch (err) {
      setError('Could not connect to backend server. Please verify backend is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, token]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Handle Enquiry Status Update
  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/enquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: nextStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry((prev) => ({ ...prev, status: nextStatus }));
        }
      }
    } catch {
      alert('Failed to update status.');
    }
  };

  // Handle Delete Enquiry
  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this client enquiry?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry(null);
        }
      }
    } catch {
      alert('Failed to delete enquiry.');
    }
  };

  // Handle Save (Create or Update) Admin Credential
  const handleSaveAdminCredential = async (e) => {
    e.preventDefault();
    setCredMsg(null);

    if (!adminForm.name.trim() || !adminForm.email.trim()) {
      setCredMsg({ type: 'error', text: 'Name and email are required.' });
      return;
    }

    if (!editingAdminId && (!adminForm.password || adminForm.password.length < 6)) {
      setCredMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (editingAdminId && adminForm.password && adminForm.password.length < 6) {
      setCredMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    setIsSavingCred(true);
    try {
      const url = editingAdminId
        ? `${API_BASE}/api/admin/credentials/${editingAdminId}`
        : `${API_BASE}/api/admin/credentials`;
      const method = editingAdminId ? 'PUT' : 'POST';

      const payload = {
        name: adminForm.name.trim(),
        email: adminForm.email.trim(),
        role: adminForm.role,
      };
      if (adminForm.password) {
        payload.password = adminForm.password;
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save admin credential.');
      }

      if (editingAdminId) {
        setAdminList((prev) =>
          prev.map((adm) => (adm.id === editingAdminId ? { ...adm, ...data.admin } : adm))
        );
        setCredMsg({ type: 'success', text: 'Admin credential updated successfully!' });
      } else {
        setAdminList((prev) => [...prev, data.admin]);
        setCredMsg({ type: 'success', text: 'New admin credential created successfully!' });
      }

      // Reset form
      setEditingAdminId(null);
      setAdminForm({
        name: '',
        email: '',
        password: '',
        role: 'Administrator',
      });
    } catch (err) {
      setCredMsg({ type: 'error', text: err.message });
    } finally {
      setIsSavingCred(false);
    }
  };

  const handleStartEditAdmin = (admin) => {
    setEditingAdminId(admin.id);
    setAdminForm({
      name: admin.name || '',
      email: admin.email || '',
      password: '',
      role: admin.role || 'Administrator',
    });
    setCredMsg(null);
  };

  const handleCancelEditAdmin = () => {
    setEditingAdminId(null);
    setAdminForm({
      name: '',
      email: '',
      password: '',
      role: 'Administrator',
    });
    setCredMsg(null);
  };

  const handleDeleteAdmin = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the admin credential for "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/credentials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete admin credential.');
      }

      setAdminList((prev) => prev.filter((adm) => adm.id !== id));
      if (editingAdminId === id) {
        handleCancelEditAdmin();
      }
      setCredMsg({ type: 'success', text: `Admin credential for "${name}" deleted.` });
    } catch (err) {
      alert(err.message || 'Failed to delete admin credential.');
    }
  };

  const getSourceBadgeColor = (source) => {
    const s = (source || 'Contact Us').toLowerCase();
    if (s.includes('product')) return { color: '#0284c7', bg: 'rgba(2, 132, 199, 0.1)', border: 'rgba(2, 132, 199, 0.28)', Icon: FiPackage };
    if (s.includes('domain')) return { color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.1)', border: 'rgba(124, 58, 237, 0.28)', Icon: FiCpu };
    if (s.includes('web')) return { color: '#4f46e5', bg: 'rgba(79, 70, 229, 0.1)', border: 'rgba(79, 70, 229, 0.28)', Icon: FiCode };
    if (s.includes('about') || s.includes('course')) return { color: '#059669', bg: 'rgba(5, 150, 105, 0.1)', border: 'rgba(5, 150, 105, 0.28)', Icon: FiBookOpen };
    if (s.includes('home')) return { color: '#e11d48', bg: 'rgba(225, 29, 72, 0.1)', border: 'rgba(225, 29, 72, 0.28)', Icon: FiHome };
    if (s.includes('newsletter')) return { color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)', border: 'rgba(217, 119, 6, 0.28)', Icon: FiSend };
    return { color: '#0d9488', bg: 'rgba(13, 148, 136, 0.1)', border: 'rgba(13, 148, 136, 0.28)', Icon: FiMessageSquare };
  };

  // Filtered enquiries
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      (e.fullName || '').toLowerCase().includes(enquirySearch.toLowerCase()) ||
      (e.email || '').toLowerCase().includes(enquirySearch.toLowerCase()) ||
      (e.domain || '').toLowerCase().includes(enquirySearch.toLowerCase()) ||
      (e.sourceTab || '').toLowerCase().includes(enquirySearch.toLowerCase()) ||
      (e.enquiryType || '').toLowerCase().includes(enquirySearch.toLowerCase()) ||
      (e.message || '').toLowerCase().includes(enquirySearch.toLowerCase());

    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;

    const matchesSource =
      sourceFilter === 'all' ||
      (e.sourceTab || 'Contact Us').toLowerCase().includes(sourceFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesSource;
  });

  // Filtered users
  const filteredUsers = users.filter((u) => {
    return (
      (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
    );
  });

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;
  const inReviewCount = enquiries.filter((e) => e.status === 'in-review').length;
  const resolvedCount = enquiries.filter((e) => e.status === 'resolved').length;

  const sourceCounts = {
    all: enquiries.length,
    contact: enquiries.filter((e) => (e.sourceTab || 'Contact Us').toLowerCase().includes('contact')).length,
    products: enquiries.filter((e) => (e.sourceTab || '').toLowerCase().includes('product')).length,
    domains: enquiries.filter((e) => (e.sourceTab || '').toLowerCase().includes('domain')).length,
    webDev: enquiries.filter((e) => (e.sourceTab || '').toLowerCase().includes('web')).length,
    about: enquiries.filter((e) => (e.sourceTab || '').toLowerCase().includes('about') || (e.sourceTab || '').toLowerCase().includes('course')).length,
    home: enquiries.filter((e) => (e.sourceTab || '').toLowerCase().includes('home')).length,
    newsletter: enquiries.filter((e) => (e.sourceTab || '').toLowerCase().includes('newsletter')).length,
  };

  // If not authenticated as admin, immediately redirect back to landing page
  useEffect(() => {
    if (!isAdmin) {
      if (onNavigate) {
        onNavigate('home');
      }
      window.location.replace('/home');
    }
  }, [isAdmin, onNavigate]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-dashboard-layout">
      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 1. LEFT SIDEBAR */}
      <aside className={`admin-sidebar${mobileSidebarOpen ? ' mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="admin-sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={logoImg} alt="Robogenesis" className="admin-sidebar-logo" />
            <div className="admin-sidebar-brand">
              <span>Robogenesis</span>
              <span className="admin-sidebar-badge">Command Center</span>
            </div>
          </div>
          <button
            type="button"
            className="admin-sidebar-close-btn"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="admin-sidebar-nav">
          <div className="admin-nav-section-title">Core Management</div>

          <button
            className={`admin-nav-item${activeTab === 'overview' ? ' active' : ''}`}
            onClick={() => {
              setActiveTab('overview');
              setMobileSidebarOpen(false);
            }}
          >
            <div className="admin-nav-item-left">
              <span className="admin-nav-icon"><FiBarChart2 size={18} /></span>
              <span>Overview</span>
            </div>
          </button>

          <button
            className={`admin-nav-item${activeTab === 'enquiries' ? ' active' : ''}`}
            onClick={() => {
              setActiveTab('enquiries');
              setMobileSidebarOpen(false);
            }}
          >
            <div className="admin-nav-item-left">
              <span className="admin-nav-icon"><FiMail size={18} /></span>
              <span>Client Enquiries</span>
            </div>
            {newEnquiriesCount > 0 ? (
              <span className="admin-nav-badge danger">{newEnquiriesCount} new</span>
            ) : (
              <span className="admin-nav-badge">{enquiries.length}</span>
            )}
          </button>

          <button
            className={`admin-nav-item${activeTab === 'users' ? ' active' : ''}`}
            onClick={() => {
              setActiveTab('users');
              setMobileSidebarOpen(false);
            }}
          >
            <div className="admin-nav-item-left">
              <span className="admin-nav-icon"><FiUsers size={18} /></span>
              <span>Registered Users</span>
            </div>
            <span className="admin-nav-badge">{users.length}</span>
          </button>

          <div className="admin-nav-section-title" style={{ marginTop: '16px' }}>
            Security &amp; System
          </div>

          <button
            className={`admin-nav-item${activeTab === 'credentials' ? ' active' : ''}`}
            onClick={() => {
              setActiveTab('credentials');
              setMobileSidebarOpen(false);
            }}
          >
            <div className="admin-nav-item-left">
              <span className="admin-nav-icon"><FiKey size={18} /></span>
              <span>Admin Credentials</span>
            </div>
          </button>

          <button
            type="button"
            className="admin-nav-item"
            style={{
              textDecoration: 'none',
              background: 'none',
              border: 'none',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'inherit',
            }}
            onClick={() => {
              if (onNavigate) {
                onNavigate('home');
              } else {
                window.location.href = '/home';
              }
            }}
            title="Return to Robo Web Landing Page"
          >
            <div className="admin-nav-item-left">
              <span className="admin-nav-icon"><FiGlobe size={18} /></span>
              <span>Robo Web Landing Page</span>
            </div>
          </button>
        </nav>

        {/* Sidebar Footer: Admin Profile & Logout */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-avatar">AD</div>
            <div className="admin-user-details">
              <p className="admin-user-name">{adminProfile?.name || 'Administrator'}</p>
              <p className="admin-user-email">{adminProfile?.email || 'admin@robogenesis.com'}</p>
            </div>
          </div>

          <button
            type="button"
            className="btn-admin-logout"
            onClick={handleLogout}
            title="Sign out of Admin Session"
          >
            <FiLogOut size={16} />
            <span>Sign Out / Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN VIEWPORT (No Navbar) */}
      <div className="admin-main-viewport">
        {/* Sleek Mobile Topbar (Appears on <= 900px screens) */}
        <div className="admin-mobile-topbar">
          <button
            type="button"
            className="admin-mobile-toggle-btn"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <FiMenu size={20} />
          </button>
          <div className="admin-mobile-title">
            <span className="admin-mobile-brand">Robogenesis Admin</span>
            <span className="admin-mobile-active-tab">
              {activeTab === 'overview' && 'Overview'}
              {activeTab === 'enquiries' && 'Client Enquiries'}
              {activeTab === 'users' && 'Registered Users'}
              {activeTab === 'credentials' && 'Credentials'}
            </span>
          </div>
          <button
            type="button"
            className="admin-mobile-home-btn"
            onClick={() => (onNavigate ? onNavigate('home') : (window.location.href = '/home'))}
            title="Return to Landing Page"
          >
            <FiGlobe size={18} />
          </button>
        </div>

        {/* Page Content Body */}
        <main className="admin-page-body">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div className="admin-content-header">
                <div>
                  <h2 className="admin-content-title">Dashboard Overview</h2>
                  <p className="admin-content-subtitle">
                    Real-time monitoring of client inquiries, user registrations, and backend services.
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon cyan"><FiMail size={22} /></div>
                  <div>
                    <div className="admin-stat-label">Total Enquiries</div>
                    <div className="admin-stat-number">{enquiries.length}</div>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon amber"><FiBell size={22} /></div>
                  <div>
                    <div className="admin-stat-label">Pending / New</div>
                    <div className="admin-stat-number" style={{ color: '#d97706' }}>
                      {newEnquiriesCount}
                    </div>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon green"><FiUsers size={22} /></div>
                  <div>
                    <div className="admin-stat-label">Registered Engineers</div>
                    <div className="admin-stat-number">{users.length}</div>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon purple"><FiShield size={22} /></div>
                  <div>
                    <div className="admin-stat-label">Admin Security</div>
                    <div className="admin-stat-number" style={{ fontSize: '20px', color: '#9333ea' }}>
                      Root Access
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Enquiries Preview */}
              <div className="admin-panel-card">
                <div className="admin-panel-header">
                  <h3>Recent Client Inquiries</h3>
                  <button
                    className="btn-admin-topbar-action primary"
                    onClick={() => setActiveTab('enquiries')}
                  >
                    View All Enquiries →
                  </button>
                </div>

                <div className="admin-table-wrap">
                  {enquiries.length === 0 ? (
                    <div className="admin-empty-state-card">
                      <div className="admin-empty-icon-lg"><FiInbox size={38} /></div>
                      <p>No client enquiries received yet.</p>
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Client</th>
                          <th>Email</th>
                          <th>Origin Tab</th>
                          <th>Domain</th>
                          <th>Enquiry Type</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiries.slice(0, 5).map((enq) => {
                          const badge = getSourceBadgeColor(enq.sourceTab);
                          const BadgeIcon = badge.Icon;
                          return (
                            <tr key={enq.id}>
                              <td>
                                <div className="admin-client-cell">
                                  <div className="admin-client-avatar">
                                    {(enq.fullName || 'CL').slice(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="admin-client-name">{enq.fullName}</div>
                                    <div className="admin-client-phone">{enq.phone || 'N/A'}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <a
                                  href={getGmailComposeUrl(enq)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Open in Gmail"
                                  style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                  {enq.email}
                                </a>
                              </td>
                              <td>
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '2px 8px',
                                    borderRadius: '999px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: badge.color,
                                    background: badge.bg,
                                    border: `1px solid ${badge.border}`,
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  <BadgeIcon size={12} /> {enq.sourceTab || 'Contact Us'}
                                </span>
                              </td>
                              <td>
                                <span className="domain-pill">{enq.domain || 'Robotics'}</span>
                              </td>
                              <td style={{ color: '#475569' }}>{enq.enquiryType}</td>
                              <td style={{ fontSize: '12.5px', color: '#64748b' }}>
                                {new Date(enq.submittedAt || enq.createdAt || Date.now()).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </td>
                            <td>
                              <span
                                className={`status-pill-badge ${enq.status || 'new'}`}
                                onClick={() => {
                                  const cycle = {
                                    new: 'in-review',
                                    'in-review': 'resolved',
                                    resolved: 'new',
                                  };
                                  handleUpdateStatus(enq.id, cycle[enq.status || 'new']);
                                }}
                                title="Click to cycle status"
                              >
                                ● {enq.status || 'new'}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn-table-action"
                                onClick={() => setSelectedEnquiry(enq)}
                              >
                                <FiEye size={13} style={{ marginRight: 4 }} /> View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLIENT ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div>
              <div className="admin-content-header">
                <div>
                  <h2 className="admin-content-title">Client Consultations &amp; Inquiries</h2>
                  <p className="admin-content-subtitle">
                    Manage and respond to inbound enquiries submitted via the Contact page.
                  </p>
                </div>
              </div>

              <div className="admin-panel-card">
                <div className="admin-panel-header admin-filter-header-block">
                  {/* Row 1: Origin Tab Filters */}
                  <div className="admin-filter-pills-row">
                    <span className="admin-filter-group-label">
                      Origin Tab:
                    </span>
                    <button
                      className={`btn-table-action${sourceFilter === 'all' ? ' primary' : ''}`}
                      onClick={() => setSourceFilter('all')}
                    >
                      <FiGrid size={13} style={{ marginRight: 5 }} /> All Tabs ({enquiries.length})
                    </button>
                    <button
                      className={`btn-table-action${sourceFilter === 'contact' ? ' primary' : ''}`}
                      onClick={() => setSourceFilter('contact')}
                    >
                      <FiMessageSquare size={13} style={{ marginRight: 5 }} /> Contact Us ({sourceCounts.contact})
                    </button>
                    <button
                      className={`btn-table-action${sourceFilter === 'product' ? ' primary' : ''}`}
                      onClick={() => setSourceFilter('product')}
                    >
                      <FiPackage size={13} style={{ marginRight: 5 }} /> Products ({sourceCounts.products})
                    </button>
                    <button
                      className={`btn-table-action${sourceFilter === 'domain' ? ' primary' : ''}`}
                      onClick={() => setSourceFilter('domain')}
                    >
                      <FiCpu size={13} style={{ marginRight: 5 }} /> Domains ({sourceCounts.domains})
                    </button>
                    <button
                      className={`btn-table-action${sourceFilter === 'web' ? ' primary' : ''}`}
                      onClick={() => setSourceFilter('web')}
                    >
                      <FiCode size={13} style={{ marginRight: 5 }} /> Web Dev ({sourceCounts.webDev})
                    </button>
                    <button
                      className={`btn-table-action${sourceFilter === 'about' ? ' primary' : ''}`}
                      onClick={() => setSourceFilter('about')}
                    >
                      <FiBookOpen size={13} style={{ marginRight: 5 }} /> About ({sourceCounts.about})
                    </button>
                    <button
                      className={`btn-table-action${sourceFilter === 'home' ? ' primary' : ''}`}
                      onClick={() => setSourceFilter('home')}
                    >
                      <FiHome size={13} style={{ marginRight: 5 }} /> Home ({sourceCounts.home})
                    </button>
                    <button
                      className={`btn-table-action${sourceFilter === 'newsletter' ? ' primary' : ''}`}
                      onClick={() => setSourceFilter('newsletter')}
                    >
                      <FiSend size={13} style={{ marginRight: 5 }} /> Newsletter ({sourceCounts.newsletter})
                    </button>
                  </div>

                  {/* Row 2: Status Pills Filter & Search Input */}
                  <div className="admin-filter-status-row">
                    <div className="admin-status-pills">
                      <span className="admin-filter-group-label">
                        Status:
                      </span>
                      <button
                        className={`btn-table-action${statusFilter === 'all' ? ' primary' : ''}`}
                        onClick={() => setStatusFilter('all')}
                      >
                        All ({enquiries.length})
                      </button>
                      <button
                        className={`btn-table-action${statusFilter === 'new' ? ' primary' : ''}`}
                        onClick={() => setStatusFilter('new')}
                      >
                        New ({newEnquiriesCount})
                      </button>
                      <button
                        className={`btn-table-action${statusFilter === 'in-review' ? ' primary' : ''}`}
                        onClick={() => setStatusFilter('in-review')}
                      >
                        In Review ({inReviewCount})
                      </button>
                      <button
                        className={`btn-table-action${statusFilter === 'resolved' ? ' primary' : ''}`}
                        onClick={() => setStatusFilter('resolved')}
                      >
                        Resolved ({resolvedCount})
                      </button>
                    </div>

                    {/* Search Input */}
                    <div className="admin-search-box admin-search-box-responsive">
                      <span className="admin-search-icon"><FiSearch size={15} /></span>
                      <input
                        type="text"
                        placeholder="Search client, email, tab, domain..."
                        value={enquirySearch}
                        onChange={(e) => setEnquirySearch(e.target.value)}
                        className="admin-search-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="admin-table-wrap">
                  {isLoading ? (
                    <div className="admin-empty-state-card">
                      <div className="admin-empty-icon-lg"><FiLoader size={38} className="admin-spin" /></div>
                      <p>Loading enquiries from backend...</p>
                    </div>
                  ) : filteredEnquiries.length === 0 ? (
                    <div className="admin-empty-state-card">
                      <div className="admin-empty-icon-lg"><FiInbox size={38} /></div>
                      <p>No enquiries found matching your search or filters.</p>
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Client Name</th>
                          <th>Contact Email</th>
                          <th>Origin Tab</th>
                          <th>Domain &amp; Enquiry</th>
                          <th>Message Preview</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEnquiries.map((enq) => {
                          const badge = getSourceBadgeColor(enq.sourceTab);
                          const BadgeIcon = badge.Icon;
                          return (
                            <tr key={enq.id}>
                              <td>
                                <div className="admin-client-cell">
                                  <div className="admin-client-avatar">
                                    {(enq.fullName || 'CL').slice(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="admin-client-name">{enq.fullName}</div>
                                    <div className="admin-client-phone">{enq.phone || 'No phone'}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <a
                                  href={getGmailComposeUrl(enq)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Open in Gmail"
                                  style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                  {enq.email}
                                </a>
                              </td>
                              <td>
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '3px 10px',
                                    borderRadius: '999px',
                                    fontSize: '11.5px',
                                    fontWeight: 700,
                                    color: badge.color,
                                    background: badge.bg,
                                    border: `1px solid ${badge.border}`,
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  <BadgeIcon size={12} /> {enq.sourceTab || 'Contact Us'}
                                </span>
                              </td>
                              <td>
                                <span className="domain-pill">{enq.domain}</span>
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                                  {enq.enquiryType}
                                </div>
                              </td>
                              <td>
                                <div
                                  style={{
                                    maxWidth: '220px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    color: '#334155',
                                  }}
                                >
                                  {enq.message}
                                </div>
                              </td>
                              <td style={{ fontSize: '12.5px', color: '#64748b' }}>
                                {new Date(enq.submittedAt || enq.createdAt || Date.now()).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </td>
                              <td>
                                <span
                                  className={`status-pill-badge ${enq.status || 'new'}`}
                                  onClick={() => {
                                    const cycle = {
                                      new: 'in-review',
                                      'in-review': 'resolved',
                                      resolved: 'new',
                                    };
                                    handleUpdateStatus(enq.id, cycle[enq.status || 'new']);
                                  }}
                                  title="Click to cycle status: New → In Review → Resolved"
                                >
                                  ● {enq.status || 'new'}
                                </span>
                              </td>
                              <td>
                                <div className="admin-row-actions">
                                  <button
                                    className="btn-table-action"
                                    onClick={() => setSelectedEnquiry(enq)}
                                    title="View full enquiry"
                                  >
                                    <FiEye size={13} style={{ marginRight: 4 }} /> View
                                  </button>
                                  <button
                                    className="btn-table-action danger"
                                    onClick={() => handleDeleteEnquiry(enq.id)}
                                    title="Delete enquiry"
                                  >
                                    <FiTrash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REGISTERED USERS */}
          {activeTab === 'users' && (
            <div>
              <div className="admin-content-header">
                <div>
                  <h2 className="admin-content-title">Registered Engineers &amp; Developers</h2>
                  <p className="admin-content-subtitle">
                    All accounts created through the registration system.
                  </p>
                </div>
              </div>

              <div className="admin-panel-card">
                <div className="admin-panel-header">
                  <h3>Active Engineer Accounts ({filteredUsers.length})</h3>
                  <div className="admin-search-box">
                    <span className="admin-search-icon"><FiSearch size={15} /></span>
                    <input
                      type="text"
                      placeholder="Search user name or email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="admin-search-input"
                    />
                  </div>
                </div>

                <div className="admin-table-wrap">
                  {isLoading ? (
                    <div className="admin-empty-state-card">
                      <div className="admin-empty-icon-lg"><FiLoader size={38} className="admin-spin" /></div>
                      <p>Loading users...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="admin-empty-state-card">
                      <div className="admin-empty-icon-lg"><FiUsers size={38} /></div>
                      <p>No registered users found.</p>
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Engineer</th>
                          <th>Email Address</th>
                          <th>Role</th>
                          <th>Access Level</th>
                          <th>Registered Date</th>
                          <th>Last Session</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => (
                          <tr key={u.id}>
                            <td>
                              <div className="admin-client-cell">
                                <div className="admin-client-avatar">
                                  {(u.name || 'US').slice(0, 2).toUpperCase()}
                                </div>
                                <div className="admin-client-name">{u.name}</div>
                              </div>
                            </td>
                            <td>{u.email}</td>
                            <td>
                              <span className="domain-pill" style={{ textTransform: 'capitalize' }}>
                                {u.role}
                              </span>
                            </td>
                            <td>
                              <span className="status-pill-badge resolved">
                                {u.labAccess || 'Level 3 Pro'}
                              </span>
                            </td>
                            <td style={{ fontSize: '12.5px', color: '#64748b' }}>
                              {new Date(u.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td style={{ fontSize: '12.5px', color: '#64748b' }}>
                              {u.lastLogin
                                ? new Date(u.lastLogin).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : 'First Session'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADMIN CREDENTIALS & DIRECTORY */}
          {activeTab === 'credentials' && (
            <div>
              <div className="admin-content-header">
                <div>
                  <h2 className="admin-content-title">Admin Credentials &amp; Access Authority</h2>
                  <p className="admin-content-subtitle">
                    Create, manage, update, and remove administrator credentials across the platform.
                  </p>
                </div>
              </div>

              <div className="admin-panel-card">
                <div className="admin-cred-grid">
                  {/* Left Side: Create / Edit Admin Credential Form */}
                  <div className="admin-cred-box">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {editingAdminId ? (
                        <>
                          <FiEdit2 size={16} /> Edit Admin Credential
                        </>
                      ) : (
                        <>
                          <FiPlusCircle size={16} /> Create Admin Credential
                        </>
                      )}
                    </h4>
                    <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '16px', marginTop: '-6px' }}>
                      {editingAdminId
                        ? 'Update administrator account information or assign a new password.'
                        : 'Register a new administrative account with dashboard privileges.'}
                    </p>

                    {credMsg && (
                      <div
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          marginBottom: '16px',
                          fontSize: '13px',
                          background: credMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                          color: credMsg.type === 'success' ? '#15803d' : '#b91c1c',
                          border: `1px solid ${
                            credMsg.type === 'success' ? '#bbf7d0' : '#fecaca'
                          }`,
                        }}
                      >
                        {credMsg.text}
                      </div>
                    )}

                    <form onSubmit={handleSaveAdminCredential}>
                      <div className="admin-input-group">
                        <label>Admin Display Name</label>
                        <input
                          type="text"
                          className="admin-text-input"
                          placeholder="e.g. Alex Rivera"
                          value={adminForm.name}
                          onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="admin-input-group">
                        <label>Admin Email Address</label>
                        <input
                          type="email"
                          className="admin-text-input"
                          placeholder="admin@robogenesis.com"
                          value={adminForm.email}
                          onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="admin-input-group">
                        <label>
                          {editingAdminId
                            ? 'New Password (leave blank to keep current)'
                            : 'Access Password'}
                        </label>
                        <input
                          type="password"
                          className="admin-text-input"
                          placeholder={
                            editingAdminId ? 'Enter new password if changing' : 'Min 6 characters'
                          }
                          value={adminForm.password}
                          onChange={(e) =>
                            setAdminForm({ ...adminForm, password: e.target.value })
                          }
                          minLength={6}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                        <button
                          type="submit"
                          className="btn-admin-submit-action"
                          disabled={isSavingCred}
                        >
                          {isSavingCred
                            ? 'Saving...'
                            : editingAdminId
                            ? 'Update Credential'
                            : 'Create Admin Credential'}
                        </button>

                        {editingAdminId && (
                          <button
                            type="button"
                            onClick={handleCancelEditAdmin}
                            className="btn-table-action"
                            style={{ padding: '10px 16px', fontSize: '13px' }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Right Side: Admin Credentials Table */}
                  <div
                    className="admin-cred-box"
                    style={{ background: '#ffffff', padding: '0', overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid var(--admin-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <h4 style={{ margin: 0, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FiKey size={16} /> Admin Credentials Directory
                        </h4>
                        <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b' }}>
                          Total registered admin credentials: <strong>{adminList.length}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Admin</th>
                            <th>Email Address</th>
                            <th>Password</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminList.length === 0 ? (
                            <tr>
                              <td
                                colSpan={4}
                                style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}
                              >
                                No admin credentials found.
                              </td>
                            </tr>
                          ) : (
                            adminList.map((adm) => (
                              <tr key={adm.id}>
                                <td>
                                  <div className="admin-client-cell">
                                    <div
                                      className="admin-client-avatar"
                                      style={{ background: '#e0f2fe', color: '#0284c7' }}
                                    >
                                      {(adm.name || 'AD').slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="admin-client-name">{adm.name}</div>
                                  </div>
                                </td>
                                <td style={{ color: '#334155' }}>{adm.email}</td>
                                <td>
                                  <div className="admin-password-cell">
                                    <span className="admin-password-code">
                                      {hiddenPasswords[adm.id]
                                        ? '••••••••••••'
                                        : (adm.password || 'Admin@Robo2026!')}
                                    </span>
                                    <button
                                      type="button"
                                      className="btn-pw-toggle"
                                      onClick={() => togglePasswordVisibility(adm.id)}
                                      title={
                                        hiddenPasswords[adm.id]
                                          ? 'Show password'
                                          : 'Hide password'
                                      }
                                      aria-label="Toggle password visibility"
                                    >
                                      {hiddenPasswords[adm.id] ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                                    </button>
                                  </div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  <div
                                    className="admin-row-actions"
                                    style={{ justifyContent: 'flex-end', gap: '6px' }}
                                  >
                                    <button
                                      type="button"
                                      className="btn-small-icon edit"
                                      onClick={() => handleStartEditAdmin(adm)}
                                      title="Edit admin credential"
                                      aria-label="Edit"
                                    >
                                      <FiEdit2 size={13} />
                                    </button>
                                    <button
                                      type="button"
                                      className="btn-small-icon danger"
                                      onClick={() => handleDeleteAdmin(adm.id, adm.name)}
                                      title="Delete admin credential"
                                      aria-label="Delete"
                                    >
                                      <FiTrash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 3. DETAIL MODAL FOR ENQUIRY */}
      {selectedEnquiry && (
        <div className="admin-modal-overlay" onClick={() => setSelectedEnquiry(null)}>
          <div className="admin-modal-card-white" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: 800 }}>
                  {selectedEnquiry.fullName}
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b' }}>
                  Enquiry ID: <code>{selectedEnquiry.id}</code>
                </p>
              </div>
              <button
                className="admin-modal-close-btn"
                onClick={() => setSelectedEnquiry(null)}
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="admin-cred-list" style={{ gap: '10px' }}>
              <div className="admin-cred-item">
                <span className="admin-cred-label">Origin Tab:</span>
                {(() => {
                  const b = getSourceBadgeColor(selectedEnquiry.sourceTab);
                  const BadgeIcon = b.Icon;
                  return (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: b.color,
                        background: b.bg,
                        border: `1px solid ${b.border}`,
                      }}
                    >
                      <BadgeIcon size={12} /> {selectedEnquiry.sourceTab || 'Contact Us'}
                    </span>
                  );
                })()}
              </div>
              <div className="admin-cred-item">
                <span className="admin-cred-label">Email:</span>
                <a
                  href={getGmailComposeUrl(selectedEnquiry)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open in Gmail"
                  style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <SiGmail size={13} style={{ color: '#ea4335' }} /> {selectedEnquiry.email}
                </a>
              </div>
              <div className="admin-cred-item">
                <span className="admin-cred-label">Phone:</span>
                <span className="admin-cred-val">{selectedEnquiry.phone || 'N/A'}</span>
              </div>
              <div className="admin-cred-item">
                <span className="admin-cred-label">Domain:</span>
                <span className="domain-pill">{selectedEnquiry.domain}</span>
              </div>
              <div className="admin-cred-item">
                <span className="admin-cred-label">Enquiry Type:</span>
                <span className="admin-cred-val">{selectedEnquiry.enquiryType}</span>
              </div>
              <div className="admin-cred-item">
                <span className="admin-cred-label">Date Submitted:</span>
                <span className="admin-cred-val" style={{ fontSize: '12.5px' }}>
                  {new Date(selectedEnquiry.submittedAt || selectedEnquiry.createdAt || Date.now()).toLocaleString()}
                </span>
              </div>
              <div className="admin-cred-item">
                <span className="admin-cred-label">Status:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className={`status-pill-badge ${selectedEnquiry.status || 'new'}`}>
                    ● {selectedEnquiry.status || 'new'}
                  </span>
                  <div style={{ display: 'inline-flex', gap: '4px' }}>
                    {[
                      { key: 'new', label: 'New' },
                      { key: 'in-review', label: 'In Review' },
                      { key: 'resolved', label: 'Resolved' },
                    ].map((st) => (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => handleUpdateStatus(selectedEnquiry.id, st.key)}
                        style={{
                          padding: '2px 8px',
                          fontSize: '11px',
                          fontWeight: 600,
                          borderRadius: '4px',
                          border:
                            (selectedEnquiry.status || 'new') === st.key
                              ? '1px solid #0284c7'
                              : '1px solid #cbd5e1',
                          background:
                            (selectedEnquiry.status || 'new') === st.key ? '#e0f2fe' : '#ffffff',
                          color:
                            (selectedEnquiry.status || 'new') === st.key ? '#0369a1' : '#64748b',
                          cursor: 'pointer',
                        }}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <strong style={{ fontSize: '13px', color: '#475569' }}>Client Message:</strong>
              <div className="admin-message-quote">
                {selectedEnquiry.message}
              </div>
            </div>

            <div className="admin-modal-actions">
              <a
                href={getGmailComposeUrl(selectedEnquiry)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-admin-submit-action"
                title="Compose and send reply using Gmail in a new tab"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  width: 'auto',
                  padding: '10px 18px',
                }}
              >
                <SiGmail size={15} /> Reply via Email
              </a>
              <button
                className="btn-table-action"
                onClick={() => setSelectedEnquiry(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
