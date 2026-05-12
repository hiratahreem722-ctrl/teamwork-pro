import AppLayout from '@/Layouts/AppLayout';
import StatCard from '@/Components/StatCard';
import { Head } from '@inertiajs/react';
import { DollarSign, Clock, TrendingUp, BarChart3, Download } from 'lucide-react';

const projects = [
    { name: 'Website Redesign',   budget: 12000, spent: 7800,  hours: 208, estHours: 320, margin: 35 },
    { name: 'Mobile App v2',      budget: 18000, spent: 16200, hours: 432, estHours: 480, margin: 10 },
    { name: 'API Integration',    budget: 6000,  spent: 600,   hours: 16,  estHours: 160, margin: 90 },
    { name: 'CRM Dashboard',      budget: 22000, spent: 9200,  hours: 245, estHours: 580, margin: 58 },
    { name: 'Brand Identity Kit', budget: 4500,  spent: 4300,  hours: 115, estHours: 120, margin: 4  },
];

const weeklyHours = [
    { week: 'Mar 10', hours: 142 },
    { week: 'Mar 17', hours: 158 },
    { week: 'Mar 24', hours: 135 },
    { week: 'Mar 31', hours: 171 },
    { week: 'Apr 7',  hours: 164 },
];
const maxH = Math.max(...weeklyHours.map(w => w.hours));

export default function ReportsIndex() {
    return (
        <AppLayout title="Reports">
            <Head title="Reports & Analytics" />

            {/* Hero header */}
            <div className="relative mb-6 overflow-hidden rounded-2xl bg-brand-900 px-7 py-8">
                <div className="absolute -top-10 -right-10 h-52 w-52 rounded-full bg-brand-700 opacity-40 pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-brand-600 opacity-20 pointer-events-none" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-1">Manager</p>
                        <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
                        <p className="mt-1 text-sm text-white/60">Financial insights and team performance</p>
                    </div>
                    <button className="flex items-center gap-2 rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors">
                        <Download size={15} /> Export
                    </button>
                </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
                <StatCard label="Total Revenue"   value="$62,500" icon={DollarSign} change="+18% vs last month" changeType="up"      color="green"  />
                <StatCard label="Total Hours"     value="1,016h"  icon={Clock}      change="This month"         changeType="neutral" color="blue"   />
                <StatCard label="Avg. Margin"     value="39%"     icon={TrendingUp} change="Target: 40%"        changeType="up"      color="indigo" />
                <StatCard label="Active Projects" value={5}       icon={BarChart3}  change="2 near deadline"    changeType="down"    color="amber"  />
            </div>

            {/* Weekly hours bar chart */}
            <div className="mb-6 rounded-card border border-slate-200 bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-slate-700">Weekly Hours Logged</h3>
                    <span className="text-xs text-brand-600 font-medium bg-brand-100 border border-blue-200 rounded-full px-2.5 py-1">Last 5 weeks</span>
                </div>
                <div className="flex items-end gap-4 h-36">
                    {weeklyHours.map((w, i) => (
                        <div key={w.week} className="flex-1 flex flex-col items-center gap-2">
                            <span className="text-xs font-bold text-slate-700">{w.hours}</span>
                            <div
                                className="w-full rounded-t-lg bg-brand-600 transition-all"
                                style={{ height: `${(w.hours / maxH) * 100}%`, opacity: 0.6 + (i / weeklyHours.length) * 0.4 }}
                            />
                            <span className="text-xs text-slate-400">{w.week}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Project profitability */}
            <div className="rounded-card border border-slate-200 bg-card shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 px-5 py-4">
                    <h3 className="font-semibold text-slate-700">Project Profitability</h3>
                </div>
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-5 py-3 text-left">Project</th>
                            <th className="px-4 py-3 text-right">Budget</th>
                            <th className="px-4 py-3 text-right">Spent</th>
                            <th className="px-4 py-3 text-right">Est. Hours</th>
                            <th className="px-4 py-3 text-right">Logged</th>
                            <th className="px-4 py-3 text-left">Margin</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {projects.map(p => (
                            <tr key={p.name} className="hover:bg-slate-50 transition-colors">
                                <td className="px-5 py-3.5 font-medium text-slate-800">{p.name}</td>
                                <td className="px-4 py-3.5 text-right text-slate-600">${p.budget.toLocaleString()}</td>
                                <td className="px-4 py-3.5 text-right text-slate-600">${p.spent.toLocaleString()}</td>
                                <td className="px-4 py-3.5 text-right text-slate-600">{p.estHours}h</td>
                                <td className="px-4 py-3.5 text-right text-slate-600">{p.hours}h</td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-24 rounded-full bg-slate-100">
                                            <div
                                                className={`h-2 rounded-full ${p.margin >= 30 ? 'bg-green-500' : p.margin >= 15 ? 'bg-amber-500' : 'bg-red-400'}`}
                                                style={{ width: `${p.margin}%` }}
                                            />
                                        </div>
                                        <span className={`text-xs font-semibold ${p.margin >= 30 ? 'text-green-600' : p.margin >= 15 ? 'text-amber-600' : 'text-red-500'}`}>{p.margin}%</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
