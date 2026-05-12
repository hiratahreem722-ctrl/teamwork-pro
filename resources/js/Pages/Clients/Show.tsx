import AppLayout from '@/Layouts/AppLayout';
import Badge from '@/Components/Badge';
import { Head, Link } from '@inertiajs/react';
import { Modal, Form, Input, Select, Button, Tag, Typography, Progress } from 'antd';
import {
    ChevronRight, Building2, Mail, Phone, Globe, Plus, Download,
    CheckCircle, AlertTriangle, DollarSign, FolderKanban, Clock,
    MoreHorizontal, X, FileText, Users, CreditCard,
} from 'lucide-react';
import { useState } from 'react';

const { Text } = Typography;

const GRAD = 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)';

const client = {
    id: 1,
    name: 'Acme Corp',
    industry: 'Technology',
    health: 'On Track' as const,
    contact: 'James Wilson',
    email: 'james@acme.com',
    phone: '+1 555-0101',
    website: 'acme.com',
    address: '100 Innovation Drive, San Francisco, CA 94105',
    since: 'January 2025',
    notes: 'Key enterprise client. Prefers weekly status updates. Primary stakeholder is the CTO office.',
};

const projects = [
    { id: 1, name: 'Website Redesign',   status: 'In Progress', progress: 65,  budget: 12000, spent: 7800,  due: 'Apr 15, 2026', team: 4 },
    { id: 3, name: 'API Integration',    status: 'Backlog',     progress: 10,  budget: 6000,  spent: 600,   due: 'May 1, 2026',  team: 2 },
    { id: 99, name: 'CRM Migration',     status: 'Completed',   progress: 100, budget: 18000, spent: 17200, due: 'Feb 28, 2026', team: 5 },
];

const invoices = [
    { id: 'INV-0041', date: 'Apr 1, 2026',  due: 'Apr 15, 2026',  amount: 6000,  status: 'Pending',  project: 'Website Redesign' },
    { id: 'INV-0038', date: 'Mar 1, 2026',  due: 'Mar 15, 2026',  amount: 1800,  status: 'Paid',     project: 'Website Redesign' },
    { id: 'INV-0031', date: 'Feb 1, 2026',  due: 'Feb 15, 2026',  amount: 17200, status: 'Paid',     project: 'CRM Migration' },
    { id: 'INV-0025', date: 'Jan 10, 2026', due: 'Jan 24, 2026',  amount: 4000,  status: 'Overdue',  project: 'API Integration' },
];

const contacts = [
    { name: 'James Wilson',  title: 'CTO',          email: 'james@acme.com',   phone: '+1 555-0101', primary: true  },
    { name: 'Carla Brooks',  title: 'Project Lead',  email: 'carla@acme.com',   phone: '+1 555-0108', primary: false },
    { name: 'Tom Henderson', title: 'Finance',       email: 'tom@acme.com',     phone: '+1 555-0115', primary: false },
];

const activity = [
    { text: 'Invoice INV-0041 sent to james@acme.com',              time: '2 days ago',  type: 'invoice' },
    { text: 'Milestone "Design Phase" marked complete',              time: '5 days ago',  type: 'milestone' },
    { text: 'New project "API Integration" created',                 time: '2 weeks ago', type: 'project' },
    { text: 'Invoice INV-0038 paid — $1,800',                        time: '3 weeks ago', type: 'payment' },
    { text: 'Carla Brooks added as project contact',                 time: '1 month ago', type: 'team' },
];

const tabs = ['Overview', 'Projects', 'Invoices', 'Contacts', 'Activity'];

const statusVariant: Record<string, 'blue' | 'amber' | 'slate' | 'green'> = {
    'In Progress': 'blue', 'Backlog': 'slate', 'Completed': 'green', 'In Review': 'amber',
};
const invoiceStatusColor: Record<string, string> = { Paid: 'green', Pending: 'gold', Overdue: 'red' };

function AddInvoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [form] = Form.useForm();
    return (
        <Modal open={open} onCancel={onClose} footer={null} width={480}
            title={<div><div style={{ fontSize: 16, fontWeight: 600 }}>New Invoice</div><div style={{ fontSize: 13, color: '#64748b', fontWeight: 400 }}>Create invoice for Acme Corp</div></div>}
        >
            <Form form={form} layout="vertical" requiredMark={false} style={{ marginTop: 16 }}>
                <Form.Item label="Project" name="project">
                    <Select options={projects.map(p => ({ label: p.name, value: p.name }))} placeholder="Select project…" />
                </Form.Item>
                <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
                    <Input prefix="$" type="number" placeholder="0.00" />
                </Form.Item>
                <Form.Item label="Due Date" name="due">
                    <Input type="date" />
                </Form.Item>
                <Form.Item label="Notes" name="notes">
                    <Input.TextArea rows={2} placeholder="Invoice notes…" />
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" style={{ background: GRAD, border: 'none', color: '#fff' }} onClick={() => { form.resetFields(); onClose(); }}>Create Invoice</Button>
                </div>
            </Form>
        </Modal>
    );
}

