/* Sales Report Page */
function renderSales(role) {
    const c = document.getElementById('contentArea');
    if (role === 'admin') {
        c.innerHTML = getSalesAdmin();
    } else if (role === 'supervisor') {
        c.innerHTML = getSalesSupervisor();
    } else if (role === 'seller') {
        c.innerHTML = getSalesSeller();
    } else {
        c.innerHTML = getSalesLimited();
    }
}

function getSalesLimited() {
    return `
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#22c55e,#16a34a)"><i class="fas fa-baht-sign"></i></div>
            <div><div class="stat-value">${fmtMoney(8500000)}</div><div class="stat-label">ยอดขายรวมบริษัท</div><div class="stat-change up"><i class="fas fa-arrow-up"></i> +12.5%</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8)"><i class="fas fa-boxes-stacked"></i></div>
            <div><div class="stat-value">1,245</div><div class="stat-label">จำนวนชิ้นที่ขาย</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed)"><i class="fas fa-store"></i></div>
            <div><div class="stat-value">18</div><div class="stat-label">สาขาทั้งหมด</div></div>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3><i class="fas fa-chart-bar" style="color:var(--primary);margin-right:6px"></i> สรุปผลงานตามห้าง</h3></div>
        <div class="card-body">
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
    <div class="card">
        <div class="card-header"><h3><i class="fas fa-trophy" style="color:var(--accent);margin-right:6px"></i> Top 5 สินค้าขายดี</h3></div>
        <div class="card-body">
            <table class="data-table">
                <thead><tr><th>#</th><th>สินค้า</th><th>แบรนด์</th><th>จำนวน</th></tr></thead>
                <tbody>
                    <tr><td><span style="color:var(--accent);font-weight:700">1</span></td><td>ประตูห้องน้ำPVC BW-G1A 70x200 GYW</td><td><span class="tag tag-info">ANYHOME</span></td><td>120</td></tr>
                    <tr><td><span style="color:var(--accent);font-weight:700">2</span></td><td>ประตูภายในUPVC BN-01 70x200 WH</td><td><span class="tag tag-primary">AZLE</span></td><td>98</td></tr>
                    <tr><td><span style="color:var(--accent);font-weight:700">3</span></td><td>วงกบUPVC 70x200 ขาว</td><td><span class="tag tag-success">EXTERA</span></td><td>85</td></tr>
                    <tr><td><span style="color:var(--accent);font-weight:700">4</span></td><td>ประตูPVC เกล็ด G1A 70x200</td><td><span class="tag tag-purple">POLY TIMBER</span></td><td>72</td></tr>
                    <tr><td><span style="color:var(--accent);font-weight:700">5</span></td><td>ประตูภายนอก UPVC L-35 80x200</td><td><span class="tag tag-primary">AZLE</span></td><td>45</td></tr>
                </tbody>
            </table>
        </div>
    </div>
    <p style="text-align:center;color:var(--gray-400);font-size:12px;margin-top:12px"><i class="fas fa-lock"></i> ข้อมูลรายละเอียดสงวนสิทธิ์สำหรับ Admin และ Supervisor</p>`;
}

