#!/bin/bash
set -e

# ===========================================
# MDT ประตูไม้ - Quick Install (Non-interactive)
# ติดตั้งแบบเร็ว ไม่ต้องตอบคำถาม
# ===========================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════╗"
echo "║   MDT ประตูไม้ - Quick Install               ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

cd "$(dirname "$0")"

# Step 1: Environment
echo -e "${BLUE}[1/8]${NC} ตั้งค่า Environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    sed -i 's|APP_NAME=.*|APP_NAME="MDT ประตูไม้"|' .env
    sed -i 's|DB_CONNECTION=.*|DB_CONNECTION=sqlite|' .env
    sed -i 's|APP_LOCALE=.*|APP_LOCALE=th|' .env
    sed -i 's|APP_FAKER_LOCALE=.*|APP_FAKER_LOCALE=th_TH|' .env
fi
echo -e "${GREEN}  ✓${NC} Environment configured"

# Step 2: Composer
echo -e "${BLUE}[2/8]${NC} ติดตั้ง PHP Dependencies..."
composer install --optimize-autoloader --no-interaction --quiet 2>/dev/null
echo -e "${GREEN}  ✓${NC} Composer packages installed"

# Step 3: npm
echo -e "${BLUE}[3/8]${NC} ติดตั้ง Node Dependencies..."
if command -v npm &> /dev/null; then
    npm install --silent 2>/dev/null || true
    echo -e "${GREEN}  ✓${NC} npm packages installed"
else
    echo -e "${YELLOW}  ⚠${NC} npm not found, skipping"
fi

# Step 4: App Key
echo -e "${BLUE}[4/8]${NC} สร้าง Application Key..."
php artisan key:generate --force --quiet
echo -e "${GREEN}  ✓${NC} Key generated"

# Step 5: SQLite Database
echo -e "${BLUE}[5/8]${NC} สร้างฐานข้อมูล SQLite..."
mkdir -p database
if [ ! -f database/database.sqlite ]; then
    touch database/database.sqlite
fi
echo -e "${GREEN}  ✓${NC} Database ready"

# Step 6: Migrations + Seed
echo -e "${BLUE}[6/8]${NC} รัน Migrations & Seed ข้อมูลตัวอย่าง..."
php artisan migrate --force --quiet
php artisan db:seed --force --quiet
echo -e "${GREEN}  ✓${NC} Database migrated and seeded"

# Step 7: Permissions
echo -e "${BLUE}[7/8]${NC} ตั้งค่า Permissions..."
mkdir -p storage/app/public
mkdir -p storage/framework/{cache/data,sessions,views}
mkdir -p storage/logs
mkdir -p bootstrap/cache
chmod -R 775 storage bootstrap/cache 2>/dev/null || true
php artisan storage:link --quiet 2>/dev/null || true
echo -e "${GREEN}  ✓${NC} Permissions set"

# Step 8: Build Assets
echo -e "${BLUE}[8/8]${NC} Build Assets..."
if command -v npm &> /dev/null; then
    npm run build --silent 2>/dev/null || echo -e "${YELLOW}  ⚠${NC} Build skipped (using CDN)"
else
    echo -e "${YELLOW}  ⚠${NC} npm not found, using Tailwind CDN"
fi

# Clear caches
php artisan config:clear --quiet 2>/dev/null || true
php artisan cache:clear --quiet 2>/dev/null || true
php artisan view:clear --quiet 2>/dev/null || true

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ติดตั้งสำเร็จ! พร้อมใช้งาน                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  เริ่มใช้งาน: ${CYAN}php artisan serve${NC}"
echo -e "  เปิดเว็บ:   ${CYAN}http://localhost:8000${NC}"
echo ""
echo -e "  ${YELLOW}Document Root (Production):${NC} $(pwd)/public"
echo ""
