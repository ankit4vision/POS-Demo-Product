-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 10, 2025 at 05:43 PM
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
-- Database: `krimah_feature_ap_16`
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

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `type`, `name`, `phone`, `email`, `gst_number`, `address`, `status`, `created_at`, `updated_at`) VALUES
(1, 'customer', 'Ankit Patel', '9898267675', 'ankit@example.com', '2334343434', 'Khodaamba\nSatTalav', 'active', '2025-07-02 03:13:52', '2025-07-02 03:13:52'),
(2, 'retailer', 'Maddy Store', '07123456789', 'vishal@gmail.com', '2334343434', NULL, 'active', '2025-07-02 03:14:20', '2025-07-02 03:14:20'),
(3, 'customer', 'Vishal', '997987828', 'vishal@gmail.com', NULL, NULL, 'active', '2025-07-02 03:37:36', '2025-07-02 03:37:36'),
(4, 'retailer', 'V-Mart Store', '122334455', 'v@gmail.com', '32232323', NULL, 'active', '2025-07-02 03:38:03', '2025-07-02 03:38:03'),
(5, 'customer', 'Jaswant Vala', '9898267675', 'js@gmail.com', '89988998', 'Vadodara', 'active', '2025-07-05 04:46:47', '2025-07-05 04:46:47');

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

--
-- Dumping data for table `employee_salaries`
--

