import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Card, Typography, Button, Tag, Table, Tabs, Modal, Input, Avatar } from 'antd';
import { CalendarOff, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { PageProps } from '@/types';

const { Text } = Typography;
const { TextArea } = Input;

// ── Types ─────────────────────────────────────────────────────────────────────

interface Employee {
    name:  string;
    email: string;
    role:  string;
}

interface Reviewer {
    name: string;
}

interface LeaveRequest {
    id:               number;
    employee:         Employee;
    type:             'casual' | 'sick';
    start_date:       string;
    end_date:         string;
    total_days:       number;
    reason:           string;
    status:           'pending' | 'approved' | 'rejected';
    reviewer?:        Reviewer | null;
    rejection_reason: string | null;
    created_at:       string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const initialPending: LeaveRequest[] = [
    {
        id: 1,
        employee: { name: 'Hamza Awan', email: 'hamza@acmecorp.com', role: 'employee' },
        type: 'casual',
        start_date: '2026-05-20', end_date: '2026-05-22', total_days: 3,
        reason: 'Family vacation', status: 'pending', created_at: '2026-05-10',
        reviewer: null, rejection_reason: null,
    },
    {
        id: 2,
        employee: { name: 'Zara Ahmed', email: 'zara@acmecorp.com', role: 'employee' },
        type: 'sick',
        start_date: '2026-05-15', end_date: '2026-05-16', total_days: 2,
        reason: 'Medical appointment', status: 'pending', created_at: '2026-05-11',
        reviewer: null, rejection_reason: null,
    },
];

const initialHistory: LeaveRequest[] = [
    {
        id: 3,
        employee: { name: 'Marcus Chen', email: 'marcus@acmecorp.com', role: 'employee' },
        type: 'casual',
        start_date: '2026-04-07', end_date: '2026-04-09', total_days: 3,
        reason: 'Travel', status: 'approved',
        reviewer: { name: 'Sara Malik' }, rejection_reason: null, created_at: '2026-04-01',
    },
    {
        id: 4,
        employee: { name: 'Lisa Park', email: 'lisa@acmecorp.com', role: 'employee' },
        type: 'sick',
        start_date: '2026-04-01', end_date: '2026-04-01', total_days: 1,
        reason: 'Flu', status: 'rejected',
        reviewer: { name: 'Ali Raza' }, rejection_reason: 'Insufficient coverage', created_at: '2026-03-30',
    },
];

// ── Color maps ────────────────────────────────────────────────────────────────

const typeColor:   Record<string, string> = { casual: 'blue', sick: 'purple' };
const statusColor: Record<string, string> = { pending: 'gold', approved: 'green', rejected: 'red' };

// ── Reject Modal ──────────────────────────────────────────────────────────────

function RejectModal({ open, onClose, onConfirm }: {
    open: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}) {
    const [reason, setReason] = useState('');
    return (
        <Modal
            open={open} onCancel={onClose} footer={null}
            title={<span style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>Reject Leave Request</span>}
            width={420}
        >
            <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
                    Reason for rejection (optional)
                </label>
                <TextArea rows={3} value={reason} onChange={e => setReason(e.target.value)}
                    placeholder="e.g. Insufficient coverage during that period..." style={{ borderRadius: 8 }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button danger onClick={() => { onConfirm(reason); setReason(''); }}>
                        Confirm Rejection
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ── Leave Card ────────────────────────────────────────────────────────────────

function LeaveCard({ leave, onApprove, onReject }: {
    leave: LeaveRequest;
    onApprove: () => void;
    onReject:  () => void;
}) {
    const emp  = leave.employee;
    const days = leave.total_days;

    return (
        <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE', marginBottom: 12 }} styles={{ body: { padding: '18px 20px' } }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                <Avatar style={{ background: '#1E1B4B', fontWeight: 700, fontSize: 16, flexShrink: 0 }} size={44}>
                    {emp?.name?.charAt(0) ?? '?'}
                </Avatar>
                <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                        <Text strong style={{ fontSize: 15, color: '#1e293b' }}>{emp?.name}</Text>
                        <Tag color={emp?.role === 'manager' ? 'purple' : 'blue'} style={{ borderRadius: 10, fontSize: 11 }}>
                            {emp?.role}
                        </Tag>
                        <Tag color={typeColor[leave.type]} style={{ borderRadius: 10, fontSize: 11 }}>
                            {leave.type === 'casual' ? '🌴 Casual' : '🤒 Sick'}
                        </Tag>
                    </div>
                    <Text style={{ fontSize: 14, color: '#374151', display: 'block', marginBottom: 4 }}>
                        <strong>
                            {new Date(leave.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {' → '}
                            {new Date(leave.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </strong>
                        <Text type="secondary" style={{ marginLeft: 8, fontSize: 13 }}>({days} day{days !== 1 ? 's' : ''})</Text>
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>
                        <strong>Reason:</strong> {leave.reason}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                        Submitted {new Date(leave.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginTop: 4 }}>
                    <Button
                        type="primary" icon={<CheckCircle size={14} />} onClick={onApprove}
                        style={{ background: 'linear-gradient(135deg,#059669,#10B981)', border: 'none', borderRadius: 8 }}
                    >
                        Approve
                    </Button>
                    <Button danger icon={<XCircle size={14} />} onClick={onReject} style={{ borderRadius: 8 }}>
                        Reject
                    </Button>
                </div>
            </div>
        </Card>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function LeaveApprovals() {
    const [pending,      setPending]      = useState<LeaveRequest[]>(initialPending);
    const [history,      setHistory]      = useState<LeaveRequest[]>(initialHistory);
    const [rejectTarget, setRejectTarget] = useState<number | null>(null);

    const handleApprove = (id: number) => {
        const leave = pending.find(l => l.id === id);
        if (!leave) return;
        setPending(prev => prev.filter(l => l.id !== id));
        setHistory(prev => [...prev, { ...leave, status: 'approved', reviewer: { name: 'You' }, rejection_reason: null }]);
    };

    const handleReject = (id: number, reason: string) => {
        const leave = pending.find(l => l.id === id);
        if (!leave) return;
        setPending(prev => prev.filter(l => l.id !== id));
        setHistory(prev => [...prev, { ...leave, status: 'rejected', reviewer: { name: 'You' }, rejection_reason: reason || null }]);
        setRejectTarget(null);
    };

    const historyColumns: ColumnsType<LeaveRequest> = [
        {
            title: 'Employee', key: 'emp',
            render: (_, r) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar style={{ background: '#1E1B4B', fontWeight: 700, flexShrink: 0 }} size={32}>{r.employee?.name?.charAt(0)}</Avatar>
                    <div>
                        <Text strong style={{ fontSize: 13 }}>{r.employee?.name}</Text>
                        <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>{r.employee?.email}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Type', dataIndex: 'type', key: 'type',
            render: (t: string) => <Tag color={typeColor[t]} style={{ borderRadius: 10 }}>{t}</Tag>,
        },
        {
            title: 'Period', key: 'period',
            render: (_, r) => (
                <div>
                    <Text style={{ fontSize: 13 }}>
                        {new Date(r.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' → '}
                        {new Date(r.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>{r.total_days} day(s)</Text>
                </div>
            ),
        },
        {
            title: 'Status', dataIndex: 'status', key: 'status',
            render: (s: string) => <Tag color={statusColor[s]} style={{ borderRadius: 10, textTransform: 'capitalize' }}>{s}</Tag>,
        },
        {
            title: 'Reviewed by', key: 'reviewer',
            render: (_, r) => <Text style={{ fontSize: 13 }}>{r.reviewer?.name ?? '—'}</Text>,
        },
        {
            title: 'Note', dataIndex: 'rejection_reason', key: 'note',
            render: (v: string | null) => v ? <Text type="danger" style={{ fontSize: 12 }}>{v}</Text> : <Text type="secondary">—</Text>,
        },
    ];

    return (
        <AppLayout title="Leave Approvals">
            <Head title="Leave Approvals" />

            <RejectModal
                open={rejectTarget !== null}
                onClose={() => setRejectTarget(null)}
                onConfirm={(reason) => rejectTarget && handleReject(rejectTarget, reason)}
            />

            {/* Hero */}
            <div style={{
                borderRadius: 16, marginBottom: 24, padding: '26px 30px',
                background: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <CalendarOff size={16} color="rgba(255,255,255,0.7)" />
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Leave Management</Text>
                        </div>
                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 700, display: 'block' }}>Leave Approvals</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{pending.length} request{pending.length !== 1 ? 's' : ''} awaiting your review.</Text>
                    </div>
                    <div style={{ display: 'flex', gap: 20, textAlign: 'center' }}>
                        {[
                            { label: 'Pending',  value: pending.length,                                    color: '#FCD34D' },
                            { label: 'Approved', value: history.filter(h => h.status === 'approved').length, color: '#4ade80' },
                            { label: 'Rejected', value: history.filter(h => h.status === 'rejected').length, color: '#f87171' },
                        ].map((s, i, arr) => (
                            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{s.label}</Text>
                                </div>
                                {i < arr.length - 1 && <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.15)' }} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Tabs
                defaultActiveKey="pending"
                items={[
                    {
                        key: 'pending',
                        label: (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Clock size={14} />
                                Pending
                                {pending.length > 0 && (
                                    <span style={{ marginLeft: 4, background: '#EF4444', color: '#fff', borderRadius: 10, fontSize: 11, padding: '1px 6px', fontWeight: 600 }}>
                                        {pending.length}
                                    </span>
                                )}
                            </span>
                        ),
                        children: pending.length === 0 ? (
                            <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE', textAlign: 'center', padding: 48 }}>
                                <CheckCircle size={40} color="#A7F3D0" style={{ marginBottom: 12 }} />
                                <Text type="secondary" style={{ fontSize: 15, display: 'block' }}>All caught up! No pending requests.</Text>
                            </Card>
                        ) : (
                            <div>
                                {pending.map(leave => (
                                    <LeaveCard
                                        key={leave.id}
                                        leave={leave}
                                        onApprove={() => handleApprove(leave.id)}
                                        onReject={() => setRejectTarget(leave.id)}
                                    />
                                ))}
                            </div>
                        ),
                    },
                    {
                        key: 'history',
                        label: (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <CalendarOff size={14} /> History ({history.length})
                            </span>
                        ),
                        children: (
                            <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} styles={{ body: { padding: 0 } }}>
                                <Table
                                    dataSource={history}
                                    columns={historyColumns}
                                    rowKey="id"
                                    pagination={{ pageSize: 15, showSizeChanger: false }}
                                    size="middle"
                                    locale={{ emptyText: 'No reviewed requests yet.' }}
                                />
                            </Card>
                        ),
                    },
                ]}
            />
        </AppLayout>
    );
}
