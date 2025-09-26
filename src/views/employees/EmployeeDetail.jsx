import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCardHeader, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAlert, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormInput, CFormLabel, CSpinner } from '@coreui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEmployee, fetchSalaries, createSalary, updateSalary, deleteSalary } from '../../api/employee';
import { useAuth } from '../../context/AuthContext'

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salaryModal, setSalaryModal] = useState(false);
  const [salaryForm, setSalaryForm] = useState({ month: '', base_salary: '', allowances: '', deductions: '', notes: '' });
  const [editingSalary, setEditingSalary] = useState(null);
  const [alert, setAlert] = useState(null);
  const { hasPermission } = useAuth();

  const load = async () => {
    setLoading(true);
    const empRes = await fetchEmployee(id);
    setEmployee(empRes.data);
    const salRes = await fetchSalaries(id);
    setSalaries(salRes.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const openAddSalary = () => {
    setEditingSalary(null);
    setSalaryForm({ month: '', base_salary: '', allowances: '', deductions: '', notes: '' });
    setSalaryModal(true);
  };

  const openEditSalary = (salary) => {
    setEditingSalary(salary.id);
    setSalaryForm({ ...salary });
    setSalaryModal(true);
  };

  const handleSalaryChange = e => setSalaryForm({ ...salaryForm, [e.target.name]: e.target.value });

  const handleSalarySubmit = async e => {
    e.preventDefault();
    try {
      if (editingSalary) await updateSalary(editingSalary, salaryForm);
      else await createSalary(id, salaryForm);
      setSalaryModal(false);
      load();
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Error' });
    }
  };

  const handleDeleteSalary = async (salaryId) => {
    if (window.confirm('Delete this salary record?')) {
      await deleteSalary(salaryId);
      load();
    }
  };

  if (loading) return <CSpinner />;

  return (
    <CCard className="mt-4 shadow-sm">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <strong>Employee Details</strong>
        <CButton color="secondary" onClick={() => navigate('/employees')}>Back</CButton>
      </CCardHeader>
      <CCardBody>
        {alert && <CAlert color={alert.type}>{alert.msg}</CAlert>}
        <div className="mb-4">
          <h5>{employee.first_name} {employee.last_name}</h5>
          <div>Email: {employee.email}</div>
          <div>Phone: {employee.phone}</div>
          <div>Designation: {employee.designation}</div>
          <div>Department: {employee.department}</div>
          <div>Address: {employee.address}</div>
          <div>Date of Joining: {employee.date_of_joining}</div>
          <div>Status: <span className={`badge bg-${employee.status === 'active' ? 'success' : employee.status === 'inactive' ? 'secondary' : 'danger'}`}>{employee.status}</span></div>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6>Salary Records</h6>
          {hasPermission && hasPermission('create_employee') && (
            <CButton color="primary" size="sm" onClick={openAddSalary}>Add Salary Record</CButton>
          )}
        </div>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Month</CTableHeaderCell>
              <CTableHeaderCell>Base Salary</CTableHeaderCell>
              <CTableHeaderCell>Allowances</CTableHeaderCell>
              <CTableHeaderCell>Deductions</CTableHeaderCell>
              <CTableHeaderCell>Net Salary</CTableHeaderCell>
              <CTableHeaderCell>Notes</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {salaries.map(sal => (
              <CTableRow key={sal.id}>
                <CTableDataCell>{sal.month}</CTableDataCell>
                <CTableDataCell>£{parseFloat(sal.base_salary).toFixed(2)}</CTableDataCell>
                <CTableDataCell>£{parseFloat(sal.allowances).toFixed(2)}</CTableDataCell>
                <CTableDataCell>£{parseFloat(sal.deductions).toFixed(2)}</CTableDataCell>
                <CTableDataCell>£{parseFloat(sal.net_salary).toFixed(2)}</CTableDataCell>
                <CTableDataCell>{sal.notes}</CTableDataCell>
                <CTableDataCell>
                  <div className="btn-group" role="group">
                    {hasPermission && hasPermission('edit_employee') && (
                      <CButton size="sm" color="primary" className="me-2" onClick={() => openEditSalary(sal)}>Edit</CButton>
                    )}
                    {hasPermission && hasPermission('delete_employee') && (
                      <CButton size="sm" color="danger" onClick={() => handleDeleteSalary(sal.id)}>Delete</CButton>
                    )}
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>

      {/* Salary Modal */}
      <CModal visible={salaryModal} onClose={() => setSalaryModal(false)}>
        <CModalHeader>{editingSalary ? 'Edit' : 'Add'} Salary Record</CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSalarySubmit}>
            <CFormLabel>Month (YYYY-MM)</CFormLabel>
            <CFormInput name="month" value={salaryForm.month} onChange={handleSalaryChange} required placeholder="2024-07" />
            <CFormLabel>Base Salary</CFormLabel>
            <CFormInput name="base_salary" value={salaryForm.base_salary} onChange={handleSalaryChange} required type="number" min="0" />
            <CFormLabel>Allowances</CFormLabel>
            <CFormInput name="allowances" value={salaryForm.allowances} onChange={handleSalaryChange} type="number" min="0" />
            <CFormLabel>Deductions</CFormLabel>
            <CFormInput name="deductions" value={salaryForm.deductions} onChange={handleSalaryChange} type="number" min="0" />
            <CFormLabel>Notes</CFormLabel>
            <CFormInput name="notes" value={salaryForm.notes} onChange={handleSalaryChange} />
            <div className="mt-3">
              <CButton type="submit" color="primary">{editingSalary ? 'Update' : 'Add'}</CButton>
              <CButton type="button" color="secondary" className="ms-2" onClick={() => setSalaryModal(false)}>Cancel</CButton>
            </div>
          </CForm>
        </CModalBody>
      </CModal>
    </CCard>
  );
};

export default EmployeeDetail; 