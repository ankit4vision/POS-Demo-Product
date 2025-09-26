import React, { useEffect, useState } from 'react';
import api from '../../config/axios';
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CSpinner, CAlert,
  CForm, CFormInput, CButton, CRow, CCol, CPagination, CPaginationItem, CModal, CModalHeader, CModalBody, CModalFooter
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilInfo } from '@coreui/icons';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { useAuth } from '../../context/AuthContext';

const ProductMarginReport = () => {
  const { hasPermission } = useAuth();
  // Set default date range to current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const [filters, setFilters] = useState({
    date_from: firstDay.toISOString().slice(0, 10),
    date_to: today.toISOString().slice(0, 10),
    search: '',
    sort_by: 'gross_profit',
    sort_order: 'desc',
    page: 1,
    per_page: 500,
  });
  const [data, setData] = useState({ data: [], totals: {}, pagination: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [dateRange, setDateRange] = useState([
    new Date(filters.date_from),
    new Date(filters.date_to)
  ]);
  const [siteSettings, setSiteSettings] = useState({});

  // Fetch report data
  const fetchData = (customFilters = {}) => {
    setLoading(true);
    setError(null);
    api.get('/reports/product-margins', { params: { ...filters, ...customFilters } })
      .then(res => setData(res.data || { data: [], totals: {}, pagination: {} }))
      .catch(() => {
        setData({ data: [], totals: {}, pagination: {} });
        setError('Failed to load report data.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [filters.page, filters.sort_by, filters.sort_order, filters.per_page, filters.date_from, filters.date_to, filters.search]);

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

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 1 }));
  };
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    if (range && range[0] && range[1]) {
      setFilters(prev => ({
        ...prev,
        date_from: range[0].toISOString().slice(0, 10),
        date_to: range[1].toISOString().slice(0, 10),
        page: 1,
      }));
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    fetchData({ page: 1 });
  };
  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sort_by: field,
      sort_order: prev.sort_by === field ? (prev.sort_order === 'asc' ? 'desc' : 'asc') : 'desc',
      page: 1,
    }));
  };
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const rows = data.data || [];
  const totals = data.totals || {};
  const pagination = data.pagination || {};

  // Color coding for margin/profit
  const getProfitColor = (value) => value < 0 ? 'text-danger' : value > 0 ? 'text-success' : '';
  const getMarginColor = (value) => value < 0 ? 'bg-danger text-white' : value > 30 ? 'bg-success text-white' : '';
  const formatNumber = (val, decimals = 2) => val !== undefined && val !== null ? Number(val).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : '-';

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
        <span>Product-wise Margin Report</span>
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
              <li><b>Margin %:</b> <br />
                <code>Margin % = (Gross Profit / Net Sales) × 100</code>
              </li>
              {siteSettings.hide_vat_from_everywhere !== '1' && (
                <li><b>Total VAT Collected:</b> <br />
                  <code>Total VAT Collected = Σ (Tax for each sale item)</code><br />
                  <span className="text-muted">(VAT is not included in margin/profit calculations.)</span>
                </li>
              )}
            </ul>
            <div className="mt-2 text-muted" style={{ fontSize: '0.95em' }}>
              <b>Note:</b> All calculations are based on the sale price and purchase price at the time of each sale. This ensures accurate margin and profit reporting even if product costs change over time.
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowInfo(false)}>Close</CButton>
          </CModalFooter>
        </CModal>
        {/* Info section above the table */}
        <div className="mb-3">
          <div className="alert alert-info" style={{ fontSize: '1em' }}>
            <b>About Net Sales, Total Cost, Gross Profit, Margin %, and Total VAT Collected:</b><br />
            <ul className="mb-0">
              <li><b>Net Sales:</b> Total sales after discounts, before VAT. <code>Net Sales = Σ (Sale Price × Quantity Sold - Discount)</code></li>
              <li><b>Total Cost:</b> Total cost of goods sold (COGS). <code>Total Cost = Σ (Purchase Price × Quantity Sold)</code></li>
              <li><b>Gross Profit:</b> Net Sales minus Total Cost. <code>Gross Profit = Net Sales - Total Cost</code></li>
              <li><b>Margin %:</b> Gross Profit as a percentage of Net Sales. <code>Margin % = (Gross Profit / Net Sales) × 100</code></li>
              {siteSettings.hide_vat_from_everywhere !== '1' && (
                <li><b>Total VAT Collected:</b> Sum of VAT/tax for each sale item. <code>Total VAT Collected = Σ (Tax for each sale item)</code> <span className="text-muted">(VAT is not included in margin/profit calculations.)</span></li>
              )}
            </ul>
            <span className="text-muted" style={{ fontSize: '0.95em' }}>
              All calculations are based on the sale price and purchase price at the time of each sale.
            </span>
          </div>
        </div>
        {/* Filters */}
        <CForm className="mb-3" onSubmit={handleSearch}>
          <CRow className="g-2 align-items-end">
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
            <CCol md={3}>
              <CFormInput
                label="Search Product"
                placeholder="Product name..."
                value={filters.search}
                onChange={e => handleFilterChange('search', e.target.value)}
              />
            </CCol>
            <CCol md={2}>
              <CButton color="primary" type="submit" className="w-100">Search</CButton>
            </CCol>
          </CRow>
        </CForm>
        {/* Table */}
        {loading ? <CSpinner /> : error ? <CAlert color="danger">{error}</CAlert> : (
          <>
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  {[
                    { key: 'product_name', label: 'Product Name', align: 'left' },
                    { key: 'total_qty', label: 'Total Sold Qty', align: 'right' },
                    { key: 'net_sales', label: 'Net Sales', align: 'right' },
                    { key: 'total_cost', label: 'Total Cost', align: 'right' },
                    { key: 'gross_profit', label: 'Gross Profit', align: 'right' },
                    { key: 'margin_percent', label: 'Margin %', align: 'right' },
                    ...(siteSettings.hide_vat_from_everywhere !== '1' ? [{ key: 'vat', label: 'Total VAT Collected', align: 'right' }] : []),
                  ].map(col => (
                    <CTableHeaderCell
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      style={{ cursor: 'pointer' }}
                      className={col.align === 'right' ? 'text-end' : ''}
                    >
                      {col.label}
                      {filters.sort_by === col.key && (
                        <span> {filters.sort_order === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </CTableHeaderCell>
                  ))}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {rows.map((row, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{row.product_name}</CTableDataCell>
                    <CTableDataCell className="text-end">{formatNumber(row.total_qty, 2)}</CTableDataCell>
                    <CTableDataCell className="text-end">{formatNumber(row.net_sales, 2)}</CTableDataCell>
                    <CTableDataCell className="text-end">{formatNumber(row.total_cost, 2)}</CTableDataCell>
                    <CTableDataCell className={getProfitColor(Number(row.gross_profit)) + ' text-end'}>{formatNumber(row.gross_profit, 2)}</CTableDataCell>
                    <CTableDataCell className={getMarginColor(Number(row.margin_percent)) + ' text-end'}>{formatNumber(row.margin_percent, 2)}%</CTableDataCell>
                    {siteSettings.hide_vat_from_everywhere !== '1' && (
                      <CTableDataCell className="text-end">{formatNumber(row.vat, 2)}</CTableDataCell>
                    )}
                  </CTableRow>
                ))}
                {/* Totals Row */}
                <CTableRow style={{ background: '#eaf4fb', fontWeight: 'bold' }}>
                  <CTableDataCell>Totals</CTableDataCell>
                  <CTableDataCell className="text-end">{formatNumber(totals.total_qty, 2)}</CTableDataCell>
                  <CTableDataCell className="text-end">{formatNumber(totals.net_sales, 2)}</CTableDataCell>
                  <CTableDataCell className="text-end">{formatNumber(totals.total_cost, 2)}</CTableDataCell>
                  <CTableDataCell className="text-end">{formatNumber(totals.gross_profit, 2)}</CTableDataCell>
                  <CTableDataCell className="text-end"></CTableDataCell>
                  {siteSettings.hide_vat_from_everywhere !== '1' && (
                    <CTableDataCell className="text-end">{formatNumber(totals.vat, 2)}</CTableDataCell>
                  )}
                </CTableRow>
              </CTableBody>
            </CTable>
          </>
        )}
      </CCardBody>
    </CCard>
  );
};

export default ProductMarginReport; 