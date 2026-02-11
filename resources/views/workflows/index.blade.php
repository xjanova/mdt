@extends('layouts.app')

@section('title', 'โฟลงาน / มอบหมายงาน')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

    <h1 class="text-2xl font-bold text-gray-800 mb-6">โฟลงาน / มอบหมายงาน</h1>

    {{-- Stats Cards --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {{-- ทั้งหมด --}}
        <div class="bg-white border border-gray-200 rounded-lg shadow p-5">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500">ทั้งหมด</p>
                    <p class="text-3xl font-bold text-gray-800 mt-1">{{ number_format($stats['total'] ?? 0) }}</p>
                </div>
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
            </div>
        </div>

        {{-- กำลังดำเนินการ --}}
        <div class="bg-white border border-blue-200 rounded-lg shadow p-5">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-blue-600">กำลังดำเนินการ</p>
                    <p class="text-3xl font-bold text-blue-700 mt-1">{{ number_format($stats['active'] ?? 0) }}</p>
                </div>
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
            </div>
        </div>

        {{-- เสร็จสิ้น --}}
        <div class="bg-white border border-green-200 rounded-lg shadow p-5">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-green-600">เสร็จสิ้น</p>
                    <p class="text-3xl font-bold text-green-700 mt-1">{{ number_format($stats['completed'] ?? 0) }}</p>
                </div>
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
        </div>

        {{-- เลยกำหนด --}}
        <div class="bg-white border border-red-200 rounded-lg shadow p-5">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-red-600">เลยกำหนด</p>
                    <p class="text-3xl font-bold text-red-700 mt-1">{{ number_format($stats['overdue'] ?? 0) }}</p>
                </div>
                <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
        </div>
    </div>

    {{-- Filter Bar --}}
    <form method="GET" action="{{ route('workflows.index') }}" class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
                <label for="type" class="block text-sm font-medium text-gray-700 mb-1">ประเภทงาน</label>
                <select id="type" name="type"
                        class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                    <option value="">-- ทุกประเภท --</option>
                    <option value="task" {{ ($type ?? '') === 'task' ? 'selected' : '' }}>งานที่ได้รับมอบหมาย</option>
                    <option value="problem_solving" {{ ($type ?? '') === 'problem_solving' ? 'selected' : '' }}>แก้ปัญหา</option>
                    <option value="promotion" {{ ($type ?? '') === 'promotion' ? 'selected' : '' }}>โปรโมชั่น</option>
                    <option value="project" {{ ($type ?? '') === 'project' ? 'selected' : '' }}>โปรเจค</option>
                    <option value="cross_branch" {{ ($type ?? '') === 'cross_branch' ? 'selected' : '' }}>ประสานงานข้ามสาขา</option>
                </select>
            </div>
            <div>
                <label for="status" class="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                <select id="status" name="status"
                        class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                    <option value="">-- ทุกสถานะ --</option>
                    <option value="pending" {{ ($status ?? '') === 'pending' ? 'selected' : '' }}>รอดำเนินการ</option>
                    <option value="in_progress" {{ ($status ?? '') === 'in_progress' ? 'selected' : '' }}>กำลังดำเนินการ</option>
                    <option value="completed" {{ ($status ?? '') === 'completed' ? 'selected' : '' }}>เสร็จสิ้น</option>
                    <option value="cancelled" {{ ($status ?? '') === 'cancelled' ? 'selected' : '' }}>ยกเลิก</option>
                    <option value="overdue" {{ ($status ?? '') === 'overdue' ? 'selected' : '' }}>เลยกำหนด</option>
                </select>
            </div>
            <div>
                <button type="submit"
                        class="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-md shadow transition duration-150">
                    ค้นหา
                </button>
            </div>
        </div>
    </form>

    {{-- Workflow Cards Grid --}}
    @if($workflows->count() > 0)
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            @foreach($workflows as $workflow)
                <a href="{{ route('workflows.show', $workflow) }}" class="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 hover:border-amber-300">
                    <div class="p-5">
                        {{-- Header: Title + Badges --}}
                        <div class="flex flex-wrap items-start justify-between gap-2 mb-3">
                            <h3 class="text-lg font-semibold text-gray-800 leading-snug flex-1 min-w-0">
                                {{ $workflow->title }}
                            </h3>
                            <div class="flex items-center gap-2 flex-shrink-0">
                                {{-- Type Badge --}}
                                @switch($workflow->type)
                                    @case('task')
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">งานที่ได้รับมอบหมาย</span>
                                        @break
                                    @case('problem_solving')
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">แก้ปัญหา</span>
                                        @break
                                    @case('promotion')
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">โปรโมชั่น</span>
                                        @break
                                    @case('project')
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">โปรเจค</span>
                                        @break
                                    @case('cross_branch')
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">ประสานงานข้ามสาขา</span>
                                        @break
                                    @default
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{{ $workflow->type }}</span>
                                @endswitch

                                {{-- Priority Badge --}}
                                @switch($workflow->priority)
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
                                    @default
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{{ $workflow->priority }}</span>
                                @endswitch
                            </div>
                        </div>

                        {{-- Description --}}
                        @if($workflow->description)
                            <p class="text-sm text-gray-600 mb-4 leading-relaxed">
                                {{ Str::limit($workflow->description, 100) }}
                            </p>
                        @endif

                        {{-- Progress Bar --}}
                        <div class="mb-4">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-xs font-medium text-gray-500">ความคืบหน้า</span>
                                <span class="text-xs font-semibold text-gray-700">{{ $workflow->progress_percent ?? 0 }}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2.5">
                                @php
                                    $progress = $workflow->progress_percent ?? 0;
                                    if ($progress >= 100) {
                                        $barColor = 'bg-green-500';
                                    } elseif ($progress >= 60) {
                                        $barColor = 'bg-blue-500';
                                    } elseif ($progress >= 30) {
                                        $barColor = 'bg-amber-500';
                                    } else {
                                        $barColor = 'bg-red-500';
                                    }
                                @endphp
                                <div class="{{ $barColor }} h-2.5 rounded-full transition-all duration-300" style="width: {{ $progress }}%"></div>
                            </div>
                        </div>

                        {{-- Info Grid --}}
                        <div class="grid grid-cols-2 gap-3 text-sm mb-4">
                            {{-- Creator --}}
                            <div class="flex items-center gap-2 text-gray-600">
                                <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span class="truncate">{{ $workflow->creator->user->name ?? 'ไม่ระบุ' }}</span>
                            </div>

                            {{-- Branch --}}
                            <div class="flex items-center gap-2 text-gray-600">
                                <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span class="truncate">{{ $workflow->branch->name ?? 'ไม่ระบุ' }}</span>
                            </div>

                            {{-- Start Date --}}
                            <div class="flex items-center gap-2 text-gray-600">
                                <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>เริ่ม: {{ $workflow->start_date ? \Carbon\Carbon::parse($workflow->start_date)->format('d/m/Y') : '-' }}</span>
                            </div>

                            {{-- Due Date --}}
                            <div class="flex items-center gap-2 text-gray-600">
                                <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>กำหนด: {{ $workflow->due_date ? \Carbon\Carbon::parse($workflow->due_date)->format('d/m/Y') : '-' }}</span>
                            </div>
                        </div>

                        {{-- Footer: Status + Steps count --}}
                        <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                            {{-- Status Badge --}}
                            @switch($workflow->status)
                                @case('pending')
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                        <span class="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5"></span>
                                        รอดำเนินการ
                                    </span>
                                    @break
                                @case('in_progress')
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                                        กำลังดำเนินการ
                                    </span>
                                    @break
                                @case('completed')
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        <span class="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                                        เสร็จสิ้น
                                    </span>
                                    @break
                                @case('cancelled')
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                        <span class="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                                        ยกเลิก
                                    </span>
                                    @break
                                @case('overdue')
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                        <span class="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                                        เลยกำหนด
                                    </span>
                                    @break
                                @default
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                        {{ $workflow->status }}
                                    </span>
                            @endswitch

                            {{-- Steps Count --}}
                            <div class="flex items-center gap-1.5 text-sm text-gray-500">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <span>
                                    {{ $workflow->steps ? $workflow->steps->where('status', 'completed')->count() : 0 }}/{{ $workflow->steps ? $workflow->steps->count() : 0 }} ขั้นตอน
                                </span>
                            </div>
                        </div>
                    </div>
                </a>
            @endforeach
        </div>

        {{-- Total Count --}}
        <div class="mt-4 text-sm text-gray-600">
            {{ $workflows->count() }} รายการ
        </div>
    @else
        {{-- Empty State --}}
        <div class="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 class="text-lg font-medium text-gray-500 mb-1">ไม่พบโฟลงาน</h3>
            <p class="text-sm text-gray-400">ยังไม่มีโฟลงานที่ตรงกับเงื่อนไขการค้นหา</p>
        </div>
    @endif

</div>
@endsection
