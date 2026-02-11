@extends('layouts.app')

@section('title', $problem->title)

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

    {{-- Back Link --}}
    <div class="mb-4">
        <a href="{{ route('problems.index') }}" class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            กลับไปรายการปัญหา
        </a>
    </div>

    {{-- Header --}}
    <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-6">
            <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
                <h1 class="text-2xl font-bold text-gray-800">{{ $problem->title }}</h1>
                <div class="flex flex-wrap gap-2">
                    {{-- Priority Badge --}}
                    @switch($problem->priority)
                        @case('urgent')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">เร่งด่วน</span>
                            @break
                        @case('high')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">สูง</span>
                            @break
                        @case('medium')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">ปานกลาง</span>
                            @break
                        @case('low')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">ต่ำ</span>
                            @break
                    @endswitch

                    {{-- Status Badge --}}
                    @switch($problem->status)
                        @case('open')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">เปิดใหม่</span>
                            @break
                        @case('acknowledged')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">รับทราบแล้ว</span>
                            @break
                        @case('in_progress')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">กำลังแก้ไข</span>
                            @break
                        @case('resolved')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">แก้ไขแล้ว</span>
                            @break
                        @case('closed')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">ปิดแล้ว</span>
                            @break
                    @endswitch

                    {{-- Category Badge --}}
                    @switch($problem->category)
                        @case('stock_display')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">สต๊อก/การจัดโชว์</span>
                            @break
                        @case('promotion')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">โปรโมชั่น</span>
                            @break
                        @case('product_damage')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">สินค้าเสียหาย</span>
                            @break
                        @case('customer_complaint')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">ลูกค้าร้องเรียน</span>
                            @break
                        @case('staff')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">พนักงาน</span>
                            @break
                        @case('other')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">อื่นๆ</span>
                            @break
                    @endswitch
                </div>
            </div>

            {{-- Info Grid --}}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="bg-gray-50 rounded-lg p-4">
                    <p class="text-xs font-medium text-gray-500 uppercase mb-1">ผู้รายงาน</p>
                    <p class="text-sm font-semibold text-gray-800">{{ $problem->reporter->user->name ?? '-' }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                    <p class="text-xs font-medium text-gray-500 uppercase mb-1">สาขา</p>
                    <p class="text-sm font-semibold text-gray-800">{{ $problem->branch->name ?? '-' }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                    <p class="text-xs font-medium text-gray-500 uppercase mb-1">มอบหมายให้</p>
                    <p class="text-sm font-semibold text-gray-800">{{ $problem->assignee->user->name ?? 'ยังไม่ได้มอบหมาย' }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                    <p class="text-xs font-medium text-gray-500 uppercase mb-1">วันที่แจ้ง</p>
                    <p class="text-sm font-semibold text-gray-800">{{ $problem->created_at->format('d/m/Y H:i') }}</p>
                    <p class="text-xs text-gray-500">{{ $problem->created_at->diffForHumans() }}</p>
                </div>
            </div>

            {{-- Description --}}
            <div class="mb-2">
                <h2 class="text-sm font-medium text-gray-500 uppercase mb-2">รายละเอียด</h2>
                <div class="bg-gray-50 rounded-lg p-4">
                    <p class="text-sm text-gray-700 whitespace-pre-line">{{ $problem->description }}</p>
                </div>
            </div>
        </div>
    </div>

    {{-- Progress Section --}}
    <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">ความคืบหน้า</h2>
            <div class="flex items-center gap-4 mb-2">
                <div class="flex-1">
                    <div class="w-full bg-gray-200 rounded-full h-4">
                        <div class="h-4 rounded-full transition-all duration-500
                            @if($problem->progress_percent >= 100) bg-green-500
                            @elseif($problem->progress_percent >= 50) bg-blue-500
                            @elseif($problem->progress_percent > 0) bg-yellow-500
                            @else bg-gray-300
                            @endif"
                             style="width: {{ $problem->progress_percent }}%"></div>
                    </div>
                </div>
                <span class="text-2xl font-bold text-gray-700 min-w-[60px] text-right">{{ $problem->progress_percent }}%</span>
            </div>
        </div>
    </div>

    {{-- Workflow Link --}}
    @if($problem->workflow)
        <div class="bg-white rounded-lg shadow mb-6">
            <div class="p-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">เวิร์กโฟลว์ที่เกี่ยวข้อง</h2>
                <a href="{{ route('workflows.show', $problem->workflow) }}" class="block bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition duration-150">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                            <span class="font-semibold text-blue-800">{{ $problem->workflow->title }}</span>
                        </div>
                        <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="flex-1">
                            <div class="w-full bg-blue-200 rounded-full h-2">
                                <div class="bg-blue-600 h-2 rounded-full" style="width: {{ $problem->workflow->progress_percent }}%"></div>
                            </div>
                        </div>
                        <span class="text-sm font-medium text-blue-700">{{ $problem->workflow->progress_percent }}%</span>
                    </div>
                </a>
            </div>
        </div>
    @endif

    {{-- Photos Section --}}
    <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">รูปภาพ</h2>
            @if($problem->photos->count() > 0)
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    @foreach($problem->photos as $photo)
                        <div class="group relative">
                            <div class="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                <img src="{{ asset('storage/' . $photo->photo_path) }}"
                                     alt="{{ $photo->caption ?? 'รูปภาพปัญหา' }}"
                                     class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                            </div>
                            @if($photo->caption)
                                <p class="text-xs text-gray-500 mt-1 truncate">{{ $photo->caption }}</p>
                            @endif
                            @if($photo->uploader)
                                <p class="text-xs text-gray-400">โดย {{ $photo->uploader->user->name ?? '-' }}</p>
                            @endif
                        </div>
                    @endforeach
                </div>
            @else
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <p class="text-gray-500">ยังไม่มีรูปภาพ</p>
                    <p class="text-gray-400 text-sm mt-1">รูปภาพที่เกี่ยวข้องกับปัญหาจะแสดงที่นี่</p>
                </div>
            @endif
        </div>
    </div>

    {{-- Comments Timeline --}}
    <div class="bg-white rounded-lg shadow">
        <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">
                ความคิดเห็น
                <span class="text-sm font-normal text-gray-500">({{ $problem->comments->count() }})</span>
            </h2>

            @if($problem->comments->count() > 0)
                <div class="space-y-6">
                    @foreach($problem->comments->sortBy('created_at') as $comment)
                        <div class="flex gap-4">
                            {{-- Avatar Placeholder --}}
                            <div class="flex-shrink-0">
                                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span class="text-sm font-bold text-blue-600">
                                        {{ mb_substr($comment->employee->user->name ?? '?', 0, 1) }}
                                    </span>
                                </div>
                            </div>

                            {{-- Comment Body --}}
                            <div class="flex-1 min-w-0">
                                <div class="flex flex-wrap items-center gap-2 mb-1">
                                    <span class="text-sm font-semibold text-gray-800">{{ $comment->employee->user->name ?? '-' }}</span>
                                    <span class="text-xs text-gray-400">{{ $comment->created_at->format('d/m/Y H:i') }}</span>
                                    <span class="text-xs text-gray-400">{{ $comment->created_at->diffForHumans() }}</span>

                                    {{-- Progress Update Badge --}}
                                    @if($comment->progress_update !== null)
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            อัปเดตความคืบหน้า: {{ $comment->progress_update }}%
                                        </span>
                                    @endif
                                </div>

                                <div class="bg-gray-50 rounded-lg p-3">
                                    <p class="text-sm text-gray-700 whitespace-pre-line">{{ $comment->comment }}</p>

                                    {{-- Comment Photo --}}
                                    @if($comment->photo_path)
                                        <div class="mt-3">
                                            <img src="{{ asset('storage/' . $comment->photo_path) }}"
                                                 alt="รูปภาพประกอบความคิดเห็น"
                                                 class="rounded-lg max-w-xs max-h-48 object-cover border border-gray-200">
                                        </div>
                                    @endif
                                </div>
                            </div>
                        </div>

                        @if(!$loop->last)
                            <div class="ml-5 border-l-2 border-gray-200 h-4"></div>
                        @endif
                    @endforeach
                </div>
            @else
                <div class="text-center py-8">
                    <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                    </svg>
                    <p class="text-gray-500">ยังไม่มีความคิดเห็น</p>
                    <p class="text-gray-400 text-sm mt-1">ความคิดเห็นและอัปเดตจะแสดงที่นี่</p>
                </div>
            @endif
        </div>
    </div>

</div>
@endsection
