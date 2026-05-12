import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Card, Row, Col, Typography, Button, Tag, Modal, Select, Input, Table, Progress, Alert } from 'antd';
import { CalendarOff, Plus, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { PageProps } from '@/types';

const { Text } = Typography;
const { TextArea } = Input;

// ── Types ─────────────────────────────────────────────────────────────────────

interface LeaveBalance {
    year:              number;
    casual_allowed:    number;
    casual_used:       number;
    casual_remaining:  number;
    sick_allowed:      number;
    sick_used:         number;
    sick_remaining:    number;
    excess_casual:     number;
    excess_sick:       number;
}

interface Reviewer { name: string }

interface LeaveRequest {
    id:               number;
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

const mockBalance: LeaveBalance = {
    year: 2026,
    casual_allowed: 12, casual_used: 4, casual_remaining: 8,
    sick_allowed: 8,    sick_used: 2,   sick_remaining: 6,
    excess_casual: 0, excess_sick: 0,
};

const initialRequests: LeaveRequest[] = [
    {
        id: 1, type: 'casual',
        start_date: '2026-05-20', end_date: '2026-05-22', total_days: 3,
        reason: 'Family trip', status: 'pending',
        reviewer: null, rejection_reason: null, created_at: '2026-05-10',
    },
    {
        id: 2, type: 'sick',
        start_date: '2026-04-10', end_date: '2026-04-11', total_days: 2,
        reason: 'Flu symptoms', status: 'approved',
        reviewer: { name: 'Ali Raza' }, rejection_reason: null, created_at: '2026-04-09',
    },
    {
        id: 3, type: 'casual',
        start_date: '2026-03-05', end_date: '2026-03-05', total_days: 1,
        reason: 'Personal errand', status: 'rejected',
        reviewer: { name: 'Sara Malik' }, rejection_reason: 'Busy project sprint', created_at: '2026-03-01',
    },
];

// ── Color / icon maps ─────────────────────────────────────────────────────────

const statusColor: Record<string, string> = { pending: 'gold', approved: 'green', rejected: 'red' };
const statusIcon:  Record<string, React.ReactNode> = {
    pending:  <Clock size={12} />,
    approved: <CheckCircle size={12} />,
    rejected: <XCircle size={12} />,
};
const typeColor: Record<string, string> = { casual: 'blue', sick: 'purple' };

// ── Request Leave Modal ───────────────────────────────────────────────────────

function RequestLeaveModal({ open, onClose, onSubmit }: {
    open: boolean;
    onClose: () => void;
    onSubmit: (req: Omit<LeaveRequest, 'id' | 'status' | 'reviewer' | 'rejection_reason' | 'created_at'>) => void;
}) {
    const [type,       setType]       = useState<'casual' | 'sick'>('casual');
    const [startDate,  setStartDate]  = useState('');
    const [endDate,    setEndDate]    = useState('');
    const [reason,     setReason]     = useState('');

    const calcDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end   = new Date(endDate);
        return Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    };

    const handleSubmit = () => {
        if (!startDate || !endDate || !reason.trim()) return;
        onSubmit({ type, start_date: startDate, end_date: endDate, total_days: calcDays(), reason });
        setType('casual'); setStartDate(''); setEndDate(''); setReason('');
        onClose();
    };

    return (
        <Modal
            open={open} onCancel={onClose} footer={null}
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CalendarOff size={16} color="#7C3AED" />
                    </div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Request Leave</div>
                        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 400 }}>Your manager will review and respond.</div>
                    </div>
                </div>
            }
            width={480}
        >
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Leave Type *</label>
                    <Select
                        style={{ width: '100%' }} value={type}
                        onChange={v => setType(v)}
                        options={[
                            { label: '🌴 Casual Leave — personal days off', value: 'casual' },
                            { label: '🤒 Sick Leave — medical / health',    value: 'sick'   },
                        ]}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Start Date *</label>
                        <input
                            type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                            min={new Date().toISOString().slice(0, 10)}
                            style={{ width: '100%', borderRadius: 8, border: '1px solid #d9d9d9', padding: '7px 11px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>End Date *</label>
                        <input
                            type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                            min={startDate || new Date().toISOString().slice(0, 10)}
                            style={{ width: '100%', borderRadius: 8, border: '1px solid #d9d9d9', padding: '7px 11px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>

                {startDate && endDate && (
                    <div style={{ fontSize: 13, color: '#7C3AED', fontWeight: 500 }}>
                        Duration: {calcDays()} day{calcDays() !== 1 ? 's' : ''}
                    </div>
                )}

                <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Reason *</label>
                    <TextArea
                        rows={3} placeholder="Briefly describe the reason for your leave..."
                        value={reason} onChange={e => setReason(e.target.value)} style={{ borderRadius: 8 }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        type="primary" onClick={handleSubmit}
                        style={{ background: 'linear-gradient(135deg,#1E1B4B,#7C3AED)', border: 'none', borderRadius: 8 }}
                    >
                        Submit Request
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MyLeaves() {
    const [requests,   setRequests]   = useState<LeaveRequest[]>(initialRequests);
    const [balance,    setBalance]    = useState<LeaveBalance>(mockBalance);
    const [showModal,  setShowModal]  = useState(false);

    const pendingCount  = requests.filter(r => r.status === 'pending').length;
    const approvedCount = requests.filter(r => r.status === 'approved').length;

    const handleSubmit = (req: Omit<LeaveRequest, 'id' | 'status' | 'reviewer' | 'rejection_reason' | 'created_at'>) => {
        const newReq: LeaveRequest = {
            ...req,
            id: Date.now(),
            status: 'pending',
            reviewer: null,
            rejection_reason: null,
            created_at: new Date().toISOString().slice(0, 10),
        };
        setRequests(prev => [newReq, ...prev]);
    };

    const columns: ColumnsType<LeaveRequest> = [
        {
            title: 'Type', dataIndex: 'type', key: 'type',
            render: (t: string) => <Tag color={typeColor[t]} style={{ borderRadius: 10, textTransform: 'capitalize' }}>{t}</Tag>,
        },
        {
            title: 'Dates', key: 'dates',
            render: (_, r) => (
                <div>
                    <Text strong style={{ fontSize: 13 }}>
                        {new Date(r.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' → '}
                        {new Date(r.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>{r.total_days} day{r.total_days !== 1 ? 's' : ''}</Text>
                </div>
            ),
        },
        {
            title: 'Reason', dataIndex: 'reason', key: 'reason',
            render: (r: string) => <Text type="secondary" style={{ fontSize: 13, maxWidth: 200, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r}</Text>,
        },
        {
            title: 'Status', dataIndex: 'status', key: 'status',
            render: (s: string) => (
                <Tag color={statusColor[s]} icon={statusIcon[s]} style={{ borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                </Tag>
            ),
        },
        {
            title: 'Reviewed by', key: 'reviewed',
            render: (_, r) => r.reviewer
                ? <Text style={{ fontSize: 13 }}>{r.reviewer.name}</Text>
                : <Text type="secondary" style={{ fontSize: 13 }}>—</Text>,
        },
        {
            title: 'Note', dataIndex: 'rejection_reason', key: 'note',
            render: (v: string | null) => v ? <Text type="danger" style={{ fontSize: 12 }}>{v}</Text> : null,
        },
    ];

    return (
        <AppLayout title="My Leaves">
            <Head title="My Leaves" />
            <RequestLeaveModal open={showModal} onClose={() => setShowModal(false)} onSubmit={handleSubmit} />

            {/* Hero */}
            <div style={{
                borderRadius: 16, marginBottom: 24, padding: '26px 30px',
                background: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>Employee · {balance.year}</Text>
                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 700, display: 'block' }}>My Leaves</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{pendingCount} pending · {approvedCount} approved this year</Text>
                    </div>
                    <Button
                        type="primary" icon={<Plus size={15} />}
                        onClick={() => setShowModal(true)}
                        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 8, fontWeight: 500 }}
                    >
                        Request Leave
                    </Button>
                </div>
            </div>

            {/* Balance Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {/* Casual */}
                <Col xs={24} md={12}>
                    <Card style={{ borderRadius: 14, border: '1px solid #EDE9FE' }} styles={{ body: { padding: '20px 22px' } }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Tag color="blue" style={{ borderRadius: 10, margin: 0 }}>Casual Leave</Tag>
                                <Text type="secondary" style={{ fontSize: 12 }}>{balance.year}</Text>
                            </div>
                            <Text strong style={{ fontSize: 20, color: balance.casual_remaining > 0 ? '#1e293b' : '#ef4444' }}>
                                {balance.casual_remaining} left
                            </Text>
                        </div>
                        <Progress
                            percent={Math.min(100, (balance.casual_used / balance.casual_allowed) * 100)}
                            showInfo={false}
                            strokeColor={balance.casual_remaining === 0 ? '#ef4444' : '#7C3AED'}
                            trailColor="#E2E8F0"
                            size={['100%', 8]}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>{balance.casual_used} used</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>{balance.casual_allowed} total</Text>
                        </div>
                        {balance.excess_casual > 0 && (
                            <Alert type="error" showIcon icon={<AlertTriangle size={13} />}
                                message={`${balance.excess_casual} excess day(s) — salary deduction will apply`}
                                style={{ marginTop: 10, borderRadius: 8, padding: '6px 10px', fontSize: 12 }} />
                        )}
                    </Card>
                </Col>

                {/* Sick */}
                <Col xs={24} md={12}>
                    <Card style={{ borderRadius: 14, border: '1px solid #EDE9FE' }} styles={{ body: { padding: '20px 22px' } }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Tag color="purple" style={{ borderRadius: 10, margin: 0 }}>Sick Leave</Tag>
                                <Text type="secondary" style={{ fontSize: 12 }}>{balance.year}</Text>
                            </div>
                            <Text strong style={{ fontSize: 20, color: balance.sick_remaining > 0 ? '#1e293b' : '#ef4444' }}>
                                {balance.sick_remaining} left
                            </Text>
                        </div>
                        <Progress
                            percent={Math.min(100, (balance.sick_used / balance.sick_allowed) * 100)}
                            showInfo={false}
                            strokeColor={balance.sick_remaining === 0 ? '#ef4444' : '#A855F7'}
                            trailColor="#E2E8F0"
                            size={['100%', 8]}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>{balance.sick_used} used</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>{balance.sick_allowed} total</Text>
                        </div>
                        {balance.excess_sick > 0 && (
                            <Alert type="error" showIcon icon={<AlertTriangle size={13} />}
                                message={`${balance.excess_sick} excess day(s) — salary deduction will apply`}
                                style={{ marginTop: 10, borderRadius: 8, padding: '6px 10px', fontSize: 12 }} />
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Request History */}
            <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} styles={{ body: { padding: 0 } }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
                    <Text strong style={{ color: '#374151' }}>Leave History ({requests.length})</Text>
                    <Button size="small" type="primary" icon={<Plus size={13} />} onClick={() => setShowModal(true)}
                        style={{ background: 'linear-gradient(135deg,#1E1B4B,#7C3AED)', border: 'none', borderRadius: 6 }}>
                        New Request
                    </Button>
                </div>
                <Table
                    dataSource={requests}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 10, showSizeChanger: false }}
                    size="middle"
                    locale={{ emptyText: "No leave requests yet. Click 'Request Leave' to get started." }}
                />
            </Card>
        </AppLayout>
    );
}
