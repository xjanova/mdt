@extends('layouts.app')

@section('title', 'ติดตามปัญหา')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

    <h1 class="text-2xl font-bold text-gray-800 mb-6">ติดตามปัญหา</h1>

    {{-- Stats Cards --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-red-50 border border-red-200 rounded-lg shadow p-5">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-red-600">เปิดใหม่</p>
                    <p class="text-3xl font-bold text-red-700 mt-1">{{ number_format($stats['open']) }}</p>
                </div>
                <div class="bg-red-100 rounded-full p-3">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                </div>
            </div>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg shadow p-5">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-yellow-600">กำลังแก้ไข</p>
                    <p class="text-3xl font-bold text-yellow-700 mt-1">{{ number_format($stats['in_progress']) }}</p>
                </div>
                <div class="bg-yellow-100 rounded-full p-3">
                    <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
            </div>
        </div>

        <div class="bg-green-50 border border-green-200 rounded-lg shadow p-5">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-green-600">แก้ไขแล้ว</p>
                    <p class="text-3xl font-bold text-green-700 mt-1">{{ number_format($stats['resolved']) }}</p>
                </div>
                <div class="bg-green-100 rounded-full p-3">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
            </div>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg shadow p-5">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-red-600">เร่งด่วน</p>
                    <p class="text-3xl font-bold text-red-700 mt-1">{{ number_format($stats['urgent']) }}</p>
                </div>
                <div class="bg-red-100 rounded-full p-3">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>

    {{-- Filter Bar --}}
    <form method="GET" action="{{ route('problems.index') }}" class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
                <label for="status" class="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                <select id="status" name="status"
                        class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">-- ทุกสถานะ --</option>
                    <option value="open" {{ $status === 'open' ? 'selected' : '' }}>เปิดใหม่</option>
                    <option value="acknowledged" {{ $status === 'acknowledged' ? 'selected' : '' }}>รับทราบแล้ว</option>
                    <option value="in_progress" {{ $status === 'in_progress' ? 'selected' : '' }}>กำลังแก้ไข</option>
                    <option value="resolved" {{ $status === 'resolved' ? 'selected' : '' }}>แก้ไขแล้ว</option>
                    <option value="closed" {{ $status === 'closed' ? 'selected' : '' }}>ปิดแล้ว</option>
                </select>
            </div>
            <div>
                <label for="category" class="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                <select id="category" name="category"
                        class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">-- ทุกหมวดหมู่ --</option>
                    <option value="stock_display" {{ $category === 'stock_display' ? 'selected' : '' }}>สต๊อก/การจัดโชว์</option>
                    <option value="promotion" {{ $category === 'promotion' ? 'selected' : '' }}>โปรโมชั่น</option>
                    <option value="product_damage" {{ $category === 'product_damage' ? 'selected' : '' }}>สินค้าเสียหาย</option>
                    <option value="customer_complaint" {{ $category === 'customer_complaint' ? 'selected' : '' }}>ลูกค้าร้องเรียน</option>
                    <option value="staff" {{ $category === 'staff' ? 'selected' : '' }}>พนักงาน</option>
                    <option value="other" {{ $category === 'other' ? 'selected' : '' }}>อื่นๆ</option>
                </select>
            </div>
            <div>
                <label for="branch_id" class="block text-sm font-medium text-gray-700 mb-1">สาขา</label>
                <select id="branch_id" name="branch_id"
                        class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">-- ทุกสาขา --</option>
                    @foreach($branches as $branch)
                        <option value="{{ $branch->id }}" {{ $branchId == $branch->id ? 'selected' : '' }}>
                            {{ $branch->name }}
                        </option>
                    @endforeach
                </select>
            </div>
            <div>
                <button type="submit"
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow transition duration-150">
                    ค้นหา
                </button>
            </div>
        </div>
    </form>

    {{-- Problems List --}}
    <div class="space-y-4">
        @forelse($problems as $problem)
            <a href="{{ route('problems.show', $problem) }}" class="block bg-white rounded-lg shadow hover:shadow-md transition duration-150">
                <div class="p-5">
                    {{-- Header: Title & Badges --}}
                    <div class="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <h3 class="text-lg font-semibold text-gray-800">{{ $problem->title }}</h3>
                        <div class="flex flex-wrap gap-2">
                            {{-- Priority Badge --}}
                            @switch($problem->priority)
                                @case('urgent')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">เร่งด่วน</span>
                                    @break
                                @case('high')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">สูง</span>
                                    @break
                                @case('medium')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">ปานกลาง</span>
                                    @break
                                @case('low')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">ต่ำ</span>
                                    @break
                            @endswitch

                            {{-- Status Badge --}}
                            @switch($problem->status)
                                @case('open')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">เปิดใหม่</span>
                                    @break
                                @case('acknowledged')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">รับทราบแล้ว</span>
                                    @break
                                @case('in_progress')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">กำลังแก้ไข</span>
                                    @break
                                @case('resolved')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">แก้ไขแล้ว</span>
                                    @break
                                @case('closed')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">ปิดแล้ว</span>
                                    @break
                            @endswitch

                            {{-- Category Badge --}}
                            @switch($problem->category)
                                @case('stock_display')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">สต๊อก/การจัดโชว์</span>
                                    @break
                                @case('promotion')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">โปรโมชั่น</span>
                                    @break
                                @case('product_damage')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">สินค้าเสียหาย</span>
                                    @break
                                @case('customer_complaint')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">ลูกค้าร้องเรียน</span>
                                    @break
                                @case('staff')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">พนักงาน</span>
                                    @break
                                @case('other')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">อื่นๆ</span>
                                    @break
                            @endswitch
                        </div>
                    </div>

                    {{-- Description --}}
                    <p class="text-sm text-gray-600 mb-3">{{ Str::limit($problem->description, 150) }}</p>

                    {{-- Progress Bar --}}
                    <div class="mb-3">
                        <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>ความคืบหน้า</span>
                            <span>{{ $problem->progress_percent }}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="h-2 rounded-full transition-all duration-300
                                @if($problem->progress_percent >= 100) bg-green-500
                                @elseif($problem->progress_percent >= 50) bg-blue-500
                                @elseif($problem->progress_percent > 0) bg-yellow-500
                                @else bg-gray-300
                                @endif"
                                 style="width: {{ $problem->progress_percent }}%"></div>
                        </div>
                    </div>

                    {{-- Meta Info --}}
                    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                            </svg>
                            {{ $problem->branch->name ?? '-' }}
                        </span>
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            ผู้รายงาน: {{ $problem->reporter->user->name ?? '-' }}
                        </span>
                        @if($problem->assignee)
                            <span class="flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                มอบหมาย: {{ $problem->assignee->user->name ?? '-' }}
                            </span>
                        @endif
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                            </svg>
                            {{ $problem->comments->count() }} ความคิดเห็น
                        </span>
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {{ $problem->created_at->diffForHumans() }}
                        </span>
                    </div>
                </div>
            </a>
        @empty
            <div class="bg-white rounded-lg shadow p-8 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-gray-500 text-lg">ไม่พบปัญหาที่ตรงกับเงื่อนไข</p>
                <p class="text-gray-400 text-sm mt-1">ลองเปลี่ยนตัวกรองเพื่อดูผลลัพธ์อื่น</p>
            </div>
        @endforelse
    </div>

</div>
@endsection
