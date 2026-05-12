import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Modal, Form, Input, Select, Button, Avatar, DatePicker } from 'antd';
import { Plus, MoreHorizontal, TrendingUp, DollarSign, BarChart2, Target } from 'lucide-react';
import { useState } from 'react';

interface Deal {
    id: number;
    company: string;
    contact: string;
    value: number;
    owner: { name: string; avatar: string; color: string };
    closeDate: string;
    probability: number;
    tags: string[];
    stage: string;
}

const stageConfig: Record<string, { label: string; bg: string; accent: string; headerBg: string; headerColor: string }> = {
    'new-leads':      { label: 'New Leads',      bg: '#EFF6FF', accent: '#3B82F6', headerBg: '#DBEAFE', headerColor: '#1D4ED8' },
    'qualified':      { label: 'Qualified',       bg: '#F5F3FF', accent: '#7C3AED', headerBg: '#EDE9FE', headerColor: '#5B21B6' },
    'proposal-sent':  { label: 'Proposal Sent',   bg: '#FFFBEB', accent: '#F59E0B', headerBg: '#FEF3C7', headerColor: '#B45309' },
    'negotiation':    { label: 'Negotiation',     bg: '#FFF7ED', accent: '#EA580C', headerBg: '#FFEDD5', headerColor: '#C2410C' },
    'closed-won':     { label: 'Closed Won',      bg: '#DCFCE7', accent: '#16A34A', headerBg: '#BBF7D0', headerColor: '#15803D' },
    'closed-lost':    { label: 'Closed Lost',     bg: '#F8FAFC', accent: '#64748B', headerBg: '#E2E8F0', headerColor: '#475569' },
};

const stageOrder = ['new-leads', 'qualified', 'proposal-sent', 'negotiation', 'closed-won', 'closed-lost'];

const ownerColors: Record<string, string> = {
    'Sarah K.': '#7C3AED',
    'Ali H.':   '#3B82F6',
    'Marcus C.': '#EA580C',
    'Lisa P.':  '#16A34A',
    'Sophie T.': '#F59E0B',
};

const mockDeals: Deal[] = [
    // New Leads
    { id: 1,  company: 'TechVision Inc',    contact: 'Brian Cole',    value: 45000,  owner: { name: 'Sarah K.',  avatar: 'SK', color: '#7C3AED' }, closeDate: 'Jun 30',  probability: 20, tags: ['Enterprise', 'Inbound'],   stage: 'new-leads' },
    { id: 2,  company: 'StartupHub',        contact: 'Priya Mehta',   value: 12000,  owner: { name: 'Ali H.',    avatar: 'AH', color: '#3B82F6' }, closeDate: 'Jul 15',  probability: 15, tags: ['Inbound'],                  stage: 'new-leads' },
    { id: 3,  company: 'GlobalRetail',      contact: 'Derek Wynn',    value: 78000,  owner: { name: 'Marcus C.', avatar: 'MC', color: '#EA580C' }, closeDate: 'Aug 1',   probability: 10, tags: ['Enterprise', 'Referral'],   stage: 'new-leads' },
    // Qualified
    { id: 4,  company: 'DataDrive Corp',    contact: 'Elena Fisher',  value: 120000, owner: { name: 'Sarah K.',  avatar: 'SK', color: '#7C3AED' }, closeDate: 'Jul 20',  probability: 40, tags: ['Enterprise'],               stage: 'qualified' },
    { id: 5,  company: 'FinanceFlow',       contact: 'Omar Patel',    value: 34000,  owner: { name: 'Ali H.',    avatar: 'AH', color: '#3B82F6' }, closeDate: 'Jun 25',  probability: 35, tags: ['Referral'],                 stage: 'qualified' },
    { id: 6,  company: 'MediCare Plus',     contact: 'Janet Cross',   value: 56000,  owner: { name: 'Lisa P.',   avatar: 'LP', color: '#16A34A' }, closeDate: 'Jul 31',  probability: 45, tags: ['Inbound', 'Healthcare'],    stage: 'qualified' },
    // Proposal Sent
    { id: 7,  company: 'CloudFirst',        contact: 'Tomas Reyes',   value: 89000,  owner: { name: 'Sophie T.', avatar: 'ST', color: '#F59E0B' }, closeDate: 'Jun 15',  probability: 60, tags: ['Enterprise', 'Cloud'],      stage: 'proposal-sent' },
    { id: 8,  company: 'RetailMax',         contact: 'Cindy Bloom',   value: 23000,  owner: { name: 'Ali H.',    avatar: 'AH', color: '#3B82F6' }, closeDate: 'Jun 10',  probability: 55, tags: ['Referral'],                 stage: 'proposal-sent' },
    // Negotiation
    { id: 9,  company: 'EduTech Global',    contact: 'Raj Sunder',    value: 145000, owner: { name: 'Sarah K.',  avatar: 'SK', color: '#7C3AED' }, closeDate: 'Jun 5',   probability: 75, tags: ['Enterprise', 'Education'],  stage: 'negotiation' },
    { id: 10, company: 'SmartFactory',      contact: 'Hans Mueller',  value: 67000,  owner: { name: 'Marcus C.', avatar: 'MC', color: '#EA580C' }, closeDate: 'Jun 8',   probability: 70, tags: ['Industrial'],               stage: 'negotiation' },
    // Closed Won
    { id: 11, company: 'Massive Dynamic',   contact: 'Nina Watkins',  value: 180000, owner: { name: 'Sarah K.',  avatar: 'SK', color: '#7C3AED' }, closeDate: 'May 28',  probability: 100, tags: ['Enterprise', 'Referral'],  stage: 'closed-won' },
    { id: 12, company: 'Delta Finance',     contact: 'Paul Ingram',   value: 42000,  owner: { name: 'Ali H.',    avatar: 'AH', color: '#3B82F6' }, closeDate: 'May 15',  probability: 100, tags: ['Finance'],                 stage: 'closed-won' },
    // Closed Lost
    { id: 13, company: 'OldTech Ltd',       contact: 'Greg Barnes',   value: 28000,  owner: { name: 'Marcus C.', avatar: 'MC', color: '#EA580C' }, closeDate: 'May 10',  probability: 0,  tags: ['Cold Outreach'],            stage: 'closed-lost' },
];

