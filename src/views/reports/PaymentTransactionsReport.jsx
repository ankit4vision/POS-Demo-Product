import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CSpinner, CBadge, CPagination, CPaginationItem, CAlert } from '@coreui/react'
import { DateRangePicker } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
import { cilCreditCard } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import api from '../../config/axios'
import { useAuth } from '../../context/AuthContext'

const PaymentTransactionsReport = () => {
  const { hasPermission } = useAuth();
  const [dateRange, setDateRange] = useState([
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date()
  ])
  const [type, setType] = useState('')
  const [method, setMethod] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ total: 0, per_page: 20, current_page: 1, last_page: 1 })

  const fetchData = async (page = 1) => {
    setLoading(true)
    try {
      const params = {
        start_date: dateRange[0].toISOString().slice(0, 10),
        end_date: dateRange[1].toISOString().slice(0, 10),
        type,
        method,
        page,
        per_page: pagination.per_page,
      }
      const res = await api.get('/reports/payment-transactions', { params })
      setData(res.data.data)
      setPagination(res.data.pagination)
    } catch (err) {
      setData([])
      setPagination({ total: 0, per_page: 20, current_page: 1, last_page: 1 })
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  React.useEffect(() => {
    fetchData(1)
    // eslint-disable-next-line
  }, [])

  const handleSearch = () => {
    fetchData(1)
  }

  const handlePageChange = (page) => {
    fetchData(page)
  }

  const typeBadge = (type) => {
    if (type === 'sale') return <CBadge color="primary">Sale</CBadge>
    if (type === 'purchase') return <CBadge color="info">Purchase</CBadge>
    if (type === 'wallet') return <CBadge color="success">Wallet</CBadge>
    return <CBadge color="secondary">Other</CBadge>
  }
  const methodBadge = (method) => {
    if (!method) return '-'
    const map = {
      cash: 'success', card: 'primary', upi: 'info', wallet: 'warning', bank_transfer: 'dark', cheque: 'secondary', other: 'secondary', credit_card: 'primary'
    }
    return <CBadge color={map[method] || 'secondary'}>{method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</CBadge>
  }
  const statusBadge = (status) => {
    if (!status) return '-'
    const map = { completed: 'success', pending: 'warning', failed: 'danger', cancelled: 'secondary' }
    return <CBadge color={map[status] || 'secondary'}>{status.replace(/\b\w/g, l => l.toUpperCase())}</CBadge>
  }

  // Check permission - same as Dashboard
  if (!hasPermission || !hasPermission('view_dashboard')) {
    return (
      <div style={{ margin: '0 auto', padding: '24px', background: '#f5f6fa', minHeight: '100vh' }}>
        <CCard>
          <CCardBody>
            <CAlert color="danger">You do not have permission to view this report.</CAlert>
          </CCardBody>
        </CCard>
      </div>
    );
  }

  return (
    <div style={{ margin: '0 auto', padding: '24px', background: '#f5f6fa', minHeight: '100vh' }}>
      <div className="mb-4 d-flex align-items-center gap-3">
        <CIcon icon={cilCreditCard} size="xxl" className="me-2 text-primary" />
        <h3 className="mb-0">Payment Transactions Report</h3>
      </div>
      <CCard className="mb-4">
        <CCardHeader className="bg-light fw-bold">Filters</CCardHeader>
        <CCardBody>
          <CRow className="align-items-end g-3">
            <CCol md={4}>
              <label className="form-label">Date Range</label>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                format="yyyy-MM-dd"
                placement="bottomStart"
                cleanable={false}
                ranges={[]}
              />
            </CCol>
            <CCol md={3}>
              <label className="form-label">Transaction Type</label>
              <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
                <option value="">All</option>
                <option value="sale">Sale</option>
                <option value="purchase">Purchase</option>
                <option value="wallet">Wallet</option>
              </select>
            </CCol>
            <CCol md={3}>
              <label className="form-label">Payment Method</label>
              <select className="form-select" value={method} onChange={e => setMethod(e.target.value)}>
                <option value="">All</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="wallet">Wallet</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
                <option value="credit_card">Credit Card</option>
                <option value="other">Other</option>
              </select>
            </CCol>
            <CCol md={2} className="d-flex gap-2">
              <CButton color="primary" className="w-100" onClick={handleSearch}>Search</CButton>
              <CButton color="secondary" variant="outline" className="w-100" onClick={() => {
                setDateRange([
                  new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                  new Date()
                ]);
                setType('');
                setMethod('');
                fetchData(1)
              }}>Reset</CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader className="bg-light fw-bold">All Payment Transactions</CCardHeader>
        <CCardBody>
          {loading ? (
            <div className="text-center py-5"><CSpinner /></div>
          ) : (
            <>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Reference</CTableHeaderCell>
                    <CTableHeaderCell>Party</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Method</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={8} className="text-center text-muted">No data found</CTableDataCell>
                    </CTableRow>
                  ) : data.map((row, idx) => (
                    <CTableRow key={row.type + '-' + row.id + '-' + idx}>
                      <CTableDataCell>{row.date ? new Date(row.date).toLocaleString() : '-'}</CTableDataCell>
                      <CTableDataCell>{typeBadge(row.type)}</CTableDataCell>
                      <CTableDataCell>{row.reference || '-'}</CTableDataCell>
                      <CTableDataCell>
                        <div>{row.party_name || '-'}</div>
                        <div className="text-muted small">{row.party_phone || ''}</div>
                      </CTableDataCell>
                      <CTableDataCell><strong>£{Number(row.amount).toFixed(2)}</strong></CTableDataCell>
                      <CTableDataCell>{methodBadge(row.method)}</CTableDataCell>
                      <CTableDataCell>{statusBadge(row.status)}</CTableDataCell>
                      <CTableDataCell>{row.description || '-'}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <div className="d-flex justify-content-end mt-3">
                <CPagination align="end">
                  <CPaginationItem disabled={pagination.current_page === 1} onClick={() => handlePageChange(pagination.current_page - 1)}>&laquo;</CPaginationItem>
                  {[...Array(pagination.last_page)].map((_, i) => (
                    <CPaginationItem key={i+1} active={pagination.current_page === i+1} onClick={() => handlePageChange(i+1)}>{i+1}</CPaginationItem>
                  ))}
                  <CPaginationItem disabled={pagination.current_page === pagination.last_page} onClick={() => handlePageChange(pagination.current_page + 1)}>&raquo;</CPaginationItem>
                </CPagination>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default PaymentTransactionsReport 