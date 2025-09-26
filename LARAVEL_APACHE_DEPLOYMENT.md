
**-------------Ankit Working Steps for production EC2 Server!--------------------**

# Prepare for Upload
**front-end**
- npm install
- npm run build
- upload only Dist folder files
**Back-end**
- all folders, exculude /vendor.  if any error related /storage during upload just skip it.
- dont upload .env, composer, like files.


# 1. Fix Permissions for Uploading (For Ubuntu user)

By default, `/var/www/html` is owned by `www-data` (the web server user). To upload as your user (`ubuntu`), temporarily change ownership:

```bash
sudo chown -R ubuntu:ubuntu /var/www/html
```

# 2. Restore Permission : Upload your files (frontend & back-end both), then **restore ownership to `www-data`** for security:

```bash
sudo chown -R www-data:www-data /var/www/html
```

## 3. Set Correct/Edit Permissions for Laravel

```bash
cd /var/www/html/backend
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```
OR

```bash
sudo chown -R www-data:www-data /var/www/html/backend/storage /var/www/html/backend/bootstrap/cache
sudo chmod -R 775 /var/www/html/backend/storage /var/www/html/backend/bootstrap/cache
```

# 4. Install composer dependencies as www-data
sudo -u www-data composer install --no-dev --optimize-autoloader

# 5. Set permissions again to make sure
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# 6. Run migrations (Optional)
sudo -u www-data php artisan migrate --force

# 7. Cache config, routes, views
sudo -u www-data php artisan config:cache
sudo -u www-data php artisan route:cache
sudo -u www-data php artisan view:cache

# Clear application cache
sudo -u www-data php artisan cache:clear

# 8. (Optional) Storage symlink
sudo -u www-data php artisan storage:link    --> Gives Error if allready available. Don't wory.

# 9. Restart Apache
sudo systemctl restart apache2
```




-------------------Notes only for refrence--------------------

# Step-by-Step: Laravel Backend Deployment on Apache (Ubuntu/EC2)

This guide will help you deploy your Laravel backend on an Apache server running Ubuntu (such as AWS EC2). It covers all necessary commands and best practices.

---

## **Assumptions**
- Your code is in `/var/www/html/backend`
- Apache is serving from `/var/www/html/backend/public`
- PHP-FPM is running as `www-data`
- You have uploaded your code (excluding `vendor/`)

---

## **1. Install Composer (if not already installed)**
```bash
sudo apt update
sudo apt install composer unzip -y
```

---

## **2. Install PHP Extensions (if not already installed)**
```bash
sudo apt install php php-fpm php-mbstring php-xml php-bcmath php-zip php-mysql php-curl php-gd -y
```

---

## **3. Install Laravel Dependencies**
```bash
cd /var/www/html/backend
sudo -u www-data composer install --no-dev --optimize-autoloader
```

---

## **4. Set Permissions**
```bash
sudo chown -R www-data:www-data /var/www/html/backend/storage /var/www/html/backend/bootstrap/cache
sudo chmod -R 775 /var/www/html/backend/storage /var/www/html/backend/bootstrap/cache
```
sudo chown -R www-data:www-data /var/www/html/backend
sudo chmod -R 775 /var/www/html/backend/storage /var/www/html/backend/bootstrap/cache

---

## **5. Copy/Edit .env**
- Copy `.env.example` to `.env` if not already done:
  ```bash
  cp .env.example .env
  ```
- Edit `.env` and set your production DB, mail, and app settings:
  ```bash
  nano .env
  ```

---

## **6. Generate Application Key**
```bash
sudo -u www-data php artisan key:generate
```

---

## **7. Run Migrations**
```bash
sudo -u www-data php artisan migrate --force
```

---

## **8. Cache Config, Routes, and Views**
```bash
sudo -u www-data php artisan config:cache
sudo -u www-data php artisan route:cache
sudo -u www-data php artisan view:cache
```

---

## **9. (Optional) Set up Storage Symlink**
```bash
sudo -u www-data php artisan storage:link
```

---

## **10. Restart Apache**
```bash
sudo systemctl restart apache2
```

---

## **Summary: All Commands Together**

```bash
# 1. Install dependencies
sudo apt update
sudo apt install composer unzip php php-fpm php-mbstring php-xml php-bcmath php-zip php-mysql php-curl php-gd -y

# 2. Go to your backend directory
cd /var/www/html/backend

# 3. Install composer dependencies as www-data
sudo -u www-data composer install --no-dev --optimize-autoloader

# 4. Set permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# 5. Copy and edit .env
cp .env.example .env
nano .env

# 6. Generate app key
sudo -u www-data php artisan key:generate

# 7. Run migrations
sudo -u www-data php artisan migrate --force

# 8. Cache config, routes, views
sudo -u www-data php artisan config:cache
sudo -u www-data php artisan route:cache
sudo -u www-data php artisan view:cache

# 9. (Optional) Storage symlink
sudo -u www-data php artisan storage:link

# 10. Restart Apache
sudo systemctl restart apache2
```

---

### **NOTES:**
- Always run `php artisan` and `composer` as `www-data` to avoid permission issues.
- If you upload new code, repeat steps 3, 4, and 8.
- If you get any errors, copy the error message here for help!

---

**Let me know if you need Apache vhost config or help with the frontend deployment!** 



