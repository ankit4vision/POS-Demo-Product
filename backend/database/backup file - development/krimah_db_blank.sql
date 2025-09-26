-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 17, 2025 at 03:13 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `krimah_db_live2`
--

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Sony', 'active', NULL, NULL),
(2, 'Samsung', 'active', NULL, NULL),
(3, 'Ikea', 'inactive', NULL, NULL),
(4, 'Amul', 'active', NULL, NULL),
(5, 'Mother Dairy', 'active', NULL, NULL),
(6, 'Britannia', 'active', NULL, NULL),
(7, 'Parle', 'active', NULL, NULL),
(8, 'Dabur', 'active', NULL, NULL),
(9, 'Haldiram', 'active', NULL, NULL),
(10, 'Tata', 'active', NULL, NULL),
(11, 'Nestle', 'active', NULL, NULL),
(12, 'Pepsi', 'active', NULL, NULL),
(13, 'Coca Cola', 'active', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Electronics', 'active', NULL, NULL),
(2, 'Furniture', 'active', NULL, NULL),
(3, 'Stationery', 'inactive', NULL, NULL),
(4, 'Fruits & Vegetables', 'active', NULL, NULL),
(5, 'Dairy', 'active', NULL, NULL),
(6, 'Bakery', 'active', NULL, NULL),
(7, 'Beverages', 'active', NULL, NULL),
(8, 'Snacks', 'active', NULL, NULL),
(9, 'Personal Care', 'active', NULL, NULL),
(10, 'Household', 'active', NULL, NULL),
(11, 'Staples', 'active', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `type` enum('customer','retailer') NOT NULL DEFAULT 'customer',
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gst_number` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `emails`
--

CREATE TABLE `emails` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `to_email` varchar(255) NOT NULL,
  `from_email` varchar(255) NOT NULL,
  `type` enum('invoice','wallet_ledger','supplier_details','purchase_order') NOT NULL,
  `subject` varchar(500) NOT NULL,
  `body` longtext NOT NULL,
  `send_status` enum('sent','failed') NOT NULL DEFAULT 'sent',
  `response_message` text DEFAULT NULL,
  `related_id` bigint(20) UNSIGNED DEFAULT NULL,
  `related_type` varchar(50) DEFAULT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `date_of_joining` date DEFAULT NULL,
  `status` enum('active','inactive','terminated') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `first_name`, `last_name`, `email`, `phone`, `designation`, `department`, `address`, `date_of_joining`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Ankit', 'Patel', 'admin@example.com', '07123456789', 'Software', 'Engg', 'Khodaamba', '1991-12-13', 'active', '2025-07-08 06:13:15', '2025-07-08 06:13:48');

-- --------------------------------------------------------

--
-- Table structure for table `employee_salaries`
--

CREATE TABLE `employee_salaries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `month` varchar(7) NOT NULL,
  `base_salary` decimal(10,2) NOT NULL,
  `allowances` decimal(10,2) NOT NULL DEFAULT 0.00,
  `deductions` decimal(10,2) NOT NULL DEFAULT 0.00,
  `net_salary` decimal(10,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `expense_category_id` bigint(20) UNSIGNED NOT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expense_categories`
--

CREATE TABLE `expense_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expense_categories`
--

INSERT INTO `expense_categories` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Travel', 'active', NULL, NULL),
(2, 'Office Supplies', 'active', NULL, NULL),
(3, 'Utilities', 'inactive', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2024_03_19_000000_create_roles_table', 1),
(6, '2024_03_20_000000_add_fields_to_users_table', 1),
(7, '2024_03_22_000000_create_user_role_table', 1),
(8, '2025_06_16_151045_create_permissions_table', 1),
(9, '2025_06_16_151100_create_role_permission_table', 1),
(10, '2025_07_01_135833_create_categories_table', 1),
(11, '2025_07_01_135852_create_sub_categories_table', 1),
(12, '2025_07_01_135857_create_brands_table', 1),
(13, '2025_07_01_135902_create_units_table', 1),
(14, '2025_07_01_135907_create_expense_categories_table', 1),
(15, '2025_07_01_135908_create_customers_table', 1),
(16, '2025_07_01_135909_create_wallet_accounts_table', 1),
(17, '2025_07_01_135911_create_products_table', 1),
(18, '2025_07_02_071647_add_discount_to_products_table', 1),
(19, '2025_07_02_075602_create_sales_table', 1),
(20, '2025_07_02_075605_create_sale_items_table', 1),
(21, '2025_07_02_075609_create_wallet_transactions_table', 1),
(22, '2025_07_02_075610_add_payment_method_and_reference_to_wallet_transactions_table', 1),
(23, '2025_07_02_100000_add_description_to_wallet_transactions_table', 2),
(24, '2025_07_02_210000_update_sales_table_add_summary_fields', 3),
(25, '2025_07_02_210001_update_sale_items_table_add_discount_tax', 4),
(26, '2025_07_02_210002_create_sales_transactions_table', 4),
(27, '2025_07_02_220000_add_invoice_ref_to_sales_table', 5),
(28, '2025_07_04_105020_create_suppliers_table', 6),
(29, '2025_07_04_115459_create_purchase_orders_table', 7),
(30, '2025_07_04_115509_create_purchase_order_items_table', 7),
(31, '2025_07_04_115516_create_purchases_table', 7),
(32, '2025_07_04_115522_create_purchase_items_table', 7),
(33, '2025_07_04_143753_add_reference_to_purchase_orders_table', 8),
(34, '2025_07_04_182907_update_purchase_order_items_table', 9),
(35, '2025_07_04_182918_add_payment_fields_to_purchase_orders_table', 9),
(36, '2025_07_04_182933_create_purchase_transactions_table', 9),
(37, '2025_07_04_200000_add_purchase_date_to_purchase_orders_table', 10),
(38, '2025_07_04_200001_add_last_purchase_date_to_products_table', 10),
(39, '2025_07_04_200002_add_received_status_to_purchase_order_items_table', 10),
(40, '2024_07_05_000001_create_employees_table', 11),
(41, '2024_07_05_000002_create_employee_salaries_table', 11),
(42, '2025_07_05_000100_create_expenses_table', 12),
(43, '2025_07_05_000200_create_settings_table', 13),
(44, '2025_07_09_000001_drop_purchases_tables', 14),
(45, '2025_07_10_155854_create_emails_table', 15),
(46, '2025_01_20_000000_update_permissions_structure', 16),
(47, '2025_07_12_144010_add_soft_delete_columns_to_permissions_and_roles_tables', 17);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `module` varchar(255) DEFAULT NULL,
  `submodule` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `description`, `module`, `submodule`, `type`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'create_dashboard', 'Create permission for Dashboard', 'Dashboard', 'Dashboard', 'create', 1, 0, '2025-07-12 08:58:40', '2025-07-12 08:58:40'),
(2, 'edit_dashboard', 'Edit permission for Dashboard', 'Dashboard', 'Dashboard', 'edit', 1, 0, '2025-07-12 08:58:40', '2025-07-12 08:58:40'),
(3, 'delete_dashboard', 'Delete permission for Dashboard', 'Dashboard', 'Dashboard', 'delete', 1, 0, '2025-07-12 08:58:40', '2025-07-12 08:58:40'),
(4, 'view_dashboard', 'View dashboard', 'Dashboard', 'Dashboard', 'view', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(5, 'create_user', 'Create user', 'User', 'User', 'create', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(6, 'edit_user', 'Edit user', 'User', 'User', 'edit', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(7, 'delete_user', 'Delete user', 'User', 'User', 'delete', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(8, 'view_user', 'View user', 'User', 'User', 'view', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(9, 'create_product', 'Create product', 'Product', 'Product', 'create', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(10, 'edit_product', 'Edit product', 'Product', 'Product', 'edit', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(11, 'delete_product', 'Delete product', 'Product', 'Product', 'delete', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(12, 'view_product', 'View product', 'Product', 'Product', 'view', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(13, 'create_customer', 'Create customer', 'Customer', 'Customer', 'create', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(14, 'edit_customer', 'Edit customer', 'Customer', 'Customer', 'edit', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(15, 'delete_customer', 'Delete customer', 'Customer', 'Customer', 'delete', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(16, 'view_customer', 'View customer', 'Customer', 'Customer', 'view', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(17, 'create_supplier', 'Create supplier', 'Supplier', 'Supplier', 'create', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(18, 'edit_supplier', 'Edit supplier', 'Supplier', 'Supplier', 'edit', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(19, 'delete_supplier', 'Delete supplier', 'Supplier', 'Supplier', 'delete', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(20, 'view_supplier', 'View supplier', 'Supplier', 'Supplier', 'view', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(21, 'create_purchaseorder', 'Create permission for PurchaseOrder', 'Purchase Order', 'PurchaseOrder', 'create', 1, 0, '2025-07-12 08:58:40', '2025-07-12 08:58:40'),
(22, 'edit_purchaseorder', 'Edit permission for PurchaseOrder', 'Purchase Order', 'PurchaseOrder', 'edit', 1, 0, '2025-07-12 08:58:40', '2025-07-12 08:58:40'),
(23, 'delete_purchaseorder', 'Delete permission for PurchaseOrder', 'Purchase Order', 'PurchaseOrder', 'delete', 1, 0, '2025-07-12 08:58:40', '2025-07-12 08:58:40'),
(24, 'view_purchaseorder', 'View purchaseorder', 'Purchase Order', 'PurchaseOrder', 'view', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(25, 'create_purchasedorder', 'Create permission for PurchasedOrder', 'Purchased Order', 'PurchasedOrder', 'create', 1, 0, '2025-07-12 08:58:40', '2025-07-12 08:58:40'),
(26, 'edit_purchasedorder', 'Edit permission for PurchasedOrder', 'Purchased Order', 'PurchasedOrder', 'edit', 1, 0, '2025-07-12 08:58:40', '2025-07-12 08:58:40'),
(27, 'delete_purchasedorder', 'Delete permission for PurchasedOrder', 'Purchased Order', 'PurchasedOrder', 'delete', 1, 0, '2025-07-12 08:58:40', '2025-07-12 08:58:40'),
(28, 'view_purchasedorder', 'View purchasedorder', 'Purchased Order', 'PurchasedOrder', 'view', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(29, 'create_pos', 'Create pos', 'POS', 'POS', 'create', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(30, 'edit_pos', 'Edit permission for POS', 'POS', 'POS', 'edit', 1, 0, '2025-07-12 08:58:40', '2025-07-12 08:58:40'),
(31, 'delete_pos', 'Delete permission for POS', 'POS', 'POS', 'delete', 1, 0, '2025-07-12 08:58:40', '2025-07-12 08:58:40'),
(32, 'view_pos', 'View pos', 'POS', 'POS', 'view', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(33, 'create_sale', 'Create permission for Sale', 'Sale', 'Sale', 'create', 1, 0, '2025-07-12 08:58:40', '2025-07-12 08:58:40'),
(34, 'edit_sale', 'Edit sale', 'Sale', 'Sale', 'edit', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(35, 'delete_sale', 'Delete sale', 'Sale', 'Sale', 'delete', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(36, 'view_sale', 'View sale', 'Sale', 'Sale', 'view', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(37, 'create_master', 'Create master', 'Master', 'Master', 'create', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(38, 'edit_master', 'Edit master', 'Master', 'Master', 'edit', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(39, 'delete_master', 'Delete master', 'Master', 'Master', 'delete', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(40, 'view_master', 'View master', 'Master', 'Master', 'view', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(41, 'create_employee', 'Create employee', 'Employee', 'Employee', 'create', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(42, 'edit_employee', 'Edit employee', 'Employee', 'Employee', 'edit', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(43, 'delete_employee', 'Delete employee', 'Employee', 'Employee', 'delete', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(44, 'view_employee', 'View employee', 'Employee', 'Employee', 'view', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(45, 'create_expense', 'Create expense', 'Expense', 'Expense', 'create', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(46, 'edit_expense', 'Edit expense', 'Expense', 'Expense', 'edit', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(47, 'delete_expense', 'Delete expense', 'Expense', 'Expense', 'delete', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(48, 'view_expense', 'View expense', 'Expense', 'Expense', 'view', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(49, 'create_setting', 'Create permission for Setting', 'Setting', 'Setting', 'create', 1, 0, '2025-07-12 08:58:40', '2025-07-12 08:58:40'),
(50, 'edit_setting', 'Edit permission for Setting', 'Setting', 'Setting', 'edit', 1, 0, '2025-07-12 08:58:40', '2025-07-12 08:58:40'),
(51, 'delete_setting', 'Delete permission for Setting', 'Setting', 'Setting', 'delete', 1, 0, '2025-07-12 08:58:40', '2025-07-12 08:58:40'),
(52, 'view_setting', 'View setting', 'Setting', 'Setting', 'view', 1, 0, '2025-07-12 08:58:40', '2025-07-14 05:24:28'),
(53, 'create_email', 'Create email', 'Email', 'Email', 'create', 1, 0, '2025-07-12 09:26:49', '2025-07-14 05:24:28'),
(54, 'edit_email', 'Edit permission for Email', 'Email', 'Email', 'edit', 1, 0, '2025-07-12 09:26:49', '2025-07-12 09:26:49'),
(55, 'delete_email', 'Delete permission for Email', 'Email', 'Email', 'delete', 1, 0, '2025-07-12 09:26:49', '2025-07-12 09:26:49'),
(56, 'view_email', 'View email', 'Email', 'Email', 'view', 1, 0, '2025-07-12 09:26:49', '2025-07-14 05:24:28'),
(57, 'create_payment', 'Create permission for Payment', 'Payment', 'Payment', 'create', 1, 0, '2025-07-12 09:26:49', '2025-07-12 09:26:49'),
(58, 'edit_payment', 'Edit permission for Payment', 'Payment', 'Payment', 'edit', 1, 0, '2025-07-12 09:26:49', '2025-07-12 09:26:49'),
(59, 'delete_payment', 'Delete permission for Payment', 'Payment', 'Payment', 'delete', 1, 0, '2025-07-12 09:26:49', '2025-07-12 09:26:49'),
(60, 'view_payment', 'View payment', 'Payment', 'Payment', 'view', 1, 0, '2025-07-12 09:26:49', '2025-07-14 05:24:28'),
(61, 'print_product', 'Print Product documents and reports', 'Product', 'Product', 'print', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(62, 'export_product', 'Export Product data to PDF/Excel', 'Product', 'Product', 'export', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(63, 'print_customer', 'Print customer', 'Customer', 'Customer', 'print', 1, 0, '2025-07-14 03:21:30', '2025-07-14 05:24:28'),
(64, 'email_customer', 'Email customer', 'Customer', 'Customer', 'email', 1, 0, '2025-07-14 03:21:30', '2025-07-14 05:24:28'),
(65, 'export_customer', 'Export customer', 'Customer', 'Customer', 'export', 1, 0, '2025-07-14 03:21:30', '2025-07-14 05:24:28'),
(66, 'print_supplier', 'Print Supplier documents and reports', 'Supplier', 'Supplier', 'print', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(67, 'email_supplier', 'Send emails for Supplier', 'Supplier', 'Supplier', 'email', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(68, 'export_supplier', 'Export Supplier data to PDF/Excel', 'Supplier', 'Supplier', 'export', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(69, 'print_purchaseorder', 'Print PurchaseOrder documents and reports', 'Purchase Order', 'PurchaseOrder', 'print', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(70, 'email_purchaseorder', 'Send emails for PurchaseOrder', 'Purchase Order', 'PurchaseOrder', 'email', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(71, 'export_purchaseorder', 'Export PurchaseOrder data to PDF/Excel', 'Purchase Order', 'PurchaseOrder', 'export', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(72, 'print_purchasedorder', 'Print PurchasedOrder documents and reports', 'Purchased Order', 'PurchasedOrder', 'print', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(73, 'email_purchasedorder', 'Send emails for PurchasedOrder', 'Purchased Order', 'PurchasedOrder', 'email', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(74, 'export_purchasedorder', 'Export PurchasedOrder data to PDF/Excel', 'Purchased Order', 'PurchasedOrder', 'export', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(75, 'print_sale', 'Print Sale documents and reports', 'Sale', 'Sale', 'print', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(76, 'email_sale', 'Send emails for Sale', 'Sale', 'Sale', 'email', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(77, 'export_sale', 'Export Sale data to PDF/Excel', 'Sale', 'Sale', 'export', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(78, 'print_employee', 'Print Employee documents and reports', 'Employee', 'Employee', 'print', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(79, 'email_employee', 'Send emails for Employee', 'Employee', 'Employee', 'email', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(80, 'export_employee', 'Export Employee data to PDF/Excel', 'Employee', 'Employee', 'export', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(81, 'print_expense', 'Print Expense documents and reports', 'Expense', 'Expense', 'print', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(82, 'export_expense', 'Export Expense data to PDF/Excel', 'Expense', 'Expense', 'export', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(83, 'create_wallet', 'Create permission for Wallet', 'Wallet', 'Wallet', 'create', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(84, 'edit_wallet', 'Edit permission for Wallet', 'Wallet', 'Wallet', 'edit', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(85, 'delete_wallet', 'Delete permission for Wallet', 'Wallet', 'Wallet', 'delete', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(86, 'view_wallet', 'View wallet', 'Wallet', 'Wallet', 'view', 1, 0, '2025-07-14 03:21:30', '2025-07-14 05:24:28'),
(87, 'print_wallet', 'Print Wallet documents and reports', 'Wallet', 'Wallet', 'print', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(88, 'email_wallet', 'Send emails for Wallet', 'Wallet', 'Wallet', 'email', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(89, 'export_wallet', 'Export Wallet data to PDF/Excel', 'Wallet', 'Wallet', 'export', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(90, 'create_ledger', 'Create permission for Ledger', 'Ledger', 'Ledger', 'create', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(91, 'edit_ledger', 'Edit permission for Ledger', 'Ledger', 'Ledger', 'edit', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(92, 'delete_ledger', 'Delete permission for Ledger', 'Ledger', 'Ledger', 'delete', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(93, 'view_ledger', 'View ledger', 'Ledger', 'Ledger', 'view', 1, 0, '2025-07-14 03:21:30', '2025-07-14 05:24:28'),
(94, 'print_ledger', 'Print Ledger documents and reports', 'Ledger', 'Ledger', 'print', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(95, 'email_ledger', 'Send emails for Ledger', 'Ledger', 'Ledger', 'email', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(96, 'export_ledger', 'Export Ledger data to PDF/Excel', 'Ledger', 'Ledger', 'export', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(97, 'manage_roles', 'Manage user roles and permissions', 'User', 'Role', 'manage', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(98, 'assign_permissions', 'Assign permissions to roles', 'User', 'Role', 'assign', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(99, 'view_reports', 'View system reports and analytics', 'Dashboard', 'Report', 'view', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(100, 'export_reports', 'Export reports to various formats', 'Dashboard', 'Report', 'export', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(101, 'manage_settings', 'Manage system settings and configuration', 'Setting', 'System', 'manage', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(102, 'backup_data', 'Create and manage data backups', 'Setting', 'System', 'backup', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(103, 'restore_data', 'Restore data from backups', 'Setting', 'System', 'restore', 1, 0, '2025-07-14 03:21:30', '2025-07-14 03:21:30'),
(104, 'view_role', 'View role', NULL, NULL, NULL, 1, 0, '2025-07-14 05:24:28', '2025-07-14 05:24:28'),
(105, 'edit_role', 'Edit role', NULL, NULL, NULL, 1, 0, '2025-07-14 05:24:28', '2025-07-14 05:24:28'),
(106, 'create_purchase_order', 'Create purchase order', NULL, NULL, NULL, 1, 0, '2025-07-14 05:24:28', '2025-07-14 05:24:28'),
(107, 'edit_purchase_order', 'Edit purchase order', NULL, NULL, NULL, 1, 0, '2025-07-14 05:24:28', '2025-07-14 05:24:28'),
(108, 'delete_purchase_order', 'Delete purchase order', NULL, NULL, NULL, 1, 0, '2025-07-14 05:24:28', '2025-07-14 05:24:28'),
(109, 'edit_purchase', 'Edit purchase', NULL, NULL, NULL, 1, 0, '2025-07-14 05:24:28', '2025-07-14 05:24:28');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth-token', '185cee76f57270b217b2777d5803fac0ac6c0bdef7569a5a98c816a8cf35c56c', '[\"*\"]', '2025-07-04 05:31:43', NULL, '2025-07-02 03:08:49', '2025-07-04 05:31:43'),
(3, 'App\\Models\\User', 1, 'auth-token', '080f87aa7c8f3850d2591be4916626b7d51bd36ec3eab66542d27f16635ee5d7', '[\"*\"]', '2025-07-05 04:58:05', NULL, '2025-07-04 08:45:48', '2025-07-05 04:58:05'),
(6, 'App\\Models\\User', 1, 'auth-token', '8f539354834fb657ded46fda88f9ff6ea4df7fd176e1301a4e06bfd2b845224f', '[\"*\"]', '2025-07-05 08:44:39', NULL, '2025-07-05 08:44:37', '2025-07-05 08:44:39'),
(8, 'App\\Models\\User', 1, 'auth-token', '64f7e3cca2b95da474ed2f9ac31cc58d6f47bd72b17e45f07c119d84ced6ffa6', '[\"*\"]', '2025-07-05 09:42:34', NULL, '2025-07-05 09:09:43', '2025-07-05 09:42:34'),
(12, 'App\\Models\\User', 1, 'auth-token', '1e675d487c3f58ff5af42fa118153acebe23e1a6cc6dab2f9b0ab7423d22b4b8', '[\"*\"]', '2025-07-09 09:10:43', NULL, '2025-07-09 09:10:41', '2025-07-09 09:10:43'),
(13, 'App\\Models\\User', 1, 'auth-token', '7015622104643358a1d84c9e3ff0fb09fdd2558e8126bb2afbfda435726105f9', '[\"*\"]', '2025-07-09 09:41:36', NULL, '2025-07-09 09:12:42', '2025-07-09 09:41:36'),
(14, 'App\\Models\\User', 1, 'auth-token', 'e63b371a2ad19ae337cad7fb7d2f5c9e89a76c8136d8b69bf128c65409e4fef1', '[\"*\"]', '2025-07-09 16:54:32', NULL, '2025-07-09 09:47:52', '2025-07-09 16:54:32'),
(19, 'App\\Models\\User', 1, 'auth-token', '4c77a26d01e7b133d24a2cc3884a225fd48d81b0f29fb6dba2f625ae7f4b5905', '[\"*\"]', '2025-07-11 08:21:29', NULL, '2025-07-11 07:13:09', '2025-07-11 08:21:29'),
(20, 'App\\Models\\User', 1, 'auth-token', 'b253e12c55e3aa532e5c165baf2dc42674d5b703bf6f5f4e476d9ff2c6337d8d', '[\"*\"]', '2025-07-12 04:42:39', NULL, '2025-07-11 08:47:36', '2025-07-12 04:42:39'),
(21, 'App\\Models\\User', 1, 'auth-token', 'f0d800ce0f81579fd3c4533743edafeb248aff324b3b16743f229a4fc0cda0e4', '[\"*\"]', '2025-07-12 05:01:22', NULL, '2025-07-12 04:47:46', '2025-07-12 05:01:22'),
(26, 'App\\Models\\User', 1, 'auth-token', '34be1a764512d20c392ea584aa63e501084388d90e56c5466ada2ca6ff53da1a', '[\"*\"]', '2025-07-12 09:57:40', NULL, '2025-07-12 09:46:01', '2025-07-12 09:57:40'),
(27, 'App\\Models\\User', 1, 'auth-token', 'dfcb3368cfdbe4975948684ee516681e207c8d20cd6e1daf7940486d346ae3df', '[\"*\"]', '2025-07-12 10:04:47', NULL, '2025-07-12 09:50:17', '2025-07-12 10:04:47'),
(29, 'App\\Models\\User', 1, 'auth-token', '7f5c663a8a6cde55b0e8aa508aa718d364e10e3a41fcbc7597aec1714e7bc8d0', '[\"*\"]', '2025-07-14 02:51:09', NULL, '2025-07-14 00:24:46', '2025-07-14 02:51:09'),
(32, 'App\\Models\\User', 2, 'auth-token', 'bd1b33a32a1465ff426c8d663ac6e9955b0b1697c05abf9ec31cfc84b2aba22b', '[\"*\"]', '2025-07-14 02:10:57', NULL, '2025-07-14 02:06:51', '2025-07-14 02:10:57'),
(34, 'App\\Models\\User', 2, 'auth-token', '0807a27fa1db55326aa12264a62dc519e55cb4afd4df3a8c9f7ad7b63231e24c', '[\"*\"]', '2025-07-14 02:22:44', NULL, '2025-07-14 02:19:30', '2025-07-14 02:22:44'),
(36, 'App\\Models\\User', 1, 'auth-token', '57287491c4e22256ea3c49991aa63f027e7c79925dfa2991ebd0610a43917e2c', '[\"*\"]', '2025-07-14 03:52:28', NULL, '2025-07-14 03:00:50', '2025-07-14 03:52:28'),
(37, 'App\\Models\\User', 1, 'auth-token', 'ec1e04d02e3f7ea9793b50c58c3b3bc62c7d004b9714cdb08cb790a59861c3cb', '[\"*\"]', '2025-07-14 05:05:54', NULL, '2025-07-14 03:52:32', '2025-07-14 05:05:54'),
(40, 'App\\Models\\User', 1, 'auth-token', 'a7a35a5b82710d4a5a4c8a08785070bb1e489bc2e7f0d5d2991570b9ce4aeef9', '[\"*\"]', '2025-07-15 09:08:08', NULL, '2025-07-14 05:23:40', '2025-07-15 09:08:08'),
(41, 'App\\Models\\User', 1, 'auth-token', '618164f635b24bffb075f91a7767fd67524496cf952837fff69e6e9305796005', '[\"*\"]', '2025-07-16 06:44:44', NULL, '2025-07-15 09:08:23', '2025-07-16 06:44:44'),
(42, 'App\\Models\\User', 1, 'auth-token', 'f7419797e9beca80ca1c10201d16b8f0b3e7f65379ab91cabbcd1bd010ddb8cd', '[\"*\"]', '2025-07-16 06:29:27', NULL, '2025-07-16 05:49:14', '2025-07-16 06:29:27'),
(43, 'App\\Models\\User', 1, 'auth-token', '24a2beac841d5befbbafd64cd8f7ae7e94c4b90007ab6fadb1d771bb5909afe0', '[\"*\"]', '2025-07-17 00:43:39', NULL, '2025-07-16 22:22:48', '2025-07-17 00:43:39');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sub_category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `brand_id` bigint(20) UNSIGNED DEFAULT NULL,
  `unit_id` bigint(20) UNSIGNED DEFAULT NULL,
  `purchase_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `sales_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `retailer_sales_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `individual_sales_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `last_purchase_price` decimal(10,2) DEFAULT NULL,
  `last_purchase_date` date DEFAULT NULL,
  `vat_percent` decimal(5,2) DEFAULT NULL,
  `opening_stock` decimal(10,2) DEFAULT NULL,
  `low_stock_alert` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `discount` decimal(8,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `po_number` varchar(255) NOT NULL,
  `supplier_id` bigint(20) UNSIGNED NOT NULL,
  `order_date` date NOT NULL,
  `expected_delivery_date` date NOT NULL,
  `purchase_date` date DEFAULT NULL,
  `status` enum('draft','sent','received','completed','cancelled') NOT NULL DEFAULT 'draft',
  `notes` text DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `paid_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `paid_status` enum('remaining','paid') NOT NULL DEFAULT 'remaining',
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_items`
--

CREATE TABLE `purchase_order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `purchase_order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `received_status` enum('pending','received') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_transactions`
--

CREATE TABLE `purchase_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `purchase_order_id` bigint(20) UNSIGNED NOT NULL,
  `supplier_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','bank_transfer','cheque','credit_card','upi','other') NOT NULL DEFAULT 'cash',
  `status` enum('pending','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
  `reference_number` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `payment_date` date NOT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'Administrator role with full access', 1, 0, '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(2, 'Manager', 'Manager role with elevated access', 1, 0, '2025-07-02 03:08:33', '2025-07-02 03:08:33');

-- --------------------------------------------------------

--
-- Table structure for table `role_permission`
--

CREATE TABLE `role_permission` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permission`
--

INSERT INTO `role_permission` (`id`, `role_id`, `permission_id`, `created_at`, `updated_at`) VALUES
(1, 2, 1, NULL, NULL),
(2, 2, 2, NULL, NULL),
(3, 2, 3, NULL, NULL),
(4, 2, 4, NULL, NULL),
(5, 2, 16, NULL, NULL),
(6, 2, 8, NULL, NULL),
(7, 2, 12, NULL, NULL),
(8, 2, 20, NULL, NULL),
(9, 2, 24, NULL, NULL),
(10, 2, 28, NULL, NULL),
(11, 2, 32, NULL, NULL),
(12, 2, 36, NULL, NULL),
(13, 2, 40, NULL, NULL),
(14, 2, 44, NULL, NULL),
(15, 2, 48, NULL, NULL),
(16, 2, 56, NULL, NULL),
(17, 2, 60, NULL, NULL),
(18, 2, 9, NULL, NULL),
(19, 2, 11, NULL, NULL),
(20, 2, 13, NULL, NULL),
(21, 2, 14, NULL, NULL),
(22, 2, 86, NULL, NULL),
(23, 2, 93, NULL, NULL),
(24, 2, 90, NULL, NULL),
(25, 2, 91, NULL, NULL),
(26, 2, 17, NULL, NULL),
(27, 2, 18, NULL, NULL),
(28, 2, 53, NULL, NULL),
(29, 2, 6, NULL, NULL),
(30, 2, 5, NULL, NULL),
(32, 2, 45, NULL, NULL),
(33, 2, 29, NULL, NULL),
(34, 2, 34, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `grand_total` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `paid` decimal(10,2) NOT NULL DEFAULT 0.00,
  `due` decimal(10,2) NOT NULL DEFAULT 0.00,
  `mode` varchar(20) NOT NULL,
  `invoice_ref` varchar(32) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `round_off` decimal(10,2) NOT NULL DEFAULT 0.00,
  `rounded_total` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_transactions`
--

CREATE TABLE `sales_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sale_id` bigint(20) UNSIGNED NOT NULL,
  `payment_type` varchar(20) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sale_items`
--

CREATE TABLE `sale_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sale_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `qty` decimal(10,2) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `group` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `group`, `created_at`, `updated_at`) VALUES
(1, 'company_name', 'Krimah LTD', 'billing', '2025-07-08 06:44:07', '2025-07-08 06:44:07'),
(2, 'address', '57, Littel zone', 'billing', '2025-07-08 06:44:07', '2025-07-08 06:44:07'),
(3, 'city', 'UK', 'billing', '2025-07-08 06:44:07', '2025-07-08 06:44:07'),
(4, 'state', 'UK', 'billing', '2025-07-08 06:44:07', '2025-07-08 06:44:07'),
(5, 'country', 'UK', 'billing', '2025-07-08 06:44:07', '2025-07-08 06:44:07'),
(6, 'gstin', '1234567890', 'billing', '2025-07-08 06:44:07', '2025-07-08 06:44:07'),
(7, 'phone', '9898267675', 'billing', '2025-07-08 06:44:07', '2025-07-08 06:44:07'),
(8, 'email', 'krimah@gmail.com', 'billing', '2025-07-08 06:44:07', '2025-07-08 06:44:07'),
(9, 'smtp_host', 'smtp.gmail.com', 'email', '2025-07-08 06:44:49', '2025-07-12 04:16:23'),
(10, 'smtp_port', '587', 'email', '2025-07-08 06:44:49', '2025-07-12 04:16:23'),
(11, 'smtp_user', 'ankit4vision@gmail.com', 'email', '2025-07-08 06:44:49', '2025-07-10 23:13:56'),
(12, 'smtp_pass', 'mdhwrimeakuydwgz', 'email', '2025-07-08 06:44:49', '2025-07-12 04:16:23'),
(13, 'from_email', 'ankit4vision@gmail.com', 'email', '2025-07-08 06:44:49', '2025-07-08 06:44:49'),
(14, 'from_name', 'Ankit', 'email', '2025-07-08 06:44:49', '2025-07-12 04:16:23'),
(15, 's3_enabled', '1', 's3', '2025-07-16 22:38:48', '2025-07-17 00:03:53'),
(16, 'aws_access_key_id', 'AKIAUP6V65CCO4YML5KV', 's3', '2025-07-16 22:39:01', '2025-07-17 00:18:14'),
(17, 'aws_secret_access_key', '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', 's3', '2025-07-16 22:39:01', '2025-07-17 00:03:53'),
(18, 'aws_region', 'eu-north-1', 's3', '2025-07-16 22:39:01', '2025-07-17 00:03:53'),
(19, 'aws_bucket', 'krimah-pos-eu-north-1', 's3', '2025-07-16 22:39:01', '2025-07-17 00:03:53'),
(20, 's3_url', NULL, 's3', '2025-07-16 22:39:01', '2025-07-17 00:24:14'),
(21, 's3_endpoint', NULL, 's3', '2025-07-16 22:39:01', '2025-07-17 00:24:14'),
(22, 's3_folder', 'krimah_prod', 's3', '2025-07-17 00:20:48', '2025-07-17 00:27:30');

-- --------------------------------------------------------

--
-- Table structure for table `sub_categories`
--

CREATE TABLE `sub_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sub_categories`
--

INSERT INTO `sub_categories` (`id`, `category_id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Mobile Phones', 'active', NULL, NULL),
(2, 1, 'Laptops', 'active', NULL, NULL),
(3, 2, 'Chairs', 'inactive', NULL, NULL),
(4, 4, 'Fresh Fruits', 'active', NULL, NULL),
(5, 4, 'Leafy Greens', 'active', NULL, NULL),
(6, 4, 'Root Vegetables', 'active', NULL, NULL),
(7, 5, 'Milk', 'active', NULL, NULL),
(8, 5, 'Cheese', 'active', NULL, NULL),
(9, 5, 'Butter & Ghee', 'active', NULL, NULL),
(10, 6, 'Breads', 'active', NULL, NULL),
(11, 6, 'Cakes & Pastries', 'active', NULL, NULL),
(12, 7, 'Juices', 'active', NULL, NULL),
(13, 7, 'Soft Drinks', 'active', NULL, NULL),
(14, 8, 'Chips', 'active', NULL, NULL),
(15, 8, 'Biscuits', 'active', NULL, NULL),
(16, 9, 'Oral Care', 'active', NULL, NULL),
(17, 9, 'Hair Care', 'active', NULL, NULL),
(18, 10, 'Cleaning Supplies', 'active', NULL, NULL),
(19, 10, 'Laundry', 'active', NULL, NULL),
(20, 11, 'Rice', 'active', NULL, NULL),
(21, 11, 'Pulses', 'active', NULL, NULL),
(23, 11, 'test', 'active', '2025-07-15 09:29:21', '2025-07-15 09:29:21');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Piece', 'active', NULL, NULL),
(2, 'Box', 'active', NULL, NULL),
(3, 'Kg', 'active', NULL, NULL),
(4, 'Gram', 'active', NULL, NULL),
(5, 'Litre', 'active', NULL, NULL),
(6, 'Millilitre', 'active', NULL, NULL),
(7, 'Packet', 'active', NULL, NULL),
(8, 'Dozen', 'active', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `email_verified_at`, `password`, `remember_token`, `status`, `first_name`, `last_name`, `address`, `city`, `country`, `bio`, `created_at`, `updated_at`) VALUES
(1, 'Krimah Admin', 'admin@example.com', NULL, NULL, '$2y$10$1Mu9./3V6XrMxSM7eHcytuO21tvqmMzp3uIFkjQpLgd1f1XOuhkp2', NULL, 1, 'Krimah', 'Admin', NULL, NULL, NULL, NULL, '2025-07-02 03:08:33', '2025-07-15 09:34:52'),
(5, 'Ankit Patel', 'ankit4yt@gmail.com', '89888843874', NULL, '$2y$10$7whYKfkxLr3iu2CL9i1KPODfzu2pkgf/NsUR1QzOKyPLuoDkiAVei', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-11 06:43:58', '2025-07-11 07:11:03');

-- --------------------------------------------------------

--
-- Table structure for table `user_role`
--

CREATE TABLE `user_role` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_role`
--

INSERT INTO `user_role` (`id`, `user_id`, `role_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, NULL),
(3, 5, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `wallet_accounts`
--

CREATE TABLE `wallet_accounts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `party_type` enum('customer','retailer') NOT NULL,
  `party_id` bigint(20) UNSIGNED NOT NULL,
  `current_balance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wallet_transactions`
--

CREATE TABLE `wallet_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `wallet_id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(20) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `is_editable` tinyint(1) NOT NULL DEFAULT 1,
  `invoice_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customers_type_status_index` (`type`,`status`),
  ADD KEY `customers_phone_index` (`phone`),
  ADD KEY `customers_email_index` (`email`);

--
-- Indexes for table `emails`
--
ALTER TABLE `emails`
  ADD PRIMARY KEY (`id`),
  ADD KEY `emails_type_index` (`type`),
  ADD KEY `emails_send_status_index` (`send_status`),
  ADD KEY `emails_related_type_related_id_index` (`related_type`,`related_id`),
  ADD KEY `emails_created_at_index` (`created_at`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employees_email_unique` (`email`);

--
-- Indexes for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_salaries_employee_id_foreign` (`employee_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expenses_expense_category_id_foreign` (`expense_category_id`),
  ADD KEY `expenses_created_by_foreign` (`created_by`);

--
-- Indexes for table `expense_categories`
--
ALTER TABLE `expense_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_unique` (`name`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_category_id_foreign` (`category_id`),
  ADD KEY `products_sub_category_id_foreign` (`sub_category_id`),
  ADD KEY `products_brand_id_foreign` (`brand_id`),
  ADD KEY `products_unit_id_foreign` (`unit_id`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `purchase_orders_po_number_unique` (`po_number`),
  ADD KEY `purchase_orders_supplier_id_foreign` (`supplier_id`),
  ADD KEY `purchase_orders_created_by_foreign` (`created_by`);

--
-- Indexes for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_order_items_purchase_order_id_foreign` (`purchase_order_id`),
  ADD KEY `purchase_order_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `purchase_transactions`
--
ALTER TABLE `purchase_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_transactions_purchase_order_id_foreign` (`purchase_order_id`),
  ADD KEY `purchase_transactions_supplier_id_foreign` (`supplier_id`),
  ADD KEY `purchase_transactions_created_by_foreign` (`created_by`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_unique` (`name`);

--
-- Indexes for table `role_permission`
--
ALTER TABLE `role_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_permission_role_id_permission_id_unique` (`role_id`,`permission_id`),
  ADD KEY `role_permission_permission_id_foreign` (`permission_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sales_customer_id_foreign` (`customer_id`);

--
-- Indexes for table `sales_transactions`
--
ALTER TABLE `sales_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sales_transactions_sale_id_foreign` (`sale_id`);

--
-- Indexes for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_items_sale_id_foreign` (`sale_id`),
  ADD KEY `sale_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_unique` (`key`);

--
-- Indexes for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sub_categories_category_id_foreign` (`category_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_role`
--
ALTER TABLE `user_role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_role_user_id_role_id_unique` (`user_id`,`role_id`),
  ADD KEY `user_role_role_id_foreign` (`role_id`);

--
-- Indexes for table `wallet_accounts`
--
ALTER TABLE `wallet_accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wallet_accounts_party_type_party_id_unique` (`party_type`,`party_id`),
  ADD KEY `wallet_accounts_party_id_foreign` (`party_id`),
  ADD KEY `wallet_accounts_party_type_party_id_index` (`party_type`,`party_id`);

--
-- Indexes for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `wallet_transactions_wallet_id_foreign` (`wallet_id`),
  ADD KEY `wallet_transactions_invoice_id_foreign` (`invoice_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `emails`
--
ALTER TABLE `emails`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `expense_categories`
--
ALTER TABLE `expense_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `purchase_transactions`
--
ALTER TABLE `purchase_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `role_permission`
--
ALTER TABLE `role_permission`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `sales_transactions`
--
ALTER TABLE `sales_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `sub_categories`
--
ALTER TABLE `sub_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_role`
--
ALTER TABLE `user_role`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `wallet_accounts`
--
ALTER TABLE `wallet_accounts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  ADD CONSTRAINT `employee_salaries_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `expenses_expense_category_id_foreign` FOREIGN KEY (`expense_category_id`) REFERENCES `expense_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_brand_id_foreign` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_sub_category_id_foreign` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD CONSTRAINT `purchase_orders_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_orders_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD CONSTRAINT `purchase_order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_order_items_purchase_order_id_foreign` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_transactions`
--
ALTER TABLE `purchase_transactions`
  ADD CONSTRAINT `purchase_transactions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_transactions_purchase_order_id_foreign` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_transactions_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permission`
--
ALTER TABLE `role_permission`
  ADD CONSTRAINT `role_permission_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permission_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sales_transactions`
--
ALTER TABLE `sales_transactions`
  ADD CONSTRAINT `sales_transactions_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sale_items_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD CONSTRAINT `sub_categories_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_role`
--
ALTER TABLE `user_role`
  ADD CONSTRAINT `user_role_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_role_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wallet_accounts`
--
ALTER TABLE `wallet_accounts`
  ADD CONSTRAINT `wallet_accounts_party_id_foreign` FOREIGN KEY (`party_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD CONSTRAINT `wallet_transactions_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `sales` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `wallet_transactions_wallet_id_foreign` FOREIGN KEY (`wallet_id`) REFERENCES `wallet_accounts` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
