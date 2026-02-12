/* User & Permission Management Page */
function renderUsers(role) {
    const c = document.getElementById('contentArea');
    c.innerHTML = `
    <div style="margin-bottom:16px;display:flex;gap:10px;justify-content:space-between;flex-wrap:wrap">
        <div style="display:flex;gap:10px">
            <button class="btn btn-primary" onclick="showAddUser()"><i class="fas fa-user-plus"></i> เพิ่มผู้ใช้</button>
            <button class="btn btn-outline" onclick="showRoleManager()"><i class="fas fa-shield-halved"></i> จัดการบทบาท/สิทธิ์</button>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
            <input type="text" class="form-control" placeholder="ค้นหาผู้ใช้..." style="width:220px" id="userSearch" oninput="filterUsers()">
            <select class="form-control" style="width:140px" id="userRoleFilter" onchange="filterUsers()">
                <option value="">ทุกบทบาท</option>
                <option value="admin">Admin</option>
                <option value="supervisor">หัวหน้างาน</option>
                <option value="seller">PC/Seller</option>
                <option value="hr">HR</option>
                <option value="employee">พนักงาน</option>
            </select>
        </div>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(5,1fr)">
        <div class="stat-card"><div class="stat-icon" style="background:var(--primary)"><i class="fas fa-users"></i></div><div><div class="stat-value">48</div><div class="stat-label">ผู้ใช้ทั้งหมด</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--success)"><i class="fas fa-circle-check"></i></div><div><div class="stat-value">42</div><div class="stat-label">ใช้งานอยู่</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--warning)"><i class="fas fa-clock"></i></div><div><div class="stat-value">4</div><div class="stat-label">รอยืนยัน</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--gray-400)"><i class="fas fa-ban"></i></div><div><div class="stat-value">2</div><div class="stat-label">ระงับ</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--info)"><i class="fas fa-key"></i></div><div><div class="stat-value">5</div><div class="stat-label">บทบาท</div></div></div>
    </div>

    <div class="card">
        <div class="card-header">
            <h3><i class="fas fa-users-gear" style="color:var(--primary);margin-right:6px"></i> รายชื่อผู้ใช้ในระบบ</h3>
            <button class="btn btn-sm btn-outline"><i class="fas fa-download"></i> Export</button>
        </div>
        <div class="card-body">
            <table class="data-table" id="usersTable">
                <thead>
                    <tr>
                        <th style="width:40px"></th>
                        <th>ชื่อ-นามสกุล</th>
                        <th>อีเมล/ชื่อผู้ใช้</th>
                        <th>รหัสผ่าน</th>
                        <th>บทบาท</th>
                        <th>สาขา</th>
                        <th>เข้าใช้ล่าสุด</th>
                        <th>สถานะ</th>
                        <th style="width:100px">จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    ${getUserRows()}
                </tbody>
            </table>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3><i class="fas fa-clock-rotate-left" style="color:var(--gray-500);margin-right:6px"></i> กิจกรรมล่าสุด</h3></div>
        <div class="card-body">
            <div style="font-size:13px">
                ${getActivityLog()}
            </div>
        </div>
    </div>`;
}

