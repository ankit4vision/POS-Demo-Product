# 🏪 Krimah POS System - Project Information

## 📋 **Project Overview**
Krimah POS is a full-stack Point of Sale system with a modular architecture, designed for retail and business management. The system provides comprehensive business management capabilities including sales, purchases, inventory, customer management, and financial tracking.

## 🏗️ **Architecture & Tech Stack**

### **Frontend (React)**
- **Framework**: React 18 with Vite build system
- **UI Library**: CoreUI 5 (Modern, responsive admin template)
- **State Management**: Redux Toolkit + React Context
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios for API communication
- **Styling**: SCSS with CoreUI components
- **Charts**: Chart.js + Recharts for data visualization
- **Icons**: CoreUI Icons React

### **Backend (Laravel)**
- **Framework**: Laravel (PHP)
- **API**: RESTful API architecture
- **Authentication**: Laravel Sanctum
- **Database**: MySQL with Eloquent ORM
- **Validation**: Laravel form request validation
- **File Handling**: PDF generation, file uploads
- **Email**: Laravel mail system

### **Development Tools**
- **Build Tool**: Vite (Fast development & optimized builds)
- **Package Manager**: npm for frontend, Composer for backend
- **Linting**: ESLint + Prettier
- **Version Control**: Git
- **Environment**: Multiple environment support (.env.development, .env.production)

## 🔐 **Permission System Architecture**

### **Permission Structure**
- **Naming Convention**: `{action}_{module}` (e.g., `view_pos`, `create_purchaseorder`)
- **Actions**: view, create, edit, delete, print, email, export
- **Modules**: pos, sale, purchaseorder, customer, product, supplier, etc.

### **Frontend Protection**
- **PermissionRoute**: Protects entire pages/routes
- **PermissionGuard**: Protects individual UI elements
- **usePermissions Hook**: Permission checking utilities
- **Navigation Filtering**: Automatic menu item filtering

### **Backend Security**
- **Middleware**: CheckPermission middleware for API protection
- **Role Hierarchy**: Admin role automatically has all permissions
- **User Model**: Built-in permission checking methods

## 📁 **Module Structure & Features**

### **1. Dashboard Module**
- **File**: `src/views/Dashboard.jsx`
- **Features**: Business metrics, KPIs, charts
- **Permissions**: `view_dashboard`, `create_dashboard`, `edit_dashboard`

### **2. Product Management**
- **Files**: `src/views/products/`
- **Features**: Product catalog, categories, brands, units, stock management
- **Permissions**: `view_product`, `create_product`, `edit_product`, `delete_product`, `export_product`
- **API**: `backend/app/Http/Controllers/API/ProductController.php`

### **3. Customer Management**
- **Files**: `src/views/customers/`
- **Features**: Customer records, history, wallet integration
- **Permissions**: `view_customer`, `create_customer`, `edit_customer`, `delete_customer`, `email_customer`
- **API**: `backend/app/Http/Controllers/API/CustomerController.php`

### **4. Supplier Management**
- **Files**: `src/views/suppliers/`
- **Features**: Supplier records, contact details, performance tracking
- **Permissions**: `view_supplier`, `create_supplier`, `edit_supplier`, `delete_supplier`
- **API**: `backend/app/Http/Controllers/API/SupplierController.php`

### **5. Purchase Management**
- **Files**: 
  - `src/views/purchases/PurchaseOrderForm.jsx`
  - `src/views/purchases/PurchaseOrderList.jsx`
  - `src/views/purchases/PurchasedList.jsx`
  - `src/views/purchases/PurchaseOrderDetail.jsx`
- **Features**: 
  - Purchase order creation and management
  - Status workflow: Draft → Sent → Received → Completed → Cancelled
  - Supplier integration
  - Payment tracking
  - Stock updates
- **Permissions**: `view_purchaseorder`, `create_purchaseorder`, `edit_purchaseorder`, `delete_purchaseorder`
- **API**: `backend/app/Http/Controllers/PurchaseOrderController.php`

### **6. Sales Management**
- **Files**: 
  - `src/views/pos/PosPage.jsx`
  - `src/views/invoices/`
- **Features**:
  - **POS System**: Barcode scanning, product search, cart management, payment processing
  - **Invoices**: Sales history, invoice generation, customer management
  - **Payment Methods**: Cash, Card, UPI, Wallet
  - **Discount System**: Percentage and fixed amount discounts
- **Permissions**: `view_pos`, `create_pos`, `view_sale`, `create_sale`, `edit_sale`
- **API**: `backend/app/Http/Controllers/API/SaleController.php`

