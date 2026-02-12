/* Dashboard Page */
function renderDashboard(role) {
    const c = document.getElementById('contentArea');
    if (role === 'admin') {
        c.innerHTML = getDashboardAdmin();
    } else if (role === 'supervisor') {
        c.innerHTML = getDashboardSupervisor();
    } else if (role === 'seller') {
        c.innerHTML = getDashboardSeller();
    } else if (role === 'hr') {
        c.innerHTML = getDashboardHR();
    } else {
        c.innerHTML = getDashboardEmployee();
    }
}

function getDashboardAdmin() {
    return `
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8)"><i class="fas fa-store"></i></div>
            <div><div class="stat-value">18</div><div class="stat-label">สาขาทั้งหมด</div><div class="stat-change up"><i class="fas fa-arrow-up"></i> +2 จากเดือนก่อน</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#22c55e,#16a34a)"><i class="fas fa-users"></i></div>
            <div><div class="stat-value">42</div><div class="stat-label">พนักงานวันนี้</div><div class="stat-change down"><i class="fas fa-arrow-down"></i> 3 มาสาย</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#f59e0b,#d97706)"><i class="fas fa-baht-sign"></i></div>
            <div><div class="stat-value">8.5M</div><div class="stat-label">ยอดขายเดือนนี้</div><div class="stat-change up"><i class="fas fa-arrow-up"></i> +12.5%</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#ef4444,#dc2626)"><i class="fas fa-exclamation-triangle"></i></div>
            <div><div class="stat-value">7</div><div class="stat-label">ปัญหารอแก้ไข</div><div class="stat-change down"><i class="fas fa-fire"></i> 2 เร่งด่วน</div></div>
        </div>
    </div>

    <div class="grid-2">
        <div class="card">
            <div class="card-header">
                <h3><i class="fas fa-chart-bar" style="color:var(--primary);margin-right:6px"></i> ยอดขายตามห้าง</h3>
                <select class="form-control" style="width:auto" onchange="showToast('เปลี่ยนช่วงเวลาแล้ว')">
                    <option>เดือนนี้</option><option>3 เดือน</option><option>6 เดือน</option><option>ปีนี้</option>
                </select>
            </div>
            <div class="card-body">
                <div class="table-wrap">
                    <table class="data-table">
                        <thead><tr><th>ห้าง</th><th>ยอดขาย</th><th>สัดส่วน</th><th>แนวโน้ม</th></tr></thead>
                        <tbody>
                            <tr><td><strong>HomePro</strong></td><td style="text-align:right">${fmtMoney(3250000)}</td>
                                <td><div class="progress" style="width:100px"><div class="progress-bar blue" style="width:38%"></div></div></td>
                                <td><span class="stat-change up">+15%</span></td></tr>
                            <tr><td><strong>DoHome</strong></td><td style="text-align:right">${fmtMoney(2800000)}</td>
                                <td><div class="progress" style="width:100px"><div class="progress-bar green" style="width:33%"></div></div></td>
                                <td><span class="stat-change up">+8%</span></td></tr>
                            <tr><td><strong>BnB Home (BTV)</strong></td><td style="text-align:right">${fmtMoney(1650000)}</td>
                                <td><div class="progress" style="width:100px"><div class="progress-bar amber" style="width:19%"></div></div></td>
                                <td><span class="stat-change down">-3%</span></td></tr>
                            <tr><td><strong>MegaHome</strong></td><td style="text-align:right">${fmtMoney(800000)}</td>
                                <td><div class="progress" style="width:100px"><div class="progress-bar red" style="width:10%"></div></div></td>
                                <td><span class="stat-change up">+22%</span></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3><i class="fas fa-box-open" style="color:var(--warning);margin-right:6px"></i> สินค้าที่ต้องจับตา</h3>
                <button class="btn btn-sm btn-outline" onclick="loadPage('sales')">ดูทั้งหมด</button>
            </div>
            <div class="card-body">
                <div style="margin-bottom:12px">
                    <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600">
                        <span><i class="fas fa-ban" style="color:var(--danger)"></i> สินค้าไม่เคลื่อนไหว</span>
                        <span style="color:var(--danger)">23 รายการ</span>
                    </div>
                    <div class="progress" style="margin-top:4px"><div class="progress-bar red" style="width:23%"></div></div>
                </div>
                <div style="margin-bottom:12px">
                    <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600">
                        <span><i class="fas fa-arrow-down" style="color:var(--warning)"></i> ต่ำกว่า Min Stock</span>
                        <span style="color:var(--warning)">15 รายการ</span>
                    </div>
                    <div class="progress" style="margin-top:4px"><div class="progress-bar amber" style="width:15%"></div></div>
                </div>
                <div style="margin-bottom:12px">
                    <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600">
                        <span><i class="fas fa-eye-slash" style="color:var(--info)"></i> ไม่มีตัวโชว์</span>
                        <span style="color:var(--info)">8 รายการ</span>
                    </div>
                    <div class="progress" style="margin-top:4px"><div class="progress-bar blue" style="width:8%"></div></div>
                </div>
                <div>
                    <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600">
                        <span><i class="fas fa-tags" style="color:var(--success)"></i> ราคาไม่ตรง</span>
                        <span style="color:var(--success)">4 รายการ</span>
                    </div>
                    <div class="progress" style="margin-top:4px"><div class="progress-bar green" style="width:4%"></div></div>
                </div>
            </div>
        </div>
    </div>

    <div class="grid-2">
        <div class="card">
            <div class="card-header">
                <h3><i class="fas fa-diagram-project" style="color:var(--info);margin-right:6px"></i> โฟลงานล่าสุด</h3>
                <button class="btn btn-sm btn-primary" onclick="loadPage('workflows')"><i class="fas fa-plus"></i> สร้างโฟล</button>
            </div>
            <div class="card-body" style="padding:12px">
                <div class="wf-card type-problem" style="margin-bottom:10px" onclick="loadPage('workflows')">
                    <div style="display:flex;justify-content:space-between;align-items:start">
                        <div class="wf-title">แก้ปัญหาสต๊อกไม่ตรง Mega Bangna</div>
                        <span class="tag tag-danger">เร่งด่วน</span>
                    </div>
                    <div class="wf-desc">ประตู UPVC BN-01 สต๊อกในระบบ 15 ตัว แต่นับได้ 8 ตัว</div>
                    <div class="progress" style="margin:8px 0"><div class="progress-bar red" style="width:30%"></div></div>
                    <div class="wf-meta">
                        <span><i class="fas fa-user"></i> สมชาย</span>
                        <span><i class="fas fa-clock"></i> 30%</span>
                        <span><i class="fas fa-calendar"></i> กำหนด 15 ก.พ.</span>
                    </div>
                </div>
                <div class="wf-card type-promo" onclick="loadPage('workflows')">
                    <div style="display:flex;justify-content:space-between;align-items:start">
                        <div class="wf-title">โปรโมชั่นประตูไม้สัก 30% - Central Ladprao</div>
                        <span class="tag tag-warning">ปานกลาง</span>
                    </div>
                    <div class="wf-desc">จัดโปรโมชั่นส่งเสริมการขายประตูไม้สักทอง ลด 30%</div>
                    <div class="progress" style="margin:8px 0"><div class="progress-bar amber" style="width:60%"></div></div>
                    <div class="wf-meta">
                        <span><i class="fas fa-user"></i> พรทิพย์</span>
                        <span><i class="fas fa-clock"></i> 60%</span>
                        <span><i class="fas fa-calendar"></i> กำหนด 20 ก.พ.</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3><i class="fas fa-triangle-exclamation" style="color:var(--danger);margin-right:6px"></i> ปัญหาล่าสุด</h3>
                <button class="btn btn-sm btn-outline" onclick="loadPage('problems')">ดูทั้งหมด</button>
            </div>
            <div class="card-body">
                <div class="table-wrap">
                    <table class="data-table">
                        <thead><tr><th>ปัญหา</th><th>สาขา</th><th>ระดับ</th><th>สถานะ</th></tr></thead>
                        <tbody>
                            <tr><td>ป้ายโปรหมดอายุยังแสดง</td><td>Mega Bangna</td>
                                <td><span class="tag tag-danger">เร่งด่วน</span></td>
                                <td><span class="tag tag-warning">รับทราบ</span></td></tr>
                            <tr><td>ประตูโชว์ไม่ได้จัดวาง</td><td>Central Ladprao</td>
                                <td><span class="tag tag-warning">สูง</span></td>
                                <td><span class="tag tag-info">กำลังแก้</span></td></tr>
                            <tr><td>สต๊อก HDF ไม่พอ</td><td>Central Khon Kaen</td>
                                <td><span class="tag tag-warning">สูง</span></td>
                                <td><span class="tag tag-info">กำลังแก้</span></td></tr>
                            <tr><td>ประตูโชว์มีรอยขีดข่วน</td><td>Central Chiang Mai</td>
                                <td><span class="tag tag-gray">ปานกลาง</span></td>
                                <td><span class="tag tag-success">เปิดใหม่</span></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
}

function getDashboardSupervisor() {
    return `
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8)"><i class="fas fa-store"></i></div>
            <div><div class="stat-value">5</div><div class="stat-label">สาขาในความดูแล</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#22c55e,#16a34a)"><i class="fas fa-users"></i></div>
            <div><div class="stat-value">12</div><div class="stat-label">สมาชิกทีม</div><div class="stat-change down"><i class="fas fa-arrow-down"></i> 1 มาสาย</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#f59e0b,#d97706)"><i class="fas fa-baht-sign"></i></div>
            <div><div class="stat-value">2.8M</div><div class="stat-label">ยอดขายทีมเดือนนี้</div><div class="stat-change up"><i class="fas fa-arrow-up"></i> +9.2%</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#ef4444,#dc2626)"><i class="fas fa-exclamation-triangle"></i></div>
            <div><div class="stat-value">3</div><div class="stat-label">ปัญหารอแก้ไข</div><div class="stat-change down"><i class="fas fa-fire"></i> 1 เร่งด่วน</div></div>
        </div>
    </div>

    <div class="grid-2">
        <div class="card">
            <div class="card-header">
                <h3><i class="fas fa-users" style="color:var(--primary);margin-right:6px"></i> สมาชิกทีมวันนี้</h3>
            </div>
            <div class="card-body">
                <table class="data-table">
                    <thead><tr><th>ชื่อ</th><th>สาขา</th><th>เวลาเข้า</th><th>สถานะ</th></tr></thead>
                    <tbody>
                        <tr><td><strong>พรทิพย์ สวยงาม</strong></td><td>HomePro เอกมัย</td><td>08:15</td><td><span class="tag tag-success">ทำงาน</span></td></tr>
                        <tr><td><strong>มานี รักเรียน</strong></td><td>BnB พระราม2</td><td>08:00</td><td><span class="tag tag-success">ทำงาน</span></td></tr>
                        <tr><td><strong>จรัญ ทำดี</strong></td><td>HomePro พัทยา</td><td>-</td><td><span class="tag tag-info">ลาป่วย</span></td></tr>
                        <tr><td><strong>สุดา ใจดี</strong></td><td>DoHome ระยอง</td><td>07:55</td><td><span class="tag tag-success">ทำงาน</span></td></tr>
                        <tr><td><strong>วิชัย มั่นคง</strong></td><td>MegaHome รังสิต</td><td>09:10</td><td><span class="tag tag-warning">สาย</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3><i class="fas fa-chart-bar" style="color:var(--success);margin-right:6px"></i> ยอดขายทีม (สาขา)</h3>
            </div>
            <div class="card-body">
                <table class="data-table">
                    <thead><tr><th>สาขา</th><th>ยอดขาย</th><th>แนวโน้ม</th></tr></thead>
                    <tbody>
                        <tr><td><strong>HomePro เอกมัย</strong></td><td style="text-align:right">${fmtMoney(850000)}</td><td><span class="stat-change up">+15%</span></td></tr>
                        <tr><td><strong>BnB พระราม2</strong></td><td style="text-align:right">${fmtMoney(620000)}</td><td><span class="stat-change up">+5%</span></td></tr>
                        <tr><td><strong>HomePro พัทยา</strong></td><td style="text-align:right">${fmtMoney(540000)}</td><td><span class="stat-change down">-2%</span></td></tr>
                        <tr><td><strong>DoHome ระยอง</strong></td><td style="text-align:right">${fmtMoney(480000)}</td><td><span class="stat-change up">+8%</span></td></tr>
                        <tr><td><strong>MegaHome รังสิต</strong></td><td style="text-align:right">${fmtMoney(310000)}</td><td><span class="stat-change up">+22%</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="grid-2">
        <div class="card">
            <div class="card-header">
                <h3><i class="fas fa-diagram-project" style="color:var(--info);margin-right:6px"></i> โฟลงานทีม</h3>
                <button class="btn btn-sm btn-primary" onclick="loadPage('workflows')"><i class="fas fa-plus"></i> สร้างโฟล</button>
            </div>
            <div class="card-body" style="padding:12px">
                <div class="wf-card type-problem" style="margin-bottom:10px" onclick="loadPage('workflows')">
                    <div style="display:flex;justify-content:space-between;align-items:start">
                        <div class="wf-title">แก้ปัญหาสต๊อกไม่ตรง Mega Bangna</div>
                        <span class="tag tag-danger">เร่งด่วน</span>
                    </div>
                    <div class="wf-desc">มอบหมาย: พรทิพย์ - ความคืบหน้า 30%</div>
                    <div class="progress" style="margin:8px 0"><div class="progress-bar red" style="width:30%"></div></div>
                </div>
                <div class="wf-card type-task" onclick="loadPage('workflows')">
                    <div style="display:flex;justify-content:space-between;align-items:start">
                        <div class="wf-title">ถ่ายรูปตัวโชว์ประตู ANYHOME</div>
                        <span class="tag tag-gray">ปานกลาง</span>
                    </div>
                    <div class="wf-desc">มอบหมาย: จรัญ - ยังไม่เริ่ม</div>
                    <div class="progress" style="margin:8px 0"><div class="progress-bar amber" style="width:0%"></div></div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3><i class="fas fa-calendar-check" style="color:var(--warning);margin-right:6px"></i> คำขอลาทีม</h3>
            </div>
            <div class="card-body">
                <table class="data-table">
                    <thead><tr><th>พนักงาน</th><th>ประเภท</th><th>วันที่</th><th>สถานะ</th><th></th></tr></thead>
                    <tbody>
                        <tr><td>จรัญ ทำดี</td><td><span class="tag tag-info">ลาป่วย</span></td><td>13-14 ก.พ.</td><td><span class="tag tag-success">อนุมัติแล้ว</span></td><td></td></tr>
                        <tr><td>วิชัย มั่นคง</td><td><span class="tag tag-gray">ลากิจ</span></td><td>20 ก.พ.</td><td><span class="tag tag-warning">รออนุมัติ</span></td>
                            <td><button class="btn btn-sm btn-success" onclick="showToast('อนุมัติแล้ว')">อนุมัติ</button></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

