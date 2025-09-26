import React, { useEffect, useState, useRef } from 'react';
import api from '../../config/axios';
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CForm, CFormInput, CFormSelect, CButton, CPagination, CPaginationItem, CRow, CCol, CAlert, CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'
import { cilPencil } from '@coreui/icons';

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

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [mode, setMode] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const perPage = 20;
  const navigate = useNavigate();
  const [emailModal, setEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '' });
  const [emailLoading, setEmailLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [attachmentEnabled, setAttachmentEnabled] = useState(true);
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const fileInputRef = useRef(null);
  const { hasPermission } = useAuth();
  const [adjustingAmount, setAdjustingAmount] = useState(false);

  useEffect(() => {
    api.get('/customers', { params: { per_page: 1000, status: 'active' } })
      .then(res => setCustomers(res.data.data || []))
      .catch(() => setCustomers([]));
  }, []);

  const load = (page = 1) => {
    setLoading(true);
    api.get('/sales', {
      params: {
        page,
        per_page: perPage,
        customer_id: customerId,
        mode,
        from_date: fromDate,
        to_date: toDate,
        search,
      },
    })
      .then(res => {
        setInvoices(res.data.data || []);
        setPagination({
          current_page: res.data.current_page || 1,
          last_page: res.data.last_page || 1,
          total: res.data.total || 0,
        });
      })
      .catch(() => setAlert({ type: 'danger', msg: 'Failed to load invoices.' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [customerId, mode, fromDate, toDate, search]);

  const handlePageChange = (page) => { load(page); };

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
    if (!selectedInvoice) return;
    setEmailLoading(true);
    setFileErrors([]);
    const formData = new FormData();
    formData.append('invoice_id', selectedInvoice.id);
    formData.append('email', emailForm.email);
    if (attachmentEnabled && files.length) {
      files.forEach(file => formData.append('attachments[]', file));
    }
    api.post('/emails/send-invoice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => {
      // handle response, show alert, close modal, reset state
      setEmailModal(false);
      setEmailForm({ email: '' });
      setSelectedInvoice(null);
      setFiles([]);
      setAttachmentEnabled(false);
    }).catch(err => {
      // handle error, show alert
    }).finally(() => setEmailLoading(false));
  };

  const handleAdjustAmount = async (invoice) => {
    if (!invoice.customer_id) {
      setAlert({ type: 'warning', msg: 'Cannot adjust amount for walk-in customers.' });
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to adjust the amount for invoice #${invoice.invoice_ref}?\n\n` +
      `Current Total: £${Number(invoice.rounded_total).toFixed(2)}\n` +
      `Current Paid: £${Number(invoice.paid).toFixed(2)}\n` +
      `Difference: £${(Number(invoice.rounded_total) - Number(invoice.paid)).toFixed(2)}`
    );

    if (!confirmed) return;

    setAdjustingAmount(true);
    try {
      const response = await api.post(`/sales/${invoice.id}/adjust-amount`);
      
      if (response.data.success) {
        setAlert({ 
          type: 'success', 
          msg: `Amount adjusted successfully! ${response.data.message}` 
        });
        
        // Reload the invoices list to show updated data
        load(pagination.current_page);
      } else {
        setAlert({ type: 'danger', msg: response.data.message || 'Failed to adjust amount.' });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to adjust amount.';
      setAlert({ type: 'danger', msg: errorMsg });
    } finally {
      setAdjustingAmount(false);
    }
  };

  if (!(hasPermission && hasPermission('view_sale'))) {
    return (
      <CCard className="mt-4 shadow-sm">
        <CCardBody>
          <CAlert color="danger">You do not have permission to view invoices.</CAlert>
        </CCardBody>
      </CCard>
    );
  }

  return (
    <>
      <CCard className="mt-4 shadow-sm">
        <CCardHeader>
          <strong>Invoices</strong>
        </CCardHeader>
        <CCardBody>
          {alert && <CAlert color={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</CAlert>}
          <CForm className="mb-3">
            <CRow className="g-2">
              <CCol md={3}>
                <CFormSelect
                  value={customerId}
                  onChange={e => setCustomerId(e.target.value)}
                  options={[
                    { label: 'All Customers', value: '' },
                    ...customers.map(c => ({ label: c.name, value: c.id }))
                  ]}
                />
              </CCol>
              <CCol md={2}>
                <CFormSelect
                  value={mode}
                  onChange={e => setMode(e.target.value)}
                  options={[
                    { label: 'All Modes', value: '' },
                    { label: 'Cash', value: 'cash' },
                    { label: 'Wallet', value: 'wallet' },
                    { label: 'Card', value: 'card' },
                    { label: 'UPI', value: 'upi' },
                  ]}
                />
              </CCol>
              <CCol md={2}>
                <CFormInput type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} placeholder="From" />
              </CCol>
              <CCol md={2}>
                <CFormInput type="date" value={toDate} onChange={e => setToDate(e.target.value)} placeholder="To" />
              </CCol>
              <CCol md={2}>
                <CFormInput placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
              </CCol>
              <CCol md={1}>
                <CButton color="primary" onClick={() => load(1)}>Filter</CButton>
              </CCol>
            </CRow>
          </CForm>
          {loading ? (
            <div className="text-center my-4"><CSpinner color="primary" /></div>
          ) : (
            <>
              <CTable hover responsive className="mb-0 align-middle">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Invoice No</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Customer</CTableHeaderCell>
                    <CTableHeaderCell>Total Items</CTableHeaderCell>
                    <CTableHeaderCell>Subtotal</CTableHeaderCell>
                    <CTableHeaderCell>Paid</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Sales Transactions</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {invoices.map(inv => (
                    <CTableRow key={inv.id}>
                      <CTableDataCell>{inv.invoice_ref || inv.id}</CTableDataCell>
                      <CTableDataCell>{inv.created_at?.slice(0, 10)}</CTableDataCell>
                      <CTableDataCell>
                        <div>{inv.customer?.name || 'Walk-in'}</div>
                        {inv.customer && (
                          <div style={{ fontSize: '0.92em' }}>
                            <span className={`badge me-1 ${
                              inv.customer.type === 'retailer'
                                ? 'badge-light-yellow'
                                : 'badge-light-green'
                            }`}>
                              {inv.customer.type ? inv.customer.type.charAt(0).toUpperCase() + inv.customer.type.slice(1) : ''}
                            </span>
                            <span className="text-muted">{inv.customer.phone || ''}</span>
                          </div>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{inv.items?.length || 0}</CTableDataCell>
                      <CTableDataCell>£{Number(inv.rounded_total).toFixed(2)}</CTableDataCell>
                      <CTableDataCell>£{Number(inv.paid).toFixed(2)}</CTableDataCell>
                      <CTableDataCell>
                        {inv.customer_id ? (
                          (() => {
                            const difference = Number(inv.rounded_total) - Number(inv.paid);
                            if (Math.abs(difference) < 0.01) {
                              return <span className="badge bg-success text-white">Balanced</span>;
                            } else if (difference > 0) {
                              return <span className="badge bg-warning text-dark">Customer Owes £{difference.toFixed(2)}</span>;
                            } else {
                              return <span className="badge bg-info text-white">Customer Credit £{Math.abs(difference).toFixed(2)}</span>;
                            }
                          })()
                        ) : (
                          <span className="text-muted">Walk-in</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {inv.sales_transactions && inv.sales_transactions.length > 0 ? (
                          inv.sales_transactions.map((txn, idx) => (
                            <span
                              key={txn.payment_type + '-' + (txn.id || idx)}
                              className={
                                txn.payment_type === 'wallet'
                                  ? 'badge badge-light-yellow me-1'
                                  : 'badge badge-light-green me-1'
                              }
                            >
                              {txn.payment_type.charAt(0).toUpperCase() + txn.payment_type.slice(1)}: £{Number(txn.amount).toFixed(2)}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex gap-1">
                          {hasPermission && hasPermission('view_sale') && (
                            <CButton size="sm" color="info" onClick={() => navigate(`/sales/invoices/${inv.id}`)}>View</CButton>
                          )}
                          {hasPermission && hasPermission('edit_sale') && inv.customer_id && (() => {
                            const difference = Number(inv.rounded_total) - Number(inv.paid);
                            return Math.abs(difference) >= 0.01; // Only show if there's a difference
                          })() && (
                            <CButton 
                              size="sm" 
                              color="success" 
                              onClick={() => handleAdjustAmount(inv)}
                              disabled={adjustingAmount}
                            >
                              {adjustingAmount ? 'Adjusting...' : 'Adjust Amount'}
                            </CButton>
                          )}
                          {hasPermission && hasPermission('edit_sale') && inv.customer_id && (
                            <CButton size="sm" color="warning" onClick={() => navigate(`/sales/pos-new/edit/${inv.id}`)}>
                              <CIcon icon={cilPencil} className="me-1" />
                              Edit
                            </CButton>
                          )}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                  {invoices.length === 0 && (
                    <CTableRow><CTableDataCell colSpan={9} className="text-center text-muted">No invoices found</CTableDataCell></CTableRow>
                  )}
                </CTableBody>
              </CTable>
              <CRow className="justify-content-center mt-3">
                <CCol xs="auto">
                  <CPagination align="center" aria-label="Page navigation">
                    {/* Previous Button */}
                    <CPaginationItem
                      disabled={pagination.current_page === 1}
                      onClick={() => pagination.current_page > 1 && handlePageChange(pagination.current_page - 1)}
                      style={{ cursor: pagination.current_page > 1 ? 'pointer' : 'not-allowed' }}
                    >
                      Previous
                    </CPaginationItem>
                    
                    {/* First Page */}
                    {pagination.current_page > 3 && (
                      <>
                        <CPaginationItem
                          onClick={() => handlePageChange(1)}
                          style={{ cursor: 'pointer' }}
                        >
                          1
                        </CPaginationItem>
                        {pagination.current_page > 4 && (
                          <CPaginationItem disabled>
                            ...
                          </CPaginationItem>
                        )}
                      </>
                    )}
                    
                    {/* Pages around current page */}
                    {[...Array(pagination.last_page)].map((_, i) => {
                      const pageNum = i + 1;
                      const isCurrentPage = pagination.current_page === pageNum;
                      const isNearCurrentPage = Math.abs(pageNum - pagination.current_page) <= 2;
                      
                      if (isNearCurrentPage) {
                        return (
                          <CPaginationItem
                            key={pageNum}
                            active={isCurrentPage}
                            onClick={() => handlePageChange(pageNum)}
                            style={{ cursor: 'pointer' }}
                          >
                            {pageNum}
                          </CPaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    {/* Last Page */}
                    {pagination.current_page < pagination.last_page - 2 && (
                      <>
                        {pagination.current_page < pagination.last_page - 3 && (
                          <CPaginationItem disabled>
                            ...
                          </CPaginationItem>
                        )}
                        <CPaginationItem
                          onClick={() => handlePageChange(pagination.last_page)}
                          style={{ cursor: 'pointer' }}
                        >
                          {pagination.last_page}
                        </CPaginationItem>
                      </>
                    )}
                    
                    {/* Next Button */}
                    <CPaginationItem
                      disabled={pagination.current_page === pagination.last_page}
                      onClick={() => pagination.current_page < pagination.last_page && handlePageChange(pagination.current_page + 1)}
                      style={{ cursor: pagination.current_page < pagination.last_page ? 'pointer' : 'not-allowed' }}
                    >
                      Next
                    </CPaginationItem>
                  </CPagination>
                </CCol>
              </CRow>
              <div className="text-center text-muted mt-2">Total: {pagination.total}</div>
            </>
          )}
        </CCardBody>
      </CCard>
      {emailModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Send Email</h5>
                <button type="button" className="btn-close" onClick={() => setEmailModal(false)}></button>
              </div>
              <div className="modal-body">
                <CForm onSubmit={handleSendEmail}>
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
                  <CButton type="submit" color="primary" disabled={emailLoading} className="mt-3">
                    {emailLoading ? 'Sending...' : 'Send Email'}
                  </CButton>
                </CForm>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceList; 