# Royal Estate Pro - Deployment Instructions

## Overview
Royal Estate Pro is a premium real estate website built with HTML, CSS, JavaScript, and PHP/MySQL. It features a responsive design, glassmorphism UI, and full backend for property management.

## Prerequisites
- Web server with PHP 7+ (e.g., Apache, Nginx)
- MySQL database
- Composer (optional for dependencies)

## Installation
1. **Clone or Download** the project files to your web server's root directory (e.g., `htdocs` for XAMPP).

2. **Database Setup**:
   - Create a database named `royal_estate_pro`.
   - Run the SQL script provided in the initial setup to create tables and insert sample data.

3. **Configuration**:
   - Update `php/config.php` with your MySQL credentials.
   - Replace `YOUR_API_KEY` in HTML files with your Google Maps API key.
   - Update WhatsApp number in `contact.html`.

4. **Permissions**:
   - Ensure the `images/` directory is writable for image uploads (chmod 755 or 777).

5. **Dependencies**:
   - No external PHP libraries are required, but ensure PDO is enabled in PHP.

## Usage
- **Frontend**: Access `index.html` for the website.
- **Admin Panel**: Visit `admin/index.php` (login: admin/password).
- **API Endpoints**: Used by JavaScript for dynamic content.

## Security Notes
- Change default admin credentials.
- Use HTTPS in production.
- Sanitize inputs and use prepared statements (already implemented).
- Hash passwords for admin login (upgrade from plain text).

## Performance
- Minify CSS/JS for production.
- Optimize images.
- Enable caching.

## Support
For issues, check console logs or contact the developer.