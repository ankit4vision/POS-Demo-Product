import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CButton, CAlert, CSpinner } from '@coreui/react'
import { cilBan, cilTestTube, cilCheck } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import api from '../config/axios'
import { useAuth } from '../context/AuthContext'

const PermissionTest = () => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  
  // Safely get auth context
  let hasPermission = () => false
  let hasRole = () => false
  
  try {
    const auth = useAuth()
    hasPermission = auth.hasPermission || (() => false)
    hasRole = auth.hasRole || (() => false)
  } catch (err) {
    console.error('Error getting auth context:', err)
    setError('Failed to load authentication context')
  }

  const testPermission = async (endpoint, description, expectedError = null) => {
    if (loading) return
    
    setLoading(true)
    try {
      await api.get(endpoint)
      setResults(prev => [...prev, {
        endpoint,
        description,
        status: 'success',
        message: 'Unexpected success - this should have failed!'
      }])
    } catch (error) {
      const isExpectedError = expectedError ? 
        error.response?.status === expectedError : 
        error.response?.status === 403
      
      setResults(prev => [...prev, {
        endpoint,
        description,
        status: isExpectedError ? 'expected' : 'unexpected',
        message: error.response?.data?.message || error.message,
        errorType: error.response?.data?.error_type,
        statusCode: error.response?.status
      }])
    } finally {
      setLoading(false)
    }
  }

  const runAllTests = async () => {
    setResults([])
    setError(null)
    
    // Test various endpoints that should trigger permission errors
    await testPermission('/users', 'Test User List Access (view_user)', 403)
    await testPermission('/roles', 'Test Role List Access (view_role)', 403)
    await testPermission('/products', 'Test Product List Access (view_product)', 403)
    await testPermission('/customers', 'Test Customer List Access (view_customer)', 403)
    await testPermission('/suppliers', 'Test Supplier List Access (view_supplier)', 403)
    await testPermission('/employees', 'Test Employee List Access (view_employee)', 403)
    await testPermission('/expenses', 'Test Expense List Access (view_expense)', 403)
    await testPermission('/dashboard/summary', 'Test Dashboard Access (view_dashboard)', 403)
  }

  const getStatusIcon = (status) => {
    try {
      switch (status) {
        case 'success':
          return <CIcon icon={cilCheck} className="text-success" />
        case 'expected':
          return <CIcon icon={cilBan} className="text-warning" />
        case 'unexpected':
          return <CIcon icon={cilBan} className="text-danger" />
        default:
          return null
      }
    } catch (err) {
      console.error('Error rendering status icon:', err)
      return null
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <span className="badge bg-success">Success</span>
      case 'expected':
        return <span className="badge bg-warning">Expected Error</span>
      case 'unexpected':
        return <span className="badge bg-danger">Unexpected Error</span>
      default:
        return null
    }
  }

  if (error) {
    return (
      <div className="container-fluid">
        <CAlert color="danger">
          <strong>Error:</strong> {error}
        </CAlert>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <CCard className="mb-4">
        <CCardHeader>
          <div className="d-flex align-items-center">
            <CIcon icon={cilTestTube} className="me-2 text-primary" />
            <h4 className="mb-0">Permission Error Testing</h4>
          </div>
        </CCardHeader>
        <CCardBody>
          <CAlert color="info" className="mb-4">
            <strong>Purpose:</strong> This page tests the permission error handling system. 
            It will make API calls to endpoints that require specific permissions and show how 
            the system handles insufficient permissions.
          </CAlert>

          <div className="mb-4">
            <CButton 
              color="primary" 
              onClick={runAllTests}
              disabled={loading}
              className="me-2"
            >
              {loading ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Running Tests...
                </>
              ) : (
                <>
                  <CIcon icon={cilTestTube} className="me-2" />
                  Run Permission Tests
                </>
              )}
            </CButton>
            
            <CButton 
              color="secondary" 
              onClick={() => setResults([])}
              disabled={loading}
            >
              Clear Results
            </CButton>
          </div>

          {results.length > 0 && (
            <div className="mt-4">
              <h5>Test Results ({results.length})</h5>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Endpoint</th>
                      <th>Description</th>
                      <th>Message</th>
                      <th>Error Type</th>
                      <th>Status Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            {getStatusIcon(result.status)}
                            {getStatusBadge(result.status)}
                          </div>
                        </td>
                        <td>
                          <code>{result.endpoint}</code>
                        </td>
                        <td>{result.description}</td>
                        <td>
                          <small className="text-muted">{result.message}</small>
                        </td>
                        <td>
                          {result.errorType && (
                            <span className="badge bg-info">{result.errorType}</span>
                          )}
                        </td>
                        <td>
                          {result.statusCode && (
                            <span className="badge bg-secondary">{result.statusCode}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-4">
            <h5>Current User Permissions</h5>
            <div className="row">
              <div className="col-md-6">
                <strong>Roles:</strong>
                <ul className="list-unstyled ms-3">
                  {hasRole('admin') && <li><span className="badge bg-danger">Admin</span></li>}
                  {hasRole('manager') && <li><span className="badge bg-warning">Manager</span></li>}
                  {hasRole('user') && <li><span className="badge bg-info">User</span></li>}
                </ul>
              </div>
              <div className="col-md-6">
                <strong>Key Permissions:</strong>
                <ul className="list-unstyled ms-3">
                  {hasPermission('view_user') && <li><span className="badge bg-success">view_user</span></li>}
                  {hasPermission('create_user') && <li><span className="badge bg-success">create_user</span></li>}
                  {hasPermission('edit_user') && <li><span className="badge bg-success">edit_user</span></li>}
                  {hasPermission('delete_user') && <li><span className="badge bg-success">delete_user</span></li>}
                  {hasPermission('view_product') && <li><span className="badge bg-success">view_product</span></li>}
                  {hasPermission('view_customer') && <li><span className="badge bg-success">view_customer</span></li>}
                </ul>
              </div>
            </div>
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default PermissionTest 