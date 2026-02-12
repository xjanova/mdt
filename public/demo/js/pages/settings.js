/* System Settings Page */
function renderSettings(role) {
    const c = document.getElementById('contentArea');
    const settings = loadData('system_settings', getDefaultSettings());

    c.innerHTML = `
    <div style="display:grid;grid-template-columns:220px 1fr;gap:16px">
        <!-- Settings Nav -->
        <div class="card" style="margin-bottom:0;align-self:start;position:sticky;top:80px">
            <div class="card-body" style="padding:8px">
                <div class="settings-nav">
                    <a class="settings-nav-item active" onclick="showSettingsTab('general',this)"><i class="fas fa-gear"></i> ทั่วไป</a>
                    <a class="settings-nav-item" onclick="showSettingsTab('gps',this)"><i class="fas fa-location-dot"></i> GPS / Geofencing</a>
                    <a class="settings-nav-item" onclick="showSettingsTab('branches',this)"><i class="fas fa-store"></i> สาขา</a>
                    <a class="settings-nav-item" onclick="showSettingsTab('notifications',this)"><i class="fas fa-bell"></i> การแจ้งเตือน</a>
                    <a class="settings-nav-item" onclick="showSettingsTab('import_settings',this)"><i class="fas fa-file-import"></i> การนำเข้าข้อมูล</a>
                    <a class="settings-nav-item" onclick="showSettingsTab('ai_settings',this)"><i class="fas fa-robot"></i> AI / Grok</a>
                    <a class="settings-nav-item" onclick="showSettingsTab('backup',this)"><i class="fas fa-database"></i> สำรองข้อมูล</a>
                    <a class="settings-nav-item" onclick="showSettingsTab('about',this)"><i class="fas fa-info-circle"></i> เกี่ยวกับระบบ</a>
                </div>
            </div>
        </div>

        <!-- Settings Content -->
        <div id="settingsContent">
            ${getSettingsGeneral(settings)}
        </div>
    </div>`;
}

function getDefaultSettings() {
    return {
        companyName: 'บจก. สยามพลาสวูด',
        systemName: 'MDT ERP System',
        language: 'th',
        timezone: 'Asia/Bangkok',
        dateFormat: 'DD/MM/YYYY',
        gpsRadius: 100,
        gpsRequired: true,
        photoRequired: true,
        workStart: '08:30',
        workEnd: '17:30',
        lateMinutes: 15,
        autoImportFix: true,
        importDuplicateCheck: true,
    };
}

function showSettingsTab(tab, el) {
    // Update nav
    document.querySelectorAll('.settings-nav-item').forEach(a => a.classList.remove('active'));
    if (el) el.classList.add('active');

    const settings = loadData('system_settings', getDefaultSettings());
    const content = document.getElementById('settingsContent');

    const tabs = {
        general: getSettingsGeneral,
        gps: getSettingsGPS,
        branches: getSettingsBranches,
        notifications: getSettingsNotifications,
        import_settings: getSettingsImport,
        ai_settings: getSettingsAI,
        backup: getSettingsBackup,
        about: getSettingsAbout,
    };

    const renderer = tabs[tab];
    if (renderer) content.innerHTML = renderer(settings);
}

function getSettingsGeneral(s) {
    return `
    <div class="card">
        <div class="card-header"><h3><i class="fas fa-gear" style="color:var(--primary);margin-right:6px"></i> ตั้งค่าทั่วไป</h3></div>
        <div class="card-body">
            <div class="form-group">
                <label class="form-label">ชื่อบริษัท</label>
                <input type="text" class="form-control" value="${s.companyName}" id="setCompanyName">
            </div>
            <div class="form-group">
                <label class="form-label">ชื่อระบบ</label>
                <input type="text" class="form-control" value="${s.systemName}" id="setSystemName">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">ภาษา</label>
                    <select class="form-control" id="setLanguage">
                        <option value="th" ${s.language==='th'?'selected':''}>ไทย</option>
                        <option value="en" ${s.language==='en'?'selected':''}>English</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">เขตเวลา</label>
                    <select class="form-control"><option selected>Asia/Bangkok (GMT+7)</option></select>
                </div>
                <div class="form-group">
                    <label class="form-label">รูปแบบวันที่</label>
                    <select class="form-control" id="setDateFormat">
                        <option value="DD/MM/YYYY" ${s.dateFormat==='DD/MM/YYYY'?'selected':''}>DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD" ${s.dateFormat==='YYYY-MM-DD'?'selected':''}>YYYY-MM-DD</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">โลโก้บริษัท</label>
                <div style="display:flex;gap:12px;align-items:center">
                    <div style="width:60px;height:60px;background:var(--accent);border-radius:12px;display:flex;align-items:center;justify-content:center">
                        <span style="font-size:28px;font-weight:700;color:white">M</span>
                    </div>
                    <button class="btn btn-outline btn-sm"><i class="fas fa-upload"></i> เปลี่ยนโลโก้</button>
                </div>
            </div>
        </div>
        <div class="card-footer" style="text-align:right">
            <button class="btn btn-primary" onclick="saveGeneralSettings()"><i class="fas fa-check"></i> บันทึก</button>
        </div>
    </div>`;
}

