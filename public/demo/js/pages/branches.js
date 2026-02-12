/* Branches Page */
function renderBranches(role) {
    const c = document.getElementById('contentArea');
    const branches = [
        { name:'HomePro เอกมัย-รามอินทรา', store:'HomePro', region:'กลาง', emp:3, attn:3, sales:891000, problems:1, wf:2, phone:'02-xxx-xxxx' },
        { name:'HomePro พัทยา', store:'HomePro', region:'ตะวันออก', emp:2, attn:2, sales:672000, problems:0, wf:1, phone:'038-xxx-xxx' },
        { name:'DoHome บางบัวทอง', store:'DoHome', region:'กลาง', emp:3, attn:2, sales:756000, problems:1, wf:1, phone:'02-xxx-xxxx' },
        { name:'DoHome ขอนแก่น', store:'DoHome', region:'อีสาน', emp:2, attn:2, sales:472000, problems:1, wf:0, phone:'043-xxx-xxx' },
        { name:'BnB พระราม2', store:'BnB Home', region:'กลาง', emp:2, attn:2, sales:567000, problems:0, wf:1, phone:'02-xxx-xxxx' },
        { name:'BnB ระยอง', store:'BnB Home', region:'ตะวันออก', emp:1, attn:1, sales:373000, problems:0, wf:0, phone:'038-xxx-xxx' },
        { name:'MegaHome รังสิต', store:'MegaHome', region:'กลาง', emp:2, attn:1, sales:450000, problems:1, wf:1, phone:'02-xxx-xxxx' },
        { name:'MegaHome บ่อวิน', store:'MegaHome', region:'ตะวันออก', emp:2, attn:2, sales:380000, problems:0, wf:0, phone:'038-xxx-xxx' },
    ];
    c.innerHTML = `
    <div class="filter-bar">
        <div class="form-group"><label class="form-label">ห้าง</label>
            <select class="form-control"><option>ทุกห้าง</option><option>HomePro</option><option>DoHome</option><option>BnB Home</option><option>MegaHome</option></select></div>
        <div class="form-group"><label class="form-label">ภาค</label>
            <select class="form-control"><option>ทุกภาค</option><option>กลาง</option><option>ตะวันออก</option><option>เหนือ</option><option>อีสาน</option><option>ใต้</option></select></div>
        <div class="form-group" style="align-self:end"><button class="btn btn-primary"><i class="fas fa-search"></i></button></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px">
        ${branches.map(b => `
        <div class="card" style="cursor:pointer" onclick="showBranchDetail('${b.name}')">
            <div class="card-body">
                <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
                    <div><strong style="font-size:15px">${b.name}</strong><br><span style="font-size:12px;color:var(--gray-500)">${b.store}</span></div>
                    <span class="tag tag-primary">${b.region}</span>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;color:var(--gray-600)">
                    <div><i class="fas fa-users" style="color:var(--primary);width:16px"></i> พนักงาน: <strong>${b.emp}</strong></div>
                    <div><i class="fas fa-user-check" style="color:var(--success);width:16px"></i> มาวันนี้: <strong>${b.attn}</strong></div>
                    <div><i class="fas fa-baht-sign" style="color:var(--accent);width:16px"></i> ยอดเดือนนี้: <strong>${fmtMoney(b.sales)}</strong></div>
                    <div><i class="fas fa-exclamation" style="color:var(--danger);width:16px"></i> ปัญหา: <strong>${b.problems}</strong></div>
                    <div><i class="fas fa-diagram-project" style="color:var(--info);width:16px"></i> โฟลงาน: <strong>${b.wf}</strong></div>
                    <div><i class="fas fa-phone" style="color:var(--gray-400);width:16px"></i> ${b.phone}</div>
                </div>
            </div>
        </div>`).join('')}
    </div>`;
}

function showBranchDetail(name) {
    showModal('สาขา: ' + name, `
        <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:16px">
            <div style="text-align:center;padding:12px;background:var(--gray-50);border-radius:8px">
                <div style="font-size:20px;font-weight:700;color:var(--primary)">3</div><div style="font-size:11px;color:var(--gray-500)">พนักงาน</div></div>
            <div style="text-align:center;padding:12px;background:var(--gray-50);border-radius:8px">
                <div style="font-size:20px;font-weight:700;color:var(--success)">${fmtMoney(891000)}</div><div style="font-size:11px;color:var(--gray-500)">ยอดขาย</div></div>
            <div style="text-align:center;padding:12px;background:var(--gray-50);border-radius:8px">
                <div style="font-size:20px;font-weight:700;color:var(--danger)">1</div><div style="font-size:11px;color:var(--gray-500)">ปัญหาค้าง</div></div>
        </div>
        <h4 style="font-size:14px;margin-bottom:8px">พนักงานประจำสาขา</h4>
        <table class="data-table">
            <thead><tr><th>ชื่อ</th><th>ตำแหน่ง</th><th>วันนี้</th></tr></thead>
            <tbody>
                <tr><td>พรทิพย์ สวยงาม</td><td>PC</td><td><span class="tag tag-success">ทำงาน</span></td></tr>
                <tr><td>สมชาย ใจดี</td><td>Supervisor</td><td><span class="tag tag-success">ทำงาน</span></td></tr>
                <tr><td>มานี รักเรียน</td><td>PC</td><td><span class="tag tag-info">ลา</span></td></tr>
            </tbody>
        </table>
    `, '<button class="btn btn-outline" onclick="closeModal()">ปิด</button>');
}
