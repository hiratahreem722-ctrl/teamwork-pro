<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class CrmContact extends Model {
    protected $table = 'crm_contacts';
    protected $fillable = ['owner_id','name','email','company','phone','type','status','notes'];
    public function owner() { return $this->belongsTo(User::class,'owner_id'); }
}
