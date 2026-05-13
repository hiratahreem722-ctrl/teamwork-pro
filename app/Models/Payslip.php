<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Payslip extends Model {
    protected $fillable = ['user_id','payroll_run_id','base_salary','bonus','deductions','net','payment_method','paid_date'];
    protected $casts = ['paid_date'=>'date','base_salary'=>'decimal:2','bonus'=>'decimal:2','deductions'=>'decimal:2','net'=>'decimal:2'];
    public function user() { return $this->belongsTo(User::class); }
    public function payrollRun() { return $this->belongsTo(PayrollRun::class); }
}
