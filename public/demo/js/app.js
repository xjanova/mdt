/* ========================================
   MDT ERP - Core Application Logic
   ======================================== */

let currentRole = 'admin';
let currentPage = 'dashboard';

// Menu definitions per role
const MENUS = {
    admin: [
        { group: 'หลัก', items: [
            { id:'dashboard', icon:'fa-chart-pie', label:'แดชบอร์ด' },
            { id:'branches', icon:'fa-store', label:'สาขาทั้งหมด' },
        ]},
        { group: 'ปฏิบัติการ', items: [
            { id:'attendance', icon:'fa-clock', label:'ลงเวลางาน/OT', badge:1 },
            { id:'sales', icon:'fa-chart-line', label:'รายงานการขาย' },
            { id:'workflows', icon:'fa-diagram-project', label:'โฟลงาน/มอบหมาย', badge:4 },
            { id:'problems', icon:'fa-triangle-exclamation', label:'ติดตามปัญหา', badge:2 },
            { id:'communications', icon:'fa-comments', label:'ศูนย์สื่อสาร' },
        ]},
        { group: 'บุคลากร', items: [
            { id:'hr', icon:'fa-people-group', label:'HR / ลา / ตารางงาน' },
        ]},
        { group: 'ข้อมูล', items: [
            { id:'products', icon:'fa-box-open', label:'สินค้า/สต๊อก' },
            { id:'import', icon:'fa-file-import', label:'นำเข้าข้อมูล' },
            { id:'ai', icon:'fa-robot', label:'AI ผู้ช่วย' },
        ]},
        { group: 'ตั้งค่า', items: [
            { id:'users', icon:'fa-users-gear', label:'จัดการผู้ใช้/สิทธิ์' },
            { id:'settings', icon:'fa-gear', label:'ตั้งค่าระบบ' },
        ]},
    ],
    supervisor: [
        { group: 'หลัก', items: [
            { id:'dashboard', icon:'fa-chart-pie', label:'แดชบอร์ด' },
            { id:'branches', icon:'fa-store', label:'สาขาของฉัน' },
        ]},
        { group: 'จัดการงาน', items: [
            { id:'attendance', icon:'fa-clock', label:'ลงเวลาทีมงาน', badge:1 },
            { id:'sales', icon:'fa-chart-line', label:'รายงานการขาย' },
            { id:'workflows', icon:'fa-diagram-project', label:'สร้างโฟล/มอบหมาย', badge:3 },
            { id:'problems', icon:'fa-triangle-exclamation', label:'ติดตามปัญหา', badge:2 },
            { id:'communications', icon:'fa-comments', label:'สื่อสาร' },
        ]},
        { group: 'ทีมงาน', items: [
            { id:'hr', icon:'fa-people-group', label:'จัดการทีม / ลา' },
        ]},
        { group: 'เครื่องมือ', items: [
            { id:'products', icon:'fa-box-open', label:'สินค้า/สต๊อก' },
            { id:'import', icon:'fa-file-import', label:'นำเข้าข้อมูล' },
            { id:'ai', icon:'fa-robot', label:'AI ผู้ช่วย' },
        ]},
    ],
    seller: [
        { group: 'หลัก', items: [
            { id:'dashboard', icon:'fa-chart-pie', label:'แดชบอร์ดของฉัน' },
        ]},
        { group: 'งานประจำ', items: [
            { id:'attendance', icon:'fa-clock', label:'ลงเวลาเข้างาน' },
            { id:'sales', icon:'fa-chart-line', label:'รายงานยอดขาย' },
            { id:'workflows', icon:'fa-diagram-project', label:'งานที่ได้รับ', badge:2 },
            { id:'problems', icon:'fa-triangle-exclamation', label:'แจ้งปัญหา' },
            { id:'communications', icon:'fa-comments', label:'ข้อความ', badge:1 },
        ]},
        { group: 'อื่นๆ', items: [
            { id:'hr', icon:'fa-calendar-check', label:'เขียนใบลา' },
            { id:'ai', icon:'fa-robot', label:'AI ผู้ช่วย' },
        ]},
    ],
    hr: [
        { group: 'หลัก', items: [
            { id:'dashboard', icon:'fa-chart-pie', label:'แดชบอร์ด HR' },
        ]},
        { group: 'บุคลากร', items: [
            { id:'attendance', icon:'fa-clock', label:'ภาพรวมเวลาทำงาน' },
            { id:'hr', icon:'fa-people-group', label:'จัดการพนักงาน' },
            { id:'users', icon:'fa-users-gear', label:'บัญชีผู้ใช้' },
        ]},
        { group: 'รายงาน', items: [
            { id:'sales', icon:'fa-chart-line', label:'สรุปผลงาน' },
            { id:'ai', icon:'fa-robot', label:'AI ผู้ช่วย' },
        ]},
    ],
    employee: [
        { group: 'หลัก', items: [
            { id:'dashboard', icon:'fa-chart-pie', label:'หน้าหลัก' },
        ]},
        { group: 'งานของฉัน', items: [
            { id:'attendance', icon:'fa-clock', label:'ลงเวลาเข้างาน' },
            { id:'workflows', icon:'fa-diagram-project', label:'งานที่ได้รับ', badge:1 },
            { id:'problems', icon:'fa-triangle-exclamation', label:'แจ้งปัญหา' },
            { id:'communications', icon:'fa-comments', label:'ข้อความ' },
        ]},
        { group: 'อื่นๆ', items: [
            { id:'hr', icon:'fa-calendar-check', label:'เขียนใบลา' },
            { id:'ai', icon:'fa-robot', label:'AI ผู้ช่วย' },
        ]},
    ]
};

