<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\SalesReport;
use App\Models\Attendance;
use App\Models\Problem;
use App\Models\Workflow;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index()
    {
        $thisMonth = Carbon::now()->startOfMonth();
        $today = Carbon::today();

        $branches = Branch::withCount(['employees' => fn($q) => $q->where('is_active', true)])
            ->with(['employees' => fn($q) => $q->where('is_active', true)->with('user')])
            ->get()
            ->map(function ($branch) use ($thisMonth, $today) {
                $branch->monthly_sales = SalesReport::where('branch_id', $branch->id)
                    ->where('report_date', '>=', $thisMonth)->sum('total_amount');
                $branch->today_attendance = Attendance::whereHas('employee', fn($q) => $q->where('branch_id', $branch->id))
                    ->where('date', $today)->where('status', 'present')->count();
                $branch->open_problems = Problem::where('branch_id', $branch->id)
                    ->whereIn('status', ['open', 'acknowledged', 'in_progress'])->count();
                $branch->active_workflows = Workflow::where('branch_id', $branch->id)
                    ->whereIn('status', ['active', 'in_progress'])->count();
                return $branch;
            });

        return view('branches.index', compact('branches'));
    }

    public function show(Branch $branch)
    {
        $thisMonth = Carbon::now()->startOfMonth();
        $today = Carbon::today();

        $branch->load(['employees' => fn($q) => $q->where('is_active', true)->with('user')]);

        $monthlySales = SalesReport::where('branch_id', $branch->id)
            ->where('report_date', '>=', $thisMonth)->sum('total_amount');

        $salesByCategory = SalesReport::where('branch_id', $branch->id)
            ->where('report_date', '>=', $thisMonth)
            ->selectRaw('category, SUM(total_amount) as total, SUM(quantity) as qty')
            ->groupBy('category')
            ->orderByDesc('total')
            ->get();

        $todayAttendance = Attendance::whereHas('employee', fn($q) => $q->where('branch_id', $branch->id))
            ->where('date', $today)
            ->with(['employee.user'])
            ->get();

        $problems = Problem::where('branch_id', $branch->id)
            ->with(['reporter.user', 'assignee.user'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        $workflows = Workflow::where('branch_id', $branch->id)
            ->with(['creator.user', 'steps'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return view('branches.show', compact('branch', 'monthlySales', 'salesByCategory', 'todayAttendance', 'problems', 'workflows'));
    }
}
