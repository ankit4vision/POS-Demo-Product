import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import { useAuth } from '../../context/AuthContext';
import {
  CCard, CCardHeader, CCardBody, CButton, CAlert, CSpinner, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CForm, CFormInput, CFormSelect, CPagination, CPaginationItem, CInputGroup, CInputGroupText, CRow, CCol, CBadge, CButtonGroup,
  CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormLabel, CFormTextarea
} from '@coreui/react';
import { 
  cilPeople, cilUser, cilBasket, cilPlus, cilSearch, cilFilter, cilPencil, cilTrash, cilWallet, 
  cilPrint, cilEnvelopeClosed, cilCloudDownload, cilOptions, cilSettings, cilInfo 
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import toast from 'react-hot-toast';

const API_URL = '/customers';

function CustomerList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total_customers: 0, total_retailers: 0, active_customers: 0, active_retailers: 0 });
  
  const perPage = 10;
  const { hasPermission } = useAuth();

  useEffect(() => {
    load();
    loadStats();
  }, []);

  const load = (page = 1) => {
    setLoading(true);
    const params = {
      page,
      per_page: perPage,
      search: search || undefined,
      type: type || undefined,
      status: status || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    };

    api.get(API_URL, { params })
      .then(response => {
        setData(response.data.data);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
        });
      })
      .catch(err => {
        setAlert({ type: 'danger', msg: err.response?.data?.message || 'Error loading customers' });
      })
      .finally(() => setLoading(false));
  };

  const loadStats = () => {
    api.get(`${API_URL}/stats`)
      .then(response => {
        setStats(response.data);
      })
      .catch(err => {
        console.error('Error loading stats:', err);
      });
  };

  const handleSearch = e => { e.preventDefault(); load(1); };
  const handlePageChange = (page) => { load(page); };
  
  const handleDelete = id => {
    if (window.confirm('Delete this customer? This will also delete their wallet account if no transactions exist.')) {
      setLoading(true);
      api.delete(`${API_URL}/${id}`).then(() => {
        setAlert({ type: 'success', msg: 'Customer deleted successfully!' });
        load();
        loadStats();
      }).catch(err => {
        setAlert({ type: 'danger', msg: err.response?.data?.message || 'Error deleting customer' });
      }).finally(() => setLoading(false));
    }
  };

  const getBalanceBadge = (balance) => {
    if (parseFloat(balance) >= 0) {
      return <CBadge color="success">Credit £{parseFloat(balance).toFixed(2)}</CBadge>;
    } else {
      return <CBadge color="danger">Debit £{Math.abs(parseFloat(balance)).toFixed(2)}</CBadge>;
    }
  };

  const getTypeIcon = (customerType) => {
    return customerType === 'customer' ? 
      <CIcon icon={cilUser} className="me-2" /> : 
      <CIcon icon={cilBasket} className="me-2" />;
  };

  return (
    <>
      <AppBreadcrumb />
      
      {/* Header & Stats */}
      <div className="mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1">Customer Management</h2>
            <div className="text-muted">Manage customers and retailers with wallet system</div>
          </div>
          <div className="d-flex gap-2">
            {hasPermission && hasPermission('create_customer') && (
              <CButton color="primary" onClick={() => navigate('/customers/create')}>
                <CIcon icon={cilPlus} className="me-2" /> Add New Customer
              </CButton>
            )}
          </div>
        </div>
        
        {/* Stats Cards */}
        <CRow className="g-3 mb-3">
          <CCol md={3} xs={6}>
            <CCard className="shadow-sm text-center">
              <CCardBody>
                <div className="mb-2"><CBadge color="primary" className="p-3 fs-5"><CIcon icon={cilUser} /></CBadge></div>
                <div className="fs-4 fw-bold">{stats.total_customers}</div>
                <div className="text-muted">Total Customers</div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} xs={6}>
            <CCard className="shadow-sm text-center">
              <CCardBody>
                <div className="mb-2"><CBadge color="info" className="p-3 fs-5"><CIcon icon={cilBasket} /></CBadge></div>
                <div className="fs-4 fw-bold">{stats.total_retailers}</div>
                <div className="text-muted">Total Retailers</div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} xs={6}>
            <CCard className="shadow-sm text-center">
              <CCardBody>
                <div className="mb-2"><CBadge color="success" className="p-3 fs-5"><CIcon icon={cilUser} /></CBadge></div>
                <div className="fs-4 fw-bold">{stats.active_customers}</div>
                <div className="text-muted">Active Customers</div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} xs={6}>
            <CCard className="shadow-sm text-center">
              <CCardBody>
                <div className="mb-2"><CBadge color="success" className="p-3 fs-5"><CIcon icon={cilBasket} /></CBadge></div>
                <div className="fs-4 fw-bold">{stats.active_retailers}</div>
                <div className="text-muted">Active Retailers</div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Search & Filters */}
        <CCard className="shadow-sm">
          <CCardBody>
            <CForm onSubmit={handleSearch}>
              <CRow className="g-3">
                <CCol md={4}>
                  <CInputGroup>
                    <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                    <CFormInput
                      placeholder="Search by name, phone, email..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={2}>
                  <CFormSelect
                    value={type}
                    onChange={e => setType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="customer">Customers</option>
                    <option value="retailer">Retailers</option>
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <CFormSelect
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <CButton type="submit" color="primary" className="w-100">
                    <CIcon icon={cilSearch} className="me-2" /> Search
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </div>

      {/* Customer Table */}
      {alert && <CAlert color={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</CAlert>}
      {loading ? (
        <div className="text-center my-4"><CSpinner color="primary" /></div>
      ) : (
        <>
          <CCard className="shadow-sm">
            <CCardBody className="p-0">
              <CTable hover responsive className="mb-0 align-middle">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Customer</CTableHeaderCell>
                    <CTableHeaderCell>Contact</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Wallet Balance</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.map(row => (
                    <CTableRow key={row.id}>
                      <CTableDataCell>
                        <div>
                          <div className="fw-bold" style={{cursor:'pointer',color:'#2a72d4'}} onClick={() => navigate(`/customers/view/${row.id}`)}>{row.name}</div>
                          {row.gst_number && <div className="text-muted small">GST: {row.gst_number}</div>}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>
                          {row.phone && <div>{row.phone}</div>}
                          {row.email && <div className="text-muted small">{row.email}</div>}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={row.type === 'customer' ? 'primary' : 'info'}>
                          {getTypeIcon(row.type)}
                          {row.type === 'customer' ? 'Customer' : 'Retailer'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {getBalanceBadge(row.current_balance)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={row.status === 'active' ? 'success' : 'secondary'}>
                          {row.status}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex gap-1">
                          {/* Customer Details Button */}
                          <CButton 
                            color="secondary" 
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/customers/view/${row.id}`)}
                            title="Customer Details"
                          >
                            <CIcon icon={cilInfo} />
                          </CButton>
                          {/* Primary Actions */}
                          {hasPermission && hasPermission('view_ledger') && (
                            <CButton 
                              color="info" 
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/wallet/${row.type}/${row.id}`)}
                              title="View Ledger"
                            >
                              <CIcon icon={cilWallet} />
                            </CButton>
                          )}
                          
                          {hasPermission && hasPermission('edit_customer') && (
                            <CButton 
                              color="primary" 
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/customers/edit/${row.id}`)}
                              title="Edit Customer"
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                          )}

                          {hasPermission && hasPermission('delete_customer') && (
                            <CButton 
                              color="danger" 
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(row.id)}
                              title="Delete Customer"
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          )}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <CPagination>
                <CPaginationItem 
                  disabled={pagination.current_page === 1}
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                >
                  Previous
                </CPaginationItem>
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
                  <CPaginationItem
                    key={page}
                    active={page === pagination.current_page}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </CPaginationItem>
                ))}
                <CPaginationItem 
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default CustomerList; 