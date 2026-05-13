import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { Table, Tag, Avatar, Button, Tooltip, Popconfirm, Typography, Tabs, Empty } from 'antd';
import { UserPlus, Mail, Crown, Users, Trash2, FolderKanban } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from 'antd';
import { Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// Role-picker and per-role wizards
import { RolePickerModal, AddManagerModal } from '@/Pages/Team/Index';
import { AddEmployeeModal }                 from '@/Pages/HR/Employees';
import { AddClientModal }                   from '@/Pages/Clients/Index';

const { Text } = Typography;

const DEFAULT_DEPTS = [
    'Engineering','Design','Operations','HR','Finance',
    'Sales','Marketing','Analytics','Product','QA',
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface TeamMember {
    id:          number;
    name:        string;
    email:       string;
    role:        'manager' | 'employee' | 'client';
    job_title?:  string;
    department?: string;
    created_at:  string;
    assigned_project_ids?: number[];
}

interface ProjectOption {
    id:     number;
    name:   string;
    status: string;
}

// ── Page Props ────────────────────────────────────────────────────────────────

import type { PageProps } from '@/types';

const mockProjects: ProjectOption[] = [
    { id: 1, name: 'Website Redesign', status: 'in_progress' },
    { id: 2, name: 'Mobile App v2',    status: 'in_review'   },
    { id: 3, name: 'CRM Migration',    status: 'in_progress' },
];

// ── Assign Projects Modal ─────────────────────────────────────────────────────

function AssignProjectsModal({
    open, onClose, client, projects, onSave,
}: {
    open: boolean;
    onClose: () => void;
    client: TeamMember | null;
    projects: ProjectOption[];
    onSave: (clientId: number, projectIds: number[]) => void;
}) {
    const [selected, setSelected] = useState<number[]>(client?.assigned_project_ids ?? []);

    const toggle = (id: number) =>
        setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

    const handleSave = () => {
        if (client) { onSave(client.id, selected); onClose(); }
    };

    if (!client) return null;

    return (
        <Modal
            open={open} onCancel={onClose} footer={null}
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FolderKanban size={18} color="#7C3AED" />
                    </div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Assign Projects</div>
                        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 400 }}>
                            Select which projects <strong>{client.name}</strong> can access.
                        </div>
                    </div>
                </div>
            }
            width={480}
        >
            <div style={{ marginTop: 16 }}>
                {projects.length === 0 ? (
                    <Empty description="No projects yet — create a project first." />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 340, overflowY: 'auto' }}>
                        {projects.map(p => {
                            const checked = selected.includes(p.id);
                            return (
                                <div
                                    key={p.id}
                                    onClick={() => toggle(p.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        borderRadius: 10, border: `1px solid ${checked ? '#DDD6FE' : '#E2E8F0'}`,
                                        background: checked ? '#EDE9FE' : '#FAFAFA',
                                        padding: '10px 14px', cursor: 'pointer', transition: 'all 0.15s',
                                    }}
                                >
                                    <Checkbox checked={checked} onChange={() => toggle(p.id)} onClick={e => e.stopPropagation()} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, fontWeight: 500, color: '#1e293b' }}>{p.name}</div>
                                    </div>
                                    <Tag color={p.status === 'completed' ? 'green' : p.status === 'in_progress' ? 'blue' : p.status === 'in_review' ? 'gold' : 'default'}
                                        style={{ borderRadius: 8, fontSize: 11, margin: 0 }}>
                                        {p.status.replace('_', ' ')}
                                    </Tag>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: 12, color: '#64748B' }}>{selected.length} project{selected.length !== 1 ? 's' : ''} selected</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" onClick={handleSave}
                            style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)', border: 'none' }}>
                            Save Access
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function OwnerTeam() {
    const { teamMembers } = usePage<PageProps<{ teamMembers: TeamMember[]; flash?: { success?: string } }>>().props;
    const [team, setTeam] = useState<TeamMember[]>(teamMembers ?? []);
    const [showPicker,   setShowPicker]   = useState(false);
    const [showManager,  setShowManager]  = useState(false);
    const [showEmployee, setShowEmployee] = useState(false);
    const [showClient,   setShowClient]   = useState(false);
    const [assignClient, setAssignClient] = useState<TeamMember | null>(null);

    const managers  = team.filter(m => m.role === 'manager');
    const employees = team.filter(m => m.role === 'employee');
    const clients   = team.filter(m => m.role === 'client');

    const handleRoleSelect = (role: 'manager' | 'employee' | 'client') => {
        setShowPicker(false);
        if (role === 'manager')  setShowManager(true);
        if (role === 'employee') setShowEmployee(true);
        if (role === 'client')   setShowClient(true);
    };

    const handleRemove = (id: number) => {
        router.delete(route('owner.invite.destroy', id), {
            onSuccess: () => setTeam(prev => prev.filter(m => m.id !== id)),
        });
    };

    const handleSaveProjects = (clientId: number, projectIds: number[]) => {
        setTeam(prev => prev.map(m => m.id === clientId ? { ...m, assigned_project_ids: projectIds } : m));
    };

    const roleColor: Record<string, string> = { manager: 'purple', employee: 'blue', client: 'cyan' };

    const memberColumns: ColumnsType<TeamMember> = [
        {
            title: 'Member', key: 'member',
            render: (_, m) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar style={{ background: '#7C3AED', fontWeight: 700, flexShrink: 0 }}>{m.name.charAt(0)}</Avatar>
                    <div>
                        <Text strong style={{ fontSize: 14, color: '#1e293b', display: 'block' }}>{m.name}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{m.email}</Text>
                        {(m.job_title || m.department) && (
                            <Text style={{ fontSize: 11, color: '#7C3AED', display: 'block' }}>
                                {[m.job_title, m.department].filter(Boolean).join(' · ')}
                            </Text>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: 'Role', dataIndex: 'role', key: 'role',
            render: (role: string) => (
                <Tag color={roleColor[role] ?? 'default'} style={{ borderRadius: 12, textTransform: 'capitalize' }}>{role}</Tag>
            ),
        },
        {
            title: 'Joined', dataIndex: 'created_at', key: 'joined',
            render: (d: string) => (
                <Text type="secondary" style={{ fontSize: 13 }}>
                    {new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
            ),
        },
        {
            title: '', key: 'actions',
            render: (_, m) => (
                <div style={{ display: 'flex', gap: 4 }}>
                    {m.role === 'client' && (
                        <Tooltip title="Manage project access">
                            <Button type="text" icon={<FolderKanban size={14} />} onClick={() => setAssignClient(m)} style={{ color: '#7C3AED' }} />
                        </Tooltip>
                    )}
                    <Tooltip title={`Email ${m.name}`}>
                        <Button type="text" icon={<Mail size={14} />} href={`mailto:${m.email}`} style={{ color: '#94a3b8' }} />
                    </Tooltip>
                    <Popconfirm
                        title="Remove member"
                        description={`Remove ${m.name} from your team?`}
                        onConfirm={() => handleRemove(m.id)}
                        okText="Remove" okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Remove member">
                            <Button type="text" danger icon={<Trash2 size={14} />} style={{ color: '#fca5a5' }} />
                        </Tooltip>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const teamTable = (data: TeamMember[], emptyText: string) => (
        <div style={{ borderRadius: 12, border: '1px solid #EDE9FE', background: '#fff', overflow: 'hidden' }}>
            {data.length === 0
                ? <div style={{ padding: 40 }}><Empty description={emptyText} /></div>
                : <Table dataSource={data} columns={memberColumns} rowKey="id" pagination={false} size="middle" />
            }
        </div>
    );

    return (
        <AppLayout title="Team">
            <Head title="Team Management" />

            {/* Modals */}
            <RolePickerModal  open={showPicker}   onClose={() => setShowPicker(false)}   onSelect={handleRoleSelect} />
            <AddManagerModal  open={showManager}  onClose={() => setShowManager(false)}  />
            <AddEmployeeModal open={showEmployee} onClose={() => setShowEmployee(false)} deptNames={DEFAULT_DEPTS} />
            <AddClientModal   open={showClient}   onClose={() => setShowClient(false)}   />
            <AssignProjectsModal
                open={!!assignClient}
                onClose={() => setAssignClient(null)}
                client={assignClient}
                projects={mockProjects}
                onSave={handleSaveProjects}
            />

            {/* Header */}
            <div style={{
                borderRadius: 16, marginBottom: 24, padding: '24px 28px',
                background: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <Crown size={14} color="#FCD34D" />
                            <Text style={{ color: '#FCD34D', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Owner</Text>
                        </div>
                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 700, display: 'block' }}>Team Management</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                            {team.length} member{team.length !== 1 ? 's' : ''} across your workspace.
                        </Text>
                    </div>
                    <Button
                        icon={<UserPlus size={15} />}
                        onClick={() => setShowPicker(true)}
                        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 8, fontWeight: 500 }}
                    >
                        Add Member
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                    { label: 'Total Members', value: team.length,      icon: <Users size={18} color="#7C3AED" />, bg: '#EDE9FE' },
                    { label: 'Managers',      value: managers.length,  icon: <Crown size={18} color="#A855F7" />, bg: '#EDE9FE' },
                    { label: 'Employees',     value: employees.length, icon: <Users size={18} color="#059669" />, bg: '#ECFDF5' },
                ].map(s => (
                    <div key={s.label} style={{ borderRadius: 12, border: '1px solid #EDE9FE', background: '#fff', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {s.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: '#1e293b' }}>{s.value}</div>
                            <Text type="secondary" style={{ fontSize: 12 }}>{s.label}</Text>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <Tabs
                defaultActiveKey="all"
                items={[
                    { key: 'all',       label: `All (${team.length})`,           children: teamTable(team,      'No team members yet — add someone to get started.') },
                    { key: 'managers',  label: `Managers (${managers.length})`,   children: teamTable(managers,  'No managers yet.')  },
                    { key: 'employees', label: `Employees (${employees.length})`, children: teamTable(employees, 'No employees yet.') },
                    { key: 'clients',   label: `Clients (${clients.length})`,     children: teamTable(clients,   'No clients yet.')   },
                ]}
            />
        </AppLayout>
    );
}
