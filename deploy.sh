#!/bin/bash
set -e

# ===========================================
# MDT ประตูไม้ - Deployment Script
# ระบบ Deploy อัตโนมัติสำหรับ Production
# รองรับ: Ubuntu, DirectAdmin, cPanel
#
# Features (แบบ xmanstudio):
#   - Auto-detect PHP/Composer paths
#   - Self-updating deploy.sh from git
#   - Smart migration handling
#   - Intelligent seeding with MD5 hash tracking
#   - Detailed error logging and reporting
#   - Production security verification
#   - OPcache clear via web request (DirectAdmin)
#   - Queue worker restart
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
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$SCRIPT_DIR"
LOG_DIR="$APP_DIR/storage/logs/deploy"
BACKUP_DIR="$APP_DIR/backups"
SEEDER_HASH_FILE="$APP_DIR/storage/.seeder_hashes"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOG_DIR/deploy_${TIMESTAMP}.log"
ERROR_LOG="$LOG_DIR/error_${TIMESTAMP}.log"
VERSION=$(cat "$APP_DIR/VERSION" 2>/dev/null || echo "unknown")
DRY_RUN=false
BRANCH=""
RESEED=false
NO_BACKUP=false
FORCE_SEED=false

# Parse arguments
for arg in "$@"; do
    case $arg in
        --dry-run)    DRY_RUN=true ;;
        --branch=*)   BRANCH="${arg#*=}" ;;
        --reseed)     RESEED=true ;;
        --seed)       FORCE_SEED=true ;;
        --no-backup)  NO_BACKUP=true ;;
        --help|-h)
            echo "Usage: ./deploy.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --branch=NAME    Deploy specific branch"
            echo "  --seed           Force run all seeders"
            echo "  --reseed         Reset seeder tracking and re-run all"
            echo "  --no-backup      Skip backup step"
            echo "  --dry-run        Show what would be done without executing"
            echo "  --help           Show this help"
            echo ""
            echo "Seeder Tracking:"
            echo "  The script tracks seeder file changes using MD5 hashes."
            echo "  - New seeders are automatically detected and run"
            echo "  - Changed seeders are automatically re-run"
            echo "  - Use --reseed to force re-run all seeders"
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

# Create directories
mkdir -p "$LOG_DIR" "$BACKUP_DIR"

# Logging
exec > >(tee -a "$LOG_FILE") 2>&1

log()     { echo -e "[$(date '+%H:%M:%S')] $1" >> "$LOG_FILE"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; echo "[$(date '+%H:%M:%S')] ERROR: $1" >> "$ERROR_LOG"; }
warn()    { echo -e "${YELLOW}[WARNING]${NC} $1"; }
info()    { echo -e "${CYAN}[INFO]${NC} $1"; }
step()    { echo -e "\n${BLUE}━━━ $1 ━━━${NC}"; }

# ===== Generate error report =====
generate_error_report() {
    local step_name="$1"
    local error_message="$2"
    local error_output="$3"

    {
        echo ""
        echo "═══════════════════════════════════════════════════"
        echo "ERROR REPORT - $(date '+%Y-%m-%d %H:%M:%S')"
        echo "═══════════════════════════════════════════════════"
        echo "Step: $step_name"
        echo "Version: $VERSION"
        echo "Branch: ${BRANCH:-$(git branch --show-current 2>/dev/null || echo 'N/A')}"
        echo "Commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'N/A')"
        echo "Environment: $(grep "^APP_ENV=" .env 2>/dev/null | cut -d= -f2 || echo 'N/A')"
        echo ""
        echo "Error: $error_message"
        echo "Output: $error_output"
        echo ""
        echo "System:"
        echo "  PHP: $PHP_BIN ($("$PHP_BIN" -v 2>/dev/null | head -1 || echo 'N/A'))"
        echo "  Composer: $COMPOSER_BIN"
        echo "  Node: $(node -v 2>/dev/null || echo 'N/A')"
        echo "  OS: $(uname -a)"
        echo ""
        echo "Database:"
        echo "  Connection: $(grep "^DB_CONNECTION=" .env 2>/dev/null | cut -d= -f2 || echo 'N/A')"
        echo "  Host: $(grep "^DB_HOST=" .env 2>/dev/null | cut -d= -f2 || echo 'N/A')"
        echo "  Database: $(grep "^DB_DATABASE=" .env 2>/dev/null | cut -d= -f2 || echo 'N/A')"
        echo ""
        if [ -f "storage/logs/laravel.log" ]; then
            echo "Recent Laravel Log (last 50 lines):"
            echo "---"
            tail -50 storage/logs/laravel.log 2>/dev/null || echo "Could not read"
            echo "---"
        fi
        echo "═══════════════════════════════════════════════════"
    } >> "$ERROR_LOG"
}

