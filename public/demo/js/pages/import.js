/* Data Import Module - Real Excel Parser with SheetJS */

let importPendingFiles = [];
let importParsedData = [];

function renderImport(role) {
    const c = document.getElementById('contentArea');
    const history = loadData('import_history', []);

    c.innerHTML = `
    <div class="card" style="margin-bottom:20px">
        <div class="card-header">
            <h3><i class="fas fa-file-import" style="color:var(--primary);margin-right:6px"></i> นำเข้าข้อมูลจากไฟล์ Excel</h3>
            <div style="display:flex;gap:8px">
                ${getImportedDataBadge()}
            </div>
        </div>
        <div class="card-body">
            <p style="color:var(--gray-500);margin-bottom:16px">รองรับไฟล์จากห้างต่างๆ: HomePro, DoHome, BnB Home (BTV), MegaHome — ระบบจะตรวจจับรูปแบบอัตโนมัติ</p>

            <!-- Drop Zone -->
            <div id="importDropZone" class="drop-zone" onclick="document.getElementById('importFile').click()"
                ondragover="event.preventDefault();this.classList.add('dragover')"
                ondragleave="this.classList.remove('dragover')"
                ondrop="handleFileDrop(event)">
                <i class="fas fa-cloud-arrow-up" style="font-size:40px;color:var(--primary);margin-bottom:12px"></i>
                <p style="font-size:15px;font-weight:600;color:var(--gray-700)">ลากไฟล์มาวางที่นี่ หรือ คลิกเพื่อเลือกไฟล์</p>
                <p style="font-size:12px;color:var(--gray-400);margin-top:4px">รองรับ .xlsx, .xls, .csv — เลือกได้หลายไฟล์พร้อมกัน</p>
                <input type="file" id="importFile" accept=".xlsx,.xls,.csv" multiple style="display:none" onchange="handleFileSelect(this)">
            </div>

            <!-- Selected Files List -->
            <div id="importFileList" style="display:none;margin-top:12px"></div>
        </div>
    </div>

    <!-- Progress Bar -->
    <div class="card" id="importProgressCard" style="display:none;margin-bottom:20px">
        <div class="card-body" style="padding:20px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <span style="font-weight:600;font-size:14px" id="importProgressLabel">กำลังอ่านไฟล์...</span>
                <span style="font-weight:700;color:var(--primary)" id="importProgressPct">0%</span>
            </div>
            <div class="progress" style="height:12px;border-radius:6px">
                <div class="progress-bar blue" id="importProgressBar" style="width:0%;transition:width .3s"></div>
            </div>
            <p style="font-size:12px;color:var(--gray-400);margin-top:6px" id="importProgressDetail"></p>
        </div>
    </div>

    <!-- Preview -->
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
            <div id="importSummary" style="margin-bottom:16px"></div>
            <div class="table-wrap" id="importPreviewTable"></div>
        </div>
        <div class="card-footer">
            <div style="display:flex;justify-content:space-between;align-items:center">
                <div style="font-size:12px;color:var(--gray-500)">
                    <i class="fas fa-info-circle"></i> ข้อมูลจะถูกเก็บในเบราว์เซอร์ (localStorage) สำหรับ Demo
                </div>
                <div style="display:flex;gap:8px">
                    <button class="btn btn-outline" onclick="cancelImport()">ยกเลิก</button>
                    <button class="btn btn-success" onclick="doImport()"><i class="fas fa-check"></i> นำเข้าข้อมูล</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Result -->
    <div class="card" id="importResult" style="display:none">
        <div class="card-body" style="text-align:center;padding:40px">
            <i class="fas fa-check-circle" style="font-size:48px;color:var(--success);margin-bottom:12px"></i>
            <h3 style="color:var(--success);margin-bottom:8px">นำเข้าข้อมูลสำเร็จ!</h3>
            <p id="importResultMsg" style="color:var(--gray-500)"></p>
            <div style="display:flex;gap:8px;justify-content:center;margin-top:16px">
                <button class="btn btn-primary" onclick="renderImport(currentRole)"><i class="fas fa-plus"></i> นำเข้าเพิ่ม</button>
                <button class="btn btn-accent" onclick="loadPage('products')"><i class="fas fa-box-open"></i> ดูสินค้า/สต๊อก</button>
            </div>
        </div>
    </div>

    <!-- History -->
    <div class="card">
        <div class="card-header">
            <h3><i class="fas fa-history" style="color:var(--gray-500);margin-right:6px"></i> ประวัติการนำเข้า</h3>
            ${history.length > 0 ? `<button class="btn btn-sm btn-outline" onclick="clearImportHistory()" style="color:var(--danger);border-color:var(--danger)"><i class="fas fa-trash"></i> ล้างทั้งหมด</button>` : ''}
        </div>
        <div class="card-body">
            ${history.length > 0 ? `
            <table class="data-table">
                <thead><tr><th>วันที่</th><th>ไฟล์</th><th>ประเภท</th><th>รายการ</th><th>สถานะ</th></tr></thead>
                <tbody>
                    ${history.slice(0, 20).map(h => `
                    <tr>
                        <td>${h.date}</td>
                        <td>${h.name}</td>
                        <td><span class="tag tag-info">${h.type}</span></td>
                        <td>${fmtNum(h.rows)}</td>
                        <td><span class="tag tag-success">สำเร็จ</span></td>
                    </tr>`).join('')}
                </tbody>
            </table>` : `<p style="text-align:center;color:var(--gray-400);padding:20px">ยังไม่มีประวัติการนำเข้า</p>`}
        </div>
    </div>

    <!-- Supported Formats -->
    <div class="card">
        <div class="card-header"><h3><i class="fas fa-info-circle" style="color:var(--info);margin-right:6px"></i> รูปแบบไฟล์ที่รองรับ</h3></div>
        <div class="card-body">
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
                <div style="padding:12px;background:var(--gray-50);border-radius:8px;border-left:4px solid var(--info)">
                    <strong>HomePro - สต๊อก</strong>
                    <p style="font-size:12px;color:var(--gray-500);margin-top:4px">VRM_InventoryData_*.xlsx<br>คอลัมน์: ARTNO, ARTDESC, SITENAME, ONHANDQTY, MIN TARGET, NON MOVE DAY</p>
                </div>
                <div style="padding:12px;background:var(--gray-50);border-radius:8px;border-left:4px solid var(--success)">
                    <strong>HomePro - Sale Detail</strong>
                    <p style="font-size:12px;color:var(--gray-500);margin-top:4px">Sale Detail By Zone*.xlsx<br>คอลัมน์: ARTICLE, Description, สาขา, ภาค, STOCK, ยอดขาย, ตัวโชว์</p>
                </div>
                <div style="padding:12px;background:var(--gray-50);border-radius:8px;border-left:4px solid var(--warning)">
                    <strong>DoHome - ยอดขาย/สต๊อก</strong>
                    <p style="font-size:12px;color:var(--gray-500);margin-top:4px">ยอดขาย DH*.xlsx / รายงานสต็อค*.xlsx<br>คอลัมน์: สาขา, รหัสสินค้า, ชื่อสินค้า, จำนวนขาย, มูลค่า</p>
                </div>
                <div style="padding:12px;background:var(--gray-50);border-radius:8px;border-left:4px solid #7c3aed">
                    <strong>BnB Home (BTV)</strong>
                    <p style="font-size:12px;color:var(--gray-500);margin-top:4px">vendor_online_report*.xlsx<br>Multi-sheet: Sales by Branch, Stock, Aging, Turnover</p>
                </div>
            </div>
        </div>
    </div>`;
}

