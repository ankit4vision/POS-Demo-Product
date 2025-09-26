import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import PermissionGuard from './PermissionGuard'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CAlert,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
  CInputGroup,
  CInputGroupText,
  CListGroup,
  CListGroupItem,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
} from '@coreui/react'
import {
  cilPlus,
  cilPencil,
  cilTrash,
  cilPrint,
  cilEnvelopeClosed,
  cilSettings,
  cilUser,
  cilShieldAlt,
  cilCheck,
  cilX,
  cilInfo,
  cilWarning,
  cilBan,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const PermissionExample = () => {
  const { user, permissions, hasPermission, hasRole } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState('')

  const permissionExamples = [
    {
      category: 'Basic CRUD Operations',
      examples: [
        {
          title: 'Create Customer',
          permission: 'create_customer',
          description: 'Allow users to create new customer records',
          icon: cilPlus,
          color: 'success'
        },
        {
          title: 'View Products',
          permission: 'view_product',
          description: 'Allow users to view product catalog',
          icon: cilInfo,
          color: 'info'
        },
        {
          title: 'Edit Supplier',
          permission: 'edit_supplier',
          description: 'Allow users to modify supplier information',
          icon: cilPencil,
          color: 'warning'
        },
        {
          title: 'Delete Employee',
          permission: 'delete_employee',
          description: 'Allow users to remove employee records',
          icon: cilTrash,
          color: 'danger'
        }
      ]
    },
    {
      category: 'Document Operations',
      examples: [
        {
          title: 'Print Invoice',
          permission: 'print_sale',
          description: 'Allow users to print sales invoices',
          icon: cilPrint,
          color: 'primary'
        },
        {
          title: 'Print Purchase Order',
          permission: 'print_purchaseorder',
          description: 'Allow users to print purchase orders',
          icon: cilPrint,
          color: 'primary'
        },
        {
          title: 'Email Customer',
          permission: 'email_customer',
          description: 'Allow users to send emails to customers',
          icon: cilEnvelopeClosed,
          color: 'info'
        },
        {
          title: 'Email Supplier',
          permission: 'email_supplier',
          description: 'Allow users to send emails to suppliers',
          icon: cilEnvelopeClosed,
          color: 'info'
        }
      ]
    },
    {
      category: 'Export Operations',
      examples: [
        {
          title: 'Export Products',
          permission: 'export_product',
          description: 'Allow users to export product data to PDF/Excel',
          icon: cilInfo,
          color: 'success'
        },
        {
          title: 'Export Sales Report',
          permission: 'export_sale',
          description: 'Allow users to export sales reports',
          icon: cilInfo,
          color: 'success'
        },
        {
          title: 'Export Wallet Ledger',
          permission: 'export_wallet',
          description: 'Allow users to export wallet ledger data',
          icon: cilInfo,
          color: 'success'
        }
      ]
    },
    {
      category: 'System Operations',
      examples: [
        {
          title: 'Manage Roles',
          permission: 'manage_roles',
          description: 'Allow users to manage user roles and permissions',
          icon: cilShieldAlt,
          color: 'warning'
        },
        {
          title: 'Assign Permissions',
          permission: 'assign_permissions',
          description: 'Allow users to assign permissions to roles',
          icon: cilUser,
          color: 'warning'
        },
        {
          title: 'Manage Settings',
          permission: 'manage_settings',
          description: 'Allow users to manage system settings',
          icon: cilSettings,
          color: 'secondary'
        },
        {
          title: 'View Reports',
          permission: 'view_reports',
          description: 'Allow users to view system reports and analytics',
          icon: cilInfo,
          color: 'info'
        }
      ]
    }
  ]

  const testPermission = (permission) => {
    setSelectedPermission(permission)
    setShowModal(true)
  }

  const getPermissionStatus = (permission) => {
    if (hasRole('admin')) return { status: 'Admin Access', color: 'success', icon: cilCheck }
    if (hasPermission(permission)) return { status: 'Has Permission', color: 'success', icon: cilCheck }
    return { status: 'No Permission', color: 'danger', icon: cilX }
  }

  return (
    <div className="container-fluid">
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h4 className="mb-0">
                <CIcon icon={cilShieldAlt} className="me-2" />
                Permission System Examples
              </h4>
            </CCardHeader>
            <CCardBody>
              <CAlert color="info" className="mb-4">
                <strong>Current User:</strong> {user?.name} ({user?.email})<br />
                <strong>Role:</strong> {user?.role?.name || 'No Role'}<br />
                <strong>Total Permissions:</strong> {permissions?.length || 0}
              </CAlert>

              <CAccordion flush>
                {permissionExamples.map((category, categoryIndex) => (
                  <CAccordionItem key={categoryIndex}>
                    <CAccordionHeader>
                      <strong>{category.category}</strong>
                      <CBadge color="secondary" className="ms-2">
                        {category.examples.length} examples
                      </CBadge>
                    </CAccordionHeader>
                    <CAccordionBody>
                      <CRow>
                        {category.examples.map((example, exampleIndex) => {
                          const status = getPermissionStatus(example.permission)
                          return (
                            <CCol key={exampleIndex} lg={6} xl={4} className="mb-3">
                              <CCard className="h-100">
                                <CCardBody>
                                  <div className="d-flex align-items-center mb-2">
                                    <CIcon 
                                      icon={example.icon} 
                                      className={`text-${example.color} me-2`}
                                      size="lg"
                                    />
                                    <h6 className="mb-0">{example.title}</h6>
                                  </div>
                                  
                                  <p className="small text-muted mb-3">
                                    {example.description}
                                  </p>
                                  
                                  <div className="d-flex align-items-center mb-3">
                                    <CBadge color={status.color} className="me-2">
                                      <CIcon icon={status.icon} className="me-1" />
                                      {status.status}
                                    </CBadge>
                                    <small className="text-muted">
                                      Permission: <code>{example.permission}</code>
                                    </small>
                                  </div>

                                  <div className="d-flex gap-2">
                                    <PermissionGuard requiredPermissions={[example.permission]}>
                                      <CButton 
                                        color={example.color} 
                                        size="sm"
                                        onClick={() => testPermission(example.permission)}
                                      >
                                        <CIcon icon={example.icon} className="me-1" />
                                        Test Action
                                      </CButton>
                                    </PermissionGuard>
                                    
                                    <PermissionGuard 
                                      requiredPermissions={[example.permission]}
                                      fallback={
                                        <CButton 
                                          color="secondary" 
                                          size="sm" 
                                          disabled
                                          title="You don't have permission for this action"
                                        >
                                          <CIcon icon={cilBan} className="me-1" />
                                          No Access
                                        </CButton>
                                      }
                                    >
                                      <CButton 
                                        color="outline-secondary" 
                                        size="sm"
                                        onClick={() => testPermission(example.permission)}
                                      >
                                        <CIcon icon={example.icon} className="me-1" />
                                        With Fallback
                                      </CButton>
                                    </PermissionGuard>
                                  </div>
                                </CCardBody>
                              </CCard>
                            </CCol>
                          )
                        })}
                      </CRow>
                    </CAccordionBody>
                  </CAccordionItem>
                ))}
              </CAccordion>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Permission Test Modal */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilCheck} className="text-success me-2" />
            Permission Test Successful
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CAlert color="success">
            <strong>Permission Granted!</strong><br />
            You have the required permission: <code>{selectedPermission}</code>
          </CAlert>
          <p>
            This action would normally perform the intended operation. 
            In a real application, this would trigger the actual functionality.
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default PermissionExample 