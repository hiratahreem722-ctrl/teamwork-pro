import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage, router } from '@inertiajs/react';
import {
    Table, Tag, Avatar, Modal, Form, Input, Select,
    Button, Space, Tabs, Upload, message,
} from 'antd';
import {
    Plus, Search, User, Briefcase, Calendar, DollarSign,
    Zap, FileText, ChevronRight, ChevronLeft, Check,
    Upload as UploadIcon, X, Clock, MapPin, Globe,
    Phone, Mail, Home, Shield,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { PageProps } from '@/types';
import { useDepartments } from '@/hooks/useDepartments';

// ── Types ────────────────────────────────────────────────────────────────────
interface Employee {
    id: number;
    name: string;
    title: string;
    department: string;
    status: 'Active' | 'On Leave' | 'Remote';
    skills: string[];
    projects: number;
    salary: string;
    email: string;
    avatarColor: string;
}

// ── Mock data ────────────────────────────────────────────────────────────────
const employees: Employee[] = [
    { id: 1,  name: 'Sara Kim',      title: 'Senior Developer',  department: 'Engineering', status: 'Active',   skills: ['React','TypeScript','Node.js'],       projects: 3, salary: '$95,000',       email: 'sara@company.com',   avatarColor: '#7C3AED' },
    { id: 2,  name: 'Hamza Ali',     title: 'UX Designer',       department: 'Design',      status: 'Remote',   skills: ['Figma','Prototyping','CSS'],           projects: 2, salary: '$78,000',       email: 'hamza@company.com',  avatarColor: '#3B82F6' },
    { id: 3,  name: 'Lisa Park',     title: 'Project Manager',   department: 'Operations',  status: 'Active',   skills: ['Agile','JIRA','Risk Mgmt'],           projects: 5, salary: '$88,000',       email: 'lisa@company.com',   avatarColor: '#10B981' },
    { id: 4,  name: 'Marcus Chen',   title: 'Backend Developer', department: 'Engineering', status: 'Active',   skills: ['PHP','Laravel','MySQL'],              projects: 4, salary: '$92,000',       email: 'marcus@company.com', avatarColor: '#F59E0B' },
    { id: 5,  name: 'Nina Kovač',    title: 'HR Manager',        department: 'HR',          status: 'Active',   skills: ['Recruitment','Payroll','Compliance'],  projects: 0, salary: '$72,000',       email: 'nina@company.com',   avatarColor: '#EC4899' },
    { id: 6,  name: 'Ali Hassan',    title: 'Sales Lead',        department: 'Sales',       status: 'Active',   skills: ['CRM','Negotiation','Salesforce'],     projects: 3, salary: '$68,000 + comm', email: 'ali@company.com',    avatarColor: '#8B5CF6' },
    { id: 7,  name: 'Sophie Turner', title: 'DevOps Engineer',   department: 'Engineering', status: 'Remote',   skills: ['AWS','Docker','CI/CD'],               projects: 2, salary: '$105,000',      email: 'sophie@company.com', avatarColor: '#06B6D4' },
    { id: 8,  name: 'David Miller',  title: 'Accountant',        department: 'Finance',     status: 'Active',   skills: ['Excel','QuickBooks','GAAP'],          projects: 0, salary: '$65,000',       email: 'david@company.com',  avatarColor: '#64748B' },
    { id: 9,  name: 'Zara Ahmed',    title: 'Marketing Manager', department: 'Marketing',   status: 'Active',   skills: ['SEO','Content','Analytics'],          projects: 1, salary: '$74,000',       email: 'zara@company.com',   avatarColor: '#F97316' },
    { id: 10, name: 'Tom Wilson',    title: 'QA Engineer',       department: 'Engineering', status: 'On Leave', skills: ['Selenium','Jest','Manual Testing'],   projects: 1, salary: '$71,000',       email: 'tom@company.com',    avatarColor: '#EF4444' },
    { id: 11, name: 'Priya Sharma',  title: 'Data Analyst',      department: 'Analytics',   status: 'Active',   skills: ['Python','SQL','Tableau'],             projects: 2, salary: '$83,000',       email: 'priya@company.com',  avatarColor: '#A855F7' },
    { id: 12, name: 'Carlos Ruiz',   title: 'Sales Rep',         department: 'Sales',       status: 'Active',   skills: ['Cold Outreach','HubSpot','Excel'],    projects: 2, salary: '$55,000 + comm', email: 'carlos@company.com', avatarColor: '#14B8A6' },
];

// departments now come from the useDepartments hook (see component below)

const statusConfig: Record<string, { bg: string; color: string }> = {
    Active:    { bg: '#DCFCE7', color: '#16A34A' },
    'On Leave':{ bg: '#FEF3C7', color: '#D97706' },
    Remote:    { bg: '#EFF6FF', color: '#3B82F6' },
};

const cardStyle: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #EDE9FE',
    borderRadius: 12,
    boxShadow: '0 1px 3px rgba(124,58,237,0.06)',
    padding: '20px 24px',
};

