import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CForm, CFormInput, CFormSelect, CButton, CRow, CCol } from '@coreui/react'
import { createExpense, getExpense, updateExpense } from '../../api/expense'
import { getExpenseCategories } from '../../api/expenseCategory'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ExpenseForm = () => {
  const [form, setForm] = useState({ date: '', amount: '', description: '', expense_category_id: '' })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const { hasPermission } = useAuth();

  const canRender = (
    (!id && hasPermission && hasPermission('create_expense')) ||
    (id && hasPermission && hasPermission('edit_expense'))
  );
  if (!canRender) {
    return (
      <CCard>
        <CCardBody>
          <div className="alert alert-danger">You do not have permission to access this page.</div>
        </CCardBody>
      </CCard>
    );
  }

  useEffect(() => {
    getExpenseCategories().then(res => {
      if (Array.isArray(res.data)) {
        setCategories(res.data)
      } else if (Array.isArray(res.data.data)) {
        setCategories(res.data.data)
      } else {
        setCategories([])
      }
    })
    if (id) {
      getExpense(id).then(res => setForm(res.data))
    }
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    const action = id ? updateExpense(id, form) : createExpense(form)
    action.then(() => {
      setLoading(false)
      navigate('/expenses')
    })
  }

  return (
    <CCard>
      <CCardHeader>{id ? 'Edit Expense' : 'Add Expense'}</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit} className="row g-3">
          <CCol md={4}>
            <CFormInput type="date" name="date" value={form.date} onChange={handleChange} required label="Date" />
          </CCol>
          <CCol md={4}>
            <CFormSelect name="expense_category_id" value={form.expense_category_id} onChange={handleChange} required label="Category">
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </CFormSelect>
          </CCol>
          <CCol md={4}>
            <CFormInput type="number" name="amount" value={form.amount} onChange={handleChange} required label="Amount (£)" step="0.01" min="0" />
          </CCol>
          <CCol md={12}>
            <CFormInput type="text" name="description" value={form.description} onChange={handleChange} label="Description" />
          </CCol>
          <CCol md={12}>
            <CButton type="submit" color="primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</CButton>
            <CButton color="secondary" className="ms-2" onClick={() => navigate('/expenses')}>Cancel</CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default ExpenseForm 