const ROLE_NAMES = {
    admin: { name:'ผู้ดูแลระบบ', avatar:'AD', fullName:'Admin' },
    supervisor: { name:'หัวหน้างาน', avatar:'สม', fullName:'สมชาย หัวหน้า' },
    seller: { name:'PC/ผู้ขาย', avatar:'พร', fullName:'พรทิพย์ PC' },
    hr: { name:'ฝ่ายบุคคล', avatar:'HR', fullName:'มานี HR' },
    employee: { name:'พนักงาน', avatar:'จร', fullName:'จรัญ พนักงาน' },
};

// Bottom nav menu definitions per role (5 items max for mobile)
const BOTTOM_NAV = {
    admin: [
        { id:'dashboard', icon:'fa-chart-pie', label:'แดชบอร์ด' },
        { id:'sales', icon:'fa-chart-line', label:'ยอดขาย' },
        { id:'ai', icon:'fa-robot', label:'AI', center:true },
        { id:'products', icon:'fa-box-open', label:'สินค้า' },
        { id:'_more', icon:'fa-bars', label:'เพิ่มเติม' },
    ],
    supervisor: [
        { id:'dashboard', icon:'fa-chart-pie', label:'แดชบอร์ด' },
        { id:'workflows', icon:'fa-diagram-project', label:'โฟลงาน', badge:3 },
        { id:'ai', icon:'fa-robot', label:'AI', center:true },
        { id:'products', icon:'fa-box-open', label:'สินค้า' },
        { id:'_more', icon:'fa-bars', label:'เพิ่มเติม' },
    ],
    seller: [
        { id:'dashboard', icon:'fa-chart-pie', label:'หน้าหลัก' },
        { id:'attendance', icon:'fa-clock', label:'ลงเวลา' },
        { id:'ai', icon:'fa-robot', label:'AI', center:true },
        { id:'sales', icon:'fa-chart-line', label:'ยอดขาย' },
        { id:'_more', icon:'fa-bars', label:'เพิ่มเติม' },
    ],
    hr: [
        { id:'dashboard', icon:'fa-chart-pie', label:'แดชบอร์ด' },
        { id:'hr', icon:'fa-people-group', label:'พนักงาน' },
        { id:'ai', icon:'fa-robot', label:'AI', center:true },
        { id:'attendance', icon:'fa-clock', label:'เวลางาน' },
        { id:'_more', icon:'fa-bars', label:'เพิ่มเติม' },
    ],
    employee: [
        { id:'dashboard', icon:'fa-chart-pie', label:'หน้าหลัก' },
        { id:'attendance', icon:'fa-clock', label:'ลงเวลา' },
        { id:'ai', icon:'fa-robot', label:'AI', center:true },
        { id:'workflows', icon:'fa-diagram-project', label:'งาน', badge:1 },
        { id:'_more', icon:'fa-bars', label:'เพิ่มเติม' },
    ],
};

function buildBottomNav(role) {
    const container = document.getElementById('bottomNavInner');
    const nav = document.getElementById('bottomNav');
    if (!container || !nav) return;

    const items = BOTTOM_NAV[role] || BOTTOM_NAV.admin;
    let html = '';
    items.forEach(item => {
        const isCenter = item.center;
        const isMore = item.id === '_more';
        const isActive = !isMore && item.id === currentPage;

        if (isCenter) {
            html += `<button class="bottom-nav-item bnav-center${isActive ? ' active' : ''}"
                        data-bnav="${item.id}" onclick="loadPage('${item.id}')">
                        <div class="bnav-ai-icon"><i class="fas ${item.icon}"></i></div>
                        <span>${item.label}</span>
                    </button>`;
        } else if (isMore) {
            html += `<button class="bottom-nav-item" data-bnav="_more" onclick="toggleSidebar()">
                        <i class="fas ${item.icon}"></i>
                        <span>${item.label}</span>
                    </button>`;
        } else {
            html += `<button class="bottom-nav-item${isActive ? ' active' : ''}"
                        data-bnav="${item.id}" onclick="loadPage('${item.id}')">
                        <i class="fas ${item.icon}"></i>
                        ${item.badge ? `<span class="bnav-badge">${item.badge}</span>` : ''}
                        <span>${item.label}</span>
                    </button>`;
        }
    });
    container.innerHTML = html;
    nav.style.display = '';
}

