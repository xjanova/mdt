/* Workflows / Task Assignment Page */
function renderWorkflows(role) {
    const c = document.getElementById('contentArea');
    if (role === 'seller' || role === 'employee') {
        c.innerHTML = getWorkflowsMyTasks(role);
    } else {
        const isCreator = (role === 'admin' || role === 'supervisor');
        c.innerHTML = `
        ${isCreator ? `<div style="margin-bottom:16px;display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-primary" onclick="showCreateWorkflow()"><i class="fas fa-plus"></i> สร้างโฟลงานใหม่</button>
            <button class="btn btn-accent" onclick="showCreateWorkflow('problem')"><i class="fas fa-wrench"></i> สร้างโฟลแก้ปัญหา</button>
            ${role === 'admin' ? '<button class="btn btn-outline" onclick="showCreateWorkflow(\'cross\')"><i class="fas fa-arrows-alt-h"></i> ประสานงานข้ามสาขา</button>' : ''}
        </div>` : ''}

        <div class="filter-bar">
            <div class="form-group"><label class="form-label">ประเภท</label>
                <select class="form-control"><option>ทั้งหมด</option><option>มอบหมายงาน</option><option>แก้ปัญหา</option><option>โปรโมชั่น</option><option>โปรเจค</option><option>ข้ามสาขา</option></select>
            </div>
            <div class="form-group"><label class="form-label">สถานะ</label>
                <select class="form-control"><option>ทั้งหมด</option><option>รอดำเนินการ</option><option>กำลังทำ</option><option>เสร็จสิ้น</option><option>เลยกำหนด</option></select>
            </div>
            <div class="form-group"><label class="form-label">ค้นหา</label>
                <input type="text" class="form-control" placeholder="ชื่อโฟล หรือ ผู้รับผิดชอบ...">
            </div>
            <div class="form-group" style="align-self:end"><button class="btn btn-primary"><i class="fas fa-search"></i></button></div>
        </div>

        <div class="stats-grid" style="grid-template-columns:repeat(5,1fr)">
            <div class="stat-card"><div class="stat-icon" style="background:var(--primary)"><i class="fas fa-layer-group"></i></div><div><div class="stat-value">${role==='admin'?'12':'8'}</div><div class="stat-label">ทั้งหมด</div></div></div>
            <div class="stat-card"><div class="stat-icon" style="background:var(--info)"><i class="fas fa-spinner"></i></div><div><div class="stat-value">${role==='admin'?'6':'4'}</div><div class="stat-label">กำลังทำ</div></div></div>
            <div class="stat-card"><div class="stat-icon" style="background:var(--success)"><i class="fas fa-check"></i></div><div><div class="stat-value">${role==='admin'?'4':'3'}</div><div class="stat-label">เสร็จสิ้น</div></div></div>
            <div class="stat-card"><div class="stat-icon" style="background:var(--danger)"><i class="fas fa-clock"></i></div><div><div class="stat-value">1</div><div class="stat-label">เลยกำหนด</div></div></div>
            <div class="stat-card"><div class="stat-icon" style="background:var(--warning)"><i class="fas fa-pause"></i></div><div><div class="stat-value">1</div><div class="stat-label">รอเริ่ม</div></div></div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:16px" id="workflowList">
            ${getWorkflowCards(role)}
        </div>`;
    }
}

