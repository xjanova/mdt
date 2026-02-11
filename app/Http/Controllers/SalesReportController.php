<?php

namespace App\Http\Controllers;

use App\Models\SalesReport;
use App\Models\Branch;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->get('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', Carbon::today()->format('Y-m-d'));
        $branchId = $request->get('branch_id');

        $query = SalesReport::with(['employee.user', 'branch'])
            ->whereBetween('report_date', [$startDate, $endDate]);

        if ($branchId) {
            $query->where('branch_id', $branchId);
        }

        $reports = $query->orderBy('report_date', 'desc')->paginate(20);

        $totalAmount = SalesReport::whereBetween('report_date', [$startDate, $endDate])
            ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
            ->sum('total_amount');

        $totalQuantity = SalesReport::whereBetween('report_date', [$startDate, $endDate])
            ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
            ->sum('quantity');

        $categorySales = SalesReport::whereBetween('report_date', [$startDate, $endDate])
            ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
            ->select('category', DB::raw('SUM(total_amount) as total'), DB::raw('SUM(quantity) as qty'))
            ->groupBy('category')
            ->orderByDesc('total')
            ->get();

        $topProducts = SalesReport::whereBetween('report_date', [$startDate, $endDate])
            ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
            ->select('product_name', DB::raw('SUM(total_amount) as total'), DB::raw('SUM(quantity) as qty'))
            ->groupBy('product_name')
            ->orderByDesc('total')
            ->take(5)
            ->get();

        $branches = Branch::all();

        return view('sales.index', compact(
            'reports', 'totalAmount', 'totalQuantity', 'categorySales',
            'topProducts', 'branches', 'startDate', 'endDate', 'branchId'
        ));
    }
}
