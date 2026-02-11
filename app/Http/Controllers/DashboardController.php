<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\SalesReport;
use App\Models\Workflow;
use App\Models\Problem;
use App\Models\Communication;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();

        $totalBranches = Branch::where('is_active', true)->count();
        $totalEmployees = Employee::where('is_active', true)->count();
        $todayAttendance = Attendance::where('date', $today)->where('status', 'present')->count();
        $todayLate = Attendance::where('date', $today)->where('status', 'late')->count();

        $monthlySales = SalesReport::where('report_date', '>=', $thisMonth)->sum('total_amount');
        $monthlySalesCount = SalesReport::where('report_date', '>=', $thisMonth)->count();

        $activeWorkflows = Workflow::whereIn('status', ['active', 'in_progress'])->count();
        $openProblems = Problem::whereIn('status', ['open', 'acknowledged', 'in_progress'])->count();
        $urgentProblems = Problem::where('priority', 'urgent')->whereIn('status', ['open', 'acknowledged', 'in_progress'])->count();

        $unreadComms = Communication::where('status', 'sent')->count();

        $recentProblems = Problem::with(['reporter.user', 'branch', 'assignee.user'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $activeWorkflowsList = Workflow::with(['creator.user', 'branch'])
            ->whereIn('status', ['active', 'in_progress'])
            ->orderBy('due_date', 'asc')
            ->take(5)
            ->get();

        $branchSales = Branch::withSum(['salesReports as monthly_sales' => function ($q) use ($thisMonth) {
            $q->where('report_date', '>=', $thisMonth);
        }], 'total_amount')
            ->withCount(['salesReports as monthly_sales_count' => function ($q) use ($thisMonth) {
                $q->where('report_date', '>=', $thisMonth);
            }])
            ->get();

        return view('dashboard', compact(
            'totalBranches', 'totalEmployees', 'todayAttendance', 'todayLate',
            'monthlySales', 'monthlySalesCount', 'activeWorkflows', 'openProblems',
            'urgentProblems', 'unreadComms', 'recentProblems', 'activeWorkflowsList', 'branchSales'
        ));
    }
}
