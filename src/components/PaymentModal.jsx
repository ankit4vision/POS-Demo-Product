import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
  CAlert,
  CSpinner,
  CRow,
  CCol,
  CInputGroup,
} from '@coreui/react';
import { cilSave, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import api from '../config/axios';

const PaymentModal = ({ 
  visible, 
  onClose, 
  onSuccess, 
  purchaseOrderId, 
  supplierId, 
  totalAmount, 
  paidAmount = 0,
  title = "Make Payment",
  transaction = null,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    payment_method: 'cash',
    status: 'completed',
    reference_number: '',
    notes: '',
    payment_date: new Date().toISOString().split('T')[0],
  });

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentStatuses, setPaymentStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const remainingAmount = totalAmount - paidAmount;

  useEffect(() => {
    if (visible) {
      fetchPaymentData();
      
      if (isEditing && transaction) {
        // Populate form with existing transaction data
        setFormData({
          amount: transaction.amount.toString(),
          payment_method: transaction.payment_method,
          status: transaction.status,
          reference_number: transaction.reference_number || '',
          notes: transaction.notes || '',
          payment_date: transaction.payment_date,
        });
      } else {
        // Set default amount to remaining amount for new payments
        setFormData(prev => ({
          ...prev,
          amount: remainingAmount > 0 ? remainingAmount.toString() : ''
        }));
      }
    }
  }, [visible, remainingAmount, isEditing, transaction]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const [methodsResponse, statusesResponse] = await Promise.all([
        api.get('/purchase-transactions/methods'),
        api.get('/purchase-transactions/statuses')
      ]);
      
      console.log('Methods response:', methodsResponse.data);
      console.log('Statuses response:', statusesResponse.data);
      
      // Ensure we have arrays, fallback to empty arrays if not
      const methods = methodsResponse.data?.data || [];
      const statuses = statusesResponse.data?.data || [];
      
      console.log('Processed methods:', methods);
      console.log('Processed statuses:', statuses);
      
      setPaymentMethods(methods);
      setPaymentStatuses(statuses);
    } catch (err) {
      console.error('Error fetching payment data:', err);
      // Set default values if API fails
      const defaultMethods = [
        { value: 'cash', label: 'Cash' },
        { value: 'bank_transfer', label: 'Bank Transfer' },
        { value: 'cheque', label: 'Cheque' },
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'upi', label: 'UPI' },
        { value: 'other', label: 'Other' },
      ];
      const defaultStatuses = [
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
        { value: 'failed', label: 'Failed' },
        { value: 'cancelled', label: 'Cancelled' },
      ];
      
      setPaymentMethods(defaultMethods);
      setPaymentStatuses(defaultStatuses);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!isEditing && parseFloat(formData.amount) > remainingAmount) {
      setError('Payment amount cannot exceed remaining amount');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        purchase_order_id: purchaseOrderId,
        supplier_id: supplierId,
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method,
        status: formData.status,
        reference_number: formData.reference_number,
        notes: formData.notes,
        payment_date: formData.payment_date,
      };

      if (isEditing && transaction) {
        // Update existing transaction
        await api.put(`/purchase-transactions/${transaction.id}`, payload);
      } else {
        // Create new transaction
        await api.post('/purchase-transactions', payload);
      }

      // Reset form
      setFormData({
        amount: '',
        payment_method: 'cash',
        status: 'completed',
        reference_number: '',
        notes: '',
        payment_date: new Date().toISOString().split('T')[0],
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process payment');
      console.error('Error processing payment:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      amount: '',
      payment_method: 'cash',
      status: 'completed',
      reference_number: '',
      notes: '',
      payment_date: new Date().toISOString().split('T')[0],
    });
    setError(null);
    onClose();
  };

  if (loading) {
    return (
      <CModal visible={visible} onClose={handleClose} size="lg">
        <CModalHeader>
          <CModalTitle>{title}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
            <CSpinner />
          </div>
        </CModalBody>
      </CModal>
    );
  }

  return (
    <CModal visible={visible} onClose={handleClose} size="lg">
      <CModalHeader>
        <CModalTitle>
          {isEditing ? 'Edit Payment' : 'Add Payment'}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && (
          <CAlert color="danger" className="mb-3">
            {error}
          </CAlert>
        )}

        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Total Amount</CFormLabel>
              <CInputGroup>
                <CFormInput
                  value={`£${totalAmount}`}
                  disabled
                  className="bg-light"
                />
              </CInputGroup>
            </CCol>
            <CCol md={6}>
              <CFormLabel>Paid Amount</CFormLabel>
              <CInputGroup>
                <CFormInput
                  value={`£${paidAmount.toFixed(2)}`}
                  disabled
                  className="bg-light"
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Remaining Amount</CFormLabel>
              <CInputGroup>
                <CFormInput
                  value={`£${remainingAmount.toFixed(2)}`}
                  disabled
                  className="bg-light"
                />
              </CInputGroup>
            </CCol>
            <CCol md={6}>
              <CFormLabel>Payment Amount *</CFormLabel>
              <CFormInput
                type="number"
                step="0.01"
                min="0.01"
                max={remainingAmount}
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="Enter payment amount"
                required
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Payment Method *</CFormLabel>
              <CFormSelect
                value={formData.payment_method}
                onChange={(e) => handleInputChange('payment_method', e.target.value)}
                required
              >
                {Array.isArray(paymentMethods) && paymentMethods.length > 0 ? (
                  paymentMethods.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="upi">UPI</option>
                    <option value="other">Other</option>
                  </>
                )}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormLabel>Payment Status *</CFormLabel>
              <CFormSelect
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                required
              >
                {Array.isArray(paymentStatuses) && paymentStatuses.length > 0 ? (
                  paymentStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </>
                )}
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Payment Date *</CFormLabel>
              <CFormInput
                type="date"
                value={formData.payment_date}
                onChange={(e) => handleInputChange('payment_date', e.target.value)}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Reference Number</CFormLabel>
              <CFormInput
                value={formData.reference_number}
                onChange={(e) => handleInputChange('reference_number', e.target.value)}
                placeholder="Cheque number, transaction ID, etc."
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol>
              <CFormLabel>Notes</CFormLabel>
              <CFormTextarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                placeholder="Additional payment notes..."
              />
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton 
          color="secondary" 
          onClick={handleClose}
          disabled={saving}
        >
          <CIcon icon={cilX} className="me-2" />
          Cancel
        </CButton>
        <CButton
          color="primary"
          disabled={saving}
          className="me-2"
          onClick={handleSubmit}
        >
          {saving ? (
            <>
              <CSpinner size="sm" className="me-2" />
              {isEditing ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            isEditing ? 'Update Payment' : 'Add Payment'
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default PaymentModal; 