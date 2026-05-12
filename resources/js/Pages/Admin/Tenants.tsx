import AppLayout from '@/Layouts/AppLayout';
import Badge from '@/Components/Badge';
import { Head } from '@inertiajs/react';
import { Plus, MoreHorizontal, Building2 } from 'lucide-react';

const tenants = [
    { id: 1, name: 'Acme Corp',    plan: 'Pro',        users: 12, projects: 4,  storage: '2.4 GB', status: 'Active',    created: 'Jan 10, 2026', mrr: '$299' },
    { id: 2, name: 'Beta Inc',     plan: 'Starter',    users: 5,  projects: 2,  storage: '0.8 GB', status: 'Active',    created: 'Feb 3, 2026',  mrr: '$99'  },
    { id: 3, name: 'Gamma Ltd',    plan: 'Pro',        users: 8,  projects: 3,  storage: '1.6 GB', status: 'Active',    created: 'Jan 22, 2026', mrr: '$299' },
    { id: 4, name: 'Delta Co',     plan: 'Enterprise', users: 32, projects: 9,  storage: '8.2 GB', status: 'Active',    created: 'Dec 5, 2025',  mrr: '$799' },
    { id: 5, name: 'Epsilon SA',   plan: 'Starter',    users: 3,  projects: 1,  storage: '0.2 GB', status: 'Trial',     created: 'Apr 1, 2026',  mrr: '$0'   },
    { id: 6, name: 'Zeta Group',   plan: 'Pro',        users: 15, projects: 6,  storage: '3.1 GB', status: 'Suspended', created: 'Nov 14, 2025', mrr: '$299' },
];

const planColor: Record<string, 'purple'|'blue'|'slate'> = { Enterprise: 'purple', Pro: 'blue', Starter: 'slate' };
const statusColor: Record<string, 'green'|'amber'|'red'> = { Active: 'green', Trial: 'amber', Suspended: 'red' };

const summaryCards = [
    { label: 'Active',    count: tenants.filter(t => t.status === 'Active').length,    color: 'text-green-600 bg-green-50 border-green-100' },
    { label: 'Trial',     count: tenants.filter(t => t.status === 'Trial').length,     color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { label: 'Suspended', count: tenants.filter(t => t.status === 'Suspended').length, color: 'text-red-600 bg-red-50 border-red-100' },
];

export default function TenantsPage() {
    return (
        <AppLayout title="Tenants">
            <Head title="Tenants" />

            {/* Hero header */}
            <div className="relative mb-6 overflow-hidden rounded-2xl bg-brand-900 px-7 py-8">
                <div className="absolute -top-10 -right-10 h-52 w-52 rounded-full bg-brand-700 opacity-40 pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-brand-600 opacity-20 pointer-events-none" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-1">Administration</p>
                        <h2 className="text-2xl font-bold text-white">Tenant Management</h2>
                        <p className="mt-1 text-sm text-white/60">{tenants.length} organizations on the platform</p>
                    </div>
                    <button className="flex items-center gap-2 rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors">
                        <Plus size={16} /> New Tenant
                    </button>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {summaryCards.map(s => (
                    <div key={s.label} className={`rounded-card border bg-card p-5 shadow-sm flex items-center gap-4 ${s.color}`}>
                        <div className="rounded-xl p-3 bg-white shadow-sm">
                            <Building2 size={20} className={s.color.split(' ')[0]} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-800">{s.count}</p>
                            <p className="text-sm text-slate-500">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-card border border-slate-200 bg-card shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-5 py-3 text-left">Organization</th>
                            <th className="px-4 py-3 text-left">Plan</th>
                            <th className="px-4 py-3 text-center">Users</th>
                            <th className="px-4 py-3 text-center">Projects</th>
                            <th className="px-4 py-3 text-left">Storage</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-right">MRR</th>
                            <th className="px-4 py-3 text-left">Created</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {tenants.map(t => (
                            <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-brand-900 flex items-center justify-center text-xs font-bold text-white">{t.name[0]}</div>
                                        <span className="font-medium text-slate-800">{t.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5"><Badge label={t.plan} variant={planColor[t.plan]} /></td>
                                <td className="px-4 py-3.5 text-center text-slate-600">{t.users}</td>
                                <td className="px-4 py-3.5 text-center text-slate-600">{t.projects}</td>
                                <td className="px-4 py-3.5 text-slate-600">{t.storage}</td>
                                <td className="px-4 py-3.5"><Badge label={t.status} variant={statusColor[t.status]} /></td>
                                <td className="px-4 py-3.5 text-right font-semibold text-slate-800">{t.mrr}</td>
                                <td className="px-4 py-3.5 text-slate-500 text-xs">{t.created}</td>
                                <td className="px-4 py-3.5"><button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={16} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
