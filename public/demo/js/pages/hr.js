/* HR Module */
function renderHR(role) {
    const c = document.getElementById('contentArea');
    if (role === 'seller' || role === 'employee') {
        c.innerHTML = getHREmployee();
    } else {
        c.innerHTML = getHRAdmin();
    }
}

function getHRAdmin() {
    return `
    <div style="display:flex;gap:10px;margin-bottom:16px">
        <button class="btn btn-primary" onclick="showAddEmployee()"><i class="fas fa-user-plus"></i> เพิ่มพนักงาน</button>
        <button class="btn btn-outline" onclick="showToast('Export Excel')"><i class="fas fa-file-excel"></i> Export</button>
    </div>

    <div class="stats-grid">
        <div class="stat-card"><div class="stat-icon" style="background:var(--primary)"><i class="fas fa-users"></i></div><div><div class="stat-value">48</div><div class="stat-label">พนักงานทั้งหมด</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--success)"><i class="fas fa-user-check"></i></div><div><div class="stat-value">45</div><div class="stat-label">ปฏิบัติงาน</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--warning)"><i class="fas fa-calendar-xmark"></i></div><div><div class="stat-value">5</div><div class="stat-label">คำขอลารออนุมัติ</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--info)"><i class="fas fa-clock"></i></div><div><div class="stat-value">156</div><div class="stat-label">OT รวมเดือนนี้ (ชม.)</div></div></div>
    </div>

    <div class="grid-2">
        <div class="card">
            <div class="card-header"><h3><i class="fas fa-calendar-check" style="color:var(--warning);margin-right:6px"></i> คำขอลารออนุมัติ</h3></div>
            <div class="card-body">
                <table class="data-table">
                    <thead><tr><th>พนักงาน</th><th>ประเภท</th><th>วันที่</th><th>จำนวน</th><th></th></tr></thead>
                    <tbody>
                        <tr><td>สมชาย ใจดี</td><td><span class="tag tag-info">ลาป่วย</span></td><td>13-14 ก.พ.</td><td>2 วัน</td>
                            <td><button class="btn btn-sm btn-success" onclick="showToast('อนุมัติแล้ว')"><i class="fas fa-check"></i></button>
                            <button class="btn btn-sm btn-danger" onclick="showToast('ปฏิเสธ')"><i class="fas fa-times"></i></button></td></tr>
                        <tr><td>มานี รักเรียน</td><td><span class="tag tag-purple">พักร้อน</span></td><td>17-19 ก.พ.</td><td>3 วัน</td>
                            <td><button class="btn btn-sm btn-success" onclick="showToast('อนุมัติแล้ว')"><i class="fas fa-check"></i></button>
                            <button class="btn btn-sm btn-danger" onclick="showToast('ปฏิเสธ')"><i class="fas fa-times"></i></button></td></tr>
                        <tr><td>วิชัย มั่นคง</td><td><span class="tag tag-gray">ลากิจ</span></td><td>20 ก.พ.</td><td>1 วัน</td>
                            <td><button class="btn btn-sm btn-success" onclick="showToast('อนุมัติแล้ว')"><i class="fas fa-check"></i></button>
                            <button class="btn btn-sm btn-danger" onclick="showToast('ปฏิเสธ')"><i class="fas fa-times"></i></button></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><h3><i class="fas fa-chart-pie" style="color:var(--info);margin-right:6px"></i> สรุปการลาเดือนนี้</h3></div>
            <div class="card-body">
                <div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:13px"><span>ลาป่วย</span><strong>8 วัน</strong></div><div class="progress" style="margin-top:4px"><div class="progress-bar red" style="width:40%"></div></div></div>
                <div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:13px"><span>ลาพักร้อน</span><strong>12 วัน</strong></div><div class="progress" style="margin-top:4px"><div class="progress-bar blue" style="width:60%"></div></div></div>
                <div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:13px"><span>ลากิจ</span><strong>5 วัน</strong></div><div class="progress" style="margin-top:4px"><div class="progress-bar amber" style="width:25%"></div></div></div>
                <div><div style="display:flex;justify-content:space-between;font-size:13px"><span>ขาดงาน</span><strong>2 วัน</strong></div><div class="progress" style="margin-top:4px"><div class="progress-bar red" style="width:10%"></div></div></div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3><i class="fas fa-users" style="color:var(--primary);margin-right:6px"></i> รายชื่อพนักงาน</h3>
            <input type="text" class="form-control" style="width:200px" placeholder="ค้นหาชื่อ..."></div>
        <div class="card-body">
            <table class="data-table">
                <thead><tr><th>รหัส</th><th>ชื่อ</th><th>ตำแหน่ง</th><th>สาขา</th><th>ห้าง</th><th>สถานะ</th><th>ลาคงเหลือ</th><th></th></tr></thead>
                <tbody>
                    <tr><td>EMP001</td><td><strong>พรทิพย์ สวยงาม</strong></td><td>PC</td><td>เอกมัย-รามอินทรา</td><td>HomePro</td><td><span class="tag tag-success">ปฏิบัติงาน</span></td><td>8 วัน</td><td><button class="btn btn-sm btn-outline" onclick="showEmployeeProfile()"><i class="fas fa-eye"></i></button></td></tr>
                    <tr><td>EMP002</td><td><strong>สมชาย ใจดี</strong></td><td>Supervisor</td><td>บางบัวทอง</td><td>DoHome</td><td><span class="tag tag-success">ปฏิบัติงาน</span></td><td>5 วัน</td><td><button class="btn btn-sm btn-outline" onclick="showEmployeeProfile()"><i class="fas fa-eye"></i></button></td></tr>
                    <tr><td>EMP003</td><td><strong>มานี รักเรียน</strong></td><td>PC</td><td>พระราม2</td><td>BnB</td><td><span class="tag tag-info">ลา</span></td><td>3 วัน</td><td><button class="btn btn-sm btn-outline" onclick="showEmployeeProfile()"><i class="fas fa-eye"></i></button></td></tr>
                    <tr><td>EMP004</td><td><strong>จรัญ ทำดี</strong></td><td>PC</td><td>พัทยา</td><td>HomePro</td><td><span class="tag tag-success">ปฏิบัติงาน</span></td><td>10 วัน</td><td><button class="btn btn-sm btn-outline" onclick="showEmployeeProfile()"><i class="fas fa-eye"></i></button></td></tr>
                </tbody>
            </table>
        </div>
    </div>`;
}