function getDashboardSeller() {
    return `
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#22c55e,#16a34a)"><i class="fas fa-baht-sign"></i></div>
            <div><div class="stat-value">${fmtMoney(285000)}</div><div class="stat-label">ยอดขายเดือนนี้</div><div class="stat-change up"><i class="fas fa-arrow-up"></i> +18%</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8)"><i class="fas fa-box"></i></div>
            <div><div class="stat-value">34</div><div class="stat-label">รายการที่ขาย</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#f59e0b,#d97706)"><i class="fas fa-list-check"></i></div>
            <div><div class="stat-value">2</div><div class="stat-label">งานที่ต้องทำ</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed)"><i class="fas fa-clock"></i></div>
            <div><div class="stat-value">08:32</div><div class="stat-label">เข้างานวันนี้</div><div class="stat-change up">ตรงเวลา</div></div>
        </div>
    </div>

    <div class="card" style="margin-bottom:20px">
        <div class="card-header"><h3><i class="fas fa-location-dot" style="color:var(--success);margin-right:6px"></i> ลงเวลาเข้างาน</h3></div>
        <div class="card-body" style="text-align:center">
            <p style="color:var(--success);font-size:18px;font-weight:700"><i class="fas fa-check-circle"></i> ลงเวลาเข้างานแล้ววันนี้</p>
            <p style="color:var(--gray-500);margin-top:4px">เวลา 08:32 น. - สาขา HomePro เอกมัย-รามอินทรา</p>
            <p style="margin-top:8px"><span class="tag tag-success"><i class="fas fa-map-pin"></i> อยู่ในรัศมีที่กำหนด (50 เมตร)</span></p>
        </div>
    </div>

    <div class="grid-2">
        <div class="card">
            <div class="card-header"><h3><i class="fas fa-tasks" style="color:var(--info);margin-right:6px"></i> งานที่ต้องทำวันนี้</h3></div>
            <div class="card-body">
                <div class="wf-card type-task" style="margin-bottom:10px" onclick="loadPage('workflows')">
                    <div class="wf-title">ถ่ายรูปตัวโชว์ประตู UPVC รุ่นใหม่</div>
                    <div class="wf-desc">หัวหน้าสมชายมอบหมาย - กำหนดวันนี้</div>
                    <div class="progress" style="margin:6px 0"><div class="progress-bar blue" style="width:0%"></div></div>
                    <div class="wf-meta"><span><i class="fas fa-clock"></i> ยังไม่เริ่ม</span></div>
                </div>
                <div class="wf-card type-problem" onclick="loadPage('workflows')">
                    <div class="wf-title">ตรวจสอบราคาป้ายให้ตรงกับระบบ</div>
                    <div class="wf-desc">แก้ไขราคาที่ไม่ตรง 3 รายการ</div>
                    <div class="progress" style="margin:6px 0"><div class="progress-bar amber" style="width:50%"></div></div>
                    <div class="wf-meta"><span><i class="fas fa-clock"></i> 50%</span><span><i class="fas fa-calendar"></i> กำหนด 14 ก.พ.</span></div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header"><h3><i class="fas fa-chart-line" style="color:var(--success);margin-right:6px"></i> ยอดขายล่าสุด</h3></div>
            <div class="card-body">
                <table class="data-table">
                    <thead><tr><th>วันที่</th><th>สินค้า</th><th>จำนวน</th><th>ยอด</th></tr></thead>
                    <tbody>
                        <tr><td>13 ก.พ.</td><td>ประตู UPVC BN-01 70x200</td><td>2</td><td>${fmtMoney(3580)}</td></tr>
                        <tr><td>13 ก.พ.</td><td>วงกบ WPC 80x200</td><td>3</td><td>${fmtMoney(4470)}</td></tr>
                        <tr><td>12 ก.พ.</td><td>ประตูห้องน้ำ PVC BW</td><td>5</td><td>${fmtMoney(5950)}</td></tr>
                        <tr><td>12 ก.พ.</td><td>ประตูภายนอก UPVC L-35</td><td>1</td><td>${fmtMoney(3890)}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

function getDashboardHR() {
    return `
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8)"><i class="fas fa-users"></i></div>
            <div><div class="stat-value">48</div><div class="stat-label">พนักงานทั้งหมด</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#22c55e,#16a34a)"><i class="fas fa-user-check"></i></div>
            <div><div class="stat-value">42</div><div class="stat-label">มาทำงานวันนี้</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#f59e0b,#d97706)"><i class="fas fa-user-clock"></i></div>
            <div><div class="stat-value">3</div><div class="stat-label">มาสาย</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#ef4444,#dc2626)"><i class="fas fa-bed"></i></div>
            <div><div class="stat-value">3</div><div class="stat-label">ลางาน</div></div>
        </div>
    </div>
    <div class="grid-2">
        <div class="card">
            <div class="card-header"><h3><i class="fas fa-calendar-xmark" style="color:var(--warning);margin-right:6px"></i> คำขอลาล่าสุด</h3></div>
            <div class="card-body">
                <table class="data-table">
                    <thead><tr><th>พนักงาน</th><th>ประเภท</th><th>วันที่</th><th>สถานะ</th><th></th></tr></thead>
                    <tbody>
                        <tr><td>สมชาย ใจดี</td><td><span class="tag tag-info">ลาป่วย</span></td><td>13-14 ก.พ.</td><td><span class="tag tag-warning">รออนุมัติ</span></td>
                            <td><button class="btn btn-sm btn-success" onclick="showToast('อนุมัติแล้ว')">อนุมัติ</button></td></tr>
                        <tr><td>มานี รักเรียน</td><td><span class="tag tag-purple">ลาพักร้อน</span></td><td>17-19 ก.พ.</td><td><span class="tag tag-warning">รออนุมัติ</span></td>
                            <td><button class="btn btn-sm btn-success" onclick="showToast('อนุมัติแล้ว')">อนุมัติ</button></td></tr>
                        <tr><td>จรัญ ทำดี</td><td><span class="tag tag-gray">ลากิจ</span></td><td>20 ก.พ.</td><td><span class="tag tag-success">อนุมัติแล้ว</span></td><td></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><h3><i class="fas fa-clock" style="color:var(--danger);margin-right:6px"></i> OT เดือนนี้</h3></div>
            <div class="card-body">
                <table class="data-table">
                    <thead><tr><th>พนักงาน</th><th>สาขา</th><th>OT (ชม.)</th><th>ค่า OT</th></tr></thead>
                    <tbody>
                        <tr><td>พรทิพย์ สวยงาม</td><td>HomePro เอกมัย</td><td>18</td><td>${fmtMoney(2700)}</td></tr>
                        <tr><td>สมชาย ใจดี</td><td>DoHome บางบัวทอง</td><td>12</td><td>${fmtMoney(1800)}</td></tr>
                        <tr><td>จรัญ ทำดี</td><td>BnB พระราม2</td><td>8</td><td>${fmtMoney(1200)}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

