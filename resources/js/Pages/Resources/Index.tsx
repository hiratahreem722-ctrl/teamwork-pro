import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import { Head } from '@inertiajs/react';
import { Typography, Card, Tag, Progress, Avatar, Tooltip, Select, Button, Row, Col } from 'antd';
import {
    Users, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight,
    Calendar, BarChart3, Clock, TrendingUp, Plus,
} from 'lucide-react';
import { useState } from 'react';

const { Text } = Typography;

const GRAD = 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const weeks = ['Apr 7 – Apr 11', 'Apr 14 – Apr 18', 'Apr 21 – Apr 25'];

interface TeamMember {
    id: number;
    name: string;
    title: string;
    avatar: string;
    capacity: number; // hours/week
    skills: string[];
    allocation: Record<string, { project: string; hours: number; color: string }[]>;
}

const members: TeamMember[] = [
    {
        id: 1, name: 'Hamza Ahmed',   title: 'Full Stack Dev',   avatar: 'HA', capacity: 40,
        skills: ['React', 'Node.js', 'Laravel'],
        allocation: {
            Mon: [{ project: 'Website Redesign', hours: 6, color: '#2563EB' }, { project: 'API Integration', hours: 2, color: '#7c3aed' }],
            Tue: [{ project: 'API Integration', hours: 8, color: '#7c3aed' }],
            Wed: [{ project: 'Website Redesign', hours: 8, color: '#2563EB' }],
            Thu: [{ project: 'CRM Dashboard', hours: 6, color: '#059669' }, { project: 'Website Redesign', hours: 2, color: '#2563EB' }],
            Fri: [{ project: 'Website Redesign', hours: 6, color: '#2563EB' }],
        },
    },
    {
        id: 2, name: 'Dev Ahmad',     title: 'UI/UX Designer',   avatar: 'DA', capacity: 40,
        skills: ['Figma', 'Tailwind', 'React'],
        allocation: {
            Mon: [{ project: 'Website Redesign', hours: 8, color: '#2563EB' }],
            Tue: [{ project: 'Mobile App v2', hours: 4, color: '#d97706' }, { project: 'Website Redesign', hours: 4, color: '#2563EB' }],
            Wed: [{ project: 'Mobile App v2', hours: 8, color: '#d97706' }],
            Thu: [{ project: 'Mobile App v2', hours: 4, color: '#d97706' }],
            Fri: [{ project: 'Website Redesign', hours: 4, color: '#2563EB' }],
        },
    },
    {
        id: 3, name: 'Sara Rahman',   title: 'Backend Dev',      avatar: 'SR', capacity: 40,
        skills: ['PHP', 'MySQL', 'API'],
        allocation: {
            Mon: [{ project: 'CRM Dashboard', hours: 8, color: '#059669' }],
            Tue: [{ project: 'CRM Dashboard', hours: 8, color: '#059669' }],
            Wed: [{ project: 'API Integration', hours: 8, color: '#7c3aed' }],
            Thu: [{ project: 'CRM Dashboard', hours: 8, color: '#059669' }],
            Fri: [{ project: 'CRM Dashboard', hours: 8, color: '#059669' }],
        },
    },
    {
        id: 4, name: 'QA Tester',     title: 'QA Engineer',      avatar: 'QA', capacity: 40,
        skills: ['Testing', 'Selenium', 'Jest'],
        allocation: {
            Mon: [{ project: 'Mobile App v2', hours: 4, color: '#d97706' }],
            Tue: [],
            Wed: [{ project: 'Mobile App v2', hours: 4, color: '#d97706' }],
            Thu: [{ project: 'Mobile App v2', hours: 4, color: '#d97706' }],
            Fri: [{ project: 'Mobile App v2', hours: 3, color: '#d97706' }],
        },
    },
    {
        id: 5, name: 'Sarah Manager', title: 'Project Manager',  avatar: 'SM', capacity: 40,
        skills: ['Planning', 'Scrum', 'Reporting'],
        allocation: {
            Mon: [{ project: 'Website Redesign', hours: 2, color: '#2563EB' }, { project: 'Mobile App v2', hours: 2, color: '#d97706' }],
            Tue: [{ project: 'CRM Dashboard', hours: 3, color: '#059669' }],
            Wed: [{ project: 'API Integration', hours: 2, color: '#7c3aed' }],
            Thu: [{ project: 'Internal', hours: 4, color: '#64748b' }],
            Fri: [{ project: 'Internal', hours: 3, color: '#64748b' }],
        },
    },
];

