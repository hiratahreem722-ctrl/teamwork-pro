import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage } from '@inertiajs/react';
import { Modal, Input, Form, message } from 'antd';
import {
    Building2, Settings, Bell, Shield, LayoutGrid,
    Plus, Pencil, Trash2, Lock, CheckCircle, X,
    GripVertical,
} from 'lucide-react';
import { useState } from 'react';
import type { PageProps } from '@/types';
import { useDepartments, DEPT_COLORS, BUILT_IN_DEPARTMENTS, Department } from '@/hooks/useDepartments';

// ── Styles ────────────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #EDE9FE',
    borderRadius: 12,
    boxShadow: '0 1px 3px rgba(124,58,237,0.06)',
};

const NAV = [
    { key: 'general',     label: 'General',      icon: Settings   },
    { key: 'departments', label: 'Departments',   icon: LayoutGrid },
    { key: 'notif',       label: 'Notifications', icon: Bell       },
    { key: 'security',    label: 'Security',      icon: Shield     },
];

// ── Department form modal ─────────────────────────────────────────────────────
interface DeptModalProps {
    open: boolean;
    initial?: Department | null;
    onSave: (data: { name: string; color: string; description: string }) => void;
    onClose: () => void;
}

function DeptModal({ open, initial, onSave, onClose }: DeptModalProps) {
    const [form]  = Form.useForm();
    const [color, setColor] = useState(initial?.color ?? DEPT_COLORS[0]);

    const handleOpen = () => {
        setColor(initial?.color ?? DEPT_COLORS[0]);
        form.setFieldsValue({
            name:        initial?.name ?? '',
            description: initial?.description ?? '',
        });
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            onSave({ name: values.name, color, description: values.description ?? '' });
            form.resetFields();
        });
    };

    return (
        <Modal
            open={open}
            afterOpenChange={o => { if (o) handleOpen(); }}
            onCancel={onClose}
            footer={null}
            width={480}
            styles={{ content: { borderRadius: 14, padding: 0, overflow: 'hidden' }, body: { padding: 0 } }}
            closable={false}
        >
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #F5F3FF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LayoutGrid size={16} color="#fff" />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#1E1B4B' }}>
                            {initial ? 'Edit Department' : 'New Department'}
                        </p>
                        <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>
                            {initial ? 'Update name, colour or description' : 'Add a custom department to your company'}
                        </p>
                    </div>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
                    <X size={18} />
                </button>
            </div>

            <div style={{ padding: '20px 24px' }}>
                <Form form={form} layout="vertical" requiredMark={false}>
                    <Form.Item name="name" label={<span style={{ fontWeight: 600, fontSize: 13 }}>Department Name</span>}
                        rules={[{ required: true, message: 'Name is required' }, { min: 2, message: 'At least 2 characters' }]}>
                        <Input placeholder="e.g. Customer Success" size="large" style={{ borderRadius: 8 }} />
                    </Form.Item>

                    <Form.Item name="description" label={<span style={{ fontWeight: 600, fontSize: 13 }}>Description</span>}>
                        <Input.TextArea rows={2} placeholder="What does this department do?" style={{ borderRadius: 8 }} />
                    </Form.Item>

                    <Form.Item label={<span style={{ fontWeight: 600, fontSize: 13 }}>Department Colour</span>}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {DEPT_COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    style={{
                                        width: 28, height: 28, borderRadius: 7, background: c, border: 'none',
                                        cursor: 'pointer', outline: color === c ? `3px solid ${c}` : 'none',
                                        outlineOffset: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'transform 0.1s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
                                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                    {color === c && <CheckCircle size={14} color="#fff" />}
                                </button>
                            ))}
                        </div>
                    </Form.Item>
                </Form>

                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid #F5F3FF', marginTop: 4 }}>
                    <button onClick={onClose}
                        style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: 13, color: '#374151' }}>
                        Cancel
                    </button>
                    <button onClick={handleSave}
                        style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${color}, ${color}cc)`, cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#fff', boxShadow: `0 4px 14px ${color}55` }}>
                        {initial ? 'Save Changes' : 'Create Department'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// ── Delete confirm modal ──────────────────────────────────────────────────────
function DeleteModal({ dept, onConfirm, onClose }: { dept: Department | null; onConfirm: () => void; onClose: () => void }) {
    return (
        <Modal open={!!dept} onCancel={onClose} footer={null} width={400}
            styles={{ content: { borderRadius: 14 }, body: { padding: '24px' } }} closable={false}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <Trash2 size={22} color="#DC2626" />
                </div>
                <p style={{ fontWeight: 700, fontSize: 16, color: '#1E1B4B', margin: '0 0 6px' }}>Delete "{dept?.name}"?</p>
                <p style={{ color: '#64748B', fontSize: 13, margin: '0 0 20px' }}>
                    This will remove the department from your company. Employees currently assigned to it won't be deleted, but their department will become unset.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <button onClick={onClose}
                        style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: 13 }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm}
                        style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#DC2626', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                        Delete Department
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// ── Departments Panel ─────────────────────────────────────────────────────────
function DepartmentsPanel({ tenantKey }: { tenantKey: string }) {
    const { departments, addDepartment, updateDepartment, deleteDepartment } = useDepartments(tenantKey);
    const [modalOpen, setModalOpen]   = useState(false);
    const [editing,   setEditing]     = useState<Department | null>(null);
    const [deleting,  setDeleting]    = useState<Department | null>(null);
    const [search,    setSearch]      = useState('');

    const filtered = departments.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase())
    );

    const builtIn = filtered.filter(d => d.isBuiltIn && !d.id.startsWith('override_'));
    const custom  = filtered.filter(d => !d.isBuiltIn);

    const handleSave = (data: { name: string; color: string; description: string }) => {
        if (editing) {
            updateDepartment(editing.id, data);
            message.success(`"${data.name}" updated`);
        } else {
            addDepartment({ ...data, headCount: 0 });
            message.success(`"${data.name}" department created`);
        }
        setModalOpen(false);
        setEditing(null);
    };

    const handleDelete = () => {
        if (!deleting) return;
        const ok = deleteDepartment(deleting.id);
        if (ok) message.success(`"${deleting.name}" deleted`);
        setDeleting(null);
    };

    const DeptCard = ({ dept }: { dept: Department }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 10, border: `1px solid ${dept.isBuiltIn && !dept.id.startsWith('custom') ? '#EDE9FE' : '#E5E7EB'}`, background: '#FDFCFF', transition: 'box-shadow 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 10px rgba(124,58,237,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>

            {/* Drag handle placeholder */}
            <GripVertical size={14} color="#D1D5DB" style={{ flexShrink: 0, cursor: 'grab' }} />

            {/* Colour dot */}
            <div style={{ width: 36, height: 36, borderRadius: 9, background: dept.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 3px 10px ${dept.color}44` }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>{dept.name[0]}</span>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#1E1B4B' }}>{dept.name}</span>
                    {dept.isBuiltIn && (
                        <span style={{ fontSize: 10, fontWeight: 700, background: '#F5F3FF', color: '#7C3AED', border: '1px solid #EDE9FE', borderRadius: 8, padding: '1px 7px', letterSpacing: '0.05em' }}>
                            BUILT-IN
                        </span>
                    )}
                </div>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {dept.description || 'No description'}
                </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button
                    onClick={() => { setEditing(dept); setModalOpen(true); }}
                    title="Edit department"
                    style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid #EDE9FE', background: '#F5F3FF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#EDE9FE'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#F5F3FF'; }}>
                    <Pencil size={13} />
                </button>

                {dept.isBuiltIn ? (
                    <div title="Built-in departments cannot be deleted"
                        style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid #F1F5F9', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1' }}>
                        <Lock size={13} />
                    </div>
                ) : (
                    <button
                        onClick={() => setDeleting(dept)}
                        title="Delete department"
                        style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid #FEE2E2', background: '#FEF2F2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#FEF2F2'; }}>
                        <Trash2 size={13} />
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1E1B4B' }}>Department Management</h2>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B' }}>
                        Create and manage departments for your company. Built-in departments are provided by default and cannot be removed.
                    </p>
                </div>
                <button
                    onClick={() => { setEditing(null); setModalOpen(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13, boxShadow: '0 4px 12px rgba(124,58,237,0.3)', flexShrink: 0 }}>
                    <Plus size={15} /> New Department
                </button>
            </div>

            {/* Stats bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                    { label: 'Total',    value: departments.length,                              color: '#7C3AED', bg: '#F5F3FF' },
                    { label: 'Built-in', value: BUILT_IN_DEPARTMENTS.length,                    color: '#0369A1', bg: '#EFF6FF' },
                    { label: 'Custom',   value: departments.length - BUILT_IN_DEPARTMENTS.length, color: '#059669', bg: '#ECFDF5' },
                ].map(s => (
                    <div key={s.label} style={{ ...card, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <LayoutGrid size={16} color={s.color} />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</p>
                            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748B' }}>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 9, padding: '8px 14px', marginBottom: 20 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search departments..."
                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%', color: '#1E1B4B' }}
                />
                {search && (
                    <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, display: 'flex' }}>
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Built-in departments */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Lock size={13} color="#7C3AED" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Built-in Departments</span>
                    <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 400 }}>— always available, edit name &amp; colour only</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 10 }}>
                    {builtIn.length > 0
                        ? builtIn.map(d => <DeptCard key={d.id} dept={d} />)
                        : <p style={{ color: '#94A3B8', fontSize: 13 }}>No built-in departments match your search.</p>
                    }
                </div>
            </div>

            {/* Custom departments */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Plus size={13} color="#059669" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Custom Departments</span>
                    <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 400 }}>— created by your company</span>
                </div>
                {custom.length === 0 ? (
                    <div style={{ border: '2px dashed #DDD6FE', borderRadius: 12, padding: '32px 20px', textAlign: 'center', background: '#FDFCFF' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                            <LayoutGrid size={22} color="#C4B5FD" />
                        </div>
                        <p style={{ fontWeight: 600, color: '#7C3AED', margin: '0 0 4px' }}>No custom departments yet</p>
                        <p style={{ fontSize: 13, color: '#94A3B8', margin: '0 0 16px' }}>Create departments specific to your company's structure.</p>
                        <button
                            onClick={() => { setEditing(null); setModalOpen(true); }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                            <Plus size={14} /> Create First Department
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 10 }}>
                        {custom.map(d => <DeptCard key={d.id} dept={d} />)}
                    </div>
                )}
            </div>

            {/* Modals */}
            <DeptModal
                open={modalOpen}
                initial={editing}
                onSave={handleSave}
                onClose={() => { setModalOpen(false); setEditing(null); }}
            />
            <DeleteModal
                dept={deleting}
                onConfirm={handleDelete}
                onClose={() => setDeleting(null)}
            />
        </div>
    );
}

