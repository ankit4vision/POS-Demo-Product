import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import {
  CCard, CCardHeader, CCardBody, CButton, CAlert, CSpinner, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CForm, CFormInput, CFormSelect, CPagination, CPaginationItem, CInputGroup, CInputGroupText, CRow, CCol, CImage, CBadge, CModal, CModalHeader, CModalBody, CModalFooter
} from '@coreui/react';
import { cilBasket, cilWarning, cilPlus, cilSearch, cilFilter, cilPencil, cilTrash, cilInfo } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import PermissionGuard from '../../components/PermissionGuard';
import { useAuth } from '../../context/AuthContext';

const API_URL = '/products';

function ProductList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const perPage = 50;

  // Stats
  const [stats, setStats] = useState({ total: 0, inStock: 0, lowStock: 0, outOfStock: 0 });
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState('base');
  const [showExportModal, setShowExportModal] = useState(false);
  const [withPrice, setWithPrice] = useState(true);
  const [stockFilter, setStockFilter] = useState('available');

  const { permissions, hasPermission } = useAuth();

  const loadCategories = () => {
    setCategoriesLoading(true);
    api.get('/categories', {
      params: {
        per_page: 1000,
        status: 'active'
      }
    })
      .then(response => {
        const categoriesData = response.data.data || response.data || [];
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      })
      .catch(error => {
        setCategories([]);
        setAlert({ type: 'warning', msg: 'Failed to load categories. Please refresh the page.' });
      })
      .finally(() => setCategoriesLoading(false));
  };

  const load = (page = 1) => {
    setLoading(true);
    api.get(API_URL, {
      params: {
        page,
        per_page: perPage,
        search,
        status,
        category_id: categoryId,
        stock_status: stockStatus,
        sort_by: sortBy,
        sort_order: sortOrder,
      },
    }).then(response => {
      const products = response.data.data || [];
      setData(products);
      setPagination({
        current_page: response.data.current_page || 1,
        last_page: response.data.last_page || 1,
        total: response.data.total || 0,
      });
      // Use stats from API response
      if (response.data.stats) {
        setStats(response.data.stats);
      } else {
        // Fallback to old calculation if stats not available
        let total = products.length;
        let inStock = 0, lowStock = 0, outOfStock = 0;
        products.forEach(p => {
          if ((p.opening_stock || 0) === 0) outOfStock++;
          else if ((p.opening_stock || 0) <= (p.low_stock_alert || 0)) lowStock++;
          else inStock++;
        });
        setStats({ total, inStock, lowStock, outOfStock });
      }
    }).catch(error => {
      setData([]);
      setAlert({ type: 'danger', msg: 'Failed to load products.' });
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => { load(); }, [search, status, categoryId, stockStatus, sortBy, sortOrder]);

  const handleSearch = e => { e.preventDefault(); load(1); };
  const handlePageChange = (page) => { load(page); };
  const handleDelete = id => {
    if (window.confirm('Delete this product?')) {
      setLoading(true);
      api.delete(`${API_URL}/${id}`).then(() => {
        setAlert({ type: 'success', msg: 'Product deleted successfully!' });
        load();
      }).catch(err => {
        setAlert({ type: 'danger', msg: err.response?.data?.message || 'Error deleting product' });
      }).finally(() => setLoading(false));
    }
  };
  const formatPrice = (price) => parseFloat(price || 0).toFixed(2);

  // Low stock products for alert
  const lowStockProducts = data.filter(p => p.stock_status === 'low_stock');

  const handleExportPDF = async () => {
    try {
      setExportLoading(true);
      const params = new URLSearchParams();
      if (selectedPrice) params.append('price', selectedPrice);
      if (withPrice) params.append('with_price', '1');
      if (stockFilter && stockFilter !== 'all') params.append('stock_filter', stockFilter);
      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/products/export-pdf${query}`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ProductList.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setShowExportModal(false);
    } catch (error) {
      setAlert({ type: 'danger', msg: 'Failed to export product list PDF.' });
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <>
      <AppBreadcrumb />
      {/* Header & Stats */}
      <div className="mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1">Product Dashboard</h2>
            <div className="text-muted">Manage your product inventory efficiently</div>
          </div>
          {hasPermission && hasPermission('create_product') && (
            <CButton color="primary" onClick={() => navigate('/products/create')}>
              <CIcon icon={cilPlus} className="me-2" /> Add New Product
            </CButton>
          )}
        </div>
        <CRow className="g-3 mb-2">
          <CCol md={3} xs={6}>
            <CCard className="shadow-sm text-center">
              <CCardBody>
                <div className="mb-2"><CBadge color="dark" className="p-3 fs-5"><CIcon icon={cilBasket} /></CBadge></div>
                <div className="fs-4 fw-bold">{stats.total}</div>
                <div className="text-muted">Total Products</div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} xs={6}>
            <CCard className="shadow-sm text-center">
              <CCardBody>
                <div className="mb-2"><CBadge color="success" className="p-3 fs-5"><CIcon icon={cilBasket} /></CBadge></div>
                <div className="fs-4 fw-bold">{stats.inStock}</div>
                <div className="text-muted">In Stock</div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} xs={6}>
            <CCard className="shadow-sm text-center">
              <CCardBody>
                <div className="mb-2"><CBadge color="warning" className="p-3 fs-5"><CIcon icon={cilWarning} /></CBadge></div>
                <div className="fs-4 fw-bold">{stats.lowStock}</div>
                <div className="text-muted">Low Stock</div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} xs={6}>
            <CCard className="shadow-sm text-center">
              <CCardBody>
                <div className="mb-2"><CBadge color="danger" className="p-3 fs-5"><CIcon icon={cilBasket} /></CBadge></div>
                <div className="fs-4 fw-bold">{stats.outOfStock}</div>
                <div className="text-muted">Out of Stock</div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>

      {/* Search & Filters */}
      <CCard className="mb-3 shadow-sm">
        <CCardBody>
          <CRow className="g-2 align-items-center mb-2">
            <CCol md={6}>
              <CForm onSubmit={handleSearch} autoComplete="off">
                <CInputGroup>
                  <CFormInput
                    placeholder="Search by name, SKU, category, brand, unit, barcode, or status..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <CInputGroupText>
                    <CButton color="primary" type="submit" size="sm"><CIcon icon={cilSearch} /></CButton>
                  </CInputGroupText>
                </CInputGroup>
              </CForm>
            </CCol>
            <CCol md={6} className="text-end">
              <CButton color="light" variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <CIcon icon={cilFilter} className="me-2" /> Show Filters
              </CButton>
            </CCol>
          </CRow>
          {showFilters && (
            <CRow className="g-2 mb-2">
              <CCol md={3}>
                <CFormSelect
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  options={[
                    { label: 'All Status', value: '' },
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ]}
                />
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  disabled={categoriesLoading}
                  options={[
                    { label: categoriesLoading ? 'Loading...' : 'All Categories', value: '' },
                    ...(Array.isArray(categories) ? categories.map(cat => ({ label: cat.name, value: cat.id })) : [])
                  ]}
                />
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  value={stockStatus}
                  onChange={e => setStockStatus(e.target.value)}
                  options={[
                    { label: 'All Stock', value: '' },
                    { label: 'In Stock', value: 'in_stock' },
                    { label: 'Low Stock', value: 'low_stock' },
                    { label: 'Out of Stock', value: 'out_of_stock' },
                  ]}
                />
              </CCol>
            </CRow>
          )}
        </CCardBody>
      </CCard>

      {/* Info & Alerts */}
      <CRow className="mb-2">
        <CCol md={12}>
          {lowStockProducts.length > 0 && !showLowStockOnly && (
            <CAlert color="warning" className="py-2 mb-2 d-flex align-items-center justify-content-between">
              <div>
                <CIcon icon={cilWarning} className="me-2 text-warning" />
                <strong>Low Stock Alert</strong><br />
                <span className="small">{lowStockProducts.length} products are below their alert threshold and may need restocking.</span>
              </div>
              <CButton color="warning" size="sm" className="ms-2" onClick={() => setShowLowStockOnly(true)}>View Low Stock Items</CButton>
            </CAlert>
          )}
          {showLowStockOnly && (
            <CAlert color="info" className="py-2 mb-2 d-flex align-items-center justify-content-between">
              <div>
                <CIcon icon={cilInfo} className="me-2 text-info" />
                <strong>Showing only Low Stock Items</strong>
              </div>
              <CButton color="secondary" size="sm" className="ms-2" onClick={() => setShowLowStockOnly(false)}>Show All</CButton>
            </CAlert>
          )}
        </CCol>
      </CRow>

      {/* Product Table */}
      {alert && <CAlert color={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</CAlert>}
      {loading ? (
        <div className="text-center my-4"><CSpinner color="primary" /></div>
      ) : (
        <>
          <CCard className="shadow-sm">
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <div className="fw-bold fs-5"><CIcon icon={cilBasket} className="me-2" />Product List</div>
                <div className="d-flex gap-2">
                  <CButton color="success" variant="outline" onClick={() => setShowExportModal(true)} disabled={exportLoading}>
                    <CIcon icon={cilInfo} className="me-2" />Export Product List
                  </CButton>
                  {hasPermission && hasPermission('create_product') && (
                    <CButton color="primary" onClick={() => navigate('/products/create')}>
                      <CIcon icon={cilPlus} className="me-2" /> Add New Product
                    </CButton>
                  )}
                </div>
              </div>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable hover responsive className="mb-0 align-middle">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Product</CTableHeaderCell>
                    <CTableHeaderCell>SKU & Brand</CTableHeaderCell>
                    <CTableHeaderCell>Category</CTableHeaderCell>
                    <CTableHeaderCell>Stock</CTableHeaderCell>
                    <CTableHeaderCell>Pricing</CTableHeaderCell>
                    <CTableHeaderCell>Discount (%)</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {(showLowStockOnly ? data.filter(row => row.stock_status === 'low_stock') : data).map(row => (
                    <CTableRow key={row.id}>
                      {/* Product */}
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          {row.image ? (
                            <CImage
                              rounded
                              thumbnail
                              src={row.image_url}
                              width={48}
                              height={48}
                              style={{ objectFit: 'cover', marginRight: 12 }}
                            />
                          ) : (
                            <div className="bg-light d-flex align-items-center justify-content-center" 
                                 style={{ width: 48, height: 48, borderRadius: '0.375rem', marginRight: 12 }}>
                              <div className="text-muted small">No Image</div>
                            </div>
                          )}
                          <div>
                            <div className="fw-bold">{row.name}</div>
                            <div className="text-muted small">{row.unit?.name || ''}</div>
                          </div>
                        </div>
                      </CTableDataCell>
                      {/* SKU & Brand */}
                      <CTableDataCell>
                        <div className="mb-1 text-muted small">SKU: {row.sku || 'N/A'}</div>
                        {row.brand?.name && <div className="small"><span className="text-primary">{row.brand.name}</span></div>}
                      </CTableDataCell>
                      {/* Category */}
                      <CTableDataCell>
                        {row.category?.name || '-'}
                        {row.sub_category?.name && <div className="small text-muted">{row.sub_category.name}</div>}
                      </CTableDataCell>
                      {/* Stock */}
                      <CTableDataCell>
                        <div className="fw-bold">
                          {formatPrice(row.opening_stock || 0)}
                          {row.unit?.name && <span className="text-muted small ms-1">{row.unit.name}</span>}
                        </div>
                        {row.stock_status === 'out_of_stock' ? (
                          <CBadge color="danger" size="sm">Out of Stock</CBadge>
                        ) : row.stock_status === 'low_stock' ? (
                          <CBadge color="warning" size="sm">Low Stock</CBadge>
                        ) : (
                          <CBadge color="success" size="sm">In Stock</CBadge>
                        )}
                        {row.low_stock_alert > 0 && (
                          <div className="small text-muted">Alert: {formatPrice(row.low_stock_alert)}</div>
                        )}
                      </CTableDataCell>
                      {/* Pricing */}
                      <CTableDataCell>
                        <div className="small text-muted">Cost: £{formatPrice(row.purchase_price)}</div>
                        <div>Base: <span className="fw-bold">£{formatPrice(row.sales_price)}</span></div>
                        {row.retailer_sales_price !== undefined && (
                          <div className="small">Retailer: <span className="fw-bold text-success">£{formatPrice(row.retailer_sales_price)}</span></div>
                        )}
                        {row.individual_sales_price !== undefined && (
                          <div className="small">Individual: <span className="fw-bold text-primary">£{formatPrice(row.individual_sales_price)}</span></div>
                        )}
                        {/* Example for discounts, can be replaced with real data */}
                        {row.retail_price && (
                          <div><CBadge color="success" className="me-1">Retail -10.00%</CBadge></div>
                        )}
                        {row.individual_price && (
                          <div><CBadge color="primary" className="me-1">Individual -20.00%</CBadge></div>
                        )}
                      </CTableDataCell>
                      {/* Discount */}
                      <CTableDataCell>
                        {row.discount !== undefined && row.discount !== null && row.discount !== '' ? (
                          <CBadge color="info">{parseFloat(row.discount).toFixed(2)}%</CBadge>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </CTableDataCell>
                      {/* Status */}
                      <CTableDataCell>
                        <span className={`badge bg-${row.status === 'active' ? 'success' : 'secondary'}`}>{row.status}</span>
                      </CTableDataCell>
                      {/* Actions */}
                      <CTableDataCell>
                        {hasPermission && hasPermission('edit_product') && (
                          <CButton size="sm" color="primary" className="me-2" onClick={() => navigate(`/products/edit/${row.id}`)} title="Edit">
                            <CIcon icon={cilPencil} />
                          </CButton>
                        )}
                        {hasPermission && hasPermission('delete_product') && (
                          <CButton size="sm" color="danger" onClick={() => handleDelete(row.id)} title="Delete">
                            <CIcon icon={cilTrash} />
                          </CButton>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
          <CRow className="justify-content-center mt-3">
            <CCol xs="auto">
              <CPagination align="center" aria-label="Page navigation">
                {[...Array(pagination.last_page)].map((_, i) => (
                  <CPaginationItem
                    key={i + 1}
                    active={pagination.current_page === i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    style={{ cursor: 'pointer' }}
                  >
                    {i + 1}
                  </CPaginationItem>
                ))}
              </CPagination>
            </CCol>
          </CRow>
          <div className="text-center text-muted mt-2">
            Total: {pagination.total}
            {stockStatus && ` (Filtered by stock status)`}
          </div>
        </>
      )}
      <CModal visible={showExportModal} onClose={() => setShowExportModal(false)}>
        <CModalHeader onClose={() => setShowExportModal(false)}>
          <span>Export Product List</span>
        </CModalHeader>
        <CModalBody>
          <div className="d-flex flex-column gap-2 mb-3">
            <label className="form-label fw-bold">Select Price Type for PDF:</label>
            <div className="form-check">
              <input type="radio" className="form-check-input" id="price-base" name="priceType" value="base" checked={selectedPrice === 'base'} onChange={() => setSelectedPrice('base')} />
              <label className="form-check-label" htmlFor="price-base">Base Price</label>
            </div>
            <div className="form-check">
              <input type="radio" className="form-check-input" id="price-retailer" name="priceType" value="retailer" checked={selectedPrice === 'retailer'} onChange={() => setSelectedPrice('retailer')} />
              <label className="form-check-label" htmlFor="price-retailer">Retailer Price</label>
            </div>
            <div className="form-check">
              <input type="radio" className="form-check-input" id="price-customer" name="priceType" value="customer" checked={selectedPrice === 'customer'} onChange={() => setSelectedPrice('customer')} />
              <label className="form-check-label" htmlFor="price-customer">Customer Price</label>
            </div>
          </div>
          <div className="d-flex flex-column gap-2 mb-3">
            <label className="form-label fw-bold">Stock Filter:</label>
            <div className="form-check">
              <input 
                type="radio" 
                className="form-check-input" 
                id="stock-all" 
                name="stockFilter" 
                value="all" 
                checked={stockFilter === 'all'} 
                onChange={() => setStockFilter('all')} 
              />
              <label className="form-check-label" htmlFor="stock-all">All stock</label>
            </div>
            <div className="form-check">
              <input 
                type="radio" 
                className="form-check-input" 
                id="stock-available" 
                name="stockFilter" 
                value="available" 
                checked={stockFilter === 'available'} 
                onChange={() => setStockFilter('available')} 
              />
              <label className="form-check-label" htmlFor="stock-available">Only Available Stock</label>
            </div>
          </div>
          <div className="d-flex flex-column gap-2">
            <div className="form-check">
              <input 
                type="checkbox" 
                className="form-check-input" 
                id="with-price" 
                checked={withPrice} 
                onChange={(e) => setWithPrice(e.target.checked)} 
              />
              <label className="form-check-label" htmlFor="with-price">
                With price
              </label>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={() => setShowExportModal(false)} disabled={exportLoading}>Cancel</CButton>
          <CButton color="success" onClick={handleExportPDF} disabled={exportLoading}>
            {exportLoading ? (<><CSpinner size="sm" className="me-2" />Exporting...</>) : 'Export Product List'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}

export default ProductList; 