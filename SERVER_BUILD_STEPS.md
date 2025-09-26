# Server Build & Deployment Steps for Developers

This guide explains how to deploy only the built frontend and backend artifacts to the server, and how to handle permissions for uploading files to `/var/www/html`.

---

## 1. Build the React Frontend Locally

```bash
cd /path/to/your/frontend
npm install
npm run build
```
- This creates a `dist/` folder with your production-ready static files.

---

## 2. Build the Laravel Backend Locally

```bash
cd /path/to/your/backend
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
# If you use Laravel Mix for assets:
npm install
npm run prod
```
- Make sure your `.env` is set for production.

---

## 3. Upload Build Artifacts to the Server

**You only need to upload:**
- The `dist/` folder (from React build)
- The `backend/` folder (with `vendor/`, `public/`, `storage/`, etc.)

**Recommended structure on the server:**
```
/var/www/html/
  ├── dist/                # React build output
  └── backend/             # Laravel backend (with vendor, public, etc.)
```

**Use `scp`, `rsync`, or SFTP to upload:**
```bash
scp -r /path/to/your/frontend/dist ubuntu@your-server:/var/www/html/
scp -r /path/to/your/backend ubuntu@your-server:/var/www/html/
```

---

## 4. Fix Permissions for Uploading

By default, `/var/www/html` is owned by `www-data` (the web server user). To upload as your user (`ubuntu`), temporarily change ownership:

```bash
sudo chown -R ubuntu:ubuntu /var/www/html
```

Upload your files, then **restore ownership to `www-data`** for security:

```bash
sudo chown -R www-data:www-data /var/www/html
```

---

## 5. Set Correct Permissions for Laravel

```bash
cd /var/www/html/backend
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

---

## 6. Set Up Environment Variables

- Make sure `/var/www/html/backend/.env` is correct for production (DB, cache, etc).

---

## 7. (Optional) Run Migrations and Seeders

If you need to set up the database:
```bash
php artisan migrate --force
php artisan db:seed --force
```

---

## 8. Restart Services

```bash
sudo systemctl reload nginx
sudo systemctl restart php8.4-fpm
```

---

## **Summary Table**

| Step                | Command (example)                                  |
|---------------------|----------------------------------------------------|
| 1. Allow upload     | `sudo chown -R ubuntu:ubuntu /var/www/html`        |
| 2. Upload files     | (use scp, sftp, etc.)                              |
| 3. Restore perms    | `sudo chown -R www-data:www-data /var/www/html`    |
| 4. Laravel perms    | `sudo chown -R www-data:www-data storage bootstrap/cache` |
| 5. Secure perms     | `chmod 755` for dirs, `chmod 644` for files        |

---

**Follow these steps for a smooth, secure deployment!** 