### **7. Master Data Management**
- **Files**: `src/views/masters/`
- **Features**: Categories, Sub-categories, Brands, Units, Expense Categories
- **Permissions**: `view_master`, `create_master`, `edit_master`, `delete_master`

### **8. Employee Management**
- **Files**: `src/views/employees/`
- **Features**: Employee records, salary management, performance tracking
- **Permissions**: `view_employee`, `create_employee`, `edit_employee`, `delete_employee`

### **9. Expense Management**
- **Files**: `src/views/expenses/`
- **Features**: Expense tracking, categorization, reporting
- **Permissions**: `view_expense`, `create_expense`, `edit_expense`, `delete_expense`

### **10. Wallet & Financial Management**
- **Files**: `src/views/wallet/`
- **Features**: Customer wallets, transactions, balance tracking
- **Permissions**: `view_wallet`, `view_ledger`, `print_wallet`, `export_wallet`
- **API**: `backend/app/Http/Controllers/API/WalletController.php`

### **11. User Management**
- **Files**: `src/views/users/`
- **Features**: User accounts, roles, permissions, access control
- **Permissions**: `view_user`, `create_user`, `edit_user`, `delete_user`, `manage_roles`
- **API**: `backend/app/Http/Controllers/API/UserController.php`, `RoleController.php`

### **12. Reports & Analytics**
- **Files**: `src/views/reports/`
- **Features**: 
  - Product-wise margin reports
  - Company Profit & Loss (P&L) reports
  - Business financial dashboard
  - Sales vs. Purchases charts
- **Permissions**: `view_reports`, `export_reports`

### **13. Email Management**
- **Files**: `src/views/emails/`
- **Features**: Email templates, customer communication, system notifications
- **Permissions**: `view_email`, `create_email`, `edit_email`, `delete_email`
- **API**: `backend/app/Http/Controllers/API/EmailController.php`

### **14. Settings & Configuration**
- **Files**: `src/views/settings/`
- **Features**: System configuration, preferences, backup/restore
- **Permissions**: `view_setting`, `manage_settings`, `backup_data`, `restore_data`

## 🗄️ **Database Structure**

### **Key Tables**
- **users**: User accounts and authentication
- **roles**: User roles
- **permissions**: System permissions
- **products**: Product catalog and inventory
- **customers**: Customer information
- **suppliers**: Supplier details
- **purchase_orders**: Purchase order management
- **purchase_order_items**: Purchase order line items
- **sales**: Sales transactions
- **sale_items**: Sales line items
- **wallet_accounts**: Customer wallet accounts
- **wallet_transactions**: Financial transactions
- **categories**: Product categories
- **brands**: Product brands
- **units**: Product units
- **expenses**: Expense tracking
- **employees**: Employee records

### **Relationships**
- **One-to-Many**: Customer → Sales, Supplier → Purchase Orders
- **Many-to-Many**: Users ↔ Roles, Roles ↔ Permissions
- **Polymorphic**: Wallet transactions for different entity types

## 🚀 **Development & Deployment**

### **Environment Setup**
- **Frontend**: `.env.development`, `.env.production`
- **Backend**: `backend/.env.development`, `backend/.env.production`
- **Database**: Separate databases for development and production

### **Build Commands**
```bash
# Frontend Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend Development
cd backend
php artisan serve    # Start Laravel server
composer install     # Install dependencies
php artisan migrate  # Run database migrations
```

### **Deployment**
- **Frontend**: Build and deploy `dist/` folder
- **Backend**: Deploy Laravel application with production environment
- **Database**: Production MySQL/RDS setup
- **Web Server**: Nginx configuration for frontend + API proxy

## 🔧 **Key Features & Capabilities**

### **POS System Features**
- Real-time barcode scanning
- Product search and selection
- Shopping cart management
- Multiple payment methods
- Customer wallet integration
- Discount and tax calculations
- Invoice generation
- Stock validation
- Audio feedback
- Real-time clock

### **Purchase Management Features**
- Purchase order creation
- Supplier management
- Product selection
- Status workflow management
- Payment tracking
- Delivery management
- PDF export
- Email integration

### **Business Intelligence**
- Dashboard with KPIs
- Sales analytics
- Purchase analysis
- Profit & loss reports
- Product margin analysis
- Customer insights
- Financial reporting

### **Security Features**
- Role-based access control
- Permission-based UI rendering
- API endpoint protection
- User authentication
- Session management
- Audit logging

## 📱 **User Interface**

