import React, { Suspense } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Provider } from 'react-redux'
import store from './store'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PermissionRoute from './components/PermissionRoute.jsx'
import GlobalErrorHandler from './components/GlobalErrorHandler.jsx'
import { Toaster } from 'react-hot-toast'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import './scss/examples.scss'
import './styles/invoice.css'

import Category from './modules/Masters/Category'
import SubCategory from './modules/Masters/SubCategory'
import Brand from './modules/Masters/Brand'
import Unit from './modules/Masters/Unit'
import ExpenseCategory from './modules/Masters/ExpenseCategory'
import SupplierList from './views/suppliers/SupplierList'
import SupplierDetail from './views/suppliers/SupplierDetail'

// Dashboard
const Dashboard = React.lazy(() => import('./views/Dashboard.jsx'))

// Product Management
const ProductList = React.lazy(() => import('./views/products/ProductList.jsx'))
const ProductForm = React.lazy(() => import('./views/products/ProductForm.jsx'))

// Customer Management
const CustomerList = React.lazy(() => import('./views/customers/CustomerList.jsx'))
const CustomerForm = React.lazy(() => import('./views/customers/CustomerForm.jsx'))
const CustomerDetail = React.lazy(() => import('./views/customers/CustomerDetail.jsx'));

// Wallet Management
const WalletLedger = React.lazy(() => import('./views/wallet/WalletLedger.jsx'))

// Purchase Order Management
const PurchaseOrderList = React.lazy(() => import('./views/purchases/PurchaseOrderList.jsx'))
const PurchaseOrderForm = React.lazy(() => import('./views/purchases/PurchaseOrderForm.jsx'))
const PurchaseOrderDetail = React.lazy(() => import('./views/purchases/PurchaseOrderDetail.jsx'))
const PurchasedList = React.lazy(() => import('./views/purchases/PurchasedList.jsx'))

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout.jsx'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login.jsx'))
const Register = React.lazy(() => import('./views/pages/register/Register.jsx'))
const ForgotPassword = React.lazy(() => import('./views/pages/forgot-password/ForgotPassword.jsx'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404.jsx'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500.jsx'))

const UserManagement = React.lazy(() => import('./views/users/UserManagement.jsx'))
const UserList = React.lazy(() => import('./views/users/UserList.jsx'))
const Roles = React.lazy(() => import('./views/users/Roles.jsx'))
const UserForm = React.lazy(() => import('./views/users/UserForm.jsx'))
const Profile = React.lazy(() => import('./views/profile/Profile.jsx'))

const PosPage = React.lazy(() => import('./views/pos/PosPage.jsx'))
const PosNew = React.lazy(() => import('./views/pos/PosNew.jsx'))
const InvoiceList = React.lazy(() => import('./views/invoices/InvoiceList.jsx'))
const InvoiceDetail = React.lazy(() => import('./views/invoices/InvoiceDetail.jsx'))

// Import Employee Management pages
const EmployeeList = React.lazy(() => import('./views/employees/EmployeeList.jsx'))
const EmployeeForm = React.lazy(() => import('./views/employees/EmployeeForm.jsx'))
const EmployeeDetail = React.lazy(() => import('./views/employees/EmployeeDetail.jsx'))

// Import Expense Management pages
const ExpenseList = React.lazy(() => import('./views/expenses/ExpenseList.jsx'))
const ExpenseForm = React.lazy(() => import('./views/expenses/ExpenseForm.jsx'))
const ExpenseDetail = React.lazy(() => import('./views/expenses/ExpenseDetail.jsx'))

// Import Email Management pages
const EmailInbox = React.lazy(() => import('./views/emails/EmailInbox.jsx'))

const Settings = React.lazy(() => import('./views/settings/Settings.jsx'))

const PermissionExample = React.lazy(() => import('./components/PermissionExample.jsx'))
// const PermissionTest = React.lazy(() => import('./components/PermissionTest.jsx'))

