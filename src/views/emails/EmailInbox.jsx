import React, { useState, useEffect } from 'react';
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
  CListGroup,
  CListGroupItem,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react';
import { 
  cilSearch, 
  cilTrash, 
  cilReload, 
  cilEnvelopeClosed,
  cilCheckCircle,
  cilXCircle,
  cilCalendar
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import api from '../../config/axios';
import { toast } from 'react-hot-toast';

const EmailInbox = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState('sent_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmails, setTotalEmails] = useState(0);
  const [totalSent, setTotalSent] = useState(0);
  const [totalFailed, setTotalFailed] = useState(0);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailDetailModal, setEmailDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Email type options
  const emailTypes = [
    { value: '', label: 'All Types' },
    { value: 'invoice', label: 'Invoice' },
    { value: 'wallet_ledger', label: 'Wallet Ledger' },
    { value: 'supplier_details', label: 'Supplier Details' },
    { value: 'purchase_order', label: 'Purchase Order' }
  ];

  // Status options
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'sent', label: 'Sent' },
    { value: 'failed', label: 'Failed' }
  ];

  useEffect(() => {
    fetchEmails();
  }, [currentPage, typeFilter, statusFilter, dateRange, sortBy, sortOrder]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        search: searchTerm || undefined,
        date_from: dateRange.start || undefined,
        date_to: dateRange.end || undefined
      };

      const response = await api.get('/emails/history', { params });
      setEmails(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
      setTotalEmails(response.data.total || 0);
      setTotalSent(response.data.total_sent || 0);
      setTotalFailed(response.data.total_failed || 0);
      setError(null);
    } catch (err) {
      setError('Failed to fetch emails');
      console.error('Error fetching emails:', err);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchEmails();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setStatusFilter('');
    setDateRange({ start: '', end: '' });
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      sent: { color: 'success', text: 'Sent', icon: cilCheckCircle },
      failed: { color: 'danger', text: 'Failed', icon: cilXCircle },
    };

    const config = statusConfig[status] || { color: 'secondary', text: status, icon: cilEnvelopeClosed };
    return (
      <CBadge color={config.color}>
        <CIcon icon={config.icon} className="me-1" />
        {config.text}
      </CBadge>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      invoice: { color: 'primary', text: 'Invoice' },
      wallet_ledger: { color: 'info', text: 'Wallet Ledger' },
      supplier_details: { color: 'warning', text: 'Supplier Details' },
      purchase_order: { color: 'success', text: 'Purchase Order' },
    };

    const config = typeConfig[type] || { color: 'secondary', text: type };
    return <CBadge color={config.color}>{config.text}</CBadge>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  const viewEmailDetail = (email) => {
    setSelectedEmail(email);
    setEmailDetailModal(true);
  };

  const deleteEmail = async (emailId) => {
    if (window.confirm('Are you sure you want to delete this email record?')) {
      try {
        await api.delete(`/emails/${emailId}`);
        toast.success('Email record deleted successfully');
        fetchEmails();
      } catch (err) {
        toast.error('Failed to delete email record');
        console.error('Error deleting email:', err);
      }
    }
  };

  const resendEmail = async (email) => {
    try {
      // This would need to be implemented in the backend
      await api.post(`/emails/${email.id}/resend`);
      toast.success('Email resent successfully');
      fetchEmails();
    } catch (err) {
      toast.error('Failed to resend email');
      console.error('Error resending email:', err);
    }
  };

  const getSummaryStats = () => {
    const stats = {
      all: { count: totalEmails, color: 'primary' },
      sent: { count: totalSent, color: 'success' },
      failed: { count: totalFailed, color: 'danger' }
    };

    return stats;
  };

  const summaryStats = getSummaryStats();

  if (loading && emails.length === 0) {
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
              <h3 className={`text-${summaryStats.all.color} mb-2`}>{summaryStats.all.count}</h3>
              <h6 className="text-muted">Total Emails</h6>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard className="text-center">
            <CCardBody>
              <h3 className={`text-${summaryStats.sent.color} mb-2`}>{summaryStats.sent.count}</h3>
              <h6 className="text-muted">Sent Successfully</h6>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard className="text-center">
            <CCardBody>
              <h3 className={`text-${summaryStats.failed.color} mb-2`}>{summaryStats.failed.count}</h3>
              <h6 className="text-muted">Failed</h6>
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
                  <h4 className="mb-0">Email Inbox</h4>
                  <p className="text-muted mb-0">Email history and management</p>
                </CCol>
                <CCol xs="auto">
                  <CButton 
                    color="primary" 
                    variant="outline"
                    onClick={fetchEmails}
                    disabled={loading}
                  >
                    <CIcon icon={cilReload} className="me-2" />
                    Refresh
                  </CButton>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              {error && (
                <CAlert color="danger" className="mb-3">
                  {error}
                </CAlert>
              )}

              {/* Search and Filters */}
              <CRow className="mb-3">
                <CCol md={3}>
                  <CInputGroup>
                    <CFormInput
                      placeholder="Search emails..."
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
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    {emailTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <CFormSelect
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <CFormInput
                    type="date"
                    placeholder="From Date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  />
                </CCol>
                <CCol md={2}>
                  <CFormInput
                    type="date"
                    placeholder="To Date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  />
                </CCol>
                <CCol md={1}>
                  <CButton 
                    color="secondary" 
                    variant="outline"
                    onClick={handleClearFilters}
                    title="Clear Filters"
                  >
                    <CIcon icon={cilSearch} />
                  </CButton>
                </CCol>
              </CRow>

              {/* Results Summary */}
              {emails.length > 0 && (
                <div className="mb-3">
                  <small className="text-muted">
                    Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalEmails)} of {totalEmails} emails
                  </small>
                </div>
              )}

              {/* Emails Table */}
              {emails.length === 0 ? (
                <CAlert color="info" className="text-center">
                  No emails found. {searchTerm || typeFilter || statusFilter || dateRange.start || dateRange.end ? 'Try adjusting your filters.' : ''}
                </CAlert>
              ) : (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>To</CTableHeaderCell>
                      <CTableHeaderCell>Subject</CTableHeaderCell>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Sent At</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {emails.map((email) => (
                      <CTableRow key={email.id}>
                        <CTableDataCell>
                          <div>
                            <strong>{email.to_email}</strong>
                            <br />
                            <small className="text-muted">From: {email.from_email}</small>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>
                            <strong>{email.subject}</strong>
                            <br />
                            <small className="text-muted">
                              {truncateText(stripHtml(email.body), 80)}
                            </small>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          {getTypeBadge(email.type)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {getStatusBadge(email.send_status)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>
                            <CIcon icon={cilCalendar} className="me-1" />
                            {formatDate(email.sent_at)}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButtonGroup size="sm">
                            <CButton
                              color="info"
                              variant="outline"
                              onClick={() => viewEmailDetail(email)}
                              title="View Details"
                            >
                              <CIcon icon={cilSearch} />
                            </CButton>
                            
                            {email.send_status === 'failed' && (
                              <CButton
                                color="warning"
                                variant="outline"
                                onClick={() => resendEmail(email)}
                                title="Resend Email"
                              >
                                <CIcon icon={cilEnvelopeClosed} />
                              </CButton>
                            )}
                            
                            <CButton
                              color="danger"
                              variant="outline"
                              onClick={() => deleteEmail(email.id)}
                              title="Delete"
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
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

      {/* Email Detail Modal */}
      <CModal
        visible={emailDetailModal}
        onClose={() => setEmailDetailModal(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Email Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedEmail && (
            <div>
              <CListGroup>
                <CListGroupItem>
                  <strong>To:</strong> {selectedEmail.to_email}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>From:</strong> {selectedEmail.from_email}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Subject:</strong> {selectedEmail.subject}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Type:</strong> {getTypeBadge(selectedEmail.type)}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Status:</strong> {getStatusBadge(selectedEmail.send_status)}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Sent At:</strong> {formatDate(selectedEmail.sent_at)}
                </CListGroupItem>
                {selectedEmail.response_message && (
                  <CListGroupItem>
                    <strong>Response:</strong> {selectedEmail.response_message}
                  </CListGroupItem>
                )}
                {selectedEmail.related_type && selectedEmail.related_id && (
                  <CListGroupItem>
                    <strong>Related Record:</strong> {selectedEmail.related_type} (ID: {selectedEmail.related_id})
                  </CListGroupItem>
                )}
              </CListGroup>
              
              <div className="mt-3">
                <strong>Email Content:</strong>
                <div 
                  className="border rounded p-3 mt-2"
                  style={{ 
                    maxHeight: '400px', 
                    overflowY: 'auto',
                    backgroundColor: '#f8f9fa'
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                />
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEmailDetailModal(false)}>
            Close
          </CButton>
          {selectedEmail?.send_status === 'failed' && (
            <CButton 
              color="warning" 
              onClick={() => {
                resendEmail(selectedEmail);
                setEmailDetailModal(false);
              }}
            >
              <CIcon icon={cilEnvelopeClosed} className="me-2" />
              Resend
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default EmailInbox; 