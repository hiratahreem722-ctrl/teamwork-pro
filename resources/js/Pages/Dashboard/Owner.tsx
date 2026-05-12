import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import {
    Card, Row, Col, Typography, Button, Modal, Input, Select,
    Tag, Progress, List, Table, Tabs, Avatar,
} from 'antd';
import {
    FolderKanban, Users, Clock, TrendingUp, Plus, ArrowRight,
    UserPlus, BarChart3, ClipboardList, Crown,
    CheckSquare, Building2, DollarSign,
} from 'lucide-react';
import { useState } from 'react';
import type { PageProps } from '@/types';
import NewProjectModal from '@/Pages/Projects/NewProjectModal';
import { AddEmployeeModal } from '@/Pages/HR/Employees';

const { Text, Title } = Typography;

// ── Mock Data ─────────────────────────────────────────────────────────────────

const companyProjects = [
    { name: 'Website Redesign',    status: 'In Progress', progress: 65,  manager: 'Ali R.',  due: 'May 18', budget: '$12,000', spent: '$7,800'  },
    { name: 'Mobile App v2',       status: 'In Review',   progress: 88,  manager: 'Sara M.', due: 'May 10', budget: '$28,000', spent: '$24,500' },
    { name: 'CRM Migration',       status: 'In Progress', progress: 42,  manager: 'Ali R.',  due: 'Jun 20', budget: '$18,000', spent: '$7,560'  },
    { name: 'E-Commerce Platform', status: 'In Progress', progress: 34,  manager: 'Sara M.', due: 'Jun 12', budget: '$22,000', spent: '$7,480'  },
    { name: 'API Integration',     status: 'Backlog',     progress: 10,  manager: 'Ali R.',  due: 'Jul 1',  budget: '$6,500',  spent: '$650'    },
    { name: 'Brand Identity Kit',  status: 'Completed',   progress: 100, manager: 'Sara M.', due: 'Apr 28', budget: '$4,000',  spent: '$3,950'  },
];

const managers = [
    { id: 1, name: 'Ali Raza',   email: 'ali@acmecorp.com',  projects: 3, tasks: 18, avatar: 'A' },
    { id: 2, name: 'Sara Malik', email: 'sara@acmecorp.com', projects: 3, tasks: 12, avatar: 'S' },
];

const employees = [
    { id: 3, name: 'Hamza Awan',  email: 'hamza@acmecorp.com', role: 'Developer', tasks: 8, avatar: 'H' },
    { id: 4, name: 'Zara Ahmed',  email: 'zara@acmecorp.com',  role: 'Designer',  tasks: 6, avatar: 'Z' },
    { id: 5, name: 'Marcus Chen', email: 'marcus@acmecorp.com',role: 'Backend',   tasks: 9, avatar: 'M' },
    { id: 6, name: 'Lisa Park',   email: 'lisa@acmecorp.com',  role: 'PM',        tasks: 7, avatar: 'L' },
];

const recentTimesheets = [
    { member: 'Hamza Awan',  project: 'Website Redesign',   hours: 8.0, date: 'Today'     },
    { member: 'Zara Ahmed',  project: 'Mobile App v2',       hours: 7.5, date: 'Today'     },
    { member: 'Marcus Chen', project: 'CRM Migration',       hours: 8.0, date: 'Today'     },
    { member: 'Lisa Park',   project: 'E-Commerce Platform', hours: 7.0, date: 'Today'     },
    { member: 'Ali Raza',    project: 'CRM Migration',       hours: 9.0, date: 'Yesterday' },
    { member: 'Sara Malik',  project: 'Website Redesign',    hours: 6.5, date: 'Yesterday' },
];

const statusColor: Record<string, string> = {
    'In Progress': 'blue',
    'In Review':   'gold',
    'Backlog':     'default',
    'Completed':   'green',
};

const progressColor: Record<string, string> = {
    'In Progress': '#7C3AED',
    'In Review':   '#F59E0B',
    'Backlog':     '#94A3B8',
    'Completed':   '#10B981',
};

