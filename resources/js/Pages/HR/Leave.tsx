import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import {
    Table, Avatar, Modal, Form, Input, Select, Button,
    Space, Tabs, DatePicker, Typography,
} from 'antd';
import { Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface LeaveRequest {
    id: number;
    employee: string;
    avatarColor: string;
    type: 'Annual' | 'Sick' | 'Unpaid' | 'Maternity';
    from: string;
    to: string;
    days: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

const leaveTypeConfig: Record<string, { bg: string; color: string }> = {
    Annual: { bg: '#EFF6FF', color: '#3B82F6' },
    Sick: { bg: '#FEF3C7', color: '#D97706' },
    Unpaid: { bg: '#F1F5F9', color: '#64748B' },
    Maternity: { bg: '#FDF2F8', color: '#EC4899' },
};

const statusConfig: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
    Pending: { bg: '#FEF3C7', color: '#D97706', icon: <Clock size={12} /> },
    Approved: { bg: '#DCFCE7', color: '#16A34A', icon: <CheckCircle size={12} /> },
    Rejected: { bg: '#FEE2E2', color: '#DC2626', icon: <XCircle size={12} /> },
};

const pending: LeaveRequest[] = [
    { id: 1, employee: 'Tom Wilson', avatarColor: '#EF4444', type: 'Sick', from: 'May 12, 2026', to: 'May 16, 2026', days: 5, reason: 'Medical procedure', status: 'Pending' },
    { id: 2, employee: 'Hamza Ali', avatarColor: '#3B82F6', type: 'Annual', from: 'Jun 1, 2026', to: 'Jun 7, 2026', days: 5, reason: 'Family vacation', status: 'Pending' },
    { id: 3, employee: 'Zara Ahmed', avatarColor: '#F97316', type: 'Annual', from: 'Jun 15, 2026', to: 'Jun 19, 2026', days: 3, reason: 'Personal', status: 'Pending' },
];

const allRequests: LeaveRequest[] = [
    ...pending,
    { id: 4, employee: 'Sara Kim', avatarColor: '#7C3AED', type: 'Annual', from: 'Apr 7, 2026', to: 'Apr 11, 2026', days: 5, reason: 'Spring break', status: 'Approved' },
    { id: 5, employee: 'Lisa Park', avatarColor: '#10B981', type: 'Annual', from: 'Apr 14, 2026', to: 'Apr 17, 2026', days: 4, reason: 'Wedding', status: 'Approved' },
    { id: 6, employee: 'Marcus Chen', avatarColor: '#F59E0B', type: 'Sick', from: 'Apr 21, 2026', to: 'Apr 22, 2026', days: 2, reason: 'Flu', status: 'Approved' },
    { id: 7, employee: 'Sophie Turner', avatarColor: '#06B6D4', type: 'Annual', from: 'Mar 3, 2026', to: 'Mar 7, 2026', days: 5, reason: 'Travel', status: 'Approved' },
    { id: 8, employee: 'Priya Sharma', avatarColor: '#A855F7', type: 'Annual', from: 'Mar 16, 2026', to: 'Mar 20, 2026', days: 5, reason: 'Family visit', status: 'Approved' },
    { id: 9, employee: 'David Miller', avatarColor: '#64748B', type: 'Annual', from: 'Mar 30, 2026', to: 'Apr 2, 2026', days: 4, reason: 'Vacation', status: 'Approved' },
    { id: 10, employee: 'Carlos Ruiz', avatarColor: '#14B8A6', type: 'Unpaid', from: 'Apr 28, 2026', to: 'Apr 28, 2026', days: 1, reason: 'Personal errand', status: 'Rejected' },
    { id: 11, employee: 'Ali Hassan', avatarColor: '#8B5CF6', type: 'Annual', from: 'May 4, 2026', to: 'May 5, 2026', days: 2, reason: 'Long weekend', status: 'Approved' },
    { id: 12, employee: 'Nina Kovač', avatarColor: '#EC4899', type: 'Annual', from: 'Feb 16, 2026', to: 'Feb 20, 2026', days: 5, reason: 'Holiday', status: 'Approved' },
];

const calendarEntries = [
    { date: 'May 12–16', employee: 'Tom Wilson', type: 'Sick', avatarColor: '#EF4444', status: 'Pending' },
    { date: 'Jun 1–7', employee: 'Hamza Ali', type: 'Annual', avatarColor: '#3B82F6', status: 'Pending' },
    { date: 'Jun 15–19', employee: 'Zara Ahmed', type: 'Annual', avatarColor: '#F97316', status: 'Pending' },
    { date: 'Apr 7–11', employee: 'Sara Kim', type: 'Annual', avatarColor: '#7C3AED', status: 'Approved' },
    { date: 'Apr 14–17', employee: 'Lisa Park', type: 'Annual', avatarColor: '#10B981', status: 'Approved' },
    { date: 'May 4–5', employee: 'Ali Hassan', type: 'Annual', avatarColor: '#8B5CF6', status: 'Approved' },
];

const cardStyle: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #EDE9FE',
    borderRadius: 12,
    boxShadow: '0 1px 3px rgba(124,58,237,0.06)',
    padding: '20px 24px',
};

function RequestLeaveModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [form] = Form.useForm();
    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={<span style={{ color: '#1E1B4B', fontWeight: 700 }}>Request Leave</span>}
            footer={null}
            width={520}
        >
            <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                <Form.Item name="employee" label="Employee" rules={[{ required: true }]}>
                    <Select placeholder="Select employee">
                        {['Tom Wilson', 'Hamza Ali', 'Sara Kim', 'Zara Ahmed', 'Marcus Chen', 'Lisa Park'].map(n => (
                            <Select.Option key={n} value={n}>{n}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="type" label="Leave Type" rules={[{ required: true }]}>
                    <Select placeholder="Select type">
                        {['Annual', 'Sick', 'Unpaid', 'Maternity'].map(t => (
                            <Select.Option key={t} value={t}>{t}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="dates" label="Date Range" rules={[{ required: true }]}>
                    <RangePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="reason" label="Reason">
                    <Input.TextArea rows={3} placeholder="Optional: describe reason for leave" />
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        type="primary"
                        onClick={() => { form.resetFields(); onClose(); }}
                        style={{ background: 'linear-gradient(135deg, #7C3AED, #1E1B4B)', border: 'none' }}
                    >
                        Submit Request
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

function EmployeeCell({ name, color }: { name: string; color: string }) {
    return (
        <Space>
            <Avatar style={{ background: color, fontWeight: 700 }} size={34}>
                {name.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <span style={{ fontWeight: 600, color: '#1E1B4B', fontSize: 14 }}>{name}</span>
        </Space>
    );
}

function TypeBadge({ type }: { type: string }) {
    const cfg = leaveTypeConfig[type] ?? { bg: '#F3F4F6', color: '#374151' };
    return (
        <span style={{ background: cfg.bg, color: cfg.color, borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 600 }}>
            {type}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const cfg = statusConfig[status] ?? { bg: '#F3F4F6', color: '#374151', icon: null };
    return (
        <span style={{ background: cfg.bg, color: cfg.color, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {cfg.icon}{status}
        </span>
    );
}

const pendingColumns: ColumnsType<LeaveRequest> = [
    {
        title: 'EMPLOYEE',
        key: 'employee',
        render: (_, r) => <EmployeeCell name={r.employee} color={r.avatarColor} />,
    },
    {
        title: 'TYPE',
        dataIndex: 'type',
        render: (t) => <TypeBadge type={t} />,
    },
    { title: 'FROM', dataIndex: 'from', render: (v) => <Text style={{ fontSize: 13 }}>{v}</Text> },
    { title: 'TO', dataIndex: 'to', render: (v) => <Text style={{ fontSize: 13 }}>{v}</Text> },
    {
        title: 'DAYS',
        dataIndex: 'days',
        align: 'center',
        render: (d) => <span style={{ fontWeight: 700, color: '#1E1B4B' }}>{d}</span>,
    },
    { title: 'REASON', dataIndex: 'reason', render: (v) => <Text style={{ color: '#6B7280', fontSize: 13 }}>{v}</Text> },
    {
        title: 'STATUS',
        dataIndex: 'status',
        render: (s) => <StatusBadge status={s} />,
    },
    {
        title: 'ACTIONS',
        key: 'actions',
        render: () => (
            <Space>
                <Button
                    size="small"
                    icon={<CheckCircle size={13} />}
                    style={{ background: '#DCFCE7', color: '#16A34A', border: '1px solid #BBF7D0', borderRadius: 6, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                    Approve
                </Button>
                <Button
                    size="small"
                    icon={<XCircle size={13} />}
                    style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 6, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                    Reject
                </Button>
            </Space>
        ),
    },
];

const allColumns: ColumnsType<LeaveRequest> = [
    {
        title: 'EMPLOYEE',
        key: 'employee',
        render: (_, r) => <EmployeeCell name={r.employee} color={r.avatarColor} />,
    },
    { title: 'TYPE', dataIndex: 'type', render: (t) => <TypeBadge type={t} /> },
    { title: 'FROM', dataIndex: 'from', render: (v) => <Text style={{ fontSize: 13 }}>{v}</Text> },
    { title: 'TO', dataIndex: 'to', render: (v) => <Text style={{ fontSize: 13 }}>{v}</Text> },
    { title: 'DAYS', dataIndex: 'days', align: 'center', render: (d) => <span style={{ fontWeight: 700, color: '#1E1B4B' }}>{d}</span> },
    { title: 'REASON', dataIndex: 'reason', render: (v) => <Text style={{ color: '#6B7280', fontSize: 13 }}>{v}</Text> },
    { title: 'STATUS', dataIndex: 'status', render: (s) => <StatusBadge status={s} /> },
];

export default function Leave() {
    const [modalOpen, setModalOpen] = useState(false);

    const tabItems = [
        {
            key: 'pending',
            label: (
                <span>
                    Pending Approvals
                    <span style={{ marginLeft: 6, background: '#FEF3C7', color: '#D97706', borderRadius: 20, padding: '1px 8px', fontSize: 11, fontWeight: 700 }}>
                        {pending.length}
                    </span>
                </span>
            ),
            children: (
                <Table
                    dataSource={pending}
                    columns={pendingColumns}
                    rowKey="id"
                    pagination={false}
                    onRow={() => ({
                        onMouseEnter: e => { (e.currentTarget as HTMLElement).style.background = '#FAFAFF'; },
                        onMouseLeave: e => { (e.currentTarget as HTMLElement).style.background = ''; },
                    })}
                />
            ),
        },
        {
            key: 'all',
            label: 'All Requests',
            children: (
                <Table
                    dataSource={allRequests}
                    columns={allColumns}
                    rowKey="id"
                    pagination={{ pageSize: 10, showTotal: (t) => `${t} requests` }}
                    onRow={() => ({
                        onMouseEnter: e => { (e.currentTarget as HTMLElement).style.background = '#FAFAFF'; },
                        onMouseLeave: e => { (e.currentTarget as HTMLElement).style.background = ''; },
                    })}
                />
            ),
        },
        {
            key: 'calendar',
            label: 'Leave Calendar',
            children: (
                <div>
                    <div style={{ marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        {Object.entries(leaveTypeConfig).map(([type, cfg]) => (
                            <span key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' }}>
                                <span style={{ width: 12, height: 12, borderRadius: 3, background: cfg.bg, border: `1px solid ${cfg.color}`, display: 'inline-block' }} />
                                {type}
                            </span>
                        ))}
                    </div>
                    <div style={{ display: 'grid', gap: 10 }}>
                        {calendarEntries.map((entry, i) => {
                            const typeCfg = leaveTypeConfig[entry.type] ?? { bg: '#F3F4F6', color: '#374151' };
                            const stCfg = statusConfig[entry.status] ?? { bg: '#F3F4F6', color: '#374151', icon: null };
                            return (
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 16,
                                        padding: '12px 16px',
                                        background: '#FAFAFF',
                                        border: '1px solid #EDE9FE',
                                        borderRadius: 10,
                                    }}
                                >
                                    <span style={{ width: 110, fontSize: 13, fontWeight: 600, color: '#7C3AED' }}>{entry.date}</span>
                                    <Avatar style={{ background: entry.avatarColor, fontWeight: 700 }} size={30}>
                                        {entry.employee.split(' ').map(n => n[0]).join('')}
                                    </Avatar>
                                    <span style={{ fontWeight: 600, color: '#1E1B4B', fontSize: 14, flex: 1 }}>{entry.employee}</span>
                                    <span style={{ background: typeCfg.bg, color: typeCfg.color, borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>
                                        {entry.type}
                                    </span>
                                    <span style={{ background: stCfg.bg, color: stCfg.color, borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>
                                        {entry.status}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <AppLayout>
            <Head title="Leave Management" />
            <div style={{ padding: '32px 40px', background: '#F5F3FF', minHeight: '100vh' }}>

                {/* Page Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1E1B4B' }}>Leave Management</h1>
                        <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: 14 }}>
                            Manage time-off requests and track leave balances
                        </p>
                    </div>
                    <Button
                        type="primary"
                        icon={<Plus size={16} />}
                        onClick={() => setModalOpen(true)}
                        style={{
                            background: 'linear-gradient(135deg, #7C3AED, #1E1B4B)',
                            border: 'none',
                            borderRadius: 8,
                            fontWeight: 600,
                            height: 38,
                        }}
                    >
                        Request Leave
                    </Button>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                    {[
                        { label: 'Total Pending', value: 3, color: '#D97706', sub: 'Awaiting approval' },
                        { label: 'Approved This Month', value: 8, color: '#16A34A', sub: 'May 2026' },
                        { label: 'Avg Remaining Balance', value: '14 days', color: '#7C3AED', sub: 'Per employee' },
                    ].map(stat => (
                        <div key={stat.label} style={{
                            background: '#fff',
                            border: '1px solid #EDE9FE',
                            borderRadius: 12,
                            boxShadow: '0 1px 3px rgba(124,58,237,0.06)',
                            padding: '20px 24px',
                        }}>
                            <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#1E1B4B', marginTop: 2 }}>{stat.label}</div>
                            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{stat.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{
                    background: '#fff',
                    border: '1px solid #EDE9FE',
                    borderRadius: 12,
                    boxShadow: '0 1px 3px rgba(124,58,237,0.06)',
                    padding: '0 24px 24px',
                }}>
                    <Tabs items={tabItems} />
                </div>
            </div>
            <RequestLeaveModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </AppLayout>
    );
}
