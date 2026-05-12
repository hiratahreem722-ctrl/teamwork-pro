import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Card, Row, Col, Input, Button, Switch, Typography, Divider, Avatar, Tag } from 'antd';
import { Building2, Crown, Users, Bell, Shield, Palette } from 'lucide-react';
import { useState } from 'react';
import type { PageProps } from '@/types';

const { Text, Title } = Typography;

export default function OwnerSettings() {
    const [companyName, setCompanyName] = useState('Acme Corp');
    const [ownerName,   setOwnerName]   = useState('John Owner');
    const [ownerEmail,  setOwnerEmail]  = useState('owner@acmecorp.com');
    const [active,      setActive]      = useState('company');

    const sections = [
        { icon: <Building2 size={16} color="#7C3AED" />, label: 'Company Profile', key: 'company'  },
        { icon: <Users size={16} color="#A855F7" />,     label: 'Team & Roles',    key: 'team'     },
        { icon: <Bell size={16} color="#D97706" />,      label: 'Notifications',   key: 'notif'    },
        { icon: <Shield size={16} color="#059669" />,    label: 'Security',        key: 'security' },
        { icon: <Palette size={16} color="#EC4899" />,   label: 'Appearance',      key: 'appear'   },
    ];

    return (
        <AppLayout title="Settings">
            <Head title="Company Settings" />

            {/* Header */}
            <div style={{
                borderRadius: 16, marginBottom: 24, padding: '24px 28px',
                background: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Crown size={14} color="#FCD34D" />
                        <Text style={{ color: '#FCD34D', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Owner</Text>
                    </div>
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: 700, display: 'block' }}>Company Settings</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Manage your company profile, team roles, and preferences.</Text>
                </div>
            </div>

            <Row gutter={[20, 20]}>
                {/* Sidebar nav */}
                <Col xs={24} lg={6}>
                    <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} styles={{ body: { padding: 8 } }}>
                        {sections.map(s => (
                            <button
                                key={s.key}
                                onClick={() => setActive(s.key)}
                                style={{
                                    width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', borderRadius: 8,
                                    padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2,
                                    background: active === s.key ? '#EDE9FE' : 'transparent',
                                    color: active === s.key ? '#7C3AED' : '#374151',
                                    fontWeight: active === s.key ? 600 : 400,
                                    fontSize: 14,
                                }}
                            >
                                {s.icon}
                                {s.label}
                            </button>
                        ))}
                    </Card>
                </Col>

                {/* Main panel */}
                <Col xs={24} lg={18}>

                    {/* Company Profile */}
                    {active === 'company' && (
                        <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} styles={{ body: { padding: 28 } }}>
                            <Title level={5} style={{ marginTop: 0, marginBottom: 4 }}>Company Profile</Title>
                            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 24 }}>
                                Update your company's public information.
                            </Text>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                                <Avatar size={64} style={{ background: '#1E1B4B', fontSize: 24, fontWeight: 700 }}>
                                    {companyName.charAt(0) || 'C'}
                                </Avatar>
                                <div>
                                    <Button size="small" style={{ borderRadius: 6, marginRight: 8 }}>Upload Logo</Button>
                                    <Text type="secondary" style={{ fontSize: 12 }}>PNG, JPG up to 2MB</Text>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Company Name</label>
                                    <Input value={companyName} onChange={e => setCompanyName(e.target.value)} style={{ borderRadius: 8 }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Industry</label>
                                    <Input placeholder="e.g. Software & Technology" style={{ borderRadius: 8 }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Company Size</label>
                                    <Input placeholder="e.g. 10–50 employees" style={{ borderRadius: 8 }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Website</label>
                                    <Input placeholder="https://yourcompany.com" style={{ borderRadius: 8 }} />
                                </div>
                            </div>

                            <Divider />

                            <Title level={5} style={{ marginBottom: 4 }}>Owner Account</Title>
                            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 20 }}>Your personal account details.</Text>

                            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Full Name</label>
                                    <Input value={ownerName} onChange={e => setOwnerName(e.target.value)} style={{ borderRadius: 8 }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Email Address</label>
                                    <Input value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} style={{ borderRadius: 8 }} />
                                </div>
                            </div>

                            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type="primary" style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)', border: 'none', borderRadius: 8, fontWeight: 500 }}>
                                    Save Changes
                                </Button>
                            </div>
                        </Card>
                    )}

                    {/* Team & Roles */}
                    {active === 'team' && (
                        <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} styles={{ body: { padding: 28 } }}>
                            <Title level={5} style={{ marginTop: 0, marginBottom: 4 }}>Team & Roles</Title>
                            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 24 }}>
                                Control what each role can see and do in your workspace.
                            </Text>
                            {[
                                { role: 'Manager',  color: 'purple', perms: ['Manage projects', 'Invite employees', 'Approve timesheets', 'View reports'] },
                                { role: 'Employee', color: 'blue',   perms: ['View assigned projects', 'Log time', 'Manage own tasks', 'View documents'] },
                                { role: 'Client',   color: 'cyan',   perms: ['View assigned projects', 'View reports', 'Download documents'] },
                            ].map(r => (
                                <div key={r.role} style={{ marginBottom: 20, padding: 16, borderRadius: 10, border: '1px solid #EDE9FE', background: '#FAFBFC' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                        <Tag color={r.color} style={{ borderRadius: 10, fontWeight: 600 }}>{r.role}</Tag>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {r.perms.map(p => (
                                            <span key={p} style={{ fontSize: 12, color: '#475569', background: '#EDE9FE', borderRadius: 6, padding: '3px 10px' }}>{p}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </Card>
                    )}

                    {/* Notifications */}
                    {active === 'notif' && (
                        <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} styles={{ body: { padding: 28 } }}>
                            <Title level={5} style={{ marginTop: 0, marginBottom: 4 }}>Notifications</Title>
                            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 24 }}>Choose what you'd like to be notified about.</Text>
                            {[
                                { label: 'New team member joins',  sub: 'When someone accepts an invitation',  defaultOn: true  },
                                { label: 'Project status changes', sub: 'When a project moves to a new stage',  defaultOn: true  },
                                { label: 'Timesheet submitted',    sub: 'When an employee submits their hours', defaultOn: true  },
                                { label: 'Task overdue',           sub: 'When a task passes its due date',      defaultOn: true  },
                                { label: 'Weekly summary email',   sub: 'A digest of company activity',        defaultOn: false },
                                { label: 'Billing & plan updates', sub: 'Receipts and plan change alerts',      defaultOn: true  },
                            ].map(n => (
                                <div key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #EDE9FE' }}>
                                    <div>
                                        <Text strong style={{ fontSize: 14 }}>{n.label}</Text>
                                        <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>{n.sub}</Text>
                                    </div>
                                    <Switch defaultChecked={n.defaultOn} />
                                </div>
                            ))}
                        </Card>
                    )}

                    {/* Security */}
                    {active === 'security' && (
                        <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} styles={{ body: { padding: 28 } }}>
                            <Title level={5} style={{ marginTop: 0, marginBottom: 4 }}>Security</Title>
                            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 24 }}>Manage your account security settings.</Text>
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Current Password</label>
                                <Input.Password style={{ borderRadius: 8, maxWidth: 360 }} placeholder="Enter current password" />
                            </div>
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>New Password</label>
                                <Input.Password style={{ borderRadius: 8, maxWidth: 360 }} placeholder="Min. 8 characters" />
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Confirm New Password</label>
                                <Input.Password style={{ borderRadius: 8, maxWidth: 360 }} placeholder="Repeat new password" />
                            </div>
                            <Button type="primary" style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)', border: 'none', borderRadius: 8 }}>
                                Update Password
                            </Button>
                        </Card>
                    )}

                    {/* Appearance */}
                    {active === 'appear' && (
                        <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} styles={{ body: { padding: 28 } }}>
                            <Title level={5} style={{ marginTop: 0, marginBottom: 4 }}>Appearance</Title>
                            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 24 }}>Customize how TeamPro looks for your team.</Text>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {[
                                    { label: 'Compact sidebar',       sub: 'Use icon-only sidebar to save space',   defaultOn: false },
                                    { label: 'Show task count badges', sub: 'Display unread counts on nav items',    defaultOn: true  },
                                    { label: 'Dense table rows',       sub: 'Fit more data on screen',              defaultOn: false },
                                ].map(a => (
                                    <div key={a.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #EDE9FE' }}>
                                        <div>
                                            <Text strong style={{ fontSize: 14 }}>{a.label}</Text>
                                            <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>{a.sub}</Text>
                                        </div>
                                        <Switch defaultChecked={a.defaultOn} />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                </Col>
            </Row>
        </AppLayout>
    );
}