function getImportedDataBadge() {
    const data = loadData('imported_data', null);
    if (data && data.stock && data.stock.length > 0) {
        return `<span class="tag tag-success"><i class="fas fa-database"></i> ${fmtNum(data.stock.length)} รายการในระบบ</span>`;
    }
    return `<span class="tag tag-gray"><i class="fas fa-database"></i> ยังไม่มีข้อมูล</span>`;
}

function handleFileDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files).filter(f =>
        f.name.endsWith('.xlsx') || f.name.endsWith('.xls') || f.name.endsWith('.csv')
    );
    if (files.length) processSelectedFiles(files);
}

function handleFileSelect(input) {
    if (!input.files.length) return;
    processSelectedFiles(Array.from(input.files));
}

function processSelectedFiles(files) {
    importPendingFiles = files;
    importParsedData = [];

    // Show file list
    const listEl = document.getElementById('importFileList');
    listEl.style.display = 'block';
    listEl.innerHTML = `
        <div style="font-weight:600;margin-bottom:8px"><i class="fas fa-files" style="color:var(--primary)"></i> ไฟล์ที่เลือก (${files.length} ไฟล์)</div>
        ${files.map((f, i) => `
        <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--gray-50);border-radius:8px;margin-bottom:4px">
            <i class="fas fa-file-excel" style="color:#22c55e;font-size:18px"></i>
            <div style="flex:1">
                <div style="font-size:13px;font-weight:600">${f.name}</div>
                <div style="font-size:11px;color:var(--gray-400)">${(f.size / 1024).toFixed(0)} KB — ${detectFileType(f.name)}</div>
            </div>
            <span class="tag tag-info" style="font-size:10px">${detectFileType(f.name)}</span>
        </div>`).join('')}
        <div style="margin-top:12px;display:flex;gap:8px">
            <button class="btn btn-primary" onclick="startParsingFiles()"><i class="fas fa-play"></i> เริ่มอ่านไฟล์</button>
            <button class="btn btn-outline" onclick="cancelFileSelect()">ยกเลิก</button>
        </div>`;
}

