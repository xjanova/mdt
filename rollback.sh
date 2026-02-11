#!/bin/bash
set -e

# ===========================================
# MDT ประตูไม้ - Rollback Deployment
# กู้คืนจาก Backup
# ===========================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════╗"
echo "║   MDT ประตูไม้ - Rollback Deployment          ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

cd "$(dirname "$0")"
BACKUP_DIR="$(pwd)/backups"

# Check backups exist
if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]; then
    echo -e "${RED}Error: No backups found in $BACKUP_DIR${NC}"
    echo "Nothing to rollback to."
    exit 1
fi

# Find latest backups
LATEST_DB=$(ls -t "$BACKUP_DIR"/database_*.sqlite "$BACKUP_DIR"/database_*.sql 2>/dev/null | head -1)
LATEST_ENV=$(ls -t "$BACKUP_DIR"/env_*.env 2>/dev/null | head -1)

echo -e "${CYAN}Available backups:${NC}"
if [ -n "$LATEST_DB" ]; then
    echo -e "  Database: ${GREEN}$LATEST_DB${NC}"
else
    echo -e "  Database: ${RED}Not found${NC}"
fi
if [ -n "$LATEST_ENV" ]; then
    echo -e "  .env:     ${GREEN}$LATEST_ENV${NC}"
else
    echo -e "  .env:     ${RED}Not found${NC}"
fi
echo ""

echo -e "${RED}⚠  WARNING: This will restore from the latest backup!${NC}"
echo -e "${RED}   Current data will be overwritten.${NC}"
echo ""
read -p "$(echo -e ${YELLOW})Type 'yes' to confirm rollback: $(echo -e ${NC})" CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Rollback cancelled."
    exit 0
fi

# Enable maintenance mode
echo -e "\n${CYAN}[1/5]${NC} Activating maintenance mode..."
php artisan down 2>/dev/null || true
echo -e "${GREEN}  ✓${NC} Maintenance mode on"

# Restore database
echo -e "${CYAN}[2/5]${NC} Restoring database..."
if [ -n "$LATEST_DB" ]; then
    DB_CONNECTION=$(grep "^DB_CONNECTION=" .env | cut -d= -f2)
    if [ "$DB_CONNECTION" = "sqlite" ]; then
        cp "$LATEST_DB" database/database.sqlite
        echo -e "${GREEN}  ✓${NC} SQLite database restored"
    elif [ "$DB_CONNECTION" = "mysql" ]; then
        DB_NAME=$(grep "^DB_DATABASE=" .env | cut -d= -f2)
        DB_USER=$(grep "^DB_USERNAME=" .env | cut -d= -f2)
        DB_PASS=$(grep "^DB_PASSWORD=" .env | cut -d= -f2)
        DB_HOST=$(grep "^DB_HOST=" .env | cut -d= -f2 || echo "127.0.0.1")
        mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$LATEST_DB" 2>/dev/null
        echo -e "${GREEN}  ✓${NC} MySQL database restored"
    fi
else
    echo -e "${YELLOW}  ⚠${NC} No database backup to restore"
fi

# Restore .env
echo -e "${CYAN}[3/5]${NC} Restoring .env..."
if [ -n "$LATEST_ENV" ]; then
    cp "$LATEST_ENV" .env
    echo -e "${GREEN}  ✓${NC} .env restored"
else
    echo -e "${YELLOW}  ⚠${NC} No .env backup to restore"
fi

# Clear caches
echo -e "${CYAN}[4/5]${NC} Clearing caches..."
php artisan config:clear 2>/dev/null || true
php artisan cache:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true
php artisan view:clear 2>/dev/null || true
echo -e "${GREEN}  ✓${NC} Caches cleared"

# Bring back up
echo -e "${CYAN}[5/5]${NC} Bringing application back online..."
php artisan up
echo -e "${GREEN}  ✓${NC} Application is live"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Rollback สำเร็จ!                           ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
