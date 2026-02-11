<?php

namespace App\Http\Controllers;

use App\Models\Communication;
use App\Models\Branch;
use Illuminate\Http\Request;

class CommunicationController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->get('type');

        $query = Communication::with(['sender.user', 'senderBranch', 'recipients.branch', 'replies.employee.user']);

        if ($type) {
            $query->where('type', $type);
        }

        $communications = $query->orderBy('created_at', 'desc')->get();

        $stats = [
            'total' => Communication::count(),
            'announcements' => Communication::where('type', 'announcement')->count(),
            'coordination' => Communication::where('type', 'coordination')->count(),
            'unread' => Communication::where('status', 'sent')->count(),
        ];

        return view('communications.index', compact('communications', 'stats', 'type'));
    }

    public function show(Communication $communication)
    {
        $communication->load(['sender.user', 'senderBranch', 'recipients.branch', 'recipients.employee.user', 'replies.employee.user']);
        return view('communications.show', compact('communication'));
    }
}
