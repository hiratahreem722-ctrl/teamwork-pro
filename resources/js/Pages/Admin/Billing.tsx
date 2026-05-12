import AppLayout from '@/Layouts/AppLayout';
import Badge from '@/Components/Badge';
import { Head } from '@inertiajs/react';
import { DollarSign, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';

const subscriptions = [
    { tenant: 'Delta Co',   plan: 'Enterprise', mrr: 799, status: 'Active',  nextBilling: 'May 6, 2026',   payMethod: 'Visa ••4242' },
    { tenant: 'Acme Corp',  plan: 'Pro',        mrr: 299, status: 'Active',  nextBilling: 'May 10, 2026',  payMethod: 'Visa ••9876' },
    { tenant: 'Gamma Ltd',  plan: 'Pro',        mrr: 299, status: 'Active',  nextBilling: 'May 22, 2026',  payMethod: 'MC ••5531'   },
    { tenant: 'Beta Inc',   plan: 'Starter',    mrr: 99,  status: 'Failed',  nextBilling: 'Retry Apr 10',  payMethod: 'Visa ••1234' },
    { tenant: 'Epsilon SA', plan: 'Trial',      mrr: 0,   status: 'Trial',   nextBilling: 'Expires Apr 12',payMethod: '—'           },
];

const planColor: Record<string, 'purple'|'blue'|'slate'|'green'> = { Enterprise: 'purple', Pro: 'blue', Starter: 'slate', Trial: 'green' };
const statusColor: Record<string, 'green'|'red'|'amber'> = { Active: 'green', Failed: 'red', Trial: 'amber' };
const totalMrr = subscriptions.reduce((s, t) => s + t.mrr, 0);

const kpis = [
    { label: 'Monthly Revenue',  value: `$${totalMrr.toLocaleString()}`, icon: DollarSign,  bg: 'bg-green-50',  iconColor: 'text-green-600',  border: 'border-green-100' },
    { label: 'Annual Run Rate',  value: `$${(totalMrr * 12).toLocaleString()}`, icon: TrendingUp, bg: 'bg-blue-50', iconColor: 'text-blue-600', border: 'border-blue-100' },
    { label: 'Active Plans',     value: subscriptions.filter(s => s.status === 'Active').length, icon: CreditCard, bg: 'bg-indigo-50', iconColor: 'text-indigo-600', border: 'border-indigo-100' },
    { label: 'Payment Issues',   value: subscriptions.filter(s => s.status === 'Failed').length, icon: AlertCircle, bg: 'bg-red-50', iconColor: 'text-red-600', border: 'border-red-100' },
];

export default function BillingPage() {
    return (
        <AppLayout title="Billing">
            <Head title="Billing" />

            {/* Hero header */}
            <div className="relative mb-6 overflow-hidden rounded-2xl bg-brand-900 px-7 py-8">
                <div className="absolute -top-10 -right-10 h-52 w-52 rounded-full bg-brand-700 opacity-40 pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-brand-600 opacity-20 pointer-events-none" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-1">Administration</p>
                        <h2 className="text-2xl font-bold text-white">Billing & Subscriptions</h2>
                        <p className="mt-1 text-sm text-white/60">Manage tenant plans and payment status</p>
                    </div>
                    <div className="hidden lg:flex items-center gap-6 text-center">
                        <div>
                            <p className="text-3xl font-bold text-white">${totalMrr.toLocaleString()}</p>
                            <p className="text-xs text-white/50 mt-0.5">MRR</p>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-3xl font-bold text-white">${(totalMrr * 12).toLocaleString()}</p>
                            <p className="text-xs text-white/50 mt-0.5">ARR</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
                {kpis.map(c => (
                    <div key={c.label} className={`rounded-card border ${c.border} bg-card p-5 shadow-sm flex items-center gap-4`}>
                        <div className={`rounded-xl p-3 ${c.bg} shadow-sm`}>
                            <c.icon size={20} className={c.iconColor} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{c.value}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{c.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-card border border-slate-200 bg-card shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-5 py-3 text-left">Tenant</th>
                            <th className="px-4 py-3 text-left">Plan</th>
                            <th className="px-4 py-3 text-right">MRR</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Next Billing</th>
                            <th className="px-4 py-3 text-left">Payment Method</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {subscriptions.map(s => (
                            <tr key={s.tenant} className={`hover:bg-slate-50 transition-colors ${s.status === 'Failed' ? 'bg-red-50/30' : ''}`}>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 rounded-lg bg-brand-900 text-white text-xs font-bold flex items-center justify-center">{s.tenant[0]}</div>
                                        <span className="font-medium text-slate-800">{s.tenant}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5"><Badge label={s.plan} variant={planColor[s.plan]} /></td>
                                <td className="px-4 py-3.5 text-right font-semibold text-slate-800">{s.mrr > 0 ? `$${s.mrr}` : '—'}</td>
                                <td className="px-4 py-3.5"><Badge label={s.status} variant={statusColor[s.status]} /></td>
                                <td className="px-4 py-3.5 text-slate-500 text-xs">{s.nextBilling}</td>
                                <td className="px-4 py-3.5 text-slate-500">{s.payMethod}</td>
                                <td className="px-4 py-3.5">
                                    {s.status === 'Failed' && <button className="text-xs text-red-600 font-medium hover:underline">Retry</button>}
                                    {s.status === 'Trial' && <button className="text-xs text-brand-600 font-medium hover:underline">Convert</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
