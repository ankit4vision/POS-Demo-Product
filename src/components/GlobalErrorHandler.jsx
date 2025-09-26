import React, { useEffect, useState } from 'react'
import { CAlert, CButton } from '@coreui/react'

const GlobalErrorHandler = () => {
  const [alerts, setAlerts] = useState([])
  const [permissionError, setPermissionError] = useState(null)

  useEffect(() => {
    // Listen for permission errors
    const handlePermissionError = (event) => {
      const { message, type, timestamp } = event.detail
      
      // Add alert notification
      const newAlert = {
        id: `permission-${timestamp}`,
        message: message,
        type: 'danger',
        timestamp: timestamp,
        visible: true
      }
      
      setAlerts(prev => [...prev, newAlert])
      
      // Also set permission error for potential modal display
      setPermissionError(message)
      
      // Auto-remove alert after 8 seconds
      setTimeout(() => {
        setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id))
      }, 8000)
    }

    // Listen for general API errors
    const handleApiError = (event) => {
      const { message, type, timestamp } = event.detail
      
      // Add alert notification
      const newAlert = {
        id: `api-${timestamp}`,
        message: message,
        type: 'warning',
        timestamp: timestamp,
        visible: true
      }
      
      setAlerts(prev => [...prev, newAlert])
      
      // Auto-remove alert after 6 seconds
      setTimeout(() => {
        setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id))
      }, 6000)
    }

    // Add event listeners
    window.addEventListener('permission-error', handlePermissionError)
    window.addEventListener('api-error', handleApiError)

    // Cleanup event listeners
    return () => {
      window.removeEventListener('permission-error', handlePermissionError)
      window.removeEventListener('api-error', handleApiError)
    }
  }, [])

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const clearPermissionError = () => {
    setPermissionError(null)
  }

  return (
    <>
      {/* Alert Notifications */}
      <div 
        className="position-fixed top-0 end-0 p-3" 
        style={{ zIndex: 9999, maxWidth: '400px' }}
      >
        {alerts.map((alert) => (
          <CAlert
            key={alert.id}
            color={alert.type}
            dismissible
            onClose={() => dismissAlert(alert.id)}
            className="mb-2"
          >
            <div className="d-flex align-items-center">
              <div>
                <div className="fw-bold">
                  {alert.type === 'danger' ? '🚫 Access Denied' : '⚠️ Error'}
                </div>
                <div className="small">{alert.message}</div>
              </div>
            </div>
          </CAlert>
        ))}
      </div>

      {/* Permission Error Modal (if needed for more prominent display) */}
      {permissionError && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            zIndex: 9999 
          }}
          onClick={clearPermissionError}
        >
          <div className="bg-white rounded p-4 m-3" style={{ maxWidth: '500px' }}>
            <div className="d-flex align-items-center mb-3">
              <span className="text-danger me-2 fs-4">🚫</span>
              <h5 className="mb-0 text-danger">Access Denied</h5>
            </div>
            <p className="mb-3">{permissionError}</p>
            <div className="d-flex justify-content-end">
              <CButton 
                color="secondary" 
                onClick={clearPermissionError}
                size="sm"
              >
                Close
              </CButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default GlobalErrorHandler 