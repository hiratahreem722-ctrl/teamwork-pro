import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import {
    Table, Modal, Form, Input, Select, Button, DatePicker,
    Typography, Space, Upload,
} from 'antd';
import {
    Plus, Search, Plane, Monitor, Building2, UtensilsCrossed,
    Megaphone, Wrench, CheckCircle, Paperclip, Check, X,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────

type ExpenseStatus = 'Pending' | 'Approved' | 'Rejected' | 'Reimbursed';
type ExpenseCategory = 'Travel' | 'Software' | 'Office' | 'Food & Entertainment' | 'Marketing' | 'Equipment';

interface Expense {
    id: number;
    title: string;
    employee: string;
    date: string;
    category: ExpenseCategory;
    amount: number;
    hasReceipt: boolean;
    status: ExpenseStatus;
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const expenses: Expense[] = [
    { id: 1,  title: 'AWS Server Costs',           employee: 'Sophie Turner', date: 'May 15, 2026', category: 'Software',           amount: 1840, hasReceipt: true,  status: 'Approved' },
    { id: 2,  title: 'Client Dinner — Delta Finance', employee: 'Ali Hassan', date: 'May 14, 2026', category: 'Food & Entertainment', amount: 320,  hasReceipt: true,  status: 'Pending' },
    { id: 3,  title: 'Flight — NYC Conference',    employee: 'Sara Kim',      date: 'May 12, 2026', category: 'Travel',             amount: 890,  hasReceipt: true,  status: 'Approved' },
    { id: 4,  title: 'MacBook Pro M4',             employee: 'Marcus Chen',   date: 'May 10, 2026', category: 'Equipment',          amount: 2400, hasReceipt: true,  status: 'Pending' },
    { id: 5,  title: 'Figma Annual Plan',          employee: 'Hamza Ali',     date: 'May 8, 2026',  category: 'Software',           amount: 144,  hasReceipt: true,  status: 'Approved' },
    { id: 6,  title: 'Office Supplies Q2',         employee: 'Nina Kovač',    date: 'May 6, 2026',  category: 'Office',             amount: 380,  hasReceipt: true,  status: 'Reimbursed' },
    { id: 7,  title: 'Hotel — NYC Conference',     employee: 'Sara Kim',      date: 'May 12, 2026', category: 'Travel',             amount: 1260, hasReceipt: true,  status: 'Approved' },
    { id: 8,  title: 'LinkedIn Ads Campaign',      employee: 'Zara Ahmed',    date: 'May 5, 2026',  category: 'Marketing',          amount: 750,  hasReceipt: false, status: 'Pending' },
    { id: 9,  title: 'Slack Subscription',         employee: 'David Miller',  date: 'May 4, 2026',  category: 'Software',           amount: 220,  hasReceipt: true,  status: 'Reimbursed' },
    { id: 10, title: 'Standing Desk',              employee: 'Priya Sharma',  date: 'May 3, 2026',  category: 'Equipment',          amount: 680,  hasReceipt: true,  status: 'Approved' },
    { id: 11, title: 'Team Lunch — Sprint Review', employee: 'Lisa Park',     date: 'May 2, 2026',  category: 'Food & Entertainment', amount: 195, hasReceipt: true, status: 'Reimbursed' },
    { id: 12, title: 'Uber — Client Visit',        employee: 'Ali Hassan',    date: 'May 1, 2026',  category: 'Travel',             amount: 48,   hasReceipt: true,  status: 'Reimbursed' },
    { id: 13, title: 'Google Ads',                 employee: 'Zara Ahmed',    date: 'Apr 30, 2026', category: 'Marketing',          amount: 1200, hasReceipt: true,  status: 'Approved' },
    { id: 14, title: 'Conference Tickets x2',      employee: 'Sara Kim',      date: 'Apr 29, 2026', category: 'Travel',             amount: 598,  hasReceipt: true,  status: 'Approved' },
    { id: 15, title: 'Keyboard + Mouse Set',       employee: 'Tom Wilson',    date: 'Apr 28, 2026', category: 'Equipment',          amount: 215,  hasReceipt: false, status: 'Rejected' },
];

// ─── Category config ───────────────────────────────────────────────────────────

const categoryConfig: Record<ExpenseCategory, { icon: React.ReactNode; color: string; bg: string }> = {
    Travel:              { icon: <Plane size={13} />,             color: '#3B82F6', bg: '#EFF6FF' },
    Software:            { icon: <Monitor size={13} />,           color: '#7C3AED', bg: '#F5F3FF' },
    Office:              { icon: <Building2 size={13} />,         color: '#64748B', bg: '#F1F5F9' },
    'Food & Entertainment': { icon: <UtensilsCrossed size={13} />, color: '#D97706', bg: '#FEF3C7' },
    Marketing:           { icon: <Megaphone size={13} />,         color: '#DB2777', bg: '#FDF2F8' },
    Equipment:           { icon: <Wrench size={13} />,            color: '#16A34A', bg: '#DCFCE7' },
};

// ─── Status config ─────────────────────────────────────────────────────────────

const statusConfig: Record<ExpenseStatus, { bg: string; color: string }> = {
    Pending:    { bg: '#FEF3C7', color: '#D97706' },
    Approved:   { bg: '#DCFCE7', color: '#16A34A' },
    Rejected:   { bg: '#FEE2E2', color: '#DC2626' },
    Reimbursed: { bg: '#F5F3FF', color: '#7C3AED' },
};

// ─── Shared styles ─────────────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #EDE9FE',
    borderRadius: 12,
    boxShadow: '0 1px 3px rgba(124,58,237,0.06)',
    padding: '20px 24px',
};

const primaryBtn: React.CSSProperties = {
    background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
    border: 'none',
    color: '#fff',
    fontWeight: 600,
    borderRadius: 8,
    height: 38,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    padding: '0 16px',
};

function fmt(n: number) { return '$' + n.toLocaleString(); }

// ─── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ExpenseStatus }) {
    const { bg, color } = statusConfig[status];
    return (
        <span style={{ background: bg, color, fontWeight: 600, fontSize: 12, padding: '3px 10px', borderRadius: 20, display: 'inline-block' }}>
            {status}
        </span>
    );
}

// ─── Summary Card ──────────────────────────────────────────────────────────────

function SummaryCard({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
    return (
        <div style={{ ...cardStyle, flex: 1 }}>
            <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500, marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
            {sub && <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>{sub}</div>}
        </div>
    );
}

// ─── Log Expense Modal ─────────────────────────────────────────────────────────

function LogExpenseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [form] = Form.useForm();

    const handleSubmit = () => {
        form.validateFields().then(() => { form.resetFields(); onClose(); });
    };

    const categories = Object.keys(categoryConfig) as ExpenseCategory[];

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={<span style={{ color: '#1E1B4B', fontWeight: 700, fontSize: 16 }}>Log Expense</span>}
            footer={null}
            width={560}
        >
            <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                <Form.Item name="title" label="Expense Title" rules={[{ required: true, message: 'Required' }]}>
                    <Input placeholder="e.g. Client dinner, AWS costs..." />
                </Form.Item>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                    <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Required' }]}>
                        <Select
                            placeholder="Select category"
                            options={categories.map(c => ({
                                label: (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ color: categoryConfig[c].color }}>{categoryConfig[c].icon}</span>
                                        {c}
                                    </span>
                                ),
                                value: c,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Required' }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </div>
                <Form.Item name="amount" label="Amount (USD)" rules={[{ required: true, message: 'Required' }]}>
                    <Input prefix="$" type="number" placeholder="0.00" />
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={3} placeholder="Additional details..." />
                </Form.Item>

                {/* Receipt upload — UI only */}
                <Form.Item label="Receipt">
                    <div style={{
                        border: '2px dashed #EDE9FE', borderRadius: 8, padding: '20px',
                        textAlign: 'center', cursor: 'pointer', background: '#FAFAFF',
                        color: '#7C3AED',
                    }}>
                        <Paperclip size={20} style={{ marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Attach Receipt</div>
                        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>PNG, JPG or PDF up to 10MB</div>
                    </div>
                </Form.Item>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <button style={primaryBtn} onClick={handleSubmit}>Submit Expense</button>
                </div>
            </Form>
        </Modal>
    );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function Expenses() {
    const [activeTab, setActiveTab] = useState('All');
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const tabs = ['All', 'Pending', 'Approved', 'Rejected', 'Reimbursed'];

    const filtered = useMemo(() =>
        expenses.filter(exp => {
            const matchTab = activeTab === 'All' || exp.status === activeTab;
            const matchSearch = exp.title.toLowerCase().includes(search.toLowerCase()) ||
                exp.employee.toLowerCase().includes(search.toLowerCase());
            return matchTab && matchSearch;
        }), [activeTab, search]);

    const columns: ColumnsType<Expense> = [
        {
            title: <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em' }}>EXPENSE</span>,
            key: 'expense',
            render: (_: unknown, r: Expense) => {
                const cfg = categoryConfig[r.category];
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {cfg.icon}
                        </div>
                        <span style={{ fontWeight: 600, color: '#1E1B4B', fontSize: 13 }}>{r.title}</span>
                    </div>
                );
            },
        },
        {
            title: <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em' }}>EMPLOYEE</span>,
            dataIndex: 'employee',
            render: (e: string) => <span style={{ color: '#475569', fontSize: 13 }}>{e}</span>,
        },
        {
            title: <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em' }}>DATE</span>,
            dataIndex: 'date',
            render: (d: string) => <span style={{ color: '#64748B', fontSize: 13 }}>{d}</span>,
        },
        {
            title: <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em' }}>CATEGORY</span>,
            dataIndex: 'category',
            render: (c: ExpenseCategory) => {
                const cfg = categoryConfig[c];
                return (
                    <span style={{ background: cfg.bg, color: cfg.color, fontWeight: 600, fontSize: 12, padding: '3px 10px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        {cfg.icon}{c}
                    </span>
                );
            },
        },
        {
            title: <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em' }}>AMOUNT</span>,
            dataIndex: 'amount',
            align: 'right',
            render: (a: number) => <span style={{ fontWeight: 700, color: '#1E1B4B' }}>{fmt(a)}</span>,
        },
        {
            title: <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em' }}>RECEIPT</span>,
            dataIndex: 'hasReceipt',
            align: 'center',
            render: (has: boolean) => has
                ? <CheckCircle size={16} style={{ color: '#16A34A' }} />
                : <span style={{ color: '#CBD5E1', fontSize: 12 }}>—</span>,
        },
        {
            title: <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em' }}>STATUS</span>,
            dataIndex: 'status',
            render: (s: ExpenseStatus) => <StatusBadge status={s} />,
        },
        {
            title: <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em' }}>ACTIONS</span>,
            key: 'actions',
            align: 'center',
            render: (_: unknown, r: Expense) => (
                <Space size={4}>
                    {r.status === 'Pending' && (
                        <>
                            <button title="Approve" style={{ background: '#DCFCE7', border: 'none', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#16A34A' }}>
                                <Check size={14} />
                            </button>
                            <button title="Reject" style={{ background: '#FEE2E2', border: 'none', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#DC2626' }}>
                                <X size={14} />
                            </button>
                        </>
                    )}
                    {r.status !== 'Pending' && (
                        <span style={{ color: '#CBD5E1', fontSize: 12 }}>—</span>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <AppLayout title="Expenses">
            <Head title="Expenses" />

            <div style={{ padding: '28px 32px', background: '#F5F3FF', minHeight: '100vh' }}>

                {/* Page header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#1E1B4B' }}>Expenses</h1>
                        <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: 14 }}>Expense tracking and approval workflow</p>
                    </div>
                    <button style={primaryBtn} onClick={() => setModalOpen(true)}>
                        <Plus size={16} />
                        Log Expense
                    </button>
                </div>

                {/* Summary cards */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                    <SummaryCard label="Total This Month"    value="$18,420" color="#1E1B4B" sub="May 2026" />
                    <SummaryCard label="Approved"           value="$14,200" color="#16A34A" />
                    <SummaryCard label="Pending Approval"   value="$3,100"  color="#D97706" />
                    <SummaryCard label="Reimbursed"         value="$12,800" color="#7C3AED" />
                </div>

                {/* Table card */}
                <div style={{ ...cardStyle, padding: 0 }}>

                    {/* Tabs + search */}
                    <div style={{ padding: '0 24px', borderBottom: '1px solid #EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: 0 }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        padding: '14px 16px', fontSize: 14, fontWeight: 600,
                                        color: activeTab === tab ? '#7C3AED' : '#64748B',
                                        borderBottom: activeTab === tab ? '2px solid #7C3AED' : '2px solid transparent',
                                        marginBottom: -1,
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div style={{ padding: '12px 0', position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search expenses..."
                                style={{ paddingLeft: 32, paddingRight: 12, height: 36, border: '1px solid #EDE9FE', borderRadius: 8, fontSize: 13, color: '#1E1B4B', outline: 'none', width: 220 }}
                            />
                        </div>
                    </div>

                    <Table
                        dataSource={filtered}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: 10, size: 'small', showSizeChanger: false }}
                        style={{ fontSize: 14 }}
                        onRow={() => ({
                            style: { transition: 'background 0.15s' },
                            onMouseEnter: (e) => { (e.currentTarget as HTMLElement).style.background = '#FAFAFF'; },
                            onMouseLeave: (e) => { (e.currentTarget as HTMLElement).style.background = ''; },
                        })}
                    />
                </div>
            </div>

            <LogExpenseModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </AppLayout>
    );
}
