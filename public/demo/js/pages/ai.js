/* AI Assistant Page - Real Grok API Integration */

let aiChatHistory = [];
let aiApiKey = '';
let aiModel = 'grok-3';

function renderAI(role) {
    const c = document.getElementById('contentArea');
    aiApiKey = loadData('grok_api_key', '');
    aiModel = loadData('grok_model', 'grok-3');
    aiChatHistory = loadData('ai_chat_history', []);

    c.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 320px;gap:16px;height:calc(100vh - 180px);min-height:500px">
        <!-- Chat Area -->
        <div class="card" style="display:flex;flex-direction:column;margin-bottom:0">
            <div class="card-header" style="flex-shrink:0">
                <h3><i class="fas fa-robot" style="color:var(--primary);margin-right:6px"></i> AI ผู้ช่วยอัจฉริยะ (Grok)</h3>
                <div style="display:flex;gap:6px">
                    <span class="tag ${aiApiKey ? 'tag-success' : 'tag-danger'}" id="aiConnectionStatus">
                        <i class="fas fa-${aiApiKey ? 'circle-check' : 'circle-xmark'}"></i>
                        ${aiApiKey ? 'เชื่อมต่อแล้ว' : 'ยังไม่ตั้งค่า'}
                    </span>
                    <button class="btn btn-sm btn-outline" onclick="showAISettings()"><i class="fas fa-gear"></i></button>
                    <button class="btn btn-sm btn-outline" onclick="clearAIChat()" title="ล้างการสนทนา"><i class="fas fa-eraser"></i></button>
                </div>
            </div>
            <div class="card-body" style="flex:1;overflow-y:auto;padding:12px" id="aiChatBox">
                ${renderAIChatMessages()}
            </div>
            <div style="padding:12px;border-top:1px solid var(--gray-200);flex-shrink:0">
                <div style="display:flex;gap:8px">
                    <div style="flex:1;position:relative">
                        <textarea class="form-control" id="aiInput" rows="2"
                            placeholder="พิมพ์คำถาม เช่น &quot;วิเคราะห์สินค้าที่ขายดี&quot; หรือ &quot;แนะนำวิธีเพิ่มยอดขาย&quot;..."
                            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendAIMessage()}"
                            style="padding-right:40px;resize:none"></textarea>
                    </div>
                    <button class="btn btn-primary" onclick="sendAIMessage()" id="aiSendBtn" style="align-self:end">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap" id="aiQuickActions">
                    ${getAIQuickActions(role)}
                </div>
            </div>
        </div>

        <!-- Side Panel -->
        <div style="display:flex;flex-direction:column;gap:16px">
            <!-- Context Info -->
            <div class="card" style="margin-bottom:0">
                <div class="card-header"><h3 style="font-size:14px"><i class="fas fa-brain"></i> บริบท AI</h3></div>
                <div class="card-body" style="padding:12px">
                    <div style="font-size:12px;color:var(--gray-600)">
                        <p style="margin-bottom:6px"><i class="fas fa-user" style="width:16px"></i> บทบาท: <strong>${ROLE_NAMES[role].name}</strong></p>
                        <p style="margin-bottom:6px"><i class="fas fa-store" style="width:16px"></i> ข้อมูล: สยามพลาสวูด (UPVC/WPC)</p>
                        <p style="margin-bottom:6px"><i class="fas fa-microchip" style="width:16px"></i> โมเดล: <strong id="aiModelDisplay">${aiModel}</strong></p>
                        <p><i class="fas fa-database" style="width:16px"></i> มีข้อมูล: ยอดขาย, สต๊อก, สาขา</p>
                    </div>
                </div>
            </div>

            <!-- Prompt Templates -->
            <div class="card" style="margin-bottom:0;flex:1;overflow-y:auto">
                <div class="card-header"><h3 style="font-size:14px"><i class="fas fa-lightbulb"></i> คำถามแนะนำ</h3></div>
                <div class="card-body" style="padding:8px">
                    ${getAIPromptTemplates(role)}
                </div>
            </div>

            <!-- Stats -->
            <div class="card" style="margin-bottom:0">
                <div class="card-body" style="padding:12px">
                    <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gray-500)">
                        <span>ข้อความวันนี้</span>
                        <strong id="aiMsgCount">${aiChatHistory.length}</strong>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gray-500);margin-top:4px">
                        <span>Token ที่ใช้ (ประมาณ)</span>
                        <strong id="aiTokenCount">${estimateTokens()}</strong>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    scrollAIChatToBottom();
}

