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
  CInputGroup,
  CFormInput,
  CFormSelect,
  CButtonGroup,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CPagination,
  CPaginationItem,
  CForm,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import { cilPlus, cilPencil, cilSearch, cilTrash, cilCheckCircle, cilCreditCard, cilPrint, cilEnvelopeClosed } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate } from 'react-router-dom';
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

const PurchaseOrderList = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('draft');
  const [searchTerms, setSearchTerms] = useState({
    draft: '',
    sent: '',
    received: ''
  });
  const [currentPages, setCurrentPages] = useState({
    draft: 1,
    sent: 1,
    received: 1
  });
  const [itemsPerPage] = useState(10);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [exportLoading, setExportLoading] = useState({});
  const [shortExportLoading, setShortExportLoading] = useState({});
  const [alert, setAlert] = useState(null);
  const [emailModal, setEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '' });
  const [emailLoading, setEmailLoading] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [attachmentEnabled, setAttachmentEnabled] = useState(true);
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/purchase-orders');
      setPurchaseOrders(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch purchase orders');
      console.error('Error fetching purchase orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (purchaseOrderId, newStatus) => {
    try {
      await api.put(`/purchase-orders/${purchaseOrderId}/status`, {
        status: newStatus
      });
      fetchPurchaseOrders(); // Refresh the list
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (purchaseOrderId) => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      try {
        await api.delete(`/purchase-orders/${purchaseOrderId}`);
        fetchPurchaseOrders(); // Refresh the list
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

  // Helper functions for action permissions
  const isEditable = (status) => {
    return ['draft', 'sent', 'received'].includes(status);
  };

  const isDeletable = (status) => {
    return ['draft', 'sent', 'received'].includes(status);
  };

  const isPaymentAllowed = (status) => {
    return ['sent', 'received', 'completed'].includes(status);
  };

  const isExportAllowed = (status) => {
    return ['draft', 'sent', 'received'].includes(status);
  };

  const isConvertible = (status) => {
    return ['sent', 'received'].includes(status);
  };

  const handlePayment = (purchaseOrder) => {
    setSelectedPurchaseOrder(purchaseOrder);
    setShowPaymentModal(true);
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    setSelectedPurchaseOrder(null);
  };

  const handlePaymentSuccess = () => {
    fetchPurchaseOrders(); // Refresh the list to get updated payment information
  };

  const handleConvert = (purchaseOrder) => {
    setSelectedPurchaseOrder(purchaseOrder);
    setShowConvertModal(true);
  };

  const handleConvertModalClose = () => {
    setShowConvertModal(false);
    setSelectedPurchaseOrder(null);
  };

  const handleConvertSuccess = () => {
    fetchPurchaseOrders(); // Refresh the list
    setShowConvertModal(false);
    setSelectedPurchaseOrder(null);
  };

  const handleExport = async (purchaseOrder) => {
    try {
      setExportLoading(prev => ({ ...prev, [purchaseOrder.id]: true }));
      setAlert(null);
      
      const response = await api.get(`/purchase-orders/${purchaseOrder.id}/export-pdf`, {
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
      
      setAlert({ type: 'success', message: `Purchase Order ${purchaseOrder.po_number} PDF exported successfully!` });
    } catch (err) {
      console.error('Error exporting PDF:', err);
      setAlert({ type: 'danger', message: 'Failed to export PDF. Please try again.' });
    } finally {
      setExportLoading(prev => ({ ...prev, [purchaseOrder.id]: false }));
    }
  };

  const handleShortExport = async (purchaseOrder) => {
    try {
      setShortExportLoading(prev => ({ ...prev, [purchaseOrder.id]: true }));
      setAlert(null);
      
      const response = await api.get(`/purchase-orders/${purchaseOrder.id}/export-short-pdf`, {
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
      
      setAlert({ type: 'success', message: `Driver Receipt ${purchaseOrder.po_number} PDF exported successfully!` });
    } catch (err) {
      console.error('Error exporting short PDF:', err);
      setAlert({ type: 'danger', message: 'Failed to export Driver Receipt PDF. Please try again.' });
    } finally {
      setShortExportLoading(prev => ({ ...prev, [purchaseOrder.id]: false }));
    }
  };

  // Calculate summary statistics
  const getSummaryStats = () => {
    const draft = purchaseOrders.filter(po => po.status === 'draft');
    const sent = purchaseOrders.filter(po => po.status === 'sent');
    const received = purchaseOrders.filter(po => po.status === 'received');

    return {
      draft: {
        count: draft.length,
        total: draft.reduce((sum, po) => sum + parseFloat(po.total_amount || 0), 0)
      },
      sent: {
        count: sent.length,
        total: sent.reduce((sum, po) => sum + parseFloat(po.total_amount || 0), 0)
      },
      received: {
        count: received.length,
        total: received.reduce((sum, po) => sum + parseFloat(po.total_amount || 0), 0)
      }
    };
  };

  // Filter and paginate purchase orders for each tab
  const getFilteredAndPaginatedOrders = (status) => {
    const filtered = purchaseOrders.filter(po => {
      const matchesStatus = po.status === status;
      const searchTerm = searchTerms[status].toLowerCase();
      const matchesSearch = 
        po.po_number.toLowerCase().includes(searchTerm) ||
        po.supplier?.name.toLowerCase().includes(searchTerm);
      
      return matchesStatus && matchesSearch;
    });

    const startIndex = (currentPages[status] - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      orders: filtered.slice(startIndex, endIndex),
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage)
    };
  };

  const handleSearchChange = (status, value) => {
    setSearchTerms(prev => ({
      ...prev,
      [status]: value
    }));
    setCurrentPages(prev => ({
      ...prev,
      [status]: 1 // Reset to first page when searching
    }));
  };

  const handlePageChange = (status, page) => {
    setCurrentPages(prev => ({
      ...prev,
      [status]: page
    }));
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
    if (!selectedPO) return;
    setEmailLoading(true);
    setFileErrors([]);
    const formData = new FormData();
    formData.append('purchase_order_id', selectedPO.id);
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
        setSelectedPO(null);
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

  const openEmailModal = (purchaseOrder) => {
    setSelectedPO(purchaseOrder);
    setEmailForm({ email: purchaseOrder?.supplier?.email || '' });
    setEmailModal(true);
  };

  const summaryStats = getSummaryStats();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <CSpinner />
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      <CRow className="mb-4">
        <CCol md={4}>
          <CCard className="text-center">
            <CCardBody>
              <h3 className="text-secondary mb-2">{summaryStats.draft.count}</h3>
              <h6 className="text-muted">Draft Orders</h6>
              <p className="mb-0">£{summaryStats.draft.total.toFixed(2)}</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard className="text-center">
            <CCardBody>
              <h3 className="text-info mb-2">{summaryStats.sent.count}</h3>
              <h6 className="text-muted">Sent Orders</h6>
              <p className="mb-0">£{summaryStats.sent.total.toFixed(2)}</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard className="text-center">
            <CCardBody>
              <h3 className="text-warning mb-2">{summaryStats.received.count}</h3>
              <h6 className="text-muted">Received Orders</h6>
              <p className="mb-0">£{summaryStats.received.total.toFixed(2)}</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow className="align-items-center">
                <CCol>
                  <h4 className="mb-0">Purchase Orders</h4>
                </CCol>
                <CCol xs="auto">
                  {hasPermission && hasPermission('create_purchase_order') && (
                    <CButton 
                      color="primary" 
                      onClick={() => navigate('/purchases/create')}
                    >
                      <CIcon icon={cilPlus} className="me-2" />
                      New Purchase Order
                    </CButton>
                  )}
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              {error && (
                <CAlert color="danger" className="mb-3">
                  {error}
                </CAlert>
              )}

              {/* Alert for export operations */}
              {alert && (
                <CAlert 
                  color={alert.type} 
                  className="mb-3"
                  dismissible
                  onClose={() => setAlert(null)}
                >
                  {alert.message}
                </CAlert>
              )}

              {/* Tabs */}
              <CNav variant="tabs" className="mb-3">
                <CNavItem>
                  <CNavLink
                    active={activeTab === 'draft'}
                    onClick={() => setActiveTab('draft')}
                    style={{ cursor: 'pointer' }}
                  >
                    Draft ({summaryStats.draft.count})
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeTab === 'sent'}
                    onClick={() => setActiveTab('sent')}
                    style={{ cursor: 'pointer' }}
                  >
                    Sent ({summaryStats.sent.count})
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeTab === 'received'}
                    onClick={() => setActiveTab('received')}
                    style={{ cursor: 'pointer' }}
                  >
                    Received ({summaryStats.received.count})
                  </CNavLink>
                </CNavItem>
              </CNav>

              <CTabContent>
                {['draft', 'sent', 'received'].map(status => {
                  const { orders, total, totalPages } = getFilteredAndPaginatedOrders(status);
                  
                  return (
                    <CTabPane key={status} visible={activeTab === status}>
                      {/* Search and Filters for each tab */}
                      <CRow className="mb-3">
                        <CCol md={6}>
                          <CInputGroup>
                            <CFormInput
                              placeholder={`Search ${status} orders by PO number or supplier...`}
                              value={searchTerms[status]}
                              onChange={(e) => handleSearchChange(status, e.target.value)}
                            />
                          </CInputGroup>
                        </CCol>
                        <CCol md={6} className="text-end">
                          <small className="text-muted">
                            Showing {orders.length} of {total} orders
                          </small>
                        </CCol>
                      </CRow>

                      <CTable hover responsive>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>PO Number</CTableHeaderCell>
                            <CTableHeaderCell>Supplier</CTableHeaderCell>
                            <CTableHeaderCell>Order Date</CTableHeaderCell>
                            <CTableHeaderCell>Expected Delivery</CTableHeaderCell>
                            <CTableHeaderCell>Status</CTableHeaderCell>
                            <CTableHeaderCell>Total Amount</CTableHeaderCell>
                            <CTableHeaderCell>Paid Amount</CTableHeaderCell>
                            <CTableHeaderCell>Paid Status</CTableHeaderCell>
                            <CTableHeaderCell>Created By</CTableHeaderCell>
                            <CTableHeaderCell>Actions</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {orders.length === 0 ? (
                            <CTableRow>
                              <CTableDataCell colSpan={10} className="text-center">
                                No {status} purchase orders found
                              </CTableDataCell>
                            </CTableRow>
                          ) : (
                            orders.map((po) => (
                              <CTableRow key={po.id}>
                                <CTableDataCell>
                                  <strong>{po.po_number}</strong>
                                </CTableDataCell>
                                <CTableDataCell>{po.supplier?.name}</CTableDataCell>
                                <CTableDataCell>
                                  {new Date(po.order_date).toLocaleDateString()}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {new Date(po.expected_delivery_date).toLocaleDateString()}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {getStatusBadge(po.status)}
                                </CTableDataCell>
                                <CTableDataCell>
                                  £{parseFloat(po.total_amount)}
                                </CTableDataCell>
                                <CTableDataCell>
                                  £{parseFloat(po.paid_amount).toFixed(2)}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {getPaymentStatusBadge(po.paid_status)}
                                </CTableDataCell>
                                <CTableDataCell>{po.creator?.name}</CTableDataCell>
                                <CTableDataCell>
                                  <CButtonGroup size="sm">
                                    {hasPermission && hasPermission('view_purchase_order') && (
                                      <CButton
                                        color="info"
                                        variant="outline"
                                        onClick={() => navigate(`/purchases/${po.id}`)}
                                        title="View Details"
                                      >
                                        <CIcon icon={cilSearch} />
                                      </CButton>
                                    )}
                                    {isExportAllowed(po.status) && (
                                      <CButton
                                        color="info"
                                        variant="outline"
                                        onClick={() => handleExport(po)}
                                        title="Export"
                                        disabled={exportLoading[po.id]}
                                      >
                                        {exportLoading[po.id] ? (
                                          <CSpinner size="sm" />
                                        ) : (
                                          <CIcon icon={cilPrint} />
                                        )}
                                      </CButton>
                                    )}
                                    <CButton
                                      color="secondary"
                                      variant="outline"
                                      onClick={() => handleShortExport(po)}
                                      title="Short Export (Driver Receipt)"
                                      disabled={shortExportLoading[po.id]}
                                    >
                                      {shortExportLoading[po.id] ? (
                                        <CSpinner size="sm" />
                                      ) : (
                                        <CIcon icon={cilPrint} />
                                      )}
                                    </CButton>
                                    {hasPermission && hasPermission('create_email') && (
                                      <CButton
                                        color="primary"
                                        variant="outline"
                                        onClick={() => openEmailModal(po)}
                                        title="Email Purchase Order"
                                      >
                                        <CIcon icon={cilEnvelopeClosed} />
                                      </CButton>
                                    )}
                                    {hasPermission && hasPermission('edit_purchase_order') && isEditable(po.status) && (
                                      <CButton
                                        color="primary"
                                        variant="outline"
                                        onClick={() => navigate(`/purchases/${po.id}/edit`)}
                                        title="Edit"
                                      >
                                        <CIcon icon={cilPencil} />
                                      </CButton>
                                    )}
                                    {hasPermission && hasPermission('edit_purchase_order') && isPaymentAllowed(po.status) && (
                                      <CButton
                                        color="success"
                                        variant="outline"
                                        onClick={() => handlePayment(po)}
                                        title="Payment"
                                      >
                                        <CIcon icon={cilCreditCard} />
                                      </CButton>
                                    )}
                                    {isConvertible(po.status) && (
                                      <CButton
                                        color="warning"
                                        variant="outline"
                                        onClick={() => handleConvert(po)}
                                        title="Convert to Purchased"
                                      >
                                        <CIcon icon={cilCheckCircle} />
                                      </CButton>
                                    )}
                                    {hasPermission && hasPermission('delete_purchase_order') && isDeletable(po.status) && (
                                      <CButton
                                        color="danger"
                                        variant="outline"
                                        onClick={() => handleDelete(po.id)}
                                        title="Delete"
                                      >
                                        <CIcon icon={cilTrash} />
                                      </CButton>
                                    )}
                                  </CButtonGroup>
                                </CTableDataCell>
                              </CTableRow>
                            ))
                          )}
                        </CTableBody>
                      </CTable>

                      {/* Pagination for each tab */}
                      {totalPages > 1 && (
                        <CRow className="mt-3">
                          <CCol className="d-flex justify-content-center">
                            <CPagination>
                              <CPaginationItem
                                disabled={currentPages[status] === 1}
                                onClick={() => handlePageChange(status, currentPages[status] - 1)}
                                style={{ cursor: currentPages[status] === 1 ? 'not-allowed' : 'pointer' }}
                              >
                                Previous
                              </CPaginationItem>
                              
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <CPaginationItem
                                  key={page}
                                  active={page === currentPages[status]}
                                  onClick={() => handlePageChange(status, page)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  {page}
                                </CPaginationItem>
                              ))}
                              
                              <CPaginationItem
                                disabled={currentPages[status] === totalPages}
                                onClick={() => handlePageChange(status, currentPages[status] + 1)}
                                style={{ cursor: currentPages[status] === totalPages ? 'not-allowed' : 'pointer' }}
                              >
                                Next
                              </CPaginationItem>
                            </CPagination>
                          </CCol>
                        </CRow>
                      )}
                    </CTabPane>
                  );
                })}
              </CTabContent>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Payment Modal */}
      <PaymentModal
        visible={showPaymentModal}
        onClose={handlePaymentModalClose}
        onSuccess={handlePaymentSuccess}
        purchaseOrderId={selectedPurchaseOrder?.id}
        supplierId={selectedPurchaseOrder?.supplier_id}
        totalAmount={selectedPurchaseOrder ? parseFloat(selectedPurchaseOrder.total_amount || 0) : 0}
        paidAmount={selectedPurchaseOrder ? parseFloat(selectedPurchaseOrder.paid_amount || 0) : 0}
        title="Make Payment for Purchase Order"
      />

      {/* Convert to Purchased Modal */}
      <ConvertToPurchasedModal
        visible={showConvertModal}
        onClose={handleConvertModalClose}
        onSuccess={handleConvertSuccess}
        purchaseOrder={selectedPurchaseOrder}
      />

      {/* Email Modal */}
      <CModal
        visible={emailModal}
        onClose={() => setEmailModal(false)}
        size="lg"
        centered
      >
        <CModalHeader closeButton>
          <CModalTitle>Send Email</CModalTitle>
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
    </div>
  );
};

export default PurchaseOrderList; 