function updateBottomNavActive(pageId) {
    document.querySelectorAll('.bottom-nav-item').forEach(btn => {
        const navId = btn.dataset.bnav;
        if (navId === '_more') return;
        btn.classList.toggle('active', navId === pageId);
    });
}

function switchRole(role) {
    currentRole = role;
    // Update role buttons
    document.querySelectorAll('.role-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.role === role);
    });
    // Update user info
    const info = ROLE_NAMES[role];
    document.getElementById('userName').textContent = info.fullName;
    document.getElementById('userRole').textContent = info.name;
    document.getElementById('userAvatar').textContent = info.avatar;
    // Rebuild sidebar
    buildSidebar(role);
    // Rebuild bottom nav
    buildBottomNav(role);
    // Load dashboard
    loadPage('dashboard');
}

function buildSidebar(role) {
    const nav = document.getElementById('sidebarNav');
    const menus = MENUS[role] || [];
    let html = '';
    menus.forEach(group => {
        html += `<div class="nav-group-label">${group.group}</div>`;
        group.items.forEach(item => {
            html += `<a class="nav-item${item.id === currentPage ? ' active' : ''}"
                        data-page="${item.id}" onclick="loadPage('${item.id}')">
                        <i class="fas ${item.icon}"></i>
                        <span>${item.label}</span>
                        ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
                     </a>`;
        });
    });
    nav.innerHTML = html;
}

function loadPage(pageId) {
    currentPage = pageId;
    // Update active nav
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.page === pageId);
    });
    // Page title mapping
    const titles = {
        dashboard:'แดชบอร์ด', attendance:'ลงเวลางาน/OT', sales:'รายงานการขาย',
        workflows:'โฟลงาน/มอบหมาย', problems:'ติดตามปัญหา', branches:'สาขา',
        communications:'ศูนย์สื่อสาร', hr:'HR / บุคลากร', import:'นำเข้าข้อมูล',
        products:'สินค้า/สต๊อก', ai:'AI ผู้ช่วยอัจฉริยะ', users:'จัดการผู้ใช้/สิทธิ์', settings:'ตั้งค่าระบบ'
    };
    document.getElementById('pageTitle').textContent = titles[pageId] || pageId;
    // Call page renderer
    const renderers = {
        dashboard: renderDashboard,
        attendance: renderAttendance,
        sales: renderSales,
        workflows: renderWorkflows,
        problems: renderProblems,
        branches: renderBranches,
        communications: renderCommunications,
        hr: renderHR,
        import: renderImport,
        products: renderProducts,
        ai: renderAI,
        users: renderUsers,
        settings: renderSettings,
    };
    const renderer = renderers[pageId];
    if (renderer) {
        renderer(currentRole);
    } else {
        document.getElementById('contentArea').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tools"></i>
                <p>กำลังพัฒนาหน้านี้</p>
            </div>`;
    }
    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('mobile-open');
    const sOverlay = document.getElementById('sidebarOverlay');
    if (sOverlay) sOverlay.style.display = 'none';
    // Update bottom nav active state
    updateBottomNavActive(pageId);
    // Scroll to top
    window.scrollTo(0, 0);
}

function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const isOpen = sb.classList.toggle('mobile-open');
    if (overlay) overlay.style.display = isOpen ? 'block' : 'none';
}

function showNotifications() {
    document.getElementById('notifOverlay').classList.add('show');
}
function closeNotif() {
    document.getElementById('notifOverlay').classList.remove('show');
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

function showModal(title, bodyHtml, footerHtml) {
    let overlay = document.getElementById('globalModal');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'globalModal';
        overlay.className = 'modal-overlay';
        overlay.onclick = e => { if (e.target === overlay) closeModal(); };
        document.body.appendChild(overlay);
    }
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">${bodyHtml}</div>
            ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
        </div>`;
    overlay.classList.add('show');
}
function closeModal() {
    const m = document.getElementById('globalModal');
    if (m) m.classList.remove('show');
}

// Utility: format number with commas
function fmtNum(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Utility: format currency
function fmtMoney(n) {
    return '฿' + fmtNum(n);
}

// Utility: random ID
function randId() {
    return Math.random().toString(36).substr(2, 8);
}

// LocalStorage helpers
function saveData(key, data) {
    localStorage.setItem('mdt_' + key, JSON.stringify(data));
}
function loadData(key, defaultVal) {
    const d = localStorage.getItem('mdt_' + key);
    return d ? JSON.parse(d) : defaultVal;
}
