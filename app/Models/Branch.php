<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code', 'store_name', 'location', 'region', 'phone', 'is_active'];

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function salesReports()
    {
        return $this->hasMany(SalesReport::class);
    }

    public function problems()
    {
        return $this->hasMany(Problem::class);
    }

    public function workflows()
    {
        return $this->hasMany(Workflow::class);
    }
}
