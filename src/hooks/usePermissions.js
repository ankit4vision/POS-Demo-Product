import { useAuth } from '../context/AuthContext'

export const usePermissions = () => {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions, 
    hasModulePermission, 
    hasRole,
    permissions,
    permissionsByModule 
  } = useAuth()

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasModulePermission,
    hasRole,
    permissions,
    permissionsByModule
  }
}

export default usePermissions 