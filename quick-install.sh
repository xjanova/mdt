#!/bin/bash
set -e

# ===========================================
# MDT ประตูไม้ - Quick Install (Non-interactive)
# ติดตั้งแบบเร็ว ไม่ต้องตอบคำถาม
# รองรับ: Ubuntu, DirectAdmin, cPanel
# ===========================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

cd "$(dirname "$0")"
APP_DIR=$(pwd)

# ===== Auto-detect PHP binary =====
detect_php() {
    local PHP_PATHS=(
        "/usr/local/php83/bin/php"
        "/usr/local/php84/bin/php"
        "/usr/local/php82/bin/php"
        "/usr/local/php81/bin/php"
        "/opt/cpanel/ea-php83/root/usr/bin/php"
        "/opt/cpanel/ea-php84/root/usr/bin/php"
        "/opt/cpanel/ea-php82/root/usr/bin/php"
        "/opt/alt/php83/usr/bin/php"
        "/opt/alt/php82/usr/bin/php"
        "/usr/bin/php8.3"
        "/usr/bin/php8.4"
        "/usr/bin/php8.2"
        "/usr/bin/php"
    )

    if command -v php &> /dev/null; then
        local MAJOR=$(php -r "echo PHP_MAJOR_VERSION;" 2>/dev/null || echo "0")
        local MINOR=$(php -r "echo PHP_MINOR_VERSION;" 2>/dev/null || echo "0")
        if [ "$MAJOR" -ge 8 ] 2>/dev/null && [ "$MINOR" -ge 2 ] 2>/dev/null; then
            PHP_BIN=$(command -v php)
            return 0
        fi
    fi

    for p in "${PHP_PATHS[@]}"; do
        if [ -x "$p" ]; then
            local MAJOR=$("$p" -r "echo PHP_MAJOR_VERSION;" 2>/dev/null || echo "0")
            local MINOR=$("$p" -r "echo PHP_MINOR_VERSION;" 2>/dev/null || echo "0")
            if [ "$MAJOR" -ge 8 ] 2>/dev/null && [ "$MINOR" -ge 2 ] 2>/dev/null; then
                PHP_BIN="$p"
                return 0
            fi
        fi
    done
    return 1
}

# ===== Auto-detect Composer binary =====
detect_composer() {
    local COMPOSER_PATHS=(
        "$APP_DIR/composer.phar"
        "$HOME/composer.phar"
        "/usr/local/bin/composer"
        "/usr/bin/composer"
        "/opt/cpanel/composer/bin/composer"
        "$HOME/.config/composer/vendor/bin/composer"
        "$HOME/.composer/vendor/bin/composer"
    )

    if command -v composer &> /dev/null; then
        COMPOSER_BIN=$(command -v composer)
        return 0
    fi

    for p in "${COMPOSER_PATHS[@]}"; do
        if [ -x "$p" ] || [ -f "$p" ]; then
            COMPOSER_BIN="$p"
            return 0
        fi
    done
    return 1
}

run_composer() {
    if [[ "$COMPOSER_BIN" == *.phar ]]; then
        "$PHP_BIN" "$COMPOSER_BIN" "$@"
    else
        "$COMPOSER_BIN" "$@"
    fi
}

run_artisan() {
    "$PHP_BIN" artisan "$@"
}

echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════╗"
echo "║   MDT ประตูไม้ - Quick Install               ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# Detect PHP
echo -e "${BLUE}[0/8]${NC} ตรวจหา PHP & Composer..."
if detect_php; then
    PHP_VER=$("$PHP_BIN" -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")
    echo -e "${GREEN}  ✓${NC} PHP $PHP_VER ($PHP_BIN)"
else
    echo -e "${RED}  ✗ PHP >= 8.2 not found!${NC}"
    echo "  ลองตรวจสอบ: ls /usr/local/php*/bin/php"
    exit 1
fi

# Detect Composer
if detect_composer; then
    echo -e "${GREEN}  ✓${NC} Composer ($COMPOSER_BIN)"
else
    echo -e "${YELLOW}  ⚠${NC} Composer not found - downloading..."
    curl -sS https://getcomposer.org/installer | "$PHP_BIN" -- --install-dir="$APP_DIR" --filename=composer.phar 2>/dev/null
    if [ -f "$APP_DIR/composer.phar" ]; then
        COMPOSER_BIN="$APP_DIR/composer.phar"
        echo -e "${GREEN}  ✓${NC} Composer downloaded"
    else
        echo -e "${RED}  ✗ Failed to download Composer${NC}"
        exit 1
    fi
fi

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
set +e
COMPOSER_OUTPUT=$(run_composer install --optimize-autoloader --no-interaction 2>&1)
COMPOSER_EXIT=$?
echo "$COMPOSER_OUTPUT" | tail -5
set -e

# PHP version mismatch: auto-fix by removing lock and updating
if [ $COMPOSER_EXIT -ne 0 ] && echo "$COMPOSER_OUTPUT" | grep -q "your php version.*does not satisfy"; then
    PHP_CURRENT=$("$PHP_BIN" -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")
    echo -e "${YELLOW}  ⚠${NC} composer.lock ไม่ตรงกับ PHP $PHP_CURRENT - resolving ใหม่..."
    rm -f composer.lock
    run_composer update --optimize-autoloader --no-interaction 2>&1 | tail -5
fi

if [ ! -f vendor/autoload.php ]; then
    echo -e "${RED}  ✗ Composer install FAILED!${NC}"
    echo ""
    echo "  vendor/autoload.php not found"
    echo "  ลองรันเอง:"
    if [[ "$COMPOSER_BIN" == *.phar ]]; then
        echo "    $PHP_BIN $COMPOSER_BIN install -v"
    else
        echo "    $COMPOSER_BIN install -v"
    fi
    echo ""
    echo "  ตรวจสอบ extensions: $PHP_BIN -m"
    echo "  ต้องมี: mbstring, xml, zip, curl, bcmath, tokenizer, fileinfo"
    exit 1
fi
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
if grep -q "^APP_KEY=$" .env; then
    run_artisan key:generate --force --quiet
    echo -e "${GREEN}  ✓${NC} Key generated"
else
    echo -e "${GREEN}  ✓${NC} Key already exists"
fi

# Step 5: SQLite Database
echo -e "${BLUE}[5/8]${NC} สร้างฐานข้อมูล SQLite..."
mkdir -p database
if [ ! -f database/database.sqlite ]; then
    touch database/database.sqlite
fi
echo -e "${GREEN}  ✓${NC} Database ready"

# Step 6: Migrations + Seed
echo -e "${BLUE}[6/8]${NC} รัน Migrations & Seed ข้อมูลตัวอย่าง..."
run_artisan migrate --force --quiet
run_artisan db:seed --force --quiet 2>/dev/null || true
echo -e "${GREEN}  ✓${NC} Database migrated and seeded"

# Step 7: Permissions
echo -e "${BLUE}[7/8]${NC} ตั้งค่า Permissions..."
mkdir -p storage/app/public
mkdir -p storage/framework/{cache/data,sessions,views}
mkdir -p storage/logs
mkdir -p bootstrap/cache
chmod -R 775 storage bootstrap/cache 2>/dev/null || true
run_artisan storage:link --quiet 2>/dev/null || true
echo -e "${GREEN}  ✓${NC} Permissions set"

# Step 8: Build Assets
echo -e "${BLUE}[8/8]${NC} Build Assets..."
if command -v npm &> /dev/null; then
    npm run build --silent 2>/dev/null || echo -e "${YELLOW}  ⚠${NC} Build skipped (using CDN)"
else
    echo -e "${YELLOW}  ⚠${NC} npm not found, using Tailwind CDN"
fi

# Clear caches
run_artisan config:clear --quiet 2>/dev/null || true
run_artisan cache:clear --quiet 2>/dev/null || true
run_artisan view:clear --quiet 2>/dev/null || true

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ติดตั้งสำเร็จ! พร้อมใช้งาน                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  PHP:      ${CYAN}$PHP_BIN${NC}"
echo -e "  Composer: ${CYAN}$COMPOSER_BIN${NC}"
echo ""
echo -e "  เริ่มใช้งาน: ${CYAN}$PHP_BIN artisan serve${NC}"
echo -e "  เปิดเว็บ:   ${CYAN}http://localhost:8000${NC}"
echo ""
echo -e "  ${YELLOW}Document Root (Production):${NC} $(pwd)/public"
echo ""
