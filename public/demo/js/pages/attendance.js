/* Attendance / OT Page - with real GPS */
function renderAttendance(role) {
    const c = document.getElementById('contentArea');
    if (role === 'seller' || role === 'employee') {
        c.innerHTML = getAttendanceClockIn();
        initGPSClockIn();
    } else {
        c.innerHTML = getAttendanceAdmin();
    }
}

function getAttendanceClockIn() {
    return `
    <div class="card" style="margin-bottom:20px">
        <div class="card-header"><h3><i class="fas fa-location-crosshairs" style="color:var(--primary);margin-right:6px"></i> ลงเวลาเข้า-ออกงาน (GPS)</h3></div>
        <div class="card-body">
            <div style="text-align:center">
                <div id="gpsStatus" style="margin-bottom:16px">
                    <i class="fas fa-spinner fa-spin" style="font-size:24px;color:var(--primary)"></i>
                    <p style="margin-top:8px;color:var(--gray-500)">กำลังตรวจสอบตำแหน่ง GPS...</p>
                </div>
                <div id="gpsInfo" style="display:none;margin-bottom:16px">
                    <div id="gpsMap" style="width:100%;height:200px;background:var(--gray-100);border-radius:var(--radius);margin-bottom:12px;display:flex;align-items:center;justify-content:center;color:var(--gray-400)">
                        <div id="mapContent"><i class="fas fa-map" style="font-size:40px"></i></div>
                    </div>
                    <p style="font-size:13px;color:var(--gray-600)">
                        <i class="fas fa-map-pin" style="color:var(--primary)"></i>
                        ตำแหน่งปัจจุบัน: <span id="gpsCoords">-</span>
                    </p>
                    <p style="font-size:13px;margin-top:4px" id="gpsDistance">
                        <i class="fas fa-circle-check" style="color:var(--success)"></i>
                        ระยะห่างจากสาขา: <span>-</span>
                    </p>
                </div>
                <div id="clockInBtn" style="display:none">
                    <button class="btn btn-success btn-lg" onclick="doClockIn()" id="btnClockIn">
                        <i class="fas fa-right-to-bracket"></i> ลงเวลาเข้างาน
                    </button>
                </div>
                <div id="clockedInInfo" style="display:none;padding:16px;background:#f0fdf4;border-radius:var(--radius)">
                    <p style="font-size:18px;font-weight:700;color:var(--success)"><i class="fas fa-check-circle"></i> ลงเวลาเข้าแล้ว</p>
                    <p style="color:var(--gray-600);margin-top:4px">เวลาเข้า: <strong id="clockInTime">-</strong></p>
                    <button class="btn btn-accent btn-lg" style="margin-top:12px" onclick="doClockOut()">
                        <i class="fas fa-right-from-bracket"></i> ลงเวลาออกงาน
                    </button>
                </div>
                <div id="cameraCaptureSection" style="display:none;margin-top:16px">
                    <p style="font-size:13px;font-weight:600;margin-bottom:8px"><i class="fas fa-camera"></i> ถ่ายรูปยืนยัน</p>
                    <video id="cameraPreview" style="width:260px;height:200px;border-radius:8px;background:#000;display:none" autoplay playsinline></video>
                    <canvas id="cameraCanvas" style="display:none"></canvas>
                    <img id="capturedPhoto" style="width:260px;height:200px;border-radius:8px;object-fit:cover;display:none">
                    <div style="margin-top:8px">
                        <button class="btn btn-outline btn-sm" id="btnCapturePhoto" onclick="capturePhoto()"><i class="fas fa-camera"></i> ถ่ายรูป</button>
                        <button class="btn btn-outline btn-sm" id="btnRetake" style="display:none" onclick="retakePhoto()"><i class="fas fa-redo"></i> ถ่ายใหม่</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3><i class="fas fa-history" style="color:var(--gray-500);margin-right:6px"></i> ประวัติลงเวลาของฉัน</h3></div>
        <div class="card-body">
            <table class="data-table">
                <thead><tr><th>วันที่</th><th>เวลาเข้า</th><th>เวลาออก</th><th>OT</th><th>สถานะ</th></tr></thead>
                <tbody id="myAttendanceHistory">
                    <tr><td>13 ก.พ. 2569</td><td>08:32</td><td>-</td><td>-</td><td><span class="tag tag-success">ทำงาน</span></td></tr>
                    <tr><td>12 ก.พ. 2569</td><td>08:15</td><td>17:30</td><td>0</td><td><span class="tag tag-success">ทำงาน</span></td></tr>
                    <tr><td>11 ก.พ. 2569</td><td>08:45</td><td>18:00</td><td>1</td><td><span class="tag tag-warning">สาย</span></td></tr>
                    <tr><td>10 ก.พ. 2569</td><td>08:00</td><td>17:30</td><td>0</td><td><span class="tag tag-success">ทำงาน</span></td></tr>
                    <tr><td>9 ก.พ. 2569</td><td>-</td><td>-</td><td>-</td><td><span class="tag tag-info">ลาป่วย</span></td></tr>
                </tbody>
            </table>
        </div>
    </div>`;
}

