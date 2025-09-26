import React, { useEffect, useState } from 'react';
import api from '../../config/axios';
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CSpinner, CAlert,
  CForm, CFormInput, CButton, CRow, CCol, CFormSelect, CModal, CModalHeader, CModalBody, CModalFooter
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilInfo } from '@coreui/icons';
import { useAuth } from '../../context/AuthContext';

const groupByOptions = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

const SalesSummaryReport = () => {
  const { hasPermission } = useAuth();
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const [filters, setFilters] = useState({
    date_from: firstDay.toISOString().slice(0, 10),
    date_to: today.toISOString().slice(0, 10),
    group_by: 'day',
  });
  const [data, setData] = useState({ data: [], totals: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    api.get('/reports/sales-summary', { params: filters })
      .then(res => setData(res.data || { data: [], totals: {} }))
      .catch(() => {
        setData({ data: [], totals: {} });
        setError('Failed to load report data.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [filters.date_from, filters.date_to, filters.group_by]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  const rows = data.data || [];
  const totals = data.totals || {};
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
        <span>Sales Summary Report</span>
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
              <li><b>Total VAT Collected:</b> <br />
                <code>Total VAT Collected = Σ (Tax for each sale item)</code><br />
                <span className="text-muted">(VAT is not included in margin/profit calculations.)</span>
              </li>
            </ul>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowInfo(false)}>Close</CButton>
          </CModalFooter>
        </CModal>
        {/* Filters */}
        <CForm className="mb-3" onSubmit={handleSearch}>
          <CRow className="g-2 align-items-end">
            <CCol md={2}>
              <CFormInput
                type="date"
                label="From"
                value={filters.date_from}
                onChange={e => handleFilterChange('date_from', e.target.value)}
              />
            </CCol>
            <CCol md={2}>
              <CFormInput
                type="date"
                label="To"
                value={filters.date_to}
                onChange={e => handleFilterChange('date_to', e.target.value)}
              />
            </CCol>
            <CCol md={2}>
              <CFormSelect
                label="Group By"
                value={filters.group_by}
                onChange={e => handleFilterChange('group_by', e.target.value)}
              >
                {groupByOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={2}>
              <CButton color="primary" type="submit" className="w-100">Search</CButton>
            </CCol>
          </CRow>
        </CForm>
        {/* Table */}
        {loading ? <CSpinner /> : error ? <CAlert color="danger">{error}</CAlert> : (
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Net Sales</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Total Cost</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Gross Profit</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Margin %</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Total VAT Collected</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {rows.map((row, idx) => (
                <CTableRow key={idx}>
                  <CTableDataCell>{row.label}</CTableDataCell>
                  <CTableDataCell className="text-end">{formatNumber(row.net_sales, 2)}</CTableDataCell>
                  <CTableDataCell className="text-end">{formatNumber(row.total_cost, 2)}</CTableDataCell>
                  <CTableDataCell className="text-end">{formatNumber(row.gross_profit, 2)}</CTableDataCell>
                  <CTableDataCell className="text-end">{formatNumber(row.margin_percent, 2)}</CTableDataCell>
                  <CTableDataCell className="text-end">{formatNumber(row.vat, 2)}</CTableDataCell>
                </CTableRow>
              ))}
              {/* Totals Row */}
              <CTableRow style={{ background: '#eaf4fb', fontWeight: 'bold' }}>
                <CTableDataCell>Totals</CTableDataCell>
                <CTableDataCell className="text-end">{formatNumber(totals.net_sales, 2)}</CTableDataCell>
                <CTableDataCell className="text-end">{formatNumber(totals.total_cost, 2)}</CTableDataCell>
                <CTableDataCell className="text-end">{formatNumber(totals.gross_profit, 2)}</CTableDataCell>
                <CTableDataCell className="text-end">{formatNumber(totals.margin_percent, 2)}</CTableDataCell>
                <CTableDataCell className="text-end">{formatNumber(totals.vat, 2)}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  );
};

export default SalesSummaryReport; 