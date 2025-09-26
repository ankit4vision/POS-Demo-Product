import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../config/axios';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import {
  CCard, CCardHeader, CCardBody, CButton, CAlert, CSpinner, CForm, CFormInput, CFormSelect, CFormTextarea,
  CFormLabel, CRow, CCol, CImage, CInputGroup, CInputGroupText
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilBasket } from '@coreui/icons';
import PermissionGuard from '../../components/PermissionGuard';

const API_URL = '/products';

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: '',
    sku: '',
    barcode: '',
    category_id: '',
    sub_category_id: '',
    brand_id: '',
    unit_id: '',
    purchase_price: '0',
    sales_price: '0',
    retailer_sales_price: '0',
    individual_sales_price: '0',
    last_purchase_price: '',
    vat_percent: '',
    opening_stock: '',
    low_stock_alert: '',
    description: '',
    status: 'active',
    discount: '',
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImagePath, setUploadedImagePath] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageDeleting, setImageDeleting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, brandsRes, unitsRes] = await Promise.all([
        api.get('/categories', {
          params: {
            per_page: 1000, // Get all categories
            status: 'active' // Only active categories
          }
        }),
        api.get('/brands', {
          params: {
            per_page: 1000, // Get all brands
            status: 'active' // Only active brands
          }
        }),
        api.get('/units', {
          params: {
            per_page: 1000, // Get all units
            status: 'active' // Only active units
          }
        })
      ]);

      // Handle paginated responses
      const categoriesData = categoriesRes.data.data || categoriesRes.data || [];
      const brandsData = brandsRes.data.data || brandsRes.data || [];
      const unitsData = unitsRes.data.data || unitsRes.data || [];

      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setBrands(Array.isArray(brandsData) ? brandsData : []);
      setUnits(Array.isArray(unitsData) ? unitsData : []);

      if (isEdit) {
        const productRes = await api.get(`${API_URL}/${id}`);
        const product = productRes.data;
        
        console.log('Product data received:', product);
        
        setForm({
          name: product.name || '',
          sku: product.sku || '',
          barcode: product.barcode || '',
          category_id: product.category_id || '',
          sub_category_id: product.sub_category_id || '',
          brand_id: product.brand_id || '',
          unit_id: product.unit_id || '',
          purchase_price: product.purchase_price?.toString() || '0',
          sales_price: product.sales_price?.toString() || '0',
          retailer_sales_price: product.retailer_sales_price?.toString() || '0',
          individual_sales_price: product.individual_sales_price?.toString() || '0',
          last_purchase_price: product.last_purchase_price?.toString() || '',
          vat_percent: product.vat_percent?.toString() || '',
          opening_stock: product.opening_stock?.toString() || '',
          low_stock_alert: product.low_stock_alert?.toString() || '',
          description: product.description || '',
          status: product.status || 'active',
          discount: product.discount?.toString() || '',
        });

        console.log('Form state after setting:', {
          name: product.name || '',
          purchase_price: product.purchase_price?.toString() || '0',
          sales_price: product.sales_price?.toString() || '0',
          retailer_sales_price: product.retailer_sales_price?.toString() || '0',
          individual_sales_price: product.individual_sales_price?.toString() || '0',
          status: product.status || 'active'
        });

        if (product.image) {
          setImagePreview(product.image_url);
          setUploadedImagePath(product.image);
        }

        // Load sub-categories if category is selected
        if (product.category_id) {
          loadSubCategories(product.category_id);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setAlert({ type: 'danger', msg: 'Failed to load data.' });
    } finally {
      setLoading(false);
    }
  };

  const loadSubCategories = async (categoryId) => {
    try {
      const response = await api.get('/sub-categories', {
        params: { 
          category_id: categoryId,
          per_page: 1000, // Get all sub-categories for this category
          status: 'active' // Only active sub-categories
        }
      });
      const subCategoriesData = response.data.data || response.data || [];
      setSubCategories(Array.isArray(subCategoriesData) ? subCategoriesData : []);
    } catch (error) {
      console.error('Failed to load sub-categories:', error);
      setSubCategories([]);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUploading(true);
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      try {
        // Upload image immediately
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await api.post('/products/upload-image', formData);
        
        if (response.data.data) {
          setUploadedImagePath(response.data.data.image_path);
          setAlert({ type: 'success', msg: 'Image uploaded successfully!' });
        }
      } catch (error) {
        console.error('Image upload error:', error);
        setAlert({ type: 'danger', msg: error.response?.data?.message || 'Failed to upload image.' });
        // Reset image selection on error
        setImageFile(null);
        setImagePreview(null);
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setForm({ ...form, category_id: categoryId, sub_category_id: '' });
    setSubCategories([]);
    
    if (categoryId) {
      loadSubCategories(categoryId);
    }
  };

  const handleDeleteImage = async () => {
    if (!isEdit || !uploadedImagePath) return;
    
    if (window.confirm('Are you sure you want to delete this image?')) {
      setImageDeleting(true);
      try {
        await api.delete(`${API_URL}/${id}/image`);
        setUploadedImagePath(null);
        setImagePreview(null);
        setImageFile(null);
        setAlert({ type: 'success', msg: 'Image deleted successfully!' });
      } catch (error) {
        console.error('Error deleting image:', error);
        setAlert({ type: 'danger', msg: error.response?.data?.message || 'Failed to delete image.' });
      } finally {
        setImageDeleting(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      let response;
      
      // Prepare form data with uploaded image path
      const formData = {
        ...form,
        image: uploadedImagePath // Use the uploaded image path
      };
      
      if (isEdit) {
        // For updates, always send as JSON
        response = await api.put(`${API_URL}/${id}`, formData);
      } else {
        // For creates, always send as JSON
        response = await api.post(API_URL, formData);
      }

      setAlert({ type: 'success', msg: `Product ${isEdit ? 'updated' : 'created'} successfully!` });
      setTimeout(() => navigate('/products'), 1500);
    } catch (error) {
      console.error('Submit error:', error.response?.data);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setAlert({ type: 'danger', msg: error.response?.data?.message || 'An error occurred.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const getError = (field) => {
    return errors[field] ? errors[field][0] : null;
  };

  return (
    <>
      <AppBreadcrumb />
      <CCard className="mt-4 shadow-sm">
        <CCardHeader>
          <strong>{isEdit ? 'Edit' : 'Add'} Product</strong>
        </CCardHeader>
        <CCardBody>
          {alert && <CAlert color={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</CAlert>}
          
          {loading && !isEdit ? (
            <div className="text-center my-4"><CSpinner color="primary" /></div>
          ) : (
            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md={8}>
                  {/* Basic Information */}
                  <h5 className="mb-3">Basic Information</h5>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel htmlFor="name">Product Name *</CFormLabel>
                      <CFormInput
                        id="name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        invalid={!!getError('name')}
                        feedback={getError('name')}
                        required
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="sku">SKU</CFormLabel>
                      <CFormInput
                        id="sku"
                        value={form.sku}
                        onChange={e => setForm({ ...form, sku: e.target.value })}
                        invalid={!!getError('sku')}
                        feedback={getError('sku')}
                      />
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel htmlFor="barcode">Barcode</CFormLabel>
                      <CFormInput
                        id="barcode"
                        value={form.barcode}
                        onChange={e => setForm({ ...form, barcode: e.target.value })}
                        invalid={!!getError('barcode')}
                        feedback={getError('barcode')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="status">Status *</CFormLabel>
                      <CFormSelect
                        id="status"
                        value={form.status}
                        onChange={e => setForm({ ...form, status: e.target.value })}
                        options={[
                          { label: 'Active', value: 'active' },
                          { label: 'Inactive', value: 'inactive' }
                        ]}
                        required
                      />
                    </CCol>
                  </CRow>

                  {/* Categories */}
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel htmlFor="category_id">Category</CFormLabel>
                      <CFormSelect
                        id="category_id"
                        value={form.category_id}
                        onChange={handleCategoryChange}
                        options={[
                          { label: 'Select Category', value: '' },
                          ...(Array.isArray(categories) ? categories.map(cat => ({ label: cat.name, value: cat.id })) : [])
                        ]}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="sub_category_id">Sub Category</CFormLabel>
                      <CFormSelect
                        id="sub_category_id"
                        value={form.sub_category_id}
                        onChange={e => setForm({ ...form, sub_category_id: e.target.value })}
                        options={[
                          { label: 'Select Sub Category', value: '' },
                          ...(Array.isArray(subCategories) ? subCategories.map(sub => ({ label: sub.name, value: sub.id })) : [])
                        ]}
                        disabled={!form.category_id}
                      />
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel htmlFor="brand_id">Brand</CFormLabel>
                      <CFormSelect
                        id="brand_id"
                        value={form.brand_id}
                        onChange={e => setForm({ ...form, brand_id: e.target.value })}
                        options={[
                          { label: 'Select Brand', value: '' },
                          ...(Array.isArray(brands) ? brands.map(brand => ({ label: brand.name, value: brand.id })) : [])
                        ]}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="unit_id">Unit</CFormLabel>
                      <CFormSelect
                        id="unit_id"
                        value={form.unit_id}
                        onChange={e => setForm({ ...form, unit_id: e.target.value })}
                        options={[
                          { label: 'Select Unit', value: '' },
                          ...(Array.isArray(units) ? units.map(unit => ({ label: unit.name, value: unit.id })) : [])
                        ]}
                      />
                    </CCol>
                  </CRow>

                  {/* Pricing */}
                  <h5 className="mb-3 mt-4">Pricing</h5>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel htmlFor="purchase_price">Purchase Price *</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText>£</CInputGroupText>
                        <CFormInput
                          id="purchase_price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.purchase_price}
                          onChange={e => setForm({ ...form, purchase_price: e.target.value })}
                          invalid={!!getError('purchase_price')}
                          feedback={getError('purchase_price')}
                          required
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="sales_price">Sales Price *</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText>£</CInputGroupText>
                        <CFormInput
                          id="sales_price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.sales_price}
                          onChange={e => setForm({ ...form, sales_price: e.target.value })}
                          invalid={!!getError('sales_price')}
                          feedback={getError('sales_price')}
                          required
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel htmlFor="retailer_sales_price">
                        Retailer Sales Price* (SHOP) <CIcon icon={cilBasket} className="ms-1" />
                      </CFormLabel>
                      <CInputGroup>
                        <CInputGroupText>£</CInputGroupText>
                        <CFormInput
                          id="retailer_sales_price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.retailer_sales_price}
                          onChange={e => setForm({ ...form, retailer_sales_price: e.target.value })}
                          invalid={!!getError('retailer_sales_price')}
                          feedback={getError('retailer_sales_price')}
                          required
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="individual_sales_price">
                        Customer Sales Price * <CIcon icon={cilUser} className="ms-1" />
                      </CFormLabel>
                      <CInputGroup>
                        <CInputGroupText>£</CInputGroupText>
                        <CFormInput
                          id="individual_sales_price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.individual_sales_price}
                          onChange={e => setForm({ ...form, individual_sales_price: e.target.value })}
                          invalid={!!getError('individual_sales_price')}
                          feedback={getError('individual_sales_price')}
                          required
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel htmlFor="last_purchase_price">Last Purchase Price</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText>£</CInputGroupText>
                        <CFormInput
                          id="last_purchase_price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.last_purchase_price}
                          onChange={e => setForm({ ...form, last_purchase_price: e.target.value })}
                          invalid={!!getError('last_purchase_price')}
                          feedback={getError('last_purchase_price')}
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="vat_percent">VAT %</CFormLabel>
                      <CInputGroup>
                        <CFormInput
                          id="vat_percent"
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={form.vat_percent}
                          onChange={e => setForm({ ...form, vat_percent: e.target.value })}
                          invalid={!!getError('vat_percent')}
                          feedback={getError('vat_percent')}
                        />
                        <CInputGroupText>%</CInputGroupText>
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel htmlFor="discount">Discount (%)</CFormLabel>
                      <CFormInput
                        type="number"
                        id="discount"
                        name="discount"
                        min={0}
                        max={100}
                        step={0.01}
                        value={form.discount}
                        onChange={e => setForm({ ...form, discount: e.target.value })}
                        placeholder="Enter discount percentage"
                        invalid={!!getError('discount')}
                      />
                      {getError('discount') && <div className="invalid-feedback d-block">{getError('discount')}</div>}
                    </CCol>
                  </CRow>

                  {/* Stock Information */}
                  <h5 className="mb-3 mt-4">Stock Information</h5>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel htmlFor="opening_stock">Opening Stock</CFormLabel>
                      <CFormInput
                        id="opening_stock"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.opening_stock}
                        onChange={e => setForm({ ...form, opening_stock: e.target.value })}
                        invalid={!!getError('opening_stock')}
                        feedback={getError('opening_stock')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="low_stock_alert">Low Stock Alert</CFormLabel>
                      <CFormInput
                        id="low_stock_alert"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.low_stock_alert}
                        onChange={e => setForm({ ...form, low_stock_alert: e.target.value })}
                        invalid={!!getError('low_stock_alert')}
                        feedback={getError('low_stock_alert')}
                      />
                    </CCol>
                  </CRow>

                  <CFormLabel htmlFor="description">Description</CFormLabel>
                  <CFormTextarea
                    id="description"
                    rows={3}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    invalid={!!getError('description')}
                    feedback={getError('description')}
                    className="mb-3"
                  />
                </CCol>

                <CCol md={4}>
                  {/* Image Upload */}
                  <h5 className="mb-3">Product Image</h5>
                  <div className="text-center mb-3">
                    {imagePreview ? (
                      <div className="position-relative d-inline-block">
                        <CImage
                          rounded
                          thumbnail
                          src={imagePreview}
                          width={200}
                          height={200}
                          style={{ objectFit: 'cover' }}
                          className="mb-3"
                        />
                        {isEdit && uploadedImagePath && (
                          <PermissionGuard requiredPermissions={['edit_product']}>
                            <CButton
                              color="danger"
                              size="sm"
                              className="position-absolute top-0 end-0"
                              style={{ 
                                borderRadius: '50%', 
                                width: '30px', 
                                height: '30px', 
                                padding: '0',
                                marginTop: '5px',
                                marginRight: '5px'
                              }}
                              onClick={handleDeleteImage}
                              disabled={imageDeleting}
                              title="Delete image"
                            >
                              {imageDeleting ? <CSpinner size="sm" /> : '×'}
                            </CButton>
                          </PermissionGuard>
                        )}
                      </div>
                    ) : (
                      <div className="bg-light d-flex align-items-center justify-content-center mb-3" 
                           style={{ width: 200, height: 200, borderRadius: '0.375rem' }}>
                        <div className="text-muted">No Image</div>
                      </div>
                    )}
                    <CFormInput
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={imageUploading}
                      invalid={!!getError('image')}
                      feedback={getError('image')}
                    />
                    {imageUploading && (
                      <div className="mt-2">
                        <CSpinner size="sm" /> Uploading image...
                      </div>
                    )}
                    {uploadedImagePath && (
                      <div className="mt-2 text-success">
                        <small>✓ Image uploaded successfully</small>
                      </div>
                    )}
                    <small className="text-muted d-block mt-2">
                      Supported formats: JPEG, PNG, JPG, GIF (Max: 2MB)
                    </small>
                  </div>
                </CCol>
              </CRow>

              <div className="d-flex justify-content-end gap-2">
                <CButton color="secondary" onClick={() => navigate('/products')}>
                  Cancel
                </CButton>
                <PermissionGuard requiredPermissions={[isEdit ? 'edit_product' : 'create_product']}>
                  <CButton color="primary" type="submit" disabled={loading}>
                    {loading ? <CSpinner size="sm" /> : (isEdit ? 'Update' : 'Create')}
                  </CButton>
                </PermissionGuard>
              </div>
            </CForm>
          )}
        </CCardBody>
      </CCard>
    </>
  );
}

export default ProductForm; 