// ── General Panel (placeholder) ───────────────────────────────────────────────
function GeneralPanel() {
    return (
        <div>
            <h2 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700, color: '#1E1B4B' }}>General Settings</h2>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748B' }}>Manage your team profile and preferences.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
                {[
                    { label: 'Company Name',  placeholder: 'Acme Corp' },
                    { label: 'Team Name',     placeholder: 'Engineering Team' },
                    { label: 'Contact Email', placeholder: 'team@acmecorp.com' },
                    { label: 'Phone',         placeholder: '+1 555 000 0000' },
                ].map(f => (
                    <div key={f.label} style={{ marginBottom: 14 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>{f.label}</label>
                        <input placeholder={f.placeholder} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13, color: '#1E1B4B', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                ))}
            </div>
            <button style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                Save Changes
            </button>
        </div>
    );
}

function NotifPanel() {
    return (
        <div>
            <h2 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700, color: '#1E1B4B' }}>Notification Preferences</h2>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748B' }}>Choose what events trigger notifications for your team.</p>
            {[
                { label: 'New task assigned',     desc: 'Notify when a task is assigned to a team member' },
                { label: 'Leave request received', desc: 'Alert when an employee submits a leave request' },
                { label: 'Project deadline',       desc: 'Remind 3 days before a project due date' },
                { label: 'Timesheet submitted',    desc: 'Notify when a timesheet is submitted for approval' },
                { label: 'Payroll run complete',   desc: 'Alert when payroll finishes processing' },
            ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #F5F3FF' }}>
                    <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: '#1E1B4B' }}>{item.label}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94A3B8' }}>{item.desc}</p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: 38, height: 20, flexShrink: 0 }}>
                        <input type="checkbox" defaultChecked={i < 3} style={{ opacity: 0, width: 0, height: 0 }} />
                        <span style={{ position: 'absolute', inset: 0, borderRadius: 20, background: i < 3 ? '#7C3AED' : '#E5E7EB', cursor: 'pointer', transition: 'background 0.2s' }} />
                    </label>
                </div>
            ))}
        </div>
    );
}

