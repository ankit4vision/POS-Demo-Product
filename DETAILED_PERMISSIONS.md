# Detailed Permission System Documentation

## Overview

The POS system implements a comprehensive permission system with granular control over user actions. This document outlines all permission types and their implementation across different modules.

## Permission Types

### 1. Basic CRUD Operations
These are the fundamental operations available for most modules:

- **`view_[module]`** - View lists and details
- **`create_[module]`** - Create new records
- **`edit_[module]`** - Edit existing records
- **`delete_[module]`** - Delete records

### 2. Document Operations
Additional operations for document handling:

- **`print_[module]`** - Print documents and reports
- **`email_[module]`** - Send emails related to the module
- **`export_[module]`** - Export data to PDF/Excel

### 3. System Operations
Special permissions for system management:

- **`manage_roles`** - Manage user roles and permissions
- **`assign_permissions`** - Assign permissions to roles
- **`view_reports`** - View system reports and analytics
- **`export_reports`** - Export reports to various formats
- **`manage_settings`** - Manage system settings and configuration
- **`backup_data`** - Create and manage data backups
- **`restore_data`** - Restore data from backups

## Module-Specific Permissions

### Dashboard
- `view_dashboard` - Access dashboard and analytics
- `create_dashboard` - Create dashboard widgets and reports
- `edit_dashboard` - Modify dashboard layout and settings
- `delete_dashboard` - Remove dashboard components

### User Management
- `view_user` - View user lists and details
- `create_user` - Create new user accounts
- `edit_user` - Modify existing user information
- `delete_user` - Remove user accounts
- `manage_roles` - Manage user roles and permissions
- `assign_permissions` - Assign permissions to roles

### Product Management
- `view_product` - View product catalog and details
- `create_product` - Add new products to inventory
- `edit_product` - Update product information and pricing
- `delete_product` - Remove products from inventory
- `print_product` - Print product catalogs and labels
- `export_product` - Export product data to PDF/Excel

### Customer Management
- `view_customer` - View customer lists and details
- `create_customer` - Add new customer records
- `edit_customer` - Update customer information
- `delete_customer` - Remove customer records
- `print_customer` - Print customer details and reports
- `email_customer` - Send emails to customers
- `export_customer` - Export customer data to PDF/Excel

### Supplier Management
- `view_supplier` - View supplier lists and details
- `create_supplier` - Add new supplier records
- `edit_supplier` - Update supplier information
- `delete_supplier` - Remove supplier records
- `print_supplier` - Print supplier details and reports
- `email_supplier` - Send emails to suppliers
- `export_supplier` - Export supplier data to PDF/Excel

### Purchase Order Management
- `view_purchaseorder` - View purchase order history
- `create_purchaseorder` - Create new purchase orders
- `edit_purchaseorder` - Modify purchase order details
- `delete_purchaseorder` - Delete purchase orders
- `print_purchaseorder` - Print purchase orders
- `email_purchaseorder` - Send purchase orders via email
- `export_purchaseorder` - Export purchase order data

### Sales Management
- `view_sale` - View sales history and invoices
- `create_sale` - Create new sales records
- `edit_sale` - Modify sales information
- `delete_sale` - Delete sales records
- `print_sale` - Print sales invoices
- `email_sale` - Send invoices via email
- `export_sale` - Export sales data

### POS Operations
- `view_pos` - Access POS interface
- `create_pos` - Create new sales transactions
- `edit_pos` - Modify POS transactions
- `delete_pos` - Delete POS transactions

### Master Data Management
- `view_master` - View master data lists
- `create_master` - Create master data (categories, brands, units)
- `edit_master` - Modify master data records
- `delete_master` - Remove master data records

### Employee Management
- `view_employee` - View employee lists and details
- `create_employee` - Add new employee records
- `edit_employee` - Update employee information
- `delete_employee` - Remove employee records
- `print_employee` - Print employee details and reports
- `email_employee` - Send emails to employees
- `export_employee` - Export employee data

### Expense Management
- `view_expense` - View expense lists and reports
- `create_expense` - Add new expense records
- `edit_expense` - Update expense information
- `delete_expense` - Remove expense records
- `print_expense` - Print expense reports
- `export_expense` - Export expense data

