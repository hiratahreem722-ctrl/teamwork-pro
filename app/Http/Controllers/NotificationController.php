<?php
namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::where('user_id',Auth::id())
            ->orderBy('created_at','desc')->get();
        return Inertia::render('Notifications/Index', ['notifications'=>$notifications]);
    }

    public function markRead(int $id)
    {
        Notification::where('id',$id)->where('user_id',Auth::id())
            ->update(['read_at'=>now()]);
        return back();
    }

    public function markAllRead()
    {
        Notification::where('user_id',Auth::id())->whereNull('read_at')
            ->update(['read_at'=>now()]);
        return back()->with('success','All notifications marked as read.');
    }
}
