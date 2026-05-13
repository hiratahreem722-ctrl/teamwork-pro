import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { message } from 'antd';
import {
    Plus, Mail, Trash2, FolderOpen, Users, Crown, Briefcase,
    ChevronRight, ChevronLeft, Check, X,
    User, Phone, Home, Shield, MapPin, Clock,
    DollarSign, Lock, Settings, FileText,
    AlertTriangle, Star, Building2,
} from 'lucide-react';
import { useState } from 'react';
import { AddEmployeeModal } from '@/Pages/HR/Employees';
import { AddClientModal }   from '@/Pages/Clients/Index';

// ── Palette ────────────────────────────────────────────────────────────────────
const P  = '#7C3AED';
const PD = '#1E1B4B';
const card: React.CSSProperties = {
    background: '#fff', borderRadius: 12,
    border: '1px solid #EDE9FE',
    boxShadow: '0 1px 3px rgba(124,58,237,0.06)',
};

// ── Mock members ───────────────────────────────────────────────────────────────
interface Member {
    id: number; name: string; email: string; role: 'manager'|'employee'|'client';
    title: string; dept: string; joined: string; status: 'Active'|'On Leave'|'Remote'|'Inactive';
    projects: number; avatar: string; avatarColor: string;
}

const MEMBERS: Member[] = [
    { id:1,  name:'Ali Raza',       email:'ali@acmecorp.com',    role:'manager',  title:'Engineering Manager', dept:'Engineering', joined:'Jan 15, 2024', status:'Active',   projects:3, avatar:'AR', avatarColor:'#7C3AED' },
    { id:2,  name:'Sara Malik',     email:'sara@acmecorp.com',   role:'manager',  title:'Product Manager',     dept:'Product',     joined:'Mar 2, 2024',  status:'Active',   projects:4, avatar:'SM', avatarColor:'#A855F7' },
    { id:3,  name:'Hamza Awan',     email:'hamza@acmecorp.com',  role:'employee', title:'Full Stack Developer', dept:'Engineering', joined:'Apr 10, 2024', status:'Active',   projects:3, avatar:'HA', avatarColor:'#3B82F6' },
    { id:4,  name:'Zara Ahmed',     email:'zara@acmecorp.com',   role:'employee', title:'UI/UX Designer',       dept:'Design',      joined:'Apr 22, 2024', status:'Remote',   projects:2, avatar:'ZA', avatarColor:'#EC4899' },
    { id:5,  name:'Marcus Chen',    email:'marcus@acmecorp.com', role:'employee', title:'Backend Developer',    dept:'Engineering', joined:'Jun 1, 2024',  status:'Active',   projects:2, avatar:'MC', avatarColor:'#F59E0B' },
    { id:6,  name:'Lisa Park',      email:'lisa@acmecorp.com',   role:'employee', title:'QA Engineer',          dept:'QA',          joined:'Jul 15, 2024', status:'On Leave', projects:3, avatar:'LP', avatarColor:'#10B981' },
    { id:7,  name:'John Client',    email:'john@acmecorp.com',   role:'client',   title:'CEO',                  dept:'Acme Corp',   joined:'Feb 28, 2026', status:'Active',   projects:2, avatar:'JC', avatarColor:'#64748B' },
    { id:8,  name:'Delta Corp',     email:'delta@deltacorp.com', role:'client',   title:'Procurement Lead',     dept:'Delta Corp',  joined:'Mar 10, 2026', status:'Active',   projects:1, avatar:'DC', avatarColor:'#0369A1' },
];

const DEFAULT_DEPTS = ['Engineering','Design','Operations','HR','Finance','Sales','Marketing','Analytics','Product','QA'];

// ── Status badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Member['status'] }) {
    const cfg = {
        Active:    { bg:'#DCFCE7', text:'#16A34A' },
        Remote:    { bg:'#EFF6FF', text:'#2563EB' },
        'On Leave':{ bg:'#FEF9C3', text:'#CA8A04' },
        Inactive:  { bg:'#F1F5F9', text:'#94A3B8' },
    }[status];
    return <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:cfg.bg, color:cfg.text }}>{status}</span>;
}

function RoleBadge({ role }: { role: Member['role'] }) {
    const cfg = {
        manager:  { bg:'#EDE9FE', text:'#7C3AED', label:'Manager'  },
        employee: { bg:'#EFF6FF', text:'#2563EB', label:'Employee' },
        client:   { bg:'#F0FDF4', text:'#16A34A', label:'Client'   },
    }[role];
    return <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:cfg.bg, color:cfg.text }}>{cfg.label}</span>;
}

// ══════════════════════════════════════════════════════════════════════════════
// Role Picker Modal
// ══════════════════════════════════════════════════════════════════════════════
interface RolePickerProps {
    open: boolean;
    onClose: () => void;
    onSelect: (role: 'manager'|'employee'|'client') => void;
}

