#!/bin/bash
set -e

# ===========================================
# MDT ประตูไม้ - Deployment Script
# ระบบ Deploy อัตโนมัติสำหรับ Production
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

# Configuration
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$SCRIPT_DIR"
LOG_DIR="$APP_DIR/storage/logs"
BACKUP_DIR="$APP_DIR/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOG_DIR/deploy_${TIMESTAMP}.log"
VERSION=$(cat "$APP_DIR/VERSION" 2>/dev/null || echo "unknown")
DRY_RUN=false
BRANCH=""
RESEED=false
NO_BACKUP=false

# Parse arguments
for arg in "$@"; do
    case $arg in
        --dry-run)    DRY_RUN=true ;;
        --branch=*)   BRANCH="${arg#*=}" ;;
        --reseed)     RESEED=true ;;
        --no-backup)  NO_BACKUP=true ;;
        --help)
            echo "Usage: ./deploy.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --branch=NAME    Deploy specific branch"
            echo "  --reseed         Re-run database seeders"
            echo "  --no-backup      Skip backup step"
            echo "  --dry-run        Show what would be done without executing"
            echo "  --help           Show this help"
            exit 0
            ;;
    esac
done

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

# Logging
mkdir -p "$LOG_DIR" "$BACKUP_DIR"
exec > >(tee -a "$LOG_FILE") 2>&1

