import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { cilEnvelopeClosed, cilArrowLeft, cilCheckCircle, cilUser, cilBarcode, cilCart, cilChart, cilSettings } from '@coreui/icons'
import { useAuth } from '../../../context/AuthContext.jsx'
import logo from '../../../assets/images/logo/logo1.png'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const { api } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/auth/forgot-password', {
        email: email.trim()
      })

      toast.success(response.data.message)
      setSuccess(true)
    } catch (error) {
      console.error('Forgot password error:', error)
      const message = error.response?.data?.message || 'Failed to reset password. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  if (success) {
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
                        <CIcon icon={cilCheckCircle} size="xl" style={{ color: '#28a745' }} />
                      </div>
                      <h3 className="fw-bold mb-3 text-dark" style={{ fontSize: '1.6rem' }}>Password Reset Complete!</h3>
                      <p className="mb-4 text-muted" style={{ fontSize: '1rem', lineHeight: 1.5 }}>
                        Your new password has been sent to your email address.
                      </p>
                    </div>
                  </CCol>

                  {/* Right Side - Success Message */}
                  <CCol md={6} className="p-4 d-flex flex-column justify-content-center">
                    <div className="text-center mb-4">
                    <CIcon icon={cilCheckCircle} size="3xl" className="text-success mb-3" />
                      <h2 className="fw-bold text-success mb-3" style={{ fontSize: '2rem' }}>Success!</h2>
                    <p className="text-muted mb-4">
                        We've sent your new password to <strong className="text-primary">{email}</strong>
                    </p>
                    <p className="text-muted small mb-4">
                      Please check your email for the new password. You can now log in with the new password.
                    </p>
                    </div>

                    <CButton 
                      color="primary" 
                      onClick={handleBackToLogin}
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
                      <CIcon icon={cilArrowLeft} className="me-2" />
                      Back to Login
                    </CButton>
                  </CCol>
                </CRow>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
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
                      <CIcon icon={cilEnvelopeClosed} size="xl" style={{ color: '#667eea' }} />
                    </div>
                    <h3 className="fw-bold mb-3 text-dark" style={{ fontSize: '1.6rem' }}>Forgot Password?</h3>
                    <p className="mb-4 text-muted" style={{ fontSize: '1rem', lineHeight: 1.5 }}>
                      Don't worry! We'll help you reset your password quickly and securely.
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

                {/* Right Side - Forgot Password Form */}
                <CCol md={6} className="p-4 d-flex flex-column justify-content-center">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '2rem' }}>Reset Password</h2>
                    <p className="text-muted">Enter your email address and we'll send you a new password</p>
                  </div>

                  <CForm onSubmit={handleSubmit}>
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
                          <CIcon icon={cilEnvelopeClosed} className="text-primary" />
                        </CInputGroupText>
                        <CFormInput
                          type="email"
                          placeholder="Enter your email address"
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

                    <div className="d-flex gap-3 mb-4">
                      <CButton 
                        type="submit"
                        disabled={loading}
                        className="flex-fill py-3 rounded-3 fw-bold border-0"
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
                            Resetting...
                          </>
                        ) : (
                          'Reset Password'
                        )}
                      </CButton>
                    </div>

                    <div className="text-center">
                      <CButton 
                        variant="link" 
                        className="p-0 text-decoration-none"
                        style={{ color: '#667eea' }}
                        onClick={handleBackToLogin}
                      >
                        <CIcon icon={cilArrowLeft} className="me-2" />
                        Back to Login
                      </CButton>
                    </div>
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

export default ForgotPassword 