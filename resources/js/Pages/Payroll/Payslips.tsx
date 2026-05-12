import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage } from '@inertiajs/react';
import { Button, Select } from 'antd';
import { Download, Printer, Eye, DollarSign, TrendingUp, Banknote, Calendar, Users, Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { PageProps } from '@/types';

const card: React.CSSProperties = {
    background: '#fff', borderRadius: 12,
    border: '1px solid #EDE9FE',
    boxShadow: '0 1px 3px rgba(124,58,237,0.06)',
};

interface Payslip {
    id: string; period: string; employee: string; dept: string;
    initials: string; color: string;
    gross: number; deductions: number; tax: number; net: number;
    status: 'Paid' | 'Pending';
}

// Full dataset — managers see all; employees see only their own
const ALL_PAYSLIPS: Payslip[] = [
    { id:'PS-2026-060', period:'May 2026', employee:'Sara Kim',      dept:'Engineering', initials:'SK', color:'#7C3AED', gross:7917, deductions:791,  tax:1188, net:5938, status:'Paid' },
    { id:'PS-2026-059', period:'May 2026', employee:'Hamza Ali',     dept:'Design',      initials:'HA', color:'#3B82F6', gross:6500, deductions:650,  tax:975,  net:4875, status:'Paid' },
    { id:'PS-2026-058', period:'May 2026', employee:'Lisa Park',     dept:'Operations',  initials:'LP', color:'#10B981', gross:7333, deductions:733,  tax:1100, net:5500, status:'Paid' },
    { id:'PS-2026-057', period:'May 2026', employee:'Marcus Chen',   dept:'Engineering', initials:'MC', color:'#F59E0B', gross:7667, deductions:767,  tax:1150, net:5750, status:'Paid' },
    { id:'PS-2026-056', period:'May 2026', employee:'Nina Kovač',    dept:'HR',          initials:'NK', color:'#EC4899', gross:6000, deductions:600,  tax:900,  net:4500, status:'Paid' },
    { id:'PS-2026-055', period:'May 2026', employee:'Sophie Turner', dept:'Engineering', initials:'ST', color:'#6366F1', gross:8750, deductions:875,  tax:1313, net:6563, status:'Paid' },
    { id:'PS-2026-054', period:'Apr 2026', employee:'Sara Kim',      dept:'Engineering', initials:'SK', color:'#7C3AED', gross:7917, deductions:791,  tax:1188, net:5938, status:'Paid' },
    { id:'PS-2026-053', period:'Apr 2026', employee:'Hamza Ali',     dept:'Design',      initials:'HA', color:'#3B82F6', gross:6500, deductions:650,  tax:975,  net:4875, status:'Paid' },
    { id:'PS-2026-052', period:'Apr 2026', employee:'Marcus Chen',   dept:'Engineering', initials:'MC', color:'#F59E0B', gross:7667, deductions:767,  tax:1150, net:5750, status:'Paid' },
    { id:'PS-2026-051', period:'Mar 2026', employee:'Sara Kim',      dept:'Engineering', initials:'SK', color:'#7C3AED', gross:7917, deductions:791,  tax:1188, net:5938, status:'Paid' },
    { id:'PS-2026-050', period:'Mar 2026', employee:'Hamza Ali',     dept:'Design',      initials:'HA', color:'#3B82F6', gross:6500, deductions:650,  tax:975,  net:4875, status:'Paid' },
    { id:'PS-2026-049', period:'Mar 2026', employee:'Lisa Park',     dept:'Operations',  initials:'LP', color:'#10B981', gross:7333, deductions:733,  tax:1100, net:5500, status:'Paid' },
    { id:'PS-2026-048', period:'Feb 2026', employee:'Sara Kim',      dept:'Engineering', initials:'SK', color:'#7C3AED', gross:7917, deductions:791,  tax:1188, net:5938, status:'Paid' },
    { id:'PS-2026-047', period:'Feb 2026', employee:'Marcus Chen',   dept:'Engineering', initials:'MC', color:'#F59E0B', gross:7667, deductions:767,  tax:1150, net:5750, status:'Paid' },
];

const periods = ['All Periods', 'May 2026', 'Apr 2026', 'Mar 2026', 'Feb 2026'];

// Map an auth user name → payslip employee name (for mock matching)
function resolveEmployeeName(authName: string): string {
    const map: Record<string, string> = {
        'Sara Employee': 'Sara Kim',
        'Sara Kim':      'Sara Kim',
        'Hamza Ali':     'Hamza Ali',
        'Lisa Park':     'Lisa Park',
        'Marcus Chen':   'Marcus Chen',
        'Nina Kovač':    'Nina Kovač',
        'Sophie Turner': 'Sophie Turner',
    };
    return map[authName] ?? authName;
}

export default function Payslips() {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const role = user.role;
    const isManager = role === 'manager' || role === 'owner' || role === 'super_admin';

    const myName = resolveEmployeeName(user.name);
    const myPayslips = isManager ? ALL_PAYSLIPS : ALL_PAYSLIPS.filter(p => p.employee === myName);

    const [period, setPeriod]   = useState('All Periods');
    const [empFilter, setEmpFilter] = useState('All Employees');
    const [selected, setSelected] = useState<Payslip | null>(null);

    // For manager: allow filtering by employee
    const empOptions = ['All Employees', ...Array.from(new Set(ALL_PAYSLIPS.map(p => p.employee)))];

    const filtered = myPayslips.filter(p => {
        const periodOk = period === 'All Periods' || p.period === period;
        const empOk    = !isManager || empFilter === 'All Employees' || p.employee === empFilter;
        return periodOk && empOk;
    });

    // YTD calculations on the filtered employee's data
    const ytdBase = isManager
        ? myPayslips.filter(p => p.employee === (empFilter === 'All Employees' ? p.employee : empFilter))
        : myPayslips;
    const ytdGross = ytdBase.reduce((s, p) => s + p.gross, 0);
    const ytdTax   = ytdBase.reduce((s, p) => s + p.tax,   0);
    const ytdNet   = ytdBase.reduce((s, p) => s + p.net,   0);

    return (
        <AppLayout title="Payslips">
            <Head title="Payslips" />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                        {isManager ? 'Payroll & Payslips' : 'My Payslips'}
                    </h1>
                    <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>
                        {isManager
                            ? 'View and manage all employee pay statements'
                            : 'View and download your personal pay statements'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    {isManager && (
                        <Select value={empFilter} onChange={setEmpFilter} style={{ width: 180 }}
                            options={empOptions.map(e => ({ label: e, value: e }))} />
                    )}
                    <Select value={period} onChange={setPeriod} style={{ width: 160 }}
                        options={periods.map(p => ({ label: p, value: p }))} />
                </div>
            </div>

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    { label: isManager ? 'Total Gross (YTD)' : 'YTD Gross', value: `$${ytdGross.toLocaleString()}`, icon: DollarSign, color:'#059669', bg:'#ECFDF5' },
                    { label: isManager ? 'Total Tax (YTD)'   : 'YTD Tax',   value: `$${ytdTax.toLocaleString()}`,   icon: TrendingUp, color:'#DC2626', bg:'#FEF2F2' },
                    { label: isManager ? 'Total Net (YTD)'   : 'YTD Net',   value: `$${ytdNet.toLocaleString()}`,   icon: Banknote,   color:'#7C3AED', bg:'#F5F3FF' },
                    { label: 'Next Pay', value: 'Jun 1', icon: Calendar, color:'#3B82F6', bg:'#EFF6FF' },
                ].map(k => (
                    <div key={k.label} style={{ ...card, padding: '18px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ fontSize: 11, color: '#64748B', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</p>
                                <p style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', margin: '6px 0 0', lineHeight: 1 }}>{k.value}</p>
                            </div>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <k.icon size={18} color={k.color} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Employee badge (for employee view) */}
            {!isManager && (
                <div style={{ ...card, padding: '12px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>
                        {myName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{myName}</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>Showing only your pay statements · {myPayslips.length} records</p>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 20 }}>
                {/* Table */}
                <div style={{ ...card, overflow: 'hidden' }}>
                    {/* Table header */}
                    <div style={{ display: 'flex', padding: '0 20px', height: 42, background: '#FAFAFA', borderBottom: '1px solid #F1F5F9', alignItems: 'center' }}>
                        {(isManager
                            ? ['PAYSLIP ID', 'EMPLOYEE', 'PERIOD', 'GROSS', 'DEDUCTIONS', 'NET PAY', 'STATUS', 'ACTIONS']
                            : ['PAYSLIP ID', 'PERIOD', 'GROSS', 'DEDUCTIONS', 'NET PAY', 'STATUS', 'ACTIONS']
                        ).map((h, idx) => (
                            <div key={h} style={{
                                flex: (isManager && idx === 1) ? 2 : 1,
                                fontSize: 11, fontWeight: 600, color: '#94A3B8',
                                textTransform: 'uppercase', letterSpacing: '0.07em',
                                textAlign: (isManager ? idx >= 3 : idx >= 2) ? 'right' : 'left',
                            }}>{h}</div>
                        ))}
                    </div>

                    {filtered.length === 0 ? (
                        <div style={{ padding: '48px 20px', textAlign: 'center', color: '#94A3B8' }}>
                            <DollarSign size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
                            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>No payslips found</p>
                            <p style={{ margin: '4px 0 0', fontSize: 12 }}>Try adjusting your filters</p>
                        </div>
                    ) : filtered.map((p, i) => (
                        <div key={p.id}
                            style={{
                                display: 'flex', alignItems: 'center', padding: '0 20px', height: 56,
                                borderBottom: i < filtered.length - 1 ? '1px solid #FAF8FF' : 'none',
                                cursor: 'pointer', transition: 'background 0.1s',
                                background: selected?.id === p.id ? '#FDFCFF' : 'transparent',
                            }}
                            onClick={() => setSelected(selected?.id === p.id ? null : p)}
                            onMouseEnter={e => { if (selected?.id !== p.id) (e.currentTarget as HTMLDivElement).style.background = '#FDFCFF'; }}
                            onMouseLeave={e => { if (selected?.id !== p.id) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                        >
                            <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: '#7C3AED', fontFamily: 'monospace' }}>{p.id}</div>
                            {isManager && (
                                <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>{p.initials}</div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{p.employee}</p>
                                        <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>{p.dept}</p>
                                    </div>
                                </div>
                            )}
                            <div style={{ flex: 1, fontSize: 12, color: '#374151' }}>{p.period}</div>
                            <div style={{ flex: 1, textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#374151' }}>${p.gross.toLocaleString()}</div>
                            <div style={{ flex: 1, textAlign: 'right', fontSize: 13, color: '#DC2626' }}>-${(p.deductions + p.tax).toLocaleString()}</div>
                            <div style={{ flex: 1, textAlign: 'right', fontSize: 13, fontWeight: 700, color: '#16A34A' }}>${p.net.toLocaleString()}</div>
                            <div style={{ flex: 1, textAlign: 'right' }}>
                                <span style={{ fontSize: 11, background: p.status === 'Paid' ? '#DCFCE7' : '#FEF9C3', color: p.status === 'Paid' ? '#16A34A' : '#CA8A04', borderRadius: 20, padding: '2px 10px', fontWeight: 600 }}>
                                    {p.status}
                                </span>
                            </div>
                            <div style={{ flex: 1, textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                                <button onClick={e => { e.stopPropagation(); setSelected(p); }}
                                    style={{ background: '#F5F3FF', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: '#7C3AED', fontSize: 11, fontWeight: 600 }}>
                                    View
                                </button>
                                <button onClick={e => e.stopPropagation()}
                                    style={{ background: '#F1F5F9', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: '#64748B', fontSize: 11 }}>
                                    PDF
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail panel */}
                {selected && (
                    <div style={{ ...card, padding: 0, overflow: 'hidden', height: 'fit-content' }}>
                        <div style={{ background: 'linear-gradient(135deg,#1E1B4B,#7C3AED)', padding: '20px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: selected.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff' }}>{selected.initials}</div>
                                <div>
                                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#fff' }}>{selected.employee}</p>
                                    <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{selected.dept} · {selected.period}</p>
                                </div>
                                <button onClick={() => setSelected(null)}
                                    style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    ×
                                </button>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Net Pay</p>
                                <p style={{ margin: '4px 0 0', fontSize: 36, fontWeight: 800, color: '#fff' }}>${selected.net.toLocaleString()}</p>
                            </div>
                        </div>
                        <div style={{ padding: '16px 20px' }}>
                            <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Breakdown</p>
                            {[
                                { label: 'Gross Pay',   value: `$${selected.gross.toLocaleString()}`,        color: '#374151' },
                                { label: 'Income Tax',  value: `-$${selected.tax.toLocaleString()}`,          color: '#DC2626' },
                                { label: 'Deductions',  value: `-$${selected.deductions.toLocaleString()}`,   color: '#DC2626' },
                                { label: 'Net Pay',     value: `$${selected.net.toLocaleString()}`,           color: '#16A34A' },
                            ].map(row => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F5F3FF' }}>
                                    <span style={{ fontSize: 13, color: '#64748B' }}>{row.label}</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: row.color }}>{row.value}</span>
                                </div>
                            ))}
                            <div style={{ marginTop: 12, padding: '10px 14px', background: '#F5F3FF', borderRadius: 8 }}>
                                <p style={{ margin: 0, fontSize: 11, color: '#7C3AED', fontWeight: 600 }}>Payslip ID: {selected.id}</p>
                                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94A3B8' }}>Status: {selected.status} · {selected.period}</p>
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                                <Button icon={<Download size={14} />} block style={{ borderRadius: 8, borderColor: '#EDE9FE', color: '#7C3AED' }}>Download PDF</Button>
                                <Button icon={<Printer size={14} />} style={{ borderRadius: 8, borderColor: '#E2E8F0', color: '#64748B' }}>Print</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
