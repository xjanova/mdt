#!/bin/bash
set -e

# ===========================================
# MDT ประตูไม้ - Development Automation Setup
# ตั้งค่า Git Hooks, GitHub Templates, etc.
# ===========================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════╗"
echo "║   MDT ประตูไม้ - Automation Setup             ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

cd "$(dirname "$0")"

# Check git repo
if [ ! -d .git ]; then
    echo -e "${RED}Error: Not a git repository!${NC}"
    exit 1
fi

# ===== 1. Git Hooks =====
echo -e "${BLUE}[1/4]${NC} Setting up Git Hooks..."

mkdir -p .git/hooks

# Pre-commit hook
cat > .git/hooks/pre-commit << 'HOOK'
#!/bin/bash
echo "Running pre-commit checks..."

# Check for .env file in staged files
if git diff --cached --name-only | grep -q "^\.env$"; then
    echo "ERROR: .env file should not be committed!"
    exit 1
fi

# Run Laravel Pint if available
if [ -f vendor/bin/pint ]; then
    echo "Running Laravel Pint..."
    vendor/bin/pint --test 2>/dev/null || {
        echo "Code style issues found. Run: vendor/bin/pint"
        exit 1
    }
fi

echo "Pre-commit checks passed!"
HOOK
chmod +x .git/hooks/pre-commit

# Commit message hook (Conventional Commits)
cat > .git/hooks/commit-msg << 'HOOK'
#!/bin/bash
COMMIT_MSG=$(cat "$1")
PATTERN="^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .{1,}"

if ! echo "$COMMIT_MSG" | grep -qE "$PATTERN"; then
    echo "ERROR: Commit message does not follow Conventional Commits format"
    echo ""
    echo "Format: <type>(<scope>): <description>"
    echo ""
    echo "Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert"
    echo ""
    echo "Examples:"
    echo "  feat(sales): add monthly report export"
    echo "  fix(attendance): correct OT calculation"
    echo "  docs: update deployment guide"
    exit 1
fi
HOOK
chmod +x .git/hooks/commit-msg

# Pre-push hook
cat > .git/hooks/pre-push << 'HOOK'
#!/bin/bash
echo "Running pre-push checks..."

# Check for pending migrations
PENDING=$(php artisan migrate:status 2>/dev/null | grep -c "Pending" || true)
if [ "$PENDING" -gt 0 ]; then
    echo "WARNING: $PENDING pending migration(s) detected!"
    echo "Make sure to run migrations on the server after push."
fi

echo "Pre-push checks passed!"
HOOK
chmod +x .git/hooks/pre-push

echo -e "${GREEN}  ✓${NC} Git hooks installed"

# ===== 2. GitHub Templates =====
echo -e "${BLUE}[2/4]${NC} Creating GitHub templates..."

mkdir -p .github/ISSUE_TEMPLATE

# Bug report template
cat > .github/ISSUE_TEMPLATE/bug_report.md << 'TEMPLATE'
---
name: Bug Report / แจ้งบั๊ก
about: รายงานปัญหาที่พบในระบบ
labels: bug
---

## ปัญหาที่พบ
<!-- อธิบายปัญหาที่เกิดขึ้น -->

## ขั้นตอนการเกิดปัญหา
1. ไปที่หน้า...
2. คลิกที่...
3. ปัญหาที่เห็น...

## สิ่งที่คาดว่าจะเกิดขึ้น
<!-- อธิบายสิ่งที่ควรจะเกิดขึ้น -->

## Screenshots
<!-- แนบรูปถ้ามี -->

## Environment
- Browser:
- OS:
- Module: [dashboard/attendance/sales/workflows/problems/branches/communications]
TEMPLATE

# Feature request template
cat > .github/ISSUE_TEMPLATE/feature_request.md << 'TEMPLATE'
---
name: Feature Request / ขอฟีเจอร์ใหม่
about: เสนอฟีเจอร์ใหม่สำหรับระบบ
labels: enhancement
---

## ปัญหาที่ต้องการแก้
<!-- อธิบายปัญหาหรือความต้องการ -->

## ฟีเจอร์ที่เสนอ
<!-- อธิบายฟีเจอร์ที่ต้องการ -->

## โมดูลที่เกี่ยวข้อง
- [ ] Dashboard
- [ ] ลงเวลางาน/OT
- [ ] รายงานการขาย
- [ ] โฟลงาน
- [ ] ติดตามปัญหา
- [ ] สาขา
- [ ] ศูนย์สื่อสาร
TEMPLATE

# Pull request template
cat > .github/pull_request_template.md << 'TEMPLATE'
## สรุปการเปลี่ยนแปลง
<!-- อธิบายสิ่งที่เปลี่ยน -->

## ประเภท
- [ ] Feature ใหม่
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation
- [ ] DevOps/CI

## Checklist
- [ ] ทดสอบบน local แล้ว
- [ ] Migration file ถูกสร้าง (ถ้าจำเป็น)
- [ ] ไม่มี credentials ใน code
- [ ] UI แสดงผลภาษาไทยถูกต้อง
TEMPLATE

echo -e "${GREEN}  ✓${NC} GitHub templates created"

# ===== 3. Version Bump Script =====
echo -e "${BLUE}[3/4]${NC} Creating version bump script..."

mkdir -p scripts

cat > scripts/bump-version.sh << 'SCRIPT'
#!/bin/bash
# Usage: ./scripts/bump-version.sh [major|minor|patch]

VERSION_FILE="VERSION"
CURRENT=$(cat "$VERSION_FILE" 2>/dev/null | tr -d '[:space:]' || echo "0.0.0")
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"

case "${1:-patch}" in
    major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
    minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
    patch) PATCH=$((PATCH + 1)) ;;
    *) echo "Usage: $0 [major|minor|patch]"; exit 1 ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
echo "$NEW_VERSION" > "$VERSION_FILE"
echo "Version bumped: $CURRENT -> $NEW_VERSION"
SCRIPT
chmod +x scripts/bump-version.sh

echo -e "${GREEN}  ✓${NC} Version bump script created"

# ===== 4. Dependabot =====
echo -e "${BLUE}[4/4]${NC} Creating Dependabot config..."

cat > .github/dependabot.yml << 'DEPENDABOT'
version: 2
updates:
  - package-ecosystem: "composer"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "php"

  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "javascript"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
DEPENDABOT

echo -e "${GREEN}  ✓${NC} Dependabot configured"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Automation Setup Complete!                 ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}สิ่งที่ถูกตั้งค่า:${NC}"
echo "  - Git Hooks (pre-commit, commit-msg, pre-push)"
echo "  - GitHub Issue Templates (Bug Report, Feature Request)"
echo "  - Pull Request Template"
echo "  - Version Bump Script (scripts/bump-version.sh)"
echo "  - Dependabot (auto dependency updates)"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  git add . && git commit -m 'chore: add automation setup'"
echo ""
