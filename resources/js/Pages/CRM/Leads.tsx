import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Modal, Form, Input, Select, Button, Avatar } from 'antd';
import { Plus, Search, Upload, MoreHorizontal, Filter, Users, TrendingUp, Flame, Star } from 'lucide-react';
import { useState } from 'react';

interface Lead {
    id: number;
    company: string;
    contact: string;
    initials: string;
    avatarColor: string;
    source: string;
    score: number;
    status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
    owner: { name: string; avatar: string; color: string };
    value: number;
    lastContact: string;
}

const statusConfig: Record<string, { bg: string; color: string; border: string }> = {
    'New':       { bg: '#EFF6FF', color: '#3B82F6', border: '#BFDBFE' },
    'Contacted': { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
    'Qualified': { bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE' },
    'Converted': { bg: '#DCFCE7', color: '#16A34A', border: '#BBF7D0' },
    'Lost':      { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
};

const avatarColors = ['#7C3AED', '#3B82F6', '#16A34A', '#F59E0B', '#EA580C', '#EC4899', '#0EA5E9', '#8B5CF6'];

const mockLeads: Lead[] = [
    { id: 1,  company: 'Apex Solutions',  contact: 'John Smith',    initials: 'JS', avatarColor: '#3B82F6',  source: 'Inbound',       score: 92,  status: 'New',       owner: { name: 'Sarah K.',  avatar: 'SK', color: '#7C3AED' }, value: 85000,  lastContact: 'Today' },
    { id: 2,  company: 'BlueSky Corp',    contact: 'Emma Johnson',  initials: 'EJ', avatarColor: '#0EA5E9',  source: 'LinkedIn',      score: 78,  status: 'Contacted', owner: { name: 'Ali H.',    avatar: 'AH', color: '#3B82F6' }, value: 32000,  lastContact: 'Yesterday' },
    { id: 3,  company: 'Nexus Labs',      contact: 'Ryan Martinez', initials: 'RM', avatarColor: '#EA580C',  source: 'Referral',      score: 88,  status: 'Qualified', owner: { name: 'Marcus C.', avatar: 'MC', color: '#EA580C' }, value: 120000, lastContact: 'May 10' },
    { id: 4,  company: 'ClearPath Inc',   contact: 'Diana Lee',     initials: 'DL', avatarColor: '#EC4899',  source: 'Website',       score: 45,  status: 'New',       owner: { name: 'Sarah K.',  avatar: 'SK', color: '#7C3AED' }, value: 18000,  lastContact: 'Today' },
    { id: 5,  company: 'TechNova',        contact: 'Sam Brown',     initials: 'SB', avatarColor: '#8B5CF6',  source: 'Cold Outreach', score: 62,  status: 'Contacted', owner: { name: 'Ali H.',    avatar: 'AH', color: '#3B82F6' }, value: 56000,  lastContact: 'May 9' },
    { id: 6,  company: 'Urban Spaces',    contact: 'Katie White',   initials: 'KW', avatarColor: '#16A34A',  source: 'Referral',      score: 95,  status: 'Qualified', owner: { name: 'Sarah K.',  avatar: 'SK', color: '#7C3AED' }, value: 240000, lastContact: 'May 8' },
    { id: 7,  company: 'DataMesh',        contact: 'Chris Park',    initials: 'CP', avatarColor: '#7C3AED',  source: 'LinkedIn',      score: 71,  status: 'Contacted', owner: { name: 'Lisa P.',   avatar: 'LP', color: '#16A34A' }, value: 45000,  lastContact: 'May 7' },
    { id: 8,  company: 'FormFactor',      contact: 'Grace Liu',     initials: 'GL', avatarColor: '#F59E0B',  source: 'Inbound',       score: 55,  status: 'New',       owner: { name: 'Ali H.',    avatar: 'AH', color: '#3B82F6' }, value: 28000,  lastContact: 'May 7' },
    { id: 9,  company: 'SwiftEdge',       contact: 'Tom Harris',    initials: 'TH', avatarColor: '#0EA5E9',  source: 'Website',       score: 83,  status: 'Qualified', owner: { name: 'Marcus C.', avatar: 'MC', color: '#EA580C' }, value: 67000,  lastContact: 'May 5' },
    { id: 10, company: 'PrimeCo',         contact: 'Olivia Scott',  initials: 'OS', avatarColor: '#16A34A',  source: 'Referral',      score: 90,  status: 'Converted', owner: { name: 'Sarah K.',  avatar: 'SK', color: '#7C3AED' }, value: 180000, lastContact: 'May 1' },
    { id: 11, company: 'DigitalFirst',    contact: 'James King',    initials: 'JK', avatarColor: '#94A3B8',  source: 'Cold Outreach', score: 38,  status: 'Lost',      owner: { name: 'Ali H.',    avatar: 'AH', color: '#3B82F6' }, value: 22000,  lastContact: 'Apr 28' },
    { id: 12, company: 'CloudPeak',       contact: 'Ava Wright',    initials: 'AW', avatarColor: '#8B5CF6',  source: 'LinkedIn',      score: 76,  status: 'Contacted', owner: { name: 'Lisa P.',   avatar: 'LP', color: '#16A34A' }, value: 38000,  lastContact: 'Apr 25' },
    { id: 13, company: 'MetroTech',       contact: 'Liam Adams',    initials: 'LA', avatarColor: '#EA580C',  source: 'Inbound',       score: 68,  status: 'New',       owner: { name: 'Marcus C.', avatar: 'MC', color: '#EA580C' }, value: 51000,  lastContact: 'Apr 22' },
    { id: 14, company: 'SurePath',        contact: 'Mia Turner',    initials: 'MT', avatarColor: '#EC4899',  source: 'Referral',      score: 85,  status: 'Qualified', owner: { name: 'Sarah K.',  avatar: 'SK', color: '#7C3AED' }, value: 95000,  lastContact: 'Apr 20' },
    { id: 15, company: 'FuturePath',      contact: 'Noah Davis',    initials: 'ND', avatarColor: '#94A3B8',  source: 'Website',       score: 42,  status: 'Lost',      owner: { name: 'Ali H.',    avatar: 'AH', color: '#3B82F6' }, value: 15000,  lastContact: 'Apr 18' },
];

function ScoreBar({ score }: { score: number }) {
    const color = score >= 80 ? '#16A34A' : score >= 50 ? '#D97706' : '#DC2626';
    const bg    = score >= 80 ? '#DCFCE7' : score >= 50 ? '#FEF3C7' : '#FEE2E2';
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 64, height: 6, borderRadius: 3, background: '#F1F5F9', overflow: 'hidden', flexShrink: 0 }}>
                <div style={{ height: '100%', borderRadius: 3, width: `${score}%`, background: color }} />
            </div>
            <span style={{
                fontWeight: 700, fontSize: 12, color,
                background: bg, border: `1px solid ${color}40`,
                borderRadius: 6, padding: '1px 7px',
            }}>{score}</span>
        </div>
    );
}

