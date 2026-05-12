import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Button, Avatar } from 'antd';
import {
    Plus, MoreHorizontal, TrendingUp, TrendingDown,
    FolderKanban, Clock, Users, DollarSign, CheckCircle2,
    ArrowUpRight, Zap, UserCheck, UserX, CalendarOff,
    Timer, ClipboardList, AlertCircle, UserCog, BadgeCheck,
    Activity,
} from 'lucide-react';
import AnimatedNumber from '@/Components/AnimatedNumber';
import NewProjectModal from '@/Pages/Projects/NewProjectModal';
import { useState } from 'react';

const stats = [
    { label: 'Active Projects',  numVal: 24,  suffix: '',  delta: '+3',  up: true,  icon: FolderKanban, color: '#7C3AED', bg: '#F5F3FF' },
    { label: 'Tasks Due Today',  numVal: 12,  suffix: '',  delta: '4 overdue', up: false, icon: CheckCircle2, color: '#DC2626', bg: '#FEF2F2' },
    { label: 'Team Utilisation', numVal: 87,  suffix: '%', delta: '+5%', up: true,  icon: Users,        color: '#0369A1', bg: '#EFF6FF' },
    { label: 'Monthly Revenue',  numVal: 94,  suffix: 'k', delta: '+12%',up: true,  icon: DollarSign,   color: '#059669', bg: '#ECFDF5' },
];

const projects = [
    { id: 1, name: 'Website Redesign',     client: 'Massive Dynamic',     owner: { initials: 'SK', color: '#7C3AED' }, completion: 94, tasksLeft: 6,  health: 'Good',    budget: 12000, spent: 8200,  due: 'Jun 15' },
    { id: 2, name: 'Mobile App v2',        client: 'E-commerce Platform',  owner: { initials: 'JR', color: '#3B82F6' }, completion: 82, tasksLeft: 5,  health: 'Good',    budget: 28000, spent: 19600, due: 'Jul 3'  },
    { id: 3, name: 'API Integration',      client: 'Acme Corp',            owner: { initials: 'LP', color: '#10B981' }, completion: 55, tasksLeft: 18, health: 'At Risk', budget: 8500,  spent: 7800,  due: 'May 28' },
    { id: 4, name: 'Brand Identity Kit',   client: 'Delta Finance',        owner: { initials: 'MC', color: '#F59E0B' }, completion: 100, tasksLeft: 0, health: 'Good',    budget: 6200,  spent: 5900,  due: 'Done'  },
    { id: 5, name: 'CRM Implementation',   client: 'Zeta Solutions',       owner: { initials: 'AH', color: '#6366F1' }, completion: 38, tasksLeft: 31, health: 'At Risk', budget: 45000, spent: 22000, due: 'Aug 1' },
    { id: 6, name: 'Security Audit',       client: 'HealthFirst Inc',      owner: { initials: 'NK', color: '#EF4444' }, completion: 12, tasksLeft: 44, health: 'Critical',budget: 15000, spent: 4200,  due: 'May 10' },
];

