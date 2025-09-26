-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 14, 2025 at 03:13 PM
-- Server version: 8.0.42-0ubuntu0.24.04.1
-- PHP Version: 8.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `krimah_db_liv1`
--

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Sony', 'active', NULL, NULL),
(2, 'Samsung', 'active', NULL, NULL),
(3, 'BLUE HARIBO', 'active', NULL, '2025-08-06 16:27:44'),
(4, 'MARS', 'active', NULL, '2025-07-19 13:07:25'),
(5, 'CHUPA CHUPS', 'active', NULL, '2025-07-19 13:29:10'),
(6, 'Britannia', 'active', NULL, NULL),
(7, 'Parle', 'active', NULL, NULL),
(8, 'Dabur', 'active', NULL, NULL),
(9, 'ENERGY DRINKS', 'active', NULL, '2025-07-19 13:29:53'),
(10, 'Tata', 'active', NULL, NULL),
(11, 'Nestle', 'active', NULL, NULL),
(12, 'Pepsi', 'active', NULL, NULL),
(13, 'COCA COLA', 'active', NULL, '2025-08-06 16:27:03'),
(15, 'CADBURY', 'active', '2025-07-28 15:25:49', '2025-07-28 15:25:49'),
(16, 'KINDER', 'active', '2025-07-28 15:44:33', '2025-07-28 15:44:33'),
(17, 'FERRERO', 'active', '2025-07-28 15:51:11', '2025-07-28 15:51:11'),
(18, 'MONDELEZ', 'active', '2025-08-01 14:29:52', '2025-08-01 14:29:52'),
(19, 'HARIBO', 'active', '2025-08-01 16:17:33', '2025-08-01 16:17:33'),
(20, 'WRIGLEY\'S', 'active', '2025-08-02 11:46:06', '2025-08-02 11:46:06');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Electronics', 'active', NULL, NULL),
(2, 'Furniture', 'active', NULL, NULL),
(3, 'Stationery', 'active', NULL, '2025-07-17 17:41:09'),
(4, 'Fruits & Vegetables', 'active', NULL, NULL),
(5, 'Dairy', 'active', NULL, NULL),
(6, 'Bakery', 'active', NULL, NULL),
(7, 'Beverages', 'active', NULL, NULL),
(8, 'Snacks', 'active', NULL, NULL),
(9, 'Personal Care', 'active', NULL, NULL),
(10, 'HOUSEHOLD', 'active', NULL, '2025-08-06 16:29:09'),
(11, 'BISCUIT', 'active', NULL, '2025-07-19 13:30:44'),
(13, 'NESTLE', 'active', '2025-07-17 17:42:22', '2025-07-17 17:42:22'),
(14, 'CADBURY', 'active', '2025-07-17 17:42:44', '2025-07-17 17:42:44'),
(15, 'DRINK', 'active', '2025-07-17 17:42:52', '2025-07-17 17:42:52'),
(16, 'CONFECTIONARY', 'active', '2025-07-19 13:04:27', '2025-07-23 09:14:53'),
(17, 'TOY', 'active', '2025-07-19 13:04:40', '2025-08-06 16:28:48'),
(18, 'MARS', 'active', '2025-07-19 13:04:55', '2025-07-23 09:13:47'),
(19, 'KINDER', 'active', '2025-07-19 13:05:10', '2025-07-19 13:06:38'),
(20, 'FERRERO', 'active', '2025-07-19 13:05:33', '2025-07-19 13:06:57'),
(21, 'EXTRA GUMS', 'active', '2025-07-19 13:06:13', '2025-08-02 11:45:02'),
(22, 'CHOCOLATE', 'active', '2025-07-19 13:31:23', '2025-07-19 13:31:23'),
(23, 'BLUE HARIBO', 'active', '2025-07-23 09:13:12', '2025-07-23 09:13:12'),
(24, 'BROWN HARIBO', 'active', '2025-07-23 09:13:34', '2025-07-23 09:13:34'),
(25, 'MILKA', 'active', '2025-08-01 14:29:36', '2025-08-01 14:29:36');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint UNSIGNED NOT NULL,
  `type` enum('customer','retailer') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'customer',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gst_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `type`, `name`, `phone`, `email`, `gst_number`, `address`, `status`, `created_at`, `updated_at`) VALUES
(7, 'customer', 'B&Y BILO', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:00:35', '2025-08-05 15:07:12'),
(8, 'customer', 'SKY CASH & CARY', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:01:02', '2025-07-29 18:02:36'),
(9, 'customer', 'R H WHOLESALE ASIFBHAI', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:01:21', '2025-08-05 14:06:40'),
(10, 'customer', 'AR TREDING BHALI', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:01:32', '2025-08-14 09:53:25'),
(11, 'customer', 'SUPER WHOLESALE NAZAKAT', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:02:20', '2025-08-05 14:14:16'),
(12, 'customer', 'TROPICANA CASH & CARRY', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:02:56', '2025-07-17 18:02:56'),
(13, 'customer', 'FAIRDEAL CASH & CARRY', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:03:32', '2025-07-17 18:03:32'),
(14, 'customer', 'MK SWEET', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:03:41', '2025-07-17 18:03:41'),
(15, 'customer', 'DOGANABI', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:03:53', '2025-07-17 18:03:53'),
(16, 'customer', 'ERDARABI', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:03:59', '2025-07-17 18:03:59'),
(18, 'retailer', 'BIPINBHAI', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:05:24', '2025-07-17 18:05:24'),
(19, 'retailer', 'CASH', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:05:35', '2025-07-17 18:05:35'),
(20, 'customer', 'MANOJBHAI', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:05:53', '2025-07-17 18:05:53'),
(21, 'customer', 'SATNAM', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:06:00', '2025-07-29 18:01:59'),
(22, 'customer', 'JIVANBHAI', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:06:19', '2025-07-17 18:06:19'),
(23, 'customer', 'AZIMBHAI', NULL, NULL, NULL, NULL, 'active', '2025-07-18 09:34:31', '2025-07-29 18:02:10'),
(25, 'retailer', 'NIKHILBHAI', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:03:21', '2025-07-29 18:03:21'),
(26, 'retailer', 'VISHALBHAI', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:03:38', '2025-07-29 18:05:38'),
(27, 'retailer', 'NEW CUSTOMER', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:06:37', '2025-07-29 18:06:37'),
(28, 'customer', 'HUSSAIN HARIBO', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:10:33', '2025-07-29 18:10:33'),
(29, 'customer', 'ISMAIL', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:10:46', '2025-07-29 18:10:46'),
(30, 'customer', 'EVERYDAY', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:11:32', '2025-07-29 18:11:32'),
(31, 'customer', 'AR TREDING BHALI PAJI', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:11:57', '2025-07-29 18:11:57'),
(32, 'customer', 'KAPOOR', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:12:07', '2025-07-29 18:12:07'),
(33, 'customer', 'RKK ENTERPRICE', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:12:23', '2025-07-29 18:12:23'),
(34, 'customer', 'AHMED REDBRIDGE', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:13:34', '2025-07-29 18:13:34'),
(35, 'customer', 'TAHTAKALE WHOLESALE', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:14:37', '2025-07-29 18:14:37'),
(36, 'customer', 'TAHTAKALE TRADİNG UK', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:15:17', '2025-07-29 18:15:17'),
(37, 'customer', 'MEMO CASH AND CARRY LTD', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:16:31', '2025-07-29 18:16:31'),
(38, 'customer', 'CAPITAL DRINKS LONDON LTD', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:16:56', '2025-07-29 18:16:56'),
(39, 'customer', 'FOODART UK LIMITED', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:17:24', '2025-07-29 18:17:24'),
(40, 'customer', 'TRISHOOL CONVEIENCE LTD', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:17:57', '2025-07-29 18:17:57'),
(41, 'customer', 'SHIV SHAKTI CONVENIENCE LTD', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:18:28', '2025-07-29 18:29:38'),
(42, 'customer', 'SUGER RUSH LTD', NULL, NULL, NULL, NULL, 'inactive', '2025-07-29 18:18:56', '2025-08-14 09:50:12'),
(43, 'customer', 'SHIVA ENTERPRISE LTD', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:19:27', '2025-07-29 18:19:27'),
(44, 'customer', 'SUN PLUS CASH & CARRY', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:20:54', '2025-07-29 18:20:54'),
(45, 'customer', 'SEFWAY CASH & CARRY', NULL, NULL, NULL, NULL, 'active', '2025-08-02 09:01:27', '2025-08-02 09:01:27'),
(46, 'customer', 'KEMALABI', NULL, NULL, NULL, NULL, 'active', '2025-08-02 18:46:25', '2025-08-02 18:46:25'),
(47, 'customer', 'SEVEN BROS COOKWAVE LTD', NULL, NULL, NULL, NULL, 'active', '2025-08-04 09:27:46', '2025-08-04 09:27:46'),
(48, 'retailer', 'HAPPYPAJI', NULL, NULL, NULL, NULL, 'active', '2025-08-04 12:48:56', '2025-08-04 12:48:56'),
(49, 'retailer', 'NISA CHIGWELL', NULL, NULL, NULL, NULL, 'active', '2025-08-04 15:34:16', '2025-08-04 15:42:15'),
(50, 'retailer', 'DEVENDRABHAI BAPS', NULL, NULL, NULL, NULL, 'active', '2025-08-04 16:19:54', '2025-08-04 16:19:54'),
(51, 'customer', 'MOHMEDBHAI EGG', NULL, NULL, NULL, NULL, 'active', '2025-08-05 10:39:11', '2025-08-05 10:39:11'),
(52, 'customer', 'MOHMOD WEMBLY', NULL, NULL, NULL, NULL, 'active', '2025-08-06 11:33:21', '2025-08-06 11:33:21'),
(53, 'customer', 'RAINBOW', NULL, NULL, NULL, NULL, 'active', '2025-08-07 07:46:35', '2025-08-07 07:46:35'),
(54, 'customer', 'SID', NULL, NULL, NULL, NULL, 'active', '2025-08-07 10:49:47', '2025-08-07 10:49:47'),
(55, 'customer', 'DIGANTBHAI', NULL, NULL, NULL, NULL, 'active', '2025-08-07 15:23:55', '2025-08-07 15:23:55'),
(56, 'customer', 'FOUAD', NULL, NULL, NULL, NULL, 'active', '2025-08-08 08:01:30', '2025-08-08 08:01:30'),
(57, 'retailer', 'KRUNALBHAI', NULL, NULL, NULL, NULL, 'active', '2025-08-08 09:19:21', '2025-08-08 09:19:21'),
(58, 'customer', 'AZHAR', NULL, NULL, NULL, NULL, 'active', '2025-08-08 13:27:12', '2025-08-08 13:27:12'),
(59, 'customer', 'ALIBABA', NULL, NULL, NULL, NULL, 'active', '2025-08-08 15:01:08', '2025-08-08 15:07:28'),
(60, 'customer', 'KALID', NULL, NULL, NULL, NULL, 'active', '2025-08-08 17:30:50', '2025-08-08 17:30:50'),
(61, 'customer', 'OMAR PITERBROGO', NULL, NULL, NULL, NULL, 'active', '2025-08-09 13:07:21', '2025-08-09 13:10:01'),
(62, 'customer', 'KHAN', NULL, NULL, NULL, NULL, 'active', '2025-08-11 13:41:37', '2025-08-11 13:41:37'),
(63, 'customer', 'YUSUF ENFIELD', NULL, NULL, NULL, NULL, 'active', '2025-08-12 11:10:52', '2025-08-12 11:11:14'),
(64, 'customer', 'CANDY CASTLE LTD', NULL, NULL, NULL, NULL, 'active', '2025-08-13 13:34:17', '2025-08-13 13:34:17'),
(65, 'customer', 'BASIR', NULL, NULL, NULL, NULL, 'active', '2025-08-13 14:07:20', '2025-08-13 14:07:20'),
(66, 'customer', 'ANSAR', NULL, NULL, NULL, NULL, 'active', '2025-08-13 18:08:09', '2025-08-13 18:08:09'),
(67, 'customer', 'HAMEED', NULL, NULL, NULL, NULL, 'active', '2025-08-14 14:38:59', '2025-08-14 14:38:59');

-- --------------------------------------------------------

--
-- Table structure for table `emails`
--

CREATE TABLE `emails` (
  `id` bigint UNSIGNED NOT NULL,
  `to_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `from_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('invoice','wallet_ledger','supplier_details','purchase_order') COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `send_status` enum('sent','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'sent',
  `response_message` text COLLATE utf8mb4_unicode_ci,
  `related_id` bigint UNSIGNED DEFAULT NULL,
  `related_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sent_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `emails`
--

INSERT INTO `emails` (`id`, `to_email`, `from_email`, `type`, `subject`, `body`, `send_status`, `response_message`, `related_id`, `related_type`, `sent_at`, `created_at`, `updated_at`) VALUES
(47, 'alpeshpatel82@icloud.com', 'ankit4vision@gmail.com', 'supplier_details', 'Supplier Information - Alpeshkumar Patel', '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    <meta charset=\"utf-8\">\r\n    <title>Password Reset - Alpeshkumar Patel</title>\r\n    <style>\r\n        body {\r\n            font-family: Arial, sans-serif;\r\n            line-height: 1.6;\r\n            color: #333;\r\n            max-width: 600px;\r\n            margin: 0 auto;\r\n            padding: 20px;\r\n        }\r\n        .header {\r\n            background-color: #f8f9fa;\r\n            padding: 20px;\r\n            border-radius: 5px;\r\n            margin-bottom: 20px;\r\n            text-align: center;\r\n        }\r\n        .company-name {\r\n            font-size: 24px;\r\n            font-weight: bold;\r\n            color: #2c3e50;\r\n            margin-bottom: 5px;\r\n        }\r\n        .company-meta {\r\n            font-size: 14px;\r\n            color: #7f8c8d;\r\n        }\r\n        .content {\r\n            background-color: #ffffff;\r\n            padding: 20px;\r\n            border-radius: 5px;\r\n            border: 1px solid #e9ecef;\r\n        }\r\n        .supplier-info {\r\n            margin-bottom: 20px;\r\n        }\r\n        .supplier-name {\r\n            font-size: 20px;\r\n            font-weight: bold;\r\n            color: #2c3e50;\r\n            margin-bottom: 15px;\r\n        }\r\n        .info-row {\r\n            margin-bottom: 10px;\r\n        }\r\n        .label {\r\n            font-weight: bold;\r\n            color: #34495e;\r\n            display: inline-block;\r\n            width: 120px;\r\n        }\r\n        .value {\r\n            color: #2c3e50;\r\n        }\r\n        .footer {\r\n            margin-top: 30px;\r\n            padding-top: 20px;\r\n            border-top: 1px solid #e9ecef;\r\n            text-align: center;\r\n            font-size: 12px;\r\n            color: #7f8c8d;\r\n        }\r\n        .status-active {\r\n            color: #27ae60;\r\n            font-weight: bold;\r\n        }\r\n        .status-inactive {\r\n            color: #e74c3c;\r\n            font-weight: bold;\r\n        }\r\n        .password-box {\r\n            background-color: #f8f9fa;\r\n            border: 2px solid #007bff;\r\n            border-radius: 8px;\r\n            padding: 20px;\r\n            text-align: center;\r\n            margin: 20px 0;\r\n        }\r\n        .password-text {\r\n            font-size: 24px;\r\n            font-weight: bold;\r\n            color: #007bff;\r\n            letter-spacing: 2px;\r\n            font-family: \'Courier New\', monospace;\r\n        }\r\n        .warning {\r\n            background-color: #fff3cd;\r\n            border: 1px solid #ffeaa7;\r\n            color: #856404;\r\n            padding: 15px;\r\n            border-radius: 5px;\r\n            margin: 20px 0;\r\n        }\r\n        .success {\r\n            background-color: #d4edda;\r\n            border: 1px solid #c3e6cb;\r\n            color: #155724;\r\n            padding: 15px;\r\n            border-radius: 5px;\r\n            margin: 20px 0;\r\n        }\r\n    </style>\r\n</head>\r\n<body>\r\n    <div class=\"header\">\r\n        <div class=\"company-name\">KRIMAH LTD POS</div>\r\n        <div class=\"company-meta\">\r\n                    </div>\r\n                    </div>\r\n\r\n    <div class=\"content\">\r\n                    <!-- Password Reset Content -->\r\n            <h2>Password Reset Successful</h2>\r\n            \r\n            <p>Hello <strong>Alpeshkumar Patel</strong>,</p>\r\n            \r\n            <div class=\"success\">\r\n                <strong>Your password has been successfully reset!</strong>\r\n            </div>\r\n            \r\n            <p>Your new password is:</p>\r\n            \r\n            <div class=\"password-box\">\r\n                <div class=\"password-text\">58is2vXXu9</div>\r\n            </div>\r\n            \r\n            <div class=\"warning\">\r\n                <strong>Important:</strong> \r\n                <ul style=\"margin: 10px 0; padding-left: 20px;\">\r\n                    <li>Please log in with this new password</li>\r\n                    <li>For security, we recommend changing your password after logging in</li>\r\n                    <li>Keep this password safe and do not share it with anyone</li>\r\n                </ul>\r\n            </div>\r\n            \r\n            <p>You can now log in to your KRIMAH LTD POS account using this new password.</p>\r\n            \r\n            <p>If you did not request this password reset, please contact our support team immediately.</p>\r\n            </div>\r\n\r\n    <div class=\"footer\">\r\n        <p>This email was generated on July 30, 2025 at 7:05 PM</p>\r\n        <p>© 2025 KRIMAH LTD POS. All rights reserved.</p>\r\n    </div>\r\n</body>\r\n</html> ', 'sent', 'Email sent successfully', 8, 'User', '2025-07-30 19:05:20', '2025-07-30 19:05:20', '2025-07-30 19:05:20'),
(48, 'krimahltd@gmail.com', 'ankit4vision@gmail.com', 'purchase_order', 'Purchase Order Details - PO-000006', '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    <meta charset=\"utf-8\">\r\n    <title>Purchase Order - GURMEETPAJI</title>\r\n    <style>\r\n        body {\r\n            font-family: Arial, sans-serif;\r\n            line-height: 1.6;\r\n            color: #333;\r\n            max-width: 700px;\r\n            margin: 0 auto;\r\n            padding: 20px;\r\n        }\r\n        .header {\r\n            background-color: #f8f9fa;\r\n            padding: 20px;\r\n            border-radius: 5px;\r\n            margin-bottom: 20px;\r\n            text-align: center;\r\n        }\r\n        .company-name {\r\n            font-size: 24px;\r\n            font-weight: bold;\r\n            color: #2c3e50;\r\n            margin-bottom: 5px;\r\n        }\r\n        .company-meta {\r\n            font-size: 14px;\r\n            color: #7f8c8d;\r\n        }\r\n        .content {\r\n            background-color: #ffffff;\r\n            padding: 20px;\r\n            border-radius: 5px;\r\n            border: 1px solid #e9ecef;\r\n        }\r\n        .section-title {\r\n            font-size: 18px;\r\n            font-weight: bold;\r\n            color: #2c3e50;\r\n            margin-bottom: 10px;\r\n        }\r\n        .info-row {\r\n            margin-bottom: 10px;\r\n        }\r\n        .label {\r\n            font-weight: bold;\r\n            color: #34495e;\r\n            display: inline-block;\r\n            width: 120px;\r\n        }\r\n        .value {\r\n            color: #2c3e50;\r\n        }\r\n        .footer {\r\n            margin-top: 30px;\r\n            padding-top: 20px;\r\n            border-top: 1px solid #e9ecef;\r\n            text-align: center;\r\n            font-size: 12px;\r\n            color: #7f8c8d;\r\n        }\r\n    </style>\r\n</head>\r\n<body>\r\n    <div class=\"header\">\r\n        <div class=\"company-name\">Krimah Ltd</div>\r\n        <div class=\"company-meta\">\r\n            2 Renwick Road,Barcking        </div>\r\n                <div class=\"company-meta\">Phone: 07714291436</div>\r\n                        <div class=\"company-meta\">Email: krimah@gmail.com</div>\r\n            </div>\r\n\r\n    <div class=\"content\">\r\n        <div class=\"mb-3\" style=\"font-size:16px; color:#2c3e50;\">\r\n            Dear GURMEETPAJI,\r\n        </div>\r\n        <div class=\"mb-3\" style=\"font-size:15px; color:#2c3e50;\">\r\n            Please find attached our purchase order PO-000006 as a PDF.<br>\r\n            If you have any questions, feel free to contact us.\r\n        </div>\r\n        <div class=\"section-title\">Purchase Order Information</div>\r\n        <div class=\"info-row\"><span class=\"label\">PO #:</span> <span class=\"value\">PO-000006</span></div>\r\n        <div class=\"info-row\"><span class=\"label\">Last Updated:</span> <span class=\"value\">04 Aug 2025</span></div>\r\n        \r\n        <div class=\"section-title\" style=\"margin-top:24px;\">Supplier Information</div>\r\n        <div class=\"info-row\"><span class=\"label\">Name:</span> <span class=\"value\">GURMEETPAJI</span></div>\r\n        <div class=\"info-row\"><span class=\"label\">Email:</span> <span class=\"value\">-</span></div>\r\n        <div class=\"info-row\"><span class=\"label\">Phone:</span> <span class=\"value\">-</span></div>\r\n        <div class=\"info-row\"><span class=\"label\">Address:</span> <span class=\"value\">-</span></div>\r\n            </div>\r\n\r\n    <div class=\"footer\">\r\n        <p>This email was generated on August 4, 2025 at 4:59 PM</p>\r\n        <p>© 2025 Krimah Ltd. All rights reserved.</p>\r\n    </div>\r\n</body>\r\n</html> ', 'sent', 'Email sent successfully', 21, 'App\\Models\\PurchaseOrder', '2025-08-04 16:59:20', '2025-08-04 16:59:20', '2025-08-04 16:59:20'),
(49, 'krimahltd@gmail.com', 'ankit4vision@gmail.com', 'wallet_ledger', 'Customer Details - SEVEN BROS COOKWAVE LTD', '<html>\r\n<body style=\"font-family: Arial, sans-serif; color: #222; font-size: 15px;\">\r\n    <h2 style=\"margin-bottom: 8px;\">Customer Details Report</h2>\r\n    <p>Hello,</p>\r\n    <p>Please find attached the detailed report for customer <b>SEVEN BROS COOKWAVE LTD</b>.</p>\r\n            <p style=\"color: #555; font-size: 13px;\">Please check the attachment(s) for your details.</p>\r\n        <hr style=\"margin: 18px 0; border: none; border-top: 1px solid #eee;\">\r\n    <div style=\"font-size: 13px; color: #666;\">\r\n        <b>Krimah Ltd</b><br>\r\n        2 Renwick Road,Barcking<br>        Email: krimah@gmail.com<br>        Phone: 07714291436<br>    </div>\r\n    <div style=\"font-size: 12px; color: #aaa; margin-top: 12px;\">Generated on 2025-08-05 07:10</div>\r\n</body>\r\n</html> ', 'sent', 'Email sent successfully', 47, 'App\\Models\\Customer', '2025-08-05 07:10:05', '2025-08-05 07:10:05', '2025-08-05 07:10:05'),
(50, 'krimahltd@gmail.com', 'ankit4vision@gmail.com', 'supplier_details', 'Supplier Information - GURMEETPAJI', '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    <meta charset=\"utf-8\">\r\n    <title>Supplier Information - GURMEETPAJI</title>\r\n    <style>\r\n        body {\r\n            font-family: Arial, sans-serif;\r\n            line-height: 1.6;\r\n            color: #333;\r\n            max-width: 600px;\r\n            margin: 0 auto;\r\n            padding: 20px;\r\n        }\r\n        .header {\r\n            background-color: #f8f9fa;\r\n            padding: 20px;\r\n            border-radius: 5px;\r\n            margin-bottom: 20px;\r\n            text-align: center;\r\n        }\r\n        .company-name {\r\n            font-size: 24px;\r\n            font-weight: bold;\r\n            color: #2c3e50;\r\n            margin-bottom: 5px;\r\n        }\r\n        .company-meta {\r\n            font-size: 14px;\r\n            color: #7f8c8d;\r\n        }\r\n        .content {\r\n            background-color: #ffffff;\r\n            padding: 20px;\r\n            border-radius: 5px;\r\n            border: 1px solid #e9ecef;\r\n        }\r\n        .supplier-info {\r\n            margin-bottom: 20px;\r\n        }\r\n        .supplier-name {\r\n            font-size: 20px;\r\n            font-weight: bold;\r\n            color: #2c3e50;\r\n            margin-bottom: 15px;\r\n        }\r\n        .info-row {\r\n            margin-bottom: 10px;\r\n        }\r\n        .label {\r\n            font-weight: bold;\r\n            color: #34495e;\r\n            display: inline-block;\r\n            width: 120px;\r\n        }\r\n        .value {\r\n            color: #2c3e50;\r\n        }\r\n        .footer {\r\n            margin-top: 30px;\r\n            padding-top: 20px;\r\n            border-top: 1px solid #e9ecef;\r\n            text-align: center;\r\n            font-size: 12px;\r\n            color: #7f8c8d;\r\n        }\r\n        .status-active {\r\n            color: #27ae60;\r\n            font-weight: bold;\r\n        }\r\n        .status-inactive {\r\n            color: #e74c3c;\r\n            font-weight: bold;\r\n        }\r\n        .password-box {\r\n            background-color: #f8f9fa;\r\n            border: 2px solid #007bff;\r\n            border-radius: 8px;\r\n            padding: 20px;\r\n            text-align: center;\r\n            margin: 20px 0;\r\n        }\r\n        .password-text {\r\n            font-size: 24px;\r\n            font-weight: bold;\r\n            color: #007bff;\r\n            letter-spacing: 2px;\r\n            font-family: \'Courier New\', monospace;\r\n        }\r\n        .warning {\r\n            background-color: #fff3cd;\r\n            border: 1px solid #ffeaa7;\r\n            color: #856404;\r\n            padding: 15px;\r\n            border-radius: 5px;\r\n            margin: 20px 0;\r\n        }\r\n        .success {\r\n            background-color: #d4edda;\r\n            border: 1px solid #c3e6cb;\r\n            color: #155724;\r\n            padding: 15px;\r\n            border-radius: 5px;\r\n            margin: 20px 0;\r\n        }\r\n    </style>\r\n</head>\r\n<body>\r\n    <div class=\"header\">\r\n        <div class=\"company-name\">Krimah Ltd</div>\r\n        <div class=\"company-meta\">\r\n            2 Renwick Road,Barcking        </div>\r\n                <div class=\"company-meta\">Phone: 07714291436</div>\r\n                        <div class=\"company-meta\">Email: krimah@gmail.com</div>\r\n            </div>\r\n\r\n    <div class=\"content\">\r\n                    <!-- Supplier Details Content -->\r\n            <div class=\"mb-3\" style=\"font-size:16px; color:#2c3e50;\">\r\n                This email contains the Supplier Details with Purchase Orders and Summary, Financial Summary & Transactions.\r\n            </div>\r\n            <div class=\"supplier-info\">\r\n                <div class=\"supplier-name\">Supplier Information</div>\r\n                \r\n                <div class=\"info-row\">\r\n                    <span class=\"label\">Name:</span>\r\n                    <span class=\"value\">GURMEETPAJI</span>\r\n                </div>\r\n                \r\n                                \r\n                                \r\n                                \r\n                                \r\n                <div class=\"info-row\">\r\n                    <span class=\"label\">Status:</span>\r\n                    <span class=\"value status-active\">\r\n                        Active\r\n                    </span>\r\n                </div>\r\n                \r\n                <div class=\"info-row\">\r\n                    <span class=\"label\">Created:</span>\r\n                    <span class=\"value\">July 17, 2025</span>\r\n                </div>\r\n            </div>\r\n            \r\n            <div style=\"margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;\">\r\n                <p style=\"margin: 0; color: #7f8c8d;\">\r\n                    This email contains the supplier information from our records. \r\n                    Please contact us if you need any additional details or have questions.\r\n                </p>\r\n            </div>\r\n\r\n                        <div style=\"margin-top: 20px; padding: 15px; background-color: #e9f7ef; border-radius: 5px; color: #1e8449;\">\r\n                <strong>Please check the attachment(s) for your details.</strong>\r\n            </div>\r\n                        </div>\r\n\r\n    <div class=\"footer\">\r\n        <p>This email was generated on August 5, 2025 at 7:10 AM</p>\r\n        <p>© 2025 Krimah Ltd. All rights reserved.</p>\r\n    </div>\r\n</body>\r\n</html> ', 'sent', 'Email sent successfully', 9, 'App\\Models\\Supplier', '2025-08-05 07:10:55', '2025-08-05 07:10:55', '2025-08-05 07:10:55'),
(51, 'krimahltd@gmail.com', 'ankit4vision@gmail.com', 'supplier_details', 'Supplier Information - J & M AMIRBHAI', '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    <meta charset=\"utf-8\">\r\n    <title>Supplier Information - J &amp; M AMIRBHAI</title>\r\n    <style>\r\n        body {\r\n            font-family: Arial, sans-serif;\r\n            line-height: 1.6;\r\n            color: #333;\r\n            max-width: 600px;\r\n            margin: 0 auto;\r\n            padding: 20px;\r\n        }\r\n        .header {\r\n            background-color: #f8f9fa;\r\n            padding: 20px;\r\n            border-radius: 5px;\r\n            margin-bottom: 20px;\r\n            text-align: center;\r\n        }\r\n        .company-name {\r\n            font-size: 24px;\r\n            font-weight: bold;\r\n            color: #2c3e50;\r\n            margin-bottom: 5px;\r\n        }\r\n        .company-meta {\r\n            font-size: 14px;\r\n            color: #7f8c8d;\r\n        }\r\n        .content {\r\n            background-color: #ffffff;\r\n            padding: 20px;\r\n            border-radius: 5px;\r\n            border: 1px solid #e9ecef;\r\n        }\r\n        .supplier-info {\r\n            margin-bottom: 20px;\r\n        }\r\n        .supplier-name {\r\n            font-size: 20px;\r\n            font-weight: bold;\r\n            color: #2c3e50;\r\n            margin-bottom: 15px;\r\n        }\r\n        .info-row {\r\n            margin-bottom: 10px;\r\n        }\r\n        .label {\r\n            font-weight: bold;\r\n            color: #34495e;\r\n            display: inline-block;\r\n            width: 120px;\r\n        }\r\n        .value {\r\n            color: #2c3e50;\r\n        }\r\n        .footer {\r\n            margin-top: 30px;\r\n            padding-top: 20px;\r\n            border-top: 1px solid #e9ecef;\r\n            text-align: center;\r\n            font-size: 12px;\r\n            color: #7f8c8d;\r\n        }\r\n        .status-active {\r\n            color: #27ae60;\r\n            font-weight: bold;\r\n        }\r\n        .status-inactive {\r\n            color: #e74c3c;\r\n            font-weight: bold;\r\n        }\r\n        .password-box {\r\n            background-color: #f8f9fa;\r\n            border: 2px solid #007bff;\r\n            border-radius: 8px;\r\n            padding: 20px;\r\n            text-align: center;\r\n            margin: 20px 0;\r\n        }\r\n        .password-text {\r\n            font-size: 24px;\r\n            font-weight: bold;\r\n            color: #007bff;\r\n            letter-spacing: 2px;\r\n            font-family: \'Courier New\', monospace;\r\n        }\r\n        .warning {\r\n            background-color: #fff3cd;\r\n            border: 1px solid #ffeaa7;\r\n            color: #856404;\r\n            padding: 15px;\r\n            border-radius: 5px;\r\n            margin: 20px 0;\r\n        }\r\n        .success {\r\n            background-color: #d4edda;\r\n            border: 1px solid #c3e6cb;\r\n            color: #155724;\r\n            padding: 15px;\r\n            border-radius: 5px;\r\n            margin: 20px 0;\r\n        }\r\n    </style>\r\n</head>\r\n<body>\r\n    <div class=\"header\">\r\n        <div class=\"company-name\">Krimah Ltd</div>\r\n        <div class=\"company-meta\">\r\n            2 Renwick Road,Barcking        </div>\r\n                <div class=\"company-meta\">Phone: 07714291436</div>\r\n                        <div class=\"company-meta\">Email: krimah@gmail.com</div>\r\n            </div>\r\n\r\n    <div class=\"content\">\r\n                    <!-- Supplier Details Content -->\r\n            <div class=\"mb-3\" style=\"font-size:16px; color:#2c3e50;\">\r\n                This email contains the Supplier Details with Purchase Orders and Summary, Financial Summary & Transactions.\r\n            </div>\r\n            <div class=\"supplier-info\">\r\n                <div class=\"supplier-name\">Supplier Information</div>\r\n                \r\n                <div class=\"info-row\">\r\n                    <span class=\"label\">Name:</span>\r\n                    <span class=\"value\">J &amp; M AMIRBHAI</span>\r\n                </div>\r\n                \r\n                                \r\n                                \r\n                                \r\n                                \r\n                <div class=\"info-row\">\r\n                    <span class=\"label\">Status:</span>\r\n                    <span class=\"value status-active\">\r\n                        Active\r\n                    </span>\r\n                </div>\r\n                \r\n                <div class=\"info-row\">\r\n                    <span class=\"label\">Created:</span>\r\n                    <span class=\"value\">July 17, 2025</span>\r\n                </div>\r\n            </div>\r\n            \r\n            <div style=\"margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;\">\r\n                <p style=\"margin: 0; color: #7f8c8d;\">\r\n                    This email contains the supplier information from our records. \r\n                    Please contact us if you need any additional details or have questions.\r\n                </p>\r\n            </div>\r\n\r\n                        <div style=\"margin-top: 20px; padding: 15px; background-color: #e9f7ef; border-radius: 5px; color: #1e8449;\">\r\n                <strong>Please check the attachment(s) for your details.</strong>\r\n            </div>\r\n                        </div>\r\n\r\n    <div class=\"footer\">\r\n        <p>This email was generated on August 13, 2025 at 9:33 AM</p>\r\n        <p>© 2025 Krimah Ltd. All rights reserved.</p>\r\n    </div>\r\n</body>\r\n</html> ', 'sent', 'Email sent successfully', 8, 'App\\Models\\Supplier', '2025-08-13 09:34:00', '2025-08-13 09:34:00', '2025-08-13 09:34:00');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` bigint UNSIGNED NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `designation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `date_of_joining` date DEFAULT NULL,
  `status` enum('active','inactive','terminated') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `first_name`, `last_name`, `email`, `phone`, `designation`, `department`, `address`, `date_of_joining`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Ankit', 'Patel', 'admin@example.com', '07123456789', 'Software', 'Engg', 'Khodaamba', '1991-12-13', 'active', '2025-07-08 06:13:15', '2025-07-08 06:13:48'),
(3, 'SMITH', 'PATEL', 'smitpatel18111999@gmail.com', NULL, NULL, NULL, NULL, '2025-08-01', 'active', '2025-07-18 11:12:48', '2025-07-18 11:12:48'),
(4, 'DHRUV', 'PATEL', 'dhruvmpatel2408@gmail.com', NULL, NULL, NULL, NULL, '2025-08-01', 'active', '2025-07-18 11:17:22', '2025-07-18 11:17:22');

-- --------------------------------------------------------

--
-- Table structure for table `employee_salaries`
--

CREATE TABLE `employee_salaries` (
  `id` bigint UNSIGNED NOT NULL,
  `employee_id` bigint UNSIGNED NOT NULL,
  `month` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `base_salary` decimal(10,2) NOT NULL,
  `allowances` decimal(10,2) NOT NULL DEFAULT '0.00',
  `deductions` decimal(10,2) NOT NULL DEFAULT '0.00',
  `net_salary` decimal(10,2) NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expense_category_id` bigint UNSIGNED NOT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `date`, `amount`, `description`, `expense_category_id`, `created_by`, `created_at`, `updated_at`) VALUES
(9, '2025-08-01', 2400.00, 'BANK TRANSFER', 7, 8, '2025-08-02 19:15:06', '2025-08-02 19:15:06'),
(11, '2025-08-07', 21.00, 'WATER', 14, 1, '2025-08-08 08:20:25', '2025-08-08 08:20:25'),
(12, '2025-08-08', 700.00, 'SMITH', 5, 1, '2025-08-08 08:23:59', '2025-08-08 19:15:29'),
(13, '2025-08-08', 900.00, 'DHRUV', 5, 1, '2025-08-08 08:24:24', '2025-08-08 19:15:41'),
(14, '2025-08-10', 752.45, 'HMRC', 8, 1, '2025-08-08 08:26:03', '2025-08-13 10:17:36'),
(15, '2025-08-13', 81.50, 'VAN', 15, 1, '2025-08-08 19:16:04', '2025-08-13 10:19:59'),
(16, '2025-08-08', 100.00, 'TYRE CHANGE', 15, 1, '2025-08-08 19:20:13', '2025-08-08 19:20:13'),
(17, '2025-08-05', 193.20, 'PEANSON', 16, 1, '2025-08-09 15:09:59', '2025-08-09 15:09:59'),
(18, '2025-08-11', 240.25, 'NFU MUTUAL', 17, 1, '2025-08-13 10:12:36', '2025-08-13 10:12:36'),
(19, '2025-08-11', 38.30, 'EE', 13, 1, '2025-08-13 10:12:57', '2025-08-13 10:12:57');

-- --------------------------------------------------------

--
-- Table structure for table `expense_categories`
--

CREATE TABLE `expense_categories` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expense_categories`
--

INSERT INTO `expense_categories` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'TRAVEL', 'active', NULL, '2025-08-09 08:08:13'),
(2, 'OFFICE SUPPLIES', 'active', NULL, '2025-08-09 12:32:58'),
(5, 'STAFF SALARY', 'active', '2025-07-18 11:19:21', '2025-08-09 07:27:13'),
(7, 'WAREHOUSE RENT', 'active', '2025-07-18 11:21:23', '2025-08-09 07:28:16'),
(8, 'VAT RETURN AMOUNT', 'active', '2025-07-19 13:35:16', '2025-08-09 08:08:47'),
(9, 'ACCOUNT FEE', 'active', '2025-07-19 13:36:10', '2025-08-09 12:32:32'),
(10, 'CAR INSURANCE', 'active', '2025-07-19 13:36:45', '2025-08-09 12:33:40'),
(11, 'VAN INSURANCE', 'active', '2025-07-19 13:37:07', '2025-08-09 07:27:39'),
(12, 'BIN', 'active', '2025-07-19 13:38:35', '2025-08-09 12:33:22'),
(13, 'PHONE BILL', 'active', '2025-07-19 13:42:54', '2025-08-09 12:33:13'),
(14, 'WARAHOUSE EXPENSE', 'active', '2025-08-08 08:20:01', '2025-08-08 08:20:01'),
(15, 'VAN SERVICE', 'active', '2025-08-08 19:19:09', '2025-08-08 19:19:09'),
(16, 'NATIONAL EMPLOYMENT', 'active', '2025-08-09 15:09:25', '2025-08-09 15:09:25'),
(17, 'WARAHOUSE INSURANCE', 'active', '2025-08-13 10:11:30', '2025-08-13 10:11:30'),
(19, 'DIESEL', 'active', '2025-08-13 10:23:02', '2025-08-13 10:23:02');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
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
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `module` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submodule` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
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
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
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
(43, 'App\\Models\\User', 1, 'auth-token', '24a2beac841d5befbbafd64cd8f7ae7e94c4b90007ab6fadb1d771bb5909afe0', '[\"*\"]', '2025-07-17 00:43:39', NULL, '2025-07-16 22:22:48', '2025-07-17 00:43:39'),
(44, 'App\\Models\\User', 1, 'auth-token', '6fbdeb220fd7ab891c2246fa09bb1d9d17889815b8805e03f242b5fda519a46c', '[\"*\"]', '2025-07-22 16:05:59', NULL, '2025-07-17 16:51:59', '2025-07-22 16:05:59'),
(45, 'App\\Models\\User', 1, 'auth-token', 'aa31aa77861dcaef9ad50461e0be3ccc48a2ea3933ac7f4f641b8fcdefe71e9d', '[\"*\"]', '2025-07-22 14:50:52', NULL, '2025-07-17 16:56:24', '2025-07-22 14:50:52'),
(46, 'App\\Models\\User', 1, 'auth-token', '4277efd47434b51bd276956bbf9086f173260d3bf8abaab84880ac4502ef43e6', '[\"*\"]', '2025-07-17 17:00:08', NULL, '2025-07-17 16:59:58', '2025-07-17 17:00:08'),
(53, 'App\\Models\\User', 1, 'auth-token', '512ab99acedaa4e993cb8fda9efe336ccda2660c062b32804ea42c1c8c7904f5', '[\"*\"]', '2025-07-27 08:37:18', NULL, '2025-07-19 04:27:04', '2025-07-27 08:37:18'),
(55, 'App\\Models\\User', 1, 'auth-token', 'a6cf4ea2b8ca13dfc42c0867c57b5f66622e5a1fd0aabd9ed49569a41171107d', '[\"*\"]', '2025-07-25 14:54:42', NULL, '2025-07-22 18:56:39', '2025-07-25 14:54:42'),
(56, 'App\\Models\\User', 1, 'auth-token', '6de9e8bc88652e67f1db3f9c157d1e6df3d23be914ff9c712de96967d5f37872', '[\"*\"]', '2025-07-26 09:29:33', NULL, '2025-07-23 04:40:45', '2025-07-26 09:29:33'),
(64, 'App\\Models\\User', 1, 'auth-token', 'ddba8407975597d121bef60b7363712a463f15e33ac27cb66edaad3754bcc10c', '[\"*\"]', '2025-07-25 14:57:48', NULL, '2025-07-25 14:55:37', '2025-07-25 14:57:48'),
(65, 'App\\Models\\User', 1, 'auth-token', '0b0159aa7c7ab286519db249aff7ce8c98d7b13dfc282e33fa77bd4a40de37c6', '[\"*\"]', '2025-07-29 12:19:59', NULL, '2025-07-25 15:10:48', '2025-07-29 12:19:59'),
(67, 'App\\Models\\User', 1, 'auth-token', '2b398f60bdcd3954b7e3097ebeac5f23b143c3d9c342cd717abfa1d80b3ebffe', '[\"*\"]', '2025-07-29 12:21:14', NULL, '2025-07-26 11:35:27', '2025-07-29 12:21:14'),
(70, 'App\\Models\\User', 7, 'auth-token', '1f7888938d55e31f8556e6f4d973a6c9e98f1e690db17fed901c8872d015e3bb', '[\"*\"]', '2025-07-28 16:45:35', NULL, '2025-07-28 12:46:13', '2025-07-28 16:45:35'),
(75, 'App\\Models\\User', 1, 'auth-token', 'f144c5d6ac4a5ce69d8a3e2a92183ae43bc130d0623cc15f96dc4d13c964b5b5', '[\"*\"]', '2025-07-29 12:36:38', NULL, '2025-07-29 12:24:47', '2025-07-29 12:36:38'),
(76, 'App\\Models\\User', 1, 'auth-token', 'e16315e3bd67906a3ea25e31068b56441244ab247e8304cbfe95e65886634dd1', '[\"*\"]', '2025-07-29 13:04:41', NULL, '2025-07-29 13:04:16', '2025-07-29 13:04:41'),
(78, 'App\\Models\\User', 1, 'auth-token', '3492df7def7f08a2c3f336923880fb662ba9227b92b669566b4b1438fd172cbe', '[\"*\"]', '2025-07-30 04:54:09', NULL, '2025-07-29 13:26:37', '2025-07-30 04:54:09'),
(79, 'App\\Models\\User', 1, 'auth-token', '24e0c0f39520ae6ab73a46b8b19c8598a36ad7ba75e8b1c1006656fa9dec47e0', '[\"*\"]', '2025-07-29 14:16:37', NULL, '2025-07-29 14:12:17', '2025-07-29 14:16:37'),
(80, 'App\\Models\\User', 1, 'auth-token', 'cf469ba6de5459f62a5547b5bd19aa6a37a2cc644c1f5f20cbed2c9122de7e30', '[\"*\"]', '2025-07-30 08:23:13', NULL, '2025-07-29 16:19:33', '2025-07-30 08:23:13'),
(81, 'App\\Models\\User', 1, 'auth-token', '5dca2d43d1ac4f931e39545ef81806e52a8276835fb0e653b89d12585c3fc375', '[\"*\"]', NULL, NULL, '2025-07-30 12:09:54', '2025-07-30 12:09:54'),
(82, 'App\\Models\\User', 1, 'auth-token', 'e3e3f5536fd612f0c2d5da7c3292f033aa471345263b6f2501039086605403dd', '[\"*\"]', NULL, NULL, '2025-07-30 15:03:59', '2025-07-30 15:03:59'),
(83, 'App\\Models\\User', 1, 'auth-token', 'fa39f07c0c21aaf7bbdf08ad5c6ce5c452cbdbbcc5b387844eceb4b1efe1aa0f', '[\"*\"]', NULL, NULL, '2025-07-30 15:06:59', '2025-07-30 15:06:59'),
(86, 'App\\Models\\User', 1, 'auth-token', '7bb644fdeb6207fe066f6e2ad09566c21738544f3fb2966ff65f30c68e45692e', '[\"*\"]', '2025-07-30 16:05:11', NULL, '2025-07-30 16:05:09', '2025-07-30 16:05:11'),
(87, 'App\\Models\\User', 1, 'auth-token', '332483afed4de86a173fcbb6551fbf09aec400fc2f4606ef94803c21520041b9', '[\"*\"]', NULL, NULL, '2025-07-30 16:56:34', '2025-07-30 16:56:34'),
(88, 'App\\Models\\User', 1, 'auth-token', 'ddc70bd575f650821b9520b326e325bb1577630529248a96c4b12ca6ff56dae9', '[\"*\"]', '2025-08-06 07:43:26', NULL, '2025-07-30 16:56:43', '2025-08-06 07:43:26'),
(96, 'App\\Models\\User', 1, 'auth-token', 'fc8d04da8dc7fece0e9385ce18050107dd1040e85baaadfe5d2d9f4206414ac6', '[\"*\"]', '2025-08-03 18:25:29', NULL, '2025-08-01 09:28:59', '2025-08-03 18:25:29'),
(106, 'App\\Models\\User', 7, 'auth-token', '1ee34a84fbfe62184e0efefc3886a3bbe1d44a3d69ac75927b2842c3b18f0839', '[\"*\"]', '2025-08-13 16:53:22', NULL, '2025-08-02 12:19:08', '2025-08-13 16:53:22'),
(107, 'App\\Models\\User', 7, 'auth-token', '204dea25403661604330789e9d0dc11724dfb91dd91f840f413d6315bd59c93c', '[\"*\"]', '2025-08-02 12:22:52', NULL, '2025-08-02 12:21:47', '2025-08-02 12:22:52'),
(110, 'App\\Models\\User', 7, 'auth-token', '24ffb1fbe9ba1c1835c77b21db86ac40e5a9f825ec7325f8fac9a4b3e11a8eb5', '[\"*\"]', '2025-08-02 15:55:44', NULL, '2025-08-02 15:51:44', '2025-08-02 15:55:44'),
(111, 'App\\Models\\User', 1, 'auth-token', 'b35ae66ab15e6e638184242d5093ff7f65d619708665ffbab5ce8807d1a7b5b6', '[\"*\"]', '2025-08-10 12:35:04', NULL, '2025-08-02 17:39:36', '2025-08-10 12:35:04'),
(117, 'App\\Models\\User', 1, 'auth-token', 'cfa190e3e501fd4906f911bbaf67bc3d0112d9c7c67ba6d3ef02da9f376fe3cb', '[\"*\"]', '2025-08-14 09:30:50', NULL, '2025-08-03 09:21:51', '2025-08-14 09:30:50'),
(124, 'App\\Models\\User', 7, 'auth-token', '66511100307ffc3aacb2d2bad7db376ca3b1d11942ead42b3893de503628dc98', '[\"*\"]', '2025-08-05 14:59:49', NULL, '2025-08-04 17:12:18', '2025-08-05 14:59:49'),
(126, 'App\\Models\\User', 7, 'auth-token', '4478cf372c87dc6eff2e33423182a0cc79c6dd6d20541b0bf1e4f063d88f324a', '[\"*\"]', NULL, NULL, '2025-08-05 11:32:31', '2025-08-05 11:32:31'),
(128, 'App\\Models\\User', 1, 'auth-token', 'c1ed7be8ee2dc3997bd38a79743e9567371ea2835889eeb16c6ea67f7f525bb4', '[\"*\"]', '2025-08-14 12:49:22', NULL, '2025-08-06 08:19:56', '2025-08-14 12:49:22'),
(129, 'App\\Models\\User', 1, 'auth-token', '4e279bb7d6e61b6972cc98ec1f28bf894b7195b4cf8d29f13467aebcde2e7982', '[\"*\"]', '2025-08-06 12:14:58', NULL, '2025-08-06 08:21:08', '2025-08-06 12:14:58'),
(159, 'App\\Models\\User', 7, 'auth-token', '73a2b7107c6fc00c9acce3f7a7ab01aa4df15499eb5f79ad123a6ddedf6562f2', '[\"*\"]', '2025-08-14 08:06:28', NULL, '2025-08-11 13:49:27', '2025-08-14 08:06:28'),
(163, 'App\\Models\\User', 7, 'auth-token', 'ee6c23e7ab25a7b185e538a58cf4995fd9da460a7cc52be5f7ad3796b38cb9e5', '[\"*\"]', '2025-08-14 14:50:26', NULL, '2025-08-14 09:24:14', '2025-08-14 14:50:26'),
(164, 'App\\Models\\User', 8, 'auth-token', 'd93ce3e67913d7ca08f6d9cb4523375042cf26a8f3af42ad6b69c2ee454b8e2f', '[\"*\"]', '2025-08-14 11:46:12', NULL, '2025-08-14 11:42:58', '2025-08-14 11:46:12'),
(168, 'App\\Models\\User', 1, 'auth-token', '656870024e41241e44c4557037f2675d9d370317778752cab60a9fc75094fa2d', '[\"*\"]', '2025-08-14 14:03:27', NULL, '2025-08-14 14:02:08', '2025-08-14 14:03:27');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `barcode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` bigint UNSIGNED DEFAULT NULL,
  `sub_category_id` bigint UNSIGNED DEFAULT NULL,
  `brand_id` bigint UNSIGNED DEFAULT NULL,
  `unit_id` bigint UNSIGNED DEFAULT NULL,
  `purchase_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `sales_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `retailer_sales_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `individual_sales_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `last_purchase_price` decimal(10,2) DEFAULT NULL,
  `last_purchase_date` date DEFAULT NULL,
  `vat_percent` decimal(5,2) DEFAULT NULL,
  `opening_stock` decimal(10,2) DEFAULT NULL,
  `low_stock_alert` decimal(10,2) DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `discount` decimal(8,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `sku`, `barcode`, `image`, `category_id`, `sub_category_id`, `brand_id`, `unit_id`, `purchase_price`, `sales_price`, `retailer_sales_price`, `individual_sales_price`, `last_purchase_price`, `last_purchase_date`, `vat_percent`, `opening_stock`, `low_stock_alert`, `description`, `status`, `discount`, `created_at`, `updated_at`) VALUES
(12, 'KITKAT WHITE 4 FINGER 24X41.5G', NULL, '8445290552167', NULL, 13, NULL, 11, NULL, 9.50, 10.50, 11.50, 10.50, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2025-07-17 17:44:38', '2025-07-18 11:42:08'),
(13, 'KITAKAT 4 FINGER 24X41.5G', NULL, '7613035357792', NULL, 13, NULL, 11, NULL, 9.60, 10.50, 11.50, 10.50, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2025-07-17 17:46:30', '2025-07-18 11:42:24'),
(14, 'KITKAT DARK 4 FINGER 24X41.5G', NULL, '8445290542298', NULL, 13, NULL, 11, NULL, 9.50, 10.50, 11.50, 10.50, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2025-07-17 17:53:34', '2025-08-06 18:10:41'),
(15, 'COKE 1.75LT £2.79', NULL, '05017726449377', NULL, 15, NULL, 13, NULL, 8.80, 10.50, 10.00, 9.50, NULL, NULL, NULL, 141.00, NULL, NULL, 'active', NULL, '2025-07-17 18:09:29', '2025-08-13 13:28:53'),
(16, 'CADBURY DAIRY MILK CHOPPED FRUIT&NUT 22X95G £1.69', NULL, '07622202278747', NULL, 14, NULL, NULL, NULL, 24.30, 25.30, 26.40, 25.30, NULL, NULL, NULL, 25.00, NULL, NULL, 'active', NULL, '2025-07-18 09:47:19', '2025-08-12 11:06:54'),
(17, 'CADBURY DAIRY MILK DAIM 18X120G £1.69', NULL, '07622202278549', NULL, 14, NULL, NULL, NULL, 19.70, 20.70, 21.60, 20.70, NULL, NULL, NULL, 5.00, NULL, NULL, 'active', NULL, '2025-07-18 09:56:44', '2025-08-13 09:39:14'),
(18, 'CADBURY DAIRY MILK BISCOFF 21X95G £1.69', NULL, '07622202294099', NULL, 14, NULL, NULL, NULL, 23.10, 24.15, 25.20, 24.15, NULL, NULL, NULL, 2.00, NULL, NULL, 'active', NULL, '2025-07-18 10:01:29', '2025-08-13 09:39:14'),
(19, 'CADBURY DAIRY MILK OREO 17X120G £1.69', NULL, '07622202278600', NULL, 14, NULL, NULL, NULL, 18.70, 19.55, 20.40, 19.55, NULL, NULL, NULL, 2.00, NULL, NULL, 'active', NULL, '2025-07-18 10:04:02', '2025-08-13 15:56:38'),
(20, 'CADBURY DAIRY MILK OREO WHITE 17X120G £1.69', NULL, '07622202268328', NULL, 14, NULL, NULL, NULL, 18.70, 19.55, 20.40, 19.55, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-07-18 10:06:11', '2025-08-07 09:54:08'),
(21, 'CADBURY DAIRY MILK OREO SANDWICH 15X120G £1.69', NULL, '07622202278563', NULL, 14, NULL, NULL, NULL, 16.50, 17.25, 18.00, 17.25, NULL, NULL, NULL, 1.00, NULL, NULL, 'active', NULL, '2025-07-18 10:10:01', '2025-08-12 09:37:39'),
(22, 'CADBURY DAIRY MILK CARAMEL 16X120G £1.69', NULL, '07622202278488', NULL, 14, NULL, NULL, NULL, 17.60, 18.40, 19.20, 18.40, NULL, NULL, NULL, 13.00, NULL, NULL, 'active', NULL, '2025-07-18 10:15:26', '2025-08-13 15:56:38'),
(23, 'CADBURY DAIRY MILK FRUIT&NUT BARS 48X49G', NULL, '07622300743666', NULL, 14, NULL, NULL, NULL, 23.00, 24.00, 27.00, 24.00, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2025-07-18 10:23:59', '2025-07-18 10:46:52'),
(24, 'CADBURY DAIRY MILK WHOLENUT BARS 48X45G', NULL, '07622210995988', NULL, 14, NULL, NULL, NULL, 21.60, 24.00, 27.00, 24.00, NULL, NULL, NULL, 403.00, NULL, NULL, 'active', NULL, '2025-07-18 10:27:02', '2025-08-13 15:56:38'),
(25, 'CADBURY TWIRL CHOCOLATE BARS 48X43G', NULL, '07622202268670', NULL, 14, NULL, NULL, NULL, 22.80, 24.00, 27.00, 24.50, NULL, NULL, NULL, 223.00, NULL, NULL, 'active', NULL, '2025-07-18 10:40:33', '2025-08-14 12:07:09'),
(26, 'CADBURY STARBAR 32X49G', NULL, '05034660043003', NULL, 14, NULL, NULL, NULL, 18.00, 19.00, 20.00, 19.00, NULL, NULL, NULL, 361.00, NULL, NULL, 'active', NULL, '2025-07-18 10:42:48', '2025-08-13 11:49:56'),
(27, 'CADBURY CRUNCHIE BARS 48X40G', NULL, '05000201160744', NULL, 14, NULL, NULL, NULL, 18.00, 19.50, 20.00, 19.50, NULL, NULL, NULL, 149.00, NULL, NULL, 'active', NULL, '2025-07-18 10:46:00', '2025-08-14 12:07:09'),
(28, 'CADBURY WISPA CHOCOLATE BARS 48X36G', NULL, '07622210001788', NULL, 14, NULL, NULL, NULL, 22.00, 24.00, 27.00, 24.00, NULL, NULL, NULL, 366.00, NULL, NULL, 'active', NULL, '2025-07-18 10:49:09', '2025-08-13 15:56:38'),
(29, 'CADBURY FLAKE BARS 48X32G', NULL, '05000201322609', NULL, 14, NULL, NULL, NULL, 22.00, 23.50, 25.00, 23.50, NULL, NULL, NULL, 110.00, NULL, NULL, 'active', NULL, '2025-07-18 11:01:37', '2025-08-14 11:16:31'),
(30, 'CADBURY DOUBLE DECKER BARS 48X54.5G', NULL, '07622210106414', NULL, 14, NULL, 15, NULL, 18.00, 19.00, 20.00, 19.00, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2025-07-18 11:05:12', '2025-08-01 16:37:24'),
(31, 'PICNIC BIG BARS 2PACK', NULL, '07622210358141', NULL, 16, NULL, 18, NULL, 19.00, 21.00, 24.00, 21.00, NULL, NULL, NULL, 91.00, NULL, NULL, 'active', NULL, '2025-07-18 11:17:54', '2025-08-08 12:17:03'),
(32, 'KITKAT CHUNKY PEANUT BUTTER 24X42G', NULL, '3800020464175', NULL, 13, NULL, 11, NULL, 9.75, 10.50, 11.00, 10.50, NULL, NULL, NULL, 6.00, NULL, NULL, 'active', NULL, '2025-07-18 11:46:46', '2025-08-12 09:10:13'),
(33, 'KITKAT CHUNKY 24X40G', NULL, '3800020472668', NULL, 13, NULL, 11, NULL, 9.75, 10.50, 11.00, 10.50, NULL, NULL, NULL, 164.00, NULL, NULL, 'active', NULL, '2025-07-18 11:48:20', '2025-08-14 12:32:46'),
(34, 'KITKAT CHUNKY WHITE 36X40G', NULL, '3800020436820', NULL, 13, NULL, 11, NULL, 14.65, 15.75, 16.50, 15.75, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-07-18 11:50:55', '2025-08-05 14:13:25'),
(35, 'KITKAT SALTED CARAMEL BLOCK 15X99G £1.50', NULL, '03800020414828', NULL, 13, NULL, 11, NULL, 14.00, 14.50, 15.00, 14.49, NULL, NULL, NULL, 2.00, NULL, NULL, 'active', NULL, '2025-07-18 11:57:10', '2025-08-11 13:48:33'),
(36, 'KITKAT DOUBLE CHOCOLATE BLOCK 15X99G £1.50', NULL, '03800020414835', NULL, 13, NULL, 11, NULL, 14.00, 14.50, 15.00, 14.50, NULL, NULL, NULL, 9.00, NULL, NULL, 'active', NULL, '2025-07-18 11:59:54', '2025-08-04 17:31:25'),
(37, 'KITKAT HAZELNUT BLOCK 15X99G', NULL, '3800020416099', NULL, 13, NULL, 11, NULL, 16.50, 17.50, 17.50, 17.49, NULL, NULL, NULL, 43.00, NULL, NULL, 'active', NULL, '2025-07-18 12:03:11', '2025-08-04 17:31:48'),
(38, 'TOBLERONE 24X45G', NULL, '7622200341009', NULL, 8, NULL, 11, NULL, 9.25, 9.50, 11.00, 10.00, NULL, NULL, NULL, 292.00, NULL, NULL, 'active', NULL, '2025-07-18 12:28:21', '2025-08-13 16:09:41'),
(39, 'LION WHITE BAR 40X42G', NULL, '761328794977', NULL, 13, NULL, 11, NULL, 14.50, 15.00, 16.00, 15.00, NULL, NULL, NULL, 64.00, NULL, NULL, 'active', NULL, '2025-07-18 14:02:39', '2025-08-11 11:59:34'),
(40, 'LION PEANUT BAR 40X41G', NULL, '7613287910783', NULL, 13, NULL, 11, NULL, 14.50, 15.00, 16.00, 14.99, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-07-18 14:04:07', '2025-07-18 20:49:56'),
(41, 'LION BLACK & WHITE 40X42G', NULL, '8445291426047', NULL, 13, NULL, 11, NULL, 14.50, 15.00, 16.00, 15.00, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-07-18 14:05:35', '2025-08-13 10:29:06'),
(42, 'LION CHOCOLATE BAR 40X42G', NULL, '76133287910578', NULL, 13, NULL, 11, NULL, 14.50, 15.00, 16.00, 16.00, NULL, NULL, NULL, 33.00, NULL, NULL, 'active', NULL, '2025-07-18 14:08:09', '2025-08-14 12:32:46'),
(43, 'LION CHOCOLATE 2 PACK 28X60G', NULL, '7613287756619', NULL, 13, NULL, 11, NULL, 13.75, 15.00, 16.00, 15.00, NULL, NULL, NULL, 43.00, NULL, NULL, 'active', NULL, '2025-07-18 14:10:33', '2025-08-14 12:07:09'),
(44, 'LION WHITE 2 PACK 30X60G', NULL, '8445291271067', NULL, 13, NULL, 11, NULL, 14.50, 16.00, 17.00, 16.00, NULL, NULL, NULL, 59.00, NULL, NULL, 'active', NULL, '2025-07-18 14:14:30', '2025-08-14 14:03:14'),
(45, 'YORKIE ORIGINAL BLUE 24X46G', NULL, '7613036249898', NULL, 13, NULL, 11, NULL, 13.50, 14.50, 15.00, 14.50, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2025-07-18 16:26:22', '2025-07-18 16:26:22'),
(46, 'YORKIE MILK DUO BLUE 24X72G', NULL, '07613033126406', NULL, 13, NULL, 11, NULL, 16.00, 17.00, 20.00, 17.00, NULL, NULL, NULL, 17.00, NULL, NULL, 'active', NULL, '2025-07-18 16:27:50', '2025-08-11 11:59:34'),
(47, 'LION BROWNIE 40X40G', NULL, '8445290466150', NULL, 13, NULL, 11, NULL, 14.50, 15.00, 16.00, 15.00, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2025-07-19 10:09:18', '2025-07-19 10:09:18'),
(48, 'POLO ORIGINAL TUBES 32X34G', NULL, '07613036446778', NULL, 13, NULL, 11, NULL, 9.00, 10.50, 11.00, 10.00, NULL, NULL, NULL, 685.00, NULL, NULL, 'active', NULL, '2025-07-19 10:11:23', '2025-08-14 12:07:09'),
(49, 'AERO PEPPERMINT BARS 24X36G', NULL, '07613287430953', NULL, 13, NULL, 11, NULL, 14.00, 15.00, 15.00, 15.00, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-07-19 10:13:56', '2025-08-08 09:28:16'),
(50, 'AERO PEPPERMINT BLOCKS 15X90G £1.50', NULL, '08445291528215', NULL, 13, NULL, 11, NULL, 13.62, 15.00, 16.00, 15.00, NULL, NULL, NULL, 118.00, NULL, NULL, 'active', NULL, '2025-07-19 10:16:51', '2025-08-14 12:07:09'),
(51, 'WERTHER\'S ORIGINAL 24X50G', NULL, '4014400008104', NULL, 16, NULL, NULL, NULL, 9.50, 10.00, 10.50, 10.00, NULL, NULL, NULL, 145.00, NULL, NULL, 'active', NULL, '2025-07-19 10:20:36', '2025-08-14 12:32:46'),
(52, 'STARBURST ORIGINAL 24X45G', NULL, '4009900498173', NULL, 16, NULL, 4, NULL, 8.50, 9.50, 9.50, 9.50, NULL, NULL, NULL, 5.00, NULL, NULL, 'active', NULL, '2025-07-19 10:22:52', '2025-08-11 11:59:34'),
(53, 'DAIM BAR 36X28G', NULL, '7622300335526', NULL, 16, NULL, NULL, NULL, 11.75, 13.00, 15.00, 12.50, NULL, NULL, NULL, 111.00, NULL, NULL, 'active', NULL, '2025-07-19 10:30:06', '2025-08-14 12:32:46'),
(54, 'TOBLERONE FRUIT&NUT 20X100G', NULL, '7622300107932', NULL, 8, NULL, NULL, NULL, 16.00, 17.00, 20.00, 17.00, NULL, NULL, NULL, 8.00, NULL, NULL, 'active', NULL, '2025-07-19 10:40:23', '2025-08-13 14:09:42'),
(55, 'TOBLERONE WHITE 20X100G', NULL, '7614500211403', NULL, 8, NULL, NULL, NULL, 16.00, 17.00, 20.00, 17.00, NULL, NULL, NULL, 7.00, NULL, NULL, 'active', NULL, '2025-07-19 10:42:00', '2025-08-04 17:27:15'),
(56, 'SKITTLES CRAZY SOURS 36X45G', NULL, '4009900522090', NULL, 22, NULL, 4, NULL, 12.70, 14.00, 15.00, 14.00, NULL, NULL, NULL, 203.00, NULL, NULL, 'active', NULL, '2025-07-19 10:45:16', '2025-08-14 07:37:38'),
(57, 'SKITTLES FRUITS 36X45G', NULL, '4009900522113', NULL, 22, NULL, 4, NULL, 12.50, 14.00, 15.00, 14.00, NULL, NULL, NULL, 349.00, NULL, NULL, 'active', NULL, '2025-07-19 10:46:19', '2025-08-14 12:07:09'),
(58, 'SKITTLES WILDBERRY 36X45G', NULL, '4009900522076', NULL, 22, NULL, 4, NULL, 12.70, 14.00, 15.00, 14.00, NULL, NULL, NULL, 248.00, NULL, NULL, 'active', NULL, '2025-07-19 10:47:24', '2025-08-14 12:07:09'),
(59, 'SKITTLES TROPICAL 36X45G', NULL, '4009900522243', NULL, 22, NULL, 4, NULL, 12.50, 14.00, 15.00, 14.00, NULL, NULL, NULL, 273.00, NULL, NULL, 'active', NULL, '2025-07-19 10:48:12', '2025-08-14 12:07:09'),
(60, 'LINDOR MILK CHOCOLATE BAR 24X38G', NULL, '04000539363184', NULL, 22, NULL, NULL, NULL, 18.00, 19.00, 20.00, 19.00, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-07-19 11:07:59', '2025-08-12 11:06:54'),
(61, 'MILKYWAY 2PACK 28X43G', NULL, '5000159550505', NULL, 16, NULL, 4, NULL, 16.00, 17.00, 19.00, 17.00, NULL, NULL, NULL, 134.00, NULL, NULL, 'active', NULL, '2025-07-19 11:09:54', '2025-08-13 10:29:06'),
(62, 'NUTELLA & GO 12X48G', NULL, '05020411121175', NULL, 16, NULL, NULL, NULL, 9.50, 10.50, 11.00, 10.50, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2025-07-19 11:22:15', '2025-07-23 14:23:43'),
(63, 'GALAXY SMOOTH MILK BAR 24X42G', NULL, '5000159470308', NULL, 16, NULL, 4, NULL, 12.00, 13.00, 13.50, 13.00, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2025-07-19 11:23:49', '2025-07-21 11:41:36'),
(64, 'GALAXY SMOOTH MILK BLOCK £1.50 24X100G', NULL, '05000159571579', NULL, 16, NULL, 4, NULL, 24.00, 25.20, 26.40, 25.20, NULL, NULL, NULL, 2.00, NULL, NULL, 'active', NULL, '2025-07-19 11:27:36', '2025-08-13 09:39:14'),
(65, 'CHUPA CHUPS BAG 120 LOLLIPOPS', NULL, '8410031923605', NULL, 16, NULL, 5, NULL, 9.00, 12.00, 12.00, 10.50, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-07-19 11:35:34', '2025-08-11 20:39:16'),
(66, 'CHUPA CHUPS WHEEL 200 LOLLIPOOPS', NULL, '8410031950656', NULL, 16, NULL, 5, NULL, 21.00, 22.00, 24.00, 22.00, NULL, NULL, NULL, 6.00, NULL, NULL, 'active', NULL, '2025-07-19 11:38:03', '2025-08-05 08:42:30'),
(67, 'CHUPA CHUPS TRAY BAG 12X10PCS', NULL, '08410031917734', NULL, 16, NULL, 5, NULL, 9.50, 10.50, 12.00, 10.50, NULL, NULL, NULL, 119.00, NULL, NULL, 'active', NULL, '2025-07-19 11:41:16', '2025-08-13 15:56:39'),
(68, 'OREO CAKE 12X24G', NULL, '7622210785145', NULL, 22, NULL, NULL, NULL, 2.00, 2.50, 3.00, 2.50, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2025-07-19 12:23:12', '2025-07-21 11:43:39'),
(69, 'OREO DOUBLE CREAM 16X157G', NULL, '07622210148476', NULL, 11, NULL, NULL, NULL, 9.50, 11.00, 12.00, 11.00, NULL, NULL, NULL, 6.00, NULL, NULL, 'active', NULL, '2025-07-19 12:26:29', '2025-08-13 09:39:14'),
(70, 'OREO ORIGINAL 16X154G', NULL, '07622300315276', NULL, 11, NULL, NULL, NULL, 10.00, 11.00, 12.00, 11.00, NULL, NULL, NULL, 422.00, NULL, NULL, 'active', NULL, '2025-07-19 12:28:02', '2025-08-13 14:07:29'),
(71, 'HERSHEY\'S MILK CHOCOLATE 24X40G', NULL, '753854500096', NULL, 22, NULL, NULL, NULL, 13.00, 14.00, 15.00, 14.00, NULL, NULL, NULL, 132.00, NULL, NULL, 'active', NULL, '2025-07-19 12:30:33', '2025-08-13 15:56:38'),
(72, 'HERSHEY\'S COOKIES \'N\' CREAM 24X40G', NULL, '753854500133', NULL, 16, NULL, NULL, NULL, 13.00, 14.00, 15.00, 14.00, NULL, NULL, NULL, 1234.00, NULL, NULL, 'active', NULL, '2025-07-19 12:32:39', '2025-08-13 15:56:38'),
(73, 'REESE\'S 2 PEANUT BUTTER CUPS 36X42G', NULL, '034000939565', NULL, 16, NULL, NULL, NULL, 17.00, 18.50, 19.00, 18.50, NULL, NULL, NULL, 58.00, NULL, NULL, 'active', NULL, '2025-07-19 12:35:05', '2025-08-13 11:49:56'),
(74, 'REESE\'S WHITE 2 PEANUT BUTTER CUPS 24X39.5G', NULL, '034000433025', NULL, 22, NULL, NULL, NULL, 13.00, 14.00, 16.00, 16.00, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-07-19 12:36:38', '2025-08-04 17:30:58'),
(75, 'REESE\'S NUTRAGEOUS 18X47G', NULL, '034000109401', NULL, 22, NULL, NULL, NULL, 9.00, 10.50, 11.00, 10.50, NULL, NULL, NULL, 910.00, NULL, NULL, 'active', NULL, '2025-07-19 12:37:55', '2025-08-12 13:37:34'),
(76, 'SNICKERS 40X50G', NULL, '5900951311512', NULL, 22, NULL, 4, NULL, 13.50, 15.00, 16.00, 15.00, NULL, NULL, NULL, 116.00, NULL, NULL, 'active', NULL, '2025-07-21 11:16:40', '2025-08-14 12:07:09'),
(77, 'SNICKERS ICE CREAM 2 PACK 32X81G', NULL, '4607065735432', NULL, 22, NULL, 4, NULL, 23.50, 25.00, 30.00, 25.00, NULL, NULL, NULL, 85.00, NULL, NULL, 'active', NULL, '2025-07-21 11:20:29', '2025-08-14 12:07:09'),
(78, 'SNICKERS WHITE 2 PACK 32X81G', NULL, '4607065730086', NULL, 22, NULL, 4, NULL, 23.50, 25.00, 30.00, 25.00, NULL, NULL, NULL, 110.00, NULL, NULL, 'active', NULL, '2025-07-21 11:21:47', '2025-08-14 12:07:09'),
(79, 'MARS 40X51G', NULL, '5900951311314', NULL, 22, NULL, 4, NULL, 14.25, 15.50, 16.00, 15.50, NULL, NULL, NULL, 72.00, NULL, NULL, 'active', NULL, '2025-07-21 11:26:02', '2025-08-13 16:31:40'),
(80, 'MARS DUO 32X78.8G', NULL, '5000159551717', NULL, 22, NULL, 4, NULL, 27.00, 28.00, 29.00, 28.00, NULL, NULL, NULL, 95.00, NULL, NULL, 'active', NULL, '2025-07-21 11:27:22', '2025-08-13 09:39:14'),
(81, 'MALTESERS TREAT BAG 24X68G', NULL, '5000159503600', NULL, 22, NULL, 4, NULL, 24.00, 25.00, 25.00, 25.00, NULL, NULL, NULL, 97.00, NULL, NULL, 'active', NULL, '2025-07-21 11:29:17', '2025-08-13 16:09:41'),
(82, 'TWIX WHITE 32X46G', NULL, '5000159556828', NULL, 22, NULL, 4, NULL, 12.00, 13.50, 15.00, 13.50, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-07-21 11:37:04', '2025-08-11 10:56:24'),
(83, 'TWIX WHITE XTRA 24X75G', NULL, '5000159557245', NULL, 22, NULL, 4, NULL, 14.00, 15.00, 18.00, 18.00, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2025-07-21 11:38:31', '2025-07-21 12:25:31'),
(84, 'TWIX XTRA 30X75G', NULL, '5900951312281', NULL, 22, NULL, 4, NULL, 18.00, 20.50, 22.00, 20.50, NULL, NULL, NULL, 104.00, NULL, NULL, 'active', NULL, '2025-07-21 12:24:16', '2025-08-14 14:35:17'),
(85, 'TWIX 30X50G', NULL, '5900951313608', NULL, 22, NULL, 4, NULL, 11.00, 12.00, 12.00, 12.00, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2025-07-21 12:25:12', '2025-08-14 12:32:46'),
(86, 'BOUNTY 24X57G', NULL, '5000159558044', NULL, 22, NULL, 4, NULL, 9.50, 10.50, 12.00, 10.50, NULL, NULL, NULL, 216.00, NULL, NULL, 'active', NULL, '2025-07-21 12:28:27', '2025-08-14 12:32:46'),
(87, 'CADBURY DAIRY MILK STANDARD 22X95G £1.69', NULL, '07622202268304', NULL, 14, NULL, 15, NULL, 24.20, 25.30, 26.40, 25.30, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-07-28 15:22:46', '2025-08-13 09:39:14'),
(88, 'CADBURY DAIRY MILK CHOPPED HAZELNUT 22X95G £1.69', NULL, '07622202278464', NULL, 14, NULL, 15, NULL, 23.76, 25.30, 26.40, 25.30, NULL, NULL, NULL, 23.00, NULL, NULL, 'active', NULL, '2025-07-28 15:28:35', '2025-08-13 13:28:53'),
(89, 'KINDER CHOCOLATE 10X8PACKS £1.65', NULL, '08000500448120', NULL, 19, NULL, 16, NULL, 10.00, 11.00, 11.00, 11.00, NULL, NULL, NULL, 19.00, NULL, NULL, 'active', NULL, '2025-07-28 15:44:07', '2025-08-13 15:56:38'),
(90, 'KINDER COUNTRY 40X23.5G 50P', NULL, '08000500448045', NULL, 19, NULL, 16, NULL, 10.90, 12.50, 13.00, 12.00, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-07-28 15:48:57', '2025-08-11 20:38:11'),
(91, 'KINDER BUENO CHOCOLATE 30X43G', NULL, '8000500073698', NULL, 19, NULL, 17, NULL, 14.85, 15.50, 16.00, 15.50, NULL, NULL, NULL, 50.00, NULL, NULL, 'active', NULL, '2025-07-28 15:50:27', '2025-08-14 12:07:09'),
(92, 'KINDER BUENO WHITE 30X43G', NULL, '08000500121467', NULL, 19, NULL, 17, NULL, 14.00, 15.50, 16.00, 15.50, NULL, NULL, NULL, 58.00, NULL, NULL, 'active', NULL, '2025-07-28 15:53:31', '2025-08-13 15:56:38'),
(93, 'KINDER SURPRISE 72X20G', NULL, '8000500039106', NULL, 19, NULL, 17, NULL, 44.00, 45.00, 50.00, 46.00, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-07-28 15:54:50', '2025-08-05 09:32:58'),
(94, 'KINDER JOY BOY 24X20G', NULL, '8000500168028', NULL, 19, NULL, 17, NULL, 13.99, 15.00, 20.00, 16.00, NULL, NULL, NULL, 22.00, NULL, NULL, 'active', NULL, '2025-07-28 16:00:38', '2025-08-08 12:17:03'),
(95, 'KINDER JOY GIRL 24X20G', NULL, '8000500168042', NULL, 19, NULL, 17, NULL, 14.25, 15.00, 20.00, 16.00, NULL, NULL, NULL, 46.00, NULL, NULL, 'active', NULL, '2025-07-28 16:02:06', '2025-08-12 09:37:39'),
(96, 'KINDER HAPPY HIPPO HAZELNUT 28X20.7G', NULL, '8000500423615', NULL, 19, NULL, 17, NULL, 8.00, 8.50, 9.00, 8.50, NULL, NULL, NULL, 40.00, NULL, NULL, 'active', NULL, '2025-07-28 16:04:16', '2025-08-12 14:32:03'),
(97, 'KINDER HAPPY HIPPO KAKAO 28X20.7G', NULL, '8000500423592', NULL, 19, NULL, 17, NULL, 8.00, 8.50, 9.00, 8.50, NULL, NULL, NULL, 12.00, NULL, NULL, 'active', NULL, '2025-07-28 16:05:21', '2025-08-12 14:32:03'),
(98, 'KINDER DELICE 20X39G', NULL, '8000500449110', NULL, 19, NULL, 17, NULL, 8.00, 9.00, 9.00, 9.00, NULL, NULL, NULL, 19.00, NULL, NULL, 'active', NULL, '2025-07-28 16:06:52', '2025-08-12 14:32:03'),
(99, 'MILKA CHIPS AHOY 22X100G', NULL, '7622210741745', NULL, 25, NULL, 18, NULL, 17.16, 17.60, 18.70, 17.60, NULL, NULL, NULL, 14.00, NULL, NULL, 'active', NULL, '2025-08-01 14:46:26', '2025-08-07 09:27:29'),
(100, 'MILKA OREO SANDWICH 16X92G', NULL, '7622201720391', NULL, 25, NULL, 18, NULL, 12.48, 12.80, 13.60, 12.80, NULL, NULL, NULL, 81.00, NULL, NULL, 'active', NULL, '2025-08-01 14:49:16', '2025-08-14 12:32:46'),
(101, 'MILKA DAIM 22X100G', NULL, '7622210738936', NULL, 25, NULL, 18, NULL, 17.16, 17.60, 18.70, 17.60, NULL, NULL, NULL, 1.00, NULL, NULL, 'active', NULL, '2025-08-01 15:09:31', '2025-08-13 11:41:42'),
(102, 'MILKA CHERRY 22X100G', NULL, '7622210623300', NULL, 25, NULL, 18, NULL, 17.16, 17.60, 18.70, 18.70, NULL, NULL, NULL, 48.00, NULL, NULL, 'active', NULL, '2025-08-01 15:15:45', '2025-08-13 11:41:42'),
(103, 'MILKA OREO BROWNIE 22X100G', NULL, '7622210953414', NULL, 25, NULL, 18, NULL, 17.16, 17.60, 18.70, 17.60, NULL, NULL, NULL, 40.00, NULL, NULL, 'active', NULL, '2025-08-01 15:17:14', '2025-08-13 11:41:42'),
(104, 'MILKA OREO 22X100G', NULL, '7622210755452', NULL, 25, NULL, 18, NULL, 17.16, 17.60, 18.70, 17.60, NULL, NULL, NULL, 115.00, NULL, NULL, 'active', NULL, '2025-08-01 15:19:16', '2025-08-13 11:49:56'),
(105, 'MILKA BUBBLY 14X90G', NULL, '7622210476845', NULL, 25, NULL, 18, NULL, 10.92, 11.20, 11.90, 11.20, NULL, NULL, NULL, 29.00, NULL, NULL, 'active', NULL, '2025-08-01 15:21:53', '2025-08-04 15:16:00'),
(106, 'MILKA BUBBLY WHITE 15X95G', NULL, '7622201098490', NULL, 25, NULL, 18, NULL, 11.70, 12.00, 12.75, 12.00, NULL, NULL, NULL, 24.00, NULL, NULL, 'active', NULL, '2025-08-01 15:23:27', '2025-08-05 09:38:50'),
(107, 'MILKA STRAWBERRY 22X100G', NULL, '7622210755476', NULL, 25, NULL, 18, NULL, 17.16, 17.60, 18.70, 17.60, NULL, NULL, NULL, 63.00, NULL, NULL, 'active', NULL, '2025-08-01 15:25:07', '2025-08-13 11:41:42'),
(108, 'MILKA WHITE 24X90G', NULL, '7622202265990', NULL, 25, NULL, 18, NULL, 18.72, 19.20, 20.40, 19.20, NULL, NULL, NULL, 13.00, NULL, NULL, 'active', NULL, '2025-08-01 15:26:53', '2025-08-12 15:10:42'),
(109, 'MILKA CARAMEL 23X100G', NULL, '7622210785862', NULL, 25, NULL, 18, NULL, 17.94, 18.40, 19.55, 18.40, NULL, NULL, NULL, 35.00, NULL, NULL, 'active', NULL, '2025-08-01 15:31:24', '2025-08-11 11:59:34'),
(110, 'MILKA LU 18X87G', NULL, '7622210732941', NULL, 25, NULL, 18, NULL, 14.04, 14.40, 15.30, 14.40, NULL, NULL, NULL, 118.00, NULL, NULL, 'active', NULL, '2025-08-01 15:32:55', '2025-08-13 11:49:56'),
(111, 'MILKA ALPINE MILK 25X90G', NULL, '7622202271564', NULL, 25, NULL, 18, NULL, 19.50, 20.00, 21.25, 20.00, NULL, NULL, NULL, 89.00, NULL, NULL, 'active', NULL, '2025-08-01 15:35:05', '2025-08-14 12:32:46'),
(112, 'MILKA HAZELNUT 25X80G', NULL, '7622210723697', NULL, 25, NULL, 18, NULL, 19.50, 20.00, 21.25, 20.00, NULL, NULL, NULL, 84.00, NULL, NULL, 'active', NULL, '2025-08-01 15:37:13', '2025-08-14 12:32:46'),
(113, 'MILKA OREO WHITE 22X100G', NULL, '7622201121051', NULL, 25, NULL, 18, NULL, 17.16, 17.60, 18.70, 17.60, NULL, NULL, NULL, 43.00, NULL, NULL, 'active', NULL, '2025-08-01 15:38:32', '2025-08-04 15:16:00'),
(114, 'MILKA HAPPY COW 24X90G', NULL, '7622202257797', NULL, 25, NULL, 18, NULL, 18.72, 19.20, 20.40, 19.20, NULL, NULL, NULL, 49.00, NULL, NULL, 'active', NULL, '2025-08-01 15:41:18', '2025-08-13 11:41:42'),
(115, 'MILKA RAISIN NUT 23X90G', NULL, '7622202269776', NULL, 25, NULL, 18, NULL, 17.94, 18.40, 19.55, 18.40, NULL, NULL, NULL, 48.00, NULL, NULL, 'active', NULL, '2025-08-01 15:43:15', '2025-08-14 12:32:46'),
(116, 'MILKA TUC 18X87G', NULL, '7622210732958', NULL, 25, NULL, 18, NULL, 14.04, 14.40, 15.30, 14.40, NULL, NULL, NULL, 45.00, NULL, NULL, 'active', NULL, '2025-08-01 15:44:53', '2025-08-13 11:49:56'),
(117, 'MILKA WHOLE HAZENUT 17X95G', NULL, '7622202257582', NULL, 25, NULL, 18, NULL, 13.26, 13.60, 14.45, 13.60, NULL, NULL, NULL, 81.00, NULL, NULL, 'active', NULL, '2025-08-01 15:46:16', '2025-08-14 12:32:46'),
(118, 'BOUNTY TRIO 24X2.5G', NULL, '5000159381161', NULL, 22, NULL, 4, NULL, 19.00, 21.00, 24.00, 21.00, NULL, NULL, NULL, 106.00, NULL, NULL, 'active', NULL, '2025-08-01 15:59:43', '2025-08-13 16:09:41'),
(119, 'RAFFAELLO T4 16X40G', NULL, '5413548040646', NULL, 20, NULL, 17, NULL, 10.00, 10.50, 12.50, 10.50, NULL, NULL, NULL, 38.00, NULL, NULL, 'active', NULL, '2025-08-01 16:03:00', '2025-08-13 09:39:14'),
(120, 'FERRERO ROCHER 16X37.5G', NULL, '08000500047873', NULL, 20, NULL, 17, NULL, 13.00, 13.50, 14.00, 13.50, NULL, NULL, NULL, 4.00, NULL, NULL, 'active', NULL, '2025-08-01 16:06:04', '2025-08-13 15:25:29'),
(121, 'M&M PEANUT 24X45G', NULL, '5000159460293', NULL, 16, NULL, 4, NULL, 9.75, 10.50, 11.00, 10.50, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-08-01 16:07:54', '2025-08-12 14:01:10'),
(122, 'M&M CHOCOLATE 24X45G', NULL, '5900951240300', NULL, 16, NULL, 4, NULL, 9.00, 10.00, 11.00, 10.00, NULL, NULL, NULL, 153.00, NULL, NULL, 'active', NULL, '2025-08-01 16:08:38', '2025-08-14 12:32:46'),
(123, 'M&M CRISPY 24X45G', NULL, '5000159561679', NULL, 16, NULL, 4, NULL, 10.00, 11.00, 11.50, 11.00, NULL, NULL, NULL, 120.00, NULL, NULL, 'active', NULL, '2025-08-01 16:09:29', '2025-08-13 13:28:53'),
(124, 'SMARTIES 24X38G', NULL, '7613039199626', NULL, 13, NULL, 11, NULL, 10.00, 10.50, 11.50, 10.50, NULL, NULL, NULL, 156.00, NULL, NULL, 'active', NULL, '2025-08-01 16:10:58', '2025-08-14 12:32:46'),
(125, 'EAZY POPCORN SWEET 16X85G', NULL, '5023751000759', NULL, 16, NULL, NULL, NULL, 5.00, 5.50, 6.00, 5.50, NULL, NULL, NULL, 2.00, NULL, NULL, 'active', NULL, '2025-08-01 16:12:27', '2025-08-11 14:47:39'),
(126, 'EAZY POPCORN SALTED 16X85G', NULL, '5023751000735', NULL, 16, NULL, NULL, NULL, 5.00, 5.50, 6.00, 5.50, NULL, NULL, NULL, 15.00, NULL, NULL, 'active', NULL, '2025-08-01 16:13:17', '2025-08-13 11:49:56'),
(127, 'EAZY POPCORN BUTTER 16X85G', NULL, '5023751000773', NULL, 16, NULL, NULL, NULL, 5.00, 5.50, 6.00, 5.50, NULL, NULL, NULL, 36.00, NULL, NULL, 'active', NULL, '2025-08-01 16:13:57', '2025-08-13 11:49:56'),
(128, 'EAZY POPCORN SWEET&SALTY 16X85G', NULL, '5023751000797', NULL, 16, NULL, NULL, NULL, 5.00, 5.50, 6.00, 5.50, NULL, NULL, NULL, 3.00, NULL, NULL, 'active', NULL, '2025-08-01 16:14:39', '2025-08-11 12:07:01'),
(129, 'HARIBO MARSHMALLOW 24X70G', NULL, '8691216107427', NULL, 23, NULL, 19, NULL, 13.50, 14.50, 15.00, 15.00, NULL, NULL, NULL, 8.00, NULL, NULL, 'active', NULL, '2025-08-01 16:16:57', '2025-08-04 17:23:24'),
(130, 'HARIBO BLUE CHERRIES 30X100G', NULL, '4001686006115', NULL, 23, NULL, 19, NULL, 16.25, 17.50, 18.75, 17.50, NULL, NULL, NULL, 49.00, NULL, NULL, 'active', NULL, '2025-08-01 16:20:12', '2025-08-12 14:53:53'),
(131, 'HARIBO HAPPY COLA 30X100G', NULL, '4001686006092', NULL, 23, NULL, 19, NULL, 16.87, 18.12, 18.75, 18.12, NULL, NULL, NULL, 3.00, NULL, NULL, 'active', NULL, '2025-08-01 16:21:23', '2025-08-05 09:32:12'),
(132, 'HARIBO BLUE  STRAWBERRY 18X80G', NULL, '4001686006214', NULL, 23, NULL, 19, NULL, 10.12, 10.90, 11.25, 10.90, NULL, NULL, NULL, 62.00, NULL, NULL, 'active', NULL, '2025-08-01 16:22:50', '2025-08-13 11:49:56'),
(133, 'HARIBO BLUE CROCO 18X80G', NULL, '4001686006054', NULL, 23, NULL, 19, NULL, 9.75, 10.80, 11.25, 10.80, NULL, NULL, NULL, 67.00, NULL, NULL, 'active', NULL, '2025-08-01 16:24:17', '2025-08-13 11:49:56'),
(134, 'HARIBO BLUE PEACH 24X100G', NULL, '4001686006153', NULL, 23, NULL, 19, NULL, 13.50, 14.50, 15.00, 14.00, NULL, NULL, NULL, 38.00, NULL, NULL, 'active', NULL, '2025-08-01 16:25:09', '2025-08-13 11:49:56'),
(135, 'HARIBO BLUE QUAXI 24X100G', NULL, '9002975000840', NULL, 23, NULL, 19, NULL, 13.50, 14.50, 15.00, 14.50, NULL, NULL, NULL, 35.00, NULL, NULL, 'active', NULL, '2025-08-01 16:25:49', '2025-08-08 14:42:05'),
(136, 'HARIBO POMMERS SOURS 24X100G', NULL, '9002975000857', NULL, 23, NULL, 19, NULL, 13.50, 14.50, 15.00, 14.50, NULL, NULL, NULL, 6.00, NULL, NULL, 'active', NULL, '2025-08-01 16:26:52', '2025-08-08 14:42:05'),
(137, 'HARIBO BLUE KINDER SCHNULLER 24X100G', NULL, '9002975000888', NULL, 23, NULL, 19, NULL, 13.00, 14.50, 15.00, 14.50, NULL, NULL, NULL, 24.00, NULL, NULL, 'active', NULL, '2025-08-01 16:27:48', '2025-08-08 14:42:05'),
(138, 'HARIBO BLUE  HAPPY COLA SOUR 24X100G', NULL, '4001686006191', NULL, 23, NULL, 19, NULL, 13.50, 14.50, 15.00, 14.50, NULL, NULL, NULL, 49.00, NULL, NULL, 'active', NULL, '2025-08-01 16:28:25', '2025-08-13 11:49:56'),
(139, 'HARIBO EKSIL LIKIRR 24X70G', NULL, '8691216102590', NULL, 24, NULL, 19, NULL, 9.50, 10.50, 12.00, 10.50, NULL, NULL, NULL, 27.00, NULL, NULL, 'active', NULL, '2025-08-01 16:29:32', '2025-08-08 14:42:05'),
(140, 'HARIBO TROPIFRUTTI 24X80G', NULL, '8691216042100', NULL, 24, NULL, 19, NULL, 9.50, 10.50, 12.00, 10.50, NULL, NULL, NULL, 5.00, NULL, NULL, 'active', NULL, '2025-08-01 16:30:32', '2025-08-13 11:49:56'),
(141, 'HARIBO WORMS 24X80G', NULL, '8691216026025', NULL, 24, NULL, 19, NULL, 9.50, 10.50, 12.00, 10.50, NULL, NULL, NULL, 1.00, NULL, NULL, 'active', NULL, '2025-08-01 16:31:21', '2025-08-12 14:53:53'),
(142, 'HARIBO PHANTASIA 24X80G', NULL, '8691216016989', NULL, 24, NULL, 19, NULL, 9.50, 10.50, 12.00, 10.50, NULL, NULL, NULL, 3.00, NULL, NULL, 'active', NULL, '2025-08-01 16:32:06', '2025-08-12 14:53:53'),
(143, 'HARIBO HAPPY COLA 30X80G', NULL, '8691216095816', NULL, 24, NULL, 19, NULL, 9.50, 10.50, 12.00, 10.50, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-08-01 16:32:47', '2025-08-12 14:53:53'),
(144, 'HARIBO GOLDBEARS 12X154G £1.25', NULL, '05012035998127', NULL, 23, NULL, 19, NULL, 7.50, 8.50, 9.00, 8.50, NULL, NULL, NULL, 6.00, NULL, NULL, 'active', NULL, '2025-08-02 09:05:43', '2025-08-13 15:56:38'),
(145, 'HARIBO GIANT STRAWBERRY 12X154G £1.25', NULL, '05012035971922', NULL, 23, NULL, 19, NULL, 7.50, 8.50, 9.00, 8.50, NULL, NULL, NULL, 9.00, NULL, NULL, 'active', NULL, '2025-08-02 09:06:38', '2025-08-13 15:56:38'),
(146, 'HARIBO STARMIX 12X140G £1.25', NULL, '05012035972042', NULL, 23, NULL, 19, NULL, 7.50, 8.50, 9.00, 8.50, NULL, NULL, NULL, 10.00, NULL, NULL, 'active', NULL, '2025-08-02 09:08:01', '2025-08-13 15:56:38'),
(147, 'HARIBO SOUR SPARKS 12X140G £1.25', NULL, '05012035972219', NULL, 23, NULL, 19, NULL, 7.50, 8.50, 9.00, 8.50, NULL, NULL, NULL, 3.00, NULL, NULL, 'active', NULL, '2025-08-02 09:08:54', '2025-08-12 09:37:39'),
(148, 'HARIBO TANGFASTICS 12X140G £1.25', NULL, '05012035972080', NULL, 23, NULL, 19, NULL, 7.50, 8.50, 9.00, 8.50, NULL, NULL, NULL, 1.00, NULL, NULL, 'active', NULL, '2025-08-02 09:09:52', '2025-08-13 09:39:14'),
(149, 'HARIBO RAINBOW STRIPES 12X143G £1.25', NULL, '05012035972691', NULL, 23, NULL, 19, NULL, 7.50, 8.50, 9.00, 8.50, NULL, NULL, NULL, 1.00, NULL, NULL, 'active', NULL, '2025-08-02 09:15:21', '2025-08-13 15:56:38'),
(150, 'HARIBO SUPERMIX 12X140G £1.25', NULL, '05012035972059', NULL, 23, NULL, 19, NULL, 7.50, 8.50, 9.00, 8.50, NULL, NULL, NULL, 27.00, NULL, NULL, 'active', NULL, '2025-08-02 09:16:27', '2025-08-07 09:11:09'),
(151, 'HARIBO BALLA BITES12X154G £1.25', NULL, '05012035972677', NULL, 23, NULL, 19, NULL, 7.50, 8.50, 9.00, 8.50, NULL, NULL, NULL, 2.00, NULL, NULL, 'active', NULL, '2025-08-02 09:17:23', '2025-08-13 15:56:38'),
(152, 'HARIBO MARSHMALLOW 12X140G £1.25', NULL, '05012035972172', NULL, 23, NULL, 19, NULL, 7.50, 8.50, 9.00, 8.50, NULL, NULL, NULL, 15.00, NULL, NULL, 'active', NULL, '2025-08-02 09:18:32', '2025-08-13 09:39:14'),
(153, 'AERO HAZELNUT BLOCKS 15X90G £1.50', NULL, '08445291528277', NULL, 13, NULL, 11, NULL, 13.63, 15.00, 16.00, 15.00, NULL, NULL, NULL, 34.00, NULL, NULL, 'active', NULL, '2025-08-02 09:24:18', '2025-08-13 15:56:38'),
(154, 'AERO COCONUT BLOCKS 15X90G £1.50', NULL, '08445291607446', NULL, 13, NULL, 11, NULL, 13.63, 15.00, 16.00, 15.00, NULL, NULL, NULL, 37.00, NULL, NULL, 'active', NULL, '2025-08-02 09:25:08', '2025-08-13 15:56:38'),
(155, 'AERO MILK CHOCOLATE BLOCKS 15X90G £1.50', NULL, '08445291528253', NULL, 13, NULL, 11, NULL, 13.63, 15.00, 16.00, 15.00, NULL, NULL, NULL, 44.00, NULL, NULL, 'active', NULL, '2025-08-02 09:26:07', '2025-08-14 12:07:09'),
(156, 'MILKYBAR MEDIUM 40X25G', NULL, '08000300430332', NULL, 13, NULL, 11, NULL, 18.60, 20.00, 21.00, 20.00, NULL, NULL, NULL, 337.00, NULL, NULL, 'active', NULL, '2025-08-02 09:27:23', '2025-08-14 07:58:36'),
(157, 'KINDER CARDS 30X25.6G', NULL, '8000500290897', NULL, 19, NULL, 17, NULL, 11.00, 12.50, 13.50, 12.50, NULL, NULL, NULL, 3.00, NULL, NULL, 'active', NULL, '2025-08-02 09:31:31', '2025-08-06 14:42:58'),
(158, 'NUTELLA BISCUITS T3 28X41.4G', NULL, '8000500380642', NULL, 20, NULL, 17, NULL, 11.00, 12.50, 13.50, 12.50, NULL, NULL, NULL, 43.00, NULL, NULL, 'active', NULL, '2025-08-02 09:33:11', '2025-08-14 12:32:46'),
(159, 'KINDER CRISPY 14X34G', NULL, '08000500434130', NULL, 19, NULL, 17, NULL, 9.00, 10.00, 11.00, 10.00, NULL, NULL, NULL, 2.00, NULL, NULL, 'active', NULL, '2025-08-02 09:34:32', '2025-08-08 09:26:11'),
(160, 'RAFFAELLO T15 6X150G', NULL, '8000500045121', NULL, 20, NULL, 17, NULL, 13.50, 14.50, 15.00, 14.50, NULL, NULL, NULL, 4.00, NULL, NULL, 'active', NULL, '2025-08-02 09:59:09', '2025-08-08 17:35:01'),
(161, 'WERTHERS ORIGINAL CARAMEL BITES CRUNCHIE 12X140G', NULL, '4014400176049', NULL, 16, NULL, NULL, NULL, 22.32, 23.50, 24.00, 23.50, NULL, NULL, NULL, 7.00, NULL, NULL, 'active', NULL, '2025-08-02 10:02:10', '2025-08-14 12:07:09'),
(162, 'WERTHERS ORIGINAL CARAMEL BITES COOKIE 16X140G', NULL, '4014400176056', NULL, 16, NULL, NULL, NULL, 29.76, 30.50, 32.00, 30.50, NULL, NULL, NULL, 7.00, NULL, NULL, 'active', NULL, '2025-08-02 10:03:23', '2025-08-14 12:07:09'),
(163, 'KINDER JOY 72X20G', NULL, '8000500024591', NULL, 19, NULL, 17, NULL, 54.00, 57.00, 60.00, 57.00, NULL, NULL, NULL, 5.00, NULL, NULL, 'active', NULL, '2025-08-02 10:04:56', '2025-08-13 09:39:14'),
(164, 'GIOTTO HAZELNUT 9X154G', NULL, '8000500317006', NULL, 20, NULL, 17, NULL, 22.00, 24.00, 25.00, 24.00, NULL, NULL, NULL, 7.00, NULL, NULL, 'active', NULL, '2025-08-02 10:49:53', '2025-08-13 14:09:42'),
(165, 'GIOTTO HAZELNUT 10X43G', NULL, '8000500319482', NULL, 20, NULL, 17, NULL, 9.00, 10.00, 10.00, 10.00, NULL, NULL, NULL, 4.00, NULL, NULL, 'active', NULL, '2025-08-02 10:50:56', '2025-08-05 15:15:46'),
(166, 'SNICKER BRAZIL WHITE 20X42G', NULL, '7896423488876', NULL, 16, NULL, 4, NULL, 12.00, 13.00, 15.00, 13.00, NULL, NULL, NULL, 120.00, NULL, NULL, 'active', NULL, '2025-08-02 11:01:51', '2025-08-13 11:22:56'),
(167, 'SNICKER BRAZIL STRAWBERRY 20X42G', NULL, '7896423445893', NULL, 16, NULL, 4, NULL, 12.00, 13.00, 14.00, 13.00, NULL, NULL, NULL, 153.00, NULL, NULL, 'active', NULL, '2025-08-02 11:03:04', '2025-08-12 15:10:43'),
(168, 'SNICKER BRAZIL DARK 20X42G', NULL, '7896423481860', NULL, 16, NULL, 4, NULL, 12.00, 13.00, 14.00, 13.00, NULL, NULL, NULL, 87.00, NULL, NULL, 'active', NULL, '2025-08-02 11:03:49', '2025-08-08 11:12:50'),
(169, 'SNICKER BRAZIL PEANUT BRITTLE 20X42G', NULL, '7896423497991', NULL, 16, NULL, 4, NULL, 12.00, 13.00, 14.00, 13.00, NULL, NULL, NULL, 76.00, NULL, NULL, 'active', NULL, '2025-08-02 11:04:46', '2025-08-08 11:12:50'),
(170, 'TWIX BRAZIL STRAWBERRY 18X40G', NULL, '7896423438543', NULL, 16, NULL, 4, NULL, 12.00, 13.00, 14.00, 13.00, NULL, NULL, NULL, 98.00, NULL, NULL, 'active', NULL, '2025-08-02 11:05:57', '2025-08-04 09:54:05'),
(171, 'TWIX BRAZIL LEMON 18X40G', NULL, '7896423438567', NULL, 16, NULL, 4, NULL, 12.00, 13.00, 14.00, 13.00, NULL, NULL, NULL, 98.00, NULL, NULL, 'active', NULL, '2025-08-02 11:07:04', '2025-08-11 20:40:32'),
(172, 'NESCAFE COFFEE 6X133G', NULL, '08445291157729', NULL, 13, NULL, 11, NULL, 7.50, 8.50, 8.50, 8.50, NULL, NULL, NULL, 90.00, NULL, NULL, 'active', NULL, '2025-08-02 11:08:25', '2025-08-05 08:40:35'),
(173, 'REDBULL AUSTRIA 24X250ML', NULL, '9002490100094', NULL, 15, NULL, 9, NULL, 18.50, 19.50, 20.00, 19.50, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-08-02 11:12:09', '2025-08-08 08:03:11'),
(174, 'REDBULL  24X250ML £1.65', NULL, '09002490280284', NULL, 15, NULL, 9, NULL, 21.00, 22.00, 23.00, 22.00, NULL, NULL, NULL, 574.00, NULL, NULL, 'active', NULL, '2025-08-02 11:13:22', '2025-08-13 15:56:38'),
(175, 'MIRINDA APPLE 12X500ML', NULL, '6111252420424', NULL, 15, NULL, 12, NULL, 6.50, 7.50, 8.00, 7.50, NULL, NULL, NULL, 19.00, NULL, NULL, 'active', NULL, '2025-08-02 11:15:03', '2025-08-06 13:04:23'),
(176, 'MIRINDA LEMON 12X500ML', NULL, '6111252420509', NULL, 15, NULL, 12, NULL, 6.50, 7.50, 8.00, 7.50, NULL, NULL, NULL, 14.00, NULL, NULL, 'active', NULL, '2025-08-02 11:15:48', '2025-08-11 13:46:00'),
(177, 'COKE EU 6X1.75LT', NULL, '5449000152268', NULL, 15, NULL, 13, NULL, 6.15, 7.00, 7.50, 7.00, NULL, NULL, NULL, 814.00, NULL, NULL, 'active', NULL, '2025-08-02 11:17:18', '2025-08-14 14:35:17'),
(178, 'BOOST CAN 24X250ML 75P', NULL, '15056079901139', NULL, 15, NULL, 9, NULL, 6.50, 7.00, 7.50, 7.00, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-08-02 11:21:20', '2025-08-14 12:19:40'),
(179, 'MR. BROWNIE COCONUT 12X50G', NULL, '8411037884679', NULL, 22, NULL, NULL, NULL, 3.75, 4.50, 5.00, 4.50, NULL, NULL, NULL, 67.00, NULL, NULL, 'active', NULL, '2025-08-02 11:23:48', '2025-08-13 15:56:38'),
(180, 'MR. BROWNIE GALACTIC 12X50G', NULL, '8411037884549', NULL, 22, NULL, NULL, NULL, 3.75, 4.50, 5.00, 4.50, NULL, NULL, NULL, 58.00, NULL, NULL, 'active', NULL, '2025-08-02 11:24:42', '2025-08-13 15:56:38'),
(181, 'MR. BROWNIE BLONDIES 12X50G', NULL, '8411037885126', NULL, 22, NULL, NULL, NULL, 3.75, 4.50, 5.00, 4.50, NULL, NULL, NULL, 59.00, NULL, NULL, 'active', NULL, '2025-08-02 11:25:26', '2025-08-13 15:56:38'),
(182, 'MR. BROWNIE LEMON 12X50G', NULL, '667342800431', NULL, 22, NULL, NULL, NULL, 3.75, 4.50, 5.00, 4.50, NULL, NULL, NULL, 79.00, NULL, NULL, 'active', NULL, '2025-08-02 11:26:07', '2025-08-13 15:56:38'),
(183, 'MR. BROWNIE CHOCOLATE 12X50G', NULL, '8411037885119', NULL, 22, NULL, NULL, NULL, 3.75, 4.50, 5.00, 4.50, NULL, NULL, NULL, 51.00, NULL, NULL, 'active', NULL, '2025-08-02 11:26:50', '2025-08-13 09:49:48'),
(184, 'M&M POPCORN 18X35G', NULL, '7896423442571', NULL, 8, NULL, 4, NULL, 12.00, 13.00, 14.00, 13.00, NULL, NULL, NULL, 58.00, NULL, NULL, 'active', NULL, '2025-08-02 11:28:19', '2025-08-12 15:10:43'),
(185, 'EXTRA BOTTLE BUBBLEMINT 6X46PCS £2.50', NULL, '4009900550772', NULL, 21, NULL, 20, NULL, 7.50, 8.50, 9.00, 8.50, NULL, NULL, NULL, 74.00, NULL, NULL, 'active', NULL, '2025-08-02 11:30:19', '2025-08-12 13:37:34'),
(186, 'EXTRA BOTTLE STRAWBERRY 6X46PCS £2.50', NULL, '4009900550819', NULL, 21, NULL, 20, NULL, 7.50, 8.50, 9.00, 8.50, NULL, NULL, NULL, 210.00, NULL, NULL, 'active', NULL, '2025-08-02 11:47:27', '2025-08-13 16:09:41'),
(187, 'EXTRA BOTTLE SPEARMINT 6X46PCS £2.50', NULL, '4009900550888', NULL, 21, NULL, 20, NULL, 7.50, 8.50, 9.00, 8.50, NULL, NULL, NULL, 84.00, NULL, NULL, 'active', NULL, '2025-08-02 11:48:27', '2025-08-13 16:09:41'),
(188, 'EXTRA BOTTLE COOLBREEZE 6X46PCS', NULL, '4009900550956', NULL, 21, NULL, 20, NULL, 7.50, 8.50, 9.00, 8.50, NULL, NULL, NULL, 5.00, NULL, NULL, 'active', NULL, '2025-08-02 11:49:42', '2025-08-12 13:37:34'),
(189, 'AIRWAVES BOTTLE MENTHOL EUCALYPTUS 6X46PCS £2.50', NULL, '4009900550758', NULL, 21, NULL, 20, NULL, 7.50, 8.50, 9.00, 8.50, NULL, NULL, NULL, 201.00, NULL, NULL, 'active', NULL, '2025-08-02 11:51:06', '2025-08-12 13:37:34'),
(190, 'EXTRA BLUEBERRY 30X14G', NULL, '4009900436076', NULL, 21, NULL, 20, NULL, 5.00, 7.00, 8.00, 7.00, NULL, NULL, NULL, 110.00, NULL, NULL, 'active', NULL, '2025-08-02 11:52:54', '2025-08-13 09:39:14'),
(191, 'EXTRA STRAWBERRY 30X14G', NULL, '4009900394925', NULL, 21, NULL, 20, NULL, 8.70, 11.50, 12.00, 11.50, NULL, NULL, NULL, 36.00, NULL, NULL, 'active', NULL, '2025-08-02 11:54:07', '2025-08-14 12:07:09'),
(192, 'EXTRA SPEARMINT 30X14G', NULL, '4009900014076', NULL, 21, NULL, 20, NULL, 8.50, 10.00, 10.50, 10.00, NULL, NULL, NULL, 166.00, NULL, NULL, 'active', NULL, '2025-08-02 11:54:59', '2025-08-13 10:29:06'),
(193, 'EXTRA ICE WHITE 30X14G', NULL, '4009900458047', NULL, 21, NULL, 20, NULL, 8.50, 10.00, 11.50, 10.00, NULL, NULL, NULL, 210.00, NULL, NULL, 'active', NULL, '2025-08-02 11:55:56', '2025-08-13 09:39:14'),
(194, 'EXTRA ICE SPEARMINT 30X14G', NULL, '04009900458061', NULL, 21, NULL, 20, NULL, 8.50, 11.50, 11.50, 11.50, NULL, NULL, NULL, 1.00, NULL, NULL, 'active', NULL, '2025-08-02 11:57:03', '2025-08-13 10:29:06'),
(195, 'EXTRA PEPPERMINT 30X14G', NULL, '4009900001823', NULL, 21, NULL, 20, NULL, 8.50, 10.00, 10.50, 10.00, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-08-02 11:58:19', '2025-08-12 09:37:39'),
(196, 'LOCKETS EXTRA STRONG 20X41G', NULL, '5000159340175', NULL, 18, NULL, 4, NULL, 8.50, 9.50, 9.50, 9.50, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-08-02 12:00:35', '2025-08-11 10:56:24'),
(197, 'LOCKETS HONEY&LEMON 20X41G', NULL, '5000159340168', NULL, 18, NULL, 4, NULL, 8.50, 9.50, 9.50, 9.50, NULL, NULL, NULL, 517.00, NULL, NULL, 'active', NULL, '2025-08-02 12:01:25', '2025-08-13 09:39:14'),
(198, 'JUICY FRUIT 30X10PCS', NULL, '6161115860171', NULL, 21, NULL, 20, NULL, 8.50, 9.60, 11.00, 9.60, NULL, NULL, NULL, 1497.00, NULL, NULL, 'active', NULL, '2025-08-02 12:02:41', '2025-08-12 11:24:43'),
(199, 'HUBBA BUBBA FANCY FRUIT TAP 12X56G', NULL, '4009900379571', NULL, 21, NULL, 20, NULL, 8.86, 9.50, 9.50, 9.50, NULL, NULL, NULL, 196.00, NULL, NULL, 'active', NULL, '2025-08-02 12:05:28', '2025-08-13 11:49:56'),
(200, 'HUBBA BUBBA STRAWBERRY TAP 12X56G', NULL, '4009900381338', NULL, 21, NULL, 20, NULL, 8.86, 9.50, 9.50, 9.50, NULL, NULL, NULL, 435.00, NULL, NULL, 'active', NULL, '2025-08-02 12:06:24', '2025-08-13 09:18:17'),
(201, 'MR. TOM PEANUT BARS 36x40G', NULL, '4021700800055', NULL, 22, NULL, NULL, NULL, 8.50, 10.00, 10.00, 9.50, NULL, NULL, NULL, 525.00, NULL, NULL, 'active', NULL, '2025-08-02 21:30:24', '2025-08-14 12:07:09'),
(202, 'TWIX 25X50G', NULL, '5000159559508', NULL, 18, NULL, 4, NULL, 9.00, 10.00, 10.50, 10.00, NULL, NULL, NULL, 225.00, NULL, NULL, 'active', NULL, '2025-08-03 15:49:39', '2025-08-13 15:25:29'),
(203, 'MENTOS MINTS 40 ROLLS', NULL, NULL, NULL, 16, NULL, NULL, NULL, 12.60, 13.00, 13.50, 13.00, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2025-08-03 17:23:53', '2025-08-03 17:23:53'),
(204, 'MENTOS RAINBOW 40 ROLLS', NULL, '8723400755432', NULL, 16, NULL, NULL, NULL, 12.60, 13.00, 13.50, 13.00, NULL, NULL, NULL, 427.00, NULL, NULL, 'active', NULL, '2025-08-03 17:24:47', '2025-08-13 11:49:56'),
(205, 'MENTOS FRUITS 40 ROLLS', NULL, '8710800955562', NULL, 16, NULL, NULL, NULL, 12.60, 13.00, 13.50, 13.00, NULL, NULL, NULL, 882.00, NULL, NULL, 'active', NULL, '2025-08-03 17:25:27', '2025-08-13 09:39:14'),
(206, 'MENTOS DISCOVERY 40 ROOLS', NULL, '8723400828303', NULL, 16, NULL, NULL, NULL, 12.60, 13.00, 13.50, 13.00, NULL, NULL, NULL, 275.00, NULL, NULL, 'active', NULL, '2025-08-03 17:26:19', '2025-08-11 14:57:48'),
(207, 'MENTOS FANTA 40 ROLLS', NULL, '8723400795766', NULL, 16, NULL, NULL, NULL, 12.60, 13.00, 13.50, 13.00, NULL, NULL, NULL, 343.00, NULL, NULL, 'active', NULL, '2025-08-03 17:27:00', '2025-08-13 11:41:42'),
(208, 'MENTOS SPERMINT 40 ROLLS', NULL, '8710800955586', NULL, 16, NULL, NULL, NULL, 12.60, 13.00, 14.00, 13.00, NULL, NULL, NULL, 459.00, NULL, NULL, 'active', NULL, '2025-08-03 17:27:44', '2025-08-13 09:39:14'),
(209, 'HALLS EXTRA STRONG 20X33.5G', NULL, '5010455601078', NULL, 16, NULL, 18, NULL, 6.75, 7.50, 7.50, 7.50, NULL, NULL, NULL, 158.00, NULL, NULL, 'active', NULL, '2025-08-04 08:13:08', '2025-08-14 12:32:46'),
(210, 'HALLS LIME 20X33.5G', NULL, '6924513905727', NULL, 16, NULL, 18, NULL, 6.90, 7.50, 7.50, 7.50, NULL, NULL, NULL, 74.00, NULL, NULL, 'active', NULL, '2025-08-04 08:14:11', '2025-08-14 12:32:46'),
(211, 'HALLS CHERRY 20X33.5G', NULL, '7622210634269', NULL, 16, NULL, 18, NULL, 6.90, 7.50, 7.50, 7.50, NULL, NULL, NULL, 47.00, NULL, NULL, 'active', NULL, '2025-08-04 08:15:19', '2025-08-12 11:24:43'),
(212, 'HALLS BLUEBERRY 20X33.5G', NULL, '6924513906601', NULL, 16, NULL, 18, NULL, 6.90, 7.50, 7.50, 7.50, NULL, NULL, NULL, 31.00, NULL, NULL, 'active', NULL, '2025-08-04 08:16:24', '2025-08-05 08:12:13'),
(213, 'HALLS HONEY 20X33.5G', NULL, '5010455601023', NULL, 16, NULL, 18, NULL, 6.90, 7.50, 7.50, 7.50, NULL, NULL, NULL, 143.00, NULL, NULL, 'active', NULL, '2025-08-04 08:17:29', '2025-08-12 11:24:43'),
(214, 'HALLS COLA 20X33.5G', NULL, '7622201712679', NULL, 16, NULL, 18, NULL, 6.90, 7.50, 7.50, 7.50, NULL, NULL, NULL, 40.00, NULL, NULL, 'active', NULL, '2025-08-04 08:18:39', '2025-08-04 08:18:39'),
(215, 'KITKAT CHUNKY WHITE 24X40G', NULL, '3800020436707', NULL, 13, NULL, 11, NULL, 9.50, 10.50, 11.50, 10.50, NULL, NULL, NULL, 15.00, NULL, NULL, 'active', NULL, '2025-08-04 08:43:33', '2025-08-13 16:09:41'),
(216, 'HALLS COLOUR FRUIT 20X33.5G', NULL, '7622201709648', NULL, 16, NULL, 18, NULL, 6.90, 7.50, 7.50, 7.50, NULL, NULL, NULL, 10.00, NULL, NULL, 'active', NULL, '2025-08-04 08:53:38', '2025-08-12 15:10:43'),
(217, 'HALLS WATERMELON 20X33.5G', NULL, '7622210642530', NULL, 16, NULL, 18, NULL, 6.90, 7.50, 7.50, 7.50, NULL, NULL, NULL, 125.00, NULL, NULL, 'active', NULL, '2025-08-04 08:54:38', '2025-08-11 20:40:55'),
(218, 'HALLS FOREST FRUIT 20X33.5G', NULL, '5010455601030', NULL, 16, NULL, 18, NULL, 6.90, 7.50, 7.50, 7.50, NULL, NULL, NULL, 4.00, NULL, NULL, 'active', NULL, '2025-08-04 08:55:44', '2025-08-04 08:55:44'),
(219, 'HALLS COOLWAVE 20X33.5G', NULL, '5010455601016', NULL, 16, NULL, 18, NULL, 6.90, 7.50, 7.50, 7.50, NULL, NULL, NULL, 89.00, NULL, NULL, 'active', NULL, '2025-08-04 08:56:38', '2025-08-14 12:32:46'),
(220, 'HALLS SOOTHERS BLACKCURRENT 20X45G', NULL, '05010455064149', NULL, 21, NULL, 18, NULL, 8.00, 9.50, 10.00, 9.50, NULL, NULL, NULL, 214.00, NULL, NULL, 'active', NULL, '2025-08-04 09:18:12', '2025-08-12 11:24:43'),
(221, 'ORBIT WHITE BUBBLEMINT 30X10PCS', NULL, '4009900542890', NULL, 21, NULL, 4, NULL, 8.75, 10.00, 11.00, 10.00, NULL, NULL, NULL, 47.00, NULL, NULL, 'active', NULL, '2025-08-04 10:22:41', '2025-08-14 12:32:46'),
(222, 'AIRWAVES XTREME BLUE 30X10PCS', NULL, '4009900454681', NULL, 21, NULL, 4, NULL, 8.75, 10.00, 11.00, 10.00, NULL, NULL, NULL, 80.00, NULL, NULL, 'active', NULL, '2025-08-04 10:24:03', '2025-08-14 12:32:46'),
(223, 'AIRWAVES COOL CASIS 30X10PCS', NULL, '4009900376570', NULL, 21, NULL, 4, NULL, 8.75, 10.00, 11.00, 10.00, NULL, NULL, NULL, 22.00, NULL, NULL, 'active', NULL, '2025-08-04 10:25:03', '2025-08-14 12:32:46'),
(224, 'MAGICSTAR 36X33G', NULL, '5900951313141', NULL, 16, NULL, 4, NULL, 22.00, 23.00, 24.00, 23.00, NULL, NULL, NULL, 17.00, NULL, NULL, 'active', NULL, '2025-08-04 12:51:32', '2025-08-13 15:56:38'),
(225, 'ORBIT MELON 30X14G', NULL, '4009900402484', NULL, 16, NULL, NULL, NULL, 8.75, 12.00, 11.00, 9.48, NULL, NULL, NULL, 62.00, NULL, NULL, 'active', NULL, '2025-08-04 14:06:11', '2025-08-14 12:07:09'),
(226, 'EXTRA ICE BUBBLEMINT 30X14G', NULL, '4009900480192', NULL, NULL, NULL, NULL, NULL, 8.75, 12.00, 12.00, 11.50, NULL, NULL, NULL, 51.00, NULL, NULL, 'active', NULL, '2025-08-04 15:55:21', '2025-08-13 15:56:38'),
(227, 'AIRWAVES MENTHOL BLUE 30X14G', NULL, '4009900022170', NULL, 21, NULL, 4, NULL, 8.75, 10.51, 10.50, 10.50, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', NULL, '2025-08-04 16:27:35', '2025-08-13 10:29:06'),
(228, 'BOOST ORANGE 89P', NULL, '05000382123620', NULL, 15, NULL, NULL, NULL, 4.50, 5.50, 5.50, 5.50, NULL, NULL, NULL, 124.00, NULL, NULL, 'active', NULL, '2025-08-04 17:13:23', '2025-08-13 15:56:38'),
(229, 'LUCOZADE ORANGE 12X900ML £2', NULL, '05054267503069', NULL, 15, NULL, NULL, NULL, 12.00, 14.00, 14.00, 14.00, NULL, NULL, NULL, 29.00, NULL, NULL, 'active', 0.00, '2025-08-04 17:14:37', '2025-08-14 12:43:00'),
(230, 'PERRIER WATER 24X330ML', NULL, '3179732351517', NULL, 15, NULL, NULL, NULL, 12.00, 14.00, 14.00, 14.00, NULL, NULL, NULL, 74.00, NULL, NULL, 'active', NULL, '2025-08-04 17:16:49', '2025-08-08 13:25:56'),
(231, 'PERRIER WATER 12X750ML', NULL, '131179730011151', NULL, 15, NULL, NULL, NULL, 9.60, 12.00, 12.00, 11.00, NULL, NULL, NULL, 73.00, NULL, NULL, 'active', NULL, '2025-08-04 17:17:48', '2025-08-08 13:25:56'),
(232, 'TICTAC MINT 24X18G', NULL, '8000500036310', NULL, NULL, NULL, NULL, NULL, 8.75, 10.00, 10.00, 9.50, NULL, NULL, NULL, 99.00, NULL, NULL, 'active', NULL, '2025-08-04 17:38:07', '2025-08-13 10:29:06'),
(233, 'TICTAC FRUITY MIX 24X18G', NULL, '8000500355190', NULL, NULL, NULL, NULL, NULL, 8.75, 10.00, 10.00, 9.50, NULL, NULL, NULL, 72.00, NULL, NULL, 'active', NULL, '2025-08-04 17:39:37', '2025-08-08 09:26:11'),
(234, 'TICTAC SPEARMINT 24X18G', NULL, '8000500428412', NULL, NULL, NULL, NULL, NULL, 8.75, 10.00, 10.00, 9.50, NULL, NULL, NULL, 89.00, NULL, NULL, 'active', NULL, '2025-08-04 17:40:39', '2025-08-07 15:06:03'),
(235, 'TICTAC STRAWBERRY 24X18G', NULL, '8000500176726', NULL, NULL, NULL, NULL, NULL, 8.75, 10.00, 10.00, 9.50, NULL, NULL, NULL, 1.00, NULL, NULL, 'active', NULL, '2025-08-04 17:41:37', '2025-08-13 09:18:17'),
(236, 'TICTAC CITRUS MIX 24X18G', NULL, '8000500401545', NULL, NULL, NULL, NULL, NULL, 8.75, 10.00, 10.00, 9.50, NULL, NULL, NULL, 78.00, NULL, NULL, 'active', NULL, '2025-08-04 17:42:36', '2025-08-12 09:37:39'),
(237, 'TICTAC PEACH PASSION 24X18G', NULL, '80798095', NULL, NULL, NULL, NULL, NULL, 8.75, 10.00, 10.00, 9.50, NULL, NULL, NULL, 9.00, NULL, NULL, 'active', NULL, '2025-08-04 17:43:31', '2025-08-05 08:05:35'),
(238, 'TICTAC ORANGE 24X18G', NULL, '8000500039014', NULL, NULL, NULL, NULL, NULL, 8.75, 10.00, 10.00, 9.50, NULL, NULL, NULL, 75.00, NULL, NULL, 'active', NULL, '2025-08-04 17:44:31', '2025-08-12 15:10:43'),
(239, 'ORBIT SPEARMINT 30X10PCS', NULL, '4009900542661', NULL, 21, NULL, 18, NULL, 8.75, 11.00, 11.00, 10.50, NULL, NULL, NULL, 66.00, NULL, NULL, 'active', NULL, '2025-08-05 08:35:41', '2025-08-14 12:07:09'),
(240, 'ORBIT BLUEBERRY 30X14G', NULL, '4009900407106', NULL, 21, NULL, 18, NULL, 8.75, 11.00, 11.00, 10.50, NULL, NULL, NULL, 2.00, NULL, NULL, 'active', NULL, '2025-08-05 08:36:57', '2025-08-08 09:46:10'),
(241, 'ORBIT WHITE CLASSIC 30X14G', NULL, '4009900542722', NULL, 21, NULL, 18, NULL, 8.75, 11.00, 11.00, 10.50, NULL, NULL, NULL, 10.00, NULL, NULL, 'active', NULL, '2025-08-05 08:38:09', '2025-08-08 09:46:10'),
(242, 'ORBIT RASPBERRY POMEGRANATE 30X14G', NULL, '4009900540414', NULL, 21, NULL, 18, NULL, 8.75, 10.50, 11.00, 10.50, NULL, NULL, NULL, 10.00, NULL, NULL, 'active', NULL, '2025-08-05 08:39:26', '2025-08-06 18:04:58'),
(243, 'BISCOFF VANILLA 9X150G', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10.00, 11.00, 12.00, 11.00, NULL, NULL, NULL, 1.00, NULL, NULL, 'active', NULL, '2025-08-05 11:34:27', '2025-08-11 11:59:34'),
(244, 'MACTIVITIES RICH TEA 12X300G £1.99', NULL, '0500016800', NULL, 11, NULL, NULL, NULL, 11.60, 13.00, 13.50, 13.00, NULL, NULL, NULL, 4.00, NULL, NULL, 'active', NULL, '2025-08-05 15:10:37', '2025-08-12 12:19:50'),
(245, 'MACTIVITIES DIGESTIVE  12X360G £1.99', NULL, '05000168006017', NULL, 11, NULL, NULL, NULL, 11.60, 13.00, 13.50, 13.00, NULL, NULL, NULL, 1.00, NULL, NULL, 'active', NULL, '2025-08-05 15:12:23', '2025-08-12 12:19:50'),
(246, 'EXTRA BOTTLE PEPPERMINT 6X46PCS £2.50', NULL, '4009900550857', NULL, 21, NULL, NULL, NULL, 7.50, 8.00, 9.00, 8.50, NULL, NULL, NULL, 78.00, NULL, NULL, 'active', NULL, '2025-08-06 09:02:16', '2025-08-13 16:09:41');
INSERT INTO `products` (`id`, `name`, `sku`, `barcode`, `image`, `category_id`, `sub_category_id`, `brand_id`, `unit_id`, `purchase_price`, `sales_price`, `retailer_sales_price`, `individual_sales_price`, `last_purchase_price`, `last_purchase_date`, `vat_percent`, `opening_stock`, `low_stock_alert`, `description`, `status`, `discount`, `created_at`, `updated_at`) VALUES
(247, 'FRUITTELLA BERRIES& CHERRIES 40 ROLLS', NULL, '8723400829546', NULL, NULL, NULL, NULL, NULL, 12.00, 13.00, 13.50, 13.00, NULL, NULL, NULL, 225.00, NULL, NULL, 'active', NULL, '2025-08-06 09:06:30', '2025-08-08 11:12:50'),
(248, 'FRUITTELLA SUMMER FRUIT 40 ROLLS', NULL, '8723400829560', NULL, NULL, NULL, NULL, NULL, 12.50, 13.00, 13.50, 13.00, NULL, NULL, NULL, 173.00, NULL, NULL, 'active', NULL, '2025-08-06 09:08:51', '2025-08-12 12:21:54'),
(249, 'FRUITTELLA RAINBOW 40 ROLLS', NULL, '8723400797128', NULL, NULL, NULL, NULL, NULL, 12.60, 13.00, 13.50, 13.00, NULL, NULL, NULL, 34.00, NULL, NULL, 'active', NULL, '2025-08-06 09:09:48', '2025-08-12 15:10:43'),
(250, 'FRUITTELLA STRAWBERRY 40 ROLLS', NULL, '8723400797005', NULL, NULL, NULL, NULL, NULL, 12.60, 13.00, 13.50, 13.00, NULL, NULL, NULL, 153.00, NULL, NULL, 'active', NULL, '2025-08-06 09:13:06', '2025-08-11 13:48:32'),
(251, 'DOUBLEMINT STRAWBERRY 20X13.5G', NULL, '9555192501879', NULL, 21, NULL, NULL, NULL, 4.50, 6.50, 7.50, 6.50, NULL, NULL, NULL, 1720.00, NULL, NULL, 'active', NULL, '2025-08-06 16:18:01', '2025-08-14 08:01:19'),
(252, 'SESAME SNAPS 24X30G', NULL, '5011424500019', NULL, NULL, NULL, NULL, NULL, 5.22, 6.00, 6.50, 6.00, NULL, NULL, NULL, 11.00, NULL, NULL, 'active', NULL, '2025-08-06 18:41:11', '2025-08-12 14:53:53'),
(253, 'LIGHTER 50PCS', NULL, '6943981900027', NULL, NULL, NULL, NULL, NULL, 3.75, 5.00, 5.00, 5.00, NULL, NULL, NULL, 9.00, NULL, NULL, 'active', NULL, '2025-08-07 09:54:54', '2025-08-07 09:58:42'),
(254, 'EXTRA REFRESHERS STRAWBERRY LEMON6X30PCS', NULL, '4009900544573', NULL, 21, NULL, NULL, NULL, 6.50, 7.50, 7.50, 7.50, NULL, NULL, NULL, 68.00, NULL, NULL, 'active', NULL, '2025-08-11 11:10:42', '2025-08-11 11:10:42'),
(255, 'EXTRA REFRESHERS BUBBLEMINT 16X7 PCS', NULL, '4009900534482', NULL, 21, NULL, NULL, NULL, 4.50, 5.50, 5.50, 5.50, NULL, NULL, NULL, 105.00, NULL, NULL, 'active', NULL, '2025-08-11 11:12:58', '2025-08-11 11:13:10'),
(256, 'CHUPA CHUPS SOUR BAG 120 LOLLIPOPS', NULL, NULL, NULL, 16, NULL, 4, NULL, 7.50, 11.00, 12.00, 10.50, NULL, NULL, NULL, 66.00, NULL, NULL, 'active', NULL, '2025-08-12 09:54:08', '2025-08-14 12:07:09'),
(257, 'DOUBLEMINT GUM TUBS 6X58.4G', NULL, '8936114080091', NULL, 18, NULL, NULL, NULL, 6.50, 9.00, 9.00, 8.50, NULL, NULL, NULL, 708.00, NULL, NULL, 'active', NULL, '2025-08-12 10:09:20', '2025-08-13 11:49:56'),
(258, 'MILKA CARAMEL 18X100G', NULL, NULL, NULL, 25, NULL, 18, NULL, 14.04, 14.40, 15.30, 14.40, NULL, NULL, NULL, 48.00, NULL, NULL, 'active', 0.00, '2025-08-14 12:04:05', '2025-08-14 12:56:15'),
(259, 'MILKA RASPBERRY 22X100G', NULL, NULL, NULL, 25, NULL, 18, NULL, 17.16, 17.60, 18.70, 17.60, NULL, NULL, NULL, 48.00, NULL, NULL, 'active', NULL, '2025-08-14 12:15:32', '2025-08-14 12:56:29'),
(260, 'ORBIT WATERMELON', NULL, NULL, NULL, 18, NULL, 20, NULL, 8.75, 9.50, 11.00, 9.50, NULL, NULL, NULL, 100.00, NULL, NULL, 'active', NULL, '2025-08-14 12:17:26', '2025-08-14 12:56:46'),
(261, 'OREO SMALL 20X66G', NULL, NULL, NULL, 16, NULL, 18, NULL, 6.50, 7.50, 8.00, 7.50, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2025-08-14 12:19:55', '2025-08-14 12:32:46'),
(262, 'SNICKER 2 PACK 24X75G', NULL, NULL, NULL, 16, NULL, 4, NULL, 13.50, 14.50, 16.00, 14.50, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2025-08-14 12:21:13', '2025-08-14 12:32:46'),
(263, 'TWIX XTRA WHITE 30X75G', NULL, NULL, NULL, 22, NULL, 4, NULL, 22.25, 25.00, 25.00, 24.50, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2025-08-14 12:24:08', '2025-08-14 12:32:46'),
(264, 'LUCOZEDE SPORT CAP', NULL, NULL, NULL, 15, NULL, NULL, NULL, 10.00, 11.00, 11.00, 11.00, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2025-08-14 12:45:57', '2025-08-14 12:48:50');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `id` bigint UNSIGNED NOT NULL,
  `po_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `supplier_id` bigint UNSIGNED NOT NULL,
  `order_date` date NOT NULL,
  `expected_delivery_date` date NOT NULL,
  `purchase_date` date DEFAULT NULL,
  `status` enum('draft','sent','received','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT '0.00',
  `tax_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `paid_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `paid_status` enum('remaining','paid') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'remaining',
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `purchase_orders`
--

INSERT INTO `purchase_orders` (`id`, `po_number`, `supplier_id`, `order_date`, `expected_delivery_date`, `purchase_date`, `status`, `notes`, `reference`, `subtotal`, `tax_amount`, `discount_amount`, `total_amount`, `paid_amount`, `paid_status`, `created_by`, `created_at`, `updated_at`) VALUES
(16, 'PO-000001', 7, '2025-08-02', '2025-08-05', '2025-08-07', 'completed', NULL, 'BOOKER', 6120.00, 0.00, 0.00, 6120.00, 0.00, 'remaining', 1, '2025-08-02 21:31:43', '2025-08-07 11:16:24'),
(17, 'PO-000002', 12, '2025-08-02', '2025-08-06', '2025-08-04', 'completed', NULL, NULL, 4116.00, 0.00, 0.00, 4116.00, 4116.00, 'paid', 1, '2025-08-03 18:02:52', '2025-08-04 13:18:36'),
(18, 'PO-000003', 8, '2025-08-02', '2025-08-05', '2025-08-06', 'completed', NULL, NULL, 8100.00, 0.00, 0.00, 8100.00, 8100.00, 'paid', 1, '2025-08-03 19:14:25', '2025-08-06 16:19:52'),
(19, 'PO-000004', 17, '2025-08-03', '2025-08-06', '2025-08-06', 'completed', NULL, NULL, 626.40, 0.00, 0.00, 626.00, 626.00, 'paid', 1, '2025-08-03 19:19:49', '2025-08-06 18:43:22'),
(20, 'PO-000005', 17, '2025-08-03', '2025-08-07', '2025-08-04', 'completed', NULL, NULL, 4272.00, 0.00, 0.00, 4272.00, 4272.00, 'paid', 1, '2025-08-04 14:17:51', '2025-08-06 13:16:01'),
(21, 'PO-000006', 9, '2025-08-04', '2025-08-07', '2025-08-04', 'completed', NULL, NULL, 13483.50, 0.00, 0.00, 13484.00, 7208.00, 'remaining', 1, '2025-08-04 14:45:26', '2025-08-13 17:49:46'),
(22, 'PO-000007', 18, '2025-08-06', '2025-08-09', '2025-08-06', 'completed', NULL, NULL, 6297.60, 0.00, 0.00, 6298.00, 6298.00, 'paid', 1, '2025-08-06 16:24:29', '2025-08-06 16:25:10'),
(23, 'PO-000008', 16, '2025-08-07', '2025-08-10', '2025-08-07', 'completed', NULL, NULL, 15120.00, 0.00, 0.00, 15120.00, 15120.00, 'paid', 1, '2025-08-07 21:26:50', '2025-08-13 09:39:55'),
(24, 'PO-000009', 8, '2025-08-08', '2025-08-11', '2025-08-12', 'completed', NULL, NULL, 4680.00, 0.00, 0.00, 4680.00, 4680.00, 'paid', 1, '2025-08-08 15:46:37', '2025-08-12 10:27:45'),
(25, 'PO-000010', 17, '2025-08-11', '2025-08-14', '2025-08-11', 'completed', NULL, NULL, 7833.00, 0.00, 0.00, 7833.00, 7833.00, 'paid', 1, '2025-08-11 13:39:01', '2025-08-11 13:40:57'),
(26, 'PO-000011', 8, '2025-08-12', '2025-08-15', '2025-08-13', 'completed', NULL, NULL, 7344.00, 0.00, 0.00, 7344.00, 3226.50, 'remaining', 1, '2025-08-12 10:12:43', '2025-08-13 09:43:44'),
(27, 'PO-000012', 19, '2025-08-12', '2025-08-15', '2025-08-12', 'completed', NULL, NULL, 6156.00, 0.00, 0.00, 6156.00, 6156.00, 'paid', 1, '2025-08-12 15:23:06', '2025-08-13 09:47:23'),
(28, 'PO-000013', 8, '2025-08-04', '2025-08-07', '2025-08-13', 'completed', NULL, NULL, 562.50, 0.00, 0.00, 563.00, 563.00, 'paid', 1, '2025-08-13 09:27:36', '2025-08-13 09:30:19'),
(29, 'PO-000014', 9, '2025-08-13', '2025-08-17', '2025-08-14', 'completed', NULL, NULL, 22277.20, 0.00, 0.00, 22277.00, 0.00, 'remaining', 1, '2025-08-14 11:54:12', '2025-08-14 12:32:46'),
(30, 'PO-000015', 7, '2025-08-14', '2025-08-17', '2025-08-14', 'completed', NULL, NULL, 100.00, 0.00, 0.00, 100.00, 0.00, 'remaining', 1, '2025-08-14 12:47:44', '2025-08-14 12:48:50');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_items`
--

CREATE TABLE `purchase_order_items` (
  `id` bigint UNSIGNED NOT NULL,
  `purchase_order_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `received_status` enum('pending','received') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `purchase_order_items`
--

INSERT INTO `purchase_order_items` (`id`, `purchase_order_id`, `product_id`, `quantity`, `unit_price`, `total_amount`, `received_status`, `created_at`, `updated_at`) VALUES
(117, 17, 48, 490.00, 8.40, 4116.00, 'received', '2025-08-04 09:04:59', '2025-08-04 12:30:05'),
(122, 20, 199, 240.00, 8.90, 2136.00, 'received', '2025-08-04 14:21:12', '2025-08-04 14:21:47'),
(123, 20, 200, 240.00, 8.90, 2136.00, 'received', '2025-08-04 14:21:12', '2025-08-04 14:21:47'),
(169, 21, 122, 75.00, 9.50, 712.50, 'received', '2025-08-04 15:07:44', '2025-08-04 15:08:04'),
(170, 21, 121, 100.00, 9.65, 965.00, 'received', '2025-08-04 15:07:44', '2025-08-04 15:08:04'),
(171, 21, 43, 64.00, 13.75, 880.00, 'received', '2025-08-04 15:07:44', '2025-08-04 15:08:04'),
(172, 21, 124, 60.00, 10.00, 600.00, 'received', '2025-08-04 15:07:44', '2025-08-04 15:08:04'),
(173, 21, 38, 504.00, 9.25, 4662.00, 'received', '2025-08-04 15:07:44', '2025-08-04 15:08:04'),
(174, 21, 215, 90.00, 9.50, 855.00, 'received', '2025-08-04 15:07:44', '2025-08-04 15:08:04'),
(175, 21, 76, 294.00, 13.50, 3969.00, 'received', '2025-08-04 15:07:44', '2025-08-04 15:08:04'),
(176, 21, 164, 42.00, 20.00, 840.00, 'received', '2025-08-04 15:07:44', '2025-08-04 15:08:04'),
(178, 18, 251, 1800.00, 4.50, 8100.00, 'received', '2025-08-06 16:19:03', '2025-08-06 16:19:52'),
(180, 22, 177, 1024.00, 6.15, 6297.60, 'received', '2025-08-06 16:24:46', '2025-08-06 16:25:10'),
(182, 19, 252, 120.00, 5.22, 626.40, 'received', '2025-08-06 18:42:41', '2025-08-06 18:43:22'),
(184, 16, 201, 720.00, 8.50, 6120.00, 'received', '2025-08-07 11:15:51', '2025-08-07 11:16:24'),
(186, 23, 174, 720.00, 21.00, 15120.00, 'received', '2025-08-07 21:27:10', '2025-08-07 21:27:20'),
(192, 25, 59, 288.00, 12.66, 3646.08, 'received', '2025-08-11 13:40:01', '2025-08-11 13:40:57'),
(193, 25, 58, 162.00, 12.66, 2050.92, 'received', '2025-08-11 13:40:01', '2025-08-11 13:40:57'),
(194, 25, 200, 240.00, 8.90, 2136.00, 'received', '2025-08-11 13:40:01', '2025-08-11 13:40:57'),
(195, 24, 257, 720.00, 6.50, 4680.00, 'received', '2025-08-12 10:11:35', '2025-08-12 10:15:47'),
(199, 27, 25, 270.00, 22.80, 6156.00, 'received', '2025-08-12 15:23:30', '2025-08-12 15:23:49'),
(205, 28, 179, 30.00, 3.75, 112.50, 'received', '2025-08-13 09:28:24', '2025-08-13 09:28:34'),
(206, 28, 180, 30.00, 3.75, 112.50, 'received', '2025-08-13 09:28:24', '2025-08-13 09:28:34'),
(207, 28, 181, 30.00, 3.75, 112.50, 'received', '2025-08-13 09:28:24', '2025-08-13 09:28:34'),
(208, 28, 182, 30.00, 3.75, 112.50, 'received', '2025-08-13 09:28:24', '2025-08-13 09:28:34'),
(209, 28, 183, 30.00, 3.75, 112.50, 'received', '2025-08-13 09:28:24', '2025-08-13 09:28:34'),
(210, 26, 24, 340.00, 21.60, 7344.00, 'received', '2025-08-13 09:40:34', '2025-08-13 09:41:59'),
(447, 29, 223, 20.00, 9.75, 195.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(448, 29, 222, 80.00, 9.75, 780.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(449, 29, 86, 216.00, 9.00, 1944.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(450, 29, 53, 60.00, 11.50, 690.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(451, 29, 158, 42.00, 11.25, 472.50, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(452, 29, 219, 72.00, 6.75, 486.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(453, 29, 209, 144.00, 6.75, 972.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(454, 29, 210, 72.00, 6.75, 486.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(455, 29, 33, 120.00, 9.50, 1140.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(456, 29, 42, 32.00, 15.00, 480.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(457, 29, 44, 60.00, 15.00, 900.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(458, 29, 122, 100.00, 9.50, 950.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(459, 29, 111, 80.00, 19.50, 1560.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(460, 29, 258, 48.00, 14.04, 673.92, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(461, 29, 112, 40.00, 19.50, 780.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(462, 29, 100, 80.00, 12.49, 999.20, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(463, 29, 115, 40.00, 17.94, 717.60, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(464, 29, 259, 48.00, 17.16, 823.68, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(465, 29, 117, 80.00, 13.26, 1060.80, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(466, 29, 260, 100.00, 8.75, 875.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(467, 29, 221, 40.00, 8.75, 350.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(468, 29, 124, 150.00, 10.00, 1500.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(469, 29, 262, 40.00, 13.50, 540.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(470, 29, 85, 56.00, 11.50, 644.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(471, 29, 263, 32.00, 22.25, 712.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(472, 29, 51, 84.00, 9.50, 798.00, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(473, 29, 261, 115.00, 6.50, 747.50, 'received', '2025-08-14 12:32:27', '2025-08-14 12:32:46'),
(475, 30, 264, 10.00, 10.00, 100.00, 'received', '2025-08-14 12:48:15', '2025-08-14 12:48:50');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_transactions`
--

CREATE TABLE `purchase_transactions` (
  `id` bigint UNSIGNED NOT NULL,
  `purchase_order_id` bigint UNSIGNED NOT NULL,
  `supplier_id` bigint UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','bank_transfer','cheque','credit_card','upi','other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cash',
  `status` enum('pending','completed','failed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `reference_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `payment_date` date NOT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `purchase_transactions`
--

INSERT INTO `purchase_transactions` (`id`, `purchase_order_id`, `supplier_id`, `amount`, `payment_method`, `status`, `reference_number`, `notes`, `payment_date`, `created_by`, `created_at`, `updated_at`) VALUES
(23, 17, 12, 4116.00, 'bank_transfer', 'completed', NULL, NULL, '2025-08-04', 1, '2025-08-04 13:18:36', '2025-08-04 13:18:36'),
(24, 20, 17, 4272.00, 'cash', 'completed', NULL, NULL, '2025-08-06', 1, '2025-08-06 13:16:01', '2025-08-06 13:16:01'),
(25, 18, 8, 8100.00, 'cash', 'completed', NULL, NULL, '2025-08-06', 1, '2025-08-06 16:19:25', '2025-08-06 16:19:25'),
(26, 22, 18, 6298.00, 'cash', 'completed', NULL, NULL, '2025-08-06', 1, '2025-08-06 16:25:07', '2025-08-06 16:25:07'),
(27, 19, 17, 626.00, 'cash', 'completed', NULL, NULL, '2025-08-06', 1, '2025-08-06 18:42:33', '2025-08-06 18:42:33'),
(28, 23, 16, 6048.00, 'cash', 'completed', NULL, NULL, '2025-08-07', 1, '2025-08-07 21:27:50', '2025-08-07 21:27:50'),
(29, 25, 17, 7833.00, 'cash', 'completed', NULL, NULL, '2025-08-11', 1, '2025-08-11 13:40:34', '2025-08-11 13:40:34'),
(30, 24, 8, 4680.00, 'cash', 'completed', NULL, NULL, '2025-08-12', 1, '2025-08-12 10:27:45', '2025-08-12 10:27:45'),
(31, 28, 8, 563.00, 'cash', 'completed', NULL, NULL, '2025-08-13', 1, '2025-08-13 09:30:19', '2025-08-13 09:30:19'),
(32, 26, 8, 2744.00, 'cash', 'completed', NULL, 'TWIX RTN 196X14', '2025-08-04', 1, '2025-08-13 09:31:31', '2025-08-13 09:31:31'),
(33, 23, 16, 9072.00, 'cash', 'completed', NULL, NULL, '2025-08-13', 1, '2025-08-13 09:39:55', '2025-08-13 09:39:55'),
(34, 26, 8, 482.50, 'bank_transfer', 'completed', NULL, NULL, '2025-08-13', 1, '2025-08-13 09:43:44', '2025-08-13 09:43:44'),
(35, 27, 19, 6156.00, 'cash', 'completed', NULL, NULL, '2025-08-13', 1, '2025-08-13 09:47:23', '2025-08-13 09:47:23'),
(36, 21, 9, 7000.00, 'cash', 'completed', NULL, 'MK SWEET', '2025-08-13', 1, '2025-08-13 17:48:03', '2025-08-13 17:48:03'),
(37, 21, 9, 203.00, 'cash', 'completed', NULL, 'PRICE DIFFERENT', '2025-08-13', 1, '2025-08-13 17:48:50', '2025-08-13 17:48:50'),
(38, 21, 9, 5.00, 'cash', 'completed', NULL, 'PRICE DIFFERENT', '2025-08-13', 1, '2025-08-13 17:49:46', '2025-08-13 17:49:46');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'Administrator role with full access', 1, 0, '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(2, 'Manager', 'Manager role with elevated access', 1, 0, '2025-07-02 03:08:33', '2025-07-02 03:08:33'),
(14, 'STAFF', NULL, 1, 0, '2025-07-17 17:47:57', '2025-07-17 17:47:57'),
(15, 'SMITH', NULL, 1, 0, '2025-08-06 11:27:50', '2025-08-06 11:27:50');

-- --------------------------------------------------------

--
-- Table structure for table `role_permission`
--

CREATE TABLE `role_permission` (
  `id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL,
  `permission_id` bigint UNSIGNED NOT NULL,
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
(34, 2, 34, NULL, NULL),
(37, 14, 9, NULL, NULL),
(38, 14, 10, NULL, NULL),
(39, 14, 12, NULL, NULL),
(40, 14, 13, NULL, NULL),
(41, 14, 14, NULL, NULL),
(42, 14, 16, NULL, NULL),
(43, 14, 25, NULL, NULL),
(44, 14, 26, NULL, NULL),
(45, 14, 28, NULL, NULL),
(46, 14, 29, NULL, NULL),
(47, 14, 30, NULL, NULL),
(48, 14, 32, NULL, NULL),
(49, 14, 53, NULL, NULL),
(50, 14, 54, NULL, NULL),
(51, 14, 56, NULL, NULL),
(52, 14, 57, NULL, NULL),
(53, 14, 58, NULL, NULL),
(54, 14, 60, NULL, NULL),
(55, 14, 83, NULL, NULL),
(56, 14, 84, NULL, NULL),
(57, 14, 86, NULL, NULL),
(58, 14, 33, NULL, NULL),
(59, 14, 34, NULL, NULL),
(60, 14, 36, NULL, NULL),
(61, 14, 37, NULL, NULL),
(62, 14, 38, NULL, NULL),
(63, 14, 40, NULL, NULL),
(64, 2, 7, NULL, NULL),
(65, 2, 10, NULL, NULL),
(66, 2, 15, NULL, NULL),
(67, 2, 19, NULL, NULL),
(68, 2, 21, NULL, NULL),
(69, 2, 22, NULL, NULL),
(70, 2, 23, NULL, NULL),
(71, 2, 25, NULL, NULL),
(72, 2, 26, NULL, NULL),
(73, 2, 27, NULL, NULL),
(74, 2, 30, NULL, NULL),
(75, 2, 31, NULL, NULL),
(76, 2, 33, NULL, NULL),
(77, 2, 35, NULL, NULL),
(78, 2, 37, NULL, NULL),
(79, 2, 38, NULL, NULL),
(80, 2, 39, NULL, NULL),
(81, 2, 41, NULL, NULL),
(82, 2, 42, NULL, NULL),
(83, 2, 43, NULL, NULL),
(84, 2, 46, NULL, NULL),
(85, 2, 47, NULL, NULL),
(86, 2, 49, NULL, NULL),
(87, 2, 50, NULL, NULL),
(88, 2, 51, NULL, NULL),
(89, 2, 52, NULL, NULL),
(90, 2, 54, NULL, NULL),
(91, 2, 55, NULL, NULL),
(92, 2, 57, NULL, NULL),
(93, 2, 58, NULL, NULL),
(94, 2, 59, NULL, NULL),
(95, 2, 83, NULL, NULL),
(96, 2, 84, NULL, NULL),
(97, 2, 85, NULL, NULL),
(98, 2, 92, NULL, NULL),
(99, 2, 99, NULL, NULL),
(100, 14, 59, NULL, NULL),
(101, 14, 85, NULL, NULL),
(102, 15, 9, NULL, NULL),
(103, 15, 10, NULL, NULL),
(104, 15, 11, NULL, NULL),
(105, 15, 12, NULL, NULL),
(106, 15, 13, NULL, NULL),
(107, 15, 14, NULL, NULL),
(108, 15, 16, NULL, NULL),
(109, 15, 29, NULL, NULL),
(110, 15, 30, NULL, NULL),
(111, 15, 31, NULL, NULL),
(112, 15, 32, NULL, NULL),
(113, 15, 33, NULL, NULL),
(114, 15, 34, NULL, NULL),
(115, 15, 35, NULL, NULL),
(116, 15, 36, NULL, NULL),
(117, 15, 57, NULL, NULL),
(118, 15, 58, NULL, NULL),
(119, 15, 60, NULL, NULL),
(120, 15, 83, NULL, NULL),
(121, 15, 84, NULL, NULL),
(122, 15, 86, NULL, NULL),
(123, 15, 59, NULL, NULL),
(124, 15, 85, NULL, NULL),
(125, 15, 90, NULL, NULL),
(126, 15, 91, NULL, NULL),
(127, 15, 92, NULL, NULL),
(128, 15, 93, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` bigint UNSIGNED NOT NULL,
  `customer_id` bigint UNSIGNED DEFAULT NULL,
  `grand_total` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `paid` decimal(10,2) NOT NULL DEFAULT '0.00',
  `due` decimal(10,2) NOT NULL DEFAULT '0.00',
  `mode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoice_ref` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_discount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_tax` decimal(10,2) NOT NULL DEFAULT '0.00',
  `round_off` decimal(10,2) NOT NULL DEFAULT '0.00',
  `rounded_total` decimal(10,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `customer_id`, `grand_total`, `discount`, `paid`, `due`, `mode`, `invoice_ref`, `created_at`, `updated_at`, `subtotal`, `total_discount`, `total_tax`, `round_off`, `rounded_total`) VALUES
(39, NULL, 720.00, 0.00, 720.00, 0.00, 'cash', 'INV-0039', '2025-08-02 08:51:48', '2025-08-02 08:51:48', 720.00, 0.00, 0.00, 0.00, 720.00),
(40, 46, 3959.25, 0.00, 3959.00, 0.00, 'cash', 'INV-0040', '2025-08-04 08:59:53', '2025-08-04 08:59:53', 3959.25, 0.00, 0.00, -0.25, 3959.00),
(41, 37, 2786.00, 0.00, 2786.00, 0.00, 'cash', 'INV-0041', '2025-08-04 09:26:44', '2025-08-04 09:26:44', 2786.00, 0.00, 0.00, 0.00, 2786.00),
(42, 19, 141.30, 0.00, 141.00, 0.00, 'cash', 'INV-0042', '2025-08-04 11:13:35', '2025-08-04 11:13:35', 141.30, 0.00, 0.00, -0.30, 141.00),
(43, 19, 85.30, 0.00, 85.00, 0.00, 'cash', 'INV-0043', '2025-08-04 11:18:19', '2025-08-04 11:18:19', 85.30, 0.00, 0.00, -0.30, 85.00),
(44, 48, 873.50, 0.00, 874.00, 0.00, 'cash', 'INV-0044', '2025-08-04 12:52:43', '2025-08-04 12:52:43', 873.50, 0.00, 0.00, 0.50, 874.00),
(45, 32, 3492.00, 0.00, 3492.00, 0.00, 'cash', 'INV-0045', '2025-08-04 14:12:58', '2025-08-04 14:12:58', 3492.00, 0.00, 0.00, 0.00, 3492.00),
(46, 19, 303.45, 0.00, 303.00, 0.00, 'cash', 'INV-0046', '2025-08-04 15:16:00', '2025-08-04 15:16:00', 303.45, 0.00, 0.00, -0.45, 303.00),
(47, 49, 2207.00, 0.00, 2207.00, 0.00, 'cash', 'INV-0047', '2025-08-04 15:49:00', '2025-08-04 15:49:00', 2207.00, 0.00, 0.00, 0.00, 2207.00),
(48, 47, 3042.00, 0.00, 3042.00, 0.00, 'cash', 'INV-0048', '2025-08-04 16:13:58', '2025-08-04 16:13:58', 3042.00, 0.00, 0.00, 0.00, 3042.00),
(49, 19, 88.00, 0.00, 88.00, 0.00, 'cash', 'INV-0049', '2025-08-04 16:22:54', '2025-08-04 16:22:54', 88.00, 0.00, 0.00, 0.00, 88.00),
(50, 50, 819.50, 0.00, 820.00, 0.00, 'cash', 'INV-0050', '2025-08-04 16:33:37', '2025-08-04 16:33:37', 819.50, 0.00, 0.00, 0.50, 820.00),
(51, 12, 2849.50, 0.00, 2850.00, 0.00, 'cash', 'INV-0051', '2025-08-04 16:49:42', '2025-08-04 16:49:42', 2849.50, 0.00, 0.00, 0.50, 2850.00),
(52, 47, 820.00, 0.00, 820.00, 0.00, 'cash', 'INV-0052', '2025-08-04 16:50:22', '2025-08-04 16:50:22', 820.00, 0.00, 0.00, 0.00, 820.00),
(53, 47, 820.00, 0.00, 820.00, 0.00, 'cash', 'INV-0053', '2025-08-04 16:52:03', '2025-08-04 16:52:03', 820.00, 0.00, 0.00, 0.00, 820.00),
(54, 34, 4549.50, 0.00, 4550.00, 0.00, 'cash', 'INV-0054', '2025-08-05 08:30:58', '2025-08-05 08:30:58', 4549.50, 0.00, 0.00, 0.50, 4550.00),
(55, 28, 1904.00, 0.00, 1904.00, 0.00, 'cash', 'INV-0055', '2025-08-05 08:38:47', '2025-08-05 08:38:47', 1904.00, 0.00, 0.00, 0.00, 1904.00),
(56, 19, 50.80, 0.00, 51.00, 0.00, 'cash', 'INV-0056', '2025-08-05 09:32:12', '2025-08-05 09:32:12', 50.80, 0.00, 0.00, 0.20, 51.00),
(57, 19, 200.00, 0.00, 200.00, 0.00, 'cash', 'INV-0057', '2025-08-05 09:32:58', '2025-08-05 09:32:58', 200.00, 0.00, 0.00, 0.00, 200.00),
(58, 19, 239.70, 0.00, 240.00, 0.00, 'cash', 'INV-0058', '2025-08-05 09:38:50', '2025-08-05 09:38:50', 239.70, 0.00, 0.00, 0.30, 240.00),
(59, 19, 65.00, 0.00, 65.00, 0.00, 'cash', 'INV-0059', '2025-08-05 09:42:19', '2025-08-05 09:42:19', 65.00, 0.00, 0.00, 0.00, 65.00),
(60, 51, 519.30, 0.00, 519.00, 0.00, 'cash', 'INV-0060', '2025-08-05 10:47:34', '2025-08-05 10:47:34', 519.30, 0.00, 0.00, -0.30, 519.00),
(61, 36, 3041.00, 0.00, 3041.00, 0.00, 'cash', 'INV-0061', '2025-08-05 10:52:05', '2025-08-05 10:52:05', 3041.00, 0.00, 0.00, 0.00, 3041.00),
(62, 36, 3041.00, 0.00, 3041.00, 0.00, 'cash', 'INV-0062', '2025-08-05 10:52:05', '2025-08-05 10:52:05', 3041.00, 0.00, 0.00, 0.00, 3041.00),
(63, 19, 317.50, 0.00, 318.00, 0.00, 'cash', 'INV-0063', '2025-08-05 11:45:43', '2025-08-05 11:45:43', 317.50, 0.00, 0.00, 0.50, 318.00),
(64, 19, 37.00, 0.00, 37.00, 0.00, 'cash', 'INV-0064', '2025-08-05 12:04:36', '2025-08-05 12:04:36', 37.00, 0.00, 0.00, 0.00, 37.00),
(65, 49, 1440.00, 0.00, 1440.00, 0.00, 'cash', 'INV-0065', '2025-08-05 12:08:08', '2025-08-05 12:08:08', 1440.00, 0.00, 0.00, 0.00, 1440.00),
(66, 19, 100.00, 0.00, 100.00, 0.00, 'cash', 'INV-0066', '2025-08-05 13:06:52', '2025-08-05 13:06:52', 100.00, 0.00, 0.00, 0.00, 100.00),
(67, 19, 183.20, 0.00, 183.00, 0.00, 'cash', 'INV-0067', '2025-08-05 13:52:34', '2025-08-05 13:52:34', 183.20, 0.00, 0.00, -0.20, 183.00),
(68, 9, 4571.20, 0.00, 4571.00, 0.00, 'cash', 'INV-0068', '2025-08-05 14:13:25', '2025-08-05 14:13:25', 4571.20, 0.00, 0.00, -0.20, 4571.00),
(69, 19, 47.00, 0.00, 47.00, 0.00, 'cash', 'INV-0069', '2025-08-05 14:58:11', '2025-08-05 14:58:11', 47.00, 0.00, 0.00, 0.00, 47.00),
(70, 19, 177.50, 0.00, 178.00, 0.00, 'cash', 'INV-0070', '2025-08-05 15:15:46', '2025-08-05 15:15:46', 177.50, 0.00, 0.00, 0.50, 178.00),
(71, 7, 2140.00, 0.00, 2140.00, 0.00, 'cash', 'INV-0071', '2025-08-05 15:30:11', '2025-08-05 15:30:11', 2140.00, 0.00, 0.00, 0.00, 2140.00),
(72, 23, 1590.00, 0.00, 1590.00, 0.00, 'cash', 'INV-0072', '2025-08-05 15:44:20', '2025-08-05 15:44:20', 1590.00, 0.00, 0.00, 0.00, 1590.00),
(73, 19, 14.00, 0.00, 14.00, 0.00, 'cash', 'INV-0073', '2025-08-05 16:47:38', '2025-08-05 16:47:38', 14.00, 0.00, 0.00, 0.00, 14.00),
(74, NULL, 5.00, 0.00, 5.00, 0.00, 'cash', 'INV-0074', '2025-08-05 17:15:22', '2025-08-05 17:15:22', 5.00, 0.00, 0.00, 0.00, 5.00),
(75, 9, 351.00, 0.00, 351.00, 0.00, 'cash', 'INV-0075', '2025-08-06 08:38:16', '2025-08-06 08:38:16', 351.00, 0.00, 0.00, 0.00, 351.00),
(76, 40, 1246.99, 0.00, 1247.00, 0.00, 'cash', 'INV-0076', '2025-08-06 09:00:29', '2025-08-06 09:00:30', 1246.99, 0.00, 0.00, 0.01, 1247.00),
(77, 18, 855.35, 0.00, 855.00, 0.00, 'cash', 'INV-0077', '2025-08-06 09:28:54', '2025-08-06 09:28:54', 855.35, 0.00, 0.00, -0.35, 855.00),
(78, 19, 129.00, 0.00, 129.00, 0.00, 'cash', 'INV-0078', '2025-08-06 10:50:02', '2025-08-06 10:50:02', 129.00, 0.00, 0.00, 0.00, 129.00),
(79, 19, 1134.60, 0.00, 1135.00, 0.00, 'cash', 'INV-0079', '2025-08-06 10:54:39', '2025-08-06 10:54:39', 1134.60, 0.00, 0.00, 0.40, 1135.00),
(80, 27, 94.00, 0.00, 94.00, 0.00, 'cash', 'INV-0080', '2025-08-06 10:56:05', '2025-08-06 10:56:05', 94.00, 0.00, 0.00, 0.00, 94.00),
(81, 20, 532.60, 0.00, 533.00, 0.00, 'cash', 'INV-0081', '2025-08-06 12:27:53', '2025-08-06 12:27:53', 532.60, 0.00, 0.00, 0.40, 533.00),
(82, 52, 2888.60, 0.00, 2889.00, 0.00, 'cash', 'INV-0082', '2025-08-06 12:48:17', '2025-08-06 12:48:17', 2888.60, 0.00, 0.00, 0.40, 2889.00),
(83, 20, 150.00, 0.00, 150.00, 0.00, 'cash', 'INV-0083', '2025-08-06 12:49:17', '2025-08-06 12:49:17', 150.00, 0.00, 0.00, 0.00, 150.00),
(84, 11, 3816.60, 0.00, 3817.00, 0.00, 'cash', 'INV-0084', '2025-08-06 13:04:23', '2025-08-06 13:04:23', 3816.60, 0.00, 0.00, 0.40, 3817.00),
(85, 19, 100.00, 0.00, 100.00, 0.00, 'cash', 'INV-0085', '2025-08-06 13:40:57', '2025-08-06 13:40:57', 100.00, 0.00, 0.00, 0.00, 100.00),
(86, 19, 303.00, 0.00, 303.00, 0.00, 'cash', 'INV-0086', '2025-08-06 14:34:40', '2025-08-06 14:34:40', 303.00, 0.00, 0.00, 0.00, 303.00),
(87, 19, 286.50, 0.00, 287.00, 0.00, 'cash', 'INV-0087', '2025-08-06 14:42:58', '2025-08-06 14:42:58', 286.50, 0.00, 0.00, 0.50, 287.00),
(88, 44, 1512.00, 0.00, 1512.00, 0.00, 'cash', 'INV-0088', '2025-08-06 16:11:15', '2025-08-06 16:11:15', 1512.00, 0.00, 0.00, 0.00, 1512.00),
(89, 44, 1916.00, 0.00, 1916.00, 0.00, 'cash', 'INV-0089', '2025-08-06 17:17:45', '2025-08-06 17:17:45', 1916.00, 0.00, 0.00, 0.00, 1916.00),
(90, 53, 1584.00, 0.00, 1584.00, 0.00, 'cash', 'INV-0090', '2025-08-07 07:49:41', '2025-08-07 07:49:41', 1584.00, 0.00, 0.00, 0.00, 1584.00),
(91, 19, 32.00, 0.00, 32.00, 0.00, 'cash', 'INV-0091', '2025-08-07 09:03:55', '2025-08-07 09:03:55', 32.00, 0.00, 0.00, 0.00, 32.00),
(92, 19, 184.10, 0.00, 184.00, 0.00, 'cash', 'INV-0092', '2025-08-07 09:11:09', '2025-08-07 09:11:09', 184.10, 0.00, 0.00, -0.10, 184.00),
(93, 19, 248.10, 0.00, 248.00, 0.00, 'cash', 'INV-0093', '2025-08-07 09:27:29', '2025-08-07 09:27:29', 248.10, 0.00, 0.00, -0.10, 248.00),
(94, 19, 5.00, 0.00, 5.00, 0.00, 'cash', 'INV-0094', '2025-08-07 09:28:40', '2025-08-07 09:28:40', 5.00, 0.00, 0.00, 0.00, 5.00),
(95, 19, 531.70, 0.00, 532.00, 0.00, 'cash', 'INV-0095', '2025-08-07 09:54:08', '2025-08-07 09:54:08', 531.70, 0.00, 0.00, 0.30, 532.00),
(96, 19, 25.50, 0.00, 26.00, 0.00, 'cash', 'INV-0096', '2025-08-07 09:55:44', '2025-08-07 09:55:44', 25.50, 0.00, 0.00, 0.50, 26.00),
(97, 19, 404.00, 0.00, 404.00, 0.00, 'cash', 'INV-0097', '2025-08-07 10:40:27', '2025-08-07 10:40:27', 404.00, 0.00, 0.00, 0.00, 404.00),
(98, 54, 183.00, 0.00, 183.00, 0.00, 'cash', 'INV-0098', '2025-08-07 10:53:17', '2025-08-07 10:53:17', 183.00, 0.00, 0.00, 0.00, 183.00),
(99, 11, 523.80, 0.00, 524.00, 0.00, 'cash', 'INV-0099', '2025-08-07 11:47:38', '2025-08-07 11:47:38', 523.80, 0.00, 0.00, 0.20, 524.00),
(100, 19, 156.40, 0.00, 156.00, 0.00, 'cash', 'INV-0100', '2025-08-07 12:14:57', '2025-08-07 12:14:57', 156.40, 0.00, 0.00, -0.40, 156.00),
(101, 19, 315.90, 0.00, 316.00, 0.00, 'cash', 'INV-0101', '2025-08-07 12:20:34', '2025-08-07 12:20:34', 315.90, 0.00, 0.00, 0.10, 316.00),
(102, 19, 193.50, 0.00, 194.00, 0.00, 'cash', 'INV-0102', '2025-08-07 12:33:10', '2025-08-07 12:33:10', 193.50, 0.00, 0.00, 0.50, 194.00),
(103, 19, 134.30, 0.00, 134.00, 0.00, 'cash', 'INV-0103', '2025-08-07 12:44:39', '2025-08-07 12:44:39', 134.30, 0.00, 0.00, -0.30, 134.00),
(104, 19, 11.00, 0.00, 11.00, 0.00, 'cash', 'INV-0104', '2025-08-07 14:03:02', '2025-08-07 14:03:02', 11.00, 0.00, 0.00, 0.00, 11.00),
(105, 19, 97.35, 0.00, 97.00, 0.00, 'cash', 'INV-0105', '2025-08-07 14:44:21', '2025-08-07 14:44:21', 97.35, 0.00, 0.00, -0.35, 97.00),
(106, 19, 449.60, 0.00, 450.00, 0.00, 'cash', 'INV-0106', '2025-08-07 15:06:03', '2025-08-07 15:06:03', 449.60, 0.00, 0.00, 0.40, 450.00),
(107, 55, 360.75, 0.00, 361.00, 0.00, 'cash', 'INV-0107', '2025-08-07 15:33:51', '2025-08-07 15:33:51', 360.75, 0.00, 0.00, 0.25, 361.00),
(108, 19, 56.50, 0.00, 57.00, 0.00, 'cash', 'INV-0108', '2025-08-07 15:41:44', '2025-08-07 15:41:44', 56.50, 0.00, 0.00, 0.50, 57.00),
(109, 19, 55.00, 0.00, 55.00, 0.00, 'cash', 'INV-0109', '2025-08-07 16:07:14', '2025-08-07 16:07:14', 55.00, 0.00, 0.00, 0.00, 55.00),
(110, 52, 90.00, 0.00, 90.00, 0.00, 'cash', 'INV-0110', '2025-08-07 16:48:08', '2025-08-07 16:48:08', 90.00, 0.00, 0.00, 0.00, 90.00),
(111, 19, 5.00, 0.00, 5.00, 0.00, 'cash', 'INV-0111', '2025-08-07 16:58:57', '2025-08-07 16:58:57', 5.00, 0.00, 0.00, 0.00, 5.00),
(112, 56, 1525.00, 0.00, 1525.00, 0.00, 'cash', 'INV-0112', '2025-08-08 08:03:11', '2025-08-08 08:03:11', 1525.00, 0.00, 0.00, 0.00, 1525.00),
(113, 57, 441.20, 0.00, 441.00, 0.00, 'cash', 'INV-0113', '2025-08-08 09:26:11', '2025-08-08 09:26:11', 441.20, 0.00, 0.00, -0.20, 441.00),
(114, 57, 72.50, 0.00, 73.00, 0.00, 'cash', 'INV-0114', '2025-08-08 09:28:16', '2025-08-08 09:28:16', 72.50, 0.00, 0.00, 0.50, 73.00),
(115, 8, 1276.50, 0.00, 1277.00, 0.00, 'cash', 'INV-0115', '2025-08-08 09:46:10', '2025-08-08 09:46:10', 1276.50, 0.00, 0.00, 0.50, 1277.00),
(116, 46, 2633.50, 0.00, 2634.00, 0.00, 'cash', 'INV-0116', '2025-08-08 11:12:50', '2025-08-08 11:12:50', 2633.50, 0.00, 0.00, 0.50, 2634.00),
(117, 20, 815.50, 0.00, 816.00, 0.00, 'cash', 'INV-0117', '2025-08-08 11:31:45', '2025-08-08 11:31:45', 815.50, 0.00, 0.00, 0.50, 816.00),
(118, 46, 95.00, 0.00, 95.00, 0.00, 'cash', 'INV-0118', '2025-08-08 11:43:35', '2025-08-08 11:43:35', 95.00, 0.00, 0.00, 0.00, 95.00),
(119, 19, 86.00, 0.00, 86.00, 0.00, 'cash', 'INV-0119', '2025-08-08 12:05:43', '2025-08-08 12:05:43', 86.00, 0.00, 0.00, 0.00, 86.00),
(120, 19, 16.00, 0.00, 16.00, 0.00, 'cash', 'INV-0120', '2025-08-08 12:15:50', '2025-08-08 12:15:50', 16.00, 0.00, 0.00, 0.00, 16.00),
(121, 7, 6464.50, 0.00, 6465.00, 0.00, 'cash', 'INV-0121', '2025-08-08 12:17:03', '2025-08-08 12:17:03', 6464.50, 0.00, 0.00, 0.50, 6465.00),
(122, 19, 403.50, 0.00, 404.00, 0.00, 'cash', 'INV-0122', '2025-08-08 13:25:56', '2025-08-08 13:25:56', 403.50, 0.00, 0.00, 0.50, 404.00),
(123, 58, 53.50, 0.00, 54.00, 0.00, 'cash', 'INV-0123', '2025-08-08 13:30:12', '2025-08-08 13:30:12', 53.50, 0.00, 0.00, 0.50, 54.00),
(124, 19, 368.00, 0.00, 368.00, 0.00, 'cash', 'INV-0124', '2025-08-08 14:42:05', '2025-08-08 14:42:05', 368.00, 0.00, 0.00, 0.00, 368.00),
(125, 59, 1531.95, 0.00, 1532.00, 0.00, 'cash', 'INV-0125', '2025-08-08 15:06:49', '2025-08-08 15:06:49', 1531.95, 0.00, 0.00, 0.05, 1532.00),
(126, 14, 5630.70, 0.00, 5631.00, 0.00, 'cash', 'INV-0126', '2025-08-08 17:29:49', '2025-08-08 17:29:49', 5630.70, 0.00, 0.00, 0.30, 5631.00),
(127, 60, 3202.50, 0.00, 3203.00, 0.00, 'cash', 'INV-0127', '2025-08-08 17:35:01', '2025-08-08 17:35:01', 3202.50, 0.00, 0.00, 0.50, 3203.00),
(128, 60, 235.00, 0.00, 235.00, 0.00, 'cash', 'INV-0128', '2025-08-11 08:06:40', '2025-08-11 08:06:40', 235.00, 0.00, 0.00, 0.00, 235.00),
(129, 61, 10583.90, 0.00, 10584.00, 0.00, 'cash', 'INV-0129', '2025-08-11 08:30:56', '2025-08-11 08:30:56', 10583.90, 0.00, 0.00, 0.10, 10584.00),
(130, 23, 97.50, 0.00, 98.00, 0.00, 'cash', 'INV-0130', '2025-08-11 09:40:44', '2025-08-11 09:40:44', 97.50, 0.00, 0.00, 0.50, 98.00),
(131, 19, 353.30, 0.00, 353.00, 0.00, 'cash', 'INV-0131', '2025-08-11 10:56:24', '2025-08-11 10:56:24', 353.30, 0.00, 0.00, -0.30, 353.00),
(132, 19, 52.50, 0.00, 53.00, 0.00, 'cash', 'INV-0132', '2025-08-11 11:16:36', '2025-08-11 11:16:36', 52.50, 0.00, 0.00, 0.50, 53.00),
(133, 19, 659.65, 0.00, 660.00, 0.00, 'cash', 'INV-0133', '2025-08-11 11:59:34', '2025-08-11 11:59:34', 659.65, 0.00, 0.00, 0.35, 660.00),
(134, 19, 196.00, 0.00, 196.00, 0.00, 'cash', 'INV-0134', '2025-08-11 12:07:01', '2025-08-11 12:07:01', 196.00, 0.00, 0.00, 0.00, 196.00),
(135, 19, 54.00, 0.00, 54.00, 0.00, 'cash', 'INV-0135', '2025-08-11 13:46:00', '2025-08-11 13:46:00', 54.00, 0.00, 0.00, 0.00, 54.00),
(136, 62, 4192.50, 0.00, 4193.00, 0.00, 'cash', 'INV-0136', '2025-08-11 13:48:32', '2025-08-11 13:48:33', 4192.50, 0.00, 0.00, 0.50, 4193.00),
(137, 19, 25.30, 0.00, 25.00, 0.00, 'cash', 'INV-0137', '2025-08-11 14:29:36', '2025-08-11 14:29:36', 25.30, 0.00, 0.00, -0.30, 25.00),
(138, 19, 159.00, 0.00, 159.00, 0.00, 'cash', 'INV-0138', '2025-08-11 14:47:39', '2025-08-11 14:47:39', 159.00, 0.00, 0.00, 0.00, 159.00),
(139, 55, 238.50, 0.00, 239.00, 0.00, 'cash', 'INV-0139', '2025-08-11 14:57:48', '2025-08-11 14:57:48', 238.50, 0.00, 0.00, 0.50, 239.00),
(140, 44, 2628.00, 0.00, 2628.00, 0.00, 'cash', 'INV-0140', '2025-08-11 17:35:52', '2025-08-11 17:35:52', 2628.00, 0.00, 0.00, 0.00, 2628.00),
(141, 19, 101.50, 0.00, 102.00, 0.00, 'cash', 'INV-0141', '2025-08-12 08:42:24', '2025-08-12 08:42:24', 101.50, 0.00, 0.00, 0.50, 102.00),
(142, 19, 44.00, 0.00, 44.00, 0.00, 'cash', 'INV-0142', '2025-08-12 08:49:37', '2025-08-12 08:49:37', 44.00, 0.00, 0.00, 0.00, 44.00),
(143, 51, 495.60, 0.00, 496.00, 0.00, 'cash', 'INV-0143', '2025-08-12 09:10:13', '2025-08-12 09:10:13', 495.60, 0.00, 0.00, 0.40, 496.00),
(144, 19, 556.00, 0.00, 556.00, 0.00, 'cash', 'INV-0144', '2025-08-12 09:37:39', '2025-08-12 09:37:39', 556.00, 0.00, 0.00, 0.00, 556.00),
(145, 19, 287.80, 0.00, 288.00, 0.00, 'cash', 'INV-0145', '2025-08-12 11:06:54', '2025-08-12 11:06:54', 287.80, 0.00, 0.00, 0.20, 288.00),
(146, 19, 66.55, 0.00, 67.00, 0.00, 'cash', 'INV-0146', '2025-08-12 11:08:56', '2025-08-12 11:08:56', 66.55, 0.00, 0.00, 0.45, 67.00),
(147, 63, 1897.00, 0.00, 1897.00, 0.00, 'cash', 'INV-0147', '2025-08-12 11:15:28', '2025-08-12 11:15:28', 1897.00, 0.00, 0.00, 0.00, 1897.00),
(148, 20, 703.80, 0.00, 704.00, 0.00, 'cash', 'INV-0148', '2025-08-12 11:24:43', '2025-08-12 11:24:43', 703.80, 0.00, 0.00, 0.20, 704.00),
(149, 19, 78.00, 0.00, 78.00, 0.00, 'cash', 'INV-0149', '2025-08-12 11:52:50', '2025-08-12 11:52:50', 78.00, 0.00, 0.00, 0.00, 78.00),
(150, 45, 720.00, 0.00, 720.00, 0.00, 'cash', 'INV-0150', '2025-08-12 11:59:21', '2025-08-12 11:59:21', 720.00, 0.00, 0.00, 0.00, 720.00),
(151, 19, 109.70, 0.00, 110.00, 0.00, 'cash', 'INV-0151', '2025-08-12 12:19:50', '2025-08-12 12:19:50', 109.70, 0.00, 0.00, 0.30, 110.00),
(152, 19, 13.50, 0.00, 14.00, 0.00, 'cash', 'INV-0152', '2025-08-12 12:21:54', '2025-08-12 12:21:54', 13.50, 0.00, 0.00, 0.50, 14.00),
(153, 19, 102.00, 0.00, 102.00, 0.00, 'cash', 'INV-0153', '2025-08-12 13:37:34', '2025-08-12 13:37:34', 102.00, 0.00, 0.00, 0.00, 102.00),
(154, 19, 111.00, 0.00, 111.00, 0.00, 'cash', 'INV-0154', '2025-08-12 14:32:03', '2025-08-12 14:32:03', 111.00, 0.00, 0.00, 0.00, 111.00),
(155, 19, 24.00, 0.00, 24.00, 0.00, 'cash', 'INV-0155', '2025-08-12 14:47:01', '2025-08-12 14:47:01', 24.00, 0.00, 0.00, 0.00, 24.00),
(156, 54, 229.50, 0.00, 230.00, 0.00, 'cash', 'INV-0156', '2025-08-12 14:53:53', '2025-08-12 14:53:53', 229.50, 0.00, 0.00, 0.50, 230.00),
(157, 19, 288.20, 0.00, 288.00, 0.00, 'cash', 'INV-0157', '2025-08-12 15:10:42', '2025-08-12 15:10:42', 288.20, 0.00, 0.00, -0.20, 288.00),
(158, 29, 3028.00, 0.00, 3028.00, 0.00, 'cash', 'INV-0158', '2025-08-13 09:18:17', '2025-08-13 09:18:18', 3028.00, 0.00, 0.00, 0.00, 3028.00),
(159, 45, 776.20, 0.00, 776.00, 0.00, 'cash', 'INV-0159', '2025-08-13 09:39:14', '2025-08-13 09:39:14', 776.20, 0.00, 0.00, -0.20, 776.00),
(160, 19, 79.00, 0.00, 79.00, 0.00, 'cash', 'INV-0160', '2025-08-13 10:08:40', '2025-08-13 10:08:40', 79.00, 0.00, 0.00, 0.00, 79.00),
(161, 19, 325.50, 0.00, 326.00, 0.00, 'cash', 'INV-0161', '2025-08-13 10:29:06', '2025-08-13 10:29:06', 325.50, 0.00, 0.00, 0.50, 326.00),
(162, 20, 243.50, 0.00, 244.00, 0.00, 'cash', 'INV-0162', '2025-08-13 11:22:56', '2025-08-13 11:22:56', 243.50, 0.00, 0.00, 0.50, 244.00),
(163, 19, 238.95, 0.00, 239.00, 0.00, 'cash', 'INV-0163', '2025-08-13 11:41:42', '2025-08-13 11:41:42', 238.95, 0.00, 0.00, 0.05, 239.00),
(164, 11, 6456.40, 0.00, 6456.00, 0.00, 'cash', 'INV-0164', '2025-08-13 11:49:56', '2025-08-13 11:49:56', 6456.40, 0.00, 0.00, -0.40, 6456.00),
(165, 19, 79.90, 0.00, 80.00, 0.00, 'cash', 'INV-0165', '2025-08-13 13:28:53', '2025-08-13 13:28:53', 79.90, 0.00, 0.00, 0.10, 80.00),
(166, 64, 5710.50, 0.00, 5711.00, 0.00, 'cash', 'INV-0166', '2025-08-13 13:37:17', '2025-08-13 13:37:17', 5710.50, 0.00, 0.00, 0.50, 5711.00),
(167, 28, 1425.00, 0.00, 1425.00, 0.00, 'cash', 'INV-0167', '2025-08-13 14:07:29', '2025-08-13 14:07:29', 1425.00, 0.00, 0.00, 0.00, 1425.00),
(168, 65, 456.00, 0.00, 456.00, 0.00, 'cash', 'INV-0168', '2025-08-13 14:09:42', '2025-08-13 14:09:42', 456.00, 0.00, 0.00, 0.00, 456.00),
(169, 19, 192.00, 0.00, 192.00, 0.00, 'cash', 'INV-0169', '2025-08-13 15:25:29', '2025-08-13 15:25:29', 192.00, 0.00, 0.00, 0.00, 192.00),
(170, 45, 445.45, 0.00, 445.00, 0.00, 'cash', 'INV-0170', '2025-08-13 15:56:38', '2025-08-13 15:56:39', 445.45, 0.00, 0.00, -0.45, 445.00),
(171, 30, 1627.50, 0.00, 1628.00, 0.00, 'cash', 'INV-0171', '2025-08-13 16:09:41', '2025-08-13 16:09:41', 1627.50, 0.00, 0.00, 0.50, 1628.00),
(172, 52, 1480.00, 0.00, 1480.00, 0.00, 'cash', 'INV-0172', '2025-08-14 07:37:38', '2025-08-14 07:37:38', 1480.00, 0.00, 0.00, 0.00, 1480.00),
(173, 52, 330.00, 0.00, 330.00, 0.00, 'cash', 'INV-0173', '2025-08-14 07:58:36', '2025-08-14 07:58:36', 330.00, 0.00, 0.00, 0.00, 330.00),
(174, 11, 920.00, 0.00, 920.00, 0.00, 'cash', 'INV-0174', '2025-08-14 08:02:17', '2025-08-14 08:02:17', 920.00, 0.00, 0.00, 0.00, 920.00),
(175, 19, 105.00, 0.00, 105.00, 0.00, 'cash', 'INV-0175', '2025-08-14 11:04:45', '2025-08-14 11:04:45', 105.00, 0.00, 0.00, 0.00, 105.00),
(176, 9, 2736.50, 0.00, 2737.00, 0.00, 'cash', 'INV-0176', '2025-08-14 12:07:09', '2025-08-14 12:07:09', 2736.50, 0.00, 0.00, 0.50, 2737.00),
(177, NULL, 1001.00, 0.00, 1001.00, 0.00, 'cash', 'INV-0177', '2025-08-14 12:19:40', '2025-08-14 12:19:40', 1001.00, 0.00, 0.00, 0.00, 1001.00),
(178, 19, 14.00, 0.00, 14.00, 0.00, 'cash', 'INV-0178', '2025-08-14 12:43:00', '2025-08-14 12:43:00', 14.00, 0.00, 0.00, 0.00, 14.00),
(179, 25, 39.00, 0.00, 39.00, 0.00, 'cash', 'INV-0179', '2025-08-14 14:03:14', '2025-08-14 14:03:14', 39.00, 0.00, 0.00, 0.00, 39.00),
(180, 19, 128.00, 0.00, 128.00, 0.00, 'cash', 'INV-0180', '2025-08-14 14:35:17', '2025-08-14 14:35:17', 128.00, 0.00, 0.00, 0.00, 128.00);

-- --------------------------------------------------------

--
-- Table structure for table `sales_transactions`
--

CREATE TABLE `sales_transactions` (
  `id` bigint UNSIGNED NOT NULL,
  `sale_id` bigint UNSIGNED NOT NULL,
  `payment_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales_transactions`
--

INSERT INTO `sales_transactions` (`id`, `sale_id`, `payment_type`, `amount`, `description`, `created_at`, `updated_at`) VALUES
(73, 39, 'cash', 720.00, 'Cash payment', '2025-08-02 08:51:48', '2025-08-02 08:51:48'),
(74, 40, 'wallet', 3959.00, 'Wallet credit (due) payment', '2025-08-04 08:59:53', '2025-08-04 08:59:53'),
(75, 41, 'wallet', 2786.00, 'Wallet credit (due) payment', '2025-08-04 09:26:44', '2025-08-04 09:26:44'),
(76, 42, 'cash', 141.00, 'Cash payment', '2025-08-04 11:13:35', '2025-08-04 11:13:35'),
(77, 43, 'cash', 85.00, 'Cash payment', '2025-08-04 11:18:19', '2025-08-04 11:18:19'),
(78, 44, 'wallet', 874.00, 'Wallet credit (due) payment', '2025-08-04 12:52:43', '2025-08-04 12:52:43'),
(79, 45, 'wallet', 3492.00, 'Wallet credit (due) payment', '2025-08-04 14:12:58', '2025-08-04 14:12:58'),
(80, 46, 'wallet', 303.00, 'Wallet credit (due) payment', '2025-08-04 15:16:00', '2025-08-04 15:16:00'),
(81, 47, 'wallet', 2207.00, 'Wallet credit (due) payment', '2025-08-04 15:49:00', '2025-08-04 15:49:00'),
(82, 48, 'wallet', 3042.00, 'Wallet credit (due) payment', '2025-08-04 16:13:58', '2025-08-04 16:13:58'),
(83, 49, 'cash', 88.00, 'Cash payment', '2025-08-04 16:22:54', '2025-08-04 16:22:54'),
(84, 50, 'wallet', 820.00, 'Wallet credit (due) payment', '2025-08-04 16:33:37', '2025-08-04 16:33:37'),
(85, 51, 'wallet', 2850.00, 'Wallet credit (due) payment', '2025-08-04 16:49:42', '2025-08-04 16:49:42'),
(86, 52, 'wallet', 820.00, 'Wallet credit (due) payment', '2025-08-04 16:50:22', '2025-08-04 16:50:22'),
(87, 53, 'cash', 820.00, 'Cash payment', '2025-08-04 16:52:03', '2025-08-04 16:52:03'),
(88, 54, 'wallet', 4550.00, 'Wallet credit (due) payment', '2025-08-05 08:30:58', '2025-08-05 08:30:58'),
(89, 55, 'wallet', 1904.00, 'Wallet credit (due) payment', '2025-08-05 08:38:47', '2025-08-05 08:38:47'),
(90, 56, 'cash', 51.00, 'Cash payment', '2025-08-05 09:32:12', '2025-08-05 09:32:12'),
(91, 57, 'cash', 200.00, 'Cash payment', '2025-08-05 09:32:58', '2025-08-05 09:32:58'),
(92, 58, 'cash', 240.00, 'Cash payment', '2025-08-05 09:38:50', '2025-08-05 09:38:50'),
(93, 59, 'cash', 65.00, 'Cash payment', '2025-08-05 09:42:19', '2025-08-05 09:42:19'),
(94, 60, 'cash', 519.00, 'Cash payment', '2025-08-05 10:47:34', '2025-08-05 10:47:34'),
(95, 61, 'wallet', 3041.00, 'Wallet credit (due) payment', '2025-08-05 10:52:05', '2025-08-05 10:52:05'),
(96, 62, 'wallet', 3041.00, 'Wallet credit (due) payment', '2025-08-05 10:52:05', '2025-08-05 10:52:05'),
(97, 63, 'cash', 318.00, 'Cash payment', '2025-08-05 11:45:43', '2025-08-05 11:45:43'),
(98, 64, 'cash', 37.00, 'Cash payment', '2025-08-05 12:04:36', '2025-08-05 12:04:36'),
(99, 65, 'wallet', 1440.00, 'Wallet credit (due) payment', '2025-08-05 12:08:08', '2025-08-05 12:08:08'),
(100, 66, 'cash', 100.00, 'Cash payment', '2025-08-05 13:06:52', '2025-08-05 13:06:52'),
(101, 67, 'cash', 183.00, 'Cash payment', '2025-08-05 13:52:34', '2025-08-05 13:52:34'),
(102, 68, 'wallet', 4571.00, 'Wallet credit (due) payment', '2025-08-05 14:13:25', '2025-08-05 14:13:25'),
(103, 69, 'cash', 47.00, 'Cash payment', '2025-08-05 14:58:11', '2025-08-05 14:58:11'),
(104, 70, 'cash', 178.00, 'Cash payment', '2025-08-05 15:15:46', '2025-08-05 15:15:46'),
(105, 71, 'wallet', 2140.00, 'Wallet credit (due) payment', '2025-08-05 15:30:11', '2025-08-05 15:30:11'),
(106, 72, 'wallet', 1590.00, 'Wallet credit (due) payment', '2025-08-05 15:44:20', '2025-08-05 15:44:20'),
(107, 73, 'cash', 14.00, 'Cash payment', '2025-08-05 16:47:38', '2025-08-05 16:47:38'),
(108, 74, 'cash', 5.00, 'Cash payment', '2025-08-05 17:15:22', '2025-08-05 17:15:22'),
(109, 75, 'wallet', 351.00, 'Wallet credit (due) payment', '2025-08-06 08:38:16', '2025-08-06 08:38:16'),
(110, 76, 'wallet', 1247.00, 'Wallet credit (due) payment', '2025-08-06 09:00:30', '2025-08-06 09:00:30'),
(111, 77, 'wallet', 855.00, 'Wallet credit (due) payment', '2025-08-06 09:28:54', '2025-08-06 09:28:54'),
(112, 78, 'wallet', 129.00, 'Wallet credit (due) payment', '2025-08-06 10:50:02', '2025-08-06 10:50:02'),
(113, 79, 'wallet', 1135.00, 'Wallet credit (due) payment', '2025-08-06 10:54:39', '2025-08-06 10:54:39'),
(114, 80, 'wallet', 94.00, 'Wallet credit (due) payment', '2025-08-06 10:56:05', '2025-08-06 10:56:05'),
(115, 81, 'wallet', 533.00, 'Wallet credit (due) payment', '2025-08-06 12:27:53', '2025-08-06 12:27:53'),
(116, 82, 'wallet', 2889.00, 'Wallet credit (due) payment', '2025-08-06 12:48:17', '2025-08-06 12:48:17'),
(117, 83, 'cash', 150.00, 'Cash payment', '2025-08-06 12:49:17', '2025-08-06 12:49:17'),
(118, 84, 'wallet', 3817.00, 'Wallet credit (due) payment', '2025-08-06 13:04:23', '2025-08-06 13:04:23'),
(119, 85, 'cash', 100.00, 'Cash payment', '2025-08-06 13:40:57', '2025-08-06 13:40:57'),
(120, 86, 'cash', 303.00, 'Cash payment', '2025-08-06 14:34:40', '2025-08-06 14:34:40'),
(121, 87, 'cash', 287.00, 'Cash payment', '2025-08-06 14:42:58', '2025-08-06 14:42:58'),
(122, 88, 'cash', 1512.00, 'Cash payment', '2025-08-06 16:11:15', '2025-08-06 16:11:15'),
(123, 89, 'wallet', 1916.00, 'Wallet credit (due) payment', '2025-08-06 17:17:45', '2025-08-06 17:17:45'),
(124, 90, 'wallet', 1584.00, 'Wallet credit (due) payment', '2025-08-07 07:49:41', '2025-08-07 07:49:41'),
(125, 91, 'cash', 32.00, 'Cash payment', '2025-08-07 09:03:55', '2025-08-07 09:03:55'),
(126, 92, 'cash', 184.00, 'Cash payment', '2025-08-07 09:11:09', '2025-08-07 09:11:09'),
(127, 93, 'cash', 248.00, 'Cash payment', '2025-08-07 09:27:29', '2025-08-07 09:27:29'),
(128, 94, 'cash', 5.00, 'Cash payment', '2025-08-07 09:28:40', '2025-08-07 09:28:40'),
(129, 95, 'cash', 532.00, 'Cash payment', '2025-08-07 09:54:08', '2025-08-07 09:54:08'),
(130, 96, 'cash', 26.00, 'Cash payment', '2025-08-07 09:55:44', '2025-08-07 09:55:44'),
(131, 97, 'cash', 404.00, 'Cash payment', '2025-08-07 10:40:27', '2025-08-07 10:40:27'),
(132, 98, 'cash', 183.00, 'Cash payment', '2025-08-07 10:53:17', '2025-08-07 10:53:17'),
(133, 99, 'wallet', 524.00, 'Wallet credit (due) payment', '2025-08-07 11:47:38', '2025-08-07 11:47:38'),
(134, 100, 'wallet', 156.00, 'Wallet credit (due) payment', '2025-08-07 12:14:57', '2025-08-07 12:14:57'),
(135, 101, 'cash', 316.00, 'Cash payment', '2025-08-07 12:20:34', '2025-08-07 12:20:34'),
(136, 102, 'cash', 194.00, 'Cash payment', '2025-08-07 12:33:10', '2025-08-07 12:33:10'),
(137, 103, 'cash', 134.00, 'Cash payment', '2025-08-07 12:44:39', '2025-08-07 12:44:39'),
(138, 104, 'cash', 11.00, 'Cash payment', '2025-08-07 14:03:02', '2025-08-07 14:03:02'),
(139, 105, 'cash', 97.00, 'Cash payment', '2025-08-07 14:44:21', '2025-08-07 14:44:21'),
(140, 106, 'cash', 450.00, 'Cash payment', '2025-08-07 15:06:03', '2025-08-07 15:06:03'),
(141, 107, 'cash', 361.00, 'Cash payment', '2025-08-07 15:33:51', '2025-08-07 15:33:51'),
(142, 108, 'cash', 57.00, 'Cash payment', '2025-08-07 15:41:44', '2025-08-07 15:41:44'),
(143, 109, 'cash', 55.00, 'Cash payment', '2025-08-07 16:07:14', '2025-08-07 16:07:14'),
(144, 110, 'wallet', 90.00, 'Wallet credit (due) payment', '2025-08-07 16:48:08', '2025-08-07 16:48:08'),
(145, 111, 'cash', 5.00, 'Cash payment', '2025-08-07 16:58:57', '2025-08-07 16:58:57'),
(146, 112, 'wallet', 1525.00, 'Wallet credit (due) payment', '2025-08-08 08:03:11', '2025-08-08 08:03:11'),
(147, 113, 'card', 441.00, 'Card payment', '2025-08-08 09:26:11', '2025-08-08 09:26:11'),
(148, 114, 'card', 73.00, 'Card payment', '2025-08-08 09:28:16', '2025-08-08 09:28:16'),
(149, 115, 'wallet', 1277.00, 'Wallet credit (due) payment', '2025-08-08 09:46:10', '2025-08-08 09:46:10'),
(150, 116, 'wallet', 2634.00, 'Wallet credit (due) payment', '2025-08-08 11:12:50', '2025-08-08 11:12:50'),
(151, 117, 'cash', 816.00, 'Cash payment', '2025-08-08 11:31:45', '2025-08-08 11:31:45'),
(152, 118, 'wallet', 95.00, 'Wallet credit (due) payment', '2025-08-08 11:43:35', '2025-08-08 11:43:35'),
(153, 119, 'cash', 86.00, 'Cash payment', '2025-08-08 12:05:43', '2025-08-08 12:05:43'),
(154, 120, 'cash', 16.00, 'Cash payment', '2025-08-08 12:15:50', '2025-08-08 12:15:50'),
(155, 121, 'wallet', 6465.00, 'Wallet credit (due) payment', '2025-08-08 12:17:03', '2025-08-08 12:17:03'),
(156, 122, 'cash', 404.00, 'Cash payment', '2025-08-08 13:25:56', '2025-08-08 13:25:56'),
(157, 123, 'cash', 54.00, 'Cash payment', '2025-08-08 13:30:12', '2025-08-08 13:30:12'),
(158, 124, 'cash', 368.00, 'Cash payment', '2025-08-08 14:42:05', '2025-08-08 14:42:05'),
(159, 125, 'wallet', 1532.00, 'Wallet credit (due) payment', '2025-08-08 15:06:49', '2025-08-08 15:06:49'),
(160, 126, 'wallet', 5631.00, 'Wallet credit (due) payment', '2025-08-08 17:29:49', '2025-08-08 17:29:49'),
(161, 127, 'wallet', 3203.00, 'Wallet credit (due) payment', '2025-08-08 17:35:01', '2025-08-08 17:35:01'),
(162, 128, 'wallet', 235.00, 'Wallet credit (due) payment', '2025-08-11 08:06:40', '2025-08-11 08:06:40'),
(163, 129, 'wallet', 10584.00, 'Wallet credit (due) payment', '2025-08-11 08:30:56', '2025-08-11 08:30:56'),
(164, 130, 'cash', 98.00, 'Cash payment', '2025-08-11 09:40:44', '2025-08-11 09:40:44'),
(165, 131, 'cash', 353.00, 'Cash payment', '2025-08-11 10:56:24', '2025-08-11 10:56:24'),
(166, 132, 'cash', 53.00, 'Cash payment', '2025-08-11 11:16:36', '2025-08-11 11:16:36'),
(167, 133, 'cash', 660.00, 'Cash payment', '2025-08-11 11:59:34', '2025-08-11 11:59:34'),
(168, 134, 'cash', 196.00, 'Cash payment', '2025-08-11 12:07:01', '2025-08-11 12:07:01'),
(169, 135, 'cash', 54.00, 'Cash payment', '2025-08-11 13:46:00', '2025-08-11 13:46:00'),
(170, 136, 'wallet', 4193.00, 'Wallet credit (due) payment', '2025-08-11 13:48:33', '2025-08-11 13:48:33'),
(171, 137, 'cash', 25.00, 'Cash payment', '2025-08-11 14:29:36', '2025-08-11 14:29:36'),
(172, 138, 'cash', 159.00, 'Cash payment', '2025-08-11 14:47:39', '2025-08-11 14:47:39'),
(173, 139, 'cash', 239.00, 'Cash payment', '2025-08-11 14:57:48', '2025-08-11 14:57:48'),
(174, 140, 'wallet', 2628.00, 'Wallet credit (due) payment', '2025-08-11 17:35:52', '2025-08-11 17:35:52'),
(175, 141, 'cash', 102.00, 'Cash payment', '2025-08-12 08:42:24', '2025-08-12 08:42:24'),
(176, 142, 'cash', 44.00, 'Cash payment', '2025-08-12 08:49:37', '2025-08-12 08:49:37'),
(177, 143, 'cash', 496.00, 'Cash payment', '2025-08-12 09:10:13', '2025-08-12 09:10:13'),
(178, 144, 'cash', 556.00, 'Cash payment', '2025-08-12 09:37:39', '2025-08-12 09:37:39'),
(179, 145, 'cash', 288.00, 'Cash payment', '2025-08-12 11:06:54', '2025-08-12 11:06:54'),
(180, 146, 'cash', 67.00, 'Cash payment', '2025-08-12 11:08:56', '2025-08-12 11:08:56'),
(181, 147, 'cash', 1897.00, 'Cash payment', '2025-08-12 11:15:28', '2025-08-12 11:15:28'),
(182, 148, 'cash', 704.00, 'Cash payment', '2025-08-12 11:24:43', '2025-08-12 11:24:43'),
(183, 149, 'cash', 78.00, 'Cash payment', '2025-08-12 11:52:50', '2025-08-12 11:52:50'),
(184, 150, 'wallet', 720.00, 'Wallet credit (due) payment', '2025-08-12 11:59:21', '2025-08-12 11:59:21'),
(185, 151, 'cash', 110.00, 'Cash payment', '2025-08-12 12:19:50', '2025-08-12 12:19:50'),
(186, 152, 'cash', 14.00, 'Cash payment', '2025-08-12 12:21:54', '2025-08-12 12:21:54'),
(187, 153, 'cash', 102.00, 'Cash payment', '2025-08-12 13:37:34', '2025-08-12 13:37:34'),
(188, 154, 'cash', 111.00, 'Cash payment', '2025-08-12 14:32:03', '2025-08-12 14:32:03'),
(189, 155, 'cash', 24.00, 'Cash payment', '2025-08-12 14:47:01', '2025-08-12 14:47:01'),
(190, 156, 'cash', 230.00, 'Cash payment', '2025-08-12 14:53:53', '2025-08-12 14:53:53'),
(191, 157, 'cash', 288.00, 'Cash payment', '2025-08-12 15:10:43', '2025-08-12 15:10:43'),
(192, 158, 'wallet', 3028.00, 'Wallet credit (due) payment', '2025-08-13 09:18:18', '2025-08-13 09:18:18'),
(193, 159, 'wallet', 776.00, 'Wallet credit (due) payment', '2025-08-13 09:39:14', '2025-08-13 09:39:14'),
(194, 160, 'cash', 79.00, 'Cash payment', '2025-08-13 10:08:40', '2025-08-13 10:08:40'),
(195, 161, 'cash', 326.00, 'Cash payment', '2025-08-13 10:29:06', '2025-08-13 10:29:06'),
(196, 162, 'cash', 244.00, 'Cash payment', '2025-08-13 11:22:56', '2025-08-13 11:22:56'),
(197, 163, 'cash', 239.00, 'Cash payment', '2025-08-13 11:41:42', '2025-08-13 11:41:42'),
(198, 164, 'wallet', 6456.00, 'Wallet credit (due) payment', '2025-08-13 11:49:56', '2025-08-13 11:49:56'),
(199, 165, 'cash', 80.00, 'Cash payment', '2025-08-13 13:28:53', '2025-08-13 13:28:53'),
(200, 166, 'wallet', 5711.00, 'Wallet credit (due) payment', '2025-08-13 13:37:17', '2025-08-13 13:37:17'),
(201, 167, 'wallet', 1425.00, 'Wallet credit (due) payment', '2025-08-13 14:07:29', '2025-08-13 14:07:29'),
(202, 168, 'cash', 456.00, 'Cash payment', '2025-08-13 14:09:42', '2025-08-13 14:09:42'),
(203, 169, 'cash', 192.00, 'Cash payment', '2025-08-13 15:25:29', '2025-08-13 15:25:29'),
(204, 170, 'wallet', 445.00, 'Wallet credit (due) payment', '2025-08-13 15:56:39', '2025-08-13 15:56:39'),
(205, 171, 'wallet', 1628.00, 'Wallet credit (due) payment', '2025-08-13 16:09:41', '2025-08-13 16:09:41'),
(206, 172, 'wallet', 1480.00, 'Wallet credit (due) payment', '2025-08-14 07:37:38', '2025-08-14 07:37:38'),
(207, 173, 'wallet', 330.00, 'Wallet credit (due) payment', '2025-08-14 07:58:36', '2025-08-14 07:58:36'),
(208, 174, 'wallet', 920.00, 'Wallet credit (due) payment', '2025-08-14 08:02:17', '2025-08-14 08:02:17'),
(209, 175, 'cash', 105.00, 'Cash payment', '2025-08-14 11:04:45', '2025-08-14 11:04:45'),
(210, 176, 'wallet', 2737.00, 'Wallet credit (due) payment', '2025-08-14 12:07:09', '2025-08-14 12:07:09'),
(211, 177, 'cash', 1001.00, 'Cash payment', '2025-08-14 12:19:40', '2025-08-14 12:19:40'),
(212, 178, 'cash', 14.00, 'Cash payment', '2025-08-14 12:43:00', '2025-08-14 12:43:00'),
(213, 179, 'cash', 39.00, 'Cash payment', '2025-08-14 14:03:14', '2025-08-14 14:03:14'),
(214, 180, 'cash', 128.00, 'Cash payment', '2025-08-14 14:35:17', '2025-08-14 14:35:17');

-- --------------------------------------------------------

--
-- Table structure for table `sale_items`
--

CREATE TABLE `sale_items` (
  `id` bigint UNSIGNED NOT NULL,
  `sale_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `qty` decimal(10,2) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `discount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `tax` decimal(10,2) NOT NULL DEFAULT '0.00',
  `purchase_price` decimal(10,2) DEFAULT NULL,
  `last_purchase_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sale_items`
--

INSERT INTO `sale_items` (`id`, `sale_id`, `product_id`, `qty`, `price`, `subtotal`, `created_at`, `updated_at`, `discount`, `tax`, `purchase_price`, `last_purchase_price`) VALUES
(73, 39, 15, 80.00, 9.00, 720.00, '2025-08-02 08:51:48', '2025-08-02 08:51:48', 0.00, 0.00, 8.80, NULL),
(74, 40, 78, 10.00, 25.00, 250.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 23.50, NULL),
(75, 40, 86, 24.00, 10.50, 252.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 9.50, NULL),
(76, 40, 118, 12.00, 22.00, 264.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 19.00, NULL),
(77, 40, 76, 10.00, 15.00, 150.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 13.50, NULL),
(78, 40, 84, 10.00, 20.50, 205.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 18.00, NULL),
(79, 40, 202, 20.00, 10.00, 200.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 9.00, NULL),
(80, 40, 120, 20.00, 13.50, 270.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 13.00, NULL),
(81, 40, 43, 5.00, 15.00, 75.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 13.50, NULL),
(82, 40, 44, 5.00, 16.00, 80.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 14.50, NULL),
(83, 40, 58, 5.00, 14.00, 70.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 12.70, NULL),
(84, 40, 57, 5.00, 14.00, 70.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 12.50, NULL),
(85, 40, 56, 5.00, 14.00, 70.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 12.70, NULL),
(86, 40, 92, 20.00, 14.50, 290.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 14.00, NULL),
(87, 40, 34, 5.00, 15.75, 78.75, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 14.65, NULL),
(88, 40, 33, 5.00, 10.50, 52.50, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 9.75, NULL),
(89, 40, 156, 10.00, 20.00, 200.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 18.60, NULL),
(90, 40, 61, 10.00, 16.00, 160.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 16.00, NULL),
(91, 40, 121, 10.00, 10.50, 105.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 9.75, NULL),
(92, 40, 122, 10.00, 10.00, 100.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 9.00, NULL),
(93, 40, 48, 5.00, 10.00, 50.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 9.00, NULL),
(94, 40, 53, 5.00, 13.00, 65.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 11.75, NULL),
(95, 40, 124, 10.00, 11.00, 110.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 10.00, NULL),
(96, 40, 209, 12.00, 7.50, 90.00, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 6.90, NULL),
(97, 40, 195, 18.00, 9.75, 175.50, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 8.50, NULL),
(98, 40, 192, 18.00, 9.75, 175.50, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 8.50, NULL),
(99, 40, 191, 18.00, 9.75, 175.50, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 8.50, NULL),
(100, 40, 193, 18.00, 9.75, 175.50, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 0.00, 0.00, 8.50, NULL),
(101, 41, 33, 5.00, 10.50, 52.50, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 9.75, NULL),
(102, 41, 124, 10.00, 11.00, 110.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 10.00, NULL),
(103, 41, 76, 15.00, 15.00, 225.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 13.50, NULL),
(104, 41, 202, 5.00, 10.00, 50.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 9.00, NULL),
(105, 41, 86, 12.00, 10.50, 126.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 9.50, NULL),
(106, 41, 91, 5.00, 15.00, 75.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 14.00, NULL),
(107, 41, 92, 10.00, 15.00, 150.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 14.00, NULL),
(108, 41, 195, 10.00, 10.00, 100.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 8.50, NULL),
(109, 41, 192, 10.00, 10.00, 100.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 8.50, NULL),
(110, 41, 50, 5.00, 15.00, 75.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 13.62, NULL),
(111, 41, 205, 5.00, 13.00, 65.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 12.60, NULL),
(112, 41, 112, 5.00, 20.00, 100.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 19.50, NULL),
(113, 41, 110, 5.00, 14.40, 72.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 14.04, NULL),
(114, 41, 116, 5.00, 14.40, 72.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 14.04, NULL),
(115, 41, 104, 5.00, 17.60, 88.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 17.16, NULL),
(116, 41, 111, 5.00, 20.00, 100.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 19.50, NULL),
(117, 41, 120, 10.00, 13.50, 135.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 13.00, NULL),
(118, 41, 88, 5.00, 25.30, 126.50, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 23.76, NULL),
(119, 41, 87, 5.00, 25.30, 126.50, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 24.20, NULL),
(120, 41, 16, 5.00, 25.30, 126.50, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 24.30, NULL),
(121, 41, 28, 3.00, 24.00, 72.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 22.00, NULL),
(122, 41, 29, 3.00, 24.00, 72.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 22.00, NULL),
(123, 41, 220, 6.00, 9.50, 57.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 8.00, NULL),
(124, 41, 22, 5.00, 18.40, 92.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 17.60, NULL),
(125, 41, 119, 8.00, 10.50, 84.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 10.00, NULL),
(126, 41, 21, 5.00, 17.25, 86.25, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 16.50, NULL),
(127, 41, 19, 5.00, 19.55, 97.75, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 18.70, NULL),
(128, 41, 79, 10.00, 15.00, 150.00, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 0.00, 0.00, 14.25, NULL),
(129, 42, 86, 2.00, 12.00, 24.00, '2025-08-04 11:13:35', '2025-08-04 11:13:35', 0.00, 0.00, 9.50, NULL),
(130, 42, 38, 1.00, 11.00, 11.00, '2025-08-04 11:13:35', '2025-08-04 11:13:35', 0.00, 0.00, 9.00, NULL),
(131, 42, 116, 1.00, 15.30, 15.30, '2025-08-04 11:13:35', '2025-08-04 11:13:35', 0.00, 0.00, 14.04, NULL),
(132, 42, 29, 1.00, 25.00, 25.00, '2025-08-04 11:13:35', '2025-08-04 11:13:35', 0.00, 0.00, 22.00, NULL),
(133, 42, 221, 6.00, 11.00, 66.00, '2025-08-04 11:13:35', '2025-08-04 11:13:35', 0.00, 0.00, 8.75, NULL),
(134, 43, 194, 1.00, 11.50, 11.50, '2025-08-04 11:18:19', '2025-08-04 11:18:19', 0.00, 0.00, 8.50, NULL),
(135, 43, 221, 1.00, 11.00, 11.00, '2025-08-04 11:18:19', '2025-08-04 11:18:19', 0.00, 0.00, 8.75, NULL),
(136, 43, 124, 1.00, 11.50, 11.50, '2025-08-04 11:18:19', '2025-08-04 11:18:19', 0.00, 0.00, 10.00, NULL),
(137, 43, 116, 1.00, 15.30, 15.30, '2025-08-04 11:18:19', '2025-08-04 11:18:19', 0.00, 0.00, 14.04, NULL),
(138, 43, 69, 1.00, 12.00, 12.00, '2025-08-04 11:18:19', '2025-08-04 11:18:19', 0.00, 0.00, 9.50, NULL),
(139, 43, 86, 2.00, 12.00, 24.00, '2025-08-04 11:18:19', '2025-08-04 11:18:19', 0.00, 0.00, 9.50, NULL),
(140, 44, 15, 80.00, 9.50, 760.00, '2025-08-04 12:52:43', '2025-08-04 12:52:43', 0.00, 0.00, 8.80, NULL),
(141, 44, 178, 10.00, 7.00, 70.00, '2025-08-04 12:52:43', '2025-08-04 12:52:43', 0.00, 0.00, 6.50, NULL),
(142, 44, 224, 1.00, 23.00, 23.00, '2025-08-04 12:52:43', '2025-08-04 12:52:43', 0.00, 0.00, 22.00, NULL),
(143, 44, 52, 1.00, 9.50, 9.50, '2025-08-04 12:52:43', '2025-08-04 12:52:43', 0.00, 0.00, 8.50, NULL),
(144, 44, 121, 1.00, 11.00, 11.00, '2025-08-04 12:52:43', '2025-08-04 12:52:43', 0.00, 0.00, 9.75, NULL),
(145, 45, 27, 15.00, 19.50, 292.50, '2025-08-04 14:12:58', '2025-08-04 14:12:58', 0.00, 0.00, 18.00, NULL),
(146, 45, 29, 30.00, 23.50, 705.00, '2025-08-04 14:12:58', '2025-08-04 14:12:58', 0.00, 0.00, 22.00, NULL),
(147, 45, 80, 30.00, 28.00, 840.00, '2025-08-04 14:12:58', '2025-08-04 14:12:58', 0.00, 0.00, 27.00, NULL),
(148, 45, 38, 30.00, 9.75, 292.50, '2025-08-04 14:12:58', '2025-08-04 14:12:58', 0.00, 0.00, 9.00, NULL),
(149, 45, 86, 24.00, 10.50, 252.00, '2025-08-04 14:12:58', '2025-08-04 14:12:58', 0.00, 0.00, 9.50, NULL),
(150, 45, 120, 30.00, 13.50, 405.00, '2025-08-04 14:12:58', '2025-08-04 14:12:58', 0.00, 0.00, 13.00, NULL),
(151, 45, 76, 15.00, 15.00, 225.00, '2025-08-04 14:12:58', '2025-08-04 14:12:58', 0.00, 0.00, 13.50, NULL),
(152, 45, 90, 40.00, 12.00, 480.00, '2025-08-04 14:12:58', '2025-08-04 14:12:58', 0.00, 0.00, 10.90, NULL),
(153, 46, 106, 1.00, 12.75, 12.75, '2025-08-04 15:16:00', '2025-08-04 15:16:00', 0.00, 0.00, 11.70, NULL),
(154, 46, 115, 1.00, 19.55, 19.55, '2025-08-04 15:16:00', '2025-08-04 15:16:00', 0.00, 0.00, 17.94, NULL),
(155, 46, 111, 1.00, 21.25, 21.25, '2025-08-04 15:16:00', '2025-08-04 15:16:00', 0.00, 0.00, 19.50, NULL),
(156, 46, 110, 1.00, 15.30, 15.30, '2025-08-04 15:16:00', '2025-08-04 15:16:00', 0.00, 0.00, 14.04, NULL),
(157, 46, 112, 1.00, 21.25, 21.25, '2025-08-04 15:16:00', '2025-08-04 15:16:00', 0.00, 0.00, 19.50, NULL),
(158, 46, 105, 1.00, 11.90, 11.90, '2025-08-04 15:16:00', '2025-08-04 15:16:00', 0.00, 0.00, 10.92, NULL),
(159, 46, 114, 1.00, 20.40, 20.40, '2025-08-04 15:16:00', '2025-08-04 15:16:00', 0.00, 0.00, 18.72, NULL),
(160, 46, 116, 1.00, 15.30, 15.30, '2025-08-04 15:16:00', '2025-08-04 15:16:00', 0.00, 0.00, 14.04, NULL),
(161, 46, 109, 1.00, 19.55, 19.55, '2025-08-04 15:16:00', '2025-08-04 15:16:00', 0.00, 0.00, 17.94, NULL),
(162, 46, 100, 1.00, 13.60, 13.60, '2025-08-04 15:16:00', '2025-08-04 15:16:00', 0.00, 0.00, 12.48, NULL),
(163, 46, 99, 1.00, 18.70, 18.70, '2025-08-04 15:16:00', '2025-08-04 15:16:00', 0.00, 0.00, 17.16, NULL),
(164, 46, 102, 1.00, 18.70, 18.70, '2025-08-04 15:16:00', '2025-08-04 15:16:00', 0.00, 0.00, 17.16, NULL),
(165, 46, 107, 1.00, 18.70, 18.70, '2025-08-04 15:16:00', '2025-08-04 15:16:00', 0.00, 0.00, 17.16, NULL),
(166, 46, 108, 1.00, 20.40, 20.40, '2025-08-04 15:16:00', '2025-08-04 15:16:00', 0.00, 0.00, 18.72, NULL),
(167, 46, 113, 1.00, 18.70, 18.70, '2025-08-04 15:16:00', '2025-08-04 15:16:00', 0.00, 0.00, 17.16, NULL),
(168, 46, 104, 1.00, 18.70, 18.70, '2025-08-04 15:16:00', '2025-08-04 15:16:00', 0.00, 0.00, 17.16, NULL),
(169, 46, 103, 1.00, 18.70, 18.70, '2025-08-04 15:16:00', '2025-08-04 15:16:00', 0.00, 0.00, 17.16, NULL),
(170, 47, 15, 160.00, 9.00, 1440.00, '2025-08-04 15:49:00', '2025-08-04 15:49:00', 0.00, 0.00, 8.80, NULL),
(171, 47, 164, 10.00, 17.00, 170.00, '2025-08-04 15:49:00', '2025-08-04 15:49:00', 0.00, 0.00, 22.00, NULL),
(172, 47, 118, 6.00, 22.00, 132.00, '2025-08-04 15:49:00', '2025-08-04 15:49:00', 0.00, 0.00, 19.00, NULL),
(173, 47, 61, 5.00, 17.00, 85.00, '2025-08-04 15:49:00', '2025-08-04 15:49:00', 0.00, 0.00, 16.00, NULL),
(174, 47, 195, 10.00, 10.00, 100.00, '2025-08-04 15:49:00', '2025-08-04 15:49:00', 0.00, 0.00, 8.50, NULL),
(175, 47, 191, 5.00, 10.00, 50.00, '2025-08-04 15:49:00', '2025-08-04 15:49:00', 0.00, 0.00, 8.50, NULL),
(176, 47, 193, 10.00, 10.00, 100.00, '2025-08-04 15:49:00', '2025-08-04 15:49:00', 0.00, 0.00, 8.50, NULL),
(177, 47, 208, 2.00, 13.00, 26.00, '2025-08-04 15:49:00', '2025-08-04 15:49:00', 0.00, 0.00, 12.60, NULL),
(178, 47, 207, 2.00, 13.00, 26.00, '2025-08-04 15:49:00', '2025-08-04 15:49:00', 0.00, 0.00, 12.60, NULL),
(179, 47, 205, 2.00, 13.00, 26.00, '2025-08-04 15:49:00', '2025-08-04 15:49:00', 0.00, 0.00, 12.60, NULL),
(180, 47, 206, 2.00, 13.00, 26.00, '2025-08-04 15:49:00', '2025-08-04 15:49:00', 0.00, 0.00, 12.60, NULL),
(181, 47, 204, 2.00, 13.00, 26.00, '2025-08-04 15:49:00', '2025-08-04 15:49:00', 0.00, 0.00, 12.60, NULL),
(182, 48, 138, 15.00, 14.00, 210.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 13.50, NULL),
(183, 48, 132, 10.00, 10.80, 108.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 10.12, NULL),
(184, 48, 133, 10.00, 14.00, 140.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 10.12, NULL),
(185, 48, 130, 10.00, 17.50, 175.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 16.87, NULL),
(186, 48, 134, 10.00, 14.00, 140.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 13.50, NULL),
(187, 48, 126, 10.00, 5.50, 55.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 5.00, NULL),
(188, 48, 60, 5.00, 18.00, 90.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 18.00, NULL),
(189, 48, 61, 10.00, 16.00, 160.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 16.00, NULL),
(190, 48, 76, 15.00, 15.00, 225.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 13.50, NULL),
(191, 48, 80, 5.00, 28.00, 140.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 27.00, NULL),
(192, 48, 119, 10.00, 10.50, 105.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 10.00, NULL),
(193, 48, 95, 12.00, 14.00, 168.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 14.25, NULL),
(194, 48, 94, 12.00, 14.00, 168.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 13.99, NULL),
(195, 48, 84, 5.00, 20.50, 102.50, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 18.00, NULL),
(196, 48, 209, 5.00, 7.00, 35.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 6.90, NULL),
(197, 48, 122, 5.00, 10.00, 50.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 9.00, NULL),
(198, 48, 123, 5.00, 11.00, 55.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 10.00, NULL),
(199, 48, 205, 5.00, 13.00, 65.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 12.60, NULL),
(200, 48, 221, 9.00, 9.50, 85.50, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 8.75, NULL),
(201, 48, 198, 30.00, 9.60, 288.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 8.50, NULL),
(202, 48, 223, 5.00, 10.50, 52.50, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 8.75, NULL),
(203, 48, 222, 5.00, 10.50, 52.50, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 8.75, NULL),
(204, 48, 91, 15.00, 14.50, 217.50, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 14.00, NULL),
(205, 48, 92, 10.00, 14.50, 145.00, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 14.00, NULL),
(206, 48, 121, 1.00, 9.50, 9.50, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 0.00, 0.00, 9.75, NULL),
(207, 49, 84, 4.00, 22.00, 88.00, '2025-08-04 16:22:54', '2025-08-04 16:22:54', 0.00, 0.00, 18.00, NULL),
(208, 50, 195, 27.00, 10.50, 283.50, '2025-08-04 16:33:37', '2025-08-04 16:33:37', 0.00, 0.00, 8.50, NULL),
(209, 50, 192, 27.00, 10.50, 283.50, '2025-08-04 16:33:37', '2025-08-04 16:33:37', 0.00, 0.00, 8.50, NULL),
(210, 50, 226, 9.00, 10.50, 94.50, '2025-08-04 16:33:37', '2025-08-04 16:33:37', 0.00, 0.00, 8.75, NULL),
(211, 50, 191, 5.00, 10.50, 52.50, '2025-08-04 16:33:37', '2025-08-04 16:33:37', 0.00, 0.00, 8.50, NULL),
(212, 50, 227, 9.00, 10.50, 94.50, '2025-08-04 16:33:37', '2025-08-04 16:33:37', 0.00, 0.00, 8.75, NULL),
(213, 50, 75, 1.00, 11.00, 11.00, '2025-08-04 16:33:37', '2025-08-04 16:33:37', 0.00, 0.00, 9.00, NULL),
(214, 51, 38, 15.00, 10.00, 150.00, '2025-08-04 16:49:42', '2025-08-04 16:49:42', 0.00, 0.00, 9.25, NULL),
(215, 51, 43, 10.00, 15.00, 150.00, '2025-08-04 16:49:42', '2025-08-04 16:49:42', 0.00, 0.00, 13.75, NULL),
(216, 51, 76, 15.00, 15.00, 225.00, '2025-08-04 16:49:42', '2025-08-04 16:49:42', 0.00, 0.00, 13.50, NULL),
(217, 51, 87, 15.00, 25.30, 379.50, '2025-08-04 16:49:42', '2025-08-04 16:49:42', 0.00, 0.00, 24.20, NULL),
(218, 51, 21, 15.00, 17.25, 258.75, '2025-08-04 16:49:42', '2025-08-04 16:49:42', 0.00, 0.00, 16.50, NULL),
(219, 51, 19, 15.00, 19.55, 293.25, '2025-08-04 16:49:42', '2025-08-04 16:49:42', 0.00, 0.00, 18.70, NULL),
(220, 51, 65, 12.00, 10.50, 126.00, '2025-08-04 16:49:42', '2025-08-04 16:49:42', 0.00, 0.00, 9.00, NULL),
(221, 51, 188, 24.00, 8.50, 204.00, '2025-08-04 16:49:42', '2025-08-04 16:49:42', 0.00, 0.00, 7.50, NULL),
(222, 51, 187, 24.00, 8.50, 204.00, '2025-08-04 16:49:42', '2025-08-04 16:49:42', 0.00, 0.00, 7.50, NULL),
(223, 51, 120, 20.00, 13.50, 270.00, '2025-08-04 16:49:42', '2025-08-04 16:49:42', 0.00, 0.00, 13.00, NULL),
(224, 51, 191, 36.00, 10.00, 360.00, '2025-08-04 16:49:42', '2025-08-04 16:49:42', 0.00, 0.00, 8.50, NULL),
(225, 51, 205, 8.00, 13.00, 104.00, '2025-08-04 16:49:42', '2025-08-04 16:49:42', 0.00, 0.00, 12.60, NULL),
(226, 51, 78, 5.00, 25.00, 125.00, '2025-08-04 16:49:42', '2025-08-04 16:49:42', 0.00, 0.00, 23.50, NULL),
(227, 52, 84, 40.00, 20.50, 820.00, '2025-08-04 16:50:22', '2025-08-04 16:50:22', 0.00, 0.00, 18.00, NULL),
(228, 53, 121, 10.00, 10.50, 105.00, '2025-08-04 16:52:03', '2025-08-04 16:52:03', 0.00, 0.00, 9.75, NULL),
(229, 53, 122, 10.00, 10.00, 100.00, '2025-08-04 16:52:03', '2025-08-04 16:52:03', 0.00, 0.00, 9.00, NULL),
(230, 53, 124, 30.00, 10.50, 315.00, '2025-08-04 16:52:03', '2025-08-04 16:52:03', 0.00, 0.00, 10.00, NULL),
(231, 53, 215, 30.00, 10.00, 300.00, '2025-08-04 16:52:03', '2025-08-04 16:52:03', 0.00, 0.00, 9.50, NULL),
(232, 54, 121, 5.00, 10.50, 52.50, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 9.75, NULL),
(233, 54, 61, 10.00, 16.50, 165.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 16.00, NULL),
(234, 54, 75, 16.00, 10.50, 168.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 9.00, NULL),
(235, 54, 73, 12.00, 18.00, 216.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 17.00, NULL),
(236, 54, 58, 5.00, 14.00, 70.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 12.70, NULL),
(237, 54, 57, 10.00, 14.00, 140.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 12.50, NULL),
(238, 54, 56, 5.00, 14.00, 70.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 12.70, NULL),
(239, 54, 84, 10.00, 20.50, 205.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 18.00, NULL),
(240, 54, 119, 40.00, 10.50, 420.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 10.00, NULL),
(241, 54, 120, 50.00, 13.50, 675.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 13.00, NULL),
(242, 54, 50, 10.00, 15.00, 150.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 13.62, NULL),
(243, 54, 86, 12.00, 11.00, 132.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 9.50, NULL),
(244, 54, 53, 5.00, 12.50, 62.50, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 11.75, NULL),
(245, 54, 24, 5.00, 22.00, 110.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 21.60, NULL),
(246, 54, 28, 5.00, 24.00, 120.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 22.00, NULL),
(247, 54, 29, 5.00, 23.50, 117.50, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 22.00, NULL),
(248, 54, 72, 12.00, 13.50, 162.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 13.00, NULL),
(249, 54, 71, 12.00, 14.50, 174.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 13.00, NULL),
(250, 54, 92, 20.00, 15.00, 300.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 14.00, NULL),
(251, 54, 91, 20.00, 15.00, 300.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 14.00, NULL),
(252, 54, 90, 30.00, 11.50, 345.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 10.90, NULL),
(253, 54, 32, 10.00, 10.50, 105.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 9.75, NULL),
(254, 54, 60, 10.00, 18.00, 180.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 18.00, NULL),
(255, 54, 123, 10.00, 11.00, 110.00, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 0.00, 0.00, 10.00, NULL),
(256, 55, 53, 10.00, 12.50, 125.00, '2025-08-05 08:38:47', '2025-08-05 08:38:47', 0.00, 0.00, 11.75, NULL),
(257, 55, 33, 10.00, 10.50, 105.00, '2025-08-05 08:38:47', '2025-08-05 08:38:47', 0.00, 0.00, 9.75, NULL),
(258, 55, 124, 10.00, 11.00, 110.00, '2025-08-05 08:38:47', '2025-08-05 08:38:47', 0.00, 0.00, 10.00, NULL),
(259, 55, 204, 8.00, 13.00, 104.00, '2025-08-05 08:38:47', '2025-08-05 08:38:47', 0.00, 0.00, 12.60, NULL),
(260, 55, 205, 8.00, 13.00, 104.00, '2025-08-05 08:38:47', '2025-08-05 08:38:47', 0.00, 0.00, 12.60, NULL),
(261, 55, 72, 12.00, 13.50, 162.00, '2025-08-05 08:38:47', '2025-08-05 08:38:47', 0.00, 0.00, 13.00, NULL),
(262, 55, 29, 10.00, 24.00, 240.00, '2025-08-05 08:38:47', '2025-08-05 08:38:47', 0.00, 0.00, 22.00, NULL),
(263, 55, 121, 10.00, 10.50, 105.00, '2025-08-05 08:38:47', '2025-08-05 08:38:47', 0.00, 0.00, 9.75, NULL),
(264, 55, 123, 5.00, 11.00, 55.00, '2025-08-05 08:38:47', '2025-08-05 08:38:47', 0.00, 0.00, 10.00, NULL),
(265, 55, 122, 5.00, 10.00, 50.00, '2025-08-05 08:38:47', '2025-08-05 08:38:47', 0.00, 0.00, 9.00, NULL),
(266, 55, 76, 15.00, 15.00, 225.00, '2025-08-05 08:38:47', '2025-08-05 08:38:47', 0.00, 0.00, 13.50, NULL),
(267, 55, 84, 10.00, 20.00, 200.00, '2025-08-05 08:38:47', '2025-08-05 08:38:47', 0.00, 0.00, 18.00, NULL),
(268, 55, 119, 8.00, 10.50, 84.00, '2025-08-05 08:38:47', '2025-08-05 08:38:47', 0.00, 0.00, 10.00, NULL),
(269, 55, 120, 10.00, 13.50, 135.00, '2025-08-05 08:38:47', '2025-08-05 08:38:47', 0.00, 0.00, 13.00, NULL),
(270, 55, 156, 5.00, 20.00, 100.00, '2025-08-05 08:38:47', '2025-08-05 08:38:47', 0.00, 0.00, 18.60, NULL),
(271, 56, 138, 1.00, 14.50, 14.50, '2025-08-05 09:32:12', '2025-08-05 09:32:12', 0.00, 0.00, 13.50, NULL),
(272, 56, 131, 1.00, 18.15, 18.15, '2025-08-05 09:32:12', '2025-08-05 09:32:12', 0.00, 0.00, 16.87, NULL),
(273, 56, 130, 1.00, 18.15, 18.15, '2025-08-05 09:32:12', '2025-08-05 09:32:12', 0.00, 0.00, 16.87, NULL),
(274, 57, 15, 10.00, 10.00, 100.00, '2025-08-05 09:32:58', '2025-08-05 09:32:58', 0.00, 0.00, 8.80, NULL),
(275, 57, 93, 2.00, 50.00, 100.00, '2025-08-05 09:32:58', '2025-08-05 09:32:58', 0.00, 0.00, 44.00, NULL),
(276, 58, 103, 1.00, 18.70, 18.70, '2025-08-05 09:38:50', '2025-08-05 09:38:50', 0.00, 0.00, 17.16, NULL),
(277, 58, 106, 1.00, 12.75, 12.75, '2025-08-05 09:38:50', '2025-08-05 09:38:50', 0.00, 0.00, 11.70, NULL),
(278, 58, 112, 1.00, 21.25, 21.25, '2025-08-05 09:38:50', '2025-08-05 09:38:50', 0.00, 0.00, 19.50, NULL),
(279, 58, 38, 1.00, 11.00, 11.00, '2025-08-05 09:38:50', '2025-08-05 09:38:50', 0.00, 0.00, 9.25, NULL),
(280, 58, 121, 2.00, 11.00, 22.00, '2025-08-05 09:38:50', '2025-08-05 09:38:50', 0.00, 0.00, 9.75, NULL),
(281, 58, 163, 1.00, 60.00, 60.00, '2025-08-05 09:38:50', '2025-08-05 09:38:50', 0.00, 0.00, 54.00, NULL),
(282, 58, 44, 1.00, 17.00, 17.00, '2025-08-05 09:38:50', '2025-08-05 09:38:50', 0.00, 0.00, 14.50, NULL),
(283, 58, 72, 1.00, 15.00, 15.00, '2025-08-05 09:38:50', '2025-08-05 09:38:50', 0.00, 0.00, 13.00, NULL),
(284, 58, 86, 1.00, 12.00, 12.00, '2025-08-05 09:38:50', '2025-08-05 09:38:50', 0.00, 0.00, 9.50, NULL),
(285, 58, 15, 5.00, 10.00, 50.00, '2025-08-05 09:38:50', '2025-08-05 09:38:50', 0.00, 0.00, 8.80, NULL),
(286, 59, 15, 3.00, 10.00, 30.00, '2025-08-05 09:42:19', '2025-08-05 09:42:19', 0.00, 0.00, 8.80, NULL),
(287, 59, 38, 1.00, 11.00, 11.00, '2025-08-05 09:42:19', '2025-08-05 09:42:19', 0.00, 0.00, 9.25, NULL),
(288, 59, 118, 1.00, 24.00, 24.00, '2025-08-05 09:42:19', '2025-08-05 09:42:19', 0.00, 0.00, 19.00, NULL),
(289, 60, 122, 1.00, 10.00, 10.00, '2025-08-05 10:47:34', '2025-08-05 10:47:34', 0.00, 0.00, 9.00, NULL),
(290, 60, 121, 6.00, 10.50, 63.00, '2025-08-05 10:47:34', '2025-08-05 10:47:34', 0.00, 0.00, 9.75, NULL),
(291, 60, 120, 3.00, 13.00, 39.00, '2025-08-05 10:47:34', '2025-08-05 10:47:34', 0.00, 0.00, 13.00, NULL),
(292, 60, 123, 4.00, 11.00, 44.00, '2025-08-05 10:47:34', '2025-08-05 10:47:34', 0.00, 0.00, 10.00, NULL),
(293, 60, 38, 3.00, 10.00, 30.00, '2025-08-05 10:47:34', '2025-08-05 10:47:34', 0.00, 0.00, 9.25, NULL),
(294, 60, 215, 3.00, 10.50, 31.50, '2025-08-05 10:47:34', '2025-08-05 10:47:34', 0.00, 0.00, 9.50, NULL),
(295, 60, 33, 2.00, 10.50, 21.00, '2025-08-05 10:47:34', '2025-08-05 10:47:34', 0.00, 0.00, 9.75, NULL),
(296, 60, 76, 4.00, 15.00, 60.00, '2025-08-05 10:47:34', '2025-08-05 10:47:34', 0.00, 0.00, 13.50, NULL),
(297, 60, 77, 3.00, 25.00, 75.00, '2025-08-05 10:47:34', '2025-08-05 10:47:34', 0.00, 0.00, 23.50, NULL),
(298, 60, 78, 3.00, 25.00, 75.00, '2025-08-05 10:47:34', '2025-08-05 10:47:34', 0.00, 0.00, 23.50, NULL),
(299, 60, 198, 3.00, 9.60, 28.80, '2025-08-05 10:47:34', '2025-08-05 10:47:34', 0.00, 0.00, 8.50, NULL),
(300, 60, 119, 4.00, 10.50, 42.00, '2025-08-05 10:47:34', '2025-08-05 10:47:34', 0.00, 0.00, 10.00, NULL),
(301, 61, 33, 10.00, 10.00, 100.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 9.75, NULL),
(302, 61, 124, 20.00, 10.50, 210.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 10.00, NULL),
(303, 61, 29, 20.00, 23.00, 460.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 22.00, NULL),
(304, 61, 28, 10.00, 23.00, 230.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 22.00, NULL),
(305, 61, 53, 10.00, 12.00, 120.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 11.75, NULL),
(306, 61, 72, 30.00, 13.50, 405.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 13.00, NULL),
(307, 61, 123, 10.00, 10.50, 105.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 10.00, NULL),
(308, 61, 32, 20.00, 10.00, 200.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 9.75, NULL),
(309, 61, 43, 10.00, 14.50, 145.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 13.75, NULL),
(310, 61, 160, 10.00, 14.00, 140.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 13.50, NULL),
(311, 61, 75, 32.00, 10.00, 320.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 9.00, NULL),
(312, 61, 73, 12.00, 18.00, 216.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 17.00, NULL),
(313, 61, 84, 20.00, 19.50, 390.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 18.00, NULL),
(314, 62, 33, 10.00, 10.00, 100.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 9.75, NULL),
(315, 62, 124, 20.00, 10.50, 210.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 10.00, NULL),
(316, 62, 29, 20.00, 23.00, 460.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 22.00, NULL),
(317, 62, 28, 10.00, 23.00, 230.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 22.00, NULL),
(318, 62, 53, 10.00, 12.00, 120.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 11.75, NULL),
(319, 62, 72, 30.00, 13.50, 405.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 13.00, NULL),
(320, 62, 123, 10.00, 10.50, 105.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 10.00, NULL),
(321, 62, 32, 20.00, 10.00, 200.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 9.75, NULL),
(322, 62, 43, 10.00, 14.50, 145.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 13.75, NULL),
(323, 62, 160, 10.00, 14.00, 140.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 13.50, NULL),
(324, 62, 75, 32.00, 10.00, 320.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 9.00, NULL),
(325, 62, 73, 12.00, 18.00, 216.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 17.00, NULL),
(326, 62, 84, 20.00, 19.50, 390.00, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 0.00, 0.00, 18.00, NULL),
(327, 63, 69, 4.00, 12.00, 48.00, '2025-08-05 11:45:43', '2025-08-05 11:45:43', 0.00, 0.00, 9.50, NULL),
(328, 63, 70, 4.00, 12.00, 48.00, '2025-08-05 11:45:43', '2025-08-05 11:45:43', 0.00, 0.00, 10.00, NULL),
(329, 63, 119, 4.00, 12.50, 50.00, '2025-08-05 11:45:43', '2025-08-05 11:45:43', 0.00, 0.00, 10.00, NULL),
(330, 63, 121, 1.00, 11.00, 11.00, '2025-08-05 11:45:43', '2025-08-05 11:45:43', 0.00, 0.00, 9.75, NULL),
(331, 63, 123, 1.00, 11.50, 11.50, '2025-08-05 11:45:43', '2025-08-05 11:45:43', 0.00, 0.00, 10.00, NULL),
(332, 63, 71, 1.00, 15.00, 15.00, '2025-08-05 11:45:43', '2025-08-05 11:45:43', 0.00, 0.00, 13.00, NULL),
(333, 63, 122, 1.00, 11.00, 11.00, '2025-08-05 11:45:43', '2025-08-05 11:45:43', 0.00, 0.00, 9.00, NULL),
(334, 63, 243, 1.00, 12.00, 12.00, '2025-08-05 11:45:43', '2025-08-05 11:45:43', 0.00, 0.00, 10.00, NULL),
(335, 63, 92, 1.00, 16.00, 16.00, '2025-08-05 11:45:43', '2025-08-05 11:45:43', 0.00, 0.00, 14.00, NULL),
(336, 63, 53, 2.00, 15.00, 30.00, '2025-08-05 11:45:43', '2025-08-05 11:45:43', 0.00, 0.00, 11.75, NULL),
(337, 63, 72, 1.00, 15.00, 15.00, '2025-08-05 11:45:43', '2025-08-05 11:45:43', 0.00, 0.00, 13.00, NULL),
(338, 63, 181, 2.00, 5.00, 10.00, '2025-08-05 11:45:43', '2025-08-05 11:45:43', 0.00, 0.00, 4.00, NULL),
(339, 63, 179, 2.00, 5.00, 10.00, '2025-08-05 11:45:43', '2025-08-05 11:45:43', 0.00, 0.00, 4.00, NULL),
(340, 63, 180, 2.00, 5.00, 10.00, '2025-08-05 11:45:43', '2025-08-05 11:45:43', 0.00, 0.00, 4.00, NULL),
(341, 63, 182, 2.00, 5.00, 10.00, '2025-08-05 11:45:43', '2025-08-05 11:45:43', 0.00, 0.00, 4.00, NULL),
(342, 63, 183, 2.00, 5.00, 10.00, '2025-08-05 11:45:43', '2025-08-05 11:45:43', 0.00, 0.00, 4.00, NULL),
(343, 64, 38, 1.00, 11.00, 11.00, '2025-08-05 12:04:36', '2025-08-05 12:04:36', 0.00, 0.00, 9.25, NULL),
(344, 64, 43, 1.00, 16.00, 16.00, '2025-08-05 12:04:36', '2025-08-05 12:04:36', 0.00, 0.00, 13.75, NULL),
(345, 64, 233, 1.00, 10.00, 10.00, '2025-08-05 12:04:36', '2025-08-05 12:04:36', 0.00, 0.00, 8.75, NULL),
(346, 65, 15, 160.00, 9.00, 1440.00, '2025-08-05 12:08:08', '2025-08-05 12:08:08', 0.00, 0.00, 8.80, NULL),
(347, 66, 29, 1.00, 25.00, 25.00, '2025-08-05 13:06:52', '2025-08-05 13:06:52', 0.00, 0.00, 22.00, NULL),
(348, 66, 72, 1.00, 15.00, 15.00, '2025-08-05 13:06:52', '2025-08-05 13:06:52', 0.00, 0.00, 13.00, NULL),
(349, 66, 32, 1.00, 11.00, 11.00, '2025-08-05 13:06:52', '2025-08-05 13:06:52', 0.00, 0.00, 9.75, NULL),
(350, 66, 44, 1.00, 17.00, 17.00, '2025-08-05 13:06:52', '2025-08-05 13:06:52', 0.00, 0.00, 14.50, NULL),
(351, 66, 91, 2.00, 16.00, 32.00, '2025-08-05 13:06:52', '2025-08-05 13:06:52', 0.00, 0.00, 14.00, NULL),
(352, 67, 69, 1.00, 12.00, 12.00, '2025-08-05 13:52:34', '2025-08-05 13:52:34', 0.00, 0.00, 9.50, NULL),
(353, 67, 15, 8.00, 10.00, 80.00, '2025-08-05 13:52:34', '2025-08-05 13:52:34', 0.00, 0.00, 8.80, NULL),
(354, 67, 22, 1.00, 19.20, 19.20, '2025-08-05 13:52:34', '2025-08-05 13:52:34', 0.00, 0.00, 17.60, NULL),
(355, 67, 121, 1.00, 11.00, 11.00, '2025-08-05 13:52:34', '2025-08-05 13:52:34', 0.00, 0.00, 9.75, NULL),
(356, 67, 57, 1.00, 15.00, 15.00, '2025-08-05 13:52:34', '2025-08-05 13:52:34', 0.00, 0.00, 12.50, NULL),
(357, 67, 118, 1.00, 24.00, 24.00, '2025-08-05 13:52:34', '2025-08-05 13:52:34', 0.00, 0.00, 19.00, NULL),
(358, 67, 84, 1.00, 22.00, 22.00, '2025-08-05 13:52:34', '2025-08-05 13:52:34', 0.00, 0.00, 18.00, NULL),
(359, 68, 71, 12.00, 14.50, 174.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 13.00, NULL),
(360, 68, 204, 8.00, 13.00, 104.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 12.60, NULL),
(361, 68, 205, 8.00, 13.00, 104.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 12.60, NULL),
(362, 68, 112, 10.00, 20.00, 200.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 19.50, NULL),
(363, 68, 111, 15.00, 20.00, 300.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 19.50, NULL),
(364, 68, 107, 5.00, 17.60, 88.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 17.16, NULL),
(365, 68, 104, 5.00, 17.60, 88.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 17.16, NULL),
(366, 68, 197, 10.00, 9.00, 90.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 8.50, NULL),
(367, 68, 34, 5.00, 15.00, 75.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 14.65, NULL),
(368, 68, 32, 10.00, 10.50, 105.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 9.75, NULL),
(369, 68, 38, 10.00, 10.00, 100.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 9.25, NULL),
(370, 68, 76, 20.00, 15.00, 300.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 13.50, NULL),
(371, 68, 118, 30.00, 22.00, 660.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 19.00, NULL),
(372, 68, 86, 12.00, 11.00, 132.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 9.50, NULL),
(373, 68, 43, 5.00, 15.00, 75.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 13.75, NULL),
(374, 68, 44, 5.00, 16.00, 80.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 14.50, NULL),
(375, 68, 73, 12.00, 18.50, 222.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 17.00, NULL),
(376, 68, 75, 16.00, 10.50, 168.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 9.00, NULL),
(377, 68, 57, 5.00, 14.00, 70.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 12.50, NULL),
(378, 68, 56, 5.00, 14.00, 70.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 12.70, NULL),
(379, 68, 60, 10.00, 18.00, 180.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 18.00, NULL),
(380, 68, 198, 32.00, 9.60, 307.20, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 8.50, NULL),
(381, 68, 120, 20.00, 13.50, 270.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 13.00, NULL),
(382, 68, 119, 8.00, 10.50, 84.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 10.00, NULL),
(383, 68, 92, 20.00, 15.00, 300.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 14.00, NULL),
(384, 68, 91, 15.00, 15.00, 225.00, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 0.00, 0.00, 14.00, NULL),
(385, 69, 224, 1.00, 24.00, 24.00, '2025-08-05 14:58:11', '2025-08-05 14:58:11', 0.00, 0.00, 22.00, NULL),
(386, 69, 198, 1.00, 11.00, 11.00, '2025-08-05 14:58:11', '2025-08-05 14:58:11', 0.00, 0.00, 8.50, NULL),
(387, 69, 65, 1.00, 12.00, 12.00, '2025-08-05 14:58:11', '2025-08-05 14:58:11', 0.00, 0.00, 9.00, NULL),
(388, 70, 165, 1.00, 10.00, 10.00, '2025-08-05 15:15:46', '2025-08-05 15:15:46', 0.00, 0.00, 9.00, NULL),
(389, 70, 245, 1.00, 13.00, 13.00, '2025-08-05 15:15:46', '2025-08-05 15:15:46', 0.00, 0.00, 11.60, NULL),
(390, 70, 244, 1.00, 13.00, 13.00, '2025-08-05 15:15:46', '2025-08-05 15:15:46', 0.00, 0.00, 11.60, NULL),
(391, 70, 91, 1.00, 16.00, 16.00, '2025-08-05 15:15:46', '2025-08-05 15:15:46', 0.00, 0.00, 14.00, NULL),
(392, 70, 92, 1.00, 16.00, 16.00, '2025-08-05 15:15:46', '2025-08-05 15:15:46', 0.00, 0.00, 14.00, NULL),
(393, 70, 119, 1.00, 12.50, 12.50, '2025-08-05 15:15:46', '2025-08-05 15:15:46', 0.00, 0.00, 10.00, NULL),
(394, 70, 89, 1.00, 11.00, 11.00, '2025-08-05 15:15:46', '2025-08-05 15:15:46', 0.00, 0.00, 10.00, NULL),
(395, 70, 78, 1.00, 30.00, 30.00, '2025-08-05 15:15:46', '2025-08-05 15:15:46', 0.00, 0.00, 23.50, NULL),
(396, 70, 161, 1.00, 24.00, 24.00, '2025-08-05 15:15:46', '2025-08-05 15:15:46', 0.00, 0.00, 22.32, NULL),
(397, 70, 162, 1.00, 32.00, 32.00, '2025-08-05 15:15:46', '2025-08-05 15:15:46', 0.00, 0.00, 29.76, NULL),
(398, 71, 84, 30.00, 19.50, 585.00, '2025-08-05 15:30:11', '2025-08-05 15:30:11', 0.00, 0.00, 18.00, NULL),
(399, 71, 202, 40.00, 10.00, 400.00, '2025-08-05 15:30:11', '2025-08-05 15:30:11', 0.00, 0.00, 9.00, NULL),
(400, 71, 57, 15.00, 14.00, 210.00, '2025-08-05 15:30:11', '2025-08-05 15:30:11', 0.00, 0.00, 12.50, NULL),
(401, 71, 56, 15.00, 14.00, 210.00, '2025-08-05 15:30:11', '2025-08-05 15:30:11', 0.00, 0.00, 12.70, NULL),
(402, 71, 121, 20.00, 10.50, 210.00, '2025-08-05 15:30:11', '2025-08-05 15:30:11', 0.00, 0.00, 9.75, NULL),
(403, 71, 215, 20.00, 10.50, 210.00, '2025-08-05 15:30:11', '2025-08-05 15:30:11', 0.00, 0.00, 9.50, NULL),
(404, 71, 33, 20.00, 10.50, 210.00, '2025-08-05 15:30:11', '2025-08-05 15:30:11', 0.00, 0.00, 9.75, NULL),
(405, 71, 32, 10.00, 10.50, 105.00, '2025-08-05 15:30:11', '2025-08-05 15:30:11', 0.00, 0.00, 9.75, NULL),
(406, 72, 92, 50.00, 15.00, 750.00, '2025-08-05 15:44:20', '2025-08-05 15:44:20', 0.00, 0.00, 14.00, NULL),
(407, 72, 91, 50.00, 15.00, 750.00, '2025-08-05 15:44:20', '2025-08-05 15:44:20', 0.00, 0.00, 14.00, NULL),
(408, 72, 197, 10.00, 9.00, 90.00, '2025-08-05 15:44:20', '2025-08-05 15:44:20', 0.00, 0.00, 8.50, NULL),
(409, 73, 202, 1.00, 10.00, 10.00, '2025-08-05 16:47:38', '2025-08-05 16:47:38', 0.00, 0.00, 9.00, NULL),
(410, 73, 183, 1.00, 4.00, 4.00, '2025-08-05 16:47:38', '2025-08-05 16:47:38', 0.00, 0.00, 4.00, NULL),
(411, 74, 181, 1.00, 5.00, 5.00, '2025-08-05 17:15:22', '2025-08-05 17:15:22', 0.00, 0.00, 4.00, NULL),
(412, 75, 177, 54.00, 6.50, 351.00, '2025-08-06 08:38:16', '2025-08-06 08:38:16', 0.00, 0.00, 6.70, NULL),
(413, 76, 15, 20.00, 9.50, 190.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 8.80, NULL),
(414, 76, 177, 10.00, 7.00, 70.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 6.70, NULL),
(415, 76, 176, 2.00, 7.50, 15.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 6.50, NULL),
(416, 76, 17, 3.00, 20.70, 62.10, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 19.70, NULL),
(417, 76, 22, 5.00, 18.40, 92.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 17.60, NULL),
(418, 76, 87, 6.00, 25.30, 151.80, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 24.20, NULL),
(419, 76, 112, 1.00, 20.00, 20.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 19.50, NULL),
(420, 76, 111, 1.00, 19.99, 19.99, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 19.50, NULL),
(421, 76, 103, 1.00, 17.60, 17.60, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 17.16, NULL),
(422, 76, 91, 4.00, 15.50, 62.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 14.85, NULL),
(423, 76, 192, 2.00, 10.00, 20.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 8.50, NULL),
(424, 76, 195, 3.00, 10.00, 30.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 8.50, NULL),
(425, 76, 187, 6.00, 8.50, 51.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 7.50, NULL),
(426, 76, 188, 2.00, 8.50, 17.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 7.50, NULL),
(427, 76, 186, 1.00, 8.50, 8.50, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 7.50, NULL),
(428, 76, 84, 2.00, 20.50, 41.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 18.00, NULL),
(429, 76, 202, 1.00, 10.00, 10.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 9.00, NULL),
(430, 76, 79, 1.00, 15.00, 15.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 14.25, NULL),
(431, 76, 215, 1.00, 10.50, 10.50, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 9.50, NULL),
(432, 76, 33, 2.00, 10.50, 21.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 9.75, NULL),
(433, 76, 118, 4.00, 21.00, 84.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 19.00, NULL),
(434, 76, 80, 1.00, 28.00, 28.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 27.00, NULL),
(435, 76, 156, 1.00, 20.00, 20.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 18.60, NULL),
(436, 76, 231, 1.00, 11.00, 11.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 9.60, NULL),
(437, 76, 230, 1.00, 14.00, 14.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 12.00, NULL),
(438, 76, 125, 2.00, 5.50, 11.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 5.00, NULL),
(439, 76, 127, 2.00, 5.50, 11.00, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 5.00, NULL),
(440, 76, 126, 3.00, 5.50, 16.50, '2025-08-06 09:00:29', '2025-08-06 09:00:29', 0.00, 0.00, 5.00, NULL),
(441, 76, 95, 1.00, 16.00, 16.00, '2025-08-06 09:00:30', '2025-08-06 09:00:30', 0.00, 0.00, 14.25, NULL),
(442, 76, 94, 1.00, 16.00, 16.00, '2025-08-06 09:00:30', '2025-08-06 09:00:30', 0.00, 0.00, 13.99, NULL),
(443, 76, 229, 1.00, 14.00, 14.00, '2025-08-06 09:00:30', '2025-08-06 09:00:30', 0.00, 0.00, 12.00, NULL),
(444, 76, 228, 1.00, 5.50, 5.50, '2025-08-06 09:00:30', '2025-08-06 09:00:30', 0.00, 0.00, 4.50, NULL),
(445, 76, 175, 1.00, 7.50, 7.50, '2025-08-06 09:00:30', '2025-08-06 09:00:30', 0.00, 0.00, 6.50, NULL),
(446, 76, 154, 1.00, 15.50, 15.50, '2025-08-06 09:00:30', '2025-08-06 09:00:30', 0.00, 0.00, 13.63, NULL),
(447, 76, 51, 2.00, 11.00, 22.00, '2025-08-06 09:00:30', '2025-08-06 09:00:30', 0.00, 0.00, 9.50, NULL),
(448, 76, 162, 1.00, 30.50, 30.50, '2025-08-06 09:00:30', '2025-08-06 09:00:30', 0.00, 0.00, 29.76, NULL),
(449, 77, 15, 80.00, 9.00, 720.00, '2025-08-06 09:28:54', '2025-08-06 09:28:54', 0.00, 0.00, 8.80, NULL),
(450, 77, 148, 2.00, 9.00, 18.00, '2025-08-06 09:28:54', '2025-08-06 09:28:54', 0.00, 0.00, 7.50, NULL),
(451, 77, 144, 2.00, 9.00, 18.00, '2025-08-06 09:28:54', '2025-08-06 09:28:54', 0.00, 0.00, 7.50, NULL),
(452, 77, 109, 1.00, 19.55, 19.55, '2025-08-06 09:28:54', '2025-08-06 09:28:54', 0.00, 0.00, 17.94, NULL),
(453, 77, 114, 1.00, 20.40, 20.40, '2025-08-06 09:28:54', '2025-08-06 09:28:54', 0.00, 0.00, 18.72, NULL),
(454, 77, 104, 1.00, 18.70, 18.70, '2025-08-06 09:28:54', '2025-08-06 09:28:54', 0.00, 0.00, 17.16, NULL),
(455, 77, 107, 1.00, 18.70, 18.70, '2025-08-06 09:28:54', '2025-08-06 09:28:54', 0.00, 0.00, 17.16, NULL),
(456, 77, 38, 2.00, 11.00, 22.00, '2025-08-06 09:28:54', '2025-08-06 09:28:54', 0.00, 0.00, 9.25, NULL),
(457, 78, 70, 2.00, 12.00, 24.00, '2025-08-06 10:50:02', '2025-08-06 10:50:02', 0.00, 0.00, 10.00, NULL),
(458, 78, 28, 1.00, 25.00, 25.00, '2025-08-06 10:50:02', '2025-08-06 10:50:02', 0.00, 0.00, 22.00, NULL),
(459, 78, 192, 3.00, 10.00, 30.00, '2025-08-06 10:50:02', '2025-08-06 10:50:02', 0.00, 0.00, 8.50, NULL),
(460, 78, 195, 3.00, 10.00, 30.00, '2025-08-06 10:50:02', '2025-08-06 10:50:02', 0.00, 0.00, 8.50, NULL),
(461, 78, 226, 2.00, 10.00, 20.00, '2025-08-06 10:50:02', '2025-08-06 10:50:02', 0.00, 0.00, 8.75, NULL),
(462, 79, 15, 86.00, 9.50, 817.00, '2025-08-06 10:54:39', '2025-08-06 10:54:39', 0.00, 0.00, 8.80, NULL),
(463, 79, 192, 2.00, 10.00, 20.00, '2025-08-06 10:54:39', '2025-08-06 10:54:39', 0.00, 0.00, 8.50, NULL),
(464, 79, 231, 22.00, 10.80, 237.60, '2025-08-06 10:54:39', '2025-08-06 10:54:39', 0.00, 0.00, 9.60, NULL),
(465, 79, 195, 2.00, 10.00, 20.00, '2025-08-06 10:54:39', '2025-08-06 10:54:39', 0.00, 0.00, 8.50, NULL),
(466, 79, 191, 2.00, 10.00, 20.00, '2025-08-06 10:54:39', '2025-08-06 10:54:39', 0.00, 0.00, 8.70, NULL),
(467, 79, 226, 2.00, 10.00, 20.00, '2025-08-06 10:54:39', '2025-08-06 10:54:39', 0.00, 0.00, 8.75, NULL),
(468, 80, 86, 1.00, 12.00, 12.00, '2025-08-06 10:56:05', '2025-08-06 10:56:05', 0.00, 0.00, 9.50, NULL),
(469, 80, 80, 1.00, 29.00, 29.00, '2025-08-06 10:56:05', '2025-08-06 10:56:05', 0.00, 0.00, 27.00, NULL),
(470, 80, 79, 1.00, 16.00, 16.00, '2025-08-06 10:56:05', '2025-08-06 10:56:05', 0.00, 0.00, 14.25, NULL),
(471, 80, 76, 1.00, 16.00, 16.00, '2025-08-06 10:56:05', '2025-08-06 10:56:05', 0.00, 0.00, 13.50, NULL),
(472, 80, 156, 1.00, 21.00, 21.00, '2025-08-06 10:56:05', '2025-08-06 10:56:05', 0.00, 0.00, 18.60, NULL),
(473, 81, 198, 8.00, 9.60, 76.80, '2025-08-06 12:27:53', '2025-08-06 12:27:53', 0.00, 0.00, 8.50, NULL),
(474, 81, 91, 5.00, 15.00, 75.00, '2025-08-06 12:27:53', '2025-08-06 12:27:53', 0.00, 0.00, 14.85, NULL),
(475, 81, 107, 3.00, 17.60, 52.80, '2025-08-06 12:27:53', '2025-08-06 12:27:53', 0.00, 0.00, 17.16, NULL),
(476, 81, 111, 3.00, 20.00, 60.00, '2025-08-06 12:27:53', '2025-08-06 12:27:53', 0.00, 0.00, 19.50, NULL),
(477, 81, 118, 6.00, 20.50, 123.00, '2025-08-06 12:27:53', '2025-08-06 12:27:53', 0.00, 0.00, 19.00, NULL),
(478, 81, 76, 10.00, 14.50, 145.00, '2025-08-06 12:27:53', '2025-08-06 12:27:53', 0.00, 0.00, 13.50, NULL),
(479, 82, 70, 25.00, 11.00, 275.00, '2025-08-06 12:48:17', '2025-08-06 12:48:17', 0.00, 0.00, 10.00, NULL),
(480, 82, 69, 10.00, 11.50, 115.00, '2025-08-06 12:48:17', '2025-08-06 12:48:17', 0.00, 0.00, 9.50, NULL),
(481, 82, 27, 10.00, 19.50, 195.00, '2025-08-06 12:48:17', '2025-08-06 12:48:17', 0.00, 0.00, 18.00, NULL),
(482, 82, 28, 10.00, 23.00, 230.00, '2025-08-06 12:48:17', '2025-08-06 12:48:17', 0.00, 0.00, 22.00, NULL),
(483, 82, 192, 72.00, 9.60, 691.20, '2025-08-06 12:48:17', '2025-08-06 12:48:17', 0.00, 0.00, 8.50, NULL),
(484, 82, 195, 36.00, 9.60, 345.60, '2025-08-06 12:48:17', '2025-08-06 12:48:17', 0.00, 0.00, 8.50, NULL),
(485, 82, 191, 36.00, 9.60, 345.60, '2025-08-06 12:48:17', '2025-08-06 12:48:17', 0.00, 0.00, 8.70, NULL),
(486, 82, 226, 36.00, 9.60, 345.60, '2025-08-06 12:48:17', '2025-08-06 12:48:17', 0.00, 0.00, 8.75, NULL),
(487, 82, 227, 36.00, 9.60, 345.60, '2025-08-06 12:48:17', '2025-08-06 12:48:17', 0.00, 0.00, 8.75, NULL),
(488, 83, 76, 10.00, 15.00, 150.00, '2025-08-06 12:49:17', '2025-08-06 12:49:17', 0.00, 0.00, 13.50, NULL),
(489, 84, 86, 12.00, 11.00, 132.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 9.50, NULL),
(490, 84, 77, 5.00, 25.00, 125.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 23.50, NULL),
(491, 84, 118, 6.00, 21.00, 126.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 19.00, NULL),
(492, 84, 28, 10.00, 23.50, 235.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 22.00, NULL),
(493, 84, 91, 10.00, 15.00, 150.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 14.85, NULL),
(494, 84, 57, 5.00, 14.00, 70.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 12.50, NULL),
(495, 84, 56, 5.00, 14.00, 70.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 12.70, NULL),
(496, 84, 43, 10.00, 15.00, 150.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 13.75, NULL),
(497, 84, 133, 10.00, 10.80, 108.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 10.12, NULL),
(498, 84, 134, 10.00, 14.00, 140.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 13.50, NULL),
(499, 84, 130, 10.00, 17.50, 175.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 16.87, NULL),
(500, 84, 200, 15.00, 9.50, 142.50, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 8.86, NULL),
(501, 84, 73, 12.00, 18.00, 216.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 17.00, NULL),
(502, 84, 116, 5.00, 14.40, 72.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 14.04, NULL),
(503, 84, 111, 5.00, 20.00, 100.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 19.50, NULL),
(504, 84, 107, 5.00, 17.60, 88.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 17.16, NULL),
(505, 84, 176, 15.00, 7.00, 105.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 6.50, NULL),
(506, 84, 175, 15.00, 7.00, 105.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 6.50, NULL),
(507, 84, 95, 6.00, 14.00, 84.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 14.25, NULL),
(508, 84, 94, 6.00, 14.00, 84.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 13.99, NULL),
(509, 84, 250, 10.00, 13.00, 130.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 12.50, NULL),
(510, 84, 213, 6.00, 7.50, 45.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 6.90, NULL),
(511, 84, 209, 6.00, 7.50, 45.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 6.75, NULL),
(512, 84, 220, 18.00, 9.00, 162.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 8.00, NULL),
(513, 84, 156, 6.00, 20.00, 120.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 18.60, NULL),
(514, 84, 153, 5.00, 15.00, 75.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 13.63, NULL),
(515, 84, 50, 5.00, 15.00, 75.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 13.62, NULL),
(516, 84, 155, 5.00, 15.00, 75.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 13.63, NULL),
(517, 84, 69, 25.00, 11.50, 287.50, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 9.50, NULL),
(518, 84, 236, 6.00, 9.50, 57.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 8.75, NULL),
(519, 84, 232, 6.00, 9.50, 57.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 8.75, NULL),
(520, 84, 235, 6.00, 9.50, 57.00, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 8.75, NULL),
(521, 84, 198, 16.00, 9.60, 153.60, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 0.00, 0.00, 8.50, NULL),
(522, 85, 119, 1.00, 12.50, 12.50, '2025-08-06 13:40:57', '2025-08-06 13:40:57', 0.00, 0.00, 10.00, NULL),
(523, 85, 202, 1.00, 10.00, 10.00, '2025-08-06 13:40:57', '2025-08-06 13:40:57', 0.00, 0.00, 9.00, NULL),
(524, 85, 209, 1.00, 7.50, 7.50, '2025-08-06 13:40:57', '2025-08-06 13:40:57', 0.00, 0.00, 6.75, NULL),
(525, 85, 15, 7.00, 10.00, 70.00, '2025-08-06 13:40:57', '2025-08-06 13:40:57', 0.00, 0.00, 8.80, NULL),
(526, 86, 222, 1.00, 10.50, 10.50, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 8.75, NULL),
(527, 86, 190, 1.00, 10.50, 10.50, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 5.00, NULL),
(528, 86, 195, 2.00, 10.50, 21.00, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 8.50, NULL),
(529, 86, 191, 1.00, 10.50, 10.50, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 8.70, NULL),
(530, 86, 227, 2.00, 10.50, 21.00, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 8.75, NULL),
(531, 86, 193, 2.00, 10.50, 21.00, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 8.50, NULL),
(532, 86, 226, 2.00, 10.50, 21.00, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 8.75, NULL),
(533, 86, 223, 1.00, 10.50, 10.50, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 8.75, NULL),
(534, 86, 192, 2.00, 10.50, 21.00, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 8.50, NULL),
(535, 86, 61, 1.00, 19.00, 19.00, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 16.00, NULL),
(536, 86, 51, 1.00, 10.50, 10.50, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 9.50, NULL),
(537, 86, 70, 2.00, 12.00, 24.00, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 10.00, NULL),
(538, 86, 69, 1.00, 12.00, 12.00, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 9.50, NULL),
(539, 86, 157, 1.00, 13.50, 13.50, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 11.00, NULL),
(540, 86, 90, 2.00, 13.00, 26.00, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 10.90, NULL),
(541, 86, 80, 1.00, 29.00, 29.00, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 27.00, NULL),
(542, 86, 215, 1.00, 11.00, 11.00, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 9.50, NULL),
(543, 86, 33, 1.00, 11.00, 11.00, '2025-08-06 14:34:40', '2025-08-06 14:34:40', 0.00, 0.00, 9.75, NULL),
(544, 87, 195, 3.00, 10.50, 31.50, '2025-08-06 14:42:58', '2025-08-06 14:42:58', 0.00, 0.00, 8.50, NULL),
(545, 87, 192, 2.00, 10.50, 21.00, '2025-08-06 14:42:58', '2025-08-06 14:42:58', 0.00, 0.00, 8.50, NULL),
(546, 87, 190, 1.00, 10.50, 10.50, '2025-08-06 14:42:58', '2025-08-06 14:42:58', 0.00, 0.00, 5.00, NULL),
(547, 87, 226, 1.00, 10.50, 10.50, '2025-08-06 14:42:58', '2025-08-06 14:42:58', 0.00, 0.00, 8.75, NULL);
INSERT INTO `sale_items` (`id`, `sale_id`, `product_id`, `qty`, `price`, `subtotal`, `created_at`, `updated_at`, `discount`, `tax`, `purchase_price`, `last_purchase_price`) VALUES
(548, 87, 191, 1.00, 10.50, 10.50, '2025-08-06 14:42:58', '2025-08-06 14:42:58', 0.00, 0.00, 8.70, NULL),
(549, 87, 193, 2.00, 10.50, 21.00, '2025-08-06 14:42:58', '2025-08-06 14:42:58', 0.00, 0.00, 8.50, NULL),
(550, 87, 222, 1.00, 10.50, 10.50, '2025-08-06 14:42:58', '2025-08-06 14:42:58', 0.00, 0.00, 8.75, NULL),
(551, 87, 223, 1.00, 10.50, 10.50, '2025-08-06 14:42:58', '2025-08-06 14:42:58', 0.00, 0.00, 8.75, NULL),
(552, 87, 227, 2.00, 10.50, 21.00, '2025-08-06 14:42:58', '2025-08-06 14:42:58', 0.00, 0.00, 8.75, NULL),
(553, 87, 46, 1.00, 18.00, 18.00, '2025-08-06 14:42:58', '2025-08-06 14:42:58', 0.00, 0.00, 16.00, NULL),
(554, 87, 157, 1.00, 13.50, 13.50, '2025-08-06 14:42:58', '2025-08-06 14:42:58', 0.00, 0.00, 11.00, NULL),
(555, 87, 48, 1.00, 11.00, 11.00, '2025-08-06 14:42:58', '2025-08-06 14:42:58', 0.00, 0.00, 9.00, NULL),
(556, 87, 90, 2.00, 13.00, 26.00, '2025-08-06 14:42:58', '2025-08-06 14:42:58', 0.00, 0.00, 10.90, NULL),
(557, 87, 25, 1.00, 27.00, 27.00, '2025-08-06 14:42:58', '2025-08-06 14:42:58', 0.00, 0.00, 22.00, NULL),
(558, 87, 118, 1.00, 24.00, 24.00, '2025-08-06 14:42:58', '2025-08-06 14:42:58', 0.00, 0.00, 19.00, NULL),
(559, 87, 60, 1.00, 20.00, 20.00, '2025-08-06 14:42:58', '2025-08-06 14:42:58', 0.00, 0.00, 18.00, NULL),
(560, 88, 15, 168.00, 9.00, 1512.00, '2025-08-06 16:11:15', '2025-08-06 16:11:15', 0.00, 0.00, 8.80, NULL),
(561, 89, 33, 50.00, 10.00, 500.00, '2025-08-06 17:17:45', '2025-08-06 17:17:45', 0.00, 0.00, 9.75, NULL),
(562, 89, 72, 12.00, 13.50, 162.00, '2025-08-06 17:17:45', '2025-08-06 17:17:45', 0.00, 0.00, 13.00, NULL),
(563, 89, 71, 12.00, 14.50, 174.00, '2025-08-06 17:17:45', '2025-08-06 17:17:45', 0.00, 0.00, 13.00, NULL),
(564, 89, 60, 60.00, 18.00, 1080.00, '2025-08-06 17:17:45', '2025-08-06 17:17:45', 0.00, 0.00, 18.00, NULL),
(565, 90, 38, 30.00, 10.00, 300.00, '2025-08-07 07:49:41', '2025-08-07 07:49:41', 0.00, 0.00, 9.25, NULL),
(566, 90, 78, 20.00, 24.50, 490.00, '2025-08-07 07:49:41', '2025-08-07 07:49:41', 0.00, 0.00, 23.50, NULL),
(567, 90, 77, 20.00, 24.50, 490.00, '2025-08-07 07:49:41', '2025-08-07 07:49:41', 0.00, 0.00, 23.50, NULL),
(568, 90, 204, 8.00, 13.00, 104.00, '2025-08-07 07:49:41', '2025-08-07 07:49:41', 0.00, 0.00, 12.60, NULL),
(569, 90, 202, 20.00, 10.00, 200.00, '2025-08-07 07:49:41', '2025-08-07 07:49:41', 0.00, 0.00, 9.00, NULL),
(570, 91, 192, 1.00, 10.50, 10.50, '2025-08-07 09:03:55', '2025-08-07 09:03:55', 0.00, 0.00, 8.50, NULL),
(571, 91, 195, 1.00, 10.50, 10.50, '2025-08-07 09:03:55', '2025-08-07 09:03:55', 0.00, 0.00, 8.50, NULL),
(572, 91, 38, 1.00, 11.00, 11.00, '2025-08-07 09:03:55', '2025-08-07 09:03:55', 0.00, 0.00, 9.25, NULL),
(573, 92, 235, 1.00, 10.00, 10.00, '2025-08-07 09:11:09', '2025-08-07 09:11:09', 0.00, 0.00, 8.75, NULL),
(574, 92, 187, 1.00, 9.00, 9.00, '2025-08-07 09:11:09', '2025-08-07 09:11:09', 0.00, 0.00, 7.50, NULL),
(575, 92, 193, 1.00, 10.50, 10.50, '2025-08-07 09:11:09', '2025-08-07 09:11:09', 0.00, 0.00, 8.50, NULL),
(576, 92, 195, 1.00, 10.50, 10.50, '2025-08-07 09:11:09', '2025-08-07 09:11:09', 0.00, 0.00, 8.50, NULL),
(577, 92, 192, 1.00, 10.50, 10.50, '2025-08-07 09:11:09', '2025-08-07 09:11:09', 0.00, 0.00, 8.50, NULL),
(578, 92, 18, 1.00, 25.20, 25.20, '2025-08-07 09:11:09', '2025-08-07 09:11:09', 0.00, 0.00, 23.10, NULL),
(579, 92, 87, 1.00, 26.40, 26.40, '2025-08-07 09:11:09', '2025-08-07 09:11:09', 0.00, 0.00, 24.20, NULL),
(580, 92, 197, 1.00, 9.50, 9.50, '2025-08-07 09:11:09', '2025-08-07 09:11:09', 0.00, 0.00, 8.50, NULL),
(581, 92, 148, 2.00, 9.00, 18.00, '2025-08-07 09:11:09', '2025-08-07 09:11:09', 0.00, 0.00, 7.50, NULL),
(582, 92, 150, 2.00, 9.00, 18.00, '2025-08-07 09:11:09', '2025-08-07 09:11:09', 0.00, 0.00, 7.50, NULL),
(583, 92, 151, 1.00, 9.00, 9.00, '2025-08-07 09:11:09', '2025-08-07 09:11:09', 0.00, 0.00, 7.50, NULL),
(584, 92, 146, 2.00, 9.00, 18.00, '2025-08-07 09:11:09', '2025-08-07 09:11:09', 0.00, 0.00, 7.50, NULL),
(585, 92, 200, 1.00, 9.50, 9.50, '2025-08-07 09:11:09', '2025-08-07 09:11:09', 0.00, 0.00, 8.86, NULL),
(586, 93, 84, 3.00, 22.00, 66.00, '2025-08-07 09:27:29', '2025-08-07 09:27:29', 0.00, 0.00, 18.00, NULL),
(587, 93, 110, 1.00, 15.30, 15.30, '2025-08-07 09:27:29', '2025-08-07 09:27:29', 0.00, 0.00, 14.04, NULL),
(588, 93, 107, 1.00, 18.70, 18.70, '2025-08-07 09:27:29', '2025-08-07 09:27:29', 0.00, 0.00, 17.16, NULL),
(589, 93, 99, 1.00, 18.70, 18.70, '2025-08-07 09:27:29', '2025-08-07 09:27:29', 0.00, 0.00, 17.16, NULL),
(590, 93, 102, 1.00, 18.70, 18.70, '2025-08-07 09:27:29', '2025-08-07 09:27:29', 0.00, 0.00, 17.16, NULL),
(591, 93, 103, 1.00, 18.70, 18.70, '2025-08-07 09:27:29', '2025-08-07 09:27:29', 0.00, 0.00, 17.16, NULL),
(592, 93, 223, 1.00, 11.00, 11.00, '2025-08-07 09:27:29', '2025-08-07 09:27:29', 0.00, 0.00, 8.75, NULL),
(593, 93, 97, 2.00, 9.00, 18.00, '2025-08-07 09:27:29', '2025-08-07 09:27:29', 0.00, 0.00, 8.00, NULL),
(594, 93, 96, 3.00, 9.00, 27.00, '2025-08-07 09:27:29', '2025-08-07 09:27:29', 0.00, 0.00, 8.00, NULL),
(595, 93, 202, 2.00, 10.00, 20.00, '2025-08-07 09:27:29', '2025-08-07 09:27:29', 0.00, 0.00, 9.00, NULL),
(596, 93, 42, 1.00, 16.00, 16.00, '2025-08-07 09:27:29', '2025-08-07 09:27:29', 0.00, 0.00, 14.50, NULL),
(597, 94, 182, 1.00, 5.00, 5.00, '2025-08-07 09:28:40', '2025-08-07 09:28:40', 0.00, 0.00, 4.00, NULL),
(598, 95, 50, 3.00, 16.00, 48.00, '2025-08-07 09:54:08', '2025-08-07 09:54:08', 0.00, 0.00, 13.62, NULL),
(599, 95, 154, 1.00, 16.00, 16.00, '2025-08-07 09:54:08', '2025-08-07 09:54:08', 0.00, 0.00, 13.63, NULL),
(600, 95, 153, 1.00, 16.00, 16.00, '2025-08-07 09:54:08', '2025-08-07 09:54:08', 0.00, 0.00, 13.63, NULL),
(601, 95, 155, 1.00, 16.00, 16.00, '2025-08-07 09:54:08', '2025-08-07 09:54:08', 0.00, 0.00, 13.63, NULL),
(602, 95, 64, 3.00, 26.40, 79.20, '2025-08-07 09:54:08', '2025-08-07 09:54:08', 0.00, 0.00, 24.00, NULL),
(603, 95, 22, 5.00, 18.40, 92.00, '2025-08-07 09:54:08', '2025-08-07 09:54:08', 0.00, 0.00, 17.60, NULL),
(604, 95, 17, 2.00, 20.70, 41.40, '2025-08-07 09:54:08', '2025-08-07 09:54:08', 0.00, 0.00, 19.70, NULL),
(605, 95, 19, 3.00, 19.55, 58.65, '2025-08-07 09:54:08', '2025-08-07 09:54:08', 0.00, 0.00, 18.70, NULL),
(606, 95, 21, 4.00, 17.25, 69.00, '2025-08-07 09:54:08', '2025-08-07 09:54:08', 0.00, 0.00, 16.50, NULL),
(607, 95, 16, 3.00, 25.30, 75.90, '2025-08-07 09:54:08', '2025-08-07 09:54:08', 0.00, 0.00, 24.30, NULL),
(608, 95, 20, 1.00, 19.55, 19.55, '2025-08-07 09:54:08', '2025-08-07 09:54:08', 0.00, 0.00, 18.70, NULL),
(609, 96, 70, 1.00, 12.00, 12.00, '2025-08-07 09:55:44', '2025-08-07 09:55:44', 0.00, 0.00, 10.00, NULL),
(610, 96, 253, 3.00, 4.50, 13.50, '2025-08-07 09:55:44', '2025-08-07 09:55:44', 0.00, 0.00, 3.75, NULL),
(611, 97, 15, 40.00, 9.50, 380.00, '2025-08-07 10:40:27', '2025-08-07 10:40:27', 0.00, 0.00, 8.80, NULL),
(612, 97, 65, 2.00, 12.00, 24.00, '2025-08-07 10:40:27', '2025-08-07 10:40:27', 0.00, 0.00, 9.00, NULL),
(613, 98, 119, 1.00, 10.50, 10.50, '2025-08-07 10:53:17', '2025-08-07 10:53:17', 0.00, 0.00, 10.00, NULL),
(614, 98, 120, 1.00, 13.00, 13.00, '2025-08-07 10:53:17', '2025-08-07 10:53:17', 0.00, 0.00, 13.00, NULL),
(615, 98, 76, 1.00, 15.00, 15.00, '2025-08-07 10:53:17', '2025-08-07 10:53:17', 0.00, 0.00, 13.50, NULL),
(616, 98, 33, 1.00, 10.50, 10.50, '2025-08-07 10:53:17', '2025-08-07 10:53:17', 0.00, 0.00, 9.75, NULL),
(617, 98, 92, 1.00, 15.00, 15.00, '2025-08-07 10:53:17', '2025-08-07 10:53:17', 0.00, 0.00, 14.00, NULL),
(618, 98, 91, 1.00, 15.00, 15.00, '2025-08-07 10:53:17', '2025-08-07 10:53:17', 0.00, 0.00, 14.85, NULL),
(619, 98, 197, 1.00, 9.50, 9.50, '2025-08-07 10:53:17', '2025-08-07 10:53:17', 0.00, 0.00, 8.50, NULL),
(620, 98, 173, 1.00, 19.50, 19.50, '2025-08-07 10:53:17', '2025-08-07 10:53:17', 0.00, 0.00, 18.50, NULL),
(621, 98, 141, 2.00, 10.50, 21.00, '2025-08-07 10:53:17', '2025-08-07 10:53:17', 0.00, 0.00, 9.50, NULL),
(622, 98, 142, 2.00, 10.50, 21.00, '2025-08-07 10:53:17', '2025-08-07 10:53:17', 0.00, 0.00, 9.50, NULL),
(623, 98, 252, 2.00, 6.00, 12.00, '2025-08-07 10:53:17', '2025-08-07 10:53:17', 0.00, 0.00, 5.22, NULL),
(624, 98, 143, 1.00, 10.50, 10.50, '2025-08-07 10:53:17', '2025-08-07 10:53:17', 0.00, 0.00, 9.50, NULL),
(625, 98, 140, 1.00, 10.50, 10.50, '2025-08-07 10:53:17', '2025-08-07 10:53:17', 0.00, 0.00, 9.50, NULL),
(626, 99, 177, 64.00, 6.70, 428.80, '2025-08-07 11:47:38', '2025-08-07 11:47:38', 0.00, 0.00, 6.15, NULL),
(627, 99, 201, 10.00, 9.50, 95.00, '2025-08-07 11:47:38', '2025-08-07 11:47:38', 0.00, 0.00, 8.50, NULL),
(628, 100, 38, 1.00, 11.00, 11.00, '2025-08-07 12:14:57', '2025-08-07 12:14:57', 0.00, 0.00, 9.25, NULL),
(629, 100, 56, 1.00, 15.00, 15.00, '2025-08-07 12:14:57', '2025-08-07 12:14:57', 0.00, 0.00, 12.70, NULL),
(630, 100, 25, 1.00, 27.00, 27.00, '2025-08-07 12:14:57', '2025-08-07 12:14:57', 0.00, 0.00, 22.00, NULL),
(631, 100, 87, 1.00, 26.40, 26.40, '2025-08-07 12:14:57', '2025-08-07 12:14:57', 0.00, 0.00, 24.20, NULL),
(632, 100, 81, 1.00, 25.00, 25.00, '2025-08-07 12:14:57', '2025-08-07 12:14:57', 0.00, 0.00, 24.00, NULL),
(633, 100, 156, 1.00, 21.00, 21.00, '2025-08-07 12:14:57', '2025-08-07 12:14:57', 0.00, 0.00, 18.60, NULL),
(634, 100, 71, 1.00, 15.00, 15.00, '2025-08-07 12:14:57', '2025-08-07 12:14:57', 0.00, 0.00, 13.00, NULL),
(635, 100, 92, 1.00, 16.00, 16.00, '2025-08-07 12:14:57', '2025-08-07 12:14:57', 0.00, 0.00, 14.00, NULL),
(636, 101, 163, 1.00, 60.00, 60.00, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 54.00, NULL),
(637, 101, 92, 1.00, 16.00, 16.00, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 14.00, NULL),
(638, 101, 91, 1.00, 16.00, 16.00, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 14.85, NULL),
(639, 101, 156, 1.00, 20.00, 20.00, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 18.60, NULL),
(640, 101, 81, 1.00, 25.00, 25.00, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 24.00, NULL),
(641, 101, 199, 1.00, 9.50, 9.50, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 8.86, NULL),
(642, 101, 87, 1.00, 26.40, 26.40, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 24.20, NULL),
(643, 101, 25, 1.00, 27.00, 27.00, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 22.00, NULL),
(644, 101, 56, 1.00, 15.00, 15.00, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 12.70, NULL),
(645, 101, 65, 1.00, 12.00, 12.00, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 9.00, NULL),
(646, 101, 38, 1.00, 11.00, 11.00, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 9.25, NULL),
(647, 101, 227, 1.00, 10.50, 10.50, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 8.75, NULL),
(648, 101, 195, 1.00, 10.50, 10.50, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 8.50, NULL),
(649, 101, 226, 1.00, 10.50, 10.50, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 8.75, NULL),
(650, 101, 193, 1.00, 10.50, 10.50, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 8.50, NULL),
(651, 101, 192, 1.00, 10.50, 10.50, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 8.50, NULL),
(652, 101, 225, 1.00, 10.50, 10.50, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 8.75, NULL),
(653, 101, 71, 1.00, 15.00, 15.00, '2025-08-07 12:20:34', '2025-08-07 12:20:34', 0.00, 0.00, 13.00, NULL),
(654, 102, 75, 1.00, 11.00, 11.00, '2025-08-07 12:33:10', '2025-08-07 12:33:10', 0.00, 0.00, 9.00, NULL),
(655, 102, 121, 1.00, 11.00, 11.00, '2025-08-07 12:33:10', '2025-08-07 12:33:10', 0.00, 0.00, 9.75, NULL),
(656, 102, 123, 1.00, 11.50, 11.50, '2025-08-07 12:33:10', '2025-08-07 12:33:10', 0.00, 0.00, 10.00, NULL),
(657, 102, 61, 1.00, 19.00, 19.00, '2025-08-07 12:33:10', '2025-08-07 12:33:10', 0.00, 0.00, 16.00, NULL),
(658, 102, 243, 1.00, 10.50, 10.50, '2025-08-07 12:33:10', '2025-08-07 12:33:10', 0.00, 0.00, 10.00, NULL),
(659, 102, 207, 1.00, 13.50, 13.50, '2025-08-07 12:33:10', '2025-08-07 12:33:10', 0.00, 0.00, 12.60, NULL),
(660, 102, 60, 1.00, 20.00, 20.00, '2025-08-07 12:33:10', '2025-08-07 12:33:10', 0.00, 0.00, 18.00, NULL),
(661, 102, 71, 1.00, 15.00, 15.00, '2025-08-07 12:33:10', '2025-08-07 12:33:10', 0.00, 0.00, 13.00, NULL),
(662, 102, 90, 1.00, 13.00, 13.00, '2025-08-07 12:33:10', '2025-08-07 12:33:10', 0.00, 0.00, 10.90, NULL),
(663, 102, 76, 1.00, 16.00, 16.00, '2025-08-07 12:33:10', '2025-08-07 12:33:10', 0.00, 0.00, 13.50, NULL),
(664, 102, 77, 1.00, 30.00, 30.00, '2025-08-07 12:33:10', '2025-08-07 12:33:10', 0.00, 0.00, 23.50, NULL),
(665, 102, 174, 1.00, 23.00, 23.00, '2025-08-07 12:33:10', '2025-08-07 12:33:10', 0.00, 0.00, 21.00, NULL),
(666, 103, 110, 1.00, 15.30, 15.30, '2025-08-07 12:44:39', '2025-08-07 12:44:39', 0.00, 0.00, 14.04, NULL),
(667, 103, 111, 1.00, 21.25, 21.25, '2025-08-07 12:44:39', '2025-08-07 12:44:39', 0.00, 0.00, 19.50, NULL),
(668, 103, 107, 1.00, 18.70, 18.70, '2025-08-07 12:44:39', '2025-08-07 12:44:39', 0.00, 0.00, 17.16, NULL),
(669, 103, 112, 1.00, 21.25, 21.25, '2025-08-07 12:44:39', '2025-08-07 12:44:39', 0.00, 0.00, 19.50, NULL),
(670, 103, 114, 1.00, 20.40, 20.40, '2025-08-07 12:44:39', '2025-08-07 12:44:39', 0.00, 0.00, 18.72, NULL),
(671, 103, 102, 1.00, 18.70, 18.70, '2025-08-07 12:44:39', '2025-08-07 12:44:39', 0.00, 0.00, 17.16, NULL),
(672, 103, 104, 1.00, 18.70, 18.70, '2025-08-07 12:44:39', '2025-08-07 12:44:39', 0.00, 0.00, 17.16, NULL),
(673, 104, 215, 1.00, 11.00, 11.00, '2025-08-07 14:03:02', '2025-08-07 14:03:02', 0.00, 0.00, 9.50, NULL),
(674, 105, 112, 1.00, 21.25, 21.25, '2025-08-07 14:44:21', '2025-08-07 14:44:21', 0.00, 0.00, 19.50, NULL),
(675, 105, 107, 1.00, 18.70, 18.70, '2025-08-07 14:44:21', '2025-08-07 14:44:21', 0.00, 0.00, 17.16, NULL),
(676, 105, 104, 1.00, 18.70, 18.70, '2025-08-07 14:44:21', '2025-08-07 14:44:21', 0.00, 0.00, 17.16, NULL),
(677, 105, 103, 1.00, 18.70, 18.70, '2025-08-07 14:44:21', '2025-08-07 14:44:21', 0.00, 0.00, 17.16, NULL),
(678, 105, 60, 1.00, 20.00, 20.00, '2025-08-07 14:44:21', '2025-08-07 14:44:21', 0.00, 0.00, 18.00, NULL),
(679, 106, 244, 1.00, 13.50, 13.50, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 11.60, NULL),
(680, 106, 80, 1.00, 29.00, 29.00, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 27.00, NULL),
(681, 106, 120, 1.00, 14.00, 14.00, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 13.00, NULL),
(682, 106, 81, 1.00, 25.00, 25.00, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 24.00, NULL),
(683, 106, 245, 2.00, 13.50, 27.00, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 11.60, NULL),
(684, 106, 163, 1.00, 60.00, 60.00, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 54.00, NULL),
(685, 106, 78, 1.00, 30.00, 30.00, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 23.50, NULL),
(686, 106, 84, 2.00, 22.00, 44.00, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 18.00, NULL),
(687, 106, 224, 1.00, 24.00, 24.00, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 22.00, NULL),
(688, 106, 87, 1.00, 26.40, 26.40, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 24.20, NULL),
(689, 106, 22, 1.00, 19.20, 19.20, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 17.60, NULL),
(690, 106, 201, 1.00, 10.00, 10.00, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 8.50, NULL),
(691, 106, 235, 1.00, 10.00, 10.00, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 8.75, NULL),
(692, 106, 234, 1.00, 10.00, 10.00, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 8.75, NULL),
(693, 106, 202, 1.00, 10.00, 10.00, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 9.00, NULL),
(694, 106, 26, 1.00, 20.00, 20.00, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 18.00, NULL),
(695, 106, 48, 1.00, 11.00, 11.00, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 9.00, NULL),
(696, 106, 38, 1.00, 11.00, 11.00, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 9.25, NULL),
(697, 106, 195, 1.00, 10.50, 10.50, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 8.50, NULL),
(698, 106, 227, 1.00, 10.50, 10.50, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 8.75, NULL),
(699, 106, 226, 1.00, 10.50, 10.50, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 8.75, NULL),
(700, 106, 166, 1.00, 14.00, 14.00, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 12.00, NULL),
(701, 106, 232, 1.00, 10.00, 10.00, '2025-08-07 15:06:03', '2025-08-07 15:06:03', 0.00, 0.00, 8.75, NULL),
(702, 107, 24, 2.00, 23.00, 46.00, '2025-08-07 15:33:51', '2025-08-07 15:33:51', 0.00, 0.00, 21.60, NULL),
(703, 107, 29, 2.00, 24.00, 48.00, '2025-08-07 15:33:51', '2025-08-07 15:33:51', 0.00, 0.00, 22.00, NULL),
(704, 107, 53, 1.00, 12.50, 12.50, '2025-08-07 15:33:51', '2025-08-07 15:33:51', 0.00, 0.00, 11.75, NULL),
(705, 107, 226, 4.00, 9.75, 39.00, '2025-08-07 15:33:51', '2025-08-07 15:33:51', 0.00, 0.00, 8.75, NULL),
(706, 107, 192, 4.00, 9.75, 39.00, '2025-08-07 15:33:51', '2025-08-07 15:33:51', 0.00, 0.00, 8.50, NULL),
(707, 107, 195, 4.00, 9.75, 39.00, '2025-08-07 15:33:51', '2025-08-07 15:33:51', 0.00, 0.00, 8.50, NULL),
(708, 107, 227, 3.00, 9.75, 29.25, '2025-08-07 15:33:51', '2025-08-07 15:33:51', 0.00, 0.00, 8.75, NULL),
(709, 107, 26, 1.00, 16.00, 16.00, '2025-08-07 15:33:51', '2025-08-07 15:33:51', 0.00, 0.00, 18.00, NULL),
(710, 107, 28, 1.00, 23.50, 23.50, '2025-08-07 15:33:51', '2025-08-07 15:33:51', 0.00, 0.00, 22.00, NULL),
(711, 107, 27, 1.00, 19.50, 19.50, '2025-08-07 15:33:51', '2025-08-07 15:33:51', 0.00, 0.00, 18.00, NULL),
(712, 107, 25, 2.00, 24.50, 49.00, '2025-08-07 15:33:51', '2025-08-07 15:33:51', 0.00, 0.00, 22.00, NULL),
(713, 108, 84, 1.00, 22.00, 22.00, '2025-08-07 15:41:44', '2025-08-07 15:41:44', 0.00, 0.00, 18.00, NULL),
(714, 108, 43, 1.00, 16.00, 16.00, '2025-08-07 15:41:44', '2025-08-07 15:41:44', 0.00, 0.00, 13.75, NULL),
(715, 108, 176, 1.00, 8.00, 8.00, '2025-08-07 15:41:44', '2025-08-07 15:41:44', 0.00, 0.00, 6.50, NULL),
(716, 108, 195, 1.00, 10.50, 10.50, '2025-08-07 15:41:44', '2025-08-07 15:41:44', 0.00, 0.00, 8.50, NULL),
(717, 109, 70, 1.00, 12.00, 12.00, '2025-08-07 16:07:14', '2025-08-07 16:07:14', 0.00, 0.00, 10.00, NULL),
(718, 109, 92, 2.00, 16.00, 32.00, '2025-08-07 16:07:14', '2025-08-07 16:07:14', 0.00, 0.00, 14.00, NULL),
(719, 109, 38, 1.00, 11.00, 11.00, '2025-08-07 16:07:14', '2025-08-07 16:07:14', 0.00, 0.00, 9.25, NULL),
(720, 110, 201, 10.00, 9.00, 90.00, '2025-08-07 16:48:08', '2025-08-07 16:48:08', 0.00, 0.00, 8.50, NULL),
(721, 111, 182, 1.00, 5.00, 5.00, '2025-08-07 16:58:57', '2025-08-07 16:58:57', 0.00, 0.00, 4.00, NULL),
(722, 112, 173, 73.00, 19.00, 1387.00, '2025-08-08 08:03:11', '2025-08-08 08:03:11', 0.00, 0.00, 18.50, NULL),
(723, 112, 79, 5.00, 15.00, 75.00, '2025-08-08 08:03:11', '2025-08-08 08:03:11', 0.00, 0.00, 14.25, NULL),
(724, 112, 86, 6.00, 10.50, 63.00, '2025-08-08 08:03:11', '2025-08-08 08:03:11', 0.00, 0.00, 9.50, NULL),
(725, 113, 77, 1.00, 30.00, 30.00, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 23.50, NULL),
(726, 113, 80, 1.00, 29.00, 29.00, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 27.00, NULL),
(727, 113, 27, 1.00, 20.00, 20.00, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 18.00, NULL),
(728, 113, 42, 1.00, 16.00, 16.00, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 14.50, NULL),
(729, 113, 250, 1.00, 13.50, 13.50, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 12.50, NULL),
(730, 113, 233, 1.00, 10.00, 10.00, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 8.75, NULL),
(731, 113, 236, 1.00, 10.00, 10.00, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 8.75, NULL),
(732, 113, 75, 2.00, 11.00, 22.00, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 9.00, NULL),
(733, 113, 226, 1.00, 10.50, 10.50, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 8.75, NULL),
(734, 113, 193, 1.00, 10.50, 10.50, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 8.50, NULL),
(735, 113, 227, 3.00, 10.50, 31.50, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 8.75, NULL),
(736, 113, 195, 3.00, 10.50, 31.50, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 8.50, NULL),
(737, 113, 192, 2.00, 10.50, 21.00, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 8.50, NULL),
(738, 113, 88, 1.00, 25.30, 25.30, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 23.76, NULL),
(739, 113, 17, 1.00, 20.70, 20.70, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 19.70, NULL),
(740, 113, 18, 1.00, 24.20, 24.20, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 23.10, NULL),
(741, 113, 19, 1.00, 19.50, 19.50, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 18.70, NULL),
(742, 113, 76, 1.00, 16.00, 16.00, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 13.50, NULL),
(743, 113, 121, 1.00, 11.00, 11.00, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 9.75, NULL),
(744, 113, 119, 1.00, 12.50, 12.50, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 10.00, NULL),
(745, 113, 159, 1.00, 11.00, 11.00, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 9.00, NULL),
(746, 113, 184, 1.00, 14.00, 14.00, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 12.00, NULL),
(747, 113, 219, 1.00, 7.50, 7.50, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 6.90, NULL),
(748, 113, 70, 1.00, 12.00, 12.00, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 10.00, NULL),
(749, 113, 69, 1.00, 12.00, 12.00, '2025-08-08 09:26:11', '2025-08-08 09:26:11', 0.00, 0.00, 9.50, NULL),
(750, 114, 76, 1.00, 16.00, 16.00, '2025-08-08 09:28:16', '2025-08-08 09:28:16', 0.00, 0.00, 13.50, NULL),
(751, 114, 49, 1.00, 15.00, 15.00, '2025-08-08 09:28:16', '2025-08-08 09:28:16', 0.00, 0.00, 14.00, NULL),
(752, 114, 24, 1.00, 25.00, 25.00, '2025-08-08 09:28:16', '2025-08-08 09:28:16', 0.00, 0.00, 21.60, NULL),
(753, 114, 154, 1.00, 16.50, 16.50, '2025-08-08 09:28:16', '2025-08-08 09:28:16', 0.00, 0.00, 13.63, NULL),
(754, 115, 91, 30.00, 15.25, 457.50, '2025-08-08 09:46:10', '2025-08-08 09:46:10', 0.00, 0.00, 14.85, NULL),
(755, 115, 239, 20.00, 9.50, 190.00, '2025-08-08 09:46:10', '2025-08-08 09:46:10', 0.00, 0.00, 8.75, NULL),
(756, 115, 241, 20.00, 9.50, 190.00, '2025-08-08 09:46:10', '2025-08-08 09:46:10', 0.00, 0.00, 8.75, NULL),
(757, 115, 240, 20.00, 9.50, 190.00, '2025-08-08 09:46:10', '2025-08-08 09:46:10', 0.00, 0.00, 8.75, NULL),
(758, 115, 213, 12.00, 7.25, 87.00, '2025-08-08 09:46:10', '2025-08-08 09:46:10', 0.00, 0.00, 6.90, NULL),
(759, 115, 72, 12.00, 13.50, 162.00, '2025-08-08 09:46:10', '2025-08-08 09:46:10', 0.00, 0.00, 13.00, NULL),
(760, 116, 197, 10.00, 9.00, 90.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 8.50, NULL),
(761, 116, 205, 8.00, 13.00, 104.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 12.60, NULL),
(762, 116, 232, 12.00, 9.50, 114.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 8.75, NULL),
(763, 116, 65, 12.00, 10.50, 126.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 9.00, NULL),
(764, 116, 249, 4.00, 13.00, 52.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 12.50, NULL),
(765, 116, 247, 2.00, 13.00, 26.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 12.00, NULL),
(766, 116, 248, 2.00, 13.00, 26.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 12.50, NULL),
(767, 116, 123, 10.00, 11.00, 110.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 10.00, NULL),
(768, 116, 121, 10.00, 10.50, 105.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 9.75, NULL),
(769, 116, 158, 10.00, 12.50, 125.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 11.00, NULL),
(770, 116, 156, 10.00, 20.00, 200.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 18.60, NULL),
(771, 116, 76, 10.00, 15.00, 150.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 13.50, NULL),
(772, 116, 84, 10.00, 19.50, 195.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 18.00, NULL),
(773, 116, 73, 12.00, 18.00, 216.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 17.00, NULL),
(774, 116, 61, 10.00, 16.00, 160.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 16.00, NULL),
(775, 116, 77, 5.00, 25.00, 125.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 23.50, NULL),
(776, 116, 78, 5.00, 25.00, 125.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 23.50, NULL),
(777, 116, 26, 5.00, 17.00, 85.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 18.00, NULL),
(778, 116, 27, 5.00, 19.50, 97.50, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 18.00, NULL),
(779, 116, 246, 12.00, 8.50, 102.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 7.50, NULL),
(780, 116, 169, 6.00, 12.50, 75.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 12.00, NULL),
(781, 116, 168, 6.00, 12.50, 75.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 12.00, NULL),
(782, 116, 167, 6.00, 12.50, 75.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 12.00, NULL),
(783, 116, 166, 6.00, 12.50, 75.00, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 0.00, 0.00, 12.00, NULL),
(784, 117, 29, 5.00, 23.50, 117.50, '2025-08-08 11:31:45', '2025-08-08 11:31:45', 0.00, 0.00, 22.00, NULL),
(785, 117, 198, 16.00, 9.60, 153.60, '2025-08-08 11:31:45', '2025-08-08 11:31:45', 0.00, 0.00, 8.50, NULL),
(786, 117, 184, 6.00, 13.00, 78.00, '2025-08-08 11:31:45', '2025-08-08 11:31:45', 0.00, 0.00, 12.00, NULL),
(787, 117, 177, 32.00, 6.70, 214.40, '2025-08-08 11:31:45', '2025-08-08 11:31:45', 0.00, 0.00, 6.15, NULL),
(788, 117, 118, 12.00, 21.00, 252.00, '2025-08-08 11:31:45', '2025-08-08 11:31:45', 0.00, 0.00, 19.00, NULL),
(789, 118, 201, 10.00, 9.50, 95.00, '2025-08-08 11:43:35', '2025-08-08 11:43:35', 0.00, 0.00, 8.50, NULL),
(790, 119, 95, 1.00, 20.00, 20.00, '2025-08-08 12:05:43', '2025-08-08 12:05:43', 0.00, 0.00, 14.25, NULL),
(791, 119, 94, 2.00, 20.00, 40.00, '2025-08-08 12:05:43', '2025-08-08 12:05:43', 0.00, 0.00, 13.99, NULL),
(792, 119, 38, 1.00, 11.00, 11.00, '2025-08-08 12:05:43', '2025-08-08 12:05:43', 0.00, 0.00, 9.25, NULL),
(793, 119, 54, 1.00, 15.00, 15.00, '2025-08-08 12:05:43', '2025-08-08 12:05:43', 0.00, 0.00, 16.00, NULL),
(794, 120, 76, 1.00, 16.00, 16.00, '2025-08-08 12:15:50', '2025-08-08 12:15:50', 0.00, 0.00, 13.50, NULL),
(795, 121, 27, 15.00, 19.50, 292.50, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 18.00, NULL),
(796, 121, 29, 10.00, 23.50, 235.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 22.00, NULL),
(797, 121, 31, 10.00, 20.00, 200.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 19.00, NULL),
(798, 121, 84, 20.00, 19.50, 390.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 18.00, NULL),
(799, 121, 43, 10.00, 15.00, 150.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 13.75, NULL),
(800, 121, 73, 24.00, 18.50, 444.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 17.00, NULL),
(801, 121, 53, 20.00, 13.00, 260.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 11.75, NULL),
(802, 121, 78, 10.00, 25.00, 250.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 23.50, NULL),
(803, 121, 77, 10.00, 25.00, 250.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 23.50, NULL),
(804, 121, 95, 12.00, 14.50, 174.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 14.25, NULL),
(805, 121, 94, 12.00, 14.50, 174.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 13.99, NULL),
(806, 121, 92, 20.00, 15.50, 310.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 14.00, NULL),
(807, 121, 91, 20.00, 15.50, 310.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 14.85, NULL),
(808, 121, 206, 8.00, 13.00, 104.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 12.60, NULL),
(809, 121, 208, 8.00, 13.00, 104.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 12.60, NULL),
(810, 121, 220, 12.00, 9.50, 114.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 8.00, NULL),
(811, 121, 209, 24.00, 7.50, 180.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 6.75, NULL),
(812, 121, 250, 16.00, 13.00, 208.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 12.50, NULL),
(813, 121, 191, 72.00, 10.00, 720.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 8.70, NULL),
(814, 121, 200, 45.00, 9.50, 427.50, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 8.86, NULL),
(815, 121, 199, 45.00, 9.50, 427.50, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 8.86, NULL),
(816, 121, 38, 30.00, 10.00, 300.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 9.25, NULL),
(817, 121, 51, 12.00, 10.00, 120.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 9.50, NULL),
(818, 121, 61, 20.00, 16.00, 320.00, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 0.00, 0.00, 16.00, NULL),
(819, 122, 163, 1.00, 60.00, 60.00, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 54.00, NULL),
(820, 122, 38, 1.00, 11.00, 11.00, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 9.25, NULL),
(821, 122, 61, 1.00, 19.00, 19.00, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 16.00, NULL),
(822, 122, 193, 1.00, 10.50, 10.50, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 8.50, NULL),
(823, 122, 195, 1.00, 10.50, 10.50, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 8.50, NULL),
(824, 122, 226, 1.00, 10.50, 10.50, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 8.75, NULL),
(825, 122, 191, 1.00, 10.50, 10.50, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 8.70, NULL),
(826, 122, 192, 1.00, 10.50, 10.50, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 8.50, NULL),
(827, 122, 190, 1.00, 7.00, 7.00, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 5.00, NULL),
(828, 122, 198, 1.00, 11.00, 11.00, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 8.50, NULL),
(829, 122, 89, 1.00, 11.00, 11.00, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 10.00, NULL),
(830, 122, 120, 1.00, 14.00, 14.00, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 13.00, NULL),
(831, 122, 69, 1.00, 12.00, 12.00, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 9.50, NULL),
(832, 122, 70, 1.00, 12.00, 12.00, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 10.00, NULL),
(833, 122, 201, 1.00, 10.00, 10.00, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 8.50, NULL),
(834, 122, 78, 1.00, 30.00, 30.00, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 23.50, NULL),
(835, 122, 15, 7.00, 10.00, 70.00, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 8.80, NULL),
(836, 122, 177, 3.00, 7.00, 21.00, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 6.15, NULL),
(837, 122, 231, 2.00, 12.00, 24.00, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 9.60, NULL),
(838, 122, 230, 1.00, 14.00, 14.00, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 12.00, NULL),
(839, 122, 252, 1.00, 6.50, 6.50, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 5.22, NULL),
(840, 122, 215, 1.00, 11.00, 11.00, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 9.50, NULL),
(841, 122, 209, 1.00, 7.50, 7.50, '2025-08-08 13:25:56', '2025-08-08 13:25:56', 0.00, 0.00, 6.75, NULL),
(842, 123, 91, 1.00, 15.00, 15.00, '2025-08-08 13:30:12', '2025-08-08 13:30:12', 0.00, 0.00, 14.85, NULL),
(843, 123, 195, 1.00, 10.50, 10.50, '2025-08-08 13:30:12', '2025-08-08 13:30:12', 0.00, 0.00, 8.50, NULL),
(844, 123, 191, 1.00, 10.50, 10.50, '2025-08-08 13:30:12', '2025-08-08 13:30:12', 0.00, 0.00, 8.70, NULL),
(845, 123, 190, 1.00, 7.00, 7.00, '2025-08-08 13:30:12', '2025-08-08 13:30:12', 0.00, 0.00, 5.00, NULL),
(846, 123, 194, 1.00, 10.50, 10.50, '2025-08-08 13:30:12', '2025-08-08 13:30:12', 0.00, 0.00, 8.50, NULL),
(847, 124, 135, 2.00, 16.00, 32.00, '2025-08-08 14:42:05', '2025-08-08 14:42:05', 0.00, 0.00, 13.50, NULL),
(848, 124, 130, 2.00, 20.00, 40.00, '2025-08-08 14:42:05', '2025-08-08 14:42:05', 0.00, 0.00, 16.25, NULL),
(849, 124, 136, 2.00, 16.00, 32.00, '2025-08-08 14:42:05', '2025-08-08 14:42:05', 0.00, 0.00, 13.50, NULL),
(850, 124, 134, 2.00, 16.00, 32.00, '2025-08-08 14:42:05', '2025-08-08 14:42:05', 0.00, 0.00, 13.50, NULL),
(851, 124, 132, 2.00, 12.00, 24.00, '2025-08-08 14:42:05', '2025-08-08 14:42:05', 0.00, 0.00, 10.12, NULL),
(852, 124, 133, 2.00, 12.00, 24.00, '2025-08-08 14:42:05', '2025-08-08 14:42:05', 0.00, 0.00, 9.75, NULL),
(853, 124, 137, 2.00, 16.00, 32.00, '2025-08-08 14:42:05', '2025-08-08 14:42:05', 0.00, 0.00, 13.00, NULL),
(854, 124, 138, 2.00, 16.00, 32.00, '2025-08-08 14:42:05', '2025-08-08 14:42:05', 0.00, 0.00, 13.50, NULL),
(855, 124, 141, 2.00, 12.00, 24.00, '2025-08-08 14:42:05', '2025-08-08 14:42:05', 0.00, 0.00, 9.50, NULL),
(856, 124, 143, 2.00, 12.00, 24.00, '2025-08-08 14:42:05', '2025-08-08 14:42:05', 0.00, 0.00, 9.50, NULL),
(857, 124, 142, 2.00, 12.00, 24.00, '2025-08-08 14:42:05', '2025-08-08 14:42:05', 0.00, 0.00, 9.50, NULL),
(858, 124, 140, 2.00, 12.00, 24.00, '2025-08-08 14:42:05', '2025-08-08 14:42:05', 0.00, 0.00, 9.50, NULL),
(859, 124, 139, 2.00, 12.00, 24.00, '2025-08-08 14:42:05', '2025-08-08 14:42:05', 0.00, 0.00, 9.50, NULL),
(860, 125, 112, 5.00, 20.00, 100.00, '2025-08-08 15:06:49', '2025-08-08 15:06:49', 0.00, 0.00, 19.50, NULL),
(861, 125, 110, 5.00, 14.40, 72.00, '2025-08-08 15:06:49', '2025-08-08 15:06:49', 0.00, 0.00, 14.04, NULL),
(862, 125, 111, 5.00, 19.99, 99.95, '2025-08-08 15:06:49', '2025-08-08 15:06:49', 0.00, 0.00, 19.50, NULL),
(863, 125, 116, 5.00, 14.40, 72.00, '2025-08-08 15:06:49', '2025-08-08 15:06:49', 0.00, 0.00, 14.04, NULL),
(864, 125, 87, 5.00, 25.30, 126.50, '2025-08-08 15:06:49', '2025-08-08 15:06:49', 0.00, 0.00, 24.20, NULL),
(865, 125, 88, 5.00, 25.30, 126.50, '2025-08-08 15:06:49', '2025-08-08 15:06:49', 0.00, 0.00, 23.76, NULL),
(866, 125, 22, 5.00, 18.40, 92.00, '2025-08-08 15:06:49', '2025-08-08 15:06:49', 0.00, 0.00, 17.60, NULL),
(867, 125, 19, 5.00, 19.55, 97.75, '2025-08-08 15:06:49', '2025-08-08 15:06:49', 0.00, 0.00, 18.70, NULL),
(868, 125, 21, 5.00, 17.25, 86.25, '2025-08-08 15:06:49', '2025-08-08 15:06:49', 0.00, 0.00, 16.50, NULL),
(869, 125, 38, 5.00, 10.00, 50.00, '2025-08-08 15:06:49', '2025-08-08 15:06:49', 0.00, 0.00, 9.25, NULL),
(870, 125, 200, 15.00, 9.50, 142.50, '2025-08-08 15:06:49', '2025-08-08 15:06:49', 0.00, 0.00, 8.86, NULL),
(871, 125, 199, 15.00, 9.50, 142.50, '2025-08-08 15:06:49', '2025-08-08 15:06:49', 0.00, 0.00, 8.86, NULL),
(872, 125, 86, 12.00, 10.50, 126.00, '2025-08-08 15:06:49', '2025-08-08 15:06:49', 0.00, 0.00, 9.50, NULL),
(873, 125, 72, 12.00, 14.00, 168.00, '2025-08-08 15:06:49', '2025-08-08 15:06:49', 0.00, 0.00, 13.00, NULL),
(874, 125, 215, 3.00, 10.00, 30.00, '2025-08-08 15:06:49', '2025-08-08 15:06:49', 0.00, 0.00, 9.50, NULL),
(875, 126, 201, 40.00, 9.50, 380.00, '2025-08-08 17:29:49', '2025-08-08 17:29:49', 0.00, 0.00, 8.50, NULL),
(876, 126, 197, 30.00, 9.00, 270.00, '2025-08-08 17:29:49', '2025-08-08 17:29:49', 0.00, 0.00, 8.50, NULL),
(877, 126, 75, 32.00, 9.50, 304.00, '2025-08-08 17:29:49', '2025-08-08 17:29:49', 0.00, 0.00, 9.00, NULL),
(878, 126, 90, 40.00, 12.00, 480.00, '2025-08-08 17:29:49', '2025-08-08 17:29:49', 0.00, 0.00, 10.90, NULL),
(879, 126, 58, 10.00, 14.00, 140.00, '2025-08-08 17:29:49', '2025-08-08 17:29:49', 0.00, 0.00, 12.70, NULL),
(880, 126, 155, 15.00, 15.00, 225.00, '2025-08-08 17:29:49', '2025-08-08 17:29:49', 0.00, 0.00, 13.63, NULL),
(881, 126, 29, 40.00, 23.50, 940.00, '2025-08-08 17:29:49', '2025-08-08 17:29:49', 0.00, 0.00, 22.00, NULL),
(882, 126, 24, 10.00, 21.00, 210.00, '2025-08-08 17:29:49', '2025-08-08 17:29:49', 0.00, 0.00, 21.60, NULL),
(883, 126, 88, 20.00, 25.08, 501.60, '2025-08-08 17:29:49', '2025-08-08 17:29:49', 0.00, 0.00, 23.76, NULL),
(884, 126, 87, 20.00, 25.08, 501.60, '2025-08-08 17:29:49', '2025-08-08 17:29:49', 0.00, 0.00, 24.20, NULL),
(885, 126, 16, 20.00, 25.08, 501.60, '2025-08-08 17:29:49', '2025-08-08 17:29:49', 0.00, 0.00, 24.30, NULL),
(886, 126, 22, 20.00, 18.24, 364.80, '2025-08-08 17:29:49', '2025-08-08 17:29:49', 0.00, 0.00, 17.60, NULL),
(887, 126, 21, 20.00, 17.10, 342.00, '2025-08-08 17:29:49', '2025-08-08 17:29:49', 0.00, 0.00, 16.50, NULL),
(888, 126, 19, 20.00, 19.38, 387.60, '2025-08-08 17:29:49', '2025-08-08 17:29:49', 0.00, 0.00, 18.70, NULL),
(889, 126, 126, 15.00, 5.50, 82.50, '2025-08-08 17:29:49', '2025-08-08 17:29:49', 0.00, 0.00, 5.00, NULL),
(890, 127, 227, 10.00, 10.00, 100.00, '2025-08-08 17:35:01', '2025-08-08 17:35:01', 0.00, 0.00, 8.75, NULL),
(891, 127, 191, 36.00, 10.00, 360.00, '2025-08-08 17:35:01', '2025-08-08 17:35:01', 0.00, 0.00, 8.70, NULL),
(892, 127, 195, 36.00, 10.00, 360.00, '2025-08-08 17:35:01', '2025-08-08 17:35:01', 0.00, 0.00, 8.50, NULL),
(893, 127, 160, 5.00, 14.50, 72.50, '2025-08-08 17:35:01', '2025-08-08 17:35:01', 0.00, 0.00, 13.50, NULL),
(894, 127, 158, 5.00, 12.50, 62.50, '2025-08-08 17:35:01', '2025-08-08 17:35:01', 0.00, 0.00, 11.00, NULL),
(895, 127, 92, 20.00, 15.50, 310.00, '2025-08-08 17:35:01', '2025-08-08 17:35:01', 0.00, 0.00, 14.00, NULL),
(896, 127, 91, 20.00, 15.50, 310.00, '2025-08-08 17:35:01', '2025-08-08 17:35:01', 0.00, 0.00, 14.85, NULL),
(897, 127, 81, 15.00, 25.00, 375.00, '2025-08-08 17:35:01', '2025-08-08 17:35:01', 0.00, 0.00, 24.00, NULL),
(898, 127, 70, 20.00, 11.00, 220.00, '2025-08-08 17:35:01', '2025-08-08 17:35:01', 0.00, 0.00, 10.00, NULL),
(899, 127, 38, 20.00, 10.00, 200.00, '2025-08-08 17:35:01', '2025-08-08 17:35:01', 0.00, 0.00, 9.25, NULL),
(900, 127, 61, 15.00, 16.50, 247.50, '2025-08-08 17:35:01', '2025-08-08 17:35:01', 0.00, 0.00, 16.00, NULL),
(901, 127, 224, 5.00, 23.00, 115.00, '2025-08-08 17:35:01', '2025-08-08 17:35:01', 0.00, 0.00, 22.00, NULL),
(902, 127, 24, 5.00, 22.00, 110.00, '2025-08-08 17:35:01', '2025-08-08 17:35:01', 0.00, 0.00, 21.60, NULL),
(903, 127, 126, 10.00, 5.50, 55.00, '2025-08-08 17:35:01', '2025-08-08 17:35:01', 0.00, 0.00, 5.00, NULL),
(904, 127, 127, 10.00, 5.50, 55.00, '2025-08-08 17:35:01', '2025-08-08 17:35:01', 0.00, 0.00, 5.00, NULL),
(905, 127, 78, 10.00, 25.00, 250.00, '2025-08-08 17:35:01', '2025-08-08 17:35:01', 0.00, 0.00, 23.50, NULL),
(906, 128, 28, 10.00, 23.50, 235.00, '2025-08-11 08:06:40', '2025-08-11 08:06:40', 0.00, 0.00, 22.00, NULL),
(907, 129, 174, 144.00, 22.00, 3168.00, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 21.00, NULL),
(908, 129, 246, 48.00, 8.50, 408.00, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 7.50, NULL),
(909, 129, 187, 48.00, 8.50, 408.00, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 7.50, NULL),
(910, 129, 185, 48.00, 8.50, 408.00, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 7.50, NULL),
(911, 129, 208, 16.00, 13.00, 208.00, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 12.60, NULL),
(912, 129, 222, 20.00, 10.50, 210.00, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 8.75, NULL),
(913, 129, 226, 20.00, 10.00, 200.00, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 8.75, NULL),
(914, 129, 193, 36.00, 10.00, 360.00, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 8.50, NULL),
(915, 129, 120, 25.00, 13.50, 337.50, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 13.00, NULL),
(916, 129, 156, 20.00, 19.80, 396.00, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 18.60, NULL),
(917, 129, 69, 25.00, 11.50, 287.50, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 9.50, NULL),
(918, 129, 29, 15.00, 23.50, 352.50, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 22.00, NULL),
(919, 129, 28, 15.00, 24.00, 360.00, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 22.00, NULL),
(920, 129, 88, 20.00, 24.86, 497.20, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 23.76, NULL),
(921, 129, 87, 15.00, 24.86, 372.90, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 24.20, NULL),
(922, 129, 22, 30.00, 18.08, 542.40, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 17.60, NULL),
(923, 129, 21, 40.00, 16.95, 678.00, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 16.50, NULL),
(924, 129, 19, 40.00, 19.21, 768.40, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 18.70, NULL),
(925, 129, 16, 25.00, 24.86, 621.50, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 0.00, 0.00, 24.30, NULL),
(926, 130, 43, 5.00, 14.50, 72.50, '2025-08-11 09:40:44', '2025-08-11 09:40:44', 0.00, 0.00, 13.75, NULL),
(927, 130, 53, 2.00, 12.50, 25.00, '2025-08-11 09:40:44', '2025-08-11 09:40:44', 0.00, 0.00, 11.75, NULL),
(928, 131, 79, 1.00, 16.00, 16.00, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 14.25, NULL),
(929, 131, 76, 1.00, 16.00, 16.00, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 13.50, NULL),
(930, 131, 84, 2.00, 20.00, 40.00, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 18.00, NULL),
(931, 131, 33, 1.00, 11.00, 11.00, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 9.75, NULL),
(932, 131, 201, 1.00, 10.00, 10.00, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 8.50, NULL),
(933, 131, 43, 1.00, 16.00, 16.00, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 13.75, NULL),
(934, 131, 82, 1.00, 15.00, 15.00, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 12.00, NULL),
(935, 131, 118, 1.00, 24.00, 24.00, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 19.00, NULL),
(936, 131, 156, 1.00, 20.00, 20.00, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 18.60, NULL),
(937, 131, 29, 1.00, 25.00, 25.00, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 22.00, NULL),
(938, 131, 26, 1.00, 20.00, 20.00, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 18.00, NULL),
(939, 131, 61, 1.00, 19.00, 19.00, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 16.00, NULL),
(940, 131, 24, 1.00, 25.00, 25.00, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 21.60, NULL),
(941, 131, 38, 1.00, 11.00, 11.00, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 9.25, NULL),
(942, 131, 88, 1.00, 26.40, 26.40, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 23.76, NULL),
(943, 131, 16, 1.00, 26.40, 26.40, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 24.30, NULL),
(944, 131, 196, 1.00, 9.50, 9.50, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 8.50, NULL),
(945, 131, 197, 1.00, 9.50, 9.50, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 8.50, NULL),
(946, 131, 207, 1.00, 13.50, 13.50, '2025-08-11 10:56:24', '2025-08-11 10:56:24', 0.00, 0.00, 12.60, NULL),
(947, 132, 252, 1.00, 6.50, 6.50, '2025-08-11 11:16:36', '2025-08-11 11:16:36', 0.00, 0.00, 5.22, NULL),
(948, 132, 128, 1.00, 6.00, 6.00, '2025-08-11 11:16:36', '2025-08-11 11:16:36', 0.00, 0.00, 5.00, NULL),
(949, 132, 126, 1.00, 6.00, 6.00, '2025-08-11 11:16:36', '2025-08-11 11:16:36', 0.00, 0.00, 5.00, NULL),
(950, 132, 156, 1.00, 20.00, 20.00, '2025-08-11 11:16:36', '2025-08-11 11:16:36', 0.00, 0.00, 18.60, NULL),
(951, 132, 229, 1.00, 14.00, 14.00, '2025-08-11 11:16:36', '2025-08-11 11:16:36', 0.00, 0.00, 12.00, NULL),
(952, 133, 27, 1.00, 20.00, 20.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 18.00, NULL),
(953, 133, 28, 1.00, 26.00, 26.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 22.00, NULL),
(954, 133, 29, 1.00, 25.00, 25.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 22.00, NULL),
(955, 133, 26, 1.00, 20.00, 20.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 18.00, NULL),
(956, 133, 116, 2.00, 15.30, 30.60, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 14.04, NULL),
(957, 133, 111, 1.00, 21.25, 21.25, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 19.50, NULL),
(958, 133, 112, 1.00, 21.25, 21.25, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 19.50, NULL),
(959, 133, 109, 1.00, 19.55, 19.55, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 17.94, NULL),
(960, 133, 86, 3.00, 12.00, 36.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 9.50, NULL),
(961, 133, 25, 1.00, 27.00, 27.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 22.00, NULL),
(962, 133, 201, 1.00, 10.00, 10.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 8.50, NULL),
(963, 133, 156, 1.00, 20.00, 20.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 18.60, NULL),
(964, 133, 202, 1.00, 10.50, 10.50, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 9.00, NULL),
(965, 133, 200, 1.00, 9.50, 9.50, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 8.86, NULL),
(966, 133, 199, 1.00, 9.50, 9.50, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 8.86, NULL),
(967, 133, 252, 1.00, 6.50, 6.50, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 5.22, NULL),
(968, 133, 84, 2.00, 22.00, 44.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 18.00, NULL),
(969, 133, 80, 2.00, 29.00, 58.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 27.00, NULL),
(970, 133, 79, 1.00, 16.00, 16.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 14.25, NULL),
(971, 133, 38, 1.00, 11.00, 11.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 9.25, NULL),
(972, 133, 215, 1.00, 11.00, 11.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 9.50, NULL),
(973, 133, 123, 1.00, 11.50, 11.50, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 10.00, NULL),
(974, 133, 70, 1.00, 12.00, 12.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 10.00, NULL),
(975, 133, 42, 1.00, 16.00, 16.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 14.50, NULL),
(976, 133, 41, 1.00, 16.00, 16.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 14.50, NULL),
(977, 133, 39, 1.00, 16.00, 16.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 14.50, NULL),
(978, 133, 164, 1.00, 15.00, 15.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 22.00, NULL),
(979, 133, 73, 1.00, 19.00, 19.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 17.00, NULL),
(980, 133, 243, 1.00, 12.00, 12.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 10.00, NULL),
(981, 133, 46, 1.00, 20.00, 20.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 16.00, NULL),
(982, 133, 52, 1.00, 9.50, 9.50, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 8.50, NULL),
(983, 133, 77, 1.00, 30.00, 30.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 23.50, NULL),
(984, 133, 78, 1.00, 30.00, 30.00, '2025-08-11 11:59:34', '2025-08-11 11:59:34', 0.00, 0.00, 23.50, NULL),
(985, 134, 15, 10.00, 9.50, 95.00, '2025-08-11 12:07:01', '2025-08-11 12:07:01', 0.00, 0.00, 8.80, NULL),
(986, 134, 97, 1.00, 9.00, 9.00, '2025-08-11 12:07:01', '2025-08-11 12:07:01', 0.00, 0.00, 8.00, NULL),
(987, 134, 92, 1.00, 16.00, 16.00, '2025-08-11 12:07:01', '2025-08-11 12:07:01', 0.00, 0.00, 14.00, NULL),
(988, 134, 91, 2.00, 16.00, 32.00, '2025-08-11 12:07:01', '2025-08-11 12:07:01', 0.00, 0.00, 14.85, NULL),
(989, 134, 128, 1.00, 6.00, 6.00, '2025-08-11 12:07:01', '2025-08-11 12:07:01', 0.00, 0.00, 5.00, NULL),
(990, 134, 127, 1.00, 6.00, 6.00, '2025-08-11 12:07:01', '2025-08-11 12:07:01', 0.00, 0.00, 5.00, NULL),
(991, 134, 26, 1.00, 20.00, 20.00, '2025-08-11 12:07:01', '2025-08-11 12:07:01', 0.00, 0.00, 18.00, NULL),
(992, 134, 70, 1.00, 12.00, 12.00, '2025-08-11 12:07:01', '2025-08-11 12:07:01', 0.00, 0.00, 10.00, NULL),
(993, 135, 176, 1.00, 8.00, 8.00, '2025-08-11 13:46:00', '2025-08-11 13:46:00', 0.00, 0.00, 6.50, NULL),
(994, 135, 149, 1.00, 9.00, 9.00, '2025-08-11 13:46:00', '2025-08-11 13:46:00', 0.00, 0.00, 7.50, NULL),
(995, 135, 84, 1.00, 22.00, 22.00, '2025-08-11 13:46:00', '2025-08-11 13:46:00', 0.00, 0.00, 18.00, NULL),
(996, 135, 71, 1.00, 15.00, 15.00, '2025-08-11 13:46:00', '2025-08-11 13:46:00', 0.00, 0.00, 13.00, NULL),
(997, 136, 205, 8.00, 13.00, 104.00, '2025-08-11 13:48:32', '2025-08-11 13:48:32', 0.00, 0.00, 12.60, NULL),
(998, 136, 204, 8.00, 13.00, 104.00, '2025-08-11 13:48:32', '2025-08-11 13:48:32', 0.00, 0.00, 12.60, NULL),
(999, 136, 209, 36.00, 7.25, 261.00, '2025-08-11 13:48:32', '2025-08-11 13:48:32', 0.00, 0.00, 6.75, NULL),
(1000, 136, 213, 12.00, 7.25, 87.00, '2025-08-11 13:48:32', '2025-08-11 13:48:32', 0.00, 0.00, 6.90, NULL),
(1001, 136, 219, 12.00, 7.25, 87.00, '2025-08-11 13:48:32', '2025-08-11 13:48:32', 0.00, 0.00, 6.90, NULL),
(1002, 136, 246, 48.00, 8.50, 408.00, '2025-08-11 13:48:32', '2025-08-11 13:48:32', 0.00, 0.00, 7.50, NULL),
(1003, 136, 250, 16.00, 13.00, 208.00, '2025-08-11 13:48:32', '2025-08-11 13:48:32', 0.00, 0.00, 12.60, NULL),
(1004, 136, 222, 10.00, 10.50, 105.00, '2025-08-11 13:48:32', '2025-08-11 13:48:32', 0.00, 0.00, 8.75, NULL),
(1005, 136, 223, 10.00, 10.50, 105.00, '2025-08-11 13:48:32', '2025-08-11 13:48:32', 0.00, 0.00, 8.75, NULL),
(1006, 136, 195, 30.00, 10.00, 300.00, '2025-08-11 13:48:32', '2025-08-11 13:48:32', 0.00, 0.00, 8.50, NULL),
(1007, 136, 191, 36.00, 10.00, 360.00, '2025-08-11 13:48:32', '2025-08-11 13:48:32', 0.00, 0.00, 8.70, NULL),
(1008, 136, 156, 10.00, 19.60, 196.00, '2025-08-11 13:48:32', '2025-08-11 13:48:32', 0.00, 0.00, 18.60, NULL),
(1009, 136, 65, 30.00, 10.00, 300.00, '2025-08-11 13:48:32', '2025-08-11 13:48:32', 0.00, 0.00, 9.00, NULL),
(1010, 136, 38, 10.00, 9.75, 97.50, '2025-08-11 13:48:33', '2025-08-11 13:48:33', 0.00, 0.00, 9.25, NULL),
(1011, 136, 51, 12.00, 10.00, 120.00, '2025-08-11 13:48:33', '2025-08-11 13:48:33', 0.00, 0.00, 9.50, NULL),
(1012, 136, 53, 10.00, 12.50, 125.00, '2025-08-11 13:48:33', '2025-08-11 13:48:33', 0.00, 0.00, 11.75, NULL),
(1013, 136, 215, 20.00, 10.00, 200.00, '2025-08-11 13:48:33', '2025-08-11 13:48:33', 0.00, 0.00, 9.50, NULL),
(1014, 136, 33, 20.00, 10.00, 200.00, '2025-08-11 13:48:33', '2025-08-11 13:48:33', 0.00, 0.00, 9.75, NULL),
(1015, 136, 32, 10.00, 10.00, 100.00, '2025-08-11 13:48:33', '2025-08-11 13:48:33', 0.00, 0.00, 9.75, NULL),
(1016, 136, 42, 10.00, 15.00, 150.00, '2025-08-11 13:48:33', '2025-08-11 13:48:33', 0.00, 0.00, 14.50, NULL),
(1017, 136, 28, 5.00, 23.50, 117.50, '2025-08-11 13:48:33', '2025-08-11 13:48:33', 0.00, 0.00, 22.00, NULL),
(1018, 136, 29, 5.00, 23.50, 117.50, '2025-08-11 13:48:33', '2025-08-11 13:48:33', 0.00, 0.00, 22.00, NULL),
(1019, 136, 27, 10.00, 19.50, 195.00, '2025-08-11 13:48:33', '2025-08-11 13:48:33', 0.00, 0.00, 18.00, NULL);
INSERT INTO `sale_items` (`id`, `sale_id`, `product_id`, `qty`, `price`, `subtotal`, `created_at`, `updated_at`, `discount`, `tax`, `purchase_price`, `last_purchase_price`) VALUES
(1020, 136, 35, 10.00, 14.50, 145.00, '2025-08-11 13:48:33', '2025-08-11 13:48:33', 0.00, 0.00, 14.00, NULL),
(1021, 137, 88, 1.00, 25.30, 25.30, '2025-08-11 14:29:36', '2025-08-11 14:29:36', 0.00, 0.00, 23.76, NULL),
(1022, 138, 125, 1.00, 6.00, 6.00, '2025-08-11 14:47:39', '2025-08-11 14:47:39', 0.00, 0.00, 5.00, NULL),
(1023, 138, 227, 1.00, 10.50, 10.50, '2025-08-11 14:47:39', '2025-08-11 14:47:39', 0.00, 0.00, 8.75, NULL),
(1024, 138, 84, 1.00, 22.00, 22.00, '2025-08-11 14:47:39', '2025-08-11 14:47:39', 0.00, 0.00, 18.00, NULL),
(1025, 138, 80, 1.00, 29.00, 29.00, '2025-08-11 14:47:39', '2025-08-11 14:47:39', 0.00, 0.00, 27.00, NULL),
(1026, 138, 126, 1.00, 6.00, 6.00, '2025-08-11 14:47:39', '2025-08-11 14:47:39', 0.00, 0.00, 5.00, NULL),
(1027, 138, 127, 1.00, 6.00, 6.00, '2025-08-11 14:47:39', '2025-08-11 14:47:39', 0.00, 0.00, 5.00, NULL),
(1028, 138, 120, 2.00, 14.00, 28.00, '2025-08-11 14:47:39', '2025-08-11 14:47:39', 0.00, 0.00, 13.00, NULL),
(1029, 138, 38, 1.00, 11.00, 11.00, '2025-08-11 14:47:39', '2025-08-11 14:47:39', 0.00, 0.00, 9.25, NULL),
(1030, 138, 244, 3.00, 13.50, 40.50, '2025-08-11 14:47:39', '2025-08-11 14:47:39', 0.00, 0.00, 11.60, NULL),
(1031, 139, 24, 3.00, 24.00, 72.00, '2025-08-11 14:57:48', '2025-08-11 14:57:48', 0.00, 0.00, 21.60, NULL),
(1032, 139, 246, 2.00, 8.50, 17.00, '2025-08-11 14:57:48', '2025-08-11 14:57:48', 0.00, 0.00, 7.50, NULL),
(1033, 139, 186, 2.00, 8.50, 17.00, '2025-08-11 14:57:48', '2025-08-11 14:57:48', 0.00, 0.00, 7.50, NULL),
(1034, 139, 187, 2.00, 8.50, 17.00, '2025-08-11 14:57:48', '2025-08-11 14:57:48', 0.00, 0.00, 7.50, NULL),
(1035, 139, 192, 2.00, 9.75, 19.50, '2025-08-11 14:57:48', '2025-08-11 14:57:48', 0.00, 0.00, 8.50, NULL),
(1036, 139, 195, 2.00, 9.75, 19.50, '2025-08-11 14:57:48', '2025-08-11 14:57:48', 0.00, 0.00, 8.50, NULL),
(1037, 139, 226, 2.00, 9.75, 19.50, '2025-08-11 14:57:48', '2025-08-11 14:57:48', 0.00, 0.00, 8.75, NULL),
(1038, 139, 207, 1.00, 13.00, 13.00, '2025-08-11 14:57:48', '2025-08-11 14:57:48', 0.00, 0.00, 12.60, NULL),
(1039, 139, 205, 1.00, 13.00, 13.00, '2025-08-11 14:57:48', '2025-08-11 14:57:48', 0.00, 0.00, 12.60, NULL),
(1040, 139, 206, 1.00, 13.00, 13.00, '2025-08-11 14:57:48', '2025-08-11 14:57:48', 0.00, 0.00, 12.60, NULL),
(1041, 139, 220, 2.00, 9.00, 18.00, '2025-08-11 14:57:48', '2025-08-11 14:57:48', 0.00, 0.00, 8.00, NULL),
(1042, 140, 201, 60.00, 9.00, 540.00, '2025-08-11 17:35:52', '2025-08-11 17:35:52', 0.00, 0.00, 8.50, NULL),
(1043, 140, 252, 96.00, 6.00, 576.00, '2025-08-11 17:35:52', '2025-08-11 17:35:52', 0.00, 0.00, 5.22, NULL),
(1044, 140, 71, 24.00, 14.50, 348.00, '2025-08-11 17:35:52', '2025-08-11 17:35:52', 0.00, 0.00, 13.00, NULL),
(1045, 140, 202, 40.00, 9.50, 380.00, '2025-08-11 17:35:52', '2025-08-11 17:35:52', 0.00, 0.00, 9.00, NULL),
(1046, 140, 156, 40.00, 19.60, 784.00, '2025-08-11 17:35:52', '2025-08-11 17:35:52', 0.00, 0.00, 18.60, NULL),
(1047, 141, 252, 3.00, 6.50, 19.50, '2025-08-12 08:42:24', '2025-08-12 08:42:24', 0.00, 0.00, 5.22, NULL),
(1048, 141, 161, 1.00, 24.00, 24.00, '2025-08-12 08:42:24', '2025-08-12 08:42:24', 0.00, 0.00, 22.32, NULL),
(1049, 141, 80, 2.00, 29.00, 58.00, '2025-08-12 08:42:24', '2025-08-12 08:42:24', 0.00, 0.00, 27.00, NULL),
(1050, 142, 38, 1.00, 11.00, 11.00, '2025-08-12 08:49:37', '2025-08-12 08:49:37', 0.00, 0.00, 9.25, NULL),
(1051, 142, 84, 1.00, 22.00, 22.00, '2025-08-12 08:49:37', '2025-08-12 08:49:37', 0.00, 0.00, 18.00, NULL),
(1052, 142, 215, 1.00, 11.00, 11.00, '2025-08-12 08:49:37', '2025-08-12 08:49:37', 0.00, 0.00, 9.50, NULL),
(1053, 143, 120, 6.00, 13.00, 78.00, '2025-08-12 09:10:13', '2025-08-12 09:10:13', 0.00, 0.00, 13.00, NULL),
(1054, 143, 86, 1.00, 10.50, 10.50, '2025-08-12 09:10:13', '2025-08-12 09:10:13', 0.00, 0.00, 9.50, NULL),
(1055, 143, 202, 3.00, 10.00, 30.00, '2025-08-12 09:10:13', '2025-08-12 09:10:13', 0.00, 0.00, 9.00, NULL),
(1056, 143, 84, 3.00, 19.50, 58.50, '2025-08-12 09:10:13', '2025-08-12 09:10:13', 0.00, 0.00, 18.00, NULL),
(1057, 143, 38, 3.00, 10.00, 30.00, '2025-08-12 09:10:13', '2025-08-12 09:10:13', 0.00, 0.00, 9.25, NULL),
(1058, 143, 70, 1.00, 11.00, 11.00, '2025-08-12 09:10:13', '2025-08-12 09:10:13', 0.00, 0.00, 10.00, NULL),
(1059, 143, 69, 1.00, 11.00, 11.00, '2025-08-12 09:10:13', '2025-08-12 09:10:13', 0.00, 0.00, 9.50, NULL),
(1060, 143, 209, 2.00, 7.50, 15.00, '2025-08-12 09:10:13', '2025-08-12 09:10:13', 0.00, 0.00, 6.75, NULL),
(1061, 143, 78, 2.00, 25.00, 50.00, '2025-08-12 09:10:13', '2025-08-12 09:10:13', 0.00, 0.00, 23.50, NULL),
(1062, 143, 32, 1.00, 10.50, 10.50, '2025-08-12 09:10:13', '2025-08-12 09:10:13', 0.00, 0.00, 9.75, NULL),
(1063, 143, 215, 2.00, 10.50, 21.00, '2025-08-12 09:10:13', '2025-08-12 09:10:13', 0.00, 0.00, 9.50, NULL),
(1064, 143, 33, 1.00, 10.50, 10.50, '2025-08-12 09:10:13', '2025-08-12 09:10:13', 0.00, 0.00, 9.75, NULL),
(1065, 143, 156, 1.00, 19.60, 19.60, '2025-08-12 09:10:13', '2025-08-12 09:10:13', 0.00, 0.00, 18.60, NULL),
(1066, 143, 177, 20.00, 7.00, 140.00, '2025-08-12 09:10:13', '2025-08-12 09:10:13', 0.00, 0.00, 6.15, NULL),
(1067, 144, 84, 2.00, 22.00, 44.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 18.00, NULL),
(1068, 144, 61, 1.00, 19.00, 19.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 16.00, NULL),
(1069, 144, 120, 1.00, 14.00, 14.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 13.00, NULL),
(1070, 144, 197, 1.00, 9.50, 9.50, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 8.50, NULL),
(1071, 144, 202, 1.00, 10.00, 10.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 9.00, NULL),
(1072, 144, 200, 1.00, 9.50, 9.50, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 8.86, NULL),
(1073, 144, 199, 1.00, 9.50, 9.50, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 8.86, NULL),
(1074, 144, 18, 1.00, 25.20, 25.20, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 23.10, NULL),
(1075, 144, 22, 1.00, 19.20, 19.20, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 17.60, NULL),
(1076, 144, 17, 1.00, 21.60, 21.60, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 19.70, NULL),
(1077, 144, 21, 1.00, 18.00, 18.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 16.50, NULL),
(1078, 144, 246, 1.00, 9.00, 9.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 7.50, NULL),
(1079, 144, 187, 1.00, 9.00, 9.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 7.50, NULL),
(1080, 144, 188, 1.00, 9.00, 9.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 7.50, NULL),
(1081, 144, 227, 2.00, 10.50, 21.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 8.75, NULL),
(1082, 144, 195, 1.00, 10.50, 10.50, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 8.50, NULL),
(1083, 144, 192, 1.00, 10.50, 10.50, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 8.50, NULL),
(1084, 144, 226, 1.00, 10.50, 10.50, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 8.75, NULL),
(1085, 144, 81, 1.00, 25.00, 25.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 24.00, NULL),
(1086, 144, 235, 1.00, 10.00, 10.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 8.75, NULL),
(1087, 144, 236, 1.00, 10.00, 10.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 8.75, NULL),
(1088, 144, 232, 1.00, 10.00, 10.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 8.75, NULL),
(1089, 144, 238, 1.00, 10.00, 10.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 8.75, NULL),
(1090, 144, 229, 4.00, 14.00, 56.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 12.00, NULL),
(1091, 144, 146, 1.00, 9.00, 9.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 7.50, NULL),
(1092, 144, 147, 1.00, 9.00, 9.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 7.50, NULL),
(1093, 144, 145, 1.00, 9.00, 9.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 7.50, NULL),
(1094, 144, 149, 1.00, 9.00, 9.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 7.50, NULL),
(1095, 144, 80, 1.00, 29.00, 29.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 27.00, NULL),
(1096, 144, 38, 1.00, 11.00, 11.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 9.25, NULL),
(1097, 144, 163, 1.00, 60.00, 60.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 54.00, NULL),
(1098, 144, 95, 1.00, 20.00, 20.00, '2025-08-12 09:37:39', '2025-08-12 09:37:39', 0.00, 0.00, 14.25, NULL),
(1099, 145, 201, 1.00, 10.00, 10.00, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 8.50, NULL),
(1100, 145, 84, 1.00, 22.00, 22.00, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 18.00, NULL),
(1101, 145, 80, 1.00, 29.00, 29.00, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 27.00, NULL),
(1102, 145, 73, 1.00, 19.00, 19.00, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 17.00, NULL),
(1103, 145, 41, 1.00, 16.00, 16.00, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 14.50, NULL),
(1104, 145, 42, 1.00, 16.00, 16.00, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 14.50, NULL),
(1105, 145, 92, 1.00, 16.00, 16.00, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 14.00, NULL),
(1106, 145, 91, 1.00, 16.00, 16.00, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 14.85, NULL),
(1107, 145, 88, 1.00, 26.40, 26.40, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 23.76, NULL),
(1108, 145, 16, 1.00, 26.40, 26.40, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 24.30, NULL),
(1109, 145, 245, 1.00, 13.50, 13.50, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 11.60, NULL),
(1110, 145, 180, 1.00, 5.00, 5.00, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 4.00, NULL),
(1111, 145, 183, 1.00, 5.00, 5.00, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 4.00, NULL),
(1112, 145, 179, 1.00, 5.00, 5.00, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 4.00, NULL),
(1113, 145, 26, 1.00, 20.00, 20.00, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 18.00, NULL),
(1114, 145, 75, 1.00, 11.00, 11.00, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 9.00, NULL),
(1115, 145, 124, 1.00, 11.50, 11.50, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 10.00, NULL),
(1116, 145, 60, 1.00, 20.00, 20.00, '2025-08-12 11:06:54', '2025-08-12 11:06:54', 0.00, 0.00, 18.00, NULL),
(1117, 146, 116, 1.00, 15.30, 15.30, '2025-08-12 11:08:56', '2025-08-12 11:08:56', 0.00, 0.00, 14.04, NULL),
(1118, 146, 111, 1.00, 21.25, 21.25, '2025-08-12 11:08:56', '2025-08-12 11:08:56', 0.00, 0.00, 19.50, NULL),
(1119, 146, 78, 1.00, 30.00, 30.00, '2025-08-12 11:08:56', '2025-08-12 11:08:56', 0.00, 0.00, 23.50, NULL),
(1120, 147, 178, 160.00, 7.00, 1120.00, '2025-08-12 11:15:28', '2025-08-12 11:15:28', 0.00, 0.00, 6.50, NULL),
(1121, 147, 15, 84.00, 9.25, 777.00, '2025-08-12 11:15:28', '2025-08-12 11:15:28', 0.00, 0.00, 8.80, NULL),
(1122, 148, 120, 4.00, 13.00, 52.00, '2025-08-12 11:24:43', '2025-08-12 11:24:43', 0.00, 0.00, 13.00, NULL),
(1123, 148, 215, 10.00, 10.00, 100.00, '2025-08-12 11:24:43', '2025-08-12 11:24:43', 0.00, 0.00, 9.50, NULL),
(1124, 148, 33, 5.00, 10.00, 50.00, '2025-08-12 11:24:43', '2025-08-12 11:24:43', 0.00, 0.00, 9.75, NULL),
(1125, 148, 220, 12.00, 8.00, 96.00, '2025-08-12 11:24:43', '2025-08-12 11:24:43', 0.00, 0.00, 8.00, NULL),
(1126, 148, 198, 8.00, 9.60, 76.80, '2025-08-12 11:24:43', '2025-08-12 11:24:43', 0.00, 0.00, 8.50, NULL),
(1127, 148, 51, 2.00, 10.00, 20.00, '2025-08-12 11:24:43', '2025-08-12 11:24:43', 0.00, 0.00, 9.50, NULL),
(1128, 148, 91, 15.00, 15.00, 225.00, '2025-08-12 11:24:43', '2025-08-12 11:24:43', 0.00, 0.00, 14.85, NULL),
(1129, 148, 213, 4.00, 7.00, 28.00, '2025-08-12 11:24:43', '2025-08-12 11:24:43', 0.00, 0.00, 6.90, NULL),
(1130, 148, 209, 6.00, 7.00, 42.00, '2025-08-12 11:24:43', '2025-08-12 11:24:43', 0.00, 0.00, 6.75, NULL),
(1131, 148, 211, 2.00, 7.00, 14.00, '2025-08-12 11:24:43', '2025-08-12 11:24:43', 0.00, 0.00, 6.90, NULL),
(1132, 149, 91, 1.00, 16.00, 16.00, '2025-08-12 11:52:50', '2025-08-12 11:52:50', 0.00, 0.00, 14.85, NULL),
(1133, 149, 92, 3.00, 16.00, 48.00, '2025-08-12 11:52:50', '2025-08-12 11:52:50', 0.00, 0.00, 14.00, NULL),
(1134, 149, 229, 1.00, 14.00, 14.00, '2025-08-12 11:52:50', '2025-08-12 11:52:50', 0.00, 0.00, 12.00, NULL),
(1135, 150, 15, 80.00, 9.00, 720.00, '2025-08-12 11:59:21', '2025-08-12 11:59:21', 0.00, 0.00, 8.80, NULL),
(1136, 151, 15, 4.00, 10.00, 40.00, '2025-08-12 12:19:50', '2025-08-12 12:19:50', 0.00, 0.00, 8.80, NULL),
(1137, 151, 67, 1.00, 12.00, 12.00, '2025-08-12 12:19:50', '2025-08-12 12:19:50', 0.00, 0.00, 9.50, NULL),
(1138, 151, 130, 1.00, 18.70, 18.70, '2025-08-12 12:19:50', '2025-08-12 12:19:50', 0.00, 0.00, 16.25, NULL),
(1139, 151, 245, 1.00, 13.50, 13.50, '2025-08-12 12:19:50', '2025-08-12 12:19:50', 0.00, 0.00, 11.60, NULL),
(1140, 151, 142, 1.00, 12.00, 12.00, '2025-08-12 12:19:50', '2025-08-12 12:19:50', 0.00, 0.00, 9.50, NULL),
(1141, 151, 244, 1.00, 13.50, 13.50, '2025-08-12 12:19:50', '2025-08-12 12:19:50', 0.00, 0.00, 11.60, NULL),
(1142, 152, 248, 1.00, 13.50, 13.50, '2025-08-12 12:21:54', '2025-08-12 12:21:54', 0.00, 0.00, 12.50, NULL),
(1143, 153, 75, 1.00, 11.00, 11.00, '2025-08-12 13:37:34', '2025-08-12 13:37:34', 0.00, 0.00, 9.00, NULL),
(1144, 153, 158, 1.00, 13.50, 13.50, '2025-08-12 13:37:34', '2025-08-12 13:37:34', 0.00, 0.00, 11.00, NULL),
(1145, 153, 246, 1.00, 9.00, 9.00, '2025-08-12 13:37:34', '2025-08-12 13:37:34', 0.00, 0.00, 7.50, NULL),
(1146, 153, 189, 1.00, 9.00, 9.00, '2025-08-12 13:37:34', '2025-08-12 13:37:34', 0.00, 0.00, 7.50, NULL),
(1147, 153, 188, 1.00, 9.00, 9.00, '2025-08-12 13:37:34', '2025-08-12 13:37:34', 0.00, 0.00, 7.50, NULL),
(1148, 153, 185, 1.00, 9.00, 9.00, '2025-08-12 13:37:34', '2025-08-12 13:37:34', 0.00, 0.00, 7.50, NULL),
(1149, 153, 187, 1.00, 9.00, 9.00, '2025-08-12 13:37:34', '2025-08-12 13:37:34', 0.00, 0.00, 7.50, NULL),
(1150, 153, 193, 2.00, 10.50, 21.00, '2025-08-12 13:37:34', '2025-08-12 13:37:34', 0.00, 0.00, 8.50, NULL),
(1151, 153, 123, 1.00, 11.50, 11.50, '2025-08-12 13:37:34', '2025-08-12 13:37:34', 0.00, 0.00, 10.00, NULL),
(1152, 154, 156, 1.00, 20.00, 20.00, '2025-08-12 14:32:03', '2025-08-12 14:32:03', 0.00, 0.00, 18.60, NULL),
(1153, 154, 96, 2.00, 9.00, 18.00, '2025-08-12 14:32:03', '2025-08-12 14:32:03', 0.00, 0.00, 8.00, NULL),
(1154, 154, 86, 1.00, 12.00, 12.00, '2025-08-12 14:32:03', '2025-08-12 14:32:03', 0.00, 0.00, 9.50, NULL),
(1155, 154, 97, 1.00, 9.00, 9.00, '2025-08-12 14:32:03', '2025-08-12 14:32:03', 0.00, 0.00, 8.00, NULL),
(1156, 154, 98, 1.00, 9.00, 9.00, '2025-08-12 14:32:03', '2025-08-12 14:32:03', 0.00, 0.00, 8.00, NULL),
(1157, 154, 33, 1.00, 11.00, 11.00, '2025-08-12 14:32:03', '2025-08-12 14:32:03', 0.00, 0.00, 9.75, NULL),
(1158, 154, 92, 2.00, 16.00, 32.00, '2025-08-12 14:32:03', '2025-08-12 14:32:03', 0.00, 0.00, 14.00, NULL),
(1159, 155, 67, 1.00, 12.00, 12.00, '2025-08-12 14:47:01', '2025-08-12 14:47:01', 0.00, 0.00, 9.50, NULL),
(1160, 155, 256, 1.00, 12.00, 12.00, '2025-08-12 14:47:01', '2025-08-12 14:47:01', 0.00, 0.00, 10.00, NULL),
(1161, 156, 252, 5.00, 6.00, 30.00, '2025-08-12 14:53:53', '2025-08-12 14:53:53', 0.00, 0.00, 5.22, NULL),
(1162, 156, 201, 3.00, 9.50, 28.50, '2025-08-12 14:53:53', '2025-08-12 14:53:53', 0.00, 0.00, 8.50, NULL),
(1163, 156, 120, 1.00, 13.00, 13.00, '2025-08-12 14:53:53', '2025-08-12 14:53:53', 0.00, 0.00, 13.00, NULL),
(1164, 156, 119, 1.00, 10.50, 10.50, '2025-08-12 14:53:53', '2025-08-12 14:53:53', 0.00, 0.00, 10.00, NULL),
(1165, 156, 92, 1.00, 15.50, 15.50, '2025-08-12 14:53:53', '2025-08-12 14:53:53', 0.00, 0.00, 14.00, NULL),
(1166, 156, 174, 1.00, 22.00, 22.00, '2025-08-12 14:53:53', '2025-08-12 14:53:53', 0.00, 0.00, 21.00, NULL),
(1167, 156, 256, 2.00, 10.50, 21.00, '2025-08-12 14:53:53', '2025-08-12 14:53:53', 0.00, 0.00, 10.00, NULL),
(1168, 156, 140, 1.00, 10.50, 10.50, '2025-08-12 14:53:53', '2025-08-12 14:53:53', 0.00, 0.00, 9.50, NULL),
(1169, 156, 141, 1.00, 10.50, 10.50, '2025-08-12 14:53:53', '2025-08-12 14:53:53', 0.00, 0.00, 9.50, NULL),
(1170, 156, 142, 1.00, 10.50, 10.50, '2025-08-12 14:53:53', '2025-08-12 14:53:53', 0.00, 0.00, 9.50, NULL),
(1171, 156, 143, 1.00, 10.50, 10.50, '2025-08-12 14:53:53', '2025-08-12 14:53:53', 0.00, 0.00, 9.50, NULL),
(1172, 156, 138, 1.00, 14.50, 14.50, '2025-08-12 14:53:53', '2025-08-12 14:53:53', 0.00, 0.00, 13.50, NULL),
(1173, 156, 134, 1.00, 14.50, 14.50, '2025-08-12 14:53:53', '2025-08-12 14:53:53', 0.00, 0.00, 13.50, NULL),
(1174, 156, 130, 1.00, 18.00, 18.00, '2025-08-12 14:53:53', '2025-08-12 14:53:53', 0.00, 0.00, 16.25, NULL),
(1175, 157, 108, 1.00, 20.40, 20.40, '2025-08-12 15:10:42', '2025-08-12 15:10:42', 0.00, 0.00, 18.72, NULL),
(1176, 157, 116, 1.00, 15.30, 15.30, '2025-08-12 15:10:42', '2025-08-12 15:10:42', 0.00, 0.00, 14.04, NULL),
(1177, 157, 103, 1.00, 18.70, 18.70, '2025-08-12 15:10:42', '2025-08-12 15:10:42', 0.00, 0.00, 17.16, NULL),
(1178, 157, 111, 1.00, 21.25, 21.25, '2025-08-12 15:10:43', '2025-08-12 15:10:43', 0.00, 0.00, 19.50, NULL),
(1179, 157, 112, 1.00, 21.25, 21.25, '2025-08-12 15:10:43', '2025-08-12 15:10:43', 0.00, 0.00, 19.50, NULL),
(1180, 157, 110, 1.00, 15.30, 15.30, '2025-08-12 15:10:43', '2025-08-12 15:10:43', 0.00, 0.00, 14.04, NULL),
(1181, 157, 53, 1.00, 15.00, 15.00, '2025-08-12 15:10:43', '2025-08-12 15:10:43', 0.00, 0.00, 11.75, NULL),
(1182, 157, 78, 1.00, 30.00, 30.00, '2025-08-12 15:10:43', '2025-08-12 15:10:43', 0.00, 0.00, 23.50, NULL),
(1183, 157, 166, 1.00, 14.00, 14.00, '2025-08-12 15:10:43', '2025-08-12 15:10:43', 0.00, 0.00, 12.00, NULL),
(1184, 157, 167, 1.00, 14.00, 14.00, '2025-08-12 15:10:43', '2025-08-12 15:10:43', 0.00, 0.00, 12.00, NULL),
(1185, 157, 226, 1.00, 10.50, 10.50, '2025-08-12 15:10:43', '2025-08-12 15:10:43', 0.00, 0.00, 8.75, NULL),
(1186, 157, 193, 1.00, 10.50, 10.50, '2025-08-12 15:10:43', '2025-08-12 15:10:43', 0.00, 0.00, 8.50, NULL),
(1187, 157, 184, 1.00, 14.00, 14.00, '2025-08-12 15:10:43', '2025-08-12 15:10:43', 0.00, 0.00, 12.00, NULL),
(1188, 157, 201, 1.00, 10.00, 10.00, '2025-08-12 15:10:43', '2025-08-12 15:10:43', 0.00, 0.00, 8.50, NULL),
(1189, 157, 38, 1.00, 11.00, 11.00, '2025-08-12 15:10:43', '2025-08-12 15:10:43', 0.00, 0.00, 9.25, NULL),
(1190, 157, 249, 1.00, 13.50, 13.50, '2025-08-12 15:10:43', '2025-08-12 15:10:43', 0.00, 0.00, 12.60, NULL),
(1191, 157, 216, 1.00, 7.50, 7.50, '2025-08-12 15:10:43', '2025-08-12 15:10:43', 0.00, 0.00, 6.90, NULL),
(1192, 157, 238, 1.00, 10.00, 10.00, '2025-08-12 15:10:43', '2025-08-12 15:10:43', 0.00, 0.00, 8.75, NULL),
(1193, 157, 41, 1.00, 16.00, 16.00, '2025-08-12 15:10:43', '2025-08-12 15:10:43', 0.00, 0.00, 14.50, NULL),
(1194, 158, 202, 20.00, 10.00, 200.00, '2025-08-13 09:18:17', '2025-08-13 09:18:17', 0.00, 0.00, 9.00, NULL),
(1195, 158, 119, 20.00, 10.50, 210.00, '2025-08-13 09:18:17', '2025-08-13 09:18:17', 0.00, 0.00, 10.00, NULL),
(1196, 158, 92, 30.00, 15.50, 465.00, '2025-08-13 09:18:17', '2025-08-13 09:18:17', 0.00, 0.00, 14.00, NULL),
(1197, 158, 91, 30.00, 15.50, 465.00, '2025-08-13 09:18:17', '2025-08-13 09:18:17', 0.00, 0.00, 14.85, NULL),
(1198, 158, 124, 10.00, 11.00, 110.00, '2025-08-13 09:18:17', '2025-08-13 09:18:17', 0.00, 0.00, 10.00, NULL),
(1199, 158, 48, 10.00, 10.00, 100.00, '2025-08-13 09:18:17', '2025-08-13 09:18:17', 0.00, 0.00, 9.00, NULL),
(1200, 158, 225, 20.00, 9.50, 190.00, '2025-08-13 09:18:17', '2025-08-13 09:18:17', 0.00, 0.00, 8.75, NULL),
(1201, 158, 127, 10.00, 5.50, 55.00, '2025-08-13 09:18:17', '2025-08-13 09:18:17', 0.00, 0.00, 5.00, NULL),
(1202, 158, 72, 24.00, 14.00, 336.00, '2025-08-13 09:18:17', '2025-08-13 09:18:17', 0.00, 0.00, 13.00, NULL),
(1203, 158, 201, 20.00, 9.00, 180.00, '2025-08-13 09:18:17', '2025-08-13 09:18:17', 0.00, 0.00, 8.50, NULL),
(1204, 158, 235, 24.00, 9.50, 228.00, '2025-08-13 09:18:17', '2025-08-13 09:18:17', 0.00, 0.00, 8.75, NULL),
(1205, 158, 200, 15.00, 9.50, 142.50, '2025-08-13 09:18:17', '2025-08-13 09:18:17', 0.00, 0.00, 8.86, NULL),
(1206, 158, 199, 15.00, 9.50, 142.50, '2025-08-13 09:18:18', '2025-08-13 09:18:18', 0.00, 0.00, 8.86, NULL),
(1207, 158, 246, 24.00, 8.50, 204.00, '2025-08-13 09:18:18', '2025-08-13 09:18:18', 0.00, 0.00, 7.50, NULL),
(1208, 159, 197, 1.00, 9.50, 9.50, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 8.50, NULL),
(1209, 159, 86, 1.00, 12.00, 12.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 9.50, NULL),
(1210, 159, 92, 1.00, 16.00, 16.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 14.00, NULL),
(1211, 159, 91, 1.00, 16.00, 16.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 14.85, NULL),
(1212, 159, 228, 1.00, 5.50, 5.50, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 4.50, NULL),
(1213, 159, 48, 1.00, 11.00, 11.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 9.00, NULL),
(1214, 159, 76, 1.00, 16.00, 16.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 13.50, NULL),
(1215, 159, 156, 1.00, 20.00, 20.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 18.60, NULL),
(1216, 159, 224, 1.00, 24.00, 24.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 22.00, NULL),
(1217, 159, 119, 1.00, 12.50, 12.50, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 10.00, NULL),
(1218, 159, 120, 1.00, 13.50, 13.50, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 13.00, NULL),
(1219, 159, 89, 1.00, 11.00, 11.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 10.00, NULL),
(1220, 159, 69, 1.00, 12.00, 12.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 9.50, NULL),
(1221, 159, 72, 1.00, 15.00, 15.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 13.00, NULL),
(1222, 159, 71, 1.00, 15.00, 15.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 13.00, NULL),
(1223, 159, 80, 1.00, 29.00, 29.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 27.00, NULL),
(1224, 159, 202, 1.00, 10.00, 10.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 9.00, NULL),
(1225, 159, 152, 1.00, 9.00, 9.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 7.50, NULL),
(1226, 159, 163, 2.00, 60.00, 120.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 54.00, NULL),
(1227, 159, 15, 2.00, 9.00, 18.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 8.80, NULL),
(1228, 159, 148, 1.00, 9.00, 9.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 7.50, NULL),
(1229, 159, 146, 1.00, 9.00, 9.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 7.50, NULL),
(1230, 159, 64, 1.00, 25.20, 25.20, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 24.00, NULL),
(1231, 159, 26, 1.00, 20.00, 20.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 18.00, NULL),
(1232, 159, 28, 1.00, 26.00, 26.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 22.00, NULL),
(1233, 159, 25, 1.00, 24.50, 24.50, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 22.80, NULL),
(1234, 159, 154, 1.00, 15.00, 15.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 13.63, NULL),
(1235, 159, 155, 1.00, 15.00, 15.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 13.63, NULL),
(1236, 159, 153, 1.00, 15.00, 15.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 13.63, NULL),
(1237, 159, 87, 1.00, 25.30, 25.30, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 24.20, NULL),
(1238, 159, 88, 1.00, 25.30, 25.30, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 23.76, NULL),
(1239, 159, 19, 1.00, 19.55, 19.55, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 18.70, NULL),
(1240, 159, 17, 1.00, 20.70, 20.70, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 19.70, NULL),
(1241, 159, 18, 1.00, 24.15, 24.15, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 23.10, NULL),
(1242, 159, 193, 2.00, 10.00, 20.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 8.50, NULL),
(1243, 159, 227, 1.00, 10.00, 10.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 8.75, NULL),
(1244, 159, 192, 1.00, 10.00, 10.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 8.50, NULL),
(1245, 159, 194, 1.00, 11.50, 11.50, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 8.50, NULL),
(1246, 159, 190, 1.00, 7.00, 7.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 5.00, NULL),
(1247, 159, 191, 1.00, 10.00, 10.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 8.70, NULL),
(1248, 159, 208, 1.00, 13.00, 13.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 12.60, NULL),
(1249, 159, 204, 1.00, 13.00, 13.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 12.60, NULL),
(1250, 159, 205, 1.00, 13.00, 13.00, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 0.00, 0.00, 12.60, NULL),
(1251, 160, 70, 1.00, 12.00, 12.00, '2025-08-13 10:08:40', '2025-08-13 10:08:40', 0.00, 0.00, 10.00, NULL),
(1252, 160, 61, 1.00, 19.00, 19.00, '2025-08-13 10:08:40', '2025-08-13 10:08:40', 0.00, 0.00, 16.00, NULL),
(1253, 160, 91, 1.00, 16.00, 16.00, '2025-08-13 10:08:40', '2025-08-13 10:08:40', 0.00, 0.00, 14.85, NULL),
(1254, 160, 225, 2.00, 11.00, 22.00, '2025-08-13 10:08:40', '2025-08-13 10:08:40', 0.00, 0.00, 8.75, NULL),
(1255, 160, 180, 1.00, 5.00, 5.00, '2025-08-13 10:08:40', '2025-08-13 10:08:40', 0.00, 0.00, 3.75, NULL),
(1256, 160, 181, 1.00, 5.00, 5.00, '2025-08-13 10:08:40', '2025-08-13 10:08:40', 0.00, 0.00, 3.75, NULL),
(1257, 161, 92, 3.00, 16.00, 48.00, '2025-08-13 10:29:06', '2025-08-13 10:29:06', 0.00, 0.00, 14.00, NULL),
(1258, 161, 91, 3.00, 16.00, 48.00, '2025-08-13 10:29:06', '2025-08-13 10:29:06', 0.00, 0.00, 14.85, NULL),
(1259, 161, 76, 1.00, 16.00, 16.00, '2025-08-13 10:29:06', '2025-08-13 10:29:06', 0.00, 0.00, 13.50, NULL),
(1260, 161, 201, 1.00, 10.00, 10.00, '2025-08-13 10:29:06', '2025-08-13 10:29:06', 0.00, 0.00, 8.50, NULL),
(1261, 161, 61, 1.00, 19.00, 19.00, '2025-08-13 10:29:06', '2025-08-13 10:29:06', 0.00, 0.00, 16.00, NULL),
(1262, 161, 38, 1.00, 11.00, 11.00, '2025-08-13 10:29:06', '2025-08-13 10:29:06', 0.00, 0.00, 9.25, NULL),
(1263, 161, 41, 1.00, 16.00, 16.00, '2025-08-13 10:29:06', '2025-08-13 10:29:06', 0.00, 0.00, 14.50, NULL),
(1264, 161, 81, 1.00, 25.00, 25.00, '2025-08-13 10:29:06', '2025-08-13 10:29:06', 0.00, 0.00, 24.00, NULL),
(1265, 161, 124, 1.00, 11.50, 11.50, '2025-08-13 10:29:06', '2025-08-13 10:29:06', 0.00, 0.00, 10.00, NULL),
(1266, 161, 25, 1.00, 27.00, 27.00, '2025-08-13 10:29:06', '2025-08-13 10:29:06', 0.00, 0.00, 22.80, NULL),
(1267, 161, 192, 3.00, 10.50, 31.50, '2025-08-13 10:29:06', '2025-08-13 10:29:06', 0.00, 0.00, 8.50, NULL),
(1268, 161, 194, 1.00, 10.50, 10.50, '2025-08-13 10:29:06', '2025-08-13 10:29:06', 0.00, 0.00, 8.50, NULL),
(1269, 161, 226, 3.00, 10.50, 31.50, '2025-08-13 10:29:06', '2025-08-13 10:29:06', 0.00, 0.00, 8.75, NULL),
(1270, 161, 227, 1.00, 10.50, 10.50, '2025-08-13 10:29:06', '2025-08-13 10:29:06', 0.00, 0.00, 8.75, NULL),
(1271, 161, 232, 1.00, 10.00, 10.00, '2025-08-13 10:29:06', '2025-08-13 10:29:06', 0.00, 0.00, 8.75, NULL),
(1272, 162, 76, 15.00, 14.50, 217.50, '2025-08-13 11:22:56', '2025-08-13 11:22:56', 0.00, 0.00, 13.50, NULL),
(1273, 162, 166, 2.00, 13.00, 26.00, '2025-08-13 11:22:56', '2025-08-13 11:22:56', 0.00, 0.00, 12.00, NULL),
(1274, 163, 207, 1.00, 13.50, 13.50, '2025-08-13 11:41:42', '2025-08-13 11:41:42', 0.00, 0.00, 12.60, NULL),
(1275, 163, 204, 1.00, 13.50, 13.50, '2025-08-13 11:41:42', '2025-08-13 11:41:42', 0.00, 0.00, 12.60, NULL),
(1276, 163, 114, 1.00, 20.40, 20.40, '2025-08-13 11:41:42', '2025-08-13 11:41:42', 0.00, 0.00, 18.72, NULL),
(1277, 163, 101, 1.00, 18.70, 18.70, '2025-08-13 11:41:42', '2025-08-13 11:41:42', 0.00, 0.00, 17.16, NULL),
(1278, 163, 107, 1.00, 18.70, 18.70, '2025-08-13 11:41:42', '2025-08-13 11:41:42', 0.00, 0.00, 17.16, NULL),
(1279, 163, 112, 1.00, 21.25, 21.25, '2025-08-13 11:41:42', '2025-08-13 11:41:42', 0.00, 0.00, 19.50, NULL),
(1280, 163, 116, 1.00, 15.30, 15.30, '2025-08-13 11:41:42', '2025-08-13 11:41:42', 0.00, 0.00, 14.04, NULL),
(1281, 163, 104, 1.00, 18.70, 18.70, '2025-08-13 11:41:42', '2025-08-13 11:41:42', 0.00, 0.00, 17.16, NULL),
(1282, 163, 103, 1.00, 18.70, 18.70, '2025-08-13 11:41:42', '2025-08-13 11:41:42', 0.00, 0.00, 17.16, NULL),
(1283, 163, 56, 1.00, 15.00, 15.00, '2025-08-13 11:41:42', '2025-08-13 11:41:42', 0.00, 0.00, 12.70, NULL),
(1284, 163, 57, 1.00, 15.00, 15.00, '2025-08-13 11:41:42', '2025-08-13 11:41:42', 0.00, 0.00, 12.50, NULL),
(1285, 163, 102, 1.00, 18.70, 18.70, '2025-08-13 11:41:42', '2025-08-13 11:41:42', 0.00, 0.00, 17.16, NULL),
(1286, 163, 53, 1.00, 15.00, 15.00, '2025-08-13 11:41:42', '2025-08-13 11:41:42', 0.00, 0.00, 11.75, NULL),
(1287, 163, 228, 1.00, 5.50, 5.50, '2025-08-13 11:41:42', '2025-08-13 11:41:42', 0.00, 0.00, 4.50, NULL),
(1288, 163, 38, 1.00, 11.00, 11.00, '2025-08-13 11:41:42', '2025-08-13 11:41:42', 0.00, 0.00, 9.25, NULL),
(1289, 164, 177, 64.00, 6.50, 416.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 6.15, NULL),
(1290, 164, 199, 15.00, 9.50, 142.50, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 8.86, NULL),
(1291, 164, 219, 6.00, 7.50, 45.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 6.90, NULL),
(1292, 164, 209, 6.00, 7.50, 45.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 6.75, NULL),
(1293, 164, 73, 12.00, 18.00, 216.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 17.00, NULL),
(1294, 164, 204, 8.00, 13.00, 104.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 12.60, NULL),
(1295, 164, 59, 10.00, 14.00, 140.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 12.50, NULL),
(1296, 164, 43, 10.00, 15.00, 150.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 13.75, NULL),
(1297, 164, 42, 5.00, 15.50, 77.50, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 14.50, NULL),
(1298, 164, 91, 15.00, 15.50, 232.50, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 14.85, NULL),
(1299, 164, 33, 5.00, 10.50, 52.50, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 9.75, NULL),
(1300, 164, 24, 10.00, 20.00, 200.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 21.60, NULL),
(1301, 164, 29, 60.00, 23.00, 1380.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 22.00, NULL),
(1302, 164, 25, 10.00, 24.00, 240.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 22.80, NULL),
(1303, 164, 118, 13.00, 21.00, 273.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 19.00, NULL),
(1304, 164, 76, 20.00, 14.50, 290.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 13.50, NULL),
(1305, 164, 116, 5.00, 14.40, 72.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 14.04, NULL),
(1306, 164, 110, 6.00, 14.40, 86.40, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 14.04, NULL),
(1307, 164, 104, 5.00, 17.60, 88.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 17.16, NULL),
(1308, 164, 138, 5.00, 14.50, 72.50, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 13.50, NULL),
(1309, 164, 134, 5.00, 14.00, 70.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 13.50, NULL),
(1310, 164, 133, 5.00, 10.80, 54.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 9.75, NULL),
(1311, 164, 132, 10.00, 10.90, 109.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 10.12, NULL),
(1312, 164, 140, 10.00, 10.50, 105.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 9.50, NULL),
(1313, 164, 120, 20.00, 13.00, 260.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 13.00, NULL),
(1314, 164, 70, 26.00, 11.00, 286.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 10.00, NULL),
(1315, 164, 251, 60.00, 6.00, 360.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 4.50, NULL),
(1316, 164, 257, 12.00, 8.50, 102.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 6.50, NULL),
(1317, 164, 77, 10.00, 24.00, 240.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 23.50, NULL),
(1318, 164, 78, 10.00, 24.00, 240.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 23.50, NULL),
(1319, 164, 126, 10.00, 5.50, 55.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 5.00, NULL),
(1320, 164, 127, 5.00, 5.50, 27.50, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 5.00, NULL),
(1321, 164, 26, 15.00, 15.00, 225.00, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 0.00, 0.00, 18.00, NULL),
(1322, 165, 84, 1.00, 22.00, 22.00, '2025-08-13 13:28:53', '2025-08-13 13:28:53', 0.00, 0.00, 18.00, NULL),
(1323, 165, 123, 1.00, 11.50, 11.50, '2025-08-13 13:28:53', '2025-08-13 13:28:53', 0.00, 0.00, 10.00, NULL),
(1324, 165, 88, 1.00, 26.40, 26.40, '2025-08-13 13:28:53', '2025-08-13 13:28:53', 0.00, 0.00, 23.76, NULL),
(1325, 165, 15, 2.00, 10.00, 20.00, '2025-08-13 13:28:53', '2025-08-13 13:28:53', 0.00, 0.00, 8.80, NULL),
(1326, 166, 28, 40.00, 24.00, 960.00, '2025-08-13 13:37:17', '2025-08-13 13:37:17', 0.00, 0.00, 22.00, NULL),
(1327, 166, 91, 60.00, 15.50, 930.00, '2025-08-13 13:37:17', '2025-08-13 13:37:17', 0.00, 0.00, 14.85, NULL),
(1328, 166, 42, 20.00, 16.00, 320.00, '2025-08-13 13:37:17', '2025-08-13 13:37:17', 0.00, 0.00, 14.50, NULL),
(1329, 166, 92, 100.00, 15.50, 1550.00, '2025-08-13 13:37:17', '2025-08-13 13:37:17', 0.00, 0.00, 14.00, NULL),
(1330, 166, 76, 30.00, 15.00, 450.00, '2025-08-13 13:37:17', '2025-08-13 13:37:17', 0.00, 0.00, 13.50, NULL),
(1331, 166, 79, 15.00, 15.50, 232.50, '2025-08-13 13:37:17', '2025-08-13 13:37:17', 0.00, 0.00, 14.25, NULL),
(1332, 166, 29, 20.00, 24.00, 480.00, '2025-08-13 13:37:17', '2025-08-13 13:37:17', 0.00, 0.00, 22.00, NULL),
(1333, 166, 38, 50.00, 10.00, 500.00, '2025-08-13 13:37:17', '2025-08-13 13:37:17', 0.00, 0.00, 9.25, NULL),
(1334, 166, 48, 30.00, 9.60, 288.00, '2025-08-13 13:37:17', '2025-08-13 13:37:17', 0.00, 0.00, 9.00, NULL),
(1335, 167, 76, 20.00, 15.00, 300.00, '2025-08-13 14:07:29', '2025-08-13 14:07:29', 0.00, 0.00, 13.50, NULL),
(1336, 167, 215, 10.00, 10.50, 105.00, '2025-08-13 14:07:29', '2025-08-13 14:07:29', 0.00, 0.00, 9.50, NULL),
(1337, 167, 33, 10.00, 10.50, 105.00, '2025-08-13 14:07:29', '2025-08-13 14:07:29', 0.00, 0.00, 9.75, NULL),
(1338, 167, 43, 5.00, 15.00, 75.00, '2025-08-13 14:07:29', '2025-08-13 14:07:29', 0.00, 0.00, 13.75, NULL),
(1339, 167, 38, 10.00, 10.00, 100.00, '2025-08-13 14:07:29', '2025-08-13 14:07:29', 0.00, 0.00, 9.25, NULL),
(1340, 167, 156, 10.00, 20.00, 200.00, '2025-08-13 14:07:29', '2025-08-13 14:07:29', 0.00, 0.00, 18.60, NULL),
(1341, 167, 27, 10.00, 19.50, 195.00, '2025-08-13 14:07:29', '2025-08-13 14:07:29', 0.00, 0.00, 18.00, NULL),
(1342, 167, 28, 5.00, 23.50, 117.50, '2025-08-13 14:07:29', '2025-08-13 14:07:29', 0.00, 0.00, 22.00, NULL),
(1343, 167, 29, 5.00, 23.50, 117.50, '2025-08-13 14:07:29', '2025-08-13 14:07:29', 0.00, 0.00, 22.00, NULL),
(1344, 167, 70, 10.00, 11.00, 110.00, '2025-08-13 14:07:29', '2025-08-13 14:07:29', 0.00, 0.00, 10.00, NULL),
(1345, 168, 164, 31.00, 12.00, 372.00, '2025-08-13 14:09:42', '2025-08-13 14:09:42', 0.00, 0.00, 22.00, NULL),
(1346, 168, 54, 7.00, 12.00, 84.00, '2025-08-13 14:09:42', '2025-08-13 14:09:42', 0.00, 0.00, 16.00, NULL),
(1347, 169, 92, 5.00, 16.00, 80.00, '2025-08-13 15:25:29', '2025-08-13 15:25:29', 0.00, 0.00, 14.00, NULL),
(1348, 169, 202, 2.00, 10.50, 21.00, '2025-08-13 15:25:29', '2025-08-13 15:25:29', 0.00, 0.00, 9.00, NULL),
(1349, 169, 120, 1.00, 14.00, 14.00, '2025-08-13 15:25:29', '2025-08-13 15:25:29', 0.00, 0.00, 13.00, NULL),
(1350, 169, 38, 1.00, 11.00, 11.00, '2025-08-13 15:25:29', '2025-08-13 15:25:29', 0.00, 0.00, 9.25, NULL),
(1351, 169, 76, 1.00, 16.00, 16.00, '2025-08-13 15:25:29', '2025-08-13 15:25:29', 0.00, 0.00, 13.50, NULL),
(1352, 169, 29, 2.00, 25.00, 50.00, '2025-08-13 15:25:29', '2025-08-13 15:25:29', 0.00, 0.00, 22.00, NULL),
(1353, 170, 145, 1.00, 9.00, 9.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 7.50, NULL),
(1354, 170, 151, 1.00, 9.00, 9.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 7.50, NULL),
(1355, 170, 149, 1.00, 9.00, 9.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 7.50, NULL),
(1356, 170, 144, 1.00, 9.00, 9.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 7.50, NULL),
(1357, 170, 146, 1.00, 9.00, 9.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 7.50, NULL),
(1358, 170, 179, 1.00, 5.00, 5.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 3.75, NULL),
(1359, 170, 180, 1.00, 5.00, 5.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 3.75, NULL),
(1360, 170, 182, 1.00, 5.00, 5.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 3.75, NULL),
(1361, 170, 181, 1.00, 5.00, 5.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 3.75, NULL),
(1362, 170, 79, 1.00, 16.00, 16.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 14.25, NULL),
(1363, 170, 76, 1.00, 16.00, 16.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 13.50, NULL),
(1364, 170, 224, 1.00, 23.00, 23.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 22.00, NULL),
(1365, 170, 215, 1.00, 11.00, 11.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 9.50, NULL),
(1366, 170, 33, 1.00, 11.00, 11.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 9.75, NULL),
(1367, 170, 72, 1.00, 15.00, 15.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 13.00, NULL),
(1368, 170, 71, 1.00, 15.00, 15.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 13.00, NULL),
(1369, 170, 91, 1.00, 16.00, 16.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 14.85, NULL),
(1370, 170, 92, 1.00, 16.00, 16.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 14.00, NULL),
(1371, 170, 89, 1.00, 11.00, 11.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 10.00, NULL),
(1372, 170, 156, 1.00, 20.00, 20.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 18.60, NULL),
(1373, 170, 155, 1.00, 15.00, 15.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 13.63, NULL),
(1374, 170, 153, 1.00, 15.00, 15.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 13.63, NULL),
(1375, 170, 154, 1.00, 15.00, 15.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 13.63, NULL),
(1376, 170, 42, 1.00, 16.00, 16.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 14.50, NULL),
(1377, 170, 22, 1.00, 18.40, 18.40, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 17.60, NULL),
(1378, 170, 19, 1.00, 19.55, 19.55, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 18.70, NULL),
(1379, 170, 28, 1.00, 26.00, 26.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 22.00, NULL),
(1380, 170, 24, 1.00, 25.00, 25.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 21.60, NULL),
(1381, 170, 174, 1.00, 22.00, 22.00, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 21.00, NULL),
(1382, 170, 228, 1.00, 5.50, 5.50, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 4.50, NULL),
(1383, 170, 222, 1.00, 10.50, 10.50, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 8.75, NULL),
(1384, 170, 226, 1.00, 10.50, 10.50, '2025-08-13 15:56:38', '2025-08-13 15:56:38', 0.00, 0.00, 8.75, NULL),
(1385, 170, 67, 1.00, 12.00, 12.00, '2025-08-13 15:56:39', '2025-08-13 15:56:39', 0.00, 0.00, 9.50, NULL),
(1386, 171, 246, 12.00, 8.50, 102.00, '2025-08-13 16:09:41', '2025-08-13 16:09:41', 0.00, 0.00, 7.50, NULL),
(1387, 171, 186, 12.00, 8.50, 102.00, '2025-08-13 16:09:41', '2025-08-13 16:09:41', 0.00, 0.00, 7.50, NULL),
(1388, 171, 187, 12.00, 8.50, 102.00, '2025-08-13 16:09:41', '2025-08-13 16:09:41', 0.00, 0.00, 7.50, NULL),
(1389, 171, 76, 10.00, 15.00, 150.00, '2025-08-13 16:09:41', '2025-08-13 16:09:41', 0.00, 0.00, 13.50, NULL),
(1390, 171, 118, 12.00, 22.00, 264.00, '2025-08-13 16:09:41', '2025-08-13 16:09:41', 0.00, 0.00, 19.00, NULL),
(1391, 171, 38, 15.00, 10.00, 150.00, '2025-08-13 16:09:41', '2025-08-13 16:09:41', 0.00, 0.00, 9.25, NULL),
(1392, 171, 78, 10.00, 25.00, 250.00, '2025-08-13 16:09:41', '2025-08-13 16:09:41', 0.00, 0.00, 23.50, NULL),
(1393, 171, 33, 10.00, 10.50, 105.00, '2025-08-13 16:09:41', '2025-08-13 16:09:41', 0.00, 0.00, 9.75, NULL),
(1394, 171, 215, 15.00, 10.50, 157.50, '2025-08-13 16:09:41', '2025-08-13 16:09:41', 0.00, 0.00, 9.50, NULL),
(1395, 171, 81, 10.00, 24.50, 245.00, '2025-08-13 16:09:41', '2025-08-13 16:09:41', 0.00, 0.00, 24.00, NULL),
(1396, 172, 201, 30.00, 9.00, 270.00, '2025-08-14 07:37:38', '2025-08-14 07:37:38', 0.00, 0.00, 8.50, NULL),
(1397, 172, 25, 30.00, 24.00, 720.00, '2025-08-14 07:37:38', '2025-08-14 07:37:38', 0.00, 0.00, 22.80, NULL),
(1398, 172, 57, 20.00, 14.00, 280.00, '2025-08-14 07:37:38', '2025-08-14 07:37:38', 0.00, 0.00, 12.50, NULL),
(1399, 172, 56, 15.00, 14.00, 210.00, '2025-08-14 07:37:38', '2025-08-14 07:37:38', 0.00, 0.00, 12.70, NULL),
(1400, 173, 156, 10.00, 20.00, 200.00, '2025-08-14 07:58:36', '2025-08-14 07:58:36', 0.00, 0.00, 18.60, NULL),
(1401, 173, 251, 20.00, 6.50, 130.00, '2025-08-14 07:58:36', '2025-08-14 07:58:36', 0.00, 0.00, 4.50, NULL),
(1402, 174, 29, 40.00, 23.00, 920.00, '2025-08-14 08:02:17', '2025-08-14 08:02:17', 0.00, 0.00, 22.00, NULL),
(1403, 175, 177, 15.00, 7.00, 105.00, '2025-08-14 11:04:45', '2025-08-14 11:04:45', 0.00, 0.00, 6.15, NULL),
(1404, 176, 27, 5.00, 19.50, 97.50, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 18.00, NULL),
(1405, 176, 43, 10.00, 15.00, 150.00, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 13.75, NULL),
(1406, 176, 155, 15.00, 14.25, 213.75, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 13.63, NULL),
(1407, 176, 50, 20.00, 14.25, 285.00, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 13.62, NULL),
(1408, 176, 77, 10.00, 25.00, 250.00, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 23.50, NULL),
(1409, 176, 78, 5.00, 25.00, 125.00, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 23.50, NULL),
(1410, 176, 48, 10.00, 9.75, 97.50, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 9.00, NULL),
(1411, 176, 25, 5.00, 24.00, 120.00, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 22.80, NULL),
(1412, 176, 33, 10.00, 10.50, 105.00, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 9.75, NULL),
(1413, 176, 256, 6.00, 8.00, 48.00, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 7.50, NULL),
(1414, 176, 162, 2.00, 30.00, 60.00, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 29.76, NULL),
(1415, 176, 161, 2.00, 23.00, 46.00, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 22.32, NULL),
(1416, 176, 76, 20.00, 15.00, 300.00, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 13.50, NULL),
(1417, 176, 58, 5.00, 14.00, 70.00, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 12.70, NULL),
(1418, 176, 59, 5.00, 14.00, 70.00, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 12.50, NULL),
(1419, 176, 57, 5.00, 14.00, 70.00, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 12.50, NULL),
(1420, 176, 201, 5.00, 9.50, 47.50, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 8.50, NULL),
(1421, 176, 219, 12.00, 7.50, 90.00, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 6.90, NULL),
(1422, 176, 191, 15.00, 9.75, 146.25, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 8.70, NULL),
(1423, 176, 225, 10.00, 9.50, 95.00, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 8.75, NULL),
(1424, 176, 239, 10.00, 9.50, 95.00, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 8.75, NULL),
(1425, 176, 91, 10.00, 15.50, 155.00, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 0.00, 0.00, 14.85, NULL),
(1426, 177, 178, 143.00, 7.00, 1001.00, '2025-08-14 12:19:40', '2025-08-14 12:19:40', 0.00, 0.00, 6.50, NULL),
(1427, 178, 229, 1.00, 14.00, 14.00, '2025-08-14 12:43:00', '2025-08-14 12:43:00', 0.00, 0.00, 12.00, NULL),
(1428, 179, 44, 1.00, 17.00, 17.00, '2025-08-14 14:03:14', '2025-08-14 14:03:14', 0.00, 0.00, 14.50, NULL),
(1429, 179, 84, 1.00, 22.00, 22.00, '2025-08-14 14:03:14', '2025-08-14 14:03:14', 0.00, 0.00, 18.00, NULL),
(1430, 180, 177, 12.00, 7.00, 84.00, '2025-08-14 14:35:17', '2025-08-14 14:35:17', 0.00, 0.00, 6.15, NULL),
(1431, 180, 84, 2.00, 22.00, 44.00, '2025-08-14 14:35:17', '2025-08-14 14:35:17', 0.00, 0.00, 18.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint UNSIGNED NOT NULL,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `group` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `group`, `created_at`, `updated_at`) VALUES
(1, 'company_name', 'Krimah Ltd', 'billing', '2025-07-08 06:44:07', '2025-07-19 13:48:05'),
(2, 'address', '2 Renwick Road,Barcking', 'billing', '2025-07-08 06:44:07', '2025-07-19 13:48:05'),
(3, 'city', 'London', 'billing', '2025-07-08 06:44:07', '2025-07-19 13:48:05'),
(4, 'state', 'UK', 'billing', '2025-07-08 06:44:07', '2025-07-08 06:44:07'),
(5, 'country', 'United Kingdom', 'billing', '2025-07-08 06:44:07', '2025-07-19 13:48:05'),
(6, 'gstin', '1234567890', 'billing', '2025-07-08 06:44:07', '2025-07-08 06:44:07'),
(7, 'phone', '07714291436', 'billing', '2025-07-08 06:44:07', '2025-07-28 18:57:19'),
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
  `id` bigint UNSIGNED NOT NULL,
  `category_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
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
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `contact_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `name`, `email`, `phone`, `address`, `contact_person`, `status`, `created_at`, `updated_at`) VALUES
(7, 'M PATEL', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:07:11', '2025-07-17 18:07:11'),
(8, 'J & M AMIRBHAI', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:07:22', '2025-07-29 18:08:16'),
(9, 'GURMEETPAJI', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:07:32', '2025-07-17 18:07:32'),
(10, 'BESTWAY VAN SALE', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:07:46', '2025-07-17 18:07:46'),
(11, 'DKS HAMJA', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:08:04', '2025-07-17 18:08:04'),
(12, 'DISCOUNT BRAND LTD', NULL, NULL, NULL, NULL, 'active', '2025-07-17 18:08:32', '2025-07-17 18:08:32'),
(13, 'VINODBHAI', NULL, NULL, NULL, NULL, 'active', '2025-07-18 12:26:18', '2025-07-29 18:07:57'),
(14, 'BASIR', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:08:38', '2025-07-29 18:08:38'),
(15, 'BESTWAY DIGANTBHAI', NULL, NULL, NULL, NULL, 'active', '2025-07-29 18:09:31', '2025-07-29 18:09:31'),
(16, 'MURATABI', NULL, NULL, NULL, NULL, 'active', '2025-08-03 19:17:49', '2025-08-03 19:17:49'),
(17, 'COBEV CASH AND CARRY', NULL, NULL, NULL, NULL, 'active', '2025-08-04 14:15:37', '2025-08-04 14:15:37'),
(18, 'JIM J&A CASH &CARRY', NULL, NULL, NULL, NULL, 'active', '2025-08-06 16:22:33', '2025-08-06 16:22:33'),
(19, 'COSTCO WHOLESALE', NULL, NULL, NULL, NULL, 'active', '2025-08-12 15:22:23', '2025-08-12 15:22:23');

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'PIECE', 'active', NULL, '2025-08-06 16:30:51'),
(2, 'BOX', 'active', NULL, '2025-08-06 16:29:53'),
(3, 'KG', 'active', NULL, '2025-08-06 16:30:10'),
(4, 'GRAM', 'active', NULL, '2025-08-06 16:30:04'),
(5, 'LITRE', 'active', NULL, '2025-08-06 16:30:19'),
(6, 'MILLILITRE', 'active', NULL, '2025-08-06 16:31:14'),
(7, 'PACKET', 'active', NULL, '2025-08-06 16:30:36'),
(8, 'DOZEN', 'active', NULL, '2025-08-06 16:31:49');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `email_verified_at`, `password`, `remember_token`, `status`, `first_name`, `last_name`, `address`, `city`, `country`, `bio`, `created_at`, `updated_at`) VALUES
(1, 'Krimah Admin', 'admin@example.com', '+7714291436', NULL, '$2y$10$1Mu9./3V6XrMxSM7eHcytuO21tvqmMzp3uIFkjQpLgd1f1XOuhkp2', NULL, 1, 'Krimah', 'Admin', '33 COLEBROOK LANE', 'LOUGHTON', 'United Kingdom', NULL, '2025-07-02 03:08:33', '2025-07-17 17:55:27'),
(5, 'Ankit Patel', 'ankit4yt@gmail.com', '89888843874', NULL, '$2y$10$7whYKfkxLr3iu2CL9i1KPODfzu2pkgf/NsUR1QzOKyPLuoDkiAVei', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-11 06:43:58', '2025-07-11 07:11:03'),
(7, 'SMIT PATEL', 'smitpatel18111999@gmail.com', '+7466277309', NULL, '$2y$10$G2cPGE805v3bE7oLaI1N0uHlr.ML1q.qeMLvOq3LQlJ050oB2QZa2', NULL, 1, 'SMIT', 'PATEL', NULL, NULL, NULL, NULL, '2025-07-17 17:51:47', '2025-08-06 11:29:34'),
(8, 'Alpeshkumar Patel', 'alpeshpatel82@icloud.com', '+447714291436', NULL, '$2y$10$Xg5P/MP7iyfMPy./kmcYEOzubLS1peo4/gREEGyP4Nsn4JJslille', NULL, 1, 'Alpeshkumar', 'Patel', '33 Colebrook Lane', 'Loughton', 'United Kingdom', NULL, '2025-07-29 13:15:33', '2025-07-30 19:05:19');

-- --------------------------------------------------------

--
-- Table structure for table `user_role`
--

CREATE TABLE `user_role` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_role`
--

INSERT INTO `user_role` (`id`, `user_id`, `role_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, NULL),
(3, 5, 1, NULL, NULL),
(6, 8, 2, NULL, NULL),
(7, 7, 15, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `wallet_accounts`
--

CREATE TABLE `wallet_accounts` (
  `id` bigint UNSIGNED NOT NULL,
  `party_type` enum('customer','retailer') COLLATE utf8mb4_unicode_ci NOT NULL,
  `party_id` bigint UNSIGNED NOT NULL,
  `current_balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wallet_accounts`
--

INSERT INTO `wallet_accounts` (`id`, `party_type`, `party_id`, `current_balance`, `created_at`, `updated_at`) VALUES
(10, 'customer', 7, -8605.00, '2025-07-17 18:00:35', '2025-08-08 12:17:03'),
(11, 'retailer', 8, 0.00, '2025-07-17 18:01:02', '2025-07-17 18:01:02'),
(12, 'customer', 9, -7659.00, '2025-07-17 18:01:21', '2025-08-14 12:07:09'),
(13, 'customer', 10, 0.00, '2025-07-17 18:01:32', '2025-07-17 18:01:32'),
(14, 'customer', 11, -7376.00, '2025-07-17 18:02:20', '2025-08-14 14:32:17'),
(15, 'customer', 12, -2850.00, '2025-07-17 18:02:56', '2025-08-04 16:49:42'),
(16, 'customer', 13, 0.00, '2025-07-17 18:03:32', '2025-07-17 18:03:32'),
(17, 'customer', 14, -228.30, '2025-07-17 18:03:41', '2025-08-14 09:30:41'),
(18, 'customer', 15, 0.00, '2025-07-17 18:03:53', '2025-07-18 19:22:58'),
(19, 'customer', 16, 0.00, '2025-07-17 18:03:59', '2025-07-23 06:07:30'),
(21, 'retailer', 18, 0.00, '2025-07-17 18:05:24', '2025-08-06 11:06:46'),
(22, 'retailer', 19, 0.00, '2025-07-17 18:05:35', '2025-08-08 07:47:15'),
(23, 'customer', 20, 0.00, '2025-07-17 18:05:53', '2025-08-06 12:50:36'),
(24, 'customer', 21, 0.00, '2025-07-17 18:06:00', '2025-07-17 18:06:00'),
(25, 'customer', 22, 0.00, '2025-07-17 18:06:19', '2025-07-18 09:29:49'),
(26, 'customer', 23, 0.00, '2025-07-18 09:34:31', '2025-08-08 14:37:55'),
(28, 'retailer', 25, 0.00, '2025-07-29 18:03:21', '2025-07-29 18:03:21'),
(29, 'retailer', 26, 0.00, '2025-07-29 18:03:38', '2025-07-29 18:03:38'),
(30, 'retailer', 27, 0.00, '2025-07-29 18:06:37', '2025-08-06 11:05:24'),
(31, 'customer', 28, -3329.00, '2025-07-29 18:10:33', '2025-08-13 14:07:29'),
(32, 'customer', 29, -3028.00, '2025-07-29 18:10:46', '2025-08-13 09:18:18'),
(33, 'customer', 30, -1628.00, '2025-07-29 18:11:32', '2025-08-13 16:09:41'),
(34, 'customer', 31, 0.00, '2025-07-29 18:11:57', '2025-07-29 18:11:57'),
(35, 'customer', 32, 0.00, '2025-07-29 18:12:07', '2025-08-08 11:43:01'),
(36, 'customer', 33, 0.00, '2025-07-29 18:12:23', '2025-07-29 18:12:23'),
(37, 'customer', 34, -4550.00, '2025-07-29 18:13:34', '2025-08-05 08:30:58'),
(38, 'customer', 35, 0.00, '2025-07-29 18:14:37', '2025-07-29 18:14:37'),
(39, 'customer', 36, 0.00, '2025-07-29 18:15:17', '2025-08-08 19:21:58'),
(40, 'customer', 37, -2786.00, '2025-07-29 18:16:31', '2025-08-04 09:26:44'),
(41, 'customer', 38, 0.00, '2025-07-29 18:16:56', '2025-07-29 18:16:56'),
(42, 'customer', 39, 0.00, '2025-07-29 18:17:24', '2025-07-29 18:17:24'),
(43, 'customer', 40, -1247.00, '2025-07-29 18:17:57', '2025-08-06 09:00:30'),
(44, 'customer', 41, 0.00, '2025-07-29 18:18:28', '2025-07-29 18:18:28'),
(45, 'customer', 42, 0.00, '2025-07-29 18:18:56', '2025-07-29 18:18:56'),
(46, 'customer', 43, 0.00, '2025-07-29 18:19:27', '2025-07-29 18:19:27'),
(47, 'customer', 44, 0.00, '2025-07-29 18:20:54', '2025-08-13 09:24:22'),
(48, 'customer', 45, 1264.00, '2025-08-02 09:01:27', '2025-08-14 09:26:49'),
(49, 'customer', 46, 0.00, '2025-08-02 18:46:25', '2025-08-08 11:43:56'),
(50, 'customer', 47, 0.00, '2025-08-04 09:27:46', '2025-08-14 09:49:13'),
(51, 'retailer', 48, 0.00, '2025-08-04 12:48:56', '2025-08-04 13:15:12'),
(52, 'customer', 49, 0.00, '2025-08-04 15:34:16', '2025-08-04 15:34:16'),
(53, 'retailer', 49, -3647.00, '2025-08-04 15:49:00', '2025-08-05 12:08:08'),
(54, 'retailer', 50, -820.00, '2025-08-04 16:19:54', '2025-08-04 16:33:37'),
(55, 'customer', 51, 0.00, '2025-08-05 10:39:11', '2025-08-05 10:39:11'),
(56, 'customer', 52, -1810.00, '2025-08-06 11:33:21', '2025-08-14 07:58:36'),
(57, 'customer', 53, -1584.00, '2025-08-07 07:46:35', '2025-08-07 07:49:41'),
(58, 'customer', 54, 0.00, '2025-08-07 10:49:47', '2025-08-07 10:49:47'),
(59, 'customer', 55, 0.00, '2025-08-07 15:23:55', '2025-08-07 15:23:55'),
(60, 'customer', 56, -1525.00, '2025-08-08 08:01:30', '2025-08-08 08:03:11'),
(61, 'retailer', 57, 0.00, '2025-08-08 09:19:21', '2025-08-08 09:19:21'),
(62, 'customer', 8, 0.00, '2025-08-08 09:46:10', '2025-08-11 20:34:33'),
(63, 'customer', 58, 0.00, '2025-08-08 13:27:12', '2025-08-08 13:27:12'),
(64, 'customer', 59, -1532.00, '2025-08-08 15:01:08', '2025-08-08 15:06:49'),
(65, 'customer', 60, -3438.00, '2025-08-08 17:30:50', '2025-08-11 08:06:40'),
(66, 'customer', 61, 0.00, '2025-08-09 13:07:21', '2025-08-11 20:33:42'),
(67, 'customer', 62, 0.00, '2025-08-11 13:41:37', '2025-08-13 09:19:09'),
(68, 'customer', 63, 0.00, '2025-08-12 11:10:52', '2025-08-12 11:10:52'),
(69, 'customer', 64, 0.00, '2025-08-13 13:34:17', '2025-08-13 18:38:50'),
(70, 'customer', 65, 0.00, '2025-08-13 14:07:20', '2025-08-13 14:07:20'),
(71, 'customer', 66, 0.00, '2025-08-13 18:08:09', '2025-08-13 18:08:09'),
(72, 'customer', 67, 0.00, '2025-08-14 14:38:59', '2025-08-14 14:38:59');

-- --------------------------------------------------------

--
-- Table structure for table `wallet_transactions`
--

CREATE TABLE `wallet_transactions` (
  `id` bigint UNSIGNED NOT NULL,
  `wallet_id` bigint UNSIGNED NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_editable` tinyint(1) NOT NULL DEFAULT '1',
  `invoice_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wallet_transactions`
--

INSERT INTO `wallet_transactions` (`id`, `wallet_id`, `type`, `amount`, `payment_method`, `reference`, `is_editable`, `invoice_id`, `created_at`, `updated_at`, `description`) VALUES
(63, 49, 'debit', 3959.00, 'wallet', NULL, 1, NULL, '2025-08-04 08:59:53', '2025-08-04 08:59:53', 'Credit sale (due) for invoice INV-0040'),
(64, 40, 'debit', 2786.00, 'wallet', NULL, 1, NULL, '2025-08-04 09:26:44', '2025-08-04 09:26:44', 'Credit sale (due) for invoice INV-0041'),
(65, 51, 'debit', 874.00, 'wallet', NULL, 1, NULL, '2025-08-04 12:52:43', '2025-08-04 12:52:43', 'Credit sale (due) for invoice INV-0044'),
(66, 51, 'credit', 874.00, 'cash', NULL, 1, NULL, '2025-08-04 13:15:12', '2025-08-04 13:15:12', NULL),
(67, 35, 'debit', 3492.00, 'wallet', NULL, 1, NULL, '2025-08-04 14:12:58', '2025-08-04 14:12:58', 'Credit sale (due) for invoice INV-0045'),
(69, 53, 'debit', 2207.00, 'wallet', NULL, 1, NULL, '2025-08-04 15:49:00', '2025-08-04 15:49:00', 'Credit sale (due) for invoice INV-0047'),
(70, 50, 'debit', 3042.00, 'wallet', NULL, 1, NULL, '2025-08-04 16:13:58', '2025-08-04 16:13:58', 'Credit sale (due) for invoice INV-0048'),
(71, 50, 'credit', 1100.00, 'cash', NULL, 1, NULL, '2025-08-04 16:15:05', '2025-08-04 16:15:05', NULL),
(72, 50, 'credit', 810.00, 'cash', NULL, 1, NULL, '2025-08-04 16:15:18', '2025-08-04 16:15:18', NULL),
(74, 54, 'debit', 820.00, 'wallet', NULL, 1, NULL, '2025-08-04 16:33:37', '2025-08-04 16:33:37', 'Credit sale (due) for invoice INV-0050'),
(75, 15, 'debit', 2850.00, 'wallet', NULL, 1, NULL, '2025-08-04 16:49:42', '2025-08-04 16:49:42', 'Credit sale (due) for invoice INV-0051'),
(76, 50, 'debit', 820.00, 'cash', NULL, 1, NULL, '2025-08-04 16:50:22', '2025-08-04 16:52:34', 'Credit sale (due) for invoice INV-0052'),
(77, 50, 'credit', 820.00, 'bank_transfer', NULL, 1, NULL, '2025-08-05 07:08:29', '2025-08-05 07:08:29', NULL),
(78, 37, 'debit', 4550.00, 'wallet', NULL, 1, NULL, '2025-08-05 08:30:58', '2025-08-05 08:30:58', 'Credit sale (due) for invoice INV-0054'),
(79, 31, 'debit', 1904.00, 'wallet', NULL, 1, NULL, '2025-08-05 08:38:47', '2025-08-05 08:38:47', 'Credit sale (due) for invoice INV-0055'),
(80, 39, 'debit', 3041.00, 'wallet', NULL, 1, NULL, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 'Credit sale (due) for invoice INV-0061'),
(81, 39, 'debit', 3041.00, 'wallet', NULL, 1, NULL, '2025-08-05 10:52:05', '2025-08-05 10:52:05', 'Credit sale (due) for invoice INV-0062'),
(82, 53, 'debit', 1440.00, 'wallet', NULL, 1, NULL, '2025-08-05 12:08:08', '2025-08-05 12:08:08', 'Credit sale (due) for invoice INV-0065'),
(83, 12, 'debit', 4571.00, 'wallet', NULL, 1, NULL, '2025-08-05 14:13:25', '2025-08-05 14:13:25', 'Credit sale (due) for invoice INV-0068'),
(84, 10, 'debit', 2140.00, 'wallet', NULL, 1, NULL, '2025-08-05 15:30:11', '2025-08-05 15:30:11', 'Credit sale (due) for invoice INV-0071'),
(87, 26, 'debit', 1590.00, NULL, NULL, 1, NULL, '2025-08-05 15:44:20', '2025-08-07 12:43:10', 'Credit sale (due) for invoice INV-0072'),
(88, 39, 'credit', 2993.00, 'cash', NULL, 1, NULL, '2025-08-05 15:48:50', '2025-08-05 15:48:50', NULL),
(89, 50, 'credit', 1100.00, 'cash', NULL, 1, NULL, '2025-08-05 18:02:00', '2025-08-05 18:02:00', 'SMITH'),
(90, 12, 'debit', 351.00, 'wallet', NULL, 1, NULL, '2025-08-06 08:38:16', '2025-08-06 08:38:16', 'Credit sale (due) for invoice INV-0075'),
(91, 43, 'debit', 1247.00, 'wallet', NULL, 1, NULL, '2025-08-06 09:00:30', '2025-08-06 09:00:30', 'Credit sale (due) for invoice INV-0076'),
(92, 21, 'debit', 855.00, 'wallet', NULL, 1, NULL, '2025-08-06 09:28:54', '2025-08-06 09:28:54', 'Credit sale (due) for invoice INV-0077'),
(95, 30, 'debit', 94.00, 'wallet', NULL, 1, NULL, '2025-08-06 10:56:05', '2025-08-06 10:56:05', 'Credit sale (due) for invoice INV-0080'),
(96, 48, 'credit', 1135.00, 'cash', NULL, 1, NULL, '2025-08-06 10:58:12', '2025-08-06 10:58:12', 'INV-79'),
(97, 48, 'credit', 129.00, 'cash', NULL, 1, NULL, '2025-08-06 10:58:32', '2025-08-06 10:58:32', 'INV-78'),
(98, 30, 'credit', 94.00, 'cash', NULL, 1, NULL, '2025-08-06 11:05:24', '2025-08-06 11:05:24', NULL),
(99, 21, 'credit', 855.00, 'cash', NULL, 1, NULL, '2025-08-06 11:06:46', '2025-08-06 11:06:46', '620 GIVE'),
(114, 23, 'debit', 533.00, 'wallet', NULL, 1, NULL, '2025-08-06 12:27:53', '2025-08-06 12:27:53', 'Credit sale (due) for invoice INV-0081'),
(115, 56, 'debit', 2889.00, 'wallet', NULL, 1, NULL, '2025-08-06 12:48:17', '2025-08-06 12:48:17', 'Credit sale (due) for invoice INV-0082'),
(116, 23, 'credit', 533.00, 'cash', NULL, 1, NULL, '2025-08-06 12:50:36', '2025-08-06 12:50:36', NULL),
(117, 14, 'debit', 3817.00, 'wallet', NULL, 1, NULL, '2025-08-06 13:04:23', '2025-08-06 13:04:23', 'Credit sale (due) for invoice INV-0084'),
(118, 47, 'debit', 1916.00, 'wallet', NULL, 1, NULL, '2025-08-06 17:17:45', '2025-08-06 17:17:45', 'Credit sale (due) for invoice INV-0089'),
(119, 57, 'debit', 1584.00, 'wallet', NULL, 1, NULL, '2025-08-07 07:49:41', '2025-08-07 07:49:41', 'Credit sale (due) for invoice INV-0090'),
(120, 14, 'debit', 524.00, 'cash', NULL, 1, NULL, '2025-08-07 11:47:38', '2025-08-14 14:30:03', 'Credit sale (due) for invoice INV-0099'),
(121, 22, 'debit', 156.00, 'wallet', NULL, 1, NULL, '2025-08-07 12:14:57', '2025-08-07 12:14:57', 'Credit sale (due) for invoice INV-0100'),
(122, 56, 'debit', 90.00, NULL, NULL, 1, NULL, '2025-08-07 16:48:08', '2025-08-07 16:52:08', 'Credit sale (due) for invoice INV-0110'),
(123, 56, 'credit', 90.00, 'cash', NULL, 1, NULL, '2025-08-07 21:19:56', '2025-08-07 21:19:56', NULL),
(124, 47, 'credit', 1916.00, 'cash', NULL, 1, NULL, '2025-08-07 21:24:22', '2025-08-07 21:24:22', NULL),
(125, 22, 'credit', 156.00, 'cash', NULL, 1, NULL, '2025-08-08 07:47:15', '2025-08-08 07:47:15', NULL),
(127, 56, 'credit', 1000.00, 'cash', NULL, 1, NULL, '2025-08-08 07:49:48', '2025-08-08 07:49:48', NULL),
(128, 56, 'credit', 1889.00, 'bank_transfer', NULL, 1, NULL, '2025-08-08 07:52:17', '2025-08-08 07:52:17', NULL),
(129, 60, 'debit', 1525.00, 'wallet', NULL, 1, NULL, '2025-08-08 08:03:11', '2025-08-08 08:03:11', 'Credit sale (due) for invoice INV-0112'),
(130, 62, 'debit', 1277.00, 'wallet', NULL, 1, NULL, '2025-08-08 09:46:10', '2025-08-08 09:46:10', 'Credit sale (due) for invoice INV-0115'),
(131, 49, 'debit', 2634.00, 'wallet', NULL, 1, NULL, '2025-08-08 11:12:50', '2025-08-08 11:12:50', 'Credit sale (due) for invoice INV-0116'),
(132, 49, 'credit', 2500.00, 'cash', NULL, 1, NULL, '2025-08-08 11:24:54', '2025-08-08 11:24:54', 'COIN'),
(133, 49, 'credit', 4093.00, 'cash', NULL, 1, NULL, '2025-08-08 11:30:17', '2025-08-08 11:30:17', NULL),
(134, 35, 'credit', 1492.00, 'bank_transfer', NULL, 1, NULL, '2025-08-08 11:42:48', '2025-08-08 11:42:48', NULL),
(135, 35, 'credit', 2000.00, 'cash', NULL, 1, NULL, '2025-08-08 11:43:01', '2025-08-08 11:43:01', NULL),
(136, 49, 'debit', 95.00, 'wallet', NULL, 1, NULL, '2025-08-08 11:43:35', '2025-08-08 11:43:35', 'Credit sale (due) for invoice INV-0118'),
(137, 49, 'credit', 95.00, 'cash', NULL, 1, NULL, '2025-08-08 11:43:56', '2025-08-08 11:43:56', NULL),
(138, 10, 'debit', 6465.00, 'wallet', NULL, 1, NULL, '2025-08-08 12:17:03', '2025-08-08 12:17:03', 'Credit sale (due) for invoice INV-0121'),
(139, 26, 'credit', 1200.00, 'cash', NULL, 1, NULL, '2025-08-08 14:37:45', '2025-08-08 14:37:45', 'KINDER -40\nKINDER  WHITE -40'),
(140, 26, 'credit', 390.00, 'cash', NULL, 1, NULL, '2025-08-08 14:37:55', '2025-08-08 14:37:55', NULL),
(141, 64, 'debit', 1532.00, 'wallet', NULL, 1, NULL, '2025-08-08 15:06:49', '2025-08-08 15:06:49', 'Credit sale (due) for invoice INV-0125'),
(142, 17, 'debit', 5631.00, 'wallet', NULL, 1, NULL, '2025-08-08 17:29:49', '2025-08-08 17:29:49', 'Credit sale (due) for invoice INV-0126'),
(143, 65, 'debit', 3203.00, 'wallet', NULL, 1, NULL, '2025-08-08 17:35:01', '2025-08-08 17:35:01', 'Credit sale (due) for invoice INV-0127'),
(144, 39, 'credit', 3089.00, 'cash', NULL, 1, NULL, '2025-08-08 19:21:58', '2025-08-08 19:21:58', NULL),
(145, 65, 'debit', 235.00, 'wallet', NULL, 1, NULL, '2025-08-11 08:06:40', '2025-08-11 08:06:40', 'Credit sale (due) for invoice INV-0128'),
(146, 66, 'debit', 10584.00, 'wallet', NULL, 1, NULL, '2025-08-11 08:30:56', '2025-08-11 08:30:56', 'Credit sale (due) for invoice INV-0129'),
(148, 66, 'credit', 3168.00, 'cash', NULL, 1, NULL, '2025-08-11 14:59:17', '2025-08-11 14:59:17', NULL),
(149, 47, 'debit', 2628.00, 'wallet', NULL, 1, NULL, '2025-08-11 17:35:52', '2025-08-11 17:35:52', 'Credit sale (due) for invoice INV-0140'),
(150, 66, 'credit', 7416.00, 'bank_transfer', NULL, 1, NULL, '2025-08-11 20:33:42', '2025-08-11 20:33:42', NULL),
(151, 62, 'credit', 1277.00, 'cash', NULL, 1, NULL, '2025-08-11 20:34:33', '2025-08-11 20:34:33', NULL),
(154, 48, 'debit', 720.00, 'wallet', NULL, 1, NULL, '2025-08-12 11:59:21', '2025-08-12 11:59:21', 'Credit sale (due) for invoice INV-0150'),
(155, 48, 'credit', 720.00, 'cash', NULL, 1, NULL, '2025-08-12 16:37:24', '2025-08-12 16:37:24', NULL),
(156, 32, 'debit', 3028.00, 'wallet', NULL, 1, NULL, '2025-08-13 09:18:18', '2025-08-13 09:18:18', 'Credit sale (due) for invoice INV-0158'),
(157, 47, 'credit', 2628.00, 'cash', NULL, 1, NULL, '2025-08-13 09:24:22', '2025-08-13 09:24:22', NULL),
(158, 48, 'debit', 776.00, 'wallet', NULL, 1, NULL, '2025-08-13 09:39:14', '2025-08-13 09:39:14', 'Credit sale (due) for invoice INV-0159'),
(159, 14, 'debit', 6456.00, 'wallet', NULL, 1, NULL, '2025-08-13 11:49:56', '2025-08-13 11:49:56', 'Credit sale (due) for invoice INV-0164'),
(160, 69, 'debit', 5711.00, 'wallet', NULL, 1, NULL, '2025-08-13 13:37:17', '2025-08-13 13:37:17', 'Credit sale (due) for invoice INV-0166'),
(161, 31, 'debit', 1425.00, 'wallet', NULL, 1, NULL, '2025-08-13 14:07:29', '2025-08-13 14:07:29', 'Credit sale (due) for invoice INV-0167'),
(162, 48, 'debit', 445.00, 'wallet', NULL, 1, NULL, '2025-08-13 15:56:39', '2025-08-13 15:56:39', 'Credit sale (due) for invoice INV-0170'),
(163, 33, 'debit', 1628.00, 'wallet', NULL, 1, NULL, '2025-08-13 16:09:41', '2025-08-13 16:09:41', 'Credit sale (due) for invoice INV-0171'),
(164, 69, 'credit', 5711.00, 'bank_transfer', NULL, 1, NULL, '2025-08-13 18:38:50', '2025-08-13 18:38:50', NULL),
(165, 56, 'debit', 1480.00, 'wallet', NULL, 1, NULL, '2025-08-14 07:37:38', '2025-08-14 07:37:38', 'Credit sale (due) for invoice INV-0172'),
(166, 56, 'debit', 330.00, 'wallet', NULL, 1, NULL, '2025-08-14 07:58:36', '2025-08-14 07:58:36', 'Credit sale (due) for invoice INV-0173'),
(167, 14, 'debit', 920.00, 'wallet', NULL, 1, NULL, '2025-08-14 08:02:17', '2025-08-14 08:02:17', 'Credit sale (due) for invoice INV-0174'),
(168, 48, 'credit', 1221.00, 'cash', NULL, 1, NULL, '2025-08-14 09:26:49', '2025-08-14 09:26:49', NULL),
(169, 17, 'credit', 5402.70, 'cash', NULL, 1, NULL, '2025-08-14 09:30:41', '2025-08-14 09:30:41', NULL),
(170, 50, 'credit', 32.00, 'cash', NULL, 1, NULL, '2025-08-14 09:49:13', '2025-08-14 09:49:13', NULL),
(171, 12, 'debit', 2737.00, 'wallet', NULL, 1, NULL, '2025-08-14 12:07:09', '2025-08-14 12:07:09', 'Credit sale (due) for invoice INV-0176'),
(172, 14, 'credit', 524.00, 'bank_transfer', '6000', 1, NULL, '2025-08-14 14:31:54', '2025-08-14 14:31:54', NULL),
(173, 14, 'credit', 3817.00, 'bank_transfer', '6000', 1, NULL, '2025-08-14 14:32:17', '2025-08-14 14:32:17', NULL);

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
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `emails`
--
ALTER TABLE `emails`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `expense_categories`
--
ALTER TABLE `expense_categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=169;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=265;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=476;

--
-- AUTO_INCREMENT for table `purchase_transactions`
--
ALTER TABLE `purchase_transactions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `role_permission`
--
ALTER TABLE `role_permission`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=129;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;

--
-- AUTO_INCREMENT for table `sales_transactions`
--
ALTER TABLE `sales_transactions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=215;

--
-- AUTO_INCREMENT for table `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1432;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `sub_categories`
--
ALTER TABLE `sub_categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `user_role`
--
ALTER TABLE `user_role`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `wallet_accounts`
--
ALTER TABLE `wallet_accounts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=174;

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
