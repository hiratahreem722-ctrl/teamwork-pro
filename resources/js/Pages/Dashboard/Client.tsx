import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Tag, Progress, Typography, Row, Col, List, Button } from 'antd';
import {
    FolderKanban, CheckSquare, DollarSign, Bell, ArrowRight,
    CheckCircle2, AlertTriangle, Clock,
} from 'lucide-react';

const { Text } = Typography;

const GRAD = 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)';

const myProjects = [
    { id: 1, name: 'Website Redesign',   status: 'In Progress', progress: 65,  due: 'Apr 15, 2026', health: 'on-track',  tasks: 8,  manager: 'Sarah M.' },
    { id: 3, name: 'API Integration',    status: 'Backlog',     progress: 10,  due: 'May 1, 2026',  health: 'on-track',  tasks: 3,  manager: 'Sarah M.' },
    { id: 99, name: 'CRM Migration',     status: 'Completed',   progress: 100, due: 'Feb 28, 2026', health: 'completed', tasks: 0,  manager: 'Sarah M.' },
];

const recentUpdates = [
    { text: 'Milestone "Design Phase" completed on Website Redesign',  time: '2 days ago',  type: 'milestone' },
    { text: 'Invoice INV-0041 ($6,000) has been sent to you',          time: '3 days ago',  type: 'invoice'   },
    { text: 'New task "API endpoints" added to API Integration',        time: '5 days ago',  type: 'task'      },
    { text: 'Monthly progress report available for Website Redesign',  time: '1 week ago',  type: 'report'    },
];

const invoices = [
    { id: 'INV-0041', project: 'Website Redesign', amount: 6000,  status: 'Pending', due: 'Apr 15' },
    { id: 'INV-0038', project: 'Website Redesign', amount: 1800,  status: 'Paid',    due: 'Mar 15' },
    { id: 'INV-0025', project: 'API Integration',  amount: 4000,  status: 'Overdue', due: 'Jan 24' },
];

const statusColor: Record<string, string> = {
    'In Progress': 'blue', 'Backlog': 'default', 'Completed': 'green', 'In Review': 'gold',
};

const progressColor: Record<string, string> = {
    'In Progress': '#2563EB', 'Backlog': '#94A3B8', 'Completed': '#10B981', 'In Review': '#F59E0B',
};

const healthIcon = {
    'on-track':  { icon: CheckCircle2,  color: '#16a34a' },
    'at-risk':   { icon: AlertTriangle, color: '#d97706' },
    'completed': { icon: CheckCircle2,  color: '#94a3b8' },
};

const invoiceStatusColor: Record<string, string> = { Paid: 'green', Pending: 'gold', Overdue: 'red' };

