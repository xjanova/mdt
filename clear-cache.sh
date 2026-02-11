#!/bin/bash
set -e

# ===========================================
# MDT ประตูไม้ - Clear All Caches
# ===========================================

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════╗"
echo "║   MDT ประตูไม้ - Clear Cache                  ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

cd "$(dirname "$0")"

echo -e "${CYAN}[1/6]${NC} Clearing application cache..."
php artisan cache:clear
echo -e "${GREEN}  ✓${NC} Application cache cleared"

echo -e "${CYAN}[2/6]${NC} Clearing configuration cache..."
php artisan config:clear
echo -e "${GREEN}  ✓${NC} Config cache cleared"

echo -e "${CYAN}[3/6]${NC} Clearing route cache..."
php artisan route:clear
echo -e "${GREEN}  ✓${NC} Route cache cleared"

echo -e "${CYAN}[4/6]${NC} Clearing view cache..."
php artisan view:clear
echo -e "${GREEN}  ✓${NC} View cache cleared"

echo -e "${CYAN}[5/6]${NC} Clearing compiled classes..."
php artisan clear-compiled
echo -e "${GREEN}  ✓${NC} Compiled classes cleared"

echo -e "${CYAN}[6/6]${NC} Clearing event cache..."
php artisan event:clear
echo -e "${GREEN}  ✓${NC} Event cache cleared"

# OPcache
if php -m 2>/dev/null | grep -qi opcache; then
    echo ""
    echo -e "${YELLOW}[BONUS]${NC} OPcache detected - may require web server restart to fully clear"
fi

echo ""
echo -e "${GREEN}All caches cleared!${NC}"
echo -e "Application is now using fresh configuration."
echo ""
