# Environment Variables Setup Guide

This document explains how to set up and use environment variables for the Krimah POS system.

## 📁 Environment Files Structure

```
├── .env                    # Default environment (development)
├── .env.development       # Development environment
├── .env.production        # Production environment
├── backend/
│   ├── .env              # Laravel development environment
│   ├── .env.development  # Laravel development environment
│   └── .env.production   # Laravel production environment
```

## 🚀 Frontend Environment Variables

### Development (`.env.development`)
```bash
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Krimah POS
VITE_APP_ENV=development
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

### Production (`.env.production`)
```bash
VITE_API_URL=https://api.yourdomain.com/api
VITE_APP_NAME=Krimah POS
VITE_APP_ENV=production
VITE_DEBUG=false
VITE_LOG_LEVEL=error
```

## 🔧 Backend Environment Variables

### Development (`backend/.env.development`)
```bash
APP_NAME="Krimah POS"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
DB_HOST=127.0.0.1
DB_DATABASE=krimah_db_live1
```

### Production (`backend/.env.production`)
```bash
APP_NAME="Krimah POS"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_DATABASE=krimah_pos
```

## 🗄️ Database Settings

### Frontend (React)
- The frontend does **not** connect directly to the database. It communicates with the backend API, whose URL is set via `VITE_API_URL` in your environment files.
- Example:
  - Development: `VITE_API_URL=http://localhost:8000/api`
  - Production: `VITE_API_URL=https://api.yourdomain.com/api`

### Backend (Laravel)
- The backend connects to the database using the following environment variables in `backend/.env`, `backend/.env.development`, or `backend/.env.production`:

```bash
DB_CONNECTION=mysql           # Database driver (usually mysql)
DB_HOST=127.0.0.1            # Database host (localhost for dev, RDS/Cloud for prod)
DB_PORT=3306                  # Database port (default for MySQL)
DB_DATABASE=krimah_db_live1   # Database name
DB_USERNAME=root              # Database username
DB_PASSWORD=                  # Database password
```

#### Example: Development
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=krimah_db_live1
DB_USERNAME=root
DB_PASSWORD=
```

#### Example: Production
```bash
DB_CONNECTION=mysql
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=3306
DB_DATABASE=krimah_pos
DB_USERNAME=your_db_username
DB_PASSWORD=your_secure_db_password
```

#### Best Practices
- **Never use the same database for development and production.**
- **Use strong, unique passwords** for production databases.
- **Restrict database access** to only necessary hosts (e.g., your app server).
- **Back up your production database** regularly.
- **Do not commit real credentials** to version control.
- For cloud databases (e.g., AWS RDS), use SSL and restrict inbound connections.

## 🏃‍♂️ Running Local Development & Building for Production

### Frontend (React)

#### Run Local Development Server
```bash
npm run dev
```
- Starts the React app in development mode using `.env.development`.
- Accessible at [http://localhost:3000](http://localhost:3000)

#### Build for Production
```bash
npm run build
```
- Creates an optimized production build using `.env.production`.
- Output is in the `dist/` folder, ready to be deployed to a web server or served by Laravel.

#### Preview Production Build Locally
```bash
npm run preview
```
- Serves the production build locally for testing.

---

### Backend (Laravel)

#### Run Local Development Server
```bash
cd backend
php artisan serve
```
- Starts the Laravel backend using `backend/.env` or `backend/.env.development`.
- Accessible at [http://localhost:8000](http://localhost:8000)

#### Prepare for Production
```bash
cd backend
cp .env.production .env
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```
- Copies production environment variables, installs dependencies, runs migrations, and caches config/routes/views for best performance.

---

**Tip:**
- Always test your production build locally with `npm run preview` before deploying.
- Never use development `.env` files in production.

## 📦 Available Scripts

### Frontend Scripts
```bash
# Development
npm run dev          # Start development server
npm run dev:prod     # Start development server with production env

# Build
npm run build        # Build for production
npm run build:dev    # Build for development

# Preview
npm run preview      # Preview production build
npm run serve        # Preview production build

# Linting
npm run lint         # Check for linting errors
npm run lint:fix     # Fix linting errors
```

### Backend Scripts
```bash
# Development
php artisan serve    # Start development server

# Production Setup
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🔐 Security Considerations

### Development
- Debug mode enabled
- Detailed error messages
- Local database
- HTTP connections

### Production
- Debug mode disabled
- Minimal error messages
- Secure database connections
- HTTPS only
- Secure session settings

## 🌍 Environment-Specific Features

### Development Features
- Hot module replacement
- Source maps
- Debug logging
- Mock data support
- Development tools

### Production Features
- Code minification
- Asset optimization
- Performance monitoring
- Error tracking
- Analytics

## 📝 Usage in Code

### Frontend (React)
```javascript
import config from './config/environment.js'

// Access environment variables
console.log(config.API_URL)
console.log(config.APP_NAME)

// Check environment
if (config.isDevelopment()) {
  console.log('Development mode')
}
```

### Backend (Laravel)
```php
// Access environment variables
$apiUrl = env('APP_URL');
$debug = env('APP_DEBUG', false);

// Check environment
if (app()->environment('local')) {
    // Development code
}
```

## 🔄 Switching Environments

### Frontend
```bash
# Development
npm run dev

# Production build
npm run build
```

### Backend
```bash
# Development
php artisan serve

# Production (copy .env.production to .env)
cp .env.production .env
php artisan config:cache
```

## 🚨 Important Notes

1. **Never commit sensitive data** to version control
2. **Use different databases** for development and production
3. **Enable HTTPS** in production
4. **Set secure passwords** for production databases
5. **Use environment-specific API keys** for external services

## 🔧 Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Check file naming (`.env.development`, `.env.production`)
   - Restart development server
   - Clear browser cache

2. **API connection issues**
   - Verify `VITE_API_URL` in environment files
   - Check CORS settings in Laravel
   - Ensure backend server is running

3. **Build errors**
   - Check for syntax errors in environment files
   - Verify all required variables are set
   - Clear build cache: `npm run build --force`

## 📚 Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Laravel Environment Configuration](https://laravel.com/docs/configuration)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)

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