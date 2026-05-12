import { Head, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import type { PageProps } from '@/types';
import {
    Rocket, Building2, Users, Target, Settings2, Palette,
    Mail, CheckCircle2, ChevronRight, ChevronLeft, Plus, Trash2,
    Globe, Clock3, Kanban, List, LayoutDashboard, Check,
    Briefcase, FolderKanban, BarChart3, DollarSign, Clock,
    Handshake, CalendarDays, MapPin, Sparkles, ArrowRight,
    Building, UserCheck, Laptop, Home, Building2 as Office,
} from 'lucide-react';

// ── Palette ───────────────────────────────────────────────────────────────────
const P  = '#7C3AED';
const PD = '#1E1B4B';

// ── Static data ───────────────────────────────────────────────────────────────

const INDUSTRIES = [
    '💻 Technology & Software', '🎨 Design & Creative', '📣 Marketing & Advertising',
    '💰 Finance & Accounting',  '🏥 Healthcare',         '🎓 Education',
    '🏗️ Construction & Real Estate', '🛍️ Retail & E-Commerce', '🤝 Consulting', '⚙️ Other',
];

const COMPANY_SIZES = [
    { label: 'Just me',    value: '1',       icon: '🙋', sub: 'Solo founder' },
    { label: '2 – 10',     value: '2-10',    icon: '👥', sub: 'Small team'   },
    { label: '11 – 50',    value: '11-50',   icon: '🏢', sub: 'Growing team' },
    { label: '51 – 200',   value: '51-200',  icon: '🏬', sub: 'Mid-size'     },
    { label: '201 – 500',  value: '201-500', icon: '🏗️', sub: 'Large org'    },
    { label: '500+',       value: '500+',    icon: '🌐', sub: 'Enterprise'   },
];

const WORK_TYPES = [
    { key: 'remote',  label: 'Fully Remote',   icon: Home,    desc: 'Team works from anywhere'      },
    { key: 'hybrid',  label: 'Hybrid',          icon: Laptop,  desc: 'Mix of office & remote'        },
    { key: 'onsite',  label: 'On-site',         icon: Office,  desc: 'Everyone in the office'        },
];

const DEPT_OPTIONS = [
    'Engineering', 'Design', 'Product', 'Marketing', 'Sales',
    'HR & People', 'Finance', 'Operations', 'Customer Success', 'Legal', 'Analytics', 'QA',
];

const GOALS = [
    { key: 'Project Management',      Icon: FolderKanban,  color: '#EDE9FE', border: '#DDD6FE', text: '#5B21B6', desc: 'Tasks, boards & milestones'   },
    { key: 'Time Tracking',           Icon: Clock,          color: '#F0FDF4', border: '#BBF7D0', text: '#166534', desc: 'Log hours & timesheets'       },
    { key: 'Payroll & Profitability', Icon: DollarSign,     color: '#FFFBEB', border: '#FDE68A', text: '#92400E', desc: 'Salaries & cost tracking'     },
    { key: 'Reporting & Analytics',   Icon: BarChart3,      color: '#F5F3FF', border: '#DDD6FE', text: '#7C3AED', desc: 'Insights & dashboards'        },
    { key: 'Team Management',         Icon: Users,          color: '#FFF1F2', border: '#FECDD3', text: '#9F1239', desc: 'Roles, leave & attendance'    },
    { key: 'Client Collaboration',    Icon: Handshake,      color: '#ECFEFF', border: '#A5F3FC', text: '#155E75', desc: 'Client portals & sharing'     },
    { key: 'Leave Management',        Icon: CalendarDays,   color: '#FFF7ED', border: '#FED7AA', text: '#9A3412', desc: 'Approvals & leave policy'     },
    { key: 'CRM & Sales Pipeline',    Icon: Target,         color: '#F0FFF4', border: '#BBF7D0', text: '#14532D', desc: 'Leads, deals & pipelines'     },
];

const PM_VIEWS = [
    { key: 'kanban',   label: 'Kanban Board',  Icon: Kanban,          desc: 'Visual drag-and-drop columns'     },
    { key: 'list',     label: 'List View',     Icon: List,            desc: 'Structured task lists with filters'},
    { key: 'timeline', label: 'Timeline / Gantt', Icon: LayoutDashboard, desc: 'Time-based project planning'   },
];

const TIMEZONES = [
    'UTC-12:00 Baker Island', 'UTC-08:00 Los Angeles (PST)', 'UTC-07:00 Denver (MST)',
    'UTC-06:00 Chicago (CST)', 'UTC-05:00 New York (EST)', 'UTC+00:00 London (GMT)',
    'UTC+01:00 Paris / Berlin', 'UTC+02:00 Cairo / Athens', 'UTC+03:00 Moscow / Riyadh',
    'UTC+04:00 Dubai / Baku', 'UTC+05:00 Karachi / Islamabad', 'UTC+05:30 Mumbai / Delhi',
    'UTC+06:00 Dhaka', 'UTC+07:00 Bangkok / Jakarta', 'UTC+08:00 Beijing / Singapore',
    'UTC+09:00 Tokyo / Seoul', 'UTC+10:00 Sydney', 'UTC+12:00 Auckland / Fiji',
];

const CURRENCIES = ['USD $', 'EUR €', 'GBP £', 'AED د.إ', 'PKR ₨', 'INR ₹', 'CAD $', 'AUD $', 'SAR ر.س'];

const BRAND_COLORS = [
    '#7C3AED', '#2563EB', '#059669', '#DC2626', '#D97706',
    '#DB2777', '#0891B2', '#4F46E5', '#1D4ED8', '#065F46',
];

const STEPS = [
    { key: 'welcome',   label: 'Welcome',      Icon: Sparkles,      optional: false },
    { key: 'company',   label: 'Company',       Icon: Building2,     optional: false },
    { key: 'team',      label: 'Team Setup',    Icon: Users,         optional: false },
    { key: 'goals',     label: 'Goals',         Icon: Target,        optional: false },
    { key: 'workspace', label: 'Workspace',     Icon: Settings2,     optional: false },
    { key: 'branding',  label: 'Branding',      Icon: Palette,       optional: true  },
    { key: 'invite',    label: 'Invite Team',   Icon: Mail,          optional: true  },
    { key: 'done',      label: 'All Set',       Icon: CheckCircle2,  optional: false },
];

interface InviteRow { id: number; email: string; role: 'manager' | 'employee' | 'client' }

// ── Tiny helpers ──────────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}>
            {children}{required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
        </label>
    );
}