// ── Step definitions ──────────────────────────────────────────────────────────
const STEPS = [
    { key: 'personal',  label: 'Personal Details', icon: User },
    { key: 'job',       label: 'Job Details',       icon: Briefcase },
    { key: 'schedule',  label: 'Work Schedule',     icon: Calendar },
    { key: 'salary',    label: 'Salary Details',    icon: DollarSign },
    { key: 'skills',    label: 'Skills',            icon: Zap },
    { key: 'documents', label: 'Documents',         icon: FileText },
];

// ── Step form panels ──────────────────────────────────────────────────────────
function StepPersonal({ form }: { form: any }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
            <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Required' }]}>
                <Input prefix={<User size={13} color="#9CA3AF" />} placeholder="Sara" />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Required' }]}>
                <Input prefix={<User size={13} color="#9CA3AF" />} placeholder="Kim" />
            </Form.Item>
            <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
                <Input prefix={<Mail size={13} color="#9CA3AF" />} placeholder="sara@company.com" />
            </Form.Item>
            <Form.Item name="phone" label="Phone Number">
                <Input prefix={<Phone size={13} color="#9CA3AF" />} placeholder="+1 555 000 0000" />
            </Form.Item>
            <Form.Item name="dob" label="Date of Birth">
                <Input type="date" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="gender" label="Gender">
                <Select placeholder="Select">
                    {['Male','Female','Non-binary','Prefer not to say'].map(g => <Select.Option key={g} value={g}>{g}</Select.Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="address" label="Home Address" style={{ gridColumn: '1 / -1' }}>
                <Input prefix={<Home size={13} color="#9CA3AF" />} placeholder="123 Main St, City, Country" />
            </Form.Item>
            <Form.Item name="emergencyName" label="Emergency Contact Name">
                <Input prefix={<Shield size={13} color="#9CA3AF" />} placeholder="Full name" />
            </Form.Item>
            <Form.Item name="emergencyPhone" label="Emergency Contact Phone">
                <Input prefix={<Phone size={13} color="#9CA3AF" />} placeholder="+1 555 999 9999" />
            </Form.Item>
        </div>
    );
}

function StepJob({ form, deptNames }: { form: any; deptNames: string[] }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
            <Form.Item name="jobTitle" label="Job Title">
                <Input prefix={<Briefcase size={13} color="#9CA3AF" />} placeholder="Senior Developer" />
            </Form.Item>
            <Form.Item name="employeeId" label="Employee ID">
                <Input placeholder="EMP-0042" />
            </Form.Item>
            <Form.Item name="department" label="Department">
                <Select placeholder="Select department">
                    {deptNames.map(d => <Select.Option key={d} value={d}>{d}</Select.Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="reportsTo" label="Reports To">
                <Select placeholder="Select manager">
                    {employees.filter(e => ['Manager','Lead','Director','Head'].some(t => e.title.includes(t))).map(e => (
                        <Select.Option key={e.id} value={e.name}>{e.name} — {e.title}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name="employmentType" label="Employment Type">
                <Select placeholder="Select type">
                    {['Full-time','Part-time','Contract','Intern','Freelance'].map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="startDate" label="Start Date">
                <Input type="date" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="officeLocation" label="Office Location">
                <Input prefix={<MapPin size={13} color="#9CA3AF" />} placeholder="New York HQ" />
            </Form.Item>
            <Form.Item name="probationEnd" label="Probation End Date">
                <Input type="date" style={{ width: '100%' }} />
            </Form.Item>
        </div>
    );
}

function StepSchedule({ form }: { form: any }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
            <Form.Item name="workType" label="Work Arrangement">
                <Select placeholder="Select arrangement">
                    {['On-site','Remote','Hybrid'].map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="timezone" label="Time Zone">
                <Select placeholder="Select timezone" showSearch>
                    {['UTC-8 (PST)','UTC-5 (EST)','UTC+0 (GMT)','UTC+1 (CET)','UTC+5:30 (IST)','UTC+8 (SGT)'].map(tz => (
                        <Select.Option key={tz} value={tz}>{tz}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name="hoursPerWeek" label="Hours per Week">
                <Select placeholder="Select hours">
                    {['20','32','40','45'].map(h => <Select.Option key={h} value={h}>{h} hrs/week</Select.Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="shiftType" label="Shift Type">
                <Select placeholder="Select shift">
                    {['Morning (8am–4pm)','Day (9am–5pm)','Evening (2pm–10pm)','Night (10pm–6am)','Flexible'].map(s => (
                        <Select.Option key={s} value={s}>{s}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name="workDays" label="Working Days" style={{ gridColumn: '1 / -1' }}>
                <Select mode="multiple" placeholder="Select working days">
                    {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => (
                        <Select.Option key={d} value={d}>{d}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name="breakDuration" label="Break Duration">
                <Select placeholder="Select break">
                    {['15 min','30 min','45 min','1 hour'].map(b => <Select.Option key={b} value={b}>{b}</Select.Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="overtimeEligible" label="Overtime Eligible">
                <Select placeholder="Select">
                    {['Yes','No'].map(o => <Select.Option key={o} value={o}>{o}</Select.Option>)}
                </Select>
            </Form.Item>
        </div>
    );
}

function StepSalary({ form }: { form: any }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
            <Form.Item name="salaryType" label="Salary Type">
                <Select placeholder="Select type">
                    {['Annual','Monthly','Bi-weekly','Hourly'].map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="currency" label="Currency">
                <Select placeholder="Select currency" defaultValue="USD">
                    {['USD ($)','EUR (€)','GBP (£)','PKR (₨)','INR (₹)','AED (د.إ)'].map(c => (
                        <Select.Option key={c} value={c}>{c}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name="baseSalary" label="Base Salary">
                <Input prefix={<DollarSign size={13} color="#9CA3AF" />} placeholder="95000" type="number" />
            </Form.Item>
            <Form.Item name="payFrequency" label="Pay Frequency">
                <Select placeholder="Select frequency">
                    {['Weekly','Bi-weekly','Semi-monthly','Monthly'].map(f => <Select.Option key={f} value={f}>{f}</Select.Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="bonus" label="Annual Bonus / Commission">
                <Input prefix={<DollarSign size={13} color="#9CA3AF" />} placeholder="e.g. 5000 or 10% commission" />
            </Form.Item>
            <Form.Item name="allowances" label="Allowances">
                <Input placeholder="Transport, Housing, Meal..." />
            </Form.Item>
            <Form.Item name="taxId" label="Tax ID / SSN (last 4)" style={{ gridColumn: '1 / -1' }}>
                <Input placeholder="XXXX" maxLength={4} style={{ maxWidth: 120 }} />
            </Form.Item>
            <div style={{ gridColumn: '1 / -1', background: '#F5F3FF', border: '1px solid #EDE9FE', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#6B7280' }}>
                <strong style={{ color: '#7C3AED' }}>Note:</strong> Salary information is confidential and only visible to HR and Management.
            </div>
        </div>
    );
}

function StepSkills({ form }: { form: any }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Form.Item name="skills" label="Skills & Technologies">
                <Select mode="tags" placeholder="Type a skill and press Enter (e.g. React, Python, Figma)"
                    style={{ width: '100%' }}
                    tokenSeparators={[',']}
                />
            </Form.Item>
            <Form.Item name="certifications" label="Certifications">
                <Select mode="tags" placeholder="e.g. AWS Certified, PMP, CPA" style={{ width: '100%' }} tokenSeparators={[',']} />
            </Form.Item>
            <Form.Item name="experienceLevel" label="Experience Level">
                <Select placeholder="Select level">
                    {['Intern / Trainee','Junior (0–2 yrs)','Mid-level (2–5 yrs)','Senior (5–8 yrs)','Lead / Principal (8+ yrs)'].map(l => (
                        <Select.Option key={l} value={l}>{l}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name="languages" label="Languages Spoken">
                <Select mode="tags" placeholder="e.g. English, Urdu, French" style={{ width: '100%' }} tokenSeparators={[',']} />
            </Form.Item>
            <Form.Item name="bio" label="Short Bio / Notes">
                <Input.TextArea rows={3} placeholder="Brief description about this employee..." />
            </Form.Item>
        </div>
    );
}

function StepDocuments() {
    const docTypes = [
        { label: 'National ID / Passport',  key: 'id',       color: '#7C3AED', bg: '#F5F3FF' },
        { label: 'Employment Contract',      key: 'contract', color: '#059669', bg: '#ECFDF5' },
        { label: 'NDA / Confidentiality',    key: 'nda',      color: '#D97706', bg: '#FFFBEB' },
        { label: 'Qualifications / Degree',  key: 'degree',   color: '#0369A1', bg: '#EFF6FF' },
        { label: 'Other Documents',          key: 'other',    color: '#64748B', bg: '#F8FAFC' },
    ];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ margin: '0 0 4px', fontSize: 13, color: '#6B7280' }}>
                Upload documents for this employee's profile. Accepted formats: PDF, JPG, PNG (max 10 MB each).
            </p>
            {docTypes.map(doc => (
                <div key={doc.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px dashed #DDD6FE', borderRadius: 10, background: '#FDFCFF' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: doc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText size={16} color={doc.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1E1B4B' }}>{doc.label}</p>
                        <p style={{ margin: '1px 0 0', fontSize: 11, color: '#94A3B8' }}>Click to upload or drag and drop</p>
                    </div>
                    <Upload showUploadList={false} beforeUpload={() => false}>
                        <Button size="small" icon={<UploadIcon size={12} />} style={{ borderColor: doc.color, color: doc.color, borderRadius: 6, fontSize: 12 }}>
                            Upload
                        </Button>
                    </Upload>
                </div>
            ))}
            <div style={{ background: '#F5F3FF', border: '1px solid #EDE9FE', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                <strong style={{ color: '#7C3AED' }}>Secure storage:</strong> All documents are encrypted and only accessible by authorised HR personnel.
            </div>
        </div>
    );
}

// ── Multi-step modal ──────────────────────────────────────────────────────────
export function AddEmployeeModal({ open, onClose, deptNames }: { open: boolean; onClose: () => void; deptNames: string[] }) {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [completed, setCompleted] = useState<Set<number>>(new Set());
    const [sendInvite, setSendInvite] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const resetForm = () => {
        form.resetFields();
        setCurrentStep(0);
        setCompleted(new Set());
        setSendInvite(true);
        setSubmitting(false);
    };

    const handleNext = () => {
        const fieldsToValidate: Record<number, string[]> = {
            0: ['firstName','lastName','email'],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
        };
        form.validateFields(fieldsToValidate[currentStep]).then(() => {
            setCompleted(prev => new Set([...prev, currentStep]));
            setCurrentStep(s => s + 1);
        }).catch(() => {});
    };

    const handleBack = () => setCurrentStep(s => s - 1);

    const handleSubmit = () => {
        // Validate only the core required fields
        form.validateFields(['firstName', 'lastName', 'email']).then(() => {
            const values = form.getFieldsValue(true);
            setSubmitting(true);
            const name = `${values.firstName} ${values.lastName}`.trim();

            router.post(route('owner.invite.employee'), {
                firstName:    values.firstName,
                lastName:     values.lastName,
                email:        values.email,
                phone:        values.phone ?? null,
                title:        values.jobTitle ?? null,
                department:   values.department ?? null,
                startDate:    values.startDate ?? null,
                employeeId:   values.employeeId ?? null,
                workType:     values.workType ?? null,
                salaryType:   values.salaryType ?? null,
                salaryAmount: values.baseSalary ?? null,
                currency:     values.currency ?? 'USD',
                sendInvite,
            }, {
                onSuccess: () => {
                    message.success(`Employee "${name}" added successfully!`);
                    resetForm();
                    onClose();
                },
                onError: (errs) => {
                    setSubmitting(false);
                    const firstErr = Object.values(errs)[0];
                    message.error(String(firstErr) || 'Failed to add employee. Please check the form.');
                    if (errs.email) { setCurrentStep(0); }
                },
            });
        }).catch(() => {
            message.warning('Please fill in the required fields (name & email) before submitting.');
            setCurrentStep(0);
        });
    };

    const handleCancel = () => { resetForm(); onClose(); };

    const stepContent = [
        <StepPersonal key="personal" form={form} />,
        <StepJob key="job" form={form} deptNames={deptNames} />,
        <StepSchedule key="schedule" form={form} />,
        <StepSalary key="salary" form={form} />,
        <StepSkills key="skills" form={form} />,
        <StepDocuments key="documents" />,
    ];

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={820}
            styles={{ body: { padding: 0 }, content: { borderRadius: 16, overflow: 'hidden', padding: 0 } }}
            closable={false}
        >
            <div style={{ display: 'flex', height: 600 }}>

                {/* ── Left: Step navigator ── */}
                <div style={{ width: 220, background: '#1E1B4B', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                    {/* Header */}
                    <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#7C3AED,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Plus size={14} color="#fff" />
                            </div>
                            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Add Employee</span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>Step {currentStep + 1} of {STEPS.length}</p>
                    </div>

                    {/* Steps list */}
                    <div style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {STEPS.map((step, idx) => {
                            const isActive    = idx === currentStep;
                            const isDone      = completed.has(idx);
                            const isReachable = idx <= currentStep || isDone;
                            const Icon        = step.icon;
                            return (
                                <button
                                    key={step.key}
                                    onClick={() => isReachable && setCurrentStep(idx)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '10px 12px', borderRadius: 9,
                                        border: 'none', cursor: isReachable ? 'pointer' : 'default',
                                        background: isActive ? 'rgba(167,139,250,0.18)' : 'transparent',
                                        transition: 'background 0.15s', width: '100%', textAlign: 'left',
                                    }}
                                    onMouseEnter={e => { if (!isActive && isReachable) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                                >
                                    {/* Circle indicator */}
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: isDone ? '#16A34A' : isActive ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.07)',
                                        border: isActive ? '2px solid #A78BFA' : isDone ? '2px solid #16A34A' : '2px solid rgba(255,255,255,0.1)',
                                    }}>
                                        {isDone
                                            ? <Check size={13} color="#fff" strokeWidth={2.5} />
                                            : <Icon size={13} color={isActive ? '#C4B5FD' : 'rgba(255,255,255,0.35)'} />
                                        }
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? '#E9D5FF' : isDone ? '#86EFAC' : 'rgba(255,255,255,0.45)', lineHeight: 1.2 }}>
                                            {step.label}
                                        </p>
                                        <p style={{ margin: 0, fontSize: 10, color: isDone ? '#4ADE80' : 'rgba(255,255,255,0.2)', lineHeight: 1 }}>
                                            {isDone ? 'Complete' : isActive ? 'In progress' : 'Pending'}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Progress bar at bottom */}
                    <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Progress</span>
                            <span style={{ fontSize: 10, color: '#A78BFA', fontWeight: 600 }}>
                                {Math.round(((completed.size) / STEPS.length) * 100)}%
                            </span>
                        </div>
                        <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)' }}>
                            <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#7C3AED,#A855F7)', width: `${(completed.size / STEPS.length) * 100}%`, transition: 'width 0.4s ease' }} />
                        </div>
                    </div>
                </div>

                {/* ── Right: Step content ── */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Content header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px 16px', borderBottom: '1px solid #F5F3FF', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {(() => { const I = STEPS[currentStep].icon; return <I size={17} color="#7C3AED" />; })()}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1E1B4B' }}>{STEPS[currentStep].label}</h3>
                                <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>Step {currentStep + 1} of {STEPS.length}</p>
                            </div>
                        </div>
                        <button onClick={handleCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4, borderRadius: 6, display: 'flex' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
                            <X size={18} />
                        </button>
                    </div>

                    {/* Scrollable form body */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
                        <Form form={form} layout="vertical" requiredMark={false}
                            style={{ '--ant-font-size': '13px' } as any}
                        >
                            {stepContent[currentStep]}
                        </Form>
                    </div>

                    {/* ── Invite checkbox (last step only) ── */}
                    {currentStep === STEPS.length - 1 && (() => {
                        const email = form.getFieldValue('email') as string | undefined;
                        return (
                            <div style={{ borderTop: '1px solid #EDE9FE', padding: '12px 28px', background: sendInvite ? '#F5FFFE' : '#FAFAFA', flexShrink: 0, transition: 'background 0.2s' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                                    {/* Custom checkbox */}
                                    <div
                                        onClick={() => setSendInvite(v => !v)}
                                        style={{
                                            width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                                            border: sendInvite ? '2px solid #059669' : '2px solid #D1D5DB',
                                            background: sendInvite ? '#059669' : '#fff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.15s', cursor: 'pointer',
                                            boxShadow: sendInvite ? '0 0 0 3px rgba(5,150,105,0.12)' : 'none',
                                        }}
                                    >
                                        {sendInvite && <Check size={12} color="#fff" strokeWidth={3} />}
                                    </div>

                                    {/* Label text */}
                                    <div style={{ flex: 1 }} onClick={() => setSendInvite(v => !v)}>
                                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1E1B4B', lineHeight: 1.3 }}>
                                            Send invitation email
                                        </p>
                                        <p style={{ margin: '1px 0 0', fontSize: 11, color: '#6B7280', lineHeight: 1.3 }}>
                                            {email
                                                ? <>Invite link will be sent to <strong style={{ color: '#374151' }}>{email}</strong></>
                                                : 'Employee will receive an email to set up their account'}
                                        </p>
                                    </div>

                                    {/* Status pill */}
                                    <span style={{
                                        fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20, flexShrink: 0,
                                        background: sendInvite ? '#DCFCE7' : '#F1F5F9',
                                        color: sendInvite ? '#16A34A' : '#94A3B8',
                                        border: `1px solid ${sendInvite ? '#BBF7D0' : '#E2E8F0'}`,
                                    }}>
                                        {sendInvite ? '✉ Will send' : 'No email'}
                                    </span>
                                </label>
                            </div>
                        );
                    })()}

                    {/* Footer nav */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', borderTop: '1px solid #F5F3FF', flexShrink: 0, background: '#FDFCFF' }}>
                        <Button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            icon={<ChevronLeft size={14} />}
                            style={{ borderRadius: 8, fontWeight: 500, borderColor: '#EDE9FE', color: currentStep === 0 ? '#D1D5DB' : '#7C3AED' }}
                        >
                            Back
                        </Button>

                        <div style={{ display: 'flex', gap: 6 }}>
                            {STEPS.map((_, i) => (
                                <div key={i} style={{ width: i === currentStep ? 18 : 6, height: 6, borderRadius: 3, background: completed.has(i) ? '#7C3AED' : i === currentStep ? '#A78BFA' : '#E5E7EB', transition: 'all 0.2s' }} />
                            ))}
                        </div>

                        {currentStep < STEPS.length - 1 ? (
                            <Button
                                type="primary"
                                onClick={handleNext}
                                style={{ borderRadius: 8, fontWeight: 600, background: 'linear-gradient(135deg,#7C3AED,#A855F7)', border: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                            >
                                Next <ChevronRight size={14} />
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                onClick={handleSubmit}
                                loading={submitting}
                                disabled={submitting}
                                style={{ borderRadius: 8, fontWeight: 600, background: submitting ? '#94a3b8' : 'linear-gradient(135deg,#059669,#10B981)', border: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                            >
                                <Check size={14} /> {submitting ? 'Saving...' : 'Add Employee'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Employees() {
    const { auth, dbEmployees } = usePage<PageProps<{ dbEmployees?: Employee[] }>>().props;
    const tenantKey = String(auth?.user?.tenant_id ?? auth?.user?.id ?? 'default');
    const { departmentNames } = useDepartments(tenantKey);

    // Merge: real DB employees first, then mock demo employees (avoid duplicate emails)
    const dbEmps: Employee[] = (dbEmployees ?? []).map((e: any) => ({
        id:          e.id + 10000, // offset to avoid id collision with mock
        name:        e.name,
        title:       e.title ?? '—',
        department:  e.dept ?? e.department ?? '—',
        status:      e.status ?? 'Active',
        skills:      [],
        projects:    0,
        salary:      e.salary ?? '—',
        email:       e.email,
        avatarColor: '#7C3AED',
    }));
    const dbEmails = new Set(dbEmps.map(e => e.email));
    const allEmployees = [...dbEmps, ...employees.filter(e => !dbEmails.has(e.email))];

    const [search, setSearch]         = useState('');
    const [deptFilter, setDeptFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [modalOpen, setModalOpen]   = useState(false);
    const [viewEmp, setViewEmp]       = useState<Employee | null>(null);

    const filtered = useMemo(() => allEmployees.filter(e => {
        const matchSearch  = search === '' || e.name.toLowerCase().includes(search.toLowerCase()) || e.title.toLowerCase().includes(search.toLowerCase());
        const matchDept    = !deptFilter || e.department === deptFilter;
        const matchStatus  = statusFilter === 'All' || e.status === statusFilter;
        return matchSearch && matchDept && matchStatus;
    }), [search, deptFilter, statusFilter, dbEmployees]);

    const totalActive  = allEmployees.filter(e => e.status === 'Active').length;
    const totalOnLeave = allEmployees.filter(e => e.status === 'On Leave').length;
    const uniqueDepts  = new Set(allEmployees.map(e => e.department)).size;

    const summaryCards = [
        { label: 'Total Employees', sub: 'All time',       value: allEmployees.length, color: '#7C3AED', bg: '#F5F3FF' },
        { label: 'Active',          sub: 'Right now',      value: totalActive,          color: '#16A34A', bg: '#DCFCE7' },
        { label: 'On Leave',        sub: 'Today',          value: totalOnLeave,         color: '#D97706', bg: '#FEF3C7' },
        { label: 'Departments',     sub: 'Overall',        value: uniqueDepts,          color: '#3B82F6', bg: '#EFF6FF' },
    ];

    const columns: ColumnsType<Employee> = [
        {
            title: 'EMPLOYEE',
            key: 'employee',
            render: (_, r) => (
                <Space>
                    <Avatar style={{ background: r.avatarColor, flexShrink: 0, fontWeight: 700 }} size={38}>
                        {r.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <div>
                        <div style={{ fontWeight: 600, color: '#1E1B4B', fontSize: 14 }}>{r.name}</div>
                        <div style={{ fontSize: 12, color: '#6B7280' }}>{r.title}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'DEPARTMENT',
            dataIndex: 'department',
            render: (dept: string) => (
                <span style={{ background: '#F5F3FF', color: '#7C3AED', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600, border: '1px solid #EDE9FE' }}>
                    {dept}
                </span>
            ),
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            render: (status: string) => {
                const cfg = statusConfig[status];
                return (
                    <span style={{ background: cfg.bg, color: cfg.color, borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 600 }}>
                        {status}
                    </span>
                );
            },
        },
        {
            title: 'SKILLS',
            dataIndex: 'skills',
            render: (skills: string[]) => (
                <Space size={4} wrap>
                    {skills.slice(0, 3).map(s => (
                        <Tag key={s} style={{ background: '#F5F3FF', color: '#7C3AED', border: '1px solid #EDE9FE', borderRadius: 6, fontSize: 11, margin: 0 }}>
                            {s}
                        </Tag>
                    ))}
                    {skills.length > 3 && <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>+{skills.length - 3}</span>}
                </Space>
            ),
        },
        {
            title: 'PROJECTS',
            dataIndex: 'projects',
            align: 'center',
            render: (count: number) => (
                <span style={{ fontWeight: 600, color: count > 0 ? '#1E1B4B' : '#9CA3AF' }}>{count}</span>
            ),
        },
        {
            title: 'SALARY',
            dataIndex: 'salary',
            render: (salary: string) => (
                <span style={{ fontWeight: 600, color: '#1E1B4B', fontSize: 13 }}>{salary}</span>
            ),
        },
        {
            title: 'ACTIONS',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button size="small" onClick={() => setViewEmp(record)} style={{ color: '#7C3AED', borderColor: '#EDE9FE', borderRadius: 6, fontSize: 12 }}>View</Button>
                    <Button size="small" style={{ color: '#6B7280', borderColor: '#E5E7EB', borderRadius: 6, fontSize: 12 }}>Edit</Button>
                </Space>
            ),
        },
    ];

    return (
        <AppLayout>
            <Head title="Employees" />
            <div style={{ padding: '32px 40px', background: '#F5F3FF', minHeight: '100vh' }}>

                {/* Page Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1E1B4B' }}>Employees</h1>
                        <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: 14 }}>Manage your workforce and track employee information</p>
                    </div>
                    <Button
                        type="primary"
                        icon={<Plus size={16} />}
                        onClick={() => setModalOpen(true)}
                        style={{ background: 'linear-gradient(135deg,#7C3AED,#1E1B4B)', border: 'none', borderRadius: 8, fontWeight: 600, height: 38 }}
                    >
                        Add Employee
                    </Button>
                </div>

                {/* Summary Stats with timeframe labels */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                    {summaryCards.map(stat => (
                        <div key={stat.label} style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                                    <div style={{ fontSize: 13, color: '#374151', fontWeight: 600, marginTop: 4 }}>{stat.label}</div>
                                </div>
                                <span style={{ fontSize: 10, fontWeight: 700, background: stat.bg, color: stat.color, borderRadius: 10, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
                                    {stat.sub}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div style={{ ...cardStyle, padding: '14px 18px', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '6px 12px', flex: '1 1 200px', maxWidth: 300 }}>
                            <Search size={16} color="#9CA3AF" />
                            <input
                                placeholder="Search employees..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, width: '100%', color: '#1E1B4B' }}
                            />
                        </div>
                        <Select
                            allowClear
                            placeholder="All Departments"
                            style={{ width: 180 }}
                            onChange={val => setDeptFilter(val ?? null)}
                        >
                            {departmentNames.map(d => <Select.Option key={d} value={d}>{d}</Select.Option>)}
                        </Select>
                        <Tabs
                            activeKey={statusFilter}
                            onChange={setStatusFilter}
                            size="small"
                            style={{ marginBottom: 0 }}
                            items={['All','Active','Remote','On Leave'].map(s => ({ key: s, label: s }))}
                        />
                    </div>
                </div>

                {/* Table */}
                <div style={cardStyle}>
                    <Table
                        dataSource={filtered}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: 10, showTotal: t => `${t} employees` }}
                        onRow={() => ({
                            style: { cursor: 'pointer' },
                            onMouseEnter: e => { (e.currentTarget as HTMLElement).style.background = '#FAFAFF'; },
                            onMouseLeave: e => { (e.currentTarget as HTMLElement).style.background = ''; },
                        })}
                        style={{ fontSize: 14 }}
                    />
                </div>
            </div>

            <AddEmployeeModal open={modalOpen} onClose={() => setModalOpen(false)} deptNames={departmentNames} />

            {/* ── Employee Profile Modal ── */}
            <Modal
                open={!!viewEmp}
                onCancel={() => setViewEmp(null)}
                footer={null}
                width={660}
                styles={{ body: { padding: 0 } }}
                style={{ top: 40 }}
            >
                {viewEmp && (() => {
                    const cfg      = statusConfig[viewEmp.status];
                    const initials = viewEmp.name.split(' ').map(n => n[0]).join('');
                    return (
                        <div style={{ borderRadius: 12, overflow: 'hidden' }}>

                            {/* ── Header ── */}
                            <div style={{ background: 'linear-gradient(135deg,#1E1B4B 0%,#7C3AED 100%)', padding: '32px 32px 32px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                                <div style={{ position: 'absolute', bottom: -40, left: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 18 }}>
                                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: viewEmp.avatarColor, border: '3px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                                        {initials}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{viewEmp.name}</h2>
                                        <p style={{ margin: '5px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{viewEmp.title}</p>
                                        <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{viewEmp.department} Department</p>
                                    </div>
                                    <span style={{ background: cfg.bg, color: cfg.color, borderRadius: 20, padding: '5px 16px', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                                        {viewEmp.status}
                                    </span>
                                </div>
                            </div>

                            {/* ── Body ── */}
                            <div style={{ background: '#F8FAFC', padding: '24px 32px 28px' }}>

                                {/* Quick stats row */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
                                    {[
                                        { label: 'Active Projects', value: viewEmp.projects, icon: '📁', color: '#7C3AED', bg: '#EDE9FE' },
                                        { label: 'Annual Salary',   value: viewEmp.salary,   icon: '💰', color: '#059669', bg: '#DCFCE7' },
                                        { label: 'Department',      value: viewEmp.department, icon: '🏢', color: '#2563EB', bg: '#EFF6FF' },
                                    ].map(s => (
                                        <div key={s.label} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${s.bg}`, padding: '16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                                                {s.icon}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 15, fontWeight: 800, color: '#1E1B4B', lineHeight: 1.2 }}>{s.value}</div>
                                                <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Info grid */}
                                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', overflow: 'hidden', marginBottom: 20 }}>
                                    <div style={{ padding: '12px 18px', borderBottom: '1px solid #F1F5F9', background: '#FAFBFF' }}>
                                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Employee Information</p>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                        {[
                                            { label: 'Email Address', value: viewEmp.email,      icon: '✉️' },
                                            { label: 'Job Title',     value: viewEmp.title,      icon: '💼' },
                                            { label: 'Department',    value: viewEmp.department, icon: '🏢' },
                                            { label: 'Work Status',   value: viewEmp.status,     icon: '📍' },
                                        ].map((d, i) => (
                                            <div key={d.label} style={{ padding: '14px 18px', borderBottom: i < 2 ? '1px solid #F8FAFC' : 'none', borderRight: i % 2 === 0 ? '1px solid #F8FAFC' : 'none' }}>
                                                <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{d.icon} {d.label}</p>
                                                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1E1B4B' }}>{d.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Skills */}
                                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', overflow: 'hidden', marginBottom: 24 }}>
                                    <div style={{ padding: '12px 18px', borderBottom: '1px solid #F1F5F9', background: '#FAFBFF' }}>
                                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Skills & Expertise</p>
                                    </div>
                                    <div style={{ padding: '16px 18px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {viewEmp.skills.map(s => (
                                            <span key={s} style={{ background: '#EDE9FE', color: '#7C3AED', border: '1px solid #DDD6FE', borderRadius: 20, padding: '5px 16px', fontSize: 12, fontWeight: 600 }}>{s}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <Button block size="large" onClick={() => setViewEmp(null)} style={{ borderRadius: 9, borderColor: '#E2E8F0', color: '#64748B', fontWeight: 600, height: 42 }}>
                                        Close
                                    </Button>
                                    <Button block size="large" type="primary" style={{ borderRadius: 9, background: 'linear-gradient(135deg,#1E1B4B,#7C3AED)', border: 'none', fontWeight: 600, height: 42 }}>
                                        Edit Employee
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </Modal>
        </AppLayout>
    );
}
