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
  CBadge,
  CAlert,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CSpinner,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { cilSearch, cilFilter, cilPlus, cilPencil, cilTrash, cilInfo } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import api from '../../config/axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const UserList = () => {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [rolesLoading, setRolesLoading] = useState(false)
  const navigate = useNavigate()
  const { hasPermission } = useAuth();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [perPage] = useState(10)

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [currentPage, searchTerm, roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        per_page: perPage,
        search: searchTerm || undefined,
        role_id: roleFilter || undefined,
        status: statusFilter || undefined,
      }

      const response = await api.get('/users', { params })
      setUsers(response.data.data || [])
      setTotalPages(response.data.last_page || 1)
      setTotalUsers(response.data.total || 0)
      setError(null)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to fetch users. Please try again.')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      setRolesLoading(true)
      const response = await api.get('/roles')
      setRoles(response.data.data || [])
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setRolesLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`)
        fetchUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
        setError('Failed to delete user. Please try again.')
      }
    }
  }

  const handleEdit = (id) => {
    navigate(`/users/edit/${id}`)
  }

  const handleView = (id) => {
    navigate(`/users/view/${id}`)
  }

  const handleAdd = () => {
    navigate('/users/create')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers()
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setRoleFilter('')
    setStatusFilter('')
    setCurrentPage(1)
  }

  const getStatusBadge = (status) => {
    return status ? (
      <CBadge color="success">Active</CBadge>
    ) : (
      <CBadge color="danger">Inactive</CBadge>
    )
  }

  const getRoleNames = (userRoles) => {
    if (!userRoles || userRoles.length === 0) {
      return <span className="text-muted">No role assigned</span>
    }
    return userRoles.map(role => role.name).join(', ')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Users</strong>
                <span className="text-muted ms-2">({totalUsers} total)</span>
              </div>
              {hasPermission && hasPermission('create_user') && (
                <CButton
                  color="primary"
                  onClick={handleAdd}
                >
                  <CIcon icon={cilPlus} className="me-1" />
                  Add User
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

            {/* Search and Filter Section */}
            <div className="mb-4">
              <form onSubmit={handleSearch}>
                <CRow>
                  <CCol md={6}>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilSearch} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <CButton type="submit" color="primary">
                        Search
                      </CButton>
                    </CInputGroup>
                  </CCol>
                  <CCol md={6} className="text-end">
                    <CButton
                      color="secondary"
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="me-2"
                    >
                      <CIcon icon={cilFilter} className="me-1" />
                      {showFilters ? 'Hide' : 'Show'} Filters
                    </CButton>
                    {(searchTerm || roleFilter || statusFilter) && (
                      <CButton
                        color="light"
                        variant="outline"
                        onClick={handleClearFilters}
                      >
                        Clear All
                      </CButton>
                    )}
                  </CCol>
                </CRow>

                {/* Advanced Filters */}
                {showFilters && (
                  <CRow className="mt-3">
                    <CCol md={4}>
                      <CFormSelect
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        placeholder="Filter by role"
                      >
                        <option value="">All Roles</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormSelect
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                )}
              </form>
            </div>

            {/* Users Table */}
            {loading ? (
              <div className="text-center py-4">
                <CSpinner />
                <div className="mt-2">Loading users...</div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-muted">No users found</div>
                {searchTerm || roleFilter || statusFilter ? (
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={handleClearFilters}
                    className="mt-2"
                  >
                    Clear filters
                  </CButton>
                ) : (
                  <CButton
                    color="primary"
                    onClick={handleAdd}
                    className="mt-2"
                  >
                    Add your first user
                  </CButton>
                )}
              </div>
            ) : (
              <>
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Name</CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Phone</CTableHeaderCell>
                      <CTableHeaderCell>Role</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Created</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {users.map((user) => (
                      <CTableRow key={user.id}>
                        <CTableDataCell>
                          <div>
                            <div className="fw-bold">{user.name}</div>
                            {user.first_name && user.last_name && (
                              <small className="text-muted">
                                {user.first_name} {user.last_name}
                              </small>
                            )}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>{user.email}</CTableDataCell>
                        <CTableDataCell>
                          {user.phone || <span className="text-muted">-</span>}
                        </CTableDataCell>
                        <CTableDataCell>
                          {getRoleNames(user.roles)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {getStatusBadge(user.status)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {formatDate(user.created_at)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="btn-group" role="group">
                            {hasPermission && hasPermission('view_user') && (
                              <CButton color="info" size="sm" variant="outline" onClick={() => handleView(user.id)} title="View User">
                                <CIcon icon={cilInfo} />
                              </CButton>
                            )}
                            {hasPermission && hasPermission('edit_user') && (
                              <CButton color="primary" size="sm" variant="outline" onClick={() => handleEdit(user.id)} title="Edit User">
                                <CIcon icon={cilPencil} />
                              </CButton>
                            )}
                            {hasPermission && hasPermission('delete_user') && (
                              <CButton color="danger" size="sm" variant="outline" onClick={() => handleDelete(user.id)} title="Delete User">
                                <CIcon icon={cilTrash} />
                              </CButton>
                            )}
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <CPagination>
                      <CPaginationItem
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </CPaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <CPaginationItem
                          key={page}
                          active={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </CPaginationItem>
                      ))}
                      
                      <CPaginationItem
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </CPaginationItem>
                    </CPagination>
                  </div>
                )}
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UserList 