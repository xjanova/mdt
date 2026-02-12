<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>เข้าสู่ระบบ - MDT ประตูไม้ ERP</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Sarabun', 'Noto Sans Thai', sans-serif; }
    </style>
</head>
<body class="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 min-h-screen flex items-center justify-center p-4">

    <div class="w-full max-w-md">
        {{-- Logo --}}
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-14 h-14 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/30 mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a1 1 0 001 1h3V6H4a1 1 0 00-1 1zM8 6v12h8V6H8zm5 3v2m0 2v2M17 6v12h3a1 1 0 001-1V7a1 1 0 00-1-1h-3z" />
                </svg>
            </div>
            <h1 class="text-xl font-bold text-white">MDT ประตูไม้</h1>
            <p class="text-slate-400 text-sm">ระบบ ERP</p>
        </div>

        {{-- Login Card --}}
        <div class="bg-white rounded-2xl shadow-2xl p-8">
            <h2 class="text-lg font-bold text-gray-800 mb-6">เข้าสู่ระบบ</h2>

            <form method="POST" action="{{ route('login') }}" class="space-y-5">
                @csrf

                {{-- อีเมล --}}
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value="{{ old('email') }}"
                        required
                        autofocus
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors @error('email') border-red-400 @enderror"
                        placeholder="your@email.com"
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
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                        placeholder="รหัสผ่าน"
                    >
                </div>

                {{-- จดจำฉัน --}}
                <div class="flex items-center justify-between">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="remember" class="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500">
                        <span class="text-sm text-gray-600">จดจำฉัน</span>
                    </label>
                </div>

                {{-- Submit --}}
                <button
                    type="submit"
                    class="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-md shadow-amber-500/25"
                >
                    เข้าสู่ระบบ
                </button>
            </form>
        </div>

        <p class="text-center text-slate-500 text-xs mt-6">&copy; {{ date('Y') }} MDT ประตูไม้ - ระบบ ERP</p>
    </div>

</body>
</html>
