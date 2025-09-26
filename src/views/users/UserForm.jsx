import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormSwitch,
  CAlert,
  CFormFeedback,
} from '@coreui/react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import api from '../../config/axios'
import { useAuth } from '../../context/AuthContext'

const UserForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role_id: '',
    password: '',
    password_confirmation: '',
    status: true,
    first_name: '',
    last_name: '',
    address: '',
    city: '',
    country: '',
    bio: '',
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const { hasPermission } = useAuth();

  const isEditing = !!id
  const isViewing = location.pathname.includes('/view/')
  const canRender = (
    (!isEditing && !isViewing && hasPermission && hasPermission('create_user')) ||
    (isEditing && !isViewing && hasPermission && hasPermission('edit_user')) ||
    (isViewing && hasPermission && hasPermission('view_user'))
  );
  if (!canRender) {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <CAlert color="danger">You do not have permission to access this page.</CAlert>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }

  useEffect(() => {
    fetchRoles()
    if (isEditing || isViewing) {
      fetchUser()
    }
  }, [id])

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: `${prev.first_name} ${prev.last_name}`.trim(),
    }))
  }, [formData.first_name, formData.last_name])

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles')
      setRoles(response.data.data)
    } catch (error) {
      console.error('Error fetching roles:', error)
      setError('Failed to fetch roles')
    }
  }

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/users/${id}`)
      const user = response.data.data
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role_id: user.roles && user.roles.length > 0 ? user.roles[0].id : '',
        status: user.status,
        password: '',
        password_confirmation: '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        bio: user.bio || '',
      })
    } catch (error) {
      console.error('Error fetching user:', error)
      setError('Failed to fetch user details')
    } finally {
      setLoading(false)
    }
  }

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Full name is required'
        if (value.trim().length < 2) return 'Full name must be at least 2 characters'
        if (value.trim().length > 50) return 'Full name must be less than 50 characters'
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Full name can only contain letters and spaces'
        return null

      case 'email':
        if (!value.trim()) return 'Email address is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address'
        return null

      case 'phone':
        // No strict phone validation; allow any input (or just check for non-empty if required)
        return null

      case 'role_id':
        if (!value) return 'Role selection is required'
        return null

      case 'password':
        if (!isEditing) {
          if (!value) return 'Password is required'
          if (value.length < 4) return 'Password must be at least 4 characters'
        }
        return null

      case 'password_confirmation':
        if (!isEditing) {
          if (!value) return 'Password confirmation is required'
          if (value !== formData.password) return 'Passwords do not match'
        }
        return null

      default:
        return null
    }
  }

  const validateForm = () => {
    const newErrors = {}
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field])
      if (error) {
        newErrors[field] = error
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Prevent submission in view mode
    if (isViewing) {
      return
    }
    
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Mark all fields as touched for validation display
    const allTouched = {}
    Object.keys(formData).forEach(field => {
      allTouched[field] = true
    })
    setTouched(allTouched)

    // Validate form
    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      // Always recompute name from first_name and last_name
      const recomputedName = `${formData.first_name} ${formData.last_name}`.trim()
      const submitData = {
        ...formData,
        name: recomputedName,
        status: formData.status ? 1 : 0, // Convert boolean to integer
        role_id: formData.role_id ? parseInt(formData.role_id, 10) : '', // Ensure integer
      }

      // Remove password fields if editing and passwords are empty
      if (isEditing && !submitData.password && !submitData.password_confirmation) {
        delete submitData.password
        delete submitData.password_confirmation
      }

      if (isEditing) {
        await api.put(`/users/${id}`, submitData)
        setSuccess('User updated successfully!')
      } else {
        await api.post('/users', submitData)
        setSuccess('User created successfully!')
      }
      
      setTimeout(() => {
        navigate('/users/list')
      }, 1500)
    } catch (error) {
      console.error('Error saving user:', error)
      if (error.response?.data?.errors) {
        // Handle Laravel validation errors
        const apiErrors = {}
        Object.keys(error.response.data.errors).forEach(field => {
          apiErrors[field] = error.response.data.errors[field][0]
        })
        setErrors(apiErrors)
      } else if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Failed to save user. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/users/list')
  }

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName] ? errors[fieldName] : null
  }

  if (loading && isEditing) {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>
              {isViewing ? 'View User' : isEditing ? 'Edit User' : 'Create New User'}
            </strong>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" className="mb-3">
                {error}
              </CAlert>
            )}
            {success && (
              <CAlert color="success" className="mb-3">
                {success}
              </CAlert>
            )}
            
            <CForm onSubmit={handleSubmit} noValidate>
              {/* First Name, Last Name, Full Name (auto) */}
              <CRow>
                <CCol md={6} className="mb-3">
                  <CFormLabel htmlFor="first_name">First Name</CFormLabel>
                  <CFormInput 
                    type="text" 
                    id="first_name" 
                    name="first_name" 
                    value={formData.first_name} 
                    onChange={handleChange}
                    readOnly={isViewing}
                    plainText={isViewing}
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormLabel htmlFor="last_name">Last Name</CFormLabel>
                  <CFormInput 
                    type="text" 
                    id="last_name" 
                    name="last_name" 
                    value={formData.last_name} 
                    onChange={handleChange}
                    readOnly={isViewing}
                    plainText={isViewing}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={12} className="mb-3">
                  <CFormLabel htmlFor="name">Full Name (auto)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    readOnly
                    plainText
                  />
                </CCol>
              </CRow>
              {/* Email, Phone, Role */}
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="email">Email Address *</CFormLabel>
                    <CFormInput
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={!!getFieldError('email')}
                      required
                      readOnly={isViewing}
                      plainText={isViewing}
                    />
                    <CFormFeedback invalid>
                      {getFieldError('email')}
                    </CFormFeedback>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="phone">Phone Number</CFormLabel>
                    <CFormInput
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={!!getFieldError('phone')}
                      placeholder="+1234567890"
                      readOnly={isViewing}
                      plainText={isViewing}
                    />
                    <CFormFeedback invalid>
                      {getFieldError('phone')}
                    </CFormFeedback>
                  </div>
                </CCol>
              </CRow>
              <CRow>
                <CCol md={12}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="role_id">Role *</CFormLabel>
                    <CFormSelect
                      id="role_id"
                      name="role_id"
                      value={formData.role_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={!!getFieldError('role_id')}
                      required
                      disabled={isViewing}
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </CFormSelect>
                    <CFormFeedback invalid>
                      {getFieldError('role_id')}
                    </CFormFeedback>
                  </div>
                </CCol>
              </CRow>
              {/* Address, City, Country, Bio */}
              <CRow>
                <CCol md={6} className="mb-3">
                  <CFormLabel htmlFor="address">Address</CFormLabel>
                  <CFormInput 
                    type="text" 
                    id="address" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange}
                    readOnly={isViewing}
                    plainText={isViewing}
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormLabel htmlFor="city">City</CFormLabel>
                  <CFormInput 
                    type="text" 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange}
                    readOnly={isViewing}
                    plainText={isViewing}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={6} className="mb-3">
                  <CFormLabel htmlFor="country">Country</CFormLabel>
                  <CFormInput 
                    type="text" 
                    id="country" 
                    name="country" 
                    value={formData.country} 
                    onChange={handleChange}
                    readOnly={isViewing}
                    plainText={isViewing}
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormLabel htmlFor="bio">Bio</CFormLabel>
                  <CFormInput 
                    type="text" 
                    id="bio" 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleChange}
                    readOnly={isViewing}
                    plainText={isViewing}
                  />
                </CCol>
              </CRow>
              {/* Password fields (if creating) */}
              {!isEditing && (
                <CRow>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="password">Password *</CFormLabel>
                      <CFormInput
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={!!getFieldError('password')}
                        required={!isEditing}
                      />
                      <CFormFeedback invalid>
                        {getFieldError('password')}
                      </CFormFeedback>
                      <small className="form-text text-muted">
                        Password must be at least 4 characters.
                      </small>
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="password_confirmation">Confirm Password *</CFormLabel>
                      <CFormInput
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={!!getFieldError('password_confirmation')}
                        required={!isEditing}
                      />
                      <CFormFeedback invalid>
                        {getFieldError('password_confirmation')}
                      </CFormFeedback>
                    </div>
                  </CCol>
                </CRow>
              )}
              {/* Status switch */}
              <div className="mb-3">
                <CFormSwitch
                  id="status"
                  name="status"
                  label="Active"
                  checked={formData.status}
                  onChange={handleChange}
                  disabled={isViewing}
                />
              </div>
              {/* Action buttons */}
              <div className="d-flex gap-2">
                {!isViewing ? (
                  <CButton 
                    type="submit" 
                    color="primary" 
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')}
                  </CButton>
                ) : (
                  <CButton 
                    type="button" 
                    color="primary" 
                    onClick={() => navigate(`/users/edit/${id}`)}
                  >
                    Edit User
                  </CButton>
                )}
                <CButton 
                  type="button" 
                  color="secondary" 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  {isViewing ? 'Back to List' : 'Cancel'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UserForm 