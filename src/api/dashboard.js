import api from '../config/axios.js'

export const getDashboardSummary = (params) => api.get('/dashboard/summary', { params })
export const getSalesTrend = (params) => api.get('/dashboard/sales-trend', { params })
export const getExpenseBreakdown = (params) => api.get('/dashboard/expense-breakdown', { params })
export const getMonthlySalesVsPurchases = (params) => api.get('/dashboard/monthly-sales-vs-purchases', { params }) 