/* Products / Stock Page - View, Filter, Charts, AI Integration */

let prodCurrentFilter = 'all';
let prodCurrentStore = '';
let prodCurrentBranch = '';
let prodCurrentBrand = '';
let prodSearchText = '';
let prodCurrentPage = 1;
const PROD_PER_PAGE = 20;

function renderProducts(role) {
    const c = document.getElementById('contentArea');
    const data = getProductData();
    const stats = computeProductStats(data);

    c.innerHTML = `
    <!-- Stats Grid -->
    <div class="stats-grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">
        <div class="stat-card" onclick="applyQuickFilter('all')" style="cursor:pointer">
            <div class="stat-icon" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8)"><i class="fas fa-boxes-stacked"></i></div>
            <div><div class="stat-value">${fmtNum(stats.totalRows)}</div><div class="stat-label">สินค้าทั้งหมด</div></div>
        </div>
        <div class="stat-card" onclick="applyQuickFilter('nonMoving')" style="cursor:pointer">
            <div class="stat-icon" style="background:linear-gradient(135deg,#ef4444,#dc2626)"><i class="fas fa-ban"></i></div>
            <div><div class="stat-value">${fmtNum(stats.nonMoving)}</div><div class="stat-label">ไม่เคลื่อนไหว</div><div class="stat-change down">> 90 วัน</div></div>
        </div>
        <div class="stat-card" onclick="applyQuickFilter('belowMin')" style="cursor:pointer">
            <div class="stat-icon" style="background:linear-gradient(135deg,#f59e0b,#d97706)"><i class="fas fa-arrow-down"></i></div>
            <div><div class="stat-value">${fmtNum(stats.belowMin)}</div><div class="stat-label">ต่ำกว่า Min</div></div>
        </div>
        <div class="stat-card" onclick="applyQuickFilter('noDisplay')" style="cursor:pointer">
            <div class="stat-icon" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed)"><i class="fas fa-eye-slash"></i></div>
            <div><div class="stat-value">${fmtNum(stats.noDisplay)}</div><div class="stat-label">ไม่มีตัวโชว์</div></div>
        </div>
        <div class="stat-card" onclick="applyQuickFilter('deadStock')" style="cursor:pointer">
            <div class="stat-icon" style="background:linear-gradient(135deg,#6b7280,#374151)"><i class="fas fa-warehouse"></i></div>
            <div><div class="stat-value">${fmtNum(stats.deadStock)}</div><div class="stat-label">ค้างสต๊อก</div><div class="stat-change down">มีสต๊อก ขาย 0</div></div>
        </div>
    </div>

    ${!data.isReal ? `
    <div style="padding:12px 16px;background:#fef9c3;border-radius:8px;border-left:4px solid var(--warning);margin-bottom:16px;font-size:13px">
        <i class="fas fa-info-circle" style="color:var(--warning)"></i>
        <strong>ใช้ข้อมูลตัวอย่าง</strong> — กรุณา<a href="#" onclick="loadPage('import');return false" style="color:var(--primary);font-weight:600">นำเข้าจาก Excel</a> เพื่อดูข้อมูลจริง
    </div>` : `
    <div style="padding:8px 16px;background:#dcfce7;border-radius:8px;border-left:4px solid var(--success);margin-bottom:16px;font-size:12px;display:flex;justify-content:space-between;align-items:center">
        <span><i class="fas fa-database" style="color:var(--success)"></i> ข้อมูลจาก Excel (อัพเดท: ${new Date(data.lastImport).toLocaleDateString('th-TH')})</span>
        <button class="btn btn-sm btn-outline" onclick="loadPage('import')"><i class="fas fa-file-import"></i> นำเข้าเพิ่ม</button>
    </div>`}

    <!-- Filter Bar -->
    <div class="filter-bar">
        <div class="form-group" style="min-width:120px">
            <label class="form-label">ห้าง</label>
            <select class="form-control" id="prodFilterStore" onchange="prodCurrentStore=this.value;prodCurrentPage=1;refreshProductTable()">
                <option value="">ทุกห้าง</option>
                ${stats.stores.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
        </div>
        <div class="form-group" style="min-width:150px">
            <label class="form-label">สาขา</label>
            <select class="form-control" id="prodFilterBranch" onchange="prodCurrentBranch=this.value;prodCurrentPage=1;refreshProductTable()">
                <option value="">ทุกสาขา</option>
                ${stats.branches.map(b => `<option value="${b}">${b}</option>`).join('')}
            </select>
        </div>
        <div class="form-group" style="min-width:120px">
            <label class="form-label">แบรนด์</label>
            <select class="form-control" id="prodFilterBrand" onchange="prodCurrentBrand=this.value;prodCurrentPage=1;refreshProductTable()">
                <option value="">ทุกแบรนด์</option>
                ${stats.brands.map(b => `<option value="${b}">${b}</option>`).join('')}
            </select>
        </div>
        <div class="form-group" style="flex:2;min-width:180px">
            <label class="form-label">ค้นหา</label>
            <input class="form-control" placeholder="รหัสสินค้า, ชื่อ..." id="prodSearch" oninput="prodSearchText=this.value;prodCurrentPage=1;refreshProductTable()">
        </div>
    </div>

    <!-- Quick Filter Buttons + Charts -->
    <div class="grid-2" style="margin-bottom:20px">
        <div class="card" style="margin-bottom:0">
            <div class="card-header"><h3 style="font-size:14px"><i class="fas fa-filter" style="color:var(--primary);margin-right:6px"></i> คำสั่งพิเศษ</h3></div>
            <div class="card-body" style="padding:12px">
                <div style="display:flex;flex-direction:column;gap:6px">
                    ${renderQuickFilterBtn('all', 'fa-list', 'สินค้าทั้งหมด', stats.totalRows, 'var(--primary)')}
                    ${renderQuickFilterBtn('nonMoving', 'fa-ban', 'ไม่เคลื่อนไหว (Non-Moving > 90 วัน)', stats.nonMoving, 'var(--danger)')}
                    ${renderQuickFilterBtn('belowMin', 'fa-arrow-down', 'ต่ำกว่า Min Stock', stats.belowMin, 'var(--warning)')}
                    ${renderQuickFilterBtn('deadStock', 'fa-warehouse', 'ค้างสต๊อก (มีสต๊อก ขาย 0)', stats.deadStock, 'var(--gray-600)')}
                    ${renderQuickFilterBtn('noDisplay', 'fa-eye-slash', 'ไม่มีตัวโชว์', stats.noDisplay, '#7c3aed')}
                    ${renderQuickFilterBtn('highSold', 'fa-fire', 'ขายดี (Top 20%)', stats.highSold, 'var(--success)')}
                </div>
            </div>
        </div>

        <div class="card" style="margin-bottom:0">
            <div class="card-header"><h3 style="font-size:14px"><i class="fas fa-chart-pie" style="color:var(--accent);margin-right:6px"></i> สัดส่วนสินค้า</h3></div>
            <div class="card-body" style="padding:12px">
                <div id="prodChartArea">${renderProductCharts(stats)}</div>
            </div>
        </div>
    </div>

    <!-- Data Table -->
    <div class="card">
        <div class="card-header">
            <h3 style="font-size:14px"><i class="fas fa-table" style="color:var(--info);margin-right:6px"></i> รายการสินค้า</h3>
            <div style="display:flex;gap:6px;align-items:center">
                <span class="tag tag-gray" id="prodResultCount">${fmtNum(stats.totalRows)} รายการ</span>
                <button class="btn btn-sm btn-accent" onclick="askAIAboutProducts()" title="ถาม AI วิเคราะห์"><i class="fas fa-robot"></i> ถาม AI</button>
            </div>
        </div>
        <div class="card-body" style="padding:0">
            <div class="table-wrap" id="prodTableWrap">${renderProductTable(data)}</div>
        </div>
        <div class="card-footer" id="prodPagination">${renderProductPagination(data)}</div>
    </div>`;
}