### Wallet & Ledger Management
- `view_ledger` - View wallet ledger entries
- `view_wallet` - View wallet balances and transactions
- `print_wallet` - Print wallet statements
- `email_wallet` - Send wallet statements via email
- `export_wallet` - Export wallet data

### Email Management
- `view_email` - View email history and templates
- `create_email` - Send new emails
- `edit_email` - Modify email templates and settings
- `delete_email` - Delete email records

### Settings Management
- `view_setting` - View system settings
- `manage_settings` - Manage system settings and configuration
- `backup_data` - Create and manage data backups
- `restore_data` - Restore data from backups

## Implementation Examples

### 1. Route Protection

```jsx
// In App.jsx
<Route path="/customers" element={
  <PermissionRoute requiredPermissions={['view_customer']}>
    <CustomerList />
  </PermissionRoute>
} />

<Route path="/customers/create" element={
  <PermissionRoute requiredPermissions={['create_customer']}>
    <CustomerForm />
  </PermissionRoute>
} />
```

### 2. Component-Level Protection

```jsx
// In CustomerList.jsx
<PermissionGuard requiredPermissions={['create_customer']}>
  <CButton color="primary" onClick={() => navigate('/customers/create')}>
    <CIcon icon={cilPlus} className="me-2" /> Add New Customer
  </CButton>
</PermissionGuard>

<PermissionGuard requiredPermissions={['export_customer']}>
  <CButton color="outline-success" onClick={handleExportCustomers}>
    <CIcon icon={cilDownload} className="me-2" /> Export
  </CButton>
</PermissionGuard>
```

### 3. Action Button Protection

```jsx
// In table actions
<PermissionGuard requiredPermissions={['edit_customer']}>
  <CButton color="primary" size="sm" onClick={() => handleEdit(row.id)}>
    <CIcon icon={cilPencil} />
  </CButton>
</PermissionGuard>

<PermissionGuard requiredPermissions={['delete_customer']}>
  <CButton color="danger" size="sm" onClick={() => handleDelete(row.id)}>
    <CIcon icon={cilTrash} />
  </CButton>
</PermissionGuard>

<PermissionGuard requiredPermissions={['print_customer']}>
  <CButton color="info" size="sm" onClick={() => handlePrint(row)}>
    <CIcon icon={cilPrint} />
  </CButton>
</PermissionGuard>

<PermissionGuard requiredPermissions={['email_customer']}>
  <CButton color="warning" size="sm" onClick={() => handleEmail(row)}>
    <CIcon icon={cilEnvelopeClosed} />
  </CButton>
</PermissionGuard>
```

### 4. Dropdown Menu Protection

```jsx
<CDropdown>
  <CDropdownToggle color="secondary" size="sm">
    <CIcon icon={cilEllipsis} />
  </CDropdownToggle>
  <CDropdownMenu>
    <PermissionGuard requiredPermissions={['view_customer']}>
      <CDropdownItem onClick={() => navigate(`/customers/${row.id}`)}>
        <CIcon icon={cilEye} className="me-2" />
        View Details
      </CDropdownItem>
    </PermissionGuard>
    
    <PermissionGuard requiredPermissions={['print_customer']}>
      <CDropdownItem onClick={() => handlePrint(row)}>
        <CIcon icon={cilPrint} className="me-2" />
        Print Details
      </CDropdownItem>
    </PermissionGuard>
    
    <PermissionGuard requiredPermissions={['email_customer']}>
      <CDropdownItem onClick={() => handleEmail(row)}>
        <CIcon icon={cilEnvelopeClosed} className="me-2" />
        Send Email
      </CDropdownItem>
    </PermissionGuard>
    
    <PermissionGuard requiredPermissions={['delete_customer']}>
      <CDropdownItem onClick={() => handleDelete(row.id)} className="text-danger">
        <CIcon icon={cilTrash} className="me-2" />
        Delete Customer
      </CDropdownItem>
    </PermissionGuard>
  </CDropdownMenu>
</CDropdown>
```

### 5. Conditional Rendering