const projectColors: Record<string, string> = {
    'Website Redesign': '#2563EB',
    'Mobile App v2':    '#d97706',
    'CRM Dashboard':    '#059669',
    'API Integration':  '#7c3aed',
    'Internal':         '#64748b',
};

const allProjects = Object.keys(projectColors);

function weekHours(m: TeamMember): number {
    return days.reduce((s, d) => s + (m.allocation[d] ?? []).reduce((a, b) => a + b.hours, 0), 0);
}

function utilizationColor(pct: number) {
    if (pct > 100) return '#dc2626';
    if (pct >= 90) return '#d97706';
    if (pct >= 70) return '#2563EB';
    return '#16a34a';
}

function AllocationBar({ allocs, capacity }: { allocs: { project: string; hours: number; color: string }[]; capacity: number }) {
    const total = allocs.reduce((s, a) => s + a.hours, 0);
    if (allocs.length === 0) {
        return (
            <div style={{ height: 28, borderRadius: 6, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text type="secondary" style={{ fontSize: 11 }}>—</Text>
            </div>
        );
    }
    return (
        <Tooltip title={allocs.map(a => `${a.project}: ${a.hours}h`).join('\n')}>
            <div style={{ height: 28, borderRadius: 6, overflow: 'hidden', display: 'flex', gap: 2, cursor: 'pointer' }}>
                {allocs.map((a, i) => (
                    <div key={i} style={{ flex: a.hours, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 18 }}>
                        <Text style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>{a.hours}h</Text>
                    </div>
                ))}
                {total < capacity / 5 && (
                    <div style={{ flex: capacity / 5 - total, background: '#F1F5F9', borderRadius: '0 6px 6px 0' }} />
                )}
            </div>
        </Tooltip>
    );
}

export default function ResourcesIndex() {
    const [weekIdx, setWeekIdx] = useState(0);
    const [projectFilter, setProjectFilter] = useState<string | undefined>(undefined);

    const totalCapacity  = members.reduce((s, m) => s + m.capacity, 0);
    const totalAllocated = members.reduce((s, m) => s + weekHours(m), 0);
    const overAllocated  = members.filter(m => weekHours(m) > m.capacity).length;
    const underUtilized  = members.filter(m => weekHours(m) < m.capacity * 0.5).length;

    const filtered = projectFilter
        ? members.filter(m => days.some(d => (m.allocation[d] ?? []).some(a => a.project === projectFilter)))
        : members;

    return (
        <AppLayout title="Resource Planning">
            <Head title="Resource Planning" />

            <PageHeader
                title="Resource Planning"
                subtitle="Team capacity and project allocation"
                action={
                    <Button type="primary" icon={<Plus size={16} />}
                        style={{ background: GRAD, border: 'none', borderRadius: 8, fontWeight: 500, color: '#fff' }}>
                        Schedule Time
                    </Button>
                }
            />

            {/* KPI row */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {[
                    { label: 'Team Capacity',    value: `${totalCapacity}h/wk`,  icon: Users,         color: '#EFF6FF', iconColor: '#2563EB' },
                    { label: 'Allocated',         value: `${totalAllocated}h`,     icon: BarChart3,     color: '#F5F3FF', iconColor: '#7c3aed' },
                    { label: 'Utilization',       value: `${Math.round((totalAllocated / totalCapacity) * 100)}%`, icon: TrendingUp, color: '#ECFDF5', iconColor: '#059669' },
                    { label: 'Over-allocated',    value: overAllocated,            icon: AlertTriangle, color: '#FEF2F2', iconColor: '#DC2626' },
                ].map(s => (
                    <Col xs={12} lg={6} key={s.label}>
                        <Card style={{ borderRadius: 12, border: '1px solid #E2E8F0' }} styles={{ body: { padding: '16px 20px' } }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</Text>
                                    <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', lineHeight: 1.2, marginTop: 4 }}>{s.value}</div>
                                </div>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <s.icon size={20} color={s.iconColor} />
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Project legend */}
            <div style={{ marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                <Text type="secondary" style={{ fontSize: 13 }}>Filter by project:</Text>
                <button
                    onClick={() => setProjectFilter(undefined)}
                    style={{ padding: '4px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, background: !projectFilter ? GRAD : '#F1F5F9', color: !projectFilter ? '#fff' : '#64748b' }}>
                    All
                </button>
                {allProjects.map(p => (
                    <button key={p} onClick={() => setProjectFilter(p === projectFilter ? undefined : p)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, background: projectFilter === p ? projectColors[p] : '#F1F5F9', color: projectFilter === p ? '#fff' : '#64748b', transition: 'all 0.15s' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: projectFilter === p ? '#fff' : projectColors[p] }} />
                        {p}
                    </button>
                ))}
            </div>

            {/* Week navigation + allocation grid */}
            <div style={{ borderRadius: 14, border: '1px solid #E2E8F0', background: '#fff', overflow: 'hidden', marginBottom: 24 }}>
                {/* Week header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Calendar size={16} color="#64748b" />
                        <Text strong style={{ color: '#374151' }}>Allocation Grid</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button onClick={() => setWeekIdx(i => Math.max(0, i - 1))} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <ChevronLeft size={15} />
                        </button>
                        <Text strong style={{ fontSize: 14, color: '#374151', width: 150, textAlign: 'center' }}>{weeks[weekIdx]}</Text>
                        <button onClick={() => setWeekIdx(i => Math.min(weeks.length - 1, i + 1))} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>

                {/* Grid header */}
                <div style={{ display: 'grid', gridTemplateColumns: '200px 100px repeat(5, 1fr) 80px', borderBottom: '1px solid #F1F5F9', background: '#FAFAFA' }}>
                    <div style={{ padding: '10px 20px' }}>
                        <Text style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member</Text>
                    </div>
                    <div style={{ padding: '10px 8px', textAlign: 'center' }}>
                        <Text style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</Text>
                    </div>
                    {days.map(d => (
                        <div key={d} style={{ padding: '10px 8px', textAlign: 'center' }}>
                            <Text style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</Text>
                        </div>
                    ))}
                    <div style={{ padding: '10px 8px', textAlign: 'center' }}>
                        <Text style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Load</Text>
                    </div>
                </div>

                {/* Rows */}
                {filtered.map((m, idx) => {
                    const total   = weekHours(m);
                    const pct     = Math.round((total / m.capacity) * 100);
                    const overAt  = total > m.capacity;
                    return (
                        <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '200px 100px repeat(5, 1fr) 80px', borderBottom: idx < filtered.length - 1 ? '1px solid #F8FAFC' : 'none', alignItems: 'center' }}
                            className="hover:bg-slate-50">
                            {/* Member */}
                            <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Avatar style={{ background: GRAD, fontWeight: 700, fontSize: 13, flexShrink: 0 }} size={32}>{m.avatar}</Avatar>
                                <div style={{ minWidth: 0 }}>
                                    <Text strong style={{ fontSize: 13, color: '#1e293b', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</Text>
                                    <Text type="secondary" style={{ fontSize: 11 }}>{m.title}</Text>
                                </div>
                            </div>

                            {/* Total hours */}
                            <div style={{ padding: '12px 8px', textAlign: 'center' }}>
                                <Text strong style={{ fontSize: 14, color: overAt ? '#dc2626' : '#1e293b' }}>{total}h</Text>
                                <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>/ {m.capacity}h</Text>
                            </div>

                            {/* Day allocations */}
                            {days.map(d => (
                                <div key={d} style={{ padding: '8px 6px' }}>
                                    <AllocationBar allocs={m.allocation[d] ?? []} capacity={m.capacity} />
                                </div>
                            ))}

                            {/* Load bar */}
                            <div style={{ padding: '12px 10px' }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: utilizationColor(pct), textAlign: 'center', marginBottom: 4 }}>{pct}%</div>
                                <div style={{ height: 6, borderRadius: 4, background: '#F1F5F9', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', borderRadius: 4, background: utilizationColor(pct), width: `${Math.min(pct, 100)}%` }} />
                                </div>
                                {overAt && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
                                        <AlertTriangle size={10} color="#dc2626" />
                                        <Text style={{ fontSize: 10, color: '#dc2626' }}>Over</Text>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Availability Summary */}
            <Row gutter={[20, 20]}>
                <Col xs={24} lg={14}>
                    <div style={{ borderRadius: 14, border: '1px solid #E2E8F0', background: '#fff', padding: 20 }}>
                        <Text strong style={{ fontSize: 15, color: '#374151', display: 'block', marginBottom: 16 }}>Team Utilization Overview</Text>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {members.map(m => {
                                const total = weekHours(m);
                                const pct   = Math.round((total / m.capacity) * 100);
                                return (
                                    <div key={m.id}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Avatar style={{ background: GRAD, fontWeight: 700, fontSize: 11 }} size={26}>{m.avatar}</Avatar>
                                                <Text style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{m.name}</Text>
                                                <Tag style={{ borderRadius: 10, fontSize: 11 }}>{m.title}</Tag>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Text type="secondary" style={{ fontSize: 12 }}>{total}h / {m.capacity}h</Text>
                                                <Text style={{ fontSize: 13, fontWeight: 700, color: utilizationColor(pct) }}>{pct}%</Text>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 3 }}>
                                            {days.map(d => {
                                                const dayHrs = (m.allocation[d] ?? []).reduce((s, a) => s + a.hours, 0);
                                                const dayPct = Math.min((dayHrs / (m.capacity / 5)) * 100, 100);
                                                const hasWork = dayHrs > 0;
                                                return (
                                                    <Tooltip key={d} title={`${d}: ${dayHrs}h`}>
                                                        <div style={{ flex: 1, height: 8, borderRadius: 4, background: hasWork ? utilizationColor(dayPct * (m.capacity / 5) / 8 * 100) : '#F1F5F9', opacity: dayHrs === 0 ? 0.4 : 1 }} />
                                                    </Tooltip>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Col>

                <Col xs={24} lg={10}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Project allocations */}
                        <div style={{ borderRadius: 14, border: '1px solid #E2E8F0', background: '#fff', padding: 20 }}>
                            <Text strong style={{ fontSize: 15, color: '#374151', display: 'block', marginBottom: 16 }}>Hours by Project</Text>
                            {allProjects.map(p => {
                                const hrs = members.reduce((s, m) => s + days.reduce((ds, d) => ds + (m.allocation[d] ?? []).filter(a => a.project === p).reduce((as, a) => as + a.hours, 0), 0), 0);
                                const maxHrs = 40;
                                if (hrs === 0) return null;
                                return (
                                    <div key={p} style={{ marginBottom: 12 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span style={{ width: 10, height: 10, borderRadius: '50%', background: projectColors[p] }} />
                                                <Text style={{ fontSize: 13, color: '#374151' }}>{p}</Text>
                                            </div>
                                            <Text style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{hrs}h</Text>
                                        </div>
                                        <div style={{ height: 8, borderRadius: 4, background: '#F1F5F9', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', borderRadius: 4, background: projectColors[p], width: `${Math.min((hrs / maxHrs) * 100, 100)}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Skills matrix */}
                        <div style={{ borderRadius: 14, border: '1px solid #E2E8F0', background: '#fff', padding: 20 }}>
                            <Text strong style={{ fontSize: 15, color: '#374151', display: 'block', marginBottom: 12 }}>Skills Available</Text>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {[...new Set(members.flatMap(m => m.skills))].map(skill => (
                                    <span key={skill} style={{ background: '#EFF6FF', color: '#2563EB', borderRadius: 20, padding: '4px 10px', fontSize: 12, fontWeight: 500, border: '1px solid #BFDBFE' }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </AppLayout>
    );
}