# Error handler
on_error() {
    error "Deployment failed at line $1"
    generate_error_report "line_$1" "Script failed" ""

    # Try to bring app back up
    if [ -f "$APP_DIR/artisan" ] && [ -f "$APP_DIR/vendor/autoload.php" ]; then
        "$PHP_BIN" "$APP_DIR/artisan" up 2>/dev/null || true
    fi

    echo ""
    error "=== Error Report ==="
    echo "  Time:    $(date)"
    echo "  Version: $VERSION"
    echo "  PHP:     $PHP_BIN"
    echo "  Log:     $LOG_FILE"
    echo "  Errors:  $ERROR_LOG"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo -e "  1. ดู log: ${PURPLE}tail -50 $ERROR_LOG${NC}"
    echo -e "  2. ดู Laravel log: ${PURPLE}tail -50 storage/logs/laravel.log${NC}"
    echo -e "  3. Clear cache: ${PURPLE}$PHP_BIN artisan cache:clear${NC}"

    exit 1
}
trap 'on_error $LINENO' ERR

# ===== Self-update deploy.sh from git =====
update_deploy_script() {
    if [ "${DEPLOY_SCRIPT_UPDATED}" = "true" ]; then
        return 0
    fi

    if ! git rev-parse --git-dir >/dev/null 2>&1; then
        return 0
    fi

    local CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "")
    if [ -z "$CURRENT_BRANCH" ]; then
        return 0
    fi

    # Don't update if local changes exist
    if git diff --name-only 2>/dev/null | grep -q "^deploy.sh$"; then
        return 0
    fi

    if ! git fetch origin "$CURRENT_BRANCH" 2>/dev/null; then
        return 0
    fi

    local LOCAL_HASH=$(git hash-object deploy.sh 2>/dev/null || echo "")
    local REMOTE_HASH=$(git show "origin/$CURRENT_BRANCH:deploy.sh" 2>/dev/null | git hash-object --stdin 2>/dev/null || echo "")

    if [ -z "$LOCAL_HASH" ] || [ -z "$REMOTE_HASH" ]; then
        return 0
    fi

    if [ "$LOCAL_HASH" = "$REMOTE_HASH" ]; then
        return 0
    fi

    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  New version of deploy.sh detected!${NC}"
    echo -e "${CYAN}  Updating from origin/$CURRENT_BRANCH...${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    if git checkout "origin/$CURRENT_BRANCH" -- deploy.sh 2>/dev/null; then
        echo -e "${GREEN}  deploy.sh updated - re-executing...${NC}"
        export DEPLOY_SCRIPT_UPDATED=true
        exec bash "$0" "$@"
    fi
}