function cancelFileSelect() {
    importPendingFiles = [];
    document.getElementById('importFileList').style.display = 'none';
    document.getElementById('importFile').value = '';
}

function detectFileType(name) {
    const n = name.toLowerCase();
    if (n.includes('sale detail') && (n.includes('hp') || n.includes('homepro'))) return 'Sale Detail HP';
    if (n.includes('vrm') && n.includes('inventory')) return 'สต๊อก HP';
    if (n.includes('vendor_online') || n.includes('btv')) return 'BTV';
    if (n.includes('ยอดขาย') && n.includes('dh')) return 'ยอดขาย DH';
    if ((n.includes('สต็อค') || n.includes('stock')) && n.includes('dh')) return 'สต๊อก DH';
    if (n.includes('homepro') || n.includes('hp')) return 'HomePro';
    if (n.includes('dohome') || n.includes('dh')) return 'DoHome';
    if (n.includes('mega')) return 'MegaHome';
    return 'ตรวจจับอัตโนมัติ';
}

async function startParsingFiles() {
    const progressCard = document.getElementById('importProgressCard');
    const progressBar = document.getElementById('importProgressBar');
    const progressLabel = document.getElementById('importProgressLabel');
    const progressPct = document.getElementById('importProgressPct');
    const progressDetail = document.getElementById('importProgressDetail');

    progressCard.style.display = 'block';
    document.getElementById('importFileList').style.display = 'none';
    importParsedData = [];

    const totalFiles = importPendingFiles.length;
    let allRows = [];
    let totalRows = 0;
    let warnings = 0;
    let errors = 0;

    for (let i = 0; i < totalFiles; i++) {
        const file = importPendingFiles[i];
        const fileNum = i + 1;
        const basePct = (i / totalFiles) * 100;
        const filePct = (1 / totalFiles) * 100;

        progressLabel.textContent = `กำลังอ่าน ${file.name}...`;
        progressDetail.textContent = `ไฟล์ ${fileNum}/${totalFiles}`;

        // Animate progress to start of this file
        progressBar.style.width = basePct + '%';
        progressPct.textContent = Math.round(basePct) + '%';

        await sleep(200);

        try {
            const data = await readExcelFile(file);
            const fileType = detectFileType(file.name);
            const parsed = parseExcelData(data, fileType, file.name);

            // Animate reading progress
            for (let p = 0; p <= 100; p += 20) {
                const currentPct = basePct + (filePct * p / 100);
                progressBar.style.width = currentPct + '%';
                progressPct.textContent = Math.round(currentPct) + '%';
                await sleep(50);
            }

            allRows.push(...parsed.rows);
            totalRows += parsed.rows.length;
            warnings += parsed.warnings;
            errors += parsed.errors;

            importParsedData.push({
                name: file.name,
                type: fileType,
                rows: parsed.rows,
                totalRows: parsed.rows.length,
                warnings: parsed.warnings,
                errors: parsed.errors,
                sheets: parsed.sheets || [],
            });

        } catch (err) {
            console.error('Error parsing', file.name, err);
            errors++;
            importParsedData.push({
                name: file.name,
                type: detectFileType(file.name),
                rows: [],
                totalRows: 0,
                warnings: 0,
                errors: 1,
                error: err.message,
            });
        }
    }

    // Complete
    progressBar.style.width = '100%';
    progressPct.textContent = '100%';
    progressLabel.textContent = 'อ่านไฟล์เสร็จสิ้น!';
    progressDetail.textContent = `รวม ${fmtNum(totalRows)} รายการ จาก ${totalFiles} ไฟล์`;

    await sleep(500);
    progressCard.style.display = 'none';

    // Show preview
    showImportPreview(allRows, totalRows, warnings, errors);
}

function readExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                resolve(workbook);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์ได้'));
        reader.readAsArrayBuffer(file);
    });
}

function parseExcelData(workbook, fileType, fileName) {
    const result = { rows: [], warnings: 0, errors: 0, sheets: workbook.SheetNames };
    let sheetsToParse = workbook.SheetNames;

    for (const sheetName of sheetsToParse) {
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) continue;

        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        if (!jsonData.length) continue;

        const headers = Object.keys(jsonData[0]);

        for (const row of jsonData) {
            const parsed = normalizeRow(row, headers, fileType, sheetName);
            if (parsed) {
                if (parsed._warning) result.warnings++;
                if (parsed._error) { result.errors++; continue; }
                parsed._source = fileName;
                parsed._sheet = sheetName;
                result.rows.push(parsed);
            }
        }
    }
    return result;
}

function normalizeRow(row, headers, fileType, sheetName) {
    const h = headers.map(h => h.toLowerCase().trim());
    const val = (key) => {
        const idx = h.findIndex(hh => hh.includes(key));
        return idx >= 0 ? row[headers[idx]] : '';
    };

    let artno = val('artno') || val('article') || val('รหัสสินค้า') || val('รหัส') || val('art') || '';
    let name = val('artdesc') || val('description') || val('ชื่อสินค้า') || val('desc') || '';
    let branch = val('sitename') || val('สาขา') || val('ชื่อสาขา') || val('site') || '';
    let qty = parseFloat(val('onhandqty') || val('สต็อกคงเหลือ') || val('stock') || val('qty') || 0);
    let min = parseFloat(val('min target') || val('min') || val('mintarget') || 0);
    let sold = parseFloat(val('จำนวนขาย') || val('qtysold') || val('sold') || val('qty sold') || 0);
    let amount = parseFloat(val('มูลค่า') || val('amount') || val('ยอดขาย') || val('net') || 0);
    let nonMove = parseFloat(val('non move day') || val('nonmoveday') || val('aging') || 0);
    let display = val('ตัวโชว์') || val('display') || '';
    let region = val('ภาค') || val('region') || '';
    let brand = detectBrand(name);
    let category = detectCategory(name);
    let store = detectStore(branch, fileType);

    artno = String(artno).trim();
    if (!artno && !name) return null;

    // Warnings
    let _warning = false;
    if (qty < 0) { qty = 0; _warning = true; }
    if (!name && artno) _warning = true;

    // Errors
    if (!artno && !name) return { _error: true };

    return {
        artno, name, branch, store, region, qty: isNaN(qty) ? 0 : qty,
        min: isNaN(min) ? 0 : min, sold: isNaN(sold) ? 0 : sold,
        amount: isNaN(amount) ? 0 : amount, nonMoveDay: isNaN(nonMove) ? 0 : nonMove,
        display: display === 'มี' || display === 'Y' || display === 'Yes' || display === '1',
        brand, category, _warning,
    };
}

function detectBrand(name) {
    const n = (name || '').toUpperCase();
    if (n.includes('AZLE')) return 'AZLE';
    if (n.includes('EXTERA')) return 'EXTERA';
    if (n.includes('ANYHOME')) return 'ANYHOME';
    if (n.includes('POLY TIMBER') || n.includes('POLYTIMBER')) return 'POLY TIMBER';
    return 'อื่นๆ';
}