function getAIQuickActions(role) {
    const actions = {
        admin: [
            { icon: 'fa-chart-bar', label: 'สรุปยอดขาย', prompt: 'สรุปยอดขายรวมทุกสาขาเดือนนี้ พร้อมแนะนำ action items' },
            { icon: 'fa-box', label: 'วิเคราะห์สต๊อก', prompt: 'วิเคราะห์สินค้าที่สต๊อกต่ำกว่า Min Target ทุกสาขา ควรสั่งเพิ่มอะไรบ้าง' },
            { icon: 'fa-fire', label: 'ปัญหาด่วน', prompt: 'สรุปปัญหาที่ยังไม่ได้แก้ไข เรียงตามความเร่งด่วน' },
        ],
        supervisor: [
            { icon: 'fa-users', label: 'ภาพรวมทีม', prompt: 'สรุปภาพรวมทีมงานวันนี้ ใครมาสาย ใครลา มีงานค้างอะไร' },
            { icon: 'fa-chart-line', label: 'เทรนด์ขาย', prompt: 'วิเคราะห์เทรนด์ยอดขายสินค้า UPVC ประตู 3 เดือนล่าสุด' },
            { icon: 'fa-lightbulb', label: 'แนะนำกลยุทธ์', prompt: 'แนะนำกลยุทธ์เพิ่มยอดขายประตู UPVC ในห้าง HomePro' },
        ],
        seller: [
            { icon: 'fa-door-open', label: 'ข้อมูลสินค้า', prompt: 'สรุปจุดเด่นของประตู UPVC AZLE เทียบกับคู่แข่ง สำหรับใช้พูดกับลูกค้า' },
            { icon: 'fa-tags', label: 'โปรโมชั่น', prompt: 'โปรโมชั่นที่กำลังใช้อยู่ตอนนี้มีอะไรบ้าง ควรแนะนำลูกค้าอย่างไร' },
            { icon: 'fa-handshake', label: 'เทคนิคขาย', prompt: 'แนะนำเทคนิคการขายประตูให้ลูกค้าที่กำลังสร้างบ้านใหม่' },
        ],
        hr: [
            { icon: 'fa-calendar', label: 'สรุปลา/OT', prompt: 'สรุปสถิติการลาและ OT ของพนักงานทั้งหมดเดือนนี้' },
            { icon: 'fa-chart-pie', label: 'ผลงาน', prompt: 'วิเคราะห์ผลงานพนักงานขายแต่ละคน เรียงตามยอดขาย' },
        ],
        employee: [
            { icon: 'fa-question', label: 'ถามเรื่องงาน', prompt: 'สิทธิ์การลาของฉันเหลือกี่วัน และกฎการลามีอะไรบ้าง' },
            { icon: 'fa-book', label: 'คู่มือสินค้า', prompt: 'สรุปสินค้าหลักของสยามพลาสวูดแต่ละประเภท ใช้งานอย่างไร' },
        ],
    };
    return (actions[role] || actions.employee).map(a =>
        `<button class="btn btn-sm btn-outline" onclick="useQuickAction('${a.prompt.replace(/'/g, "\\'")}')" title="${a.prompt}">
            <i class="fas ${a.icon}"></i> ${a.label}
        </button>`
    ).join('');
}

