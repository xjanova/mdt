@extends('layouts.app')

@section('title', $communication->subject)

@section('content')
<div class="max-w-4xl mx-auto">

    {{-- Back Link --}}
    <div class="mb-4">
        <a href="{{ route('communications.index') }}" class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            กลับไปหน้าศูนย์สื่อสาร
        </a>
    </div>

    {{-- Communication Header --}}
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        {{-- Subject & Badges --}}
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <h1 class="text-xl font-bold text-gray-800 flex-1">{{ $communication->subject }}</h1>
            <div class="flex items-center gap-2 flex-shrink-0">
                {{-- Type Badge --}}
                @switch($communication->type)
                    @case('announcement')
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">ประกาศ</span>
                        @break
                    @case('request')
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">ร้องขอ</span>
                        @break
                    @case('coordination')
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">ประสานงาน</span>
                        @break
                    @case('feedback')
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">ฟีดแบ็ค</span>
                        @break
                    @default
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">{{ $communication->type }}</span>
                @endswitch

                {{-- Status Badge --}}
                @switch($communication->status)
                    @case('sent')
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">ส่งแล้ว</span>
                        @break
                    @case('read')
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">อ่านแล้ว</span>
                        @break
                    @case('replied')
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600">ตอบกลับแล้ว</span>
                        @break
                    @case('resolved')
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-600">จัดการแล้ว</span>
                        @break
                    @default
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">{{ $communication->status }}</span>
                @endswitch
            </div>
        </div>

        {{-- Sender Info & Date --}}
        <div class="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
            <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                {{ mb_substr($communication->sender->user->name ?? 'U', 0, 1) }}
            </div>
            <div class="flex-1">
                <p class="text-sm font-semibold text-gray-800">{{ $communication->sender->user->name ?? 'ไม่ทราบ' }}</p>
                <div class="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    @if($communication->senderBranch)
                    <span>{{ $communication->senderBranch->name }}</span>
                    <span>&middot;</span>
                    @endif
                    <span>{{ $communication->created_at->locale('th')->translatedFormat('d M Y H:i น.') }}</span>
                </div>
            </div>
        </div>

        {{-- Full Message --}}
        <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            {!! nl2br(e($communication->message)) !!}
        </div>

        {{-- Photo Attachment --}}
        @if($communication->photo_path)
        <div class="mt-5 pt-5 border-t border-gray-100">
            <p class="text-sm font-medium text-gray-500 mb-2">ไฟล์แนบ</p>
            <img src="{{ asset('storage/' . $communication->photo_path) }}" alt="ภาพแนบ" class="rounded-lg max-w-md border border-gray-200 shadow-sm">
        </div>
        @endif
    </div>

    {{-- Recipients --}}
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-800">ผู้รับ ({{ $communication->recipients->count() }} ราย)</h2>
        </div>
        <div class="divide-y divide-gray-50">
            @forelse($communication->recipients as $recipient)
            <div class="px-6 py-3 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500">
                        {{ mb_substr($recipient->employee->user->name ?? ($recipient->branch->name ?? 'U'), 0, 1) }}
                    </div>
                    <div>
                        @if($recipient->employee)
                        <p class="text-sm font-medium text-gray-700">{{ $recipient->employee->user->name ?? '-' }}</p>
                        @endif
                        @if($recipient->branch)
                        <p class="text-xs text-gray-400">{{ $recipient->branch->name }}</p>
                        @endif
                    </div>
                </div>
                <div>
                    @if($recipient->is_read)
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            อ่านแล้ว
                        </span>
                    @else
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ยังไม่อ่าน
                        </span>
                    @endif
                </div>
            </div>
            @empty
            <div class="px-6 py-8 text-center text-gray-400 text-sm">ไม่มีข้อมูลผู้รับ</div>
            @endforelse
        </div>
    </div>

    {{-- Replies Thread --}}
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-800">การตอบกลับ ({{ $communication->replies->count() }} ข้อความ)</h2>
        </div>

        @if($communication->replies->count() > 0)
        <div class="divide-y divide-gray-50">
            @foreach($communication->replies as $reply)
            <div class="px-6 py-5">
                {{-- Reply Header --}}
                <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold text-amber-700">
                        {{ mb_substr($reply->employee->user->name ?? 'U', 0, 1) }}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2">
                            <p class="text-sm font-semibold text-gray-800">{{ $reply->employee->user->name ?? 'ไม่ทราบ' }}</p>
                            <span class="text-xs text-gray-400 flex-shrink-0">{{ $reply->created_at->locale('th')->translatedFormat('d M Y H:i น.') }}</span>
                        </div>

                        {{-- Reply Message --}}
                        <div class="mt-2 text-sm text-gray-600 leading-relaxed">
                            {!! nl2br(e($reply->message)) !!}
                        </div>

                        {{-- Reply Photo --}}
                        @if($reply->photo_path)
                        <div class="mt-3">
                            <img src="{{ asset('storage/' . $reply->photo_path) }}" alt="ภาพแนบ" class="rounded-lg max-w-sm border border-gray-200 shadow-sm">
                        </div>
                        @endif
                    </div>
                </div>
            </div>
            @endforeach
        </div>
        @else
        <div class="px-6 py-12 text-center">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="text-gray-400 text-sm">ยังไม่มีการตอบกลับ</p>
        </div>
        @endif
    </div>

</div>
@endsection