function detectCategory(name) {
    const n = (name || '').toLowerCase();
    if (n.includes('ห้องน้ำ') || n.includes('pvc')) return 'ประตูห้องน้ำ PVC';
    if (n.includes('ภายนอก')) return 'ประตูภายนอก UPVC';
    if (n.includes('วงกบ')) return 'วงกบ WPC/UPVC';
    if (n.includes('upvc') || n.includes('ภายใน')) return 'ประตูภายใน UPVC';
    if (n.includes('deck') || n.includes('ระแนง')) return 'Deck/ไม้ระแนง';
    if (n.includes('wpc')) return 'วงกบ WPC/UPVC';
    return 'อื่นๆ';
}

function detectStore(branch, fileType) {
    const b = (branch || '').toLowerCase();
    const t = (fileType || '').toLowerCase();
    if (t.includes('hp') || t.includes('homepro') || b.includes('homepro')) return 'HomePro';
    if (t.includes('dh') || t.includes('dohome') || b.includes('dohome')) return 'DoHome';
    if (t.includes('btv') || t.includes('bnb') || b.includes('bnb') || b.includes('btv')) return 'BnB Home';
    if (t.includes('mega') || b.includes('mega')) return 'MegaHome';
    return '';
}

function showImportPreview(allRows, totalRows, warnings, errors) {
    const previewEl = document.getElementById('importPreview');
    previewEl.style.display = 'block';

    const validCount = totalRows - errors;
    document.getElementById('importValidCount').textContent = `${fmtNum(validCount)} รายการพร้อม`;

    if (warnings > 0) {
        const el = document.getElementById('importWarnCount');
        el.style.display = 'inline-flex';
        el.textContent = `${warnings} ต้องตรวจสอบ`;
    }
    if (errors > 0) {
        const el = document.getElementById('importErrCount');
        el.style.display = 'inline-flex';
        el.textContent = `${errors} ข้อผิดพลาด`;
    }

    // Summary per file
    const summaryEl = document.getElementById('importSummary');
    summaryEl.innerHTML = importParsedData.map(f => `
        <div style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:var(--gray-50);border-radius:8px;margin:0 4px 4px 0;font-size:12px">
            <i class="fas fa-file-excel" style="color:#22c55e"></i>
            <strong>${f.name}</strong>
            <span class="tag tag-info" style="font-size:10px">${f.type}</span>
            <span style="color:var(--gray-500)">${fmtNum(f.totalRows)} รายการ</span>
            ${f.sheets.length > 1 ? `<span style="color:var(--gray-400)">(${f.sheets.length} sheets)</span>` : ''}
            ${f.error ? `<span class="tag tag-danger" style="font-size:10px">${f.error}</span>` : ''}
        </div>`).join('');

    // Unique stats
    const stores = [...new Set(allRows.map(r => r.store).filter(Boolean))];
    const branches = [...new Set(allRows.map(r => r.branch).filter(Boolean))];
    const brands = [...new Set(allRows.map(r => r.brand).filter(b => b && b !== 'อื่นๆ'))];

    summaryEl.innerHTML += `
        <div style="display:flex;gap:16px;margin-top:12px;flex-wrap:wrap">
            <div style="padding:8px 14px;background:#dbeafe;border-radius:8px;font-size:12px"><i class="fas fa-store" style="color:var(--info)"></i> <strong>${stores.length}</strong> ห้าง</div>
            <div style="padding:8px 14px;background:#dcfce7;border-radius:8px;font-size:12px"><i class="fas fa-map-pin" style="color:var(--success)"></i> <strong>${branches.length}</strong> สาขา</div>
            <div style="padding:8px 14px;background:#fef9c3;border-radius:8px;font-size:12px"><i class="fas fa-tag" style="color:var(--warning)"></i> <strong>${brands.length}</strong> แบรนด์</div>
            <div style="padding:8px 14px;background:#f3e8ff;border-radius:8px;font-size:12px"><i class="fas fa-boxes-stacked" style="color:#7c3aed"></i> <strong>${fmtNum(allRows.length)}</strong> รายการ</div>
        </div>`;

    // Preview table (first 15 rows)
    const preview = allRows.slice(0, 15);
    document.getElementById('importPreviewTable').innerHTML = `
        <table class="data-table">
            <thead><tr><th>#</th><th>รหัส</th><th>ชื่อสินค้า</th><th>แบรนด์</th><th>สาขา</th><th>สต๊อก</th><th>Min</th><th>ขาย</th><th>สถานะ</th></tr></thead>
            <tbody>
                ${preview.map((r, i) => `
                <tr${r._warning ? ' style="background:#fefce8"' : ''}>
                    <td>${i + 1}</td>
                    <td><code style="font-size:11px">${r.artno || '-'}</code></td>
                    <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${r.name}">${r.name || '-'}</td>
                    <td><span class="tag tag-gray" style="font-size:10px">${r.brand}</span></td>
                    <td style="font-size:12px">${r.branch || '-'}</td>
                    <td style="text-align:right;font-weight:600;${r.qty <= r.min && r.min > 0 ? 'color:var(--danger)' : ''}">${r.qty}</td>
                    <td style="text-align:right;color:var(--gray-400)">${r.min || '-'}</td>
                    <td style="text-align:right">${r.sold || '-'}</td>
                    <td>${getRowStatus(r)}</td>
                </tr>`).join('')}
            </tbody>
        </table>
        <p style="text-align:center;font-size:12px;color:var(--gray-400);margin-top:8px">แสดง ${preview.length} จาก ${fmtNum(allRows.length)} รายการ</p>`;
}

