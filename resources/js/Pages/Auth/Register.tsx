import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Form, Input, Button } from 'antd';
import { ArrowRightOutlined, CheckOutlined } from '@ant-design/icons';
import { BarChart3, Users, FolderKanban } from 'lucide-react';

const perks = [
    'Unlimited projects & tasks',
    'Role-based access control',
    'Time tracking & timesheets',
    'Reports & analytics dashboard',
];

const stats = [
    { value: '500+', label: 'Teams' },
    { value: '12k+', label: 'Projects' },
    { value: '99.9%', label: 'Uptime' },
];

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Head title="Create Account" />

            {/* â”€â”€ Left panel â”€â”€ */}
            <div className="hidden lg:flex" style={{
                width: '50%', flexDirection: 'column', justifyContent: 'space-between',
                background: '#1E1B4B', padding: '40px 48px', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', top: -96, right: -96, width: 384, height: 384, borderRadius: '50%', background: '#3B1FA8', opacity: 0.4 }} />
                    <div style={{ position: 'absolute', bottom: 0, left: -80, width: 288, height: 288, borderRadius: '50%', background: '#7C3AED', opacity: 0.2 }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />
                </div>

                <div style={{ position: 'relative' }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>Teamwork Pro</span>
                    <span style={{ marginLeft: 8, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Unified Management Platform</span>
                </div>

                <div style={{ position: 'relative' }}>
                    <h1 style={{ fontSize: 36, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 16 }}>
                        Start managing<br />smarter,<br />
                        <span style={{ color: '#A78BFA' }}>not harder.</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 40, maxWidth: 340, lineHeight: 1.7 }}>
                        Join thousands of teams using Teamwork Pro to streamline their work and hit their goals.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {perks.map(perk => (
                            <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <CheckOutlined style={{ color: '#fff', fontSize: 11 }} />
                                </div>
                                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>{perk}</span>
                            </div>
                        ))}
                    </div>

                    {/* Stat cards */}
                    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        {stats.map(s => (
                            <div key={s.label} style={{ borderRadius: 12, background: 'rgba(255,255,255,0.1)', padding: '12px 16px', textAlign: 'center' }}>
                                <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>{s.value}</p>
                                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2, marginBottom: 0 }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ position: 'relative', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24 }}>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', margin: 0 }}>"Set up in minutes, productive from day one."</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>â€” Hamza A., Full Stack Developer</p>
                </div>
            </div>

            {/* â”€â”€ Right panel â”€â”€ */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 64px', background: '#fff' }}>
                <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>
                    <div className="lg:hidden" style={{ marginBottom: 32 }}>
                        <span style={{ fontSize: 24, fontWeight: 700, color: '#1E1B4B' }}>Teamwork Pro</span>
                    </div>

                    <div style={{ marginBottom: 32 }}>
                        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', margin: 0 }}>Create your account</h2>
                        <p style={{ fontSize: 14, color: '#64748b', marginTop: 6, marginBottom: 0 }}>Get started â€” it only takes a minute.</p>
                    </div>

                    <Form layout="vertical" onSubmitCapture={submit} requiredMark={false}>
                        <Form.Item
                            label={<span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Full Name</span>}
                            validateStatus={errors.name ? 'error' : ''}
                            help={errors.name}
                        >
                            <Input
                                size="large"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="John Smith"
                                autoComplete="name"
                                autoFocus
                                style={{ borderRadius: 8 }}
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Email Address</span>}
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
                                style={{ borderRadius: 8 }}
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Password</span>}
                            validateStatus={errors.password ? 'error' : ''}
                            help={errors.password}
                        >
                            <Input.Password
                                size="large"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="Min. 8 characters"
                                autoComplete="new-password"
                                style={{ borderRadius: 8 }}
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Confirm Password</span>}
                            validateStatus={errors.password_confirmation ? 'error' : ''}
                            help={errors.password_confirmation}
                        >
                            <Input.Password
                                size="large"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                placeholder="Repeat your password"
                                autoComplete="new-password"
                                style={{ borderRadius: 8 }}
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={processing}
                                icon={!processing ? <ArrowRightOutlined /> : undefined}
                                iconPosition="end"
                                size="large"
                                block
                                style={{ borderRadius: 8, fontWeight: 600, background: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)', border: 'none', height: 44 }}
                            >
                                {processing ? 'Creating accountâ€¦' : 'Create account'}
                            </Button>
                        </Form.Item>
                    </Form>

                    <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 24 }}>
                        Already have an account?{' '}
                        <Link href={route('login')} style={{ fontWeight: 500, color: '#7C3AED' }}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}


