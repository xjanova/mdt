<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>เข้าสู่ระบบ - MDT ERP สยามพลาสวูด</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
    <style>
        body { font-family: 'Sarabun', sans-serif; }
        .role-card { transition: all 0.2s ease; cursor: pointer; }
        .role-card:hover { transform: translateX(6px); border-color: #f59e0b !important; box-shadow: 0 4px 16px rgba(245,158,11,0.15); }
        .role-card:hover .role-arrow { color: #f59e0b; }
        .role-card:active { transform: translateX(3px); }
        .particle { position:absolute; border-radius:50%; background:rgba(245,158,11,0.12); animation:float 15s infinite; pointer-events:none; }
        @keyframes float { 0%,100%{transform:translateY(0) scale(1);opacity:0.2} 50%{transform:translateY(-60px) scale(1.15);opacity:0.5} }
    </style>
</head>
<body class="bg-gradient-to-br from-slate-900 via-[#1e3a5f] to-[#0f2027] min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <div class="particle" style="width:120px;height:120px;top:10%;left:10%;animation-delay:0s"></div>
    <div class="particle" style="width:80px;height:80px;top:60%;right:10%;animation-delay:3s"></div>
    <div class="particle" style="width:60px;height:60px;top:30%;left:60%;animation-delay:6s"></div>
    <div class="particle" style="width:100px;height:100px;bottom:10%;left:25%;animation-delay:9s"></div>

    <div class="w-full max-w-md relative z-10">
        <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-amber-500 rounded-[20px] shadow-lg shadow-amber-500/30 mb-4">
                <span class="text-4xl font-extrabold text-white">M</span>
            </div>
            <h1 class="text-2xl font-bold text-white">MDT ERP System</h1>
            <p class="text-slate-400 text-sm">Siam Plaswood - Modern Trade Management</p>
        </div>

        <div class="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl mb-4">
            <h2 class="text-lg font-bold text-white text-center mb-1">เข้าสู่ระบบ</h2>
            <p class="text-slate-400 text-sm text-center mb-5">เลือกบทบาทเพื่อเข้าสู่ระบบ Demo</p>

            @if ($errors->any())
            <div class="bg-red-500/20 border border-red-400/30 rounded-lg p-3 mb-4">
                <p class="text-red-300 text-sm"><i class="fas fa-exclamation-circle mr-1"></i> {!! $errors->first() !!}</p>
            </div>
            @endif

            <div class="space-y-2.5">
                <form method="POST" action="{{ route('demo.login') }}">
                    @csrf
                    <input type="hidden" name="role" value="central_admin">
                    <button type="submit" class="role-card w-full flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.03] text-left">
                        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center flex-shrink-0"><i class="fas fa-shield-halved text-white"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-white font-bold text-sm">Admin (ผู้จัดการส่วนกลาง)</div>
                            <div class="text-slate-400 text-xs">เข้าถึงทุกฟังก์ชัน จัดการระบบ ผู้ใช้ รายงานรวม</div>
                            <div class="text-slate-500 text-[10px] font-mono mt-0.5">somchai@wooddoor.co.th / password123</div>
                        </div>
                        <i class="fas fa-chevron-right role-arrow text-slate-600 text-xs"></i>
                    </button>
                </form>

                <form method="POST" action="{{ route('demo.login') }}">
                    @csrf
                    <input type="hidden" name="role" value="supervisor">
                    <button type="submit" class="role-card w-full flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.03] text-left">
                        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center flex-shrink-0"><i class="fas fa-user-tie text-white"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-white font-bold text-sm">หัวหน้างาน (Supervisor)</div>
                            <div class="text-slate-400 text-xs">จัดการทีม สร้างโฟลงาน ดูรายงาน อนุมัติงาน</div>
                            <div class="text-slate-500 text-[10px] font-mono mt-0.5">prayuth@wooddoor.co.th / password123</div>
                        </div>
                        <i class="fas fa-chevron-right role-arrow text-slate-600 text-xs"></i>
                    </button>
                </form>

                <form method="POST" action="{{ route('demo.login') }}">
                    @csrf
                    <input type="hidden" name="role" value="pc">
                    <button type="submit" class="role-card w-full flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.03] text-left">
                        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0"><i class="fas fa-store text-white"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-white font-bold text-sm">PC / Seller (พนักงานขาย)</div>
                            <div class="text-slate-400 text-xs">ลงเวลา ดูยอดขาย แจ้งปัญหา ทำงานที่ได้รับ</div>
                            <div class="text-slate-500 text-[10px] font-mono mt-0.5">manee@wooddoor.co.th / password123</div>
                        </div>
                        <i class="fas fa-chevron-right role-arrow text-slate-600 text-xs"></i>
                    </button>
                </form>

                <form method="POST" action="{{ route('demo.login') }}">
                    @csrf
                    <input type="hidden" name="role" value="manager">
                    <button type="submit" class="role-card w-full flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.03] text-left">
                        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center flex-shrink-0"><i class="fas fa-user-gear text-white"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-white font-bold text-sm">ผู้อำนวยการฝ่ายขาย (Manager)</div>
                            <div class="text-slate-400 text-xs">ดูรายงานรวม กำหนดนโยบาย วิเคราะห์ผลงาน</div>
                            <div class="text-slate-500 text-[10px] font-mono mt-0.5">suda@wooddoor.co.th / password123</div>
                        </div>
                        <i class="fas fa-chevron-right role-arrow text-slate-600 text-xs"></i>
                    </button>
                </form>
            </div>
        </div>

        <details class="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <summary class="px-6 py-3 text-slate-400 text-sm cursor-pointer hover:text-white transition-colors flex items-center gap-2">
                <i class="fas fa-keyboard"></i> เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน
            </summary>
            <div class="px-6 pb-6 pt-2">
                <form method="POST" action="{{ route('login') }}" class="space-y-4">
                    @csrf
                    <div>
                        <label for="email" class="block text-sm font-medium text-slate-300 mb-1">อีเมล</label>
                        <input type="email" id="email" name="email" value="{{ old('email') }}" required class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" placeholder="your@email.com">
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-slate-300 mb-1">รหัสผ่าน</label>
                        <input type="password" id="password" name="password" required class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" placeholder="รหัสผ่าน">
                    </div>
                    <div class="flex items-center">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="remember" class="w-4 h-4 rounded border-slate-500 text-amber-500 focus:ring-amber-500 bg-transparent">
                            <span class="text-sm text-slate-400">จดจำฉัน</span>
                        </label>
                    </div>
                    <button type="submit" class="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-md shadow-amber-500/25">เข้าสู่ระบบ</button>
                </form>
            </div>
        </details>

        <p class="text-center text-slate-500 text-xs mt-6">&#169; {{ date('Y') }} <a href="https://github.com/xjanova/mdt" target="_blank" class="text-amber-500 hover:underline">XMAN Studio</a> - สยามพลาสวูด</p>
    </div>
</body>
</html>