const healthCfg: Record<string, { bg: string; color: string; border: string }> = {
    'Good':     { bg: '#DCFCE7', color: '#16A34A', border: '#BBF7D0' },
    'At Risk':  { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
    'Critical': { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
};

const activity = [
    { user: 'Sara K.',  action: 'completed a task',        target: 'Finalize homepage mockup', project: 'Website Redesign',   time: '2m ago',  color: '#7C3AED' },
    { user: 'Hamza A.', action: 'uploaded a file',         target: 'app_v2_final.zip',        project: 'Mobile App v2',       time: '18m ago', color: '#3B82F6' },
    { user: 'Dev Team', action: 'commented on',            target: 'Auth review PR',           project: 'API Integration',     time: '1h ago',  color: '#10B981' },
    { user: 'Lisa P.',  action: 'moved task to In Review', target: 'Logo variations',          project: 'Brand Identity Kit',  time: '3h ago',  color: '#F59E0B' },
    { user: 'Ali H.',   action: 'created a milestone',     target: 'Phase 2 kickoff',          project: 'CRM Implementation',  time: '5h ago',  color: '#6366F1' },
];

const COL = { name: 280, owner: 120, completion: 200, health: 110, budget: 140, due: 90, actions: 48 };

// ── Employee snapshot data ───────────────────────────────────────────────────
const empToday = [
    { label: 'Active (Clocked In)', value: 31, icon: UserCheck,  color: '#059669', bg: '#ECFDF5', note: 'Right now' },
    { label: 'On Leave',            value: 4,  icon: CalendarOff, color: '#D97706', bg: '#FFFBEB', note: 'Approved' },
    { label: 'Absent',              value: 3,  icon: UserX,       color: '#DC2626', bg: '#FEF2F2', note: 'No check-in' },
];

const empWeek = [
    { label: 'Hours Logged',         value: 1240, suffix: 'h', icon: Timer,        color: '#7C3AED', bg: '#F5F3FF', note: 'Mon–Sun' },
    { label: 'Timesheets Submitted', value: 28,   suffix: '',  icon: ClipboardList, color: '#0369A1', bg: '#EFF6FF', note: 'of 38 employees' },
    { label: 'Late Arrivals',        value: 6,    suffix: '',  icon: AlertCircle,   color: '#D97706', bg: '#FFFBEB', note: 'vs 4 last week' },
    { label: 'Leave Requests',       value: 5,    suffix: '',  icon: CalendarOff,   color: '#6366F1', bg: '#EEF2FF', note: '3 pending' },
];

const empOverall = [
    { label: 'Total Employees', value: 47,  suffix: '',    icon: Users,    color: '#7C3AED', bg: '#F5F3FF', note: 'All active staff' },
    { label: 'Managers',        value: 8,   suffix: '',    icon: UserCog,  color: '#0369A1', bg: '#EFF6FF', note: 'Across all teams' },
    { label: 'On Probation',    value: 3,   suffix: '',    icon: Activity, color: '#D97706', bg: '#FFFBEB', note: 'First 90 days' },
    { label: 'Avg Tenure',      value: 2.4, suffix: ' yrs',icon: BadgeCheck,color:'#059669', bg: '#ECFDF5', note: 'Company-wide' },
];

export default function ManagerDashboard() {
    const [showNewProject, setShowNewProject] = useState(false);
    return (
        <AppLayout title="Dashboard">
            <Head title="Manager Dashboard" />

            {/* Welcome bar */}
            <div className="dashboard-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>Good morning 👋</h1>
                    <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>Here's what needs your attention today.</p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Button icon={<Zap size={14} />} style={{ borderRadius: 8 }}>Quick actions</Button>
                    <Button type="primary" icon={<Plus size={15} />} style={{ borderRadius: 8, fontWeight: 600 }} onClick={() => setShowNewProject(true)}>New Project</Button>
                </div>
            </div>

            {/* Stat cards */}
            <div className="stagger-children tp-stats-grid" style={{ marginBottom: 28 }}>
                {stats.map((s, idx) => (
                    <div key={s.label} className="stat-card" style={{ background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', padding: '20px 24px', boxShadow: '0 1px 3px rgba(124,58,237,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ fontSize: 12, color: '#64748B', fontWeight: 500, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                                <p style={{ fontSize: 30, fontWeight: 700, color: '#0F172A', margin: '6px 0 0', lineHeight: 1 }}>
                                    {s.label === 'Monthly Revenue' && '$'}
                                    <AnimatedNumber value={s.numVal} suffix={s.suffix} delay={idx * 100} duration={1600} />
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                                    {s.up ? <TrendingUp size={12} color="#16A34A" /> : <TrendingDown size={12} color="#DC2626" />}
                                    <span style={{ fontSize: 12, color: s.up ? '#16A34A' : '#DC2626', fontWeight: 500 }}>{s.delta}</span>
                                </div>
                            </div>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <s.icon size={20} color={s.color} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Employee Overview ─────────────────────────────────────────── */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', boxShadow: '0 1px 3px rgba(124,58,237,0.06)', overflow: 'hidden', marginBottom: 28, animation: 'fadeInUp 0.5s ease 0.3s both' }}>

                {/* Section header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #F5F3FF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Users size={16} color="#7C3AED" />
                        <span style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>Employee Overview</span>
                    </div>
                    <Link href={route('hr.employees')} style={{ fontSize: 12, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none', fontWeight: 500 }}>
                        HR Module <ArrowUpRight size={12} />
                    </Link>
                </div>

                {/* Three timeframe columns */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>

                    {/* ── TODAY ── */}
                    <div style={{ padding: '16px 20px', borderRight: '1px solid #F5F3FF' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#DCFCE7', borderRadius: 20, padding: '3px 10px', marginBottom: 14 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Today</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {empToday.map((item, idx) => (
                                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, background: '#FAFAF9', border: '1px solid #F5F3FF', animation: 'fadeInUp 0.4s ease both', animationDelay: `${0.35 + idx * 0.06}s` }}>
                                    <div style={{ width: 34, height: 34, borderRadius: 9, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <item.icon size={16} color={item.color} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ margin: 0, fontSize: 11, color: '#64748B', fontWeight: 500 }}>{item.label}</p>
                                        <p style={{ margin: '1px 0 0', fontSize: 9, color: '#94A3B8' }}>{item.note}</p>
                                    </div>
                                    <span style={{ fontSize: 22, fontWeight: 700, color: item.color, lineHeight: 1, flexShrink: 0 }}>
                                        <AnimatedNumber value={item.value} decimals={0} delay={idx * 80} />
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── THIS WEEK ── */}
                    <div style={{ padding: '16px 20px', borderRight: '1px solid #F5F3FF' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#EDE9FE', borderRadius: 20, padding: '3px 10px', marginBottom: 14 }}>
                            <Clock size={9} color="#7C3AED" />
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.08em' }}>This Week</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {empWeek.map((item, idx) => (
                                <div key={item.label} style={{ padding: '10px 12px', borderRadius: 9, background: '#FAFAF9', border: '1px solid #F5F3FF', animation: 'fadeInUp 0.4s ease both', animationDelay: `${0.35 + idx * 0.06}s` }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 7, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 7 }}>
                                        <item.icon size={13} color={item.color} />
                                    </div>
                                    <p style={{ margin: 0, fontSize: 19, fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>
                                        <AnimatedNumber value={item.value} suffix={item.suffix} decimals={0} delay={200 + idx * 80} />
                                    </p>
                                    <p style={{ margin: '3px 0 0', fontSize: 10, color: '#64748B', fontWeight: 500, lineHeight: 1.3 }}>{item.label}</p>
                                    <p style={{ margin: '2px 0 0', fontSize: 9, color: '#94A3B8' }}>{item.note}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── OVERALL ── */}
                    <div style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#F1F5F9', borderRadius: 20, padding: '3px 10px', marginBottom: 14 }}>
                            <BadgeCheck size={9} color="#64748B" />
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Overall</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {empOverall.map((item, idx) => (
                                <div key={item.label} style={{ padding: '10px 12px', borderRadius: 9, background: '#FAFAF9', border: '1px solid #F5F3FF', animation: 'fadeInUp 0.4s ease both', animationDelay: `${0.35 + idx * 0.06}s` }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 7, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 7 }}>
                                        <item.icon size={13} color={item.color} />
                                    </div>
                                    <p style={{ margin: 0, fontSize: 19, fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>
                                        <AnimatedNumber value={item.value} suffix={item.suffix} decimals={item.value % 1 !== 0 ? 1 : 0} delay={400 + idx * 80} />
                                    </p>
                                    <p style={{ margin: '3px 0 0', fontSize: 10, color: '#64748B', fontWeight: 500, lineHeight: 1.3 }}>{item.label}</p>
                                    <p style={{ margin: '2px 0 0', fontSize: 9, color: '#94A3B8' }}>{item.note}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Main content */}
            <div className="tp-main-grid">

                {/* Projects table */}
                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', overflow: 'hidden', boxShadow: '0 1px 3px rgba(124,58,237,0.06)', animation: 'fadeInUp 0.5s ease 0.35s both' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F5F3FF' }}>
                        <span style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>Projects</span>
                        <Link href={route('projects.index')} style={{ fontSize: 13, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', fontWeight: 500 }}>
                            View all <ArrowUpRight size={13} />
                        </Link>
                    </div>

                    {/* Column headers — scrollable on mobile */}
                    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <div style={{ minWidth: 700, display: 'flex', alignItems: 'center', padding: '0 20px', height: 40, background: '#FAFAFA', borderBottom: '1px solid #F1F5F9' }}>
                        {[
                            { label: 'NAME',       w: COL.name },
                            { label: 'OWNER',      w: COL.owner },
                            { label: 'COMPLETION', w: COL.completion },
                            { label: 'HEALTH',     w: COL.health },
                            { label: 'BUDGET',     w: COL.budget, right: true },
                            { label: 'DUE',        w: COL.due, right: true },
                        ].map(col => (
                            <div key={col.label} style={{ width: col.w, fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: col.right ? 'right' : 'left' }}>
                                {col.label}
                            </div>
                        ))}
                        <div style={{ width: COL.actions }} />
                    </div>

                    {/* Rows */}
                    <div className="stagger-rows">
                        {projects.map((p, i) => (
                            <div key={p.id} className="table-row"
                                style={{ minWidth: 700, display: 'flex', alignItems: 'center', padding: '0 20px', height: 58, borderBottom: i < projects.length - 1 ? '1px solid #FAF8FF' : 'none', animationDelay: `${0.4 + i * 0.06}s` }}
                            >
                                {/* Name */}
                                <div style={{ width: COL.name }}>
                                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{p.name}</p>
                                    <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>{p.client}</p>
                                </div>

                                {/* Owner */}
                                <div style={{ width: COL.owner }}>
                                    <Avatar size={28} style={{ background: p.owner.color, fontSize: 11, fontWeight: 700 }}>{p.owner.initials}</Avatar>
                                </div>

                                {/* Completion */}
                                <div style={{ width: COL.completion, paddingRight: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{p.completion}%</span>
                                        {p.tasksLeft > 0 && <span style={{ fontSize: 11, color: '#94A3B8' }}>{p.tasksLeft} left</span>}
                                    </div>
                                    <div style={{ height: 5, borderRadius: 3, background: '#F1F5F9' }}>
                                        <div className="progress-fill" style={{ height: '100%', borderRadius: 3, '--progress-width': `${p.completion}%`, background: p.completion === 100 ? '#10B981' : p.completion >= 70 ? '#7C3AED' : '#F59E0B' } as any} />
                                    </div>
                                </div>

                                {/* Health */}
                                <div style={{ width: COL.health }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: healthCfg[p.health].bg, color: healthCfg[p.health].color, border: `1px solid ${healthCfg[p.health].border}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>
                                        {p.health}
                                    </span>
                                </div>

                                {/* Budget */}
                                <div style={{ width: COL.budget, textAlign: 'right' }}>
                                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#374151' }}>${p.budget.toLocaleString()}</p>
                                    <p style={{ margin: 0, fontSize: 11, color: p.spent / p.budget > 0.9 ? '#DC2626' : '#94A3B8' }}>
                                        ${p.spent.toLocaleString()} spent
                                    </p>
                                </div>

                                {/* Due */}
                                <div style={{ width: COL.due, textAlign: 'right' }}>
                                    <span style={{ fontSize: 12, fontWeight: 500, color: p.due === 'Done' ? '#16A34A' : '#64748B' }}>{p.due}</span>
                                </div>

                                {/* Actions */}
                                <div style={{ width: COL.actions, display: 'flex', justifyContent: 'center' }}>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1', padding: 4, borderRadius: 6, display: 'flex' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = '#64748B')}
                                        onMouseLeave={e => (e.currentTarget.style.color = '#CBD5E1')}>
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    </div>{/* end scroll wrapper */}
                </div>

                {/* Right column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Activity feed */}
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', overflow: 'hidden', boxShadow: '0 1px 3px rgba(124,58,237,0.06)', animation: 'fadeInUp 0.5s ease 0.45s both' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F5F3FF' }}>
                            <span style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>Recent Activity</span>
                        </div>
                        <div style={{ padding: '8px 0' }}>
                            {activity.map((a, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 20px', animation: 'fadeInUp 0.4s ease both', animationDelay: `${0.55 + i * 0.07}s` }}>
                                    <Avatar size={28} style={{ background: a.color, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                                        {a.user.split(' ').map(w => w[0]).join('')}
                                    </Avatar>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.4 }}>
                                            <strong style={{ color: '#0F172A' }}>{a.user}</strong> {a.action}{' '}
                                            <span style={{ color: '#7C3AED', fontWeight: 500 }}>{a.target}</span>
                                        </p>
                                        <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94A3B8' }}>{a.project} · {a.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Team Workload */}
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', padding: '16px 20px', boxShadow: '0 1px 3px rgba(124,58,237,0.06)', animation: 'fadeInUp 0.5s ease 0.55s both' }}>
                        <p style={{ fontWeight: 600, fontSize: 15, color: '#0F172A', margin: '0 0 14px' }}>Team Workload</p>
                        {[
                            { name: 'Sara K.',   tasks: 8,  cap: 10, color: '#7C3AED' },
                            { name: 'Hamza A.',  tasks: 6,  cap: 10, color: '#3B82F6' },
                            { name: 'Lisa P.',   tasks: 9,  cap: 10, color: '#10B981' },
                            { name: 'Marcus C.', tasks: 4,  cap: 10, color: '#F59E0B' },
                        ].map(m => (
                            <div key={m.name} style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{m.name}</span>
                                    <span style={{ fontSize: 12, color: '#94A3B8' }}>{m.tasks}/{m.cap} tasks</span>
                                </div>
                                <div style={{ height: 5, borderRadius: 3, background: '#F1F5F9' }}>
                                    <div className="progress-fill" style={{ height: '100%', borderRadius: 3, '--progress-width': `${(m.tasks/m.cap)*100}%`, background: m.color } as any} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <NewProjectModal open={showNewProject} onClose={() => setShowNewProject(false)} />
        </AppLayout>
    );
}
