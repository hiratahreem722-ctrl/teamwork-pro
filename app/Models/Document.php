<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Document extends Model {
    protected $fillable = ['owner_id','uploaded_by','name','category','file_url','file_size','file_type','is_shared'];
    protected $casts = ['is_shared'=>'boolean'];
    public function uploader() { return $this->belongsTo(User::class,'uploaded_by'); }
    public function owner() { return $this->belongsTo(User::class,'owner_id'); }
}
