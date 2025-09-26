import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormInput, CFormLabel, CButton, CImage, CAlert, CSpinner, CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import api from '../../config/axios'

const Profile = () => {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    bio: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [passwordSuccess, setPasswordSuccess] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/user/profile')
      setProfile(res.data.data)
    } catch (err) {
      setError('Failed to load profile.')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(null)
    setError(null)
    try {
      await api.put('/user/profile', profile)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError('Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    setPasswordSaving(true)
    setPasswordSuccess(null)
    setPasswordError(null)
    try {
      await api.put('/user/password', {
        current_password: passwordData.current_password,
        password: passwordData.new_password,
        password_confirmation: passwordData.new_password_confirmation,
      })
      setPasswordSuccess('Password updated successfully!')
      setPasswordData({ current_password: '', new_password: '', new_password_confirmation: '' })
    } catch (err) {
      let message = 'Failed to update password.'
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          // Laravel validation errors
          message = Object.values(err.response.data.errors).flat().join(' ')
        } else if (err.response.data.message) {
          message = err.response.data.message
        }
      }
      setPasswordError(message)
    } finally {
      setPasswordSaving(false)
    }
  }

  if (loading) return <CSpinner color="primary" />

  return (
    <CRow>
      <CCol xs={12} md={8}>
        <CCard className="mb-4">
          <CCardHeader>
            <CNav variant="tabs" role="tablist">
              <CNavItem>
                <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)} role="tab">Personal Information</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)} role="tab">Change Password</CNavLink>
              </CNavItem>
            </CNav>
          </CCardHeader>
          <CCardBody>
            <CTabContent>
              <CTabPane visible={activeTab === 0}>
                {error && <CAlert color="danger">{error}</CAlert>}
                {success && <CAlert color="success">{success}</CAlert>}
                <CForm onSubmit={handleProfileSave}>
                  <CRow>
                    <CCol xs={12} md={6} className="mb-3">
                      <CFormLabel>First Name</CFormLabel>
                      <CFormInput type="text" name="first_name" value={profile.first_name} onChange={handleProfileChange} />
                    </CCol>
                    <CCol xs={12} md={6} className="mb-3">
                      <CFormLabel>Last Name</CFormLabel>
                      <CFormInput type="text" name="last_name" value={profile.last_name} onChange={handleProfileChange} />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs={12} md={6} className="mb-3">
                      <CFormLabel>Email</CFormLabel>
                      <CFormInput type="email" name="email" value={profile.email} onChange={handleProfileChange} />
                    </CCol>
                    <CCol xs={12} md={6} className="mb-3">
                      <CFormLabel>Phone</CFormLabel>
                      <CFormInput type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs={12} className="mb-3">
                      <CFormLabel>Address</CFormLabel>
                      <CFormInput type="text" name="address" value={profile.address} onChange={handleProfileChange} />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs={12} md={6} className="mb-3">
                      <CFormLabel>City</CFormLabel>
                      <CFormInput type="text" name="city" value={profile.city} onChange={handleProfileChange} />
                    </CCol>
                    <CCol xs={12} md={6} className="mb-3">
                      <CFormLabel>Country</CFormLabel>
                      <CFormInput type="text" name="country" value={profile.country} onChange={handleProfileChange} />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs={12} className="mb-3">
                      <CFormLabel>Bio</CFormLabel>
                      <CFormInput type="textarea" rows={4} name="bio" value={profile.bio} onChange={handleProfileChange} />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs={12}>
                      <CButton color="primary" className="me-2" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</CButton>
                      <CButton color="secondary" type="button" onClick={fetchProfile} disabled={saving}>Cancel</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CTabPane>
              <CTabPane visible={activeTab === 1}>
                {passwordError && <CAlert color="danger">{passwordError}</CAlert>}
                {passwordSuccess && <CAlert color="success">{passwordSuccess}</CAlert>}
                <CForm onSubmit={handlePasswordSave}>
                  <CRow>
                    <CCol xs={12} className="mb-3">
                      <CFormLabel>Current Password</CFormLabel>
                      <CFormInput type="password" name="current_password" value={passwordData.current_password} onChange={handlePasswordChange} />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs={12} md={6} className="mb-3">
                      <CFormLabel>New Password</CFormLabel>
                      <CFormInput type="password" name="new_password" value={passwordData.new_password} onChange={handlePasswordChange} />
                    </CCol>
                    <CCol xs={12} md={6} className="mb-3">
                      <CFormLabel>Confirm New Password</CFormLabel>
                      <CFormInput type="password" name="new_password_confirmation" value={passwordData.new_password_confirmation} onChange={handlePasswordChange} />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs={12}>
                      <CButton color="primary" type="submit" disabled={passwordSaving}>{passwordSaving ? 'Updating...' : 'Update Password'}</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Profile 