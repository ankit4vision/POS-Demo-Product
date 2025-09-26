import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import {
  CCard, CCardHeader, CCardBody, CButton, CAlert, CSpinner, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CRow, CCol, CBadge, CListGroup, CListGroupItem, CModal, CModalHeader, CModalTitle, CModalBody, CForm, CFormInput
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilPencil, cilTrash, cilCreditCard, cilPrint, cilCalendar, cilMoney, cilInfo, cilEnvelopeClosed } from '@coreui/icons';
import AppBreadcrumb from '../../components/AppBreadcrumb';
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

function SupplierDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '' });
  const [emailLoading, setEmailLoading] = useState(false);
  const [attachmentEnabled, setAttachmentEnabled] = useState(true);
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const fileInputRef = useRef(null);
  const { hasPermission } = useAuth();

  useEffect(() => {
    loadSupplier();
  }, [id]);

  const loadSupplier = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_URL}/${id}`);
      console.log('Supplier data:', response.data); // Debug log
      console.log('Purchase Orders:', response.data.purchaseOrders); // Debug log
      console.log('Payments Directory:', response.data.payments_directory); // Debug log
      console.log('Purchase Orders Summary:', response.data.purchase_orders_summary); // Debug log
      setSupplier(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading supplier:', err);
      setError('Failed to load supplier details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await api.delete(`${API_URL}/${id}`);
        navigate('/suppliers');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete supplier');
      }
    }
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      const response = await api.get(`/suppliers/${id}/export-pdf`, {
        responseType: 'blob',
      });
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SupplierReport-${supplier.name}-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setAlert({
        type: 'success',
        message: 'Supplier report exported successfully!'
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setAlert({
        type: 'danger',
        message: 'Failed to export supplier report. Please try again.'
      });
    } finally {
      setExportLoading(false);
    }
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
    setEmailLoading(true);
    setFileErrors([]);
    const formData = new FormData();
    formData.append('supplier_id', supplier.id);
    formData.append('email', emailForm.email);
    if (attachmentEnabled && files.length) {
      files.forEach(file => formData.append('attachments[]', file));
    }
    api.post('/emails/send-supplier', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => {
      if (response.data.success) {
        setEmailModal(false);
        setAlert({ type: 'success', msg: response.data.message });
        setEmailForm({ email: '' });
        setFiles([]);
        setAttachmentEnabled(true);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setAlert({ type: 'danger', msg: response.data.message });
      }
    }).catch(err => {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Failed to send email' });
    }).finally(() => setEmailLoading(false));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'secondary', text: 'Draft' },
      sent: { color: 'info', text: 'Sent' },
      received: { color: 'warning', text: 'Received' },
      completed: { color: 'success', text: 'Completed' },
      cancelled: { color: 'danger', text: 'Cancelled' },
    };
    const config = statusConfig[status] || { color: 'secondary', text: status };
    return <CBadge color={config.color}>{config.text}</CBadge>;
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      remaining: { color: 'warning', text: 'Remaining' },
      paid: { color: 'success', text: 'Paid' },
    };
    const config = statusConfig[status] || { color: 'secondary', text: status };
    return <CBadge color={config.color}>{config.text}</CBadge>;
  };

  const getTransactionStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'warning', text: 'Pending' },
      completed: { color: 'success', text: 'Completed' },
      failed: { color: 'danger', text: 'Failed' },
      cancelled: { color: 'secondary', text: 'Cancelled' },
    };
    const config = statusConfig[status] || { color: 'secondary', text: status };
    return <CBadge color={config.color}>{config.text}</CBadge>;
  };

  const getPaymentMethodBadge = (method) => {
    const methodConfig = {
      cash: { color: 'success', text: 'Cash' },
      bank_transfer: { color: 'info', text: 'Bank Transfer' },
      cheque: { color: 'warning', text: 'Cheque' },
      credit_card: { color: 'primary', text: 'Credit Card' },
      upi: { color: 'dark', text: 'UPI' },
      other: { color: 'secondary', text: 'Other' },
    };
    const config = methodConfig[method] || { color: 'secondary', text: method };
    return <CBadge color={config.color}>{config.text}</CBadge>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <CSpinner />
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <CAlert color="danger">
        {error || 'Supplier not found'}
      </CAlert>
    );
  }

  // Get all transactions from the payments directory
  const allTransactions = supplier.payments_directory?.transactions || [];

  // Get purchase orders data
  const purchaseOrders = supplier.purchaseOrders || [];

  // Debug logging
  console.log('Purchase Orders Count:', purchaseOrders.length);
  console.log('Transactions Count:', allTransactions.length);
  console.log('First PO:', purchaseOrders[0]);
  console.log('First Transaction:', allTransactions[0]);

  return (
    <>
      <AppBreadcrumb />
      
      {/* Alert for export message */}
      {alert && (
        <CAlert color={alert.type} dismissible onClose={() => setAlert(null)}>
          {alert.message}
        </CAlert>
      )}
      
      {/* Header Section */}
      <CCard className="mt-4 shadow-sm">
        <CCardHeader>
          <CRow className="align-items-center">
            <CCol>
              <h4 className="mb-0">Supplier Details</h4>
              <p className="text-muted mb-0">{supplier.name}</p>
            </CCol>
            <CCol xs="auto">
              <div className="d-flex gap-2">
                <CButton 
                  color="secondary" 
                  variant="outline"
                  onClick={() => navigate('/suppliers')}
                >
                  <CIcon icon={cilArrowLeft} className="me-2" />
                  Back to List
                </CButton>
                
                <CButton 
                  color="success" 
                  variant="outline"
                  onClick={handleExport}
                  disabled={exportLoading}
                >
                  {exportLoading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Export Details
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilPrint} className="me-2" />
                      Export Details
                    </>
                  )}
                </CButton>
                
                {hasPermission && hasPermission('create_email') && (
                  <CButton 
                    color="primary" 
                    variant="outline"
                    onClick={() => {
                      setEmailForm({ email: supplier.email || '' });
                      setEmailModal(true);
                    }}
                  >
                    <CIcon icon={cilEnvelopeClosed} className="me-2" />
                    Email Details
                  </CButton>
                )}
                
                <CButton 
                  color="danger" 
                  variant="outline"
                  onClick={handleDelete}
                >
                  <CIcon icon={cilTrash} className="me-2" />
                  Delete
                </CButton>
              </div>
            </CCol>
          </CRow>
        </CCardHeader>
      </CCard>

      {/* Section 1: Supplier Information */}
      <CCard className="mt-4 shadow-sm">
        <CCardHeader>
          <h5 className="mb-0">
            <CIcon icon={cilInfo} className="me-2" />
            Supplier Information
          </h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={6}>
              <CListGroup>
                <CListGroupItem>
                  <strong>Name:</strong> {supplier.name}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Email:</strong> {supplier.email || '-'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Phone:</strong> {supplier.phone || '-'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Contact Person:</strong> {supplier.contact_person || '-'}
                </CListGroupItem>
              </CListGroup>
            </CCol>
            <CCol md={6}>
              <CListGroup>
                <CListGroupItem>
                  <strong>Address:</strong> {supplier.address || '-'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Status:</strong> 
                  <CBadge color={supplier.status === 'active' ? 'success' : 'secondary'} className="ms-2">
                    {supplier.status}
                  </CBadge>
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Created:</strong> {new Date(supplier.created_at).toLocaleDateString()}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Last Updated:</strong> {new Date(supplier.updated_at).toLocaleDateString()}
                </CListGroupItem>
              </CListGroup>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Section 2: Purchase Orders and Summary */}
      <CCard className="mt-4 shadow-sm">
        <CCardHeader>
          <h5 className="mb-0">
            <CIcon icon={cilCalendar} className="me-2" />
            Purchase Orders and Summary ({purchaseOrders.length})
          </h5>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-4">
            <CCol md={3}>
              <CCard className="text-center bg-primary text-white">
                <CCardBody>
                  <h4>{supplier.summary?.total_purchase_orders || 0}</h4>
                  <p className="mb-0">Total Orders</p>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={3}>
              <CCard className="text-center bg-success text-white">
                <CCardBody>
                  <h4>{supplier.summary?.completed_orders || 0}</h4>
                  <p className="mb-0">Completed</p>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={3}>
              <CCard className="text-center bg-warning text-white">
                <CCardBody>
                  <h4>{supplier.summary?.active_orders || 0}</h4>
                  <p className="mb-0">Active</p>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={3}>
              <CCard className="text-center bg-info text-white">
                <CCardBody>
                  <h4>{supplier.summary?.total_transactions || 0}</h4>
                  <p className="mb-0">Transactions</p>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {purchaseOrders.length > 0 ? (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>PO Number</CTableHeaderCell>
                  <CTableHeaderCell>Order Date</CTableHeaderCell>
                  <CTableHeaderCell>Expected Delivery</CTableHeaderCell>
                  <CTableHeaderCell>Total Amount</CTableHeaderCell>
                  <CTableHeaderCell>Paid Amount</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Payment Status</CTableHeaderCell>
                  <CTableHeaderCell>Created By</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {purchaseOrders.map((po) => (
                  <CTableRow key={po.id}>
                    <CTableDataCell>
                      <strong>{po.po_number}</strong>
                    </CTableDataCell>
                    <CTableDataCell>
                      {po.order_date ? new Date(po.order_date).toLocaleDateString() : '-'}
                    </CTableDataCell>
                    <CTableDataCell>
                      {po.expected_delivery_date ? new Date(po.expected_delivery_date).toLocaleDateString() : '-'}
                    </CTableDataCell>
                    <CTableDataCell>
                      <strong>£{parseFloat(po.total_amount || 0).toFixed(2)}</strong>
                    </CTableDataCell>
                    <CTableDataCell>
                      £{parseFloat(po.paid_amount || 0).toFixed(2)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {getStatusBadge(po.status)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {getPaymentStatusBadge(po.paid_status)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {po.creator?.name || '-'}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          ) : (
            <CAlert color="info">
              No purchase orders found for this supplier.
            </CAlert>
          )}
        </CCardBody>
      </CCard>

      {/* Section 3: Financial Summary & Transactions */}
      <CCard className="mt-4 shadow-sm">
        <CCardHeader>
          <h5 className="mb-0">
            <CIcon icon={cilMoney} className="me-2" />
            Financial Summary & Transactions ({allTransactions.length})
          </h5>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-4">
            <CCol md={3}>
              <CCard className="text-center bg-primary text-white">
                <CCardBody>
                  <h4>£{parseFloat(supplier.summary?.total_purchase_amount || 0).toFixed(2)}</h4>
                  <p className="mb-0">Total Purchase</p>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={3}>
              <CCard className="text-center bg-success text-white">
                <CCardBody>
                  <h4>£{parseFloat(supplier.summary?.total_paid_amount || 0).toFixed(2)}</h4>
                  <p className="mb-0">Total Paid</p>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={3}>
              <CCard className={`text-center text-white ${parseFloat(supplier.summary?.outstanding_amount || 0) > 0 ? 'bg-danger' : 'bg-success'}`}>
                <CCardBody>
                  <h4>£{parseFloat(supplier.summary?.outstanding_amount || 0).toFixed(2)}</h4>
                  <p className="mb-0">Outstanding</p>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={3}>
              <CCard className="text-center bg-info text-white">
                <CCardBody>
                  <h4>{supplier.summary?.last_purchase_date ? new Date(supplier.summary.last_purchase_date).toLocaleDateString() : '-'}</h4>
                  <p className="mb-0">Last Purchase</p>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {allTransactions.length > 0 ? (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>PO Number</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Method</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Reference</CTableHeaderCell>
                  <CTableHeaderCell>Notes</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {allTransactions.map((transaction, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>
                      {new Date(transaction.payment_date).toLocaleDateString()}
                    </CTableDataCell>
                    <CTableDataCell>
                      <strong>{transaction.po_number}</strong>
                    </CTableDataCell>
                    <CTableDataCell>
                      <strong>£{parseFloat(transaction.amount).toFixed(2)}</strong>
                    </CTableDataCell>
                    <CTableDataCell>
                      {getPaymentMethodBadge(transaction.payment_method)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {getTransactionStatusBadge(transaction.status)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {transaction.reference_number || '-'}
                    </CTableDataCell>
                    <CTableDataCell>
                      {transaction.notes || '-'}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          ) : (
            <CAlert color="info">
              No payment transactions found for this supplier.
            </CAlert>
          )}
        </CCardBody>
      </CCard>

      <CModal visible={emailModal} onClose={() => setEmailModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Send Supplier Details Email</CModalTitle>
        </CModalHeader>
        <CModalBody>
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
        </CModalBody>
      </CModal>
    </>
  );
}

export default SupplierDetail;