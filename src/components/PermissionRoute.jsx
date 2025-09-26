import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PermissionRoute = ({ 
  children, 
  requiredPermissions = [], 
  requiredRole = null,
  fallback = null,
  redirectTo = '/dashboard'
}) => {
  const location = useLocation()
  const { user, loading, hasAnyPermission, hasRole, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Admin role bypasses all permission checks
  if (hasRole('admin')) {
    return children
  }

  // Check role requirement first
  if (requiredRole && !hasRole(requiredRole)) {
    if (fallback) {
      return fallback
    }
    return <Navigate to={redirectTo} replace />
  }

  // Check permissions
  if (requiredPermissions.length > 0 && !hasAnyPermission(requiredPermissions)) {
    if (fallback) {
      return fallback
    }
    return <Navigate to={redirectTo} replace />
  }

  return children
}

export default PermissionRoute 