function getWorkflowsMyTasks(role) {
    const name = role === 'seller' ? 'พรทิพย์' : 'จรัญ';
    return `
    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="stat-card"><div class="stat-icon" style="background:var(--info)"><i class="fas fa-spinner"></i></div><div><div class="stat-value">2</div><div class="stat-label">กำลังทำ</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--success)"><i class="fas fa-check"></i></div><div><div class="stat-value">3</div><div class="stat-label">เสร็จสิ้น</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--warning)"><i class="fas fa-pause"></i></div><div><div class="stat-value">1</div><div class="stat-label">รอเริ่ม</div></div></div>
    </div>

    <h3 style="font-size:16px;font-weight:700;margin-bottom:12px"><i class="fas fa-tasks" style="color:var(--info);margin-right:6px"></i> งานที่ได้รับมอบหมาย</h3>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px">
        <div class="wf-card type-problem" onclick="showWorkflowDetail(1)">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
                <div class="wf-title">ตรวจสอบราคาป้ายให้ตรงกับระบบ</div>
                <span class="tag tag-warning">สูง</span>
            </div>
            <div class="wf-desc">แก้ไขราคาที่ไม่ตรง 3 รายการ</div>
            <div style="display:flex;gap:6px;margin:8px 0"><span class="tag tag-info">กำลังทำ</span><span class="tag tag-primary">มอบหมายงาน</span></div>
            <div style="display:flex;align-items:center;gap:8px;margin:8px 0">
                <div class="progress" style="flex:1"><div class="progress-bar amber" style="width:50%"></div></div>
                <span style="font-size:12px;font-weight:700;color:var(--gray-600)">50%</span>
            </div>
            <div class="wf-meta">
                <span><i class="fas fa-user"></i> มอบหมายโดย: สมชาย</span>
                <span><i class="fas fa-calendar"></i> กำหนด 14 ก.พ.</span>
            </div>
        </div>

        <div class="wf-card type-task" onclick="showWorkflowDetail(6)">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
                <div class="wf-title">ถ่ายรูปตัวโชว์ประตู ANYHOME รุ่นใหม่</div>
                <span class="tag tag-gray">ต่ำ</span>
            </div>
            <div class="wf-desc">ถ่ายรูปส่งรายงานส่วนกลาง</div>
            <div style="display:flex;gap:6px;margin:8px 0"><span class="tag tag-gray">รอเริ่ม</span><span class="tag tag-primary">มอบหมายงาน</span></div>
            <div style="display:flex;align-items:center;gap:8px;margin:8px 0">
                <div class="progress" style="flex:1"><div class="progress-bar red" style="width:0%"></div></div>
                <span style="font-size:12px;font-weight:700;color:var(--gray-600)">0%</span>
            </div>
            <div class="wf-meta">
                <span><i class="fas fa-user"></i> มอบหมายโดย: สมชาย</span>
                <span><i class="fas fa-calendar"></i> กำหนด 16 ก.พ.</span>
            </div>
        </div>

        ${role === 'employee' ? `
        <div class="wf-card type-task" onclick="showWorkflowDetail(7)">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
                <div class="wf-title">ตรวจสอบสต๊อกประตูห้องน้ำ</div>
                <span class="tag tag-warning">สูง</span>
            </div>
            <div class="wf-desc">นับสต๊อกจริงและรายงานผล</div>
            <div style="display:flex;gap:6px;margin:8px 0"><span class="tag tag-info">กำลังทำ</span><span class="tag tag-primary">มอบหมายงาน</span></div>
            <div style="display:flex;align-items:center;gap:8px;margin:8px 0">
                <div class="progress" style="flex:1"><div class="progress-bar blue" style="width:20%"></div></div>
                <span style="font-size:12px;font-weight:700;color:var(--gray-600)">20%</span>
            </div>
            <div class="wf-meta">
                <span><i class="fas fa-user"></i> มอบหมายโดย: สมชาย</span>
                <span><i class="fas fa-calendar"></i> กำหนด 14 ก.พ.</span>
            </div>
        </div>` : ''}
    </div>

    <h3 style="font-size:16px;font-weight:700;margin:24px 0 12px"><i class="fas fa-check-circle" style="color:var(--success);margin-right:6px"></i> งานที่เสร็จแล้ว</h3>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px">
        <div class="wf-card type-task" style="opacity:0.7">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
                <div class="wf-title">ตรวจราคาป้ายทุกสาขา HomePro</div>
                <span class="tag tag-success">เสร็จสิ้น</span>
            </div>
            <div class="wf-desc">ตรวจสอบว่าป้ายราคาตรงกับระบบ</div>
            <div style="display:flex;align-items:center;gap:8px;margin:8px 0">
                <div class="progress" style="flex:1"><div class="progress-bar green" style="width:100%"></div></div>
                <span style="font-size:12px;font-weight:700;color:var(--success)">100%</span>
            </div>
            <div class="wf-meta"><span><i class="fas fa-calendar"></i> เสร็จ 10 ก.พ.</span></div>
        </div>
    </div>`;
}

