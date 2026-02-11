<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workflow extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'created_by', 'branch_id', 'type',
        'priority', 'status', 'progress_percent', 'start_date', 'due_date', 'completed_date'
    ];

    protected $casts = [
        'start_date' => 'date',
        'due_date' => 'date',
        'completed_date' => 'date',
    ];

    public function creator()
    {
        return $this->belongsTo(Employee::class, 'created_by');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function steps()
    {
        return $this->hasMany(WorkflowStep::class)->orderBy('order');
    }

    public function problems()
    {
        return $this->hasMany(Problem::class);
    }

    public function updateProgress()
    {
        $steps = $this->steps;
        if ($steps->count() === 0) return;
        $this->progress_percent = (int) $steps->avg('progress_percent');
        $this->save();
    }
}
