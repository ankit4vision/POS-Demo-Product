import React from 'react'
import { useAuth } from '../context/AuthContext'

const PermissionGuard = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallback = null,
}) => {
  const { hasPermission, hasRole } = useAuth()

  const hasRequiredPermission =
    requiredPermissions.length === 0 ||
    requiredPermissions.some(permission => hasPermission(permission))

  const hasRequiredRole =
    requiredRoles.length === 0 ||
    requiredRoles.some(role => hasRole(role))

  if (hasRequiredPermission || hasRequiredRole) {
    return <>{children}</>
  }

  return fallback || null
}

export default PermissionGuard 