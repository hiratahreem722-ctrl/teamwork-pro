import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Button, Input, Select, Typography, Modal } from 'antd';
import { CheckOutlined, ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import {
    FolderKanban, Clock, DollarSign, BarChart3,
    Users, Handshake, CalendarDays, Rocket,
    Building2, CheckCircle2, Plus, Trash2, Mail,
} from 'lucide-react';
import type { PageProps } from '@/types';

const { Text } = Typography;

// ── Static data ───────────────────────────────────────────────────────────────

const INDUSTRIES = [
    'Technology & Software', 'Design & Creative', 'Marketing & Advertising',
    'Finance & Accounting', 'Healthcare', 'Education',
    'Construction & Real Estate', 'Retail & E-Commerce', 'Consulting', 'Other',
];

const TEAM_SIZES = [
    { label: 'Just me',  value: 'Just me',       icon: '🙋' },
    { label: '2 – 5',    value: '2-5 people',    icon: '👥' },
    { label: '6 – 15',   value: '6-15 people',   icon: '🏢' },
    { label: '16 – 50',  value: '16-50 people',  icon: '🏬' },
    { label: '51 – 200', value: '51-200 people', icon: '🏗️' },
    { label: '200+',     value: '200+ people',   icon: '🌐' },
];

const OWNER_ROLES = [
    'Founder / CEO', 'Product Manager', 'Operations Manager',
    'Project Manager', 'Engineering Lead', 'Marketing Head', 'Other',
];

const GOALS = [
    { key: 'Project Management',      icon: <FolderKanban size={22} />, color: '#EDE9FE', border: '#DDD6FE', text: '#5B21B6', desc: 'Tasks, boards & milestones'   },
    { key: 'Time Tracking',           icon: <Clock size={22} />,         color: '#F0FDF4', border: '#BBF7D0', text: '#166534', desc: 'Log hours & timesheets'       },
    { key: 'Payroll & Profitability', icon: <DollarSign size={22} />,    color: '#FFFBEB', border: '#FDE68A', text: '#92400E', desc: 'Salaries & cost tracking'     },
    { key: 'Reporting & Analytics',   icon: <BarChart3 size={22} />,     color: '#F5F3FF', border: '#DDD6FE', text: '#7C3AED', desc: 'Insights & dashboards'        },
    { key: 'Team Management',         icon: <Users size={22} />,         color: '#FFF1F2', border: '#FECDD3', text: '#9F1239', desc: 'Roles, leave & attendance'    },
    { key: 'Client Collaboration',    icon: <Handshake size={22} />,     color: '#ECFEFF', border: '#A5F3FC', text: '#155E75', desc: 'Client portals & sharing'     },
    { key: 'Leave Management',        icon: <CalendarDays size={22} />,  color: '#FFF7ED', border: '#FED7AA', text: '#9A3412', desc: 'Approvals & leave policy'     },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface InviteEntry {
    id:    number;
    email: string;
    role:  'manager' | 'employee' | 'client';
}

// ── Step progress bar ─────────────────────────────────────────────────────────

const STEPS = ['Company', 'Features', 'Invite', 'All Set'];

function StepBar({ current }: { current: number }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
            {STEPS.map((label, i) => {
                const done   = i < current;
                const active = i === current;
                return (
                    <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: done ? '#059669' : active ? '#7C3AED' : '#E2E8F0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.3s',
                                boxShadow: active ? '0 0 0 4px rgba(124,58,237,0.15)' : 'none',
                            }}>
                                {done
                                    ? <CheckOutlined style={{ color: '#fff', fontSize: 14 }} />
                                    : <span style={{ fontSize: 13, fontWeight: 700, color: active ? '#fff' : '#94A3B8' }}>{i + 1}</span>
                                }
                            </div>
                            <Text style={{ fontSize: 11, fontWeight: active ? 600 : 400, color: active ? '#7C3AED' : done ? '#059669' : '#94A3B8', whiteSpace: 'nowrap' }}>
                                {label}
                            </Text>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div style={{
                                width: 80, height: 2, margin: '0 4px', marginBottom: 20,
                                background: done ? '#059669' : '#E2E8F0',
                                transition: 'background 0.4s',
                            }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ── Animated step wrapper ─────────────────────────────────────────────────────

function StepPane({ visible, children }: { visible: boolean; children: React.ReactNode }) {
    return (
        <div style={{
            transition: 'opacity 0.25s, transform 0.25s',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            pointerEvents: visible ? 'auto' : 'none',
            position: visible ? 'relative' : 'absolute',
            width: '100%',
        }}>
            {children}
        </div>
    );
}

// ── Goal card ─────────────────────────────────────────────────────────────────

function GoalCard({ goal, selected, onToggle }: {
    goal: typeof GOALS[0]; selected: boolean; onToggle: () => void;
}) {
    return (
        <div
            onClick={onToggle}
            style={{
                border: `2px solid ${selected ? goal.border : '#E2E8F0'}`,
                borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                background: selected ? goal.color : '#fff',
                transition: 'all 0.18s', position: 'relative',
                boxShadow: selected ? `0 0 0 3px ${goal.border}` : 'none',
            }}
        >
            {selected && (
                <div style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 20, height: 20, borderRadius: '50%',
                    background: goal.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <CheckOutlined style={{ color: '#fff', fontSize: 10 }} />
                </div>
            )}
            <div style={{ color: goal.text, marginBottom: 6 }}>{goal.icon}</div>
            <Text strong style={{ fontSize: 13, color: '#1e293b', display: 'block' }}>{goal.key}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{goal.desc}</Text>
        </div>
    );
}

// ── Team size selector ────────────────────────────────────────────────────────

function TeamSizeSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {TEAM_SIZES.map(opt => {
                const sel = value === opt.value;
                return (
                    <div
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        style={{
                            border: `2px solid ${sel ? '#7C3AED' : '#E2E8F0'}`,
                            borderRadius: 10, padding: '12px 8px', textAlign: 'center',
                            cursor: 'pointer',
                            background: sel ? '#EDE9FE' : '#fff',
                            boxShadow: sel ? '0 0 0 3px rgba(124,58,237,0.12)' : 'none',
                            transition: 'all 0.18s',
                        }}
                    >
                        <div style={{ fontSize: 22, marginBottom: 4 }}>{opt.icon}</div>
                        <Text style={{ fontSize: 12, fontWeight: sel ? 600 : 400, color: sel ? '#7C3AED' : '#374151' }}>{opt.label}</Text>
                    </div>
                );
            })}
        </div>
    );
}

// ── Success screen ────────────────────────────────────────────────────────────

function SuccessScreen({ companyName, goals }: { companyName: string; goals: string[] }) {
    return (
        <div style={{ textAlign: 'center' }}>
            {/* Confetti-style celebration */}
            <div style={{ position: 'relative', marginBottom: 24 }}>
                <div style={{ fontSize: 64, lineHeight: 1 }}>🎉</div>
                <div style={{ position: 'absolute', top: 0, left: '20%', fontSize: 24 }}>✨</div>
                <div style={{ position: 'absolute', top: 8, right: '20%', fontSize: 20 }}>🌟</div>
                <div style={{ position: 'absolute', bottom: 0, left: '30%', fontSize: 18 }}>🎊</div>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                You're all set! 🚀
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', marginBottom: 28, maxWidth: 380, margin: '0 auto 28px' }}>
                <strong>{companyName || 'Your workspace'}</strong> is configured and ready to go. Your team will love it.
            </p>

            <div style={{ background: 'linear-gradient(135deg, #EDE9FE, #F5F3FF)', border: '1px solid #DDD6FE', borderRadius: 14, padding: '20px 24px', textAlign: 'left', marginBottom: 28 }}>
                <Text strong style={{ fontSize: 13, color: '#7C3AED', display: 'block', marginBottom: 12 }}>Workspace Summary</Text>
                {[
                    { label: 'Company',    value: companyName || '—' },
                    { label: 'Goals',      value: goals.length > 0 ? `${goals.length} features selected` : 'None selected' },
                ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
                        <Text type="secondary" style={{ fontSize: 13 }}>{row.label}</Text>
                        <Text strong style={{ fontSize: 13, color: '#1e293b' }}>{row.value}</Text>
                    </div>
                ))}
                {goals.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {goals.map(g => {
                                const gObj = GOALS.find(x => x.key === g);
                                return (
                                    <span key={g} style={{
                                        background: gObj?.color ?? '#EDE9FE',
                                        color: gObj?.text ?? '#7C3AED',
                                        border: `1px solid ${gObj?.border ?? '#DDD6FE'}`,
                                        borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 500,
                                    }}>{g}</span>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <Button
                type="primary" size="large" block
                icon={<Rocket size={16} />}
                onClick={() => window.location.href = '/dashboard'}
                style={{ height: 48, borderRadius: 10, fontWeight: 600, background: 'linear-gradient(135deg,#1E1B4B,#7C3AED)', border: 'none' }}
            >
                Go to Dashboard
            </Button>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function OnboardingIndex() {
    const [step, setStep] = useState(0);

    // Step 1: Company details
    const [companyName, setCompanyName] = useState('');
    const [industry,    setIndustry]    = useState('');
    const [teamSize,    setTeamSize]    = useState('');
    const [ownerRole,   setOwnerRole]   = useState('');

    // Step 2: Goals
    const [goals, setGoals] = useState<string[]>([]);

    // Step 3: Invite team
    const [invites, setInvites] = useState<InviteEntry[]>([
        { id: 1, email: '', role: 'employee' },
    ]);

    const toggleGoal = (key: string) =>
        setGoals(prev => prev.includes(key) ? prev.filter(g => g !== key) : [...prev, key]);

    const addInviteRow = () =>
        setInvites(prev => [...prev, { id: Date.now(), email: '', role: 'employee' }]);

    const removeInviteRow = (id: number) =>
        setInvites(prev => prev.filter(r => r.id !== id));

    const updateInvite = (id: number, field: 'email' | 'role', value: string) =>
        setInvites(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

    const canNext: Record<number, boolean> = {
        0: !!companyName.trim() && !!industry && !!teamSize,
        1: goals.length > 0,
        2: true,
        3: true,
    };

    const handleFinish = () => {
        // Standalone — just advance to success screen
        setStep(3);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Head title="Set Up Your Workspace" />

            {/* ── Left decorative panel ── */}
            <div className="hidden lg:flex" style={{
                width: '40%', flexDirection: 'column', justifyContent: 'space-between',
                background: 'linear-gradient(160deg, #1E1B4B 0%, #4C1D95 60%, #7C3AED 100%)',
                padding: '40px 48px', position: 'relative', overflow: 'hidden',
            }}>
                {/* Background orbs */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(124,58,237,0.3)' }} />
                    <div style={{ position: 'absolute', bottom: -60, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(168,85,247,0.15)' }} />
                    <div style={{ position: 'absolute', top: '45%', left: '45%', transform: 'translate(-50%,-50%)', width: 480, height: 480, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }} />
                    <div style={{ position: 'absolute', top: '45%', left: '45%', transform: 'translate(-50%,-50%)', width: 680, height: 680, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)' }} />
                </div>

                {/* Logo */}
                <div style={{ position: 'relative' }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>TeamPro</span>
                    <span style={{ marginLeft: 8, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Workspace Setup</span>
                </div>

                {/* Main content */}
                <div style={{ position: 'relative' }}>
                    <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, backdropFilter: 'blur(8px)' }}>
                        <Rocket size={28} color="#fff" />
                    </div>

                    <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 16 }}>
                        Let's configure{'\n'}your workspace
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.75, maxWidth: 300 }}>
                        A quick 3-step setup so TeamPro can tailor your dashboards, defaults, and team roles to how you actually work.
                    </p>

                    <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[
                            { icon: '🏢', text: 'Company profile & industry'        },
                            { icon: '🎯', text: 'Your primary goals & features'     },
                            { icon: '👥', text: 'Invite your team to get started'   },
                            { icon: '⚡', text: 'Pre-configured dashboards & roles' },
                        ].map(item => (
                            <div key={item.icon} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: 18 }}>{item.icon}</span>
                                <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>{item.text}</Text>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ position: 'relative', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                        You can skip any step or edit everything later from Settings.
                    </p>
                </div>
            </div>

            {/* ── Right panel (form) ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 56px', background: '#FAFBFC', overflowY: 'auto' }}>
                <div style={{ maxWidth: 520, width: '100%', margin: '0 auto' }}>

                    {/* Mobile logo */}
                    <div className="lg:hidden" style={{ marginBottom: 28 }}>
                        <span style={{ fontSize: 22, fontWeight: 700, color: '#1E1B4B' }}>TeamPro</span>
                    </div>

                    {/* Progress steps (only shown for steps 0-2) */}
                    {step < 3 && <StepBar current={step} />}

                    {/* ─── Step 0: Company Details ─────────────────────────── */}
                    <StepPane visible={step === 0}>
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Building2 size={18} color="#7C3AED" />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', margin: 0 }}>Company Profile</h2>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Tell us about your organisation</Text>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                                    Company Name <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <Input
                                    size="large" value={companyName}
                                    onChange={e => setCompanyName(e.target.value)}
                                    placeholder="Acme Inc."
                                    style={{ borderRadius: 8 }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                                    Industry <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <Select
                                    size="large" value={industry || undefined}
                                    onChange={setIndustry}
                                    placeholder="Select your industry…"
                                    style={{ width: '100%' }}
                                    options={INDUSTRIES.map(i => ({ label: i, value: i }))}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 10 }}>
                                    Team Size <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <TeamSizeSelector value={teamSize} onChange={setTeamSize} />
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                                    Your Role in the Company
                                </label>
                                <Select
                                    size="large" value={ownerRole || undefined}
                                    onChange={setOwnerRole}
                                    placeholder="Select role…"
                                    style={{ width: '100%' }}
                                    options={OWNER_ROLES.map(r => ({ label: r, value: r }))}
                                />
                            </div>
                        </div>
                    </StepPane>

                    {/* ─── Step 1: Features / Goals ─────────────────────────── */}
                    <StepPane visible={step === 1}>
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BarChart3 size={18} color="#7C3AED" />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', margin: 0 }}>Primary Goals</h2>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Select all that apply — we'll configure your workspace accordingly</Text>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 16 }}>
                            {GOALS.map(g => (
                                <GoalCard
                                    key={g.key}
                                    goal={g}
                                    selected={goals.includes(g.key)}
                                    onToggle={() => toggleGoal(g.key)}
                                />
                            ))}
                        </div>
                        {goals.length > 0 && (
                            <div style={{ fontSize: 13, color: '#7C3AED', fontWeight: 500, marginTop: 4 }}>
                                ✓ {goals.length} feature{goals.length !== 1 ? 's' : ''} selected
                            </div>
                        )}
                    </StepPane>

                    {/* ─── Step 2: Invite Team ──────────────────────────────── */}
                    <StepPane visible={step === 2}>
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Users size={18} color="#7C3AED" />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', margin: 0 }}>Invite Your Team</h2>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Add team members — credentials will be emailed automatically</Text>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                            {invites.map((row, idx) => (
                                <div key={row.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Mail size={14} color="#7C3AED" />
                                    </div>
                                    <Input
                                        type="email"
                                        placeholder={`teammate${idx + 1}@company.com`}
                                        value={row.email}
                                        onChange={e => updateInvite(row.id, 'email', e.target.value)}
                                        style={{ flex: 1, borderRadius: 8 }}
                                    />
                                    <Select
                                        value={row.role}
                                        onChange={val => updateInvite(row.id, 'role', val)}
                                        style={{ width: 120 }}
                                        options={[
                                            { label: 'Manager',  value: 'manager'  },
                                            { label: 'Employee', value: 'employee' },
                                            { label: 'Client',   value: 'client'   },
                                        ]}
                                    />
                                    {invites.length > 1 && (
                                        <Button
                                            type="text" danger icon={<Trash2 size={14} />}
                                            onClick={() => removeInviteRow(row.id)}
                                            style={{ flexShrink: 0 }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <Button
                            type="dashed" icon={<Plus size={14} />} block
                            onClick={addInviteRow}
                            style={{ borderRadius: 8, borderColor: '#DDD6FE', color: '#7C3AED' }}
                        >
                            Add another teammate
                        </Button>

                        <div style={{ marginTop: 16, background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 10, padding: '10px 14px' }}>
                            <Text style={{ fontSize: 12, color: '#5B21B6' }}>
                                You can skip this step and invite team members later from <strong>Team Management</strong>.
                            </Text>
                        </div>
                    </StepPane>

                    {/* ─── Step 3: Success ──────────────────────────────────── */}
                    <StepPane visible={step === 3}>
                        <SuccessScreen companyName={companyName} goals={goals} />
                    </StepPane>

                    {/* ─── Navigation buttons (steps 0-2) ──────────────────── */}
                    {step >= 0 && step <= 2 && (
                        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                            {step > 0 && (
                                <Button
                                    size="large" icon={<ArrowLeftOutlined />}
                                    onClick={() => setStep(s => s - 1)}
                                    style={{ height: 44, borderRadius: 10, flex: '0 0 auto' }}
                                >
                                    Back
                                </Button>
                            )}
                            <Button
                                type="primary" size="large" block
                                icon={<ArrowRightOutlined />} iconPosition="end"
                                disabled={!canNext[step]}
                                onClick={() => step < 2 ? setStep(s => s + 1) : handleFinish()}
                                style={{
                                    height: 44, borderRadius: 10, fontWeight: 600,
                                    background: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)',
                                    border: 'none',
                                    opacity: canNext[step] ? 1 : 0.5,
                                }}
                            >
                                {step === 2 ? 'Finish & Go to Dashboard' : step === 1 ? 'Continue to Invite' : 'Continue'}
                            </Button>
                        </div>
                    )}

                    {/* Skip invite step */}
                    {step === 2 && (
                        <div style={{ textAlign: 'center', marginTop: 14 }}>
                            <button
                                onClick={handleFinish}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#94a3b8', textDecoration: 'underline' }}
                            >
                                Skip for now, invite later
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
