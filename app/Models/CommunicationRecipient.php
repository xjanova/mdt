<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunicationRecipient extends Model
{
    use HasFactory;

    protected $fillable = ['communication_id', 'branch_id', 'employee_id', 'is_read'];

    public function communication()
    {
        return $this->belongsTo(Communication::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
