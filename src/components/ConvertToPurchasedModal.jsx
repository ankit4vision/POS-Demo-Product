import React, { useState } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CAlert,
  CSpinner,
  CListGroup,
  CListGroupItem,
} from '@coreui/react';
import { cilWarning, cilCheckCircle } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import api from '../config/axios';

const ConvertToPurchasedModal = ({ visible, onClose, onSuccess, purchaseOrder }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Don't render if no purchase order or no items
  if (!purchaseOrder || !purchaseOrder.items || !Array.isArray(purchaseOrder.items)) {
    return null;
  }

  const handleConvert = async () => {
    try {
      setLoading(true);
      setError(null);

      await api.post(`/purchase-orders/${purchaseOrder.id}/convert-to-purchased`);

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to convert purchase order');
      console.error('Error converting purchase order:', err);
    } finally {
      setLoading(false);
    }
  };

  const getItemsSummary = () => {
    // Ensure items is always an array
    if (!purchaseOrder?.items || !Array.isArray(purchaseOrder.items)) {
      return [];
    }
    
    return purchaseOrder.items.map(item => ({
      name: item.product?.name,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));
  };

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>
          <CIcon icon={cilWarning} className="me-2 text-warning" />
          Convert to Purchased
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && (
          <CAlert color="danger" className="mb-3">
            {error}
          </CAlert>
        )}

        <div className="mb-4">
          <CAlert color="warning">
            <h6>⚠️ Important Warning</h6>
            <p className="mb-2">
              Are you sure you want to convert this purchase order to purchased?
            </p>
            <ul className="mb-0">
              <li><strong>{purchaseOrder?.items?.length || 0} items</strong> will have their stock adjusted in your products</li>
              <li>In the future, you will <strong>not be able to edit</strong> this purchase order</li>
              <li>Yes, you can still handle payments after conversion</li>
            </ul>
          </CAlert>
        </div>

        <div className="mb-3">
          <h6>Purchase Order Details:</h6>
          <div className="row">
            <div className="col-md-6">
              <strong>PO Number:</strong> {purchaseOrder.po_number}
            </div>
            <div className="col-md-6">
              <strong>Supplier:</strong> {purchaseOrder.supplier?.name}
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-6">
              <strong>Total Amount:</strong> £{parseFloat(purchaseOrder.total_amount)}
            </div>
            <div className="col-md-6">
              <strong>Items:</strong> {purchaseOrder?.items?.length || 0}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <h6>Items that will be received:</h6>
          <CListGroup>
            {getItemsSummary().map((item, index) => (
              <CListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{item.name}</strong>
                  <br />
                  <small className="text-muted">Unit Price: £{parseFloat(item.unit_price)}</small>
                </div>
                <div className="text-end">
                  <strong>Qty: {item.quantity}</strong>
                  <br />
                  <small className="text-muted">Total: £{parseFloat(item.quantity * item.unit_price)}</small>
                </div>
              </CListGroupItem>
            ))}
          </CListGroup>
        </div>

        <div className="alert alert-info">
          <small>
            <strong>What will happen:</strong>
            <ul className="mb-0 mt-2">
              <li>Purchase order status will change to "Completed"</li>
              <li>All items will be marked as "Received"</li>
              <li>Product stock will be increased by the ordered quantities</li>
              <li>Product purchase prices will be updated (average calculation)</li>
              <li>Last purchase date will be updated for all products</li>
            </ul>
          </small>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton 
          color="secondary" 
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </CButton>
        <CButton 
          color="success" 
          onClick={handleConvert}
          disabled={loading}
        >
          {loading ? (
            <>
              <CSpinner size="sm" className="me-2" />
              Converting...
            </>
          ) : (
            <>
              <CIcon icon={cilCheckCircle} className="me-2" />
              Convert to Purchased
            </>
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ConvertToPurchasedModal; 