function getHREmployee() {
    return `
    <div class="card" style="margin-bottom:20px">
        <div class="card-header"><h3><i class="fas fa-user-circle" style="color:var(--primary);margin-right:6px"></i> โปรไฟล์ของฉัน</h3>
            <button class="btn btn-sm btn-outline" onclick="showToast('แก้ไขโปรไฟล์')"><i class="fas fa-edit"></i> แก้ไข</button></div>
        <div class="card-body">
            <div style="display:flex;gap:20px;align-items:start">
                <div style="width:80px;height:80px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;flex-shrink:0">พร</div>
                <div style="flex:1">
                    <h3 style="margin-bottom:4px">พรทิพย์ สวยงาม</h3>
                    <p style="color:var(--gray-500)">PC - HomePro เอกมัย-รามอินทรา</p>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;font-size:13px">
                        <div><i class="fas fa-id-card" style="width:16px;color:var(--gray-400)"></i> รหัส: EMP001</div>
                        <div><i class="fas fa-phone" style="width:16px;color:var(--gray-400)"></i> 081-xxx-xxxx</div>
                        <div><i class="fas fa-envelope" style="width:16px;color:var(--gray-400)"></i> porntip@company.com</div>
                        <div><i class="fas fa-calendar" style="width:16px;color:var(--gray-400)"></i> เริ่มงาน: 1 มี.ค. 2568</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div style="display:flex;gap:10px;margin-bottom:16px">
        <button class="btn btn-primary" onclick="showLeaveRequest()"><i class="fas fa-calendar-plus"></i> เขียนใบลา</button>
    </div>

    <div class="grid-2">
        <div class="card">
            <div class="card-header"><h3><i class="fas fa-calendar-check" style="color:var(--info);margin-right:6px"></i> วันลาคงเหลือ</h3></div>
            <div class="card-body">
                <div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:13px"><span>ลาป่วย</span><strong>28/30 วัน</strong></div><div class="progress" style="margin-top:4px"><div class="progress-bar green" style="width:93%"></div></div></div>
                <div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:13px"><span>ลาพักร้อน</span><strong>8/10 วัน</strong></div><div class="progress" style="margin-top:4px"><div class="progress-bar blue" style="width:80%"></div></div></div>
                <div><div style="display:flex;justify-content:space-between;font-size:13px"><span>ลากิจ</span><strong>5/5 วัน</strong></div><div class="progress" style="margin-top:4px"><div class="progress-bar amber" style="width:100%"></div></div></div>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><h3><i class="fas fa-history" style="color:var(--gray-500);margin-right:6px"></i> ประวัติการลา</h3></div>
            <div class="card-body">
                <table class="data-table">
                    <thead><tr><th>วันที่</th><th>ประเภท</th><th>สถานะ</th></tr></thead>
                    <tbody>
                        <tr><td>9 ก.พ. 2569</td><td><span class="tag tag-info">ลาป่วย</span></td><td><span class="tag tag-success">อนุมัติ</span></td></tr>
                        <tr><td>25-26 ม.ค.</td><td><span class="tag tag-purple">พักร้อน</span></td><td><span class="tag tag-success">อนุมัติ</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

function showLeaveRequest() {
    showModal('เขียนใบลา', `
        <div class="form-group"><label class="form-label">ประเภทการลา *</label>
            <select class="form-control"><option>ลาป่วย</option><option>ลาพักร้อน</option><option>ลากิจ</option></select></div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">ตั้งแต่วันที่</label><input type="date" class="form-control"></div>
            <div class="form-group"><label class="form-label">ถึงวันที่</label><input type="date" class="form-control"></div>
        </div>
        <div class="form-group"><label class="form-label">เหตุผล</label><textarea class="form-control" rows="3" placeholder="ระบุเหตุผลการลา..."></textarea></div>
        <div class="form-group"><label class="form-label">แนบเอกสาร (ถ้ามี)</label><input type="file" class="form-control"></div>
    `, '<button class="btn btn-outline" onclick="closeModal()">ยกเลิก</button><button class="btn btn-primary" onclick="showToast(\'ส่งใบลาเรียบร้อย!\');closeModal()"><i class="fas fa-check"></i> ส่งใบลา</button>');
}

function showAddEmployee() {
    showModal('เพิ่มพนักงานใหม่', `
        <div class="form-row"><div class="form-group"><label class="form-label">ชื่อ *</label><input type="text" class="form-control"></div><div class="form-group"><label class="form-label">นามสกุล *</label><input type="text" class="form-control"></div></div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">ตำแหน่ง</label><select class="form-control"><option>PC</option><option>Supervisor</option><option>Manager</option></select></div>
            <div class="form-group"><label class="form-label">สาขา</label><select class="form-control"><option>HomePro เอกมัย</option><option>DoHome บางบัวทอง</option></select></div>
        </div>
        <div class="form-row"><div class="form-group"><label class="form-label">โทรศัพท์</label><input type="tel" class="form-control"></div><div class="form-group"><label class="form-label">Email</label><input type="email" class="form-control"></div></div>
        <div class="form-group"><label class="form-label">วันเริ่มงาน</label><input type="date" class="form-control"></div>
    `, '<button class="btn btn-outline" onclick="closeModal()">ยกเลิก</button><button class="btn btn-primary" onclick="showToast(\'เพิ่มพนักงานเรียบร้อย!\');closeModal()"><i class="fas fa-check"></i> บันทึก</button>');
}

function showEmployeeProfile() {
    showModal('โปรไฟล์พนักงาน', `
        <div style="display:flex;gap:16px;align-items:start;margin-bottom:16px">
            <div style="width:60px;height:60px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700">พร</div>
            <div><h3>พรทิพย์ สวยงาม</h3><p style="color:var(--gray-500)">PC - HomePro เอกมัย-รามอินทรา</p></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px;margin-bottom:16px">
            <div><strong>รหัส:</strong> EMP001</div><div><strong>โทร:</strong> 081-xxx-xxxx</div>
            <div><strong>Email:</strong> porntip@co.th</div><div><strong>เริ่มงาน:</strong> 1 มี.ค. 68</div>
            <div><strong>ลาป่วยคงเหลือ:</strong> 28 วัน</div><div><strong>พักร้อนคงเหลือ:</strong> 8 วัน</div>
        </div>
        <h4 style="font-size:14px;margin-bottom:8px">ผลงานเดือนนี้</h4>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center">
            <div style="padding:12px;background:var(--gray-50);border-radius:8px"><div style="font-size:18px;font-weight:700;color:var(--success)">${fmtMoney(285000)}</div><div style="font-size:11px;color:var(--gray-500)">ยอดขาย</div></div>
            <div style="padding:12px;background:var(--gray-50);border-radius:8px"><div style="font-size:18px;font-weight:700;color:var(--primary)">22</div><div style="font-size:11px;color:var(--gray-500)">วันทำงาน</div></div>
            <div style="padding:12px;background:var(--gray-50);border-radius:8px"><div style="font-size:18px;font-weight:700;color:var(--accent)">18</div><div style="font-size:11px;color:var(--gray-500)">OT (ชม.)</div></div>
        </div>
    `, '<button class="btn btn-outline" onclick="closeModal()">ปิด</button>');
}
