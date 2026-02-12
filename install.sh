#!/bin/bash
set -e

# ===========================================
# MDT ประตูไม้ - Interactive Installer
# ระบบ ERP สำหรับบริษัทประตูไม้
# รองรับ: Ubuntu, DirectAdmin, cPanel
# ===========================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Helper functions
print_step()    { echo -e "\n${BLUE}[STEP]${NC} $1"; }
print_success() { echo -e "${GREEN}[OK]${NC} $1"; }
print_error()   { echo -e "${RED}[ERROR]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_info()    { echo -e "${CYAN}[INFO]${NC} $1"; }

# Navigate to script directory
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

    # If php is already in PATH and >= 8.2, use it
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

# Wrapper: run composer with detected PHP
run_composer() {
    if [[ "$COMPOSER_BIN" == *.phar ]]; then
        "$PHP_BIN" "$COMPOSER_BIN" "$@"
    else
        "$COMPOSER_BIN" "$@"
    fi
}

# Wrapper: run php artisan
run_artisan() {
    "$PHP_BIN" artisan "$@"
}

# Logo
echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════╗"
echo "║                                              ║"
echo "║      MDT ประตูไม้ - ERP System               ║"
echo "║      Installation Wizard v1.0                ║"
echo "║                                              ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

print_info "Application directory: $APP_DIR"

# ===== 1. System Requirements Check =====
print_step "1/8 - ตรวจสอบความต้องการของระบบ (System Requirements)"

# Detect PHP
if detect_php; then
    PHP_VERSION=$("$PHP_BIN" -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION.'.'.PHP_RELEASE_VERSION;")
    print_success "PHP $PHP_VERSION ($PHP_BIN)"
else
    print_error "PHP >= 8.2 not found!"
    print_info "ลองตรวจสอบด้วยคำสั่ง:"
    echo "  ls /usr/local/php*/bin/php"
    echo "  ls /opt/cpanel/ea-php*/root/usr/bin/php"
    exit 1
fi

# Detect Composer
if detect_composer; then
    COMP_VER=$(run_composer --version 2>/dev/null | head -1)
    print_success "Composer: $COMP_VER"
    print_info "Composer path: $COMPOSER_BIN"
else
    print_warning "Composer not found - downloading..."
    curl -sS https://getcomposer.org/installer | "$PHP_BIN" -- --install-dir="$APP_DIR" --filename=composer.phar 2>/dev/null
    if [ -f "$APP_DIR/composer.phar" ]; then
        COMPOSER_BIN="$APP_DIR/composer.phar"
        print_success "Composer downloaded to $COMPOSER_BIN"
    else
        print_error "Failed to download Composer"
        print_info "ติดตั้งเองด้วย: curl -sS https://getcomposer.org/installer | $PHP_BIN"
        exit 1
    fi
fi

# Check Node.js
if command -v node &> /dev/null; then
    print_success "Node.js: $(node -v)"
else
    print_warning "Node.js not found. Frontend assets will not be built."
fi

# Check npm
if command -v npm &> /dev/null; then
    print_success "npm: $(npm -v)"
else
    print_warning "npm not found. Frontend assets will not be built."
fi

# Check Git
if command -v git &> /dev/null; then
    print_success "$(git --version)"
else
    print_warning "Git not found."
fi

# ===== 2. Environment Configuration =====
print_step "2/8 - ตั้งค่า Environment"

if [ -f .env ]; then
    print_warning ".env file already exists."
    read -p "$(echo -e ${YELLOW})Overwrite? (y/N): $(echo -e ${NC})" OVERWRITE_ENV
    if [ "$OVERWRITE_ENV" != "y" ] && [ "$OVERWRITE_ENV" != "Y" ]; then
        print_info "Keeping existing .env file"
    else
        cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
        print_info "Backed up existing .env"
    fi
fi

if [ ! -f .env ] || [ "$OVERWRITE_ENV" = "y" ] || [ "$OVERWRITE_ENV" = "Y" ]; then
    echo ""
    echo -e "${CYAN}เลือกประเภท Environment:${NC}"
    echo "  1) Development (แนะนำสำหรับทดสอบ)"
    echo "  2) Production"
    read -p "$(echo -e ${BLUE})เลือก (1/2) [1]: $(echo -e ${NC})" ENV_CHOICE
    ENV_CHOICE=${ENV_CHOICE:-1}

    if [ "$ENV_CHOICE" = "2" ]; then
        cp .env.production.example .env 2>/dev/null || cp .env.example .env
        print_info "Using production environment template"
    else
        cp .env.example .env
        print_info "Using development environment template"
    fi

    read -p "$(echo -e ${BLUE})ชื่อแอปพลิเคชัน [MDT ประตูไม้]: $(echo -e ${NC})" APP_NAME_INPUT
    APP_NAME_INPUT=${APP_NAME_INPUT:-"MDT ประตูไม้"}
    sed -i "s|APP_NAME=.*|APP_NAME=\"$APP_NAME_INPUT\"|" .env

    read -p "$(echo -e ${BLUE})App URL [http://localhost:8000]: $(echo -e ${NC})" APP_URL_INPUT
    APP_URL_INPUT=${APP_URL_INPUT:-"http://localhost:8000"}
    sed -i "s|APP_URL=.*|APP_URL=$APP_URL_INPUT|" .env

    echo ""
    echo -e "${CYAN}เลือกฐานข้อมูล:${NC}"
    echo "  1) SQLite (ง่าย ไม่ต้องตั้งค่า - แนะนำ)"
    echo "  2) MySQL"
    read -p "$(echo -e ${BLUE})เลือก (1/2) [1]: $(echo -e ${NC})" DB_CHOICE
    DB_CHOICE=${DB_CHOICE:-1}

    if [ "$DB_CHOICE" = "2" ]; then
        sed -i "s|DB_CONNECTION=.*|DB_CONNECTION=mysql|" .env
        sed -i "s|# DB_HOST=|DB_HOST=|" .env
        sed -i "s|# DB_PORT=|DB_PORT=|" .env
        sed -i "s|# DB_DATABASE=.*|DB_DATABASE=mdt_erp|" .env
        sed -i "s|# DB_USERNAME=.*|DB_USERNAME=root|" .env
        sed -i "s|# DB_PASSWORD=.*|DB_PASSWORD=|" .env

        read -p "$(echo -e ${BLUE})Database Host [127.0.0.1]: $(echo -e ${NC})" DB_HOST
        DB_HOST=${DB_HOST:-"127.0.0.1"}
        sed -i "s|DB_HOST=.*|DB_HOST=$DB_HOST|" .env

        read -p "$(echo -e ${BLUE})Database Port [3306]: $(echo -e ${NC})" DB_PORT
        DB_PORT=${DB_PORT:-"3306"}
        sed -i "s|DB_PORT=.*|DB_PORT=$DB_PORT|" .env

        read -p "$(echo -e ${BLUE})Database Name [mdt_erp]: $(echo -e ${NC})" DB_NAME
        DB_NAME=${DB_NAME:-"mdt_erp"}
        sed -i "s|DB_DATABASE=.*|DB_DATABASE=$DB_NAME|" .env

        read -p "$(echo -e ${BLUE})Database Username [root]: $(echo -e ${NC})" DB_USER
        DB_USER=${DB_USER:-"root"}
        sed -i "s|DB_USERNAME=.*|DB_USERNAME=$DB_USER|" .env

        read -p "$(echo -e ${BLUE})Database Password: $(echo -e ${NC})" -s DB_PASS
        echo ""
        sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=$DB_PASS|" .env

        print_success "MySQL configured"
    else
        sed -i "s|DB_CONNECTION=.*|DB_CONNECTION=sqlite|" .env
        print_success "SQLite configured"
    fi

    sed -i "s|APP_TIMEZONE=.*|APP_TIMEZONE=Asia/Bangkok|" .env 2>/dev/null || echo "APP_TIMEZONE=Asia/Bangkok" >> .env
    sed -i "s|APP_LOCALE=.*|APP_LOCALE=th|" .env
    sed -i "s|APP_FAKER_LOCALE=.*|APP_FAKER_LOCALE=th_TH|" .env

    print_success "Environment configured"
fi

# ===== 3. Install PHP Dependencies =====
print_step "3/8 - ติดตั้ง PHP Dependencies"
print_info "Running: composer install (อาจใช้เวลาสักครู่...)"
run_composer install --optimize-autoloader --no-dev --no-interaction 2>&1 | tail -10

# Verify vendor directory was created
if [ ! -f vendor/autoload.php ]; then
    echo ""
    print_error "Composer install FAILED - vendor/autoload.php not found!"
    echo ""
    print_info "=== วิธีแก้ไข (Troubleshooting) ==="
    echo -e "  PHP ที่ใช้:       ${CYAN}$PHP_BIN${NC}"
    echo -e "  Composer ที่ใช้:  ${CYAN}$COMPOSER_BIN${NC}"
    echo ""
    print_info "ลองรันเอง (ดู error เต็ม):"
    if [[ "$COMPOSER_BIN" == *.phar ]]; then
        echo -e "  ${YELLOW}$PHP_BIN $COMPOSER_BIN install --no-dev --optimize-autoloader -v${NC}"
    else
        echo -e "  ${YELLOW}$COMPOSER_BIN install --no-dev --optimize-autoloader -v${NC}"
    fi
    echo ""
    print_info "ตรวจสอบ PHP extensions:"
    echo -e "  ${YELLOW}$PHP_BIN -m${NC}"
    echo -e "  ต้องมี: mbstring, xml, zip, curl, bcmath, tokenizer, fileinfo"
    echo ""
    print_info "บน DirectAdmin ให้เปิด extensions ที่:"
    echo "  DirectAdmin > PHP Config > Extensions"
    exit 1
fi
print_success "Composer packages installed (vendor/autoload.php OK)"

# ===== 4. Install Node Dependencies =====
print_step "4/8 - ติดตั้ง Node Dependencies"
if command -v npm &> /dev/null; then
    npm install 2>&1 | tail -3
    print_success "npm packages installed"
else
    print_warning "npm not available, skipping..."
fi

# ===== 5. Application Key =====
print_step "5/8 - สร้าง Application Key"
if grep -q "^APP_KEY=$" .env; then
    run_artisan key:generate --force
    print_success "Application key generated"
else
    print_info "Application key already exists"
fi

# ===== 6. Database Setup =====
print_step "6/8 - ตั้งค่าฐานข้อมูล"

DB_CONNECTION=$(grep "^DB_CONNECTION=" .env | cut -d= -f2)
if [ "$DB_CONNECTION" = "sqlite" ]; then
    if [ ! -f database/database.sqlite ]; then
        touch database/database.sqlite
        print_success "SQLite database created"
    else
        print_info "SQLite database already exists"
    fi
fi

echo ""
read -p "$(echo -e ${YELLOW})รัน database migrations? (Y/n): $(echo -e ${NC})" RUN_MIGRATE
RUN_MIGRATE=${RUN_MIGRATE:-Y}
if [ "$RUN_MIGRATE" = "Y" ] || [ "$RUN_MIGRATE" = "y" ]; then
    run_artisan migrate --force
    print_success "Migrations completed"

    echo ""
    read -p "$(echo -e ${YELLOW})ใส่ข้อมูลตัวอย่าง (Demo Data)? (Y/n): $(echo -e ${NC})" RUN_SEED
    RUN_SEED=${RUN_SEED:-Y}
    if [ "$RUN_SEED" = "Y" ] || [ "$RUN_SEED" = "y" ]; then
        run_artisan db:seed --force
        print_success "Demo data seeded"
    fi
fi

# ===== 7. Permissions & Storage =====
print_step "7/8 - ตั้งค่า Permissions & Storage"

mkdir -p storage/app/public
mkdir -p storage/framework/{cache/data,sessions,views}
mkdir -p storage/logs
mkdir -p bootstrap/cache
chmod -R 775 storage bootstrap/cache 2>/dev/null || true
run_artisan storage:link 2>/dev/null || true
print_success "Permissions set and storage linked"

# ===== 8. Build Assets =====
print_step "8/8 - Build Assets"
if command -v npm &> /dev/null; then
    echo ""
    read -p "$(echo -e ${YELLOW})Build frontend assets? (Y/n): $(echo -e ${NC})" BUILD_ASSETS
    BUILD_ASSETS=${BUILD_ASSETS:-Y}
    if [ "$BUILD_ASSETS" = "Y" ] || [ "$BUILD_ASSETS" = "y" ]; then
        npm run build 2>&1 | tail -5
        print_success "Assets built"
    fi
else
    print_warning "npm not available, skipping asset build..."
fi

# Clear Cache
run_artisan config:clear 2>/dev/null || true
run_artisan cache:clear 2>/dev/null || true
run_artisan route:clear 2>/dev/null || true
run_artisan view:clear 2>/dev/null || true

# ===== Done =====
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                              ║${NC}"
echo -e "${GREEN}║   ติดตั้งเสร็จสมบูรณ์!                        ║${NC}"
echo -e "${GREEN}║   Installation Complete!                     ║${NC}"
echo -e "${GREEN}║                                              ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}ข้อมูลการติดตั้ง:${NC}"
echo -e "  PHP:      ${GREEN}$PHP_BIN${NC}"
echo -e "  Composer: ${GREEN}$COMPOSER_BIN${NC}"
echo ""
echo -e "${CYAN}วิธีเริ่มใช้งาน:${NC}"
echo ""
echo -e "  ${YELLOW}Development:${NC}"
echo -e "    $PHP_BIN artisan serve"
echo -e "    เปิดเว็บ: http://localhost:8000"
echo ""
echo -e "  ${YELLOW}Production (DirectAdmin/cPanel):${NC}"
echo -e "    1. ตั้ง Document Root ไปที่: $APP_DIR/public"
echo -e "    2. ตั้งค่า Virtual Host ตามความเหมาะสม"
echo ""
echo -e "  ${YELLOW}คำสั่งที่มีประโยชน์:${NC}"
echo -e "    ./deploy.sh          - Deploy/อัพเดทระบบ"
echo -e "    ./clear-cache.sh     - ล้าง Cache"
echo -e "    ./run-migrations.sh  - จัดการ Migration"
echo -e "    ./fix-permissions.sh - แก้ไขสิทธิ์ไฟล์"
echo -e "    ./rollback.sh        - Rollback เวอร์ชัน"
echo ""
