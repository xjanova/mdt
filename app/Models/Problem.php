<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Problem extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'reported_by', 'branch_id', 'assigned_to',
        'workflow_id', 'category', 'priority', 'status', 'progress_percent'
    ];

    public function reporter()
    {
        return $this->belongsTo(Employee::class, 'reported_by');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function assignee()
    {
        return $this->belongsTo(Employee::class, 'assigned_to');
    }

    public function workflow()
    {
        return $this->belongsTo(Workflow::class);
    }

    public function photos()
    {
        return $this->hasMany(ProblemPhoto::class);
    }

    public function comments()
    {
        return $this->hasMany(ProblemComment::class)->orderBy('created_at', 'desc');
    }
}