// Department list for the Add Employee modal
const DEFAULT_DEPTS = ['Engineering', 'Design', 'Operations', 'HR', 'Finance', 'Sales', 'Marketing', 'Analytics'];

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function OwnerDashboard() {
    const [showInvite,     setShowInvite]     = useState(false);
    const [showNewProject, setShowNewProject] = useState(false);

    const kpiStats = [
        { label: 'Active Projects', value: 6,         icon: <FolderKanban size={20} color="#7C3AED" />, change: '6 in progress',          color: '#EDE9FE' },
        { label: 'Hours This Week', value: '142h',    icon: <Clock size={20} color="#059669" />,        change: '↑ 8% vs last week',       color: '#ECFDF5' },
        { label: 'Revenue MTD',     value: '$74,300', icon: <DollarSign size={20} color="#D97706" />,   change: 'Month to date',           color: '#FFFBEB' },
        { label: 'Team Members',    value: 8,         icon: <Users size={20} color="#A855F7" />,        change: `${managers.length} managers · ${employees.length} employees`, color: '#EDE9FE' },
    ];

    const projectColumns = [
        { title: 'Project',  dataIndex: 'name',    key: 'name',
            render: (name: string) => <Text strong style={{ color: '#1e293b' }}>{name}</Text> },
        { title: 'Manager',  dataIndex: 'manager', key: 'manager',
            render: (m: string) => <Text type="secondary" style={{ fontSize: 13 }}>{m}</Text> },
        { title: 'Progress', dataIndex: 'progress', key: 'progress', width: 160,
            render: (p: number, row: any) => (
                <div>
                    <Progress percent={p} showInfo={false} size={['100%', 6]}
                        strokeColor={progressColor[row.status]} trailColor="#F1F5F9" style={{ margin: 0 }} />
                    <Text type="secondary" style={{ fontSize: 11 }}>{p}%</Text>
                </div>
            ),
        },
        { title: 'Status', dataIndex: 'status', key: 'status',
            render: (s: string) => <Tag color={statusColor[s]} style={{ borderRadius: 12, fontSize: 11 }}>{s}</Tag> },
        { title: 'Due',    dataIndex: 'due',    key: 'due',
            render: (d: string) => <Text type="secondary" style={{ fontSize: 13 }}>{d}</Text> },
        { title: 'Budget / Spent', key: 'budget',
            render: (_: any, row: any) => (
                <div>
                    <Text style={{ fontSize: 13, fontWeight: 500 }}>{row.budget}</Text>
                    <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>spent {row.spent}</Text>
                </div>
            ),
        },
    ];

    return (
        <AppLayout title="Owner Dashboard">
            <Head title="Owner Dashboard" />
            <AddEmployeeModal open={showInvite} onClose={() => setShowInvite(false)} deptNames={DEFAULT_DEPTS} />
            <NewProjectModal  open={showNewProject} onClose={() => setShowNewProject(false)} />

            {/* ── Hero header ─────────────────────────────────────────────── */}
            <div style={{
                borderRadius: 16, marginBottom: 24, padding: '28px 32px',
                background: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <Crown size={16} color="#FCD34D" />
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#FCD34D', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Company Owner</span>
                        </div>
                        <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
                            Welcome back, John 👋
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, marginTop: 4, display: 'block' }}>
                            Acme Corp · Full company overview
                        </Text>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <Button
                            icon={<UserPlus size={15} />}
                            onClick={() => setShowInvite(true)}
                            style={{ borderRadius: 8, fontWeight: 500, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff' }}
                        >
                            Invite Member
                        </Button>
                        <Button
                            type="primary" icon={<Plus size={15} />}
                            onClick={() => setShowNewProject(true)}
                            style={{ borderRadius: 8, fontWeight: 500, background: '#A855F7', border: 'none' }}
                        >
                            New Project
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── KPI Stats ───────────────────────────────────────────────── */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {kpiStats.map(s => (
                    <Col xs={12} lg={6} key={s.label}>
                        <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} styles={{ body: { padding: '16px 20px' } }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <div style={{ flex: 1 }}>
                                    <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</Text>
                                    <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', lineHeight: 1.2, marginTop: 4 }}>{s.value}</div>
                                    <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>{s.change}</Text>
                                </div>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {s.icon}
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* ── Tabs ────────────────────────────────────────────────────── */}
            <Tabs
                defaultActiveKey="projects"
                items={[
                    // ── Projects tab ──────────────────────────────────────
                    {
                        key: 'projects',
                        label: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FolderKanban size={14} /> All Projects</span>,
                        children: (
                            <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} styles={{ body: { padding: 0 } }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
                                    <Text strong style={{ color: '#374151' }}>Company Projects ({companyProjects.length})</Text>
                                    <span style={{ fontSize: 12, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                                        View all <ArrowRight size={12} />
                                    </span>
                                </div>
                                <Table
                                    dataSource={companyProjects}
                                    columns={projectColumns}
                                    rowKey="name"
                                    pagination={false}
                                    size="small"
                                />
                            </Card>
                        ),
                    },

                    // ── Team tab ──────────────────────────────────────────
                    {
                        key: 'team',
                        label: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={14} /> Team</span>,
                        children: (
                            <Row gutter={[16, 16]}>
                                {/* Managers */}
                                <Col xs={24} lg={12}>
                                    <Card
                                        style={{ borderRadius: 12, border: '1px solid #EDE9FE' }}
                                        styles={{ body: { padding: 0 } }}
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C3AED' }} />
                                                <span style={{ fontWeight: 600, color: '#374151' }}>Managers</span>
                                                <Tag color="purple" style={{ borderRadius: 10, fontSize: 11 }}>{managers.length}</Tag>
                                            </div>
                                        }
                                        extra={
                                            <Button size="small" icon={<UserPlus size={12} />} onClick={() => setShowInvite(true)} style={{ fontSize: 12, borderRadius: 6 }}>Add</Button>
                                        }
                                    >
                                        <List
                                            dataSource={managers}
                                            renderItem={m => (
                                                <List.Item style={{ padding: '12px 20px', borderBottom: '1px solid #F8FAFC' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                                                        <Avatar style={{ background: '#7C3AED', fontWeight: 700, flexShrink: 0 }}>{m.avatar}</Avatar>
                                                        <div style={{ flex: 1 }}>
                                                            <Text strong style={{ fontSize: 14, color: '#1e293b', display: 'block' }}>{m.name}</Text>
                                                            <Text type="secondary" style={{ fontSize: 12 }}>{m.email}</Text>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <Text style={{ fontSize: 12, color: '#7C3AED', display: 'block' }}>{m.projects} projects</Text>
                                                            <Text type="secondary" style={{ fontSize: 11 }}>{m.tasks} tasks</Text>
                                                        </div>
                                                    </div>
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </Col>

                                {/* Employees */}
                                <Col xs={24} lg={12}>
                                    <Card
                                        style={{ borderRadius: 12, border: '1px solid #EDE9FE' }}
                                        styles={{ body: { padding: 0 } }}
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                                                <span style={{ fontWeight: 600, color: '#374151' }}>Employees</span>
                                                <Tag color="green" style={{ borderRadius: 10, fontSize: 11 }}>{employees.length}</Tag>
                                            </div>
                                        }
                                        extra={
                                            <Button size="small" icon={<UserPlus size={12} />} onClick={() => setShowInvite(true)} style={{ fontSize: 12, borderRadius: 6 }}>Add</Button>
                                        }
                                    >
                                        <List
                                            dataSource={employees}
                                            renderItem={e => (
                                                <List.Item style={{ padding: '12px 20px', borderBottom: '1px solid #F8FAFC' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                                                        <Avatar style={{ background: '#10B981', fontWeight: 700, flexShrink: 0 }}>{e.avatar}</Avatar>
                                                        <div style={{ flex: 1 }}>
                                                            <Text strong style={{ fontSize: 14, color: '#1e293b', display: 'block' }}>{e.name}</Text>
                                                            <Text type="secondary" style={{ fontSize: 12 }}>{e.role}</Text>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <Text style={{ fontSize: 12, color: '#10B981', display: 'block' }}>{e.tasks} tasks</Text>
                                                            <Text type="secondary" style={{ fontSize: 11 }}>Active</Text>
                                                        </div>
                                                    </div>
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </Col>

                                {/* Quick actions */}
                                <Col xs={24}>
                                    <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE', background: '#F5F3FF' }} styles={{ body: { padding: '16px 20px' } }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                                            <div>
                                                <Text strong style={{ color: '#374151' }}>Manage your full team</Text>
                                                <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>Invite members, adjust roles, deactivate accounts.</Text>
                                            </div>
                                            <Button type="primary" icon={<ArrowRight size={14} />} iconPosition="end"
                                                style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)', border: 'none', borderRadius: 8 }}>
                                                Open Team Manager
                                            </Button>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        ),
                    },

                    // ── Timesheets tab ────────────────────────────────────
                    {
                        key: 'timesheets',
                        label: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ClipboardList size={14} /> Timesheets</span>,
                        children: (
                            <Row gutter={[16, 16]}>
                                <Col xs={24}>
                                    <Row gutter={[12, 12]}>
                                        {[
                                            { label: 'Total Hours This Week', value: '142h', sub: 'All team members'   },
                                            { label: 'Billable Hours',        value: '118h', sub: '83% of total'       },
                                            { label: 'Overtime Hours',        value: '12h',  sub: 'Flagged for review' },
                                            { label: 'Pending Approval',      value: '3',    sub: 'Timesheets'         },
                                        ].map(s => (
                                            <Col xs={12} lg={6} key={s.label}>
                                                <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} styles={{ body: { padding: '14px 18px' } }}>
                                                    <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</Text>
                                                    <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>{s.value}</div>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>{s.sub}</Text>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </Col>

                                <Col xs={24}>
                                    <Card
                                        style={{ borderRadius: 12, border: '1px solid #EDE9FE' }}
                                        styles={{ body: { padding: 0 } }}
                                        title={<span style={{ fontWeight: 600, color: '#374151' }}>Recent Time Entries</span>}
                                    >
                                        <List
                                            dataSource={recentTimesheets}
                                            renderItem={item => (
                                                <List.Item style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
                                                        <Avatar style={{ background: '#1E1B4B', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                                                            {item.member.charAt(0)}
                                                        </Avatar>
                                                        <div style={{ flex: 1 }}>
                                                            <Text strong style={{ fontSize: 14, color: '#1e293b', display: 'block' }}>{item.member}</Text>
                                                            <Text type="secondary" style={{ fontSize: 12 }}>{item.project}</Text>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <Text strong style={{ fontSize: 14, color: '#1e293b', display: 'block' }}>{item.hours}h</Text>
                                                            <Text type="secondary" style={{ fontSize: 12 }}>{item.date}</Text>
                                                        </div>
                                                    </div>
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        ),
                    },

                    // ── Analytics tab ─────────────────────────────────────
                    {
                        key: 'analytics',
                        label: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><BarChart3 size={14} /> Analytics</span>,
                        children: (
                            <Row gutter={[16, 16]}>
                                <Col xs={24} lg={12}>
                                    <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} title={<span style={{ fontWeight: 600, color: '#374151' }}>Project Completion Rate</span>}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                            {companyProjects.map(p => (
                                                <div key={p.name}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                        <Text style={{ fontSize: 13, color: '#374151' }}>{p.name}</Text>
                                                        <Text style={{ fontSize: 13, fontWeight: 600, color: progressColor[p.status] }}>{p.progress}%</Text>
                                                    </div>
                                                    <Progress percent={p.progress} showInfo={false} size={['100%', 8]}
                                                        strokeColor={progressColor[p.status]} trailColor="#F1F5F9" style={{ margin: 0 }} />
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </Col>

                                <Col xs={24} lg={12}>
                                    <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} title={<span style={{ fontWeight: 600, color: '#374151' }}>Team Productivity</span>}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                            {[...managers, ...employees].map((m: any) => (
                                                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <Avatar style={{ background: '#1E1B4B', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{m.avatar}</Avatar>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                            <Text style={{ fontSize: 13, color: '#374151' }}>{m.name}</Text>
                                                            <Text type="secondary" style={{ fontSize: 12 }}>{m.tasks} tasks</Text>
                                                        </div>
                                                        <Progress
                                                            percent={Math.min(100, (m.tasks / 20) * 100)}
                                                            showInfo={false} size={['100%', 6]}
                                                            strokeColor="#7C3AED" trailColor="#F1F5F9" style={{ margin: 0 }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </Col>

                                <Col xs={24}>
                                    <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE', background: 'linear-gradient(135deg, #EDE9FE, #F5F3FF)' }} styles={{ body: { padding: '20px 24px' } }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
                                            {[
                                                { label: 'Completed Projects', value: companyProjects.filter(p => p.status === 'Completed').length, icon: <CheckSquare size={20} color="#10B981" /> },
                                                { label: 'Total Budget',       value: '$90,500',   icon: <Building2 size={20} color="#7C3AED" />  },
                                                { label: 'Avg Team Velocity',  value: '92%',       icon: <TrendingUp size={20} color="#A855F7" /> },
                                                { label: 'Tasks Completed',    value: '187',       icon: <CheckSquare size={20} color="#D97706" />},
                                            ].map(s => (
                                                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    {s.icon}
                                                    <div>
                                                        <div style={{ fontSize: 22, fontWeight: 700, color: '#1e293b' }}>{s.value}</div>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>{s.label}</Text>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        ),
                    },
                ]}
            />
        </AppLayout>
    );
}