log()     { echo -e "[$(date '+%H:%M:%S')] $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; }
warn()    { echo -e "${YELLOW}[WARNING]${NC} $1"; }
info()    { echo -e "${CYAN}[INFO]${NC} $1"; }
step()    { echo -e "\n${BLUE}[DEPLOY]${NC} $1"; }

# Error handler
on_error() {
    error "Deployment failed at line $1"
    error "Check log: $LOG_FILE"

    # Try to bring app back up
    if [ -f "$APP_DIR/artisan" ] && [ -f "$APP_DIR/vendor/autoload.php" ]; then
        "$PHP_BIN" "$APP_DIR/artisan" up 2>/dev/null || true
    fi

    echo ""
    error "=== Error Report ==="
    echo "  Time:    $(date)"
    echo "  Version: $VERSION"
    echo "  PHP:     $PHP_BIN ($("$PHP_BIN" -v 2>/dev/null | head -1))"
    echo "  OS:      $(uname -a)"
    echo "  Log:     $LOG_FILE"

    exit 1
}
trap 'on_error $LINENO' ERR

# ========================================
# DEPLOY START
# ========================================
echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════╗"
echo "║   MDT ประตูไม้ - Deployment v${VERSION}          ║"
echo "║   $(date '+%Y-%m-%d %H:%M:%S')                        ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

cd "$APP_DIR"

# Detect PHP & Composer first
info "Detecting PHP & Composer..."
if detect_php; then
    PHP_VER=$("$PHP_BIN" -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")
    success "PHP $PHP_VER ($PHP_BIN)"
else
    error "PHP >= 8.2 not found!"
    echo "  ลองตรวจสอบ: ls /usr/local/php*/bin/php"
    exit 1
fi

if detect_composer; then
    success "Composer ($COMPOSER_BIN)"
else
    warn "Composer not found - downloading..."
    curl -sS https://getcomposer.org/installer | "$PHP_BIN" -- --install-dir="$APP_DIR" --filename=composer.phar 2>/dev/null
    if [ -f "$APP_DIR/composer.phar" ]; then
        COMPOSER_BIN="$APP_DIR/composer.phar"
        success "Composer downloaded"
    else
        error "Failed to download Composer"
        exit 1
    fi
fi

if [ "$DRY_RUN" = true ]; then
    warn "DRY RUN MODE - No changes will be made"
fi

# Read environment
APP_ENV=$(grep "^APP_ENV=" .env 2>/dev/null | cut -d= -f2 || echo "production")
DB_CONNECTION=$(grep "^DB_CONNECTION=" .env 2>/dev/null | cut -d= -f2 || echo "sqlite")
info "Environment: $APP_ENV | Database: $DB_CONNECTION"

# ===== Step 1: Maintenance Mode =====
step "1/10 - เปิด Maintenance Mode"
if [ "$DRY_RUN" = false ]; then
    if [ -f vendor/autoload.php ]; then
        run_artisan down --retry=60 --refresh=15 2>/dev/null || true
    fi
    success "Maintenance mode activated"
else
    info "[DRY RUN] Would activate maintenance mode"
fi

# ===== Step 2: Backup =====
step "2/10 - สำรองข้อมูล (Backup)"
if [ "$NO_BACKUP" = false ] && [ "$DRY_RUN" = false ]; then
    mkdir -p "$BACKUP_DIR"

    if [ "$DB_CONNECTION" = "sqlite" ]; then
        SQLITE_PATH="$APP_DIR/database/database.sqlite"
        if [ -f "$SQLITE_PATH" ]; then
            cp "$SQLITE_PATH" "$BACKUP_DIR/database_${TIMESTAMP}.sqlite"
            success "SQLite database backed up"
        fi
    elif [ "$DB_CONNECTION" = "mysql" ]; then
        DB_NAME=$(grep "^DB_DATABASE=" .env | cut -d= -f2)
        DB_USER=$(grep "^DB_USERNAME=" .env | cut -d= -f2)
        DB_PASS=$(grep "^DB_PASSWORD=" .env | cut -d= -f2)
        DB_HOST=$(grep "^DB_HOST=" .env | cut -d= -f2 || echo "127.0.0.1")
        if command -v mysqldump &> /dev/null; then
            mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_DIR/database_${TIMESTAMP}.sql" 2>/dev/null || warn "MySQL backup failed"
            success "MySQL database backed up"
        else
            warn "mysqldump not found, skipping database backup"
        fi
    fi

    if [ -f .env ]; then
        cp .env "$BACKUP_DIR/env_${TIMESTAMP}.env"
        success ".env backed up"
    fi

    find "$BACKUP_DIR" -type f -mtime +2 -delete 2>/dev/null || true
    info "Old backups cleaned"
else
    if [ "$NO_BACKUP" = true ]; then
        warn "Backup skipped (--no-backup)"
    else
        info "[DRY RUN] Would create backups"
    fi
fi

# ===== Step 3: Git Pull =====
step "3/10 - ดึงโค้ดล่าสุด (Git Pull)"
if [ "$DRY_RUN" = false ]; then
    if [ -d .git ]; then
        if [ -n "$BRANCH" ]; then
            git fetch origin "$BRANCH"
            git checkout "$BRANCH"
            git pull origin "$BRANCH"
            success "Pulled branch: $BRANCH"
        else
            CURRENT_BRANCH=$(git branch --show-current)
            git pull origin "$CURRENT_BRANCH" 2>/dev/null || git pull 2>/dev/null || warn "Git pull failed (may not have remote)"
            success "Pulled latest code (branch: $CURRENT_BRANCH)"
        fi

        if git diff HEAD~1 --name-only 2>/dev/null | grep -q "deploy.sh"; then
            info "deploy.sh was updated - using new version"
        fi
    else
        warn "Not a git repository, skipping git pull"
    fi
else
    info "[DRY RUN] Would pull latest code"
fi

# ===== Step 4: Sanitize .env =====
step "4/10 - ตรวจสอบ .env"
if [ "$DRY_RUN" = false ]; then
    if [ -f .env ]; then
        sed -i 's/[[:space:]]*$//' .env
        awk -F= '!seen[$1]++' .env > .env.tmp && mv .env.tmp .env
        if grep -q "^APP_KEY=$" .env; then
            run_artisan key:generate --force
            success "APP_KEY generated"
        fi
        success ".env sanitized"
    fi
else
    info "[DRY RUN] Would sanitize .env"
fi

# ===== Step 5: Composer Install =====
step "5/10 - ติดตั้ง Dependencies"
if [ "$DRY_RUN" = false ]; then
    if [ "$APP_ENV" = "production" ]; then
        run_composer install --no-dev --optimize-autoloader --no-interaction 2>&1 | tail -5
    else
        run_composer install --optimize-autoloader --no-interaction 2>&1 | tail -5
    fi

    # Verify vendor
    if [ ! -f vendor/autoload.php ]; then
        error "Composer install FAILED - vendor/autoload.php not found!"
        echo ""
        echo "  PHP:      $PHP_BIN"
        echo "  Composer: $COMPOSER_BIN"
        echo ""
        echo "  ลองรันเอง:"
        if [[ "$COMPOSER_BIN" == *.phar ]]; then
            echo "    $PHP_BIN $COMPOSER_BIN install -v"
        else
            echo "    $COMPOSER_BIN install -v"
        fi
        echo ""
        echo "  ตรวจสอบ extensions: $PHP_BIN -m"
        exit 1
    fi
    success "Composer dependencies installed"
else
    info "[DRY RUN] Would install composer dependencies"
fi

# ===== Step 6: Database Migrations =====
step "6/10 - รัน Database Migrations"
if [ "$DRY_RUN" = false ]; then
    PENDING=$(run_artisan migrate:status 2>/dev/null | grep -c "Pending" || true)
    if [ "$PENDING" -gt 0 ]; then
        info "$PENDING pending migration(s) found"
        run_artisan migrate --force
        success "Migrations completed"
    else
        info "No pending migrations"
    fi

    if [ "$RESEED" = true ]; then
        run_artisan db:seed --force
        success "Database re-seeded"
    fi
else
    info "[DRY RUN] Would check and run migrations"
fi

# ===== Step 7: Build Assets =====
step "7/10 - Build Frontend Assets"
if [ "$DRY_RUN" = false ]; then
    if command -v npm &> /dev/null; then
        if [ -f package.json ]; then
            npm install --silent 2>/dev/null || true
            npm run build 2>&1 | tail -3 || warn "npm build failed (using CDN fallback)"
            success "Assets built"
        fi
    else
        info "npm not found, using Tailwind CDN"
    fi
else
    info "[DRY RUN] Would build assets"
fi

# ===== Step 8: Clear & Optimize Caches =====
step "8/10 - Optimize & Cache"
if [ "$DRY_RUN" = false ]; then
    run_artisan config:clear 2>/dev/null || true
    run_artisan route:clear 2>/dev/null || true
    run_artisan view:clear 2>/dev/null || true
    run_artisan cache:clear 2>/dev/null || true
    run_artisan event:clear 2>/dev/null || true

    if [ "$APP_ENV" = "production" ]; then
        run_artisan config:cache 2>/dev/null || true
        run_artisan route:cache 2>/dev/null || true
        run_artisan view:cache 2>/dev/null || true
        success "Production caches optimized"
    else
        success "Caches cleared"
    fi

    if "$PHP_BIN" -m 2>/dev/null | grep -qi opcache; then
        "$PHP_BIN" -r "opcache_reset();" 2>/dev/null || true
        info "OPcache cleared"
    fi

    run_composer dump-autoload --optimize --quiet 2>/dev/null || true
else
    info "[DRY RUN] Would clear and optimize caches"
fi

# ===== Step 9: Permissions & Storage =====
step "9/10 - ตั้งค่า Permissions"
if [ "$DRY_RUN" = false ]; then
    mkdir -p storage/app/public
    mkdir -p storage/framework/{cache/data,sessions,views}
    mkdir -p storage/logs
    mkdir -p bootstrap/cache
    chmod -R 775 storage bootstrap/cache 2>/dev/null || true
    run_artisan storage:link --quiet 2>/dev/null || true
    success "Permissions set"
else
    info "[DRY RUN] Would set permissions"
fi

# ===== Step 10: Security & Health Check =====
step "10/10 - ตรวจสอบความปลอดภัยและสุขภาพระบบ"
if [ "$DRY_RUN" = false ]; then
    if [ "$APP_ENV" = "production" ]; then
        APP_DEBUG=$(grep "^APP_DEBUG=" .env | cut -d= -f2)
        if [ "$APP_DEBUG" = "true" ]; then
            warn "APP_DEBUG=true in production! Should be false."
        else
            success "APP_DEBUG is disabled"
        fi
    fi

    run_artisan db:show --quiet 2>/dev/null && success "Database connection OK" || warn "Database connection issue"

    if [ -w storage/logs ]; then
        success "Storage is writable"
    else
        warn "Storage may not be writable"
    fi

    # Bring app back up
    run_artisan up
    success "Application is LIVE"

    # Restart web services
    if command -v systemctl &> /dev/null; then
        sudo systemctl reload php*-fpm 2>/dev/null || true
        sudo systemctl reload nginx 2>/dev/null || true
        sudo systemctl reload apache2 2>/dev/null || true
    fi
    if [ -f /usr/local/directadmin/directadmin ]; then
        echo "action=restartphp" >> /usr/local/directadmin/data/task.queue 2>/dev/null || true
    fi
    if [ -f /scripts/restartsrv_httpd ]; then
        /scripts/restartsrv_httpd 2>/dev/null || true
    fi

    # HTTP health check
    APP_URL=$(grep "^APP_URL=" .env | cut -d= -f2)
    if command -v curl &> /dev/null && [ -n "$APP_URL" ]; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL" --max-time 10 2>/dev/null || echo "000")
        if [ "$HTTP_CODE" = "200" ]; then
            success "HTTP health check passed ($APP_URL -> $HTTP_CODE)"
        elif [ "$HTTP_CODE" = "000" ]; then
            info "HTTP check skipped (cannot reach $APP_URL)"
        else
            warn "HTTP check returned $HTTP_CODE"
        fi
    fi
else
    info "[DRY RUN] Would perform health check"
fi

# ========================================
# DEPLOY COMPLETE
# ========================================
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                              ║${NC}"
echo -e "${GREEN}║   Deploy สำเร็จ!                             ║${NC}"
echo -e "${GREEN}║   MDT ประตูไม้ v${VERSION}                       ║${NC}"
echo -e "${GREEN}║   $(date '+%Y-%m-%d %H:%M:%S')                        ║${NC}"
echo -e "${GREEN}║                                              ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
info "PHP:      $PHP_BIN"
info "Composer: $COMPOSER_BIN"
info "Deploy log: $LOG_FILE"
echo ""