function StatusBadge({ status }: { status: Lead['status'] }) {
    const cfg = statusConfig[status];
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center',
            background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
            borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
        }}>{status}</span>
    );
}

function AddLeadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [form] = Form.useForm();
    return (
        <Modal open={open} onCancel={onClose} footer={null} width={520}
            title={<span style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>Add New Lead</span>}>
            <Form form={form} layout="vertical" requiredMark={false} style={{ marginTop: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                    <Form.Item label="Company Name" name="company" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Acme Corp" size="large" />
                    </Form.Item>
                    <Form.Item label="Contact Name" name="contact" rules={[{ required: true }]}>
                        <Input placeholder="Full name" size="large" />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ type: 'email' }]}>
                        <Input placeholder="email@company.com" size="large" />
                    </Form.Item>
                    <Form.Item label="Phone" name="phone">
                        <Input placeholder="+1 (555) 000-0000" size="large" />
                    </Form.Item>
                    <Form.Item label="Source" name="source">
                        <Select size="large" placeholder="Lead source…"
                            options={['Inbound', 'Referral', 'Cold Outreach', 'LinkedIn', 'Website'].map(v => ({ label: v, value: v }))} />
                    </Form.Item>
                    <Form.Item label="Estimated Value ($)" name="value">
                        <Input placeholder="e.g. 50000" size="large" type="number" />
                    </Form.Item>
                    <Form.Item label="Owner" name="owner">
                        <Select size="large" placeholder="Assign owner…"
                            options={['Sarah K.', 'Ali H.', 'Marcus C.', 'Lisa P.', 'Sophie T.'].map(v => ({ label: v, value: v }))} />
                    </Form.Item>
                    <Form.Item label="Status" name="status">
                        <Select size="large" placeholder="Status…"
                            options={['New', 'Contacted', 'Qualified', 'Converted', 'Lost'].map(v => ({ label: v, value: v }))} />
                    </Form.Item>
                </div>
                <Form.Item
                    label={
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            Notes / Description
                            <span style={{ fontSize: 11, fontWeight: 400, color: '#9CA3AF' }}>optional</span>
                        </span>
                    }
                    name="notes"
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="Add any relevant notes, context, or next steps for this lead…"
                        style={{ resize: 'none', fontSize: 13 }}
                        maxLength={500}
                        showCount
                    />
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={() => { form.resetFields(); onClose(); }}
                        style={{ background: '#7C3AED', borderColor: '#7C3AED' }}>
                        Add Lead
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

