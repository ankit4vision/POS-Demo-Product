import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCardHeader, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormInput, CBadge, CSpinner } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees, deleteEmployee } from '../../api/employee';
import { useAuth } from '../../context/AuthContext'

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetchEmployees(search);
      setEmployees(res.data.data || res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEmployees(); }, [search]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this employee?')) {
      await deleteEmployee(id);
      loadEmployees();
    }
  };

  return (
    <CCard className="mt-4 shadow-sm">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <strong>Employees</strong>
        {hasPermission && hasPermission('create_employee') && (
          <CButton color="primary" onClick={() => navigate('/employees/create')}>Add Employee</CButton>
        )}
      </CCardHeader>
      <CCardBody>
        <CFormInput
          placeholder="Search by name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-3"
        />
        {loading ? <CSpinner /> : (
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Phone</CTableHeaderCell>
                <CTableHeaderCell>Department</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {employees.map(emp => (
                <CTableRow key={emp.id}>
                  <CTableDataCell>{emp.first_name} {emp.last_name}</CTableDataCell>
                  <CTableDataCell>{emp.email}</CTableDataCell>
                  <CTableDataCell>{emp.phone}</CTableDataCell>
                  <CTableDataCell>{emp.department}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={emp.status === 'active' ? 'success' : emp.status === 'inactive' ? 'secondary' : 'danger'}>
                      {emp.status}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="btn-group" role="group">
                      {hasPermission && hasPermission('view_employee') && (
                        <CButton size="sm" color="info" className="me-2" onClick={() => navigate(`/employees/${emp.id}`)}>View</CButton>
                      )}
                      {hasPermission && hasPermission('edit_employee') && (
                        <CButton size="sm" color="primary" className="me-2" onClick={() => navigate(`/employees/edit/${emp.id}`)}>Edit</CButton>
                      )}
                      {hasPermission && hasPermission('delete_employee') && (
                        <CButton size="sm" color="danger" onClick={() => handleDelete(emp.id)}>Delete</CButton>
                      )}
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  );
};

export default EmployeeList; 