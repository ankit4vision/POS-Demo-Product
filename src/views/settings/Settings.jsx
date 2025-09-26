import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CForm, CFormInput, CFormLabel, CButton, CRow, CCol, CNav, CNavItem, CNavLink, CTabContent, CTabPane, CAlert, CSpinner, CFormCheck, CFormSelect } from '@coreui/react'
import { getSettings, updateBillingSettings, updateSiteSettings, updateEmailSettings, updateS3Settings, testS3Connection } from '../../api/settings'
import { toast } from 'react-hot-toast'
import api from '../../config/axios'

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [billing, setBilling] = useState({
    company_name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    gstin: '',
    phone: '',
    email: '',
  })
  const [siteSettings, setSiteSettings] = useState({
    currency: 'INR',
    show_company_info_on_invoice: '0',
    invoice_footer_text: '',
    hide_vat_from_everywhere: '1',
  })
  const [email, setEmail] = useState({
    smtp_host: '',
    smtp_port: '',
    smtp_user: '',
    smtp_pass: '',
    from_email: '',
    from_name: '',
  })
  const [s3, setS3] = useState({
    s3_enabled: '0',
    aws_access_key_id: '',
    aws_secret_access_key: '',
    aws_region: 'us-east-1',
    aws_bucket: '',
    s3_url: '',
    s3_endpoint: '',
    s3_folder: '',
  })
  const [testEmail, setTestEmail] = useState('')
  const [testingEmail, setTestingEmail] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [testingS3, setTestingS3] = useState(false)
  const [s3TestResult, setS3TestResult] = useState(null)

  useEffect(() => {
    getSettings().then(res => {
      if (res.data.billing) setBilling(res.data.billing)
      if (res.data.email) setEmail(res.data.email)
      if (res.data.s3) setS3(res.data.s3)
      if (res.data.siteSettings) setSiteSettings(res.data.siteSettings)
    })
  }, [])

  const handleBillingChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value })
  }
  const handleSiteSettingsChange = (e) => {
    const { name, value, type, checked } = e.target
    setSiteSettings({ 
      ...siteSettings, 
      [name]: type === 'checkbox' ? (checked ? '1' : '0') : value 
    })
  }
  const handleEmailChange = (e) => {
    setEmail({ ...email, [e.target.name]: e.target.value })
  }
  const handleS3Change = (e) => {
    const { name, value, type, checked } = e.target
    setS3({ 
      ...s3, 
      [name]: type === 'checkbox' ? (checked ? '1' : '0') : value 
    })
  }

  const handleBillingSubmit = (e) => {
    e.preventDefault()
    updateBillingSettings(billing).then(() => toast.success('Billing details saved!'))
  }
  const handleSiteSettingsSubmit = (e) => {
    e.preventDefault()
    updateSiteSettings(siteSettings).then(() => toast.success('Site settings saved!'))
  }
  const handleEmailSubmit = (e) => {
    e.preventDefault()
    updateEmailSettings(email).then(() => toast.success('Email settings saved!'))
  }
  const handleS3Submit = (e) => {
    e.preventDefault()
    updateS3Settings(s3).then(() => toast.success('S3 settings saved!'))
  }

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error('Please enter an email address to test')
      return
    }

    setTestingEmail(true)
    setTestResult(null)

    try {
      const response = await api.post('/auth/test-email', { email: testEmail })
      setTestResult(response.data)
      
      if (response.data.success) {
        toast.success('Test email sent successfully!')
      } else {
        toast.error('Test email failed: ' + response.data.message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send test email'
      setTestResult({
        success: false,
        message: errorMessage,
        email_settings: email,
        smtp_test: { success: false, error: 'Request failed' }
      })
      toast.error(errorMessage)
    } finally {
      setTestingEmail(false)
    }
  }

  const handleTestS3 = async () => {
    setTestingS3(true)
    setS3TestResult(null)

    try {
      const response = await testS3Connection()
      setS3TestResult(response.data)
      
      if (response.data.success) {
        toast.success('S3 connection test successful!')
      } else {
        toast.error('S3 connection test failed: ' + response.data.message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to test S3 connection'
      setS3TestResult({
        success: false,
        message: errorMessage
      })
      toast.error(errorMessage)
    } finally {
      setTestingS3(false)
    }
  }

  return (
    <CCard>
      <CCardHeader>Settings</CCardHeader>
      <CCardBody>
        <CNav variant="tabs" role="tablist">
          <CNavItem>
            <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)} role="tab">Billing Details</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)} role="tab">Site Settings</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink active={activeTab === 2} onClick={() => setActiveTab(2)} role="tab">Email Settings</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink active={activeTab === 3} onClick={() => setActiveTab(3)} role="tab">S3 Storage</CNavLink>
          </CNavItem>
        </CNav>
        <CTabContent className="mt-4">
          <CTabPane visible={activeTab === 0}>
            <CForm className="row g-3" onSubmit={handleBillingSubmit}>
              <CCol md={6}><CFormLabel>Company Name</CFormLabel><CFormInput name="company_name" value={billing.company_name} onChange={handleBillingChange} /></CCol>
              <CCol md={6}><CFormLabel>Email</CFormLabel><CFormInput name="email" value={billing.email} onChange={handleBillingChange} /></CCol>
              <CCol md={6}><CFormLabel>Phone</CFormLabel><CFormInput name="phone" value={billing.phone} onChange={handleBillingChange} /></CCol>
              <CCol md={6}><CFormLabel>GSTIN</CFormLabel><CFormInput name="gstin" value={billing.gstin} onChange={handleBillingChange} /></CCol>
              <CCol md={12}><CFormLabel>Address</CFormLabel><CFormInput name="address" value={billing.address} onChange={handleBillingChange} /></CCol>
              <CCol md={4}><CFormLabel>City</CFormLabel><CFormInput name="city" value={billing.city} onChange={handleBillingChange} /></CCol>
              <CCol md={4}><CFormLabel>State</CFormLabel><CFormInput name="state" value={billing.state} onChange={handleBillingChange} /></CCol>
              <CCol md={4}><CFormLabel>Country</CFormLabel><CFormInput name="country" value={billing.country} onChange={handleBillingChange} /></CCol>
              <CCol md={12}><CButton color="primary" type="submit">Save Billing Details</CButton></CCol>
            </CForm>
          </CTabPane>
          <CTabPane visible={activeTab === 1}>
            <CForm className="row g-3" onSubmit={handleSiteSettingsSubmit}>
              {/* Currency Section */}
              <CCol md={6}>
                <CFormLabel>Currency</CFormLabel>
                <CFormSelect name="currency" value={siteSettings.currency} onChange={handleSiteSettingsChange}>
                  <option value="INR">INR (Indian Rupee)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="GBP">GBP (British Pound)</option>
                </CFormSelect>
              </CCol>
              
              {/* Divider */}
              <CCol md={12}>
                <hr className="my-4" />
              </CCol>
              
              {/* Company Information Section */}
              <CCol md={12}>
                <h5>Invoice Display Settings</h5>
                <p className="text-muted">Configure what information appears on invoices.</p>
              </CCol>
              
              <CCol md={12}>
                <CFormCheck
                  name="show_company_info_on_invoice"
                  type="checkbox"
                  checked={siteSettings.show_company_info_on_invoice === '1'}
                  onChange={handleSiteSettingsChange}
                  label="Show Company Information on Invoice"
                />
                <small className="text-muted d-block mt-1">When enabled, company details (name, address, contact info) will be displayed on invoices.</small>
              </CCol>
              
              <CCol md={12}>
                <CFormLabel>Invoice Footer Text</CFormLabel>
                <CFormInput 
                  name="invoice_footer_text" 
                  value={siteSettings.invoice_footer_text} 
                  onChange={handleSiteSettingsChange}
                  placeholder="Enter footer text to display at the bottom of invoices"
                />
                <small className="text-muted d-block mt-1">This text will appear at the bottom of all invoices (e.g., "Thank you for your business!", terms and conditions, etc.)</small>
              </CCol>
              
              <CCol md={12}>
                <CFormCheck
                  name="hide_vat_from_everywhere"
                  type="checkbox"
                  checked={siteSettings.hide_vat_from_everywhere === '1'}
                  onChange={handleSiteSettingsChange}
                  label="Hide VAT(%) from Everywhere"
                />
                <small className="text-muted d-block mt-1">When enabled, VAT percentage and VAT amounts will be hidden from all invoices, reports, and displays throughout the system.</small>
              </CCol>
              
              <CCol md={12}><CButton color="primary" type="submit">Save Site Settings</CButton></CCol>
            </CForm>
          </CTabPane>
          <CTabPane visible={activeTab === 2}>
            <CForm className="row g-3" onSubmit={handleEmailSubmit}>
              <CCol md={6}><CFormLabel>SMTP Host</CFormLabel><CFormInput name="smtp_host" value={email.smtp_host} onChange={handleEmailChange} /></CCol>
              <CCol md={6}><CFormLabel>SMTP Port</CFormLabel><CFormInput name="smtp_port" value={email.smtp_port} onChange={handleEmailChange} /></CCol>
              <CCol md={6}><CFormLabel>SMTP User</CFormLabel><CFormInput name="smtp_user" value={email.smtp_user} onChange={handleEmailChange} /></CCol>
              <CCol md={6}><CFormLabel>SMTP Password</CFormLabel><CFormInput name="smtp_pass" type="password" value={email.smtp_pass} onChange={handleEmailChange} /></CCol>
              <CCol md={6}><CFormLabel>From Email</CFormLabel><CFormInput name="from_email" value={email.from_email} onChange={handleEmailChange} /></CCol>
              <CCol md={6}><CFormLabel>From Name</CFormLabel><CFormInput name="from_name" value={email.from_name} onChange={handleEmailChange} /></CCol>
              <CCol md={12}>
                <CButton color="primary" type="submit" className="me-2">Save Email Settings</CButton>
              </CCol>
            </CForm>
            
            {/* Test Email Section */}
            <hr className="my-4" />
            <div className="row g-3">
              <CCol md={12}>
                <h5>Test Email Configuration</h5>
                <p className="text-muted">Test your email settings by sending a test email.</p>
              </CCol>
              <CCol md={6}>
                <CFormLabel>Test Email Address</CFormLabel>
                <CFormInput 
                  type="email" 
                  value={testEmail} 
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter email address to test"
                />
              </CCol>
              <CCol md={6} className="d-flex align-items-end">
                <CButton 
                  color="info" 
                  onClick={handleTestEmail}
                  disabled={testingEmail || !testEmail}
                >
                  {testingEmail ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Testing...
                    </>
                  ) : (
                    'Send Test Email'
                  )}
                </CButton>
              </CCol>
              
              {/* Test Results */}
              {testResult && (
                <CCol md={12}>
                  <CAlert color={testResult.success ? 'success' : 'danger'}>
                    <h6>Test Results:</h6>
                    <p><strong>Status:</strong> {testResult.success ? 'Success' : 'Failed'}</p>
                    <p><strong>Message:</strong> {testResult.message}</p>
                    
                    {testResult.smtp_test && (
                      <div className="mt-2">
                        <h6>SMTP Connection Test:</h6>
                        <p className={testResult.smtp_test.success ? 'text-success' : 'text-danger'}>
                          {testResult.smtp_test.success ? '✓' : '✗'} {testResult.smtp_test.message || testResult.smtp_test.error}
                        </p>
                      </div>
                    )}
                    
                    {testResult.email_settings && (
                      <div className="mt-2">
                        <h6>Current Email Settings:</h6>
                        <small className="text-muted">
                          Host: {testResult.email_settings.smtp_host} | 
                          Port: {testResult.email_settings.smtp_port} | 
                          User: {testResult.email_settings.smtp_user} | 
                          From: {testResult.email_settings.from_email}
                        </small>
                      </div>
                    )}
                  </CAlert>
                </CCol>
              )}
            </div>
          </CTabPane>
          <CTabPane visible={activeTab === 3}>
            <CForm className="row g-3" onSubmit={handleS3Submit}>
              <CCol md={12}>
                <CFormCheck
                  name="s3_enabled"
                  type="checkbox"
                  checked={s3.s3_enabled === '1'}
                  onChange={handleS3Change}
                  label="Enable S3 Storage"
                />
                <small className="text-muted">When enabled, files will be uploaded to AWS S3 instead of local storage.</small>
              </CCol>
              
              <CCol md={6}>
                <CFormLabel>AWS Access Key ID</CFormLabel>
                <CFormInput 
                  name="aws_access_key_id" 
                  value={s3.aws_access_key_id} 
                  onChange={handleS3Change}
                  placeholder="Enter your AWS Access Key ID"
                />
              </CCol>
              
              <CCol md={6}>
                <CFormLabel>AWS Secret Access Key</CFormLabel>
                <CFormInput 
                  name="aws_secret_access_key" 
                  type="password"
                  value={s3.aws_secret_access_key} 
                  onChange={handleS3Change}
                  placeholder="Enter your AWS Secret Access Key"
                />
              </CCol>
              
              <CCol md={6}>
                <CFormLabel>AWS Region</CFormLabel>
                <CFormInput 
                  name="aws_region" 
                  value={s3.aws_region} 
                  onChange={handleS3Change}
                  placeholder="e.g., us-east-1"
                />
              </CCol>
              
              <CCol md={6}>
                <CFormLabel>S3 Bucket Name</CFormLabel>
                <CFormInput 
                  name="aws_bucket" 
                  value={s3.aws_bucket} 
                  onChange={handleS3Change}
                  placeholder="Enter your S3 bucket name"
                />
              </CCol>
              
              <CCol md={6}>
                <CFormLabel>Custom S3 URL (Optional)</CFormLabel>
                <CFormInput 
                  name="s3_url" 
                  value={s3.s3_url} 
                  onChange={handleS3Change}
                  placeholder="Custom S3 endpoint URL"
                />
              </CCol>
              
              <CCol md={6}>
                <CFormLabel>Custom Endpoint (Optional)</CFormLabel>
                <CFormInput 
                  name="s3_endpoint" 
                  value={s3.s3_endpoint} 
                  onChange={handleS3Change}
                  placeholder="Custom endpoint for S3-compatible services"
                />
              </CCol>
              
              <CCol md={6}>
                <CFormLabel>S3 Folder (Optional)</CFormLabel>
                <CFormInput 
                  name="s3_folder" 
                  value={s3.s3_folder} 
                  onChange={handleS3Change}
                  placeholder="e.g., krimah_prod, development, staging"
                />
                <small className="text-muted">Use folders to separate environments (e.g., krimah_prod, development)</small>
              </CCol>
              
              <CCol md={12}>
                <CButton color="primary" type="submit" className="me-2">Save S3 Settings</CButton>
                <CButton 
                  color="info" 
                  onClick={handleTestS3}
                  disabled={testingS3 || s3.s3_enabled !== '1'}
                >
                  {testingS3 ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Testing S3 Connection...
                    </>
                  ) : (
                    'Test S3 Connection'
                  )}
                </CButton>
              </CCol>
            </CForm>
            
            {/* S3 Test Results */}
            {s3TestResult && (
              <CCol md={12} className="mt-3">
                <CAlert color={s3TestResult.success ? 'success' : 'danger'}>
                  <h6>S3 Connection Test Results:</h6>
                  <p><strong>Status:</strong> {s3TestResult.success ? 'Success' : 'Failed'}</p>
                  <p><strong>Message:</strong> {s3TestResult.message}</p>
                  
                  {s3TestResult.data && (
                    <div className="mt-2">
                      <h6>Connection Details:</h6>
                      <p><strong>Bucket:</strong> {s3TestResult.data.bucket}</p>
                      <p><strong>Region:</strong> {s3TestResult.data.region}</p>
                      <p><strong>Status:</strong> {s3TestResult.data.status}</p>
                    </div>
                  )}
                </CAlert>
              </CCol>
            )}
            
            {/* S3 Information */}
            <hr className="my-4" />
            <div className="row g-3">
              <CCol md={12}>
                <h5>S3 Storage Information</h5>
                <div className="alert alert-info">
                  <h6>How S3 Storage Works:</h6>
                  <ul className="mb-0">
                    <li>When S3 is enabled, all file uploads (product images, documents) will be stored in your AWS S3 bucket</li>
                    <li>Files will be organized in folders by type and date</li>
                    <li>You can disable S3 at any time to revert to local storage</li>
                    <li>Make sure your S3 bucket has proper permissions and CORS configuration</li>
                  </ul>
                </div>
              </CCol>
            </div>
          </CTabPane>
        </CTabContent>
      </CCardBody>
    </CCard>
  )
}

export default Settings 