import axios from 'axios'

// Set auth type: 'sanctum' for cookie/session, 'token' for Bearer token
const AUTH_TYPE = 'token' // or 'sanctum'

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Always send cookies for cross-origin requests
})

// Helper to fetch CSRF cookie for Sanctum
let csrfFetched = false;
async function ensureSanctumCsrfCookie() {
  if (!csrfFetched) {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
    csrfFetched = true;
  }
}

// Add request interceptor to add token to all requests if using token auth
api.interceptors.request.use(
  async (config) => {
    if (AUTH_TYPE === 'sanctum') {
      await ensureSanctumCsrfCookie();
      delete config.headers.Authorization;
    } else if (AUTH_TYPE === 'token') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
)

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api 