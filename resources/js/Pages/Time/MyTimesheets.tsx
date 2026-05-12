import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import Badge from '@/Components/Badge';
import { Head } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const weeks = ['Mar 24 – Mar 28', 'Mar 31 – Apr 4', 'Apr 7 – Apr 11'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const weekData = [
    [
        { project: 'Website Redesign', task: 'Design login screen',   mon: 3.5, tue: 0,   wed: 4.0, thu: 0,   fri: 2.0 },
        { project: 'API Integration',  task: 'Code review PR #42',    mon: 2.0, tue: 3.0, wed: 0,   thu: 0,   fri: 0   },
        { project: 'Mobile App v2',    task: 'Update profile comp.',  mon: 0,   tue: 2.0, wed: 0,   thu: 5.0, fri: 0   },
        { project: 'Internal',         task: 'Standup / meetings',    mon: 0.5, tue: 0.5, wed: 0.5, thu: 0.5, fri: 0.5 },
    ],
    [
        { project: 'Website Redesign', task: 'Responsive nav',        mon: 4.0, tue: 0,   wed: 0,   thu: 0,   fri: 0   },
        { project: 'CRM Dashboard',    task: 'Database schema',       mon: 0,   tue: 0,   wed: 6.5, thu: 0,   fri: 0   },
        { project: 'Internal',         task: 'Standup / meetings',    mon: 0.5, tue: 0.5, wed: 0.5, thu: 0.5, fri: 0.5 },
    ],
    [
        { project: 'Website Redesign', task: 'Design login screen',   mon: 3.5, tue: 0,   wed: 0,   thu: 0,   fri: 0   },
        { project: 'API Integration',  task: 'Code review PR #42',    mon: 2.0, tue: 0,   wed: 0,   thu: 0,   fri: 0   },
        { project: 'Internal',         task: 'Standup / meetings',    mon: 0.5, tue: 0.5, wed: 0.5, thu: 0.5, fri: 0.5 },
    ],
];

const weekStatus = ['Approved', 'Approved', 'Pending'];

export default function MyTimesheets() {
    const [weekIdx, setWeekIdx] = useState(2);
    const rows = weekData[weekIdx];

    const dayTotals = days.map((_, di) => rows.reduce((s, r) => s + [r.mon, r.tue, r.wed, r.thu, r.fri][di], 0));
    const totalHours = dayTotals.reduce((a, b) => a + b, 0);

    return (
        <AppLayout title="My Timesheets">
            <Head title="My Timesheets" />
            <PageHeader title="My Timesheets" subtitle="Your weekly time logs" />

            {/* Week nav */}
            <div className="mb-5 flex items-center gap-3">
                <button onClick={() => setWeekIdx(i => Math.max(0, i - 1))} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-100"><ChevronLeft size={16} /></button>
                <span className="text-sm font-medium text-slate-700 w-44 text-center">{weeks[weekIdx]}</span>
                <button onClick={() => setWeekIdx(i => Math.min(weeks.length - 1, i + 1))} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-100"><ChevronRight size={16} /></button>
                <Badge label={weekStatus[weekIdx]} variant={weekStatus[weekIdx] === 'Approved' ? 'green' : 'amber'} />
                <span className="ml-auto text-sm text-slate-500">Total: <strong className="text-slate-800">{totalHours.toFixed(1)}h</strong></span>
            </div>

            <div className="rounded-card border border-slate-200 bg-card shadow-sm overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                    <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-5 py-3 text-left">Project / Task</th>
                            {days.map(d => <th key={d} className="px-4 py-3 text-center w-16">{d}</th>)}
                            <th className="px-4 py-3 text-center w-16">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows.map((row, i) => {
                            const vals = [row.mon, row.tue, row.wed, row.thu, row.fri];
                            const total = vals.reduce((a, b) => a + b, 0);
                            return (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-5 py-3.5">
                                        <p className="font-medium text-slate-800">{row.task}</p>
                                        <p className="text-xs text-slate-400">{row.project}</p>
                                    </td>
                                    {vals.map((v, vi) => (
                                        <td key={vi} className="px-4 py-3.5 text-center text-slate-600">
                                            {v > 0 ? v.toFixed(1) : <span className="text-slate-200">–</span>}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3.5 text-center font-semibold text-slate-800">{total.toFixed(1)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="border-t border-slate-200 bg-slate-50 font-semibold text-slate-700">
                        <tr>
                            <td className="px-5 py-3 text-xs uppercase tracking-wide text-slate-500">Daily Total</td>
                            {dayTotals.map((t, i) => <td key={i} className="px-4 py-3 text-center">{t.toFixed(1)}h</td>)}
                            <td className="px-4 py-3 text-center text-brand-600">{totalHours.toFixed(1)}h</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </AppLayout>
    );
}
