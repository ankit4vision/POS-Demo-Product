import React from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const WidgetsTable = () => {
  const tableData = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'User',
      status: 'Inactive',
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@example.com',
      role: 'Manager',
      status: 'Active',
    },
  ]

  return (
    <CTable>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">#</CTableHeaderCell>
          <CTableHeaderCell scope="col">Name</CTableHeaderCell>
          <CTableHeaderCell scope="col">Email</CTableHeaderCell>
          <CTableHeaderCell scope="col">Role</CTableHeaderCell>
          <CTableHeaderCell scope="col">Status</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {tableData.map((item) => (
          <CTableRow key={item.id}>
            <CTableHeaderCell scope="row">{item.id}</CTableHeaderCell>
            <CTableDataCell>{item.name}</CTableDataCell>
            <CTableDataCell>{item.email}</CTableDataCell>
            <CTableDataCell>{item.role}</CTableDataCell>
            <CTableDataCell>{item.status}</CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}

export default WidgetsTable 