function getProductData() {
    const imported = loadData('imported_data', null);
    if (imported && imported.stock && imported.stock.length > 0) {
        return { rows: imported.stock, isReal: true, lastImport: imported.lastImport };
    }
    return { rows: getDemoProductData(), isReal: false, lastImport: null };
}

function getDemoProductData() {
    return [
        { artno:'1231121', name:'ประตูห้องน้ำUPVC AZLE BN-01 70x200 WH', brand:'AZLE', category:'ประตูภายใน UPVC', branch:'เอกมัย-รามอินทรา', store:'HomePro', qty:11, min:3, sold:5, nonMoveDay:0, display:true },
        { artno:'1225559', name:'ประตูห้องน้ำUPVC AZLE BN-01เกล็ด 70x200WH', brand:'AZLE', category:'ประตูภายใน UPVC', branch:'เอกมัย-รามอินทรา', store:'HomePro', qty:10, min:3, sold:3, nonMoveDay:0, display:true },
        { artno:'1238143', name:'ประตูภายนอกUPVC AZLE L-35 80X200cm WH', brand:'AZLE', category:'ประตูภายนอก UPVC', branch:'เอกมัย-รามอินทรา', store:'HomePro', qty:0, min:3, sold:0, nonMoveDay:45, display:false },
        { artno:'196611', name:'ประตู PVC AZLE AZ-2 UV 70X200cm CM', brand:'AZLE', category:'ประตูห้องน้ำ PVC', branch:'เอกมัย-รามอินทรา', store:'HomePro', qty:7, min:5, sold:8, nonMoveDay:0, display:true },
        { artno:'1251002', name:'วงกบ WPC AZLE 80x200 WH', brand:'AZLE', category:'วงกบ WPC/UPVC', branch:'เอกมัย-รามอินทรา', store:'HomePro', qty:15, min:5, sold:4, nonMoveDay:0, display:true },
        { artno:'1241111', name:'ประตู UPVC EXTERA EX-01 70x200 WH', brand:'EXTERA', category:'ประตูภายใน UPVC', branch:'พัทยา', store:'HomePro', qty:8, min:3, sold:2, nonMoveDay:0, display:true },
        { artno:'1241112', name:'ประตู UPVC EXTERA EX-03 80x200 WH', brand:'EXTERA', category:'ประตูภายใน UPVC', branch:'ขอนแก่น', store:'DoHome', qty:3, min:5, sold:1, nonMoveDay:120, display:false },
        { artno:'1255001', name:'ประตู ANYHOME AN-05 70x200 WH', brand:'ANYHOME', category:'ประตูภายใน UPVC', branch:'พัทยา', store:'HomePro', qty:6, min:3, sold:0, nonMoveDay:150, display:false },
        { artno:'1260001', name:'ประตู POLY TIMBER PT-01 80x200', brand:'POLY TIMBER', category:'ประตูภายใน UPVC', branch:'บ่อวิน', store:'MegaHome', qty:4, min:2, sold:0, nonMoveDay:200, display:false },
        { artno:'1231122', name:'ประตูห้องน้ำUPVC AZLE BN-01 70x200 WH', brand:'AZLE', category:'ประตูภายใน UPVC', branch:'บางบัวทอง', store:'DoHome', qty:9, min:5, sold:6, nonMoveDay:0, display:true },
        { artno:'1225560', name:'ประตูห้องน้ำ PVC AZLE BW 70x200', brand:'AZLE', category:'ประตูห้องน้ำ PVC', branch:'บางบัวทอง', store:'DoHome', qty:2, min:10, sold:12, nonMoveDay:0, display:true },
        { artno:'1231123', name:'ประตู UPVC BN-03 สีขาว 70x200', brand:'AZLE', category:'ประตูภายใน UPVC', branch:'เอกมัย-รามอินทรา', store:'HomePro', qty:5, min:3, sold:0, nonMoveDay:95, display:true },
        { artno:'196612', name:'ประตู PVC BW-11 เก่า 70x200', brand:'AZLE', category:'ประตูห้องน้ำ PVC', branch:'พระราม2', store:'BnB Home', qty:3, min:5, sold:0, nonMoveDay:180, display:false },
        { artno:'1251003', name:'วงกบ WPC สี Teak 80x200', brand:'AZLE', category:'วงกบ WPC/UPVC', branch:'ขอนแก่น', store:'DoHome', qty:7, min:3, sold:0, nonMoveDay:110, display:true },
        { artno:'1238144', name:'ประตูภายนอก UPVC L-22 80x200', brand:'AZLE', category:'ประตูภายนอก UPVC', branch:'รังสิต', store:'MegaHome', qty:2, min:3, sold:0, nonMoveDay:160, display:false },
        { artno:'1270001', name:'HDF บานประตู 80x200', brand:'อื่นๆ', category:'อื่นๆ', branch:'ขอนแก่น', store:'DoHome', qty:2, min:10, sold:3, nonMoveDay:0, display:false },
        { artno:'1231130', name:'ประตู UPVC AZLE BN-01 80x200 WH', brand:'AZLE', category:'ประตูภายใน UPVC', branch:'ระยอง', store:'BnB Home', qty:1, min:5, sold:2, nonMoveDay:0, display:true },
        { artno:'1251010', name:'วงกบ UPVC 80x200 WH', brand:'AZLE', category:'วงกบ WPC/UPVC', branch:'บางบัวทอง', store:'DoHome', qty:3, min:8, sold:4, nonMoveDay:0, display:true },
        { artno:'1241120', name:'ประตู EXTERA EX-05 70x200 สีเทา', brand:'EXTERA', category:'ประตูภายใน UPVC', branch:'รังสิต', store:'MegaHome', qty:5, min:3, sold:3, nonMoveDay:15, display:true },
        { artno:'1290001', name:'Deck ไม้ระแนง WPC 10x300', brand:'AZLE', category:'Deck/ไม้ระแนง', branch:'เอกมัย-รามอินทรา', store:'HomePro', qty:20, min:10, sold:8, nonMoveDay:0, display:true },
    ];
}