function getSettingsGPS(s) {
    return `
    <div class="card">
        <div class="card-header"><h3><i class="fas fa-location-dot" style="color:var(--danger);margin-right:6px"></i> ตั้งค่า GPS / Geofencing</h3></div>
        <div class="card-body">
            <div style="padding:12px;background:#fef9c3;border-radius:8px;border-left:4px solid var(--warning);margin-bottom:16px">
                <p style="font-size:12px"><i class="fas fa-info-circle"></i> Geofencing ใช้กำหนดรัศมีรอบสาขาที่พนักงานต้องอยู่ภายในเมื่อลงเวลาเข้างาน</p>
            </div>

            <div class="form-group">
                <label class="form-label">รัศมี Geofencing (เมตร)</label>
                <div style="display:flex;gap:12px;align-items:center">
                    <input type="range" min="50" max="500" step="10" value="${s.gpsRadius}" id="gpsRadiusRange"
                        oninput="document.getElementById('gpsRadiusValue').textContent=this.value+'m'"
                        style="flex:1">
                    <span style="font-weight:700;font-size:18px;min-width:60px;text-align:center" id="gpsRadiusValue">${s.gpsRadius}m</span>
                </div>
                <p style="font-size:11px;color:var(--gray-400);margin-top:4px">แนะนำ: 100m สำหรับห้างสรรพสินค้า, 200m สำหรับพื้นที่กว้าง</p>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">เวลาเข้างาน</label>
                    <input type="time" class="form-control" value="${s.workStart}" id="setWorkStart">
                </div>
                <div class="form-group">
                    <label class="form-label">เวลาเลิกงาน</label>
                    <input type="time" class="form-control" value="${s.workEnd}" id="setWorkEnd">
                </div>
                <div class="form-group">
                    <label class="form-label">สายหลัง (นาที)</label>
                    <input type="number" class="form-control" value="${s.lateMinutes}" id="setLateMinutes" min="0" max="60">
                </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox" id="setGpsRequired" ${s.gpsRequired?'checked':''}>
                    <span>บังคับเปิด GPS เมื่อลงเวลา</span>
                </label>
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox" id="setPhotoRequired" ${s.photoRequired?'checked':''}>
                    <span>บังคับถ่ายรูปยืนยันเมื่อลงเวลา</span>
                </label>
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox" checked>
                    <span>อนุญาตลงเวลานอกรัศมี (บันทึกเป็น "นอกพื้นที่")</span>
                </label>
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox" checked>
                    <span>แจ้งเตือนหัวหน้าเมื่อลงเวลานอกรัศมี</span>
                </label>
            </div>
        </div>
        <div class="card-footer" style="text-align:right">
            <button class="btn btn-primary" onclick="saveGPSSettings()"><i class="fas fa-check"></i> บันทึก</button>
        </div>
    </div>`;
}

