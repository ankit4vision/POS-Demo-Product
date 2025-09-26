import api from '../config/axios.js'

export const getExpenseCategories = () => api.get('/expense-categories?all=true') 