function computeProductStats(data) {
    const rows = data.rows;
    const nonMoving = rows.filter(r => r.nonMoveDay > 90).length;
    const belowMin = rows.filter(r => r.qty > 0 && r.min > 0 && r.qty < r.min).length;
    const noDisplay = rows.filter(r => !r.display).length;
    const deadStock = rows.filter(r => r.qty > 0 && r.sold === 0).length;
    const sortedBySold = [...rows].sort((a, b) => (b.sold || 0) - (a.sold || 0));
    const top20pct = Math.max(1, Math.floor(rows.length * 0.2));
    const highSold = sortedBySold.slice(0, top20pct).length;

    const stores = [...new Set(rows.map(r => r.store).filter(Boolean))].sort();
    const branches = [...new Set(rows.map(r => r.branch).filter(Boolean))].sort();
    const brands = [...new Set(rows.map(r => r.brand).filter(b => b && b !== 'อื่นๆ'))].sort();

    // Category breakdown
    const catMap = {};
    rows.forEach(r => {
        const cat = r.category || 'อื่นๆ';
        catMap[cat] = (catMap[cat] || 0) + 1;
    });

    // Store breakdown
    const storeMap = {};
    rows.forEach(r => {
        const s = r.store || 'ไม่ระบุ';
        storeMap[s] = (storeMap[s] || 0) + 1;
    });

    return { totalRows: rows.length, nonMoving, belowMin, noDisplay, deadStock, highSold, stores, branches, brands, catMap, storeMap };
}

