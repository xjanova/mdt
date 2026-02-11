<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 'date', 'clock_in', 'clock_out', 'ot_hours',
        'status', 'note', 'clock_in_photo',
        'latitude_in', 'longitude_in', 'latitude_out', 'longitude_out'
    ];

    protected $casts = [
        'date' => 'date',
        'ot_hours' => 'decimal:1',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