function initGPSClockIn() {
    const saved = loadData('attendance_today', null);
    if (saved && saved.date === new Date().toDateString()) {
        document.getElementById('gpsStatus').style.display = 'none';
        document.getElementById('gpsInfo').style.display = 'block';
        document.getElementById('gpsCoords').textContent = saved.coords || '-';
        document.getElementById('clockedInInfo').style.display = 'block';
        document.getElementById('clockInTime').textContent = saved.time;
        return;
    }

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                const lat = pos.coords.latitude.toFixed(6);
                const lon = pos.coords.longitude.toFixed(6);
                document.getElementById('gpsStatus').style.display = 'none';
                document.getElementById('gpsInfo').style.display = 'block';
                document.getElementById('gpsCoords').textContent = `${lat}, ${lon}`;
                // Mock: branch location nearby
                const dist = Math.floor(Math.random() * 80 + 10);
                const distEl = document.getElementById('gpsDistance');
                if (dist <= 100) {
                    distEl.innerHTML = `<i class="fas fa-circle-check" style="color:var(--success)"></i> ระยะห่าง: <strong>${dist} เมตร</strong> <span class="tag tag-success">อยู่ในรัศมี</span>`;
                    document.getElementById('clockInBtn').style.display = 'block';
                } else {
                    distEl.innerHTML = `<i class="fas fa-circle-xmark" style="color:var(--danger)"></i> ระยะห่าง: <strong>${dist} เมตร</strong> <span class="tag tag-danger">นอกรัศมี</span>`;
                    document.getElementById('clockInBtn').style.display = 'block';
                }
                // Try show map
                document.getElementById('mapContent').innerHTML = `
                    <iframe src="https://maps.google.com/maps?q=${lat},${lon}&z=16&output=embed"
                        style="width:100%;height:100%;border:none;border-radius:var(--radius)"></iframe>`;
            },
            err => {
                document.getElementById('gpsStatus').innerHTML = `
                    <i class="fas fa-location-crosshairs" style="font-size:24px;color:var(--warning)"></i>
                    <p style="margin-top:8px;color:var(--warning)">ไม่สามารถเข้าถึง GPS: ${err.message}</p>
                    <p style="color:var(--gray-500);font-size:12px;margin-top:4px">กรุณาอนุญาตการเข้าถึงตำแหน่ง</p>`;
                document.getElementById('clockInBtn').style.display = 'block';
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    } else {
        document.getElementById('gpsStatus').innerHTML = `<p style="color:var(--danger)">อุปกรณ์ไม่รองรับ GPS</p>`;
        document.getElementById('clockInBtn').style.display = 'block';
    }
}

function doClockIn() {
    const now = new Date();
    const time = now.toLocaleTimeString('th-TH', {hour:'2-digit', minute:'2-digit'});
    const coords = document.getElementById('gpsCoords').textContent;
    saveData('attendance_today', { date: now.toDateString(), time, coords });
    document.getElementById('clockInBtn').style.display = 'none';
    document.getElementById('clockedInInfo').style.display = 'block';
    document.getElementById('clockInTime').textContent = time;
    // Show camera
    document.getElementById('cameraCaptureSection').style.display = 'block';
    startCamera();
    showToast('ลงเวลาเข้างานเรียบร้อย!');
}

function doClockOut() {
    const now = new Date();
    const time = now.toLocaleTimeString('th-TH', {hour:'2-digit', minute:'2-digit'});
    showToast(`ลงเวลาออกงาน ${time} เรียบร้อย!`);
    localStorage.removeItem('mdt_attendance_today');
}

function startCamera() {
    if (!navigator.mediaDevices) return;
    navigator.mediaDevices.getUserMedia({ video: { facingMode:'user' } })
        .then(stream => {
            const video = document.getElementById('cameraPreview');
            video.srcObject = stream;
            video.style.display = 'block';
            window._cameraStream = stream;
        }).catch(() => {});
}

