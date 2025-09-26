import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../config/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [permissionsByModule, setPermissionsByModule] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('No token found in localStorage')
        setLoading(false)
        return
      }

      console.log('Checking authentication with token:', token)
      console.log('Making request to:', '/auth/user')
      const response = await api.get('/auth/user')
      console.log('Auth check response:', response.data)
      
      if (response.data.user) {
        setUser(response.data.user)
        setPermissions(response.data.permissions || [])
        setPermissionsByModule(response.data.permissionsByModule || {})
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      })
      if (error.response) {
        setError(error.response.data.message || 'Authentication failed')
      } else if (error.request) {
        setError('Unable to connect to the server. Please check your internet connection.')
      } else {
        setError('An unexpected error occurred')
      }
      localStorage.removeItem('token')
      setUser(null)
      setPermissions([])
      setPermissionsByModule({})
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Login request data:', { email: email.trim(), password })
      
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password
      })
      
      console.log('Login response:', response.data)
      
      const { token, user, permissions: userPermissions, permissionsByModule: userPermissionsByModule } = response.data
      
      if (token) {
        localStorage.setItem('token', token)
        console.log('Token stored:', token)
        setUser(user)
        setPermissions(userPermissions || [])
        setPermissionsByModule(userPermissionsByModule || {})
        return true
      } else {
        console.error('No token in response')
        setError('Invalid response from server')
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat()
        setError(errorMessages[0] || 'Invalid credentials')
      } else if (error.request) {
        setError('Unable to connect to the server. Please check your internet connection.')
      } else {
        setError('An unexpected error occurred')
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
      if (error.response) {
        setError(error.response.data.message || 'Logout failed')
      } else if (error.request) {
        setError('Unable to connect to the server')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      setPermissions([])
      setPermissionsByModule({})
      // Use window.location instead of navigate to avoid hook issues
      window.location.href = '/login'
    }
  }

  // Permission checking methods
  const hasPermission = (permission) => {
    // Admin role bypasses all permissions
    if (hasRole('admin')) {
      return true;
    }
    if (!Array.isArray(permissions)) return false;
    return permissions.includes(permission);
  }

  const hasAnyPermission = (permissionList) => {
    // Admin role bypasses all permissions
    if (hasRole('admin')) {
      console.log('hasAnyPermission: Admin bypass for', permissionList)
      return true
    }
    
    if (!Array.isArray(permissionList)) {
      permissionList = [permissionList]
    }
    const result = permissionList.some(permission => permissions.includes(permission))
    console.log('hasAnyPermission:', { permissionList, result, permissions })
    return result
  }

  const hasAllPermissions = (permissionList) => {
    // Admin role bypasses all permissions
    if (hasRole('admin')) {
      return true
    }
    
    if (!Array.isArray(permissionList)) {
      permissionList = [permissionList]
    }
    return permissionList.every(permission => permissions.includes(permission))
  }

  const hasModulePermission = (module, submodule, type) => {
    // Admin role bypasses all permissions
    if (hasRole('admin')) {
      return true
    }
    
    const modulePermissions = permissionsByModule[module]
    if (!modulePermissions) return false
    
    const submodulePermissions = modulePermissions[submodule]
    if (!submodulePermissions) return false
    
    const permissionName = `${type}_${submodule.toLowerCase()}`
    return submodulePermissions.includes(permissionName)
  }

  const hasRole = (roleName) => {
    if (!user || !user.roles) {
      console.log('hasRole: No user or roles found', { user, roles: user?.roles })
      return false
    }
    
    const hasRoleResult = user.roles.some(role => role.name.toLowerCase() === roleName.toLowerCase())
    return hasRoleResult
  }

  const value = {
    user,
    permissions,
    permissionsByModule,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    clearError: () => setError(null),
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasModulePermission,
    hasRole,
    api
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext 