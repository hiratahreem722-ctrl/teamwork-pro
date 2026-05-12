import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import {
    Table, Modal, Form, Input, Select, Button, DatePicker,
    Typography, Space, Tabs,
} from 'antd';
import {
    Plus, Search, Download, Send, Eye, FileText,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────

type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Partial' | 'Cancelled';

interface Invoice {
    id: string;
    client: string;
    issued: string;
    due: string;
    amount: number;
    status: InvoiceStatus;
}

interface LineItem {
    key: number;
    description: string;
    qty: number;
    rate: number;
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const invoices: Invoice[] = [
    { id: 'INV-2026-031', client: 'Massive Dynamic',      issued: 'May 1, 2026',  due: 'May 31, 2026', amount: 12400, status: 'Paid' },
    { id: 'INV-2026-030', client: 'E-commerce Platform',  issued: 'May 3, 2026',  due: 'Jun 2, 2026',  amount: 28600, status: 'Paid' },
    { id: 'INV-2026-029', client: 'Acme Corp',            issued: 'May 5, 2026',  due: 'Jun 4, 2026',  amount: 8200,  status: 'Sent' },
    { id: 'INV-2026-028', client: 'Delta Finance',        issued: 'Apr 28, 2026', due: 'May 28, 2026', amount: 15900, status: 'Overdue' },
    { id: 'INV-2026-027', client: 'Zeta Solutions',       issued: 'Apr 25, 2026', due: 'May 25, 2026', amount: 22100, status: 'Overdue' },
    { id: 'INV-2026-026', client: 'Gamma Retail',         issued: 'Apr 20, 2026', due: 'May 20, 2026', amount: 6800,  status: 'Paid' },
    { id: 'INV-2026-025', client: 'HealthFirst Inc',      issued: 'Apr 15, 2026', due: 'May 15, 2026', amount: 31200, status: 'Partial' },
    { id: 'INV-2026-024', client: 'Beta Manufacturing',   issued: 'Apr 10, 2026', due: 'May 10, 2026', amount: 18700, status: 'Paid' },
    { id: 'INV-2026-023', client: 'Massive Dynamic',      issued: 'Apr 1, 2026',  due: 'Apr 30, 2026', amount: 11200, status: 'Paid' },
    { id: 'INV-2026-022', client: 'E-commerce Platform',  issued: 'Mar 28, 2026', due: 'Apr 27, 2026', amount: 24900, status: 'Paid' },
    { id: 'INV-2026-021', client: 'Acme Corp',            issued: 'Mar 25, 2026', due: 'Apr 24, 2026', amount: 7600,  status: 'Paid' },
    { id: 'INV-2026-020', client: 'Delta Finance',        issued: 'Mar 20, 2026', due: 'Apr 19, 2026', amount: 14300, status: 'Paid' },
    { id: 'INV-2026-019', client: 'Zeta Solutions',       issued: 'Mar 15, 2026', due: 'Apr 14, 2026', amount: 19800, status: 'Paid' },
    { id: 'INV-2026-018', client: 'HealthFirst Inc',      issued: 'Mar 10, 2026', due: 'Apr 9, 2026',  amount: 28500, status: 'Paid' },
    { id: 'INV-2026-017', client: 'Gamma Retail',         issued: 'Mar 5, 2026',  due: 'Apr 4, 2026',  amount: 5900,  status: 'Cancelled' },
];

const allClients = [...new Set(invoices.map(i => i.client))];

// ─── Status badge config ───────────────────────────────────────────────────────

const statusConfig: Record<InvoiceStatus, { bg: string; color: string }> = {
    Draft:     { bg: '#F1F5F9', color: '#64748B' },
    Sent:      { bg: '#EFF6FF', color: '#3B82F6' },
    Paid:      { bg: '#DCFCE7', color: '#16A34A' },
    Overdue:   { bg: '#FEE2E2', color: '#DC2626' },
    Partial:   { bg: '#FEF3C7', color: '#D97706' },
    Cancelled: { bg: '#F1F5F9', color: '#64748B' },
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

function fmt(n: number) {
    return '$' + n.toLocaleString();
}

// ─── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: InvoiceStatus }) {
    const { bg, color } = statusConfig[status];
    return (
        <span style={{
            background: bg, color,
            fontWeight: 600, fontSize: 12,
            padding: '3px 10px', borderRadius: 20,
            display: 'inline-block',
        }}>
            {status}
        </span>
    );
}

// ─── Summary Card ──────────────────────────────────────────────────────────────

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div style={{ ...cardStyle, flex: 1 }}>
            <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500, marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
        </div>
    );
}

