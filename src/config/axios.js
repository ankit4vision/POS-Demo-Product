import axios from 'axios'
import config from './environment.js'

const api = axios.create({
  baseURL: config.API_URL,
  timeout: config.API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Don't set Content-Type for FormData (let browser set it with boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle different error status codes
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      // Handle forbidden access (insufficient permissions)
      const errorMessage = error.response?.data?.message || 'Insufficient permissions'
      
      // Show user-friendly error message
      showPermissionError(errorMessage)
    } else if (error.response?.status === 404) {
      // Handle not found
      const errorMessage = error.response?.data?.message || 'Resource not found'
      showError(errorMessage)
    } else if (error.response?.status === 422) {
      // Handle validation errors
      const errorMessage = error.response?.data?.message || 'Validation failed'
      showError(errorMessage)
    } else if (error.response?.status >= 500) {
      // Handle server errors
      const errorMessage = error.response?.data?.message || 'Server error occurred'
      showError(errorMessage)
    } else if (!error.response) {
      // Handle network errors
      showError('Network error. Please check your internet connection.')
    } else {
      // Handle other errors
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred'
      showError(errorMessage)
    }
    
    return Promise.reject(error)
  }
)

// Helper function to show permission errors
const showPermissionError = (message) => {
  // Create a custom event for permission errors
  const event = new CustomEvent('permission-error', {
    detail: {
      message: message,
      type: 'permission',
      timestamp: new Date().toISOString()
    }
  })
  window.dispatchEvent(event)
}

// Helper function to show general errors
const showError = (message) => {
  // Create a custom event for general errors
  const event = new CustomEvent('api-error', {
    detail: {
      message: message,
      type: 'general',
      timestamp: new Date().toISOString()
    }
  })
  window.dispatchEvent(event)
}

export default api 