function getWorkflowCards(role) {
    const workflows = [
        { id:1, title:'แก้ปัญหาสต๊อกไม่ตรง Mega Bangna', desc:'ประตู UPVC BN-01 สต๊อกในระบบ 15 แต่นับได้ 8', type:'problem', priority:'เร่งด่วน', priorityClass:'tag-danger', progress:30, assignee:'สมชาย', branch:'Mega Bangna', deadline:'15 ก.พ.', steps:'2/5', status:'กำลังทำ' },
        { id:2, title:'โปรโมชั่นประตูไม้สัก 30% - Central Ladprao', desc:'จัดโปรโมชั่นลด 30% ประตูไม้สัก', type:'promo', priority:'ปานกลาง', priorityClass:'tag-warning', progress:60, assignee:'พรทิพย์', branch:'Central Ladprao', deadline:'20 ก.พ.', steps:'3/5', status:'กำลังทำ' },
        { id:3, title:'โอนสต๊อกข้ามสาขา เชียงใหม่ > ขอนแก่น', desc:'โอนประตู HDF 20 บาน', type:'cross', priority:'สูง', priorityClass:'tag-warning', progress:20, assignee:'วิชัย', branch:'ข้ามสาขา', deadline:'18 ก.พ.', steps:'1/4', status:'กำลังทำ' },
        { id:4, title:'เปิดโซนโชว์รูมใหม่ - Central Phuket', desc:'จัดวางตัวโชว์ประตู UPVC รุ่นใหม่', type:'project', priority:'ปานกลาง', priorityClass:'tag-gray', progress:45, assignee:'มานี', branch:'Central Phuket', deadline:'25 ก.พ.', steps:'3/6', status:'กำลังทำ' },
        { id:5, title:'ตรวจราคาป้ายทุกสาขา HomePro', desc:'ตรวจสอบว่าป้ายราคาตรงกับระบบ', type:'task', priority:'ปานกลาง', priorityClass:'tag-gray', progress:100, assignee:'ทุก PC', branch:'ทุกสาขา', deadline:'10 ก.พ.', steps:'5/5', status:'เสร็จสิ้น' },
        { id:6, title:'ถ่ายรูปตัวโชว์ประตูรุ่นใหม่ ANYHOME', desc:'ถ่ายรูปส่งรายงานส่วนกลาง', type:'task', priority:'ต่ำ', priorityClass:'tag-gray', progress:0, assignee:'พรทิพย์', branch:'HomePro เอกมัย', deadline:'16 ก.พ.', steps:'0/3', status:'รอเริ่ม' },
    ];

    return workflows.map(w => {
        const typeMap = { problem:'type-problem', promo:'type-promo', cross:'type-cross', project:'type-project', task:'type-task' };
        const typeLabel = { problem:'แก้ปัญหา', promo:'โปรโมชั่น', cross:'ข้ามสาขา', project:'โปรเจค', task:'มอบหมายงาน' };
        const barColor = w.progress >= 100 ? 'green' : w.progress >= 50 ? 'blue' : w.progress > 0 ? 'amber' : 'red';
        const statusTag = w.progress >= 100 ? 'tag-success' : 'tag-info';
        return `
        <div class="wf-card ${typeMap[w.type]}" onclick="showWorkflowDetail(${w.id})">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
                <div class="wf-title">${w.title}</div>
                <span class="tag ${w.priorityClass}">${w.priority}</span>
            </div>
            <div class="wf-desc">${w.desc}</div>
            <div style="display:flex;gap:6px;margin:8px 0;flex-wrap:wrap">
                <span class="tag tag-primary">${typeLabel[w.type]}</span>
                <span class="tag ${statusTag}">${w.status}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin:8px 0">
                <div class="progress" style="flex:1"><div class="progress-bar ${barColor}" style="width:${w.progress}%"></div></div>
                <span style="font-size:12px;font-weight:700;color:var(--gray-600)">${w.progress}%</span>
            </div>
            <div class="wf-meta">
                <span><i class="fas fa-user"></i> ${w.assignee}</span>
                <span><i class="fas fa-store"></i> ${w.branch}</span>
                <span><i class="fas fa-calendar"></i> ${w.deadline}</span>
                <span><i class="fas fa-list-ol"></i> ${w.steps}</span>
            </div>
        </div>`;
    }).join('');
}

