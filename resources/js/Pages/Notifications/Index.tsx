import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { CheckCheck, Bell, CheckCircle2, MessageSquare, Clock, AlertCircle, UserPlus } from 'lucide-react';
import { useState } from 'react';

type NotifType = 'task' | 'comment' | 'time' | 'alert' | 'team';
interface Notif { id: number; type: NotifType; title: string; body: string; time: string; read: boolean; }

const iconMap: Record<NotifType, { icon: React.ElementType; color: string }> = {
    task:    { icon: CheckCircle2,  color: 'text-green-500 bg-green-50 border border-green-100' },
    comment: { icon: MessageSquare, color: 'text-blue-500 bg-blue-50 border border-blue-100'    },
    time:    { icon: Clock,         color: 'text-indigo-500 bg-indigo-50 border border-indigo-100' },
    alert:   { icon: AlertCircle,   color: 'text-red-500 bg-red-50 border border-red-100'       },
    team:    { icon: UserPlus,      color: 'text-amber-500 bg-amber-50 border border-amber-100' },
};

const initial: Notif[] = [
    { id: 1,  type: 'time',    title: 'Timesheet Approved',   body: 'Your timesheet for Mar 24–28 has been approved by Sarah Manager.',        time: '2h ago',    read: false },
    { id: 2,  type: 'comment', title: 'New Comment',          body: 'Dev Ahmad commented on "Design login screen mockup": "Looks great!"',     time: '4h ago',    read: false },
    { id: 3,  type: 'task',    title: 'Task Assigned to You', body: 'Sarah Manager assigned "Fix responsive nav on mobile" to you.',            time: 'Yesterday', read: false },
    { id: 4,  type: 'alert',   title: 'Deadline Tomorrow',    body: 'Task "Code review PR #42" is due tomorrow (Apr 8).',                      time: 'Yesterday', read: false },
    { id: 5,  type: 'task',    title: 'Task Completed',       body: '"Authentication flow design" was marked as completed.',                    time: '2 days ago',read: true  },
    { id: 6,  type: 'comment', title: 'Mentioned in Comment', body: 'Sara Rahman mentioned you in "API Integration": "@hamza can you check?"', time: '2 days ago',read: true  },
    { id: 7,  type: 'team',    title: 'New Team Member',      body: 'QA Tester has joined the Website Redesign project.',                      time: '3 days ago',read: true  },
    { id: 8,  type: 'time',    title: 'Timesheet Rejected',   body: 'Your Mar 31 time entry for CRM Dashboard was rejected. Please revise.',   time: '4 days ago',read: true  },
    { id: 9,  type: 'alert',   title: 'Project Overdue',      body: 'Mobile App v2 milestone "Design Phase" is 2 days past its due date.',     time: '5 days ago',read: true  },
    { id: 10, type: 'task',    title: 'Task Moved to Review', body: '"Color palette & typography" has been moved to In Review.',               time: '1 week ago',read: true  },
];

export default function NotificationsIndex() {
    const [notifs, setNotifs] = useState<Notif[]>(initial);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
    const markRead = (id: number) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));

    const unread = notifs.filter(n => !n.read).length;
    const displayed = filter === 'unread' ? notifs.filter(n => !n.read) : notifs;

    return (
        <AppLayout title="Notifications">
            <Head title="Notifications" />

            {/* Hero header */}
            <div className="relative mb-6 overflow-hidden rounded-2xl bg-brand-900 px-7 py-8">
                <div className="absolute -top-10 -right-10 h-52 w-52 rounded-full bg-brand-700 opacity-40 pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-brand-600 opacity-20 pointer-events-none" />
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                            <Bell size={22} className="text-brand-400" />
                            {unread > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{unread}</span>
                            )}
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-0.5">Employee</p>
                            <h2 className="text-2xl font-bold text-white">Notifications</h2>
                            <p className="mt-0.5 text-sm text-white/60">{unread} unread notification{unread !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <button onClick={markAllRead} className="flex items-center gap-2 rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors">
                        <CheckCheck size={15} /> Mark all read
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="mb-4 flex gap-2">
                {(['all', 'unread'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-brand-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                        {f}{f === 'unread' && unread > 0 ? ` (${unread})` : ''}
                    </button>
                ))}
            </div>

            <div className="rounded-card border border-slate-200 bg-card shadow-sm divide-y divide-slate-100 overflow-hidden">
                {displayed.length === 0 && (
                    <div className="py-16 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                            <Bell size={24} className="text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">You're all caught up!</p>
                        <p className="text-xs text-slate-400 mt-1">No new notifications</p>
                    </div>
                )}
                {displayed.map(notif => {
                    const { icon: Icon, color } = iconMap[notif.type];
                    return (
                        <div key={notif.id} onClick={() => markRead(notif.id)}
                            className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                            <div className={`shrink-0 rounded-xl p-2.5 mt-0.5 ${color}`}>
                                <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <p className={`text-sm font-semibold ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>{notif.title}</p>
                                    <span className="shrink-0 text-xs text-slate-400 mt-0.5">{notif.time}</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-0.5 leading-snug">{notif.body}</p>
                            </div>
                            {!notif.read && <div className="shrink-0 h-2 w-2 rounded-full bg-brand-600 mt-2" />}
                        </div>
                    );
                })}
            </div>
        </AppLayout>
    );
}
