/* Data Import Module */
function renderImport(role) {
    const c = document.getElementById('contentArea');
    c.innerHTML = `
    <div class="card" style="margin-bottom:20px">
        <div class="card-header"><h3><i class="fas fa-file-import" style="color:var(--primary);margin-right:6px"></i> นำเข้าข้อมูลจากไฟล์ Excel</h3></div>
        <div class="card-body">
            <p style="color:var(--gray-500);margin-bottom:16px">รองรับไฟล์จากห้างต่างๆ: HomePro, DoHome, BnB Home (BTV), MegaHome — ระบบจะตรวจจับรูปแบบอัตโนมัติ</p>

            <div class="form-row">
                <div class="form-group" style="flex:2">
                    <label class="form-label">เลือกไฟล์ Excel (.xlsx, .xls, .csv)</label>
                    <input type="file" class="form-control" id="importFile" accept=".xlsx,.xls,.csv" onchange="previewImport(this)">
                </div>
                <div class="form-group">
                    <label class="form-label">ประเภทข้อมูล</label>
                    <select class="form-control" id="importType">
                        <option value="auto">ตรวจจับอัตโนมัติ</option>
                        <option value="sales_dh">ยอดขาย DoHome</option>
                        <option value="stock_dh">สต๊อก DoHome</option>
                        <option value="sales_btv">ยอดขาย BnB/BTV</option>
                        <option value="stock_btv">สต๊อก BnB/BTV</option>
                        <option value="stock_hp">สต๊อก HomePro</option>
                        <option value="sales_hp">ยอดขาย HomePro</option>
                        <option value="sale_detail_hp">Sale Detail HomePro</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <div class="card" id="importPreview" style="display:none">
        <div class="card-header">
            <h3><i class="fas fa-eye" style="color:var(--info);margin-right:6px"></i> ตรวจสอบข้อมูลก่อนนำเข้า</h3>
            <div style="display:flex;gap:8px">
                <span class="tag tag-success" id="importValidCount">0 รายการพร้อม</span>
                <span class="tag tag-warning" id="importWarnCount" style="display:none">0 ต้องตรวจสอบ</span>
                <span class="tag tag-danger" id="importErrCount" style="display:none">0 ข้อผิดพลาด</span>
            </div>
        </div>
        <div class="card-body">
            <div id="importIssues" style="margin-bottom:16px;display:none">
                <div style="padding:12px;background:#fef9c3;border-radius:8px;border-left:4px solid var(--warning);margin-bottom:8px" id="importWarnings"></div>
            </div>
            <div class="table-wrap" id="importPreviewTable"></div>
        </div>
        <div class="card-footer">
            <div style="display:flex;justify-content:space-between;align-items:center">
                <div>
                    <label style="font-size:13px;cursor:pointer">
                        <input type="checkbox" id="autoFix" checked> แก้ไขอัตโนมัติ (Auto Fix)
                    </label>
                </div>
                <div style="display:flex;gap:8px">
                    <button class="btn btn-outline" onclick="cancelImport()">ยกเลิก</button>
                    <button class="btn btn-success" onclick="doImport()"><i class="fas fa-check"></i> นำเข้าข้อมูล</button>
                </div>
            </div>
        </div>
    </div>

    <div class="card" id="importResult" style="display:none">
        <div class="card-body" style="text-align:center;padding:40px">
            <i class="fas fa-check-circle" style="font-size:48px;color:var(--success);margin-bottom:12px"></i>
            <h3 style="color:var(--success);margin-bottom:8px">นำเข้าข้อมูลสำเร็จ!</h3>
            <p id="importResultMsg" style="color:var(--gray-500)"></p>
            <button class="btn btn-primary" style="margin-top:16px" onclick="renderImport(currentRole)"><i class="fas fa-plus"></i> นำเข้าเพิ่ม</button>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3><i class="fas fa-history" style="color:var(--gray-500);margin-right:6px"></i> ประวัติการนำเข้า</h3></div>
        <div class="card-body">
            <table class="data-table">
                <thead><tr><th>วันที่</th><th>ไฟล์</th><th>ประเภท</th><th>รายการ</th><th>สถานะ</th><th>โดย</th></tr></thead>
                <tbody>
                    <tr><td>13 ก.พ. 69</td><td>Sale Detail By Zone HP CD.xlsx</td><td><span class="tag tag-info">ยอดขาย HP</span></td><td>2,450</td><td><span class="tag tag-success">สำเร็จ</span></td><td>Admin</td></tr>
                    <tr><td>12 ก.พ. 69</td><td>VRM_InventoryData Stock HP.xlsx</td><td><span class="tag tag-primary">สต๊อก HP</span></td><td>1,823</td><td><span class="tag tag-success">สำเร็จ</span></td><td>Admin</td></tr>
                    <tr><td>11 ก.พ. 69</td><td>vendor_online_report Stock BTV.xlsx</td><td><span class="tag tag-warning">สต๊อก BTV</span></td><td>945</td><td><span class="tag tag-success">สำเร็จ</span></td><td>สมชาย</td></tr>
                    <tr><td>10 ก.พ. 69</td><td>รายงานสต็อค Stock DH.xlsx</td><td><span class="tag tag-purple">สต๊อก DH</span></td><td>3,210</td><td><span class="tag tag-warning">มี 12 แจ้งเตือน</span></td><td>Admin</td></tr>
                    <tr><td>10 ก.พ. 69</td><td>ยอดขาย DH เดือน 10-2025.xlsx</td><td><span class="tag tag-info">ยอดขาย DH</span></td><td>1,567</td><td><span class="tag tag-success">สำเร็จ</span></td><td>Admin</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3><i class="fas fa-info-circle" style="color:var(--info);margin-right:6px"></i> รูปแบบไฟล์ที่รองรับ</h3></div>
        <div class="card-body">
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
                <div style="padding:12px;background:var(--gray-50);border-radius:8px;border-left:4px solid var(--info)">
                    <strong>HomePro - สต๊อก</strong>
                    <p style="font-size:12px;color:var(--gray-500);margin-top:4px">VRM_InventoryData_*.xlsx — Sheet: HP, MH<br>คอลัมน์: ARTNO, ARTDESC, SITENAME, ONHANDQTY, MIN TARGET, NON MOVE DAY</p>
                </div>
                <div style="padding:12px;background:var(--gray-50);border-radius:8px;border-left:4px solid var(--success)">
                    <strong>HomePro - Sale Detail</strong>
                    <p style="font-size:12px;color:var(--gray-500);margin-top:4px">Sale Detail By Zone*.xlsx<br>คอลัมน์: ARTICLE, Description, สาขา, ภาค, STOCK, ยอดขายรายเดือน, ตัวโชว์</p>
                </div>
                <div style="padding:12px;background:var(--gray-50);border-radius:8px;border-left:4px solid var(--warning)">
                    <strong>DoHome - ยอดขาย</strong>
                    <p style="font-size:12px;color:var(--gray-500);margin-top:4px">ยอดขาย DH*.xlsx — Sheet: ยอดขาย, ยอดซื้อครบ<br>คอลัมน์: สาขา, รหัสสินค้า, ชื่อสินค้า, จำนวนขาย, มูลค่าสินค้า</p>
                </div>
                <div style="padding:12px;background:var(--gray-50);border-radius:8px;border-left:4px solid var(--purple,#7c3aed)">
                    <strong>DoHome - สต๊อก</strong>
                    <p style="font-size:12px;color:var(--gray-500);margin-top:4px">รายงานสต็อค*.xlsx<br>คอลัมน์: รหัสสาขา, ชื่อสาขา, รหัสสินค้า, ชื่อสินค้า, สต็อกคงเหลือ, จำนวนขาย</p>
                </div>
                <div style="padding:12px;background:var(--gray-50);border-radius:8px;border-left:4px solid var(--accent)">
                    <strong>BnB Home (BTV)</strong>
                    <p style="font-size:12px;color:var(--gray-500);margin-top:4px">vendor_online_report*.xlsx — 6 Sheets<br>Sales by Branch, Detail, Stock, Aging, Turnover, Brand</p>
                </div>
            </div>
        </div>
    </div>`;
}