INSERT INTO `employee_salaries` (`id`, `employee_id`, `month`, `base_salary`, `allowances`, `deductions`, `net_salary`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, '2024-01', 2500.00, 5000.00, 500.00, 7000.00, 'Added', '2025-07-08 06:14:50', '2025-07-08 06:14:50');

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

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `date`, `amount`, `description`, `expense_category_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, '2025-07-09', 5000.00, 'petrol', 3, 1, '2025-07-08 06:27:52', '2025-07-09 06:26:52'),
(2, '2025-07-09', 1000.00, 'dwdwd', 2, 1, '2025-07-08 06:28:11', '2025-07-09 06:24:30'),
(3, '2025-07-09', 3000.00, NULL, 1, 1, '2025-07-09 06:24:20', '2025-07-09 06:24:20');

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
(44, '2025_07_09_000001_drop_purchases_tables', 14);

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
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `description`, `module`, `submodule`, `type`, `created_at`, `updated_at`) VALUES
(1, 'create_dashboard', 'Create permission for Dashboard', 'Dashboard', 'Dashboard', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(2, 'edit_dashboard', 'Edit permission for Dashboard', 'Dashboard', 'Dashboard', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(3, 'delete_dashboard', 'Delete permission for Dashboard', 'Dashboard', 'Dashboard', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(4, 'view_dashboard', 'View permission for Dashboard', 'Dashboard', 'Dashboard', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(5, 'create_customer', 'Create permission for Customer', 'Customer', 'Customer', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(6, 'edit_customer', 'Edit permission for Customer', 'Customer', 'Customer', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(7, 'delete_customer', 'Delete permission for Customer', 'Customer', 'Customer', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(8, 'view_customer', 'View permission for Customer', 'Customer', 'Customer', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(9, 'create_vendor', 'Create permission for Vendor', 'Vendor', 'Vendor', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(10, 'edit_vendor', 'Edit permission for Vendor', 'Vendor', 'Vendor', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(11, 'delete_vendor', 'Delete permission for Vendor', 'Vendor', 'Vendor', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(12, 'view_vendor', 'View permission for Vendor', 'Vendor', 'Vendor', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(13, 'create_ledger', 'Create permission for Ledger', 'Ledger', 'Ledger', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(14, 'edit_ledger', 'Edit permission for Ledger', 'Ledger', 'Ledger', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(15, 'delete_ledger', 'Delete permission for Ledger', 'Ledger', 'Ledger', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(16, 'view_ledger', 'View permission for Ledger', 'Ledger', 'Ledger', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(17, 'create_productsorservices', 'Create permission for ProductsOrServices', 'Products Or Services', 'ProductsOrServices', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(18, 'edit_productsorservices', 'Edit permission for ProductsOrServices', 'Products Or Services', 'ProductsOrServices', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(19, 'delete_productsorservices', 'Delete permission for ProductsOrServices', 'Products Or Services', 'ProductsOrServices', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(20, 'view_productsorservices', 'View permission for ProductsOrServices', 'Products Or Services', 'ProductsOrServices', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(21, 'create_category', 'Create permission for Category', 'Category', 'Category', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(22, 'edit_category', 'Edit permission for Category', 'Category', 'Category', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(23, 'delete_category', 'Delete permission for Category', 'Category', 'Category', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(24, 'view_category', 'View permission for Category', 'Category', 'Category', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(25, 'create_unit', 'Create permission for Unit', 'Unit', 'Unit', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(26, 'edit_unit', 'Edit permission for Unit', 'Unit', 'Unit', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(27, 'delete_unit', 'Delete permission for Unit', 'Unit', 'Unit', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(28, 'view_unit', 'View permission for Unit', 'Unit', 'Unit', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(29, 'create_inventory', 'Create permission for Inventory', 'Inventory', 'Inventory', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(30, 'edit_inventory', 'Edit permission for Inventory', 'Inventory', 'Inventory', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(31, 'delete_inventory', 'Delete permission for Inventory', 'Inventory', 'Inventory', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(32, 'view_inventory', 'View permission for Inventory', 'Inventory', 'Inventory', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(33, 'create_invoice', 'Create permission for Invoice', 'Invoice', 'Invoice', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(34, 'edit_invoice', 'Edit permission for Invoice', 'Invoice', 'Invoice', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(35, 'delete_invoice', 'Delete permission for Invoice', 'Invoice', 'Invoice', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(36, 'view_invoice', 'View permission for Invoice', 'Invoice', 'Invoice', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(37, 'create_salesreturn', 'Create permission for Salesreturn', 'Salesreturn', 'Salesreturn', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(38, 'edit_salesreturn', 'Edit permission for Salesreturn', 'Salesreturn', 'Salesreturn', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(39, 'delete_salesreturn', 'Delete permission for Salesreturn', 'Salesreturn', 'Salesreturn', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(40, 'view_salesreturn', 'View permission for Salesreturn', 'Salesreturn', 'Salesreturn', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(41, 'create_purchase', 'Create permission for Purchase', 'Purchase', 'Purchase', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(42, 'edit_purchase', 'Edit permission for Purchase', 'Purchase', 'Purchase', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(43, 'delete_purchase', 'Delete permission for Purchase', 'Purchase', 'Purchase', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(44, 'view_purchase', 'View permission for Purchase', 'Purchase', 'Purchase', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(45, 'create_purchaseorder', 'Create permission for PurchaseOrder', 'Purchase Order', 'PurchaseOrder', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(46, 'edit_purchaseorder', 'Edit permission for PurchaseOrder', 'Purchase Order', 'PurchaseOrder', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(47, 'delete_purchaseorder', 'Delete permission for PurchaseOrder', 'Purchase Order', 'PurchaseOrder', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(48, 'view_purchaseorder', 'View permission for PurchaseOrder', 'Purchase Order', 'PurchaseOrder', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(49, 'create_purchasereturn', 'Create permission for Purchasereturn', 'Purchasereturn', 'Purchasereturn', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(50, 'edit_purchasereturn', 'Edit permission for Purchasereturn', 'Purchasereturn', 'Purchasereturn', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(51, 'delete_purchasereturn', 'Delete permission for Purchasereturn', 'Purchasereturn', 'Purchasereturn', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(52, 'view_purchasereturn', 'View permission for Purchasereturn', 'Purchasereturn', 'Purchasereturn', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(53, 'create_expense', 'Create permission for Expense', 'Expense', 'Expense', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(54, 'edit_expense', 'Edit permission for Expense', 'Expense', 'Expense', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(55, 'delete_expense', 'Delete permission for Expense', 'Expense', 'Expense', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(56, 'view_expense', 'View permission for Expense', 'Expense', 'Expense', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(57, 'create_payment', 'Create permission for Payment', 'Payment', 'Payment', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(58, 'edit_payment', 'Edit permission for Payment', 'Payment', 'Payment', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(59, 'delete_payment', 'Delete permission for Payment', 'Payment', 'Payment', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(60, 'view_payment', 'View permission for Payment', 'Payment', 'Payment', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(61, 'create_quotation', 'Create permission for Quotation', 'Quotation', 'Quotation', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(62, 'edit_quotation', 'Edit permission for Quotation', 'Quotation', 'Quotation', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(63, 'delete_quotation', 'Delete permission for Quotation', 'Quotation', 'Quotation', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(64, 'view_quotation', 'View permission for Quotation', 'Quotation', 'Quotation', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(65, 'create_deliverychallan', 'Create permission for DeliveryChallan', 'Delivery Challan', 'DeliveryChallan', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(66, 'edit_deliverychallan', 'Edit permission for DeliveryChallan', 'Delivery Challan', 'DeliveryChallan', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(67, 'delete_deliverychallan', 'Delete permission for DeliveryChallan', 'Delivery Challan', 'DeliveryChallan', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(68, 'view_deliverychallan', 'View permission for DeliveryChallan', 'Delivery Challan', 'DeliveryChallan', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(69, 'create_paymentsummaryreport', 'Create permission for PaymentSummaryReport', 'Payment Summary Report', 'PaymentSummaryReport', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(70, 'edit_paymentsummaryreport', 'Edit permission for PaymentSummaryReport', 'Payment Summary Report', 'PaymentSummaryReport', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(71, 'delete_paymentsummaryreport', 'Delete permission for PaymentSummaryReport', 'Payment Summary Report', 'PaymentSummaryReport', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(72, 'view_paymentsummaryreport', 'View permission for PaymentSummaryReport', 'Payment Summary Report', 'PaymentSummaryReport', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(73, 'create_user', 'Create permission for User', 'User', 'User', 'create', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(74, 'edit_user', 'Edit permission for User', 'User', 'User', 'edit', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(75, 'delete_user', 'Delete permission for User', 'User', 'User', 'delete', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(76, 'view_user', 'View permission for User', 'User', 'User', 'view', '2025-07-02 03:08:33', '2025-07-02 03:08:33');

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
(15, 'App\\Models\\User', 1, 'auth-token', '70496ed716470baa7441dd040a7cf7fb74992cdebb43c7e09ee8e8cfdff462f0', '[\"*\"]', '2025-07-10 10:11:53', NULL, '2025-07-10 03:10:04', '2025-07-10 10:11:53');

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

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `sku`, `barcode`, `image`, `category_id`, `sub_category_id`, `brand_id`, `unit_id`, `purchase_price`, `sales_price`, `retailer_sales_price`, `individual_sales_price`, `last_purchase_price`, `last_purchase_date`, `vat_percent`, `opening_stock`, `low_stock_alert`, `description`, `status`, `discount`, `created_at`, `updated_at`) VALUES
(1, 'Apple', 'FRU-APL-001', '100000000001', 'products/1751445809_6864f13100495.jpg', 4, 4, 10, 3, 9.27, 100.00, 95.00, 105.00, 300.00, '2025-07-05', 12.00, 522.00, 10.00, 'Fresh apples', 'active', 10.00, NULL, '2025-07-10 06:16:42'),
(2, 'Amul Milk', 'DAI-AML-001', '100000000002', 'products/1751445797_6864f1253ebce.jpg', 5, 7, 4, 5, 19.33, 50.00, 48.00, 52.00, 45.00, '2025-07-05', 0.00, 106.00, 130.00, 'Amul full cream milk', 'active', 0.00, NULL, '2025-07-10 03:27:13'),
(3, 'Britannia Bread', 'BAK-BRI-001', '100000000003', 'products/1751445590_6864f05618d8c.jpg', 6, 10, 6, 7, 3.15, 25.00, 24.00, 26.00, 40.00, '2025-07-05', 12.00, 234.00, 10.00, 'Fresh white bread', 'active', 10.00, NULL, '2025-07-10 03:27:13'),
(4, 'Pepsi Soft Drink', 'BEV-PEP-001', '100000000004', 'products/1751445784_6864f1187eb74.jpeg', 7, 14, 12, 6, 30.50, 35.00, 34.00, 36.00, 60.00, '2025-07-05', 12.00, 217.00, 15.00, 'Pepsi 500ml bottle', 'active', 10.00, NULL, '2025-07-10 03:27:13'),
(5, 'Parle-G Biscuits', 'SNA-PAR-001', '100000000005', 'products/1751445579_6864f04b6b1b7.jpg', 8, 17, 7, 7, 1.88, 7.00, 6.50, 7.50, 5.00, '2025-07-05', 12.00, 444.00, 30.00, 'Parle-G glucose biscuits', 'active', 5.00, NULL, '2025-07-10 03:27:13'),
(6, 'Tometa', '8dd232331', '100000000011', NULL, 4, 6, NULL, 3, 10.00, 15.00, 13.00, 14.00, 10.00, NULL, 8.00, 199.00, 100.00, 'Red tomato\'s', 'active', 5.00, '2025-07-10 03:16:10', '2025-07-10 03:27:13'),
(7, 'Breads', '132321321', '100000000012', NULL, 6, 10, 11, 7, 20.00, 28.00, 24.00, 25.00, 20.00, NULL, 8.00, 196.00, 50.00, 'Small package bread', 'active', 4.99, '2025-07-10 03:21:26', '2025-07-10 03:27:13'),
(8, 'Sprite', '112213232', '100000000013', NULL, 8, 15, 12, 5, 10.00, 13.00, 12.00, 12.00, 10.00, NULL, 8.00, 299.00, 50.00, '1 Liter Sprit', 'active', 5.00, '2025-07-10 03:22:42', '2025-07-10 03:27:13'),
(9, 'Tata Solt', '23323323', '100000000014', NULL, 10, 19, 2, 3, 10.00, 20.00, 30.00, 40.00, 10.00, NULL, 8.00, 295.00, 20.00, 'Tata Salt 1 Kg', 'active', 4.99, '2025-07-10 03:24:06', '2025-07-10 03:27:13');

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

--
-- Dumping data for table `purchase_orders`
--

INSERT INTO `purchase_orders` (`id`, `po_number`, `supplier_id`, `order_date`, `expected_delivery_date`, `purchase_date`, `status`, `notes`, `reference`, `subtotal`, `tax_amount`, `discount_amount`, `total_amount`, `paid_amount`, `paid_status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'PO-000001', 6, '2025-07-04', '2025-07-11', '2025-07-05', 'completed', 'uyhgiuhuuiuhu', NULL, 2100.01, 0.00, 0.00, 2100.00, 140.00, 'remaining', 1, '2025-07-04 06:56:44', '2025-07-05 00:33:51'),
(2, 'PO-000002', 1, '2025-07-04', '2025-07-08', '2025-07-05', 'completed', 'ed', 'test', 62000.00, 0.00, 0.00, 62000.00, 1100.00, 'remaining', 1, '2025-07-04 08:52:20', '2025-07-05 00:51:29'),
(3, 'PO-000003', 2, '2025-07-04', '2025-07-07', '2025-07-05', 'completed', 'dd', 'dd', 4500.00, 0.00, 0.00, 4500.00, 0.00, 'remaining', 1, '2025-07-04 12:24:46', '2025-07-05 07:03:51'),
(4, 'PO-000004', 3, '2025-07-04', '2025-07-07', '2025-07-05', 'completed', 'gfgdffd', '122', 24000.00, 0.00, 0.00, 24000.00, 1500.00, 'remaining', 1, '2025-07-04 12:28:30', '2025-07-05 06:49:51'),
(5, 'PO-000005', 6, '2025-07-04', '2025-07-07', NULL, 'sent', '3232', '3223', 9250.00, 0.00, 0.00, 9250.00, 920.00, 'remaining', 1, '2025-07-04 12:41:04', '2025-07-04 14:29:17'),
(6, 'PO-000006', 1, '2025-07-05', '2025-07-08', NULL, 'draft', 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled.', 'ref-1', 3850.00, 0.00, 0.00, 3850.00, 0.00, 'remaining', 1, '2025-07-05 08:49:41', '2025-07-05 08:49:41'),
(7, 'PO-000007', 2, '2025-07-05', '2025-07-08', NULL, 'draft', 'it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydne', NULL, 1250.00, 0.00, 0.00, 1250.00, 0.00, 'remaining', 1, '2025-07-05 08:50:21', '2025-07-05 08:50:21'),
(8, 'PO-000008', 1, '2025-07-05', '2025-07-08', NULL, 'received', 'Sample Notes', NULL, 2600.00, 0.00, 0.00, 2600.00, 200.00, 'remaining', 1, '2025-07-05 08:50:54', '2025-07-05 09:17:46'),
(9, 'PO-000009', 6, '2025-07-05', '2025-07-08', '2025-07-05', 'completed', 'Tetsing Notes', NULL, 7310.00, 0.00, 0.00, 7310.00, 1200.00, 'remaining', 1, '2025-07-05 08:52:23', '2025-07-05 09:22:23');

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

--
-- Dumping data for table `purchase_order_items`
--

INSERT INTO `purchase_order_items` (`id`, `purchase_order_id`, `product_id`, `quantity`, `unit_price`, `total_amount`, `received_status`, `created_at`, `updated_at`) VALUES
(36, 5, 2, 50.00, 55.00, 2750.00, 'pending', '2025-07-04 13:14:46', '2025-07-04 13:14:46'),
(37, 5, 1, 50.00, 90.00, 4500.00, 'pending', '2025-07-04 13:14:46', '2025-07-04 13:14:46'),
(38, 5, 3, 50.00, 40.00, 2000.00, 'pending', '2025-07-04 13:14:46', '2025-07-04 13:14:46'),
(44, 1, 5, 1.00, 100.01, 100.01, 'received', '2025-07-04 14:13:21', '2025-07-05 00:33:51'),
(45, 1, 1, 10.00, 200.00, 2000.00, 'received', '2025-07-04 14:13:21', '2025-07-05 00:33:51'),
(46, 2, 1, 100.00, 300.00, 30000.00, 'received', '2025-07-05 00:38:31', '2025-07-05 00:39:47'),
(47, 2, 4, 200.00, 60.00, 12000.00, 'received', '2025-07-05 00:38:31', '2025-07-05 00:39:47'),
(48, 2, 5, 100.00, 200.00, 20000.00, 'received', '2025-07-05 00:38:31', '2025-07-05 00:39:47'),
(49, 4, 3, 100.00, 40.00, 4000.00, 'received', '2025-07-05 00:48:39', '2025-07-05 00:49:13'),
(50, 4, 5, 100.00, 200.00, 20000.00, 'received', '2025-07-05 00:48:39', '2025-07-05 00:49:13'),
(55, 3, 5, 100.00, 5.00, 500.00, 'received', '2025-07-05 07:03:00', '2025-07-05 07:03:51'),
(56, 3, 3, 100.00, 40.00, 4000.00, 'received', '2025-07-05 07:03:00', '2025-07-05 07:03:51'),
(57, 6, 1, 10.00, 300.00, 3000.00, 'pending', '2025-07-05 08:49:41', '2025-07-05 08:49:41'),
(58, 6, 2, 10.00, 45.00, 450.00, 'pending', '2025-07-05 08:49:41', '2025-07-05 08:49:41'),
(59, 6, 3, 10.00, 40.00, 400.00, 'pending', '2025-07-05 08:49:41', '2025-07-05 08:49:41'),
(60, 7, 2, 10.00, 45.00, 450.00, 'pending', '2025-07-05 08:50:21', '2025-07-05 08:50:21'),
(61, 7, 3, 20.00, 40.00, 800.00, 'pending', '2025-07-05 08:50:21', '2025-07-05 08:50:21'),
(77, 8, 5, 10.00, 5.00, 50.00, 'pending', '2025-07-05 09:17:46', '2025-07-05 09:17:46'),
(78, 8, 4, 35.00, 60.00, 2100.00, 'pending', '2025-07-05 09:17:46', '2025-07-05 09:17:46'),
(79, 8, 2, 10.00, 45.00, 450.00, 'pending', '2025-07-05 09:17:46', '2025-07-05 09:17:46'),
(80, 9, 1, 15.00, 300.00, 4500.00, 'received', '2025-07-05 09:18:26', '2025-07-05 09:21:51'),
(81, 9, 2, 50.00, 45.00, 2250.00, 'received', '2025-07-05 09:18:26', '2025-07-05 09:21:51'),
(82, 9, 3, 14.00, 40.00, 560.00, 'received', '2025-07-05 09:18:26', '2025-07-05 09:21:51');

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

--
-- Dumping data for table `purchase_transactions`
--

INSERT INTO `purchase_transactions` (`id`, `purchase_order_id`, `supplier_id`, `amount`, `payment_method`, `status`, `reference_number`, `notes`, `payment_date`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 5, 6, 400.00, 'cash', 'completed', '2323', 'test payment', '2025-07-04', 1, '2025-07-04 13:19:55', '2025-07-04 13:19:55'),
(2, 5, 6, 500.00, 'bank_transfer', 'completed', '3223213', 'dqwd', '2025-07-03', 1, '2025-07-04 13:21:35', '2025-07-04 13:21:35'),
(3, 4, 3, 600.00, 'cash', 'completed', NULL, NULL, '2025-07-04', 1, '2025-07-04 13:40:34', '2025-07-04 14:07:50'),
(4, 4, 3, 400.00, 'cash', 'completed', '32423443', 'sdsd', '2025-07-04', 1, '2025-07-04 13:40:50', '2025-07-04 14:07:01'),
(5, 1, 6, 100.00, 'cash', 'completed', NULL, NULL, '2025-07-04', 1, '2025-07-04 14:09:12', '2025-07-04 14:09:12'),
(6, 5, 6, 20.00, 'cash', 'completed', NULL, NULL, '2025-07-04', 1, '2025-07-04 14:29:17', '2025-07-04 14:29:17'),
(7, 1, 6, 25.00, 'cash', 'completed', NULL, NULL, '2025-07-05', 1, '2025-07-05 00:32:10', '2025-07-05 00:32:10'),
(8, 1, 6, 15.00, 'cash', 'completed', NULL, NULL, '2025-07-05', 1, '2025-07-05 00:32:40', '2025-07-05 00:32:40'),
(9, 2, 1, 200.00, 'cash', 'completed', NULL, NULL, '2025-07-05', 1, '2025-07-05 00:37:44', '2025-07-05 00:37:44'),
(10, 2, 1, 900.00, 'cash', 'completed', NULL, NULL, '2025-07-05', 1, '2025-07-05 00:51:29', '2025-07-05 00:51:29'),
(11, 4, 3, 500.00, 'cash', 'completed', NULL, NULL, '2025-07-05', 1, '2025-07-05 06:49:51', '2025-07-05 06:49:51'),
(12, 8, 1, 200.00, 'cash', 'completed', NULL, NULL, '2025-07-05', 1, '2025-07-05 09:17:24', '2025-07-05 09:17:24'),
(13, 9, 6, 700.00, 'cash', 'completed', NULL, NULL, '2025-07-05', 1, '2025-07-05 09:19:20', '2025-07-05 09:19:20'),
(14, 9, 6, 500.00, 'cash', 'completed', NULL, NULL, '2025-07-05', 1, '2025-07-05 09:22:23', '2025-07-05 09:22:23');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'Administrator role with full access', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(2, 'Manager', 'Manager role with elevated access', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(3, 'Editor', 'Editor role with content management access', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(4, 'User', 'Regular user role', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(5, 'Guest', 'Guest role with limited access', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(6, 'Support', 'Support role for customer service', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(7, 'Developer', 'Developer role for technical access', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(8, 'Tester', 'Tester role for quality assurance', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(9, 'Analyst', 'Analyst role for data analysis', '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(10, 'Designer', 'Designer role for UI/UX access', '2025-07-02 03:08:33', '2025-07-02 03:08:33');

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

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `customer_id`, `grand_total`, `discount`, `paid`, `due`, `mode`, `invoice_ref`, `created_at`, `updated_at`, `subtotal`, `total_discount`, `total_tax`, `round_off`, `rounded_total`) VALUES
(10, 3, 529.20, 0.00, 529.00, 0.00, 'cash', 'INV-Y9XJZC', '2025-07-02 14:29:56', '2025-07-02 14:29:56', 525.00, 52.50, 56.70, -0.20, 529.00),
(11, 4, 287.28, 0.00, 10.00, 277.00, 'cash', 'INV-WCSIHM', '2025-07-02 14:53:41', '2025-07-02 14:53:41', 285.00, 28.50, 30.78, -0.28, 287.00),
(12, 3, 105.84, 0.00, 106.00, 0.00, 'cash', 'INV-VX99PA', '2025-07-03 03:22:20', '2025-07-03 03:22:20', 105.00, 10.50, 11.34, 0.16, 106.00),
(13, 3, 105.84, 0.00, 106.00, 0.00, 'cash', 'INV-B0WN8W', '2025-07-03 03:34:13', '2025-07-03 03:34:13', 105.00, 10.50, 11.34, 0.16, 106.00),
(14, 4, 670.32, 0.00, 670.00, 0.00, 'cash', 'INV-JUPBCL', '2025-07-03 03:46:09', '2025-07-03 03:46:09', 665.00, 66.50, 71.82, -0.32, 670.00),
(15, 4, 95.76, 0.00, 0.00, 96.00, 'cash', 'INV-TSVHDV', '2025-07-03 04:04:59', '2025-07-03 04:04:59', 95.00, 9.50, 10.26, 0.24, 96.00),
(16, 3, 1058.40, 0.00, 1058.00, 0.00, 'cash', 'INV-ZANODR', '2025-07-03 04:46:58', '2025-07-03 04:46:58', 1050.00, 105.00, 113.40, -0.40, 1058.00),
(17, 3, 2116.80, 0.00, 2117.00, 0.00, 'cash', 'INV-URLFYX', '2025-07-03 04:53:04', '2025-07-03 04:53:04', 2100.00, 210.00, 226.80, 0.20, 2117.00),
(18, 3, 1058.40, 0.00, 1058.00, 0.00, 'cash', 'INV-0018', '2025-07-03 05:05:24', '2025-07-03 05:05:24', 1050.00, 105.00, 113.40, -0.40, 1058.00),
(19, 3, 211.68, 0.00, 212.00, 0.00, 'cash', 'INV-0019', '2025-07-03 05:13:14', '2025-07-03 05:13:14', 210.00, 21.00, 22.68, 0.32, 212.00),
(20, NULL, 227.64, 0.00, 228.00, 0.00, 'cash', 'INV-0020', '2025-07-03 05:35:28', '2025-07-03 05:35:28', 225.00, 21.75, 24.39, 0.36, 228.00),
(21, NULL, 442.68, 0.00, 443.00, 0.00, 'cash', 'INV-0021', '2025-07-03 06:42:47', '2025-07-03 06:42:47', 435.00, 39.75, 47.43, 0.32, 443.00),
(22, 3, 1058.40, 0.00, 1058.00, 0.00, 'cash', 'INV-0022', '2025-07-03 06:44:51', '2025-07-03 06:44:51', 1050.00, 105.00, 113.40, -0.40, 1058.00),
(23, 5, 205.97, 0.00, 206.00, 0.00, 'cash', 'INV-0023', '2025-07-05 04:53:36', '2025-07-05 04:53:36', 201.00, 17.10, 22.07, 0.03, 206.00),
(24, 5, 237.30, 0.00, 237.00, 0.00, 'cash', 'INV-0024', '2025-07-05 09:28:11', '2025-07-05 09:28:11', 232.50, 20.63, 25.43, -0.30, 237.00),
(25, 4, 2927.28, 0.00, 2927.00, 0.00, 'cash', 'INV-0025', '2025-07-10 03:13:27', '2025-07-10 03:13:27', 2907.50, 242.43, 262.21, -0.28, 2927.00),
(26, 2, 860.90, 0.00, 861.00, 0.00, 'cash', 'INV-0026', '2025-07-10 03:27:13', '2025-07-10 03:27:13', 850.00, 51.58, 62.47, 0.10, 861.00),
(27, NULL, 105.84, 0.00, 106.00, 0.00, 'cash', 'INV-0027', '2025-07-10 06:16:42', '2025-07-10 06:16:42', 105.00, 10.50, 11.34, 0.16, 106.00);

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

--
-- Dumping data for table `sales_transactions`
--

INSERT INTO `sales_transactions` (`id`, `sale_id`, `payment_type`, `amount`, `description`, `created_at`, `updated_at`) VALUES
(4, 10, 'cash', 10.00, 'Cash payment', '2025-07-02 14:29:56', '2025-07-02 14:29:56'),
(5, 10, 'card', 10.00, 'Card payment', '2025-07-02 14:29:56', '2025-07-02 14:29:56'),
(6, 10, 'upi', 509.00, 'Upi payment', '2025-07-02 14:29:56', '2025-07-02 14:29:56'),
(7, 11, 'cash', 10.00, 'Cash payment', '2025-07-02 14:53:41', '2025-07-02 14:53:41'),
(8, 12, 'cash', 50.00, 'Cash payment', '2025-07-03 03:22:20', '2025-07-03 03:22:20'),
(9, 12, 'wallet', 56.00, 'Wallet payment', '2025-07-03 03:22:20', '2025-07-03 03:22:20'),
(10, 13, 'wallet', 106.00, 'Wallet payment', '2025-07-03 03:34:13', '2025-07-03 03:34:13'),
(11, 14, 'cash', 660.00, 'Cash payment', '2025-07-03 03:46:09', '2025-07-03 03:46:09'),
(12, 14, 'card', 10.00, 'Card payment', '2025-07-03 03:46:09', '2025-07-03 03:46:09'),
(13, 16, 'cash', 10.00, 'Cash payment', '2025-07-03 04:46:58', '2025-07-03 04:46:58'),
(14, 16, 'wallet', 1048.00, 'Wallet credit (due) payment', '2025-07-03 04:46:58', '2025-07-03 04:46:58'),
(15, 17, 'cash', 50.00, 'Cash payment', '2025-07-03 04:53:04', '2025-07-03 04:53:04'),
(16, 17, 'card', 50.00, 'Card payment', '2025-07-03 04:53:04', '2025-07-03 04:53:04'),
(17, 17, 'upi', 50.00, 'Upi payment', '2025-07-03 04:53:04', '2025-07-03 04:53:04'),
(18, 17, 'wallet', 1319.00, 'Wallet payment', '2025-07-03 04:53:04', '2025-07-03 04:53:04'),
(19, 17, 'wallet', 648.00, 'Wallet credit (due) payment', '2025-07-03 04:53:04', '2025-07-03 04:53:04'),
(20, 18, 'cash', 10.00, 'Cash payment', '2025-07-03 05:05:24', '2025-07-03 05:05:24'),
(21, 18, 'card', 10.00, 'Card payment', '2025-07-03 05:05:24', '2025-07-03 05:05:24'),
(22, 18, 'upi', 9.00, 'Upi payment', '2025-07-03 05:05:24', '2025-07-03 05:05:24'),
(23, 18, 'wallet', 1029.00, 'Wallet credit (due) payment', '2025-07-03 05:05:24', '2025-07-03 05:05:24'),
(24, 19, 'cash', 10.00, 'Cash payment', '2025-07-03 05:13:14', '2025-07-03 05:13:14'),
(25, 19, 'card', 10.00, 'Card payment', '2025-07-03 05:13:14', '2025-07-03 05:13:14'),
(26, 19, 'upi', 10.00, 'Upi payment', '2025-07-03 05:13:14', '2025-07-03 05:13:14'),
(27, 19, 'wallet', 182.00, 'Wallet credit (due) payment', '2025-07-03 05:13:14', '2025-07-03 05:13:14'),
(28, 20, 'cash', 20.00, 'Cash payment', '2025-07-03 05:35:28', '2025-07-03 05:35:28'),
(29, 20, 'card', 50.00, 'Card payment', '2025-07-03 05:35:28', '2025-07-03 05:35:28'),
(30, 20, 'upi', 158.00, 'Upi payment', '2025-07-03 05:35:28', '2025-07-03 05:35:28'),
(31, 21, 'cash', 10.00, 'Cash payment', '2025-07-03 06:42:47', '2025-07-03 06:42:47'),
(32, 21, 'card', 10.00, 'Card payment', '2025-07-03 06:42:47', '2025-07-03 06:42:47'),
(33, 21, 'upi', 423.00, 'Upi payment', '2025-07-03 06:42:47', '2025-07-03 06:42:47'),
(34, 22, 'cash', 100.00, 'Cash payment', '2025-07-03 06:44:51', '2025-07-03 06:44:51'),
(35, 22, 'card', 500.00, 'Card payment', '2025-07-03 06:44:51', '2025-07-03 06:44:51'),
(36, 22, 'wallet', 458.00, 'Wallet credit (due) payment', '2025-07-03 06:44:51', '2025-07-03 06:44:51'),
(37, 23, 'cash', 20.00, 'Cash payment', '2025-07-05 04:53:36', '2025-07-05 04:53:36'),
(38, 23, 'card', 20.00, 'Card payment', '2025-07-05 04:53:36', '2025-07-05 04:53:36'),
(39, 23, 'upi', 20.00, 'Upi payment', '2025-07-05 04:53:36', '2025-07-05 04:53:36'),
(40, 23, 'wallet', 100.00, 'Wallet payment', '2025-07-05 04:53:36', '2025-07-05 04:53:36'),
(41, 23, 'wallet', 46.00, 'Wallet credit (due) payment', '2025-07-05 04:53:36', '2025-07-05 04:53:36'),
(42, 24, 'cash', 20.00, 'Cash payment', '2025-07-05 09:28:11', '2025-07-05 09:28:11'),
(43, 24, 'card', 20.00, 'Card payment', '2025-07-05 09:28:11', '2025-07-05 09:28:11'),
(44, 24, 'upi', 20.00, 'Upi payment', '2025-07-05 09:28:11', '2025-07-05 09:28:11'),
(45, 24, 'wallet', 10.00, 'Wallet payment', '2025-07-05 09:28:11', '2025-07-05 09:28:11'),
(46, 24, 'wallet', 167.00, 'Wallet credit (due) payment', '2025-07-05 09:28:11', '2025-07-05 09:28:11'),
(47, 25, 'cash', 10.00, 'Cash payment', '2025-07-10 03:13:27', '2025-07-10 03:13:27'),
(48, 25, 'card', 20.00, 'Card payment', '2025-07-10 03:13:27', '2025-07-10 03:13:27'),
(49, 25, 'upi', 20.00, 'Upi payment', '2025-07-10 03:13:27', '2025-07-10 03:13:27'),
(50, 25, 'wallet', 2877.00, 'Wallet credit (due) payment', '2025-07-10 03:13:27', '2025-07-10 03:13:27'),
(51, 26, 'cash', 200.00, 'Cash payment', '2025-07-10 03:27:13', '2025-07-10 03:27:13'),
(52, 26, 'card', 300.00, 'Card payment', '2025-07-10 03:27:13', '2025-07-10 03:27:13'),
(53, 26, 'upi', 40.00, 'Upi payment', '2025-07-10 03:27:13', '2025-07-10 03:27:13'),
(54, 26, 'wallet', 321.00, 'Wallet credit (due) payment', '2025-07-10 03:27:13', '2025-07-10 03:27:13'),
(55, 27, 'cash', 86.00, 'Cash payment', '2025-07-10 06:16:42', '2025-07-10 06:16:42'),
(56, 27, 'card', 10.00, 'Card payment', '2025-07-10 06:16:42', '2025-07-10 06:16:42'),
(57, 27, 'upi', 10.00, 'Upi payment', '2025-07-10 06:16:42', '2025-07-10 06:16:42');

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

--
-- Dumping data for table `sale_items`
--

INSERT INTO `sale_items` (`id`, `sale_id`, `product_id`, `qty`, `price`, `subtotal`, `created_at`, `updated_at`, `discount`, `tax`) VALUES
(16, 10, 1, 5.00, 105.00, 525.00, '2025-07-02 14:29:56', '2025-07-02 14:29:56', 10.00, 12.00),
(17, 11, 1, 3.00, 95.00, 285.00, '2025-07-02 14:53:41', '2025-07-02 14:53:41', 10.00, 12.00),
(18, 12, 1, 1.00, 105.00, 105.00, '2025-07-03 03:22:20', '2025-07-03 03:22:20', 10.00, 12.00),
(19, 13, 1, 1.00, 105.00, 105.00, '2025-07-03 03:34:13', '2025-07-03 03:34:13', 10.00, 12.00),
(20, 14, 1, 7.00, 95.00, 665.00, '2025-07-03 03:46:09', '2025-07-03 03:46:09', 10.00, 12.00),
(21, 15, 1, 1.00, 95.00, 95.00, '2025-07-03 04:04:59', '2025-07-03 04:04:59', 10.00, 12.00),
(22, 16, 1, 10.00, 105.00, 1050.00, '2025-07-03 04:46:58', '2025-07-03 04:46:58', 10.00, 12.00),
(23, 17, 1, 20.00, 105.00, 2100.00, '2025-07-03 04:53:04', '2025-07-03 04:53:04', 10.00, 12.00),
(24, 18, 1, 10.00, 105.00, 1050.00, '2025-07-03 05:05:24', '2025-07-03 05:05:24', 10.00, 12.00),
(25, 19, 1, 2.00, 105.00, 210.00, '2025-07-03 05:13:14', '2025-07-03 05:13:14', 10.00, 12.00),
(26, 20, 1, 2.00, 105.00, 210.00, '2025-07-03 05:35:28', '2025-07-03 05:35:28', 10.00, 12.00),
(27, 20, 5, 2.00, 7.50, 15.00, '2025-07-03 05:35:28', '2025-07-03 05:35:28', 5.00, 12.00),
(28, 21, 5, 10.00, 7.50, 75.00, '2025-07-03 06:42:47', '2025-07-03 06:42:47', 5.00, 12.00),
(29, 21, 4, 10.00, 36.00, 360.00, '2025-07-03 06:42:47', '2025-07-03 06:42:47', 10.00, 12.00),
(30, 22, 1, 10.00, 105.00, 1050.00, '2025-07-03 06:44:51', '2025-07-03 06:44:51', 10.00, 12.00),
(31, 23, 1, 1.00, 105.00, 105.00, '2025-07-05 04:53:36', '2025-07-05 04:53:36', 10.00, 12.00),
(32, 23, 5, 8.00, 7.50, 60.00, '2025-07-05 04:53:36', '2025-07-05 04:53:36', 5.00, 12.00),
(33, 23, 4, 1.00, 36.00, 36.00, '2025-07-05 04:53:36', '2025-07-05 04:53:36', 10.00, 12.00),
(34, 24, 4, 5.00, 36.00, 180.00, '2025-07-05 09:28:11', '2025-07-05 09:28:11', 10.00, 12.00),
(35, 24, 5, 7.00, 7.50, 52.50, '2025-07-05 09:28:11', '2025-07-05 09:28:11', 5.00, 12.00),
(36, 25, 1, 17.00, 95.00, 1615.00, '2025-07-10 03:13:27', '2025-07-10 03:13:27', 10.00, 12.00),
(37, 25, 2, 10.00, 48.00, 480.00, '2025-07-10 03:13:27', '2025-07-10 03:13:27', 0.00, 0.00),
(38, 25, 3, 18.00, 24.00, 432.00, '2025-07-10 03:13:27', '2025-07-10 03:13:27', 10.00, 12.00),
(39, 25, 4, 11.00, 34.00, 374.00, '2025-07-10 03:13:27', '2025-07-10 03:13:27', 10.00, 12.00),
(40, 25, 5, 1.00, 6.50, 6.50, '2025-07-10 03:13:27', '2025-07-10 03:13:27', 5.00, 12.00),
(41, 26, 1, 2.00, 95.00, 190.00, '2025-07-10 03:27:13', '2025-07-10 03:27:13', 10.00, 12.00),
(42, 26, 9, 5.00, 30.00, 150.00, '2025-07-10 03:27:13', '2025-07-10 03:27:13', 4.99, 8.00),
(43, 26, 6, 1.00, 13.00, 13.00, '2025-07-10 03:27:13', '2025-07-10 03:27:13', 5.00, 8.00),
(44, 26, 3, 2.00, 24.00, 48.00, '2025-07-10 03:27:13', '2025-07-10 03:27:13', 10.00, 12.00),
(45, 26, 7, 4.00, 24.00, 96.00, '2025-07-10 03:27:13', '2025-07-10 03:27:13', 4.99, 8.00),
(46, 26, 5, 2.00, 6.50, 13.00, '2025-07-10 03:27:13', '2025-07-10 03:27:13', 5.00, 12.00),
(47, 26, 4, 4.00, 34.00, 136.00, '2025-07-10 03:27:13', '2025-07-10 03:27:13', 10.00, 12.00),
(48, 26, 2, 4.00, 48.00, 192.00, '2025-07-10 03:27:13', '2025-07-10 03:27:13', 0.00, 0.00),
(49, 26, 8, 1.00, 12.00, 12.00, '2025-07-10 03:27:13', '2025-07-10 03:27:13', 5.00, 8.00),
(50, 27, 1, 1.00, 105.00, 105.00, '2025-07-10 06:16:42', '2025-07-10 06:16:42', 10.00, 12.00);

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
(9, 'smtp_host', 'Gmail', 'email', '2025-07-08 06:44:49', '2025-07-08 06:44:49'),
(10, 'smtp_port', '306', 'email', '2025-07-08 06:44:49', '2025-07-08 06:44:49'),
(11, 'smtp_user', 'admin@example.com', 'email', '2025-07-08 06:44:49', '2025-07-08 06:44:49'),
(12, 'smtp_pass', 'admin123', 'email', '2025-07-08 06:44:49', '2025-07-08 06:44:49'),
(13, 'from_email', 'ankit4vision@gmail.com', 'email', '2025-07-08 06:44:49', '2025-07-08 06:44:49'),
(14, 'from_name', 'Ankit Patel', 'email', '2025-07-08 06:44:49', '2025-07-08 06:44:49');

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
(21, 11, 'Pulses', 'active', NULL, NULL);

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

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `name`, `email`, `phone`, `address`, `contact_person`, `status`, `created_at`, `updated_at`) VALUES
(1, 'ABC Electronics Ltd.', 'info@abcelectronics.com', '+91-9876543210', '123 Tech Park, Bangalore, Karnataka', 'Rajesh Kumar', 'active', '2025-07-04 05:23:22', '2025-07-04 05:23:22'),
(2, 'XYZ Pharmaceuticals', 'sales@xyzpharma.com', '+91-9876543211', '456 Medical Zone, Mumbai, Maharashtra', 'Dr. Priya Sharma', 'active', '2025-07-04 05:23:22', '2025-07-04 05:23:22'),
(3, 'Fresh Foods Supply Comp', 'orders@freshfoods.com', '+91-9876543212', '789 Food Court, Delhi, NCR', 'Amit Patel', 'active', '2025-07-04 05:23:22', '2025-07-04 05:31:43'),
(4, 'Quality Stationery', 'info@qualitystationery.com', '+91-9876543213', '321 Office Plaza, Chennai, Tamil Nadu', 'Suresh Reddy', 'active', '2025-07-04 05:23:22', '2025-07-04 05:23:22'),
(5, 'Home Decor Solutions', 'contact@homedecor.com', '+91-9876543214', '654 Design Street, Hyderabad, Telangana', 'Meera Singh', 'inactive', '2025-07-04 05:23:22', '2025-07-04 05:23:22'),
(6, 'Maddy Supplier', 'maddy@gmail.com', '9898267675', 'Khodaamba', 'Ankit Patel', 'active', '2025-07-04 06:17:35', '2025-07-04 06:17:35');

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
(1, 'Admin User', 'admin@example.com', NULL, NULL, '$2y$10$1Mu9./3V6XrMxSM7eHcytuO21tvqmMzp3uIFkjQpLgd1f1XOuhkp2', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(2, 'Manager User', 'manager@example.com', NULL, NULL, '$2y$10$IWLB6STx5mm/3l.1rWzaBuCYPn/LVjxoawfqQmYJ42abhd3KSgYPG', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(3, 'Staff User', 'staff@example.com', NULL, NULL, '$2y$10$BhzoWS4MU9bzPYPjwYzrkeRnHWGDw3QnMWJYEr2avVJh820H.bqTe', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(4, 'Accountant User', 'accountant@example.com', NULL, NULL, '$2y$10$YpLzsUaUwCLtJdqb9XdDoeTeiRz89FaB.N5yDtdT8aZPxK7Xdqt5u', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-02 03:08:33', '2025-07-02 03:08:33');

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
(2, 2, 2, NULL, NULL);

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

--
-- Dumping data for table `wallet_accounts`
--

INSERT INTO `wallet_accounts` (`id`, `party_type`, `party_id`, `current_balance`, `created_at`, `updated_at`) VALUES
(1, 'customer', 1, -47.25, '2025-07-02 03:13:52', '2025-07-02 06:56:17'),
(2, 'retailer', 2, -321.00, '2025-07-02 03:14:20', '2025-07-10 03:27:13'),
(3, 'customer', 3, -2050.29, '2025-07-02 03:37:36', '2025-07-04 04:23:40'),
(4, 'retailer', 4, -4007.76, '2025-07-02 03:38:03', '2025-07-10 03:13:27'),
(8, 'customer', 5, 2827.00, '2025-07-05 04:46:47', '2025-07-05 09:28:11');

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
-- Dumping data for table `wallet_transactions`
--

INSERT INTO `wallet_transactions` (`id`, `wallet_id`, `type`, `amount`, `payment_method`, `reference`, `is_editable`, `invoice_id`, `created_at`, `updated_at`, `description`) VALUES
(12, 4, 'credit', 100.00, NULL, NULL, 1, NULL, '2025-07-02 06:39:36', '2025-07-02 06:39:36', NULL),
(13, 4, 'credit', 400.00, 'cash', NULL, 1, NULL, '2025-07-02 06:40:11', '2025-07-02 13:02:23', NULL),
(14, 4, 'debit', 400.00, NULL, NULL, 1, NULL, '2025-07-02 06:40:36', '2025-07-02 06:53:20', NULL),
(15, 3, 'debit', 500.00, NULL, NULL, 1, NULL, '2025-07-02 06:53:46', '2025-07-02 06:53:46', NULL),
(16, 1, 'debit', 47.25, 'credit', NULL, 1, NULL, '2025-07-02 06:56:17', '2025-07-02 06:56:17', NULL),
(17, 3, 'credit', 10.00, NULL, NULL, 1, NULL, '2025-07-02 08:09:48', '2025-07-02 08:09:48', NULL),
(18, 3, 'debit', 36.29, 'credit', NULL, 1, NULL, '2025-07-02 11:52:50', '2025-07-02 11:52:50', NULL),
(22, 4, 'debit', 857.76, 'credit', NULL, 1, NULL, '2025-07-02 13:01:48', '2025-07-02 13:01:48', 'Due for invoice '),
(23, 4, 'debit', 277.00, 'credit', NULL, 1, 11, '2025-07-02 14:53:41', '2025-07-02 14:53:41', 'Due for invoice INV-WCSIHM'),
(24, 3, 'credit', 2000.00, 'bank_transfer', NULL, 1, NULL, '2025-07-03 03:18:14', '2025-07-03 03:18:14', NULL),
(25, 3, 'credit', 1000.00, 'cash', NULL, 1, NULL, '2025-07-03 03:18:24', '2025-07-03 03:18:24', NULL),
(26, 3, 'debit', 106.00, 'wallet', NULL, 1, NULL, '2025-07-03 03:34:13', '2025-07-03 03:34:13', 'POS payment for invoice INV-B0WN8W'),
(27, 4, 'debit', 96.00, 'credit', NULL, 1, 15, '2025-07-03 04:04:59', '2025-07-03 04:04:59', 'Due for invoice INV-TSVHDV'),
(28, 3, 'debit', 1048.00, 'wallet', NULL, 1, NULL, '2025-07-03 04:46:58', '2025-07-03 04:46:58', 'Credit sale (due) for invoice INV-ZANODR'),
(29, 3, 'debit', 1319.00, 'wallet', NULL, 1, NULL, '2025-07-03 04:53:04', '2025-07-03 04:53:04', 'POS payment for invoice INV-URLFYX'),
(30, 3, 'debit', 648.00, 'wallet', NULL, 1, NULL, '2025-07-03 04:53:04', '2025-07-03 04:53:04', 'Credit sale (due) for invoice INV-URLFYX'),
(31, 3, 'debit', 1029.00, 'wallet', NULL, 1, NULL, '2025-07-03 05:05:24', '2025-07-03 05:05:24', 'Credit sale (due) for invoice INV-0018'),
(32, 3, 'debit', 182.00, 'wallet', NULL, 1, NULL, '2025-07-03 05:13:14', '2025-07-03 05:13:14', 'Credit sale (due) for invoice INV-0019'),
(33, 3, 'debit', 458.00, 'wallet', NULL, 1, NULL, '2025-07-03 06:44:51', '2025-07-03 06:44:51', 'Credit sale (due) for invoice INV-0022'),
(34, 3, 'credit', 266.00, NULL, NULL, 1, NULL, '2025-07-04 04:23:40', '2025-07-04 04:23:40', NULL),
(35, 8, 'credit', 1000.00, 'upi', 'hdfc bank upi', 1, NULL, '2025-07-05 04:47:27', '2025-07-05 04:47:27', 'Added Advance payment via UPI'),
(36, 8, 'credit', 2000.00, 'upi', NULL, 1, NULL, '2025-07-05 04:47:56', '2025-07-05 04:47:56', 'Second time Advance payment via UPI 2'),
(37, 8, 'debit', 100.00, 'wallet', NULL, 1, NULL, '2025-07-05 04:53:36', '2025-07-05 04:53:36', 'POS payment for invoice INV-0023'),
(38, 8, 'debit', 46.00, 'wallet', NULL, 1, NULL, '2025-07-05 04:53:36', '2025-07-05 04:53:36', 'Credit sale (due) for invoice INV-0023'),
(39, 8, 'credit', 150.00, 'cheque', NULL, 1, NULL, '2025-07-05 04:58:05', '2025-07-05 04:58:05', 'testing'),
(40, 8, 'debit', 10.00, 'wallet', NULL, 1, NULL, '2025-07-05 09:28:11', '2025-07-05 09:28:11', 'POS payment for invoice INV-0024'),
(41, 8, 'debit', 167.00, 'wallet', NULL, 1, NULL, '2025-07-05 09:28:11', '2025-07-05 09:28:11', 'Credit sale (due) for invoice INV-0024'),
(42, 4, 'debit', 2877.00, 'wallet', NULL, 1, NULL, '2025-07-10 03:13:27', '2025-07-10 03:13:27', 'Credit sale (due) for invoice INV-0025'),
(43, 2, 'debit', 321.00, 'wallet', NULL, 1, NULL, '2025-07-10 03:27:13', '2025-07-10 03:27:13', 'Credit sale (due) for invoice INV-0026');

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `expense_categories`
--
ALTER TABLE `expense_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `purchase_transactions`
--
ALTER TABLE `purchase_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `role_permission`
--
ALTER TABLE `role_permission`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `sub_categories`
--
ALTER TABLE `sub_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_role`
--
ALTER TABLE `user_role`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `wallet_accounts`
--
ALTER TABLE `wallet_accounts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

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
