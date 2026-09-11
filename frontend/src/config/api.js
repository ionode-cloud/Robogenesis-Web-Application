/**
 * Robogenesis API Configuration
 * 
 * Production Setup:
 * - Frontend: https://robogenesis.in
 * - Backend: https://api.robogenesis.in
 */

export const getApiBaseUrl = () => {
  // 1. Explicit Vite environment variable (if provided at build time or Vercel env)
  if (import.meta.env.VITE_API_BASE_URL) {
    const envBase = import.meta.env.VITE_API_BASE_URL.trim().replace(/\/+$/, '');
    if (envBase) return envBase;
  }

  // 2. Client-side hostname detection in browser
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // When running on robogenesis.in or any subdomain
    if (host.includes('robogenesis.in')) {
      return 'https://api.robogenesis.in';
    }
    // Local development
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5000';
    }
  }

  // 3. Fallback for production builds
  if (import.meta.env.PROD) {
    return 'https://api.robogenesis.in';
  }

  return 'http://localhost:5000';
};

export const getApiUrl = (endpoint = '') => {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
};

export default getApiUrl;
