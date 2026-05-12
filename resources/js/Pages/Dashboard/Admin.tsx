import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Avatar, Tag } from 'antd';
import {
    Building2, Users, UserCheck, Briefcase, AlertTriangle,
    ArrowUpRight, Shield, TrendingUp, Activity, CheckCircle,
    XCircle, Clock, CreditCard,
} from 'lucide-react';
import AnimatedNumber from '@/Components/AnimatedNumber';

const card = { background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', boxShadow: '0 1px 3px rgba(124,58,237,0.06)' } as const;

const kpis = [
    { label: 'Total Tenants',  numVal: 12,  delta: '+2 this month', up: true,  icon: Building2,  color: '#7C3AED', bg: '#F5F3FF' },
    { label: 'Total Users',    numVal: 184, delta: '+14 this month', up: true,  icon: Users,      color: '#0369A1', bg: '#EFF6FF' },
    { label: 'Managers',       numVal: 31,  delta: '+3 this month',  up: true,  icon: UserCheck,  color: '#059669', bg: '#ECFDF5' },
    { label: 'Employees',      numVal: 153, delta: '+11 this month', up: true,  icon: Briefcase,  color: '#D97706', bg: '#FFFBEB' },
];

const tenants = [
    { name: 'Acme Corp',          owner: 'John Smith',    members: 34, plan: 'Pro',       status: 'Active',    joined: '2025-01-14', color: '#7C3AED' },
    { name: 'Massive Dynamic',    owner: 'Sara Johnson',  members: 28, plan: 'Enterprise', status: 'Active',   joined: '2025-02-03', color: '#2563EB' },
    { name: 'Beta Manufacturing', owner: 'Alex Lee',      members: 19, plan: 'Pro',       status: 'Active',    joined: '2025-03-11', color: '#059669' },
    { name: 'Zeta Solutions',     owner: 'Maria Garcia',  members: 12, plan: 'Starter',   status: 'Suspended', joined: '2025-03-28', color: '#D97706' },
    { name: 'HealthFirst Inc',    owner: 'Robert Kim',    members: 21, plan: 'Pro',       status: 'Active',    joined: '2025-04-06', color: '#0891B2' },
    { name: 'TechWave Ltd',       owner: 'Priya Patel',   members: 8,  plan: 'Starter',   status: 'Trial',     joined: '2025-04-22', color: '#6366F1' },
    { name: 'BlueRidge Systems',  owner: 'David Nwosu',   members: 15, plan: 'Pro',       status: 'Active',    joined: '2025-05-01', color: '#9333EA' },
    { name: 'Nova Analytics',     owner: 'Claire Dupont', members: 10, plan: 'Starter',   status: 'Trial',     joined: '2025-05-08', color: '#EC4899' },
];

const systemAlerts = [
    { level: 'error',   msg: 'Zeta Solutions account suspended — payment failed',        time: '2h ago' },
    { level: 'warning', msg: '3 tenants approaching user seat limit (Pro plan)',          time: '5h ago' },
    { level: 'warning', msg: 'TechWave Ltd trial expires in 4 days',                     time: '8h ago' },
    { level: 'info',    msg: 'Nova Analytics signed up — trial started',                  time: '12h ago' },
    { level: 'info',    msg: 'BlueRidge Systems upgraded from Starter → Pro',            time: '1d ago' },
];

const recentUsers = [
    { name: 'Claire Dupont', email: 'claire@novaanalytics.io', role: 'owner',    tenant: 'Nova Analytics',    color: '#EC4899', joined: '2h ago' },
    { name: 'David Nwosu',   email: 'david@blueridge.com',     role: 'owner',    tenant: 'BlueRidge Systems', color: '#9333EA', joined: '1d ago' },
    { name: 'Priya Patel',   email: 'priya@techwave.io',       role: 'owner',    tenant: 'TechWave Ltd',      color: '#6366F1', joined: '2d ago' },
    { name: 'Lena Müller',   email: 'lena@acmecorp.com',       role: 'manager',  tenant: 'Acme Corp',         color: '#7C3AED', joined: '3d ago' },
    { name: 'Tom Wilson',    email: 'tom@healthfirst.com',      role: 'employee', tenant: 'HealthFirst Inc',   color: '#0891B2', joined: '3d ago' },
];

const planCfg: Record<string, { bg: string; color: string }> = {
    'Enterprise': { bg: '#EDE9FE', color: '#7C3AED' },
    'Pro':        { bg: '#DBEAFE', color: '#1D4ED8' },
    'Starter':    { bg: '#F3F4F6', color: '#6B7280' },
};

const statusCfg: Record<string, { bg: string; color: string }> = {
    'Active':    { bg: '#DCFCE7', color: '#16A34A' },
    'Suspended': { bg: '#FEE2E2', color: '#DC2626' },
    'Trial':     { bg: '#FEF3C7', color: '#D97706' },
};

const alertCfg: Record<string, { bg: string; border: string; color: string; icon: React.ElementType }> = {
    error:   { bg: '#FEF2F2', border: '#FECACA', color: '#DC2626', icon: XCircle },
    warning: { bg: '#FFFBEB', border: '#FDE68A', color: '#D97706', icon: AlertTriangle },
    info:    { bg: '#EFF6FF', border: '#BFDBFE', color: '#2563EB', icon: CheckCircle },
};

const roleCfg: Record<string, { bg: string; color: string }> = {
    owner:    { bg: '#EDE9FE', color: '#7C3AED' },
    manager:  { bg: '#DBEAFE', color: '#1D4ED8' },
    employee: { bg: '#F3F4F6', color: '#6B7280' },
};

export default function AdminDashboard() {
    return (
        <AppLayout title="Dashboard">
            <Head title="Super Admin Dashboard" />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EDE9FE', borderRadius: 20, padding: '3px 12px', marginBottom: 8 }}>
                        <Shield size={12} color="#7C3AED" />
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.08em' }}>System Overview</span>
                    </div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>Platform Administration</h1>
                    <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>Manage all tenants, users and platform health</p>
                </div>
                <Link href={route('admin.tenants')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: '#fff', borderRadius: 10, padding: '10px 18px', textDecoration: 'none', fontWeight: 600, fontSize: 14, boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}>
                    <Building2 size={16} /> View All Tenants
                </Link>
            </div>

            {/* KPI stats */}
            <div className="tp-stats-grid stagger-children" style={{ marginBottom: 24 }}>
                {kpis.map((k, idx) => (
                    <div key={k.label} className="stat-card" style={{ ...card, padding: '18px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ fontSize: 11, color: '#64748B', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</p>
                                <p style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', margin: '6px 0 0', lineHeight: 1 }}>
                                    <AnimatedNumber value={k.numVal} decimals={0} delay={idx * 80} />
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 7 }}>
                                    <TrendingUp size={11} color="#16A34A" />
                                    <span style={{ fontSize: 11, color: '#16A34A', fontWeight: 500 }}>{k.delta}</span>
                                </div>
                            </div>
                            <div style={{ width: 42, height: 42, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <k.icon size={20} color={k.color} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tenants table */}
            <div style={{ ...card, overflow: 'hidden', marginBottom: 24, animation: 'fadeInUp 0.5s ease 0.3s both' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #F5F3FF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Building2 size={16} color="#7C3AED" />
                        <span style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>Tenants</span>
                        <span style={{ background: '#EDE9FE', color: '#7C3AED', fontSize: 11, fontWeight: 700, borderRadius: 10, padding: '1px 8px' }}>{tenants.length}</span>
                    </div>
                    <Link href={route('admin.tenants')} style={{ fontSize: 12, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none', fontWeight: 500 }}>
                        Manage all <ArrowUpRight size={12} />
                    </Link>
                </div>

                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 80px 90px 90px 110px', gap: 0, padding: '8px 20px', background: '#FAFAF9', borderBottom: '1px solid #F5F3FF' }}>
                    {['Tenant', 'Owner', 'Members', 'Plan', 'Status', 'Joined'].map(h => (
                        <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                    ))}
                </div>

                {tenants.map((t, i) => (
                    <div key={t.name} className="table-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 80px 90px 90px 110px', gap: 0, padding: '13px 20px', borderBottom: i < tenants.length - 1 ? '1px solid #FAF8FF' : 'none', alignItems: 'center', animationDelay: `${0.35 + i * 0.04}s` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{t.name[0]}</span>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{t.name}</span>
                        </div>
                        <span style={{ fontSize: 13, color: '#374151' }}>{t.owner}</span>
                        <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{t.members}</span>
                        <span>
                            <Tag style={{ borderRadius: 10, fontSize: 11, fontWeight: 600, border: 'none', background: planCfg[t.plan]?.bg, color: planCfg[t.plan]?.color, margin: 0 }}>{t.plan}</Tag>
                        </span>
                        <span>
                            <Tag style={{ borderRadius: 10, fontSize: 11, fontWeight: 600, border: 'none', background: statusCfg[t.status]?.bg, color: statusCfg[t.status]?.color, margin: 0 }}>{t.status}</Tag>
                        </span>
                        <span style={{ fontSize: 12, color: '#94A3B8' }}>{t.joined}</span>
                    </div>
                ))}
            </div>

            {/* Bottom 2-col: Alerts + Recent Users */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                {/* System Alerts */}
                <div style={{ ...card, overflow: 'hidden', animation: 'fadeInUp 0.5s ease 0.5s both' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: '1px solid #F5F3FF' }}>
                        <Activity size={15} color="#7C3AED" />
                        <span style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>System Alerts</span>
                        <span style={{ background: '#FEE2E2', color: '#DC2626', fontSize: 11, fontWeight: 700, borderRadius: 10, padding: '1px 7px', marginLeft: 'auto' }}>
                            {systemAlerts.filter(a => a.level === 'error').length} critical
                        </span>
                    </div>
                    <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {systemAlerts.map((a, i) => {
                            const cfg = alertCfg[a.level];
                            const Icon = cfg.icon;
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 8, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                                    <Icon size={14} color={cfg.color} style={{ flexShrink: 0, marginTop: 1 }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontSize: 12, color: '#374151', lineHeight: 1.4 }}>{a.msg}</p>
                                        <p style={{ margin: '3px 0 0', fontSize: 10, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Clock size={9} /> {a.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Users */}
                <div style={{ ...card, overflow: 'hidden', animation: 'fadeInUp 0.5s ease 0.6s both' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #F5F3FF' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Users size={15} color="#7C3AED" />
                            <span style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>Recent Users</span>
                        </div>
                        <Link href={route('admin.users')} style={{ fontSize: 12, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none', fontWeight: 500 }}>
                            All users <ArrowUpRight size={12} />
                        </Link>
                    </div>
                    <div>
                        {recentUsers.map((u, i) => (
                            <div key={i} className="table-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: i < recentUsers.length - 1 ? '1px solid #FAF8FF' : 'none', animationDelay: `${0.65 + i * 0.06}s` }}>
                                <Avatar size={36} style={{ background: u.color, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                                    {u.name.split(' ').map(w => w[0]).join('')}
                                </Avatar>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</p>
                                    <p style={{ margin: '1px 0 0', fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.tenant}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                                    <Tag style={{ borderRadius: 10, fontSize: 10, fontWeight: 600, border: 'none', background: roleCfg[u.role]?.bg, color: roleCfg[u.role]?.color, margin: 0, textTransform: 'capitalize' }}>{u.role}</Tag>
                                    <span style={{ fontSize: 10, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <Clock size={9} /> {u.joined}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
