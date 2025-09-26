import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
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
  CProgress,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilTruck, cilBan, cilCheck, cilX } from '@coreui/icons';
import { formatCurrency } from '../utils/currency';

const PurchaseManagementModal = ({ 
  visible, 
  onClose, 
  purchase, 
  onReceiptUpdated,
  onCancellationSubmit,
  loading = false 
}) => {
  const [unifiedItems, setUnifiedItems] = useState([]);
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
      // Initialize unified items with both receipt and cancellation data
      const unifiedData = purchase.items?.map(item => {
        const availableForCancellation = item.quantity - (item.received_quantity || 0) - (item.cancelled_quantity || 0);
        return {
          id: item.id,
          product_name: item.product?.product_name || item.product?.name || 'Unknown Product',
          ordered_quantity: item.quantity,
          received_quantity: item.received_quantity || 0,
          cancelled_quantity: item.cancelled_quantity || 0,
          available_for_cancellation: Math.max(0, availableForCancellation),
          unit_price: item.unit_price,
          // New editable fields
          new_received_quantity: item.received_quantity || 0,
          new_cancelled_quantity: 0,
          can_cancel: availableForCancellation > 0
        };
      }) || [];
      
      setUnifiedItems(unifiedData);
      setErrors({});
    }
  }, [visible, purchase]);

  // Receipt Management Functions
  const handleReceivedQuantityChange = (itemId, value) => {
    let newValue = parseInt(value) || 0;
    newValue = Math.max(0, newValue);
    
    const item = unifiedItems.find(item => item.id === itemId);
    if (item) {
      newValue = Math.min(newValue, item.ordered_quantity);
    }
    
    setUnifiedItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          new_received_quantity: newValue
        }
      }
      return item
    }));
  };

  // Cancellation Functions
  const handleCancelledQuantityChange = (itemId, value) => {
    const newValue = parseInt(value) || 0;
    
    setUnifiedItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const maxCancellable = item.ordered_quantity - item.new_received_quantity - item.cancelled_quantity;
        return {
          ...item,
          new_cancelled_quantity: Math.min(Math.max(0, newValue), maxCancellable)
        };
      }
      return item;
    }));
  };

  const handleCancelQtyFocus = (itemId) => {
    console.log('Cancel Qty focus triggered for item:', itemId);
    const item = unifiedItems.find(item => item.id === itemId);
    if (item) {
      // Calculate remaining quantity: Ordered - Received - Already Cancelled - New Received - New Cancelled
      const remainingQty = Math.max(0, 
        item.ordered_quantity - 
        item.received_quantity - 
        item.cancelled_quantity - 
        item.new_received_quantity - 
        item.new_cancelled_quantity
      );
      
      console.log('Calculated remaining quantity:', remainingQty, 'for item:', item.product_name);
      
      if (remainingQty > 0) {
        console.log('Auto-filling cancel qty with:', remainingQty);
        setUnifiedItems(prev => prev.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              new_cancelled_quantity: remainingQty
            };
          }
          return item;
        }));
      }
    }
  };

  // Quick Actions
  const handleMarkAllAsReceived = () => {
    setUnifiedItems(prev => prev.map(item => ({
      ...item,
      new_received_quantity: item.ordered_quantity,
      new_cancelled_quantity: 0
    })));
  };

  const handleResetAll = () => {
    setUnifiedItems(prev => prev.map(item => ({
      ...item,
      new_received_quantity: 0,
      new_cancelled_quantity: 0
    })));
  };

  // Validation Functions
  const validateForm = () => {
    const newErrors = {};
    let hasErrors = false;

    unifiedItems.forEach(item => {
      // Check if received quantity exceeds ordered quantity
      if (item.new_received_quantity > item.ordered_quantity) {
        newErrors[`received_${item.id}`] = 'Received quantity cannot exceed ordered quantity';
        hasErrors = true;
      }

      // Check if cancelled quantity exceeds available quantity
      const maxCancellable = item.ordered_quantity - item.new_received_quantity - item.cancelled_quantity;
      if (item.new_cancelled_quantity > maxCancellable) {
        newErrors[`cancelled_${item.id}`] = `Cannot cancel more than ${maxCancellable} units`;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  // Submit Functions
  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Prepare receipt data
    const receiptData = unifiedItems.map(item => ({
      id: item.id,
      received_quantity: item.new_received_quantity
    }));

    // Prepare cancellation data
    const cancellationData = unifiedItems
      .filter(item => item.new_cancelled_quantity > 0)
      .map(item => ({
        id: item.id,
        cancelled_quantity: item.new_cancelled_quantity
      }));

    try {
      // Submit receipt updates first
      if (receiptData.some(item => item.received_quantity !== (unifiedItems.find(u => u.id === item.id)?.received_quantity || 0))) {
        await onReceiptUpdated(receiptData);
      }

      // Submit cancellation updates
      if (cancellationData.length > 0) {
        await onCancellationSubmit(cancellationData);
      }

      // Close modal
      onClose();
    } catch (error) {
      console.error('Error submitting updates:', error);
    }
  };

  // Helper Functions
  const getReceiptProgress = () => {
    if (!unifiedItems.length) return 0;
    const totalOrdered = unifiedItems.reduce((sum, item) => sum + item.ordered_quantity, 0);
    const totalReceived = unifiedItems.reduce((sum, item) => sum + item.new_received_quantity, 0);
    return totalOrdered > 0 ? Math.round((totalReceived / totalOrdered) * 100) : 0;
  };

  const getOverallStatus = () => {
    if (!unifiedItems.length) return 'pending';
    
    const receivedItems = unifiedItems.filter(item => item.new_received_quantity >= item.ordered_quantity).length;
    const partiallyProcessedItems = unifiedItems.filter(item => 
      (item.new_received_quantity > 0 || item.new_cancelled_quantity > 0) && 
      (item.new_received_quantity + item.new_cancelled_quantity) < item.ordered_quantity
    ).length;

    if (receivedItems === unifiedItems.length) return 'received';
    if (receivedItems > 0 || partiallyProcessedItems > 0) return 'partially_received';
    return 'pending';
  };

  const getTotalReceivedValue = () => {
    return unifiedItems.reduce((sum, item) => {
      return sum + (item.new_received_quantity * item.unit_price);
    }, 0);
  };

  const getTotalCancelledValue = () => {
    return unifiedItems.reduce((sum, item) => {
      return sum + (item.new_cancelled_quantity * item.unit_price);
    }, 0);
  };

  const getRemainingQuantity = (item) => {
    return Math.max(0, item.ordered_quantity - item.new_received_quantity - item.cancelled_quantity - item.new_cancelled_quantity);
  };

  const getItemStatus = (item) => {
    const totalProcessed = item.new_received_quantity + item.cancelled_quantity + item.new_cancelled_quantity;
    if (totalProcessed === 0) return 'pending';
    if (totalProcessed >= item.ordered_quantity) return 'received';
    return 'partially_received';
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: 'warning', text: 'Pending' },
      partially_received: { color: 'info', text: 'Partial' },
      received: { color: 'success', text: 'Received' }
    };
    const badgeConfig = config[status] || { color: 'secondary', text: status };
    
    return <CBadge color={badgeConfig.color}>{badgeConfig.text}</CBadge>;
  };

  if (!purchase) return null;

  const receiptProgress = getReceiptProgress();
  const overallStatus = getOverallStatus();

  return (
    <CModal visible={visible} onClose={onClose} size="xl">
      <CModalHeader onClose={onClose}>
        <CModalTitle>
          <CIcon icon={cilTruck} className="me-2" />
          Purchase Management - {purchase.reference_number}
        </CModalTitle>
      </CModalHeader>
      
      <CModalBody>
        {/* Error Alerts */}
        {Object.keys(errors).length > 0 && (
          <CAlert color="danger" className="mb-3">
            <strong>Validation Errors:</strong>
            <ul className="mb-0 mt-2">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </CAlert>
        )}

        <CAlert color="info" className="mb-3">
          <strong>Unified Purchase Management:</strong> Update received quantities and cancel items in a single interface. 
          Received items will be added to your inventory, and cancelled items will be excluded from payment calculations.
        </CAlert>

        {/* Progress Overview */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Overall Progress</h6>
            <CBadge color={overallStatus === 'received' ? 'success' : 
                          overallStatus === 'partially_received' ? 'info' : 'warning'}>
              {overallStatus.replace('_', ' ').toUpperCase()}
            </CBadge>
          </div>
          <CProgress 
            value={receiptProgress} 
            color={receiptProgress === 100 ? 'success' : receiptProgress > 0 ? 'info' : 'warning'}
            className="mb-2"
          />
          <small className="text-muted">
            {receiptProgress}% Complete ({unifiedItems.reduce((sum, item) => sum + item.new_received_quantity, 0)} of {unifiedItems.reduce((sum, item) => sum + item.ordered_quantity, 0)} items received)
          </small>
        </div>

        {/* Unified Items Table */}
        <div className="table-responsive">
          <CTable hover bordered>
            <CTableHead className="table-dark">
              <CTableRow>
                <CTableHeaderCell>Product</CTableHeaderCell>
                <CTableHeaderCell>Ordered Qty</CTableHeaderCell>
                <CTableHeaderCell>Received Qty</CTableHeaderCell>
                <CTableHeaderCell>Already Cancelled</CTableHeaderCell>
                <CTableHeaderCell>Cancel Qty</CTableHeaderCell>
                <CTableHeaderCell>Remaining</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Unit Price</CTableHeaderCell>
                <CTableHeaderCell>Received Value</CTableHeaderCell>
                <CTableHeaderCell>Cancelled Value</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {unifiedItems.map((item) => {
                const remainingQty = getRemainingQuantity(item);
                const itemStatus = getItemStatus(item);
                const maxCancellable = item.ordered_quantity - item.new_received_quantity - item.cancelled_quantity;
                
                return (
                  <CTableRow key={item.id}>
                    <CTableDataCell>
                      <strong>{item.product_name}</strong>
                    </CTableDataCell>
                    <CTableDataCell>
                      <span className="badge bg-secondary">{item.ordered_quantity}</span>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormInput
                        type="number"
                        min="0"
                        max={item.ordered_quantity}
                        step="1"
                        placeholder={`0-${item.ordered_quantity}`}
                        value={item.new_received_quantity}
                        onChange={(e) => handleReceivedQuantityChange(item.id, e.target.value)}
                        className={`w-75 ${errors[`received_${item.id}`] ? 'border-danger' : ''}`}
                        title={`Maximum allowed: ${item.ordered_quantity}`}
                      />
                      {errors[`received_${item.id}`] && (
                        <small className="text-danger d-block mt-1">{errors[`received_${item.id}`]}</small>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <span className="badge bg-secondary">{item.cancelled_quantity}</span>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormInput
                        type="number"
                        min="0"
                        max={maxCancellable}
                        step="1"
                        value={item.new_cancelled_quantity}
                        onChange={(e) => handleCancelledQuantityChange(item.id, e.target.value)}
                        className={`w-75 ${errors[`cancelled_${item.id}`] ? 'border-danger' : ''}`}
                        disabled={maxCancellable <= 0}
                        title={`Click to auto-fill with remaining quantity (${maxCancellable})`}
                        onFocus={(e) => handleCancelQtyFocus(item.id)}
                        placeholder={maxCancellable > 0 ? `${maxCancellable}` : '0'}
                      />
                      {errors[`cancelled_${item.id}`] && (
                        <small className="text-danger d-block mt-1">{errors[`cancelled_${item.id}`]}</small>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <span className={`badge ${remainingQty > 0 ? 'bg-warning' : 'bg-success'}`}>
                        {remainingQty}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>
                      {getStatusBadge(itemStatus)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {formatCurrency(item.unit_price)}
                    </CTableDataCell>
                    <CTableDataCell>
                      <strong>{formatCurrency(item.new_received_quantity * item.unit_price)}</strong>
                    </CTableDataCell>
                    <CTableDataCell>
                      <strong className="text-danger">{formatCurrency(item.new_cancelled_quantity * item.unit_price)}</strong>
                    </CTableDataCell>
                  </CTableRow>
                );
              })}
            </CTableBody>
          </CTable>
        </div>

        {/* Summary */}
        <div className="mt-3 p-3 bg-light rounded">
          <div className="row">
            <div className="col-md-3">
              <strong>Total Ordered Value:</strong> {formatCurrency(unifiedItems.reduce((sum, item) => sum + (item.ordered_quantity * item.unit_price), 0))}
            </div>
            <div className="col-md-3">
              <strong>Total Received Value:</strong> {formatCurrency(getTotalReceivedValue())}
            </div>
            <div className="col-md-3">
              <strong>Total Cancelled Value:</strong> {formatCurrency(getTotalCancelledValue())}
            </div>
            <div className="col-md-3">
              <strong>Items to Process:</strong> {unifiedItems.filter(item => item.new_received_quantity > 0 || item.new_cancelled_quantity > 0).length}
            </div>
          </div>
        </div>
      </CModalBody>

      <CModalFooter>
        <div className="d-flex gap-2 me-auto">
          <CButton
            color="success"
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsReceived}
            disabled={loading}
          >
            <CIcon icon={cilCheck} className="me-1" />
            Mark All Received
          </CButton>
          <CButton
            color="warning"
            variant="outline"
            size="sm"
            onClick={handleResetAll}
            disabled={loading}
          >
            <CIcon icon={cilX} className="me-1" />
            Reset All
          </CButton>
        </div>
        
        <CButton color="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </CButton>
        
        <CButton
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <CSpinner size="sm" className="me-2" />
              Saving...
            </>
          ) : (
            <>
              <CIcon icon={cilSave} className="me-2" />
              Save Changes
            </>
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default PurchaseManagementModal; 