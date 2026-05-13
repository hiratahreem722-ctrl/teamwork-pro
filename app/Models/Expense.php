<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model {
    protected $fillable = ['owner_id','submitted_by','title','category','amount','currency','expense_date','status','receipt_url','notes'];
    protected $casts = ['expense_date'=>'date','amount'=>'decimal:2'];
    public function submitter() { return $this->belongsTo(User::class,'submitted_by'); }
    public function owner() { return $this->belongsTo(User::class,'owner_id'); }
}