function getAIPromptTemplates(role) {
    const templates = [
        { cat: 'การขาย', items: [
            'สินค้าขายดีสุด 10 อันดับแรกเดือนนี้',
            'เปรียบเทียบยอดขายระหว่าง HomePro กับ DoHome',
            'สินค้าที่ขายไม่ออก (Non Moving) ควรทำอย่างไร',
            'วิเคราะห์ฤดูกาลของยอดขายประตู',
        ]},
        { cat: 'สต๊อก', items: [
            'สินค้าที่ต้องสั่งเพิ่มด่วน (ต่ำกว่า Min)',
            'สรุป Coverage Day ของสินค้าหลัก',
            'สินค้าที่ไม่มีตัวโชว์ในสาขาไหนบ้าง',
        ]},
        { cat: 'กลยุทธ์', items: [
            'แนะนำแผนการตลาดเพิ่มยอดขายสาขาที่ตกเป้า',
            'วิเคราะห์โอกาสเปิดสาขาใหม่ในห้างไหน',
            'เปรียบเทียบจุดแข็ง/จุดอ่อน ประตู UPVC กับไม้จริง',
        ]},
    ];
    return templates.map(t => `
        <div style="margin-bottom:8px">
            <div style="font-size:11px;font-weight:700;color:var(--gray-400);margin-bottom:4px">${t.cat}</div>
            ${t.items.map(item => `
                <div style="padding:6px 8px;font-size:12px;cursor:pointer;border-radius:6px;margin-bottom:2px;color:var(--gray-600);transition:background .15s"
                    onmouseover="this.style.background='var(--gray-100)'"
                    onmouseout="this.style.background=''"
                    onclick="useQuickAction('${item.replace(/'/g, "\\'")}')">
                    <i class="fas fa-chevron-right" style="font-size:9px;margin-right:4px;color:var(--gray-400)"></i> ${item}
                </div>`).join('')}
        </div>`).join('');
}

