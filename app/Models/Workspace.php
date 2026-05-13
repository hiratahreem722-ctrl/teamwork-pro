<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Workspace extends Model {
    protected $fillable = ['owner_id','name','industry','size','website','logo_url','brand_color','timezone','currency','pm_view','work_style','departments','goals'];
    protected $casts = ['departments'=>'array','goals'=>'array'];
    public function owner() { return $this->belongsTo(User::class,'owner_id'); }
    public function projects() { return $this->hasMany(Project::class); }
    public function clients() { return $this->hasMany(Client::class,'owner_id','owner_id'); }
}
