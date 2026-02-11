<?php

namespace App\Http\Controllers;

use App\Models\Workflow;
use App\Models\Branch;
use Illuminate\Http\Request;

class WorkflowController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->get('type');
        $status = $request->get('status');

        $query = Workflow::with(['creator.user', 'branch', 'steps.assignee.user']);

        if ($type) {
            $query->where('type', $type);
        }
        if ($status) {
            $query->where('status', $status);
        }

        $workflows = $query->orderByRaw("CASE priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END")
            ->orderBy('due_date', 'asc')
            ->get();

        $stats = [
            'total' => Workflow::count(),
            'active' => Workflow::whereIn('status', ['active', 'in_progress'])->count(),
            'completed' => Workflow::where('status', 'completed')->count(),
            'overdue' => Workflow::whereIn('status', ['active', 'in_progress'])->where('due_date', '<', now())->count(),
        ];

        return view('workflows.index', compact('workflows', 'stats', 'type', 'status'));
    }

    public function show(Workflow $workflow)
    {
        $workflow->load(['creator.user', 'branch', 'steps.assignee.user', 'problems.reporter.user']);
        return view('workflows.show', compact('workflow'));
    }
}
