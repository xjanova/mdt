/* Problem Tracking Page */
function renderProblems(role) {
    const c = document.getElementById('contentArea');
    c.innerHTML = `
    <div style="margin-bottom:16px;display:flex;gap:10px">
        <button class="btn btn-danger" onclick="showReportProblem()"><i class="fas fa-plus"></i> แจ้งปัญหาใหม่</button>
    </div>

    <div class="filter-bar">
        <div class="form-group"><label class="form-label">สถานะ</label>
            <select class="form-control"><option>ทั้งหมด</option><option>เปิดใหม่</option><option>รับทราบ</option><option>กำลังแก้ไข</option><option>แก้ไขแล้ว</option></select></div>
        <div class="form-group"><label class="form-label">หมวด</label>
            <select class="form-control"><option>ทั้งหมด</option><option>สต๊อก/จัดแสดง</option><option>โปรโมชั่น</option><option>สินค้าเสียหาย</option><option>ลูกค้าร้องเรียน</option></select></div>
        <div class="form-group"><label class="form-label">สาขา</label>
            <select class="form-control"><option>ทุกสาขา</option><option>HomePro เอกมัย</option><option>DoHome บางบัวทอง</option></select></div>
        <div class="form-group" style="align-self:end"><button class="btn btn-primary"><i class="fas fa-search"></i></button></div>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr)">
        <div class="stat-card"><div class="stat-icon" style="background:var(--info)"><i class="fas fa-folder-open"></i></div><div><div class="stat-value">2</div><div class="stat-label">เปิดใหม่</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--warning)"><i class="fas fa-eye"></i></div><div><div class="stat-value">1</div><div class="stat-label">รับทราบ</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--primary)"><i class="fas fa-wrench"></i></div><div><div class="stat-value">3</div><div class="stat-label">กำลังแก้ไข</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--danger)"><i class="fas fa-fire"></i></div><div><div class="stat-value">2</div><div class="stat-label">เร่งด่วน</div></div></div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px">
        ${getProblemCards()}
    </div>`;
}

function getProblemCards() {
    const problems = [
        { id:1, title:'ป้ายโปรโมชั่นหมดอายุยังแสดงอยู่', desc:'ป้ายลด 30% หมดอายุ 31 ม.ค. แต่ยังติดอยู่', branch:'Mega Bangna', cat:'โปรโมชั่น', severity:'เร่งด่วน', sevClass:'tag-danger', status:'รับทราบ', stClass:'tag-warning', progress:10, reporter:'พรทิพย์', time:'5 นาที', comments:3, photos:2 },
        { id:2, title:'ประตูโชว์ไม่ได้จัดวางตาม Schematic', desc:'ประตู UPVC BN-01 ต้องจัดโชว์แต่ไม่ได้วาง', branch:'HomePro เอกมัย', cat:'สต๊อก/จัดแสดง', severity:'สูง', sevClass:'tag-warning', status:'กำลังแก้', stClass:'tag-info', progress:60, reporter:'สมชาย', time:'2 ชม.', comments:5, photos:3 },
        { id:3, title:'สต๊อก HDF ไม่เพียงพอ', desc:'สต๊อก HDF เหลือ 2 แต่ Min 10 ขายไม่ทัน', branch:'DoHome ขอนแก่น', cat:'สต๊อก/จัดแสดง', severity:'สูง', sevClass:'tag-warning', status:'กำลังแก้', stClass:'tag-info', progress:40, reporter:'จรัญ', time:'1 วัน', comments:2, photos:1 },
        { id:4, title:'ประตูโชว์มีรอยขีดข่วน', desc:'ประตูไม้สักตัวโชว์มีรอยขีดข่วน 2 จุด', branch:'HomePro เชียงใหม่', cat:'สินค้าเสียหาย', severity:'ปานกลาง', sevClass:'tag-gray', status:'เปิดใหม่', stClass:'tag-primary', progress:0, reporter:'สุดา', time:'3 ชม.', comments:0, photos:2 },
        { id:5, title:'ราคาไม่ตรงกับป้าย 3 รายการ', desc:'วงกบ WPC ราคาระบบ 1490 แต่ป้าย 1590', branch:'DoHome บางบัวทอง', cat:'สต๊อก/จัดแสดง', severity:'ปานกลาง', sevClass:'tag-gray', status:'เปิดใหม่', stClass:'tag-primary', progress:0, reporter:'มานี', time:'30 นาที', comments:1, photos:1 },
    ];

    return problems.map(p => `
        <div class="wf-card type-problem" onclick="showProblemDetail(${p.id})" style="border-left-color:${p.severity==='เร่งด่วน'?'var(--danger)':p.severity==='สูง'?'var(--warning)':'var(--gray-300)'}">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px">
                <div class="wf-title">${p.title}</div>
                <span class="tag ${p.sevClass}">${p.severity}</span>
            </div>
            <div class="wf-desc">${p.desc}</div>
            <div style="display:flex;gap:6px;margin:8px 0;flex-wrap:wrap">
                <span class="tag ${p.stClass}">${p.status}</span>
                <span class="tag tag-gray">${p.cat}</span>
            </div>
            ${p.progress > 0 ? `<div style="display:flex;align-items:center;gap:8px;margin:6px 0">
                <div class="progress" style="flex:1"><div class="progress-bar ${p.progress>=60?'green':'amber'}" style="width:${p.progress}%"></div></div>
                <span style="font-size:11px;font-weight:700">${p.progress}%</span></div>` : ''}
            <div class="wf-meta">
                <span><i class="fas fa-store"></i> ${p.branch}</span>
                <span><i class="fas fa-user"></i> ${p.reporter}</span>
                <span><i class="fas fa-clock"></i> ${p.time}</span>
                <span><i class="fas fa-comment"></i> ${p.comments}</span>
                <span><i class="fas fa-camera"></i> ${p.photos}</span>
            </div>
        </div>`).join('');
}

