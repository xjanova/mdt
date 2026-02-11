<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkflowStep extends Model
{
    use HasFactory;

    protected $fillable = [
        'workflow_id', 'order', 'title', 'description', 'assigned_to',
        'status', 'progress_percent', 'due_date', 'completed_date', 'note'
    ];

    protected $casts = [
        'due_date' => 'date',
        'completed_date' => 'date',
    ];

    public function workflow()
    {
        return $this->belongsTo(Workflow::class);
    }

    public function assignee()
    {
        return $this->belongsTo(Employee::class, 'assigned_to');
    }
}