function getSalesSeller() {
    return `
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#22c55e,#16a34a)"><i class="fas fa-baht-sign"></i></div>
            <div><div class="stat-value">${fmtMoney(285000)}</div><div class="stat-label">ยอดขายของฉัน (เดือนนี้)</div><div class="stat-change up"><i class="fas fa-arrow-up"></i> +18%</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8)"><i class="fas fa-boxes-stacked"></i></div>
            <div><div class="stat-value">34</div><div class="stat-label">จำนวนชิ้นที่ขาย</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#f59e0b,#d97706)"><i class="fas fa-receipt"></i></div>
            <div><div class="stat-value">18</div><div class="stat-label">จำนวนบิล</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed)"><i class="fas fa-bullseye"></i></div>
            <div><div class="stat-value">71%</div><div class="stat-label">เป้าหมาย (${fmtMoney(400000)})</div></div>
        </div>
    </div>

    <div style="margin-bottom:20px;padding:16px;background:white;border-radius:var(--radius);box-shadow:var(--shadow)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span style="font-weight:700">ความคืบหน้าเป้าหมาย</span>
            <span style="font-weight:700;color:var(--primary)">${fmtMoney(285000)} / ${fmtMoney(400000)}</span>
        </div>
        <div class="progress" style="height:12px"><div class="progress-bar blue" style="width:71%"></div></div>
        <p style="font-size:12px;color:var(--gray-500);margin-top:4px">เหลืออีก ${fmtMoney(115000)} เพื่อถึงเป้าหมาย</p>
    </div>

    <div class="card">
        <div class="card-header">
            <h3><i class="fas fa-list" style="color:var(--primary);margin-right:6px"></i> รายการขายของฉัน</h3>
            <select class="form-control" style="width:auto">
                <option>เดือนนี้</option><option>สัปดาห์นี้</option><option>วันนี้</option>
            </select>
        </div>
        <div class="card-body">
            <table class="data-table">
                <thead><tr><th>วันที่</th><th>สินค้า</th><th>จำนวน</th><th>ราคา/หน่วย</th><th>รวม</th><th>การชำระ</th></tr></thead>
                <tbody>
                    <tr><td>13 ก.พ.</td><td>ประตู UPVC BN-01 70x200</td><td>2</td><td>1,790</td><td>${fmtMoney(3580)}</td><td><span class="tag tag-success">เงินสด</span></td></tr>
                    <tr><td>13 ก.พ.</td><td>วงกบ WPC 80x200</td><td>3</td><td>1,490</td><td>${fmtMoney(4470)}</td><td><span class="tag tag-info">บัตรเครดิต</span></td></tr>
                    <tr><td>12 ก.พ.</td><td>ประตูห้องน้ำ PVC BW</td><td>5</td><td>1,190</td><td>${fmtMoney(5950)}</td><td><span class="tag tag-success">เงินสด</span></td></tr>
                    <tr><td>12 ก.พ.</td><td>ประตูภายนอก UPVC L-35</td><td>1</td><td>3,890</td><td>${fmtMoney(3890)}</td><td><span class="tag tag-primary">โอน</span></td></tr>
                    <tr><td>11 ก.พ.</td><td>ประตูPVC G1A 70x200</td><td>4</td><td>1,690</td><td>${fmtMoney(6760)}</td><td><span class="tag tag-success">เงินสด</span></td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3><i class="fas fa-trophy" style="color:var(--accent);margin-right:6px"></i> Top 5 สินค้าที่ฉันขายได้</h3></div>
        <div class="card-body">
            <table class="data-table">
                <thead><tr><th>#</th><th>สินค้า</th><th>จำนวน</th><th>รวม</th></tr></thead>
                <tbody>
                    <tr><td>1</td><td>ประตูห้องน้ำ PVC BW-G1A</td><td>12</td><td>${fmtMoney(14280)}</td></tr>
                    <tr><td>2</td><td>ประตู UPVC BN-01 70x200</td><td>8</td><td>${fmtMoney(14320)}</td></tr>
                    <tr><td>3</td><td>วงกบ WPC 80x200</td><td>6</td><td>${fmtMoney(8940)}</td></tr>
                    <tr><td>4</td><td>ประตูPVC G1A 70x200</td><td>5</td><td>${fmtMoney(8450)}</td></tr>
                    <tr><td>5</td><td>ประตูภายนอก UPVC L-35</td><td>3</td><td>${fmtMoney(11670)}</td></tr>
                </tbody>
            </table>
        </div>
    </div>`;
}

