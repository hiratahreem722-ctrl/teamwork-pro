import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Card, Table, Tabs, Tag, Button, Modal, Select, Typography, Badge } from 'antd';
import {
    DollarSign, Users, TrendingUp, Calendar,
    Play, Download, Eye, ChevronRight, X
} from 'lucide-react';
import { useState } from 'react';

const { Text } = Typography;

// ── Mock data ────────────────────────────────────────────────────────────────

const payrollRuns = [
    { id: 1, period: 'Jun 2026', date: 'Scheduled',  employees: 12, gross: 124800, deductions: null,  net: null,  status: 'Scheduled' },
    { id: 2, period: 'May 2026', date: 'May 28, 2026', employees: 12, gross: 124800, deductions: 31200, net: 93600, status: 'Processed' },
    { id: 3, period: 'Apr 2026', date: 'Apr 28, 2026', employees: 12, gross: 123400, deductions: 30850, net: 92550, status: 'Processed' },
    { id: 4, period: 'Mar 2026', date: 'Mar 28, 2026', employees: 11, gross: 115200, deductions: 28800, net: 86400, status: 'Processed' },
];

const employees = [
    { id: 1,  name: 'Marcus Chen',    dept: 'Engineering',   avatar: 'MC', base: 95000, bonus: 8000,  deductions: 25750, net: 77250, method: 'Direct Deposit', lastPaid: 'May 28' },
    { id: 2,  name: 'Hamza Ali',      dept: 'Design',        avatar: 'HA', base: 82000, bonus: 5000,  deductions: 21750, net: 65250, method: 'Direct Deposit', lastPaid: 'May 28' },
    { id: 3,  name: 'Sophie Turner',  dept: 'DevOps',        avatar: 'ST', base: 98000, bonus: 10000, deductions: 27000, net: 81000, method: 'Direct Deposit', lastPaid: 'May 28' },
    { id: 4,  name: 'Tom Wilson',     dept: 'Engineering',   avatar: 'TW', base: 88000, bonus: 6000,  deductions: 23500, net: 70500, method: 'Direct Deposit', lastPaid: 'May 28' },
    { id: 5,  name: 'Priya Sharma',   dept: 'Analytics',     avatar: 'PS', base: 79000, bonus: 4500,  deductions: 20875, net: 62625, method: 'Direct Deposit', lastPaid: 'May 28' },
    { id: 6,  name: 'James Taylor',   dept: 'Engineering',   avatar: 'JT', base: 92000, bonus: 7000,  deductions: 24750, net: 74250, method: 'Direct Deposit', lastPaid: 'May 28' },
    { id: 7,  name: 'Aisha Johnson',  dept: 'Product',       avatar: 'AJ', base: 105000, bonus: 12000, deductions: 29250, net: 87750, method: 'Direct Deposit', lastPaid: 'May 28' },
    { id: 8,  name: 'Liam O\'Brien',  dept: 'Sales',         avatar: 'LO', base: 72000, bonus: 15000, deductions: 21750, net: 65250, method: 'Check',          lastPaid: 'May 28' },
    { id: 9,  name: 'Mei Zhang',      dept: 'Finance',       avatar: 'MZ', base: 86000, bonus: 5500,  deductions: 22875, net: 68625, method: 'Direct Deposit', lastPaid: 'May 28' },
    { id: 10, name: 'Carlos Rivera',  dept: 'Marketing',     avatar: 'CR', base: 76000, bonus: 4000,  deductions: 20000, net: 60000, method: 'Direct Deposit', lastPaid: 'May 28' },
    { id: 11, name: 'Fatima Al-Rashid', dept: 'HR',          avatar: 'FA', base: 81000, bonus: 3500,  deductions: 21125, net: 63375, method: 'Direct Deposit', lastPaid: 'May 28' },
    { id: 12, name: 'Daniel Park',    dept: 'Engineering',   avatar: 'DP', base: 91000, bonus: 6500,  deductions: 24375, net: 73125, method: 'Direct Deposit', lastPaid: 'May 28' },
];

const deptSummary = [
    { dept: 'Engineering', count: 4, total: 366000, pct: 37 },
    { dept: 'Design',      count: 1, total: 87000,  pct: 9  },
    { dept: 'DevOps',      count: 1, total: 108000, pct: 11 },
    { dept: 'Analytics',   count: 1, total: 83500,  pct: 8  },
    { dept: 'Product',     count: 1, total: 117000, pct: 12 },
    { dept: 'Sales',       count: 1, total: 87000,  pct: 9  },
    { dept: 'Finance',     count: 1, total: 91500,  pct: 9  },
    { dept: 'Marketing',   count: 1, total: 80000,  pct: 8  },
    { dept: 'HR',          count: 1, total: 84500,  pct: 8  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number) => `$${n.toLocaleString()}`;

const statusStyle: Record<string, { bg: string; text: string; dot: string }> = {
    Processed: { bg: '#DCFCE7', text: '#16A34A', dot: '#16A34A' },
    Draft:     { bg: '#FEF3C7', text: '#D97706', dot: '#D97706' },
    Scheduled: { bg: '#EFF6FF', text: '#3B82F6', dot: '#3B82F6' },
};

function StatusBadge({ status }: { status: string }) {
    const s = statusStyle[status] ?? statusStyle['Draft'];
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: s.bg, color: s.text,
            borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600,
        }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
            {status}
        </span>
    );
}