// ─── New Invoice Modal ─────────────────────────────────────────────────────────

function NewInvoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [form] = Form.useForm();
    const [lineItems, setLineItems] = useState<LineItem[]>([
        { key: 1, description: '', qty: 1, rate: 0 },
    ]);

    const subtotal = lineItems.reduce((s, r) => s + r.qty * r.rate, 0);
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + tax;

    const addLine = () => setLineItems(p => [...p, { key: Date.now(), description: '', qty: 1, rate: 0 }]);
    const removeLine = (key: number) => setLineItems(p => p.filter(l => l.key !== key));
    const updateLine = (key: number, field: keyof LineItem, val: string | number) =>
        setLineItems(p => p.map(l => l.key === key ? { ...l, [field]: val } : l));

    const handleSubmit = () => {
        form.validateFields().then(() => { form.resetFields(); setLineItems([{ key: 1, description: '', qty: 1, rate: 0 }]); onClose(); });
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={<span style={{ color: '#1E1B4B', fontWeight: 700, fontSize: 16 }}>New Invoice</span>}
            footer={null}
            width={720}
        >
            <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 16px' }}>
                    <Form.Item name="client" label="Client" rules={[{ required: true, message: 'Required' }]}>
                        <Select placeholder="Select client" options={allClients.map(c => ({ label: c, value: c }))} />
                    </Form.Item>
                    <Form.Item name="invoiceDate" label="Invoice Date" rules={[{ required: true, message: 'Required' }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: 'Required' }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </div>

                {/* Line items */}
                <div style={{ border: '1px solid #EDE9FE', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 100px 36px', gap: 0, background: '#F5F3FF', padding: '8px 12px' }}>
                        {['DESCRIPTION', 'QTY', 'RATE', 'AMOUNT', ''].map(h => (
                            <div key={h} style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.05em' }}>{h}</div>
                        ))}
                    </div>
                    {lineItems.map(item => (
                        <div key={item.key} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 100px 36px', gap: 0, padding: '8px 12px', borderTop: '1px solid #EDE9FE', alignItems: 'center' }}>
                            <Input
                                size="small"
                                placeholder="Service description"
                                value={item.description}
                                onChange={e => updateLine(item.key, 'description', e.target.value)}
                                style={{ border: 'none', padding: 0, boxShadow: 'none' }}
                            />
                            <Input
                                size="small"
                                type="number"
                                value={item.qty}
                                onChange={e => updateLine(item.key, 'qty', parseFloat(e.target.value) || 0)}
                                style={{ border: 'none', padding: 0, boxShadow: 'none' }}
                            />
                            <Input
                                size="small"
                                type="number"
                                value={item.rate}
                                onChange={e => updateLine(item.key, 'rate', parseFloat(e.target.value) || 0)}
                                style={{ border: 'none', padding: 0, boxShadow: 'none' }}
                            />
                            <Text style={{ fontSize: 14 }}>{fmt(item.qty * item.rate)}</Text>
                            <button
                                onClick={() => removeLine(item.key)}
                                style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 16, padding: 0 }}
                            >×</button>
                        </div>
                    ))}
                    <div style={{ padding: '8px 12px', borderTop: '1px solid #EDE9FE' }}>
                        <button onClick={addLine} style={{ background: 'none', border: 'none', color: '#7C3AED', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                            + Add Line Item
                        </button>
                    </div>
                </div>

                {/* Totals preview */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: 240, border: '1px solid #EDE9FE', borderRadius: 8, padding: '12px 16px' }}>
                        {[
                            { label: 'Subtotal', value: fmt(subtotal) },
                            { label: 'Tax (10%)', value: fmt(tax) },
                        ].map(r => (
                            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: '#64748B' }}>
                                <span>{r.label}</span><span>{r.value}</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '2px solid #EDE9FE', fontWeight: 700, color: '#1E1B4B', fontSize: 15 }}>
                            <span>Total</span><span>{fmt(total)}</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <button style={primaryBtn} onClick={handleSubmit}>Create Invoice</button>
                </div>
            </Form>
        </Modal>
    );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function Invoices() {
    const [activeTab, setActiveTab] = useState('All');
    const [search, setSearch] = useState('');
    const [clientFilter, setClientFilter] = useState<string | undefined>(undefined);
    const [modalOpen, setModalOpen] = useState(false);

    const tabs = ['All', 'Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'];

    const filtered = useMemo(() =>
        invoices.filter(inv => {
            const matchTab = activeTab === 'All' || inv.status === activeTab;
            const matchSearch = inv.id.toLowerCase().includes(search.toLowerCase()) ||
                inv.client.toLowerCase().includes(search.toLowerCase());
            const matchClient = !clientFilter || inv.client === clientFilter;
            return matchTab && matchSearch && matchClient;
        }), [activeTab, search, clientFilter]);

    const columns: ColumnsType<Invoice> = [
        {
            title: <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em' }}>INVOICE #</span>,
            dataIndex: 'id',
            render: (id: string) => (
                <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#1E1B4B', fontSize: 13 }}>{id}</span>
            ),
        },
        {
            title: <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em' }}>CLIENT</span>,
            dataIndex: 'client',
            render: (c: string) => <span style={{ fontWeight: 500, color: '#1E1B4B' }}>{c}</span>,
        },
        {
            title: <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em' }}>ISSUED DATE</span>,
            dataIndex: 'issued',
            render: (d: string) => <span style={{ color: '#64748B', fontSize: 13 }}>{d}</span>,
        },
        {
            title: <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em' }}>DUE DATE</span>,
            dataIndex: 'due',
            render: (d: string) => <span style={{ color: '#64748B', fontSize: 13 }}>{d}</span>,
        },
        {
            title: <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em' }}>AMOUNT</span>,
            dataIndex: 'amount',
            align: 'right',
            render: (a: number) => <span style={{ fontWeight: 700, color: '#1E1B4B' }}>{fmt(a)}</span>,
        },
        {
            title: <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em' }}>STATUS</span>,
            dataIndex: 'status',
            render: (s: InvoiceStatus) => <StatusBadge status={s} />,
        },
        {
            title: <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em' }}>ACTIONS</span>,
            key: 'actions',
            align: 'center',
            render: (_: unknown, record: Invoice) => (
                <Space size={4}>
                    <button title="View" style={{ background: '#F5F3FF', border: 'none', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#7C3AED' }}>
                        <Eye size={14} />
                    </button>
                    {(record.status === 'Draft' || record.status === 'Sent') && (
                        <button title="Send" style={{ background: '#EFF6FF', border: 'none', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#3B82F6' }}>
                            <Send size={14} />
                        </button>
                    )}
                    <button title="Download" style={{ background: '#F8FAFC', border: 'none', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#64748B' }}>
                        <Download size={14} />
                    </button>
                </Space>
            ),
        },
    ];

    return (
        <AppLayout title="Invoices">
            <Head title="Invoices" />

            <div style={{ padding: '28px 32px', background: '#F5F3FF', minHeight: '100vh' }}>

                {/* Page header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#1E1B4B' }}>Invoices</h1>
                        <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: 14 }}>{invoices.length} invoices total</p>
                    </div>
                    <button style={primaryBtn} onClick={() => setModalOpen(true)}>
                        <Plus size={16} />
                        New Invoice
                    </button>
                </div>

                {/* Summary cards */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                    <SummaryCard label="Total Invoiced" value="$284,500" color="#1E1B4B" />
                    <SummaryCard label="Paid" value="$198,200" color="#16A34A" />
                    <SummaryCard label="Outstanding" value="$62,800" color="#3B82F6" />
                    <SummaryCard label="Overdue" value="$23,500" color="#DC2626" />
                </div>

                {/* Table card */}
                <div style={{ ...cardStyle, padding: 0 }}>

                    {/* Tabs + filters */}
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
                        <div style={{ display: 'flex', gap: 10, padding: '12px 0' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search invoices..."
                                    style={{ paddingLeft: 32, paddingRight: 12, height: 36, border: '1px solid #EDE9FE', borderRadius: 8, fontSize: 13, color: '#1E1B4B', outline: 'none', width: 220 }}
                                />
                            </div>
                            <Select
                                allowClear
                                placeholder="All Clients"
                                value={clientFilter}
                                onChange={setClientFilter}
                                style={{ width: 180, height: 36 }}
                                options={allClients.map(c => ({ label: c, value: c }))}
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

            <NewInvoiceModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </AppLayout>
    );
}
