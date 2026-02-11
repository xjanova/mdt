# MDT ประตูไม้ - ระบบ ERP

ระบบ ERP สำหรับบริษัทประตูไม้ — พัฒนาด้วย Laravel 12, Tailwind CSS 4, Vite

---

## ติดตั้งบน Ubuntu (Quick Start)

### วิธีที่ 1: คำสั่งเดียว (แนะนำ)

```bash
sudo apt update && sudo apt install -y git curl
git clone https://github.com/xjanova/mdt.git
cd mdt
chmod +x *.sh
./quick-install.sh
```

### วิธีที่ 2: Interactive Install (เลือก MySQL/SQLite ได้)

```bash
git clone https://github.com/xjanova/mdt.git
cd mdt
chmod +x *.sh
./install.sh
```

---

## ติดตั้งบน Ubuntu Server (Production)

### 1. อัพเดทระบบ & ติดตั้ง Dependencies

```bash
sudo apt update && sudo apt upgrade -y

# PHP 8.2+
sudo apt install -y php php-cli php-fpm php-mbstring php-xml php-zip \
  php-curl php-bcmath php-tokenizer php-mysql php-sqlite3 php-gd unzip git curl

# Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Nginx
sudo apt install -y nginx

# MySQL (ถ้าใช้)
sudo apt install -y mysql-server
```

### 2. Clone & ติดตั้ง

```bash
cd /var/www
sudo git clone https://github.com/xjanova/mdt.git
sudo chown -R $USER:www-data mdt
cd mdt
chmod +x *.sh
./install.sh
```

### 3. ตั้งค่า Nginx

```bash
sudo nano /etc/nginx/sites-available/mdt
```

ใส่:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/mdt/public;
    index index.php;

    charset utf-8;
    client_max_body_size 20M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

เปิดใช้งาน:

```bash
sudo ln -s /etc/nginx/sites-available/mdt /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### 4. ตั้งค่า MySQL (ถ้าใช้)

```bash
sudo mysql -e "CREATE DATABASE mdt_erp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER 'mdt_user'@'localhost' IDENTIFIED BY 'your-password';"
sudo mysql -e "GRANT ALL PRIVILEGES ON mdt_erp.* TO 'mdt_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

แก้ไข `.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mdt_erp
DB_USERNAME=mdt_user
DB_PASSWORD=your-password
```

จากนั้น:

```bash
php artisan migrate --seed
```

### 5. SSL (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Deploy (อัพเดท)

```bash
cd /var/www/mdt
./deploy.sh
```

หรือแบบเร็ว:

```bash
./quick-deploy.sh
```

หรือสั่งผ่าน SSH:

```bash
ssh user@server 'cd /var/www/mdt && git pull && ./deploy.sh'
```

---

## คำสั่งที่มีประโยชน์

| คำสั่ง | คำอธิบาย |
|--------|----------|
| `./install.sh` | ติดตั้งแบบ interactive |
| `./quick-install.sh` | ติดตั้งแบบเร็ว (SQLite) |
| `./deploy.sh` | Deploy เต็มรูปแบบ |
| `./deploy.sh --dry-run` | จำลอง deploy (ไม่ทำจริง) |
| `./deploy.sh --branch=dev` | Deploy จาก branch ที่ระบุ |
| `./quick-deploy.sh` | Deploy แบบเร็ว |
| `./clear-cache.sh` | ล้าง cache ทั้งหมด |
| `./fix-permissions.sh` | แก้ไขสิทธิ์ไฟล์ |
| `./fix-permissions.sh www-data` | แก้ไขสิทธิ์ + เปลี่ยน owner |
| `./run-migrations.sh` | จัดการ migration (7 ตัวเลือก) |
| `./rollback.sh` | กู้คืนจาก backup |
| `./fix-line-endings.sh` | แก้ CRLF (Windows) -> LF (Linux) |
| `./setup-automation.sh` | ตั้งค่า git hooks & GitHub templates |
| `php artisan serve` | เริ่ม dev server (localhost:8000) |

---

## โครงสร้างโปรเจค

```
mdt/
├── app/                    # Application code
│   ├── Http/Controllers/   # Controllers
│   ├── Models/             # Eloquent Models
│   └── Services/           # Business Logic
├── config/                 # Configuration files
├── database/
│   ├── migrations/         # Database migrations
│   └── seeders/            # Data seeders
├── public/                 # Web root (Document Root)
├── resources/
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript
│   └── views/              # Blade templates
├── routes/                 # Route definitions
├── storage/                # Logs, cache, uploads
├── .env.example            # Environment template
├── .env.production.example # Production template
├── deploy.sh               # Deployment script
├── install.sh              # Interactive installer
├── quick-install.sh        # Quick installer
├── VERSION                 # Version number
└── ...
```

---

## System Requirements

- **PHP** >= 8.2 (with extensions: mbstring, xml, zip, curl, bcmath, gd)
- **Composer** >= 2.x
- **Node.js** >= 18 (recommended: 20 LTS)
- **Database**: SQLite (dev) หรือ MySQL 8.0+ (production)
- **Web Server**: Nginx (recommended) หรือ Apache
- **OS**: Ubuntu 22.04+ / Debian 12+

---

## License

MIT
