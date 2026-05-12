import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { CheckCircle2, BarChart3, Users, FolderKanban } from 'lucide-react';

const features = [
    { icon: FolderKanban, text: 'Manage projects with Kanban boards' },
    { icon: Users,        text: 'Collaborate across teams and roles' },
    { icon: BarChart3,    text: 'Real-time analytics and reporting' },
    { icon: CheckCircle2, text: 'Track tasks, time, and deadlines' },
];

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Head title="Sign in" />

            {/* ── Left panel ── */}
            <div className="hidden lg:flex login-gradient-bg" style={{
                width: '50%', flexDirection: 'column', justifyContent: 'space-between',
                background: '#1E1B4B', padding: '40px 48px', position: 'relative', overflow: 'hidden',
            }}>
                {/* Animated blobs */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                    <div className="blob-1" style={{ position: 'absolute', top: -80, right: -80, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, #4C1D95 0%, #3B1FA8 60%, transparent 100%)', opacity: 0.7 }} />
                    <div className="blob-2" style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, #7C3AED 0%, #5B21B6 60%, transparent 100%)', opacity: 0.5 }} />
                    <div style={{ position: 'absolute', top: '40%', right: '15%', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, #A855F7 0%, transparent 70%)', opacity: 0.15, animation: 'blobFloat2 9s ease-in-out infinite 3s' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)' }} />
                    {/* Sparkle dots */}
                    {[{top:'20%',left:'70%'},{top:'55%',left:'20%'},{top:'75%',left:'60%'},{top:'35%',left:'40%'}].map((pos, i) => (
                        <div key={i} style={{ position: 'absolute', ...pos, width: 4, height: 4, borderRadius: '50%', background: '#A78BFA', animation: `sparkle ${2 + i * 0.5}s ease-in-out infinite ${i * 0.8}s` }} />
                    ))}
                </div>

                {/* Logo */}
                <div style={{ position: 'relative', animation: 'fadeInDown 0.6s ease both' }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>Teamwork Pro</span>
                    <span style={{ marginLeft: 8, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Project Management Platform</span>
                </div>

                {/* Center content */}
                <div style={{ position: 'relative', animation: 'fadeInUp 0.7s ease 0.2s both' }}>
                    <h1 style={{ fontSize: 36, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 16 }}>
                        Everything your<br />team needs,<br />
                        <span className="gradient-text" style={{ backgroundImage: 'linear-gradient(135deg, #A78BFA, #C4B5FD)' }}>in one place.</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 40, maxWidth: 340, lineHeight: 1.7 }}>
                        From project planning to time tracking — Teamwork Pro keeps your team aligned and productive.
                    </p>
                    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {features.map(({ icon: Icon, text }) => (
                            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backdropFilter: 'blur(8px)' }}>
                                    <Icon size={16} color="#A78BFA" />
                                </div>
                                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom quote */}
                <div style={{ position: 'relative', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, animation: 'fadeInUp 0.7s ease 0.5s both' }}>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', margin: 0 }}>"Teamwork Pro cut our project reporting time in half."</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>— Sarah Manager, Acme Corp</p>
                </div>
            </div>

            {/* ── Right panel ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 64px', background: '#fff' }}>
                <div className="login-form-wrapper" style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>
                    {/* Mobile logo */}
                    <div className="lg:hidden" style={{ marginBottom: 32 }}>
                        <span style={{ fontSize: 24, fontWeight: 700, color: '#1E1B4B' }}>Teamwork Pro</span>
                    </div>

                    <div style={{ marginBottom: 32 }}>
                        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1e293b', margin: 0 }}>Welcome back</h2>
                        <p style={{ fontSize: 14, color: '#64748b', marginTop: 6, marginBottom: 0 }}>Sign in to your account to continue.</p>
                    </div>

                    {status && (
                        <Alert message={status} type="success" showIcon style={{ marginBottom: 24, borderRadius: 8 }} />
                    )}

                    <Form layout="vertical" onSubmitCapture={submit} requiredMark={false}>
                        <Form.Item
                            label={<span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Email address</span>}
                            validateStatus={errors.email ? 'error' : ''}
                            help={errors.email}
                        >
                            <Input
                                type="email"
                                size="large"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="you@company.com"
                                autoComplete="username"
                                autoFocus
                                style={{ borderRadius: 8 }}
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Password</span>}
                            validateStatus={errors.password ? 'error' : ''}
                            help={errors.password}
                            style={{ marginBottom: 4 }}
                        >
                            <Input.Password
                                size="large"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                style={{ borderRadius: 8 }}
                            />
                        </Form.Item>

                        {canResetPassword && (
                            <div style={{ textAlign: 'right', marginBottom: 16 }}>
                                <Link href={route('password.request')} style={{ fontSize: 13, color: '#7C3AED', fontWeight: 500 }}>
                                    Forgot password?
                                </Link>
                            </div>
                        )}

                        <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={processing}
                                icon={!processing ? <ArrowRightOutlined /> : undefined}
                                iconPosition="end"
                                size="large"
                                block
                                className="btn-gradient"
                                style={{ borderRadius: 8, fontWeight: 600, border: 'none', height: 46 }}
                            >
                                {processing ? 'Signing in…' : 'Sign in'}
                            </Button>
                        </Form.Item>
                    </Form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                        <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
                        <span style={{ fontSize: 12, color: '#94A3B8' }}>demo accounts</span>
                        <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {[
                            { label: 'Owner',    email: 'owner@teamworkpro.com',    color: '#7C3AED', bg: '#F5F3FF' },
                            { label: 'Manager',  email: 'manager@teamworkpro.com',  color: '#3B82F6', bg: '#EFF6FF' },
                            { label: 'Employee', email: 'employee@teamworkpro.com', color: '#059669', bg: '#ECFDF5' },
                            { label: 'Client',   email: 'client@teamworkpro.com',   color: '#D97706', bg: '#FFFBEB' },
                        ].map(a => (
                            <button key={a.label} type="button"
                                onClick={() => { setData('email', a.email); }}
                                style={{ background: a.bg, border: `1px solid ${a.color}22`, borderRadius: 8, padding: '8px 10px', cursor: 'pointer', textAlign: 'left', transition: 'transform 0.12s' }}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = '')}
                            >
                                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: a.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{a.label}</p>
                                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.email}</p>
                            </button>
                        ))}
                    </div>
                    <p style={{ textAlign: 'center', fontSize: 11, color: '#94A3B8', marginTop: 8 }}>Password: <strong>password</strong> for all demo accounts</p>
                </div>
            </div>
        </div>
    );
}