function capturePhoto() {
    const video = document.getElementById('cameraPreview');
    const canvas = document.getElementById('cameraCanvas');
    const img = document.getElementById('capturedPhoto');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    img.src = canvas.toDataURL('image/jpeg', 0.8);
    img.style.display = 'block';
    video.style.display = 'none';
    document.getElementById('btnCapturePhoto').style.display = 'none';
    document.getElementById('btnRetake').style.display = 'inline-flex';
    if (window._cameraStream) window._cameraStream.getTracks().forEach(t => t.stop());
    showToast('ถ่ายรูปยืนยันเรียบร้อย!');
}

function retakePhoto() {
    document.getElementById('capturedPhoto').style.display = 'none';
    document.getElementById('btnRetake').style.display = 'none';
    document.getElementById('btnCapturePhoto').style.display = 'inline-flex';
    startCamera();
}

function getAttendanceAdmin() {
    return `
    <div class="filter-bar">
        <div class="form-group"><label class="form-label">วันที่</label><input type="date" class="form-control" value="2026-02-13"></div>
        <div class="form-group"><label class="form-label">สาขา</label>
            <select class="form-control"><option>ทุกสาขา</option><option>HomePro เอกมัย</option><option>DoHome บางบัวทอง</option><option>BnB พระราม2</option></select>
        </div>
        <div class="form-group"><label class="form-label">สถานะ</label>
            <select class="form-control"><option>ทั้งหมด</option><option>มาทำงาน</option><option>สาย</option><option>ลา</option><option>ขาด</option></select>
        </div>
        <div class="form-group" style="align-self:end"><button class="btn btn-primary"><i class="fas fa-search"></i> ค้นหา</button></div>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(5,1fr)">
        <div class="stat-card"><div class="stat-icon" style="background:var(--success)"><i class="fas fa-user-check"></i></div>
            <div><div class="stat-value">42</div><div class="stat-label">มาทำงาน</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--warning)"><i class="fas fa-user-clock"></i></div>
            <div><div class="stat-value">3</div><div class="stat-label">มาสาย</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--info)"><i class="fas fa-bed"></i></div>
            <div><div class="stat-value">2</div><div class="stat-label">ลา</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--danger)"><i class="fas fa-user-xmark"></i></div>
            <div><div class="stat-value">1</div><div class="stat-label">ขาด</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:var(--primary)"><i class="fas fa-clock"></i></div>
            <div><div class="stat-value">24</div><div class="stat-label">OT (ชม.)</div></div></div>
    </div>

    <div class="card">
        <div class="card-header"><h3>รายชื่อพนักงานวันนี้</h3>
            <button class="btn btn-sm btn-outline"><i class="fas fa-download"></i> Export</button></div>
        <div class="card-body">
            <table class="data-table">
                <thead><tr><th>รหัส</th><th>ชื่อ</th><th>สาขา</th><th>เวลาเข้า</th><th>เวลาออก</th><th>OT</th><th>สถานะ</th><th>GPS</th></tr></thead>
                <tbody>
                    <tr><td>EMP001</td><td>พรทิพย์ สวยงาม</td><td>HomePro เอกมัย</td><td>08:15</td><td>-</td><td>-</td><td><span class="tag tag-success">ทำงาน</span></td><td><span class="tag tag-success"><i class="fas fa-map-pin"></i> 35m</span></td></tr>
                    <tr><td>EMP002</td><td>สมชาย ใจดี</td><td>DoHome บางบัวทอง</td><td>08:45</td><td>-</td><td>-</td><td><span class="tag tag-warning">สาย</span></td><td><span class="tag tag-success"><i class="fas fa-map-pin"></i> 22m</span></td></tr>
                    <tr><td>EMP003</td><td>มานี รักเรียน</td><td>BnB พระราม2</td><td>08:00</td><td>-</td><td>-</td><td><span class="tag tag-success">ทำงาน</span></td><td><span class="tag tag-success"><i class="fas fa-map-pin"></i> 15m</span></td></tr>
                    <tr><td>EMP004</td><td>จรัญ ทำดี</td><td>HomePro พัทยา</td><td>-</td><td>-</td><td>-</td><td><span class="tag tag-info">ลาป่วย</span></td><td>-</td></tr>
                    <tr><td>EMP005</td><td>สุดา ใจดี</td><td>DoHome ระยอง</td><td>07:55</td><td>-</td><td>-</td><td><span class="tag tag-success">ทำงาน</span></td><td><span class="tag tag-success"><i class="fas fa-map-pin"></i> 45m</span></td></tr>
                    <tr><td>EMP006</td><td>วิชัย มั่นคง</td><td>MegaHome รังสิต</td><td>09:10</td><td>-</td><td>-</td><td><span class="tag tag-warning">สาย</span></td><td><span class="tag tag-danger"><i class="fas fa-map-pin"></i> 150m</span></td></tr>
                </tbody>
            </table>
        </div>
    </div>`;
}
