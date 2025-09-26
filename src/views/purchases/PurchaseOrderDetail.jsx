import React, { useState, useEffect, useRef } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
  CSpinner,
  CAlert,
  CListGroup,
  CListGroupItem,
  CButtonGroup,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
} from '@coreui/react';
import { cilPencil, cilTrash, cilArrowLeft, cilCheckCircle, cilCreditCard, cilPrint, cilEnvelopeClosed } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import PaymentModal from '../../components/PaymentModal';
import ConvertToPurchasedModal from '../../components/ConvertToPurchasedModal';
import api from '../../config/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

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

const PurchaseOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [shortExportLoading, setShortExportLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Email functionality
  const [emailModal, setEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '' });
  const [emailLoading, setEmailLoading] = useState(false);
  const [attachmentEnabled, setAttachmentEnabled] = useState(true);
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const fileInputRef = useRef(null);

  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchPurchaseOrder();
    fetchTransactions();
  }, [id]);

  const fetchPurchaseOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/purchase-orders/${id}`);
      setPurchaseOrder(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch purchase order details');
      console.error('Error fetching purchase order:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setTransactionsLoading(true);
      const response = await api.get(`/purchase-orders/${id}/transactions`);
      setTransactions(response.data.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      try {
        await api.delete(`/purchase-orders/${id}`);
        navigate('/purchases');
      } catch (err) {
        console.error('Error deleting purchase order:', err);
      }
    }
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

  // Helper functions for action permissions
  const isPaymentAllowed = (status) => {
    return ['sent', 'received', 'completed'].includes(status);
  };

  const isExportAllowed = (status) => {
    return ['draft', 'sent', 'received', 'completed'].includes(status);
  };

  const handlePayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
  };

  const handlePaymentSuccess = () => {
    fetchPurchaseOrder(); // Refresh the purchase order data
    fetchTransactions(); // Refresh the transactions data
  };

  const handleConvertSuccess = () => {
    fetchPurchaseOrder(); // Refresh the purchase order data
    // Redirect to purchased list after successful conversion
    navigate('/purchases/purchased');
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      setAlert(null);
      
      const response = await api.get(`/purchase-orders/${id}/export-pdf`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PurchaseOrder-${purchaseOrder.po_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setAlert({ type: 'success', message: 'Purchase Order PDF exported successfully!' });
    } catch (err) {
      console.error('Error exporting PDF:', err);
      setAlert({ type: 'danger', message: 'Failed to export PDF. Please try again.' });
    } finally {
      setExportLoading(false);
    }
  };

  const handleShortExport = async () => {
    try {
      setShortExportLoading(true);
      setAlert(null);
      
      const response = await api.get(`/purchase-orders/${id}/export-short-pdf`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DriverReceipt-${purchaseOrder.po_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setAlert({ type: 'success', message: 'Driver Receipt PDF exported successfully!' });
    } catch (err) {
      console.error('Error exporting short PDF:', err);
      setAlert({ type: 'danger', message: 'Failed to export Driver Receipt PDF. Please try again.' });
    } finally {
      setShortExportLoading(false);
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

  const openEmailModal = () => {
    setEmailForm({ email: purchaseOrder?.supplier?.email || '' });
    setEmailModal(true);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    setEmailLoading(true);
    setFileErrors([]);
    const formData = new FormData();
    formData.append('purchase_order_id', purchaseOrder.id);
    formData.append('email', emailForm.email);
    if (attachmentEnabled && files.length) {
      files.forEach(file => formData.append('attachments[]', file));
    }
    api.post('/emails/send-purchase-order', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => {
      if (response.data.success) {
        toast.success(response.data.message);
        setEmailModal(false);
        setEmailForm({ email: '' });
        setFiles([]);
        setAttachmentEnabled(true);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error(response.data.message);
      }
    }).catch(err => {
      toast.error(err.response?.data?.message || 'Failed to send email');
    }).finally(() => setEmailLoading(false));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <CSpinner />
      </div>
    );
  }

  if (error || !purchaseOrder) {
    return (
      <CAlert color="danger">
        {error || 'Purchase order not found'}
      </CAlert>
    );
  }

  if (!(hasPermission && hasPermission('view_purchase_order'))) {
    return <CAlert color="danger" className="mt-4">You do not have permission to view purchase orders.</CAlert>;
  }

  return (
    <div>
      {/* Alert for export messages */}
      {alert && (
        <CAlert color={alert.type} dismissible onClose={() => setAlert(null)}>
          {alert.message}
        </CAlert>
      )}
      
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow className="align-items-center">
                <CCol>
                  <h4 className="mb-0">Purchase Order Details</h4>
                  <p className="text-muted mb-0">{purchaseOrder.po_number}</p>
                </CCol>
                <CCol xs="auto">
                  <div className="d-flex gap-2">
                    <CButton 
                      color="secondary" 
                      variant="outline"
                      onClick={() => {
                        // Navigate back based on purchase order status
                        if (purchaseOrder.status === 'completed') {
                          navigate('/purchases/purchased');
                        } else {
                          navigate('/purchases');
                        }
                      }}
                    >
                      <CIcon icon={cilArrowLeft} className="me-2" />
                      Back to List
                    </CButton>
                    
                    {hasPermission && hasPermission('edit_purchase_order') && purchaseOrder.status === 'draft' && (
                      <>
                        <CButton 
                          color="primary" 
                          variant="outline"
                          onClick={() => navigate(`/purchases/${id}/edit`)}
                        >
                          <CIcon icon={cilPencil} className="me-2" />
                          Edit
                        </CButton>
                        
                        <CButton 
                          color="danger" 
                          variant="outline"
                          onClick={handleDelete}
                        >
                          <CIcon icon={cilTrash} className="me-2" />
                          Delete
                        </CButton>
                      </>
                    )}
                  </div>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={9}>
                  {/* Purchase Order Information */}
                  <CCard className="mb-4">
                    <CCardHeader>
                      <h5>Order Information</h5>
                    </CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol md={6}>
                          <CListGroup>
                            <CListGroupItem>
                              <strong>PO Number:</strong> {purchaseOrder.po_number}
                            </CListGroupItem>
                            <CListGroupItem>
                              <strong>Supplier:</strong> {purchaseOrder.supplier?.name}
                            </CListGroupItem>
                            <CListGroupItem>
                              <strong>Order Date:</strong> {new Date(purchaseOrder.order_date).toLocaleDateString()}
                            </CListGroupItem>
                            <CListGroupItem>
                              <strong>Expected Delivery:</strong> {new Date(purchaseOrder.expected_delivery_date).toLocaleDateString()}
                            </CListGroupItem>
                            <CListGroupItem>
                              <strong>Status:</strong> {getStatusBadge(purchaseOrder.status)}
                            </CListGroupItem>
                            <CListGroupItem>
                              <strong>Payment Status:</strong> {getPaymentStatusBadge(purchaseOrder.paid_status)}
                            </CListGroupItem>
                          </CListGroup>
                        </CCol>
                        <CCol md={6}>
                          <CListGroup>
                            <CListGroupItem>
                              <strong>Total Amount:</strong> £{parseFloat(purchaseOrder.total_amount)}
                            </CListGroupItem>
                            <CListGroupItem>
                              <strong>Paid Amount:</strong> £{parseFloat(purchaseOrder.paid_amount || 0)}
                            </CListGroupItem>
                            <CListGroupItem>
                              <strong>Remaining Amount:</strong> £{Math.max(0, parseFloat(purchaseOrder.total_amount) - parseFloat(purchaseOrder.paid_amount || 0))}
                            </CListGroupItem>
                            <CListGroupItem>
                              <strong>Created By:</strong> {purchaseOrder.creator?.name}
                            </CListGroupItem>
                            <CListGroupItem>
                              <strong>Created Date:</strong> {new Date(purchaseOrder.created_at).toLocaleDateString()}
                            </CListGroupItem>
                            <CListGroupItem>
                              <strong>Last Updated:</strong> {new Date(purchaseOrder.updated_at).toLocaleDateString()}
                            </CListGroupItem>
                          </CListGroup>
                        </CCol>
                      </CRow>
                      
                      {purchaseOrder.notes && (
                        <CRow className="mt-3">
                          <CCol>
                            <strong>Notes:</strong>
                            <p className="mt-2">{purchaseOrder.notes}</p>
                          </CCol>
                        </CRow>
                      )}
                    </CCardBody>
                  </CCard>

                  {/* Items Table */}
                  <CCard className="mb-4">
                    <CCardHeader>
                      <h5>Order Items</h5>
                    </CCardHeader>
                    <CCardBody>
                      <CTable hover responsive>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>Product</CTableHeaderCell>
                            <CTableHeaderCell>Quantity</CTableHeaderCell>
                            <CTableHeaderCell>Unit Price</CTableHeaderCell>
                            <CTableHeaderCell>Total</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {purchaseOrder.items.map((item, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>
                                <div>
                                  <strong>{item.product?.name}</strong>
                                  <br />
                                  <small className="text-muted">{item.product?.sku}</small>
                                </div>
                              </CTableDataCell>
                              <CTableDataCell>{item.quantity}</CTableDataCell>
                              <CTableDataCell>£{parseFloat(item.unit_price)}</CTableDataCell>
                              <CTableDataCell>
                                <strong>£{parseFloat(item.total_amount)}</strong>
                              </CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </CCardBody>
                  </CCard>

                  {/* Payment Transactions History */}
                  <CCard>
                    <CCardHeader>
                      <h5>Payment Transactions History</h5>
                    </CCardHeader>
                    <CCardBody>
                      {transactionsLoading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                          <CSpinner />
                        </div>
                      ) : transactions.length === 0 ? (
                        <CAlert color="info">
                          No payment transactions found for this purchase order.
                        </CAlert>
                      ) : (
                        <CTable hover responsive>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell>Date</CTableHeaderCell>
                              <CTableHeaderCell>Amount</CTableHeaderCell>
                              <CTableHeaderCell>Method</CTableHeaderCell>
                              <CTableHeaderCell>Status</CTableHeaderCell>
                              <CTableHeaderCell>Reference</CTableHeaderCell>
                              <CTableHeaderCell>Notes</CTableHeaderCell>
                              <CTableHeaderCell>Created By</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {transactions.map((transaction) => (
                              <CTableRow key={transaction.id}>
                                <CTableDataCell>
                                  {new Date(transaction.payment_date).toLocaleDateString()}
                                </CTableDataCell>
                                <CTableDataCell>
                                  <strong>£{parseFloat(transaction.amount)}</strong>
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
                                <CTableDataCell>
                                  {transaction.creator?.name || '-'}
                                </CTableDataCell>
                              </CTableRow>
                            ))}
                          </CTableBody>
                        </CTable>
                      )}
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={3}>
                  {/* Supplier Information */}
                  <CCard>
                    <CCardHeader>
                      <h5>Supplier Information</h5>
                    </CCardHeader>
                    <CCardBody>
                      <CListGroup>
                        <CListGroupItem>
                          <strong>Name:</strong> {purchaseOrder.supplier?.name}
                        </CListGroupItem>
                        <CListGroupItem>
                          <strong>Email:</strong> {purchaseOrder.supplier?.email}
                        </CListGroupItem>
                        <CListGroupItem>
                          <strong>Phone:</strong> {purchaseOrder.supplier?.phone}
                        </CListGroupItem>
                        <CListGroupItem>
                          <strong>Address:</strong> {purchaseOrder.supplier?.address}
                        </CListGroupItem>
                      </CListGroup>
                    </CCardBody>
                  </CCard>

                  {/* Action Buttons */}
                  <CCard className="mt-4">
                    <CCardHeader>
                      <h5>Actions</h5>
                    </CCardHeader>
                    <CCardBody>
                      <div className="d-grid gap-2">
                        {isPaymentAllowed(purchaseOrder.status) && (
                          <CButton 
                            color="success" 
                            variant="outline"
                            onClick={handlePayment}
                          >
                            <CIcon icon={cilCreditCard} className="me-2" />
                            Make Payment
                          </CButton>
                        )}
                        
                        {isExportAllowed(purchaseOrder.status) && (
                          <CButton 
                            color="info" 
                            variant="outline"
                            onClick={handleExport}
                            disabled={exportLoading}
                          >
                            {exportLoading ? <CSpinner size="sm" className="me-2" /> : <CIcon icon={cilPrint} className="me-2" />}
                            {exportLoading ? 'Exporting...' : 'Export'}
                          </CButton>
                        )}
                        
                        <CButton 
                          color="secondary" 
                          variant="outline"
                          onClick={handleShortExport}
                          disabled={shortExportLoading}
                        >
                          {shortExportLoading ? <CSpinner size="sm" className="me-2" /> : <CIcon icon={cilPrint} className="me-2" />}
                          {shortExportLoading ? 'Exporting...' : 'Short Export (Driver Receipt)'}
                        </CButton>
                        
                        {hasPermission && hasPermission('create_email') && (
                          <CButton 
                            color="primary" 
                            variant="outline"
                            onClick={openEmailModal}
                            disabled={emailLoading}
                          >
                            {emailLoading ? <CSpinner size="sm" className="me-2" /> : <CIcon icon={cilEnvelopeClosed} className="me-2" />}
                            {emailLoading ? 'Sending...' : 'Send Email'}
                          </CButton>
                        )}
                        
                        {(purchaseOrder.status === 'sent' || purchaseOrder.status === 'received') && (
                          <CButton 
                            color="success" 
                            variant="outline"
                            onClick={() => setShowConvertModal(true)}
                          >
                            <CIcon icon={cilCheckCircle} className="me-2" />
                            Convert to Purchased
                          </CButton>
                        )}
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Payment Modal */}
      <PaymentModal
        visible={showPaymentModal}
        onClose={handlePaymentModalClose}
        onSuccess={handlePaymentSuccess}
        purchaseOrderId={id}
        supplierId={purchaseOrder?.supplier_id}
        totalAmount={purchaseOrder ? parseFloat(purchaseOrder.total_amount) : 0}
        paidAmount={purchaseOrder ? parseFloat(purchaseOrder.paid_amount || 0) : 0}
        title="Make Payment for Purchase Order"
      />

      {/* Convert to Purchased Modal */}
      <ConvertToPurchasedModal
        visible={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        onSuccess={handleConvertSuccess}
        purchaseOrder={purchaseOrder}
      />

      {/* Email Modal */}
      <CModal
        visible={emailModal}
        onClose={() => setEmailModal(false)}
      >
        <CModalHeader>
          <CModalTitle>Send Purchase Order by Email</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSendEmail}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Recipient Email</label>
              <CFormInput
                type="email"
                id="email"
                name="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm({ email: e.target.value })}
                placeholder="Enter recipient email"
                required
              />
            </div>
            
            <div className="mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="attachmentEnabled"
                  checked={attachmentEnabled}
                  onChange={(e) => setAttachmentEnabled(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="attachmentEnabled">
                  Include Purchase Order as PDF attachment
                </label>
              </div>
            </div>
            
            {attachmentEnabled && (
              <div className="mb-3">
                <label htmlFor="attachments" className="form-label">Additional Attachments (Optional)</label>
                <CFormInput
                  type="file"
                  id="attachments"
                  name="attachments"
                  multiple
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                />
                <div className="form-text">
                  Allowed file types: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX (Max 10MB each)
                </div>
                {fileErrors.length > 0 && (
                  <div className="text-danger mt-2">
                    {fileErrors.map((error, index) => (
                      <div key={index} className="small">{error}</div>
                    ))}
                  </div>
                )}
                {files.length > 0 && (
                  <div className="mt-2">
                    <strong>Selected files:</strong>
                    <ul className="list-unstyled mt-1">
                      {files.map((file, index) => (
                        <li key={index} className="small text-muted">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </li>
                      ))}
                    </ul>
                    <CButton
                      color="danger"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setFiles([]);
                        setFileErrors([]);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      Clear Attachments
                    </CButton>
                  </div>
                )}
              </div>
            )}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEmailModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSendEmail} disabled={emailLoading}>
            {emailLoading ? <CSpinner size="sm" className="me-2" /> : <CIcon icon={cilEnvelopeClosed} className="me-2" />}
            {emailLoading ? 'Sending...' : 'Send Email'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default PurchaseOrderDetail; 