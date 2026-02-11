#!/bin/bash
set -e

# ===========================================
# MDT ประตูไม้ - Quick Deploy
# Deploy แบบเร็ว สำหรับอัพเดทเล็กน้อย
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
echo "║   MDT ประตูไม้ - Quick Deploy                ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# Detect environment
DEPLOY_SCRIPT=""
DEPLOY_DIR=""

# Check common server paths
if [ -f "/var/www/html/mdt/deploy.sh" ]; then
    DEPLOY_DIR="/var/www/html/mdt"
    DEPLOY_SCRIPT="$DEPLOY_DIR/deploy.sh"
elif [ -f "/var/www/mdt/deploy.sh" ]; then
    DEPLOY_DIR="/var/www/mdt"
    DEPLOY_SCRIPT="$DEPLOY_DIR/deploy.sh"
elif [ -f "$(dirname "$0")/deploy.sh" ]; then
    DEPLOY_DIR="$(cd "$(dirname "$0")" && pwd)"
    DEPLOY_SCRIPT="$DEPLOY_DIR/deploy.sh"
fi

deploy_on_server() {
    echo -e "${CYAN}Deploying on server...${NC}"
    cd "$DEPLOY_DIR"

    # Step 1: Composer
    echo -e "${BLUE}[1/7]${NC} ติดตั้ง Composer Dependencies..."
    composer install --no-dev --optimize-autoloader --no-interaction --quiet 2>/dev/null
    echo -e "${GREEN}  ✓${NC} Done"

    # Step 2: .env
    echo -e "${BLUE}[2/7]${NC} ตรวจสอบ Environment..."
    if [ ! -f .env ]; then
        cp .env.example .env
        php artisan key:generate --force --quiet
        echo -e "${GREEN}  ✓${NC} .env created"
    else
        echo -e "${GREEN}  ✓${NC} .env exists"
    fi

    # Step 3: Migrations
    echo -e "${BLUE}[3/7]${NC} รัน Database Migrations..."
    php artisan migrate --force --quiet 2>/dev/null || true
    echo -e "${GREEN}  ✓${NC} Done"

    # Step 4: Build
    echo -e "${BLUE}[4/7]${NC} Build Frontend Assets..."
    if command -v npm &> /dev/null; then
        npm install --silent 2>/dev/null && npm run build --silent 2>/dev/null || true
    fi
    echo -e "${GREEN}  ✓${NC} Done"

    # Step 5: Cache
    echo -e "${BLUE}[5/7]${NC} Optimize Caches..."
    php artisan config:cache --quiet 2>/dev/null || true
    php artisan route:cache --quiet 2>/dev/null || true
    php artisan view:cache --quiet 2>/dev/null || true
    echo -e "${GREEN}  ✓${NC} Done"

    # Step 6: Permissions
    echo -e "${BLUE}[6/7]${NC} ตั้งค่า Permissions..."
    chmod -R 775 storage bootstrap/cache 2>/dev/null || true
    php artisan storage:link --quiet 2>/dev/null || true
    echo -e "${GREEN}  ✓${NC} Done"

    # Step 7: Restart services
    echo -e "${BLUE}[7/7]${NC} Restart Services..."
    if command -v systemctl &> /dev/null; then
        sudo systemctl reload nginx 2>/dev/null || true
        sudo systemctl reload apache2 2>/dev/null || true
    fi
    echo -e "${GREEN}  ✓${NC} Done"

    echo ""
    echo -e "${GREEN}Deploy สำเร็จ!${NC}"
}

show_ssh_instructions() {
    echo -e "${YELLOW}ไม่พบ deploy.sh บนเซิร์ฟเวอร์${NC}"
    echo ""
    echo -e "${CYAN}วิธี deploy ไปเซิร์ฟเวอร์:${NC}"
    echo ""
    echo -e "${BLUE}วิธีที่ 1: SSH เข้าเซิร์ฟเวอร์แล้วรัน${NC}"
    echo "  ssh user@your-server.com"
    echo "  cd /var/www/html/mdt"
    echo "  git pull origin main"
    echo "  ./deploy.sh"
    echo ""
    echo -e "${BLUE}วิธีที่ 2: คำสั่งเดียว (Copy & Paste)${NC}"
    echo "  ssh user@your-server.com 'cd /var/www/html/mdt && git pull && ./deploy.sh'"
    echo ""
    echo -e "${BLUE}วิธีที่ 3: ใช้ GitHub Actions (Automated)${NC}"
    echo "  Push code ไปที่ main branch แล้ว CI/CD จะ deploy อัตโนมัติ"
    echo ""
}

if [ -n "$DEPLOY_SCRIPT" ]; then
    deploy_on_server
else
    show_ssh_instructions
fi
