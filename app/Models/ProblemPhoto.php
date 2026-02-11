<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProblemPhoto extends Model
{
    use HasFactory;

    protected $fillable = ['problem_id', 'photo_path', 'caption', 'uploaded_by'];

    public function problem()
    {
        return $this->belongsTo(Problem::class);
    }

    public function uploader()
    {
        return $this->belongsTo(Employee::class, 'uploaded_by');
    }
}
