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
  CPagination,
  CPaginationItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
} from '@coreui/react';
import { cilSearch, cilPrint, cilCreditCard, cilEnvelopeClosed } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const PurchasedList = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState('purchase_date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [suppliers, setSuppliers] = useState([]);
  const [exportLoading, setExportLoading] = useState({});
  const [shortExportLoading, setShortExportLoading] = useState({});
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  // Email functionality
  const [emailModal, setEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '' });
  const [emailLoading, setEmailLoading] = useState(false);
  const [attachmentEnabled, setAttachmentEnabled] = useState(true);
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const fileInputRef = useRef(null);

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

  const { hasPermission } = useAuth();

  // Permission checks
  const canView = hasPermission && (hasPermission('view_purchasedorder') || hasPermission('view_purchaseorder'));
  const canEdit = hasPermission && hasPermission('edit_purchase');
  const canEmail = hasPermission && hasPermission('create_email');

  useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await api.get('/purchase-orders/completed');
      setPurchases(response.data?.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch purchased orders');
      console.error('Error fetching purchases:', err);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers/active');
      setSuppliers(response.data?.data || []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setSuppliers([]);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'success', text: 'Completed' },
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

  const handleSearch = () => {
    setCurrentPage(1);
    // Filter logic will be implemented
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleExport = async (purchase) => {
    try {
      setExportLoading(prev => ({ ...prev, [purchase.id]: true }));
      setAlert(null);
      
      const response = await api.get(`/purchase-orders/${purchase.id}/export-pdf`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PurchaseOrder-${purchase.po_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setAlert({ type: 'success', message: `Purchase Order ${purchase.po_number} PDF exported successfully!` });
    } catch (err) {
      console.error('Error exporting PDF:', err);
      setAlert({ type: 'danger', message: 'Failed to export PDF. Please try again.' });
    } finally {
      setExportLoading(prev => ({ ...prev, [purchase.id]: false }));
    }
  };

  const handleShortExport = async (purchase) => {
    try {
      setShortExportLoading(prev => ({ ...prev, [purchase.id]: true }));
      setAlert(null);
      
      const response = await api.get(`/purchase-orders/${purchase.id}/export-short-pdf`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DriverReceipt-${purchase.po_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setAlert({ type: 'success', message: `Driver Receipt ${purchase.po_number} PDF exported successfully!` });
    } catch (err) {
      console.error('Error exporting short PDF:', err);
      setAlert({ type: 'danger', message: 'Failed to export Driver Receipt PDF. Please try again.' });
    } finally {
      setShortExportLoading(prev => ({ ...prev, [purchase.id]: false }));
    }
  };

  const handlePayment = (purchase) => {
    navigate(`/purchases/${purchase.id}`, { state: { showPayment: true } });
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

  const openEmailModal = (purchase) => {
    setSelectedPurchase(purchase);
    setEmailForm({ email: purchase?.supplier?.email || '' });
    setEmailModal(true);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!selectedPurchase) return;
    setEmailLoading(true);
    setFileErrors([]);
    const formData = new FormData();
    formData.append('purchase_order_id', selectedPurchase.id);
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
        setSelectedPurchase(null);
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

  // Filter and sort purchases
  const getFilteredAndSortedPurchases = () => {
    // Ensure purchases is always an array
    if (!Array.isArray(purchases)) {
      return [];
    }

    let filtered = purchases.filter(purchase => {
      const matchesSearch = 
        purchase.po_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSupplier = !supplierFilter || purchase.supplier_id == supplierFilter;
      
      const matchesDateRange = !dateRange.start || !dateRange.end || 
        (purchase.purchase_date >= dateRange.start && purchase.purchase_date <= dateRange.end);
      
      return matchesSearch && matchesSupplier && matchesDateRange;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'purchase_date' || sortBy === 'order_date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredPurchases = getFilteredAndSortedPurchases();
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPurchases = filteredPurchases.slice(startIndex, endIndex);

  if (!canView) {
    return (
      <CAlert color="danger" className="mt-4">
        You do not have permission to view purchased orders.
      </CAlert>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <CSpinner />
      </div>
    );
  }

  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow className="align-items-center">
                <CCol>
                  <h4 className="mb-0">Purchased Orders</h4>
                  <p className="text-muted mb-0">Completed purchase orders</p>
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

              {/* Search and Filters */}
              <CRow className="mb-3">
                <CCol md={3}>
                  <CInputGroup>
                    <CFormInput
                      placeholder="Search PO number or supplier..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <CButton color="primary" onClick={handleSearch}>
                      <CIcon icon={cilSearch} />
                    </CButton>
                  </CInputGroup>
                </CCol>
                <CCol md={2}>
                  <CFormSelect
                    value={supplierFilter}
                    onChange={(e) => setSupplierFilter(e.target.value)}
                  >
                    <option value="">All Suppliers</option>
                    {Array.isArray(suppliers) && suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <CFormInput
                    type="date"
                    placeholder="Start Date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  />
                </CCol>
                <CCol md={2}>
                  <CFormInput
                    type="date"
                    placeholder="End Date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormSelect
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                  >
                    <option value="purchase_date-desc">Purchase Date (Newest)</option>
                    <option value="purchase_date-asc">Purchase Date (Oldest)</option>
                    <option value="order_date-desc">Order Date (Newest)</option>
                    <option value="order_date-asc">Order Date (Oldest)</option>
                    <option value="total_amount-desc">Amount (High to Low)</option>
                    <option value="total_amount-asc">Amount (Low to High)</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* Results Summary */}
              {filteredPurchases.length > 0 && (
                <div className="mb-3">
                  <small className="text-muted">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredPurchases.length)} of {filteredPurchases.length} purchased orders
                  </small>
                </div>
              )}

              {/* Purchases Table */}
              {filteredPurchases.length === 0 ? (
                <CAlert color="info" className="text-center">
                  No purchased orders found. {searchTerm || supplierFilter || dateRange.start || dateRange.end ? 'Try adjusting your filters.' : ''}
                </CAlert>
              ) : (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('po_number')}
                      >
                        PO Number
                      </CTableHeaderCell>
                      <CTableHeaderCell>Supplier</CTableHeaderCell>
                      <CTableHeaderCell 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('purchase_date')}
                      >
                        Purchase Date
                      </CTableHeaderCell>
                      <CTableHeaderCell 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('order_date')}
                      >
                        Order Date
                      </CTableHeaderCell>
                      <CTableHeaderCell 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('total_amount')}
                      >
                        Total Amount
                      </CTableHeaderCell>
                      <CTableHeaderCell>Paid Amount</CTableHeaderCell>
                      <CTableHeaderCell>Payment Status</CTableHeaderCell>
                      <CTableHeaderCell>Created By</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {Array.isArray(paginatedPurchases) && paginatedPurchases.map((purchase) => (
                      <CTableRow key={purchase.id}>
                        <CTableDataCell>
                          <strong>{purchase.po_number}</strong>
                        </CTableDataCell>
                        <CTableDataCell>{purchase.supplier?.name}</CTableDataCell>
                        <CTableDataCell>
                          {purchase.purchase_date ? new Date(purchase.purchase_date).toLocaleDateString() : '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {new Date(purchase.order_date).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          <strong>£{parseFloat(purchase.total_amount)}</strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          £{parseFloat(purchase.paid_amount || 0)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {getPaymentStatusBadge(purchase.paid_status)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {purchase.creator?.name}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButtonGroup size="sm">
                            {canView && (
                              <CButton
                                color="info"
                                variant="outline"
                                onClick={() => navigate(`/purchases/${purchase.id}`)}
                                title="View Details"
                              >
                                <CIcon icon={cilSearch} />
                              </CButton>
                            )}
                            {canEmail && (
                              <CButton
                                color="primary"
                                variant="outline"
                                onClick={() => openEmailModal(purchase)}
                                title="Email Purchase Order"
                              >
                                <CIcon icon={cilEnvelopeClosed} />
                              </CButton>
                            )}
                            {canEdit && (
                              <CButton
                                color="info"
                                variant="outline"
                                onClick={() => handleExport(purchase)}
                                title="Export"
                                disabled={exportLoading[purchase.id]}
                              >
                                {exportLoading[purchase.id] ? (
                                  <CSpinner size="sm" />
                                ) : (
                                  <CIcon icon={cilPrint} />
                                )}
                              </CButton>
                            )}
                            {canEdit && (
                              <CButton
                                color="secondary"
                                variant="outline"
                                onClick={() => handleShortExport(purchase)}
                                title="Short Export (Driver Receipt)"
                                disabled={shortExportLoading[purchase.id]}
                              >
                                {shortExportLoading[purchase.id] ? (
                                  <CSpinner size="sm" />
                                ) : (
                                  <CIcon icon={cilPrint} />
                                )}
                              </CButton>
                            )}
                            {canEdit && (
                              <CButton
                                color="success"
                                variant="outline"
                                onClick={() => handlePayment(purchase)}
                                title="Payment"
                              >
                                <CIcon icon={cilCreditCard} />
                              </CButton>
                            )}
                          </CButtonGroup>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <CPagination>
                    <CPaginationItem
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </CPaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <CPaginationItem
                        key={page}
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </CPaginationItem>
                    ))}
                    
                    <CPaginationItem
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </CPaginationItem>
                  </CPagination>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

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
          {canEmail && (
            <CButton color="primary" onClick={handleSendEmail} disabled={emailLoading}>
              {emailLoading ? <CSpinner size="sm" className="me-2" /> : <CIcon icon={cilEnvelopeClosed} className="me-2" />}
              {emailLoading ? 'Sending...' : 'Send Email'}
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default PurchasedList; 