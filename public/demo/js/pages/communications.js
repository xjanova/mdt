/* Communications Center */
function renderCommunications(role) {
    const c = document.getElementById('contentArea');
    c.innerHTML = `
    <div style="margin-bottom:16px"><button class="btn btn-primary" onclick="showNewMessage()"><i class="fas fa-pen"></i> เขียนข้อความใหม่</button></div>
    <div class="filter-bar">
        <div class="form-group"><label class="form-label">ประเภท</label>
            <select class="form-control"><option>ทั้งหมด</option><option>ประกาศ</option><option>ร้องขอ</option><option>ประสานงาน</option><option>ข้อเสนอแนะ</option></select></div>
        <div class="form-group" style="align-self:end"><button class="btn btn-primary"><i class="fas fa-search"></i></button></div>
    </div>
    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr)">
        <div class="stat-card"><div class="stat-icon" style="background:var(--primary)"><i class="fas fa-envelope"></i></div><div><div class="stat-value">8</div><div class="stat-label">ทั้งหมด</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--info)"><i class="fas fa-bullhorn"></i></div><div><div class="stat-value">3</div><div class="stat-label">ประกาศ</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--accent)"><i class="fas fa-handshake"></i></div><div><div class="stat-value">3</div><div class="stat-label">ประสานงาน</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--success)"><i class="fas fa-comment-dots"></i></div><div><div class="stat-value">2</div><div class="stat-label">ข้อเสนอแนะ</div></div></div>
    </div>
    <div class="card">
        <div class="card-body" style="padding:0">
            ${getCommCards()}
        </div>
    </div>`;
}

function getCommCards() {
    const comms = [
        { id:1, subject:'แคมเปญ Home Expo 2026 เริ่มสัปดาห์หน้า', type:'ประกาศ', typeClass:'tag-info', from:'ส่วนกลาง', to:'ทุกสาขา', status:'ส่งแล้ว', stClass:'tag-success', time:'2 ชม.', replies:0 },
        { id:2, subject:'ขอโอนสต๊อกประตู HDF จาก เชียงใหม่ ไป ขอนแก่น', type:'ประสานงาน', typeClass:'tag-warning', from:'สมชาย (Supervisor)', to:'เชียงใหม่, ขอนแก่น', status:'ตอบแล้ว', stClass:'tag-primary', time:'1 วัน', replies:3 },
        { id:3, subject:'ลูกค้าชมโชว์รูมใหม่ที่สาขาภูเก็ต', type:'ข้อเสนอแนะ', typeClass:'tag-success', from:'มานี (PC)', to:'ส่วนกลาง', status:'อ่านแล้ว', stClass:'tag-gray', time:'2 วัน', replies:1 },
        { id:4, subject:'นโยบายราคาใหม่ประจำเดือน ก.พ. 2569', type:'ประกาศ', typeClass:'tag-info', from:'ส่วนกลาง', to:'ทุก PC', status:'ส่งแล้ว', stClass:'tag-success', time:'5 วัน', replies:0 },
        { id:5, subject:'ขอตัวอย่าง display จากสาขาเอกมัย', type:'ประสานงาน', typeClass:'tag-warning', from:'จรัญ (PC พัทยา)', to:'พรทิพย์ (PC เอกมัย)', status:'รอตอบ', stClass:'tag-warning', time:'3 ชม.', replies:0 },
    ];
    return comms.map(m => `
        <div style="padding:14px 20px;border-bottom:1px solid var(--gray-100);cursor:pointer;transition:background .15s;display:flex;gap:12px;align-items:start"
            onmouseenter="this.style.background='var(--gray-50)'" onmouseleave="this.style.background=''" onclick="showCommDetail(${m.id})">
            <div style="width:36px;height:36px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">
                <i class="fas fa-${m.type==='ประกาศ'?'bullhorn':m.type==='ประสานงาน'?'handshake':'comment-dots'}"></i></div>
            <div style="flex:1;min-width:0">
                <div style="display:flex;justify-content:space-between;align-items:start">
                    <strong style="font-size:14px">${m.subject}</strong>
                    <span style="font-size:11px;color:var(--gray-400);white-space:nowrap;margin-left:8px">${m.time}</span>
                </div>
                <div style="font-size:12px;color:var(--gray-500);margin-top:2px">จาก: ${m.from} → ${m.to}</div>
                <div style="display:flex;gap:6px;margin-top:6px">
                    <span class="tag ${m.typeClass}">${m.type}</span>
                    <span class="tag ${m.stClass}">${m.status}</span>
                    ${m.replies > 0 ? `<span class="tag tag-gray"><i class="fas fa-reply"></i> ${m.replies}</span>` : ''}
                </div>
            </div>
        </div>`).join('');
}

function showCommDetail(id) {
    showModal('ข้อความ #' + id, `
        <h4 style="margin-bottom:8px">แคมเปญ Home Expo 2026 เริ่มสัปดาห์หน้า</h4>
        <div style="display:flex;gap:6px;margin-bottom:12px"><span class="tag tag-info">ประกาศ</span><span class="tag tag-success">ส่งแล้ว</span></div>
        <p style="font-size:13px;color:var(--gray-600);margin-bottom:16px;line-height:1.8">
            เรียนทุกสาขา<br><br>
            แคมเปญ Home Expo 2026 จะเริ่มตั้งแต่วันที่ 20 ก.พ. - 5 มี.ค. 2569 ขอให้ทุกสาขาเตรียมสต๊อกและจัดโชว์รูมให้พร้อม<br><br>
            สินค้าโปรโมชั่นหลัก: ประตู UPVC BN-01, ประตูห้องน้ำ PVC BW, วงกบ UPVC<br>
            ส่วนลดสูงสุด 30%<br><br>
            ขอบคุณครับ
        </p>
        <div style="display:flex;gap:8px;margin-top:12px">
            <input type="text" class="form-control" placeholder="ตอบกลับ...">
            <button class="btn btn-primary btn-sm" onclick="showToast('ส่งแล้ว')"><i class="fas fa-paper-plane"></i></button>
        </div>
    `, '<button class="btn btn-outline" onclick="closeModal()">ปิด</button>');
}

function showNewMessage() {
    showModal('เขียนข้อความใหม่', `
        <div class="form-group"><label class="form-label">หัวข้อ *</label><input type="text" class="form-control" placeholder="หัวข้อข้อความ"></div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">ประเภท</label>
                <select class="form-control"><option>ประกาศ</option><option>ร้องขอ</option><option>ประสานงาน</option><option>ข้อเสนอแนะ</option></select></div>
            <div class="form-group"><label class="form-label">ส่งถึง</label>
                <select class="form-control" multiple style="height:80px"><option>ทุกสาขา</option><option>HomePro เอกมัย</option><option>DoHome บางบัวทอง</option><option>BnB พระราม2</option></select></div>
        </div>
        <div class="form-group"><label class="form-label">เนื้อหา</label><textarea class="form-control" rows="5" placeholder="เนื้อหาข้อความ..."></textarea></div>
        <div class="form-group"><label class="form-label">แนบไฟล์</label><input type="file" class="form-control" multiple></div>
    `, '<button class="btn btn-outline" onclick="closeModal()">ยกเลิก</button><button class="btn btn-primary" onclick="showToast(\'ส่งข้อความเรียบร้อย!\');closeModal()"><i class="fas fa-paper-plane"></i> ส่ง</button>');
}