function getUserRows() {
    const users = [
        { id:1, name:'ธนกฤต ผู้จัดการ', email:'admin@siamplaswood.com', password:'Admin@2026!', role:'admin', roleLabel:'Admin', roleCls:'tag-danger', branch:'สำนักงานใหญ่', lastLogin:'13 ก.พ. 69 09:15', status:'active', avatar:'ธน' },
        { id:2, name:'สมชาย ใจดี', email:'somchai@siamplaswood.com', password:'Somchai@123', role:'supervisor', roleLabel:'หัวหน้างาน', roleCls:'tag-warning', branch:'HomePro เอกมัย', lastLogin:'13 ก.พ. 69 08:45', status:'active', avatar:'สม' },
        { id:3, name:'พรทิพย์ สวยงาม', email:'porntip@siamplaswood.com', password:'Porntip@123', role:'seller', roleLabel:'PC/Seller', roleCls:'tag-info', branch:'HomePro เอกมัย', lastLogin:'13 ก.พ. 69 08:30', status:'active', avatar:'พร' },
        { id:4, name:'มานี รักเรียน', email:'manee@siamplaswood.com', password:'Manee@HR24', role:'hr', roleLabel:'HR', roleCls:'tag-primary', branch:'สำนักงานใหญ่', lastLogin:'12 ก.พ. 69 17:00', status:'active', avatar:'มา' },
        { id:5, name:'จรัญ ทำดี', email:'jaran@siamplaswood.com', password:'Jaran@2026', role:'employee', roleLabel:'พนักงาน', roleCls:'tag-gray', branch:'DoHome ขอนแก่น', lastLogin:'13 ก.พ. 69 08:00', status:'active', avatar:'จร' },
        { id:6, name:'สุดา ใจดี', email:'suda@siamplaswood.com', password:'Suda@Sell1', role:'seller', roleLabel:'PC/Seller', roleCls:'tag-info', branch:'DoHome ระยอง', lastLogin:'13 ก.พ. 69 07:55', status:'active', avatar:'สุ' },
        { id:7, name:'วิชัย มั่นคง', email:'wichai@siamplaswood.com', password:'Wichai@PC7', role:'seller', roleLabel:'PC/Seller', roleCls:'tag-info', branch:'MegaHome รังสิต', lastLogin:'12 ก.พ. 69 09:10', status:'active', avatar:'วิ' },
        { id:8, name:'นภา สดใส', email:'napa@siamplaswood.com', password:'Napa@New8!', role:'seller', roleLabel:'PC/Seller', roleCls:'tag-info', branch:'BnB พระราม2', lastLogin:'11 ก.พ. 69 08:20', status:'pending', avatar:'นภ' },
        { id:9, name:'ปรีชา ฉลาด', email:'preecha@siamplaswood.com', password:'Preecha@Sv', role:'supervisor', roleLabel:'หัวหน้างาน', roleCls:'tag-warning', branch:'DoHome บางบัวทอง', lastLogin:'10 ก.พ. 69 14:00', status:'active', avatar:'ปร' },
        { id:10, name:'อรุณ เรืองศรี', email:'arun@siamplaswood.com', password:'Arun@2025!', role:'employee', roleLabel:'พนักงาน', roleCls:'tag-gray', branch:'HomePro เชียงใหม่', lastLogin:'-', status:'suspended', avatar:'อร' },
    ];

    return users.map(u => `
        <tr class="user-row" data-role="${u.role}" data-name="${u.name}">
            <td>
                <div style="width:32px;height:32px;border-radius:50%;background:${u.status==='active'?'var(--primary)':u.status==='pending'?'var(--warning)':'var(--gray-400)'};color:white;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">
                    ${u.avatar}
                </div>
            </td>
            <td><strong>${u.name}</strong></td>
            <td style="font-size:12px;color:var(--gray-500)">${u.email}</td>
            <td>
                <span class="pw-mask" id="pw-${u.id}" style="font-size:12px;font-family:monospace;cursor:pointer;color:var(--gray-400)" onclick="togglePw(${u.id},'${u.password}')" title="คลิกเพื่อดูรหัสผ่าน">••••••••</span>
            </td>
            <td><span class="tag ${u.roleCls}">${u.roleLabel}</span></td>
            <td style="font-size:12px">${u.branch}</td>
            <td style="font-size:12px;color:var(--gray-500)">${u.lastLogin}</td>
            <td>
                ${u.status === 'active' ? '<span class="tag tag-success">ใช้งาน</span>' :
                  u.status === 'pending' ? '<span class="tag tag-warning">รอยืนยัน</span>' :
                  '<span class="tag tag-gray">ระงับ</span>'}
            </td>
            <td>
                <div style="display:flex;gap:4px">
                    <button class="btn btn-sm btn-outline" onclick="showEditUser(${u.id})" title="แก้ไข"><i class="fas fa-pen"></i></button>
                    <button class="btn btn-sm btn-outline" onclick="showUserPermissions(${u.id})" title="สิทธิ์"><i class="fas fa-key"></i></button>
                    <button class="btn btn-sm btn-outline" onclick="showToast('ส่งรหัสรีเซ็ตแล้ว')" title="รีเซ็ตรหัส"><i class="fas fa-lock-open"></i></button>
                </div>
            </td>
        </tr>`).join('');
}

