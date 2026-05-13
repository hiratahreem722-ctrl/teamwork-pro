<?php
namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        $today = Attendance::where('user_id',Auth::id())->whereDate('date',today())->first();
        return Inertia::render('Attendance/ClockIn', ['todayRecord' => $today]);
    }

    public function clockIn(Request $request)
    {
        $record = Attendance::firstOrCreate(
            ['user_id'=>Auth::id(),'date'=>today()],
            ['status'=>'present']
        );
        if (!$record->clock_in) {
            $record->update(['clock_in'=>now()->format('H:i:s')]);
        }
        return back()->with('success','Clocked in at '.now()->format('H:i'));
    }

    public function clockOut(Request $request)
    {
        $record = Attendance::where('user_id',Auth::id())->whereDate('date',today())->first();
        if ($record && !$record->clock_out) {
            $record->update(['clock_out'=>now()->format('H:i:s')]);
        }
        return back()->with('success','Clocked out at '.now()->format('H:i'));
    }
}
