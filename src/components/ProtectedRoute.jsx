import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  
  try {
    const { user, loading, error } = useAuth()

    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )
    }

    if (error) {
      console.error('Auth error in ProtectedRoute:', error)
      return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <div className="alert alert-danger">
              <h5>Authentication Error</h5>
              <p>{error}</p>
              <button 
                className="btn btn-primary" 
                onClick={() => window.location.href = '/login'}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )
    }

    if (!user) {
      console.log('No user found, redirecting to login')
      return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
  } catch (error) {
    console.error('Error in ProtectedRoute:', error)
    return <Navigate to="/login" state={{ from: location }} replace />
  }
}

export default ProtectedRoute 