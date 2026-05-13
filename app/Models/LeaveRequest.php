<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model {
    protected $fillable = ['user_id','approved_by','type','start_date','end_date','days','reason','status','rejection_reason'];
    protected $casts = ['start_date'=>'date','end_date'=>'date'];
    public function user() { return $this->belongsTo(User::class); }
    public function approver() { return $this->belongsTo(User::class,'approved_by'); }
}