function showProblemDetail(id) {
    showModal('ปัญหา #' + id + ' - ป้ายโปรโมชั่นหมดอายุ', `
        <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
            <span class="tag tag-danger">เร่งด่วน</span>
            <span class="tag tag-warning">รับทราบ</span>
            <span class="tag tag-gray">โปรโมชั่น</span>
        </div>
        <p style="font-size:13px;color:var(--gray-600);margin-bottom:12px">ป้ายลด 30% หมดอายุ 31 ม.ค. แต่ยังติดอยู่ ลูกค้าสอบถามแต่ไม่ได้ราคาลด ทำให้เกิดปัญหา</p>
        <div style="display:flex;gap:6px;margin-bottom:16px">
            <div style="width:100px;height:80px;background:var(--gray-200);border-radius:8px;display:flex;align-items:center;justify-content:center"><i class="fas fa-image" style="font-size:24px;color:var(--gray-400)"></i></div>
            <div style="width:100px;height:80px;background:var(--gray-200);border-radius:8px;display:flex;align-items:center;justify-content:center"><i class="fas fa-image" style="font-size:24px;color:var(--gray-400)"></i></div>
        </div>
        <div style="display:flex;gap:20px;font-size:13px;color:var(--gray-600);margin-bottom:16px">
            <span><i class="fas fa-store"></i> Mega Bangna</span>
            <span><i class="fas fa-user"></i> แจ้งโดย: พรทิพย์</span>
            <span><i class="fas fa-user-check"></i> มอบหมาย: สมชาย</span>
        </div>
        <h4 style="font-size:14px;margin-bottom:8px"><i class="fas fa-comments"></i> ความคิดเห็น</h4>
        <div style="background:var(--gray-50);border-radius:8px;padding:12px;margin-bottom:12px">
            <div class="chat-msg" style="margin-bottom:8px">
                <div style="width:24px;height:24px;border-radius:50%;background:var(--accent);font-size:9px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0">พร</div>
                <div class="chat-bubble" style="font-size:12px">ป้ายยังติดอยู่ ลูกค้าถามราคาลดแต่ไม่ได้ ต้องแก้ด่วน</div>
            </div>
            <div class="chat-msg" style="margin-bottom:8px">
                <div style="width:24px;height:24px;border-radius:50%;background:var(--primary);color:white;font-size:9px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0">สม</div>
                <div class="chat-bubble" style="font-size:12px">รับทราบ จะไปถอดป้ายพรุ่งนี้เช้า</div>
            </div>
        </div>
        <div style="display:flex;gap:8px">
            <input type="text" class="form-control" placeholder="เพิ่มความเห็น...">
            <button class="btn btn-primary btn-sm"><i class="fas fa-paper-plane"></i></button>
            <button class="btn btn-outline btn-sm" title="แนบรูป"><i class="fas fa-camera"></i></button>
        </div>
    `, '<button class="btn btn-outline" onclick="closeModal()">ปิด</button><button class="btn btn-success" onclick="showToast(\'อัปเดตแล้ว\');closeModal()">อัปเดตสถานะ</button>');
}

function showReportProblem() {
    showModal('แจ้งปัญหาใหม่', `
        <div class="form-group"><label class="form-label">หัวข้อปัญหา *</label><input type="text" class="form-control" placeholder="เช่น ป้ายราคาไม่ตรง สาขาบางนา"></div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">หมวด</label>
                <select class="form-control"><option>สต๊อก/จัดแสดง</option><option>โปรโมชั่น</option><option>สินค้าเสียหาย</option><option>ลูกค้าร้องเรียน</option><option>พนักงาน</option><option>อื่นๆ</option></select></div>
            <div class="form-group"><label class="form-label">ความเร่งด่วน</label>
                <select class="form-control"><option>เร่งด่วน</option><option selected>สูง</option><option>ปานกลาง</option><option>ต่ำ</option></select></div>
        </div>
        <div class="form-group"><label class="form-label">รายละเอียด</label><textarea class="form-control" rows="3" placeholder="อธิบายปัญหาที่พบ..."></textarea></div>
        <div class="form-group"><label class="form-label">สาขา</label>
            <select class="form-control"><option>HomePro เอกมัย-รามอินทรา</option><option>DoHome บางบัวทอง</option><option>BnB พระราม2</option></select></div>
        <div class="form-group">
            <label class="form-label"><i class="fas fa-camera"></i> แนบรูปถ่าย</label>
            <input type="file" class="form-control" accept="image/*" multiple capture="environment">
            <p style="font-size:11px;color:var(--gray-400);margin-top:4px">รองรับถ่ายรูปจากกล้องมือถือโดยตรง</p>
        </div>
    `, '<button class="btn btn-outline" onclick="closeModal()">ยกเลิก</button><button class="btn btn-danger" onclick="showToast(\'แจ้งปัญหาเรียบร้อย!\');closeModal()"><i class="fas fa-check"></i> แจ้งปัญหา</button>');
}
