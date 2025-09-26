import api from '../config/axios';

// Employee CRUD
export const fetchEmployees = (search = '') => api.get('/employees', { params: { search } });
export const fetchEmployee = (id) => api.get(`/employees/${id}`);
export const createEmployee = (data) => api.post('/employees', data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// Salary Records
export const fetchSalaries = (employeeId) => api.get(`/employees/${employeeId}/salaries`);
export const createSalary = (employeeId, data) => api.post(`/employees/${employeeId}/salaries`, data);
export const updateSalary = (salaryId, data) => api.put(`/employee-salaries/${salaryId}`, data);
export const deleteSalary = (salaryId) => api.delete(`/employee-salaries/${salaryId}`); 