import React, { useState, useEffect, useRef } from 'react';
import api from '../../config/axios';
import {
  CCard, CCardHeader, CCardBody, CButton, CForm, CFormInput, CFormSelect, CRow, CCol, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CAlert, CSpinner, CInputGroup, CInputGroupText, CFormLabel, CModal, CModalHeader, CModalBody, CModalFooter
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBarcode, cilPlus, cilTrash, cilWallet, cilUser, cilWarning, cilBasket } from '@coreui/icons';
import useToast from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PosPage = () => {
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
  const [submitting, setSubmitting] = useState(false);
  const [cash, setCash] = useState('0');
  const [card, setCard] = useState('0');
  const [upi, setUpi] = useState('0');
  const [wallet, setWallet] = useState('0');
  const [showDueModal, setShowDueModal] = useState(false);
  const [invoiceRef, setInvoiceRef] = useState('');
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
    setLoading(true);
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
      setLoading(false);
    }
  };

  // Product search by text
  const handleTextSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.length < 2) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/products', { params: { search: e.target.value, per_page: 10 } });
      setSearchResults(res.data.data || []);
    } catch {
      setSearchResults([]);
    } finally {
      setLoading(false);
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
        stock: product.opening_stock,
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
        let newQty = Math.max(1, Math.floor(Number(qty)));
        if (item.stock && newQty > item.stock) {
          toast.error(`Cannot add more than available stock (${Math.floor(item.stock)}) for ${item.name}`);
          newQty = Math.floor(item.stock);
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
    if (!cart.length) return setAlert({ type: 'danger', msg: 'Cart is empty.' });
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
      const res = await api.post('/sales', payload);
      setInvoiceRef(res.data.invoice_ref || '');
      toast.success('Sale completed and invoice created!');
      setCart([]);
      setCash('0'); setCard('0'); setUpi('0'); setWallet('0');
      setPaid(''); setDiscountValue(''); setCustomerId('');
      setTimeout(() => setAlert(null), 2000);
      // Navigate to invoice detail page
      if (res.data.sale && res.data.sale.id) {
        navigate(`/sales/invoices/${res.data.sale.id}`);
      }
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Error creating sale.' });
    } finally {
      setSubmitting(false);
      setShowDueModal(false);
    }
  };

  // const walletMax = walletBalance > 0 ? walletBalance : 0; // REMOVED - wallet not used for new sales

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

  return (
    <>
      <CCard className="mt-4 shadow-sm">
        <CCardHeader>
          <div className="d-flex align-items-center justify-content-between">
            <strong>POS (Point of Sale)</strong>
            <span className="text-muted" style={{ fontSize: '1.1em', fontWeight: 500 }}>{currentTime}</span>
          </div>
        </CCardHeader>
        <CCardBody>
          {alert && <CAlert color={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</CAlert>}
          <CForm onSubmit={hasPermission && hasPermission('create_sale') ? handleSubmit : (e) => e.preventDefault()} autoComplete="off">
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
                      <CButton color="primary" onClick={handleBarcodeSearch} disabled={loading} type="button">
                        <CIcon icon={cilBarcode} />
                      </CButton>
                      <CButton color="secondary" onClick={() => setBarcode('')} disabled={loading} type="button" title="Clear">
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
                    {searchResults.length > 0 && (
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
                            {hasPermission && hasPermission('create_sale') ? (
                              <CFormInput
                                type="number"
                                min={1}
                                max={item.stock}
                                step={1}
                                value={item.qty}
                                onChange={e => updateQty(item.id, e.target.value)}
                                style={{ width: '100%', minWidth: 60 }}
                              />
                            ) : (
                              <span>{item.qty}</span>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            {hasPermission && hasPermission('create_sale') ? (
                              <CFormInput
                                type="text"
                                value={item.displayPrice || Number(item.price).toFixed(2)}
                                onChange={e => updatePrice(item.id, e.target.value)}
                                style={{ width: '100%', minWidth: 70 }}
                                placeholder="0.00"
                              />
                            ) : (
                              <span>{`£${Number(item.price).toFixed(2)}`}</span>
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
                        {walletBalance !== null && (
                          <CBadge color="success" className="me-2 px-3 py-2" style={{ fontSize: '1em' }}>
                            <CIcon icon={cilWallet} className="me-1" /> Wallet Balance: £{(Number(walletBalance) || 0).toFixed(2)}
                          </CBadge>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Total Summary Section */}
                  <div className="border rounded p-3 mb-3 bg-light">
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
                    {hasPermission && hasPermission('create_sale') ? (
                      <>
                        <CFormLabel>Cash</CFormLabel>
                        <CFormInput type="number" min={0} step="0.01" value={cash} onChange={e => setCash(e.target.value)} />
                        <CFormLabel className="mt-2">Card</CFormLabel>
                        <CFormInput type="number" min={0} step="0.01" value={card} onChange={e => setCard(e.target.value)} />
                        <CFormLabel className="mt-2">UPI</CFormLabel>
                        <CFormInput type="number" min={0} step="0.01" value={upi} onChange={e => setUpi(e.target.value)} />
                        <CFormLabel className="mt-2">
                          Wallet
                          {/* Removed "Use Max Wallet" button permanently */}
                        </CFormLabel>
                        <CFormInput
                          type="number"
                          min={0}
                          max={0} // Always disabled - wallet not allowed for new sales
                          value={wallet}
                          disabled={true} // Always disabled - wallet not allowed for new sales
                          placeholder="Wallet payments disabled"
                          title="Wallet payments are not allowed for new sales"
                        />
                      </>
                    ) : (
                      <div className="text-muted">You do not have permission to create sales.</div>
                    )}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.85em' }}>
                    {walletBalance !== null ? `Wallet Balance: £${(Number(walletBalance) || 0).toFixed(2)} (Payments disabled)` : 'Wallet: Not available'}
                  </div>
                  {hasPermission && hasPermission('create_sale') && (
                    <CButton color="primary" className="mt-2 w-100" type="submit" disabled={submitting} size="lg">
                      {submitting ? <CSpinner size="sm" /> : <><CIcon icon={cilPlus} className="me-2" /> Generate Invoice</>}
                    </CButton>
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

export default PosPage; 