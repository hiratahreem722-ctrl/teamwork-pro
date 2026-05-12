import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Modal, Form, Input, Select, Button, Avatar } from 'antd';
import { Plus, Search, MoreHorizontal, Filter, Mail, Phone, Users } from 'lucide-react';
import { useState } from 'react';

interface Contact {
    id: number;
    name: string;
    initials: string;
    avatarColor: string;
    company: string;
    role: string;
    email: string;
    phone: string;
    linkedClient: string;
    linkedClientColor: string;
    lastInteraction: string;
    interactionType: 'Email' | 'Call' | 'Meeting' | 'Demo';
}

const interactionColors: Record<string, { bg: string; color: string }> = {
    'Email':   { bg: '#EFF6FF', color: '#3B82F6' },
    'Call':    { bg: '#F0FDF4', color: '#16A34A' },
    'Meeting': { bg: '#F5F3FF', color: '#7C3AED' },
    'Demo':    { bg: '#FFF7ED', color: '#EA580C' },
};

const mockContacts: Contact[] = [
    {
        id: 1,
        name: 'Nina Watkins',        initials: 'NW', avatarColor: '#7C3AED',
        company: 'Massive Dynamic',  role: 'VP of Engineering',
        email: 'n.watkins@massive.com', phone: '+1 (415) 555-0191',
        linkedClient: 'Massive Dynamic', linkedClientColor: '#3B82F6',
        lastInteraction: 'Today',        interactionType: 'Meeting',
    },
    {
        id: 2,
        name: 'Paul Ingram',         initials: 'PI', avatarColor: '#3B82F6',
        company: 'Delta Finance',    role: 'CFO',
        email: 'p.ingram@deltafinance.io', phone: '+1 (212) 555-0147',
        linkedClient: 'Delta Finance',  linkedClientColor: '#F59E0B',
        lastInteraction: 'Yesterday',    interactionType: 'Call',
    },
    {
        id: 3,
        name: 'Elena Fisher',        initials: 'EF', avatarColor: '#16A34A',
        company: 'DataDrive Corp',   role: 'Head of Product',
        email: 'e.fisher@datadrive.com', phone: '+1 (650) 555-0238',
        linkedClient: 'DataDrive Corp', linkedClientColor: '#8B5CF6',
        lastInteraction: 'May 9',        interactionType: 'Demo',
    },
    {
        id: 4,
        name: 'Raj Sunder',          initials: 'RS', avatarColor: '#EA580C',
        company: 'EduTech Global',   role: 'CEO',
        email: 'r.sunder@edutech.co', phone: '+44 20 7946 0813',
        linkedClient: 'EduTech Global', linkedClientColor: '#10B981',
        lastInteraction: 'May 8',        interactionType: 'Email',
    },
    {
        id: 5,
        name: 'Tomas Reyes',         initials: 'TR', avatarColor: '#F59E0B',
        company: 'CloudFirst',       role: 'CTO',
        email: 't.reyes@cloudfirst.dev', phone: '+1 (408) 555-0362',
        linkedClient: 'CloudFirst',     linkedClientColor: '#0EA5E9',
        lastInteraction: 'May 7',        interactionType: 'Call',
    },
    {
        id: 6,
        name: 'Janet Cross',         initials: 'JC', avatarColor: '#EC4899',
        company: 'MediCare Plus',    role: 'Director of Operations',
        email: 'j.cross@medicareplus.org', phone: '+1 (617) 555-0174',
        linkedClient: 'MediCare Plus',  linkedClientColor: '#EF4444',
        lastInteraction: 'May 6',        interactionType: 'Meeting',
    },
    {
        id: 7,
        name: 'Hans Mueller',        initials: 'HM', avatarColor: '#64748B',
        company: 'SmartFactory',     role: 'Plant Manager',
        email: 'h.mueller@smartfactory.de', phone: '+49 89 555 0291',
        linkedClient: 'SmartFactory',   linkedClientColor: '#64748B',
        lastInteraction: 'May 5',        interactionType: 'Demo',
    },
    {
        id: 8,
        name: 'Cindy Bloom',         initials: 'CB', avatarColor: '#0EA5E9',
        company: 'RetailMax',        role: 'Procurement Lead',
        email: 'c.bloom@retailmax.com', phone: '+1 (312) 555-0489',
        linkedClient: 'RetailMax',      linkedClientColor: '#F97316',
        lastInteraction: 'May 4',        interactionType: 'Email',
    },
    {
        id: 9,
        name: 'Omar Patel',          initials: 'OP', avatarColor: '#8B5CF6',
        company: 'FinanceFlow',      role: 'Business Dev Manager',
        email: 'o.patel@financeflow.io', phone: '+1 (646) 555-0315',
        linkedClient: 'FinanceFlow',    linkedClientColor: '#7C3AED',
        lastInteraction: 'May 3',        interactionType: 'Call',
    },
    {
        id: 10,
        name: 'Brian Cole',          initials: 'BC', avatarColor: '#10B981',
        company: 'TechVision Inc',   role: 'IT Director',
        email: 'b.cole@techvision.com', phone: '+1 (512) 555-0623',
        linkedClient: 'TechVision Inc', linkedClientColor: '#3B82F6',
        lastInteraction: 'Apr 30',       interactionType: 'Meeting',
    },
];

