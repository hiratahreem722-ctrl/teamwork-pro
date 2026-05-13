<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class LeavePolicy extends Model {
    protected $fillable = ['owner_id','type','days_allowed','carry_forward','max_carry_days','requires_approval','min_notice_days','paid'];
    protected $casts = ['carry_forward'=>'boolean','requires_approval'=>'boolean','paid'=>'boolean'];
    public function owner() { return $this->belongsTo(User::class,'owner_id'); }
}
