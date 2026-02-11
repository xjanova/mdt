#!/bin/bash
set -e

# ===========================================
# MDT ประตูไม้ - Fix File Permissions
# ===========================================

GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════╗"
echo "║   MDT ประตูไม้ - Fix Permissions              ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

cd "$(dirname "$0")"

# Create required directories
echo -e "${CYAN}[1/3]${NC} Creating directories..."
mkdir -p storage/app/public
mkdir -p storage/framework/cache/data
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs
mkdir -p bootstrap/cache

echo -e "${GREEN}  ✓${NC} Directories created"

# Set permissions
echo -e "${CYAN}[2/3]${NC} Setting permissions..."
chmod -R 775 storage
chmod -R 775 bootstrap/cache
chmod -R 775 storage/framework
chmod -R 775 storage/logs

echo -e "${GREEN}  ✓${NC} Permissions set to 775"

# Optional: set ownership
if [ -n "$1" ]; then
    echo -e "${CYAN}[3/3]${NC} Setting ownership to $1..."
    chown -R "$1" storage bootstrap/cache
    echo -e "${GREEN}  ✓${NC} Ownership set"
else
    echo -e "${CYAN}[3/3]${NC} Ownership unchanged (pass username as argument to change)"
fi

echo ""
echo -e "${GREEN}Permissions fixed!${NC}"
echo ""
ls -la storage/ | head -10
echo ""
