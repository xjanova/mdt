@extends('layouts.app')

@section('title', $workflow->title)

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

    {{-- Back Link --}}
    <div class="mb-4">
        <a href="{{ route('workflows.index') }}" class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            กลับไปรายการโฟลงาน
        </a>
    </div>

    {{-- Header Section --}}
    <div class="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div class="flex-1 min-w-0">
                <h1 class="text-2xl font-bold text-gray-800 mb-3">{{ $workflow->title }}</h1>
                <div class="flex flex-wrap items-center gap-2">
                    {{-- Type Badge --}}
                    @switch($workflow->type)
                        @case('task')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">งานที่ได้รับมอบหมาย</span>
                            @break
                        @case('problem_solving')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">แก้ปัญหา</span>
                            @break
                        @case('promotion')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">โปรโมชั่น</span>
                            @break
                        @case('project')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">โปรเจค</span>
                            @break
                        @case('cross_branch')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">ประสานงานข้ามสาขา</span>
                            @break
                        @default
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{{ $workflow->type }}</span>
                    @endswitch

                    {{-- Priority Badge --}}
                    @switch($workflow->priority)
                        @case('urgent')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">เร่งด่วน</span>
                            @break
                        @case('high')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">สูง</span>
                            @break
                        @case('medium')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">ปานกลาง</span>
                            @break
                        @case('low')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">ต่ำ</span>
                            @break
                        @default
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{{ $workflow->priority }}</span>
                    @endswitch

                    {{-- Status Badge --}}
                    @switch($workflow->status)
                        @case('pending')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                <span class="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5"></span>
                                รอดำเนินการ
                            </span>
                            @break
                        @case('in_progress')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                <span class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                                กำลังดำเนินการ
                            </span>
                            @break
                        @case('completed')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                <span class="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                                เสร็จสิ้น
                            </span>
                            @break
                        @case('cancelled')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                <span class="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                                ยกเลิก
                            </span>
                            @break
                        @case('overdue')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                <span class="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                                เลยกำหนด
                            </span>
                            @break
                        @default
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                {{ $workflow->status }}
                            </span>
                    @endswitch
                </div>
            </div>
        </div>

        {{-- Progress Bar --}}
        <div class="mb-2">
            <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-600">ความคืบหน้าโดยรวม</span>
                <span class="text-sm font-bold text-gray-700">{{ $workflow->progress_percent ?? 0 }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
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
                <div class="{{ $barColor }} h-3 rounded-full transition-all duration-300" style="width: {{ $progress }}%"></div>
            </div>
        </div>
    </div>

    {{-- Info Grid --}}
    <div class="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">ข้อมูลทั่วไป</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {{-- Creator --}}
            <div>
                <dt class="text-sm font-medium text-gray-500 mb-1">ผู้สร้าง</dt>
                <dd class="flex items-center gap-2 text-sm text-gray-800">
                    <div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-sm font-semibold flex-shrink-0">
                        {{ mb_substr($workflow->creator->user->name ?? 'U', 0, 1) }}
                    </div>
                    <span>{{ $workflow->creator->user->name ?? 'ไม่ระบุ' }}</span>
                </dd>
            </div>

            {{-- Branch --}}
            <div>
                <dt class="text-sm font-medium text-gray-500 mb-1">สาขา</dt>
                <dd class="flex items-center gap-2 text-sm text-gray-800">
                    <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{{ $workflow->branch->name ?? 'ไม่ระบุ' }}</span>
                </dd>
            </div>

            {{-- Start Date --}}
            <div>
                <dt class="text-sm font-medium text-gray-500 mb-1">วันที่เริ่มต้น</dt>
                <dd class="flex items-center gap-2 text-sm text-gray-800">
                    <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ $workflow->start_date ? \Carbon\Carbon::parse($workflow->start_date)->format('d/m/Y') : '-' }}</span>
                </dd>
            </div>

            {{-- Due Date --}}
            <div>
                <dt class="text-sm font-medium text-gray-500 mb-1">วันที่กำหนดเสร็จ</dt>
                <dd class="flex items-center gap-2 text-sm text-gray-800">
                    <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ $workflow->due_date ? \Carbon\Carbon::parse($workflow->due_date)->format('d/m/Y') : '-' }}</span>
                </dd>
            </div>

            {{-- Description (full width) --}}
            @if($workflow->description)
                <div class="md:col-span-2">
                    <dt class="text-sm font-medium text-gray-500 mb-1">รายละเอียด</dt>
                    <dd class="text-sm text-gray-800 leading-relaxed bg-gray-50 rounded-lg p-4">
                        {{ $workflow->description }}
                    </dd>
                </div>
            @endif
        </div>
    </div>

    {{-- Steps Timeline --}}
    <div class="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-800">ขั้นตอนการทำงาน</h2>
            <span class="text-sm text-gray-500">
                {{ $workflow->steps ? $workflow->steps->where('status', 'completed')->count() : 0 }}/{{ $workflow->steps ? $workflow->steps->count() : 0 }} ขั้นตอน
            </span>
        </div>

        @if($workflow->steps && $workflow->steps->count() > 0)
            <div class="relative">
                @foreach($workflow->steps->sortBy('order') as $index => $step)
                    <div class="relative flex gap-4 pb-8 last:pb-0">
                        {{-- Timeline Line --}}
                        @if(!$loop->last)
                            <div class="absolute left-5 top-10 bottom-0 w-0.5
                                @if($step->status === 'completed') bg-green-300
                                @elseif($step->status === 'in_progress') bg-yellow-300
                                @else bg-gray-200
                                @endif
                            "></div>
                        @endif

                        {{-- Order Number Circle --}}
                        <div class="flex-shrink-0 relative z-10">
                            @if($step->status === 'completed')
                                <div class="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            @elseif($step->status === 'in_progress')
                                <div class="w-10 h-10 rounded-full bg-yellow-400 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-yellow-100">
                                    {{ $step->order ?? ($index + 1) }}
                                </div>
                            @else
                                <div class="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">
                                    {{ $step->order ?? ($index + 1) }}
                                </div>
                            @endif
                        </div>

                        {{-- Step Content --}}
                        <div class="flex-1 min-w-0 bg-gray-50 rounded-lg p-4 border
                            @if($step->status === 'completed') border-green-200
                            @elseif($step->status === 'in_progress') border-yellow-200 bg-yellow-50
                            @else border-gray-200
                            @endif
                        ">
                            <div class="flex flex-wrap items-start justify-between gap-2 mb-2">
                                <h3 class="text-sm font-semibold text-gray-800">{{ $step->title }}</h3>
                                {{-- Step Status Badge --}}
                                @switch($step->status)
                                    @case('completed')
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">เสร็จสิ้น</span>
                                        @break
                                    @case('in_progress')
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">กำลังดำเนินการ</span>
                                        @break
                                    @case('pending')
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">รอดำเนินการ</span>
                                        @break
                                    @default
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{{ $step->status }}</span>
                                @endswitch
                            </div>

                            {{-- Assigned To --}}
                            @if($step->assignee && $step->assignee->user)
                                <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>ผู้รับผิดชอบ: {{ $step->assignee->user->name }}</span>
                                </div>
                            @endif

                            {{-- Step Progress Bar --}}
                            @if(isset($step->progress_percent))
                                <div class="mb-2">
                                    <div class="flex items-center justify-between mb-1">
                                        <span class="text-xs text-gray-500">ความคืบหน้า</span>
                                        <span class="text-xs font-semibold text-gray-600">{{ $step->progress_percent }}%</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2">
                                        @php
                                            $stepProgress = $step->progress_percent ?? 0;
                                            if ($stepProgress >= 100) {
                                                $stepBarColor = 'bg-green-500';
                                            } elseif ($stepProgress >= 60) {
                                                $stepBarColor = 'bg-blue-500';
                                            } elseif ($stepProgress >= 30) {
                                                $stepBarColor = 'bg-amber-500';
                                            } else {
                                                $stepBarColor = 'bg-red-500';
                                            }
                                        @endphp
                                        <div class="{{ $stepBarColor }} h-2 rounded-full transition-all duration-300" style="width: {{ $stepProgress }}%"></div>
                                    </div>
                                </div>
                            @endif

                            {{-- Due Date + Note --}}
                            <div class="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                @if($step->due_date)
                                    <div class="flex items-center gap-1">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>กำหนด: {{ \Carbon\Carbon::parse($step->due_date)->format('d/m/Y') }}</span>
                                    </div>
                                @endif

                                @if($step->note)
                                    <div class="flex items-start gap-1">
                                        <svg class="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                        <span>{{ $step->note }}</span>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        @else
            <div class="text-center py-8">
                <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p class="text-sm text-gray-400">ยังไม่มีขั้นตอนการทำงาน</p>
            </div>
        @endif
    </div>

    {{-- Related Problems Section --}}
    @if($workflow->problems && $workflow->problems->count() > 0)
        <div class="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                ปัญหาที่เกี่ยวข้อง
                <span class="text-sm font-normal text-gray-500">({{ $workflow->problems->count() }} รายการ)</span>
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @foreach($workflow->problems as $problem)
                    <div class="border border-red-100 rounded-lg p-4 bg-red-50/50 hover:bg-red-50 transition-colors">
                        <div class="flex items-start justify-between gap-2 mb-2">
                            <h3 class="text-sm font-semibold text-gray-800">{{ $problem->title }}</h3>
                            @switch($problem->status ?? 'open')
                                @case('open')
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 flex-shrink-0">เปิด</span>
                                    @break
                                @case('in_progress')
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex-shrink-0">กำลังแก้ไข</span>
                                    @break
                                @case('resolved')
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 flex-shrink-0">แก้ไขแล้ว</span>
                                    @break
                                @case('closed')
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex-shrink-0">ปิดแล้ว</span>
                                    @break
                                @default
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex-shrink-0">{{ $problem->status }}</span>
                            @endswitch
                        </div>

                        @if($problem->description)
                            <p class="text-xs text-gray-600 mb-3 leading-relaxed">{{ Str::limit($problem->description, 120) }}</p>
                        @endif

                        <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            {{-- Reporter --}}
                            @if($problem->reporter && $problem->reporter->user)
                                <div class="flex items-center gap-1">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>{{ $problem->reporter->user->name }}</span>
                                </div>
                            @endif

                            {{-- Priority --}}
                            @if($problem->priority)
                                <div class="flex items-center gap-1">
                                    @switch($problem->priority)
                                        @case('urgent')
                                            <span class="w-2 h-2 rounded-full bg-red-500"></span>
                                            <span>เร่งด่วน</span>
                                            @break
                                        @case('high')
                                            <span class="w-2 h-2 rounded-full bg-orange-500"></span>
                                            <span>สูง</span>
                                            @break
                                        @case('medium')
                                            <span class="w-2 h-2 rounded-full bg-yellow-500"></span>
                                            <span>ปานกลาง</span>
                                            @break
                                        @case('low')
                                            <span class="w-2 h-2 rounded-full bg-green-500"></span>
                                            <span>ต่ำ</span>
                                            @break
                                    @endswitch
                                </div>
                            @endif

                            {{-- Created Date --}}
                            @if($problem->created_at)
                                <div class="flex items-center gap-1">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{{ \Carbon\Carbon::parse($problem->created_at)->format('d/m/Y') }}</span>
                                </div>
                            @endif
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    @endif

</div>
@endsection
