import AppLayout from '@/Layouts/AppLayout';
import StatCard from '@/Components/StatCard';
import { Head } from '@inertiajs/react';
import { Users, FolderKanban, Clock, TrendingUp } from 'lucide-react';

const tenantActivity = [
    { tenant: 'Delta Co',    projects: 9,  users: 32, hoursMonth: 892, growth: '+12%' },
    { tenant: 'Acme Corp',   projects: 4,  users: 12, hoursMonth: 340, growth: '+8%'  },
    { tenant: 'Gamma Ltd',   projects: 3,  users: 8,  hoursMonth: 210, growth: '+3%'  },
    { tenant: 'Beta Inc',    projects: 2,  users: 5,  hoursMonth: 88,  growth: '+22%' },
    { tenant: 'Epsilon SA',  projects: 1,  users: 3,  hoursMonth: 24,  growth: 'New'  },
];

const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
const userGrowth = [18, 24, 35, 42, 55, 60];
const maxU = Math.max(...userGrowth);

const barColors = ['bg-brand-400', 'bg-brand-500', 'bg-brand-600', 'bg-brand-600', 'bg-brand-700', 'bg-brand-900'];

export default function AnalyticsPage() {
    return (
        <AppLayout title="Analytics">
            <Head title="Global Analytics" />

            {/* Hero header */}
            <div className="relative mb-6 overflow-hidden rounded-2xl bg-brand-900 px-7 py-8">
                <div className="absolute -top-10 -right-10 h-52 w-52 rounded-full bg-brand-700 opacity-40 pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-brand-600 opacity-20 pointer-events-none" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-1">Administration</p>
                        <h2 className="text-2xl font-bold text-white">Global Analytics</h2>
                        <p className="mt-1 text-sm text-white/60">Platform-wide usage and growth metrics</p>
                    </div>
                    <div className="hidden lg:flex items-center gap-6 text-center">
                        <div>
                            <p className="text-3xl font-bold text-white">+25%</p>
                            <p className="text-xs text-white/50 mt-0.5">User Growth</p>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-3xl font-bold text-white">78%</p>
                            <p className="text-xs text-white/50 mt-0.5">Avg Utilization</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
                <StatCard label="Total Users"      value={60}       icon={Users}        change="+25% since Jan"  changeType="up"      color="blue"   />
                <StatCard label="Active Projects"  value={19}       icon={FolderKanban} change="Across all orgs" changeType="neutral" color="indigo" />
                <StatCard label="Hours This Month" value="1,554h"   icon={Clock}        change="+18% vs last"    changeType="up"      color="green"  />
                <StatCard label="Avg Utilization"  value="78%"      icon={TrendingUp}   change="Target: 80%"     changeType="up"      color="amber"  />
            </div>

            {/* User growth chart */}
            <div className="mb-6 rounded-card border border-slate-200 bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-slate-700">User Growth</h3>
                    <span className="text-xs text-green-600 font-medium bg-green-50 border border-green-100 rounded-full px-2.5 py-1">+233% in 6 months</span>
                </div>
                <div className="flex items-end gap-3 h-36">
                    {months.map((m, i) => (
                        <div key={m} className="flex-1 flex flex-col items-center gap-2">
                            <span className="text-xs font-bold text-slate-700">{userGrowth[i]}</span>
                            <div
                                className={`w-full rounded-t-lg ${barColors[i]} transition-all`}
                                style={{ height: `${(userGrowth[i] / maxU) * 100}%`, minHeight: '8px' }}
                            />
                            <span className="text-xs text-slate-400">{m}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tenant activity table */}
            <div className="rounded-card border border-slate-200 bg-card shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 px-5 py-4">
                    <h3 className="font-semibold text-slate-700">Activity by Tenant</h3>
                </div>
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-5 py-3 text-left">Tenant</th>
                            <th className="px-4 py-3 text-center">Projects</th>
                            <th className="px-4 py-3 text-center">Users</th>
                            <th className="px-4 py-3 text-right">Hours (Month)</th>
                            <th className="px-4 py-3 text-left">Usage</th>
                            <th className="px-4 py-3 text-right">Growth</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {tenantActivity.map(t => (
                            <tr key={t.tenant} className="hover:bg-slate-50 transition-colors">
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 rounded-lg bg-brand-900 text-white text-xs font-bold flex items-center justify-center">{t.tenant[0]}</div>
                                        <span className="font-medium text-slate-800">{t.tenant}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5 text-center text-slate-600">{t.projects}</td>
                                <td className="px-4 py-3.5 text-center text-slate-600">{t.users}</td>
                                <td className="px-4 py-3.5 text-right font-medium text-slate-800">{t.hoursMonth}h</td>
                                <td className="px-4 py-3.5 w-36">
                                    <div className="h-2 rounded-full bg-slate-100">
                                        <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: `${(t.hoursMonth / 892) * 100}%` }} />
                                    </div>
                                </td>
                                <td className={`px-4 py-3.5 text-right text-xs font-semibold ${t.growth === 'New' ? 'text-blue-600' : 'text-green-600'}`}>{t.growth}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