function InteractionBadge({ type }: { type: Contact['interactionType'] }) {
    const cfg = interactionColors[type];
    return (
        <span style={{
            background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30`,
            borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600,
        }}>{type}</span>
    );
}

function AddContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [form] = Form.useForm();
    return (
        <Modal open={open} onCancel={onClose} footer={null} width={520}
            title={<span style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>Add Contact</span>}>
            <Form form={form} layout="vertical" requiredMark={false} style={{ marginTop: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                    <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Jane Smith" size="large" />
                    </Form.Item>
                    <Form.Item label="Company" name="company" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Acme Corp" size="large" />
                    </Form.Item>
                    <Form.Item label="Role / Title" name="role">
                        <Input placeholder="e.g. VP of Sales" size="large" />
                    </Form.Item>
                    <Form.Item label="Linked Client" name="linkedClient">
                        <Select size="large" placeholder="Select client…"
                            options={mockContacts.map(c => ({ label: c.linkedClient, value: c.linkedClient }))
                                .filter((v, i, a) => a.findIndex(x => x.value === v.value) === i)} />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ type: 'email' }]}>
                        <Input placeholder="email@company.com" size="large" />
                    </Form.Item>
                    <Form.Item label="Phone" name="phone">
                        <Input placeholder="+1 (555) 000-0000" size="large" />
                    </Form.Item>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={() => { form.resetFields(); onClose(); }}
                        style={{ background: '#7C3AED', borderColor: '#7C3AED' }}>
                        Add Contact
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

const COL = { contact: 230, role: 180, email: 210, phone: 160, client: 160, last: 150, actions: 48 };

export default function CRMContacts() {
    const [showAdd, setShowAdd] = useState(false);
    const [search, setSearch] = useState('');

    const filtered = mockContacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout title="Contacts">
            <Head title="Contacts" />
            <AddContactModal open={showAdd} onClose={() => setShowAdd(false)} />

            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>Contacts</h1>
                    <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>{mockContacts.length} contacts across {new Set(mockContacts.map(c => c.linkedClient)).size} clients</p>
                </div>
                <Button type="primary" icon={<Plus size={15} />} size="large" onClick={() => setShowAdd(true)}
                    style={{ background: '#7C3AED', borderColor: '#7C3AED', borderRadius: 8, fontWeight: 600, height: 40 }}>
                    Add Contact
                </Button>
            </div>

            {/* Summary strip */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 24, padding: '16px 24px', background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', boxShadow: '0 1px 4px rgba(124,58,237,0.06)' }}>
                {[
                    { label: 'Total Contacts', value: mockContacts.length },
                    { label: 'Linked Clients', value: new Set(mockContacts.map(c => c.linkedClient)).size },
                    { label: 'Contacted Today', value: mockContacts.filter(c => c.lastInteraction === 'Today').length, green: true },
                    { label: 'Pending Follow-up', value: mockContacts.filter(c => ['Apr 30', 'May 3', 'May 4'].includes(c.lastInteraction)).length, amber: true },
                ].map(s => (
                    <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
                        <span style={{ fontSize: 22, fontWeight: 700, color: s.green ? '#16A34A' : s.amber ? '#D97706' : '#0F172A', lineHeight: 1.2 }}>{s.value}</span>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '0 12px', height: 36, width: 260 }}>
                    <Search size={14} color="#94A3B8" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts…"
                        style={{ border: 'none', outline: 'none', fontSize: 14, color: '#374151', background: 'transparent', flex: 1 }} />
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <Button icon={<Filter size={14} />} style={{ borderRadius: 8, fontSize: 13 }}>Filter</Button>
                </div>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', overflow: 'hidden', boxShadow: '0 1px 4px rgba(124,58,237,0.06)' }}>
                {/* Table header */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 44, background: '#FAFAFA', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ width: COL.contact, fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>CONTACT</div>
                    <div style={{ width: COL.role,    fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>ROLE</div>
                    <div style={{ width: COL.email,   fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>EMAIL</div>
                    <div style={{ width: COL.phone,   fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>PHONE</div>
                    <div style={{ width: COL.client,  fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>LINKED CLIENT</div>
                    <div style={{ flex: 1,            fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>LAST INTERACTION</div>
                    <div style={{ width: COL.actions }} />
                </div>

                {/* Table rows */}
                {filtered.map((contact, i) => (
                    <div key={contact.id}
                        style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 62, borderBottom: i < filtered.length - 1 ? '1px solid #F8F5FF' : 'none' }}
                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#FDFCFF'}
                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                    >
                        {/* Contact */}
                        <div style={{ width: COL.contact, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Avatar size={34} style={{ background: contact.avatarColor, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{contact.initials}</Avatar>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', lineHeight: 1.3 }}>{contact.name}</div>
                                <div style={{ fontSize: 11, color: '#94A3B8' }}>{contact.company}</div>
                            </div>
                        </div>

                        {/* Role */}
                        <div style={{ width: COL.role }}>
                            <span style={{ fontSize: 13, color: '#374151' }}>{contact.role}</span>
                        </div>

                        {/* Email */}
                        <div style={{ width: COL.email }}>
                            <a href={`mailto:${contact.email}`}
                                style={{ fontSize: 12, color: '#7C3AED', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}
                                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.textDecoration = 'underline')}
                                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.textDecoration = 'none')}
                            >
                                <Mail size={12} />
                                {contact.email}
                            </a>
                        </div>

                        {/* Phone */}
                        <div style={{ width: COL.phone }}>
                            <a href={`tel:${contact.phone}`}
                                style={{ fontSize: 12, color: '#64748B', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}
                                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#0F172A')}
                                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#64748B')}
                            >
                                <Phone size={12} />
                                {contact.phone}
                            </a>
                        </div>

                        {/* Linked Client */}
                        <div style={{ width: COL.client }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                <div style={{
                                    width: 22, height: 22, borderRadius: 5, background: contact.linkedClientColor,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>{contact.linkedClient[0]}</span>
                                </div>
                                <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{contact.linkedClient}</span>
                            </div>
                        </div>

                        {/* Last Interaction */}
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <InteractionBadge type={contact.interactionType} />
                            <span style={{ fontSize: 12, color: contact.lastInteraction === 'Today' ? '#7C3AED' : '#94A3B8', fontWeight: contact.lastInteraction === 'Today' ? 600 : 400 }}>
                                {contact.lastInteraction}
                            </span>
                        </div>

                        {/* Actions */}
                        <div style={{ width: COL.actions, display: 'flex', justifyContent: 'center' }}>
                            <button
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1', padding: 4, borderRadius: 6, display: 'flex' }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#64748B')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#CBD5E1')}
                            ><MoreHorizontal size={16} /></button>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div style={{ padding: '48px 0', textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
                        No contacts match your search.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
