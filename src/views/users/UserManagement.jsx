import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const UserManagement = () => {
  const navigate = useNavigate()
  const { hasPermission } = useAuth();

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>User Management</strong>
          </CCardHeader>
          <CCardBody>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              {hasPermission && hasPermission('view_user') && (
                <CButton 
                  color="primary" 
                  className="me-md-2"
                  onClick={() => navigate('/users/list')}
                >
                  View Users
                </CButton>
              )}
              {hasPermission && hasPermission('view_role') && (
                <CButton 
                  color="success" 
                  className="me-md-2"
                  onClick={() => navigate('/users/roles')}
                >
                  Manage Roles
                </CButton>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UserManagement 