function getRowStatus(r) {
    if (r._warning) return '<span class="tag tag-warning" style="font-size:10px"><i class="fas fa-exclamation"></i></span>';
    if (r.nonMoveDay > 90) return '<span class="tag tag-danger" style="font-size:10px">Non-Moving</span>';
    if (r.qty > 0 && r.qty <= r.min && r.min > 0) return '<span class="tag tag-warning" style="font-size:10px">ต่ำกว่า Min</span>';
    return '<span class="tag tag-success" style="font-size:10px"><i class="fas fa-check"></i></span>';
}

function cancelImport() {
    document.getElementById('importPreview').style.display = 'none';
    document.getElementById('importFile').value = '';
    importPendingFiles = [];
    importParsedData = [];
}

function doImport() {
    const allRows = importParsedData.flatMap(f => f.rows);
    if (!allRows.length) { showToast('ไม่มีข้อมูลให้นำเข้า'); return; }

    // Build products list (unique by artno)
    const productsMap = {};
    const stockList = [];
    const salesList = [];

    allRows.forEach(r => {
        const key = r.artno || r.name;
        if (!productsMap[key]) {
            productsMap[key] = {
                artno: r.artno, name: r.name, brand: r.brand, category: r.category,
            };
        }
        stockList.push({
            artno: r.artno, name: r.name, branch: r.branch, store: r.store,
            region: r.region, qty: r.qty, min: r.min, nonMoveDay: r.nonMoveDay,
            display: r.display,
        });
        if (r.sold > 0 || r.amount > 0) {
            salesList.push({
                artno: r.artno, name: r.name, branch: r.branch, store: r.store,
                qtySold: r.sold, amount: r.amount,
            });
        }
    });

    const importedData = {
        lastImport: new Date().toISOString(),
        files: importParsedData.map(f => ({ name: f.name, type: f.type, rows: f.totalRows, date: new Date().toLocaleDateString('th-TH') })),
        products: Object.values(productsMap),
        stock: stockList,
        sales: salesList,
    };

    saveData('imported_data', importedData);

    // Save history
    const history = loadData('import_history', []);
    importParsedData.forEach(f => {
        history.unshift({
            date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }),
            name: f.name,
            type: f.type,
            rows: f.totalRows,
        });
    });
    saveData('import_history', history.slice(0, 50));

    // Show result
    document.getElementById('importPreview').style.display = 'none';
    document.getElementById('importResult').style.display = 'block';
    document.getElementById('importResultMsg').textContent =
        `นำเข้าข้อมูล ${fmtNum(allRows.length)} รายการจาก ${importParsedData.length} ไฟล์ สินค้า ${fmtNum(Object.keys(productsMap).length)} รายการ`;
    showToast('นำเข้าข้อมูลสำเร็จ!');
}

function clearImportHistory() {
    saveData('import_history', []);
    saveData('imported_data', null);
    showToast('ล้างข้อมูลทั้งหมดแล้ว');
    renderImport(currentRole);
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}
