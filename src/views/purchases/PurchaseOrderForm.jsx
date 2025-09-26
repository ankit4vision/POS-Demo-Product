import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CSpinner,
  CBadge,
  CButtonGroup,
} from '@coreui/react';
import { cilPlus, cilTrash, cilSave, cilArrowLeft, cilCreditCard, cilPrint } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../config/axios';
import PaymentModal from '../../components/PaymentModal';
import PaymentTransactionsList from '../../components/PaymentTransactionsList';
import { useAuth } from '../../context/AuthContext';

const PurchaseOrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { hasPermission } = useAuth();

  const [formData, setFormData] = useState({
    supplier_id: '',
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: '',
    status: 'draft',
    notes: '',
    reference: '',
    paid_amount: 0,
    paid_status: 'remaining',
  });

  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const canEdit = isEditing ? (hasPermission && hasPermission('edit_purchase_order')) : (hasPermission && hasPermission('create_purchase_order'));

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
    if (isEditing) {
      fetchPurchaseOrder();
    } else {
      // Set default expected delivery date to 3 days after order date for new PO
      const orderDate = new Date();
      const expectedDate = new Date(orderDate);
      expectedDate.setDate(orderDate.getDate() + 3);
      setFormData(prev => ({
        ...prev,
        order_date: orderDate.toISOString().split('T')[0],
        expected_delivery_date: expectedDate.toISOString().split('T')[0]
      }));
    }
  }, [id]);

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/purchase-orders/suppliers/list');
      setSuppliers(response.data.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/purchase-orders/products/list');
      setProducts(response.data.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchPurchaseOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/purchase-orders/${id}`);
      const po = response.data.data;
      
      setFormData({
        supplier_id: po.supplier_id,
        order_date: po.order_date ? new Date(po.order_date).toISOString().split('T')[0] : '',
        expected_delivery_date: po.expected_delivery_date ? new Date(po.expected_delivery_date).toISOString().split('T')[0] : '',
        status: po.status,
        notes: po.notes || '',
        reference: po.reference || '',
        paid_amount: po.paid_amount || 0,
        paid_status: po.paid_status || 'remaining',
      });
      
      setItems(po.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_amount: item.quantity * item.unit_price,
      })));
    } catch (err) {
      setError('Failed to fetch purchase order');
      console.error('Error fetching purchase order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };

      // If order date is changed and this is a new PO, update expected delivery date
      if (field === 'order_date' && !isEditing) {
        const orderDate = new Date(value);
        const expectedDate = new Date(orderDate);
        expectedDate.setDate(orderDate.getDate() + 3);
        newData.expected_delivery_date = expectedDate.toISOString().split('T')[0];
      }

      return newData;
    });
  };

  const addItem = () => {
    setItems(prev => [...prev, {
      product_id: '',
      quantity: 1,
      unit_price: 0,
      total_amount: 0,
    }]);
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    setItems(prev => {
      const newItems = [...prev];
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
      
      // If product is selected, auto-fill unit price with last purchase price
      if (field === 'product_id' && value) {
        const selectedProduct = products.find(p => p.id == value);
        if (selectedProduct && selectedProduct.last_purchase_price) {
          newItems[index].unit_price = selectedProduct.last_purchase_price;
        }
      }
      
      // Calculate total for this item
      const item = newItems[index];
      if (item.quantity && item.unit_price) {
        item.total_amount = item.quantity * item.unit_price;
      }
      
      return newItems;
    });
  };

  const getProductById = (productId) => {
    return products.find(p => p.id == productId);
  };

  const formatProductOption = (product) => {
    const category = product.category?.name || 'N/A';
    const unit = product.unit?.name || 'N/A';
    const lastPrice = product.last_purchase_price ? `£${product.last_purchase_price}` : 'N/A';
    
    return `${product.name} | ${category} | ${unit} | ${lastPrice}`;
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.total_amount || 0), 0);
    // Round total amount to nearest integer to match backend behavior
    const totalAmount = Math.round(subtotal);
    return { subtotal, totalAmount };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (items.length === 0) {
      setError('Please add at least one item');
      return;
    }

    if (items.some(item => !item.product_id)) {
      setError('Please select a product for all items');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...formData,
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: parseFloat(item.quantity),
          unit_price: parseFloat(item.unit_price),
          tax_percent: 0,
          discount_percent: 0,
        }))
      };

      if (isEditing) {
        await api.put(`/purchase-orders/${id}`, payload);
      } else {
        await api.post('/purchase-orders', payload);
      }

      navigate('/purchases');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save purchase order');
      console.error('Error saving purchase order:', err);
    } finally {
      setSaving(false);
    }
  };

  const { subtotal, totalAmount } = calculateTotals();

  // Helper function to check if form is editable
  const isFormEditable = () => {
    return ['draft', 'sent', 'received'].includes(formData.status);
  };

  // Helper function to check if payment is allowed
  const isPaymentAllowed = () => {
    return ['sent', 'received', 'completed'].includes(formData.status);
  };

  // Helper function to check if export is allowed
  const isExportAllowed = () => {
    return ['draft', 'sent', 'received'].includes(formData.status);
  };

  const handlePayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    // Refresh the purchase order data to get updated payment information
    if (isEditing) {
      fetchPurchaseOrder();
    }
  };

  const handleStatusChange = (newStatus) => {
    setFormData(prev => ({
      ...prev,
      status: newStatus
    }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <CSpinner />
      </div>
    );
  }

  if (!canEdit) {
    return (
      <CAlert color="danger" className="mt-4">You do not have permission to {isEditing ? 'edit' : 'create'} purchase orders.</CAlert>
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
                  <h4 className="mb-0">
                    {isEditing ? 'Edit Purchase Order' : 'New Purchase Order'}
                  </h4>
                </CCol>
                <CCol xs="auto">
                  <CButton 
                    color="secondary" 
                    variant="outline"
                    onClick={() => navigate('/purchases')}
                  >
                    <CIcon icon={cilArrowLeft} className="me-2" />
                    Back to List
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

              <CForm onSubmit={handleSubmit}>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel>Supplier *</CFormLabel>
                    <CFormSelect
                      value={formData.supplier_id}
                      onChange={(e) => handleInputChange('supplier_id', e.target.value)}
                      required
                      disabled={!isFormEditable() || !canEdit}
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel>Order Date *</CFormLabel>
                    <CFormInput
                      type="date"
                      value={formData.order_date}
                      onChange={(e) => handleInputChange('order_date', e.target.value)}
                      required
                      disabled={!isFormEditable() || !canEdit}
                    />
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel>Expected Delivery Date *</CFormLabel>
                    <CFormInput
                      type="date"
                      value={formData.expected_delivery_date}
                      onChange={(e) => handleInputChange('expected_delivery_date', e.target.value)}
                      required
                      disabled={!isFormEditable() || !canEdit}
                    />
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel>Status</CFormLabel>
                    <CFormSelect
                      value={formData.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={!isFormEditable() || !canEdit}
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="received">Received</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel>Reference</CFormLabel>
                    <CFormInput
                      value={formData.reference}
                      onChange={(e) => handleInputChange('reference', e.target.value)}
                      placeholder="PO Reference"
                      disabled={!isFormEditable() || !canEdit}
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
                      disabled={!isFormEditable() || !canEdit}
                    />
                  </CCol>
                </CRow>

                {/* Status Badge */}
                <CRow className="mb-3">
                  <CCol>
                    <CBadge 
                      color={
                        formData.status === 'draft' ? 'secondary' :
                        formData.status === 'sent' ? 'info' :
                        formData.status === 'received' ? 'warning' :
                        formData.status === 'completed' ? 'success' :
                        formData.status === 'cancelled' ? 'danger' : 'secondary'
                      }
                      className="fs-6 px-3 py-2 me-3"
                    >
                      Status: {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                    </CBadge>
                    {isEditing && (
                      <CBadge 
                        color={formData.paid_status === 'paid' ? 'success' : 'warning'}
                        className="fs-6 px-3 py-2"
                      >
                        Payment: {formData.paid_status === 'paid' ? 'Paid' : 'Remaining'}
                      </CBadge>
                    )}
                  </CCol>
                </CRow>

                {/* Payment Information */}
                {isEditing && (
                  <CRow className="mb-3">
                    <CCol md={3}>
                      <CFormLabel>Total Amount</CFormLabel>
                      <CFormInput
                        value={`£${totalAmount.toFixed(2)}`}
                        disabled
                        className="bg-light"
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>Paid Amount</CFormLabel>
                      <CFormInput
                        value={`£${parseFloat(formData.paid_amount || 0).toFixed(2)}`}
                        disabled
                        className="bg-light"
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>Remaining Amount</CFormLabel>
                      <CFormInput
                        value={`£${Math.max(0, totalAmount - parseFloat(formData.paid_amount || 0)).toFixed(2)}`}
                        disabled
                        className="bg-light"
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>Payment Status</CFormLabel>
                      <CFormInput
                        value={formData.paid_status === 'paid' ? 'Fully Paid' : 'Payment Pending'}
                        disabled
                        className={`bg-light ${formData.paid_status === 'paid' ? 'text-success' : 'text-warning'}`}
                      />
                    </CCol>
                  </CRow>
                )}

                {/* Items Section */}
                <div className="mb-4">
                  <CRow className="align-items-center mb-3">
                    <CCol>
                      <h5>Items</h5>
                    </CCol>
                    {isFormEditable() && (
                      <CCol xs="auto">
                        <CButton 
                          type="button"
                          color="success" 
                          variant="outline"
                          onClick={addItem}
                        >
                          <CIcon icon={cilPlus} className="me-2" />
                          Add Item
                        </CButton>
                      </CCol>
                    )}
                  </CRow>

                  {items.length === 0 ? (
                    <CAlert color="info">
                      No items added. {isFormEditable() ? 'Click "Add Item" to start.' : 'No items in this purchase order.'}
                    </CAlert>
                  ) : (
                    <CTable hover responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Product</CTableHeaderCell>
                          <CTableHeaderCell>Quantity</CTableHeaderCell>
                          <CTableHeaderCell>Unit Price</CTableHeaderCell>
                          <CTableHeaderCell>Total</CTableHeaderCell>
                          {isFormEditable() && <CTableHeaderCell>Actions</CTableHeaderCell>}
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {items.map((item, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>
                              <CFormSelect
                                value={item.product_id}
                                onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                                required
                                disabled={!isFormEditable() || !canEdit}
                              >
                                <option value="">Select Product</option>
                                {products
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map(product => (
                                    <option key={product.id} value={product.id}>
                                      {formatProductOption(product)}
                                    </option>
                                  ))}
                              </CFormSelect>
                            </CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                required
                                disabled={!isFormEditable() || !canEdit}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                type="number"
                                step="0.01"
                                min="0"
                                value={item.unit_price}
                                onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                required
                                disabled={!isFormEditable() || !canEdit}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              <strong>£{parseFloat(item.total_amount || 0).toFixed(2)}</strong>
                            </CTableDataCell>
                            {isFormEditable() && (
                              <CTableDataCell>
                                <CButton
                                  type="button"
                                  size="sm"
                                  color="danger"
                                  variant="outline"
                                  onClick={() => removeItem(index)}
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              </CTableDataCell>
                            )}
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  )}
                </div>

                {/* Totals Section */}
                {items.length > 0 && (
                  <CRow className="mb-4">
                    <CCol md={6} className="ms-auto">
                      <CCard>
                        <CCardBody>
                          <h6>Order Summary</h6>
                          <CRow className="mb-2">
                            <CCol>Subtotal:</CCol>
                            <CCol className="text-end">£{subtotal.toFixed(2)}</CCol>
                          </CRow>
                          <hr />
                          <CRow>
                            <CCol><strong>Total Amount:</strong></CCol>
                            <CCol className="text-end">
                              <strong>£{totalAmount.toFixed(2)}</strong>
                            </CCol>
                          </CRow>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                )}

                {/* Payment Transactions List */}
                {isEditing && (
                  <PaymentTransactionsList
                    purchaseOrderId={id}
                    onTransactionUpdate={handlePaymentSuccess}
                    supplierId={formData.supplier_id}
                    totalAmount={totalAmount}
                    paidAmount={parseFloat(formData.paid_amount || 0)}
                  />
                )}

                <CRow>
                  <CCol className="text-end">
                    <CButtonGroup>
                      {/* Payment Button */}
                      {isPaymentAllowed() && (
                        <CButton 
                          type="button"
                          color="success" 
                          variant="outline"
                          onClick={handlePayment}
                        >
                          <CIcon icon={cilCreditCard} className="me-2" />
                          Payment
                        </CButton>
                      )}

                      {/* Save Button - Only show if editable */}
                      {isFormEditable() && (
                        <CButton 
                          type="submit" 
                          color="primary" 
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <CSpinner size="sm" className="me-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <CIcon icon={cilSave} className="me-2" />
                              {isEditing ? 'Update Purchase Order' : 'Create Purchase Order'}
                            </>
                          )}
                        </CButton>
                      )}
                    </CButtonGroup>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Payment Modal */}
      {isEditing && (
        <PaymentModal
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          purchaseOrderId={id}
          supplierId={formData.supplier_id}
          totalAmount={totalAmount}
          paidAmount={parseFloat(formData.paid_amount || 0)}
          title="Make Payment for Purchase Order"
        />
      )}
    </div>
  );
};

export default PurchaseOrderForm; 