function getActivityLog() {
    const logs = [
        { time: '09:15', icon: 'fa-right-to-bracket', color: 'var(--success)', msg: 'ธนกฤต ผู้จัดการ เข้าสู่ระบบ' },
        { time: '08:45', icon: 'fa-user-pen', color: 'var(--info)', msg: 'อัปเดตข้อมูล สมชาย ใจดี - เปลี่ยนสาขาเป็น HomePro เอกมัย' },
        { time: '08:30', icon: 'fa-right-to-bracket', color: 'var(--success)', msg: 'พรทิพย์ สวยงาม เข้าสู่ระบบ (Mobile)' },
        { time: 'เมื่อวาน 17:00', icon: 'fa-user-plus', color: 'var(--primary)', msg: 'เพิ่มผู้ใช้ใหม่: นภา สดใส (PC/Seller)' },
        { time: 'เมื่อวาน 14:30', icon: 'fa-key', color: 'var(--warning)', msg: 'รีเซ็ตรหัสผ่าน: วิชัย มั่นคง' },
        { time: '10 ก.พ. 16:00', icon: 'fa-ban', color: 'var(--danger)', msg: 'ระงับบัญชี: อรุณ เรืองศรี (ลาออก)' },
    ];
    return logs.map(l => `
        <div style="display:flex;gap:10px;align-items:start;padding:8px 0;border-bottom:1px solid var(--gray-100)">
            <div style="width:28px;height:28px;border-radius:50%;background:${l.color};display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <i class="fas ${l.icon}" style="font-size:11px;color:white"></i>
            </div>
            <div style="flex:1">
                <p>${l.msg}</p>
                <span style="font-size:11px;color:var(--gray-400)">${l.time}</span>
            </div>
        </div>`).join('');
}

function filterUsers() {
    const search = (document.getElementById('userSearch').value || '').toLowerCase();
    const role = document.getElementById('userRoleFilter').value;
    document.querySelectorAll('.user-row').forEach(row => {
        const name = (row.dataset.name || '').toLowerCase();
        const rowRole = row.dataset.role || '';
        const matchSearch = !search || name.includes(search);
        const matchRole = !role || rowRole === role;
        row.style.display = matchSearch && matchRole ? '' : 'none';
    });
}

function showAddUser() {
    showModal('เพิ่มผู้ใช้ใหม่', `
        <div class="form-row">
            <div class="form-group"><label class="form-label">ชื่อ *</label><input type="text" class="form-control" placeholder="ชื่อ"></div>
            <div class="form-group"><label class="form-label">นามสกุล *</label><input type="text" class="form-control" placeholder="นามสกุล"></div>
        </div>
        <div class="form-group"><label class="form-label">อีเมล *</label><input type="email" class="form-control" placeholder="email@siamplaswood.com"></div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">บทบาท *</label>
                <select class="form-control" id="newUserRole" onchange="toggleBranchField()">
                    <option value="seller">PC/Seller</option>
                    <option value="employee">พนักงาน</option>
                    <option value="supervisor">หัวหน้างาน</option>
                    <option value="hr">HR</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div class="form-group" id="branchField"><label class="form-label">สาขา</label>
                <select class="form-control">
                    <option>HomePro เอกมัย-รามอินทรา</option>
                    <option>HomePro เชียงใหม่</option>
                    <option>HomePro พัทยา</option>
                    <option>DoHome บางบัวทอง</option>
                    <option>DoHome ขอนแก่น</option>
                    <option>DoHome ระยอง</option>
                    <option>BnB พระราม2</option>
                    <option>MegaHome รังสิต</option>
                    <option>สำนักงานใหญ่</option>
                </select>
            </div>
        </div>
        <div class="form-group"><label class="form-label">เบอร์โทร</label><input type="tel" class="form-control" placeholder="08x-xxx-xxxx"></div>
        <div class="form-group">
            <label class="form-label">รหัสผ่านเริ่มต้น</label>
            <div style="display:flex;gap:8px">
                <input type="text" class="form-control" id="genPassword" value="" placeholder="กดสร้างรหัสอัตโนมัติ" readonly>
                <button class="btn btn-outline btn-sm" onclick="document.getElementById('genPassword').value='Sp'+Math.random().toString(36).substr(2,6)+'!'">
                    <i class="fas fa-dice"></i> สร้าง
                </button>
            </div>
        </div>
        <div style="padding:10px;background:var(--gray-50);border-radius:8px;font-size:12px;color:var(--gray-500)">
            <i class="fas fa-info-circle"></i> ผู้ใช้จะได้รับอีเมลเชิญให้ตั้งรหัสผ่านใหม่
        </div>
    `, '<button class="btn btn-outline" onclick="closeModal()">ยกเลิก</button><button class="btn btn-success" onclick="showToast(\'เพิ่มผู้ใช้สำเร็จ!\');closeModal()"><i class="fas fa-check"></i> เพิ่มผู้ใช้</button>');
}