function getSettingsBranches(s) {
    const branches = [
        { name: 'HomePro เอกมัย-รามอินทรา', store: 'HomePro', lat: '13.810580', lon: '100.617720', radius: 100, active: true },
        { name: 'HomePro เชียงใหม่', store: 'HomePro', lat: '18.787747', lon: '98.993120', radius: 100, active: true },
        { name: 'HomePro พัทยา', store: 'HomePro', lat: '12.926670', lon: '100.882400', radius: 150, active: true },
        { name: 'DoHome บางบัวทอง', store: 'DoHome', lat: '13.908870', lon: '100.397340', radius: 100, active: true },
        { name: 'DoHome ขอนแก่น', store: 'DoHome', lat: '16.431320', lon: '102.833670', radius: 120, active: true },
        { name: 'DoHome ระยอง', store: 'DoHome', lat: '12.683330', lon: '101.236940', radius: 100, active: true },
        { name: 'BnB พระราม2', store: 'BnB Home', lat: '13.658890', lon: '100.479440', radius: 100, active: true },
        { name: 'MegaHome รังสิต', store: 'MegaHome', lat: '13.986420', lon: '100.616170', radius: 200, active: true },
    ];

    return `
    <div class="card">
        <div class="card-header">
            <h3><i class="fas fa-store" style="color:var(--success);margin-right:6px"></i> จัดการสาขา</h3>
            <button class="btn btn-sm btn-primary" onclick="showAddBranch()"><i class="fas fa-plus"></i> เพิ่มสาขา</button>
        </div>
        <div class="card-body">
            <table class="data-table">
                <thead>
                    <tr><th>สาขา</th><th>ห้าง</th><th>พิกัด GPS</th><th>รัศมี</th><th>สถานะ</th><th>จัดการ</th></tr>
                </thead>
                <tbody>
                    ${branches.map(b => `
                    <tr>
                        <td><strong>${b.name}</strong></td>
                        <td><span class="tag tag-gray">${b.store}</span></td>
                        <td style="font-size:11px;color:var(--gray-500)">${b.lat}, ${b.lon}</td>
                        <td>${b.radius}m</td>
                        <td>${b.active ? '<span class="tag tag-success">เปิดใช้</span>' : '<span class="tag tag-gray">ปิด</span>'}</td>
                        <td>
                            <button class="btn btn-sm btn-outline" onclick="showEditBranch('${b.name}')"><i class="fas fa-pen"></i></button>
                            <button class="btn btn-sm btn-outline" onclick="showBranchMap('${b.lat}','${b.lon}','${b.name}')"><i class="fas fa-map"></i></button>
                        </td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>
    </div>`;
}

function getSettingsNotifications(s) {
    return `
    <div class="card">
        <div class="card-header"><h3><i class="fas fa-bell" style="color:var(--warning);margin-right:6px"></i> ตั้งค่าการแจ้งเตือน</h3></div>
        <div class="card-body">
            <h4 style="font-size:14px;margin-bottom:12px;color:var(--gray-600)">แจ้งเตือนทางเบราว์เซอร์</h4>
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px">
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox" checked> งานใหม่ที่ได้รับมอบหมาย
                </label>
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox" checked> ปัญหาเร่งด่วน
                </label>
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox" checked> พนักงานมาสาย / ลงเวลานอกรัศมี
                </label>
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox"> ข้อความใหม่ในศูนย์สื่อสาร
                </label>
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox" checked> สต๊อกต่ำกว่า Min Target
                </label>
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox"> สรุปรายวัน (Daily Report)
                </label>
            </div>

            <h4 style="font-size:14px;margin-bottom:12px;color:var(--gray-600)">แจ้งเตือนทาง LINE Notify</h4>
            <div class="form-group">
                <label class="form-label">LINE Notify Token</label>
                <div style="display:flex;gap:8px">
                    <input type="password" class="form-control" placeholder="ใส่ LINE Notify Token" id="lineToken">
                    <button class="btn btn-outline btn-sm" onclick="showToast('ทดสอบส่ง LINE สำเร็จ!')"><i class="fas fa-paper-plane"></i> ทดสอบ</button>
                </div>
                <p style="font-size:11px;color:var(--gray-400);margin-top:4px">รับ Token ได้ที่ <a href="https://notify-bot.line.me" target="_blank" style="color:var(--primary)">notify-bot.line.me</a></p>
            </div>

            <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox" checked> ส่ง LINE เมื่อมีปัญหาเร่งด่วน
                </label>
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox"> ส่ง LINE สรุปยอดขายรายวัน
                </label>
            </div>
        </div>
        <div class="card-footer" style="text-align:right">
            <button class="btn btn-primary" onclick="showToast('บันทึกการตั้งค่าแจ้งเตือนสำเร็จ')"><i class="fas fa-check"></i> บันทึก</button>
        </div>
    </div>`;
}

function getSettingsImport(s) {
    return `
    <div class="card">
        <div class="card-header"><h3><i class="fas fa-file-import" style="color:var(--info);margin-right:6px"></i> ตั้งค่าการนำเข้าข้อมูล</h3></div>
        <div class="card-body">
            <h4 style="font-size:14px;margin-bottom:12px;color:var(--gray-600)">การตรวจสอบข้อมูล</h4>
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px">
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox" ${s.autoImportFix?'checked':''} id="setAutoFix">
                    <span>Auto Fix: แก้ไขข้อมูลอัตโนมัติ (ชื่อสินค้า, รหัสสาขา)</span>
                </label>
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox" ${s.importDuplicateCheck?'checked':''} id="setDupCheck">
                    <span>ตรวจซ้ำ: ตรวจสอบข้อมูลซ้ำก่อนนำเข้า</span>
                </label>
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox" checked>
                    <span>แจ้งเตือนเมื่อพบ Article ID ที่ไม่มีในฐานข้อมูล</span>
                </label>
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox" checked>
                    <span>คำนวณ Coverage Day อัตโนมัติหลังนำเข้าสต๊อก</span>
                </label>
            </div>

            <h4 style="font-size:14px;margin-bottom:12px;color:var(--gray-600)">การจับคู่สินค้า (Mapping)</h4>
            <div style="padding:12px;background:var(--gray-50);border-radius:8px;margin-bottom:12px">
                <table class="data-table" style="font-size:12px">
                    <thead><tr><th>ห้าง</th><th>ฟิลด์รหัสสินค้า</th><th>ฟิลด์ชื่อสินค้า</th><th>ฟิลด์สาขา</th></tr></thead>
                    <tbody>
                        <tr><td>HomePro</td><td>ARTNO / ARTICLE</td><td>ARTDESC / Description</td><td>SITENAME / สาขา</td></tr>
                        <tr><td>DoHome</td><td>รหัสสินค้า</td><td>ชื่อสินค้า</td><td>ชื่อสาขา</td></tr>
                        <tr><td>BnB/BTV</td><td>PD_CODE</td><td>PD_NAME</td><td>BRANCH_NAME</td></tr>
                    </tbody>
                </table>
            </div>

            <h4 style="font-size:14px;margin-bottom:12px;color:var(--gray-600)">เงื่อนไขแจ้งเตือนสินค้า</h4>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Non-Moving Day (วัน)</label>
                    <input type="number" class="form-control" value="90" min="30" max="365">
                    <p style="font-size:11px;color:var(--gray-400)">สินค้าที่ไม่เคลื่อนไหวเกินกำหนด</p>
                </div>
                <div class="form-group">
                    <label class="form-label">Min Stock Alert (%)</label>
                    <input type="number" class="form-control" value="100" min="50" max="200">
                    <p style="font-size:11px;color:var(--gray-400)">แจ้งเตือนเมื่อสต๊อก ≤ Min Target</p>
                </div>
                <div class="form-group">
                    <label class="form-label">Coverage Day Alert (วัน)</label>
                    <input type="number" class="form-control" value="14" min="7" max="60">
                    <p style="font-size:11px;color:var(--gray-400)">แจ้งเตือนเมื่อ Coverage Day ต่ำ</p>
                </div>
            </div>
        </div>
        <div class="card-footer" style="text-align:right">
            <button class="btn btn-primary" onclick="showToast('บันทึกการตั้งค่าสำเร็จ')"><i class="fas fa-check"></i> บันทึก</button>
        </div>
    </div>`;
}

function getSettingsAI(s) {
    const apiKey = loadData('grok_api_key', '');
    const model = loadData('grok_model', 'grok-3');
    return `
    <div class="card">
        <div class="card-header"><h3><i class="fas fa-robot" style="color:var(--accent);margin-right:6px"></i> ตั้งค่า AI / Grok</h3></div>
        <div class="card-body">
            <div class="form-group">
                <label class="form-label">Grok API Key</label>
                <input type="password" class="form-control" value="${apiKey}" id="settingsGrokKey" placeholder="xai-xxxxxxxxxxxxxxxx">
                <p style="font-size:11px;color:var(--gray-400);margin-top:4px">รับ API Key ที่ <a href="https://console.x.ai" target="_blank" style="color:var(--primary)">console.x.ai</a></p>
            </div>
            <div class="form-group">
                <label class="form-label">โมเดล AI</label>
                <select class="form-control" id="settingsGrokModel">
                    <option value="grok-3" ${model==='grok-3'?'selected':''}>Grok 3 (ฉลาดที่สุด)</option>
                    <option value="grok-3-mini" ${model==='grok-3-mini'?'selected':''}>Grok 3 Mini (เร็ว ประหยัด)</option>
                    <option value="grok-2" ${model==='grok-2'?'selected':''}>Grok 2</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">บทบาท AI (System Prompt เพิ่มเติม)</label>
                <textarea class="form-control" rows="3" placeholder="เช่น 'ตอบสั้นๆ กระชับ ใช้ภาษาทางการ'">ตอบเป็นภาษาไทย กระชับ ให้คำแนะนำที่ปฏิบัติได้จริง</textarea>
            </div>

            <h4 style="font-size:14px;margin-bottom:12px;margin-top:20px;color:var(--gray-600)">ข้อจำกัด</h4>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Max Tokens ต่อคำตอบ</label>
                    <input type="number" class="form-control" value="2048" min="256" max="8192">
                </div>
                <div class="form-group">
                    <label class="form-label">Temperature</label>
                    <input type="number" class="form-control" value="0.7" min="0" max="2" step="0.1">
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox" checked> อนุญาตทุกบทบาทใช้ AI
                </label>
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
                    <input type="checkbox"> บันทึกประวัติสนทนาทั้งหมด (Audit)
                </label>
            </div>

            <div style="margin-top:16px;padding:12px;background:#f0fdf4;border-radius:8px;border-left:4px solid var(--success)">
                <p style="font-size:12px"><i class="fas fa-shield-check"></i> <strong>ความปลอดภัย:</strong> API Key เก็บเฉพาะในเบราว์เซอร์ ไม่ส่งไปเซิร์ฟเวอร์ การสนทนาส่งตรงไป Grok API เท่านั้น</p>
            </div>
        </div>
        <div class="card-footer" style="text-align:right">
            <button class="btn btn-outline" onclick="testGrokConnection()" id="testGrokBtn"><i class="fas fa-plug"></i> ทดสอบการเชื่อมต่อ</button>
            <button class="btn btn-primary" onclick="saveAISettingsFromSettings()"><i class="fas fa-check"></i> บันทึก</button>
        </div>
    </div>`;
}

function getSettingsBackup(s) {
    return `
    <div class="card">
        <div class="card-header"><h3><i class="fas fa-database" style="color:var(--purple,#7c3aed);margin-right:6px"></i> สำรองและกู้คืนข้อมูล</h3></div>
        <div class="card-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
                <div style="padding:16px;background:var(--gray-50);border-radius:12px;text-align:center">
                    <i class="fas fa-download" style="font-size:32px;color:var(--primary);margin-bottom:8px"></i>
                    <h4 style="margin-bottom:4px">สำรองข้อมูล</h4>
                    <p style="font-size:12px;color:var(--gray-500);margin-bottom:12px">ดาวน์โหลดข้อมูลทั้งหมดในรูปแบบ JSON</p>
                    <button class="btn btn-primary" onclick="exportAllData()"><i class="fas fa-download"></i> สำรองข้อมูล</button>
                </div>
                <div style="padding:16px;background:var(--gray-50);border-radius:12px;text-align:center">
                    <i class="fas fa-upload" style="font-size:32px;color:var(--success);margin-bottom:8px"></i>
                    <h4 style="margin-bottom:4px">กู้คืนข้อมูล</h4>
                    <p style="font-size:12px;color:var(--gray-500);margin-bottom:12px">นำเข้าข้อมูลจากไฟล์สำรอง</p>
                    <button class="btn btn-outline" onclick="showToast('เลือกไฟล์สำรอง')"><i class="fas fa-upload"></i> กู้คืนข้อมูล</button>
                </div>
            </div>

            <h4 style="font-size:14px;margin-bottom:12px;color:var(--gray-600)">ข้อมูลในเครื่อง (LocalStorage)</h4>
            <div style="padding:12px;background:var(--gray-50);border-radius:8px">
                <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px">
                    <span>ข้อมูลที่เก็บ</span>
                    <strong id="storageSize">กำลังคำนวณ...</strong>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px">
                    <span>รายการ</span>
                    <strong id="storageCount">-</strong>
                </div>
                <button class="btn btn-sm btn-outline" style="margin-top:8px" onclick="clearAllLocalData()">
                    <i class="fas fa-trash"></i> ล้างข้อมูลทั้งหมด
                </button>
            </div>
        </div>
    </div>`;
}

function getSettingsAbout(s) {
    return `
    <div class="card">
        <div class="card-header"><h3><i class="fas fa-info-circle" style="color:var(--info);margin-right:6px"></i> เกี่ยวกับระบบ</h3></div>
        <div class="card-body">
            <div style="text-align:center;padding:20px">
                <div style="width:80px;height:80px;background:var(--accent);border-radius:20px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px">
                    <span style="font-size:40px;font-weight:700;color:white">M</span>
                </div>
                <h2 style="margin-bottom:4px">MDT ERP System</h2>
                <p style="color:var(--gray-500);margin-bottom:20px">Merchandiser Daily Tracking</p>
            </div>

            <table style="width:100%;font-size:13px;border-collapse:collapse">
                <tr style="border-bottom:1px solid var(--gray-100)"><td style="padding:8px;color:var(--gray-500)">เวอร์ชัน</td><td style="padding:8px;font-weight:700">1.0.0-demo</td></tr>
                <tr style="border-bottom:1px solid var(--gray-100)"><td style="padding:8px;color:var(--gray-500)">Framework</td><td style="padding:8px">Vanilla JS (Demo) / Laravel 12 (Production)</td></tr>
                <tr style="border-bottom:1px solid var(--gray-100)"><td style="padding:8px;color:var(--gray-500)">AI Engine</td><td style="padding:8px">Grok 3 (xAI)</td></tr>
                <tr style="border-bottom:1px solid var(--gray-100)"><td style="padding:8px;color:var(--gray-500)">สำหรับ</td><td style="padding:8px">บจก. สยามพลาสวูด</td></tr>
                <tr style="border-bottom:1px solid var(--gray-100)"><td style="padding:8px;color:var(--gray-500)">พัฒนาโดย</td><td style="padding:8px">XMAN Studio</td></tr>
                <tr><td style="padding:8px;color:var(--gray-500)">ลิขสิทธิ์</td><td style="padding:8px">&copy; 2026 XMAN Studio</td></tr>
            </table>

            <div style="margin-top:20px;padding:12px;background:var(--gray-50);border-radius:8px;font-size:12px;color:var(--gray-500);text-align:center">
                <p>Built with <i class="fas fa-heart" style="color:var(--danger)"></i> by XMAN Studio</p>
                <p style="margin-top:4px">
                    <a href="https://github.com/xjanova/mdt" target="_blank" style="color:var(--primary)"><i class="fab fa-github"></i> GitHub</a>
                </p>
            </div>
        </div>
    </div>`;
}

// Save functions
function saveGeneralSettings() {
    const s = loadData('system_settings', getDefaultSettings());
    s.companyName = document.getElementById('setCompanyName').value;
    s.systemName = document.getElementById('setSystemName').value;
    s.language = document.getElementById('setLanguage').value;
    s.dateFormat = document.getElementById('setDateFormat').value;
    saveData('system_settings', s);
    showToast('บันทึกการตั้งค่าทั่วไปสำเร็จ');
}

function saveGPSSettings() {
    const s = loadData('system_settings', getDefaultSettings());
    s.gpsRadius = parseInt(document.getElementById('gpsRadiusRange').value);
    s.workStart = document.getElementById('setWorkStart').value;
    s.workEnd = document.getElementById('setWorkEnd').value;
    s.lateMinutes = parseInt(document.getElementById('setLateMinutes').value);
    s.gpsRequired = document.getElementById('setGpsRequired').checked;
    s.photoRequired = document.getElementById('setPhotoRequired').checked;
    saveData('system_settings', s);
    showToast('บันทึกการตั้งค่า GPS สำเร็จ');
}

function saveAISettingsFromSettings() {
    const key = document.getElementById('settingsGrokKey').value.trim();
    const model = document.getElementById('settingsGrokModel').value;
    if (key) saveData('grok_api_key', key);
    saveData('grok_model', model);
    showToast('บันทึกการตั้งค่า AI สำเร็จ');
}

async function testGrokConnection() {
    const key = document.getElementById('settingsGrokKey').value.trim();
    if (!key) { showToast('กรุณาใส่ API Key'); return; }
    const btn = document.getElementById('testGrokBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังทดสอบ...';
    try {
        const res = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
            body: JSON.stringify({ model: 'grok-3-mini', messages: [{ role: 'user', content: 'ping' }], max_tokens: 10 })
        });
        if (res.ok) {
            showToast('เชื่อมต่อ Grok สำเร็จ!');
        } else {
            const err = await res.json().catch(() => ({}));
            showToast('ไม่สามารถเชื่อมต่อ: ' + (err.error?.message || res.status));
        }
    } catch (e) {
        showToast('เชื่อมต่อไม่ได้: ' + e.message);
    }
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-plug"></i> ทดสอบการเชื่อมต่อ';
}

function exportAllData() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('mdt_')) {
            data[key] = localStorage.getItem(key);
        }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mdt_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('สำรองข้อมูลสำเร็จ!');
}

function clearAllLocalData() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('mdt_')) keys.push(key);
    }
    keys.forEach(k => localStorage.removeItem(k));
    showToast(`ล้างข้อมูล ${keys.length} รายการสำเร็จ`);
    const countEl = document.getElementById('storageCount');
    const sizeEl = document.getElementById('storageSize');
    if (countEl) countEl.textContent = '0';
    if (sizeEl) sizeEl.textContent = '0 bytes';
}

function showAddBranch() {
    showModal('เพิ่มสาขาใหม่', `
        <div class="form-group"><label class="form-label">ชื่อสาขา *</label><input type="text" class="form-control" placeholder="เช่น HomePro สุขุมวิท"></div>
        <div class="form-group"><label class="form-label">ห้าง</label>
            <select class="form-control"><option>HomePro</option><option>DoHome</option><option>MegaHome</option><option>BnB Home</option></select></div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">Latitude</label><input type="text" class="form-control" placeholder="13.xxxxxx"></div>
            <div class="form-group"><label class="form-label">Longitude</label><input type="text" class="form-control" placeholder="100.xxxxxx"></div>
        </div>
        <div class="form-group">
            <label class="form-label">รัศมี Geofencing (เมตร)</label>
            <input type="number" class="form-control" value="100" min="50" max="500">
        </div>
        <div style="padding:10px;background:var(--gray-50);border-radius:8px;font-size:12px;color:var(--gray-500)">
            <i class="fas fa-info-circle"></i> ใช้ Google Maps หาพิกัด: คลิกขวาที่ตำแหน่ง > คัดลอกพิกัด
        </div>
    `, '<button class="btn btn-outline" onclick="closeModal()">ยกเลิก</button><button class="btn btn-success" onclick="showToast(\'เพิ่มสาขาสำเร็จ!\');closeModal()"><i class="fas fa-check"></i> เพิ่มสาขา</button>');
}

function showEditBranch(name) {
    showModal('แก้ไขสาขา: ' + name, `
        <div class="form-group"><label class="form-label">ชื่อสาขา</label><input type="text" class="form-control" value="${name}"></div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">Latitude</label><input type="text" class="form-control" value="13.810580"></div>
            <div class="form-group"><label class="form-label">Longitude</label><input type="text" class="form-control" value="100.617720"></div>
        </div>
        <div class="form-group"><label class="form-label">รัศมี (เมตร)</label><input type="number" class="form-control" value="100"></div>
        <div class="form-group"><label class="form-label">สถานะ</label>
            <select class="form-control"><option selected>เปิดใช้</option><option>ปิด</option></select></div>
    `, '<button class="btn btn-outline" onclick="closeModal()">ยกเลิก</button><button class="btn btn-primary" onclick="showToast(\'อัปเดตสาขาสำเร็จ!\');closeModal()"><i class="fas fa-check"></i> บันทึก</button>');
}

function showBranchMap(lat, lon, name) {
    showModal('แผนที่: ' + name, `
        <div style="width:100%;height:400px;border-radius:8px;overflow:hidden">
            <iframe src="https://maps.google.com/maps?q=${lat},${lon}&z=16&output=embed"
                style="width:100%;height:100%;border:none"></iframe>
        </div>
        <p style="font-size:12px;color:var(--gray-500);margin-top:8px;text-align:center">
            <i class="fas fa-map-pin"></i> ${lat}, ${lon}
        </p>
    `, '<button class="btn btn-outline" onclick="closeModal()">ปิด</button>');
}
