#!/bin/bash
set -e

# ===========================================
# MDT ประตูไม้ - Database Migration Tool
# ===========================================

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════╗"
echo "║   MDT ประตูไม้ - Database Migration Tool      ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

cd "$(dirname "$0")"

# Check .env
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Run ./install.sh first."
    exit 1
fi

# Show environment info
APP_ENV=$(grep "^APP_ENV=" .env | cut -d= -f2)
DB_CONNECTION=$(grep "^DB_CONNECTION=" .env | cut -d= -f2)
echo -e "Environment: ${YELLOW}$APP_ENV${NC}"
echo -e "Database:    ${YELLOW}$DB_CONNECTION${NC}"
echo ""

# Production warning
if [ "$APP_ENV" = "production" ]; then
    echo -e "${RED}⚠  WARNING: Running on PRODUCTION environment!${NC}"
    read -p "$(echo -e ${YELLOW})Continue? (yes/no): $(echo -e ${NC})" CONFIRM
    if [ "$CONFIRM" != "yes" ]; then
        echo "Cancelled."
        exit 0
    fi
    echo ""
fi

# Show current status
echo -e "${CYAN}Current migration status:${NC}"
php artisan migrate:status
echo ""

# Menu
echo -e "${CYAN}เลือกการดำเนินการ:${NC}"
echo "  1) รัน migration ปกติ"
echo "  2) รัน migration + seed ข้อมูล"
echo "  3) Rollback ครั้งล่าสุด"
echo "  4) Reset ทั้งหมด (ลบ + สร้างใหม่)"
echo "  5) Fresh migration (ลบทุก table + migrate)"
echo "  6) Fresh migration + seed ข้อมูลตัวอย่าง"
echo "  7) ยกเลิก"
echo ""
read -p "$(echo -e ${YELLOW})เลือก (1-7): $(echo -e ${NC})" CHOICE

case $CHOICE in
    1)
        echo -e "\n${CYAN}Running migrations...${NC}"
        php artisan migrate --force
        echo -e "${GREEN}✓ Migrations completed${NC}"
        ;;
    2)
        echo -e "\n${CYAN}Running migrations with seeders...${NC}"
        php artisan migrate --force
        php artisan db:seed --force
        echo -e "${GREEN}✓ Migrations and seeding completed${NC}"
        ;;
    3)
        echo -e "\n${CYAN}Rolling back last migration...${NC}"
        php artisan migrate:rollback --force
        echo -e "${YELLOW}✓ Rollback completed${NC}"
        ;;
    4)
        echo -e "${RED}⚠  This will RESET all data!${NC}"
        read -p "$(echo -e ${RED})Are you sure? (yes/no): $(echo -e ${NC})" RESET_CONFIRM
        if [ "$RESET_CONFIRM" = "yes" ]; then
            php artisan migrate:reset --force
            echo -e "${YELLOW}✓ All migrations reset${NC}"
        else
            echo "Cancelled."
        fi
        ;;
    5)
        echo -e "${RED}⚠  This will DROP all tables and re-migrate!${NC}"
        read -p "$(echo -e ${RED})Are you sure? (yes/no): $(echo -e ${NC})" FRESH_CONFIRM
        if [ "$FRESH_CONFIRM" = "yes" ]; then
            php artisan migrate:fresh --force
            echo -e "${YELLOW}✓ Fresh migration completed${NC}"
        else
            echo "Cancelled."
        fi
        ;;
    6)
        echo -e "${RED}⚠  This will DROP all tables, re-migrate, and seed demo data!${NC}"
        read -p "$(echo -e ${RED})Are you sure? (yes/no): $(echo -e ${NC})" FRESH_SEED_CONFIRM
        if [ "$FRESH_SEED_CONFIRM" = "yes" ]; then
            php artisan migrate:fresh --seed --force
            echo -e "${GREEN}✓ Fresh migration with seeding completed${NC}"
        else
            echo "Cancelled."
        fi
        ;;
    7)
        echo "Cancelled."
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${CYAN}Updated migration status:${NC}"
php artisan migrate:status
echo ""
