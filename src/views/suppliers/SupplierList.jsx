import React, { useEffect, useState, useRef } from 'react';
import api from '../../config/axios';
import {
  CCard, CCardHeader, CCardBody, CButton, CModal, CModalHeader, CModalBody, CModalFooter,
  CForm, CFormInput, CFormSelect, CAlert, CSpinner, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CRow, CCol, CInputGroup, CInputGroupText, CPagination, CPaginationItem, CBadge, CButtonGroup, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilPencil, cilTrash, cilInfo, cilSearch, cilEnvelopeClosed, cilPrint } from '@coreui/icons';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_URL = '/suppliers';

const allowedTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];
const maxFileSize = 10 * 1024 * 1024; // 10MB

function SupplierList() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    address: '', 
    contact_person: '', 
    status: 'active' 
  });
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '' });
  const [emailLoading, setEmailLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [attachmentEnabled, setAttachmentEnabled] = useState(true);
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const perPage = 10;
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { hasPermission } = useAuth();

  const load = (page = 1) => {
    setLoading(true);
    api.get(API_URL, {
      params: {
        page,
        per_page: perPage,
        search,
        status,
        sort_by: sortBy,
        sort_order: sortOrder,
      },
    }).then(res => {
      setData(res.data.data || []);
      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
        total: res.data.total,
      });
    }).catch(() => setAlert({ type: 'danger', msg: 'Failed to load data.' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, status, sortBy, sortOrder]);

  const handleSearch = e => {
    e.preventDefault();
    load(1);
  };

  const handlePageChange = (page) => {
    load(page);
  };

  const handleSave = e => {
    e.preventDefault();
    setLoading(true);
    const req = editId
      ? api.put(`${API_URL}/${editId}`, form)
      : api.post(API_URL, form);
    req.then(() => {
      setModal(false);
      setForm({ name: '', email: '', phone: '', address: '', contact_person: '', status: 'active' });
      setEditId(null);
      setViewMode(false);
      setAlert({ type: 'success', msg: 'Saved successfully!' });
      load();
    }).catch(err => {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Error' });
    }).finally(() => setLoading(false));
  };

  const handleEdit = row => {
    setForm({ 
      name: row.name, 
      email: row.email, 
      phone: row.phone, 
      address: row.address, 
      contact_person: row.contact_person, 
      status: row.status 
    });
    setEditId(row.id);
    setViewMode(false);
    setModal(true);
  };

  const handleView = row => {
    setForm({ 
      name: row.name, 
      email: row.email, 
      phone: row.phone, 
      address: row.address, 
      contact_person: row.contact_person, 
      status: row.status 
    });
    setEditId(row.id);
    setViewMode(true);
    setModal(true);
  };

  const handleDelete = id => {
    if (window.confirm('Delete this supplier?')) {
      setLoading(true);
      api.delete(`${API_URL}/${id}`).then(() => {
        setAlert({ type: 'success', msg: 'Deleted successfully!' });
        load();
      }).catch(err => {
        setAlert({ type: 'danger', msg: err.response?.data?.message || 'Error' });
      }).finally(() => setLoading(false));
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleEmailClick = (supplier) => {
    setSelectedSupplier(supplier);
    setEmailForm({ email: supplier.email || '' });
    setEmailModal(true);
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const newErrors = [];
    const validFiles = [];
    selected.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        newErrors.push(`${file.name}: Invalid file type`);
      } else if (file.size > maxFileSize) {
        newErrors.push(`${file.name}: File too large (max 10MB)`);
      } else {
        validFiles.push(file);
      }
    });
    setFileErrors(newErrors);
    setFiles(validFiles);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    setEmailLoading(true);
    setFileErrors([]);
    const formData = new FormData();
    formData.append('supplier_id', selectedSupplier.id);
    formData.append('email', emailForm.email);
    if (attachmentEnabled && files.length) {
      files.forEach(file => formData.append('attachments[]', file));
    }
    api.post('/emails/send-supplier', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => {
      if (response.data.success) {
        setAlert({ type: 'success', msg: response.data.message });
      } else {
        setAlert({ type: 'danger', msg: response.data.message });
      }
      setEmailModal(false);
      setEmailForm({ email: '' });
      setSelectedSupplier(null);
      setFiles([]);
      setAttachmentEnabled(false);
    }).catch(err => {
      setAlert({ 
        type: 'danger', 
        msg: err.response?.data?.message || 'Failed to send email' 
      });
    }).finally(() => setEmailLoading(false));
  };

  return (
    <>
      <AppBreadcrumb />
      <CCard className="mt-4 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Suppliers</strong>
          {hasPermission && hasPermission('create_supplier') && (
            <CButton color="primary" onClick={() => { 
              setForm({ name: '', email: '', phone: '', address: '', contact_person: '', status: 'active' }); 
              setEditId(null); 
              setViewMode(false);
              setModal(true); 
            }}>
              <CIcon icon={cilPlus} className="me-2" />
              Add Supplier
            </CButton>
          )}
        </CCardHeader>
        <CCardBody>
          <CForm className="mb-3" onSubmit={handleSearch} autoComplete="off">
            <CRow className="g-2 align-items-center">
              <CCol md={4}>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilSearch} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Search by name, email, phone..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <CInputGroupText>
                    <CButton color="primary" type="submit" size="sm">Search</CButton>
                  </CInputGroupText>
                </CInputGroup>
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  options={[
                    { label: 'All Status', value: '' },
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ]}
                />
              </CCol>
            </CRow>
          </CForm>
          
          {alert && <CAlert color={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</CAlert>}
          
          {loading ? (
            <div className="text-center my-4"><CSpinner color="primary" /></div>
          ) : (
            <>
              <CTable bordered hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('name')}
                    >
                      Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </CTableHeaderCell>
                    <CTableHeaderCell>Contact Info</CTableHeaderCell>
                    <CTableHeaderCell>Purchase Orders</CTableHeaderCell>
                    <CTableHeaderCell>Financial Summary</CTableHeaderCell>
                    <CTableHeaderCell>Last Purchase Date</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('created_at')}
                    >
                      Created {sortBy === 'created_at' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.map(row => (
                    <CTableRow key={row.id}>
                      <CTableDataCell>
                        <strong>{row.name}</strong>
                        {row.address && (
                          <div className="text-muted small">{row.address}</div>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>
                          {row.email && (
                            <div><strong>Email:</strong> {row.email}</div>
                          )}
                          {row.phone && (
                            <div><strong>Phone:</strong> {row.phone}</div>
                          )}
                          {row.contact_person && (
                            <div><strong>Contact:</strong> {row.contact_person}</div>
                          )}
                          {!row.email && !row.phone && !row.contact_person && (
                            <span className="text-muted">-</span>
                          )}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">{row.total_purchase_orders || 0}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small">
                          <div><strong>Total:</strong> £{parseFloat(row.total_purchase_amount || 0).toFixed(2)}</div>
                          <div className="text-success"><strong>Paid:</strong> £{parseFloat(row.total_paid_amount || 0).toFixed(2)}</div>
                          <div className={parseFloat(row.outstanding_amount || 0) > 0 ? 'text-danger' : 'text-success'}>
                            <strong>Outstanding:</strong> £{parseFloat(row.outstanding_amount || 0).toFixed(2)}
                          </div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {row.last_purchase_date ? new Date(row.last_purchase_date).toLocaleDateString() : '-'}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={row.status === 'active' ? 'success' : 'secondary'}>
                          {row.status}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {new Date(row.created_at).toLocaleDateString()}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButtonGroup size="sm">
                          {hasPermission && hasPermission('edit_supplier') && (
                            <CButton
                              color="primary"
                              variant="outline"
                              onClick={() => handleEdit(row)}
                              title="Edit"
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                          )}
                          {hasPermission && hasPermission('view_supplier') && (
                            <CButton
                              color="secondary"
                              variant="outline"
                              onClick={() => navigate(`/suppliers/${row.id}`)}
                              title="View Details"
                            >
                              <CIcon icon={cilInfo} />
                            </CButton>
                          )}
                          {hasPermission && hasPermission('create_email') && (
                            <CButton
                              color="info"
                              variant="outline"
                              onClick={() => handleEmailClick(row)}
                              title="Send Email"
                            >
                              <CIcon icon={cilEnvelopeClosed} />
                            </CButton>
                          )}
                          {hasPermission && hasPermission('delete_supplier') && (
                            <CButton
                              color="danger"
                              variant="outline"
                              onClick={() => handleDelete(row.id)}
                              title="Delete"
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          )}
                        </CButtonGroup>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              
              {data.length === 0 && !loading && (
                <div className="text-center text-muted my-4">No suppliers found</div>
              )}
              
              <CRow className="justify-content-center mt-3">
                <CCol xs="auto">
                  <CPagination align="center" aria-label="Page navigation">
                    {[...Array(pagination.last_page)].map((_, i) => (
                      <CPaginationItem
                        key={i + 1}
                        active={pagination.current_page === i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        style={{ cursor: 'pointer' }}
                      >
                        {i + 1}
                      </CPaginationItem>
                    ))}
                  </CPagination>
                </CCol>
              </CRow>
              <div className="text-center text-muted mt-2">Total: {pagination.total}</div>
            </>
          )}
        </CCardBody>
        
        <CModal visible={modal} onClose={() => setModal(false)} size="lg">
          <CModalHeader onClose={() => setModal(false)}>
            {viewMode ? 'View' : (editId ? 'Edit' : 'Add')} Supplier
          </CModalHeader>
          <CForm onSubmit={handleSave}>
            <CModalBody>
              <CRow>
                <CCol md={6}>
                  <CFormInput
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    disabled={viewMode}
                    className="mb-3"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    disabled={viewMode}
                    className="mb-3"
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={6}>
                  <CFormInput
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    disabled={viewMode}
                    className="mb-3"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Contact Person"
                    name="contact_person"
                    value={form.contact_person}
                    onChange={e => setForm({ ...form, contact_person: e.target.value })}
                    disabled={viewMode}
                    className="mb-3"
                  />
                </CCol>
              </CRow>
              <CFormInput
                label="Address"
                name="address"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                disabled={viewMode}
                className="mb-3"
              />
              {!viewMode && (
                <CFormSelect
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ]}
                  className="mb-3"
                />
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setModal(false)}>
                {viewMode ? 'Close' : 'Cancel'}
              </CButton>
              {!viewMode && (
                <CButton color="primary" type="submit" disabled={loading}>
                  {loading ? <CSpinner size="sm" /> : 'Save'}
                </CButton>
              )}
            </CModalFooter>
          </CForm>
        </CModal>

        {/* Email Modal */}
        <CModal visible={emailModal} onClose={() => setEmailModal(false)}>
          <CModalHeader>Send Supplier Details Email</CModalHeader>
          <CForm onSubmit={handleSendEmail}>
            <CModalBody>
              <CFormInput
                type="email"
                label="To Email"
                value={emailForm.email}
                onChange={e => setEmailForm({ ...emailForm, email: e.target.value })}
                required
              />
              <div className="form-check mt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={attachmentEnabled}
                  onChange={e => setAttachmentEnabled(e.target.checked)}
                  id="attachmentCheckbox"
                />
                <label className="form-check-label" htmlFor="attachmentCheckbox">
                  Attachment
                </label>
              </div>
              {attachmentEnabled && (
                <div className="mt-2">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <CButton size="sm" color="secondary" className="ms-2" onClick={() => { setFiles([]); setFileErrors([]); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                    Clear Attachments
                  </CButton>
                  <div className="text-muted small mt-1">
                    Allowed: PDF, images, docs. Max size: 10MB per file. You can attach multiple files.
                  </div>
                  {fileErrors.length > 0 && (
                    <div className="text-danger small mt-1">
                      {fileErrors.map((err, idx) => <div key={idx}>{err}</div>)}
                    </div>
                  )}
                </div>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setEmailModal(false)}>
                Cancel
              </CButton>
              <CButton type="submit" color="primary" disabled={emailLoading} className="mt-3">
                {emailLoading ? 'Sending...' : 'Send Email'}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModal>
      </CCard>
    </>
  );
}

export default SupplierList; 