function getSalesSupervisor() {
    return `
    <div class="filter-bar">
        <div class="form-group"><label class="form-label">ช่วงวันที่</label>
            <div style="display:flex;gap:6px"><input type="date" class="form-control" value="2026-02-01"><input type="date" class="form-control" value="2026-02-13"></div>
        </div>
        <div class="form-group"><label class="form-label">สาขา</label>
            <select class="form-control"><option>สาขาในความดูแล</option><option>HomePro เอกมัย</option><option>BnB พระราม2</option><option>HomePro พัทยา</option><option>DoHome ระยอง</option><option>MegaHome รังสิต</option></select>
        </div>
        <div class="form-group" style="align-self:end"><button class="btn btn-primary" onclick="showToast('กรองข้อมูลแล้ว')"><i class="fas fa-search"></i> ค้นหา</button></div>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#22c55e,#16a34a)"><i class="fas fa-baht-sign"></i></div>
            <div><div class="stat-value">${fmtMoney(2800000)}</div><div class="stat-label">ยอดขายทีม</div><div class="stat-change up"><i class="fas fa-arrow-up"></i> +9.2%</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8)"><i class="fas fa-boxes-stacked"></i></div>
            <div><div class="stat-value">410</div><div class="stat-label">จำนวนชิ้นที่ขาย</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#f59e0b,#d97706)"><i class="fas fa-store"></i></div>
            <div><div class="stat-value">5</div><div class="stat-label">สาขาในดูแล</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed)"><i class="fas fa-bullseye"></i></div>
            <div><div class="stat-value">82%</div><div class="stat-label">ถึงเป้าหมาย</div></div>
        </div>
    </div>

    <div class="grid-2">
        <div class="card">
            <div class="card-header"><h3><i class="fas fa-chart-bar" style="color:var(--primary);margin-right:6px"></i> ยอดขายตามสาขา</h3></div>
            <div class="card-body">
                <table class="data-table">
                    <thead><tr><th>สาขา</th><th>ยอดขาย</th><th>เป้า</th><th>%</th><th>แนวโน้ม</th></tr></thead>
                    <tbody>
                        <tr><td><strong>HomePro เอกมัย</strong></td><td>${fmtMoney(850000)}</td><td>${fmtMoney(1000000)}</td><td>85%</td><td><span class="stat-change up">+15%</span></td></tr>
                        <tr><td><strong>BnB พระราม2</strong></td><td>${fmtMoney(620000)}</td><td>${fmtMoney(700000)}</td><td>89%</td><td><span class="stat-change up">+5%</span></td></tr>
                        <tr><td><strong>HomePro พัทยา</strong></td><td>${fmtMoney(540000)}</td><td>${fmtMoney(600000)}</td><td>90%</td><td><span class="stat-change down">-2%</span></td></tr>
                        <tr><td><strong>DoHome ระยอง</strong></td><td>${fmtMoney(480000)}</td><td>${fmtMoney(600000)}</td><td>80%</td><td><span class="stat-change up">+8%</span></td></tr>
                        <tr><td><strong>MegaHome รังสิต</strong></td><td>${fmtMoney(310000)}</td><td>${fmtMoney(500000)}</td><td>62%</td><td><span class="stat-change up">+22%</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="card">
            <div class="card-header"><h3><i class="fas fa-users" style="color:var(--success);margin-right:6px"></i> ยอดขายตาม PC</h3></div>
            <div class="card-body">
                <table class="data-table">
                    <thead><tr><th>PC</th><th>สาขา</th><th>ยอดขาย</th><th>เป้า %</th></tr></thead>
                    <tbody>
                        <tr><td><strong>พรทิพย์</strong></td><td>HomePro เอกมัย</td><td>${fmtMoney(285000)}</td><td><span class="tag tag-success">71%</span></td></tr>
                        <tr><td><strong>มานี</strong></td><td>BnB พระราม2</td><td>${fmtMoney(260000)}</td><td><span class="tag tag-success">65%</span></td></tr>
                        <tr><td><strong>จรัญ</strong></td><td>HomePro พัทยา</td><td>${fmtMoney(220000)}</td><td><span class="tag tag-warning">55%</span></td></tr>
                        <tr><td><strong>สุดา</strong></td><td>DoHome ระยอง</td><td>${fmtMoney(195000)}</td><td><span class="tag tag-warning">49%</span></td></tr>
                        <tr><td><strong>วิชัย</strong></td><td>MegaHome รังสิต</td><td>${fmtMoney(150000)}</td><td><span class="tag tag-danger">38%</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3><i class="fas fa-list" style="color:var(--gray-500);margin-right:6px"></i> รายการขายล่าสุด (สาขาในดูแล)</h3>
            <button class="btn btn-sm btn-outline" onclick="showToast('Export Excel')"><i class="fas fa-file-excel"></i> Export</button></div>
        <div class="card-body">
            <table class="data-table">
                <thead><tr><th>วันที่</th><th>สาขา</th><th>PC</th><th>สินค้า</th><th>จำนวน</th><th>รวม</th></tr></thead>
                <tbody>
                    <tr><td>13 ก.พ.</td><td>HomePro เอกมัย</td><td>พรทิพย์</td><td>ประตู UPVC BN-01 70x200</td><td>2</td><td>${fmtMoney(3580)}</td></tr>
                    <tr><td>13 ก.พ.</td><td>BnB พระราม2</td><td>มานี</td><td>ประตูห้องน้ำ PVC BW</td><td>5</td><td>${fmtMoney(5950)}</td></tr>
                    <tr><td>12 ก.พ.</td><td>HomePro พัทยา</td><td>จรัญ</td><td>ประตู UPVC L-35 80x200</td><td>1</td><td>${fmtMoney(3890)}</td></tr>
                    <tr><td>12 ก.พ.</td><td>DoHome ระยอง</td><td>สุดา</td><td>ประตูPVC G1A 70x200</td><td>4</td><td>${fmtMoney(6760)}</td></tr>
                </tbody>
            </table>
        </div>
    </div>`;
}