function renderAIChatMessages() {
    if (aiChatHistory.length === 0) {
        return `
        <div style="text-align:center;padding:40px 20px">
            <i class="fas fa-robot" style="font-size:48px;color:var(--gray-300);margin-bottom:12px"></i>
            <h3 style="color:var(--gray-500);margin-bottom:8px">สวัสดีครับ! ผม AI ผู้ช่วย</h3>
            <p style="color:var(--gray-400);font-size:13px;max-width:400px;margin:0 auto">
                ผมช่วยวิเคราะห์ข้อมูลยอดขาย, สต๊อก, แนะนำกลยุทธ์การขาย
                และตอบคำถามเกี่ยวกับสินค้าสยามพลาสวูดได้<br><br>
                ${!aiApiKey ? '<span style="color:var(--warning)"><i class="fas fa-exclamation-triangle"></i> กรุณาตั้งค่า API Key ก่อนเริ่มใช้งาน</span>' : 'พิมพ์คำถามหรือเลือกคำถามด้านขวาได้เลยครับ'}
            </p>
        </div>`;
    }
    return aiChatHistory.map(msg => {
        if (msg.role === 'user') {
            return `
            <div style="display:flex;justify-content:flex-end;margin-bottom:12px">
                <div style="max-width:75%;padding:10px 14px;background:var(--primary);color:white;border-radius:16px 16px 4px 16px;font-size:13px;line-height:1.5">
                    ${escapeHtml(msg.content)}
                </div>
            </div>`;
        } else if (msg.role === 'assistant') {
            return `
            <div style="display:flex;gap:8px;margin-bottom:12px">
                <div style="width:28px;height:28px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                    <i class="fas fa-robot" style="font-size:12px;color:white"></i>
                </div>
                <div style="max-width:75%;padding:10px 14px;background:var(--gray-100);border-radius:4px 16px 16px 16px;font-size:13px;line-height:1.6">
                    ${formatAIResponse(msg.content)}
                </div>
            </div>`;
        } else if (msg.role === 'error') {
            return `
            <div style="display:flex;gap:8px;margin-bottom:12px">
                <div style="width:28px;height:28px;border-radius:50%;background:var(--danger);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                    <i class="fas fa-exclamation" style="font-size:12px;color:white"></i>
                </div>
                <div style="max-width:75%;padding:10px 14px;background:#fef2f2;border:1px solid #fecaca;border-radius:4px 16px 16px 16px;font-size:13px;color:var(--danger)">
                    ${escapeHtml(msg.content)}
                </div>
            </div>`;
        }
        return '';
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatAIResponse(text) {
    // Convert markdown-like formatting
    let html = escapeHtml(text);
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Bullet points
    html = html.replace(/^[-•]\s(.+)/gm, '<li style="margin-left:16px;margin-bottom:2px">$1</li>');
    // Numbered lists
    html = html.replace(/^\d+\.\s(.+)/gm, '<li style="margin-left:16px;margin-bottom:2px">$1</li>');
    // Line breaks
    html = html.replace(/\n\n/g, '<br><br>');
    html = html.replace(/\n/g, '<br>');
    return html;
}

function useQuickAction(prompt) {
    document.getElementById('aiInput').value = prompt;
    sendAIMessage();
}

async function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    if (!message) return;

    // Check API key
    if (!aiApiKey) {
        showAISettings();
        showToast('กรุณาตั้งค่า Grok API Key ก่อน');
        return;
    }

    // Add user message
    aiChatHistory.push({ role: 'user', content: message });
    input.value = '';
    input.style.height = 'auto';

    // Update chat display
    const chatBox = document.getElementById('aiChatBox');
    chatBox.innerHTML = renderAIChatMessages();

    // Add typing indicator
    chatBox.innerHTML += `
    <div id="aiTyping" style="display:flex;gap:8px;margin-bottom:12px">
        <div style="width:28px;height:28px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <i class="fas fa-robot" style="font-size:12px;color:white"></i>
        </div>
        <div style="padding:10px 14px;background:var(--gray-100);border-radius:4px 16px 16px 16px;font-size:13px">
            <i class="fas fa-spinner fa-spin"></i> กำลังคิด...
        </div>
    </div>`;
    scrollAIChatToBottom();

    // Disable send button
    document.getElementById('aiSendBtn').disabled = true;

    try {
        const systemPrompt = getSystemPrompt();
        const messages = [
            { role: 'system', content: systemPrompt },
            ...aiChatHistory.filter(m => m.role !== 'error').slice(-20).map(m => ({
                role: m.role,
                content: m.content
            }))
        ];

        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${aiApiKey}`
            },
            body: JSON.stringify({
                model: aiModel,
                messages: messages,
                temperature: 0.7,
                max_tokens: 2048,
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || 'ไม่ได้รับการตอบกลับ';

        aiChatHistory.push({ role: 'assistant', content: reply });

    } catch (err) {
        console.error('Grok API Error:', err);
        aiChatHistory.push({
            role: 'error',
            content: `เกิดข้อผิดพลาด: ${err.message}`
        });
    }

    // Save history
    saveData('ai_chat_history', aiChatHistory.slice(-50));

    // Update display
    chatBox.innerHTML = renderAIChatMessages();
    scrollAIChatToBottom();
    document.getElementById('aiSendBtn').disabled = false;
    document.getElementById('aiMsgCount').textContent = aiChatHistory.length;
    document.getElementById('aiTokenCount').textContent = estimateTokens();
}

function getSystemPrompt() {
    const role = currentRole;
    const roleInfo = ROLE_NAMES[role];
    return `คุณเป็น AI ผู้ช่วยของบริษัท สยามพลาสวูด จำกัด ผู้ผลิตและจำหน่ายประตู UPVC, WPC, PVC และวงกบ
แบรนด์หลัก: AZLE (ประตู UPVC/WPC), และสินค้า PVC
จำหน่ายผ่านห้าง: HomePro, DoHome, MegaHome, BnB Home (BTV)

ผู้ใช้ปัจจุบัน: ${roleInfo.fullName} (${roleInfo.name})

ข้อมูลบริษัท:
- สินค้าหลัก: ประตูห้องน้ำ UPVC, ประตูภายนอก UPVC, ประตูภายใน WPC, วงกบ WPC/UPVC, ประตู PVC
- จุดเด่น: กันน้ำ 100%, ปลวกไม่กิน, ไม่บวม ไม่หด, ทนแดดทนฝน, ติดตั้งง่าย
- ช่วงราคา: PVC 900-1,500 บาท, UPVC 1,500-3,500 บาท, WPC 2,500-5,000 บาท
- สาขาที่จำหน่าย: HomePro 90+ สาขา, DoHome 20+ สาขา, MegaHome 8+ สาขา, BnB Home 10+ สาขา

แนวทางตอบ:
- ตอบเป็นภาษาไทย กระชับ ตรงประเด็น
- ใช้ข้อมูลเชิงตัวเลขและสถิติเมื่อเป็นไปได้
- ให้คำแนะนำที่นำไปปฏิบัติได้จริง (Actionable)
- ปรับระดับรายละเอียดตามบทบาทผู้ใช้
- ถ้าเป็นคำถามเกี่ยวกับข้อมูลเฉพาะที่ไม่มี ให้แจ้งว่าต้องดูจากระบบรายงาน
- ห้ามสร้างตัวเลขปลอม ถ้าไม่มีข้อมูลจริงให้บอกตรงๆ`;
}

function showAISettings() {
    const currentKey = aiApiKey ? (aiApiKey.substring(0, 8) + '...' + aiApiKey.substring(aiApiKey.length - 4)) : '';
    showModal('ตั้งค่า AI (Grok)', `
        <div class="form-group">
            <label class="form-label">Grok API Key *</label>
            <input type="password" class="form-control" id="aiApiKeyInput" value="${aiApiKey}"
                placeholder="xai-xxxxxxxxxxxxxxxxxxxxxxxx">
            <p style="font-size:11px;color:var(--gray-400);margin-top:4px">
                รับ API Key ได้ที่ <a href="https://console.x.ai" target="_blank" style="color:var(--primary)">console.x.ai</a>
                ${currentKey ? `<br>Key ปัจจุบัน: <code>${currentKey}</code>` : ''}
            </p>
        </div>
        <div class="form-group">
            <label class="form-label">โมเดล</label>
            <select class="form-control" id="aiModelSelect">
                <option value="grok-3" ${aiModel === 'grok-3' ? 'selected' : ''}>Grok 3 (แนะนำ)</option>
                <option value="grok-3-mini" ${aiModel === 'grok-3-mini' ? 'selected' : ''}>Grok 3 Mini (เร็วกว่า)</option>
                <option value="grok-2" ${aiModel === 'grok-2' ? 'selected' : ''}>Grok 2</option>
            </select>
        </div>
        <div style="padding:12px;background:#f0fdf4;border-radius:8px;border-left:4px solid var(--success);margin-top:12px">
            <p style="font-size:12px;font-weight:700;margin-bottom:4px"><i class="fas fa-shield-check"></i> ความปลอดภัย</p>
            <p style="font-size:11px;color:var(--gray-600)">API Key จะถูกเก็บเฉพาะในเบราว์เซอร์ของคุณ (localStorage) ไม่มีการส่งไปเซิร์ฟเวอร์ใดๆ</p>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">ยกเลิก</button>
        <button class="btn btn-success" onclick="saveAISettings()"><i class="fas fa-check"></i> บันทึก</button>`);
}

function saveAISettings() {
    const key = document.getElementById('aiApiKeyInput').value.trim();
    const model = document.getElementById('aiModelSelect').value;

    if (!key) {
        showToast('กรุณาใส่ API Key');
        return;
    }

    aiApiKey = key;
    aiModel = model;
    saveData('grok_api_key', aiApiKey);
    saveData('grok_model', aiModel);

    // Update status
    const statusEl = document.getElementById('aiConnectionStatus');
    if (statusEl) {
        statusEl.className = 'tag tag-success';
        statusEl.innerHTML = '<i class="fas fa-circle-check"></i> เชื่อมต่อแล้ว';
    }
    const modelEl = document.getElementById('aiModelDisplay');
    if (modelEl) modelEl.textContent = aiModel;

    closeModal();
    showToast('บันทึกการตั้งค่า AI สำเร็จ!');
}

function clearAIChat() {
    if (aiChatHistory.length === 0) return;
    aiChatHistory = [];
    saveData('ai_chat_history', []);
    const chatBox = document.getElementById('aiChatBox');
    if (chatBox) chatBox.innerHTML = renderAIChatMessages();
    const countEl = document.getElementById('aiMsgCount');
    if (countEl) countEl.textContent = '0';
    const tokenEl = document.getElementById('aiTokenCount');
    if (tokenEl) tokenEl.textContent = '0';
    showToast('ล้างการสนทนาแล้ว');
}

function scrollAIChatToBottom() {
    setTimeout(() => {
        const chatBox = document.getElementById('aiChatBox');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, 50);
}

function estimateTokens() {
    let total = 0;
    aiChatHistory.forEach(m => {
        // Rough estimate: Thai ~1 char per token, English ~4 chars per token
        total += Math.ceil(m.content.length * 0.8);
    });
    return fmtNum(total);
}
