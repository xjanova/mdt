<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->get('date', Carbon::today()->format('Y-m-d'));
        $branchId = $request->get('branch_id');

        $query = Attendance::with(['employee.user', 'employee.branch'])
            ->where('date', $date);

        if ($branchId) {
            $query->whereHas('employee', function ($q) use ($branchId) {
                $q->where('branch_id', $branchId);
            });
        }

        $attendances = $query->orderBy('clock_in', 'asc')->get();

        $summary = [
            'present' => $attendances->where('status', 'present')->count(),
            'late' => $attendances->where('status', 'late')->count(),
            'leave' => $attendances->where('status', 'leave')->count(),
            'absent' => Employee::where('is_active', true)->count() - $attendances->count(),
            'total_ot' => $attendances->sum('ot_hours'),
        ];

        $branches = \App\Models\Branch::all();

        return view('attendance.index', compact('attendances', 'summary', 'date', 'branches', 'branchId'));
    }
}
