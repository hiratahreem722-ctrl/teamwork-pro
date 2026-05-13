<?php
namespace App\Http\Controllers;

use App\Models\Timesheet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TimesheetController extends Controller
{
    public function index()
    {
        $timesheets = Timesheet::where('user_id',Auth::id())
            ->with(['project:id,name','task:id,title'])
            ->orderBy('date','desc')->get();
        return Inertia::render('Time/MyTimesheets', ['timesheets'=>$timesheets]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'project_id'  => ['nullable','exists:projects,id'],
            'task_id'     => ['nullable','exists:tasks,id'],
            'date'        => ['required','date'],
            'hours'       => ['required','numeric','min:0.25','max:24'],
            'description' => ['nullable','string','max:500'],
        ]);
        $v['user_id'] = Auth::id();
        Timesheet::create($v);
        return back()->with('success','Time logged successfully!');
    }
}
