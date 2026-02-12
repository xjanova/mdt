<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>ตั้งค่าระบบ - MDT ประตูไม้ ERP</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Sarabun', 'Noto Sans Thai', sans-serif; }
    </style>
</head>
<body class="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 min-h-screen flex items-center justify-center p-4">

    <div class="w-full max-w-lg">
        {{-- Logo & Welcome --}}
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/30 mb-4">
                <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a1 1 0 001 1h3V6H4a1 1 0 00-1 1zM8 6v12h8V6H8zm5 3v2m0 2v2M17 6v12h3a1 1 0 001-1V7a1 1 0 00-1-1h-3z" />
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-white mb-1">MDT ประตูไม้</h1>
            <p class="text-slate-400">ตั้งค่าระบบ ERP ครั้งแรก</p>
        </div>

        {{-- Setup Card --}}
        <div class="bg-white rounded-2xl shadow-2xl p-8">
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800">สร้างบัญชี Super Admin</h2>
                <p class="text-sm text-gray-500 mt-1">ผู้ดูแลระบบคนแรกจะมีสิทธิ์เข้าถึงทุกฟังก์ชัน</p>
            </div>

            <form method="POST" action="{{ route('setup.store') }}" class="space-y-5">
                @csrf

                {{-- ชื่อ-นามสกุล --}}
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value="{{ old('name') }}"
                        required
                        autofocus
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors @error('name') border-red-400 @enderror"
                        placeholder="เช่น สมชาย วงศ์ใหญ่"
                    >
                    @error('name')
                        <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                {{-- อีเมล --}}
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value="{{ old('email') }}"
                        required
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors @error('email') border-red-400 @enderror"
                        placeholder="admin@company.co.th"
                    >
                    @error('email')
                        <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                {{-- รหัสผ่าน --}}
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors @error('password') border-red-400 @enderror"
                        placeholder="อย่างน้อย 8 ตัวอักษร"
                    >
                    @error('password')
                        <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                {{-- ยืนยันรหัสผ่าน --}}
                <div>
                    <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่าน</label>
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        required
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                        placeholder="กรอกรหัสผ่านอีกครั้ง"
                    >
                </div>

                {{-- Submit --}}
                <button
                    type="submit"
                    class="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md shadow-amber-500/25 hover:shadow-amber-600/30"
                >
                    เริ่มใช้งานระบบ
                </button>
            </form>
        </div>

        {{-- Footer --}}
        <p class="text-center text-slate-500 text-xs mt-6">&copy; {{ date('Y') }} MDT ประตูไม้ - ระบบ ERP</p>
    </div>

</body>
</html>
