import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol, CButton } from '@coreui/react'
import { getExpense } from '../../api/expense'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ExpenseDetail = () => {
  const { id } = useParams()
  const [expense, setExpense] = useState(null)
  const navigate = useNavigate()
  const { hasPermission } = useAuth();

  useEffect(() => {
    getExpense(id).then(res => setExpense(res.data))
  }, [id])

  if (!(hasPermission && hasPermission('view_expense'))) {
    return (
      <CCard>
        <CCardBody>
          <div className="alert alert-danger">You do not have permission to view this expense.</div>
        </CCardBody>
      </CCard>
    );
  }

  if (!expense) return <div>Loading...</div>

  return (
    <CCard>
      <CCardHeader>Expense Details</CCardHeader>
      <CCardBody>
        <CRow>
          <CCol md={6}><strong>Date:</strong> {expense.date}</CCol>
          <CCol md={6}><strong>Category:</strong> {expense.category?.name}</CCol>
          <CCol md={6}><strong>Amount:</strong> £{parseFloat(expense.amount).toFixed(2)}</CCol>
          <CCol md={6}><strong>Description:</strong> {expense.description}</CCol>
          <CCol md={6}><strong>Created By:</strong> {expense.creator?.name || 'N/A'}</CCol>
        </CRow>
        <CButton color="secondary" className="mt-3" onClick={() => navigate('/expenses')}>Back to List</CButton>
      </CCardBody>
    </CCard>
  )
}

export default ExpenseDetail 