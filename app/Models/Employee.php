<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'branch_id', 'employee_code', 'position', 'role', 'phone', 'avatar', 'is_active'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function salesReports()
    {
        return $this->hasMany(SalesReport::class);
    }

    public function fullName()
    {
        return $this->user->name;
    }
}