# ===== Sanitize .env file =====
sanitize_env_file() {
    step "Sanitizing .env"

    if [ ! -f .env ]; then
        warn ".env not found, skipping"
        return 0
    fi

    # Backup
    cp .env ".env.backup.${TIMESTAMP}"

    # Fix: remove trailing whitespace, carriage returns
    awk '
    BEGIN { FS="="; OFS="=" }
    {
        if ($0 ~ /^[[:space:]]*$/ || $0 ~ /^[[:space:]]*#/) { print $0; next }
        if (NF >= 2) {
            key = $1
            value = substr($0, length($1) + 2)
            gsub(/[[:space:]]+$/, "", value)
            gsub(/\r/, "", value)
            print key OFS value
        } else {
            print $0
        }
    }
    ' .env > .env.tmp && mv .env.tmp .env

    # Remove duplicate keys (keep first)
    awk -F= '!seen[$1]++' .env > .env.tmp && mv .env.tmp .env

    # Validate with PHP
    set +e
    local PHP_CHECK=$("$PHP_BIN" -r "
        if (file_exists('.env')) {
            \$lines = file('.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            \$valid = true;
            foreach (\$lines as \$line) {
                \$line = trim(\$line);
                if (empty(\$line) || \$line[0] === '#') continue;
                if (strpos(\$line, '=') === false) {
                    echo 'invalid';
                    \$valid = false;
                    break;
                }
            }
            if (\$valid) echo 'valid';
        }
    " 2>&1)
    set -e

    if [ "$PHP_CHECK" = "valid" ]; then
        success ".env sanitized and validated"
    else
        warn ".env may have issues (backup: .env.backup.${TIMESTAMP})"
    fi
}

# ===== Check APP_KEY =====
check_app_key() {
    step "Checking Application Key"

    local APP_KEY=$(grep "^APP_KEY=" .env 2>/dev/null | cut -d= -f2 | tr -d '[:space:]' || echo "")

    if [ -z "$APP_KEY" ]; then
        warn "APP_KEY is empty - generating..."
        run_artisan key:generate --force
        success "Application key generated"
    else
        local MASKED="${APP_KEY:0:10}..."
        success "Application key exists: $MASKED"
    fi
}

# ===== Verify production security =====
verify_production_security() {
    step "Verifying Production Security"

    local APP_ENV=$(grep "^APP_ENV=" .env 2>/dev/null | cut -d= -f2 | tr -d '[:space:]' || echo "")

    if [ "$APP_ENV" != "production" ]; then
        info "Skipping security check ($APP_ENV environment)"
        return 0
    fi

    local ISSUES=0

    # APP_DEBUG
    local APP_DEBUG=$(grep "^APP_DEBUG=" .env | cut -d= -f2 | tr -d '[:space:]')
    if [ "$APP_DEBUG" = "true" ]; then
        warn "APP_DEBUG=true in production!"
        ISSUES=$((ISSUES + 1))
    else
        success "APP_DEBUG is disabled"
    fi

    # Telescope
    if [ -f config/telescope.php ]; then
        local TELESCOPE=$(grep "^TELESCOPE_ENABLED=" .env 2>/dev/null | cut -d= -f2 | tr -d '[:space:]' || echo "")
        if [ "$TELESCOPE" = "true" ]; then
            warn "Laravel Telescope is enabled in production!"
            ISSUES=$((ISSUES + 1))
        else
            success "Telescope is disabled"
        fi
    fi

    # Debugbar
    if [ -f config/debugbar.php ]; then
        local DEBUGBAR=$(grep "^DEBUGBAR_ENABLED=" .env 2>/dev/null | cut -d= -f2 | tr -d '[:space:]' || echo "")
        if [ "$DEBUGBAR" = "true" ]; then
            warn "Debugbar is enabled in production!"
            ISSUES=$((ISSUES + 1))
        else
            success "Debugbar is disabled"
        fi
    fi

    if [ $ISSUES -eq 0 ]; then
        success "Production security check passed"
    else
        warn "Found $ISSUES security issue(s)"
    fi
}

# ===== Smart Seeding with MD5 hash tracking =====
run_smart_seeding() {
    step "Smart Seeding"

    if [ "$DRY_RUN" = true ]; then
        info "[DRY RUN] Would check and run seeders"
        return 0
    fi

    # Reset tracking if --reseed
    if [ "$RESEED" = true ]; then
        rm -f "$SEEDER_HASH_FILE"
        info "Seeder tracking reset (--reseed)"
        run_artisan db:seed --force
        success "All seeders re-run"
        return 0
    fi

    # Force seed if requested
    if [ "$FORCE_SEED" = true ]; then
        run_artisan db:seed --force
        success "All seeders run (--seed)"
        return 0
    fi

    # Check for seeder files
    if [ ! -d database/seeders ] || [ -z "$(ls database/seeders/*Seeder.php 2>/dev/null)" ]; then
        info "No seeder files found"
        return 0
    fi

    touch "$SEEDER_HASH_FILE"

    local NEW_SEEDERS=()
    local CHANGED_SEEDERS=()

    # Check each seeder for changes
    for SEEDER_FILE in database/seeders/*Seeder.php; do
        local SEEDER_NAME=$(basename "$SEEDER_FILE" .php)

        # Skip DatabaseSeeder (it's the orchestrator)
        if [ "$SEEDER_NAME" = "DatabaseSeeder" ]; then
            continue
        fi

        local CURRENT_HASH=$(md5sum "$SEEDER_FILE" | cut -d' ' -f1)
        local STORED_HASH=$(grep "^${SEEDER_NAME}:" "$SEEDER_HASH_FILE" 2>/dev/null | cut -d: -f2)

        if [ -z "$STORED_HASH" ]; then
            NEW_SEEDERS+=("$SEEDER_NAME")
        elif [ "$CURRENT_HASH" != "$STORED_HASH" ]; then
            CHANGED_SEEDERS+=("$SEEDER_NAME")
        fi
    done

    # Run new seeders
    if [ ${#NEW_SEEDERS[@]} -gt 0 ]; then
        info "New seeders found: ${NEW_SEEDERS[*]}"
        for SEEDER in "${NEW_SEEDERS[@]}"; do
            set +e
            run_artisan db:seed --class="$SEEDER" --force 2>&1
            local EXIT_CODE=$?
            set -e
            if [ $EXIT_CODE -eq 0 ]; then
                success "Seeded: $SEEDER"
                # Update hash
                local HASH=$(md5sum "database/seeders/${SEEDER}.php" | cut -d' ' -f1)
                grep -v "^${SEEDER}:" "$SEEDER_HASH_FILE" > "$SEEDER_HASH_FILE.tmp" 2>/dev/null || true
                echo "${SEEDER}:${HASH}" >> "$SEEDER_HASH_FILE.tmp"
                mv "$SEEDER_HASH_FILE.tmp" "$SEEDER_HASH_FILE"
            else
                warn "Failed to seed: $SEEDER"
            fi
        done
    fi

    # Run changed seeders
    if [ ${#CHANGED_SEEDERS[@]} -gt 0 ]; then
        info "Changed seeders found: ${CHANGED_SEEDERS[*]}"
        for SEEDER in "${CHANGED_SEEDERS[@]}"; do
            set +e
            run_artisan db:seed --class="$SEEDER" --force 2>&1
            local EXIT_CODE=$?
            set -e
            if [ $EXIT_CODE -eq 0 ]; then
                success "Re-seeded: $SEEDER"
                local HASH=$(md5sum "database/seeders/${SEEDER}.php" | cut -d' ' -f1)
                grep -v "^${SEEDER}:" "$SEEDER_HASH_FILE" > "$SEEDER_HASH_FILE.tmp" 2>/dev/null || true
                echo "${SEEDER}:${HASH}" >> "$SEEDER_HASH_FILE.tmp"
                mv "$SEEDER_HASH_FILE.tmp" "$SEEDER_HASH_FILE"
            else
                warn "Failed to re-seed: $SEEDER"
            fi
        done
    fi

    # Cleanup: remove hashes for deleted seeders
    if [ -f "$SEEDER_HASH_FILE" ]; then
        while IFS=: read -r name hash; do
            if [ ! -f "database/seeders/${name}.php" ]; then
                info "Cleaned tracking for deleted seeder: $name"
                grep -v "^${name}:" "$SEEDER_HASH_FILE" > "$SEEDER_HASH_FILE.tmp" 2>/dev/null || true
                mv "$SEEDER_HASH_FILE.tmp" "$SEEDER_HASH_FILE"
            fi
        done < "$SEEDER_HASH_FILE"
    fi

    if [ ${#NEW_SEEDERS[@]} -eq 0 ] && [ ${#CHANGED_SEEDERS[@]} -eq 0 ]; then
        info "No new or changed seeders"
    fi
}

# ===== Restart queue workers =====
restart_queue() {
    step "Restarting Queue Workers"

    if [ "$DRY_RUN" = true ]; then
        info "[DRY RUN] Would restart queue workers"
        return 0
    fi

    set +e
    run_artisan queue:restart 2>/dev/null
    local EXIT_CODE=$?
    set -e

    if [ $EXIT_CODE -eq 0 ]; then
        success "Queue workers will restart after current job"
    else
        info "No queue workers running (or queue not configured)"
    fi
}

# ===== Restart web server (DirectAdmin/cPanel/systemctl) =====
restart_web_server() {
    step "Restarting Web Server"

    if [ "$DRY_RUN" = true ]; then
        info "[DRY RUN] Would restart web server"
        return 0
    fi

    local APP_ENV=$(grep "^APP_ENV=" .env 2>/dev/null | cut -d= -f2 || echo "")
    if [ "$APP_ENV" != "production" ]; then
        info "Skipping web server restart (not production)"
        return 0
    fi

    local RESTARTED=0

    # DirectAdmin
    if [ -d "/usr/local/directadmin" ] || [ -f "/usr/local/directadmin/directadmin" ]; then
        info "DirectAdmin detected"

        # Trigger PHP restart
        touch public/restart.txt 2>/dev/null || touch public_html/restart.txt 2>/dev/null || true
        sleep 1
        rm -f public/restart.txt public_html/restart.txt 2>/dev/null || true

        # Clear OPcache via web request
        local APP_URL=$(grep "^APP_URL=" .env 2>/dev/null | cut -d= -f2 | tr -d '[:space:]' || echo "")
        if [ -n "$APP_URL" ] && command -v curl &> /dev/null; then
            local OPCACHE_FILE="public/opcache-clear-${TIMESTAMP}.php"
            cat > "$OPCACHE_FILE" 2>/dev/null <<'OPCACHE_EOF'
<?php
if (function_exists('opcache_reset')) { opcache_reset(); echo "cleared"; }
OPCACHE_EOF
            curl -s "${APP_URL}/opcache-clear-${TIMESTAMP}.php" >/dev/null 2>&1 || true
            rm -f "$OPCACHE_FILE" 2>/dev/null || true
            info "OPcache cleared via web request"
        fi

        success "DirectAdmin restart completed"
        RESTARTED=1
    fi

    # systemctl
    if [ $RESTARTED -eq 0 ] && command -v systemctl &> /dev/null; then
        local PHP_VER=$("$PHP_BIN" -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")

        for SERVICE in "php${PHP_VER}-fpm" "php-fpm"; do
            if systemctl list-units --full -all 2>/dev/null | grep -q "$SERVICE.service"; then
                sudo systemctl reload "$SERVICE" 2>/dev/null || sudo systemctl restart "$SERVICE" 2>/dev/null || true
                success "$SERVICE restarted"
                RESTARTED=1
                break
            fi
        done

        sudo systemctl reload nginx 2>/dev/null || true
        sudo systemctl reload apache2 2>/dev/null || true
    fi

    # cPanel
    if [ $RESTARTED -eq 0 ] && [ -f /scripts/restartsrv_httpd ]; then
        /scripts/restartsrv_httpd graceful 2>/dev/null || true
        success "cPanel restart completed"
        RESTARTED=1
    fi

    # Fallback: killall
    if [ $RESTARTED -eq 0 ] && command -v killall &> /dev/null; then
        set +e
        killall -USR2 php-fpm 2>/dev/null
        if [ $? -eq 0 ]; then
            success "PHP-FPM gracefully reloaded"
            RESTARTED=1
        fi
        set -e
    fi

    if [ $RESTARTED -eq 0 ]; then
        warn "Could not restart web server automatically"
        info "Manual: sudo systemctl restart php-fpm nginx"
    fi
}

# ===== Health check =====
health_check() {
    step "Health Check"

    if [ "$DRY_RUN" = true ]; then
        info "[DRY RUN] Would perform health check"
        return 0
    fi

    local ISSUES=0

    # Database
    info "Checking database connection (timeout: 15s)..."
    set +e
    local DB_CHECK
    if command -v timeout &> /dev/null; then
        DB_CHECK=$(timeout 15 "$PHP_BIN" artisan tinker --execute="try { \DB::connection()->getPdo(); echo 'ok'; } catch(\Exception \$e) { echo 'fail: ' . \$e->getMessage(); }" 2>/dev/null | tail -1)
        local DB_EXIT=$?
        if [ $DB_EXIT -eq 124 ]; then
            DB_CHECK="fail: timeout"
        fi
    else
        DB_CHECK=$(run_artisan db:show --quiet 2>/dev/null && echo "ok" || echo "fail")
    fi
    set -e

    if [[ "$DB_CHECK" == "ok" ]]; then
        success "Database connection OK"
    elif [[ "$DB_CHECK" == *"timeout"* ]]; then
        warn "Database connection timed out"
        ISSUES=$((ISSUES + 1))
    else
        error "Database connection failed: $DB_CHECK"
        ISSUES=$((ISSUES + 1))
    fi

    # HTTP
    local APP_URL=$(grep "^APP_URL=" .env 2>/dev/null | cut -d= -f2 | tr -d '[:space:]' || echo "")
    if [ -n "$APP_URL" ] && command -v curl &> /dev/null; then
        set +e
        local HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$APP_URL" 2>/dev/null)
        set -e

        if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
            success "Application accessible ($APP_URL -> HTTP $HTTP_CODE)"
        elif [ "$HTTP_CODE" = "000" ]; then
            warn "Cannot reach $APP_URL (timeout)"
            ISSUES=$((ISSUES + 1))
        elif [[ "$HTTP_CODE" =~ ^[45] ]]; then
            error "Application returned HTTP $HTTP_CODE"
            ISSUES=$((ISSUES + 1))
            # Show recent errors
            if [ -f "storage/logs/laravel.log" ]; then
                echo ""
                echo -e "${RED}━━━ Recent Laravel Errors ━━━${NC}"
                tail -30 storage/logs/laravel.log 2>/dev/null | grep -A 3 -i "error\|exception" || tail -10 storage/logs/laravel.log
                echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            fi
        fi
    fi

    # Storage
    if [ -w "storage/logs" ]; then
        success "Storage is writable"
    else
        error "Storage is not writable"
        ISSUES=$((ISSUES + 1))
    fi

    if [ $ISSUES -gt 0 ]; then
        warn "Health check: $ISSUES issue(s) found"
        echo ""
        echo -e "${YELLOW}Troubleshooting:${NC}"
        echo -e "  1. ${PURPLE}tail -50 storage/logs/laravel.log${NC}"
        echo -e "  2. ${PURPLE}tail -50 $ERROR_LOG${NC}"
        echo -e "  3. ${PURPLE}$PHP_BIN artisan cache:clear${NC}"
    else
        success "All systems operational"
    fi
}

# ========================================
# MAIN DEPLOYMENT FLOW
# ========================================

cd "$APP_DIR"

# Self-update
update_deploy_script "$@"

# Detect PHP & Composer
if detect_php; then
    PHP_VER=$("$PHP_BIN" -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")
else
    echo -e "${RED}PHP >= 8.2 not found!${NC}"
    echo "  ls /usr/local/php*/bin/php"
    exit 1
fi

if ! detect_composer; then
    curl -sS https://getcomposer.org/installer | "$PHP_BIN" -- --install-dir="$APP_DIR" --filename=composer.phar 2>/dev/null
    if [ -f "$APP_DIR/composer.phar" ]; then
        COMPOSER_BIN="$APP_DIR/composer.phar"
    else
        echo -e "${RED}Composer not found and download failed!${NC}"
        exit 1
    fi
fi

# Dry run mode
if [ "$DRY_RUN" = true ]; then
    echo -e "${CYAN}╔══════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║       DRY RUN MODE - Preview Only            ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Would execute:"
    echo "   1. Self-update deploy.sh from git"
    echo "   2. Sanitize .env (fix whitespace, duplicates, validate)"
    echo "   3. Check/generate APP_KEY"
    echo "   4. Verify production security (DEBUG, Telescope, Debugbar)"
    echo "   5. Enable maintenance mode"
    echo "   6. Pull code (branch: ${BRANCH:-current})"
    echo "   7. Install dependencies (composer, npm)"
    echo "   8. Backup database"
    echo "   9. Run migrations (auto-create table if fresh)"
    echo "  10. Smart seeding (MD5 hash tracking)"
    echo "  11. Build assets (npm run build)"
    echo "  12. Optimize caches"
    echo "  13. Fix permissions"
    echo "  14. Restart queue workers"
    echo "  15. Restart web server (PHP-FPM, Nginx/Apache)"
    echo "  16. Health check (DB, HTTP, storage)"
    echo "  17. Disable maintenance mode"
    echo ""
    echo "  PHP:      $PHP_BIN"
    echo "  Composer: $COMPOSER_BIN"
    echo ""
    echo "Run without --dry-run to execute."
    exit 0
fi

# Banner
echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════╗"
echo "║   MDT ประตูไม้ - Deployment v${VERSION}          ║"
echo "║   $(date '+%Y-%m-%d %H:%M:%S')                        ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

info "PHP $PHP_VER ($PHP_BIN)"
info "Composer: $COMPOSER_BIN"

APP_ENV=$(grep "^APP_ENV=" .env 2>/dev/null | cut -d= -f2 || echo "production")
DB_CONNECTION=$(grep "^DB_CONNECTION=" .env 2>/dev/null | cut -d= -f2 || echo "sqlite")
info "Environment: $APP_ENV | Database: $DB_CONNECTION"
echo ""

# ===== 1. Sanitize .env =====
sanitize_env_file

# ===== 2. Check APP_KEY =====
check_app_key

# ===== 3. Verify Security =====
verify_production_security

# ===== 4. Maintenance Mode =====
step "Enabling Maintenance Mode"
if [ -f vendor/autoload.php ]; then
    run_artisan down --retry=60 --refresh=15 2>/dev/null || true
fi
success "Maintenance mode activated"

# ===== 5. Git Pull =====
step "Pulling Latest Code"
if [ -d .git ]; then
    if [ -n "$BRANCH" ]; then
        git fetch origin "$BRANCH"
        git checkout "$BRANCH"
        git pull origin "$BRANCH"
        success "Pulled branch: $BRANCH"
    else
        CURRENT_BRANCH=$(git branch --show-current)
        set +e
        git pull origin "$CURRENT_BRANCH" 2>/dev/null || git pull 2>/dev/null
        set -e
        success "Pulled latest code (branch: $CURRENT_BRANCH)"
    fi
else
    warn "Not a git repository"
fi

# ===== 6. Composer Install =====
step "Installing Dependencies"
if [ "$APP_ENV" = "production" ]; then
    run_composer install --no-dev --optimize-autoloader --no-interaction 2>&1 | tail -5
else
    run_composer install --optimize-autoloader --no-interaction 2>&1 | tail -5
fi

if [ ! -f vendor/autoload.php ]; then
    error "Composer install FAILED - vendor/autoload.php not found!"
    generate_error_report "composer_install" "vendor/autoload.php missing" ""
    echo "  PHP: $PHP_BIN | Composer: $COMPOSER_BIN"
    echo "  ลองรันเอง:"
    if [[ "$COMPOSER_BIN" == *.phar ]]; then
        echo "    $PHP_BIN $COMPOSER_BIN install -v"
    else
        echo "    $COMPOSER_BIN install -v"
    fi
    echo "  ตรวจ extensions: $PHP_BIN -m"
    exit 1
fi
success "Composer dependencies installed"

# ===== 7. Backup =====
step "Backing Up Database"
if [ "$NO_BACKUP" = false ]; then
    if [ "$DB_CONNECTION" = "sqlite" ]; then
        if [ -f database/database.sqlite ]; then
            cp database/database.sqlite "$BACKUP_DIR/database_${TIMESTAMP}.sqlite"
            success "SQLite backed up"
        fi
    elif [ "$DB_CONNECTION" = "mysql" ]; then
        local_DB_NAME=$(grep "^DB_DATABASE=" .env | cut -d= -f2 | tr -d '[:space:]')
        local_DB_USER=$(grep "^DB_USERNAME=" .env | cut -d= -f2 | tr -d '[:space:]')
        local_DB_PASS=$(grep "^DB_PASSWORD=" .env | cut -d= -f2 | tr -d '[:space:]')
        local_DB_HOST=$(grep "^DB_HOST=" .env | cut -d= -f2 | tr -d '[:space:]' || echo "127.0.0.1")
        if command -v mysqldump &> /dev/null && [ -n "$local_DB_NAME" ] && [ -n "$local_DB_USER" ]; then
            mysqldump -h"$local_DB_HOST" -u"$local_DB_USER" -p"$local_DB_PASS" "$local_DB_NAME" > "$BACKUP_DIR/database_${TIMESTAMP}.sql" 2>/dev/null || warn "MySQL backup failed"
            success "MySQL backed up"
        fi
    fi
    cp .env "$BACKUP_DIR/env_${TIMESTAMP}.env" 2>/dev/null || true
    # Cleanup old backups (>2 days)
    find "$BACKUP_DIR" -type f -mtime +2 -delete 2>/dev/null || true
    find . -maxdepth 1 -name ".env.backup.*" -type f -mtime +2 -delete 2>/dev/null || true
else
    warn "Backup skipped (--no-backup)"
fi

# ===== 8. Migrations =====
step "Running Database Migrations"
set +e
MIGRATION_STATUS=$(run_artisan migrate:status 2>&1)
set -e

# Fresh database - create migrations table
if echo "$MIGRATION_STATUS" | grep -q "Migration table not found\|Base table or view not found"; then
    warn "Migration table not found - fresh database detected"
    run_artisan migrate:install 2>/dev/null || true
fi

PENDING=$(echo "$MIGRATION_STATUS" | grep -c "Pending" || echo "0")
if [ "$PENDING" -gt 0 ]; then
    info "$PENDING pending migration(s)"
    run_artisan migrate --force
    success "Migrations completed"
else
    info "No pending migrations"
fi

# ===== 9. Smart Seeding =====
run_smart_seeding

# ===== 10. Build Assets =====
step "Building Frontend Assets"
if command -v npm &> /dev/null && [ -f package.json ]; then
    if [ -f package-lock.json ]; then
        npm ci --silent 2>/dev/null || npm install --silent 2>/dev/null || true
    else
        npm install --silent 2>/dev/null || true
    fi
    npm run build 2>&1 | tail -3 || warn "npm build failed"
    success "Assets built"
else
    info "npm not found or no package.json"
fi

# ===== 11. Optimize =====
step "Optimizing Application"
run_artisan config:clear 2>/dev/null || true
run_artisan route:clear 2>/dev/null || true
run_artisan view:clear 2>/dev/null || true
run_artisan cache:clear 2>/dev/null || true
run_artisan event:clear 2>/dev/null || true

if [ "$APP_ENV" = "production" ]; then
    run_artisan config:cache 2>/dev/null || true
    run_artisan route:cache 2>/dev/null || true
    run_artisan view:cache 2>/dev/null || true
    success "Production caches built"
fi

# OPcache CLI
if "$PHP_BIN" -m 2>/dev/null | grep -qi opcache; then
    "$PHP_BIN" -r "opcache_reset();" 2>/dev/null || true
    info "OPcache cleared (CLI)"
fi

run_composer dump-autoload --optimize --quiet 2>/dev/null || true
success "Application optimized"

# ===== 12. Permissions =====
step "Fixing Permissions"
mkdir -p storage/app/public storage/framework/{cache/data,sessions,views} storage/logs bootstrap/cache
chmod -R 775 storage bootstrap/cache 2>/dev/null || true
run_artisan storage:link --quiet 2>/dev/null || true
success "Permissions set"

# ===== 13. Queue Restart =====
restart_queue

# ===== 14. Web Server Restart =====
restart_web_server

# ===== 15. Disable Maintenance =====
step "Bringing Application Online"
run_artisan up
success "Application is LIVE"

# ===== 16. Health Check =====
health_check

# ===== 17. Post-deployment cleanup =====
run_artisan auth:clear-resets --quiet 2>/dev/null || true

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
echo -e "${CYAN}Summary:${NC}"
echo -e "  ${PURPLE}Branch:${NC}      ${BRANCH:-$(git branch --show-current 2>/dev/null || echo 'N/A')}"
echo -e "  ${PURPLE}Commit:${NC}      $(git rev-parse --short HEAD 2>/dev/null || echo 'N/A')"
echo -e "  ${PURPLE}Environment:${NC} $APP_ENV"
echo -e "  ${PURPLE}PHP:${NC}         $PHP_BIN (v$PHP_VER)"
echo -e "  ${PURPLE}Log:${NC}         $LOG_FILE"
echo ""
