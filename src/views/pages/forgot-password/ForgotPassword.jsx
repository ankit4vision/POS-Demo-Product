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
import { cilEnvelopeClosed, cilArrowLeft, cilCheckCircle } from '@coreui/icons'
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
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody className="text-center">
                    <CIcon icon={cilCheckCircle} size="3xl" className="text-success mb-3" />
                    <h2 className="text-success mb-3">Password Reset Complete!</h2>
                    <p className="text-muted mb-4">
                      We've sent your new password to <strong>{email}</strong>
                    </p>
                    <p className="text-muted small mb-4">
                      Please check your email for the new password. You can now log in with the new password.
                    </p>
                    <CButton 
                      color="primary" 
                      onClick={handleBackToLogin}
                      className="px-4"
                    >
                      <CIcon icon={cilArrowLeft} className="me-2" />
                      Back to Login
                    </CButton>
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

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardHeader className="text-center">
                  <h2>Forgot Password</h2>
                  <p className="text-muted">
                    Enter your email address and we'll send you a new password.
                  </p>
                </CCardHeader>
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilEnvelopeClosed} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email address"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                          {loading ? (
                            <>
                              <CSpinner size="sm" className="me-2" />
                              Resetting...
                            </>
                          ) : (
                            'Reset Password'
                          )}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton 
                          color="link" 
                          className="px-0"
                          onClick={handleBackToLogin}
                        >
                          <CIcon icon={cilArrowLeft} className="me-2" />
                          Back to Login
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

export default ForgotPassword 