function showWorkflowDetail(id) {
    showModal('รายละเอียดโฟลงาน #' + id, `
        <div style="margin-bottom:16px">
            <h4 style="font-size:16px;margin-bottom:8px">แก้ปัญหาสต๊อกไม่ตรง Mega Bangna</h4>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
                <span class="tag tag-danger">เร่งด่วน</span>
                <span class="tag tag-primary">แก้ปัญหา</span>
                <span class="tag tag-info">กำลังทำ</span>
            </div>
            <p style="font-size:13px;color:var(--gray-600)">ประตู UPVC BN-01 สต๊อกในระบบ 15 ตัว แต่นับจริงได้ 8 ตัว ต้องตรวจสอบหาสาเหตุและแก้ไข</p>
        </div>

        <h4 style="font-size:14px;font-weight:700;margin-bottom:8px"><i class="fas fa-list-check"></i> ขั้นตอนการทำงาน</h4>
        <div class="timeline">
            <div class="timeline-item">
                <div class="timeline-dot done"></div>
                <div class="timeline-date">10 ก.พ. 2569 - สมชาย</div>
                <div class="timeline-content"><strong>1. ตรวจนับสต๊อกจริง</strong><br><span class="tag tag-success" style="margin-top:4px">เสร็จสิ้น</span></div>
            </div>
            <div class="timeline-item">
                <div class="timeline-dot active"></div>
                <div class="timeline-date">12 ก.พ. 2569 - กำลังทำ</div>
                <div class="timeline-content"><strong>2. ตรวจสอบเอกสารรับ-ส่ง</strong><br><span class="tag tag-info" style="margin-top:4px">กำลังดำเนินการ</span>
                    <div style="margin-top:8px">
                        <div class="photo-grid">
                            <div style="width:60px;height:60px;background:var(--gray-200);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--gray-400)"><i class="fas fa-image"></i></div>
                            <div style="width:60px;height:60px;background:var(--gray-200);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--gray-400)"><i class="fas fa-image"></i></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content"><strong>3. รายงานผลให้หัวหน้า</strong><br><span class="tag tag-gray" style="margin-top:4px">รอ</span></div>
            </div>
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content"><strong>4. หัวหน้าตรวจสอบและรับทราบ</strong><br><span class="tag tag-gray" style="margin-top:4px">รอ</span></div>
            </div>
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content"><strong>5. ปรับปรุงระบบสต๊อกให้ถูกต้อง</strong><br><span class="tag tag-gray" style="margin-top:4px">รอ</span></div>
            </div>
        </div>

        <h4 style="font-size:14px;font-weight:700;margin:16px 0 8px"><i class="fas fa-comments"></i> ความคิดเห็น</h4>
        <div class="chat-box" style="max-height:200px;background:var(--gray-50);border-radius:8px;padding:12px">
            <div class="chat-msg">
                <div style="width:28px;height:28px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0">สม</div>
                <div class="chat-bubble">นับจริงได้ 8 ตัว ไม่ตรงระบบ 7 ตัว กำลังตรวจเอกสาร</div>
            </div>
            <div class="chat-msg mine">
                <div class="chat-bubble">ขอให้ถ่ายรูปเอกสารส่งมาด้วย</div>
            </div>
        </div>
        <div class="chat-input-area" style="padding:8px 0">
            <input type="text" class="form-control" placeholder="พิมพ์ความเห็น...">
            <button class="btn btn-primary btn-sm" onclick="showToast('ส่งแล้ว')"><i class="fas fa-paper-plane"></i></button>
        </div>
    `, '<button class="btn btn-outline" onclick="closeModal()">ปิด</button><button class="btn btn-primary" onclick="showToast(\'บันทึกแล้ว\');closeModal()">บันทึก</button>');
}