function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
            color: '#fff', fontSize: size * 0.35, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
        }}>
            {initials}
        </div>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PayrollRunsTab() {
    const columns = [
        {
            title: 'RUN PERIOD',
            dataIndex: 'period',
            render: (v: string) => <Text strong style={{ color: '#1E1B4B' }}>{v}</Text>,
        },
        {
            title: 'DATE PROCESSED',
            dataIndex: 'date',
            render: (v: string) => <Text style={{ color: '#64748b', fontSize: 13 }}>{v}</Text>,
        },
        {
            title: 'EMPLOYEES',
            dataIndex: 'employees',
            render: (v: number) => (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Users size={14} color="#7C3AED" />
                    <Text style={{ fontSize: 13 }}>{v}</Text>
                </span>
            ),
        },
        {
            title: 'GROSS PAY',
            dataIndex: 'gross',
            render: (v: number, r: typeof payrollRuns[0]) => (
                <Text strong style={{ color: '#1e293b' }}>
                    {fmt(v)}{r.status === 'Scheduled' ? ' (est)' : ''}
                </Text>
            ),
        },
        {
            title: 'DEDUCTIONS',
            dataIndex: 'deductions',
            render: (v: number | null) =>
                v == null
                    ? <Text style={{ color: '#94a3b8' }}>—</Text>
                    : <Text style={{ color: '#ef4444', fontSize: 13 }}>{fmt(v)}</Text>,
        },
        {
            title: 'NET PAY',
            dataIndex: 'net',
            render: (v: number | null) =>
                v == null
                    ? <Text style={{ color: '#94a3b8' }}>—</Text>
                    : <Text strong style={{ color: '#16A34A' }}>{fmt(v)}</Text>,
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            render: (v: string) => <StatusBadge status={v} />,
        },
        {
            title: 'ACTIONS',
            render: (_: unknown, r: typeof payrollRuns[0]) => (
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button size="small" icon={<Eye size={13} />}
                        style={{ borderRadius: 6, fontSize: 12, borderColor: '#EDE9FE', color: '#7C3AED' }}>
                        View
                    </Button>
                    {r.status === 'Processed' && (
                        <Button size="small" icon={<Download size={13} />}
                            style={{ borderRadius: 6, fontSize: 12 }}>
                            Download
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Table
            dataSource={payrollRuns}
            columns={columns}
            rowKey="id"
            pagination={false}
            size="middle"
            style={{ borderRadius: 12, overflow: 'hidden' }}
            rowClassName={() => 'payroll-row'}
        />
    );
}

function EmployeeSalariesTab() {
    const columns = [
        {
            title: 'EMPLOYEE',
            render: (_: unknown, r: typeof employees[0]) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar initials={r.avatar} />
                    <div>
                        <Text strong style={{ fontSize: 13, color: '#1E1B4B', display: 'block' }}>{r.name}</Text>
                        <Text style={{ fontSize: 12, color: '#7C3AED' }}>{r.dept}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'BASE SALARY',
            dataIndex: 'base',
            render: (v: number) => <Text strong style={{ color: '#1e293b' }}>{fmt(v)}</Text>,
        },
        {
            title: 'BONUS',
            dataIndex: 'bonus',
            render: (v: number) => <Text style={{ color: '#16A34A', fontWeight: 600 }}>+{fmt(v)}</Text>,
        },
        {
            title: 'DEDUCTIONS',
            dataIndex: 'deductions',
            render: (v: number) => <Text style={{ color: '#ef4444', fontSize: 13 }}>-{fmt(v)}</Text>,
        },
        {
            title: 'NET PAY',
            dataIndex: 'net',
            render: (v: number) => <Text strong style={{ color: '#7C3AED', fontSize: 14 }}>{fmt(v)}</Text>,
        },
        {
            title: 'PAYMENT METHOD',
            dataIndex: 'method',
            render: (v: string) => (
                <Tag style={{
                    borderRadius: 12, fontSize: 11,
                    background: v === 'Direct Deposit' ? '#EFF6FF' : '#F5F3FF',
                    color: v === 'Direct Deposit' ? '#3B82F6' : '#7C3AED',
                    border: 'none',
                }}>
                    {v}
                </Tag>
            ),
        },
        {
            title: 'LAST PAID',
            dataIndex: 'lastPaid',
            render: (v: string) => <Text style={{ color: '#64748b', fontSize: 13 }}>{v}</Text>,
        },
        {
            title: 'ACTION',
            render: () => (
                <Button size="small"
                    style={{ borderRadius: 6, fontSize: 12, borderColor: '#EDE9FE', color: '#7C3AED' }}>
                    Edit Salary
                </Button>
            ),
        },
    ];

    return (
        <Table
            dataSource={employees}
            columns={columns}
            rowKey="id"
            pagination={false}
            size="middle"
            style={{ borderRadius: 12, overflow: 'hidden' }}
        />
    );
}

function PayrollSummaryTab() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Dept breakdown */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', padding: 24 }}>
                <Text strong style={{ fontSize: 15, color: '#1E1B4B', display: 'block', marginBottom: 20 }}>
                    Payroll by Department
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {deptSummary.map(d => (
                        <div key={d.dept}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Text style={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>{d.dept}</Text>
                                    <Text style={{ fontSize: 11, color: '#94a3b8' }}>{d.count} emp</Text>
                                </div>
                                <Text strong style={{ fontSize: 13, color: '#7C3AED' }}>{fmt(d.total)}</Text>
                            </div>
                            <div style={{ height: 8, borderRadius: 4, background: '#F5F3FF', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', borderRadius: 4,
                                    background: 'linear-gradient(90deg, #7C3AED, #4F46E5)',
                                    width: `${d.pct}%`,
                                }} />
                            </div>
                            <Text style={{ fontSize: 11, color: '#94a3b8' }}>{d.pct}% of payroll</Text>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                    { label: 'Total Annual Payroll',    value: '$1,497,600', sub: 'Projected FY 2026',   color: '#7C3AED', bg: '#F5F3FF' },
                    { label: 'Avg Monthly Cost/Employee', value: '$10,400', sub: 'Per headcount',        color: '#3B82F6', bg: '#EFF6FF' },
                    { label: 'Total Deductions (May)',   value: '$31,200',  sub: '25% of gross',          color: '#D97706', bg: '#FEF3C7' },
                    { label: 'Bonuses Paid (May)',       value: '$87,500',  sub: 'Performance + signing', color: '#16A34A', bg: '#DCFCE7' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: s.bg, borderRadius: 12, padding: '16px 20px',
                        border: `1px solid ${s.bg === '#F5F3FF' ? '#EDE9FE' : s.bg}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <div>
                            <Text style={{ fontSize: 12, color: '#64748b', display: 'block' }}>{s.label}</Text>
                            <Text strong style={{ fontSize: 22, color: s.color }}>{s.value}</Text>
                        </div>
                        <Text style={{ fontSize: 12, color: '#94a3b8' }}>{s.sub}</Text>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PayrollIndex() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<string | undefined>(undefined);
    const [confirmed, setConfirmed] = useState(false);

    const handleRunPayroll = () => {
        setConfirmed(false);
        setSelectedPeriod(undefined);
        setModalOpen(true);
    };

    const handleConfirm = () => {
        setConfirmed(true);
        setTimeout(() => setModalOpen(false), 1200);
    };

    const summaryCards = [
        { label: 'Total Monthly Payroll', value: '$124,800', icon: DollarSign, color: '#7C3AED', bg: '#F5F3FF', border: '#EDE9FE', sub: '+1.1% vs Apr' },
        { label: 'Employees Paid',         value: '12',       icon: Users,       color: '#3B82F6', bg: '#EFF6FF', border: '#DBEAFE', sub: 'Full-time staff' },
        { label: 'Average Salary',         value: '$82,400',  icon: TrendingUp,  color: '#16A34A', bg: '#DCFCE7', border: '#BBF7D0', sub: 'Base + bonus' },
        { label: 'Next Run Date',          value: 'Jun 1',    icon: Calendar,    color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', sub: '26 days away' },
    ];

    return (
        <AppLayout title="Payroll">
            <Head title="Payroll" />

            {/* ── Hero header ── */}
            <div style={{
                position: 'relative', marginBottom: 24, overflow: 'hidden',
                borderRadius: 16, background: '#1E1B4B', padding: '32px 28px',
            }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%', background: '#7C3AED', opacity: 0.25, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -32, left: -32, width: 150, height: 150, borderRadius: '50%', background: '#4F46E5', opacity: 0.15, pointerEvents: 'none' }} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <Text style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A78BFA', display: 'block', marginBottom: 4 }}>
                            Finance
                        </Text>
                        <Text style={{ fontSize: 24, fontWeight: 700, color: '#fff', display: 'block' }}>Payroll</Text>
                        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Manage salaries, runs, and compensation</Text>
                    </div>
                    <Button
                        onClick={handleRunPayroll}
                        icon={<Play size={14} />}
                        style={{
                            background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                            border: 'none', color: '#fff', borderRadius: 8,
                            fontWeight: 600, height: 38, paddingLeft: 18, paddingRight: 18,
                        }}
                    >
                        Run Payroll
                    </Button>
                </div>
            </div>

            {/* ── Summary cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {summaryCards.map(c => {
                    const Icon = c.icon;
                    return (
                        <div key={c.label} style={{
                            background: '#fff', borderRadius: 12,
                            border: `1px solid ${c.border}`, padding: '20px 20px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                <Text style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{c.label}</Text>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={16} color={c.color} />
                                </div>
                            </div>
                            <Text strong style={{ fontSize: 26, color: '#1E1B4B', display: 'block', lineHeight: 1 }}>{c.value}</Text>
                            <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, display: 'block' }}>{c.sub}</Text>
                        </div>
                    );
                })}
            </div>

            {/* ── Tabs ── */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', overflow: 'hidden' }}>
                <Tabs
                    defaultActiveKey="runs"
                    style={{ padding: '0 20px' }}
                    tabBarStyle={{ borderBottomColor: '#EDE9FE', marginBottom: 0 }}
                    items={[
                        {
                            key: 'runs',
                            label: 'Payroll Runs',
                            children: (
                                <div style={{ padding: '20px 0' }}>
                                    <PayrollRunsTab />
                                </div>
                            ),
                        },
                        {
                            key: 'salaries',
                            label: 'Employee Salaries',
                            children: (
                                <div style={{ padding: '20px 0' }}>
                                    <EmployeeSalariesTab />
                                </div>
                            ),
                        },
                        {
                            key: 'summary',
                            label: 'Payroll Summary',
                            children: (
                                <div style={{ padding: '20px 4px' }}>
                                    <PayrollSummaryTab />
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            {/* ── Run Payroll Modal ── */}
            <Modal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                centered
                width={480}
                closeIcon={<X size={16} />}
                styles={{ header: { paddingBottom: 0 } }}
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Play size={16} color="#7C3AED" />
                        </div>
                        <div>
                            <Text strong style={{ fontSize: 16, color: '#1E1B4B', display: 'block' }}>Run Payroll</Text>
                            <Text style={{ fontSize: 12, color: '#94a3b8' }}>Process payroll for selected period</Text>
                        </div>
                    </div>
                }
            >
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <Text style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: 8 }}>
                            Pay Period
                        </Text>
                        <Select
                            placeholder="Select period..."
                            value={selectedPeriod}
                            onChange={setSelectedPeriod}
                            style={{ width: '100%' }}
                            size="large"
                            options={[
                                { value: 'jun2026', label: 'June 2026' },
                                { value: 'jul2026', label: 'July 2026' },
                                { value: 'aug2026', label: 'August 2026' },
                            ]}
                        />
                    </div>

                    {selectedPeriod && !confirmed && (
                        <div style={{ background: '#F5F3FF', borderRadius: 10, border: '1px solid #EDE9FE', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[
                                { label: 'Employees to be paid', value: '12 employees' },
                                { label: 'Estimated gross pay',  value: '$124,800' },
                                { label: 'Estimated deductions', value: '$31,200' },
                                { label: 'Estimated net pay',    value: '$93,600' },
                            ].map(r => (
                                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 13, color: '#64748b' }}>{r.label}</Text>
                                    <Text strong style={{ fontSize: 13, color: '#1E1B4B' }}>{r.value}</Text>
                                </div>
                            ))}
                        </div>
                    )}

                    {confirmed && (
                        <div style={{ background: '#DCFCE7', borderRadius: 10, border: '1px solid #BBF7D0', padding: 16, textAlign: 'center' }}>
                            <Text strong style={{ color: '#16A34A', fontSize: 14 }}>Payroll run initiated successfully!</Text>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
                        <Button onClick={() => setModalOpen(false)} style={{ borderRadius: 8 }}>Cancel</Button>
                        <Button
                            disabled={!selectedPeriod || confirmed}
                            onClick={handleConfirm}
                            style={{
                                background: selectedPeriod && !confirmed ? 'linear-gradient(135deg, #7C3AED, #4F46E5)' : undefined,
                                border: 'none', color: selectedPeriod && !confirmed ? '#fff' : undefined,
                                borderRadius: 8, fontWeight: 600,
                            }}
                        >
                            {confirmed ? 'Processing...' : 'Confirm & Run'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}
