import React, { useEffect, useState } from 'react';
import api from '../../config/axios';
import {
  CCard, CCardHeader, CCardBody, CRow, CCol, CForm, CButton, CAlert, CSpinner, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilDollar, cilInfo } from '@coreui/icons';
import { CTooltip, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, LineChart, Line } from 'recharts';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#E67E22', '#16A085', '#C0392B'];

const getThisMonth = () => {
  const now = new Date();
  return [
    new Date(now.getFullYear(), now.getMonth(), 1),
    new Date(now.getFullYear(), now.getMonth() + 1, 0)
  ];
};

const BusinessDashboard = () => {
  const { hasPermission } = useAuth();
  const [dateRange, setDateRange] = useState(getThisMonth());
  const [filters, setFilters] = useState({
    date_from: dateRange[0].toISOString().slice(0, 10),
    date_to: dateRange[1].toISOString().slice(0, 10),
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCashInfo, setShowCashInfo] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [siteSettings, setSiteSettings] = useState({});

  const fetchData = () => {
    setLoading(true);
    setError(null);
    api.get('/dashboard/business-summary', { params: filters })
      .then(res => setData(res.data))
      .catch(() => {
        setData(null);
        setError('Failed to load dashboard data.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [filters.date_from, filters.date_to]);

  // Fetch site settings
  useEffect(() => {
    api.get('/settings')
      .then(res => {
        if (res.data.siteSettings) {
          setSiteSettings(res.data.siteSettings);
        }
      })
      .catch(() => console.log('Failed to load settings'));
  }, []);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    if (range && range[0] && range[1]) {
      setFilters(prev => ({
        ...prev,
        date_from: range[0].toISOString().slice(0, 10),
        date_to: range[1].toISOString().slice(0, 10),
      }));
    }
  };

  const formatNumber = (val, decimals = 2) => val !== undefined && val !== null ? Number(val).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : '-';

  // Preprocess expense breakdown data to ensure totals are numbers
  const expenseData = data && data.expense_breakdown ? data.expense_breakdown.map(e => ({ ...e, total: Number(e.total) })) : [];

  // PDF Export Function - Backend API Call
  const handleExportPdf = async () => {
    try {
      setExportLoading(true);
      // Call backend API to generate PDF
      const response = await api.get('/dashboard/business-summary/export-pdf', {
        params: filters,
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `business_dashboard_${filters.date_from}_to_${filters.date_to}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export dashboard PDF. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  // Check permission - same as Dashboard
  if (!hasPermission || !hasPermission('view_dashboard')) {
    return (
      <CCard>
        <CCardBody>
          <CAlert color="danger">You do not have permission to view this report.</CAlert>
        </CCardBody>
      </CCard>
    );
  }

  return (
    <CCard>
      <CCardHeader className="d-flex align-items-center justify-content-between">
        <span>Business Financial Dashboard</span>
        <CButton 
          color="primary"
          className="d-flex align-items-center" 
          onClick={handleExportPdf}
          disabled={!data || loading || exportLoading}
          title="Export Dashboard to PDF"
        >
          {exportLoading ? (
            <>
              <CSpinner size="sm" className="me-2" />
              Exporting...
            </>
          ) : (
            <>
              Export PDF
            </>
          )}
        </CButton>
      </CCardHeader>
      <CCardBody>
        {/* Date Range Picker */}
        <CForm className="mb-3">
          <CRow className="g-2 align-items-end align-items-center">
            <CCol md={4}>
              <label className="form-label">Date Range</label>
              <DateRangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                format="yyyy-MM-dd"
                placement="bottomStart"
                ranges={[]}
                style={{ width: '100%' }}
                cleanable={false}
              />
            </CCol>
          </CRow>
        </CForm>
        {loading ? <CSpinner /> : error ? <CAlert color="danger">{error}</CAlert> : data && (
          <>
            {/* Sales Overview */}
            <h5 className="mt-4 mb-2">Sales Overview</h5>
            <div className="small text-secondary mb-2">Total sales, payments received, and outstanding receivables for the selected period. Receivables = Total Sales - Total Paid.</div>
            <CRow className="g-4 mb-3">
              <CCol md={6}><CCard className="shadow-sm"><CCardBody><b>Total Sales{siteSettings.hide_vat_from_everywhere !== '1' ? ' (+VAT)' : ''}</b><div className="fs-5">£ {formatNumber(data.sales.total_sales)}</div><div className="small text-secondary">Sum of all sales invoices (including paid and unpaid).</div></CCardBody></CCard></CCol>
              <CCol md={6}><CCard className="shadow-sm"><CCardBody><b>Total Paid</b><div className="fs-5">£ {formatNumber(data.sales.total_paid)}</div><div className="small text-secondary">Total amount received from customers.</div></CCardBody></CCard></CCol>
            </CRow>
            <CRow className="g-4 mb-3">
              <CCol md={6}><CCard className="shadow-sm"><CCardBody><b>Total Wallet Ledger (Outstanding)</b><div className="fs-5">£ {formatNumber((data.wallet_ledger || []).filter(row => (row.party_type === 'customer' || row.party_type === 'retailer') && Number(row.current_balance) < 0).reduce((sum, row) => sum + (Number(row.current_balance) || 0), 0))}</div><div className="small text-secondary">Sum of all negative balances in customer and retailer wallets (i.e., party owes company).</div></CCardBody></CCard></CCol>
              <CCol md={6}><CCard className="shadow-sm"><CCardBody><b>Total Outstanding</b><div className="fs-5">£ {formatNumber(data.sales.total_outstanding)}</div><div className="small text-secondary">Amount still due from customers.</div></CCardBody></CCard></CCol>
            </CRow>
            {/* <CCol md={6}><CCard className="shadow-sm"><CCardBody><b>Sales by Payment Method</b>
              <div className="small text-secondary mb-2">Breakdown of payments received by method (cash, card, wallet, etc.).</div>
              <CTable small responsive>
                <CTableHead><CTableRow><CTableHeaderCell>Method</CTableHeaderCell><CTableHeaderCell className="text-end">Amount (£)</CTableHeaderCell></CTableRow></CTableHead>
                <CTableBody>
                  {data.sales_payment_breakdown.map((row, idx) => (
                    <CTableRow key={idx}><CTableDataCell>{row.payment_type}</CTableDataCell><CTableDataCell className="text-end">{formatNumber(row.total)}</CTableDataCell></CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody></CCard></CCol> */}
            <CRow className="g-4 mb-3">
              <CCol md={12}>
                <CCard className="shadow-sm">
                  <CCardBody>
                    <CAccordion alwaysOpen>
                      <CAccordionItem itemKey={1}>
                        <CAccordionHeader>Wallet Ledger (Outstanding)</CAccordionHeader>
                        <CAccordionBody>
                          <div className="small text-secondary mb-2">Outstanding balances in customer and retailer wallets.</div>
                          <CTable small responsive>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell>Name</CTableHeaderCell>
                                <CTableHeaderCell>Type</CTableHeaderCell>
                                <CTableHeaderCell>Contact</CTableHeaderCell>
                                <CTableHeaderCell className="text-end">Balance (£)</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {(data.wallet_ledger || [])
                                .filter(row => (row.party_type === 'customer' || row.party_type === 'retailer') && Number(row.current_balance) < 0)
                                .map((row, idx) => (
                                  <CTableRow key={idx}>
                                    <CTableDataCell>{row.name}</CTableDataCell>
                                    <CTableDataCell>{row.party_type}</CTableDataCell>
                                    <CTableDataCell>{row.phone}</CTableDataCell>
                                    <CTableDataCell className="text-end">{formatNumber(row.current_balance)}</CTableDataCell>
                                  </CTableRow>
                                ))}
                            </CTableBody>
                          </CTable>
                        </CAccordionBody>
                      </CAccordionItem>
                    </CAccordion>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            {/* Purchases Overview */}
            <h5 className="mt-4 mb-2">Purchases Overview</h5>
            <div className="small text-secondary mb-2">Total purchases, payments made to suppliers, and outstanding payables for the selected period. Payables = Total Purchases - Total Paid.</div>
            <CRow className="g-4 mb-3">
              <CCol md={6}><CCard className="shadow-sm"><CCardBody><b>Total Purchases</b><div className="fs-5">£ {formatNumber(data.purchases.total_purchases)}</div><div className="small text-secondary">Sum of all purchase orders (including paid and unpaid).</div></CCardBody></CCard></CCol>
              <CCol md={6}><CCard className="shadow-sm"><CCardBody><b>Total Paid</b><div className="fs-5">£ {formatNumber(data.purchases.total_paid)}</div><div className="small text-secondary">Total amount paid to suppliers.</div></CCardBody></CCard></CCol>
            </CRow>
            <CRow className="g-4 mb-3">
              <CCol md={6}><CCard className="shadow-sm"><CCardBody><b>Total Outstanding</b><div className="fs-5">£ {formatNumber(data.purchases.total_outstanding)}</div><div className="small text-secondary">Amount still due to suppliers.</div></CCardBody></CCard></CCol>
              <CCol md={6}><CCard className="shadow-sm"><CCardBody><b>Payables</b><div className="fs-5">£ {formatNumber(data.payables)}</div><div className="small text-secondary">Total supplier outstanding (payables).</div></CCardBody></CCard></CCol>
            </CRow>
            <CRow className="g-4 mb-3">
              <CCol md={12}>
                <CCard className="shadow-sm">
                  <CCardBody>
                    <CAccordion alwaysOpen>
                      <CAccordionItem itemKey={1}>
                        <CAccordionHeader>Supplier Outstanding</CAccordionHeader>
                        <CAccordionBody>
                          <div className="small text-secondary mb-2">Outstanding amount per supplier = sum of all their purchase orders minus payments made.</div>
                          <CTable small responsive>
                            <CTableHead><CTableRow><CTableHeaderCell>Supplier</CTableHeaderCell><CTableHeaderCell className="text-end">Outstanding (£)</CTableHeaderCell></CTableRow></CTableHead>
                            <CTableBody>
                              {data.supplier_outstanding.map((row, idx) => (
                                <CTableRow key={idx}><CTableDataCell>{row.supplier}</CTableDataCell><CTableDataCell className="text-end">{formatNumber(row.outstanding)}</CTableDataCell></CTableRow>
                              ))}
                            </CTableBody>
                          </CTable>
                        </CAccordionBody>
                      </CAccordionItem>
                    </CAccordion>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            {/* Expenses Overview */}
            <h5 className="mt-4 mb-2">Expenses Overview</h5>
            <div className="small text-secondary mb-2">Total expenses, breakdown by category, and recent expense entries for the selected period.</div>
            <CRow className="g-4 mb-3">
              <CCol md={6}><CCard className="shadow-sm"><CCardBody><b>Total Expenses</b><div className="fs-5">£ {formatNumber(data.expenses.total_expenses)}</div><div className="small text-secondary">Sum of all expenses (all categories).</div></CCardBody></CCard></CCol>
              <CCol md={6}><CCard className="shadow-sm"><CCardBody><b>Expense Breakdown by Category</b>
                <div className="small text-secondary mb-2">Pie chart of expenses by category.</div>
                {expenseData && expenseData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={expenseData} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" width={120} />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="total" fill="#8884d8">
                        {expenseData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : <div className="text-muted">No expense data for this period.</div>}
              </CCardBody></CCard></CCol>
            </CRow>
            <CRow className="g-4 mb-3">
              <CCol md={12}>
                <CCard className="shadow-sm">
                  <CCardBody>
                    <CAccordion alwaysOpen>
                      <CAccordionItem itemKey={1}>
                        <CAccordionHeader>All Expenses ({data.recent_expenses ? data.recent_expenses.length : 0} entries)</CAccordionHeader>
                        <CAccordionBody>
                          <div className="small text-secondary mb-2">All expenses for the selected date range.</div>
                          <CTable small responsive>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell>Date</CTableHeaderCell>
                                <CTableHeaderCell>Category</CTableHeaderCell>
                                <CTableHeaderCell>Description</CTableHeaderCell>
                                <CTableHeaderCell className="text-end">Amount (£)</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {data.recent_expenses && data.recent_expenses.length > 0 ? (
                                data.recent_expenses.map((row, idx) => (
                                  <CTableRow key={idx}>
                                    <CTableDataCell>{row.date}</CTableDataCell>
                                    <CTableDataCell>{row.category}</CTableDataCell>
                                    <CTableDataCell>{row.description}</CTableDataCell>
                                    <CTableDataCell className="text-end">{formatNumber(row.amount)}</CTableDataCell>
                                  </CTableRow>
                                ))
                              ) : (
                                <CTableRow>
                                  <CTableDataCell colSpan={4} className="text-center text-muted">
                                    No expenses found for the selected date range.
                                  </CTableDataCell>
                                </CTableRow>
                              )}
                            </CTableBody>
                          </CTable>
                        </CAccordionBody>
                      </CAccordionItem>
                    </CAccordion>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            {/* Cash Flow Summary */}
            <h5 className="mt-4 mb-2 d-flex align-items-center">Cash Flow Summary
              <CButton color="link" className="p-0 ms-2" onClick={() => setShowCashInfo(true)} title="How is cash flow calculated?">
                <CIcon icon={cilInfo} size="lg" />
              </CButton>
            </h5>
            <CRow className="g-4 mb-3">
              <CCol md={4}>
                <CCard className="shadow-sm bg-success text-white">
                  <CCardBody className="d-flex align-items-center">
                    <CIcon icon={cilArrowTop} size="xl" className="me-3" />
                    <div>
                      <b>Total Inflow</b>
                      <div className="fs-5">£ {formatNumber(data.cash_flow.inflow)}</div>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={4}>
                <CCard className="shadow-sm bg-danger text-white">
                  <CCardBody className="d-flex align-items-center">
                    <CIcon icon={cilArrowBottom} size="xl" className="me-3" />
                    <div>
                      <b>Total Outflow</b>
                      <div className="fs-5">£ {formatNumber(data.cash_flow.outflow)}</div>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={4}>
                <CCard className={`shadow-sm ${data.cash_flow.net_cash < 0 ? 'bg-danger' : 'bg-success'} text-white`}>
                  <CCardBody className="d-flex align-items-center">
                    <CIcon icon={cilDollar} size="xl" className="me-3" />
                    <div>
                      <b>Net Cash</b>
                      <div className="fs-5">£ {formatNumber(data.cash_flow.net_cash)}</div>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            {/* Info section below Cash Flow Summary cards */}
            <div className="mb-3">
              <div className="alert alert-info" style={{ fontSize: '1em' }}>
                <b>How is Cash Flow Calculated?</b><br />
                <ul className="mb-0">
                  <li><b>Total Inflow:</b> <br />
                    <code>Total Inflow = Total Paid from Sales (all payment methods)</code>
                  </li>
                  <li><b>Total Outflow:</b> <br />
                    <code>Total Outflow = Purchases Paid + Total Expenses</code>
                  </li>
                  <li><b>Net Cash:</b> <br />
                    <code>Net Cash = Total Inflow - Total Outflow</code>
                  </li>
                </ul>
                <span className="text-muted" style={{ fontSize: '0.95em' }}>
                  This summary shows cash movement for the selected period. For a full cash flow statement, include opening and closing balances.
                </span>
              </div>
            </div>
            {/* Info Modal for Cash Flow */}
            <CModal visible={showCashInfo} onClose={() => setShowCashInfo(false)}>
              <CModalHeader onClose={() => setShowCashInfo(false)}>
                <span>How is Cash Flow Calculated?</span>
              </CModalHeader>
              <CModalBody>
                <ul>
                  <li><b>Total Inflow:</b> <br />
                    <code>Total Inflow = Total Paid from Sales (all payment methods)</code>
                  </li>
                  <li><b>Total Outflow:</b> <br />
                    <code>Total Outflow = Purchases Paid + Total Expenses</code>
                  </li>
                  <li><b>Net Cash:</b> <br />
                    <code>Net Cash = Total Inflow - Total Outflow</code>
                  </li>
                </ul>
                <div className="mt-2 text-muted" style={{ fontSize: '0.95em' }}>
                  <b>Note:</b> This summary shows cash movement for the selected period. For a full cash flow statement, include opening and closing balances.
                </div>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setShowCashInfo(false)}>Close</CButton>
              </CModalFooter>
            </CModal>
          </>
        )}
      </CCardBody>
    </CCard>
  );
};

export default BusinessDashboard; 