function SecurityPanel() {
    return (
        <div>
            <h2 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700, color: '#1E1B4B' }}>Security Settings</h2>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748B' }}>Configure access control and authentication options.</p>
            {[
                { label: 'Two-factor authentication', desc: 'Require 2FA for all manager logins', active: true  },
                { label: 'Session timeout',           desc: 'Auto-logout after 30 minutes of inactivity', active: true  },
                { label: 'IP allowlist',              desc: 'Restrict access to specific IP ranges', active: false },
                { label: 'Audit log',                 desc: 'Log all sensitive actions for compliance', active: true  },
            ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #F5F3FF' }}>
                    <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: '#1E1B4B' }}>{item.label}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94A3B8' }}>{item.desc}</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, background: item.active ? '#DCFCE7' : '#FEE2E2', color: item.active ? '#16A34A' : '#DC2626', borderRadius: 10, padding: '2px 10px' }}>
                        {item.active ? 'ON' : 'OFF'}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ManagerSettings() {
    const { auth } = usePage<PageProps>().props;
    const tenantKey = String(auth?.user?.tenant_id ?? auth?.user?.id ?? 'default');

    const [activeSection, setActiveSection] = useState('departments');

    const panels: Record<string, React.ReactNode> = {
        general:     <GeneralPanel />,
        departments: <DepartmentsPanel tenantKey={tenantKey} />,
        notif:       <NotifPanel />,
        security:    <SecurityPanel />,
    };

    return (
        <AppLayout title="Settings">
            <Head title="Manager Settings" />

            {/* Page header */}
            <div style={{ borderRadius: 16, marginBottom: 24, padding: '24px 28px', background: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: -30, left: 180, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Settings size={13} color="#C4B5FD" />
                        <span style={{ color: '#C4B5FD', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Manager</span>
                    </div>
                    <p style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 3px' }}>Team Settings</p>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: 0 }}>Manage departments, notifications and team preferences.</p>
                </div>
            </div>

            {/* Two-column layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'start' }}>

                {/* Left nav */}
                <div style={{ ...card, padding: 8, position: 'sticky', top: 80 }}>
                    {NAV.map(n => {
                        const isActive = activeSection === n.key;
                        const Icon = n.icon;
                        return (
                            <button
                                key={n.key}
                                onClick={() => setActiveSection(n.key)}
                                style={{ width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2, background: isActive ? '#EDE9FE' : 'transparent', color: isActive ? '#7C3AED' : '#374151', fontWeight: isActive ? 600 : 400, fontSize: 14, transition: 'background 0.15s' }}
                                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#FAF8FF'; }}
                                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                            >
                                <Icon size={15} color={isActive ? '#7C3AED' : '#94A3B8'} />
                                {n.label}
                                {n.key === 'departments' && (
                                    <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, background: isActive ? '#DDD6FE' : '#F5F3FF', color: '#7C3AED', borderRadius: 8, padding: '1px 7px' }}>
                                        NEW
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Right panel */}
                <div style={{ ...card, padding: '28px 32px' }}>
                    {panels[activeSection]}
                </div>
            </div>
        </AppLayout>
    );
}