export function RolePickerModal({ open, onClose, onSelect }: RolePickerProps) {
    const [hovered, setHovered] = useState<string|null>(null);

    if (!open) return null;

    const roles = [
        {
            key: 'manager' as const,
            icon: Crown,
            iconColor: '#7C3AED',
            iconBg: '#EDE9FE',
            border: '#C4B5FD',
            title: 'Manager',
            desc: 'Manages projects, teams, approvals, and has elevated permissions across the workspace.',
            perks: ['Approve leave & timesheets', 'Create & manage projects', 'View performance reports', 'Invite team members'],
        },
        {
            key: 'employee' as const,
            icon: Users,
            iconColor: '#2563EB',
            iconBg: '#EFF6FF',
            border: '#BFDBFE',
            title: 'Employee',
            desc: 'Works on assigned tasks and projects. Has access to personal HR data and work tools.',
            perks: ['Access assigned projects', 'Log time & attendance', 'View own payslips', 'Submit leave requests'],
        },
        {
            key: 'client' as const,
            icon: Briefcase,
            iconColor: '#16A34A',
            iconBg: '#F0FDF4',
            border: '#BBF7D0',
            title: 'Client',
            desc: 'External stakeholder with view-only access to their project progress and invoices.',
            perks: ['View assigned projects', 'Access invoices & reports', 'Submit feedback', 'Download documents'],
        },
    ];

    return (
        <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(15,23,42,0.5)', backdropFilter:'blur(3px)' }} />
            <div style={{ position:'relative', width:740, maxWidth:'95vw', background:'#fff', borderRadius:20, boxShadow:'0 25px 60px rgba(15,23,42,0.2)', overflow:'hidden' }}>

                {/* Header */}
                <div style={{ background:`linear-gradient(135deg,${PD},${P})`, padding:'28px 32px', position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
                    <div style={{ position:'relative' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                            <div>
                                <p style={{ margin:'0 0 4px', fontSize:12, fontWeight:600, color:'rgba(196,181,253,0.8)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Team Management</p>
                                <h2 style={{ margin:0, fontSize:22, fontWeight:800, color:'#fff' }}>Who are you adding?</h2>
                                <p style={{ margin:'6px 0 0', fontSize:13, color:'rgba(255,255,255,0.6)' }}>Choose a member type to start the right onboarding flow</p>
                            </div>
                            <button onClick={onClose} style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:10, width:36, height:36, cursor:'pointer', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Role cards */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, padding:'28px 32px 32px' }}>
                    {roles.map(r => {
                        const Icon = r.icon;
                        const isHovered = hovered === r.key;
                        return (
                            <button
                                key={r.key}
                                onClick={() => onSelect(r.key)}
                                onMouseEnter={() => setHovered(r.key)}
                                onMouseLeave={() => setHovered(null)}
                                style={{
                                    border: `2px solid ${isHovered ? r.border : '#EDE9FE'}`,
                                    borderRadius: 16, padding:'22px 18px', background: isHovered ? '#FDFCFF' : '#fff',
                                    cursor:'pointer', textAlign:'left', transition:'all 0.18s',
                                    boxShadow: isHovered ? `0 8px 24px rgba(124,58,237,0.12)` : '0 1px 4px rgba(0,0,0,0.04)',
                                    transform: isHovered ? 'translateY(-2px)' : 'none',
                                }}
                            >
                                {/* Icon */}
                                <div style={{ width:48, height:48, borderRadius:14, background:r.iconBg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                                    <Icon size={22} color={r.iconColor} />
                                </div>
                                <h3 style={{ margin:'0 0 6px', fontSize:16, fontWeight:800, color:PD }}>{r.title}</h3>
                                <p style={{ margin:'0 0 14px', fontSize:12, color:'#64748B', lineHeight:1.5 }}>{r.desc}</p>
                                <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:5 }}>
                                    {r.perks.map(p => (
                                        <li key={p} style={{ display:'flex', alignItems:'center', gap:7, fontSize:11, color:'#374151' }}>
                                            <div style={{ width:16, height:16, borderRadius:'50%', background:r.iconBg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                                <Check size={9} color={r.iconColor} strokeWidth={3} />
                                            </div>
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                                <div style={{ marginTop:18, display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, color:r.iconColor }}>
                                    Add {r.title} <ChevronRight size={14} />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// Manager Onboarding Modal (new, 5-step)
// ══════════════════════════════════════════════════════════════════════════════
const MGR_STEPS = [
    { key:'personal',     label:'Personal Details',  icon: User      },
    { key:'role',         label:'Role & Scope',       icon: Crown     },
    { key:'permissions',  label:'Permissions',        icon: Lock      },
    { key:'compensation', label:'Compensation',       icon: DollarSign},
    { key:'review',       label:'Review & Invite',   icon: Check     },
];

function FieldRow({ children }: { children: React.ReactNode }) {
    return <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 16px' }}>{children}</div>;
}
function Field({ label, required, children, fullWidth }: { label: string; required?: boolean; children: React.ReactNode; fullWidth?: boolean }) {
    return (
        <div style={{ marginBottom:12, gridColumn: fullWidth ? '1/-1' : undefined }}>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:5 }}>
                {label}{required && <span style={{ color:'#EF4444', marginLeft:3 }}>*</span>}
            </label>
            {children}
        </div>
    );
}
function TextInput({ placeholder, type, value, onChange }: { placeholder?: string; type?: string; value?: string; onChange?: (v:string)=>void }) {
    return (
        <input type={type ?? 'text'} value={value ?? ''} onChange={e => onChange?.(e.target.value)} placeholder={placeholder}
            style={{ width:'100%', padding:'8px 12px', border:'1px solid #E2E8F0', borderRadius:8, fontSize:13, color:'#1E293B', outline:'none', boxSizing:'border-box', background:'#fff', transition:'border 0.15s' }}
            onFocus={e => (e.target.style.borderColor=P)}
            onBlur={e => (e.target.style.borderColor='#E2E8F0')}
        />
    );
}
function SelectInput({ options, value, onChange, placeholder }: { options:{label:string;value:string}[]; value?:string; onChange?:(v:string)=>void; placeholder?:string }) {
    return (
        <select value={value ?? ''} onChange={e => onChange?.(e.target.value)}
            style={{ width:'100%', padding:'8px 12px', border:'1px solid #E2E8F0', borderRadius:8, fontSize:13, color: value ? '#1E293B' : '#94A3B8', outline:'none', boxSizing:'border-box', background:'#fff', appearance:'none', cursor:'pointer' }}
            onFocus={e => (e.target.style.borderColor=P)}
            onBlur={e => (e.target.style.borderColor='#E2E8F0')}
        >
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    );
}

function PermissionToggle({ label, description, checked, onChange, color='#7C3AED' }: { label: string; description: string; checked: boolean; onChange: () => void; color?: string }) {
    return (
        <div onClick={onChange}
            style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 14px', borderRadius:10, border:`1.5px solid ${checked ? color : '#E2E8F0'}`, background: checked ? '#FDFCFF' : '#FAFAFA', cursor:'pointer', transition:'all 0.15s' }}>
            <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${checked ? color : '#D1D5DB'}`, background: checked ? color : '#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.15s', marginTop:1 }}>
                {checked && <Check size={13} color="#fff" strokeWidth={3} />}
            </div>
            <div>
                <p style={{ margin:0, fontSize:13, fontWeight:600, color:'#1E1B4B' }}>{label}</p>
                <p style={{ margin:'2px 0 0', fontSize:11, color:'#94A3B8', lineHeight:1.4 }}>{description}</p>
            </div>
        </div>
    );
}

export function AddManagerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [step, setStep]             = useState(0);
    const [completed, setCompleted]   = useState<Set<number>>(new Set());
    const [sendInvite, setSendInvite] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form data
    const [data, setData] = useState<Record<string,string>>({});
    const [perms, setPerms] = useState({
        approveLeave:     true,
        viewSalaries:     false,
        createProjects:   true,
        inviteMembers:    true,
        manageTimesheets: true,
        viewFinancials:   false,
        setReviews:       true,
        managePayroll:    false,
    });
    const [errors, setErrors] = useState<Record<string,string>>({});

    const reset = () => {
        setStep(0); setCompleted(new Set()); setData({}); setErrors({}); setSendInvite(true); setSubmitting(false);
        setPerms({ approveLeave:true, viewSalaries:false, createProjects:true, inviteMembers:true, manageTimesheets:true, viewFinancials:false, setReviews:true, managePayroll:false });
    };

    const set = (k: string, v: string) => { setData(d => ({ ...d, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };
    const togglePerm = (k: keyof typeof perms) => setPerms(p => ({ ...p, [k]: !p[k] }));

    const validate = (s: number): boolean => {
        const errs: Record<string,string> = {};
        if (s === 0) {
            if (!data.firstName?.trim()) errs.firstName = 'Required';
            if (!data.lastName?.trim())  errs.lastName  = 'Required';
            if (!data.email?.trim())     errs.email     = 'Required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Invalid email';
        }
        if (s === 1) {
            if (!data.title?.trim())      errs.title      = 'Required';
            if (!data.department?.trim()) errs.department = 'Required';
        }
        if (s === 3) {
            if (!data.salaryType) errs.salaryType = 'Required';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleNext = () => {
        if (!validate(step)) return;
        setCompleted(prev => new Set([...prev, step]));
        setStep(s => s + 1);
    };
    const handleBack = () => { setErrors({}); setStep(s => s - 1); };

    const handleSubmit = () => {
        setSubmitting(true);
        const name = `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim();

        router.post(route('owner.invite.manager'), {
            ...data,
            permissions: perms,
            sendInvite,
        }, {
            onSuccess: () => {
                message.success(`Manager "${name}" added successfully!`);
                reset();
                onClose();
            },
            onError: (errs) => {
                setSubmitting(false);
                const firstErr = Object.values(errs)[0];
                message.error(firstErr ?? 'Failed to add manager. Please check the form.');
                // Map server errors back to fields
                if (errs.email) { setStep(0); setErrors(e => ({ ...e, email: errs.email })); }
            },
        });
    };

    const handleCancel = () => { reset(); onClose(); };

    if (!open) return null;

    const stepContent: Record<number, React.ReactNode> = {
        // Step 0 — Personal
        0: (
            <div>
                <FieldRow>
                    <Field label="First Name" required>
                        <TextInput value={data.firstName} onChange={v => set('firstName', v)} placeholder="Ali" />
                        {errors.firstName && <p style={{ margin:'3px 0 0', fontSize:11, color:'#EF4444' }}>{errors.firstName}</p>}
                    </Field>
                    <Field label="Last Name" required>
                        <TextInput value={data.lastName} onChange={v => set('lastName', v)} placeholder="Raza" />
                        {errors.lastName && <p style={{ margin:'3px 0 0', fontSize:11, color:'#EF4444' }}>{errors.lastName}</p>}
                    </Field>
                    <Field label="Email Address" required>
                        <TextInput type="email" value={data.email} onChange={v => set('email', v)} placeholder="ali@company.com" />
                        {errors.email && <p style={{ margin:'3px 0 0', fontSize:11, color:'#EF4444' }}>{errors.email}</p>}
                    </Field>
                    <Field label="Phone Number">
                        <TextInput type="tel" value={data.phone} onChange={v => set('phone', v)} placeholder="+1 555 000 0000" />
                    </Field>
                    <Field label="Date of Birth">
                        <TextInput type="date" value={data.dob} onChange={v => set('dob', v)} />
                    </Field>
                    <Field label="Gender">
                        <SelectInput value={data.gender} onChange={v => set('gender', v)} placeholder="Select"
                            options={['Male','Female','Non-binary','Prefer not to say'].map(g => ({ label:g, value:g }))} />
                    </Field>
                    <Field label="Home Address" fullWidth>
                        <TextInput value={data.address} onChange={v => set('address', v)} placeholder="123 Main St, City, Country" />
                    </Field>
                </FieldRow>
            </div>
        ),

        // Step 1 — Role & Scope
        1: (
            <div>
                <FieldRow>
                    <Field label="Job Title" required>
                        <TextInput value={data.title} onChange={v => set('title', v)} placeholder="Engineering Manager" />
                        {errors.title && <p style={{ margin:'3px 0 0', fontSize:11, color:'#EF4444' }}>{errors.title}</p>}
                    </Field>
                    <Field label="Department" required>
                        <SelectInput value={data.department} onChange={v => set('department', v)} placeholder="Select department"
                            options={DEFAULT_DEPTS.map(d => ({ label:d, value:d }))} />
                        {errors.department && <p style={{ margin:'3px 0 0', fontSize:11, color:'#EF4444' }}>{errors.department}</p>}
                    </Field>
                    <Field label="Management Level">
                        <SelectInput value={data.level} onChange={v => set('level', v)} placeholder="Select level"
                            options={['C-Level','VP / Director','Senior Manager','Manager','Team Lead'].map(l => ({ label:l, value:l }))} />
                    </Field>
                    <Field label="Reports To">
                        <SelectInput value={data.reportsTo} onChange={v => set('reportsTo', v)} placeholder="Select manager"
                            options={['John Owner','Ali Raza','Sara Malik'].map(n => ({ label:n, value:n }))} />
                    </Field>
                    <Field label="Start Date">
                        <TextInput type="date" value={data.startDate} onChange={v => set('startDate', v)} />
                    </Field>
                    <Field label="Work Location">
                        <SelectInput value={data.workLocation} onChange={v => set('workLocation', v)} placeholder="Select"
                            options={['On-site','Remote','Hybrid'].map(w => ({ label:w, value:w }))} />
                    </Field>
                    <Field label="Teams / Projects Scope" fullWidth>
                        <SelectInput value={data.scope} onChange={v => set('scope', v)} placeholder="What can this manager oversee?"
                            options={['All Projects','Engineering Only','Design Only','Specific Team','Own Team Only'].map(s => ({ label:s, value:s }))} />
                    </Field>
                </FieldRow>
            </div>
        ),

        // Step 2 — Permissions
        2: (
            <div>
                <p style={{ margin:'0 0 16px', fontSize:13, color:'#6B7280' }}>
                    Define what this manager can do in the workspace. You can adjust these at any time from Settings.
                </p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <PermissionToggle label="Approve Leave Requests" description="Can approve/reject employee leave applications" checked={perms.approveLeave} onChange={() => togglePerm('approveLeave')} />
                    <PermissionToggle label="Create & Delete Projects" description="Can create, archive, and remove projects" checked={perms.createProjects} onChange={() => togglePerm('createProjects')} />
                    <PermissionToggle label="Invite Team Members" description="Can send invitations and add new members" checked={perms.inviteMembers} onChange={() => togglePerm('inviteMembers')} />
                    <PermissionToggle label="Manage Timesheets" description="Can approve and edit team time entries" checked={perms.manageTimesheets} onChange={() => togglePerm('manageTimesheets')} />
                    <PermissionToggle label="Set Performance Reviews" description="Can create and submit performance reviews" checked={perms.setReviews} onChange={() => togglePerm('setReviews')} />
                    <PermissionToggle label="View Team Salaries" description="Can see salary information for their team" checked={perms.viewSalaries} onChange={() => togglePerm('viewSalaries')} color="#D97706" />
                    <PermissionToggle label="Access Financial Reports" description="Can view invoices, expenses, and budget data" checked={perms.viewFinancials} onChange={() => togglePerm('viewFinancials')} color="#D97706" />
                    <PermissionToggle label="Manage Payroll" description="Can run and approve payroll for their team" checked={perms.managePayroll} onChange={() => togglePerm('managePayroll')} color="#EF4444" />
                </div>
                <div style={{ marginTop:14, padding:'10px 14px', background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:9, fontSize:11, color:'#92400E', display:'flex', alignItems:'center', gap:8 }}>
                    <AlertTriangle size={13} color="#D97706" />
                    Permissions marked in orange/red grant elevated access. Review carefully before enabling.
                </div>
            </div>
        ),

        // Step 3 — Compensation
        3: (
            <div>
                <FieldRow>
                    <Field label="Salary Type" required>
                        <SelectInput value={data.salaryType} onChange={v => set('salaryType', v)} placeholder="Select type"
                            options={[{label:'Annual Salary',value:'annual'},{label:'Monthly Salary',value:'monthly'},{label:'Hourly Rate',value:'hourly'}]} />
                        {errors.salaryType && <p style={{ margin:'3px 0 0', fontSize:11, color:'#EF4444' }}>{errors.salaryType}</p>}
                    </Field>
                    <Field label="Currency">
                        <SelectInput value={data.currency} onChange={v => set('currency', v)} placeholder="USD"
                            options={['USD','EUR','GBP','AED','PKR','CAD','AUD'].map(c => ({ label:c, value:c }))} />
                    </Field>
                    <Field label="Base Salary / Rate">
                        <TextInput type="number" value={data.baseSalary} onChange={v => set('baseSalary', v)} placeholder="e.g. 95000" />
                    </Field>
                    <Field label="Performance Bonus">
                        <SelectInput value={data.bonus} onChange={v => set('bonus', v)} placeholder="Select"
                            options={['No Bonus','5% of salary','10% of salary','15% of salary','Custom'].map(b => ({ label:b, value:b }))} />
                    </Field>
                    <Field label="Equity / Stock Options">
                        <SelectInput value={data.equity} onChange={v => set('equity', v)} placeholder="Select"
                            options={['None','0.1%','0.25%','0.5%','1%','Custom'].map(e => ({ label:e, value:e }))} />
                    </Field>
                    <Field label="Payment Frequency">
                        <SelectInput value={data.payFrequency} onChange={v => set('payFrequency', v)} placeholder="Select"
                            options={['Monthly','Bi-weekly','Weekly'].map(f => ({ label:f, value:f }))} />
                    </Field>
                    <Field label="Benefits Package" fullWidth>
                        <SelectInput value={data.benefits} onChange={v => set('benefits', v)} placeholder="Select benefits"
                            options={['Standard (Health + Dental)','Premium (Health + Dental + Vision)','Basic (Health only)','Custom','None'].map(b => ({ label:b, value:b }))} />
                    </Field>
                </FieldRow>
            </div>
        ),

        // Step 4 — Review
        4: (
            <div>
                <p style={{ margin:'0 0 16px', fontSize:13, color:'#6B7280' }}>Review the manager details before adding them to the workspace.</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                    {[
                        { label:'Full Name',   value: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim() || '—' },
                        { label:'Email',        value: data.email       || '—' },
                        { label:'Job Title',    value: data.title       || '—' },
                        { label:'Department',   value: data.department  || '—' },
                        { label:'Level',        value: data.level       || '—' },
                        { label:'Reports To',   value: data.reportsTo   || '—' },
                        { label:'Start Date',   value: data.startDate   || '—' },
                        { label:'Work Location',value: data.workLocation|| '—' },
                        { label:'Salary',       value: data.baseSalary ? `${data.currency ?? 'USD'} ${Number(data.baseSalary).toLocaleString()}` : '—' },
                        { label:'Bonus',        value: data.bonus       || '—' },
                    ].map(r => (
                        <div key={r.label} style={{ padding:'10px 14px', background:'#FAFBFF', borderRadius:9, border:'1px solid #EDE9FE' }}>
                            <p style={{ margin:0, fontSize:10, fontWeight:600, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.06em' }}>{r.label}</p>
                            <p style={{ margin:'3px 0 0', fontSize:13, fontWeight:600, color:PD }}>{r.value}</p>
                        </div>
                    ))}
                </div>
                {/* Permissions summary */}
                <div style={{ padding:'12px 14px', background:'#F5F3FF', border:'1px solid #EDE9FE', borderRadius:10 }}>
                    <p style={{ margin:'0 0 8px', fontSize:11, fontWeight:700, color:P, textTransform:'uppercase', letterSpacing:'0.07em' }}>Permissions granted</p>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                        {Object.entries(perms).filter(([,v]) => v).map(([k]) => {
                            const labels: Record<string,string> = {
                                approveLeave:'Approve Leave', viewSalaries:'View Salaries', createProjects:'Create Projects',
                                inviteMembers:'Invite Members', manageTimesheets:'Manage Timesheets',
                                viewFinancials:'View Financials', setReviews:'Set Reviews', managePayroll:'Manage Payroll',
                            };
                            return <span key={k} style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:'#EDE9FE', color:P }}>{labels[k]}</span>;
                        })}
                        {Object.values(perms).every(v => !v) && <span style={{ fontSize:12, color:'#94A3B8' }}>No permissions granted</span>}
                    </div>
                </div>
            </div>
        ),
    };

    return (
        <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div onClick={handleCancel} style={{ position:'absolute', inset:0, background:'rgba(15,23,42,0.45)', backdropFilter:'blur(2px)' }} />
            <div style={{ position:'relative', width:820, maxWidth:'95vw', maxHeight:'90vh', borderRadius:16, overflow:'hidden', display:'flex', boxShadow:'0 25px 60px rgba(15,23,42,0.25)' }}>

                {/* ── Left navigator ── */}
                <div style={{ width:220, background:PD, display:'flex', flexDirection:'column', flexShrink:0 }}>
                    <div style={{ padding:'24px 20px 20px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                            <div style={{ width:28, height:28, borderRadius:7, background:'linear-gradient(135deg,#7C3AED,#A855F7)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <Crown size={14} color="#fff" />
                            </div>
                            <span style={{ color:'#fff', fontWeight:700, fontSize:14 }}>Add Manager</span>
                        </div>
                        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11, margin:0 }}>Step {step + 1} of {MGR_STEPS.length}</p>
                    </div>
                    <div style={{ flex:1, padding:'16px 12px', display:'flex', flexDirection:'column', gap:4 }}>
                        {MGR_STEPS.map((s, idx) => {
                            const isActive    = idx === step;
                            const isDone      = completed.has(idx);
                            const isReachable = idx <= step || isDone;
                            const Icon        = s.icon;
                            return (
                                <button key={s.key} onClick={() => isReachable && setStep(idx)}
                                    style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, border:'none', cursor: isReachable ? 'pointer' : 'default', background: isActive ? 'rgba(167,139,250,0.18)' : 'transparent', width:'100%', textAlign:'left', transition:'background 0.15s' }}
                                    onMouseEnter={e => { if (!isActive && isReachable) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                                >
                                    <div style={{ width:28, height:28, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background: isDone ? '#16A34A' : isActive ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.07)', border: isActive ? '2px solid #A78BFA' : isDone ? '2px solid #16A34A' : '2px solid rgba(255,255,255,0.1)' }}>
                                        {isDone ? <Check size={13} color="#fff" strokeWidth={2.5} /> : <Icon size={13} color={isActive ? '#C4B5FD' : 'rgba(255,255,255,0.35)'} />}
                                    </div>
                                    <div>
                                        <p style={{ margin:0, fontSize:12, fontWeight: isActive ? 600 : 400, color: isActive ? '#E9D5FF' : isDone ? '#86EFAC' : 'rgba(255,255,255,0.45)', lineHeight:1.2 }}>{s.label}</p>
                                        <p style={{ margin:0, fontSize:10, color: isDone ? '#4ADE80' : 'rgba(255,255,255,0.2)', lineHeight:1 }}>{isDone ? 'Complete' : isActive ? 'In progress' : 'Pending'}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    <div style={{ padding:'14px 16px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                            <span style={{ fontSize:10, color:'rgba(255,255,255,0.35)' }}>Progress</span>
                            <span style={{ fontSize:10, color:'#A78BFA', fontWeight:600 }}>{Math.round((completed.size / MGR_STEPS.length) * 100)}%</span>
                        </div>
                        <div style={{ height:4, borderRadius:2, background:'rgba(255,255,255,0.1)' }}>
                            <div style={{ height:'100%', borderRadius:2, background:'linear-gradient(90deg,#7C3AED,#A855F7)', width:`${(completed.size / MGR_STEPS.length) * 100}%`, transition:'width 0.4s ease' }} />
                        </div>
                    </div>
                </div>

                {/* ── Right content ── */}
                <div style={{ flex:1, background:'#fff', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                    {/* Header */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 28px 16px', borderBottom:'1px solid #F5F3FF', flexShrink:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ width:36, height:36, borderRadius:9, background:'#F5F3FF', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                {(() => { const I = MGR_STEPS[step].icon; return <I size={17} color={P} />; })()}
                            </div>
                            <div>
                                <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:PD }}>{MGR_STEPS[step].label}</h3>
                                <p style={{ margin:0, fontSize:11, color:'#94A3B8' }}>Step {step + 1} of {MGR_STEPS.length}</p>
                            </div>
                        </div>
                        <button onClick={handleCancel} style={{ background:'none', border:'none', cursor:'pointer', color:'#94A3B8', padding:4, borderRadius:6, display:'flex' }}
                            onMouseEnter={e => (e.currentTarget.style.color='#EF4444')}
                            onMouseLeave={e => (e.currentTarget.style.color='#94A3B8')}>
                            <X size={18} />
                        </button>
                    </div>

                    {/* Scrollable body */}
                    <div style={{ flex:1, overflowY:'auto', padding:'20px 28px' }}>
                        {stepContent[step]}
                    </div>

                    {/* Invite checkbox — last step only */}
                    {step === MGR_STEPS.length - 1 && (
                        <div style={{ borderTop:'1px solid #EDE9FE', padding:'12px 28px', background: sendInvite ? '#F5FFFE' : '#FAFAFA', flexShrink:0, transition:'background 0.2s' }}>
                            <label style={{ display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
                                <div onClick={() => setSendInvite(v => !v)}
                                    style={{ width:20, height:20, borderRadius:6, flexShrink:0, border:`2px solid ${sendInvite ? '#059669' : '#D1D5DB'}`, background: sendInvite ? '#059669' : '#fff', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s', cursor:'pointer', boxShadow: sendInvite ? '0 0 0 3px rgba(5,150,105,0.12)' : 'none' }}>
                                    {sendInvite && <Check size={12} color="#fff" strokeWidth={3} />}
                                </div>
                                <div style={{ flex:1 }} onClick={() => setSendInvite(v => !v)}>
                                    <p style={{ margin:0, fontSize:13, fontWeight:600, color:PD, lineHeight:1.3 }}>Send invitation email</p>
                                    <p style={{ margin:'1px 0 0', fontSize:11, color:'#6B7280', lineHeight:1.3 }}>
                                        {data.email
                                            ? <><strong style={{ color:'#374151' }}>{data.email}</strong> will receive a link to set up their account</>
                                            : 'Manager will receive an email to set up their account'}
                                    </p>
                                </div>
                                <span style={{ fontSize:11, fontWeight:700, padding:'3px 12px', borderRadius:20, flexShrink:0, background: sendInvite ? '#DCFCE7' : '#F1F5F9', color: sendInvite ? '#16A34A' : '#94A3B8', border:`1px solid ${sendInvite ? '#BBF7D0' : '#E2E8F0'}` }}>
                                    {sendInvite ? '✉ Will send' : 'No email'}
                                </span>
                            </label>
                        </div>
                    )}

                    {/* Footer nav */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', borderTop:'1px solid #F5F3FF', flexShrink:0, background:'#FDFCFF' }}>
                        <button onClick={handleBack} disabled={step === 0}
                            style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 16px', borderRadius:8, border:`1px solid ${step === 0 ? '#F1F5F9' : '#EDE9FE'}`, background: step === 0 ? '#F9FAFB' : '#fff', color: step === 0 ? '#D1D5DB' : P, cursor: step === 0 ? 'default' : 'pointer', fontWeight:500, fontSize:13 }}>
                            <ChevronLeft size={14} /> Back
                        </button>
                        <div style={{ display:'flex', gap:6 }}>
                            {MGR_STEPS.map((_, i) => (
                                <div key={i} style={{ width: i === step ? 18 : 6, height:6, borderRadius:3, background: completed.has(i) ? P : i === step ? '#A78BFA' : '#E5E7EB', transition:'all 0.2s' }} />
                            ))}
                        </div>
                        {step < MGR_STEPS.length - 1 ? (
                            <button onClick={handleNext}
                                style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 18px', borderRadius:8, border:'none', background:`linear-gradient(135deg,${P},#A855F7)`, color:'#fff', cursor:'pointer', fontWeight:600, fontSize:13, boxShadow:'0 4px 12px rgba(124,58,237,0.3)' }}>
                                Next <ChevronRight size={14} />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={submitting}
                                style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 20px', borderRadius:8, border:'none', background: submitting ? '#94a3b8' : 'linear-gradient(135deg,#059669,#10B981)', color:'#fff', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight:600, fontSize:13, boxShadow:'0 4px 12px rgba(5,150,105,0.3)' }}>
                                <Check size={14} /> {submitting ? 'Saving...' : 'Add Manager'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main page
// ══════════════════════════════════════════════════════════════════════════════
type ActiveTab = 'all'|'managers'|'employees'|'clients';

export default function TeamIndex() {
    const [showPicker,   setShowPicker]   = useState(false);
    const [showManager,  setShowManager]  = useState(false);
    const [showEmployee, setShowEmployee] = useState(false);
    const [showClient,   setShowClient]   = useState(false);
    const [activeTab,    setActiveTab]    = useState<ActiveTab>('all');

    const handleRoleSelect = (role: 'manager'|'employee'|'client') => {
        setShowPicker(false);
        if (role === 'manager')  setShowManager(true);
        if (role === 'employee') setShowEmployee(true);
        if (role === 'client')   setShowClient(true);
    };

    const managers  = MEMBERS.filter(m => m.role === 'manager');
    const employees = MEMBERS.filter(m => m.role === 'employee');
    const clients   = MEMBERS.filter(m => m.role === 'client');

    const tabMembers: Record<ActiveTab, Member[]> = {
        all:       MEMBERS,
        managers,
        employees,
        clients,
    };
    const displayed = tabMembers[activeTab];

    const tabs: { key: ActiveTab; label: string; count: number }[] = [
        { key:'all',       label:'All',       count: MEMBERS.length  },
        { key:'managers',  label:'Managers',  count: managers.length  },
        { key:'employees', label:'Employees', count: employees.length },
        { key:'clients',   label:'Clients',   count: clients.length   },
    ];

    return (
        <AppLayout title="Team Management">
            <Head title="Team Management" />

            {/* Modals */}
            <RolePickerModal  open={showPicker}   onClose={() => setShowPicker(false)}   onSelect={handleRoleSelect} />
            <AddManagerModal  open={showManager}  onClose={() => setShowManager(false)}  />
            <AddEmployeeModal open={showEmployee} onClose={() => setShowEmployee(false)} deptNames={DEFAULT_DEPTS} />
            <AddClientModal   open={showClient}   onClose={() => setShowClient(false)}   />

            {/* Hero */}
            <div style={{ background:`linear-gradient(135deg,${PD},${P})`, borderRadius:16, padding:'24px 32px', marginBottom:24, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:-50, right:-50, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
                <div style={{ position:'absolute', bottom:-30, left:-30, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,0.03)' }} />
                <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
                    <div>
                        <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:6 }}>
                            <Crown size={14} color="#FCD34D" />
                            <span style={{ fontSize:11, fontWeight:700, color:'#FCD34D', textTransform:'uppercase', letterSpacing:'0.08em' }}>Owner</span>
                        </div>
                        <h1 style={{ margin:0, fontSize:22, fontWeight:800, color:'#fff' }}>Team Management</h1>
                        <p style={{ margin:'4px 0 0', fontSize:13, color:'rgba(255,255,255,0.6)' }}>{MEMBERS.length} members across your workspace.</p>
                    </div>
                    <button onClick={() => setShowPicker(true)}
                        style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:10, border:'1px solid rgba(255,255,255,0.25)', background:'rgba(255,255,255,0.14)', color:'#fff', cursor:'pointer', fontWeight:600, fontSize:13, backdropFilter:'blur(4px)', transition:'all 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.22)')}
                        onMouseLeave={e => (e.currentTarget.style.background='rgba(255,255,255,0.14)')}
                    >
                        <Plus size={16} /> Add Member
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
                {[
                    { label:'Total Members', value: MEMBERS.length,  icon: Users,    color:'#7C3AED', bg:'#F5F3FF' },
                    { label:'Managers',       value: managers.length,  icon: Crown,    color:'#A855F7', bg:'#EDE9FE' },
                    { label:'Employees',      value: employees.length, icon: Users,    color:'#2563EB', bg:'#EFF6FF' },
                ].map(s => (
                    <div key={s.label} style={{ ...card, padding:'18px 22px', display:'flex', alignItems:'center', gap:14 }}>
                        <div style={{ width:44, height:44, borderRadius:12, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <s.icon size={20} color={s.color} />
                        </div>
                        <div>
                            <p style={{ margin:0, fontSize:28, fontWeight:800, color:PD, lineHeight:1 }}>{s.value}</p>
                            <p style={{ margin:'3px 0 0', fontSize:12, color:'#94A3B8' }}>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tab bar */}
            <div style={{ display:'flex', gap:2, marginBottom:16, background:'#F5F3FF', borderRadius:10, padding:4, width:'fit-content' }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)}
                        style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 16px', borderRadius:8, border:'none', cursor:'pointer', fontWeight: activeTab === t.key ? 700 : 500, fontSize:13, background: activeTab === t.key ? '#fff' : 'transparent', color: activeTab === t.key ? P : '#64748B', boxShadow: activeTab === t.key ? '0 1px 4px rgba(124,58,237,0.12)' : 'none', transition:'all 0.15s' }}>
                        {t.label}
                        <span style={{ fontSize:11, fontWeight:700, minWidth:20, textAlign:'center', padding:'1px 7px', borderRadius:20, background: activeTab === t.key ? '#EDE9FE' : '#F1F5F9', color: activeTab === t.key ? P : '#94A3B8' }}>
                            {t.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Member table */}
            <div style={{ ...card, overflow:'hidden', marginBottom:24 }}>
                {/* Table header */}
                <div style={{ display:'grid', gridTemplateColumns:'2.5fr 1fr 1fr 1fr 1fr 100px', padding:'11px 20px', background:'#FAFBFF', borderBottom:'1px solid #EDE9FE', gap:8 }}>
                    {['MEMBER','ROLE','DEPARTMENT','STATUS','JOINED','ACTIONS'].map(h => (
                        <span key={h} style={{ fontSize:11, fontWeight:700, color:'#94A3B8', letterSpacing:'0.08em', textTransform:'uppercase' }}>{h}</span>
                    ))}
                </div>

                {displayed.length === 0 ? (
                    <div style={{ padding:'48px 20px', textAlign:'center', color:'#94A3B8' }}>
                        <Users size={32} style={{ opacity:0.2, marginBottom:12 }} />
                        <p style={{ margin:0, fontSize:14, fontWeight:600 }}>No {activeTab === 'all' ? 'members' : activeTab} yet</p>
                        <p style={{ margin:'4px 0 0', fontSize:12 }}>Click "Add Member" to onboard someone new</p>
                    </div>
                ) : displayed.map((m, idx) => (
                    <div key={m.id}
                        style={{ display:'grid', gridTemplateColumns:'2.5fr 1fr 1fr 1fr 1fr 100px', padding:'13px 20px', borderBottom: idx < displayed.length - 1 ? '1px solid #FAF8FF' : 'none', alignItems:'center', gap:8, transition:'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background='#FDFCFF')}
                        onMouseLeave={e => (e.currentTarget.style.background='')}
                    >
                        {/* Member */}
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ width:36, height:36, borderRadius:'50%', background:m.avatarColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff', flexShrink:0 }}>{m.avatar}</div>
                            <div>
                                <p style={{ margin:0, fontSize:13, fontWeight:700, color:PD }}>{m.name}</p>
                                <p style={{ margin:0, fontSize:11, color:'#94A3B8' }}>{m.email}</p>
                            </div>
                        </div>
                        <RoleBadge role={m.role} />
                        <span style={{ fontSize:12, color:'#374151' }}>{m.dept}</span>
                        <StatusBadge status={m.status} />
                        <span style={{ fontSize:12, color:'#64748B' }}>{m.joined}</span>
                        {/* Actions */}
                        <div style={{ display:'flex', gap:4 }}>
                            <button title="View projects" style={{ width:30, height:30, borderRadius:7, border:'1px solid #EDE9FE', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#94A3B8' }}
                                onMouseEnter={e => { (e.currentTarget.style.background='#F5F3FF'); (e.currentTarget.style.color=P); }}
                                onMouseLeave={e => { (e.currentTarget.style.background='#fff'); (e.currentTarget.style.color='#94A3B8'); }}>
                                <FolderOpen size={13} />
                            </button>
                            <a href={`mailto:${m.email}`} title="Send email" style={{ width:30, height:30, borderRadius:7, border:'1px solid #EDE9FE', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#94A3B8', textDecoration:'none' }}
                                onMouseEnter={e => { (e.currentTarget.style.background='#EFF6FF'); (e.currentTarget.style.color='#2563EB'); }}
                                onMouseLeave={e => { (e.currentTarget.style.background='#fff'); (e.currentTarget.style.color='#94A3B8'); }}>
                                <Mail size={13} />
                            </a>
                            <button title="Remove member" style={{ width:30, height:30, borderRadius:7, border:'1px solid #EDE9FE', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#94A3B8' }}
                                onMouseEnter={e => { (e.currentTarget.style.background='#FFF1F2'); (e.currentTarget.style.color='#E11D48'); }}
                                onMouseLeave={e => { (e.currentTarget.style.background='#fff'); (e.currentTarget.style.color='#94A3B8'); }}>
                                <Trash2 size={13} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
