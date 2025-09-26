/**
 * Environment Configuration Utility
 * Provides type-safe access to environment variables
 */

const config = {
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Krimah POS',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  API_RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
  
  // Debug Configuration
  DEBUG: import.meta.env.VITE_DEBUG === 'true',
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  
  // Feature Flags
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  ENABLE_DEBUG_TOOLS: import.meta.env.VITE_ENABLE_DEBUG_TOOLS === 'true',
  ENABLE_PERFORMANCE_MONITORING: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
  
  // External Services
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  
  // Security
  ENABLE_HTTPS_ONLY: import.meta.env.VITE_ENABLE_HTTPS_ONLY === 'true',
  ENABLE_CONTENT_SECURITY_POLICY: import.meta.env.VITE_ENABLE_CONTENT_SECURITY_POLICY === 'true',
  
  // Performance
  ENABLE_COMPRESSION: import.meta.env.VITE_ENABLE_COMPRESSION === 'true',
  ENABLE_CACHING: import.meta.env.VITE_ENABLE_CACHING === 'true',
  
  // Pusher Configuration (if using real-time features)
  PUSHER_APP_KEY: import.meta.env.VITE_PUSHER_APP_KEY,
  PUSHER_HOST: import.meta.env.VITE_PUSHER_HOST,
  PUSHER_PORT: import.meta.env.VITE_PUSHER_PORT,
  PUSHER_SCHEME: import.meta.env.VITE_PUSHER_SCHEME,
  PUSHER_APP_CLUSTER: import.meta.env.VITE_PUSHER_APP_CLUSTER,
};

// Helper functions
export const isDevelopment = () => config.APP_ENV === 'development';
export const isProduction = () => config.APP_ENV === 'production';
export const isDebugEnabled = () => config.DEBUG;

// Log configuration in development
if (isDevelopment() && isDebugEnabled()) {
  console.log('🔧 Environment Configuration:', {
    APP_NAME: config.APP_NAME,
    APP_ENV: config.APP_ENV,
    API_URL: config.API_URL,
    DEBUG: config.DEBUG,
  });
}

export default config; 