import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Users, TrendingUp, ArrowUpRight, Plus } from 'lucide-react';

const card = { background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', boxShadow: '0 1px 3px rgba(124,58,237,0.06)' } as const;

const departments = [
    { name: 'Engineering',  head: 'Sara Kim',     headInitials: 'SK', color: '#7C3AED', bg: '#F5F3FF', employees: 5,  projects: 12, budget: 580000, spent: 420000, openRoles: 2 },
    { name: 'Design',       head: 'Hamza Ali',    headInitials: 'HA', color: '#3B82F6', bg: '#EFF6FF', employees: 2,  projects: 6,  budget: 180000, spent: 120000, openRoles: 1 },
    { name: 'Operations',   head: 'Lisa Park',    headInitials: 'LP', color: '#10B981', bg: '#ECFDF5', employees: 3,  projects: 8,  budget: 240000, spent: 190000, openRoles: 0 },
    { name: 'Sales',        head: 'Ali Hassan',   headInitials: 'AH', color: '#F59E0B', bg: '#FFFBEB', employees: 2,  projects: 4,  budget: 160000, spent: 95000,  openRoles: 1 },
    { name: 'HR',           head: 'Nina Kovač',   headInitials: 'NK', color: '#EC4899', bg: '#FDF2F8', employees: 2,  projects: 2,  budget: 120000, spent: 88000,  openRoles: 0 },
    { name: 'Finance',      head: 'David Miller', headInitials: 'DM', color: '#059669', bg: '#ECFDF5', employees: 2,  projects: 3,  budget: 140000, spent: 102000, openRoles: 0 },
    { name: 'Marketing',    head: 'Zara Ahmed',   headInitials: 'ZA', color: '#0891B2', bg: '#ECFEFF', employees: 2,  projects: 3,  budget: 200000, spent: 145000, openRoles: 1 },
    { name: 'Analytics',    head: 'Priya Sharma', headInitials: 'PS', color: '#6366F1', bg: '#EEF2FF', employees: 1,  projects: 4,  budget: 95000,  spent: 60000,  openRoles: 1 },
];

export default function Departments() {
    return (
        <AppLayout title="Departments">
            <Head title="Departments" />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>Departments</h1>
                    <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>{departments.length} departments · {departments.reduce((s,d)=>s+d.employees,0)} total employees</p>
                </div>
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                    <Plus size={15} /> Add Department
                </button>
            </div>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Departments',    value: departments.length },
                    { label: 'Total Headcount',value: departments.reduce((s,d)=>s+d.employees,0) },
                    { label: 'Open Roles',     value: departments.reduce((s,d)=>s+d.openRoles,0) },
                    { label: 'Total Budget',   value: `$${(departments.reduce((s,d)=>s+d.budget,0)/1000).toFixed(0)}k` },
                ].map(k => (
                    <div key={k.label} style={{ ...card, padding: '18px 20px' }}>
                        <p style={{ fontSize: 11, color: '#64748B', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</p>
                        <p style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', margin: '6px 0 0' }}>{k.value}</p>
                    </div>
                ))}
            </div>

            {/* Department cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gap: 16 }}>
                {departments.map(d => (
                    <div key={d.name} style={{ ...card, padding: '20px', transition: 'transform 0.12s, box-shadow 0.12s' }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform='translateY(-2px)'; el.style.boxShadow='0 6px 20px rgba(124,58,237,0.12)'; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform=''; el.style.boxShadow='0 1px 3px rgba(124,58,237,0.06)'; }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 42, height: 42, borderRadius: 12, background: d.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Users size={20} color={d.color} />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{d.name}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ color: '#fff', fontSize: 8, fontWeight: 700 }}>{d.headInitials}</span>
                                        </div>
                                        <span style={{ fontSize: 12, color: '#64748B' }}>{d.head}</span>
                                    </div>
                                </div>
                            </div>
                            {d.openRoles > 0 && (
                                <span style={{ fontSize: 11, background: '#FEF3C7', color: '#D97706', borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>{d.openRoles} open role{d.openRoles>1?'s':''}</span>
                            )}
                        </div>

                        {/* Stats row */}
                        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                            {[
                                { label: 'People',   value: d.employees },
                                { label: 'Projects', value: d.projects  },
                                { label: 'Budget',   value: `$${(d.budget/1000).toFixed(0)}k` },
                            ].map(s => (
                                <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 8, background: '#FAFAFA' }}>
                                    <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0F172A' }}>{s.value}</p>
                                    <p style={{ margin: 0, fontSize: 11, color: '#64748B' }}>{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Budget progress */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                <span style={{ fontSize: 12, color: '#64748B' }}>Budget used</span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: d.spent/d.budget>0.9?'#DC2626':d.spent/d.budget>0.7?'#D97706':'#16A34A' }}>{Math.round((d.spent/d.budget)*100)}%</span>
                            </div>
                            <div style={{ height: 6, borderRadius: 3, background: '#F1F5F9' }}>
                                <div style={{ height: '100%', borderRadius: 3, width: `${(d.spent/d.budget)*100}%`, background: d.color }} />
                            </div>
                        </div>

                        <Link href={route('hr.employees')} style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 14, fontSize: 12, color: d.color, textDecoration: 'none', fontWeight: 600 }}>
                            View employees <ArrowUpRight size={12} />
                        </Link>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
