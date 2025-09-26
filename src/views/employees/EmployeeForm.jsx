import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCardHeader, CButton, CForm, CFormInput, CFormLabel, CFormSelect, CAlert, CSpinner } from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEmployee, fetchEmployee, updateEmployee } from '../../api/employee';
import { useAuth } from '../../context/AuthContext'

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Terminated', value: 'terminated' },
];

const EmployeeForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '', designation: '',
    department: '', address: '', date_of_joining: '', status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { hasPermission } = useAuth();

  const canRender = (
    (!isEdit && hasPermission && hasPermission('create_employee')) ||
    (isEdit && hasPermission && hasPermission('edit_employee'))
  );
  if (!canRender) {
    return (
      <CCard className="mt-4 shadow-sm">
        <CCardBody>
          <CAlert color="danger">You do not have permission to access this page.</CAlert>
        </CCardBody>
      </CCard>
    );
  }

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      fetchEmployee(id).then(res => setForm(res.data)).finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      if (isEdit) await updateEmployee(id, form);
      else await createEmployee(form);
      navigate('/employees');
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CCard className="mt-4 shadow-sm">
      <CCardHeader>
        <strong>{isEdit ? 'Edit' : 'Add'} Employee</strong>
      </CCardHeader>
      <CCardBody>
        {alert && <CAlert color={alert.type}>{alert.msg}</CAlert>}
        <CForm onSubmit={handleSubmit}>
          <CFormLabel>First Name</CFormLabel>
          <CFormInput name="first_name" value={form.first_name} onChange={handleChange} required />
          <CFormLabel>Last Name</CFormLabel>
          <CFormInput name="last_name" value={form.last_name} onChange={handleChange} required />
          <CFormLabel>Email</CFormLabel>
          <CFormInput name="email" value={form.email} onChange={handleChange} required type="email" />
          <CFormLabel>Phone</CFormLabel>
          <CFormInput name="phone" value={form.phone} onChange={handleChange} />
          <CFormLabel>Designation</CFormLabel>
          <CFormInput name="designation" value={form.designation} onChange={handleChange} />
          <CFormLabel>Department</CFormLabel>
          <CFormInput name="department" value={form.department} onChange={handleChange} />
          <CFormLabel>Address</CFormLabel>
          <CFormInput name="address" value={form.address} onChange={handleChange} />
          <CFormLabel>Date of Joining</CFormLabel>
          <CFormInput name="date_of_joining" value={form.date_of_joining} onChange={handleChange} type="date" />
          <CFormLabel>Status</CFormLabel>
          <CFormSelect name="status" value={form.status} onChange={handleChange} options={statusOptions} />
          <div className="mt-3">
            <CButton type="submit" color="primary" disabled={loading}>{loading ? <CSpinner size="sm" /> : 'Save'}</CButton>
            <CButton type="button" color="secondary" className="ms-2" onClick={() => navigate('/employees')}>Cancel</CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default EmployeeForm; 