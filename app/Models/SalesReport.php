<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 'branch_id', 'report_date', 'product_name', 'product_code',
        'category', 'quantity', 'unit_price', 'total_amount',
        'customer_name', 'customer_phone', 'payment_method', 'status', 'note'
    ];

    protected $casts = [
        'report_date' => 'date',
        'unit_price' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
