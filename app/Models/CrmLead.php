<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class CrmLead extends Model {
    protected $table = 'crm_leads';
    protected $fillable = ['owner_id','assigned_to','name','email','company','phone','stage','value','source','notes'];
    protected $casts = ['value'=>'decimal:2'];
    public function owner() { return $this->belongsTo(User::class,'owner_id'); }
    public function assignee() { return $this->belongsTo(User::class,'assigned_to'); }
}