function getDashboardEmployee() {
    return `
    <div class="stats-grid" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#22c55e,#16a34a)"><i class="fas fa-clock"></i></div>
            <div><div class="stat-value">08:32</div><div class="stat-label">เข้างานวันนี้</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8)"><i class="fas fa-list-check"></i></div>
            <div><div class="stat-value">1</div><div class="stat-label">งานค้าง</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed)"><i class="fas fa-calendar-check"></i></div>
            <div><div class="stat-value">22</div><div class="stat-label">วันทำงานเดือนนี้</div></div>
        </div>
    </div>

    <div class="card" style="margin-bottom:20px">
        <div class="card-header"><h3><i class="fas fa-map-marker-alt" style="color:var(--success);margin-right:6px"></i> ลงเวลา</h3></div>
        <div class="card-body" style="text-align:center">
            <p style="font-size:16px;font-weight:600;color:var(--success)"><i class="fas fa-check-circle"></i> ลงเวลาเรียบร้อยแล้ว</p>
            <p style="color:var(--gray-500)">เวลาเข้า: 08:32 | สาขา: DoHome บางบัวทอง</p>
            <button class="btn btn-accent btn-lg" style="margin-top:12px" onclick="showToast('ลงเวลาออกงานเรียบร้อย!')"><i class="fas fa-right-from-bracket"></i> ลงเวลาออกงาน</button>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3><i class="fas fa-tasks" style="color:var(--info);margin-right:6px"></i> งานที่ได้รับมอบหมาย</h3></div>
        <div class="card-body">
            <div class="wf-card type-task" onclick="loadPage('workflows')">
                <div class="wf-title">ตรวจสอบสต๊อกประตูห้องน้ำ</div>
                <div class="wf-desc">นับสต๊อกจริงและรายงานผล</div>
                <div class="progress" style="margin:6px 0"><div class="progress-bar blue" style="width:20%"></div></div>
                <div class="wf-meta"><span><i class="fas fa-user"></i> มอบหมายโดย: สมชาย</span><span><i class="fas fa-calendar"></i> กำหนด 14 ก.พ.</span></div>
            </div>
        </div>
    </div>`;
}
