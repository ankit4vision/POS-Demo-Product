import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CCardHeader,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilInfo, cilBarcode, cilCart, cilChart, cilSettings } from '@coreui/icons'
import { useAuth } from '../../../context/AuthContext.jsx'
import logo from '../../../assets/images/logo/logo1.png'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  const from = location.state?.from?.pathname || '/dashboard'

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is already authenticated, redirecting to dashboard')
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      console.log('Attempting login...')
      const success = await login(email, password)
      
      if (success) {
        console.log('Login successful, redirecting to dashboard')
        navigate('/dashboard')
      } else {
        console.error('Login failed')
        setError('Invalid email or password')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-vh-100 d-flex flex-row align-items-center"
      style={{
        background: 'linear-gradient(135deg, #e8f2ff 0%, #f0e8ff 25%, #fef8ff 50%, #fff0f5 75%, #e8f8ff 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite'
      }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10} lg={9} xl={8}>
            <div 
              className="shadow-lg rounded-4 overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                minHeight: '500px'
              }}
            >
              <CRow className="g-0 h-100">
                {/* Left Side - Branding */}
                <CCol md={6} className="d-none d-md-flex align-items-center justify-content-center p-4"
                  style={{
                    background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 25%, #fef8ff 50%, #fff0f5 75%, #f0f8ff 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23667eea" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                      opacity: 0.5
                    }}
                  />
                  <div className="text-center position-relative">
                    <div className="mb-4">
                      <img
                        src={logo}
                        alt="POS Logo"
                        style={{
                          height: '40px',
                          width: 'auto',
                          marginBottom: '1.5rem'
                        }}
                      />
                    </div>
                    <div 
                      className="mb-4 d-flex align-items-center justify-content-center"
                      style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(102, 126, 234, 0.1)',
                        borderRadius: '50%',
                        backdropFilter: 'blur(10px)',
                        margin: '0 auto'
                      }}
                    >
                      <CIcon icon={cilUser} size="xl" style={{ color: '#667eea' }} />
                    </div>
                    <h3 className="fw-bold mb-3 text-dark" style={{ fontSize: '1.6rem' }}>POS Management System</h3>
                    <p className="mb-4 text-muted" style={{ fontSize: '1rem', lineHeight: 1.5 }}>
                      Streamline your business operations with our comprehensive point of sale solution.
                    </p>
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <CIcon icon={cilBarcode} style={{ color: '#667eea', fontSize: '1.2rem' }} />
                        <span className="text-dark fw-medium">Point of Sale</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <CIcon icon={cilUser} style={{ color: '#667eea', fontSize: '1.2rem' }} />
                        <span className="text-dark fw-medium">Customer Management</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <CIcon icon={cilCart} style={{ color: '#667eea', fontSize: '1.2rem' }} />
                        <span className="text-dark fw-medium">Inventory Control</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <CIcon icon={cilChart} style={{ color: '#667eea', fontSize: '1.2rem' }} />
                        <span className="text-dark fw-medium">Sales Reports</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <CIcon icon={cilSettings} style={{ color: '#667eea', fontSize: '1.2rem' }} />
                        <span className="text-dark fw-medium">System Settings</span>
                      </div>
                    </div>
                  </div>
                </CCol>

                {/* Right Side - Login Form */}
                <CCol md={6} className="p-4 d-flex flex-column justify-content-center">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '2rem' }}>Welcome Back</h2>
                    <p className="text-muted">Sign in to your account to continue</p>
                    
                    {/* Demo Credentials Info */}
                    <div 
                      className="mt-3 p-3 rounded-3"
                      style={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        border: '1px solid rgba(102, 126, 234, 0.2)'
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        <CIcon icon={cilInfo} className="text-primary me-2" />
                        <span className="fw-bold text-primary small">DEMO CREDENTIALS</span>
                      </div>
                      <div className="text-start">
                        <div className="mb-1">
                          <strong className="text-dark">Email:</strong> 
                          <span className="text-muted ms-1">demo@example.com</span>
                        </div>
                        <div>
                          <strong className="text-dark">Password:</strong> 
                          <span className="text-muted ms-1">demo123</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CForm onSubmit={handleSubmit}>
                    {error && (
                      <CAlert 
                        color="danger" 
                        className="mb-4 rounded-3 border-0"
                        style={{ 
                          background: 'rgba(229, 83, 83, 0.1)',
                          color: '#e55353'
                        }}
                      >
                        <CIcon icon={cilInfo} className="me-2" />
                        {error}
                      </CAlert>
                    )}

                    <div className="mb-4">
                      <label className="form-label fw-medium text-dark mb-2">Email Address</label>
                    <CInputGroup className="mb-3">
                        <CInputGroupText 
                          style={{ 
                            background: 'rgba(102, 126, 234, 0.1)',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            borderRight: 'none',
                            padding: '0.6rem 0.8rem'
                          }}
                        >
                          <CIcon icon={cilUser} className="text-primary" />
                      </CInputGroupText>
                      <CFormInput
                          placeholder="Enter your email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                          style={{
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            borderLeft: 'none',
                            background: 'rgba(255, 255, 255, 0.8)',
                            padding: '0.6rem 0.8rem'
                          }}
                      />
                    </CInputGroup>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-medium text-dark mb-2">Password</label>
                      <CInputGroup className="mb-3">
                        <CInputGroupText 
                          style={{ 
                            background: 'rgba(102, 126, 234, 0.1)',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            borderRight: 'none',
                            padding: '0.6rem 0.8rem'
                          }}
                        >
                          <CIcon icon={cilLockLocked} className="text-primary" />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                          placeholder="Enter your password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                          style={{
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            borderLeft: 'none',
                            background: 'rgba(255, 255, 255, 0.8)',
                            padding: '0.6rem 0.8rem'
                          }}
                      />
                    </CInputGroup>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="rememberMe"
                          style={{ 
                            accentColor: '#667eea',
                            marginRight: '0.5rem'
                          }}
                        />
                        <label className="form-check-label text-muted" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                        <CButton 
                        variant="link" 
                        className="p-0 text-decoration-none"
                        style={{ color: '#667eea' }}
                          onClick={() => navigate('/forgot-password')}
                        >
                          Forgot password?
                        </CButton>
                    </div>

                    <CButton 
                      type="submit"
                      disabled={loading}
                      className="w-100 py-3 rounded-3 fw-bold border-0"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {loading ? (
                        <>
                          <CSpinner size="sm" className="me-2" />
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </CButton>
                  </CForm>
                </CCol>

              </CRow>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login 