import React, { useEffect, useState } from 'react';
import api from '../../config/axios';
import {
  CCard, CCardHeader, CCardBody, CRow, CCol, CForm, CButton, CAlert, CSpinner, CModal, CModalHeader, CModalBody, CModalFooter, CTooltip
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilInfo, cilArrowTop, cilArrowBottom } from '@coreui/icons';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#E67E22', '#16A085', '#C0392B'];

const getThisMonth = () => {
  const now = new Date();
  return [
    new Date(now.getFullYear(), now.getMonth(), 1),
    new Date(now.getFullYear(), now.getMonth() + 1, 0)
  ];
};
const getLastMonth = () => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const last = new Date(now.getFullYear(), now.getMonth(), 0);
  return [first, last];
};

const ProfitLossReport = () => {
  const { hasPermission } = useAuth();
  const [dateRange, setDateRange] = useState(getThisMonth());
  const [filters, setFilters] = useState({
    date_from: dateRange[0].toISOString().slice(0, 10),
    date_to: dateRange[1].toISOString().slice(0, 10),
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [siteSettings, setSiteSettings] = useState({});

  const fetchData = () => {
    setLoading(true);
    setError(null);
    api.get('/reports/profit-loss', { params: filters })
      .then(res => setData(res.data))
      .catch(() => {
        setData(null);
        setError('Failed to load report data.');
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

  // Handle date range change
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

  const handleQuickRange = (type) => {
    let range = getThisMonth();
    if (type === 'last') range = getLastMonth();
    setDateRange(range);
    setFilters(prev => ({
      ...prev,
      date_from: range[0].toISOString().slice(0, 10),
      date_to: range[1].toISOString().slice(0, 10),
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };
  const formatNumber = (val, decimals = 2) => val !== undefined && val !== null ? Number(val).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : '-';
  const percentArrow = (val) => val > 0 ? <CIcon icon={cilArrowTop} className="text-success ms-1" /> : val < 0 ? <CIcon icon={cilArrowBottom} className="text-danger ms-1" /> : null;
  const percentColor = (val) => val > 0 ? 'text-success' : val < 0 ? 'text-danger' : '';

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
        <span>Company Profit & Loss (P&amp;L) Report</span>
        <CButton color="link" className="p-0" onClick={() => setShowInfo(true)} title="How are these values calculated?">
          <CIcon icon={cilInfo} size="lg" />
        </CButton>
      </CCardHeader>
      <CCardBody>
        {/* Info Modal */}
        <CModal visible={showInfo} onClose={() => setShowInfo(false)}>
          <CModalHeader onClose={() => setShowInfo(false)}>
            <span>How are these values calculated?</span>
          </CModalHeader>
          <CModalBody>
            <ul>
              <li><b>Net Sales:</b> <br />
                <code>Net Sales = Σ (Sale Price × Quantity Sold - Discount)</code>
              </li>
              <li><b>Total Cost:</b> <br />
                <code>Total Cost = Σ (Purchase Price × Quantity Sold)</code>
              </li>
              <li><b>Gross Profit:</b> <br />
                <code>Gross Profit = Net Sales - Total Cost</code>
              </li>
              <li><b>Total Expenses:</b> <br />
                <code>Total Expenses = Σ (All company expenses in period)</code>
              </li>
              <li><b>Net Profit:</b> <br />
                <code>Net Profit = Gross Profit - Total Expenses</code>
              </li>
              <li><b>Margin %:</b> <br />
                <code>Margin % = (Net Profit / Net Sales) × 100</code>
              </li>
              {siteSettings.hide_vat_from_everywhere !== '1' && (
                <li><b>Total VAT Collected:</b> <br />
                  <code>Total VAT Collected = Σ (Tax for each sale item)</code><br />
                  <span className="text-muted">(VAT is not included in margin/profit calculations.)</span>
                </li>
              )}
            </ul>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowInfo(false)}>Close</CButton>
          </CModalFooter>
        </CModal>
        {/* Filters */}
        <CForm className="mb-3" onSubmit={handleSearch}>
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
            <CCol md={2}>
              <CButton color="primary" type="submit" className="w-100">Search</CButton>
            </CCol>
          </CRow>
        </CForm>
        {/* Summary Cards/Table */}
        {loading ? <CSpinner /> : error ? <CAlert color="danger">{error}</CAlert> : data && (
          <>
            <CRow className="g-4 mb-4">
              {/* Section: Sales & Profit */}
              <CCol xs={12}><h5 className="mb-2 mt-3">Sales & Profit</h5></CCol>
              <CCol md={4}><CCard className="shadow-sm"><CCardBody><b>Net Sales</b>
                <div className="fs-4 text-success">£ {formatNumber(data.net_sales)}
                  <span className={percentColor(data.percent_change.net_sales)}>
                    {percentArrow(data.percent_change.net_sales)}
                    {data.percent_change.net_sales !== 0 && <span> {formatNumber(data.percent_change.net_sales, 2)}%</span>}
                  </span>
                </div>
                <div className="small text-muted">Prev: £ {formatNumber(data.previous.net_sales)}</div>
                <div className="small text-secondary">Total sales after discounts, before VAT.</div>
              </CCardBody></CCard></CCol>
              <CCol md={4}><CCard className="shadow-sm"><CCardBody><b>Total Cost</b>
                <div className="fs-4 text-danger">£ {formatNumber(data.total_cost)}
                  <span className={percentColor(data.percent_change.total_cost)}>
                    {percentArrow(data.percent_change.total_cost)}
                    {data.percent_change.total_cost !== 0 && <span> {formatNumber(data.percent_change.total_cost, 2)}%</span>}
                  </span>
                </div>
                <div className="small text-muted">Prev: £ {formatNumber(data.previous.total_cost)}</div>
                <div className="small text-secondary">Total cost of goods sold (COGS).</div>
              </CCardBody></CCard></CCol>
              <CCol md={4}><CCard className="shadow-sm"><CCardBody><b>Gross Profit</b>
                <div className="fs-4 text-primary">£ {formatNumber(data.gross_profit)}
                  <span className={percentColor(data.percent_change.gross_profit)}>
                    {percentArrow(data.percent_change.gross_profit)}
                    {data.percent_change.gross_profit !== 0 && <span> {formatNumber(data.percent_change.gross_profit, 2)}%</span>}
                  </span>
                </div>
                <div className="small text-muted">Prev: £ {formatNumber(data.previous.gross_profit)}</div>
                <div className="small text-secondary">Net Sales minus Total Cost.</div>
              </CCardBody></CCard></CCol>
              {/* Section: Expenses & Net Profit */}
              <CCol xs={12}><h5 className="mb-2 mt-4">Expenses & Net Profit</h5></CCol>
              <CCol md={4}><CCard className="shadow-sm"><CCardBody><b>Total Expenses</b>
                <div className="fs-4 text-warning">£ {formatNumber(data.total_expenses)}
                  <span className={percentColor(data.percent_change.total_expenses)}>
                    {percentArrow(data.percent_change.total_expenses)}
                    {data.percent_change.total_expenses !== 0 && <span> {formatNumber(data.percent_change.total_expenses, 2)}%</span>}
                  </span>
                </div>
                <div className="small text-muted">Prev: £ {formatNumber(data.previous.total_expenses)}</div>
                <div className="small text-secondary">Sum of all company expenses in this period.</div>
              </CCardBody></CCard></CCol>
              <CCol md={4}><CCard className="shadow-sm"><CCardBody><b>Net Profit</b>
                <div className={`fs-4 ${data.net_profit < 0 ? 'text-danger' : 'text-success'}`}>£ {formatNumber(data.net_profit)}
                  <span className={percentColor(data.percent_change.net_profit)}>
                    {percentArrow(data.percent_change.net_profit)}
                    {data.percent_change.net_profit !== 0 && <span> {formatNumber(data.percent_change.net_profit, 2)}%</span>}
                  </span>
                </div>
                <div className="small text-muted">Prev: £ {formatNumber(data.previous.net_profit)}</div>
                <div className="small text-secondary">Gross Profit minus Total Expenses.</div>
              </CCardBody></CCard></CCol>
              <CCol md={4}><CCard className="shadow-sm"><CCardBody><b>Margin %</b>
                <div className="fs-4 text-info">{formatNumber(data.margin_percent)}%
                  <span className={percentColor(data.percent_change.margin_percent)}>
                    {percentArrow(data.percent_change.margin_percent)}
                    {data.percent_change.margin_percent !== 0 && <span> {formatNumber(data.percent_change.margin_percent, 2)}%</span>}
                  </span>
                </div>
                <div className="small text-muted">Prev: {formatNumber(data.previous.margin_percent)}%</div>
                <div className="small text-secondary">Net Profit as a % of Net Sales.</div>
              </CCardBody></CCard></CCol>
              {/* Section: Tax */}
              {siteSettings.hide_vat_from_everywhere !== '1' && (
                <>
                  <CCol xs={12}><h5 className="mb-2 mt-4">Tax</h5></CCol>
                  <CCol md={4}><CCard className="shadow-sm"><CCardBody><b>Total VAT Collected</b>
                    <div className="fs-4 text-secondary">£ {formatNumber(data.vat)}
                      <span className={percentColor(data.percent_change.vat)}>
                        {percentArrow(data.percent_change.vat)}
                        {data.percent_change.vat !== 0 && <span> {formatNumber(data.percent_change.vat, 2)}%</span>}
                      </span>
                    </div>
                    <div className="small text-muted">Prev: £ {formatNumber(data.previous.vat)}</div>
                    <div className="small text-secondary">Total VAT collected (not included in profit).</div>
                  </CCardBody></CCard></CCol>
                </>
              )}
            </CRow>
            {/* Section: Averages, best/worst day */}
            <CRow className="g-4 mb-4 mt-2">
              <CCol xs={12}><h5 className="mb-2">Averages & Best/Worst Day</h5></CCol>
              <CCol md={4}><CCard className="shadow-sm"><CCardBody><b>Average Daily Sales</b>
                <div className="fs-5">£ {formatNumber(data.avg_daily_sales)}</div>
                <div className="small text-secondary">Average net sales per day in this period.</div>
              </CCardBody></CCard></CCol>
              <CCol md={4}><CCard className="shadow-sm"><CCardBody><b>Average Daily Profit</b>
                <div className="fs-5">£ {formatNumber(data.avg_daily_profit)}</div>
                <div className="small text-secondary">Average gross profit per day in this period.</div>
              </CCardBody></CCard></CCol>
              <CCol md={4}><CCard className="shadow-sm"><CCardBody><b>Best Day (Profit)</b>
                <div className="fs-6">{data.best_day ? `${data.best_day.date} (£ ${formatNumber(data.best_day.gross_profit)})` : '-'}</div>
                <div className="small text-secondary">Day with highest gross profit.</div>
              </CCardBody></CCard></CCol>
              <CCol md={4}><CCard className="shadow-sm"><CCardBody><b>Worst Day (Profit)</b>
                <div className="fs-6">{data.worst_day ? `${data.worst_day.date} (£ ${formatNumber(data.worst_day.gross_profit)})` : '-'}</div>
                <div className="small text-secondary">Day with lowest gross profit.</div>
              </CCardBody></CCard></CCol>
            </CRow>
          </>
        )}
      </CCardBody>
    </CCard>
  );
};

export default ProfitLossReport; 