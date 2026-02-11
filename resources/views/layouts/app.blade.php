<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'MDT ประตูไม้') - ระบบ ERP</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Sarabun', 'Noto Sans Thai', 'sans-serif'],
                    },
                },
            },
        }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Sarabun', 'Noto Sans Thai', sans-serif;
        }
        /* Scrollbar styling for sidebar */
        .sidebar-scroll::-webkit-scrollbar {
            width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
            background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.3);
            border-radius: 2px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(148, 163, 184, 0.5);
        }
    </style>
    @stack('styles')
</head>
<body class="bg-gray-50 antialiased">
    <div class="min-h-screen flex">

        {{-- Mobile Overlay --}}
        <div
            x-data
            id="sidebarOverlay"
            class="fixed inset-0 bg-black/50 z-40 lg:hidden hidden"
            onclick="toggleSidebar()"
        ></div>

        {{-- Sidebar --}}
        <aside
            id="sidebar"
            class="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-800 to-slate-900 transform -translate-x-full lg:translate-x-0 lg:static lg:inset-auto lg:z-auto transition-transform duration-300 ease-in-out flex flex-col shadow-xl"
        >
            {{-- Logo / Company Name --}}
            <div class="flex items-center gap-3 px-5 py-5 border-b border-slate-700/60">
                <div class="flex-shrink-0 w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-md">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a1 1 0 001 1h3V6H4a1 1 0 00-1 1zM8 6v12h8V6H8zm5 3v2m0 2v2M17 6v12h3a1 1 0 001-1V7a1 1 0 00-1-1h-3z" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-lg font-bold text-white leading-tight tracking-wide">MDT ประตูไม้</h1>
                    <p class="text-xs text-slate-400 font-medium">ระบบ ERP</p>
                </div>
            </div>

            {{-- Navigation --}}
            <nav class="flex-1 overflow-y-auto sidebar-scroll py-4 px-3 space-y-1">

                {{-- แดชบอร์ด (Dashboard) --}}
                <a
                    href="{{ route('dashboard') }}"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                        {{ request()->routeIs('dashboard') ? 'bg-amber-500/15 text-amber-400 shadow-sm' : 'text-slate-300 hover:bg-slate-700/60 hover:text-white' }}"
                >
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2" />
                    </svg>
                    <span>แดชบอร์ด</span>
                </a>

                {{-- ลงเวลางาน/OT (Attendance) --}}
                <a
                    href="{{ route('attendance.index') }}"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                        {{ request()->routeIs('attendance.*') ? 'bg-amber-500/15 text-amber-400 shadow-sm' : 'text-slate-300 hover:bg-slate-700/60 hover:text-white' }}"
                >
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>ลงเวลางาน/OT</span>
                </a>

                {{-- รายงานการขาย (Sales) --}}
                <a
                    href="{{ route('sales.index') }}"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                        {{ request()->routeIs('sales.*') ? 'bg-amber-500/15 text-amber-400 shadow-sm' : 'text-slate-300 hover:bg-slate-700/60 hover:text-white' }}"
                >
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>รายงานการขาย</span>
                </a>

                {{-- โฟลงาน (Workflows) --}}
                <a
                    href="{{ route('workflows.index') }}"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                        {{ request()->routeIs('workflows.*') ? 'bg-amber-500/15 text-amber-400 shadow-sm' : 'text-slate-300 hover:bg-slate-700/60 hover:text-white' }}"
                >
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h4v4H4V6zm0 8h4v4H4v-4zm12-8h4v4h-4V6zm0 8h4v4h-4v-4zM8 8h8M8 16h8M10 10v4m4-4v4" />
                    </svg>
                    <span>โฟลงาน</span>
                </a>

                {{-- ติดตามปัญหา (Problems) --}}
                <a
                    href="{{ route('problems.index') }}"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                        {{ request()->routeIs('problems.*') ? 'bg-amber-500/15 text-amber-400 shadow-sm' : 'text-slate-300 hover:bg-slate-700/60 hover:text-white' }}"
                >
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>ติดตามปัญหา</span>
                </a>

                {{-- สาขา (Branches) --}}
                <a
                    href="{{ route('branches.index') }}"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                        {{ request()->routeIs('branches.*') ? 'bg-amber-500/15 text-amber-400 shadow-sm' : 'text-slate-300 hover:bg-slate-700/60 hover:text-white' }}"
                >
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>สาขา</span>
                </a>

                {{-- ศูนย์สื่อสาร (Communications) --}}
                <a
                    href="{{ route('communications.index') }}"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                        {{ request()->routeIs('communications.*') ? 'bg-amber-500/15 text-amber-400 shadow-sm' : 'text-slate-300 hover:bg-slate-700/60 hover:text-white' }}"
                >
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>ศูนย์สื่อสาร</span>
                </a>

            </nav>

            {{-- Sidebar Footer --}}
            <div class="border-t border-slate-700/60 px-4 py-4">
                @auth
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm font-semibold">
                        {{ mb_substr(Auth::user()->name ?? 'U', 0, 1) }}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-white truncate">{{ Auth::user()->name ?? 'ผู้ใช้งาน' }}</p>
                        <p class="text-xs text-slate-400 truncate">{{ Auth::user()->email ?? '' }}</p>
                    </div>
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="text-slate-400 hover:text-white transition-colors" title="ออกจากระบบ">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </form>
                </div>
                @endauth
            </div>
        </aside>

        {{-- Main Content Area --}}
        <div class="flex-1 flex flex-col min-h-screen lg:ml-0">

            {{-- Top Header Bar --}}
            <header class="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
                <div class="flex items-center justify-between px-4 sm:px-6 h-16">
                    {{-- Mobile Menu Button --}}
                    <button
                        onclick="toggleSidebar()"
                        class="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                        aria-label="เปิดเมนู"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {{-- Page Title --}}
                    <h2 class="text-lg font-semibold text-gray-800 hidden sm:block">
                        @yield('header', 'แดชบอร์ด')
                    </h2>

                    {{-- Right side actions --}}
                    <div class="flex items-center gap-3">
                        {{-- Notifications --}}
                        <button class="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors" title="การแจ้งเตือน">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {{-- Notification badge --}}
                            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {{-- Current Date (Thai) --}}
                        <div class="hidden md:flex items-center gap-1.5 text-sm text-gray-500">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{{ now()->locale('th')->translatedFormat('d M Y') }}</span>
                        </div>
                    </div>
                </div>
            </header>

            {{-- Flash Messages --}}
            @if(session('success'))
            <div class="mx-4 sm:mx-6 mt-4">
                <div class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm" role="alert">
                    <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ session('success') }}</span>
                </div>
            </div>
            @endif

            @if(session('error'))
            <div class="mx-4 sm:mx-6 mt-4">
                <div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm" role="alert">
                    <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ session('error') }}</span>
                </div>
            </div>
            @endif

            {{-- Page Content --}}
            <main class="flex-1 p-4 sm:p-6">
                @yield('content')
            </main>

            {{-- Footer --}}
            <footer class="border-t border-gray-200 bg-white px-4 sm:px-6 py-3">
                <p class="text-xs text-gray-400 text-center">&copy; {{ date('Y') }} MDT ประตูไม้ - ระบบ ERP สงวนลิขสิทธิ์</p>
            </footer>
        </div>

    </div>

    {{-- Sidebar Toggle Script --}}
    <script>
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');

            sidebar.classList.toggle('-translate-x-full');
            overlay.classList.toggle('hidden');
        }

        // Close sidebar on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const sidebar = document.getElementById('sidebar');
                const overlay = document.getElementById('sidebarOverlay');

                if (!sidebar.classList.contains('-translate-x-full')) {
                    sidebar.classList.add('-translate-x-full');
                    overlay.classList.add('hidden');
                }
            }
        });

        // Close sidebar when clicking outside on mobile
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 1024) {
                const overlay = document.getElementById('sidebarOverlay');
                overlay.classList.add('hidden');
            }
        });
    </script>

    @stack('scripts')
</body>
</html>