function showEditUser(id) {
    showModal('แก้ไขผู้ใช้ #' + id, `
        <div class="form-row">
            <div class="form-group"><label class="form-label">ชื่อ</label><input type="text" class="form-control" value="สมชาย"></div>
            <div class="form-group"><label class="form-label">นามสกุล</label><input type="text" class="form-control" value="ใจดี"></div>
        </div>
        <div class="form-group"><label class="form-label">อีเมล</label><input type="email" class="form-control" value="somchai@siamplaswood.com"></div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">บทบาท</label>
                <select class="form-control"><option selected>หัวหน้างาน</option><option>Admin</option><option>PC/Seller</option><option>HR</option><option>พนักงาน</option></select></div>
            <div class="form-group"><label class="form-label">สาขา</label>
                <select class="form-control"><option selected>HomePro เอกมัย</option><option>DoHome บางบัวทอง</option><option>BnB พระราม2</option></select></div>
        </div>
        <div class="form-group"><label class="form-label">สถานะ</label>
            <select class="form-control"><option value="active" selected>ใช้งาน</option><option value="suspended">ระงับ</option></select></div>
    `, '<button class="btn btn-outline" onclick="closeModal()">ยกเลิก</button><button class="btn btn-primary" onclick="showToast(\'อัปเดตสำเร็จ!\');closeModal()"><i class="fas fa-check"></i> บันทึก</button>');
}

function showUserPermissions(id) {
    const permissions = [
        { group: 'แดชบอร์ด', perms: [
            { name: 'ดูแดชบอร์ดรวม', checked: true },
            { name: 'ดูรายงานทุกสาขา', checked: true },
            { name: 'ดูข้อมูลทางการเงิน', checked: false },
        ]},
        { group: 'การขาย', perms: [
            { name: 'ดูรายงานการขาย', checked: true },
            { name: 'นำเข้าข้อมูล Excel', checked: true },
            { name: 'แก้ไขข้อมูลการขาย', checked: false },
        ]},
        { group: 'โฟลงาน', perms: [
            { name: 'ดูโฟลงาน', checked: true },
            { name: 'สร้างโฟลงาน', checked: true },
            { name: 'มอบหมายงาน', checked: true },
            { name: 'ลบโฟลงาน', checked: false },
        ]},
        { group: 'ปัญหา', perms: [
            { name: 'แจ้งปัญหา', checked: true },
            { name: 'มอบหมายแก้ปัญหา', checked: true },
            { name: 'ปิดปัญหา', checked: true },
        ]},
        { group: 'บุคลากร', perms: [
            { name: 'ดูข้อมูลพนักงาน', checked: true },
            { name: 'อนุมัติใบลา', checked: true },
            { name: 'จัดการ OT', checked: false },
        ]},
        { group: 'ระบบ', perms: [
            { name: 'จัดการผู้ใช้', checked: false },
            { name: 'ตั้งค่าระบบ', checked: false },
            { name: 'ดู Audit Log', checked: true },
        ]},
    ];

    showModal('สิทธิ์การใช้งาน - ผู้ใช้ #' + id, `
        <div style="margin-bottom:12px;padding:10px;background:var(--gray-50);border-radius:8px">
            <strong>สมชาย ใจดี</strong> <span class="tag tag-warning">หัวหน้างาน</span>
        </div>
        <div style="max-height:400px;overflow-y:auto">
            ${permissions.map(g => `
                <div style="margin-bottom:12px">
                    <div style="font-size:12px;font-weight:700;color:var(--gray-500);margin-bottom:6px;text-transform:uppercase">${g.group}</div>
                    ${g.perms.map(p => `
                        <label style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:13px;cursor:pointer">
                            <input type="checkbox" ${p.checked ? 'checked' : ''}>
                            <span>${p.name}</span>
                        </label>`).join('')}
                </div>`).join('')}
        </div>
    `, '<button class="btn btn-outline" onclick="closeModal()">ยกเลิก</button><button class="btn btn-primary" onclick="showToast(\'บันทึกสิทธิ์สำเร็จ!\');closeModal()"><i class="fas fa-check"></i> บันทึก</button>');
}

