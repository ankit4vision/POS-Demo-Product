import React, { useEffect, useState, useRef } from 'react';
import api from '../../config/axios';
import config from '../../config/environment';
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CRow, CCol, CAlert, CBadge, CSpinner, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CFormInput
} from '@coreui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { cilEnvelopeClosed, cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext'

const InvoiceDetail = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [company, setCompany] = useState({});
  const [siteSettings, setSiteSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const printRef = useRef();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  // Email functionality
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
    setLoading(true);
    api.get(`/sales/${id}`)
      .then(res => setInvoice(res.data))
      .catch(() => toast.error('Failed to load performance.'))
      .finally(() => setLoading(false));
    
    api.get('/settings')
      .then(res => {
        if (res.data.billing) {
          setCompany(res.data.billing);
        }
        if (res.data.siteSettings) {
          setSiteSettings(res.data.siteSettings);
        }
      })
      .catch(() => console.log('Failed to load settings'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open('', '', 'height=700,width=900');
    win.document.write('<html><head><title>Performance</title>');
    win.document.write('<style>body{font-family:sans-serif;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ccc;padding:8px;} .text-end{text-align:right;} .text-center{text-align:center;} .no-border{border:none;}</style>');
    win.document.write('</head><body >');
    win.document.write(printContents);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  const handlePrintPDF = async () => {
    try {
      setPdfLoading(true);
      const response = await api.get(`/sales/${invoice.id}/export-pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = function () {
          printWindow.focus();
          printWindow.print();
        };
      }
    } catch (error) {
      toast.error('Failed to open print dialog. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePrintShortPDF = async () => {
    try {
      setPdfLoading(true);
      const response = await api.get(`/sales/${invoice.id}/export-short-pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = function () {
          printWindow.focus();
          printWindow.print();
        };
      }
    } catch (error) {
      toast.error('Failed to open print dialog. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setPdfLoading(true);
      // Use the API call with proper authentication
      const response = await api.get(`/sales/${invoice.id}/export-pdf`, {
        responseType: 'blob', // Important for file downloads
      });
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Performance-${invoice.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setPdfLoading(false);
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
    setEmailForm({ email: invoice?.customer?.email || '' });
    setEmailModal(true);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    setEmailLoading(true);
    setFileErrors([]);
    const formData = new FormData();
    formData.append('invoice_id', invoice.id);
    formData.append('email', emailForm.email);
    if (attachmentEnabled && files.length) {
      files.forEach(file => formData.append('attachments[]', file));
    }
    api.post('/emails/send-invoice', formData, {
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

  if (!(hasPermission && hasPermission('view_sale'))) {
    return (
      <CCard className="mt-4 shadow-sm">
        <CCardBody>
          <CAlert color="danger">You do not have permission to view this performance.</CAlert>
        </CCardBody>
      </CCard>
    );
  }

  if (loading) return <div className="text-center my-4"><span>Loading...</span></div>;
  if (!invoice) return <CAlert color="danger">Performance not found.</CAlert>;

  return (
    <>
      <CButton color="secondary" className="mb-3" onClick={() => navigate('/sales/invoices')}>
        &larr; Performance List
      </CButton>
      <CCard className="mt-4 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>PROFORMA #{invoice.id}</strong>
          <div className="d-flex gap-2">
            {hasPermission('edit_sale') && (
              <CButton 
                color="warning" 
                variant="outline"
                onClick={() => navigate(`/sales/pos-new/edit/${invoice.id}`)}
              >
                <CIcon icon={cilPencil} className="me-2" />
                Edit Sale
              </CButton>
            )}
            {hasPermission('edit_sale') && (
              <>
                <CButton 
                  color="primary" 
                  variant="outline"
                  onClick={openEmailModal}
                >
                  <CIcon icon={cilEnvelopeClosed} className="me-2" />
                  Email Performance
                </CButton>
              </>
            )}
            {hasPermission('edit_sale') && (
              <CButton color="primary" onClick={handlePrintShortPDF} disabled={pdfLoading}>
                {pdfLoading ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Printing...
                  </>
                ) : (
                  'Print (Short)'
                )}
              </CButton>
            )}
            {hasPermission('edit_sale') && (
              <CButton color="primary" onClick={handlePrintPDF} disabled={pdfLoading}>
                {pdfLoading ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Printing...
                  </>
                ) : (
                  'Print'
                )}
              </CButton>
            )}
            {/* <CButton 
              color="success" 
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
            >
              {pdfLoading ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Downloading...
                </>
              ) : (
                'Download PDF'
              )}
            </CButton> */}
          </div>
        </CCardHeader>
        <CCardBody>
          {alert && <CAlert color={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</CAlert>}
          <div ref={printRef}>
            <CRow className="mb-4">
              <CCol md={6}>
                <div className="border rounded p-3 bg-light">
                  <h6 className="mb-2"><strong>Company Information</strong></h6>
                  {siteSettings.show_company_info_on_invoice === '1' && (
                    <>
                      <div><strong>{company.company_name || 'Company Name'}</strong></div>
                      {company.address && <div>{company.address}</div>}
                      {company.email && <div>Email: {company.email}</div>}
                      {company.phone && <div>Phone: {company.phone}</div>}
                    </>
                  )}
                  <div className="mt-2">PROFORMA: <strong>{invoice.invoice_ref}</strong></div>
                  <div>Date: {invoice.created_at?.slice(0, 10)}</div>
                </div>
              </CCol>
              <CCol md={6}>
                <div className="border rounded p-3 bg-light">
                  <h6 className="mb-2"><strong>Customer Information</strong></h6>
                  <div><strong>Name:</strong> {invoice.customer?.name || 'Walk-in Customer'}</div>
                  {invoice.customer && (
                    <>
                      <div><strong>Type:</strong> {invoice.customer.type || '-'}</div>
                      <div><strong>Mobile:</strong> {invoice.customer.phone || '-'}</div>
                      {invoice.customer.email && <div><strong>Email:</strong> {invoice.customer.email}</div>}
                      {invoice.customer.address && <div><strong>Address:</strong> {invoice.customer.address}</div>}
                    </>
                  )}
                </div>
              </CCol>
            </CRow>
            <CTable className="mb-4" bordered>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell className="text-center">#</CTableHeaderCell>
                  <CTableHeaderCell className="text-start">Product</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Qty</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Price</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Discount</CTableHeaderCell>
                  {siteSettings.hide_vat_from_everywhere !== '1' && (
                    <CTableHeaderCell className="text-end">VAT</CTableHeaderCell>
                  )}
                  <CTableHeaderCell className="text-end">Subtotal</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {invoice.items.map((item, idx) => (
                  <CTableRow key={item.id}>
                    <CTableDataCell className="text-center">{idx + 1}</CTableDataCell>
                    <CTableDataCell className="text-start">{item.product?.name || '-'}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.qty}</CTableDataCell>
                    <CTableDataCell className="text-end">£{item.price}</CTableDataCell>
                    <CTableDataCell className="text-end">{item.discount ? `£${item.discount}` : '-'}</CTableDataCell>
                    {siteSettings.hide_vat_from_everywhere !== '1' && (
                      <CTableDataCell className="text-end">{item.tax ? `£${item.tax}` : '-'}</CTableDataCell>
                    )}
                    <CTableDataCell className="text-end">£{item.subtotal}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <div className="mb-3">
              <strong>Total Items:</strong> {invoice.items.length} &nbsp; | &nbsp; 
              <strong>Total Qty:</strong> {invoice.items.reduce((sum, item) => sum + Number(item.qty), 0)}
            </div>
            <CRow className="mb-3">
              <CCol md={6}>
                {invoice.sales_transactions && invoice.sales_transactions.length > 0 && (
                  <div>
                    <div className="fw-bold mb-2">Payment Breakdown:</div>
                    <ul className="list-unstyled mb-0">
                      {invoice.sales_transactions.map((txn, idx) => (
                        <li key={idx} className="d-flex align-items-center mb-2">
                          <CBadge color="primary" className="me-2 text-uppercase">{txn.payment_type}</CBadge>
                          <span className="fw-bold me-2">£{Number(txn.amount).toFixed(2)}</span>
                          <span className="text-muted small">{txn.description || '-'}</span>
                        </li>
                      ))}
                    </ul>
                    {invoice.wallet_transactions && invoice.wallet_transactions.length > 0 && (
                      <div className="mt-2">
                        <strong>Wallet Txn:</strong> -£
                        {invoice.wallet_transactions.map(wt => Number(wt.amount).toFixed(2)).join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </CCol>
              <CCol md={6} className="text-end">
                <div>Subtotal: <strong>£{Number(invoice.subtotal).toFixed(2)}</strong></div>
                <div>Total Discount: <strong>£{Number(invoice.total_discount).toFixed(2)}</strong></div>
                {siteSettings.hide_vat_from_everywhere !== '1' && (
                  <div>Total VAT: <strong>£{Number(invoice.total_tax).toFixed(2)}</strong></div>
                )}
                <div>Grand Total: <strong>£{Number(invoice.grand_total).toFixed(2)}</strong></div>
                <div>Round Off: <strong>{Number(invoice.round_off) > 0 ? '+' : ''}{Number(invoice.round_off).toFixed(2)}</strong></div>
                <div>Final Payable: <strong>£{Number(invoice.rounded_total).toFixed(2)}</strong></div>
                {/* <div>Paid: <strong>£{Number(invoice.paid).toFixed(2)}</strong></div> */}
                {/* <div>Due: <strong>£{Number(invoice.due).toFixed(2)}</strong></div> */}
              </CCol>
            </CRow>
            <div className="mt-4 text-center">
              <div>{siteSettings.invoice_footer_text || 'Thank you for your business!'}</div>
              <div className="mt-2">Signature: ____________________</div>
            </div>
          </div>
        </CCardBody>
      </CCard>

      {/* Email Modal */}
      {hasPermission('edit_sale') && (
        <CModal 
          visible={emailModal} 
          onClose={() => setEmailModal(false)}
          size="lg"
        >
          <CModalHeader>
            <CModalTitle>
              Send Performance Email
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
      )}
    </>
  );
};

export default InvoiceDetail; 