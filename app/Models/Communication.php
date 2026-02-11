<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Communication extends Model
{
    use HasFactory;

    protected $fillable = ['subject', 'message', 'from_employee', 'from_branch', 'type', 'status', 'photo_path'];

    public function sender()
    {
        return $this->belongsTo(Employee::class, 'from_employee');
    }

    public function senderBranch()
    {
        return $this->belongsTo(Branch::class, 'from_branch');
    }

    public function recipients()
    {
        return $this->hasMany(CommunicationRecipient::class);
    }

    public function replies()
    {
        return $this->hasMany(CommunicationReply::class)->orderBy('created_at', 'asc');
    }
}
