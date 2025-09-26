# Page-Level Permission System

This document describes the implementation of page-level permissions based on user roles and permissions in the Krimah POS system.

## Overview

The permission system provides:
- **Page-level protection**: Routes are protected based on user permissions
- **UI-level protection**: Components and buttons are conditionally rendered based on permissions
- **Role-based access**: Admin role automatically has all permissions
- **Flexible permission checking**: Support for single, multiple, and module-based permissions

## Backend Implementation

### 1. Permission Middleware

**File**: `backend/app/Http/Middleware/CheckPermission.php`

```php
// Usage in routes
Route::middleware(['auth:sanctum', 'permission:view_customer'])->get('/customers', [CustomerController::class, 'index']);
```

### 2. User Model Methods

**File**: `backend/app/Models/User.php`

```php
// Check single permission
$user->hasPermission('view_customer');

// Get all user permissions
$user->getAllPermissions();

// Get permissions by module
$user->getPermissionsByModule('Customer');

// Check multiple permissions (any)
$user->hasAnyPermission(['view_customer', 'create_customer']);

// Check multiple permissions (all)
$user->hasAllPermissions(['view_customer', 'create_customer']);
```

### 3. Auth Controller Updates

**File**: `backend/app/Http/Controllers/AuthController.php`

The login and user endpoints now return:
- User data with roles
- Array of all permissions
- Permissions grouped by module and submodule

## Frontend Implementation

### 1. AuthContext

**File**: `src/context/AuthContext.jsx`

The AuthContext now includes:
- `permissions`: Array of all user permissions
- `permissionsByModule`: Permissions grouped by module
- Permission checking methods

### 2. Permission Components

#### PermissionRoute
**File**: `src/components/PermissionRoute.jsx`

Protects entire pages/routes:

```jsx
<PermissionRoute requiredPermissions={['view_customer']}>
  <CustomerList />
</PermissionRoute>

<PermissionRoute requiredRole="admin">
  <AdminPanel />
</PermissionRoute>
```

#### PermissionGuard
**File**: `src/components/PermissionGuard.jsx`

Protects individual UI elements:

```jsx
<PermissionGuard requiredPermissions={['create_customer']}>
  <CButton color="primary">Add Customer</CButton>
</PermissionGuard>

<PermissionGuard 
  requiredPermissions={['view_customer']}
  fallback={<CAlert color="warning">No permission</CAlert>}
>
  <CustomerData />
</PermissionGuard>
```

### 3. usePermissions Hook

**File**: `src/hooks/usePermissions.js`

```jsx
const { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions, 
  hasModulePermission, 
  hasRole,
  permissions 
} = usePermissions()

// Check single permission
if (hasPermission('edit_customer')) {
  // Show edit button
}

// Check multiple permissions (any)
if (hasAnyPermission(['view_customer', 'create_customer'])) {
  // Show customer management
}

// Check role
if (hasRole('admin')) {
  // Show admin features
}
```

## Navigation Integration

### 1. Navigation Configuration

**File**: `src/_nav.jsx`

Each navigation item can specify required permissions:

```jsx
{
  component: CNavItem,
  name: 'Customers',
  to: '/customers',
  icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  permissions: ['view_customer']
}
```

### 2. Automatic Filtering

**File**: `src/components/AppSidebarNav.jsx`

Navigation items are automatically filtered based on user permissions:
- Items without permissions are always shown
- Admin role sees all items
- Other users only see items they have permissions for
- Parent items are hidden if all child items are filtered out

## Permission Structure

### Permission Naming Convention

Permissions follow the pattern: `{action}_{module}`

Examples:
- `view_customer` - View customer data
- `create_customer` - Create new customers
- `edit_customer` - Edit existing customers
- `delete_customer` - Delete customers
- `view_product` - View products
- `create_product` - Create products

### Module Structure

Permissions are organized by:
- **Module**: High-level category (Customer, Product, User, etc.)
- **Submodule**: Specific entity within the module
- **Type**: Action type (view, create, edit, delete)

## Usage Examples

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

### 2. Component Protection

```jsx
// In CustomerList.jsx
<PermissionGuard requiredPermissions={['create_customer']}>
  <CButton color="primary" onClick={() => navigate('/customers/create')}>
    Add New Customer
  </CButton>
</PermissionGuard>

<PermissionGuard requiredPermissions={['edit_customer']}>
  <CButton color="warning" onClick={() => handleEdit(row.id)}>
    Edit
  </CButton>
</PermissionGuard>

<PermissionGuard requiredPermissions={['delete_customer']}>
  <CButton color="danger" onClick={() => handleDelete(row.id)}>
    Delete
  </CButton>
</PermissionGuard>
```

### 3. Conditional Logic

```jsx
// Using usePermissions hook
const { hasPermission, hasRole } = usePermissions()

const renderActions = () => {
  if (hasRole('admin')) {
    return <AdminActions />
  }
  
  if (hasPermission('edit_customer')) {
    return <EditButton />
  }
  
  return null
}
```

### 4. Navigation Items

```jsx
// In _nav.jsx
{
  component: CNavGroup,
  name: 'Customer Management',
  to: '/customers',
  icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  permissions: ['view_customer', 'create_customer', 'edit_customer'],
  items: [
    {
      component: CNavItem,
      name: 'Customer List',
      to: '/customers',
      icon: <CIcon icon={cilList} customClassName="nav-icon" />,
      permissions: ['view_customer']
    },
    {
      component: CNavItem,
      name: 'Add Customer',
      to: '/customers/create',
      icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      permissions: ['create_customer']
    }
  ]
}
```

## Testing

### Permission Example Page

Visit `/permission-example` to see:
- Current user permissions
- Permission checking examples
- PermissionGuard usage examples
- Code examples

### Testing Different Roles

1. **Admin Role**: Should see all navigation items and have all permissions
2. **Manager Role**: Should see items based on assigned permissions
3. **User Role**: Should see limited items based on assigned permissions

## Security Considerations

1. **Backend Validation**: Always validate permissions on the backend, not just frontend
2. **API Protection**: Use middleware to protect API endpoints
3. **Role Hierarchy**: Admin role automatically has all permissions
4. **Permission Granularity**: Use specific permissions rather than broad roles
5. **Audit Trail**: Consider logging permission checks for security auditing

## Best Practices

1. **Consistent Naming**: Use consistent permission naming across the application
2. **Granular Permissions**: Create specific permissions rather than broad ones
3. **Fallback UI**: Provide appropriate fallback content when permissions are denied
4. **User Feedback**: Clearly indicate when users don't have required permissions
5. **Performance**: Cache permission checks where appropriate
6. **Documentation**: Document permission requirements for each feature

## Troubleshooting

### Common Issues

1. **Navigation items not showing**: Check if user has required permissions
2. **Buttons not appearing**: Verify permission names match exactly
3. **Routes redirecting**: Ensure PermissionRoute has correct permission requirements
4. **Admin not seeing items**: Check if admin role is properly assigned

### Debug Tips

1. Use the Permission Example page to check current permissions
2. Check browser console for permission-related errors
3. Verify permission names in database match frontend usage
4. Ensure user roles are properly assigned and active 