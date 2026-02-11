<?php

namespace App\Http\Controllers;

use App\Models\Problem;
use App\Models\Branch;
use Illuminate\Http\Request;

class ProblemController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->get('status');
        $category = $request->get('category');
        $branchId = $request->get('branch_id');

        $query = Problem::with(['reporter.user', 'branch', 'assignee.user', 'workflow', 'comments']);

        if ($status) {
            $query->where('status', $status);
        }
        if ($category) {
            $query->where('category', $category);
        }
        if ($branchId) {
            $query->where('branch_id', $branchId);
        }

        $problems = $query->orderByRaw("CASE WHEN priority = 'urgent' THEN 0 WHEN priority = 'high' THEN 1 WHEN priority = 'medium' THEN 2 ELSE 3 END")
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'open' => Problem::where('status', 'open')->count(),
            'in_progress' => Problem::where('status', 'in_progress')->count(),
            'resolved' => Problem::where('status', 'resolved')->count(),
            'urgent' => Problem::where('priority', 'urgent')->whereIn('status', ['open', 'acknowledged', 'in_progress'])->count(),
        ];

        $branches = Branch::all();

        return view('problems.index', compact('problems', 'stats', 'branches', 'status', 'category', 'branchId'));
    }

    public function show(Problem $problem)
    {
        $problem->load(['reporter.user', 'branch', 'assignee.user', 'workflow.steps', 'photos.uploader.user', 'comments.employee.user']);
        return view('problems.show', compact('problem'));
    }
}
