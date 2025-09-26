import React from 'react'
import { CAlert, CButton } from '@coreui/react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <CAlert color="danger" className="d-flex align-items-center">
          <div>
            <h4 className="alert-heading">Something went wrong!</h4>
            <p>An error has occurred in this component.</p>
            <hr />
            <p className="mb-0">
              <CButton
                color="danger"
                onClick={() => {
                  this.setState({ hasError: false })
                  window.location.reload()
                }}
              >
                Reload Page
              </CButton>
            </p>
          </div>
        </CAlert>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 