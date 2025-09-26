import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import {
  CCard, CCardHeader, CCardBody, CButton, CAlert, CSpinner, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CForm, CFormInput, CFormSelect, CPagination, CPaginationItem, CInputGroup, CInputGroupText, CRow, CCol, CBadge, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormTextarea, CFormLabel, CButtonGroup, CListGroup, CListGroupItem
} from '@coreui/react';
import { cilWallet, cilPlus, cilSearch, cilFilter, cilArrowLeft, cilCalendar, cilMoney, cilPencil, cilTrash, cilPrint, cilUser, cilPhone, cilEnvelopeClosed, cilHome } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { toast } from 'react-hot-toast';

function WalletLedger() {
  const { partyType, partyId } = useParams();
  const navigate = useNavigate();
  
  const [ledgerData, setLedgerData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  
  // Transaction modal
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionForm, setTransactionForm] = useState({
    type: 'credit',
    amount: '',
    description: '',
    payment_method: '',
    reference: ''
  });
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionErrors, setTransactionErrors] = useState({});

  // Filters
  const [filters, setFilters] = useState({
    type: '',
    start_date: '',
    end_date: ''
  });

  const [walletId, setWalletId] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);

  // Payment methods
  const paymentMethods = [
    { value: '', label: 'Select Payment Method' },
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'upi', label: 'UPI' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'card', label: 'Card' },
    { value: 'other', label: 'Other' }
  ];

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

  const [emailModal, setEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '' });
  const [emailLoading, setEmailLoading] = useState(false);
  const [attachmentEnabled, setAttachmentEnabled] = useState(true);
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    // First, fetch the wallet account for the party
    api.get(`/wallets/by-customer/${partyType}/${partyId}`)
      .then(res => {
        setWalletId(res.data.id);
        loadLedger(res.data.id);
        // Fetch customer information
        fetchCustomerInfo();
      })
      .catch(err => {
        toast.error(err.response?.data?.message || 'Wallet account not found');
        setLoading(false);
      });
  }, [partyType, partyId]);

  const fetchCustomerInfo = async () => {
    try {
      // For now, we'll use the customers endpoint for both customers and retailers
      // since the retailers endpoint doesn't exist in the API
      const response = await api.get(`/customers/${partyId}`);
      setCustomerInfo(response.data);
    } catch (err) {
      console.error('Error fetching customer info:', err);
      // If customer info fails to load, we'll still show the wallet data
      // but without the detailed customer information
    }
  };

  const loadLedger = (walletIdToUse, page = 1) => {
    if (!walletIdToUse && !walletId) return;
    setLoading(true);
    const params = {
      page,
      per_page: 20,
      ...filters
    };
    api.get(`/wallets/ledger/${walletIdToUse || walletId}`, { params })
      .then(response => {
        setLedgerData(response.data.wallet);
        setTransactions(response.data.transactions);
        setPagination({
          current_page: 1,
          last_page: 1,
          total: response.data.transactions.length,
        });
      })
      .catch(err => {
        toast.error(err.response?.data?.message || 'Error loading ledger');
      })
      .finally(() => setLoading(false));
  };

  const handlePageChange = (page) => {
    loadLedger(walletId, page);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    loadLedger(walletId, 1);
  };

  const resetTransactionForm = () => {
    setTransactionForm({
      type: 'credit',
      amount: '',
      description: '',
      payment_method: '',
      reference: ''
    });
    setEditingTransaction(null);
    setTransactionErrors({});
  };

  const openAddTransactionModal = () => {
    resetTransactionForm();
    setShowTransactionModal(true);
  };

  const openEditTransactionModal = (transaction) => {
    setEditingTransaction(transaction);
    setTransactionForm({
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description || '',
      payment_method: transaction.payment_method || '',
      reference: transaction.reference || ''
    });
    setShowTransactionModal(true);
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    setTransactionLoading(true);
    setTransactionErrors({});

    const data = {
      party_type: partyType,
      party_id: parseInt(partyId),
      ...transactionForm
    };

    const method = editingTransaction ? 'put' : 'post';
    const url = editingTransaction 
      ? `/wallets/transaction/${editingTransaction.id}`
      : '/wallets/transaction';

    api[method](url, data)
      .then(response => {
        toast.success(response.data.message);
        setShowTransactionModal(false);
        resetTransactionForm();
        loadLedger(walletId); // Reload ledger
      })
      .catch(err => {
        if (err.response?.status === 422) {
          setTransactionErrors(err.response.data.errors);
        } else {
          toast.error(err.response?.data?.message || 'Error saving transaction');
        }
      })
      .finally(() => setTransactionLoading(false));
  };

  const handleDeleteTransaction = (transaction) => {
    if (!window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
      return;
    }

    api.delete(`/wallets/transaction/${transaction.id}`)
      .then(response => {
        toast.success(response.data.message);
        loadLedger(walletId); // Reload ledger
      })
      .catch(err => {
        toast.error(err.response?.data?.message || 'Error deleting transaction');
      });
  };

  const getTransactionError = (field) => {
    return transactionErrors[field] ? transactionErrors[field][0] : null;
  };

  const getBalanceBadge = (balance) => {
    if (parseFloat(balance) >= 0) {
      return <CBadge color="success">Credit £{parseFloat(balance).toFixed(2)}</CBadge>;
    } else {
      return <CBadge color="danger">Debit £{Math.abs(parseFloat(balance)).toFixed(2)}</CBadge>;
    }
  };

  const getTransactionTypeBadge = (type) => {
    return type === 'credit' ? 
      <CBadge color="success">Credit</CBadge> : 
      <CBadge color="danger">Debit</CBadge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate totals from transactions
  const totalCredit = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalDebit = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const runningBalance = transactions.reduce((sum, t) => t.type === 'credit' ? sum + parseFloat(t.amount) : sum - parseFloat(t.amount), 0);

  const handleExport = async () => {
    if (!walletId) {
      toast.error('Wallet not found');
      return;
    }

    setExportLoading(true);
    try {
      const response = await api.get(`/wallets/${walletId}/export-pdf`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `wallet-ledger-${partyType}-${partyId}-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Wallet ledger exported successfully!');
    } catch (err) {
      console.error('Export error:', err);
      toast.error(err.response?.data?.message || 'Error exporting wallet ledger');
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

  const openEmailModal = () => {
    setEmailForm({ email: customerInfo?.email || '' });
    setEmailModal(true);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    setEmailLoading(true);
    setFileErrors([]);
    const formData = new FormData();
    formData.append('wallet_id', walletId);
    formData.append('email', emailForm.email);
    if (attachmentEnabled && files.length) {
      files.forEach(file => formData.append('attachments[]', file));
    }
    api.post('/emails/send-wallet-ledger', formData, {
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

  if (!ledgerData) {
    return (
      <div className="text-center my-4">
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <>
      <AppBreadcrumb />
      
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1">
              <CIcon icon={cilWallet} className="me-2" />
              Wallet Ledger{(customerInfo?.name || ledgerData.name) ? ` - ${customerInfo?.name || ledgerData.name}` : ''}
            </h2>
            {(customerInfo?.type || ledgerData.type || customerInfo?.phone || ledgerData.phone) && (
              <div className="text-muted">
                {(customerInfo?.type || ledgerData.type) && (customerInfo?.type === 'retailer' || ledgerData.type === 'retailer' ? 'Retailer' : 'Customer')}
                {(customerInfo?.phone || ledgerData.phone) && ` • ${(customerInfo?.phone || ledgerData.phone)}`}
              </div>
            )}
          </div>
          <div className="d-flex gap-2 align-items-center">
            {/* Action Buttons: Export, Email, Add Transaction, Back */}
            <CButton color="secondary" variant="outline" onClick={handleExport} disabled={exportLoading} title="Export PDF">
              <CIcon icon={cilPrint} />
            </CButton>
            <CButton color="info" variant="outline" onClick={openEmailModal} title="Email Ledger">
              <CIcon icon={cilEnvelopeClosed} />
            </CButton>
            <CButton 
              color="primary" 
              onClick={openAddTransactionModal}
            >
              <CIcon icon={cilPlus} className="me-2" /> Add Transaction
            </CButton>
            <CButton 
              color="outline-secondary" 
              onClick={() => navigate('/customers')}
            >
              <CIcon icon={cilArrowLeft} className="me-2" /> Back
            </CButton>
          </div>
        </div>

        {/* Customer Information Section */}
        {customerInfo && (
          <CCard className="shadow-sm mb-3">
            <CCardHeader>
              <h5 className="mb-0">
                <CIcon icon={cilUser} className="me-2" />
                Customer Information
              </h5>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={6}>
                  <CListGroup>
                    <CListGroupItem>
                      <div className="d-flex align-items-center">
                        <CIcon icon={cilUser} className="me-2 text-primary" />
                        <div>
                          <strong>Name:</strong> {customerInfo.name}
                        </div>
                      </div>
                    </CListGroupItem>
                    <CListGroupItem>
                      <div className="d-flex align-items-center">
                        <CIcon icon={cilPhone} className="me-2 text-success" />
                        <div>
                          <strong>Phone:</strong> {customerInfo.phone || 'Not provided'}
                        </div>
                      </div>
                    </CListGroupItem>
                  </CListGroup>
                </CCol>
                <CCol md={6}>
                  <CListGroup>
                    <CListGroupItem>
                      <div className="d-flex align-items-center">
                        <CIcon icon={cilEnvelopeClosed} className="me-2 text-info" />
                        <div>
                          <strong>Email:</strong> {customerInfo.email || 'Not provided'}
                        </div>
                      </div>
                    </CListGroupItem>
                    <CListGroupItem>
                      <div className="d-flex align-items-center">
                        <CIcon icon={cilHome} className="me-2 text-warning" />
                        <div>
                          <strong>Address:</strong> {customerInfo.address || 'Not provided'}
                        </div>
                      </div>
                    </CListGroupItem>
                  </CListGroup>
                </CCol>
              </CRow>
              {customerInfo.type && (
                <CRow className="mt-3">
                  <CCol>
                    <CBadge 
                      color={customerInfo.type === 'retailer' ? 'warning' : 'success'}
                      className="fs-6 px-3 py-2"
                    >
                      Type: {customerInfo.type.charAt(0).toUpperCase() + customerInfo.type.slice(1)}
                    </CBadge>
                  </CCol>
                </CRow>
              )}
            </CCardBody>
          </CCard>
        )}

        {/* Balance Summary */}
        <CRow className="g-3 mb-3">
          <CCol md={4}>
            <CCard className="shadow-sm text-center">
              <CCardBody>
                <div className="mb-2">
                  <CBadge color="info" className="p-3 fs-5">
                    <CIcon icon={cilWallet} />
                  </CBadge>
                </div>
                <div className="fs-4 fw-bold">
                  {getBalanceBadge(runningBalance)}
                </div>
                <div className="text-muted">Current Balance</div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={4}>
            <CCard className="shadow-sm text-center">
              <CCardBody>
                <div className="mb-2">
                  <CBadge color="success" className="p-3 fs-5">
                    <CIcon icon={cilMoney} />
                  </CBadge>
                </div>
                <div className="fs-4 fw-bold">£{totalCredit.toFixed(2)}</div>
                <div className="text-muted">Total Credit</div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={4}>
            <CCard className="shadow-sm text-center">
              <CCardBody>
                <div className="mb-2">
                  <CBadge color="danger" className="p-3 fs-5">
                    <CIcon icon={cilMoney} />
                  </CBadge>
                </div>
                <div className="fs-4 fw-bold">£{totalDebit.toFixed(2)}</div>
                <div className="text-muted">Total Debit</div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Information Notes */}
        <CCard className="shadow-sm mb-3">
          <CCardHeader>
            <h6 className="mb-0">
              <CIcon icon={cilWallet} className="me-2" />
              Understanding Wallet Transactions
            </h6>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <h6 className="text-success mb-2">
                    <CBadge color="success" className="me-2">Credit (Jama)</CBadge>
                    Money received from customer or added to wallet balance
                  </h6>
                  <p className="text-muted small mb-0">
                    Examples: Customer payments, refunds, wallet top-ups
                  </p>
                </div>
                <div>
                  <h6 className="text-danger mb-2">
                    <CBadge color="danger" className="me-2">Debit (Udhar)</CBadge>
                    Money given to customer, used by invoice, or deducted from wallet balance
                  </h6>
                  <p className="text-muted small mb-0">
                    Examples: Invoice payments, cash withdrawals, refunds to customer
                  </p>
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <h6 className="text-info mb-2">
                    <CBadge color="info" className="me-2">Positive Balance</CBadge>
                    Customer owes money to the company
                  </h6>
                  <p className="text-muted small mb-0">
                    The customer has a credit balance in their wallet
                  </p>
                </div>
                <div>
                  <h6 className="text-warning mb-2">
                    <CBadge color="warning" className="me-2">Negative Balance</CBadge>
                    Company owes money to the customer
                  </h6>
                  <p className="text-muted small mb-0">
                    The company owes money to the customer
                  </p>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        {/* Filters */}
        <CCard className="shadow-sm mb-3">
          <CCardBody>
            <CForm onSubmit={handleFilterSubmit}>
              <CRow className="g-3">
                <CCol md={3}>
                  <CFormSelect
                    value={filters.type}
                    onChange={e => handleFilterChange('type', e.target.value)}
                  >
                    <option value="">All Transactions</option>
                    <option value="credit">Credit Only</option>
                    <option value="debit">Debit Only</option>
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CInputGroup>
                    <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                    <CFormInput
                      type="date"
                      value={filters.start_date}
                      onChange={e => handleFilterChange('start_date', e.target.value)}
                      placeholder="Start Date"
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={3}>
                  <CInputGroup>
                    <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                    <CFormInput
                      type="date"
                      value={filters.end_date}
                      onChange={e => handleFilterChange('end_date', e.target.value)}
                      placeholder="End Date"
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={3}>
                  <CButton type="submit" color="primary" className="w-100">
                    <CIcon icon={cilFilter} className="me-2" /> Apply Filters
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </div>

      {/* Alerts */}
      {/* {alert && <CAlert color={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</CAlert>} */}

      {/* Transactions Table */}
      {loading ? (
        <div className="text-center my-4"><CSpinner color="primary" /></div>
      ) : (
        <>
          <CCard className="shadow-sm">
            <CCardBody className="p-0">
              <CTable hover responsive className="mb-0 align-middle">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Date & Time</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Payment Method</CTableHeaderCell>
                    <CTableHeaderCell>Reference</CTableHeaderCell>
                    <CTableHeaderCell>Running Balance</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {transactions.map(row => (
                    <CTableRow key={row.id}>
                      <CTableDataCell>
                        <div className="small">{formatDate(row.created_at)}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {getTransactionTypeBadge(row.type)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="fw-bold">£{parseFloat(row.amount).toFixed(2)}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{row.description || '-'}</div>
                        {row.invoice && <div className="small text-muted">Invoice: #{row.invoice.id}</div>}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small">{row.payment_method || '-'}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small">{row.reference || '-'}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {getBalanceBadge(row.running_balance)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButtonGroup size="sm">
                          <CButton 
                            color="primary" 
                            variant="outline"
                            onClick={() => openEditTransactionModal(row)}
                            title="Edit Transaction"
                            disabled={!row.is_editable}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton 
                            color="danger" 
                            variant="outline"
                            onClick={() => handleDeleteTransaction(row)}
                            title="Delete Transaction"
                            disabled={!row.is_editable}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CButtonGroup>
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

      {/* Add/Edit Transaction Modal */}
      <CModal 
        visible={showTransactionModal} 
        onClose={() => setShowTransactionModal(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleAddTransaction}>
            <CRow>
              <CCol md={6}>
                <CFormLabel htmlFor="transaction_type">Transaction Type *</CFormLabel>
                <CFormSelect
                  id="transaction_type"
                  value={transactionForm.type}
                  onChange={e => setTransactionForm({ ...transactionForm, type: e.target.value })}
                  invalid={!!getTransactionError('type')}
                  feedback={getTransactionError('type')}
                  required
                >
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="amount">Amount *</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>£</CInputGroupText>
                  <CFormInput
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={transactionForm.amount}
                    onChange={e => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                    invalid={!!getTransactionError('amount')}
                    feedback={getTransactionError('amount')}
                    placeholder="Enter amount"
                    required
                  />
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md={6}>
                <CFormLabel htmlFor="payment_method">Payment Method</CFormLabel>
                <CFormSelect
                  id="payment_method"
                  value={transactionForm.payment_method}
                  onChange={e => setTransactionForm({ ...transactionForm, payment_method: e.target.value })}
                  invalid={!!getTransactionError('payment_method')}
                  feedback={getTransactionError('payment_method')}
                >
                  {paymentMethods.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="reference">Reference</CFormLabel>
                <CFormInput
                  id="reference"
                  value={transactionForm.reference}
                  onChange={e => setTransactionForm({ ...transactionForm, reference: e.target.value })}
                  invalid={!!getTransactionError('reference')}
                  feedback={getTransactionError('reference')}
                  placeholder="Enter reference (optional)"
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md={12}>
                <CFormLabel htmlFor="description">Description</CFormLabel>
                <CFormTextarea
                  id="description"
                  value={transactionForm.description}
                  onChange={e => setTransactionForm({ ...transactionForm, description: e.target.value })}
                  invalid={!!getTransactionError('description')}
                  feedback={getTransactionError('description')}
                  placeholder="Enter transaction description (optional)"
                  rows={3}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setShowTransactionModal(false)}
            disabled={transactionLoading}
          >
            Cancel
          </CButton>
          <CButton 
            color="primary" 
            onClick={handleAddTransaction}
            disabled={transactionLoading}
          >
            {transactionLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                {editingTransaction ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              editingTransaction ? 'Update Transaction' : 'Add Transaction'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Email Modal */}
      <CModal 
        visible={emailModal} 
        onClose={() => setEmailModal(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            Send Wallet Ledger Email
          </CModalTitle>
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
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setEmailModal(false)}
            disabled={emailLoading}
          >
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}

export default WalletLedger; 