const tabs = ['All', 'New', 'Contacted', 'Qualified', 'Converted', 'Lost'] as const;
type Tab = typeof tabs[number];

const sources = ['All Sources', 'Inbound', 'Referral', 'Cold Outreach', 'LinkedIn', 'Website'];

const COL = { lead: 220, source: 140, score: 140, status: 130, owner: 150, value: 110, last: 130, actions: 48 };

export default function CRMLeads() {
    const [showAdd, setShowAdd] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('All');
    const [search, setSearch] = useState('');
    const [sourceFilter, setSourceFilter] = useState('All Sources');

    const filtered = mockLeads.filter(l => {
        const matchTab    = activeTab === 'All' || l.status === activeTab;
        const matchSource = sourceFilter === 'All Sources' || l.source === sourceFilter;
        const matchSearch = l.company.toLowerCase().includes(search.toLowerCase()) ||
                            l.contact.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSource && matchSearch;
    });

    const hotLeads     = mockLeads.filter(l => l.score >= 80 && l.status !== 'Lost' && l.status !== 'Converted').length;
    const newThisWeek  = mockLeads.filter(l => ['Today', 'Yesterday', 'May 9', 'May 10'].includes(l.lastContact)).length;
    const converted    = mockLeads.filter(l => l.status === 'Converted').length;
    const convRate     = Math.round((converted / mockLeads.length) * 100);

    return (
        <AppLayout title="Leads">
            <Head title="Leads" />
            <AddLeadModal open={showAdd} onClose={() => setShowAdd(false)} />

            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>Leads</h1>
                    <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>{mockLeads.length} total leads across all stages</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button icon={<Upload size={14} />} size="large" style={{ borderRadius: 8, height: 40 }}>Import</Button>
                    <Button type="primary" icon={<Plus size={15} />} size="large" onClick={() => setShowAdd(true)}
                        style={{ background: '#7C3AED', borderColor: '#7C3AED', borderRadius: 8, fontWeight: 600, height: 40 }}>
                        Add Lead
                    </Button>
                </div>
            </div>

            {/* Summary stats */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24,
            }}>
                {[
                    { label: 'Total Leads',      value: mockLeads.length, icon: <Users size={18} color="#7C3AED" />,     bg: '#F5F3FF', iconBg: '#EDE9FE', color: '#7C3AED' },
                    { label: 'New This Week',     value: newThisWeek,      icon: <Star size={18} color="#3B82F6" />,      bg: '#EFF6FF', iconBg: '#DBEAFE', color: '#3B82F6' },
                    { label: 'Conversion Rate',  value: `${convRate}%`,   icon: <TrendingUp size={18} color="#16A34A" />, bg: '#F0FDF4', iconBg: '#DCFCE7', color: '#16A34A' },
                    { label: 'Hot Leads',         value: hotLeads,         icon: <Flame size={18} color="#EA580C" />,     bg: '#FFF7ED', iconBg: '#FFEDD5', color: '#EA580C' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: s.bg, borderRadius: 12, padding: '16px 20px',
                        border: `1px solid ${s.color}20`, display: 'flex', alignItems: 'center', gap: 14,
                    }}>
                        <div style={{ width: 42, height: 42, borderRadius: 10, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {s.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter tabs + search bar */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', overflow: 'hidden', boxShadow: '0 1px 4px rgba(124,58,237,0.06)' }}>
                {/* Tabs + toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex' }}>
                        {tabs.map(tab => {
                            const count = tab === 'All' ? mockLeads.length : mockLeads.filter(l => l.status === tab).length;
                            return (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        padding: '14px 16px', fontSize: 13, fontWeight: 600,
                                        color: activeTab === tab ? '#7C3AED' : '#64748B',
                                        borderBottom: activeTab === tab ? '2px solid #7C3AED' : '2px solid transparent',
                                        display: 'flex', alignItems: 'center', gap: 6,
                                    }}>
                                    {tab}
                                    <span style={{
                                        background: activeTab === tab ? '#EDE9FE' : '#F1F5F9',
                                        color: activeTab === tab ? '#7C3AED' : '#94A3B8',
                                        borderRadius: 10, padding: '0px 7px', fontSize: 11, fontWeight: 700,
                                    }}>{count}</span>
                                </button>
                            );
                        })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '0 12px', height: 34, width: 220 }}>
                            <Search size={13} color="#94A3B8" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads…"
                                style={{ border: 'none', outline: 'none', fontSize: 13, color: '#374151', background: 'transparent', flex: 1 }} />
                        </div>
                        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
                            style={{ height: 34, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 10px', fontSize: 13, color: '#374151', background: '#fff', cursor: 'pointer', outline: 'none' }}>
                            {sources.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <Button icon={<Filter size={13} />} style={{ borderRadius: 8, fontSize: 12, height: 34 }}>Filter</Button>
                    </div>
                </div>

                {/* Table header */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 40, background: '#FAFAFA', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ width: COL.lead,    fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>LEAD</div>
                    <div style={{ width: COL.source,  fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>SOURCE</div>
                    <div style={{ width: COL.score,   fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>SCORE</div>
                    <div style={{ width: COL.status,  fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>STATUS</div>
                    <div style={{ width: COL.owner,   fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>OWNER</div>
                    <div style={{ width: COL.value,   fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: 'right' }}>VALUE</div>
                    <div style={{ flex: 1,            fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>LAST CONTACT</div>
                    <div style={{ width: COL.actions }} />
                </div>

                {/* Table rows */}
                {filtered.map((lead, i) => (
                    <div key={lead.id}
                        style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 58, borderBottom: i < filtered.length - 1 ? '1px solid #F8F5FF' : 'none' }}
                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#FDFCFF'}
                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                    >
                        {/* Lead */}
                        <div style={{ width: COL.lead, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Avatar size={32} style={{ background: lead.avatarColor, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{lead.initials}</Avatar>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', lineHeight: 1.3 }}>{lead.company}</div>
                                <div style={{ fontSize: 11, color: '#94A3B8' }}>{lead.contact}</div>
                            </div>
                        </div>

                        {/* Source */}
                        <div style={{ width: COL.source }}>
                            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{lead.source}</span>
                        </div>

                        {/* Score */}
                        <div style={{ width: COL.score }}>
                            <ScoreBar score={lead.score} />
                        </div>

                        {/* Status */}
                        <div style={{ width: COL.status }}>
                            <StatusBadge status={lead.status} />
                        </div>

                        {/* Owner */}
                        <div style={{ width: COL.owner, display: 'flex', alignItems: 'center', gap: 7 }}>
                            <Avatar size={24} style={{ background: lead.owner.color, fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{lead.owner.avatar}</Avatar>
                            <span style={{ fontSize: 12, color: '#374151' }}>{lead.owner.name}</span>
                        </div>

                        {/* Value */}
                        <div style={{ width: COL.value, textAlign: 'right' }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                                ${(lead.value / 1000).toFixed(0)}k
                            </span>
                        </div>

                        {/* Last Contact */}
                        <div style={{ flex: 1 }}>
                            <span style={{ fontSize: 12, color: lead.lastContact === 'Today' ? '#7C3AED' : '#94A3B8', fontWeight: lead.lastContact === 'Today' ? 600 : 400 }}>
                                {lead.lastContact}
                            </span>
                        </div>

                        {/* Actions */}
                        <div style={{ width: COL.actions, display: 'flex', justifyContent: 'center' }}>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1', padding: 4, borderRadius: 6, display: 'flex' }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#64748B')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#CBD5E1')}
                            ><MoreHorizontal size={16} /></button>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div style={{ padding: '48px 0', textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
                        No leads match your current filters.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