const AppContent = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme.theme)

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <GlobalErrorHandler />
        <Toaster />
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/404" element={<Page404 />} />
            <Route path="/500" element={<Page500 />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <DefaultLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={
                <PermissionRoute requiredPermissions={['view_dashboard']}>
                  <Dashboard />
                </PermissionRoute>
              } />
              <Route path="users" element={
                <PermissionRoute requiredPermissions={['view_user']}>
                  <UserManagement />
                </PermissionRoute>
              } />
              <Route path="users/list" element={
                <PermissionRoute requiredPermissions={['view_user']}>
                  <UserList />
                </PermissionRoute>
              } />
              <Route path="users/create" element={
                <PermissionRoute requiredPermissions={['create_user']}>
                  <UserForm />
                </PermissionRoute>
              } />
              <Route path="users/edit/:id" element={
                <PermissionRoute requiredPermissions={['edit_user']}>
                  <UserForm />
                </PermissionRoute>
              } />
              <Route path="users/roles" element={
                <PermissionRoute requiredPermissions={['view_user']}>
                  <Roles />
                </PermissionRoute>
              } />
              <Route path="permission-example" element={
                <PermissionRoute requiredPermissions={['view_user']}>
                  <PermissionExample />
                </PermissionRoute>
              } />
              {/* <Route path="permission-test" element={
                <PermissionRoute requiredPermissions={['view_user']}>
                  <PermissionTest />
                </PermissionRoute>
              } /> */}
              <Route path="profile" element={<Profile />} />
              <Route path="masters/categories" element={
                <PermissionRoute requiredPermissions={['view_master']}>
                  <Category />
                </PermissionRoute>
              } />
              <Route path="masters/sub-categories" element={
                <PermissionRoute requiredPermissions={['view_master']}>
                  <SubCategory />
                </PermissionRoute>
              } />
              <Route path="masters/brands" element={
                <PermissionRoute requiredPermissions={['view_master']}>
                  <Brand />
                </PermissionRoute>
              } />
              <Route path="masters/units" element={
                <PermissionRoute requiredPermissions={['view_master']}>
                  <Unit />
                </PermissionRoute>
              } />
              <Route path="masters/expense-categories" element={
                <PermissionRoute requiredPermissions={['view_master']}>
                  <ExpenseCategory />
                </PermissionRoute>
              } />
              <Route path="purchase/suppliers" element={
                <PermissionRoute requiredPermissions={['view_supplier']}>
                  <SupplierList />
                </PermissionRoute>
              } />
              <Route path="suppliers" element={
                <PermissionRoute requiredPermissions={['view_supplier']}>
                  <SupplierList />
                </PermissionRoute>
              } />
              <Route path="suppliers/:id" element={
                <PermissionRoute requiredPermissions={['view_supplier']}>
                  <SupplierDetail />
                </PermissionRoute>
              } />
              
              {/* Product Management Routes */}
              <Route path="products" element={
                <PermissionRoute requiredPermissions={['view_product']}>
                  <ProductList />
                </PermissionRoute>
              } />
              <Route path="products/create" element={
                <PermissionRoute requiredPermissions={['create_product']}>
                  <ProductForm />
                </PermissionRoute>
              } />
              <Route path="products/edit/:id" element={
                <PermissionRoute requiredPermissions={['edit_product']}>
                  <ProductForm />
                </PermissionRoute>
              } />
              
              {/* Customer Management Routes */}
              <Route path="customers" element={
                <PermissionRoute requiredPermissions={['view_customer']}>
                  <CustomerList />
                </PermissionRoute>
              } />
              <Route path="customers/create" element={
                <PermissionRoute requiredPermissions={['create_customer']}>
                  <CustomerForm />
                </PermissionRoute>
              } />
              <Route path="customers/edit/:id" element={
                <PermissionRoute requiredPermissions={['edit_customer']}>
                  <CustomerForm />
                </PermissionRoute>
              } />
              <Route path="customers/view/:id" element={
                <PermissionRoute requiredPermissions={['view_customer']}>
                  <CustomerDetail />
                </PermissionRoute>
              } />
              
              {/* Wallet Management Routes */}
              <Route path="wallet/:partyType/:partyId" element={
                <PermissionRoute requiredPermissions={['view_ledger']}>
                  <WalletLedger />
                </PermissionRoute>
              } />
              
              {/* Purchase Order Management Routes */}
              <Route path="purchases" element={
                <PermissionRoute requiredPermissions={['view_purchaseorder']}>
                  <PurchaseOrderList />
                </PermissionRoute>
              } />
              <Route path="purchases/create" element={
                <PermissionRoute requiredPermissions={['create_purchaseorder']}>
                  <PurchaseOrderForm />
                </PermissionRoute>
              } />
              <Route path="purchases/:id" element={
                <PermissionRoute requiredPermissions={['view_purchaseorder']}>
                  <PurchaseOrderDetail />
                </PermissionRoute>
              } />
              <Route path="purchases/:id/edit" element={
                <PermissionRoute requiredPermissions={['edit_purchaseorder']}>
                  <PurchaseOrderForm />
                </PermissionRoute>
              } />
              <Route path="purchases/purchased" element={
                <PermissionRoute requiredPermissions={['view_purchasedorder']}>
                  <PurchasedList />
                </PermissionRoute>
              } />
              
              {/* Sales (POS & Invoices) */}
              <Route path="sales/pos" element={
                <PermissionRoute requiredPermissions={['view_pos']}>
                  <PosPage />
                </PermissionRoute>
              } />
              <Route path="sales/pos-new" element={
                <PermissionRoute requiredPermissions={['view_pos', 'edit_sale']}>
                  <PosNew />
                </PermissionRoute>
              } />
              <Route path="sales/pos-new/edit/:id" element={
                <PermissionRoute requiredPermissions={['view_pos', 'edit_sale']}>
                  <PosNew />
                </PermissionRoute>
              } />
              <Route path="sales/invoices" element={
                <PermissionRoute requiredPermissions={['view_sale']}>
                  <InvoiceList />
                </PermissionRoute>
              } />
              <Route path="sales/invoices/:id" element={
                <PermissionRoute requiredPermissions={['view_sale']}>
                  <InvoiceDetail />
                </PermissionRoute>
              } />
              
              {/* Employee Management Routes */}
              <Route path="employees" element={
                <PermissionRoute requiredPermissions={['view_employee']}>
                  <EmployeeList />
                </PermissionRoute>
              } />
              <Route path="employees/create" element={
                <PermissionRoute requiredPermissions={['create_employee']}>
                  <EmployeeForm />
                </PermissionRoute>
              } />
              <Route path="employees/edit/:id" element={
                <PermissionRoute requiredPermissions={['edit_employee']}>
                  <EmployeeForm />
                </PermissionRoute>
              } />
              <Route path="employees/:id" element={
                <PermissionRoute requiredPermissions={['view_employee']}>
                  <EmployeeDetail />
                </PermissionRoute>
              } />
              
              {/* Expense Management Routes */}
              <Route path="expenses" element={
                <PermissionRoute requiredPermissions={['view_expense']}>
                  <ExpenseList />
                </PermissionRoute>
              } />
              <Route path="expenses/create" element={
                <PermissionRoute requiredPermissions={['create_expense']}>
                  <ExpenseForm />
                </PermissionRoute>
              } />
              <Route path="expenses/edit/:id" element={
                <PermissionRoute requiredPermissions={['edit_expense']}>
                  <ExpenseForm />
                </PermissionRoute>
              } />
              <Route path="expenses/:id" element={
                <PermissionRoute requiredPermissions={['view_expense']}>
                  <ExpenseDetail />
                </PermissionRoute>
              } />
              
              {/* Email Management Routes */}
              <Route path="emails/inbox" element={
                <PermissionRoute requiredPermissions={['view_email']}>
                  <EmailInbox />
                </PermissionRoute>
              } />
              
              {/* Settings Route */}
              <Route path="settings" element={
                <PermissionRoute requiredPermissions={['view_setting']}>
                  <Settings />
                </PermissionRoute>
              } />
              
              <Route path="reports/product-margins" element={
                <PermissionRoute requiredPermissions={['view_dashboard']}>
                  {React.createElement(React.lazy(() => import('./views/reports/ProductMarginReport.jsx')))}
                </PermissionRoute>
              } />
              <Route path="reports/sales-summary" element={
                <PermissionRoute requiredPermissions={['view_dashboard']}>
                  {React.createElement(React.lazy(() => import('./views/reports/SalesSummaryReport.jsx')))}
                </PermissionRoute>
              } />
              <Route path="reports/profit-loss" element={
                <PermissionRoute requiredPermissions={['view_dashboard']}>
                  {React.createElement(React.lazy(() => import('./views/reports/ProfitLossReport.jsx')))}
                </PermissionRoute>
              } />
              <Route path="reports/business-dashboard" element={
                <PermissionRoute requiredPermissions={['view_dashboard']}>
                  {React.createElement(React.lazy(() => import('./views/reports/BusinessDashboard.jsx')))}
                </PermissionRoute>
              } />
              <Route path="reports/payment-transactions" element={
                <PermissionRoute requiredPermissions={['view_dashboard']}>
                  {React.createElement(React.lazy(() => import('./views/reports/PaymentTransactionsReport.jsx')))}
                </PermissionRoute>
              } />
              
              <Route path="*" element={<Page404 />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </HashRouter>
  )
}

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App 