function getSalesAdmin() {
    return `
    <div class="filter-bar">
        <div class="form-group"><label class="form-label">ช่วงวันที่</label>
            <div style="display:flex;gap:6px"><input type="date" class="form-control" value="2026-02-01"><input type="date" class="form-control" value="2026-02-13"></div>
        </div>
        <div class="form-group"><label class="form-label">ห้าง</label>
            <select class="form-control"><option>ทุกห้าง</option><option>HomePro</option><option>DoHome</option><option>BnB Home</option><option>MegaHome</option></select>
        </div>
        <div class="form-group"><label class="form-label">สาขา</label>
            <select class="form-control"><option>ทุกสาขา</option><option>เอกมัย-รามอินทรา</option><option>บางบัวทอง</option><option>พระราม2</option><option>พัทยา</option><option>เชียงใหม่</option></select>
        </div>
        <div class="form-group"><label class="form-label">แบรนด์</label>
            <select class="form-control"><option>ทุกแบรนด์</option><option>EXTERA</option><option>POLY TIMBER</option><option>ANYHOME</option><option>AZLE</option></select>
        </div>
        <div class="form-group" style="align-self:end"><button class="btn btn-primary" onclick="showToast('กรองข้อมูลแล้ว')"><i class="fas fa-search"></i> ค้นหา</button></div>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#22c55e,#16a34a)"><i class="fas fa-baht-sign"></i></div>
            <div><div class="stat-value">${fmtMoney(8500000)}</div><div class="stat-label">ยอดขายรวม</div><div class="stat-change up"><i class="fas fa-arrow-up"></i> +12.5%</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8)"><i class="fas fa-boxes-stacked"></i></div>
            <div><div class="stat-value">1,245</div><div class="stat-label">จำนวนชิ้นที่ขาย</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#f59e0b,#d97706)"><i class="fas fa-receipt"></i></div>
            <div><div class="stat-value">386</div><div class="stat-label">จำนวนบิล</div></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed)"><i class="fas fa-calculator"></i></div>
            <div><div class="stat-value">${fmtMoney(6827)}</div><div class="stat-label">ค่าเฉลี่ย/ชิ้น</div></div>
        </div>
    </div>

    <div class="grid-2">
        <div class="card">
            <div class="card-header"><h3><i class="fas fa-chart-bar" style="color:var(--primary);margin-right:6px"></i> ยอดขายตามหมวดสินค้า</h3></div>
            <div class="card-body">
                <table class="data-table">
                    <thead><tr><th>หมวด</th><th>ยอดขาย</th><th>จำนวน</th><th>สัดส่วน</th></tr></thead>
                    <tbody>
                        <tr><td><strong>ประตูภายใน UPVC</strong></td><td>${fmtMoney(3200000)}</td><td>480</td>
                            <td><div class="progress" style="width:80px"><div class="progress-bar blue" style="width:38%"></div></div></td></tr>
                        <tr><td><strong>ประตูห้องน้ำ PVC</strong></td><td>${fmtMoney(2100000)}</td><td>350</td>
                            <td><div class="progress" style="width:80px"><div class="progress-bar green" style="width:25%"></div></div></td></tr>
                        <tr><td><strong>วงกบ WPC/UPVC</strong></td><td>${fmtMoney(1500000)}</td><td>280</td>
                            <td><div class="progress" style="width:80px"><div class="progress-bar amber" style="width:18%"></div></div></td></tr>
                        <tr><td><strong>ประตูภายนอก UPVC</strong></td><td>${fmtMoney(1200000)}</td><td>95</td>
                            <td><div class="progress" style="width:80px"><div class="progress-bar red" style="width:14%"></div></div></td></tr>
                        <tr><td><strong>Deck & อุปกรณ์</strong></td><td>${fmtMoney(500000)}</td><td>40</td>
                            <td><div class="progress" style="width:80px"><div class="progress-bar blue" style="width:5%"></div></div></td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="card">
            <div class="card-header"><h3><i class="fas fa-trophy" style="color:var(--accent);margin-right:6px"></i> Top 5 สินค้าขายดี</h3></div>
            <div class="card-body">
                <table class="data-table">
                    <thead><tr><th>#</th><th>สินค้า</th><th>แบรนด์</th><th>จำนวน</th><th>ยอด</th></tr></thead>
                    <tbody>
                        <tr><td><span style="color:var(--accent);font-weight:700">1</span></td><td>ประตูห้องน้ำPVC BW-G1A 70x200 GYW</td><td><span class="tag tag-info">ANYHOME</span></td><td>120</td><td>${fmtMoney(142800)}</td></tr>
                        <tr><td><span style="color:var(--accent);font-weight:700">2</span></td><td>ประตูภายในUPVC BN-01 70x200 WH</td><td><span class="tag tag-primary">AZLE</span></td><td>98</td><td>${fmtMoney(175420)}</td></tr>
                        <tr><td><span style="color:var(--accent);font-weight:700">3</span></td><td>วงกบUPVC 70x200 ขาว</td><td><span class="tag tag-success">EXTERA</span></td><td>85</td><td>${fmtMoney(74800)}</td></tr>
                        <tr><td><span style="color:var(--accent);font-weight:700">4</span></td><td>ประตูPVC เกล็ด G1A 70x200</td><td><span class="tag tag-purple">POLY TIMBER</span></td><td>72</td><td>${fmtMoney(121680)}</td></tr>
                        <tr><td><span style="color:var(--accent);font-weight:700">5</span></td><td>ประตูภายนอก UPVC L-35 80x200</td><td><span class="tag tag-primary">AZLE</span></td><td>45</td><td>${fmtMoney(175050)}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header">
            <h3><i class="fas fa-list" style="color:var(--gray-500);margin-right:6px"></i> รายละเอียดการขาย</h3>
            <div style="display:flex;gap:8px">
                <button class="btn btn-sm btn-outline" onclick="showToast('Exported to Excel')"><i class="fas fa-file-excel"></i> Export</button>
            </div>
        </div>
        <div class="card-body">
            <table class="data-table">
                <thead><tr><th>วันที่</th><th>สาขา</th><th>ห้าง</th><th>PC</th><th>สินค้า</th><th>จำนวน</th><th>ราคา/หน่วย</th><th>รวม</th><th>การชำระ</th></tr></thead>
                <tbody>
                    <tr><td>13 ก.พ.</td><td>เอกมัย-รามอินทรา</td><td>HomePro</td><td>พรทิพย์</td><td>ประตู UPVC BN-01 70x200</td><td>2</td><td>1,790</td><td>3,580</td><td><span class="tag tag-success">เงินสด</span></td></tr>
                    <tr><td>13 ก.พ.</td><td>บางบัวทอง</td><td>DoHome</td><td>สมชาย</td><td>วงกบ WPC 80x200</td><td>3</td><td>1,490</td><td>4,470</td><td><span class="tag tag-info">บัตรเครดิต</span></td></tr>
                    <tr><td>12 ก.พ.</td><td>พระราม2</td><td>BnB</td><td>มานี</td><td>ประตูห้องน้ำ PVC BW</td><td>5</td><td>1,190</td><td>5,950</td><td><span class="tag tag-success">เงินสด</span></td></tr>
                    <tr><td>12 ก.พ.</td><td>พัทยา</td><td>HomePro</td><td>จรัญ</td><td>ประตู UPVC L-35 80x200</td><td>1</td><td>3,890</td><td>3,890</td><td><span class="tag tag-primary">โอน</span></td></tr>
                    <tr><td>11 ก.พ.</td><td>เชียงใหม่</td><td>HomePro</td><td>สุดา</td><td>ประตูPVC G1A 70x200</td><td>4</td><td>1,690</td><td>6,760</td><td><span class="tag tag-success">เงินสด</span></td></tr>
                </tbody>
            </table>
        </div>
        <div class="card-footer" style="text-align:center;color:var(--gray-500);font-size:12px">
            แสดง 5 จาก 386 รายการ | <a href="#" onclick="showToast('Loading more...');return false" style="color:var(--primary)">ดูทั้งหมด</a>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3><i class="fas fa-exclamation-circle" style="color:var(--danger);margin-right:6px"></i> การแจ้งเตือนสินค้า</h3></div>
        <div class="card-body">
            <div class="grid-2" style="gap:12px">
                <div style="padding:12px;background:#fef2f2;border-radius:8px;border-left:4px solid var(--danger)">
                    <p style="font-weight:700;color:var(--danger)"><i class="fas fa-ban"></i> สินค้าไม่เคลื่อนไหว (Non-Move > 90 วัน)</p>
                    <p style="font-size:13px;color:var(--gray-600);margin-top:4px">23 รายการ จาก 18 สาขา</p>
                    <button class="btn btn-sm btn-danger" style="margin-top:8px" onclick="showNonMovingProducts()">ดูรายละเอียด</button>
                </div>
                <div style="padding:12px;background:#fef9c3;border-radius:8px;border-left:4px solid var(--warning)">
                    <p style="font-weight:700;color:#a16207"><i class="fas fa-arrow-down"></i> ต่ำกว่า Min Stock</p>
                    <p style="font-size:13px;color:var(--gray-600);margin-top:4px">15 รายการ ต้องสั่งเพิ่ม</p>
                    <button class="btn btn-sm btn-accent" style="margin-top:8px" onclick="showLowStock()">ดูรายละเอียด</button>
                </div>
                <div style="padding:12px;background:#dbeafe;border-radius:8px;border-left:4px solid var(--info)">
                    <p style="font-weight:700;color:var(--info)"><i class="fas fa-eye-slash"></i> ไม่มีตัวโชว์</p>
                    <p style="font-size:13px;color:var(--gray-600);margin-top:4px">8 รายการ ที่ต้องมีตัวโชว์แต่ไม่มี</p>
                    <button class="btn btn-sm btn-outline" style="margin-top:8px" onclick="showNoDisplay()">ดูรายละเอียด</button>
                </div>
                <div style="padding:12px;background:#f0fdf4;border-radius:8px;border-left:4px solid var(--success)">
                    <p style="font-weight:700;color:#15803d"><i class="fas fa-tags"></i> ราคาไม่ตรง</p>
                    <p style="font-size:13px;color:var(--gray-600);margin-top:4px">4 รายการ ราคาป้ายไม่ตรงกับระบบ</p>
                    <button class="btn btn-sm btn-outline" style="margin-top:8px" onclick="showPriceMismatch()">ดูรายละเอียด</button>
                </div>
            </div>
        </div>
    </div>`;
}

