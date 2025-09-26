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
  CFormTextarea,
  CButton,
  CAlert,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX, cilSave, cilBan } from '@coreui/icons';
import { formatCurrency } from '../utils/currency';

const CancellationModal = ({ 
  visible, 
  onClose, 
  onSubmit, 
  purchase, 
  loading = false 
}) => {
  const [cancellationItems, setCancellationItems] = useState([]);
  const [errors, setErrors] = useState({});

  const cancellationReasons = [
    'Supplier out of stock',
    'Quality issues',
    'Price increase',
    'Delivery delay',
    'Product discontinued',
    'Order error',
    'Budget constraints',
    'Other'
  ];

  useEffect(() => {
    if (visible && purchase) {
      // Initialize cancellation items with available quantities for cancellation
      const items = purchase.items?.map(item => {
        const availableForCancellation = item.quantity - (item.received_quantity || 0) - (item.cancelled_quantity || 0);
        return {
          id: item.id,
          product_name: item.product?.product_name || item.product?.name || 'Unknown Product',
          ordered_quantity: item.quantity,
          received_quantity: item.received_quantity || 0,
          cancelled_quantity: item.cancelled_quantity || 0,
          available_for_cancellation: Math.max(0, availableForCancellation),
          unit_price: item.unit_price,
          new_cancelled_quantity: 0,
          cancellation_reason: '',
          can_cancel: availableForCancellation > 0
        };
      }).filter(item => item.can_cancel) || [];
      
      setCancellationItems(items);
      setErrors({});
    }
  }, [visible, purchase]);

  const handleCancelledQuantityChange = (itemId, value) => {
    const newValue = parseInt(value) || 0;
    
    setCancellationItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          new_cancelled_quantity: Math.min(Math.max(0, newValue), item.available_for_cancellation)
        };
      }
      return item;
    }));
  };

  const handleReasonChange = (itemId, reason) => {
    setCancellationItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          cancellation_reason: reason
        };
      }
      return item;
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let hasErrors = false;

    cancellationItems.forEach(item => {
      if (item.new_cancelled_quantity > 0 && !item.cancellation_reason.trim()) {
        newErrors[`reason_${item.id}`] = 'Cancellation reason is required';
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const itemsToCancel = cancellationItems
        .filter(item => item.new_cancelled_quantity > 0)
        .map(item => ({
          id: item.id,
          cancelled_quantity: item.new_cancelled_quantity,
          cancellation_reason: item.cancellation_reason
        }));

      if (itemsToCancel.length === 0) {
        setErrors({ general: 'Please select at least one item to cancel' });
        return;
      }

      onSubmit(itemsToCancel);
    }
  };

  const getTotalCancelledValue = () => {
    return cancellationItems.reduce((sum, item) => {
      return sum + (item.new_cancelled_quantity * item.unit_price);
    }, 0);
  };

  const getStatusBadge = (item) => {
    const totalProcessed = item.received_quantity + item.cancelled_quantity;
    if (totalProcessed === 0) {
      return <CBadge color="warning">Pending</CBadge>;
    } else if (totalProcessed >= item.ordered_quantity) {
      return <CBadge color="success">Completed</CBadge>;
    } else {
      return <CBadge color="info">Partial</CBadge>;
    }
  };

  if (!purchase) return null;

  return (
    <CModal visible={visible} onClose={onClose} size="xl">
      <CModalHeader onClose={onClose}>
        <CModalTitle>
          <CIcon icon={cilBan} className="me-2" />
          Cancel Purchase Items - {purchase.reference_number}
        </CModalTitle>
      </CModalHeader>
      
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          {errors.general && (
            <CAlert color="danger" className="mb-3">
              <strong>Error!</strong> {errors.general}
            </CAlert>
          )}

          <CAlert color="info" className="mb-3">
            <strong>Note:</strong> You can only cancel items that haven't been received yet. 
            Cancelled items will be excluded from payment calculations.
          </CAlert>

          {cancellationItems.length === 0 ? (
            <CAlert color="warning">
              No items available for cancellation. All items have been received or already cancelled.
            </CAlert>
          ) : (
            <>
              <div className="table-responsive">
                <CTable hover bordered>
                  <CTableHead className="table-dark">
                    <CTableRow>
                      <CTableHeaderCell>Product</CTableHeaderCell>
                      <CTableHeaderCell>Ordered</CTableHeaderCell>
                      <CTableHeaderCell>Received</CTableHeaderCell>
                      <CTableHeaderCell>Already Cancelled</CTableHeaderCell>
                      <CTableHeaderCell>Available to Cancel</CTableHeaderCell>
                      <CTableHeaderCell>Cancel Qty</CTableHeaderCell>
                      <CTableHeaderCell>Reason</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {cancellationItems.map((item) => (
                      <CTableRow key={item.id}>
                        <CTableDataCell>
                          <strong>{item.product_name}</strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="badge bg-secondary">{item.ordered_quantity}</span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="badge bg-success">{item.received_quantity}</span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="badge bg-danger">{item.cancelled_quantity}</span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="badge bg-warning">{item.available_for_cancellation}</span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CFormInput
                            type="number"
                            min="0"
                            max={item.available_for_cancellation}
                            step="1"
                            value={item.new_cancelled_quantity}
                            onChange={(e) => handleCancelledQuantityChange(item.id, e.target.value)}
                            className="w-75"
                            disabled={item.available_for_cancellation === 0}
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CFormTextarea
                            value={item.cancellation_reason}
                            onChange={(e) => handleReasonChange(item.id, e.target.value)}
                            placeholder="Enter cancellation reason..."
                            rows={2}
                            invalid={!!errors[`reason_${item.id}`]}
                            feedback={errors[`reason_${item.id}`]}
                            disabled={item.new_cancelled_quantity === 0}
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          {getStatusBadge(item)}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>

              {/* Summary */}
              <div className="mt-3 p-3 bg-light rounded">
                <div className="row">
                  <div className="col-md-6">
                    <strong>Total Value to Cancel:</strong> {formatCurrency(getTotalCancelledValue())}
                  </div>
                  <div className="col-md-6">
                    <strong>Items to Cancel:</strong> {cancellationItems.filter(item => item.new_cancelled_quantity > 0).length}
                  </div>
                </div>
              </div>
            </>
          )}
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </CButton>
          {cancellationItems.length > 0 && (
            <CButton 
              color="danger" 
              type="submit" 
              disabled={loading}
            >
              {loading && <CSpinner size="sm" className="me-2" />}
              <CIcon icon={cilSave} className="me-2" />
              Cancel Selected Items
            </CButton>
          )}
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default CancellationModal; 