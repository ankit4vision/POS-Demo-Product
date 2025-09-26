import React from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilCheckCircle, cilXCircle, cilInfo, cilWarning } from '@coreui/icons'
import useToast from '../hooks/useToast'

const ToastDemo = () => {
  const toast = useToast()

  const handleSuccessToast = () => {
    toast.success('This is a success message!')
  }

  const handleErrorToast = () => {
    toast.error('This is an error message!')
  }

  const handleInfoToast = () => {
    toast.info('This is an info message!')
  }

  const handleWarningToast = () => {
    toast.warning('This is a warning message!')
  }

  const handleLoadingToast = () => {
    const loadingToast = toast.loading('Loading...')
    setTimeout(() => {
      toast.dismiss(loadingToast)
      toast.success('Loading completed!')
    }, 3000)
  }

  const handlePromiseToast = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve() : reject()
      }, 2000)
    })

    toast.promise(promise, {
      loading: 'Processing...',
      success: 'Operation completed successfully!',
      error: 'Operation failed!',
    })
  }

  const handleCustomToast = () => {
    toast.custom('This is a custom styled toast!', 'info', {
      duration: 6000,
    })
  }

  const handleConvenienceToasts = () => {
    toast.createSuccess('Product')
    setTimeout(() => toast.updateSuccess('Customer'), 1000)
    setTimeout(() => toast.deleteSuccess('Order'), 2000)
    setTimeout(() => toast.saveSuccess('Settings'), 3000)
  }

  const handleErrorToasts = () => {
    toast.networkError()
    setTimeout(() => toast.serverError(), 1000)
    setTimeout(() => toast.unauthorized(), 2000)
    setTimeout(() => toast.notFound('Product'), 3000)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h4 className="mb-0">
              <CIcon icon={cilBell} className="me-2" />
              Toast Notification Demo
            </h4>
          </CCardHeader>
          <CCardBody>
            <p className="text-muted mb-4">
              This demo showcases all available toast notification types and functionality.
            </p>

            <CRow className="g-3">
              <CCol md={6} lg={4}>
                <CCard className="border-success">
                  <CCardBody className="text-center">
                    <CIcon icon={cilCheckCircle} className="text-success mb-2" size="xl" />
                    <h6>Success Toast</h6>
                    <p className="text-muted small">Shows success messages</p>
                    <CButton color="success" onClick={handleSuccessToast}>
                      Show Success
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={6} lg={4}>
                <CCard className="border-danger">
                  <CCardBody className="text-center">
                    <CIcon icon={cilXCircle} className="text-danger mb-2" size="xl" />
                    <h6>Error Toast</h6>
                    <p className="text-muted small">Shows error messages</p>
                    <CButton color="danger" onClick={handleErrorToast}>
                      Show Error
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={6} lg={4}>
                <CCard className="border-info">
                  <CCardBody className="text-center">
                    <CIcon icon={cilInfo} className="text-info mb-2" size="xl" />
                    <h6>Info Toast</h6>
                    <p className="text-muted small">Shows information messages</p>
                    <CButton color="info" onClick={handleInfoToast}>
                      Show Info
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={6} lg={4}>
                <CCard className="border-warning">
                  <CCardBody className="text-center">
                    <CIcon icon={cilWarning} className="text-warning mb-2" size="xl" />
                    <h6>Warning Toast</h6>
                    <p className="text-muted small">Shows warning messages</p>
                    <CButton color="warning" onClick={handleWarningToast}>
                      Show Warning
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={6} lg={4}>
                <CCard className="border-secondary">
                  <CCardBody className="text-center">
                    <CIcon icon={cilBell} className="text-secondary mb-2" size="xl" />
                    <h6>Loading Toast</h6>
                    <p className="text-muted small">Shows loading state</p>
                    <CButton color="secondary" onClick={handleLoadingToast}>
                      Show Loading
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={6} lg={4}>
                <CCard className="border-primary">
                  <CCardBody className="text-center">
                    <CIcon icon={cilBell} className="text-primary mb-2" size="xl" />
                    <h6>Promise Toast</h6>
                    <p className="text-muted small">Handles async operations</p>
                    <CButton color="primary" onClick={handlePromiseToast}>
                      Show Promise
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <hr className="my-4" />

            <h5>Advanced Features</h5>
            <CRow className="g-3">
              <CCol md={6}>
                <CCard>
                  <CCardBody>
                    <h6>Custom Toast</h6>
                    <p className="text-muted small">Custom styled toast with extended duration</p>
                    <CButton color="outline-primary" onClick={handleCustomToast}>
                      Show Custom Toast
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={6}>
                <CCard>
                  <CCardBody>
                    <h6>Convenience Methods</h6>
                    <p className="text-muted small">Pre-built messages for common operations</p>
                    <CButton color="outline-success" onClick={handleConvenienceToasts}>
                      Show Convenience Toasts
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={6}>
                <CCard>
                  <CCardBody>
                    <h6>Error Types</h6>
                    <p className="text-muted small">Common error message types</p>
                    <CButton color="outline-danger" onClick={handleErrorToasts}>
                      Show Error Types
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={6}>
                <CCard>
                  <CCardBody>
                    <h6>Dismiss All</h6>
                    <p className="text-muted small">Clear all active toasts</p>
                    <CButton color="outline-secondary" onClick={toast.dismissAll}>
                      Dismiss All Toasts
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <hr className="my-4" />

            <div className="alert alert-info">
              <h6>Usage Examples:</h6>
              <ul className="mb-0">
                <li><code>toast.success('Operation completed!')</code> - Success message</li>
                <li><code>toast.error('Something went wrong!')</code> - Error message</li>
                <li><code>toast.createSuccess('Product')</code> - "Product created successfully!"</li>
                <li><code>toast.updateSuccess('Customer')</code> - "Customer updated successfully!"</li>
                <li><code>toast.deleteSuccess('Order')</code> - "Order deleted successfully!"</li>
                <li><code>toast.networkError()</code> - Network error message</li>
                <li><code>toast.serverError()</code> - Server error message</li>
              </ul>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ToastDemo 