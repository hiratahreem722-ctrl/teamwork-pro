import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Card, Row, Col, Typography, Tag, Table, Tabs, Avatar, Tooltip, Progress } from 'antd';
import { ClipboardList, Clock, TrendingUp, Wallet, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { PageProps } from '@/types';

const { Text } = Typography;

// ── Types ─────────────────────────────────────────────────────────────────────

interface SalaryInfo {
    gross:       number;
    net:         number;
    deduction:   number;
    currency:    string;
    excess_days: number;
}

interface TeamMemberTime {
    id:           number;
    name:         string;
    email:        string;
    today_status: 'clocked_in' | 'clocked_out' | 'absent';
    today_hours:  number;
    month_hours:  number;
    salary:       SalaryInfo | null;
}

interface TimeLog {
    id:          number;
    user:        { id: number; name: string };
    date:        string;
    clock_in:    string;
    clock_out:   string | null;
    total_hours: number | null;
    status:      'completed' | 'active';
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const month = 'May 2026';

const teamData: TeamMemberTime[] = [
    {
        id: 1, name: 'Ali Raza',    email: 'ali@acmecorp.com',
        today_status: 'clocked_in',  today_hours: 5.5, month_hours: 142,
        salary: { gross: 8000, net: 8000, deduction: 0, currency: 'USD', excess_days: 0 },
    },
    {
        id: 2, name: 'Sara Malik',  email: 'sara@acmecorp.com',
        today_status: 'clocked_in',  today_hours: 4.0, month_hours: 136,
        salary: { gross: 7500, net: 7500, deduction: 0, currency: 'USD', excess_days: 0 },
    },
    {
        id: 3, name: 'Hamza Awan',  email: 'hamza@acmecorp.com',
        today_status: 'clocked_out', today_hours: 8.0, month_hours: 160,
        salary: { gross: 5000, net: 4545, deduction: 455, currency: 'USD', excess_days: 1 },
    },
    {
        id: 4, name: 'Zara Ahmed',  email: 'zara@acmecorp.com',
        today_status: 'absent',      today_hours: 0,   month_hours: 120,
        salary: { gross: 4500, net: 4500, deduction: 0, currency: 'USD', excess_days: 0 },
    },
    {
        id: 5, name: 'Marcus Chen', email: 'marcus@acmecorp.com',
        today_status: 'clocked_out', today_hours: 8.0, month_hours: 152,
        salary: { gross: 6000, net: 5591, deduction: 409, currency: 'USD', excess_days: 1 },
    },
];

const recentLogs: TimeLog[] = [
    { id: 1,  user: { id: 1, name: 'Ali Raza'    }, date: '2026-05-11', clock_in: '2026-05-11T09:00:00', clock_out: null,                       total_hours: null, status: 'active'    },
    { id: 2,  user: { id: 2, name: 'Sara Malik'  }, date: '2026-05-11', clock_in: '2026-05-11T08:45:00', clock_out: null,                       total_hours: null, status: 'active'    },
    { id: 3,  user: { id: 3, name: 'Hamza Awan'  }, date: '2026-05-11', clock_in: '2026-05-11T09:00:00', clock_out: '2026-05-11T17:00:00',      total_hours: 8,    status: 'completed' },
    { id: 4,  user: { id: 5, name: 'Marcus Chen' }, date: '2026-05-11', clock_in: '2026-05-11T08:30:00', clock_out: '2026-05-11T17:00:00',      total_hours: 8.5,  status: 'completed' },
    { id: 5,  user: { id: 1, name: 'Ali Raza'    }, date: '2026-05-10', clock_in: '2026-05-10T09:00:00', clock_out: '2026-05-10T17:30:00',      total_hours: 8.5,  status: 'completed' },
    { id: 6,  user: { id: 2, name: 'Sara Malik'  }, date: '2026-05-10', clock_in: '2026-05-10T08:50:00', clock_out: '2026-05-10T17:00:00',      total_hours: 8.2,  status: 'completed' },
    { id: 7,  user: { id: 4, name: 'Zara Ahmed'  }, date: '2026-05-09', clock_in: '2026-05-09T09:15:00', clock_out: '2026-05-09T17:15:00',      total_hours: 8,    status: 'completed' },
    { id: 8,  user: { id: 3, name: 'Hamza Awan'  }, date: '2026-05-09', clock_in: '2026-05-09T09:00:00', clock_out: '2026-05-09T18:00:00',      total_hours: 9,    status: 'completed' },
];

// ── Status meta ───────────────────────────────────────────────────────────────

const statusMeta: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    clocked_in:  { label: 'Clocked In',  color: '#059669', icon: <CheckCircle size={13} color="#059669" /> },
    clocked_out: { label: 'Clocked Out', color: '#7C3AED', icon: <Clock size={13} color="#7C3AED" />       },
    absent:      { label: 'Absent',      color: '#94a3b8', icon: <XCircle size={13} color="#94a3b8" />     },
};

const fmt$ = (n: number, currency = 'USD') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TeamTimesheets() {
    const totalHours      = teamData.reduce((s, e) => s + e.month_hours, 0);
    const clockedInToday  = teamData.filter(e => e.today_status === 'clocked_in').length;
    const totalPayroll    = teamData.reduce((s, e) => s + (e.salary?.net ?? 0), 0);
    const totalDeductions = teamData.reduce((s, e) => s + (e.salary?.deduction ?? 0), 0);

    /* ── Overview Table columns ── */
    const overviewColumns: ColumnsType<TeamMemberTime> = [
        {
            title: 'Employee', key: 'emp',
            render: (_, e) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <Avatar style={{ background: '#1E1B4B', fontWeight: 700 }} size={36}>{e.name.charAt(0)}</Avatar>
                        <span style={{
                            position: 'absolute', bottom: 0, right: 0,
                            width: 10, height: 10, borderRadius: '50%',
                            background: e.today_status === 'clocked_in' ? '#22c55e' : e.today_status === 'clocked_out' ? '#a855f7' : '#cbd5e1',
                            border: '2px solid #fff',
                        }} />
                    </div>
                    <div>
                        <Text strong style={{ fontSize: 13 }}>{e.name}</Text>
                        <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>{e.email}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Today', key: 'today',
            render: (_, e) => {
                const m = statusMeta[e.today_status];
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        {m.icon}
                        <Text style={{ fontSize: 12, color: m.color, fontWeight: 500 }}>{m.label}</Text>
                        {e.today_hours > 0 && <Text type="secondary" style={{ fontSize: 11 }}>({e.today_hours}h)</Text>}
                    </div>
                );
            },
        },
        {
            title: `Hours (${month})`, key: 'hours',
            sorter: (a, b) => a.month_hours - b.month_hours,
            render: (_, e) => (
                <div>
                    <Text strong style={{ fontSize: 14 }}>{e.month_hours}h</Text>
                    <Progress
                        percent={Math.min(100, (e.month_hours / 176) * 100)}
                        showInfo={false} size={['100%', 4]}
                        strokeColor="#7C3AED" trailColor="#E2E8F0"
                        style={{ margin: '4px 0 0', width: 80 }}
                    />
                </div>
            ),
        },
        {
            title: 'Gross Salary', key: 'gross',
            render: (_, e) => e.salary
                ? <Text style={{ fontSize: 13 }}>{fmt$(e.salary.gross, e.salary.currency)}</Text>
                : <Text type="secondary" style={{ fontSize: 12 }}>Not set</Text>,
        },
        {
            title: 'Deduction', key: 'deduction',
            render: (_, e) => e.salary?.deduction ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertTriangle size={12} color="#EF4444" />
                    <Text style={{ fontSize: 13, color: '#ef4444', fontWeight: 600 }}>
                        -{fmt$(e.salary.deduction, e.salary.currency)}
                    </Text>
                    <Tooltip title={`${e.salary.excess_days} excess leave day(s)`}>
                        <Text type="secondary" style={{ fontSize: 11 }}>({e.salary.excess_days}d)</Text>
                    </Tooltip>
                </div>
            ) : <Text type="secondary" style={{ fontSize: 12 }}>—</Text>,
        },
        {
            title: 'Net Salary', key: 'net',
            render: (_, e) => e.salary ? (
                <Text strong style={{ fontSize: 14, color: '#059669' }}>
                    {fmt$(e.salary.net, e.salary.currency)}
                </Text>
            ) : <Text type="secondary" style={{ fontSize: 12 }}>—</Text>,
        },
    ];

    /* ── Recent Logs columns ── */
    const logColumns: ColumnsType<TimeLog> = [
        {
            title: 'Employee', key: 'emp',
            render: (_, l) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar style={{ background: '#1E1B4B', fontWeight: 700 }} size={28}>{l.user.name.charAt(0)}</Avatar>
                    <Text style={{ fontSize: 13 }}>{l.user.name}</Text>
                </div>
            ),
        },
        {
            title: 'Date', dataIndex: 'date', key: 'date',
            render: (d: string) => (
                <Text style={{ fontSize: 13 }}>
                    {new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </Text>
            ),
        },
        {
            title: 'Clock In', dataIndex: 'clock_in', key: 'in',
            render: (v: string) => <Text style={{ fontSize: 13 }}>{new Date(v).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>,
        },
        {
            title: 'Clock Out', dataIndex: 'clock_out', key: 'out',
            render: (v: string | null) => v
                ? <Text style={{ fontSize: 13 }}>{new Date(v).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
                : <Tag color="purple" style={{ borderRadius: 10, fontSize: 11 }}>Active</Tag>,
        },
        {
            title: 'Hours', dataIndex: 'total_hours', key: 'hours',
            render: (v: number | null) => <Text strong style={{ fontSize: 14 }}>{v != null ? `${v}h` : '—'}</Text>,
        },
        {
            title: 'Status', dataIndex: 'status', key: 'status',
            render: (s: string) => (
                <Tag color={s === 'completed' ? 'green' : 'purple'} style={{ borderRadius: 10 }}>
                    {s === 'completed' ? 'Completed' : 'Active'}
                </Tag>
            ),
        },
    ];

    return (
        <AppLayout title="Team Timesheets">
            <Head title="Team Timesheets" />

            {/* Hero */}
            <div style={{
                borderRadius: 16, marginBottom: 24, padding: '26px 30px',
                background: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <ClipboardList size={15} color="rgba(255,255,255,0.7)" />
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{month}</Text>
                        </div>
                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 700, display: 'block' }}>Team Timesheets</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                            {clockedInToday} of {teamData.length} employees clocked in today.
                        </Text>
                    </div>
                    <div style={{ display: 'flex', gap: 24, textAlign: 'center' }}>
                        {[
                            { label: 'Total Hours',   value: `${totalHours.toFixed(0)}h`, color: '#fff'     },
                            { label: 'Total Payroll', value: fmt$(totalPayroll),            color: '#4ade80'  },
                            { label: 'Deductions',    value: fmt$(totalDeductions),         color: totalDeductions > 0 ? '#fca5a5' : 'rgba(255,255,255,0.4)' },
                        ].map((s, i, arr) => (
                            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{s.label}</Text>
                                </div>
                                {i < arr.length - 1 && <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.15)' }} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* KPI row */}
            <Row gutter={[14, 14]} style={{ marginBottom: 24 }}>
                {[
                    { label: 'Team Members',     value: teamData.length,          icon: <Users size={18} color="#7C3AED" />,     bg: '#EDE9FE' },
                    { label: 'Clocked In Today', value: clockedInToday,           icon: <Clock size={18} color="#059669" />,     bg: '#ECFDF5' },
                    { label: `Hours (${month})`, value: `${totalHours.toFixed(0)}h`, icon: <TrendingUp size={18} color="#A855F7" />, bg: '#EDE9FE' },
                    { label: 'Total Payroll',    value: fmt$(totalPayroll),        icon: <Wallet size={18} color="#D97706" />,    bg: '#FFFBEB' },
                ].map(s => (
                    <Col xs={12} lg={6} key={s.label}>
                        <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} styles={{ body: { padding: '14px 16px' } }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
                                <div>
                                    <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>{s.label}</Text>
                                    <Text style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>{s.value}</Text>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Tabs */}
            <Tabs
                defaultActiveKey="overview"
                items={[
                    {
                        key: 'overview',
                        label: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={14} /> Team Overview</span>,
                        children: (
                            <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} styles={{ body: { padding: 0 } }}>
                                <Table
                                    dataSource={teamData}
                                    columns={overviewColumns}
                                    rowKey="id"
                                    pagination={false}
                                    size="middle"
                                    locale={{ emptyText: 'No employees found.' }}
                                />
                            </Card>
                        ),
                    },
                    {
                        key: 'logs',
                        label: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ClipboardList size={14} /> Recent Logs</span>,
                        children: (
                            <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} styles={{ body: { padding: 0 } }}>
                                <Table
                                    dataSource={recentLogs}
                                    columns={logColumns}
                                    rowKey="id"
                                    pagination={{ pageSize: 20, showSizeChanger: false }}
                                    size="middle"
                                    locale={{ emptyText: 'No time logs yet.' }}
                                />
                            </Card>
                        ),
                    },
                ]}
            />
        </AppLayout>
    );
}
