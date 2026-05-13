<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class PayrollRun extends Model {
    protected $fillable = ['owner_id','period','processed_date','employees_count','gross','deductions','net','status'];
    protected $casts = ['processed_date'=>'date','gross'=>'decimal:2','deductions'=>'decimal:2','net'=>'decimal:2'];
    public function owner() { return $this->belongsTo(User::class,'owner_id'); }
    public function payslips() { return $this->hasMany(Payslip::class); }
}