function formatValue(v: number) {
    if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
    return `$${v}`;
}

function TagBadge({ label }: { label: string }) {
    return (
        <span style={{
            background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0',
            borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 500,
        }}>{label}</span>
    );
}

function DealCard({ deal }: { deal: Deal }) {
    const cfg = stageConfig[deal.stage];
    return (
        <div style={{
            background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE',
            boxShadow: '0 1px 4px rgba(124,58,237,0.07)', padding: '14px 14px 12px',
            cursor: 'grab', transition: 'box-shadow 0.15s, transform 0.15s',
            marginBottom: 10,
        }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(124,58,237,0.13)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(124,58,237,0.07)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
        >
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>{deal.company}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{deal.contact}</div>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1', padding: 2, borderRadius: 4, display: 'flex' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#94A3B8')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#CBD5E1')}
                ><MoreHorizontal size={14} /></button>
            </div>

            {/* Deal value */}
            <div style={{ fontSize: 20, fontWeight: 700, color: cfg.accent, marginBottom: 10, letterSpacing: '-0.5px' }}>
                {formatValue(deal.value)}
            </div>

            {/* Progress bar */}
            {deal.stage !== 'closed-won' && deal.stage !== 'closed-lost' && (
                <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>Probability</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: cfg.accent }}>{deal.probability}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: '#F1F5F9', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 2, width: `${deal.probability}%`, background: cfg.accent }} />
                    </div>
                </div>
            )}

            {/* Tags */}
            {deal.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                    {deal.tags.map(t => <TagBadge key={t} label={t} />)}
                </div>
            )}

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F8F5FF', paddingTop: 9 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Avatar size={20} style={{ background: deal.owner.color, fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{deal.owner.avatar}</Avatar>
                    <span style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>{deal.owner.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 10, color: '#94A3B8' }}>📅</span>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{deal.closeDate}</span>
                </div>
            </div>
        </div>
    );
}

function AddDealModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [form] = Form.useForm();
    return (
        <Modal open={open} onCancel={onClose} footer={null} width={520}
            title={<span style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>Add New Deal</span>}>
            <Form form={form} layout="vertical" requiredMark={false} style={{ marginTop: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                    <Form.Item label="Company Name" name="company" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Acme Corp" size="large" />
                    </Form.Item>
                    <Form.Item label="Contact Name" name="contact">
                        <Input placeholder="Contact person" size="large" />
                    </Form.Item>
                    <Form.Item label="Deal Value ($)" name="value" rules={[{ required: true }]}>
                        <Input placeholder="e.g. 50000" size="large" type="number" />
                    </Form.Item>
                    <Form.Item label="Stage" name="stage" rules={[{ required: true }]}>
                        <Select size="large" placeholder="Select stage…"
                            options={stageOrder.map(s => ({ label: stageConfig[s].label, value: s }))} />
                    </Form.Item>
                    <Form.Item label="Owner" name="owner">
                        <Select size="large" placeholder="Assign owner…"
                            options={Object.keys(ownerColors).map(n => ({ label: n, value: n }))} />
                    </Form.Item>
                    <Form.Item label="Probability (%)" name="probability">
                        <Input placeholder="e.g. 50" size="large" type="number" min={0} max={100} />
                    </Form.Item>
                </div>
                <Form.Item label="Expected Close Date" name="closeDate">
                    <DatePicker size="large" style={{ width: '100%' }} />
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={() => { form.resetFields(); onClose(); }}
                        style={{ background: '#7C3AED', borderColor: '#7C3AED' }}>
                        Add Deal
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

export default function CRMPipeline() {
    const [showAdd, setShowAdd] = useState(false);

    const totalPipeline = mockDeals.filter(d => d.stage !== 'closed-lost').reduce((s, d) => s + d.value, 0);
    const totalDeals = mockDeals.filter(d => d.stage !== 'closed-lost' && d.stage !== 'closed-won').length;
    const avgDeal = totalDeals > 0 ? Math.round(totalPipeline / mockDeals.length) : 0;
    const wonDeals = mockDeals.filter(d => d.stage === 'closed-won').length;
    const closedDeals = mockDeals.filter(d => d.stage === 'closed-won' || d.stage === 'closed-lost').length;
    const winRate = closedDeals > 0 ? Math.round((wonDeals / closedDeals) * 100) : 0;

    return (
        <AppLayout title="CRM Pipeline">
            <Head title="CRM Pipeline" />
            <AddDealModal open={showAdd} onClose={() => setShowAdd(false)} />

            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>CRM Pipeline</h1>
                    <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>
                        Total pipeline value: <strong style={{ color: '#7C3AED' }}>{formatValue(totalPipeline)}</strong>
                    </p>
                </div>
                <Button type="primary" icon={<Plus size={15} />} size="large" onClick={() => setShowAdd(true)}
                    style={{ background: '#7C3AED', borderColor: '#7C3AED', borderRadius: 8, fontWeight: 600, height: 40 }}>
                    Add Deal
                </Button>
            </div>

            {/* Summary bar */}
            <div style={{
                display: 'flex', gap: 0, marginBottom: 24, background: '#fff',
                borderRadius: 12, border: '1px solid #EDE9FE', boxShadow: '0 1px 4px rgba(124,58,237,0.06)',
                overflow: 'hidden',
            }}>
                {[
                    { label: 'Total Pipeline', value: formatValue(totalPipeline), icon: <DollarSign size={18} color="#7C3AED" />, color: '#7C3AED' },
                    { label: 'Active Deals',   value: totalDeals,                 icon: <BarChart2 size={18} color="#3B82F6" />,  color: '#3B82F6' },
                    { label: 'Avg Deal Size',  value: formatValue(avgDeal),       icon: <TrendingUp size={18} color="#F59E0B" />, color: '#F59E0B' },
                    { label: 'Win Rate',       value: `${winRate}%`,              icon: <Target size={18} color="#16A34A" />,     color: '#16A34A' },
                ].map((s, i, arr) => (
                    <div key={s.label} style={{
                        flex: 1, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 14,
                        borderRight: i < arr.length - 1 ? '1px solid #EDE9FE' : 'none',
                    }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {s.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Kanban board */}
            <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 16, alignItems: 'flex-start' }}>
                {stageOrder.map(stageKey => {
                    const cfg = stageConfig[stageKey];
                    const stageDeals = mockDeals.filter(d => d.stage === stageKey);
                    const stageTotal = stageDeals.reduce((s, d) => s + d.value, 0);
                    return (
                        <div key={stageKey} style={{ minWidth: 270, width: 270, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                            {/* Column header */}
                            <div style={{
                                background: cfg.headerBg, borderRadius: '12px 12px 0 0', padding: '12px 14px',
                                borderBottom: `2px solid ${cfg.accent}`,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: cfg.headerColor }}>{cfg.label}</span>
                                        <span style={{
                                            background: cfg.accent, color: '#fff',
                                            borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 700,
                                        }}>{stageDeals.length}</span>
                                    </div>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: cfg.accent, padding: 2, borderRadius: 4, display: 'flex' }}>
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Cards container */}
                            <div style={{
                                background: cfg.bg, padding: '10px 10px 0', flex: 1,
                                minHeight: 200, border: `1px solid ${cfg.accent}20`,
                                borderTop: 'none', borderBottom: 'none',
                            }}>
                                {stageDeals.map(deal => <DealCard key={deal.id} deal={deal} />)}
                                {stageDeals.length === 0 && (
                                    <div style={{
                                        height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#CBD5E1', fontSize: 12, border: `2px dashed ${cfg.accent}40`,
                                        borderRadius: 8, margin: '4px 0 10px',
                                    }}>
                                        Drop deals here
                                    </div>
                                )}
                            </div>

                            {/* Column footer */}
                            <div style={{
                                background: cfg.headerBg, borderRadius: '0 0 12px 12px', padding: '10px 14px',
                                border: `1px solid ${cfg.accent}20`, borderTop: `1px solid ${cfg.accent}30`,
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <span style={{ fontSize: 11, color: cfg.headerColor, fontWeight: 500 }}>Total value</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: cfg.accent }}>{formatValue(stageTotal)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </AppLayout>
    );
}