function showNonMovingProducts() {
    showModal('สินค้าไม่เคลื่อนไหว (Non-Move > 90 วัน)', `
        <table class="data-table">
            <thead><tr><th>สินค้า</th><th>สาขา</th><th>ห้าง</th><th>ไม่เคลื่อนไหว</th><th>สต๊อก</th></tr></thead>
            <tbody>
                <tr><td>ทางเท้า WPC ลายสลับ SPRING 30x30CM</td><td>พาราไดซ์ พาร์ค</td><td>HomePro</td><td><span class="tag tag-danger">191 วัน</span></td><td>1</td></tr>
                <tr><td>ประตู UPVC LT55 80x200 ลายไม้ขาว</td><td>ลาดพร้าว</td><td>HomePro</td><td><span class="tag tag-danger">316 วัน</span></td><td>2</td></tr>
                <tr><td>วงกบ WPC 4 80X200</td><td>DC รังสิต</td><td>BnB</td><td><span class="tag tag-danger">DISCON</span></td><td>0</td></tr>
                <tr><td>ประตูPVC 70X180 บานเรียบลายไม้เข้ม</td><td>DC รังสิต</td><td>BnB</td><td><span class="tag tag-warning">120 วัน</span></td><td>11</td></tr>
            </tbody>
        </table>`, '<button class="btn btn-primary" onclick="closeModal()">ปิด</button>');
}

