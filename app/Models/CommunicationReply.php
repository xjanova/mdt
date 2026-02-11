<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunicationReply extends Model
{
    use HasFactory;

    protected $fillable = ['communication_id', 'employee_id', 'message', 'photo_path'];

    public function communication()
    {
        return $this->belongsTo(Communication::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