### **Design System**
- **Framework**: CoreUI 5 (Bootstrap-based)
- **Components**: Pre-built React components
- **Icons**: CoreUI Icons library
- **Responsive**: Mobile-first design approach
- **Theme**: Customizable color schemes

### **Navigation Structure**
- **Sidebar**: Collapsible navigation with permission filtering
- **Top Bar**: User info, notifications, quick actions
- **Breadcrumbs**: Page navigation context
- **Search**: Global search functionality

### **Component Library**
- **Forms**: Input fields, selects, textareas, checkboxes
- **Tables**: Sortable, filterable data tables
- **Modals**: Dialog boxes for actions
- **Cards**: Content containers
- **Buttons**: Action buttons with icons
- **Alerts**: Success, warning, error messages

## 🔄 **API Architecture**

### **RESTful Endpoints**
- **Authentication**: `/api/auth/*`
- **Products**: `/api/products/*`
- **Customers**: `/api/customers/*`
- **Suppliers**: `/api/suppliers/*`
- **Sales**: `/api/sales/*`
- **Purchase Orders**: `/api/purchase-orders/*`
- **Users**: `/api/users/*`
- **Reports**: `/api/reports/*`

### **Response Format**
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful",
  "pagination": {...}
}
```

### **Error Handling**
- **Validation Errors**: Form validation responses
- **Permission Errors**: Access denied responses
- **System Errors**: Server error handling
- **User Feedback**: Toast notifications

## 📊 **Performance & Scalability**

### **Frontend Optimization**
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Component lazy loading
- **Bundle Optimization**: Vite build optimization
- **Caching**: Browser caching strategies

### **Backend Optimization**
- **Database Indexing**: Optimized database queries
- **Caching**: Laravel caching mechanisms
- **API Optimization**: Efficient API responses
- **File Handling**: Optimized file uploads

## 🧪 **Testing & Quality**

### **Frontend Testing**
- **Linting**: ESLint configuration
- **Formatting**: Prettier code formatting
- **Type Checking**: PropTypes validation
- **Component Testing**: React component testing

### **Backend Testing**
- **Unit Tests**: PHPUnit testing framework
- **Feature Tests**: API endpoint testing
- **Database Testing**: Migration and seeder testing

## 📚 **Documentation & Resources**

### **Available Documentation**
- **Project Prompt**: `project-prompt.md`
- **Environment Setup**: `ENVIRONMENT_SETUP.md`
- **Permission System**: `PERMISSION_SYSTEM.md`
- **Detailed Permissions**: `DETAILED_PERMISSIONS.md`
- **Server Build Steps**: `SERVER_BUILD_STEPS.md`
- **Laravel Deployment**: `LARAVEL_APACHE_DEPLOYMENT.md`

### **Code Organization**
- **Frontend**: `src/` directory with modular structure
- **Backend**: `backend/` directory with Laravel structure
- **Database**: `database/migrations/` for schema management
- **Configuration**: Environment-specific config files

## 🎯 **Business Use Cases**

### **Retail Operations**
- Point of sale transactions
- Inventory management
- Customer relationship management
- Sales reporting and analytics

### **Purchase Management**
- Supplier relationship management
- Purchase order processing
- Inventory procurement
- Cost tracking and analysis

### **Financial Management**
- Revenue tracking
- Expense management
- Profit and loss analysis
- Cash flow management

### **Business Intelligence**
- Performance metrics
- Trend analysis
- Decision support
- Strategic planning

---

## 📝 **Quick Reference**

### **Common Commands**
```bash
# Start development
npm run dev
cd backend && php artisan serve

# Build for production
npm run build
cd backend && composer install --optimize-autoloader --no-dev

# Database operations
cd backend && php artisan migrate
cd backend && php artisan db:seed
```

### **Key File Locations**
- **Main App**: `src/App.jsx`
- **Navigation**: `src/_nav.jsx`
- **Routes**: `src/routes.js`
- **POS System**: `src/views/pos/PosPage.jsx`
- **Purchase Orders**: `src/views/purchases/`
- **Backend API**: `backend/app/Http/Controllers/`

### **Permission Examples**
- **POS Access**: `view_pos`, `create_pos`
- **Purchase Management**: `view_purchaseorder`, `create_purchaseorder`
- **Customer Management**: `view_customer`, `create_customer`
- **Product Management**: `view_product`, `create_product`

---

**This document serves as a comprehensive reference for the Krimah POS system architecture, features, and implementation details. Use it for development, maintenance, and onboarding purposes.** 