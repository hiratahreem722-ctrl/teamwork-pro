<?php
namespace App\Http\Controllers;

use App\Models\PayrollRun;
use App\Models\Payslip;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PayrollController extends Controller
{
    private function ownerId() {
        $u = Auth::user(); return $u->role === 'owner' ? $u->id : ($u->invited_by ?? $u->id);
    }

    public function index()
    {
        $ownerId = $this->ownerId();
        $runs = PayrollRun::where('owner_id',$ownerId)->orderBy('created_at','desc')->get();
        $employees = User::where('invited_by',$ownerId)
            ->whereIn('role',['employee','manager'])
            ->get(['id','name','department','job_title','salary_amount','salary_type','currency','pay_schedule']);
        return Inertia::render('Payroll/Index', ['payrollRuns'=>$runs,'salaryEmployees'=>$employees]);
    }

    public function generate(Request $request)
    {
        $v = $request->validate(['period'=>['required','string','max:50']]);
        $ownerId = $this->ownerId();
        $employees = User::where('invited_by',$ownerId)->whereIn('role',['employee','manager'])->get();
        $gross = $employees->sum(fn($e) => ($e->salary_amount ?? 0) / ($e->salary_type === 'yearly' ? 12 : 1));
        $deductions = $gross * 0.25;
        $run = PayrollRun::create([
            'owner_id'       => $ownerId,
            'period'         => $v['period'],
            'employees_count'=> $employees->count(),
            'gross'          => $gross,
            'deductions'     => $deductions,
            'net'            => $gross - $deductions,
            'status'         => 'processed',
            'processed_date' => now(),
        ]);
        // Generate payslips for each employee
        foreach ($employees as $emp) {
            $base = ($emp->salary_amount ?? 0) / ($emp->salary_type === 'yearly' ? 12 : 1);
            $ded  = $base * 0.25;
            Payslip::create([
                'user_id'       => $emp->id,
                'payroll_run_id'=> $run->id,
                'base_salary'   => $base,
                'bonus'         => 0,
                'deductions'    => $ded,
                'net'           => $base - $ded,
                'paid_date'     => now(),
            ]);
        }
        return back()->with('success',"Payroll for {$v['period']} processed successfully!");
    }
}
