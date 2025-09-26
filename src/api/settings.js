import api from '../config/axios.js'

export const getSettings = () => api.get('/settings')
export const updateBillingSettings = (data) => api.post('/settings/billing', data)
export const updateSiteSettings = (data) => api.post('/settings/site', data)
export const updateEmailSettings = (data) => api.post('/settings/email', data)
export const updateS3Settings = (data) => api.post('/settings/s3', data)
export const testS3Connection = () => api.post('/settings/test-s3') 