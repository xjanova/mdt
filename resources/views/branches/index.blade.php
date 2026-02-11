@extends('layouts.app')

@section('title', 'สาขาทั้งหมด')

@section('content')
<div class="max-w-7xl mx-auto">

    {{-- Page Header --}}
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">สาขาทั้งหมด</h1>
        <p class="text-sm text-gray-500 mt-1">ภาพรวมสาขาและข้อมูลสำคัญของแต่ละสาขา</p>
    </div>

    {{-- Branch Cards Grid --}}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @forelse($branches as $branch)
        <a href="{{ route('branches.show', $branch) }}" class="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-200 transition-all duration-200 group">

            {{-- Card Header --}}
            <div class="px-5 pt-5 pb-3 border-b border-gray-100">
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-bold text-gray-800 group-hover:text-amber-600 transition-colors truncate">
                            {{ $branch->name }}
                        </h3>
                        @if($branch->store_name)
                        <p class="text-sm text-gray-500 mt-0.5 truncate">{{ $branch->store_name }}</p>
                        @endif
                    </div>
                    <div class="flex-shrink-0 ml-3">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            {{ $branch->region ?? 'ไม่ระบุ' }}
                        </span>
                    </div>
                </div>
                <div class="flex items-center gap-1.5 mt-2 text-sm text-gray-400">
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="truncate">{{ $branch->location ?? 'ไม่ระบุที่ตั้ง' }}</span>
                </div>
            </div>

            {{-- Stats Grid --}}
            <div class="px-5 py-4">
                <div class="grid grid-cols-2 gap-3">
                    {{-- จำนวนพนักงาน --}}
                    <div class="flex items-center gap-2.5">
                        <div class="flex-shrink-0 w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                            <svg class="w-4.5 h-4.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400">จำนวนพนักงาน</p>
                            <p class="text-sm font-semibold text-gray-800">{{ number_format($branch->employees_count) }} คน</p>
                        </div>
                    </div>

                    {{-- มาวันนี้ --}}
                    <div class="flex items-center gap-2.5">
                        <div class="flex-shrink-0 w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                            <svg class="w-4.5 h-4.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400">มาวันนี้</p>
                            <p class="text-sm font-semibold text-gray-800">{{ number_format($branch->today_attendance) }} คน</p>
                        </div>
                    </div>

                    {{-- ยอดขายเดือนนี้ --}}
                    <div class="flex items-center gap-2.5">
                        <div class="flex-shrink-0 w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                            <svg class="w-4.5 h-4.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400">ยอดขายเดือนนี้</p>
                            <p class="text-sm font-semibold text-gray-800">&#3647;{{ number_format($branch->monthly_sales) }}</p>
                        </div>
                    </div>

                    {{-- ปัญหา --}}
                    <div class="flex items-center gap-2.5">
                        <div class="flex-shrink-0 w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
                            <svg class="w-4.5 h-4.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400">ปัญหา</p>
                            <p class="text-sm font-semibold text-gray-800">{{ number_format($branch->open_problems) }} รายการ</p>
                        </div>
                    </div>
                </div>

                {{-- โฟลงาน (full width) --}}
                <div class="flex items-center gap-2.5 mt-3 pt-3 border-t border-gray-50">
                    <div class="flex-shrink-0 w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                        <svg class="w-4.5 h-4.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h4v4H4V6zm0 8h4v4H4v-4zm12-8h4v4h-4V6zm0 8h4v4h-4v-4zM8 8h8M8 16h8M10 10v4m4-4v4" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400">โฟลงาน</p>
                        <p class="text-sm font-semibold text-gray-800">{{ number_format($branch->active_workflows) }} งาน</p>
                    </div>
                </div>
            </div>

            {{-- Card Footer --}}
            @if($branch->phone)
            <div class="px-5 py-3 bg-gray-50/50 border-t border-gray-100 rounded-b-xl">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5 text-sm text-gray-500">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{{ $branch->phone }}</span>
                    </div>
                    <svg class="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
            @endif

        </a>
        @empty
        <div class="col-span-full">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p class="text-gray-500 text-lg font-medium">ยังไม่มีข้อมูลสาขา</p>
                <p class="text-gray-400 text-sm mt-1">กรุณาเพิ่มสาขาในระบบ</p>
            </div>
        </div>
        @endforelse
    </div>

</div>
@endsection
