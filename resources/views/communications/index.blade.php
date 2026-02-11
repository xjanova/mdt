@extends('layouts.app')

@section('title', 'ศูนย์สื่อสาร')

@section('content')
<div class="max-w-7xl mx-auto">

    {{-- Page Header --}}
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">ศูนย์สื่อสาร</h1>
        <p class="text-sm text-gray-500 mt-1">จัดการการสื่อสารระหว่างสาขาและพนักงาน</p>
    </div>

    {{-- Stats Cards --}}
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {{-- ทั้งหมด --}}
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div class="flex items-center gap-3">
                <div class="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>
                <div>
                    <p class="text-xs text-gray-400">ทั้งหมด</p>
                    <p class="text-xl font-bold text-gray-800">{{ number_format($stats['total'] ?? 0) }}</p>
                </div>
            </div>
        </div>

        {{-- ประกาศ --}}
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div class="flex items-center gap-3">
                <div class="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                </div>
                <div>
                    <p class="text-xs text-gray-400">ประกาศ</p>
                    <p class="text-xl font-bold text-gray-800">{{ number_format($stats['announcements'] ?? 0) }}</p>
                </div>
            </div>
        </div>

        {{-- ประสานงาน --}}
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div class="flex items-center gap-3">
                <div class="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                </div>
                <div>
                    <p class="text-xs text-gray-400">ประสานงาน</p>
                    <p class="text-xl font-bold text-gray-800">{{ number_format($stats['coordinations'] ?? 0) }}</p>
                </div>
            </div>
        </div>

        {{-- รอดู --}}
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div class="flex items-center gap-3">
                <div class="flex-shrink-0 w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </div>
                <div>
                    <p class="text-xs text-gray-400">รอดู</p>
                    <p class="text-xl font-bold text-gray-800">{{ number_format($stats['pending'] ?? 0) }}</p>
                </div>
            </div>
        </div>
    </div>

    {{-- Filter Bar --}}
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <form method="GET" action="{{ route('communications.index') }}" class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label for="type" class="text-sm font-medium text-gray-600 flex-shrink-0">กรองตามประเภท:</label>
            <select id="type" name="type" onchange="this.form.submit()"
                    class="w-full sm:w-64 border border-gray-300 rounded-lg shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                <option value="">-- ทุกประเภท --</option>
                <option value="announcement" {{ $type === 'announcement' ? 'selected' : '' }}>ประกาศ</option>
                <option value="request" {{ $type === 'request' ? 'selected' : '' }}>ร้องขอ</option>
                <option value="coordination" {{ $type === 'coordination' ? 'selected' : '' }}>ประสานงาน</option>
                <option value="feedback" {{ $type === 'feedback' ? 'selected' : '' }}>ฟีดแบ็ค</option>
            </select>
            @if($type)
            <a href="{{ route('communications.index') }}" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                ล้างตัวกรอง
            </a>
            @endif
        </form>
    </div>

    {{-- Communication Cards --}}
    <div class="space-y-4">
        @forelse($communications as $comm)
        <a href="{{ route('communications.show', $comm) }}" class="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-200 transition-all duration-200 group">
            <div class="p-5">
                {{-- Top row: Subject + Badges --}}
                <div class="flex items-start justify-between gap-3 mb-3">
                    <h3 class="text-base font-semibold text-gray-800 group-hover:text-amber-600 transition-colors flex-1 min-w-0 truncate">
                        {{ $comm->subject }}
                    </h3>
                    <div class="flex items-center gap-2 flex-shrink-0">
                        {{-- Type Badge --}}
                        @switch($comm->type)
                            @case('announcement')
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">ประกาศ</span>
                                @break
                            @case('request')
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">ร้องขอ</span>
                                @break
                            @case('coordination')
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">ประสานงาน</span>
                                @break
                            @case('feedback')
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">ฟีดแบ็ค</span>
                                @break
                            @default
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{{ $comm->type }}</span>
                        @endswitch

                        {{-- Status Badge --}}
                        @switch($comm->status)
                            @case('sent')
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">ส่งแล้ว</span>
                                @break
                            @case('read')
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">อ่านแล้ว</span>
                                @break
                            @case('replied')
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">ตอบกลับแล้ว</span>
                                @break
                            @case('resolved')
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-600">จัดการแล้ว</span>
                                @break
                            @default
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">{{ $comm->status }}</span>
                        @endswitch
                    </div>
                </div>

                {{-- Message Preview --}}
                <p class="text-sm text-gray-500 mb-3 line-clamp-2">
                    {{ Str::limit($comm->message, 100) }}
                </p>

                {{-- Sender Info --}}
                <div class="flex items-center gap-2 mb-3">
                    <div class="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                        {{ mb_substr($comm->sender->user->name ?? 'U', 0, 1) }}
                    </div>
                    <div class="text-sm">
                        <span class="font-medium text-gray-700">{{ $comm->sender->user->name ?? 'ไม่ทราบ' }}</span>
                        @if($comm->senderBranch)
                        <span class="text-gray-400 mx-1">&middot;</span>
                        <span class="text-gray-400">{{ $comm->senderBranch->name }}</span>
                        @endif
                    </div>
                </div>

                {{-- Footer: Recipients, Reply count, Date --}}
                <div class="flex items-center justify-between pt-3 border-t border-gray-50">
                    {{-- Recipients Branches --}}
                    <div class="flex items-center gap-1.5 flex-1 min-w-0">
                        <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div class="flex items-center gap-1 min-w-0 overflow-hidden">
                            @php
                                $recipientBranches = $comm->recipients->filter(fn($r) => $r->branch)->pluck('branch.name')->unique();
                            @endphp
                            @forelse($recipientBranches->take(3) as $branchName)
                                <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-500 flex-shrink-0">{{ $branchName }}</span>
                            @empty
                                <span class="text-xs text-gray-400">ไม่ระบุผู้รับ</span>
                            @endforelse
                            @if($recipientBranches->count() > 3)
                                <span class="text-xs text-gray-400 flex-shrink-0">+{{ $recipientBranches->count() - 3 }}</span>
                            @endif
                        </div>
                    </div>

                    {{-- Reply Count & Date --}}
                    <div class="flex items-center gap-3 flex-shrink-0 ml-3">
                        @if($comm->replies_count > 0)
                        <div class="flex items-center gap-1 text-xs text-gray-400">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            <span>{{ $comm->replies_count }}</span>
                        </div>
                        @endif
                        <span class="text-xs text-gray-400">{{ $comm->created_at->locale('th')->diffForHumans() }}</span>
                    </div>
                </div>
            </div>
        </a>
        @empty
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="text-gray-500 text-lg font-medium">ยังไม่มีการสื่อสาร</p>
            <p class="text-gray-400 text-sm mt-1">
                @if($type)
                    ไม่พบรายการที่ตรงกับตัวกรอง
                @else
                    กรุณาเพิ่มการสื่อสารในระบบ
                @endif
            </p>
        </div>
        @endforelse
    </div>

    {{-- Total Count --}}
    <div class="mt-4 text-sm text-gray-600">
        {{ $communications->count() }} รายการ
    </div>

</div>
@endsection