```jsx
// Using useAuth hook for conditional logic
const { hasPermission, hasRole } = useAuth()

const renderActions = () => {
  const actions = []
  
  if (hasPermission('view_customer')) {
    actions.push(
      <CButton key="view" color="info" size="sm">
        <CIcon icon={cilEye} />
      </CButton>
    )
  }
  
  if (hasPermission('edit_customer')) {
    actions.push(
      <CButton key="edit" color="primary" size="sm">
        <CIcon icon={cilPencil} />
      </CButton>
    )
  }
  
  if (hasPermission('delete_customer')) {
    actions.push(
      <CButton key="delete" color="danger" size="sm">
        <CIcon icon={cilTrash} />
      </CButton>
    )
  }
  
  return actions
}
```

## Backend API Protection

### Middleware Usage

```php
// In routes/api.php
Route::middleware('permission:view_customer')->group(function () {
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::get('/customers/{customer}', [CustomerController::class, 'show']);
});

Route::middleware('permission:create_customer')->group(function () {
    Route::post('/customers', [CustomerController::class, 'store']);
});

Route::middleware('permission:edit_customer')->group(function () {
    Route::put('/customers/{customer}', [CustomerController::class, 'update']);
});

Route::middleware('permission:delete_customer')->group(function () {
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy']);
});

Route::middleware('permission:export_customer')->group(function () {
    Route::get('/customers/export', [CustomerController::class, 'export']);
});

Route::middleware('permission:email_customer')->group(function () {
    Route::post('/emails/send-customer', [EmailController::class, 'sendCustomerEmail']);
});
```

### Controller Methods

```php
// In CustomerController.php
public function export(Request $request)
{
    // Check permission is already handled by middleware
    // Export logic here
}

// In EmailController.php
public function sendCustomerEmail(Request $request)
{
    // Check permission is already handled by middleware
    // Email sending logic here
}
```

## Permission Matrix

| Module | View | Create | Edit | Delete | Print | Email | Export |
|--------|------|--------|------|--------|-------|-------|--------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| User | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Product | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Customer | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Supplier | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Purchase Order | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sales | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| POS | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Master Data | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Employee | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Expense | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Wallet | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Email | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Settings | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Testing Permissions

### 1. Permission Example Page
Visit `/permission-example` to see:
- Current user permissions
- Permission checking examples
- Interactive permission tests
- Code examples

### 2. Testing Different Roles
1. **Admin Role**: Should see all navigation items and have all permissions
2. **Manager Role**: Should see items based on assigned permissions
3. **User Role**: Should see limited items based on assigned permissions

### 3. Testing Specific Actions
- Try accessing routes without proper permissions
- Test action buttons with different permission levels
- Verify error messages are user-friendly
- Check that Admin role bypasses all permission checks

## Security Considerations

1. **Backend Validation**: Always validate permissions on the backend, not just frontend
2. **API Protection**: Use middleware to protect API endpoints
3. **Role Hierarchy**: Admin role automatically has all permissions
4. **Permission Granularity**: Use specific permissions rather than broad roles
5. **Audit Trail**: Consider logging permission checks for security auditing
6. **Error Handling**: Provide clear, user-friendly error messages
7. **Fallback UI**: Provide appropriate fallback content when permissions are denied

## Best Practices

1. **Consistent Naming**: Use consistent permission naming across the application
2. **Granular Permissions**: Create specific permissions rather than broad ones
3. **Fallback UI**: Provide appropriate fallback content when permissions are denied
4. **User Feedback**: Clearly indicate when users don't have required permissions
5. **Performance**: Cache permission checks where appropriate
6. **Documentation**: Keep permission documentation up to date
7. **Testing**: Regularly test permission system with different user roles

## Migration and Setup

### 1. Database Seeding
```bash
php artisan db:seed --class=PermissionsTableSeeder
```

### 2. Role Assignment
Assign appropriate permissions to roles through the Roles management interface.

### 3. Testing
Test the permission system with different user roles to ensure proper access control.

## Troubleshooting

### Common Issues

1. **Permission not working**: Check if permission exists in database
2. **Admin bypass not working**: Verify role name is exactly "admin" (case-sensitive)
3. **UI elements not hiding**: Check PermissionGuard component usage
4. **API errors**: Verify middleware is properly configured

### Debug Tools

1. **Permission Example Page**: Shows current user permissions
2. **Browser Console**: Check for permission-related errors
3. **Network Tab**: Monitor API calls for permission errors
4. **Database**: Verify permissions and role assignments 