function SInput({ value, onChange, placeholder, type }: {
    value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
    return (
        <input
            type={type ?? 'text'} value={value} placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 9, fontSize: 14, color: '#1E293B', outline: 'none', boxSizing: 'border-box', background: '#fff', transition: 'border 0.15s' }}
            onFocus={e => (e.target.style.borderColor = P)}
            onBlur={e  => (e.target.style.borderColor = '#E2E8F0')}
        />
    );
}

function SSelect({ value, onChange, options, placeholder }: {
    value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
    return (
        <select
            value={value} onChange={e => onChange(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 9, fontSize: 14, color: value ? '#1E293B' : '#94A3B8', outline: 'none', boxSizing: 'border-box', background: '#fff', appearance: 'none', cursor: 'pointer', transition: 'border 0.15s' }}
            onFocus={e => (e.target.style.borderColor = P)}
            onBlur={e  => (e.target.style.borderColor = '#E2E8F0')}
        >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    );
}

function StepHeader({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {icon}
            </div>
            <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: PD }}>{title}</h2>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: '#64748B' }}>{sub}</p>
            </div>
        </div>
    );
}

// ── Left panel context per step ────────────────────────────────────────────────

const STEP_CONTEXT = [
    { emoji: '👋', heading: 'Welcome aboard!',          body: 'This quick setup takes about 2 minutes. We\'ll use your answers to personalise your workspace, dashboards, and default settings.' },
    { emoji: '🏢', heading: 'Your company profile',     body: 'Help us understand your business so we can pre-configure the right modules, currencies, and defaults for your industry.' },
    { emoji: '👥', heading: 'How your team works',      body: 'Knowing your team size and work style helps us suggest the right project views, workflows, and communication defaults.' },
    { emoji: '🎯', heading: 'Prioritise your goals',    body: 'Select the features most important to you. We\'ll highlight them on your dashboard and set sensible defaults for each.' },
    { emoji: '⚙️', heading: 'Workspace preferences',   body: 'Configure your timezone, project view, and currency so everything works correctly for your team from day one.' },
    { emoji: '🎨', heading: 'Make it yours',            body: 'Upload a logo and pick a brand colour. This appears on client-facing portals and reports shared with stakeholders.' },
    { emoji: '✉️', heading: 'Build your team',          body: 'Invite managers, employees, or clients now. They\'ll get a welcome email with login credentials automatically.' },
    { emoji: '🚀', heading: 'You\'re all set!',         body: 'Your workspace has been configured. Head to your dashboard and start adding projects, tasks, and team members.' },
];

