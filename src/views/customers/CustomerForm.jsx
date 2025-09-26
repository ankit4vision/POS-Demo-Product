import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../config/axios';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import {
  CCard, CCardHeader, CCardBody, CButton, CAlert, CSpinner, CForm, CFormInput, CFormSelect, CFormTextarea,
  CFormLabel, CRow, CCol, CInputGroup, CInputGroupText
} from '@coreui/react';
import { cilSave, cilArrowLeft, cilUser, cilBasket } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const API_URL = '/customers';

function CustomerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    type: 'customer',
    name: '',
    phone: '',
    email: '',
    gst_number: '',
    address: '',
    status: 'active'
  });

  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      loadCustomer();
    }
  }, [id]);

  const loadCustomer = () => {
    setLoading(true);
    api.get(`${API_URL}/${id}`)
      .then(response => {
        const customer = response.data;
        setForm({
          type: customer.type || 'customer',
          name: customer.name || '',
          phone: customer.phone || '',
          email: customer.email || '',
          gst_number: customer.gst_number || '',
          address: customer.address || '',
          status: customer.status || 'active'
        });
      })
      .catch(err => {
        setAlert({ type: 'danger', msg: err.response?.data?.message || 'Error loading customer' });
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const method = isEdit ? 'put' : 'post';
    const url = isEdit ? `${API_URL}/${id}` : API_URL;

    api[method](url, form)
      .then(response => {
        setAlert({ type: 'success', msg: response.data.message });
        if (!isEdit) {
          // Reset form after successful creation
          setForm({
            type: 'customer',
            name: '',
            phone: '',
            email: '',
            gst_number: '',
            address: '',
            status: 'active'
          });
        }
      })
      .catch(err => {
        if (err.response?.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          setAlert({ type: 'danger', msg: err.response?.data?.message || 'Error saving customer' });
        }
      })
      .finally(() => setLoading(false));
  };

  const getError = (field) => {
    return errors[field] ? errors[field][0] : null;
  };

  const getTypeIcon = () => {
    return form.type === 'customer' ? 
      <CIcon icon={cilUser} className="me-2" /> : 
      <CIcon icon={cilBasket} className="me-2" />;
  };

  return (
    <>
      <AppBreadcrumb />
      
      <div className="mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1">
              {getTypeIcon()}
              {isEdit ? 'Edit Customer' : 'Add New Customer'}
            </h2>
            <div className="text-muted">
              {isEdit ? 'Update customer information' : 'Create a new customer or retailer'}
            </div>
          </div>
          <CButton 
            color="outline-secondary" 
            onClick={() => navigate('/customers')}
          >
            <CIcon icon={cilArrowLeft} className="me-2" /> Back to List
          </CButton>
        </div>
      </div>

      {alert && <CAlert color={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</CAlert>}

      <CCard className="shadow-sm">
        <CCardHeader>
          <h5 className="mb-0">Customer Information</h5>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow>
              {/* Type Selection */}
              <CCol md={6}>
                <CFormLabel htmlFor="type">
                  Type *
                </CFormLabel>
                <div className="d-flex gap-4 mt-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="type"
                      id="type_customer"
                      value="customer"
                      checked={form.type === 'customer'}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      required
                    />
                    <label className="form-check-label" htmlFor="type_customer">
                      <CIcon icon={cilUser} className="me-2" />
                      Customer
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="type"
                      id="type_retailer"
                      value="retailer"
                      checked={form.type === 'retailer'}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      required
                    />
                    <label className="form-check-label" htmlFor="type_retailer">
                      <CIcon icon={cilBasket} className="me-2" />
                      Retailer (SHOP)
                    </label>
                  </div>
                </div>
              </CCol>

              {/* Status */}
              <CCol md={6}>
                <CFormLabel htmlFor="status">Status *</CFormLabel>
                <CFormSelect
                  id="status"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  invalid={!!getError('status')}
                  feedback={getError('status')}
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mt-3">
              {/* Name */}
              <CCol md={6}>
                <CFormLabel htmlFor="name">Name *</CFormLabel>
                <CFormInput
                  id="name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  invalid={!!getError('name')}
                  feedback={getError('name')}
                  placeholder="Enter full name"
                  required
                />
              </CCol>

              {/* Phone */}
              <CCol md={6}>
                <CFormLabel htmlFor="phone">Phone</CFormLabel>
                <CFormInput
                  id="phone"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  invalid={!!getError('phone')}
                  feedback={getError('phone')}
                  placeholder="Enter phone number"
                />
              </CCol>
            </CRow>

            <CRow className="mt-3">
              {/* Email */}
              <CCol md={6}>
                <CFormLabel htmlFor="email">Email</CFormLabel>
                <CFormInput
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  invalid={!!getError('email')}
                  feedback={getError('email')}
                  placeholder="Enter email address"
                />
              </CCol>

              {/* VAT Number */}
              <CCol md={6}>
                <CFormLabel htmlFor="gst_number">VAT Number</CFormLabel>
                <CFormInput
                  id="gst_number"
                  value={form.gst_number}
                  onChange={e => setForm({ ...form, gst_number: e.target.value })}
                  invalid={!!getError('gst_number')}
                  feedback={getError('gst_number')}
                  placeholder="Enter VAT number"
                />
              </CCol>
            </CRow>

            <CRow className="mt-3">
              {/* Address */}
              <CCol md={12}>
                <CFormLabel htmlFor="address">Address</CFormLabel>
                <CFormTextarea
                  id="address"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  invalid={!!getError('address')}
                  feedback={getError('address')}
                  placeholder="Enter complete address"
                  rows={3}
                />
              </CCol>
            </CRow>

            {/* Submit Buttons */}
            <CRow className="mt-4">
              <CCol md={12}>
                <div className="d-flex gap-2">
                  <CButton 
                    type="submit" 
                    color="primary" 
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
                        {isEdit ? 'Update Customer' : 'Create Customer'}
                      </>
                    )}
                  </CButton>
                  <CButton 
                    type="button" 
                    color="outline-secondary"
                    onClick={() => navigate('/customers')}
                    disabled={loading}
                  >
                    Cancel
                  </CButton>
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  );
}

export default CustomerForm; 