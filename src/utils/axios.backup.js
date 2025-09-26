import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Important for Laravel Sanctum
  headers: {
    'Accept': 'application/json'
  }
})

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Don't set Content-Type for FormData - let browser set it automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    } else {
      // Set Content-Type for JSON requests
      config.headers['Content-Type'] = 'application/json'
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api 