// ── Main component ─────────────────────────────────────────────────────────────

export default function OnboardingIndex() {
    const { auth } = usePage<PageProps>().props;
    const ownerName = auth?.user?.name?.split(' ')[0] ?? 'there';

    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState<Set<number>>(new Set());

    // ── Form state ────────────────────────────────────────────────────────────
    // Step 1 — Company
    const [companyName, setCompanyName] = useState('');
    const [industry,    setIndustry]    = useState('');
    const [companySize, setCompanySize] = useState('');
    const [website,     setWebsite]     = useState('');

    // Step 2 — Team
    const [workType,  setWorkType]  = useState('');
    const [depts,     setDepts]     = useState<string[]>([]);

    // Step 3 — Goals
    const [goals, setGoals] = useState<string[]>([]);

    // Step 4 — Workspace
    const [timezone,  setTimezone]  = useState('UTC+05:00 Karachi / Islamabad');
    const [pmView,    setPmView]    = useState('kanban');
    const [currency,  setCurrency]  = useState('USD $');

    // Step 5 — Branding
    const [brandColor, setBrandColor] = useState(P);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // Step 6 — Invite
    const [invites, setInvites] = useState<InviteRow[]>([{ id: 1, email: '', role: 'employee' }]);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const toggleDept = (d: string) => setDepts(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);
    const toggleGoal = (k: string) => setGoals(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k]);

    const addInvite    = () => setInvites(p => [...p, { id: Date.now(), email: '', role: 'employee' }]);
    const removeInvite = (id: number) => setInvites(p => p.filter(r => r.id !== id));
    const updateInvite = (id: number, field: 'email' | 'role', val: string) =>
        setInvites(p => p.map(r => r.id === id ? { ...r, [field]: val } : r));

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = ev => setLogoPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const canNext: Record<number, boolean> = {
        0: true,
        1: !!companyName.trim() && !!industry && !!companySize,
        2: !!workType,
        3: goals.length > 0,
        4: !!timezone && !!pmView,
        5: true,   // optional
        6: true,   // optional
        7: true,
    };

    const next = () => {
        setCompleted(p => new Set([...p, step]));
        setStep(s => Math.min(s + 1, STEPS.length - 1));
        window.scrollTo(0, 0);
    };
    const back = () => { setStep(s => Math.max(s - 1, 0)); window.scrollTo(0, 0); };
    const skip = () => next();
    const finish = () => { window.location.href = '/dashboard'; };

    const ctx = STEP_CONTEXT[step] ?? STEP_CONTEXT[0];
    const isLast     = step === STEPS.length - 1;
    const isOptional = STEPS[step]?.optional;

    // ── Progress bar (top) ────────────────────────────────────────────────────
    const totalSteps   = STEPS.length - 1; // exclude "done"
    const progressPct  = Math.round((Math.min(step, totalSteps) / totalSteps) * 100);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <Head title="Set Up Your Workspace" />

            {/* ══ LEFT PANEL ══════════════════════════════════════════════════ */}
            <div className="hidden lg:flex" style={{
                width: 340, minHeight: '100vh', flexDirection: 'column',
                background: `linear-gradient(160deg, ${PD} 0%, #3B1FA8 55%, ${P} 100%)`,
                padding: '36px 32px', position: 'sticky', top: 0, maxHeight: '100vh',
                overflowY: 'auto', flexShrink: 0,
            }}>
                {/* Decorative orbs */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(124,58,237,0.3)' }} />
                    <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(168,85,247,0.15)' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />
                </div>

                {/* Logo */}
                <div style={{ position: 'relative', marginBottom: 40 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Teamwork Pro</span>
                    <span style={{ marginLeft: 8, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Workspace Setup</span>
                </div>

                {/* Step list */}
                <div style={{ position: 'relative', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {STEPS.map((s, i) => {
                            const Icon      = s.Icon;
                            const isActive  = i === step;
                            const isDone    = completed.has(i);
                            const isFuture  = i > step && !isDone;
                            return (
                                <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', borderRadius: 10, background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent', transition: 'background 0.15s' }}>
                                    <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDone ? '#059669' : isActive ? 'rgba(196,181,253,0.3)' : 'rgba(255,255,255,0.07)', border: `2px solid ${isDone ? '#059669' : isActive ? '#C4B5FD' : 'rgba(255,255,255,0.12)'}` }}>
                                        {isDone
                                            ? <Check size={14} color="#fff" strokeWidth={3} />
                                            : <Icon size={13} color={isActive ? '#E9D5FF' : 'rgba(255,255,255,0.35)'} />
                                        }
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontSize: 13, fontWeight: isActive ? 700 : 400, color: isActive ? '#fff' : isDone ? '#86EFAC' : 'rgba(255,255,255,0.45)', lineHeight: 1.2 }}>{s.label}</p>
                                        {s.optional && <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>Optional</p>}
                                    </div>
                                    {isActive && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#A78BFA', flexShrink: 0 }} />}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Context blurb */}
                <div style={{ position: 'relative', marginTop: 32, padding: '20px', background: 'rgba(255,255,255,0.08)', borderRadius: 14, backdropFilter: 'blur(6px)' }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{ctx.emoji}</div>
                    <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#fff' }}>{ctx.heading}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{ctx.body}</p>
                </div>
            </div>

            {/* ══ RIGHT PANEL ═════════════════════════════════════════════════ */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F8FAFC', minHeight: '100vh' }}>

                {/* Top progress bar */}
                {!isLast && (
                    <div style={{ padding: '20px 48px 0', background: '#fff', borderBottom: '1px solid #F1F5F9' }}>
                        <div style={{ maxWidth: 600, margin: '0 auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>STEP {step + 1} OF {STEPS.length}</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: P }}>{progressPct}% complete</span>
                            </div>
                            <div style={{ height: 5, background: '#EDE9FE', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: `linear-gradient(90deg,${PD},${P})`, width: `${progressPct}%`, borderRadius: 3, transition: 'width 0.5s ease' }} />
                            </div>
                            {/* Step pill labels */}
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12, paddingBottom: 16 }}>
                                {STEPS.filter((_, i) => i < STEPS.length - 1).map((s, i) => (
                                    <span key={s.key} style={{ fontSize: 11, fontWeight: i === step ? 700 : 400, padding: '3px 10px', borderRadius: 20, background: completed.has(i) ? '#DCFCE7' : i === step ? '#EDE9FE' : '#F1F5F9', color: completed.has(i) ? '#16A34A' : i === step ? P : '#94A3B8', border: `1px solid ${completed.has(i) ? '#BBF7D0' : i === step ? '#DDD6FE' : 'transparent'}`, whiteSpace: 'nowrap' }}>
                                        {completed.has(i) && '✓ '}{s.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Form area */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 48px', overflowY: 'auto' }}>
                    <div style={{ maxWidth: 600, width: '100%' }}>

                        {/* ── STEP 0: Welcome ──────────────────────────────── */}
                        {step === 0 && (
                            <div>
                                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                                    <div style={{ fontSize: 56, marginBottom: 16 }}>👋</div>
                                    <h1 style={{ margin: '0 0 12px', fontSize: 30, fontWeight: 800, color: PD }}>
                                        Welcome, {ownerName}!
                                    </h1>
                                    <p style={{ margin: '0 auto', fontSize: 15, color: '#64748B', lineHeight: 1.7, maxWidth: 460 }}>
                                        Let's set up your <strong style={{ color: PD }}>Teamwork Pro</strong> workspace in just a few steps.
                                        It takes about <strong>2 minutes</strong> and you can skip anything you're not ready for yet.
                                    </p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 36 }}>
                                    {[
                                        { icon: '🏢', label: 'Company Profile',     desc: 'Name, industry & size'         },
                                        { icon: '👥', label: 'Team Setup',          desc: 'Departments & work style'      },
                                        { icon: '🎯', label: 'Goals & Features',    desc: 'Choose what matters most'      },
                                        { icon: '⚙️', label: 'Workspace Config',    desc: 'Timezone, views & currency'    },
                                        { icon: '🎨', label: 'Branding',            desc: 'Logo & brand colour (optional)'},
                                        { icon: '✉️', label: 'Invite Team',         desc: 'Add members now or later'      },
                                    ].map(item => (
                                        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', boxShadow: '0 1px 3px rgba(124,58,237,0.05)' }}>
                                            <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                                            <div>
                                                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: PD }}>{item.label}</p>
                                                <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={next} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${PD},${P})`, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 6px 20px rgba(124,58,237,0.35)' }}>
                                    Let's get started <ArrowRight size={18} />
                                </button>
                            </div>
                        )}

                        {/* ── STEP 1: Company ─────────────────────────────── */}
                        {step === 1 && (
                            <div>
                                <StepHeader icon={<Building2 size={20} color={P} />} title="Company Profile" sub="Tell us about your organisation" />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                    <div>
                                        <Label required>Company Name</Label>
                                        <SInput value={companyName} onChange={setCompanyName} placeholder="Acme Inc." />
                                    </div>
                                    <div>
                                        <Label required>Industry</Label>
                                        <SSelect value={industry} onChange={setIndustry} options={INDUSTRIES} placeholder="Select your industry…" />
                                    </div>
                                    <div>
                                        <Label required>Company Size</Label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                                            {COMPANY_SIZES.map(s => {
                                                const sel = companySize === s.value;
                                                return (
                                                    <div key={s.value} onClick={() => setCompanySize(s.value)} style={{ padding: '12px 8px', textAlign: 'center', borderRadius: 10, border: `2px solid ${sel ? P : '#E2E8F0'}`, background: sel ? '#EDE9FE' : '#fff', cursor: 'pointer', transition: 'all 0.15s', boxShadow: sel ? `0 0 0 3px rgba(124,58,237,0.1)` : 'none' }}>
                                                        <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
                                                        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: sel ? P : '#374151' }}>{s.label}</p>
                                                        <p style={{ margin: 0, fontSize: 10, color: '#94A3B8' }}>{s.sub}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Website <span style={{ fontWeight: 400, color: '#94A3B8', fontSize: 12 }}>(optional)</span></Label>
                                        <SInput value={website} onChange={setWebsite} placeholder="https://yourcompany.com" type="url" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 2: Team Setup ──────────────────────────── */}
                        {step === 2 && (
                            <div>
                                <StepHeader icon={<Users size={20} color={P} />} title="Team Setup" sub="How your team works and which departments you have" />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                                    <div>
                                        <Label required>Work Style</Label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                                            {WORK_TYPES.map(w => {
                                                const Icon = w.icon;
                                                const sel  = workType === w.key;
                                                return (
                                                    <div key={w.key} onClick={() => setWorkType(w.key)} style={{ padding: '16px 12px', textAlign: 'center', borderRadius: 12, border: `2px solid ${sel ? P : '#E2E8F0'}`, background: sel ? '#EDE9FE' : '#fff', cursor: 'pointer', transition: 'all 0.15s', boxShadow: sel ? `0 0 0 3px rgba(124,58,237,0.1)` : 'none' }}>
                                                        <Icon size={24} color={sel ? P : '#94A3B8'} style={{ marginBottom: 8 }} />
                                                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: sel ? P : '#374151' }}>{w.label}</p>
                                                        <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94A3B8', lineHeight: 1.3 }}>{w.desc}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Departments <span style={{ fontWeight: 400, color: '#94A3B8', fontSize: 12 }}>(select all that apply)</span></Label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                            {DEPT_OPTIONS.map(d => {
                                                const sel = depts.includes(d);
                                                return (
                                                    <button key={d} onClick={() => toggleDept(d)} style={{ padding: '7px 14px', borderRadius: 20, border: `1.5px solid ${sel ? P : '#E2E8F0'}`, background: sel ? '#EDE9FE' : '#fff', color: sel ? P : '#374151', fontSize: 13, fontWeight: sel ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        {sel && <Check size={11} color={P} strokeWidth={3} />}{d}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {depts.length > 0 && <p style={{ margin: '10px 0 0', fontSize: 12, color: P, fontWeight: 600 }}>✓ {depts.length} department{depts.length !== 1 ? 's' : ''} selected</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 3: Goals ───────────────────────────────── */}
                        {step === 3 && (
                            <div>
                                <StepHeader icon={<Target size={20} color={P} />} title="Primary Goals" sub="Select what you want to achieve — we'll configure your workspace accordingly" />
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 12 }}>
                                    {GOALS.map(g => {
                                        const Icon = g.Icon;
                                        const sel  = goals.includes(g.key);
                                        return (
                                            <div key={g.key} onClick={() => toggleGoal(g.key)} style={{ border: `2px solid ${sel ? g.border : '#E2E8F0'}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', background: sel ? g.color : '#fff', transition: 'all 0.15s', position: 'relative', boxShadow: sel ? `0 0 0 3px ${g.border}55` : 'none' }}>
                                                {sel && (
                                                    <div style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: '50%', background: g.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Check size={11} color="#fff" strokeWidth={3} />
                                                    </div>
                                                )}
                                                <Icon size={22} color={g.text} style={{ marginBottom: 8 }} />
                                                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{g.key}</p>
                                                <p style={{ margin: '3px 0 0', fontSize: 11, color: '#64748B' }}>{g.desc}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                                {goals.length > 0 && <p style={{ margin: 0, fontSize: 13, color: P, fontWeight: 600 }}>✓ {goals.length} feature{goals.length !== 1 ? 's' : ''} selected</p>}
                            </div>
                        )}

                        {/* ── STEP 4: Workspace ───────────────────────────── */}
                        {step === 4 && (
                            <div>
                                <StepHeader icon={<Settings2 size={20} color={P} />} title="Workspace Preferences" sub="Set your defaults — you can always change these in Settings" />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <div>
                                        <Label required>Timezone</Label>
                                        <SSelect value={timezone} onChange={setTimezone} options={TIMEZONES} />
                                    </div>
                                    <div>
                                        <Label required>Default Project View</Label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                                            {PM_VIEWS.map(v => {
                                                const Icon = v.Icon;
                                                const sel  = pmView === v.key;
                                                return (
                                                    <div key={v.key} onClick={() => setPmView(v.key)} style={{ padding: '14px 10px', textAlign: 'center', borderRadius: 12, border: `2px solid ${sel ? P : '#E2E8F0'}`, background: sel ? '#EDE9FE' : '#fff', cursor: 'pointer', transition: 'all 0.15s', boxShadow: sel ? `0 0 0 3px rgba(124,58,237,0.1)` : 'none' }}>
                                                        <Icon size={22} color={sel ? P : '#94A3B8'} style={{ marginBottom: 6 }} />
                                                        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: sel ? P : '#374151' }}>{v.label}</p>
                                                        <p style={{ margin: '2px 0 0', fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>{v.desc}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Currency</Label>
                                        <SSelect value={currency} onChange={setCurrency} options={CURRENCIES} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 5: Branding (optional) ─────────────────── */}
                        {step === 5 && (
                            <div>
                                <StepHeader icon={<Palette size={20} color={P} />} title="Branding" sub="Optional — personalise client-facing portals and reports" />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    {/* Logo upload */}
                                    <div>
                                        <Label>Company Logo</Label>
                                        <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
                                        <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed #DDD6FE', borderRadius: 14, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', background: '#FDFCFF', transition: 'border 0.15s' }}
                                            onMouseEnter={e => (e.currentTarget.style.borderColor = P)}
                                            onMouseLeave={e => (e.currentTarget.style.borderColor = '#DDD6FE')}
                                        >
                                            {logoPreview ? (
                                                <div>
                                                    <img src={logoPreview} alt="Logo" style={{ maxHeight: 80, maxWidth: 200, objectFit: 'contain', borderRadius: 8, marginBottom: 10 }} />
                                                    <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>Click to change</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                                        <Palette size={22} color={P} />
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: PD }}>Upload your logo</p>
                                                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94A3B8' }}>PNG, JPG or SVG — max 2MB</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Brand colour */}
                                    <div>
                                        <Label>Brand Colour</Label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                                            {BRAND_COLORS.map(c => (
                                                <div key={c} onClick={() => setBrandColor(c)} style={{ width: 36, height: 36, borderRadius: '50%', background: c, cursor: 'pointer', border: `3px solid ${brandColor === c ? '#fff' : 'transparent'}`, outline: `2px solid ${brandColor === c ? c : 'transparent'}`, transition: 'all 0.15s', boxShadow: brandColor === c ? `0 0 0 4px ${c}33` : 'none' }} />
                                            ))}
                                            {/* Custom color */}
                                            <label style={{ position: 'relative', width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', border: '2px dashed #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <input type="color" value={brandColor} onChange={e => setBrandColor(e.target.value)} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                                                <Plus size={14} color="#94A3B8" />
                                            </label>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#F8FAFC', borderRadius: 9, border: '1px solid #E2E8F0' }}>
                                            <div style={{ width: 24, height: 24, borderRadius: 6, background: brandColor, flexShrink: 0 }} />
                                            <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>Selected: {brandColor}</span>
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    <div style={{ padding: '16px 20px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                                        <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preview</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 10, background: brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                {logoPreview ? <img src={logoPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 16, color: '#fff', fontWeight: 800 }}>{companyName.charAt(0) || 'A'}</span>}
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: PD }}>{companyName || 'Your Company'}</p>
                                                <p style={{ margin: 0, fontSize: 12, color: brandColor, fontWeight: 600 }}>Powered by Teamwork Pro</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 6: Invite (optional) ───────────────────── */}
                        {step === 6 && (
                            <div>
                                <StepHeader icon={<Mail size={20} color={P} />} title="Invite Your Team" sub="Add members — they'll get a welcome email with login credentials" />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                                    {invites.map((row, idx) => (
                                        <div key={row.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700, color: P }}>{idx + 1}</div>
                                            <input
                                                type="email" value={row.email} placeholder={`colleague${idx + 1}@company.com`}
                                                onChange={e => updateInvite(row.id, 'email', e.target.value)}
                                                style={{ flex: 1, padding: '9px 12px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 13, outline: 'none', transition: 'border 0.15s' }}
                                                onFocus={e => (e.target.style.borderColor = P)}
                                                onBlur={e  => (e.target.style.borderColor = '#E2E8F0')}
                                            />
                                            <select
                                                value={row.role} onChange={e => updateInvite(row.id, 'role', e.target.value as any)}
                                                style={{ padding: '9px 10px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', outline: 'none', cursor: 'pointer', color: '#374151' }}
                                            >
                                                <option value="manager">Manager</option>
                                                <option value="employee">Employee</option>
                                                <option value="client">Client</option>
                                            </select>
                                            {invites.length > 1 && (
                                                <button onClick={() => removeInvite(row.id)} style={{ width: 30, height: 30, border: '1px solid #FCA5A5', background: '#FFF1F2', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <Trash2 size={13} color="#EF4444" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addInvite} style={{ width: '100%', padding: '10px', borderRadius: 9, border: '2px dashed #DDD6FE', background: '#FDFCFF', color: P, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
                                    <Plus size={15} /> Add another teammate
                                </button>
                                <div style={{ padding: '12px 16px', background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 10 }}>
                                    <p style={{ margin: 0, fontSize: 12, color: '#5B21B6', lineHeight: 1.5 }}>You can skip this and invite team members any time from <strong>Team Management</strong>.</p>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 7: All Set ─────────────────────────────── */}
                        {step === 7 && (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
                                    <div style={{ fontSize: 72, lineHeight: 1 }}>🎉</div>
                                    <span style={{ position: 'absolute', top: -8, right: -16, fontSize: 28 }}>✨</span>
                                    <span style={{ position: 'absolute', bottom: 0, left: -16, fontSize: 22 }}>🌟</span>
                                </div>
                                <h1 style={{ fontSize: 30, fontWeight: 800, color: PD, margin: '0 0 10px' }}>You're all set, {ownerName}!</h1>
                                <p style={{ fontSize: 15, color: '#64748B', margin: '0 auto 32px', maxWidth: 420, lineHeight: 1.7 }}>
                                    <strong style={{ color: PD }}>{companyName || 'Your workspace'}</strong> is configured and ready. Your team will love it.
                                </p>

                                {/* Summary card */}
                                <div style={{ background: 'linear-gradient(135deg,#EDE9FE,#F5F3FF)', border: '1px solid #DDD6FE', borderRadius: 16, padding: '24px', textAlign: 'left', marginBottom: 28 }}>
                                    <p style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 700, color: P, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Workspace Summary</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        {[
                                            { label: 'Company',     value: companyName || '—'                          },
                                            { label: 'Industry',    value: industry.replace(/^.{1,3} /, '') || '—'      },
                                            { label: 'Company Size',value: companySize || '—'                          },
                                            { label: 'Work Style',  value: WORK_TYPES.find(w => w.key === workType)?.label || '—' },
                                            { label: 'Timezone',    value: timezone.split(' ').slice(0,1).join('') || '—' },
                                            { label: 'Project View',value: PM_VIEWS.find(v => v.key === pmView)?.label || '—' },
                                            { label: 'Currency',    value: currency || '—'                             },
                                            { label: 'Departments', value: depts.length > 0 ? `${depts.length} added` : 'None yet' },
                                        ].map(r => (
                                            <div key={r.label} style={{ padding: '10px 12px', background: '#fff', borderRadius: 9, border: '1px solid #EDE9FE' }}>
                                                <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{r.label}</p>
                                                <p style={{ margin: '3px 0 0', fontSize: 13, fontWeight: 600, color: PD }}>{r.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {goals.length > 0 && (
                                        <div style={{ marginTop: 14 }}>
                                            <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Selected Features</p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                {goals.map(g => {
                                                    const gObj = GOALS.find(x => x.key === g);
                                                    return <span key={g} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: gObj?.color ?? '#EDE9FE', color: gObj?.text ?? P, border: `1px solid ${gObj?.border ?? '#DDD6FE'}` }}>{g}</span>;
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    {/* Brand colour swatch */}
                                    <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 20, height: 20, borderRadius: 5, background: brandColor, border: '2px solid rgba(255,255,255,0.8)', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }} />
                                        <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Brand colour: {brandColor}</span>
                                    </div>
                                </div>

                                <button onClick={finish} style={{ width: '100%', padding: '15px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${PD},${P})`, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 6px 20px rgba(124,58,237,0.35)' }}>
                                    <Rocket size={18} /> Go to My Dashboard
                                </button>
                            </div>
                        )}

                        {/* ── Navigation ──────────────────────────────────── */}
                        {step > 0 && !isLast && (
                            <div style={{ display: 'flex', gap: 12, marginTop: 32, alignItems: 'center' }}>
                                <button onClick={back} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '11px 20px', borderRadius: 10, border: '1.5px solid #E2E8F0', background: '#fff', color: '#374151', fontSize: 14, fontWeight: 600, cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}>
                                    <ChevronLeft size={16} /> Back
                                </button>

                                <button onClick={next} disabled={!canNext[step]}
                                    style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: canNext[step] ? `linear-gradient(135deg,${PD},${P})` : '#E2E8F0', color: canNext[step] ? '#fff' : '#94A3B8', fontSize: 14, fontWeight: 700, cursor: canNext[step] ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s', boxShadow: canNext[step] ? '0 4px 14px rgba(124,58,237,0.3)' : 'none' }}>
                                    {step === 6 ? 'Finish Setup' : 'Continue'} <ChevronRight size={16} />
                                </button>
                            </div>
                        )}

                        {/* Skip button for optional steps */}
                        {isOptional && !isLast && (
                            <div style={{ textAlign: 'center', marginTop: 14 }}>
                                <button onClick={skip} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#94A3B8', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                                    Skip this step for now
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
