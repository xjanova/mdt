@extends('layouts.app')

@section('title', 'แดชบอร์ด')

@section('content')
<div class="space-y-6">

    {{-- Page Header --}}
    <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-800">แดชบอร์ด</h1>
        <p class="text-sm text-gray-500">อัปเดตล่าสุด: {{ now()->format('d/m/Y H:i') }}</p>
    </div>

    {{-- KPI Cards Row 1 --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {{-- สาขาทั้งหมด --}}
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500">สาขาทั้งหมด</p>
                    <p class="mt-2 text-3xl font-bold text-blue-600">{{ $totalBranches }}</p>
                </div>
                <div class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                </div>
            </div>
        </div>

        {{-- พนักงานมาวันนี้ --}}
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500">พนักงานมาวันนี้</p>
                    <p class="mt-2 text-3xl font-bold text-green-600">{{ $todayAttendance }}</p>
                    <p class="mt-1 text-sm text-gray-400">สาย: <span class="text-amber-500 font-semibold">{{ $todayLate }}</span></p>
                </div>
                <div class="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                </div>
            </div>
        </div>

        {{-- ยอดขายเดือนนี้ --}}
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500">ยอดขายเดือนนี้</p>
                    <p class="mt-2 text-3xl font-bold text-indigo-600">฿{{ number_format($monthlySales) }}</p>
                </div>
                <div class="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
            </div>
        </div>

        {{-- ปัญหารอแก้ไข --}}
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500">ปัญหารอแก้ไข</p>
                    <p class="mt-2 text-3xl font-bold text-red-600">{{ $openProblems }}</p>
                    <p class="mt-1 text-sm text-gray-400">เร่งด่วน: <span class="text-amber-500 font-semibold">{{ $urgentProblems }}</span></p>
                </div>
                <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                </div>
            </div>
        </div>

    </div>

    {{-- KPI Cards Row 2 --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {{-- โฟลว์งานที่ใช้งานอยู่ --}}
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500">โฟลว์งานที่ใช้งานอยู่</p>
                    <p class="mt-2 text-3xl font-bold text-purple-600">{{ $activeWorkflows }}</p>
                </div>
                <div class="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                </div>
            </div>
        </div>

        {{-- ข้อความรอดู --}}
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500">ข้อความรอดู</p>
                    <p class="mt-2 text-3xl font-bold text-teal-600">{{ $unreadComms }}</p>
                </div>
                <div class="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                </div>
            </div>
        </div>

    </div>

    {{-- Sales by Branch Table --}}
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-800">ยอดขายแยกตามสาขา</h2>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                    <tr>
                        <th class="px-6 py-3 font-semibold">สาขา</th>
                        <th class="px-6 py-3 font-semibold text-right">ยอดขายเดือนนี้</th>
                        <th class="px-6 py-3 font-semibold text-right">จำนวนรายการ</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @forelse($branchSales as $branch)
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 font-medium text-gray-800">{{ $branch->name }}</td>
                            <td class="px-6 py-4 text-right text-gray-700">฿{{ number_format($branch->monthly_sales) }}</td>
                            <td class="px-6 py-4 text-right text-gray-700">{{ $branch->monthly_sales_count }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="3" class="px-6 py-8 text-center text-gray-400">ไม่มีข้อมูลยอดขาย</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    {{-- Recent Problems Section --}}
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-800">ปัญหาล่าสุด</h2>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                    <tr>
                        <th class="px-6 py-3 font-semibold">หัวข้อ</th>
                        <th class="px-6 py-3 font-semibold">สาขา</th>
                        <th class="px-6 py-3 font-semibold">ความสำคัญ</th>
                        <th class="px-6 py-3 font-semibold">สถานะ</th>
                        <th class="px-6 py-3 font-semibold">ผู้แจ้ง</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @forelse($recentProblems as $problem)
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 font-medium text-gray-800">{{ $problem->title }}</td>
                            <td class="px-6 py-4 text-gray-600">{{ $problem->branch->name }}</td>
                            <td class="px-6 py-4">
                                @switch($problem->priority)
                                    @case('urgent')
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">เร่งด่วน</span>
                                        @break
                                    @case('high')
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">สูง</span>
                                        @break
                                    @case('medium')
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">ปานกลาง</span>
                                        @break
                                    @case('low')
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">ต่ำ</span>
                                        @break
                                    @default
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{{ $problem->priority }}</span>
                                @endswitch
                            </td>
                            <td class="px-6 py-4">
                                @switch($problem->status)
                                    @case('open')
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">เปิด</span>
                                        @break
                                    @case('acknowledged')
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">รับทราบ</span>
                                        @break
                                    @case('in_progress')
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">กำลังดำเนินการ</span>
                                        @break
                                    @case('resolved')
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">แก้ไขแล้ว</span>
                                        @break
                                    @default
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{{ $problem->status }}</span>
                                @endswitch
                            </td>
                            <td class="px-6 py-4 text-gray-600">{{ $problem->reporter->name ?? '-' }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-8 text-center text-gray-400">ไม่มีปัญหาล่าสุด</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    {{-- Active Workflows Section --}}
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-800">โฟลว์งานที่กำลังดำเนินการ</h2>
        </div>
        <div class="divide-y divide-gray-100">
            @forelse($activeWorkflowsList as $workflow)
                <div class="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-3">
                            <h3 class="font-medium text-gray-800">{{ $workflow->title }}</h3>
                            @switch($workflow->type)
                                @case('task')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">งาน</span>
                                    @break
                                @case('problem_solving')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">แก้ปัญหา</span>
                                    @break
                                @case('promotion')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">โปรโมชั่น</span>
                                    @break
                                @case('project')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">โปรเจกต์</span>
                                    @break
                                @case('cross_branch')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">ข้ามสาขา</span>
                                    @break
                                @default
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{{ $workflow->type }}</span>
                            @endswitch
                        </div>
                        <div class="flex items-center gap-4 text-sm text-gray-500">
                            <span>{{ $workflow->branch->name ?? '-' }}</span>
                            @if($workflow->due_date)
                                <span class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                    {{ $workflow->due_date->format('d/m/Y') }}
                                </span>
                            @endif
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div class="h-full rounded-full transition-all duration-500
                                @if($workflow->progress_percent >= 75) bg-green-500
                                @elseif($workflow->progress_percent >= 50) bg-blue-500
                                @elseif($workflow->progress_percent >= 25) bg-yellow-500
                                @else bg-red-500
                                @endif"
                                style="width: {{ $workflow->progress_percent }}%">
                            </div>
                        </div>
                        <span class="text-sm font-semibold text-gray-600 w-12 text-right">{{ $workflow->progress_percent }}%</span>
                    </div>
                </div>
            @empty
                <div class="px-6 py-8 text-center text-gray-400">ไม่มีโฟลว์งานที่กำลังดำเนินการ</div>
            @endforelse
        </div>
    </div>

</div>
@endsection