function showLowStock() {
    showModal('สินค้าต่ำกว่า Min Stock', `
        <table class="data-table">
            <thead><tr><th>สินค้า</th><th>สาขา</th><th>Min</th><th>คงเหลือ</th><th>ขาด</th></tr></thead>
            <tbody>
                <tr><td>ประตูห้องน้ำ UPVC BN-01เกล็ด 70x200 WH</td><td>เอกมัย-รามอินทรา</td><td>5</td><td>3</td><td style="color:var(--danger);font-weight:700">-2</td></tr>
                <tr><td>วงกบประตู UPVC AZLE 80x200</td><td>หนองคาย</td><td>8</td><td>5</td><td style="color:var(--danger);font-weight:700">-3</td></tr>
                <tr><td>ประตูภายนอก UPVC L-35 80x200</td><td>เอกมัย-รามอินทรา</td><td>3</td><td>0</td><td style="color:var(--danger);font-weight:700">-3</td></tr>
            </tbody>
        </table>`, '<button class="btn btn-primary" onclick="closeModal()">ปิด</button>');
}

function showNoDisplay() {
    showModal('สินค้าไม่มีตัวโชว์', `
        <p style="margin-bottom:12px;color:var(--gray-500)">รายการสินค้าที่กำหนดให้มีตัวโชว์ (Schematic) แต่ไม่มีของจริงจัดแสดง</p>
        <table class="data-table">
            <thead><tr><th>สินค้า</th><th>สาขา</th><th>ตัวโชว์กำหนด</th><th>มีจริง</th></tr></thead>
            <tbody>
                <tr><td>ประตู PVC AZ-2 UV 70x200 CM</td><td>เอกมัย-รามอินทรา</td><td>1</td><td style="color:var(--danger)">0</td></tr>
                <tr><td>ประตูภายนอก UPVC L-35 80x200</td><td>เอกมัย-รามอินทรา</td><td>1</td><td style="color:var(--danger)">0</td></tr>
            </tbody>
        </table>`, '<button class="btn btn-primary" onclick="closeModal()">ปิด</button>');
}

function showPriceMismatch() {
    showModal('ราคาไม่ตรง', `
        <table class="data-table">
            <thead><tr><th>สินค้า</th><th>สาขา</th><th>ราคาระบบ</th><th>ราคาป้าย</th><th>ส่วนต่าง</th></tr></thead>
            <tbody>
                <tr><td>ประตู UPVC BN-01 70x200</td><td>พระราม2</td><td>1,790</td><td>1,690</td><td style="color:var(--danger)">-100</td></tr>
                <tr><td>วงกบ WPC 80x200</td><td>บางบัวทอง</td><td>1,490</td><td>1,590</td><td style="color:var(--warning)">+100</td></tr>
            </tbody>
        </table>`, '<button class="btn btn-primary" onclick="closeModal()">ปิด</button>');
}
