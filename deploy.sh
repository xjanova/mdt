#!/bin/bash
# =========================================
# MDT ERP Demo - Manual Deploy Script
# สยามพลาสวูด - XMAN Studio
# =========================================
# Usage: ./deploy.sh [server_path]
# Example: ./deploy.sh /var/www/demo87.xman4289.com

set -e

# Configuration
DEPLOY_PATH="${1:-/var/www/demo87.xman4289.com}"
REPO_URL="https://github.com/xjanova/mdt.git"
BACKUP_DIR="$DEPLOY_PATH/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "========================================="
echo "  MDT ERP Demo - Deployment"
echo "  Target: $DEPLOY_PATH"
echo "  Time: $(date)"
echo "========================================="

# Check if deploy path exists
if [ ! -d "$DEPLOY_PATH" ]; then
    echo "📁 Creating deploy directory..."
    mkdir -p "$DEPLOY_PATH"
    cd "$DEPLOY_PATH"
    git init
    git remote add origin "$REPO_URL"
    git fetch origin main
    git checkout main
    echo "✅ Fresh install complete!"
else
    # Backup current version
    echo "📦 Creating backup..."
    mkdir -p "$BACKUP_DIR"
    if [ -d "$DEPLOY_PATH/demo" ]; then
        cp -r "$DEPLOY_PATH/demo" "$BACKUP_DIR/demo_$TIMESTAMP"
        echo "   Backup: $BACKUP_DIR/demo_$TIMESTAMP"
    fi

    # Pull latest
    echo "📥 Pulling latest code..."
    cd "$DEPLOY_PATH"
    git fetch origin main
    git reset --hard origin/main
fi

# Set permissions
echo "🔒 Setting file permissions..."
find "$DEPLOY_PATH/demo" -type f -exec chmod 644 {} \;
find "$DEPLOY_PATH/demo" -type d -exec chmod 755 {} \;

# Clean old backups (keep last 5)
if [ -d "$BACKUP_DIR" ]; then
    BACKUP_COUNT=$(ls -d "$BACKUP_DIR"/demo_* 2>/dev/null | wc -l)
    if [ "$BACKUP_COUNT" -gt 5 ]; then
        echo "🧹 Cleaning old backups (keeping last 5)..."
        ls -dt "$BACKUP_DIR"/demo_* | tail -n +6 | xargs rm -rf
    fi
fi

echo ""
echo "========================================="
echo "  ✅ Deployment Complete!"
echo "  Path: $DEPLOY_PATH/demo/"
echo "  Time: $(date)"
echo "========================================="
