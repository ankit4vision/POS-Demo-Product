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
          <CCard color="light" textColor="dark" style={{ background: '#fff', minHeight: 140, border: '1px solid #e9ecef', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CCardBody className="d-flex align-items-center">
              <CIcon icon={cilCart} size="xl" className="me-3 text-primary" />
              <div>
                <div className="fs-6">Total Sales (+VAT)</div>
                <div className="fs-4 fw-bold">£{summary.total_sales}</div>
                <div className="small text-secondary">Sum of all sales invoices (including VAT).</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} sm={12} className="mb-3">
          <CCard color="light" textColor="dark" style={{ background: '#fff', minHeight: 140, border: '1px solid #e9ecef', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CCardBody className="d-flex align-items-center">
              <CIcon icon={cilTruck} size="xl" className="me-3 text-info" />
              <div>
                <div className="fs-6">Total Purchases</div>
                <div className="fs-4 fw-bold">£{summary.total_purchases}</div>
                <div className="small text-secondary">Sum of all purchase orders (excluding drafts).</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} sm={12} className="mb-3">
          <CCard color="light" textColor="dark" style={{ background: '#fff', minHeight: 140, border: '1px solid #e9ecef', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CCardBody className="d-flex align-items-center">
              <CIcon icon={cilMoney} size="xl" className="me-3 text-danger" />
              <div>
                <div className="fs-6">Total Expenses</div>
                <div className="fs-4 fw-bold">£{summary.total_expenses}</div>
                <div className="small text-secondary">Sum of all company expenses.</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* Row: Total Customers, Total Products, Low Stock Products */}
      <CRow className="mb-3">
        <CCol md={4} sm={12} className="mb-3">
          <CCard color="light" textColor="dark" style={{ background: '#fff', minHeight: 140, border: '1px solid #e9ecef', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CCardBody className="d-flex align-items-center">
              <CIcon icon={cilUser} size="xl" className="me-3 text-secondary" />
              <div>
                <div className="fs-6">Total Customers</div>
                <div className="fs-4 fw-bold">{summary.total_customers}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} sm={12} className="mb-3">
          <CCard color="light" textColor="dark" style={{ background: '#fff', minHeight: 140, border: '1px solid #e9ecef', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CCardBody className="d-flex align-items-center">
              <CIcon icon={cilList} size="xl" className="me-3 text-warning" />
              <div>
                <div className="fs-6">Total Products</div>
                <div className="fs-4 fw-bold">{summary.total_products}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} sm={12} className="mb-3">
          <CCard color="light" textColor="dark" style={{ background: '#fff', minHeight: 140, border: '1px solid #e9ecef', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CCardHeader className="bg-light border-bottom-0 fw-bold" style={{ borderRadius: '12px 12px 0 0', padding: '12px 16px' }}><CIcon icon={cilWarning} className="me-2 text-dark" />Low Stock Products</CCardHeader>
            <CCardBody className="d-flex flex-column align-items-center justify-content-center">
              <div className="fs-1 fw-bold">{summary.low_stock}</div>
              <div className="text-muted">products at or below low stock</div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* Row: Top Selling Products, Best Customers, Best Suppliers */}
      <CRow className="mb-3">
        <CCol md={4} sm={12} className="mb-3">
          <CCard color="light" textColor="dark" style={{ background: '#fff', minHeight: 220, border: '1px solid #e9ecef', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CCardHeader className="bg-light border-bottom-0 fw-bold" style={{ borderRadius: '12px 12px 0 0', padding: '12px 16px' }}><CIcon icon={cilList} className="me-2 text-primary" />Top Selling Products</CCardHeader>
            <CCardBody>
              {summary.top_selling_products && summary.top_selling_products.length > 0 ? (
                <div>
                  {summary.top_selling_products.map((product, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                      <div>
                        <span className="fw-bold me-2">#{index + 1}</span>
                        <span>{product.name}</span>
                      </div>
                      <CBadge color="primary" variant="outline">{product.quantity} units</CBadge>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ minHeight: 80 }} className="d-flex align-items-center justify-content-center text-muted">No sales data available</div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} sm={12} className="mb-3">
          <CCard color="light" textColor="dark" style={{ background: '#fff', minHeight: 220, border: '1px solid #e9ecef', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CCardHeader className="bg-light border-bottom-0 fw-bold" style={{ borderRadius: '12px 12px 0 0', padding: '12px 16px' }}><CIcon icon={cilUser} className="me-2 text-success" />Best Customers</CCardHeader>
            <CCardBody>
              {summary.best_customers && summary.best_customers.length > 0 ? (
                <div>
                  {summary.best_customers.map((customer, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                      <div>
                        <span className="fw-bold me-2">#{index + 1}</span>
                        <span>{customer.name}</span>
                      </div>
                      <CBadge color="success" variant="outline">£{customer.total}</CBadge>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ minHeight: 80 }} className="d-flex align-items-center justify-content-center text-muted">No customer data available</div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} sm={12} className="mb-3">
          <CCard color="light" textColor="dark" style={{ background: '#fff', minHeight: 220, border: '1px solid #e9ecef', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CCardHeader className="bg-light border-bottom-0 fw-bold" style={{ borderRadius: '12px 12px 0 0', padding: '12px 16px' }}><CIcon icon={cilTruck} className="me-2 text-info" />Best Suppliers</CCardHeader>
            <CCardBody>
              {summary.best_suppliers && summary.best_suppliers.length > 0 ? (
                <div>
                  {summary.best_suppliers.map((supplier, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                      <div>
                        <span className="fw-bold me-2">#{index + 1}</span>
                        <span>{supplier.name}</span>
                      </div>
                      <CBadge color="info" variant="outline">£{supplier.total}</CBadge>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ minHeight: 80 }} className="d-flex align-items-center justify-content-center text-muted">No supplier data available</div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* Row 3: Pending Purchase Orders */}
      <CRow className="mb-3">
        <CCol md={4} sm={12} className="mb-3">
          <CCard color="light" textColor="dark" style={{ background: '#fff', minHeight: 220, border: '1px solid #e9ecef', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CCardHeader className="bg-light border-bottom-0 fw-bold" style={{ borderRadius: '12px 12px 0 0', padding: '12px 16px' }}><CIcon icon={cilTruck} className="me-2 text-warning" />Pending Purchase Orders</CCardHeader>
            <CCardBody>
              {summary.pending_purchase_orders && summary.pending_purchase_orders.length > 0 ? (
                <div>
                  {summary.pending_purchase_orders.map((po, index) => (
                    <div key={po.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                      <div>
                        <div className="fw-bold">{po.po_number}</div>
                        <small className="text-muted">{po.created_at ? new Date(po.created_at).toLocaleDateString() : ''}</small>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold">£{po.total_amount}</div>
                        <CBadge color="warning" variant="outline">{po.status}</CBadge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ minHeight: 80 }} className="d-flex align-items-center justify-content-center text-muted">No pending purchase orders</div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={8} sm={12} className="mb-3">
          <CCard color="light" textColor="dark" style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <CCardHeader className="bg-white border-bottom-0 fw-bold fs-5" style={{ borderRadius: '16px 16px 0 0', padding: '18px 24px' }}>
              <CIcon icon={cilChartPie} className="me-2 text-primary" />Quick Access Reports
            </CCardHeader>
            <CCardBody className="pb-4 pt-2">
              <div className="mb-3 text-secondary" style={{ fontSize: '1.05em' }}>
                Jump directly to key company reports for detailed financial and sales insights.
              </div>
              <div className="d-flex flex-wrap gap-4 justify-content-center w-100">
                <CButton
                  color="primary"
                  variant="outline"
                  className="px-4 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2 fs-5"
                  style={{ minWidth: 260 }}
                  onClick={() => navigate('/reports/product-margins')}
                >
                  <CIcon icon={cilChartPie} /> Product-wise Margin Report
                </CButton>
                <CButton
                  color="info"
                  variant="outline"
                  className="px-4 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2 fs-5"
                  style={{ minWidth: 260 }}
                  onClick={() => navigate('/reports/profit-loss')}
                >
                  <CIcon icon={cilChart} /> Company Profit & Loss (P&L) Report
                </CButton>
                <CButton
                  color="success"
                  variant="outline"
                  className="px-4 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2 fs-5"
                  style={{ minWidth: 260 }}
                  onClick={() => navigate('/reports/business-dashboard')}
                >
                  <CIcon icon={cilSpeedometer} /> Business Financial Dashboard
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
          <CCard color="light" textColor="dark" style={{ background: '#fff', minHeight: 320, border: '1px solid #e9ecef', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <CCardHeader className="bg-light border-bottom-0 fw-bold" style={{ borderRadius: '12px 12px 0 0', padding: '12px 16px' }}><CIcon icon={cilMoney} className="me-2 text-info" />Expense Breakdown</CCardHeader>
            <CCardBody>
              <div style={{ position: 'relative', width: '100%', height: 280 }}>
                <Bar
                  data={{
                    labels: expenseLabels,
                    datasets: [
                      {
                        label: 'Expenses (£)',
                        data: expenseData,
                        backgroundColor: [
                          '#321fdb', '#39f', '#f9b115', '#e55353', '#2eb85c', '#f7b924', '#6f42c1', '#20c997', '#fd7e14', '#e83e8c',
                        ],
                      },
                    ],
                  }}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { x: { beginAtZero: true } },
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