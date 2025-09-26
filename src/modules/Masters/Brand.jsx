import React, { useEffect, useState } from 'react';
import api from '../../config/axios';
import {
  CCard, CCardHeader, CCardBody, CButton, CModal, CModalHeader, CModalBody, CModalFooter,
  CForm, CFormInput, CFormSelect, CAlert, CSpinner, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CRow, CCol, CInputGroup, CInputGroupText, CPagination, CPaginationItem
} from '@coreui/react';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import { useAuth } from '../../context/AuthContext';

const API_URL = '/brands';

function Brand() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', status: 'active' });
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const perPage = 10;
  const { hasPermission } = useAuth();

  const load = (page = 1) => {
    setLoading(true);
    api.get(API_URL, {
      params: {
        page,
        per_page: perPage,
        search,
        status,
        sort_by: sortBy,
        sort_order: sortOrder,
      },
    })
      .then(res => {
        setData(res.data.data);
        setPagination({
          current_page: res.data.current_page,
          last_page: res.data.last_page,
          total: res.data.total,
        });
      })
      .catch(() => setAlert({ type: 'danger', msg: 'Failed to load data.' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, status, sortBy, sortOrder]);

  const handleSearch = e => {
    e.preventDefault();
    load(1);
  };

  const handlePageChange = (page) => {
    load(page);
  };

  const handleSave = e => {
    e.preventDefault();
    setLoading(true);
    const req = editId
      ? api.put(`${API_URL}/${editId}`, form)
      : api.post(API_URL, form);
    req.then(() => {
      setModal(false);
      setForm({ name: '', status: 'active' });
      setEditId(null);
      setAlert({ type: 'success', msg: 'Saved successfully!' });
      load();
    }).catch(err => {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Error' });
    }).finally(() => setLoading(false));
  };

  const handleEdit = row => {
    setForm({ name: row.name, status: row.status });
    setEditId(row.id);
    setModal(true);
  };

  const handleDelete = id => {
    if (window.confirm('Delete this record?')) {
      setLoading(true);
      api.delete(`${API_URL}/${id}`).then(() => {
        setAlert({ type: 'success', msg: 'Deleted successfully!' });
        load();
      }).catch(err => {
        setAlert({ type: 'danger', msg: err.response?.data?.message || 'Error' });
      }).finally(() => setLoading(false));
    }
  };

  return (
    <>
      <AppBreadcrumb />
      <CCard className="mt-4 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Brands</strong>
          {hasPermission && hasPermission('create_master') && (
            <CButton color="primary" className="float-end" onClick={() => { setForm({ name: '', status: 'active' }); setEditId(null); setModal(true); }}>Add Brand</CButton>
          )}
        </CCardHeader>
        <CCardBody>
          <CForm className="mb-3" onSubmit={handleSearch} autoComplete="off">
            <CRow className="g-2 align-items-center">
              <CCol md={4}>
                <CInputGroup>
                  <CFormInput
                    placeholder="Search by name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <CInputGroupText>
                    <CButton color="primary" type="submit" size="sm">Search</CButton>
                  </CInputGroupText>
                </CInputGroup>
              </CCol>
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
            </CRow>
          </CForm>
          {alert && <CAlert color={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</CAlert>}
          {loading ? (
            <div className="text-center my-4"><CSpinner color="primary" /></div>
          ) : (
            <>
              <CTable bordered hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        if (sortBy === 'name') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        else { setSortBy('name'); setSortOrder('asc'); }
                      }}
                    >
                      Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.map(row => (
                    <CTableRow key={row.id}>
                      <CTableDataCell>{row.name}</CTableDataCell>
                      <CTableDataCell>
                        <span className={`badge bg-${row.status === 'active' ? 'success' : 'secondary'}`}>{row.status}</span>
                      </CTableDataCell>
                      <CTableDataCell>
                        {hasPermission && hasPermission('edit_master') && (
                          <CButton size="sm" color="primary" className="me-2" onClick={() => handleEdit(row)}>Edit</CButton>
                        )}
                        {hasPermission && hasPermission('delete_master') && (
                          <CButton size="sm" color="danger" onClick={() => handleDelete(row.id)}>Delete</CButton>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
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
              <div className="text-center text-muted mt-2">Total: {pagination.total}</div>
            </>
          )}
        </CCardBody>
        <CModal visible={modal} onClose={() => setModal(false)}>
          <CModalHeader onClose={() => setModal(false)}>{editId ? 'Edit' : 'Add'} Brand</CModalHeader>
          <CForm onSubmit={handleSave}>
            <CModalBody>
              <CFormInput
                label="Name"
                name="name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="mb-3"
              />
              <CFormSelect
                label="Status"
                name="status"
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
                className="mb-3"
              />
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setModal(false)}>Cancel</CButton>
              <CButton color="primary" type="submit">Save</CButton>
            </CModalFooter>
          </CForm>
        </CModal>
      </CCard>
    </>
  );
}

export default Brand; 