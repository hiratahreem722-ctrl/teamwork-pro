<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Client extends Model {
    protected $fillable = ['owner_id','name','email','company','phone','website','industry','status','avatar_color','notes','total_value'];
    protected $casts = ['total_value'=>'decimal:2'];
    public function owner() { return $this->belongsTo(User::class,'owner_id'); }
    public function projects() { return $this->hasMany(Project::class); }
    public function invoices() { return $this->hasMany(Invoice::class); }
}
