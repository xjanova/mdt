<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProblemComment extends Model
{
    use HasFactory;

    protected $fillable = ['problem_id', 'employee_id', 'comment', 'photo_path', 'progress_update'];

    public function problem()
    {
        return $this->belongsTo(Problem::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
