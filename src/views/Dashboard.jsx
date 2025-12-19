import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol, CButton, CSpinner, CBadge } from '@coreui/react'
import { getDashboardSummary, getSalesTrend, getExpenseBreakdown } from '../api/dashboard'
import { useNavigate } from 'react-router-dom'
import { cilCart, cilTruck, cilMoney, cilUser, cilSpeedometer, cilWarning, cilPlus, cilChart, cilList, cilBasket, cilUserPlus, cilChartPie } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { Doughnut, Bar } from 'react-chartjs-2'
import 'chart.js/auto'
import { DateRangePicker } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
import SalesVsPurchasesChart from './SalesVsPurchasesChart'

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [salesTrend, setSalesTrend] = useState([])
  const [expenseBreakdown, setExpenseBreakdown] = useState([])
  const [loading, setLoading] = useState(true)
  const now = new Date();
  // Default date range: September 1-30, 2025
  const firstDay = new Date(2025, 8, 1); // September 1, 2025 (month is 0-indexed)
  const lastDay = new Date(2025, 8, 30); // September 30, 2025

  const [dateRange, setDateRange] = useState([
    firstDay,
    lastDay
  ])
  const navigate = useNavigate()

  const fetchData = async (range) => {
    setLoading(true)
    const params = {
      start_date: range[0].toISOString().slice(0, 10),
      end_date: range[1].toISOString().slice(0, 10),
    }
    const [sum, sales, exp] = await Promise.all([
      getDashboardSummary(params),
      getSalesTrend(params),
      getExpenseBreakdown(params),
    ])
    setSummary(sum.data)
    setSalesTrend(sales.data)
    setExpenseBreakdown(exp.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData(dateRange)
    // eslint-disable-next-line
  }, [])

  const handleDateRangeChange = (range) => {
    setDateRange(range)
    fetchData(range)
  }

  if (loading) return <div className="text-center py-5"><CSpinner /></div>

  // Prepare expense breakdown chart data
  const expenseLabels = expenseBreakdown.map(d => d.category?.name || 'Other')
  const expenseData = expenseBreakdown.map(d => d.total)
  const totalExpenses = expenseData.reduce((sum, val) => sum + Number(val), 0)

  return (
    <div style={{ margin: '0 auto', padding: '24px', background: '#FFFFFF', minHeight: '100vh' }}>
      <div className="mb-4">
        <h3 className="mb-2" style={{ color: '#3B721A', fontWeight: 700 }}>Dashboard</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 600 }}>
          <div style={{ maxWidth: 320 }}>
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="yyyy-MM-dd"
              placement="bottomStart"
              cleanable={false}
              ranges={[]}
            />
          </div>
          <CButton 
            size="sm" 
            variant="outline" 
            onClick={() => {
              const defaultRange = [
                new Date(2025, 8, 1), // September 1, 2025
                new Date(2025, 8, 30) // September 30, 2025
              ];
              setDateRange(defaultRange);
              fetchData(defaultRange);
            }}
            style={{
              borderColor: '#3B721A',
              color: '#3B721A'
            }}
          >
            Reset
          </CButton>
          <CButton 
            size="sm" 
            variant="outline" 
            onClick={() => fetchData(dateRange)}
            style={{
              background: '#3B721A',
              borderColor: '#3B721A',
              color: '#FFFFFF'
            }}
          >
            Refresh
          </CButton>
        </div>
      </div>
      {/* Row 1: Key Metrics */}
      <CRow className="mb-3">
        <CCol md={4} sm={12} className="mb-3">
          <CCard 
            className="h-100 border-0 shadow-sm"
            style={{ 
              background: 'rgba(59, 114, 26, 0.02)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: '1px solid rgba(59, 114, 26, 0.2)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
              e.currentTarget.style.background = 'rgba(59, 114, 26, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              e.currentTarget.style.background = 'rgba(59, 114, 26, 0.02)';
            }}
            onClick={() => navigate('/invoices')}
          >
            <CCardBody className="d-flex align-items-center text-dark p-4">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 60,
                  height: 60,
                  background: 'rgba(59, 114, 26, 0.08)',
                  borderRadius: '50%',
                  border: '1px solid rgba(59, 114, 26, 0.2)'
                }}
              >
                <CIcon icon={cilCart} size="xl" style={{ color: '#3B721A' }} />
              </div>
              <div>
                <div className="fs-6 text-muted mb-1">Total Sales (+VAT)</div>
                <div className="fs-2 fw-bold" style={{ color: '#3B721A' }}>£{summary.total_sales}</div>
                <div className="small text-muted">All sales invoices including VAT</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} sm={12} className="mb-3">
          <CCard 
            className="h-100 border-0 shadow-sm"
            style={{ 
              background: 'rgba(253, 217, 64, 0.02)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: '1px solid rgba(253, 217, 64, 0.3)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
              e.currentTarget.style.background = 'rgba(253, 217, 64, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              e.currentTarget.style.background = 'rgba(253, 217, 64, 0.02)';
            }}
            onClick={() => navigate('/purchases')}
          >
            <CCardBody className="d-flex align-items-center text-dark p-4">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 60,
                  height: 60,
                  background: 'rgba(253, 217, 64, 0.08)',
                  borderRadius: '50%',
                  border: '1px solid rgba(253, 217, 64, 0.3)'
                }}
              >
                <CIcon icon={cilTruck} size="xl" style={{ color: '#8B6914' }} />
              </div>
              <div>
                <div className="fs-6 text-muted mb-1">Total Purchases</div>
                <div className="fs-2 fw-bold" style={{ color: '#8B6914' }}>£{summary.total_purchases}</div>
                <div className="small text-muted">Purchase orders (excluding drafts)</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} sm={12} className="mb-3">
          <CCard 
            className="h-100 border-0 shadow-sm"
            style={{ 
              background: 'rgba(59, 114, 26, 0.02)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: '1px solid rgba(59, 114, 26, 0.2)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
              e.currentTarget.style.background = 'rgba(59, 114, 26, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              e.currentTarget.style.background = 'rgba(59, 114, 26, 0.02)';
            }}
            onClick={() => navigate('/expenses')}
          >
            <CCardBody className="d-flex align-items-center text-dark p-4">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 60,
                  height: 60,
                  background: 'rgba(59, 114, 26, 0.08)',
                  borderRadius: '50%',
                  border: '1px solid rgba(59, 114, 26, 0.2)'
                }}
              >
                <CIcon icon={cilMoney} size="xl" style={{ color: '#3B721A' }} />
              </div>
              <div>
                <div className="fs-6 text-muted mb-1">Total Expenses</div>
                <div className="fs-2 fw-bold" style={{ color: '#3B721A' }}>£{summary.total_expenses}</div>
                <div className="small text-muted">All company expenses</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* Row: Total Customers, Total Products, Low Stock Products */}
      <CRow className="mb-3">
        <CCol md={4} sm={12} className="mb-3">
          <CCard 
            className="h-100 border-0 shadow-sm"
            style={{ 
              background: 'rgba(59, 114, 26, 0.02)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: '1px solid rgba(59, 114, 26, 0.2)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
              e.currentTarget.style.background = 'rgba(59, 114, 26, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              e.currentTarget.style.background = 'rgba(59, 114, 26, 0.02)';
            }}
            onClick={() => navigate('/customers')}
          >
            <CCardBody className="d-flex align-items-center text-dark p-4">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 60,
                  height: 60,
                  background: 'rgba(59, 114, 26, 0.08)',
                  borderRadius: '50%',
                  border: '1px solid rgba(59, 114, 26, 0.2)'
                }}
              >
                <CIcon icon={cilUser} size="xl" style={{ color: '#3B721A' }} />
              </div>
              <div>
                <div className="fs-6 text-muted mb-1">Total Customers</div>
                <div className="fs-2 fw-bold" style={{ color: '#3B721A' }}>{summary.total_customers}</div>
                <div className="small text-muted">Active customer base</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} sm={12} className="mb-3">
          <CCard 
            className="h-100 border-0 shadow-sm"
            style={{ 
              background: 'rgba(253, 217, 64, 0.02)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: '1px solid rgba(253, 217, 64, 0.3)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
              e.currentTarget.style.background = 'rgba(253, 217, 64, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              e.currentTarget.style.background = 'rgba(253, 217, 64, 0.02)';
            }}
            onClick={() => navigate('/products')}
          >
            <CCardBody className="d-flex align-items-center text-dark p-4">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 60,
                  height: 60,
                  background: 'rgba(253, 217, 64, 0.08)',
                  borderRadius: '50%',
                  border: '1px solid rgba(253, 217, 64, 0.3)'
                }}
              >
                <CIcon icon={cilList} size="xl" style={{ color: '#8B6914' }} />
              </div>
              <div>
                <div className="fs-6 text-muted mb-1">Total Products</div>
                <div className="fs-2 fw-bold" style={{ color: '#8B6914' }}>{summary.total_products}</div>
                <div className="small text-muted">Items in inventory</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} sm={12} className="mb-3">
          <CCard 
            className="h-100 border-0 shadow-sm"
            style={{ 
              background: 'rgba(59, 114, 26, 0.02)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: '1px solid rgba(59, 114, 26, 0.2)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
              e.currentTarget.style.background = 'rgba(59, 114, 26, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              e.currentTarget.style.background = 'rgba(59, 114, 26, 0.02)';
            }}
            onClick={() => navigate('/products?filter=low-stock')}
          >
            <CCardBody className="d-flex align-items-center text-dark p-4">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 60,
                  height: 60,
                  background: 'rgba(59, 114, 26, 0.08)',
                  borderRadius: '50%',
                  border: '1px solid rgba(59, 114, 26, 0.2)'
                }}
              >
                <CIcon icon={cilWarning} size="xl" style={{ color: '#3B721A' }} />
              </div>
              <div>
                <div className="fs-6 text-muted mb-1">Low Stock Alert</div>
                <div className="fs-2 fw-bold" style={{ color: '#3B721A' }}>{summary.low_stock}</div>
                <div className="small text-muted">Need restocking</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* Row: Top Selling Products, Best Customers, Best Suppliers */}
      <CRow className="mb-3">
        <CCol md={4} sm={12} className="mb-3">
          <CCard 
            className="h-100 border-0 shadow-sm"
            style={{ 
              background: '#FFFFFF',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <CCardHeader 
              className="border-bottom-0 fw-bold" 
              style={{ 
                background: 'rgba(59, 114, 26, 0.05)',
                borderRadius: '16px 16px 0 0', 
                padding: '16px 20px',
                color: '#3B721A',
                borderBottom: '1px solid rgba(59, 114, 26, 0.2)'
              }}
            >
              <CIcon icon={cilList} className="me-2" style={{ color: '#3B721A' }} />Top Selling Products
            </CCardHeader>
            <CCardBody style={{ padding: '20px' }}>
              {summary.top_selling_products && summary.top_selling_products.length > 0 ? (
                <div>
                  {summary.top_selling_products.map((product, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-3 p-3 rounded-3" style={{ background: 'rgba(59, 114, 26, 0.08)', border: '1px solid rgba(59, 114, 26, 0.2)' }}>
                      <div>
                        <span className="fw-bold me-2" style={{ color: '#3B721A' }}>#{index + 1}</span>
                        <span className="fw-medium">{product.name}</span>
                      </div>
                      <CBadge 
                        style={{ 
                          background: 'linear-gradient(135deg, #3B721A 0%, #4a8a2a 100%)',
                          border: 'none',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '20px'
                        }}
                      >
                        {product.quantity} units
                      </CBadge>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ minHeight: 80 }} className="d-flex align-items-center justify-content-center text-muted">
                  <div className="text-center">
                    <CIcon icon={cilList} size="2xl" className="mb-2 opacity-50" />
                    <div>No sales data available</div>
                  </div>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} sm={12} className="mb-3">
          <CCard 
            className="h-100 border-0 shadow-sm"
            style={{ 
              background: '#FFFFFF',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <CCardHeader 
              className="border-bottom-0 fw-bold" 
              style={{ 
                background: 'rgba(59, 114, 26, 0.05)',
                borderRadius: '16px 16px 0 0', 
                padding: '16px 20px',
                color: '#3B721A',
                borderBottom: '1px solid rgba(59, 114, 26, 0.2)'
              }}
            >
              <CIcon icon={cilUser} className="me-2" style={{ color: '#3B721A' }} />Best Customers
            </CCardHeader>
            <CCardBody style={{ padding: '20px' }}>
              {summary.best_customers && summary.best_customers.length > 0 ? (
                <div>
                  {summary.best_customers.map((customer, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-3 p-3 rounded-3" style={{ background: 'rgba(59, 114, 26, 0.08)', border: '1px solid rgba(59, 114, 26, 0.2)' }}>
                      <div>
                        <span className="fw-bold me-2" style={{ color: '#3B721A' }}>#{index + 1}</span>
                        <span className="fw-medium">{customer.name}</span>
                      </div>
                      <CBadge 
                        style={{ 
                          background: 'linear-gradient(135deg, #3B721A 0%, #4a8a2a 100%)',
                          border: 'none',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '20px'
                        }}
                      >
                        £{customer.total}
                      </CBadge>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ minHeight: 80 }} className="d-flex align-items-center justify-content-center text-muted">
                  <div className="text-center">
                    <CIcon icon={cilUser} size="2xl" className="mb-2 opacity-50" />
                    <div>No customer data available</div>
                  </div>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} sm={12} className="mb-3">
          <CCard 
            className="h-100 border-0 shadow-sm"
            style={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <CCardHeader 
              className="border-bottom-0 fw-bold" 
              style={{ 
                background: 'rgba(59, 114, 26, 0.05)',
                borderRadius: '16px 16px 0 0', 
                padding: '16px 20px',
                color: '#3B721A',
                borderBottom: '1px solid rgba(59, 114, 26, 0.2)'
              }}
            >
              <CIcon icon={cilTruck} className="me-2" style={{ color: '#3B721A' }} />Best Suppliers
            </CCardHeader>
            <CCardBody style={{ padding: '20px' }}>
              {summary.best_suppliers && summary.best_suppliers.length > 0 ? (
                <div>
                  {summary.best_suppliers.map((supplier, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-3 p-3 rounded-3" style={{ background: 'rgba(59, 114, 26, 0.08)', border: '1px solid rgba(59, 114, 26, 0.2)' }}>
                      <div>
                        <span className="fw-bold me-2" style={{ color: '#3B721A' }}>#{index + 1}</span>
                        <span className="fw-medium">{supplier.name}</span>
                      </div>
                      <CBadge 
                        style={{ 
                          background: 'linear-gradient(135deg, #3B721A 0%, #4a8a2a 100%)',
                          border: 'none',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '20px'
                        }}
                      >
                        £{supplier.total}
                      </CBadge>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ minHeight: 80 }} className="d-flex align-items-center justify-content-center text-muted">
                  <div className="text-center">
                    <CIcon icon={cilTruck} size="2xl" className="mb-2 opacity-50" />
                    <div>No supplier data available</div>
                  </div>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* Row 3: Pending Purchase Orders */}
      <CRow className="mb-3">
        <CCol md={4} sm={12} className="mb-3">
          <CCard 
            className="h-100 border-0 shadow-sm"
            style={{ 
              background: '#FFFFFF',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <CCardHeader 
              className="border-bottom-0 fw-bold" 
              style={{ 
                background: 'rgba(253, 217, 64, 0.05)',
                borderRadius: '16px 16px 0 0', 
                padding: '16px 20px',
                color: '#8B6914',
                borderBottom: '1px solid rgba(253, 217, 64, 0.3)'
              }}
            >
              <CIcon icon={cilTruck} className="me-2" style={{ color: '#8B6914' }} />Pending Purchase Orders
            </CCardHeader>
            <CCardBody style={{ padding: '20px' }}>
              {summary.pending_purchase_orders && summary.pending_purchase_orders.length > 0 ? (
                <div>
                  {summary.pending_purchase_orders.map((po, index) => (
                    <div key={po.id} className="d-flex justify-content-between align-items-center mb-3 p-3 rounded-3" style={{ background: 'rgba(253, 217, 64, 0.08)', border: '1px solid rgba(253, 217, 64, 0.2)' }}>
                      <div>
                        <div className="fw-bold" style={{ color: '#8B6914' }}>{po.po_number}</div>
                        <small className="text-muted">{po.created_at ? new Date(po.created_at).toLocaleDateString() : ''}</small>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold" style={{ color: '#8B6914' }}>£{po.total_amount}</div>
                        <CBadge 
                          style={{ 
                            background: 'linear-gradient(135deg, #FDD940 0%, #f5d030 100%)',
                            border: 'none',
                            color: '#3B721A',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75em',
                            fontWeight: 600
                          }}
                        >
                          {po.status}
                        </CBadge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ minHeight: 80 }} className="d-flex align-items-center justify-content-center text-muted">
                  <div className="text-center">
                    <CIcon icon={cilTruck} size="2xl" className="mb-2 opacity-50" />
                    <div>No pending purchase orders</div>
                  </div>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={8} sm={12} className="mb-3">
          <CCard color="light" textColor="dark" style={{ 
            background: '#FFFFFF', 
            border: '1px solid rgba(0, 0, 0, 0.1)', 
            borderRadius: 20, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}>
            <CCardHeader className="border-bottom-0 fw-bold fs-4" style={{ 
              background: 'rgba(59, 114, 26, 0.05)',
              color: '#3B721A',
              borderRadius: '20px 20px 0 0', 
              padding: '20px 28px',
              textAlign: 'center',
              borderBottom: '1px solid rgba(59, 114, 26, 0.2)'
            }}>
              <CIcon icon={cilChartPie} className="me-2" size="lg" style={{ color: '#3B721A' }} />
              Quick Access Reports
              <div className="mt-2" style={{ fontSize: '0.9em', opacity: 0.8, color: '#3B721A' }}>
                Comprehensive business insights at your fingertips
              </div>
            </CCardHeader>
            <CCardBody className="pb-5 pt-4" style={{ padding: '24px 28px' }}>
              <div className="mb-4 text-center">
                <div className="text-muted mb-3" style={{ fontSize: '1.1em', lineHeight: 1.6 }}>
                  Access detailed financial reports, analytics, and business insights with just one click
                </div>
              </div>
              
              <div className="row g-4">
                <div className="col-md-4 col-sm-6">
                  <div 
                    className="report-card h-100 p-4 rounded-3 shadow-sm border-0"
                    style={{ 
                      background: 'linear-gradient(135deg, #3B721A 0%, #4a8a2a 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: 'translateY(0)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 114, 26, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    onClick={() => navigate('/reports/product-margins')}
                  >
                    <div className="text-center text-white">
                      <CIcon icon={cilChartPie} size="2xl" className="mb-3" />
                      <h6 className="fw-bold mb-2">Product Margins</h6>
                      <p className="small mb-3 opacity-90">Analyze profitability by product</p>
                      <div className="d-flex justify-content-center">
                        <span className="badge bg-white px-3 py-2 rounded-pill" style={{ color: '#3B721A' }}>
                          View Report
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4 col-sm-6">
                  <div 
                    className="report-card h-100 p-4 rounded-3 shadow-sm border-0"
                    style={{ 
                      background: 'linear-gradient(135deg, #A7E06B 0%, #8fd46b 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: 'translateY(0)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(167, 224, 107, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    onClick={() => navigate('/reports/profit-loss')}
                  >
                    <div className="text-center" style={{ color: '#3B721A' }}>
                      <CIcon icon={cilChart} size="2xl" className="mb-3" />
                      <h6 className="fw-bold mb-2">Profit & Loss</h6>
                      <p className="small mb-3 opacity-90">Complete P&L statement</p>
                      <div className="d-flex justify-content-center">
                        <span className="badge bg-white px-3 py-2 rounded-pill" style={{ color: '#3B721A' }}>
                          View Report
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4 col-sm-6">
                  <div 
                    className="report-card h-100 p-4 rounded-3 shadow-sm border-0"
                    style={{ 
                      background: 'linear-gradient(135deg, #FDD940 0%, #f5d030 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: 'translateY(0)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(253, 217, 64, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    onClick={() => navigate('/reports/business-dashboard')}
                  >
                    <div className="text-center" style={{ color: '#3B721A' }}>
                      <CIcon icon={cilSpeedometer} size="2xl" className="mb-3" />
                      <h6 className="fw-bold mb-2">Business Dashboard</h6>
                      <p className="small mb-3 opacity-90">Financial overview & KPIs</p>
                      <div className="d-flex justify-content-center">
                        <span className="badge bg-white px-3 py-2 rounded-pill" style={{ color: '#3B721A' }}>
                          View Report
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <CButton
                  variant="outline"
                  className="px-4 py-2 rounded-pill"
                  onClick={() => navigate('/reports')}
                  style={{
                    borderColor: '#3B721A',
                    color: '#3B721A',
                    fontWeight: 600
                  }}
                >
                  <CIcon icon={cilList} className="me-2" />
                  View All Reports
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* Row 5: Charts */}
      <CRow className="mb-3">
        <CCol md={6} sm={12} className="mb-3">
          <SalesVsPurchasesChart dateRange={dateRange} />
        </CCol>
        <CCol md={6} sm={12} className="mb-3">
          <CCard 
            className="h-100 border-0 shadow-sm"
            style={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <CCardHeader 
              className="border-bottom-0 fw-bold" 
              style={{ 
                background: 'rgba(59, 114, 26, 0.05)',
                borderRadius: '16px 16px 0 0', 
                padding: '16px 20px',
                color: '#3B721A',
                borderBottom: '1px solid rgba(59, 114, 26, 0.2)'
              }}
            >
              <CIcon icon={cilMoney} className="me-2" style={{ color: '#3B721A' }} />Expense Breakdown
            </CCardHeader>
            <CCardBody style={{ padding: '20px' }}>
              <div style={{ position: 'relative', width: '100%', height: 280 }}>
                <Bar
                  data={{
                    labels: expenseLabels,
                    datasets: [
                      {
                        label: 'Expenses (£)',
                        data: expenseData,
                        backgroundColor: [
                          'rgba(59, 114, 26, 0.8)', 'rgba(167, 224, 107, 0.8)', 'rgba(253, 217, 64, 0.8)', 
                          'rgba(74, 138, 42, 0.8)', 'rgba(143, 212, 107, 0.8)', 'rgba(69, 178, 77, 0.8)', 
                          'rgba(105, 178, 77, 0.8)', 'rgba(151, 217, 130, 0.8)', 'rgba(245, 208, 48, 0.8)', 'rgba(139, 105, 20, 0.8)',
                        ],
                        borderColor: [
                          '#3B721A', '#A7E06B', '#FDD940', '#4a8a2a', '#8fd46b', 
                          '#45b24d', '#69b24d', '#97d982', '#f5d030', '#8b6914',
                        ],
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                      },
                    ],
                  }}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#4facfe',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                      }
                    },
                    scales: { 
                      x: { 
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)',
                        },
                        ticks: {
                          color: '#666',
                          font: {
                            size: 12
                          }
                        }
                      },
                      y: {
                        grid: {
                          display: false,
                        },
                        ticks: {
                          color: '#666',
                          font: {
                            size: 12
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Dashboard 