<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Timesheet extends Model {
    protected $fillable = ['user_id','project_id','task_id','date','hours','description','status'];
    protected $casts = ['date'=>'date','hours'=>'decimal:2'];
    public function user() { return $this->belongsTo(User::class); }
    public function project() { return $this->belongsTo(Project::class); }
    public function task() { return $this->belongsTo(Task::class); }
}