export default function ClientDashboard() {
    const activeProjects  = myProjects.filter(p => p.status !== 'Completed').length;
    const pendingInvoices = invoices.filter(i => i.status === 'Pending').length;
    const overdueInvoices = invoices.filter(i => i.status === 'Overdue').length;
    const totalOutstanding = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0);

    return (
        <AppLayout title="Client Portal">
            <Head title="Client Portal" />

            {/* Welcome hero */}
            <div style={{ position: 'relative', marginBottom: 24, overflow: 'hidden', borderRadius: 16, background: '#1E3A5F', padding: '28px' }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: '#1E4D8C', opacity: 0.4, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -30, left: -30, width: 140, height: 140, borderRadius: '50%', background: '#2563EB', opacity: 0.2, pointerEvents: 'none' }} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <Text style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0EA5E9', display: 'block', marginBottom: 4 }}>Client Portal</Text>
                        <Text style={{ fontSize: 22, fontWeight: 700, color: '#fff', display: 'block' }}>Welcome, Acme Corp 👋</Text>
                        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Track your projects, view invoices and stay updated.</Text>
                    </div>
                    <div style={{ display: 'flex', gap: 24 }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{activeProjects}</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Active Projects</div>
                        </div>
                        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.15)' }} />
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28, fontWeight: 700, color: overdueInvoices > 0 ? '#f87171' : '#fff' }}>
                                ${(totalOutstanding / 1000).toFixed(1)}k
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Outstanding</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {[
                    { label: 'Active Projects',    value: activeProjects,                      icon: FolderKanban, color: '#EFF6FF', iconColor: '#2563EB' },
                    { label: 'Open Tasks',         value: myProjects.reduce((s, p) => s + p.tasks, 0), icon: CheckSquare, color: '#F5F3FF', iconColor: '#7C3AED' },
                    { label: 'Pending Invoices',   value: pendingInvoices,                     icon: DollarSign,   color: '#FEF3C7', iconColor: '#D97706' },
                    { label: 'Overdue Invoices',   value: overdueInvoices,                     icon: Bell,         color: '#FEF2F2', iconColor: '#DC2626' },
                ].map(s => (
                    <Col xs={12} lg={6} key={s.label}>
                        <Card style={{ borderRadius: 12, border: '1px solid #E2E8F0' }} styles={{ body: { padding: '16px 20px' } }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</Text>
                                    <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', lineHeight: 1.2, marginTop: 4 }}>{s.value}</div>
                                </div>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <s.icon size={20} color={s.iconColor} />
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[24, 24]}>
                {/* My Projects */}
                <Col xs={24} lg={14}>
                    <Card
                        style={{ borderRadius: 12, border: '1px solid #E2E8F0' }}
                        styles={{ body: { padding: 0 } }}
                        title={<span style={{ fontWeight: 600, color: '#374151' }}>My Projects</span>}
                    >
                        {myProjects.map(p => {
                            const hCfg = healthIcon[p.health as keyof typeof healthIcon];
                            const HIcon = hCfg.icon;
                            return (
                                <div key={p.id} style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }} className="hover:bg-slate-50">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                <Text strong style={{ fontSize: 14, color: '#1e293b' }}>{p.name}</Text>
                                                <Tag color={statusColor[p.status]} style={{ borderRadius: 12, fontSize: 11, margin: 0 }}>{p.status}</Tag>
                                            </div>
                                            <Text type="secondary" style={{ fontSize: 12, marginTop: 2, display: 'block' }}>Manager: {p.manager} · Due {p.due}</Text>
                                        </div>
                                        <HIcon size={16} color={hCfg.color} style={{ flexShrink: 0 }} />
                                    </div>
                                    <Progress
                                        percent={p.progress}
                                        size={['100%', 8]}
                                        strokeColor={progressColor[p.status]}
                                        trailColor="#F1F5F9"
                                        format={pct => <span style={{ fontSize: 12, color: '#64748b' }}>{pct}%</span>}
                                    />
                                    {p.tasks > 0 && (
                                        <Text type="secondary" style={{ fontSize: 12, marginTop: 6, display: 'block' }}>
                                            {p.tasks} open task{p.tasks > 1 ? 's' : ''}
                                        </Text>
                                    )}
                                </div>
                            );
                        })}
                    </Card>
                </Col>

                {/* Right column */}
                <Col xs={24} lg={10}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Invoices */}
                        <Card
                            style={{ borderRadius: 12, border: '1px solid #E2E8F0' }}
                            styles={{ body: { padding: 0 } }}
                            title={<span style={{ fontWeight: 600, color: '#374151' }}>Invoices</span>}
                            extra={
                                <Button size="small" type="text" style={{ color: '#2563EB', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    View all <ArrowRight size={12} />
                                </Button>
                            }
                        >
                            {invoices.map(inv => (
                                <div key={inv.id} style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Text strong style={{ fontSize: 13, color: '#1e293b', display: 'block' }}>{inv.id}</Text>
                                        <Text type="secondary" style={{ fontSize: 11 }}>{inv.project} · Due {inv.due}</Text>
                                    </div>
                                    <Text strong style={{ fontSize: 14, color: '#1e293b' }}>${inv.amount.toLocaleString()}</Text>
                                    <Tag color={invoiceStatusColor[inv.status]} style={{ borderRadius: 12, fontSize: 11, margin: 0 }}>{inv.status}</Tag>
                                </div>
                            ))}
                        </Card>

                        {/* Recent updates */}
                        <Card
                            style={{ borderRadius: 12, border: '1px solid #E2E8F0' }}
                            styles={{ body: { padding: 0 } }}
                            title={<span style={{ fontWeight: 600, color: '#374151' }}>Recent Updates</span>}
                        >
                            <List
                                dataSource={recentUpdates}
                                renderItem={item => (
                                    <List.Item style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9', display: 'block' }}>
                                        <Text style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, display: 'block' }}>{item.text}</Text>
                                        <Text type="secondary" style={{ fontSize: 12, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Clock size={11} /> {item.time}
                                        </Text>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </div>
                </Col>
            </Row>
        </AppLayout>
    );
}
