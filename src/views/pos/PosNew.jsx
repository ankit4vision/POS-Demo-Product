import React, { useState, useEffect, useRef } from 'react';
import api from '../../config/axios';
import {
  CCard, CCardHeader, CCardBody, CButton, CForm, CFormInput, CFormSelect, CRow, CCol, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CAlert, CSpinner, CInputGroup, CInputGroupText, CFormLabel, CModal, CModalHeader, CModalBody, CModalFooter
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBarcode, cilPlus, cilTrash, cilWallet, cilUser, cilWarning, cilBasket, cilPencil, cilCreditCard, cilMobile } from '@coreui/icons';
import useToast from '../../hooks/useToast';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PosNew = () => {
  // Route params
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  // State
  const [barcode, setBarcode] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [customerType, setCustomerType] = useState('individual');
  const [walletBalance, setWalletBalance] = useState(null);
  const [discountType, setDiscountType] = useState('%');
  const [discountValue, setDiscountValue] = useState('');
  const [paid, setPaid] = useState('');
  const [mode, setMode] = useState('cash');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false); // Separate loading for product search
  const [submitting, setSubmitting] = useState(false);
  const [cash, setCash] = useState('0');
  const [card, setCard] = useState('0');
  const [upi, setUpi] = useState('0');
  const [wallet, setWallet] = useState('0');
  const [showDueModal, setShowDueModal] = useState(false);
  const [invoiceRef, setInvoiceRef] = useState('');
  const [originalSale, setOriginalSale] = useState(null);
  const [siteSettings, setSiteSettings] = useState({});

  // Add state for current time
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load existing sale data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadExistingSale();
    }
  }, [isEditMode, id]);

  const loadExistingSale = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/sales/${id}`);
      const sale = res.data;
      setOriginalSale(sale);
      
      // Set customer (wait for customers to be loaded if needed)
      if (sale.customer_id) {
        setCustomerId(sale.customer_id.toString());
        // If customers are not loaded yet, wait for them
        if (customers.length === 0) {
          await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
        }
        const customer = customers.find(c => c.id === sale.customer_id);
        if (customer) {
          setCustomerType(customer.type || 'individual');
        }
      }
      
      // Set payment mode
      setMode(sale.mode || 'cash');
      
      // Set payment amounts
      if (sale.sales_transactions && sale.sales_transactions.length > 0) {
        const transactions = sale.sales_transactions;
        console.log('Loading payment amounts:', transactions);
        
        const cashAmount = Number(transactions.find(t => t.payment_type === 'cash')?.amount || 0);
        const cardAmount = Number(transactions.find(t => t.payment_type === 'card')?.amount || 0);
        const upiAmount = Number(transactions.find(t => t.payment_type === 'upi')?.amount || 0);
        const walletAmount = Number(transactions.find(t => t.payment_type === 'wallet')?.amount || 0);
        
        console.log('Payment amounts:', { cashAmount, cardAmount, upiAmount, walletAmount });
        
        setCash(cashAmount.toString());
        setCard(cardAmount.toString());
        setUpi(upiAmount.toString());
        setWallet(walletAmount.toString());
      }
      
      // Set cart items
      if (sale.items && sale.items.length > 0) {
        const cartItems = sale.items.map(item => {
          // Calculate proper subtotal for each item
          const itemTotal = item.price * item.qty;
          const discountAmount = (itemTotal * (item.discount || 0)) / 100;
          const taxableAmount = itemTotal - discountAmount;
          const taxAmount = (taxableAmount * (item.tax || 0)) / 100;
          const calculatedSubtotal = taxableAmount + taxAmount;
          
          // Calculate original stock: current stock + current invoice quantity
          const currentStock = item.product?.opening_stock || 0;
          const currentInvoiceQty = item.qty || 0;
          const originalStock = currentStock + currentInvoiceQty;
          
          return {
            id: item.product_id,
            name: item.product?.name || 'Unknown Product',
            sku: item.product?.sku || '',
            barcode: item.product?.barcode || '',
            unit: item.product?.unit?.name || '',
            price: item.price,
            qty: item.qty,
            discount: item.discount || 0,
            tax: item.tax || 0,
            stock: currentStock, // Current remaining stock (e.g., 30)
            originalStock: originalStock, // Original stock when invoice was created (e.g., 30 + 31 = 61)
            currentInvoiceQty: currentInvoiceQty, // Current invoice quantity (e.g., 31)
            subtotal: calculatedSubtotal,
          };
        });
        setCart(cartItems);
      }
      
      // Set invoice reference
      setInvoiceRef(sale.invoice_ref || '');
      
    } catch (err) {
      toast.error('Failed to load sale data: ' + (err.response?.data?.message || err.message));
      navigate('/sales/invoices');
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers and site settings on mount
  useEffect(() => {
    api.get('/customers', { params: { per_page: 1000, status: 'active' } })
      .then(res => setCustomers(res.data.data || []))
      .catch(() => setCustomers([]));
    
    api.get('/settings')
      .then(res => {
        if (res.data.siteSettings) {
          setSiteSettings(res.data.siteSettings);
        }
      })
      .catch(() => console.log('Failed to load settings'));
  }, []);

  // Fetch wallet balance when customer changes
  useEffect(() => {
    if (customerId && customerId !== '') {
      const selected = customers.find(c => c.id == customerId);
      if (selected) {
        const partyType = selected.type === 'retailer' ? 'retailer' : 'customer';
        api.get(`/wallets/by-customer/${partyType}/${customerId}`)
          .then(res => {
            const walletId = res.data.id;
            return api.get(`/wallets/ledger/${walletId}`);
          })
          .then(res => setWalletBalance(res.data.wallet.current_balance ?? 0))
          .catch((err) => {
            console.log('Wallet balance fetch failed:', err.message);
            setWalletBalance(null);
          });
      }
    } else {
      setWalletBalance(null);
    }
  }, [customerId, customers]);

  // Audio refs for sound feedback
  const successAudioRef = useRef();
  const errorAudioRef = useRef();

  // Product search by barcode
  const handleBarcodeSearch = async (e) => {
    e.preventDefault();
    if (!barcode) return;
    setSearchLoading(true);
    try {
      const res = await api.get(`/products/lookup/${barcode}`);
      if (res.data && res.data.product) {
        const product = res.data.product;
        // Check if product has valid stock
        if (product.opening_stock === null || product.opening_stock === undefined || product.opening_stock <= 0) {
          toast.error(`Cannot add ${product.name} - Stock not available`);
          if (errorAudioRef.current) errorAudioRef.current.play();
          setBarcode('');
          return;
        }
        addToCart(product);
        toast.success('Product added: ' + product.name);
        if (successAudioRef.current) successAudioRef.current.play();
        setBarcode('');
      } else {
        toast.error('Product not found.');
        if (errorAudioRef.current) errorAudioRef.current.play();
      }
    } catch {
      toast.error('Product not found.');
      if (errorAudioRef.current) errorAudioRef.current.play();
    } finally {
      setSearchLoading(false);
    }
  };

  // Product search by text
  const handleTextSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await api.get('/products', { params: { search: e.target.value, per_page: 10 } });
      setSearchResults(res.data.data || []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Add product to cart
  const addToCart = (product) => {
    // Check if product has valid stock
    if (product.opening_stock === null || product.opening_stock === undefined || product.opening_stock <= 0) {
      toast.error(`Cannot add ${product.name} - Stock not available`);
      return;
    }

    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      const price = customerType === 'retailer' ? product.retailer_sales_price : product.individual_sales_price;
      const discount = typeof product.discount === 'number' ? product.discount : Number(product.discount) || 0;
      // Try to get tax from multiple possible property names
      let tax = 0;
      if (typeof product.tax === 'number') tax = product.tax;
      else if (typeof product.vat === 'number') tax = product.vat;
      else if (typeof product.tax_percent === 'number') tax = product.tax_percent;
      else if (typeof product.vat_percent === 'number') tax = product.vat_percent;
      else if (!isNaN(Number(product.tax))) tax = Number(product.tax);
      else if (!isNaN(Number(product.vat))) tax = Number(product.vat);
      else if (!isNaN(Number(product.tax_percent))) tax = Number(product.tax_percent);
      else if (!isNaN(Number(product.vat_percent))) tax = Number(product.vat_percent);
      let unit = '-';
      if (typeof product.unit === 'string') unit = product.unit;
      else if (product.unit && typeof product.unit === 'object') unit = product.unit.name || product.unit.label || '-';
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        sku: product.sku,
        unit,
        price,
        displayPrice: Number(price).toFixed(2),
        discount,
        tax,
        qty: 1,
        stock: product.opening_stock, // Current available stock
        originalStock: product.opening_stock, // For new items, original = current
        currentInvoiceQty: 1, // Current invoice quantity
        retailer_sales_price: product.retailer_sales_price,
        individual_sales_price: product.individual_sales_price,
      }];
    });
    setSearchResults([]);
    setSearch('');
  };

  // Update all cart item prices when price mode changes
  useEffect(() => {
    setCart(prevCart => prevCart.map(item => ({
      ...item,
      price: customerType === 'retailer' ? item.retailer_sales_price : item.individual_sales_price,
      displayPrice: Number(customerType === 'retailer' ? item.retailer_sales_price : item.individual_sales_price).toFixed(2)
    })));
    // eslint-disable-next-line
  }, [customerType]);

  // Remove product from cart
  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  // Update cart qty
  const updateQty = (id, qty) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        let newQty = Math.max(0, Math.floor(Number(qty)));
        
        // Stock validation with toaster errors
        if (isEditMode) {
          // Edit Mode: Check against original stock (e.g., 61)
          if (item.originalStock && newQty > item.originalStock) {
            toast.error(`Cannot add more than original stock (${item.originalStock}) for ${item.name}`);
            newQty = item.originalStock; // Reset to max allowed
          }
        } else {
          // New Sale: Check against current stock (e.g., 30)
          if (item.stock && newQty > item.stock) {
            toast.error(`Cannot add more than available stock (${item.stock}) for ${item.name}`);
            newQty = item.stock; // Reset to max allowed
          }
        }
        
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  // Update cart price
  const updatePrice = (id, price) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newPrice = Math.max(0, Number(price) || 0);
        return { 
          ...item, 
          price: newPrice,
          displayPrice: price // Keep the display value as typed by user
        };
      }
      return item;
    }));
  };

  // Calculate totals using discounted price and tax per item
  let subtotal = 0, totalDiscount = 0, totalVAT = 0, grandTotal = 0;
  cart.forEach(item => {
    const itemBase = Number(item.price) * Number(item.qty);
    const itemDiscount = itemBase * (Number(item.discount) || 0) / 100;
    const itemVAT = ((itemBase - itemDiscount) * (Number(item.tax) || 0)) / 100;
    const itemAmount = itemBase - itemDiscount + itemVAT;
    subtotal += itemBase;
    totalDiscount += itemDiscount;
    totalVAT += itemVAT;
    grandTotal += itemAmount;
    // Store per-item subtotal for backend
    item.subtotal = itemAmount;
  });
  // Remove round off logic - use exact grand total
  const roundedTotal = grandTotal; // No more rounding
  const roundOff = 0; // Always 0 - no round off
  const totalPaid = [cash, card, upi, wallet].reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
  
  // Debug totalPaid calculation
  console.log('Payment state values:', { cash, card, upi, wallet });
  console.log('TotalPaid calculation:', totalPaid);
  
  const due = Math.max(0, roundedTotal - totalPaid);

  // Handle customer type change
  const handleCustomerChange = (e) => {
    setCustomerId(e.target.value);
    const selected = customers.find(c => c.id == e.target.value);
    setCustomerType(selected && selected.type === 'retailer' ? 'retailer' : 'individual');
    setCart([]); // Clear cart on customer change
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setAlert({ type: 'danger', msg: 'Cart is empty. Please add products.' });
      return;
    }
    if (!customerId && due > 0) return setAlert({ type: 'danger', msg: 'Walk-in customer must pay full.' });
    if (due > 0) {
      setShowDueModal(true);
      return;
    }
    await completeSale();
  };

  const navigate = useNavigate();

  const completeSale = async () => {
    setSubmitting(true);
    try {
      const payload = {
        customer_id: customerId || null,
        items: cart.map(item => ({
          product_id: item.id,
          qty: item.qty,
          price: item.price,
          discount: item.discount || 0,
          tax: item.tax || 0,
          subtotal: item.subtotal || 0,
        })),
        subtotal: subtotal,
        total_discount: totalDiscount,
        total_tax: totalVAT,
        grand_total: grandTotal,
        rounded_total: roundedTotal,
        round_off: roundOff,
        paid: totalPaid,
        due,
        mode,
        cash: parseFloat(cash) || 0,
        card: parseFloat(card) || 0,
        upi: parseFloat(upi) || 0,
        wallet: parseFloat(wallet) || 0,
      };

      let res;
      if (isEditMode) {
        // Update existing sale
        res = await api.put(`/sales/${id}`, payload);
        toast.success('Sale updated successfully!');
      } else {
        // Create new sale
        res = await api.post('/sales', payload);
        setInvoiceRef(res.data.invoice_ref || '');
        toast.success('Sale completed and invoice created!');
      }

      // Clear form after successful submission
      if (!isEditMode) {
        setCart([]);
        setCash('0'); setCard('0'); setUpi('0'); setWallet('0');
        setPaid(''); setDiscountValue(''); setCustomerId('');
      }
      
      setTimeout(() => setAlert(null), 2000);
      
      // Navigate to invoice detail page
      if (res.data.sale && res.data.sale.id) {
        navigate(`/sales/invoices/${res.data.sale.id}`);
      }
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || `Error ${isEditMode ? 'updating' : 'creating'} sale.` });
    } finally {
      setSubmitting(false);
      setShowDueModal(false);
    }
  };

  const walletMax = walletBalance > 0 ? walletBalance : 0;

  const toast = useToast();

  // Ref for barcode input
  const barcodeInputRef = useRef();

  // Autofocus barcode input when cleared
  useEffect(() => {
    if (barcode === '' && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [barcode]);

  // Debounced barcode search
  useEffect(() => {
    if (barcode && barcode.length >= 6) {
      const timer = setTimeout(() => {
        handleBarcodeSearch({ preventDefault: () => {} });
      }, 500); // 500ms debounce
      return () => clearTimeout(timer);
    }
  }, [barcode]);

  const { hasPermission } = useAuth();

  if (!(hasPermission && hasPermission('view_sale'))) {
    return (
      <CCard className="mt-4 shadow-sm">
        <CCardBody>
          <CAlert color="danger">You do not have permission to access the POS page.</CAlert>
        </CCardBody>
      </CCard>
    );
  }

  // Show loading state while loading existing sale data
  if (loading && isEditMode) {
    return (
      <CCard className="mt-4 shadow-sm">
        <CCardBody className="text-center py-5">
          <div className="d-flex flex-column align-items-center">
            <CSpinner size="lg" color="primary" />
            <div className="mt-3 text-primary fw-bold">Loading Sale Data...</div>
            <div className="mt-2 text-muted small">Please wait while we fetch the sale information</div>
          </div>
        </CCardBody>
      </CCard>
    );
  }

  return (
    <>
      <CCard className="mt-4 shadow-sm">
        <CCardHeader>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <strong>{isEditMode ? 'Edit Sale' : 'POS (Point of Sale)'}</strong>
              {isEditMode && (
                <div className="text-muted" style={{ fontSize: '0.9em', marginTop: '2px' }}>
                  Invoice: {invoiceRef} | Sale ID: {id}
                </div>
              )}
            </div>
            <span className="text-muted" style={{ fontSize: '1.1em', fontWeight: 500 }}>{currentTime}</span>
          </div>
        </CCardHeader>
        <CCardBody>
          {alert && <CAlert color={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</CAlert>}
          <CForm onSubmit={hasPermission && hasPermission('edit_sale') ? handleSubmit : (e) => e.preventDefault()} autoComplete="off">
            <CRow>
              {/* Left: Cart */}
              <CCol md={8}>
                <h5 className="mb-3">Cart</h5>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Scan Barcode</CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        type="text"
                        value={barcode}
                        onChange={e => setBarcode(e.target.value)}
                        placeholder="Scan barcode or SKU"
                        disabled={loading}
                        ref={barcodeInputRef}
                        autoFocus
                      />
                      <CButton color="primary" onClick={handleBarcodeSearch} disabled={searchLoading} type="button">
                        {searchLoading ? <CSpinner size="sm" /> : <CIcon icon={cilBarcode} />}
                      </CButton>
                      <CButton color="secondary" onClick={() => setBarcode('')} disabled={searchLoading} type="button" title="Clear">
                        ×
                      </CButton>
                    </CInputGroup>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Search Product</CFormLabel>
                    <CFormInput
                      value={search}
                      onChange={handleTextSearch}
                      placeholder="Type product name or SKU"
                    />
                    {searchLoading ? (
                      <div className="text-center py-3">
                        <CSpinner size="sm" />
                        <div className="mt-2">Searching products...</div>
                      </div>
                    ) : searchResults.length > 0 && (
                      <div className="bg-white border rounded shadow position-absolute z-3" style={{ maxWidth: 500, width: '100%', minWidth: 320, maxHeight: 260, overflowY: 'auto' }}>
                        {searchResults.map(p => (
                          <div key={p.id} className="d-flex align-items-center justify-content-between px-2 py-1 border-bottom" style={{ fontSize: '0.98em', cursor: 'pointer' }}>
                            <div className="d-flex flex-column flex-grow-1">
                              <span style={{ fontWeight: 600 }}>{p.name}</span>
                              <div className="d-flex flex-wrap gap-2 align-items-center" style={{ fontSize: '0.92em' }}>
                                <CBadge color="light" textColor="dark" className="me-1">SKU: {p.sku}</CBadge>
                                {p.barcode && <CBadge color="light" textColor="dark" className="me-1">Barcode: {p.barcode}</CBadge>}
                                {p.unit && p.unit.name && <CBadge color="light" textColor="dark" className="me-1">{p.unit.name}</CBadge>}
                              </div>
                              {typeof p.description === 'string' && p.description.trim() !== '' && (
                                <div className="text-muted" style={{ fontSize: '0.85em', marginTop: 2, marginLeft: 2 }}>{p.description}</div>
                              )}
                            </div>
                            <CButton color="primary" size="sm" style={{ minWidth: 32, fontWeight: 600 }} onClick={() => addToCart(p)}>
                              +
                            </CButton>
                          </div>
                        ))}
                      </div>
                    )}
                  </CCol>
                </CRow>
                <CTable hover responsive bordered className="mb-0 align-middle mt-3">
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell style={{ width: '35%' }}>Product</CTableHeaderCell>
                      <CTableHeaderCell style={{ width: '8%' }}>Unit</CTableHeaderCell>
                      <CTableHeaderCell style={{ width: '12%' }}>Quantity</CTableHeaderCell>
                      <CTableHeaderCell style={{ width: '12%' }}>Price</CTableHeaderCell>
                      <CTableHeaderCell style={{ width: '12%' }}>Discount</CTableHeaderCell>
                      {siteSettings.hide_vat_from_everywhere !== '1' && (
                        <CTableHeaderCell style={{ width: '10%' }}>VAT</CTableHeaderCell>
                      )}
                      <CTableHeaderCell style={{ width: '12%' }}>Amount</CTableHeaderCell>
                      <CTableHeaderCell style={{ width: '8%' }}></CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {cart.map(item => {
                      const itemBase = Number(item.price) * Number(item.qty);
                      const itemDiscount = itemBase * (Number(item.discount) || 0) / 100;
                      const itemVAT = ((itemBase - itemDiscount) * (Number(item.tax) || 0)) / 100;
                      const itemAmount = itemBase - itemDiscount + itemVAT;
                      return (
                        <CTableRow key={String(item.id)}>
                          <CTableDataCell>{String(item.name ?? '-')}</CTableDataCell>
                          <CTableDataCell>{String(item.unit ?? '-')}</CTableDataCell>
                          <CTableDataCell>
                            {hasPermission && hasPermission('edit_sale') ? (
                              <CFormInput
                                type="number"
                                min={0}
                                max={isEditMode ? (item.originalStock || 0) : (item.stock || 0)}
                                step={1}
                                value={Math.floor(item.qty)}
                                onChange={e => updateQty(item.id, e.target.value)}
                                style={{ width: '100%', minWidth: 60 }}
                              />
                            ) : (
                              <span>{Math.floor(item.qty)}</span>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            {hasPermission && hasPermission('edit_sale') ? (
                              <CFormInput
                                type="text"
                                value={item.displayPrice || (Number(item.price) || 0).toFixed(2)}
                                onChange={e => updatePrice(item.id, e.target.value)}
                                style={{ width: '100%', minWidth: 70 }}
                                placeholder="0.00"
                              />
                            ) : (
                              <span>{`£${(Number(item.price) || 0).toFixed(2)}`}</span>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            {item.discount > 0 
                              ? <CBadge color="success">£{itemDiscount.toFixed(2)} ({item.discount}%)</CBadge>
                              : '-'
                            }
                          </CTableDataCell>
                          {siteSettings.hide_vat_from_everywhere !== '1' && (
                            <CTableDataCell>
                              {item.tax > 0 
                                ? <CBadge color="info">£{itemVAT.toFixed(2)} ({item.tax}%)</CBadge>
                                : '-'
                              }
                            </CTableDataCell>
                          )}
                          <CTableDataCell>{`£${itemAmount.toFixed(2)}`}</CTableDataCell>
                          <CTableDataCell>
                            {hasPermission && hasPermission('delete_sale') && (
                              <CButton color="danger" size="sm" onClick={() => removeFromCart(item.id)} title="Remove item">
                                <CIcon icon={cilTrash} />
                              </CButton>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      );
                    })}
                    {cart.length === 0 && (
                      <CTableRow><CTableDataCell colSpan={siteSettings.hide_vat_from_everywhere === '1' ? 7 : 8} className="text-center text-muted">Cart is empty</CTableDataCell></CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </CCol>
              {/* Right: Payment */}
              <CCol md={4}>
                <CCard className="border shadow-sm p-3">
                  {/* Customer Section */}
                  <div className="mb-3">
                    <CFormLabel>Select Customer</CFormLabel>
                    <CFormSelect
                      value={customerId}
                      onChange={handleCustomerChange}
                      options={[
                        { label: 'Walk-in Customer', value: '' },
                        ...customers.map(c => ({ label: c.name, value: c.id }))
                      ]}
                    />
                    {customerId && (
                      <div className="mt-2 d-flex align-items-center gap-2">
                        <CBadge color="info" className="me-2 px-3 py-2" style={{ fontSize: '1em' }}>
                          <CIcon icon={customerType === 'retailer' ? cilBasket : cilUser} className="me-1" /> {customerType === 'retailer' ? 'Retailer' : 'Individual'}
                        </CBadge>
                        <span className="badge badge-light-yellow px-3 py-2" style={{ fontSize: '1em' }}>
                          <CIcon icon={cilWallet} className="me-1" /> Wallet: £{walletBalance !== null ? walletBalance : '--'}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Total Summary Section */}
                  <div className="border rounded p-3 mb-3 bg-light">
                    {isEditMode && originalSale && (
                      <div className="mb-3 p-2 border-start border-4 border-info bg-info bg-opacity-10">
                        <div className="fw-bold text-info mb-2">Edit Mode Summary</div>
                        <div className="row">
                          <div className="col-6">
                            <small className="text-muted">Original Total:</small><br />
                            <strong>£{(Number(originalSale.rounded_total) || 0).toFixed(2)}</strong>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Current Total:</small><br />
                            <strong>£{roundedTotal.toFixed(2)}</strong>
                          </div>
                        </div>
                        <hr className="my-2" />
                        <div className="text-center">
                          <small className="text-muted">Difference:</small><br />
                          <strong className={roundedTotal - (Number(originalSale.rounded_total) || 0) > 0 ? 'text-danger' : 'text-success'}>
                            {roundedTotal - (Number(originalSale.rounded_total) || 0) > 0 ? '+' : ''}£{(roundedTotal - (Number(originalSale.rounded_total) || 0)).toFixed(2)}
                          </strong>
                          <div className="small text-muted">
                            {roundedTotal - (Number(originalSale.rounded_total) || 0) > 0 ? 'Customer owes more' : 'Customer gets credit'}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mb-1">Subtotal: <strong>£{(Number(subtotal) || 0).toFixed(2)}</strong></div>
                    <div className="mb-1">Total Discount: <strong>£{(Number(totalDiscount) || 0).toFixed(2)}</strong></div>
                    {siteSettings.hide_vat_from_everywhere !== '1' && (
                      <div className="mb-1">Total VAT: <strong>£{(Number(totalVAT) || 0).toFixed(2)}</strong></div>
                    )}
                    <div className="mb-1">Grand Total: <strong>£{(Number(grandTotal) || 0).toFixed(2)}</strong></div>
                    <div className="mb-1">Final Payable: <strong>£{(Number(roundedTotal) || 0).toFixed(2)}</strong></div>
                    <div className="mb-1">Paid: <strong>£{(Number(totalPaid) || 0).toFixed(2)}</strong></div>
                    <div className="mb-1 text-danger">Due: <strong>£{(Number(due) || 0).toFixed(2)}</strong></div>
                  </div>
                  {/* Payment Section */}
                  <div className="mb-3">
                    <h6>Payment Methods</h6>
                    {isEditMode ? (
                      <div className="text-muted">
                        <CAlert color="info" className="py-2 px-3 mb-3">
                          <strong>Edit Mode:</strong> Payment methods are locked to preserve original transaction records.
                          <div className="small mt-1">
                            You can modify cart items, but original payment records remain unchanged. 
                            Any total difference will automatically adjust the customer's wallet balance.
                          </div>
                        </CAlert>
                        
                        {/* Original Transaction Details */}
                        {originalSale?.sales_transactions && originalSale.sales_transactions.length > 0 && (
                          <div className="mb-3 p-3 border rounded bg-light">
                            <div className="fw-bold mb-2 text-dark">Original Payment Transactions</div>
                            <div className="small">
                              {originalSale.sales_transactions.map((transaction, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center py-1 border-bottom">
                                  <span className="text-capitalize">
                                    <CIcon icon={
                                      transaction.payment_type === 'cash' ? cilWallet :
                                      transaction.payment_type === 'card' ? cilCreditCard :
                                      transaction.payment_type === 'upi' ? cilMobile :
                                      cilWallet
                                    } className="me-2" />
                                    {transaction.payment_type}
                                  </span>
                                  <span className="fw-bold">£{Number(transaction.amount || 0).toFixed(2)}</span>
                                </div>
                              ))}
                              <div className="d-flex justify-content-between align-items-center py-2 mt-2 border-top">
                                <strong>Total Paid:</strong>
                                <strong className="text-success">£{totalPaid.toFixed(2)}</strong>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Current Payment Summary */}
                        <div className="border rounded p-3 bg-light">
                          <div className="fw-bold mb-2 text-dark">Current Payment Summary</div>
                          <div className="mb-2">
                            <strong>Cash:</strong> £{parseFloat(cash || 0).toFixed(2)}
                          </div>
                          <div className="mb-2">
                            <strong>Card:</strong> £{parseFloat(card || 0).toFixed(2)}
                          </div>
                          <div className="mb-2">
                            <strong>UPI:</strong> £{parseFloat(upi || 0).toFixed(2)}
                          </div>
                          <div className="mb-2">
                            <strong>Wallet:</strong> £{parseFloat(wallet || 0).toFixed(2)}
                          </div>
                          <hr />
                          <div className="text-success">
                            <strong>Total Paid:</strong> £{totalPaid.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      hasPermission && hasPermission('edit_sale') ? (
                        <>
                          <CFormLabel>Cash</CFormLabel>
                          <CFormInput type="number" min={0} value={cash} onChange={e => setCash(e.target.value)} />
                          <CFormLabel className="mt-2">Card</CFormLabel>
                          <CFormInput type="number" min={0} value={card} onChange={e => setCard(e.target.value)} />
                          <CFormLabel className="mt-2">UPI</CFormLabel>
                          <CFormInput type="number" min={0} value={upi} onChange={e => setUpi(e.target.value)} />
                          <CFormLabel className="mt-2">
                            Wallet
                            <CButton
                              size="sm"
                              color="info"
                              className="ms-2"
                              onClick={() => setWallet(Math.min(walletMax, Number(due) || 0).toFixed(2))}
                              disabled={walletMax === 0 || due <= 0}
                            >
                              Use Max Wallet
                            </CButton>
                          </CFormLabel>
                          <CFormInput
                            type="number"
                            min={0}
                            max={walletMax}
                            value={wallet}
                            disabled={walletMax === 0}
                            onChange={e => {
                              let val = e.target.value;
                              if (Number(val) > walletMax) val = walletMax;
                              setWallet(val);
                            }}
                          />
                        </>
                      ) : (
                        <div className="text-muted">You do not have permission to edit payment details.</div>
                      )
                    )}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.85em' }}>
                    Available: £{walletBalance !== null ? Number(walletBalance).toFixed(2) : '--'}
                  </div>
                  {hasPermission && hasPermission('edit_sale') && (
                    <>
                      {isEditMode && (
                        <CAlert color="warning" className="mt-3 py-2 px-3">
                          <strong>Edit Mode:</strong> You are editing an existing sale. Changes will be saved when you submit.
                        </CAlert>
                      )}
                      <CButton color="primary" className="mt-2 w-100" type="submit" disabled={submitting} size="lg">
                        {submitting ? <CSpinner size="sm" /> : (
                          <>
                            <CIcon icon={isEditMode ? cilPencil : cilPlus} className="me-2" />
                            {isEditMode ? 'Update Sale' : 'Generate Invoice'}
                          </>
                        )}
                      </CButton>
                      {isEditMode && (
                        <CButton 
                          color="secondary" 
                          className="mt-2 w-100" 
                          onClick={() => navigate(`/sales/invoices/${id}`)}
                          size="lg"
                        >
                          Cancel Edit
                        </CButton>
                      )}
                    </>
                  )}
                  {due > 0 && (
                    <CAlert color="warning" className="mt-3 py-2 px-3">
                      <strong>Partial Payment Detected!</strong><br />
                      Customer will owe <strong>£{(Number(due) || 0).toFixed(2)}</strong> as due amount.
                    </CAlert>
                  )}
                </CCard>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
      {/* Due Payment Confirmation Modal */}
      <CModal visible={showDueModal} onClose={() => setShowDueModal(false)}>
        <CModalHeader onClose={() => setShowDueModal(false)}>
          <strong>Confirm Due Payment</strong>
        </CModalHeader>
        <CModalBody>
          <div className="text-center mb-3">
            <CIcon icon={cilWarning} size="xxl" className="text-warning mb-2" />
            <h5>Due Payment Confirmation</h5>
            <div>
              Customer will owe <strong>£{(Number(due) || 0).toFixed(2)}</strong> as due amount.<br />
              {invoiceRef && <div>Invoice Reference: <strong>{invoiceRef}</strong></div>}
            </div>
            <CAlert color="info" className="mt-3">
              <strong>Note:</strong> This due amount will be added to the customer's wallet as a negative balance.
            </CAlert>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDueModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={async () => { await completeSale(); setShowDueModal(false); }}>
            Confirm Due Payment
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Audio feedback for scan success and error (supports .mp3 and .wav) */}
      <audio ref={successAudioRef} preload="auto">
        <source src="/sounds/beep-success.mp3" type="audio/mpeg" />
        <source src="/sounds/beep-success.wav" type="audio/wav" />
      </audio>
      <audio ref={errorAudioRef} preload="auto">
        <source src="/sounds/beep-error.mp3" type="audio/mpeg" />
        <source src="/sounds/beep-error.wav" type="audio/wav" />
      </audio>
    </>
  );
};

export default PosNew; 