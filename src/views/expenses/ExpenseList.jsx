import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CForm, CFormInput, CFormSelect, CRow, CCol, CBadge, CSpinner } from '@coreui/react'
import { getExpenses, deleteExpense, getExpenseSummary } from '../../api/expense'
import { getExpenseCategories } from '../../api/expenseCategory'
import { useNavigate } from 'react-router-dom'
import { cilCalendar, cilArrowTop, cilArrowBottom } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useAuth } from '../../context/AuthContext'

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [summary, setSummary] = useState({ weekly: 0, monthly: 0, yearly: 0 })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ category_id: '', start_date: '', end_date: '' })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [perPage, setPerPage] = useState(20)
  const [sortOrder, setSortOrder] = useState('desc')
  const [sortField, setSortField] = useState('date')
  const navigate = useNavigate()
  const { hasPermission } = useAuth();

  useEffect(() => {
    loadData()
    getExpenseCategories().then(res => {
      if (Array.isArray(res.data)) {
        setCategories(res.data)
      } else if (Array.isArray(res.data.data)) {
        setCategories(res.data.data)
      } else {
        setCategories([])
      }
    })
    getExpenseSummary().then(res => setSummary(res.data))
  }, [])

  const loadData = () => {
    setLoading(true)
    getExpenses({ ...filters, page, per_page: perPage, sort_by: sortField, sort_order: sortOrder }).then(res => {
      setExpenses(res.data.data)
      setTotal(res.data.total)
      setPerPage(res.data.per_page)
      setLoading(false)
    })
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this expense?')) {
      deleteExpense(id).then(() => loadData())
    }
  }

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault()
    loadData()
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const totalPages = Math.ceil(total / perPage)
  const handlePageChange = (newPage) => {
    setPage(newPage)
  }
  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value))
    setPage(1)
  }

  return (
    <>
      <CCard className="mb-3">
        <CCardHeader>Expense Summary</CCardHeader>
        <CCardBody>
          <CRow className="text-center">
            <CCol>
              <CCard color="info" textColor="white" className="mb-2">
                <CCardBody>
                  <CIcon icon={cilCalendar} size="lg" className="mb-2" />
                  <div className="fs-5">Weekly</div>
                  <div className="fs-4 fw-bold">£{summary.weekly}</div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol>
              <CCard color="primary" textColor="white" className="mb-2">
                <CCardBody>
                  <CIcon icon={cilCalendar} size="lg" className="mb-2" />
                  <div className="fs-5">Monthly</div>
                  <div className="fs-4 fw-bold">£{summary.monthly}</div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol>
              <CCard color="success" textColor="white" className="mb-2">
                <CCardBody>
                  <CIcon icon={cilCalendar} size="lg" className="mb-2" />
                  <div className="fs-5">Yearly</div>
                  <div className="fs-4 fw-bold">£{summary.yearly}</div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard className="mb-3">
        <CCardHeader>Filter Expenses</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleFilterSubmit} className="row g-3">
            <CCol md={3}>
              <CFormSelect name="category_id" value={filters.category_id} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormInput type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} placeholder="Start Date" />
            </CCol>
            <CCol md={3}>
              <CFormInput type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} placeholder="End Date" />
            </CCol>
            <CCol md={3}>
              <CButton type="submit" color="primary">Filter</CButton>
              {hasPermission && hasPermission('create_expense') && (
                <CButton color="success" className="ms-2" onClick={() => navigate('/expenses/create')}>Add Expense</CButton>
              )}
            </CCol>
          </CForm>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader>Expense List</CCardHeader>
        <CCardBody>
          {loading ? <CSpinner /> : (
            <>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <span>Show </span>
                <select value={perPage} onChange={handlePerPageChange} style={{ width: 70, display: 'inline-block' }}>
                  {[10, 20, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
                </select>
                <span> entries</span>
              </div>
              <div>
                Page {page} of {totalPages}
                <CButton size="sm" color="secondary" className="ms-2" disabled={page === 1} onClick={() => handlePageChange(page - 1)}>&lt;</CButton>
                <CButton size="sm" color="secondary" className="ms-2" disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>&gt;</CButton>
              </div>
            </div>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell style={{ cursor: 'pointer' }} onClick={() => handleSort('date')}>
                    Date {sortField === 'date' && (sortOrder === 'asc' ? <CIcon icon={cilArrowTop} /> : <CIcon icon={cilArrowBottom} />)}
                  </CTableHeaderCell>
                  <CTableHeaderCell>Category</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Amount (£)</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {expenses.map(exp => (
                  <CTableRow key={exp.id}>
                    <CTableDataCell>{exp.date}</CTableDataCell>
                    <CTableDataCell>{exp.category?.name}</CTableDataCell>
                    <CTableDataCell>{exp.description}</CTableDataCell>
                    <CTableDataCell>£{parseFloat(exp.amount).toFixed(2)}</CTableDataCell>
                    <CTableDataCell>
                      <div className="btn-group" role="group">
                        {hasPermission && hasPermission('view_expense') && (
                          <CButton size="sm" color="info" onClick={() => navigate(`/expenses/${exp.id}`)}>View</CButton>
                        )}
                        {hasPermission && hasPermission('edit_expense') && (
                          <CButton size="sm" color="warning" onClick={() => navigate(`/expenses/edit/${exp.id}`)}>Edit</CButton>
                        )}
                        {hasPermission && hasPermission('delete_expense') && (
                          <CButton size="sm" color="danger" onClick={() => handleDelete(exp.id)}>Delete</CButton>
                        )}
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            </>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default ExpenseList 