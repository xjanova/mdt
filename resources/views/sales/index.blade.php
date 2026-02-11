@extends('layouts.app')

@section('title', 'รายงานการขาย')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

    <h1 class="text-2xl font-bold text-gray-800 mb-6">รายงานการขาย</h1>

    {{-- Filter Bar --}}
    <form method="GET" action="{{ route('sales.index') }}" class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
                <label for="start_date" class="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มต้น</label>
                <input type="date" id="start_date" name="start_date" value="{{ $startDate }}"
                       class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
                <label for="end_date" class="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด</label>
                <input type="date" id="end_date" name="end_date" value="{{ $endDate }}"
                       class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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

    {{-- Summary Cards --}}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-green-50 border border-green-200 rounded-lg shadow p-5">
            <p class="text-sm font-medium text-green-600">ยอดขายรวม</p>
            <p class="text-3xl font-bold text-green-700 mt-1">&#3647;{{ number_format($totalAmount) }}</p>
        </div>
        <div class="bg-blue-50 border border-blue-200 rounded-lg shadow p-5">
            <p class="text-sm font-medium text-blue-600">จำนวนชิ้นที่ขาย</p>
            <p class="text-3xl font-bold text-blue-700 mt-1">{{ number_format($totalQuantity) }} ชิ้น</p>
        </div>
    </div>

    {{-- Two Column Layout: Category Sales & Top Products --}}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {{-- Category Sales --}}
        <div class="bg-white rounded-lg shadow">
            <div class="px-4 py-3 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-800">ยอดขายตามหมวดหมู่</h2>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th class="px-4 py-3">หมวดหมู่</th>
                            <th class="px-4 py-3 text-right">ยอดขาย</th>
                            <th class="px-4 py-3 text-right">จำนวน</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @forelse($categorySales as $cat)
                            <tr class="hover:bg-gray-50">
                                <td class="px-4 py-3">{{ $cat->category }}</td>
                                <td class="px-4 py-3 text-right">&#3647;{{ number_format($cat->total) }}</td>
                                <td class="px-4 py-3 text-right">{{ number_format($cat->qty) }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="3" class="px-4 py-3 text-center text-gray-500">ไม่มีข้อมูล</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        {{-- Top 5 Products --}}
        <div class="bg-white rounded-lg shadow">
            <div class="px-4 py-3 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-800">สินค้าขายดี Top 5</h2>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th class="px-4 py-3">สินค้า</th>
                            <th class="px-4 py-3 text-right">ยอดขาย</th>
                            <th class="px-4 py-3 text-right">จำนวน</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @forelse($topProducts as $product)
                            <tr class="hover:bg-gray-50">
                                <td class="px-4 py-3">{{ $product->product_name }}</td>
                                <td class="px-4 py-3 text-right">&#3647;{{ number_format($product->total) }}</td>
                                <td class="px-4 py-3 text-right">{{ number_format($product->qty) }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="3" class="px-4 py-3 text-center text-gray-500">ไม่มีข้อมูล</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

    </div>

    {{-- Sales Table --}}
    <div class="bg-white rounded-lg shadow">
        <div class="px-4 py-3 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-800">รายการขาย</h2>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                        <th class="px-4 py-3">วันที่</th>
                        <th class="px-4 py-3">สาขา</th>
                        <th class="px-4 py-3">PC</th>
                        <th class="px-4 py-3">สินค้า</th>
                        <th class="px-4 py-3">หมวด</th>
                        <th class="px-4 py-3 text-right">จำนวน</th>
                        <th class="px-4 py-3 text-right">ราคา/หน่วย</th>
                        <th class="px-4 py-3 text-right">ยอดรวม</th>
                        <th class="px-4 py-3 text-center">สถานะ</th>
                        <th class="px-4 py-3">การชำระ</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @forelse($reports as $report)
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 whitespace-nowrap">{{ \Carbon\Carbon::parse($report->report_date)->format('d/m/Y') }}</td>
                            <td class="px-4 py-3 whitespace-nowrap">{{ $report->branch->name }}</td>
                            <td class="px-4 py-3 whitespace-nowrap">{{ $report->employee->user->name }}</td>
                            <td class="px-4 py-3">{{ $report->product_name }}</td>
                            <td class="px-4 py-3 whitespace-nowrap">{{ $report->category }}</td>
                            <td class="px-4 py-3 text-right">{{ number_format($report->quantity) }}</td>
                            <td class="px-4 py-3 text-right">&#3647;{{ number_format($report->unit_price) }}</td>
                            <td class="px-4 py-3 text-right">&#3647;{{ number_format($report->total_amount) }}</td>
                            <td class="px-4 py-3 text-center whitespace-nowrap">
                                @switch($report->status)
                                    @case('pending')
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            รอยืนยัน
                                        </span>
                                        @break
                                    @case('confirmed')
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            ยืนยันแล้ว
                                        </span>
                                        @break
                                    @case('delivered')
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            ส่งมอบแล้ว
                                        </span>
                                        @break
                                    @case('cancelled')
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            ยกเลิก
                                        </span>
                                        @break
                                    @default
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {{ $report->status }}
                                        </span>
                                @endswitch
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                @switch($report->payment_method)
                                    @case('cash')
                                        เงินสด
                                        @break
                                    @case('transfer')
                                        โอน
                                        @break
                                    @case('credit_card')
                                        บัตรเครดิต
                                        @break
                                    @case('installment')
                                        ผ่อนชำระ
                                        @break
                                    @default
                                        {{ $report->payment_method }}
                                @endswitch
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="10" class="px-4 py-6 text-center text-gray-500">ไม่พบรายการขาย</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    {{-- Pagination --}}
    <div class="mt-6">
        {{ $reports->appends(request()->query())->links() }}
    </div>

</div>
@endsection
