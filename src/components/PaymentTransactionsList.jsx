import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CSpinner,
  CAlert,
  CButton,
  CButtonGroup,
} from '@coreui/react';
import { cilTrash, cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import PaymentModal from './PaymentModal';
import api from '../config/axios';

const PaymentTransactionsList = ({ purchaseOrderId, onTransactionUpdate, supplierId, totalAmount, paidAmount }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    if (purchaseOrderId) {
      fetchTransactions();
    }
  }, [purchaseOrderId]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/purchase-orders/${purchaseOrderId}/transactions`);
      setTransactions(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch payment transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowPaymentModal(true);
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this payment transaction?')) {
      try {
        await api.delete(`/purchase-transactions/${transactionId}`);
        fetchTransactions();
        if (onTransactionUpdate) {
          onTransactionUpdate();
        }
      } catch (err) {
        console.error('Error deleting transaction:', err);
      }
    }
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    setSelectedTransaction(null);
  };

  const handlePaymentSuccess = () => {
    fetchTransactions();
    if (onTransactionUpdate) {
      onTransactionUpdate();
    }
  };

  const getStatusBadge = (status) => {
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
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <CSpinner />
      </div>
    );
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <h5 className="mb-0">Payment Transactions</h5>
        </CCardHeader>
        <CCardBody>
          {error && (
            <CAlert color="danger" className="mb-3">
              {error}
            </CAlert>
          )}

          {transactions.length === 0 ? (
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
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {transactions.map((transaction) => (
                  <CTableRow key={transaction.id}>
                    <CTableDataCell>
                      {new Date(transaction.payment_date).toLocaleDateString()}
                    </CTableDataCell>
                    <CTableDataCell>
                      <strong>£{parseFloat(transaction.amount).toFixed(2)}</strong>
                    </CTableDataCell>
                    <CTableDataCell>
                      {getPaymentMethodBadge(transaction.payment_method)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {getStatusBadge(transaction.status)}
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
                    <CTableDataCell>
                      <CButtonGroup size="sm">
                        <CButton
                          color="primary"
                          variant="outline"
                          onClick={() => handleEdit(transaction)}
                          title="Edit Transaction"
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          color="danger"
                          variant="outline"
                          onClick={() => handleDelete(transaction.id)}
                          title="Delete Transaction"
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
        </CCardBody>
      </CCard>

      {/* Payment Modal for Editing */}
      <PaymentModal
        visible={showPaymentModal}
        onClose={handlePaymentModalClose}
        onSuccess={handlePaymentSuccess}
        purchaseOrderId={purchaseOrderId}
        supplierId={supplierId}
        totalAmount={totalAmount}
        paidAmount={paidAmount}
        transaction={selectedTransaction}
        isEditing={!!selectedTransaction}
      />
    </>
  );
};

export default PaymentTransactionsList; 