function showCreateWorkflow(type) {
    const typeTitle = type === 'problem' ? 'สร้างโฟลแก้ปัญหา' : type === 'cross' ? 'ประสานงานข้ามสาขา' : 'สร้างโฟลงานใหม่';
    showModal(typeTitle, `
        <div class="form-group">
            <label class="form-label">ชื่อโฟลงาน *</label>
            <input type="text" class="form-control" placeholder="เช่น แก้ปัญหาสต๊อกไม่ตรง สาขาบางนา">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">ประเภท</label>
                <select class="form-control">
                    <option ${type==='problem'?'selected':''}>แก้ปัญหา</option>
                    <option>มอบหมายงาน</option>
                    <option>โปรโมชั่น</option>
                    <option>โปรเจค</option>
                    <option ${type==='cross'?'selected':''}>ข้ามสาขา</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">ความสำคัญ</label>
                <select class="form-control"><option>เร่งด่วน</option><option selected>สูง</option><option>ปานกลาง</option><option>ต่ำ</option></select>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">รายละเอียด</label>
            <textarea class="form-control" rows="3" placeholder="อธิบายรายละเอียดของงาน..."></textarea>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">มอบหมายให้</label>
                <select class="form-control"><option>เลือกพนักงาน</option><option>สมชาย ใจดี</option><option>พรทิพย์ สวยงาม</option><option>มานี รักเรียน</option><option>จรัญ ทำดี</option></select>
            </div>
            <div class="form-group">
                <label class="form-label">สาขา</label>
                <select class="form-control"><option>เลือกสาขา</option><option>HomePro เอกมัย</option><option>DoHome บางบัวทอง</option><option>BnB พระราม2</option></select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">เริ่มต้น</label><input type="date" class="form-control" value="2026-02-13"></div>
            <div class="form-group"><label class="form-label">กำหนดเสร็จ</label><input type="date" class="form-control" value="2026-02-20"></div>
        </div>

        <h4 style="font-size:14px;font-weight:700;margin:16px 0 8px"><i class="fas fa-list-ol"></i> ขั้นตอนการทำงาน</h4>
        <div id="wfSteps">
            <div style="display:flex;gap:8px;margin-bottom:8px;align-items:center">
                <span style="font-weight:700;color:var(--primary)">1.</span>
                <input type="text" class="form-control" placeholder="ขั้นตอนที่ 1 เช่น ตรวจสอบสต๊อก" style="flex:1">
            </div>
            <div style="display:flex;gap:8px;margin-bottom:8px;align-items:center">
                <span style="font-weight:700;color:var(--primary)">2.</span>
                <input type="text" class="form-control" placeholder="ขั้นตอนที่ 2 เช่น ถ่ายรูปรายงาน" style="flex:1">
            </div>
            <div style="display:flex;gap:8px;margin-bottom:8px;align-items:center">
                <span style="font-weight:700;color:var(--primary)">3.</span>
                <input type="text" class="form-control" placeholder="ขั้นตอนที่ 3 เช่น รายงานหัวหน้า" style="flex:1">
            </div>
        </div>
        <button class="btn btn-sm btn-outline" onclick="addWorkflowStep()"><i class="fas fa-plus"></i> เพิ่มขั้นตอน</button>
    `, '<button class="btn btn-outline" onclick="closeModal()">ยกเลิก</button><button class="btn btn-primary" onclick="showToast(\'สร้างโฟลงานเรียบร้อย!\');closeModal()"><i class="fas fa-check"></i> สร้างโฟล</button>');
}

let _stepCount = 3;
function addWorkflowStep() {
    _stepCount++;
    const div = document.createElement('div');
    div.style.cssText = 'display:flex;gap:8px;margin-bottom:8px;align-items:center';
    div.innerHTML = `<span style="font-weight:700;color:var(--primary)">${_stepCount}.</span>
        <input type="text" class="form-control" placeholder="ขั้นตอนที่ ${_stepCount}" style="flex:1">
        <button class="btn btn-sm btn-icon" style="color:var(--danger)" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;
    document.getElementById('wfSteps').appendChild(div);
}