export default function ClientShow() {
    const [activeTab, setActiveTab] = useState('Overview');
    const [showInvoice, setShowInvoice] = useState(false);

    const totalRevenue    = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
    const totalOutstanding = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0);
    const totalBudget     = projects.reduce((s, p) => s + p.budget, 0);
    const totalSpent      = projects.reduce((s, p) => s + p.spent, 0);

    return (
        <AppLayout title={client.name}>
            <Head title={client.name} />
            <AddInvoiceModal open={showInvoice} onClose={() => setShowInvoice(false)} />

            {/* Breadcrumb */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#64748b', marginBottom: 20 }}>
                <Link href={route('clients.index')} style={{ color: '#64748b', textDecoration: 'none' }}
                    onMouseEnter={e => ((e.target as HTMLElement).style.color = '#2563EB')}
                    onMouseLeave={e => ((e.target as HTMLElement).style.color = '#64748b')}>Clients</Link>
                <ChevronRight size={14} />
                <span style={{ color: '#1e293b', fontWeight: 500 }}>{client.name}</span>
            </nav>

            {/* Client header card */}
            <div style={{ borderRadius: 16, border: '1px solid #E2E8F0', background: '#fff', padding: '20px 24px', marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 20 }}>
                    {/* Avatar + Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 280 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 14, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
                            <Text style={{ color: '#fff', fontWeight: 800, fontSize: 22 }}>{client.name[0]}</Text>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                <Text style={{ fontSize: 22, fontWeight: 700, color: '#1e293b' }}>{client.name}</Text>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>
                                    <CheckCircle size={12} /> On Track
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                <Building2 size={13} color="#94a3b8" />
                                <Text type="secondary" style={{ fontSize: 13 }}>{client.industry}</Text>
                                <span style={{ color: '#cbd5e1' }}>·</span>
                                <Text type="secondary" style={{ fontSize: 13 }}>Client since {client.since}</Text>
                            </div>
                        </div>
                    </div>

                    {/* Contact info */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                        {[
                            { icon: Mail,  label: client.email  },
                            { icon: Phone, label: client.phone  },
                            { icon: Globe, label: client.website },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Icon size={14} color="#94a3b8" />
                                <Text style={{ fontSize: 13, color: '#64748b' }}>{label}</Text>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button icon={<Plus size={14} />} onClick={() => setShowInvoice(true)}>New Invoice</Button>
                        <Button type="primary" style={{ background: GRAD, border: 'none', color: '#fff' }} icon={<Plus size={14} />}>
                            <Link href={route('projects.index')} style={{ color: '#fff' }}>Add Project</Link>
                        </Button>
                    </div>
                </div>

                {/* KPIs */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, marginTop: 20, borderTop: '1px solid #F1F5F9', paddingTop: 16 }}>
                    {[
                        { label: 'Total Revenue',    value: `$${totalRevenue.toLocaleString()}`,    color: '#16a34a' },
                        { label: 'Outstanding',      value: `$${totalOutstanding.toLocaleString()}`, color: '#d97706' },
                        { label: 'Active Projects',  value: projects.filter(p => p.status !== 'Completed').length,  color: '#2563EB' },
                        { label: 'Total Budget',     value: `$${totalBudget.toLocaleString()}`,      color: '#1e293b' },
                        { label: 'Total Spent',      value: `$${totalSpent.toLocaleString()}`,       color: '#7c3aed' },
                    ].map((s, i) => (
                        <div key={s.label} style={{ flex: 1, minWidth: 120, textAlign: 'center', padding: '0 16px', borderRight: i < 4 ? '1px solid #F1F5F9' : 'none' }}>
                            <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid #E2E8F0', marginBottom: 20 }}>
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        style={{ padding: '10px 18px', fontSize: 14, fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab ? '#2563EB' : 'transparent'}`, color: activeTab === tab ? '#2563EB' : '#64748b', transition: 'color 0.15s' }}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* ── Overview ── */}
            {activeTab === 'Overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Project health summary */}
                        <div style={{ borderRadius: 14, border: '1px solid #E2E8F0', background: '#fff', padding: 20 }}>
                            <Text strong style={{ fontSize: 15, color: '#374151', display: 'block', marginBottom: 16 }}>Project Health</Text>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {projects.map(p => (
                                    <div key={p.id}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Text strong style={{ fontSize: 14 }}>{p.name}</Text>
                                                <Badge label={p.status} variant={statusVariant[p.status]} />
                                            </div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Due {p.due}</Text>
                                        </div>
                                        <Progress percent={p.progress} showInfo size={['100%', 8]}
                                            strokeColor={p.progress === 100 ? '#22c55e' : p.progress >= 70 ? '#2563EB' : '#f59e0b'}
                                            trailColor="#F1F5F9" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Financial overview */}
                        <div style={{ borderRadius: 14, border: '1px solid #E2E8F0', background: '#fff', padding: 20 }}>
                            <Text strong style={{ fontSize: 15, color: '#374151', display: 'block', marginBottom: 16 }}>Financial Overview</Text>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                {[
                                    { label: 'Total Invoiced',  value: `$${invoices.reduce((s, i) => s + i.amount, 0).toLocaleString()}`, color: '#1e293b' },
                                    { label: 'Total Paid',      value: `$${totalRevenue.toLocaleString()}`,    color: '#16a34a' },
                                    { label: 'Outstanding',     value: `$${totalOutstanding.toLocaleString()}`, color: '#d97706' },
                                    { label: 'Budget Remaining', value: `$${(totalBudget - totalSpent).toLocaleString()}`, color: '#2563EB' },
                                ].map(s => (
                                    <div key={s.label} style={{ padding: 14, borderRadius: 10, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>{s.label}</Text>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Budget utilization</Text>
                                    <Text style={{ fontSize: 12, fontWeight: 600, color: '#d97706' }}>{Math.round((totalSpent / totalBudget) * 100)}%</Text>
                                </div>
                                <div style={{ height: 8, borderRadius: 4, background: '#F1F5F9', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', background: '#f59e0b', borderRadius: 4, width: `${(totalSpent / totalBudget) * 100}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Notes */}
                        <div style={{ borderRadius: 14, border: '1px solid #E2E8F0', background: '#fff', padding: 18 }}>
                            <Text strong style={{ fontSize: 14, color: '#374151', display: 'block', marginBottom: 10 }}>Notes</Text>
                            <Text style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{client.notes}</Text>
                            <button style={{ marginTop: 10, background: 'none', border: 'none', color: '#2563EB', fontSize: 12, cursor: 'pointer', padding: 0 }}>Edit notes</button>
                        </div>

                        {/* Primary contact */}
                        <div style={{ borderRadius: 14, border: '1px solid #E2E8F0', background: '#fff', padding: 18 }}>
                            <Text strong style={{ fontSize: 14, color: '#374151', display: 'block', marginBottom: 12 }}>Primary Contact</Text>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Text style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{contacts[0].name[0]}</Text>
                                </div>
                                <div>
                                    <Text strong style={{ fontSize: 14, color: '#1e293b', display: 'block' }}>{contacts[0].name}</Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>{contacts[0].title}</Text>
                                </div>
                            </div>
                            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={12} color="#94a3b8" /><Text style={{ fontSize: 12, color: '#64748b' }}>{contacts[0].email}</Text></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={12} color="#94a3b8" /><Text style={{ fontSize: 12, color: '#64748b' }}>{contacts[0].phone}</Text></div>
                            </div>
                        </div>

                        {/* Address */}
                        <div style={{ borderRadius: 14, border: '1px solid #E2E8F0', background: '#fff', padding: 18 }}>
                            <Text strong style={{ fontSize: 14, color: '#374151', display: 'block', marginBottom: 8 }}>Address</Text>
                            <Text style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{client.address}</Text>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Projects ── */}
            {activeTab === 'Projects' && (
                <div style={{ borderRadius: 14, border: '1px solid #E2E8F0', background: '#fff', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
                        <Text strong style={{ color: '#374151' }}>All Projects ({projects.length})</Text>
                        <Button size="small" type="primary" icon={<Plus size={13} />} style={{ background: GRAD, border: 'none', borderRadius: 6, color: '#fff' }}>Add Project</Button>
                    </div>
                    {projects.map(p => (
                        <div key={p.id} style={{ padding: '16px 20px', borderBottom: '1px solid #F8FAFC', display: 'flex', alignItems: 'center', gap: 20 }}
                            className="hover:bg-slate-50">
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                    <Link href={route('projects.show', p.id)}>
                                        <Text strong style={{ fontSize: 14, color: '#1e293b', cursor: 'pointer' }}>{p.name}</Text>
                                    </Link>
                                    <Badge label={p.status} variant={statusVariant[p.status]} />
                                </div>
                                <Progress percent={p.progress} showInfo={false} size={['100%', 6]} strokeColor={p.progress === 100 ? '#22c55e' : '#2563EB'} trailColor="#F1F5F9" />
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <Text strong style={{ fontSize: 14, color: '#1e293b', display: 'block' }}>${p.budget.toLocaleString()}</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>${p.spent.toLocaleString()} spent</Text>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <Text style={{ fontSize: 13, color: '#64748b', display: 'block' }}>Due {p.due}</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>{p.team} members</Text>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Invoices ── */}
            {activeTab === 'Invoices' && (
                <div style={{ borderRadius: 14, border: '1px solid #E2E8F0', background: '#fff', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
                        <Text strong style={{ color: '#374151' }}>Invoices ({invoices.length})</Text>
                        <Button size="small" type="primary" icon={<Plus size={13} />} onClick={() => setShowInvoice(true)} style={{ background: GRAD, border: 'none', borderRadius: 6, color: '#fff' }}>New Invoice</Button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                                {['Invoice #', 'Project', 'Date', 'Due Date', 'Amount', 'Status', ''].map(h => (
                                    <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(inv => (
                                <tr key={inv.id} style={{ borderBottom: '1px solid #F8FAFC' }} className="hover:bg-slate-50">
                                    <td style={{ padding: '14px 20px' }}><Text strong style={{ color: '#1e293b' }}>{inv.id}</Text></td>
                                    <td style={{ padding: '14px 20px', color: '#64748b' }}>{inv.project}</td>
                                    <td style={{ padding: '14px 20px', color: '#64748b' }}>{inv.date}</td>
                                    <td style={{ padding: '14px 20px', color: inv.status === 'Overdue' ? '#dc2626' : '#64748b', fontWeight: inv.status === 'Overdue' ? 600 : 400 }}>{inv.due}</td>
                                    <td style={{ padding: '14px 20px' }}><Text strong style={{ color: '#1e293b' }}>${inv.amount.toLocaleString()}</Text></td>
                                    <td style={{ padding: '14px 20px' }}><Tag color={invoiceStatusColor[inv.status]} style={{ borderRadius: 12, fontSize: 11 }}>{inv.status}</Tag></td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2 }}><Download size={14} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Contacts ── */}
            {activeTab === 'Contacts' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {contacts.map(c => (
                        <div key={c.name} style={{ borderRadius: 14, border: `1px solid ${c.primary ? '#93c5fd' : '#E2E8F0'}`, background: c.primary ? '#eff6ff' : '#fff', padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Text style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>{c.name[0]}</Text>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Text strong style={{ fontSize: 15, color: '#1e293b' }}>{c.name}</Text>
                                    {c.primary && <Tag color="blue" style={{ borderRadius: 12, fontSize: 11 }}>Primary</Tag>}
                                </div>
                                <Text type="secondary" style={{ fontSize: 13 }}>{c.title}</Text>
                            </div>
                            <div style={{ display: 'flex', gap: 24 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={13} color="#94a3b8" /><Text style={{ fontSize: 13, color: '#64748b' }}>{c.email}</Text></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={13} color="#94a3b8" /><Text style={{ fontSize: 13, color: '#64748b' }}>{c.phone}</Text></div>
                            </div>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}><MoreHorizontal size={16} /></button>
                        </div>
                    ))}
                    <button style={{ borderRadius: 14, border: '2px dashed #E2E8F0', background: 'transparent', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', color: '#94a3b8', fontSize: 14 }}>
                        <Plus size={16} /> Add Contact
                    </button>
                </div>
            )}

            {/* ── Activity ── */}
            {activeTab === 'Activity' && (
                <div style={{ borderRadius: 14, border: '1px solid #E2E8F0', background: '#fff', overflow: 'hidden' }}>
                    {activity.map((a, i) => (
                        <div key={i} style={{ padding: '14px 20px', borderBottom: i < activity.length - 1 ? '1px solid #F8FAFC' : 'none', display: 'flex', alignItems: 'flex-start', gap: 14 }} className="hover:bg-slate-50">
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB', marginTop: 6, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <Text style={{ fontSize: 14, color: '#1e293b' }}>{a.text}</Text>
                            </div>
                            <Text type="secondary" style={{ fontSize: 12, flexShrink: 0 }}>{a.time}</Text>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
