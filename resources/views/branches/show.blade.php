@extends('layouts.app')

@section('title', $branch->name)

@section('content')
<div class="max-w-7xl mx-auto">

    {{-- Back Link --}}
    <div class="mb-4">
        <a href="{{ route('branches.index') }}" class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            กลับไปหน้าสาขาทั้งหมด
        </a>
    </div>

    {{-- Branch Header --}}
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">{{ $branch->name }}</h1>
                @if($branch->store_name)
                <p class="text-gray-500 mt-1">{{ $branch->store_name }}</p>
                @endif
                <div class="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
                    @if($branch->location)
                    <div class="flex items-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{{ $branch->location }}</span>
                    </div>
                    @endif
                    @if($branch->region)
                    <div class="flex items-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{{ $branch->region }}</span>
                    </div>
                    @endif
                    @if($branch->phone)
                    <div class="flex items-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{{ $branch->phone }}</span>
                    </div>
                    @endif
                </div>
            </div>
            <div class="flex-shrink-0">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    {{ $branch->region ?? 'ไม่ระบุภาค' }}
                </span>
            </div>
        </div>
    </div>

    {{-- KPI Cards --}}
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {{-- ยอดขายเดือนนี้ --}}
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div class="flex items-center gap-3">
                <div class="flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-gray-400">ยอดขายเดือนนี้</p>
                    <p class="text-2xl font-bold text-gray-800">&#3647;{{ number_format($monthlySales) }}</p>
                </div>
            </div>
        </div>

        {{-- จำนวนพนักงาน --}}
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div class="flex items-center gap-3">
                <div class="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-gray-400">จำนวนพนักงาน</p>
                    <p class="text-2xl font-bold text-gray-800">{{ $branch->employees->count() }} คน</p>
                </div>
            </div>
        </div>

        {{-- มาวันนี้ --}}
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div class="flex items-center gap-3">
                <div class="flex-shrink-0 w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-gray-400">มาวันนี้</p>
                    <p class="text-2xl font-bold text-gray-800">{{ $todayAttendance->count() }} คน</p>
                </div>
            </div>
        </div>
    </div>

    {{-- Two Column Layout --}}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {{-- Sales by Category --}}
        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="px-5 py-4 border-b border-gray-100">
                <h2 class="text-lg font-semibold text-gray-800">ยอดขายตามหมวดหมู่</h2>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th class="px-5 py-3 font-medium">หมวดหมู่</th>
                            <th class="px-5 py-3 font-medium text-right">ยอดขาย</th>
                            <th class="px-5 py-3 font-medium text-right">จำนวน</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        @forelse($salesByCategory as $category)
                        <tr class="hover:bg-gray-50/50 transition-colors">
                            <td class="px-5 py-3 text-gray-700 font-medium">{{ $category->category }}</td>
                            <td class="px-5 py-3 text-right text-gray-800 font-semibold">&#3647;{{ number_format($category->total) }}</td>
                            <td class="px-5 py-3 text-right text-gray-500">{{ number_format($category->qty) }} ชิ้น</td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="3" class="px-5 py-8 text-center text-gray-400">ไม่มีข้อมูลยอดขาย</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        {{-- Today's Attendance --}}
        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="px-5 py-4 border-b border-gray-100">
                <h2 class="text-lg font-semibold text-gray-800">การเข้างานวันนี้</h2>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th class="px-5 py-3 font-medium">พนักงาน</th>
                            <th class="px-5 py-3 font-medium text-center">เข้างาน</th>
                            <th class="px-5 py-3 font-medium text-center">ออกงาน</th>
                            <th class="px-5 py-3 font-medium text-center">สถานะ</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        @forelse($todayAttendance as $attendance)
                        <tr class="hover:bg-gray-50/50 transition-colors">
                            <td class="px-5 py-3">
                                <span class="text-gray-700 font-medium">{{ $attendance->employee->user->name ?? '-' }}</span>
                            </td>
                            <td class="px-5 py-3 text-center text-gray-600">
                                {{ $attendance->clock_in ? \Carbon\Carbon::parse($attendance->clock_in)->format('H:i') : '-' }}
                            </td>
                            <td class="px-5 py-3 text-center text-gray-600">
                                {{ $attendance->clock_out ? \Carbon\Carbon::parse($attendance->clock_out)->format('H:i') : '-' }}
                            </td>
                            <td class="px-5 py-3 text-center">
                                @switch($attendance->status)
                                    @case('present')
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">มาทำงาน</span>
                                        @break
                                    @case('late')
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">มาสาย</span>
                                        @break
                                    @case('absent')
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">ขาดงาน</span>
                                        @break
                                    @case('leave')
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">ลางาน</span>
                                        @break
                                    @case('half_day')
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">ครึ่งวัน</span>
                                        @break
                                    @default
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{{ $attendance->status }}</span>
                                @endswitch
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="4" class="px-5 py-8 text-center text-gray-400">ยังไม่มีข้อมูลการเข้างานวันนี้</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

    </div>

    {{-- Two Column Layout: Problems & Workflows --}}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {{-- Recent Problems --}}
        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="px-5 py-4 border-b border-gray-100">
                <h2 class="text-lg font-semibold text-gray-800">ปัญหาล่าสุด</h2>
            </div>
            <div class="divide-y divide-gray-50">
                @forelse($problems as $problem)
                <div class="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex-1 min-w-0">
                            <h4 class="text-sm font-semibold text-gray-800 truncate">{{ $problem->title }}</h4>
                            <div class="flex items-center gap-2 mt-2">
                                @switch($problem->status)
                                    @case('open')
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">เปิด</span>
                                        @break
                                    @case('in_progress')
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">กำลังแก้ไข</span>
                                        @break
                                    @case('resolved')
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">แก้ไขแล้ว</span>
                                        @break
                                    @case('closed')
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">ปิดแล้ว</span>
                                        @break
                                    @default
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{{ $problem->status }}</span>
                                @endswitch
                            </div>
                        </div>
                        <div class="flex-shrink-0 text-right">
                            <div class="flex items-center gap-1">
                                <div class="w-20 bg-gray-200 rounded-full h-2">
                                    <div class="h-2 rounded-full {{ $problem->progress_percent >= 100 ? 'bg-green-500' : ($problem->progress_percent >= 50 ? 'bg-yellow-500' : 'bg-red-400') }}"
                                         style="width: {{ min($problem->progress_percent, 100) }}%"></div>
                                </div>
                                <span class="text-xs text-gray-500 w-8 text-right">{{ $problem->progress_percent }}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                @empty
                <div class="px-5 py-8 text-center text-gray-400">
                    <svg class="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>ไม่มีปัญหาที่ต้องติดตาม</p>
                </div>
                @endforelse
            </div>
        </div>

        {{-- Workflows --}}
        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="px-5 py-4 border-b border-gray-100">
                <h2 class="text-lg font-semibold text-gray-800">โฟลงาน</h2>
            </div>
            <div class="divide-y divide-gray-50">
                @forelse($workflows as $workflow)
                <div class="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex-1 min-w-0">
                            <h4 class="text-sm font-semibold text-gray-800 truncate">{{ $workflow->title }}</h4>
                            <div class="flex items-center gap-2 mt-2">
                                @switch($workflow->status)
                                    @case('pending')
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">รอดำเนินการ</span>
                                        @break
                                    @case('in_progress')
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">กำลังดำเนินการ</span>
                                        @break
                                    @case('completed')
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">เสร็จสิ้น</span>
                                        @break
                                    @case('cancelled')
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">ยกเลิก</span>
                                        @break
                                    @default
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{{ $workflow->status }}</span>
                                @endswitch
                            </div>
                        </div>
                        <div class="flex-shrink-0 w-28">
                            <div class="flex items-center gap-1.5">
                                <div class="flex-1 bg-gray-200 rounded-full h-2.5">
                                    <div class="h-2.5 rounded-full transition-all duration-300
                                        {{ $workflow->progress_percent >= 100 ? 'bg-green-500' : ($workflow->progress_percent >= 50 ? 'bg-blue-500' : 'bg-amber-500') }}"
                                         style="width: {{ min($workflow->progress_percent, 100) }}%"></div>
                                </div>
                                <span class="text-xs text-gray-500 font-medium w-8 text-right">{{ $workflow->progress_percent }}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                @empty
                <div class="px-5 py-8 text-center text-gray-400">
                    <svg class="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h4v4H4V6zm0 8h4v4H4v-4zm12-8h4v4h-4V6zm0 8h4v4h-4v-4zM8 8h8M8 16h8M10 10v4m4-4v4" />
                    </svg>
                    <p>ไม่มีโฟลงานที่ดำเนินอยู่</p>
                </div>
                @endforelse
            </div>
        </div>

    </div>

</div>
@endsection