function previewImport(input) {
    if (!input.files.length) return;
    const file = input.files[0];
    const fname = file.name;

    // Auto-detect type
    let detectedType = 'ไม่ทราบ';
    let detectedStore = '';
    if (fname.includes('Sale Detail') && fname.includes('HP')) { detectedType = 'Sale Detail HomePro'; detectedStore = 'HomePro'; }
    else if (fname.includes('VRM') && fname.includes('Inventory')) { detectedType = 'สต๊อก HomePro'; detectedStore = 'HomePro'; }
    else if (fname.includes('vendor_online') || fname.includes('BTV')) { detectedType = 'ยอดขาย/สต๊อก BnB(BTV)'; detectedStore = 'BnB Home'; }
    else if (fname.includes('ยอดขาย') && fname.includes('DH')) { detectedType = 'ยอดขาย DoHome'; detectedStore = 'DoHome'; }
    else if (fname.includes('สต็อค') || fname.includes('Stock DH')) { detectedType = 'สต๊อก DoHome'; detectedStore = 'DoHome'; }

    document.getElementById('importPreview').style.display = 'block';
    document.getElementById('importResult').style.display = 'none';

    // Mock preview data
    const rows = Math.floor(Math.random() * 2000 + 500);
    const warns = Math.floor(Math.random() * 10);
    const errs = Math.floor(Math.random() * 3);

    document.getElementById('importValidCount').textContent = `${fmtNum(rows - warns - errs)} รายการพร้อม`;
    if (warns > 0) {
        document.getElementById('importWarnCount').style.display = 'inline-flex';
        document.getElementById('importWarnCount').textContent = `${warns} ต้องตรวจสอบ`;
    }
    if (errs > 0) {
        document.getElementById('importErrCount').style.display = 'inline-flex';
        document.getElementById('importErrCount').textContent = `${errs} ข้อผิดพลาด`;
    }

    if (warns > 0 || errs > 0) {
        document.getElementById('importIssues').style.display = 'block';
        let warnHtml = `<p style="font-weight:700;margin-bottom:6px"><i class="fas fa-exclamation-triangle"></i> พบข้อมูลที่ต้องตรวจสอบ</p>`;
        if (warns > 0) warnHtml += `<p style="font-size:12px">- ${warns} รายการ: ชื่อสินค้าไม่ตรงกับฐานข้อมูล (Auto Fix: จับคู่ด้วย Article ID)</p>`;
        if (errs > 0) warnHtml += `<p style="font-size:12px;color:var(--danger)">- ${errs} รายการ: ข้อมูลไม่สมบูรณ์ (ขาดรหัสสินค้า)</p>`;
        document.getElementById('importWarnings').innerHTML = warnHtml;
    }

    document.getElementById('importPreviewTable').innerHTML = `
        <div style="margin-bottom:8px;font-size:13px">
            <span class="tag tag-info">${detectedType}</span>
            <span class="tag tag-gray">${detectedStore}</span>
            <span style="color:var(--gray-500);margin-left:8px">ไฟล์: ${fname} (${(file.size/1024).toFixed(0)} KB)</span>
        </div>
        <table class="data-table">
            <thead><tr><th>#</th><th>รหัสสินค้า</th><th>ชื่อสินค้า</th><th>สาขา</th><th>จำนวน/สต๊อก</th><th>มูลค่า</th><th>สถานะ</th></tr></thead>
            <tbody>
                <tr><td>1</td><td>1231121</td><td>ประตูห้องน้ำUPVC AZLE BN-01 70x200WH</td><td>เอกมัย-รามอินทรา</td><td>11</td><td>19,690</td><td><span class="tag tag-success"><i class="fas fa-check"></i></span></td></tr>
                <tr><td>2</td><td>1225559</td><td>ประตูห้องน้ำUPVC AZLE BN-01เกล็ด70x200WH</td><td>เอกมัย-รามอินทรา</td><td>10</td><td>17,900</td><td><span class="tag tag-success"><i class="fas fa-check"></i></span></td></tr>
                <tr><td>3</td><td>1238143</td><td>ประตูภายนอกUPVC AZLE L-35 80X200cm WH</td><td>เอกมัย-รามอินทรา</td><td>0</td><td>0</td><td><span class="tag tag-warning" title="สต๊อก 0 ต่ำกว่า Min=3"><i class="fas fa-exclamation"></i></span></td></tr>
                <tr><td>4</td><td>196611</td><td>ประตู PVC AZLE AZ-2 UV 70X200cm CM</td><td>เอกมัย-รามอินทรา</td><td>7</td><td>12,530</td><td><span class="tag tag-success"><i class="fas fa-check"></i></span></td></tr>
                <tr><td>5</td><td>-</td><td>ข้อมูลไม่สมบูรณ์</td><td>-</td><td>-</td><td>-</td><td><span class="tag tag-danger"><i class="fas fa-times"></i> ข้ามรายการ</span></td></tr>
            </tbody>
        </table>
        <p style="text-align:center;font-size:12px;color:var(--gray-400);margin-top:8px">แสดง 5 จาก ${fmtNum(rows)} รายการ</p>`;
}

function cancelImport() {
    document.getElementById('importPreview').style.display = 'none';
    document.getElementById('importFile').value = '';
}

function doImport() {
    document.getElementById('importPreview').style.display = 'none';
    document.getElementById('importResult').style.display = 'block';
    document.getElementById('importResultMsg').textContent = 'นำเข้าข้อมูลทั้งหมด 1,245 รายการเรียบร้อยแล้ว (Auto Fix 5 รายการ, ข้าม 2 รายการ)';
    showToast('นำเข้าข้อมูลสำเร็จ!');
}