function showRoleManager() {
    const roles = [
        { name: 'Admin', icon: 'fa-shield-halved', color: 'var(--danger)', users: 2, desc: 'เข้าถึงทุกฟังก์ชัน จัดการระบบ ผู้ใช้ การตั้งค่า' },
        { name: 'หัวหน้างาน', icon: 'fa-user-tie', color: 'var(--warning)', users: 5, desc: 'จัดการทีม สร้างโฟลงาน ดูรายงาน อนุมัติงาน' },
        { name: 'PC/Seller', icon: 'fa-store', color: 'var(--info)', users: 28, desc: 'ลงเวลา ดูรายงานขาย แจ้งปัญหา ทำงานที่ได้รับ' },
        { name: 'HR', icon: 'fa-people-group', color: 'var(--primary)', users: 3, desc: 'จัดการพนักงาน อนุมัติลา ดูเวลาทำงาน' },
        { name: 'พนักงาน', icon: 'fa-user', color: 'var(--gray-500)', users: 10, desc: 'ลงเวลา เขียนใบลา ดูงานที่ได้รับ' },
    ];

    showModal('จัดการบทบาทและสิทธิ์', `
        <div style="display:grid;gap:10px">
            ${roles.map(r => `
                <div style="padding:12px;background:var(--gray-50);border-radius:8px;border-left:4px solid ${r.color};display:flex;justify-content:space-between;align-items:center">
                    <div style="display:flex;gap:10px;align-items:center">
                        <div style="width:36px;height:36px;border-radius:50%;background:${r.color};display:flex;align-items:center;justify-content:center">
                            <i class="fas ${r.icon}" style="color:white;font-size:14px"></i>
                        </div>
                        <div>
                            <div style="font-weight:700">${r.name}</div>
                            <div style="font-size:11px;color:var(--gray-500)">${r.desc}</div>
                        </div>
                    </div>
                    <div style="text-align:right">
                        <span class="tag tag-gray">${r.users} คน</span>
                    </div>
                </div>`).join('')}
        </div>
        <div style="margin-top:12px;padding:10px;background:#eff6ff;border-radius:8px;font-size:12px;color:var(--info)">
            <i class="fas fa-info-circle"></i> การเปลี่ยนสิทธิ์จะมีผลทันทีกับผู้ใช้ทุกคนในบทบาทนั้น
        </div>
    `, '<button class="btn btn-outline" onclick="closeModal()">ปิด</button>');
}

function toggleBranchField() {
    const role = document.getElementById('newUserRole');
    const field = document.getElementById('branchField');
    if (role && field) {
        field.style.display = (role.value === 'admin') ? 'none' : '';
    }
}

function togglePw(id, pw) {
    const el = document.getElementById('pw-' + id);
    if (!el) return;
    if (el.dataset.show === '1') {
        el.textContent = '••••••••';
        el.style.color = 'var(--gray-400)';
        el.dataset.show = '0';
    } else {
        el.textContent = pw;
        el.style.color = 'var(--gray-700)';
        el.dataset.show = '1';
    }
}
