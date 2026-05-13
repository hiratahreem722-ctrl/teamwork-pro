<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model {
    protected $fillable = ['user_id','title','message','type','icon','link','read_at','data'];
    protected $casts = ['read_at'=>'datetime','data'=>'array'];
    public function user() { return $this->belongsTo(User::class); }
}
