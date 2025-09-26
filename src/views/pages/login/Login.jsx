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
import { cilLockLocked, cilUser, cilInfo } from '@coreui/icons'
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
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    {error && (
                      <CAlert color="danger" className="mb-3">
                        {error}
                      </CAlert>
                    )}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton 
                          color="primary" 
                          className="px-4" 
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Logging in...' : 'Login'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton 
                          color="link" 
                          className="px-0"
                          onClick={() => navigate('/forgot-password')}
                        >
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard
                className="text-white bg-primary py-5"
                style={{ width: '44%' }}
              >
                <CCardBody className="text-center d-flex flex-column justify-content-center align-items-center">
                  <img
                    src={logo}
                    alt="KRIMAH LTD POS Logo"
                    style={{
                      maxWidth: '80%',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      marginBottom: '2rem'
                    }}
                  />
                  <p className="mt-3">
                    Your complete point of sale solution for managing inventory,
                    sales, and more.
                  </p>
                </CCardBody>
              </CCard>
            </CCardGroup>
            
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login 