import toast from 'react-hot-toast'

// Toast configuration
const toastConfig = {
  duration: 4000,
  position: 'top-right',
  style: {
    borderRadius: '10px',
    background: '#363636',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
  },
}

// Success toast
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    ...toastConfig,
    icon: '✅',
    style: {
      ...toastConfig.style,
      background: '#10b981',
      border: '1px solid #059669',
    },
    ...options,
  })
}

// Error toast
export const showError = (message, options = {}) => {
  return toast.error(message, {
    ...toastConfig,
    icon: '❌',
    style: {
      ...toastConfig.style,
      background: '#ef4444',
      border: '1px solid #dc2626',
    },
    ...options,
  })
}

// Info toast
export const showInfo = (message, options = {}) => {
  return toast(message, {
    ...toastConfig,
    icon: 'ℹ️',
    style: {
      ...toastConfig.style,
      background: '#3b82f6',
      border: '1px solid #2563eb',
    },
    ...options,
  })
}

// Warning toast
export const showWarning = (message, options = {}) => {
  return toast(message, {
    ...toastConfig,
    icon: '⚠️',
    style: {
      ...toastConfig.style,
      background: '#f59e0b',
      border: '1px solid #d97706',
    },
    ...options,
  })
}

// Loading toast
export const showLoading = (message = 'Loading...', options = {}) => {
  return toast.loading(message, {
    ...toastConfig,
    style: {
      ...toastConfig.style,
      background: '#6b7280',
      border: '1px solid #4b5563',
    },
    ...options,
  })
}

// Dismiss toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId)
}

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss()
}

// Promise toast (for async operations)
export const showPromise = (promise, messages = {}) => {
  const {
    loading = 'Loading...',
    success = 'Success!',
    error = 'Something went wrong!',
  } = messages

  return toast.promise(
    promise,
    {
      loading,
      success,
      error,
    },
    toastConfig
  )
}

// Custom toast with custom styling
export const showCustom = (message, type = 'default', options = {}) => {
  const typeConfigs = {
    success: {
      icon: '✅',
      style: {
        ...toastConfig.style,
        background: '#10b981',
        border: '1px solid #059669',
      },
    },
    error: {
      icon: '❌',
      style: {
        ...toastConfig.style,
        background: '#ef4444',
        border: '1px solid #dc2626',
      },
    },
    info: {
      icon: 'ℹ️',
      style: {
        ...toastConfig.style,
        background: '#3b82f6',
        border: '1px solid #2563eb',
      },
    },
    warning: {
      icon: '⚠️',
      style: {
        ...toastConfig.style,
        background: '#f59e0b',
        border: '1px solid #d97706',
      },
    },
    default: {
      icon: '💬',
      style: toastConfig.style,
    },
  }

  const config = typeConfigs[type] || typeConfigs.default

  return toast(message, {
    ...toastConfig,
    ...config,
    ...options,
  })
}

// Toast for API responses
export const showApiResponse = (response, successMessage = 'Operation successful!', errorMessage = 'Operation failed!') => {
  if (response && response.status >= 200 && response.status < 300) {
    return showSuccess(successMessage)
  } else {
    const errorMsg = response?.data?.message || errorMessage
    return showError(errorMsg)
  }
}

// Toast for form validation errors
export const showValidationErrors = (errors) => {
  if (typeof errors === 'string') {
    return showError(errors)
  }
  
  if (Array.isArray(errors)) {
    errors.forEach(error => showError(error))
    return
  }
  
  if (typeof errors === 'object') {
    Object.values(errors).forEach(error => {
      if (Array.isArray(error)) {
        error.forEach(err => showError(err))
      } else {
        showError(error)
      }
    })
    return
  }
  
  showError('Validation failed!')
}

export default {
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning,
  loading: showLoading,
  dismiss: dismissToast,
  dismissAll: dismissAllToasts,
  promise: showPromise,
  custom: showCustom,
  apiResponse: showApiResponse,
  validationErrors: showValidationErrors,
} 