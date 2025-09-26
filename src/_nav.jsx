import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilPuzzle,
  cilNotes,
  cilChart,
  cilPeople,
  cilUser,
  cilStar,
  cilPencil,
  cilDrop,
  cilCart,
  cilMenu,
  cilList,
  cilMoney,
  cilBasket,
  cilTags,
  cilStorage,
  cilWarning,
  cilUserFollow,
  cilUserUnfollow,
  cilWallet,
  cilCreditCard,
  cilLockLocked,
  cilShieldAlt,
  cilTruck,
  cilClipboard,
  cilCheckCircle,
  cilSettings,
  cilEnvelopeClosed,
  cilChartPie,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    permissions: ['view_dashboard']
  },
  {
    component: CNavItem,
    name: 'Products',
    to: '/products',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
    permissions: ['view_product']
  },
  {
    component: CNavItem,
    name: 'Customers',
    to: '/customers',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    permissions: ['view_customer']
  },
  {
    component: CNavGroup,
    name: 'Purchase Management',
    to: '/purchase',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
    permissions: ['view_supplier', 'view_purchaseorder', 'view_purchasedorder'],
    items: [
      {
        component: CNavItem,
        name: 'Suppliers',
        to: '/purchase/suppliers',
        icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
        permissions: ['view_supplier']
      },
      {
        component: CNavItem,
        name: 'Purchase Orders',
        to: '/purchases',
        icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
        permissions: ['view_purchaseorder']
      },
      {
        component: CNavItem,
        name: 'Purchased Orders',
        to: '/purchases/purchased',
        icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
        permissions: ['view_purchasedorder']
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Sales',
    to: '/sales',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    permissions: ['view_pos', 'view_sale'],
    items: [
      {
        component: CNavItem,
        name: 'POS',
        to: '/sales/pos',
        icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
        permissions: ['view_pos']
      },
      // {
      //   component: CNavItem,
      //   name: 'POS-New (Edit)',
      //   to: '/sales/pos-new',
      //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      //   permissions: ['view_pos', 'edit_sale']
      // },
      {
        component: CNavItem,
        name: 'Invoices',
        to: '/sales/invoices',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        permissions: ['view_sale']
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Masters',
    to: '/masters',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    permissions: ['view_master'],
    items: [
      {
        component: CNavItem,
        name: 'Categories',
        to: '/masters/categories',
        icon: <CIcon icon={cilTags} customClassName="nav-icon" />,
        permissions: ['view_master']
      },
      {
        component: CNavItem,
        name: 'Sub-Categories',
        to: '/masters/sub-categories',
        icon: <CIcon icon={cilList} customClassName="nav-icon" />,
        permissions: ['view_master']
      },
      {
        component: CNavItem,
        name: 'Brands',
        to: '/masters/brands',
        icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
        permissions: ['view_master']
      },
      {
        component: CNavItem,
        name: 'Units',
        to: '/masters/units',
        icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
        permissions: ['view_master']
      },
      {
        component: CNavItem,
        name: 'Expense Categories',
        to: '/masters/expense-categories',
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
        permissions: ['view_master']
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Employee Management',
    to: '/employees',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    permissions: ['view_employee'],
    items: [
      {
        component: CNavItem,
        name: 'Employee List',
        to: '/employees',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
        permissions: ['view_employee']
      },
      {
        component: CNavItem,
        name: 'Add Employee',
        to: '/employees/create',
        icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
        permissions: ['create_employee']
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Expense Management',
    to: '/expenses',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    permissions: ['view_expense'],
    items: [
      {
        component: CNavItem,
        name: 'Expense List',
        to: '/expenses',
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
        permissions: ['view_expense']
      },
      {
        component: CNavItem,
        name: 'Add Expense',
        to: '/expenses/create',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
        permissions: ['create_expense']
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'User Management',
    to: '/users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    permissions: ['view_user'],
    items: [
      {
        component: CNavItem,
        name: 'Users',
        to: '/users/list',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
        permissions: ['view_user']
      },
      {
        component: CNavItem,
        name: 'Roles',
        to: '/users/roles',
        icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
        permissions: ['view_user']
      },
      {
        component: CNavItem,
        name: 'Permission Example',
        to: '/permission-example',
        icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
        permissions: ['view_user']
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Company Reports',
    to: '/reports',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    permissions: ['view_dashboard'],
    items: [
      {
        component: CNavItem,
        name: 'Product-wise Margin Report',
        to: '/reports/product-margins',
        icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
        permissions: ['view_dashboard']
      },
      {
        component: CNavItem,
        name: 'Company Profit & Loss (P&L) Report',
        to: '/reports/profit-loss',
        icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
        permissions: ['view_dashboard']
      },
      {
        component: CNavItem,
        name: 'Business Financial Dashboard',
        to: '/reports/business-dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        permissions: ['view_dashboard']
      },
      // {
      //   component: CNavItem,
      //   name: 'Payment Transactions Report',
      //   to: '/reports/payment-transactions',
      //   icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
      //   permissions: ['view_dashboard']
      // },
    ],
  },
]

export default _nav 