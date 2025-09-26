import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormCheck,
  CBadge,
  CAlert,
  CSpinner,
  CInputGroup,
  CInputGroupText,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { cilSearch, cilFilter, cilPlus, cilPencil, cilTrash, cilShieldAlt, cilUser, cilSettings, cilBasket, cilCart, cilTruck, cilPeople, cilMoney, cilChart, cilSpeedometer, cilClipboard, cilNotes, cilList, cilUserFollow, cilEnvelopeClosed, cilCreditCard } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import api from '../../config/axios'
import { useAuth } from '../../context/AuthContext'

const Roles = () => {
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [showModal, setShowModal] = useState(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [selectedPermissions, setSelectedPermissions] = useState([])

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Permission modal states
  const [permissionLoading, setPermissionLoading] = useState(false)
  const [permissionError, setPermissionError] = useState(null)
  const [permissionSuccess, setPermissionSuccess] = useState(null)
  const [permissionSearchTerm, setPermissionSearchTerm] = useState('')

  // Group permissions by module and submodule for matrix
  const [matrixRows, setMatrixRows] = useState([])
  const permissionTypes = ['create', 'edit', 'delete', 'view']

  const { hasPermission } = useAuth()

  useEffect(() => {
    fetchRoles()
    fetchPermissions()
  }, [])

  // Build matrix rows from permissions API data
  useEffect(() => {
    if (permissions.length > 0) {
      // Group by module/submodule
      const grouped = {}
      permissions.forEach((perm) => {
        const key = perm.module + '|' + (perm.submodule || perm.module)
        if (!grouped[key]) {
          grouped[key] = {
            module: perm.module,
            submodule: perm.submodule || perm.module,
            perms: {},
          }
        }
        grouped[key].perms[perm.type] = perm
      })
      setMatrixRows(Object.values(grouped))
    }
  }, [permissions])

  // State for checked permissions in the matrix
  const [checkedPermissions, setCheckedPermissions] = useState({})

  // When opening modal, set checkedPermissions from role's permissions
  const handleAssignPermissions = (role) => {
    setEditingRole(role)
    setShowPermissionsModal(true)
  }

  // Sync checkedPermissions when modal opens and matrixRows are ready
  useEffect(() => {
    if (showPermissionsModal && editingRole && matrixRows.length > 0) {
      // Build a set of permission IDs for quick lookup
      const assigned = new Set((editingRole.permissions || []).map((p) => p.id));
      // Build checkedPermissions state for the matrix
      const checked = {};
      matrixRows.forEach((row) => {
        checked[row.submodule] = {};
        permissionTypes.forEach((type) => {
          checked[row.submodule][type] = row.perms[type] ? assigned.has(row.perms[type].id) : false;
        });
      });
      setCheckedPermissions(checked);
    }
    // eslint-disable-next-line
  }, [showPermissionsModal, editingRole, matrixRows]);

  // Handle checkbox change
  const handleMatrixChange = (submodule, type) => {
    setCheckedPermissions((prev) => ({
      ...prev,
      [submodule]: {
        ...prev[submodule],
        [type]: !prev[submodule][type],
      },
    }))
  }

  // Handle Allow All
  const handleAllowAll = (submodule) => {
    const allChecked = permissionTypes.every((type) => checkedPermissions[submodule]?.[type])
    setCheckedPermissions((prev) => ({
      ...prev,
      [submodule]: permissionTypes.reduce((acc, type) => {
        acc[type] = !allChecked
        return acc
      }, {}),
    }))
  }

  // On save, collect all checked permission IDs and send to API
  const handleSavePermissions = async () => {
    if (!editingRole) return
    
    setPermissionLoading(true)
    setPermissionError(null)
    setPermissionSuccess(null)
    
    // Collect all checked permission IDs
    const permissionIds = []
    matrixRows.forEach((row) => {
      permissionTypes.forEach((type) => {
        if (checkedPermissions[row.submodule]?.[type] && row.perms[type]) {
          permissionIds.push(row.perms[type].id)
        }
      })
    })
    
    try {
      await api.put(`/roles/${editingRole.id}/permissions`, {
        permissions: permissionIds,
      })
      setPermissionSuccess(`Permissions updated successfully for role "${editingRole.name}"`)
      setTimeout(() => {
        setShowPermissionsModal(false)
        setPermissionSuccess(null)
        fetchRoles()
      }, 1500)
    } catch (error) {
      console.error('Error saving permissions:', error)
      setPermissionError(error.response?.data?.message || 'Failed to update permissions. Please try again.')
    } finally {
      setPermissionLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const response = await api.get('/roles')
      setRoles(response.data.data)
      setError(null)
    } catch (error) {
      console.error('Error fetching roles:', error)
      setError('Failed to fetch roles. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/permissions')
      setPermissions(response.data.data)
    } catch (error) {
      console.error('Error fetching permissions:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingRole) {
        await api.put(`/roles/${editingRole.id}`, formData)
      } else {
        await api.post('/roles', formData)
      }
      setShowModal(false)
      resetForm()
      fetchRoles()
    } catch (error) {
      console.error('Error saving role:', error)
    }
  }

  const handleEdit = (role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await api.delete(`/roles/${roleId}`)
        fetchRoles()
      } catch (error) {
        console.error('Error deleting role:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    })
    setEditingRole(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Helper to check if editing role is Admin
  const isAdminRole = editingRole && editingRole.name && editingRole.name.toLowerCase() === 'admin'

  // Filter roles based on search term (show all roles including deleted)
  const filteredRoles = roles.filter(role =>
    (typeof role.name === 'string' && role.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (typeof role.description === 'string' && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getRoleIcon = (roleName) => {
    const name = roleName.toLowerCase()
    if (name.includes('admin')) return cilShieldAlt
    if (name.includes('user')) return cilUser
    return cilSettings
  }

  const getRoleBadge = (roleName) => {
    const name = roleName.toLowerCase()
    if (name.includes('admin')) return <CBadge color="danger">Admin</CBadge>
    if (name.includes('manager')) return <CBadge color="warning">Manager</CBadge>
    if (name.includes('user')) return <CBadge color="info">User</CBadge>
    return <CBadge color="secondary">Custom</CBadge>
  }

  const getPermissionCountBadge = (count) => {
    if (count === 0) return <CBadge color="light">No Permissions</CBadge>
    if (count < 5) return <CBadge color="warning">{count} Permissions</CBadge>
    if (count < 15) return <CBadge color="info">{count} Permissions</CBadge>
    return <CBadge color="success">{count} Permissions</CBadge>
  }

  // Helper functions for permission modal
  const getModuleIcon = (moduleName) => {
    const name = moduleName.toLowerCase()
    if (name.includes('dashboard')) return cilSpeedometer
    if (name.includes('user')) return cilUser
    if (name.includes('product')) return cilBasket
    if (name.includes('customer')) return cilPeople
    if (name.includes('supplier')) return cilTruck
    if (name.includes('purchase')) return cilClipboard
    if (name.includes('pos')) return cilCart
    if (name.includes('sale')) return cilNotes
    if (name.includes('master')) return cilList
    if (name.includes('employee')) return cilUserFollow
    if (name.includes('expense')) return cilMoney
    if (name.includes('setting')) return cilSettings
    if (name.includes('email')) return cilEnvelopeClosed
    if (name.includes('payment')) return cilCreditCard
    return cilSettings
  }

  const getPermissionDescription = (moduleName, type) => {
    const descriptions = {
      dashboard: {
        create: 'Create dashboard widgets and reports',
        edit: 'Modify dashboard layout and settings',
        delete: 'Remove dashboard components',
        view: 'View dashboard and analytics'
      },
      user: {
        create: 'Create new user accounts',
        edit: 'Modify existing user information',
        delete: 'Remove user accounts',
        view: 'View user lists and details'
      },
      product: {
        create: 'Add new products to inventory',
        edit: 'Update product information and pricing',
        delete: 'Remove products from inventory',
        view: 'View product catalog and details'
      },
      customer: {
        create: 'Add new customer records',
        edit: 'Update customer information',
        delete: 'Remove customer records',
        view: 'View customer lists and details'
      },
      supplier: {
        create: 'Add new supplier records',
        edit: 'Update supplier information',
        delete: 'Remove supplier records',
        view: 'View supplier lists and details'
      },
      purchaseorder: {
        create: 'Create new purchase orders',
        edit: 'Modify purchase order details',
        delete: 'Delete purchase orders',
        view: 'View purchase order history'
      },
      purchasedorder: {
        create: 'Create purchased order records',
        edit: 'Update purchased order information',
        delete: 'Remove purchased order records',
        view: 'View purchased orders list'
      },
      pos: {
        create: 'Create new sales transactions',
        edit: 'Modify POS transactions',
        delete: 'Delete POS transactions',
        view: 'Access POS interface'
      },
      sale: {
        create: 'Create new sales records',
        edit: 'Modify sales information',
        delete: 'Delete sales records',
        view: 'View sales history and invoices'
      },
      master: {
        create: 'Create master data (categories, brands, units)',
        edit: 'Modify master data records',
        delete: 'Remove master data records',
        view: 'View master data lists'
      },
      employee: {
        create: 'Add new employee records',
        edit: 'Update employee information',
        delete: 'Remove employee records',
        view: 'View employee lists and details'
      },
      expense: {
        create: 'Add new expense records',
        edit: 'Update expense information',
        delete: 'Remove expense records',
        view: 'View expense lists and reports'
      },
      setting: {
        create: 'Create system settings',
        edit: 'Modify system configuration',
        delete: 'Remove system settings',
        view: 'View system settings'
      },
      email: {
        create: 'Send new emails',
        edit: 'Modify email templates and settings',
        delete: 'Delete email records',
        view: 'View email history and templates'
      },
      payment: {
        create: 'Create new payment transactions',
        edit: 'Modify payment records',
        delete: 'Delete payment transactions',
        view: 'View payment history and reports'
      }
    }
    
    const module = moduleName.toLowerCase()
    return descriptions[module]?.[type] || `${type} ${moduleName}`
  }

  const getSelectedPermissionsCount = () => {
    let count = 0
    matrixRows.forEach((row) => {
      permissionTypes.forEach((type) => {
        if (checkedPermissions[row.submodule]?.[type] && row.perms[type]) {
          count++
        }
      })
    })
    return count
  }

  const getTotalPermissionsCount = () => {
    let count = 0
    matrixRows.forEach((row) => {
      permissionTypes.forEach((type) => {
        if (row.perms[type]) {
          count++
        }
      })
    })
    return count
  }

  // Filter matrix rows based on search term
  const filteredMatrixRows = matrixRows.filter(row =>
    (typeof row.module === 'string' && row.module.toLowerCase().includes(permissionSearchTerm.toLowerCase())) ||
    (typeof row.submodule === 'string' && row.submodule.toLowerCase().includes(permissionSearchTerm.toLowerCase()))
  )

  // Group matrix rows by module for better hierarchy
  const groupedMatrixRows = filteredMatrixRows.reduce((acc, row) => {
    if (!acc[row.module]) {
      acc[row.module] = []
    }
    acc[row.module].push(row)
    return acc
  }, {})

  // Restore role
  const handleRestore = async (roleId) => {
    try {
      await api.put(`/roles/${roleId}/restore`)
      fetchRoles()
    } catch (error) {
      console.error('Error restoring role:', error)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Roles Management</strong>
                <span className="text-muted ms-2">({roles.length} total)</span>
              </div>
              {hasPermission && hasPermission('create_user') && (
                <CButton
                  color="primary"
                  onClick={() => {
                    resetForm()
                    setShowModal(true)
                  }}
                >
                  <CIcon icon={cilPlus} className="me-1" />
                  Add New Role
                </CButton>
              )}
            </div>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" className="mb-3">
                {error}
              </CAlert>
            )}

            {/* Search Section */}
            <div className="mb-4">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Search roles by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </div>

            {/* Roles Table */}
            {loading ? (
              <div className="text-center py-4">
                <CSpinner />
                <div className="mt-2">Loading roles...</div>
              </div>
            ) : filteredRoles.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-muted">
                  {searchTerm ? 'No roles found matching your search' : 'No roles found'}
                </div>
                {searchTerm && (
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={() => setSearchTerm('')}
                    className="mt-2"
                  >
                    Clear search
                  </CButton>
                )}
              </div>
            ) : (
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Role</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Permissions</CTableHeaderCell>
                    <CTableHeaderCell>Users</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredRoles.map((role) => (
                    <CTableRow key={role.id} className={role.is_deleted ? 'table-danger' : ''}>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <CIcon 
                              icon={getRoleIcon(role.name)} 
                              size="lg" 
                              className="text-primary"
                            />
                          </div>
                          <div>
                            <div className="fw-bold">{role.name}</div>
                            {getRoleBadge(role.name)}
                            {role.is_deleted && <CBadge color="danger" className="ms-2">Deleted</CBadge>}
                          </div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>
                          {role.description || (
                            <span className="text-muted">No description</span>
                          )}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {getPermissionCountBadge(role.permissions?.length || 0)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="light">
                          {role.users?.length || 0} users
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="btn-group" role="group">
                          {!role.is_deleted && (role.name?.toLowerCase() !== 'admin') ? (
                            <>
                              {hasPermission && hasPermission('edit_user') && (
                                <CButton
                                  color="primary"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(role)}
                                  title="Edit Role"
                                >
                                  <CIcon icon={cilPencil} />
                                </CButton>
                              )}
                              {hasPermission && hasPermission('edit_user') && (
                                <CButton
                                  color="info"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAssignPermissions(role)}
                                  title="Manage Permissions"
                                >
                                  <CIcon icon={cilSettings} />
                                </CButton>
                              )}
                              {hasPermission && hasPermission('delete_user') && (
                                <CButton
                                  color="danger"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(role.id)}
                                  title="Delete Role"
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              )}
                            </>
                          ) : !role.is_deleted && (role.name?.toLowerCase() === 'admin') ? null : (
                            <CButton
                              color="success"
                              size="sm"
                              variant="outline"
                              onClick={() => handleRestore(role.id)}
                              title="Restore Role"
                            >
                              Restore
                            </CButton>
                          )}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Role Form Modal */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader onClose={() => setShowModal(false)}>
          <CModalTitle>
            <div className="d-flex align-items-center">
              <CIcon 
                icon={editingRole ? cilPencil : cilPlus} 
                className="me-2 text-primary"
              />
              {editingRole ? 'Edit Role' : 'Add New Role'}
            </div>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel htmlFor="name">Role Name *</CFormLabel>
              <CFormInput
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter role name"
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="description">Description</CFormLabel>
              <CFormTextarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter role description (optional)"
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            {editingRole ? 'Update Role' : 'Create Role'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Permissions Assignment Modal */}
      <CModal visible={showPermissionsModal} onClose={() => setShowPermissionsModal(false)} size="xl">
        <CModalHeader onClose={() => setShowPermissionsModal(false)}>
          <CModalTitle>
            <div className="d-flex align-items-center">
              <CIcon icon={cilSettings} className="me-2 text-primary" />
              Assign Permissions to {editingRole?.name}
            </div>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Notifications */}
          {permissionError && (
            <CAlert color="danger" className="mb-3" dismissible onClose={() => setPermissionError(null)}>
              {permissionError}
            </CAlert>
          )}
          {permissionSuccess && (
            <CAlert color="success" className="mb-3">
              {permissionSuccess}
            </CAlert>
          )}
          {isAdminRole && (
            <CAlert color="info" className="mb-3">
              <strong>Admin Role:</strong> This role automatically has all permissions and cannot be modified.
            </CAlert>
          )}

          {/* Permission Summary */}
          <div className="mb-4 p-3 bg-light rounded">
            <div className="row text-center">
              <div className="col-md-3">
                <div className="fw-bold text-primary">{getSelectedPermissionsCount()}</div>
                <small className="text-muted">Selected</small>
              </div>
              <div className="col-md-3">
                <div className="fw-bold text-info">{getTotalPermissionsCount()}</div>
                <small className="text-muted">Total Available</small>
              </div>
              <div className="col-md-3">
                <div className="fw-bold text-success">
                  {Math.round((getSelectedPermissionsCount() / getTotalPermissionsCount()) * 100)}%
                </div>
                <small className="text-muted">Coverage</small>
              </div>
              <div className="col-md-3">
                <div className="fw-bold text-warning">{Object.keys(groupedMatrixRows).length}</div>
                <small className="text-muted">Modules</small>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="mb-4">
            <CInputGroup>
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <CFormInput
                placeholder="Search modules or permissions..."
                value={permissionSearchTerm}
                onChange={(e) => setPermissionSearchTerm(e.target.value)}
              />
              {permissionSearchTerm && (
                <CButton
                  color="light"
                  variant="outline"
                  onClick={() => setPermissionSearchTerm('')}
                >
                  Clear
                </CButton>
              )}
            </CInputGroup>
          </div>

          {/* Permissions Matrix as Cards/Chips */}
          <div className="row">
            {Object.entries(groupedMatrixRows).map(([moduleName, moduleRows]) => (
              <div key={moduleName} className="col-md-6 mb-4">
                <div className="card shadow-sm">
                  <div className="card-header bg-light d-flex align-items-center">
                    <CIcon icon={getModuleIcon(moduleName)} className="me-2 text-primary" />
                    <span className="fw-bold">{moduleName}</span>
                  </div>
                  <div className="card-body">
                    {moduleRows.map(row => (
                      <div key={row.submodule} className="mb-3">
                        <div className="fw-semibold mb-2">{row.submodule}</div>
                        <div className="d-flex flex-wrap gap-2">
                          {permissionTypes.map(type => (
                            <div
                              key={type}
                              className={`permission-chip p-2 rounded shadow-sm d-flex align-items-center ${checkedPermissions[row.submodule]?.[type] ? 'bg-success bg-opacity-25 text-success border border-success' : 'bg-light text-dark'}`}
                              style={{ minWidth: 100, cursor: isAdminRole || !row.perms[type] ? 'not-allowed' : 'pointer', opacity: isAdminRole || !row.perms[type] ? 0.6 : 1 }}
                              onClick={() => !(isAdminRole || !row.perms[type]) && handleMatrixChange(row.submodule, type)}
                              title={getPermissionDescription(moduleName, type)}
                            >
                              <input
                                type="checkbox"
                                checked={isAdminRole ? true : checkedPermissions[row.submodule]?.[type] || false}
                                disabled={isAdminRole || !row.perms[type]}
                                readOnly
                                className="me-2"
                              />
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CModalBody>
        <CModalFooter>
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="text-muted">
              <small>
                {getSelectedPermissionsCount()} of {getTotalPermissionsCount()} permissions selected
              </small>
            </div>
            <div>
              <CButton 
                color="secondary" 
                onClick={() => setShowPermissionsModal(false)}
                disabled={permissionLoading}
              >
                Cancel
              </CButton>
              <CButton 
                color="primary" 
                onClick={handleSavePermissions} 
                disabled={isAdminRole || permissionLoading}
                className="ms-2"
              >
                {permissionLoading ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  'Save Permissions'
                )}
              </CButton>
            </div>
          </div>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default Roles 