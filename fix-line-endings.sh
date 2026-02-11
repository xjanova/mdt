#!/bin/bash
set -e

# ===========================================
# MDT ประตูไม้ - Fix Line Endings (CRLF -> LF)
# ===========================================

GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}Fixing line endings for shell scripts...${NC}"
echo ""

SCRIPTS=(
    "install.sh"
    "quick-install.sh"
    "deploy.sh"
    "quick-deploy.sh"
    "clear-cache.sh"
    "fix-permissions.sh"
    "run-migrations.sh"
    "rollback.sh"
    "setup-automation.sh"
)

cd "$(dirname "$0")"

for script in "${SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        if command -v dos2unix &> /dev/null; then
            dos2unix "$script" 2>/dev/null
        else
            sed -i 's/\r$//' "$script"
        fi
        chmod +x "$script"
        echo -e "${GREEN}  ✓${NC} $script"
    fi
done

echo ""
echo -e "${GREEN}Line endings fixed and scripts made executable!${NC}"
echo ""
echo "You can now run:"
echo "  ./install.sh       - Interactive install"
echo "  ./quick-install.sh - Quick install"
echo "  ./deploy.sh        - Deploy"
echo ""
