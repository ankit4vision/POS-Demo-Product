import { useCallback } from 'react'
import {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showLoading,
  dismissToast,
  dismissAllToasts,
  showPromise,
  showCustom,
  showApiResponse,
  showValidationErrors,
} from '../utils/toast'

const useToast = () => {
  const success = useCallback((message, options) => {
    return showSuccess(message, options)
  }, [])

  const error = useCallback((message, options) => {
    return showError(message, options)
  }, [])

  const info = useCallback((message, options) => {
    return showInfo(message, options)
  }, [])

  const warning = useCallback((message, options) => {
    return showWarning(message, options)
  }, [])

  const loading = useCallback((message, options) => {
    return showLoading(message, options)
  }, [])

  const dismiss = useCallback((toastId) => {
    dismissToast(toastId)
  }, [])

  const dismissAll = useCallback(() => {
    dismissAllToasts()
  }, [])

  const promise = useCallback((promise, messages) => {
    return showPromise(promise, messages)
  }, [])

  const custom = useCallback((message, type, options) => {
    return showCustom(message, type, options)
  }, [])

  const apiResponse = useCallback((response, successMessage, errorMessage) => {
    return showApiResponse(response, successMessage, errorMessage)
  }, [])

  const validationErrors = useCallback((errors) => {
    return showValidationErrors(errors)
  }, [])

  // Convenience methods for common operations
  const createSuccess = useCallback((entity = 'Item') => {
    return success(`${entity} created successfully!`)
  }, [success])

  const updateSuccess = useCallback((entity = 'Item') => {
    return success(`${entity} updated successfully!`)
  }, [success])

  const deleteSuccess = useCallback((entity = 'Item') => {
    return success(`${entity} deleted successfully!`)
  }, [success])

  const saveSuccess = useCallback((entity = 'Item') => {
    return success(`${entity} saved successfully!`)
  }, [success])

  const operationSuccess = useCallback((operation = 'Operation', entity = 'item') => {
    return success(`${operation} ${entity} successfully!`)
  }, [success])

  const networkError = useCallback(() => {
    return error('Network error. Please check your connection.')
  }, [error])

  const serverError = useCallback(() => {
    return error('Server error. Please try again later.')
  }, [error])

  const unauthorized = useCallback(() => {
    return error('You are not authorized to perform this action.')
  }, [error])

  const notFound = useCallback((entity = 'Item') => {
    return error(`${entity} not found.`)
  }, [error])

  const confirmAction = useCallback((action = 'action') => {
    return info(`Please confirm this ${action}.`)
  }, [info])

  const processing = useCallback((operation = 'Processing') => {
    return loading(`${operation}...`)
  }, [loading])

  return {
    // Basic toast methods
    success,
    error,
    info,
    warning,
    loading,
    dismiss,
    dismissAll,
    promise,
    custom,
    apiResponse,
    validationErrors,
    
    // Convenience methods
    createSuccess,
    updateSuccess,
    deleteSuccess,
    saveSuccess,
    operationSuccess,
    networkError,
    serverError,
    unauthorized,
    notFound,
    confirmAction,
    processing,
  }
}

export default useToast 