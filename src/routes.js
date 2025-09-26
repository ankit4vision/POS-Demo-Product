import React from 'react'
import Login from './views/pages/login/Login'
import UserManagement from './views/users/UserManagement'
import UserList from './views/users/UserList'
import Roles from './views/users/Roles'
import Permissions from './views/users/Permissions'
import UserForm from './views/users/UserForm'
import Profile from './views/profile/Profile.jsx'
import Category from 'modules/Masters/Category'
import SubCategory from 'modules/Masters/SubCategory'
import Brand from 'modules/Masters/Brand'
import Unit from 'modules/Masters/Unit'
import ExpenseCategory from 'modules/Masters/ExpenseCategory'
import CustomerList from './views/customers/CustomerList'
import CustomerForm from './views/customers/CustomerForm'
import WalletLedger from './views/wallet/WalletLedger'
import InvoiceDetail from './views/invoices/InvoiceDetail'
import PaymentTransactionsReport from './views/reports/PaymentTransactionsReport'

const routes = [
  {
    path: '/login',
    name: 'Login',
    element: Login,
  },
  {
    path: '/users',
    name: 'User Management',
    element: UserManagement,
    exact: true,
  },
  {
    path: '/users/list',
    name: 'User List',
    element: UserList,
  },
  {
    path: '/users/create',
    name: 'Create User',
    element: UserForm,
  },
  {
    path: '/users/edit/:id',
    name: 'Edit User',
    element: UserForm,
  },
  {
    path: '/users/view/:id',
    name: 'View User',
    element: UserForm,
  },
  {
    path: '/users/roles',
    name: 'Roles',
    element: Roles,
  },
  {
    path: '/users/permissions',
    name: 'Permissions',
    element: Permissions,
  },
  {
    path: '/profile',
    name: 'Profile',
    element: Profile,
  },
  {
    path: '/masters/categories',
    name: 'Categories',
    element: Category,
  },
  {
    path: '/masters/sub-categories',
    name: 'Sub-Categories',
    element: SubCategory,
  },
  {
    path: '/masters/brands',
    name: 'Brands',
    element: Brand,
  },
  {
    path: '/masters/units',
    name: 'Units',
    element: Unit,
  },
  {
    path: '/masters/expense-categories',
    name: 'Expense Categories',
    element: ExpenseCategory,
  },
  // Customer Routes
  {
    path: '/customers',
    name: 'Customers',
    element: CustomerList,
  },
  {
    path: '/customers/create',
    name: 'Create Customer',
    element: CustomerForm,
  },
  {
    path: '/customers/edit/:id',
    name: 'Edit Customer',
    element: CustomerForm,
  },
  // Wallet Routes
  {
    path: '/wallet/:partyType/:partyId',
    name: 'Wallet Ledger',
    element: WalletLedger,
  },
  {
    path: '/sales/invoices/:id',
    name: 'Invoice Detail',
    element: InvoiceDetail,
  },
  {
    path: '/reports/product-margins',
    name: 'Product-wise Margin Report',
    element: React.lazy(() => import('./views/reports/ProductMarginReport')),
  },
  {
    path: '/reports/sales-summary',
    name: 'Sales Summary Report',
    element: React.lazy(() => import('./views/reports/SalesSummaryReport')),
  },
  {
    path: '/reports/profit-loss',
    name: 'Company Profit & Loss (P&L) Report',
    element: React.lazy(() => import('./views/reports/ProfitLossReport')),
  },
  {
    path: '/reports/business-dashboard',
    name: 'Business Financial Dashboard',
    element: React.lazy(() => import('./views/reports/BusinessDashboard')),
  },
  {
    path: '/reports/payment-transactions',
    name: 'Payment Transactions Report',
    element: PaymentTransactionsReport,
  },
]

export default routes
