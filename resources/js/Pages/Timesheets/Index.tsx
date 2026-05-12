import AppLayout from '@/Layouts/AppLayout';
import Badge from '@/Components/Badge';
import { Head } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Check, X, ClipboardList } from 'lucide-react';
import { useState } from 'react';

const weeks = ['Mar 24 – Mar 28', 'Mar 31 – Apr 4', 'Apr 7 – Apr 11'];

const logs = [
    { id: 1, employee: 'Hamza Ahmed', project: 'Website Redesign', task: 'Implement auth flow',    hours: 8.0, date: 'Mon', status: 'Pending'  },
    { id: 2, employee: 'Hamza Ahmed', project: 'API Integration',  task: 'Write unit tests',       hours: 6.5, date: 'Tue', status: 'Pending'  },
    { id: 3, employee: 'Dev Ahmad',   project: 'Website Redesign', task: 'Design hero section',    hours: 7.0, date: 'Mon', status: 'Approved' },
    { id: 4, employee: 'Dev Ahmad',   project: 'Mobile App v2',    task: 'App icon variations',    hours: 4.0, date: 'Wed', status: 'Approved' },
    { id: 5, employee: 'Sara Rahman', project: 'CRM Dashboard',    task: 'Database schema design', hours: 8.0, date: 'Mon', status: 'Pending'  },
    { id: 6, employee: 'Sara Rahman', project: 'CRM Dashboard',    task: 'API endpoints',          hours: 7.5, date: 'Tue', status: 'Rejected' },
    { id: 7, employee: 'QA Tester',   project: 'Mobile App v2',    task: 'Regression testing',     hours: 5.0, date: 'Thu', status: 'Pending'  },
];

const statusVariant: Record<string, 'amber'|'green'|'red'> = { Pending: 'amber', Approved: 'green', Rejected: 'red' };

export default function TimesheetsIndex() {
    const [weekIdx, setWeekIdx] = useState(1);
    const totalHours = logs.reduce((s, l) => s + l.hours, 0);
    const pending = logs.filter(l => l.status === 'Pending').length;
    const approved = logs.filter(l => l.status === 'Approved').length;

    return (
        <AppLayout title="Timesheets">
            <Head title="Timesheets" />

            {/* Hero header */}
            <div className="relative mb-6 overflow-hidden rounded-2xl bg-brand-900 px-7 py-8">
                <div className="absolute -top-10 -right-10 h-52 w-52 rounded-full bg-brand-700 opacity-40 pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-brand-600 opacity-20 pointer-events-none" />
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                            <ClipboardList size={22} className="text-brand-400" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-0.5">Manager</p>
                            <h2 className="text-2xl font-bold text-white">Timesheet Approval</h2>
                            <p className="mt-0.5 text-sm text-white/60">{pending} entries awaiting your approval</p>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-6 text-center">
                        <div>
                            <p className="text-3xl font-bold text-white">{totalHours}h</p>
                            <p className="text-xs text-white/50 mt-0.5">Total Hours</p>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-3xl font-bold text-amber-400">{pending}</p>
                            <p className="text-xs text-white/50 mt-0.5">Pending</p>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-3xl font-bold text-green-400">{approved}</p>
                            <p className="text-xs text-white/50 mt-0.5">Approved</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Week selector */}
            <div className="mb-5 flex items-center gap-3">
                <button onClick={() => setWeekIdx(i => Math.max(0, i - 1))} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-100 transition-colors"><ChevronLeft size={16} /></button>
                <span className="text-sm font-semibold text-slate-700 w-48 text-center">{weeks[weekIdx]}</span>
                <button onClick={() => setWeekIdx(i => Math.min(weeks.length - 1, i + 1))} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-100 transition-colors"><ChevronRight size={16} /></button>
                <span className="ml-4 text-sm text-slate-500">Total: <strong className="text-slate-800">{totalHours}h</strong></span>
            </div>

            <div className="rounded-card border border-slate-200 bg-card shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-5 py-3 text-left">Employee</th>
                            <th className="px-4 py-3 text-left">Project</th>
                            <th className="px-4 py-3 text-left">Task</th>
                            <th className="px-4 py-3 text-left">Day</th>
                            <th className="px-4 py-3 text-left">Hours</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">{log.employee[0]}</div>
                                        <span className="font-medium text-slate-800">{log.employee}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5 text-slate-600">{log.project}</td>
                                <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate">{log.task}</td>
                                <td className="px-4 py-3.5 text-slate-500">{log.date}</td>
                                <td className="px-4 py-3.5 font-semibold text-slate-800">{log.hours}h</td>
                                <td className="px-4 py-3.5"><Badge label={log.status} variant={statusVariant[log.status]} /></td>
                                <td className="px-4 py-3.5">
                                    {log.status === 'Pending' && (
                                        <div className="flex gap-2">
                                            <button className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                                                <Check size={12} /> Approve
                                            </button>
                                            <button className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                                                <X size={12} /> Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
