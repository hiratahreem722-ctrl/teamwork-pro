<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Project extends Model {
    protected $fillable = ['workspace_id','owner_id','client_id','name','description','status','priority','progress','budget','spent','start_date','due_date','color'];
    protected $casts = ['start_date'=>'date','due_date'=>'date','budget'=>'decimal:2','spent'=>'decimal:2'];
    public function owner() { return $this->belongsTo(User::class,'owner_id'); }
    public function client() { return $this->belongsTo(Client::class); }
    public function tasks() { return $this->hasMany(Task::class); }
    public function timesheets() { return $this->hasMany(Timesheet::class); }
}
