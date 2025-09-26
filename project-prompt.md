# Project Prompt: Krimah POS

## Overview
Krimah POS is a full-stack Point of Sale system with a modular architecture, designed for retail and business management.

## Tech Stack
- **Frontend:** React (Vite), CoreUI, React Router
- **Backend:** Laravel (PHP), REST API
- **Database:** MySQL (typical for Laravel)

## Key Modules
- **User Management:** Manage users, roles, and permissions for secure access control.
- **Product Management:** Add, edit, and organize products, including categories, brands, and units.
- **Customer Management:** Maintain customer records, view history, and manage communications.
- **Supplier Management:** Track suppliers, their details, and related purchase activities.
- **Purchase Orders & Purchased List:** Create and manage purchase orders, track completed purchases, and handle supplier payments.
- **Sales (POS, Invoices):** Process sales through POS, manage invoices, and track sales history.
- **Wallet, Payment, Expense, Employee:** Handle employee records, expenses, payments, and wallet/ledger transactions.
- **Master Data:** Centralized management of categories, brands, units, and other reference data.
- **Dashboard:** Visual summary of business metrics and KPIs.
- **Settings:** Configure system preferences, billing, and email settings.
- **Email Inbox:** View and manage system-generated and user emails.

## Permissions System
- **Fine-grained permissions** for all actions (Add, Edit, Delete, View, Export, Print, Email, etc.)
- Permissions are checked in the frontend using `hasPermission('permission_name')` from `useAuth` context.
- Only permissions actually used in the UI are seeded in the backend for a clean, user-friendly experience.
- Top-bar and sidebar navigation are permission-guarded.
- Page-level access is enforced via route guards and early returns in components.

## Permission Naming Convention
- `view_*`, `create_*`, `edit_*`, `delete_*`, `export_*`, `print_*`, `email_*` for each module/submodule.
- Example: `view_product`, `edit_sale`, `create_email`, `view_setting`, etc.

## Deployment, Environment, and Build Information
- **Frontend:**
  - Uses a `.env` file (e.g., `.env`, `.env.local`) at the project root for environment variables such as `VITE_API_URL`.
  - **Development build:**
    - Start with `npm run dev` (uses `.env` or `.env.local` for config)
    - Change API/backend URL in `.env` (e.g., `VITE_API_URL=http://localhost:8000/api`)
  - **Production build:**
    - Build with `npm run build` (outputs to `dist/`)
    - Serve with `npm run preview` or deploy `dist/` to your web server
    - Change production API URL in `.env.production` or set environment variables before build
- **Backend:**
  - Uses a `.env` file at the Laravel project root for all environment configuration, including database, mail, and app settings.
  - **NOTE:** Laravel **only uses the `.env` file** at runtime. Files like `.env.production` or `.env.development` are just templates or backups. To use production settings, you must manually copy or rename `.env.production` to `.env` before starting the app.
  - **Development:**
    - Start server with `php artisan serve` (reads from `.env`)
    - Change DB, mail, or app settings in `.env`
  - **Production:**
    - Deploy code to server, set up `.env` with production values
    - Run `php artisan config:cache` and `php artisan migrate --force` as needed
- **Database:**
  - All database connection info is stored in the backend `.env` file.
  - Migrations and seeders are used for schema and initial data setup.

## Other Notes
- All permission logic is centralized and consistent across modules.
- The codebase is kept clean by only seeding and assigning permissions that are actually used in the UI/backend.
- For new features, add the permission to the seeder and use `hasPermission` in the UI as needed.

---

## Sample Nginx Server Block (Production Deployment)

This configuration serves the React frontend and proxies API requests to the Laravel backend. Adjust paths and domain as needed.

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name _;

    # Serve React frontend
    root /var/www/krimah/dist;
    index index.html;

    # Handle API requests and PHP for Laravel
    location ~ ^/api/(.*)\.php$ {
        alias /var/www/krimah/backend/public/$1.php;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME /var/www/krimah/backend/public/$1.php;
        include fastcgi_params;
    }

    location /api {
        alias /var/www/krimah/backend/public/;
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Handle frontend routing (React)
    location / {
        try_files $uri /index.html;
    }
}
```

---
**Use this file as a quick reference for project context, tech stack, deployment, build, and permission policy.** 