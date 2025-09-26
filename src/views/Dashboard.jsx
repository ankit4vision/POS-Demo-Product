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
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

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
    <div style={{ margin: '0 auto', padding: '24px', background: '#f5f6fa', minHeight: '100vh' }}>
      <div className="mb-4">
        <h3 className="mb-2">Dashboard</h3>
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
          <CButton size="sm" color="secondary" variant="outline" onClick={() => {
            const defaultRange = [
              new Date(now.getFullYear(), now.getMonth(), 1),
              new Date(now.getFullYear(), now.getMonth() + 1, 0)
            ];
            setDateRange(defaultRange);
            fetchData(defaultRange);
          }}>Reset</CButton>
          <CButton size="sm" color="primary" variant="outline" onClick={() => fetchData(dateRange)}>Refresh</CButton>
        </div>
      </div>
      {/* Row 1: Key Metrics */}
      <CRow className="mb-3">
        <CCol md={4} sm={12} className="mb-3">
          <CCard 
            className="h-100 border-0 shadow-sm"
            style={{ 
              background: 'linear-gradient(135deg, #e8f2ff 0%, #f0e8ff 25%, #fef8ff 50%, #fff0f5 75%, #e8f8ff 100%)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
            onClick={() => navigate('/invoices')}
          >
            <CCardBody className="d-flex align-items-center text-dark p-4">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 60,
                  height: 60,
                  background: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: '50%',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <CIcon icon={cilCart} size="xl" className="text-primary" />
              </div>
              <div>
                <div className="fs-6 text-muted mb-1">Total Sales (+VAT)</div>
                <div className="fs-2 fw-bold text-primary">£{summary.total_sales}</div>
                <div className="small text-muted">All sales invoices including VAT</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} sm={12} className="mb-3">
          <CCard 
            className="h-100 border-0 shadow-sm"
            style={{ 
              background: 'linear-gradient(135deg, #e8f2ff 0%, #f0e8ff 25%, #fef8ff 50%, #fff0f5 75%, #e8f8ff 100%)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
            onClick={() => navigate('/purchases')}
          >
            <CCardBody className="d-flex align-items-center text-dark p-4">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 60,
                  height: 60,
                  background: 'rgba(240, 147, 251, 0.1)',
                  borderRadius: '50%',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <CIcon icon={cilTruck} size="xl" className="text-danger" />
              </div>
              <div>
                <div className="fs-6 text-muted mb-1">Total Purchases</div>
                <div className="fs-2 fw-bold text-danger">£{summary.total_purchases}</div>
                <div className="small text-muted">Purchase orders (excluding drafts)</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} sm={12} className="mb-3">
          <CCard 
            className="h-100 border-0 shadow-sm"
            style={{ 
              background: 'linear-gradient(135deg, #e8f2ff 0%, #f0e8ff 25%, #fef8ff 50%, #fff0f5 75%, #e8f8ff 100%)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
            onClick={() => navigate('/expenses')}
          >
            <CCardBody className="d-flex align-items-center text-dark p-4">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 60,
                  height: 60,
                  background: 'rgba(79, 172, 254, 0.1)',
                  borderRadius: '50%',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <CIcon icon={cilMoney} size="xl" className="text-info" />
              </div>
              <div>
                <div className="fs-6 text-muted mb-1">Total Expenses</div>
                <div className="fs-2 fw-bold text-info">£{summary.total_expenses}</div>
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
              background: 'linear-gradient(135deg, #e8f2ff 0%, #f0e8ff 25%, #fef8ff 50%, #fff0f5 75%, #e8f8ff 100%)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
            onClick={() => navigate('/customers')}
          >
            <CCardBody className="d-flex align-items-center text-dark p-4">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 60,
                  height: 60,
                  background: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: '50%',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <CIcon icon={cilUser} size="xl" className="text-secondary" />
              </div>
              <div>
                <div className="fs-6 text-muted mb-1">Total Customers</div>
                <div className="fs-2 fw-bold text-secondary">{summary.total_customers}</div>
                <div className="small text-muted">Active customer base</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} sm={12} className="mb-3">
          <CCard 
            className="h-100 border-0 shadow-sm"
            style={{ 
              background: 'linear-gradient(135deg, #e8f2ff 0%, #f0e8ff 25%, #fef8ff 50%, #fff0f5 75%, #e8f8ff 100%)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
            onClick={() => navigate('/products')}
          >
            <CCardBody className="d-flex align-items-center text-dark p-4">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 60,
                  height: 60,
                  background: 'rgba(249, 177, 21, 0.1)',
                  borderRadius: '50%',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <CIcon icon={cilList} size="xl" className="text-warning" />
              </div>
              <div>
                <div className="fs-6 text-muted mb-1">Total Products</div>
                <div className="fs-2 fw-bold text-warning">{summary.total_products}</div>
                <div className="small text-muted">Items in inventory</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} sm={12} className="mb-3">
          <CCard 
            className="h-100 border-0 shadow-sm"
            style={{ 
              background: 'linear-gradient(135deg, #e8f2ff 0%, #f0e8ff 25%, #fef8ff 50%, #fff0f5 75%, #e8f8ff 100%)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
            onClick={() => navigate('/products?filter=low-stock')}
          >
            <CCardBody className="d-flex align-items-center text-dark p-4">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 60,
                  height: 60,
                  background: 'rgba(79, 172, 254, 0.1)',
                  borderRadius: '50%',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <CIcon icon={cilWarning} size="xl" className="text-info" />
              </div>
              <div>
                <div className="fs-6 text-muted mb-1">Low Stock Alert</div>
                <div className="fs-2 fw-bold text-info">{summary.low_stock}</div>
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
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
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
              className="border-bottom-0 fw-bold text-white" 
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px 16px 0 0', 
                padding: '16px 20px' 
              }}
            >
              <CIcon icon={cilList} className="me-2" />Top Selling Products
            </CCardHeader>
            <CCardBody style={{ padding: '20px' }}>
              {summary.top_selling_products && summary.top_selling_products.length > 0 ? (
                <div>
                  {summary.top_selling_products.map((product, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-3 p-3 rounded-3" style={{ background: 'rgba(102, 126, 234, 0.05)' }}>
                      <div>
                        <span className="fw-bold me-2 text-primary">#{index + 1}</span>
                        <span className="fw-medium">{product.name}</span>
                      </div>
                      <CBadge 
                        style={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              background: 'linear-gradient(135deg, #ffffff 0%, #fff8f9 100%)',
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
              className="border-bottom-0 fw-bold text-white" 
              style={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '16px 16px 0 0', 
                padding: '16px 20px' 
              }}
            >
              <CIcon icon={cilUser} className="me-2" />Best Customers
            </CCardHeader>
            <CCardBody style={{ padding: '20px' }}>
              {summary.best_customers && summary.best_customers.length > 0 ? (
                <div>
                  {summary.best_customers.map((customer, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-3 p-3 rounded-3" style={{ background: 'rgba(240, 147, 251, 0.05)' }}>
                      <div>
                        <span className="fw-bold me-2 text-danger">#{index + 1}</span>
                        <span className="fw-medium">{customer.name}</span>
                      </div>
                      <CBadge 
                        style={{ 
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
              className="border-bottom-0 fw-bold text-white" 
              style={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '16px 16px 0 0', 
                padding: '16px 20px' 
              }}
            >
              <CIcon icon={cilTruck} className="me-2" />Best Suppliers
            </CCardHeader>
            <CCardBody style={{ padding: '20px' }}>
              {summary.best_suppliers && summary.best_suppliers.length > 0 ? (
                <div>
                  {summary.best_suppliers.map((supplier, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-3 p-3 rounded-3" style={{ background: 'rgba(79, 172, 254, 0.05)' }}>
                      <div>
                        <span className="fw-bold me-2 text-info">#{index + 1}</span>
                        <span className="fw-medium">{supplier.name}</span>
                      </div>
                      <CBadge 
                        style={{ 
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
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
              background: 'linear-gradient(135deg, #ffffff 0%, #fffbf0 100%)',
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
              className="border-bottom-0 fw-bold text-white" 
              style={{ 
                background: 'linear-gradient(135deg, #f9b115 0%, #ff8c00 100%)',
                borderRadius: '16px 16px 0 0', 
                padding: '16px 20px' 
              }}
            >
              <CIcon icon={cilTruck} className="me-2" />Pending Purchase Orders
            </CCardHeader>
            <CCardBody style={{ padding: '20px' }}>
              {summary.pending_purchase_orders && summary.pending_purchase_orders.length > 0 ? (
                <div>
                  {summary.pending_purchase_orders.map((po, index) => (
                    <div key={po.id} className="d-flex justify-content-between align-items-center mb-3 p-3 rounded-3" style={{ background: 'rgba(249, 177, 21, 0.05)' }}>
                      <div>
                        <div className="fw-bold text-warning">{po.po_number}</div>
                        <small className="text-muted">{po.created_at ? new Date(po.created_at).toLocaleDateString() : ''}</small>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold">£{po.total_amount}</div>
                        <CBadge 
                          style={{ 
                            background: 'linear-gradient(135deg, #f9b115 0%, #ff8c00 100%)',
                            border: 'none',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75em'
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
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)', 
            border: '1px solid #e9ecef', 
            borderRadius: 20, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}>
            <CCardHeader className="border-bottom-0 fw-bold fs-4" style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '20px 20px 0 0', 
              padding: '20px 28px',
              textAlign: 'center'
            }}>
              <CIcon icon={cilChartPie} className="me-2" size="lg" />
              Quick Access Reports
              <div className="mt-2" style={{ fontSize: '0.9em', opacity: 0.9 }}>
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
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: 'translateY(0)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.3)';
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
                        <span className="badge bg-white text-primary px-3 py-2 rounded-pill">
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
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: 'translateY(0)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(240, 147, 251, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    onClick={() => navigate('/reports/profit-loss')}
                  >
                    <div className="text-center text-white">
                      <CIcon icon={cilChart} size="2xl" className="mb-3" />
                      <h6 className="fw-bold mb-2">Profit & Loss</h6>
                      <p className="small mb-3 opacity-90">Complete P&L statement</p>
                      <div className="d-flex justify-content-center">
                        <span className="badge bg-white text-danger px-3 py-2 rounded-pill">
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
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: 'translateY(0)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(79, 172, 254, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    onClick={() => navigate('/reports/business-dashboard')}
                  >
                    <div className="text-center text-white">
                      <CIcon icon={cilSpeedometer} size="2xl" className="mb-3" />
                      <h6 className="fw-bold mb-2">Business Dashboard</h6>
                      <p className="small mb-3 opacity-90">Financial overview & KPIs</p>
                      <div className="d-flex justify-content-center">
                        <span className="badge bg-white text-info px-3 py-2 rounded-pill">
                          View Report
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <CButton
                  color="light"
                  variant="outline"
                  className="px-4 py-2 rounded-pill"
                  onClick={() => navigate('/reports')}
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
              className="border-bottom-0 fw-bold text-white" 
              style={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '16px 16px 0 0', 
                padding: '16px 20px' 
              }}
            >
              <CIcon icon={cilMoney} className="me-2" />Expense Breakdown
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
                          'rgba(102, 126, 234, 0.8)', 'rgba(240, 147, 251, 0.8)', 'rgba(79, 172, 254, 0.8)', 
                          'rgba(249, 177, 21, 0.8)', 'rgba(46, 184, 92, 0.8)', 'rgba(111, 66, 193, 0.8)', 
                          'rgba(32, 201, 151, 0.8)', 'rgba(253, 126, 20, 0.8)', 'rgba(232, 62, 140, 0.8)', 'rgba(229, 83, 83, 0.8)',
                        ],
                        borderColor: [
                          '#667eea', '#f093fb', '#4facfe', '#f9b115', '#2eb85c', 
                          '#6f42c1', '#20c997', '#fd7e14', '#e83e8c', '#e55353',
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