<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Task extends Model {
    protected $fillable = ['project_id','assignee_id','created_by','title','description','status','priority','due_date','estimated_hours','logged_hours','column','sort_order'];
    protected $casts = ['due_date'=>'date'];
    public function project() { return $this->belongsTo(Project::class); }
    public function assignee() { return $this->belongsTo(User::class,'assignee_id'); }
    public function creator() { return $this->belongsTo(User::class,'created_by'); }
}
