import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import {
  CCard, CCardHeader, CCardBody, CButton, CAlert, CSpinner, CRow, CCol, CBadge, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CFormInput
} from '@coreui/react';
import { cilPencil, cilTrash, cilWallet, cilPrint, cilArrowLeft, cilChevronBottom, cilChevronRight, cilMoney, cilEnvelopeClosed } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [expandedSale, setExpandedSale] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '' });
  const [emailLoading, setEmailLoading] = useState(false);
  const [attachmentEnabled, setAttachmentEnabled] = useState(true);
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
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

  useEffect(() => {
    api.get(`/customers/${id}/details`).then(res => {
      setData(res.data);
    }).catch(err => {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Error loading customer details' });
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-5"><CSpinner /></div>;
  if (!data) return <CAlert color="danger">Customer not found</CAlert>;
  const { customer, wallet, wallet_transactions, sales, stats } = data;

  // Total Due to Pay logic
  const totalDue = Number(customer.current_balance || 0) + (Number(stats.total_due || 0) * -1);
  let dueLabel = '';
  let cardBg = '';
  let cardText = '';
  if (totalDue > 0) {
    dueLabel = 'Advance with Shopkeeper';
    cardBg = '#d1e7dd';
    cardText = '#0f5132';
  } else if (totalDue < 0) {
    dueLabel = 'Amount to Collect from Customer';
    cardBg = '#fff3cd';
    cardText = '#856404';
  } else {
    dueLabel = 'No Dues';
    cardBg = '#f8f9fa';
    cardText = '#6c757d';
  }

  const handleExportPdf = async () => {
    try {
      setExportLoading(true);
      const response = await api.get(`/customers/${customer.id}/export-pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CustomerReport-${customer.name}-${customer.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setAlert({ type: 'danger', msg: 'Failed to export customer report. Please try again.' });
    } finally {
      setExportLoading(false);
    }
  };

  const openEmailModal = () => {
    setEmailForm({ email: customer.email || '' });
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

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    setFileErrors([]);
    const formData = new FormData();
    formData.append('customer_id', customer.id);
    formData.append('email', emailForm.email);
    if (attachmentEnabled && files.length) {
      files.forEach(file => formData.append('attachments[]', file));
    }
    try {
      await api.post('/emails/send-customer-details', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setEmailModal(false);
      setAlert({ type: 'success', msg: 'Customer details emailed successfully!' });
      setEmailForm({ email: '' });
      setFiles([]);
      setAttachmentEnabled(true);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Failed to send email' });
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div style={{ margin: '0 auto', padding: '24px', background: '#f5f6fa', minHeight: '100vh' }}>
      <AppBreadcrumb />
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="mb-1">Customer Details</h2>
          <div className="text-muted">{customer.name}</div>
        </div>
        <div className="d-flex gap-2">
          <CButton color="secondary" variant="outline" onClick={() => navigate('/customers')}><CIcon icon={cilArrowLeft} className="me-2" />Back to List</CButton>
          <CButton color="success" variant="outline" onClick={handleExportPdf} disabled={exportLoading}>
            {exportLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Export PDF
              </>
            ) : (
              <>
                <CIcon icon={cilPrint} className="me-2" />
                Export PDF
              </>
            )}
          </CButton>
          <CButton color="info" variant="outline" onClick={openEmailModal}>
            <CIcon icon={cilEnvelopeClosed} className="me-2" />Email Details
          </CButton>
        </div>
      </div>
      {alert && <CAlert color={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</CAlert>}
      {/* Two-Column Info Section */}
      <CCard className="shadow-sm mb-3" style={{ background: '#fff', borderRadius: 12, border: '1px solid #e9ecef' }}>
        <CCardHeader className="bg-white fw-bold" style={{ borderRadius: '12px 12px 0 0', padding: '12px 16px' }}>Customer Information</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={4}>
              <div><b>Name:</b> {customer.name}</div>
              <div><b>Type:</b> <CBadge color={customer.type === 'customer' ? 'primary' : 'info'}>{customer.type}</CBadge></div>
              <div><b>Phone:</b> {customer.phone || '-'}</div>
              <div><b>Email:</b> {customer.email || '-'}</div>
              <div><b>VAT Number:</b> {customer.gst_number || '-'}</div>
            </CCol>
            <CCol md={4}>
              <div><b>Address:</b> {customer.address || '-'}</div>
              <div><b>Status:</b> {customer.status === 'active' ? <CBadge color="success">Active</CBadge> : <CBadge color="secondary">Inactive</CBadge>}</div>
              <div><b>Created:</b> {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : '-'}</div>
              <div><b>Last Updated:</b> {customer.updated_at ? new Date(customer.updated_at).toLocaleDateString() : '-'}</div>
            </CCol>
            <CCol md={4} className="d-flex align-items-center justify-content-center">
              <CCard
                className="shadow-sm"
                style={{
                  background: cardBg,
                  border: '1px solid #dee2e6',
                  borderRadius: 10,
                  padding: '18px 32px',
                  minWidth: 220,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16
                }}
              >
                <CIcon icon={cilMoney} size="xl" style={{ color: cardText }} />
                <div>
                  <div style={{ fontWeight: 600, color: cardText, fontSize: '1.1rem' }}>{dueLabel}</div>
                  <div style={{ fontWeight: 700, color: cardText, fontSize: '2rem', marginTop: 2 }}>
                    £{Math.abs(totalDue).toFixed(2)}
                  </div>
                </div>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      {/* Wallet & Transactions Section */}
      <CCard className="shadow-sm mb-3" style={{ background: '#fff', borderRadius: 12, border: '1px solid #e9ecef' }}>
        <CCardHeader className="bg-white fw-bold" style={{ borderRadius: '12px 12px 0 0', padding: '12px 16px' }}>Wallet Transactions</CCardHeader>
        <CCardBody>
          {/* Wallet Summary Cards */}
          <CRow className="g-3 mb-2">
            <CCol md={3} sm={6}><CCard className="shadow-sm text-center" style={{ background: '#e7f1fa', borderRadius: 10, border: '1px solid #e9ecef' }}><CCardBody><div className="fs-6 fw-bold text-info">{stats.num_wallet_transactions}</div><div className="text-info small"># Transactions</div></CCardBody></CCard></CCol>
            <CCol md={3} sm={6}><CCard className="shadow-sm text-center" style={{ background: '#e7f1fa', borderRadius: 10, border: '1px solid #e9ecef' }}><CCardBody><div className="fs-6 fw-bold text-info">£{Number(wallet_transactions.filter(tx => tx.type === 'debit').reduce((sum, tx) => sum + Number(tx.amount), 0)).toFixed(2)}</div><div className="text-info small">Total Debit</div></CCardBody></CCard></CCol>
            <CCol md={3} sm={6}><CCard className="shadow-sm text-center" style={{ background: '#e7f1fa', borderRadius: 10, border: '1px solid #e9ecef' }}><CCardBody><div className="fs-6 fw-bold text-info">£{Number(wallet_transactions.filter(tx => tx.type === 'credit').reduce((sum, tx) => sum + Number(tx.amount), 0)).toFixed(2)}</div><div className="text-info small">Total Credit</div></CCardBody></CCard></CCol>
            <CCol md={3} sm={6}>{(() => {
              const balance = typeof customer.current_balance === 'number' ? customer.current_balance : Number(customer.current_balance);
              const color = balance < 0 ? 'danger' : 'success';
              const bg = balance < 0 ? '#f8d7da' : '#d1e7dd';
              return (
                <CCard className="shadow-sm text-center" style={{ background: bg, borderRadius: 10, border: '1px solid #e9ecef' }}>
                  <CCardBody>
                    <div className={`fs-6 fw-bold text-${color}`}>£{balance.toFixed(2)}</div>
                    <div className={`text-${color} small`}>Current Balance</div>
                  </CCardBody>
                </CCard>
              );
            })()}</CCol>
          </CRow>
          {/* Wallet Transactions Table in Accordion */}
          <CAccordion alwaysOpen>
            <CAccordionItem itemKey={1}>
              <CAccordionHeader>Recent Wallet Transactions</CAccordionHeader>
              <CAccordionBody>
                {wallet_transactions && wallet_transactions.length > 0 ? (
                  <CTable small responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Date</CTableHeaderCell>
                        <CTableHeaderCell>Type</CTableHeaderCell>
                        <CTableHeaderCell>Amount</CTableHeaderCell>
                        <CTableHeaderCell>Description</CTableHeaderCell>
                        <CTableHeaderCell>Balance</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {wallet_transactions.map(tx => (
                        <CTableRow key={tx.id}>
                          <CTableDataCell>{new Date(tx.created_at).toLocaleString()}</CTableDataCell>
                          <CTableDataCell>{tx.type}</CTableDataCell>
                          <CTableDataCell>{tx.type === 'credit' ? '+' : '-'}£{parseFloat(tx.amount).toFixed(2)}</CTableDataCell>
                          <CTableDataCell>{tx.description || '-'}</CTableDataCell>
                          <CTableDataCell>{tx.running_balance !== undefined ? '£' + parseFloat(tx.running_balance).toFixed(2) : '-'}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : <div className="text-muted">No wallet transactions.</div>}
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>
        </CCardBody>
      </CCard>
      {/* Recent Sales/Invoices Section */}
      <CCard className="shadow-sm mb-3" style={{ background: '#fff', borderRadius: 12, border: '1px solid #e9ecef' }}>
        <CCardHeader className="bg-white fw-bold" style={{ borderRadius: '12px 12px 0 0', padding: '12px 16px' }}>Sales/Invoices</CCardHeader>
        <CCardBody>
          {/* Sales Summary Cards */}
          <CRow className="g-3 mb-2">
            <CCol md={3} sm={6}><CCard className="shadow-sm text-center" style={{ background: '#e7f1fa', borderRadius: 10, border: '1px solid #e9ecef' }}><CCardBody><div className="fs-6 fw-bold text-info">{stats.num_sales}</div><div className="text-info small"># Sales</div></CCardBody></CCard></CCol>
            <CCol md={3} sm={6}><CCard className="shadow-sm text-center" style={{ background: '#e7f1fa', borderRadius: 10, border: '1px solid #e9ecef' }}><CCardBody><div className="fs-6 fw-bold text-info">£{Number(stats.total_sales || 0).toFixed(2)}</div><div className="text-info small">Total Sales</div></CCardBody></CCard></CCol>
            <CCol md={3} sm={6}><CCard className="shadow-sm text-center" style={{ background: '#e7f1fa', borderRadius: 10, border: '1px solid #e9ecef' }}><CCardBody><div className="fs-6 fw-bold text-info">£{Number(stats.total_paid || 0).toFixed(2)}</div><div className="text-info small">Total Paid</div></CCardBody></CCard></CCol>
            <CCol md={3} sm={6}>{(() => {
              const due = typeof stats.total_due === 'number' ? stats.total_due : Number(stats.total_due || 0);
              const color = due > 0 ? 'danger' : 'info';
              const bg = due > 0 ? '#f8d7da' : '#e7f1fa';
              return (
                <CCard className="shadow-sm text-center" style={{ background: bg, borderRadius: 10, border: '1px solid #e9ecef' }}>
                  <CCardBody>
                    <div className={`fs-6 fw-bold text-${color}`}>£{due.toFixed(2)}</div>
                    <div className={`text-${color} small`}>Outstanding</div>
                  </CCardBody>
                </CCard>
              );
            })()}</CCol>
          </CRow>
          {/* Sales Table in Accordion */}
          <CAccordion alwaysOpen>
            <CAccordionItem itemKey={1}>
              <CAccordionHeader>Recent Sales/Invoices</CAccordionHeader>
              <CAccordionBody>
                {sales && sales.length > 0 ? (
                  <CTable small responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell style={{ width: 240 }}>Date</CTableHeaderCell>
                        <CTableHeaderCell style={{ width: 100 }}>Invoice #</CTableHeaderCell>
                        <CTableHeaderCell className="text-end">Amount</CTableHeaderCell>
                        <CTableHeaderCell className="text-end">Paid</CTableHeaderCell>
                        <CTableHeaderCell className="text-end">Due</CTableHeaderCell>
                        <CTableHeaderCell></CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {sales.map(sale => (
                        <React.Fragment key={sale.id}>
                          <CTableRow className="expandable-row" key={sale.id}>
                            <CTableDataCell style={{ width: 240 }}>{new Date(sale.created_at).toLocaleString()}</CTableDataCell>
                            <CTableDataCell style={{ width: 100 }}>{sale.invoice_ref || sale.id}</CTableDataCell>
                            <CTableDataCell className="text-end">£{parseFloat(sale.grand_total).toFixed(2)}</CTableDataCell>
                            <CTableDataCell className="text-end">£{parseFloat(sale.paid).toFixed(2)}</CTableDataCell>
                            <CTableDataCell className="text-end">£{parseFloat(sale.due).toFixed(2)}</CTableDataCell>
                            <CTableDataCell
                              style={{
                                width: 60,
                                cursor: 'pointer',
                                background: '#f5f6fa',
                                textAlign: 'center',
                                borderLeft: '1px solid #e9ecef',
                                padding: 0
                              }}
                              onClick={() => setExpandedSale(expandedSale === sale.id ? null : sale.id)}
                            >
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 36,
                                  height: 36,
                                  borderRadius: '50%',
                                  background: expandedSale === sale.id ? '#e7f1fa' : '#fff',
                                  border: '1px solid #d1e7fa',
                                  transition: 'background 0.2s',
                                  boxShadow: expandedSale === sale.id ? '0 0 0 2px #b6d4fe' : 'none',
                                  margin: 'auto'
                                }}
                              >
                                <CIcon
                                  icon={expandedSale === sale.id ? cilChevronBottom : cilChevronRight}
                                  size="lg"
                                  className="text-primary"
                                />
                              </span>
                            </CTableDataCell>
                          </CTableRow>
                          {expandedSale === sale.id && sale.sales_transactions && sale.sales_transactions.length > 0 && (
                            <CTableRow>
                              <CTableDataCell colSpan={6} style={{ background: '#f8f9fa', padding: 0 }}>
                                <div style={{ padding: '12px 16px' }}>
                                  <b>Payment Transactions:</b>
                                  <CTable small responsive className="mt-2">
                                    <CTableHead>
                                      <CTableRow>
                                        <CTableHeaderCell style={{ width: 240 }}>Date</CTableHeaderCell>
                                        <CTableHeaderCell className="text-end">Amount</CTableHeaderCell>
                                        <CTableHeaderCell>Type</CTableHeaderCell>
                                        <CTableHeaderCell>Description</CTableHeaderCell>
                                      </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                      {sale.sales_transactions.map(tx => (
                                        <CTableRow key={tx.id}>
                                          <CTableDataCell style={{ width: 240 }}>{new Date(tx.created_at).toLocaleString()}</CTableDataCell>
                                          <CTableDataCell className="text-end">£{parseFloat(tx.amount).toFixed(2)}</CTableDataCell>
                                          <CTableDataCell>{tx.payment_type || '-'}</CTableDataCell>
                                          <CTableDataCell>{tx.description || '-'}</CTableDataCell>
                                        </CTableRow>
                                      ))}
                                    </CTableBody>
                                  </CTable>
                                </div>
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : <div className="text-muted">No sales/invoices.</div>}
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>
        </CCardBody>
      </CCard>
      {/* Email Modal */}
      <CModal visible={emailModal} onClose={() => setEmailModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Send Customer Details Email</CModalTitle>
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
          <CButton color="secondary" onClick={() => setEmailModal(false)} disabled={emailLoading}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}

export default CustomerDetail; 