function renderQuickFilterBtn(filter, icon, label, count, color) {
    const active = prodCurrentFilter === filter;
    return `
    <div style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;cursor:pointer;transition:all .15s;
        ${active ? `background:${color};color:white;` : 'background:var(--gray-50);'}"
        onclick="applyQuickFilter('${filter}')"
        onmouseover="if('${filter}'!==prodCurrentFilter)this.style.background='var(--gray-100)'"
        onmouseout="if('${filter}'!==prodCurrentFilter)this.style.background='var(--gray-50)'">
        <i class="fas ${icon}" style="font-size:14px;width:20px;text-align:center;${active ? '' : `color:${color}`}"></i>
        <span style="flex:1;font-size:13px;font-weight:${active ? '700' : '500'}">${label}</span>
        <span style="font-weight:700;font-size:14px">${fmtNum(count)}</span>
    </div>`;
}

function renderProductCharts(stats) {
    // Pie chart via conic-gradient
    const catEntries = Object.entries(stats.catMap).sort((a, b) => b[1] - a[1]);
    const total = catEntries.reduce((s, e) => s + e[1], 0) || 1;
    const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];
    let gradientParts = [];
    let cumPct = 0;

    catEntries.forEach((entry, i) => {
        const pct = (entry[1] / total) * 100;
        const color = colors[i % colors.length];
        gradientParts.push(`${color} ${cumPct}% ${cumPct + pct}%`);
        cumPct += pct;
    });

    let html = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
        <div style="width:100px;height:100px;border-radius:50%;background:conic-gradient(${gradientParts.join(',')});flex-shrink:0"></div>
        <div style="font-size:11px">
            ${catEntries.map((e, i) => `
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
                <div style="width:10px;height:10px;border-radius:2px;background:${colors[i % colors.length]};flex-shrink:0"></div>
                <span style="color:var(--gray-600)">${e[0]}</span>
                <strong>${e[1]}</strong>
                <span style="color:var(--gray-400)">(${((e[1]/total)*100).toFixed(0)}%)</span>
            </div>`).join('')}
        </div>
    </div>`;

    // Bar chart: by store
    const storeEntries = Object.entries(stats.storeMap).sort((a, b) => b[1] - a[1]);
    const maxStore = storeEntries.length > 0 ? storeEntries[0][1] : 1;
    const storeColors = { HomePro: '#3b82f6', DoHome: '#22c55e', 'BnB Home': '#f59e0b', MegaHome: '#ef4444' };

    html += `<div style="font-size:12px;font-weight:600;color:var(--gray-500);margin-bottom:6px">สินค้าตามห้าง</div>`;
    storeEntries.forEach(e => {
        const pct = (e[1] / maxStore) * 100;
        const color = storeColors[e[0]] || 'var(--gray-400)';
        html += `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="font-size:11px;width:70px;text-align:right;color:var(--gray-600)">${e[0]}</span>
            <div style="flex:1;height:18px;background:var(--gray-100);border-radius:4px;overflow:hidden">
                <div style="height:100%;width:${pct}%;background:${color};border-radius:4px;transition:width .3s"></div>
            </div>
            <span style="font-size:12px;font-weight:700;width:40px">${e[1]}</span>
        </div>`;
    });

    return html;
}

function getFilteredProducts(data) {
    let rows = data.rows;

    // Apply quick filter
    if (prodCurrentFilter === 'nonMoving') rows = rows.filter(r => r.nonMoveDay > 90);
    else if (prodCurrentFilter === 'belowMin') rows = rows.filter(r => r.qty > 0 && r.min > 0 && r.qty < r.min);
    else if (prodCurrentFilter === 'noDisplay') rows = rows.filter(r => !r.display);
    else if (prodCurrentFilter === 'deadStock') rows = rows.filter(r => r.qty > 0 && (r.sold || 0) === 0);
    else if (prodCurrentFilter === 'highSold') {
        rows = [...rows].sort((a, b) => (b.sold || 0) - (a.sold || 0));
        rows = rows.slice(0, Math.max(1, Math.floor(data.rows.length * 0.2)));
    }

    // Apply filters
    if (prodCurrentStore) rows = rows.filter(r => r.store === prodCurrentStore);
    if (prodCurrentBranch) rows = rows.filter(r => r.branch === prodCurrentBranch);
    if (prodCurrentBrand) rows = rows.filter(r => r.brand === prodCurrentBrand);
    if (prodSearchText) {
        const q = prodSearchText.toLowerCase();
        rows = rows.filter(r => (r.artno || '').toLowerCase().includes(q) || (r.name || '').toLowerCase().includes(q));
    }

    return rows;
}

function renderProductTable(data) {
    const filtered = getFilteredProducts(data);
    const start = (prodCurrentPage - 1) * PROD_PER_PAGE;
    const page = filtered.slice(start, start + PROD_PER_PAGE);

    return `
    <table class="data-table">
        <thead><tr>
            <th>#</th><th>รหัส</th><th>ชื่อสินค้า</th><th>แบรนด์</th><th>สาขา</th>
            <th style="text-align:right">สต๊อก</th><th style="text-align:right">Min</th>
            <th style="text-align:right">ขาย</th><th>Non-Move</th><th>สถานะ</th>
        </tr></thead>
        <tbody>
            ${page.length === 0 ? '<tr><td colspan="10" style="text-align:center;color:var(--gray-400);padding:30px">ไม่พบข้อมูล</td></tr>' : ''}
            ${page.map((r, i) => {
                const rowIdx = start + i + 1;
                const isLow = r.qty > 0 && r.min > 0 && r.qty < r.min;
                const isNM = r.nonMoveDay > 90;
                const isDead = r.qty > 0 && (r.sold || 0) === 0;
                return `
                <tr style="cursor:pointer;${isNM ? 'background:#fef2f2;' : isLow ? 'background:#fefce8;' : ''}" onclick="showProductDetail(${JSON.stringify(r).replace(/"/g, '&quot;')})">
                    <td>${rowIdx}</td>
                    <td><code style="font-size:11px">${r.artno || '-'}</code></td>
                    <td style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${r.name || ''}">${r.name || '-'}</td>
                    <td><span class="tag tag-gray" style="font-size:10px">${r.brand || '-'}</span></td>
                    <td style="font-size:12px">${r.branch || '-'}<br><span style="color:var(--gray-400);font-size:10px">${r.store || ''}</span></td>
                    <td style="text-align:right;font-weight:700;${isLow ? 'color:var(--danger)' : ''}">${r.qty}</td>
                    <td style="text-align:right;color:var(--gray-400)">${r.min || '-'}</td>
                    <td style="text-align:right;${(r.sold || 0) > 5 ? 'color:var(--success);font-weight:600' : ''}">${r.sold || 0}</td>
                    <td>${r.nonMoveDay > 0 ? `<span style="font-size:12px;${isNM ? 'color:var(--danger);font-weight:700' : 'color:var(--gray-400)'}">${r.nonMoveDay} วัน</span>` : '-'}</td>
                    <td>${getProductStatusTags(r)}</td>
                </tr>`;
            }).join('')}
        </tbody>
    </table>`;
}

function getProductStatusTags(r) {
    const tags = [];
    if (r.nonMoveDay > 90) tags.push('<span class="tag tag-danger" style="font-size:9px">NM</span>');
    if (r.qty > 0 && r.min > 0 && r.qty < r.min) tags.push('<span class="tag tag-warning" style="font-size:9px">Low</span>');
    if (!r.display) tags.push('<span class="tag tag-purple" style="font-size:9px">No Show</span>');
    if (r.qty > 0 && (r.sold || 0) === 0) tags.push('<span class="tag tag-gray" style="font-size:9px">Dead</span>');
    if (tags.length === 0) tags.push('<span class="tag tag-success" style="font-size:9px">OK</span>');
    return tags.join(' ');
}

function renderProductPagination(data) {
    const filtered = getFilteredProducts(data);
    const totalPages = Math.ceil(filtered.length / PROD_PER_PAGE) || 1;

    return `
    <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:12px;color:var(--gray-500)">${fmtNum(filtered.length)} รายการ | หน้า ${prodCurrentPage}/${totalPages}</span>
        <div style="display:flex;gap:4px">
            <button class="btn btn-sm btn-outline" ${prodCurrentPage <= 1 ? 'disabled' : ''} onclick="prodCurrentPage--;refreshProductTable()"><i class="fas fa-chevron-left"></i></button>
            <button class="btn btn-sm btn-outline" ${prodCurrentPage >= totalPages ? 'disabled' : ''} onclick="prodCurrentPage++;refreshProductTable()"><i class="fas fa-chevron-right"></i></button>
        </div>
    </div>`;
}

function refreshProductTable() {
    const data = getProductData();
    const filtered = getFilteredProducts(data);
    document.getElementById('prodTableWrap').innerHTML = renderProductTable(data);
    document.getElementById('prodPagination').innerHTML = renderProductPagination(data);
    document.getElementById('prodResultCount').textContent = fmtNum(filtered.length) + ' รายการ';
}

function applyQuickFilter(filter) {
    prodCurrentFilter = filter;
    prodCurrentPage = 1;
    // Re-render entire page to update active states
    renderProducts(currentRole);
}

function showProductDetail(product) {
    const r = typeof product === 'string' ? JSON.parse(product) : product;
    const data = getProductData();
    // Find all stock entries for this product across branches
    const allStock = data.rows.filter(s => s.artno === r.artno);

    const isNM = r.nonMoveDay > 90;
    const isLow = r.qty > 0 && r.min > 0 && r.qty < r.min;

    showModal(`${r.name || r.artno}`, `
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px">
            <div style="text-align:center;padding:12px;background:var(--gray-50);border-radius:8px">
                <div style="font-size:10px;color:var(--gray-400)">รหัสสินค้า</div>
                <div style="font-size:14px;font-weight:700">${r.artno || '-'}</div>
            </div>
            <div style="text-align:center;padding:12px;background:var(--gray-50);border-radius:8px">
                <div style="font-size:10px;color:var(--gray-400)">แบรนด์</div>
                <div style="font-size:14px;font-weight:700">${r.brand || '-'}</div>
            </div>
            <div style="text-align:center;padding:12px;background:var(--gray-50);border-radius:8px">
                <div style="font-size:10px;color:var(--gray-400)">หมวด</div>
                <div style="font-size:14px;font-weight:700">${r.category || '-'}</div>
            </div>
        </div>

        ${isNM ? '<div style="padding:8px 12px;background:#fef2f2;border-radius:8px;margin-bottom:12px;font-size:12px;color:var(--danger)"><i class="fas fa-exclamation-triangle"></i> <strong>สินค้าไม่เคลื่อนไหว</strong> (' + r.nonMoveDay + ' วัน)</div>' : ''}
        ${isLow ? '<div style="padding:8px 12px;background:#fefce8;border-radius:8px;margin-bottom:12px;font-size:12px;color:var(--warning)"><i class="fas fa-arrow-down"></i> <strong>สต๊อกต่ำกว่า Min</strong> (เหลือ ' + r.qty + ' / Min ' + r.min + ')</div>' : ''}

        <h4 style="font-size:13px;margin-bottom:8px"><i class="fas fa-store" style="color:var(--primary)"></i> สต๊อกในแต่ละสาขา</h4>
        <table class="data-table">
            <thead><tr><th>สาขา</th><th>ห้าง</th><th style="text-align:right">สต๊อก</th><th style="text-align:right">Min</th><th style="text-align:right">ขาย</th><th>โชว์</th><th>สถานะ</th></tr></thead>
            <tbody>
                ${allStock.length > 0 ? allStock.map(s => `
                <tr>
                    <td>${s.branch || '-'}</td>
                    <td><span class="tag tag-info" style="font-size:10px">${s.store || '-'}</span></td>
                    <td style="text-align:right;font-weight:700;${s.qty < s.min && s.min > 0 ? 'color:var(--danger)' : ''}">${s.qty}</td>
                    <td style="text-align:right;color:var(--gray-400)">${s.min || '-'}</td>
                    <td style="text-align:right">${s.sold || 0}</td>
                    <td>${s.display ? '<span class="tag tag-success" style="font-size:10px">มี</span>' : '<span class="tag tag-gray" style="font-size:10px">ไม่มี</span>'}</td>
                    <td>${getProductStatusTags(s)}</td>
                </tr>`).join('') : `<tr><td colspan="7" style="text-align:center;color:var(--gray-400)">สาขาเดียว</td></tr>`}
            </tbody>
        </table>
    `, `
        <button class="btn btn-outline" onclick="closeModal()">ปิด</button>
        <button class="btn btn-accent" onclick="closeModal();askAIAboutProduct('${(r.name || r.artno).replace(/'/g, "\\'")}')"><i class="fas fa-robot"></i> ถาม AI วิเคราะห์</button>
    `);
}

function askAIAboutProducts() {
    const filterName = {
        all: 'ภาพรวมสินค้าทั้งหมด',
        nonMoving: 'สินค้าไม่เคลื่อนไหว (Non-Moving)',
        belowMin: 'สินค้าต่ำกว่า Min Stock',
        deadStock: 'สินค้าค้างสต๊อก',
        noDisplay: 'สินค้าไม่มีตัวโชว์',
        highSold: 'สินค้าขายดี',
    };
    const question = `วิเคราะห์${filterName[prodCurrentFilter] || 'สินค้าทั้งหมด'} แนะนำ action items ที่ควรทำ`;
    loadPage('ai');
    setTimeout(() => {
        const input = document.getElementById('aiInput');
        if (input) { input.value = question; sendAIMessage(); }
    }, 300);
}

function askAIAboutProduct(productName) {
    const question = `วิเคราะห์สินค้า "${productName}" สถานะสต๊อก ยอดขาย และให้คำแนะนำ`;
    loadPage('ai');
    setTimeout(() => {
        const input = document.getElementById('aiInput');
        if (input) { input.value = question; sendAIMessage(); }
    }, 300);
}
