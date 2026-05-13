<?php
namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\LeavePolicy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LeaveController extends Controller
{
    private function ownerId() {
        $u = Auth::user(); return $u->role === 'owner' ? $u->id : ($u->invited_by ?? $u->id);
    }

    // Employee: view own leaves
    public function myLeaves()
    {
        $leaves = LeaveRequest::where('user_id', Auth::id())
            ->orderBy('created_at','desc')->get();
        return Inertia::render('Leave/MyLeaves', ['leaves' => $leaves]);
    }

    // Employee: request leave
    public function request(Request $request)
    {
        $v = $request->validate([
            'type'       => ['required','string'],
            'start_date' => ['required','date'],
            'end_date'   => ['required','date','after_or_equal:start_date'],
            'reason'     => ['nullable','string','max:500'],
        ]);
        $start = \Carbon\Carbon::parse($v['start_date']);
        $end   = \Carbon\Carbon::parse($v['end_date']);
        $v['days']    = $start->diffInWeekdays($end) + 1;
        $v['user_id'] = Auth::id();
        $v['status']  = 'pending';
        LeaveRequest::create($v);
        return back()->with('success','Leave request submitted!');
    }

    // Manager/Owner: view all pending leaves
    public function approvals()
    {
        $ownerId = $this->ownerId();
        // Get all team member IDs
        $teamIds = \App\Models\User::where('invited_by',$ownerId)->pluck('id')->push($ownerId);
        $leaves  = LeaveRequest::whereIn('user_id',$teamIds)
            ->with('user:id,name,department,job_title')
            ->orderBy('created_at','desc')->get();
        return Inertia::render('Leave/Approvals', ['leaves' => $leaves]);
    }

    public function approve(int $id)
    {
        LeaveRequest::findOrFail($id)->update(['status'=>'approved','approved_by'=>Auth::id()]);
        return back()->with('success','Leave approved.');
    }

    public function reject(Request $request, int $id)
    {
        LeaveRequest::findOrFail($id)->update([
            'status'           => 'rejected',
            'approved_by'      => Auth::id(),
            'rejection_reason' => $request->input('reason'),
        ]);
        return back()->with('success','Leave rejected.');
    }

    // Leave policies
    public function policy()
    {
        $policies = LeavePolicy::where('owner_id',$this->ownerId())->get();
        return Inertia::render('Leave/Policy', ['policies' => $policies]);
    }

    public function updatePolicy(Request $request)
    {
        $ownerId = $this->ownerId();
        foreach ($request->input('policies',[]) as $p) {
            LeavePolicy::updateOrCreate(
                ['owner_id'=>$ownerId,'type'=>$p['type']],
                ['days_allowed'=>$p['days_allowed'],'carry_forward'=>$p['carry_forward']??false,'paid'=>$p['paid']??true]
            );
        }
        return back()->with('success','Leave policies saved.');
    }
}
