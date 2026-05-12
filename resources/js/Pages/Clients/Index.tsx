import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Form, Input, Select, Avatar, Progress, message } from 'antd';
import {
    Plus, Search, ChevronDown, MoreHorizontal, Filter, SlidersHorizontal,
    User, Building2, Users, FileText,
    ChevronLeft, ChevronRight, Check, X, SkipForward,
    Phone, Mail, Globe, MapPin, Briefcase, Hash,
    CreditCard, Tag as TagIcon, MessageSquare, Layers,
    Trash2, UserPlus,
} from 'lucide-react';
import { useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Client {
    id: number;
    name: string;
    color: string;
    owner: { name: string; avatar: string };
    projects: number;
    taskCompletion: number;
    tasksLeft: number;
    health: 'Good' | 'At Risk' | 'Critical' | 'Not set';
    budget: number;
    profitability: number;
    profitPct: number;
}

interface ContactRow {
    id: number;
    name: string;
    title: string;
    email: string;
    phone: string;
    isPrimary: boolean;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const clients: Client[] = [
    { id: 1, name: 'Massive Dynamic',     color: '#3B82F6', owner: { name: 'Sarah K.',  avatar: 'SK' }, projects: 242, taskCompletion: 94,  tasksLeft: 6,  health: 'Not set',  budget: 4000,  profitability: 6742,  profitPct: 168 },
    { id: 2, name: 'E-commerce Platform', color: '#8B5CF6', owner: { name: 'James R.',  avatar: 'JR' }, projects: 38,  taskCompletion: 82,  tasksLeft: 5,  health: 'Good',     budget: 12000, profitability: 14763, profitPct: 123 },
    { id: 3, name: 'Acme Corp',           color: '#10B981', owner: { name: 'Lisa P.',   avatar: 'LP' }, projects: 14,  taskCompletion: 76,  tasksLeft: 12, health: 'At Risk',  budget: 8500,  profitability: 3200,  profitPct: 38  },
    { id: 4, name: 'Delta Finance',       color: '#F59E0B', owner: { name: 'Marcus C.', avatar: 'MC' }, projects: 7,   taskCompletion: 100, tasksLeft: 0,  health: 'Good',     budget: 6200,  profitability: 8900,  profitPct: 144 },
    { id: 5, name: 'HealthFirst Inc',     color: '#EF4444', owner: { name: 'Nina K.',   avatar: 'NK' }, projects: 3,   taskCompletion: 55,  tasksLeft: 18, health: 'Critical', budget: 15000, profitability: 1200,  profitPct: 8   },
    { id: 6, name: 'Zeta Solutions',      color: '#6366F1', owner: { name: 'Ali H.',    avatar: 'AH' }, projects: 21,  taskCompletion: 89,  tasksLeft: 3,  health: 'Good',     budget: 9800,  profitability: 11500, profitPct: 117 },
    { id: 7, name: 'Gamma Retail',        color: '#14B8A6', owner: { name: 'Sophie T.', avatar: 'ST' }, projects: 9,   taskCompletion: 62,  tasksLeft: 9,  health: 'At Risk',  budget: 5500,  profitability: 2800,  profitPct: 51  },
    { id: 8, name: 'Beta Manufacturing',  color: '#F97316', owner: { name: 'David M.',  avatar: 'DM' }, projects: 16,  taskCompletion: 91,  tasksLeft: 2,  health: 'Good',     budget: 22000, profitability: 27300, profitPct: 124 },
];

const INDUSTRIES = ['Technology','E-Commerce','Finance','Healthcare','Retail','Manufacturing','Education','Real Estate','Logistics','Media & Entertainment','Legal','Consulting','Other'];
const COMPANY_SIZES = ['1–10','11–50','51–200','201–500','501–1,000','1,000+'];
const CURRENCIES    = ['USD ($)','EUR (€)','GBP (£)','AED (د.إ)','PKR (₨)','INR (₹)','CAD (CA$)','AUD (A$)'];
const PAY_TERMS     = ['Net 7','Net 14','Net 30','Net 60','Due on receipt','Milestone-based','Custom'];
const PROJECT_TYPES = ['Fixed Price','Time & Material','Retainer','Hourly'];

const healthConfig: Record<string, { bg: string; color: string; border: string }> = {
    'Good':     { bg: '#DCFCE7', color: '#16A34A', border: '#BBF7D0' },
    'At Risk':  { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
    'Critical': { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
    'Not set':  { bg: '#F1F5F9', color: '#64748B', border: '#E2E8F0' },
};

// ── Step definitions ──────────────────────────────────────────────────────────
const STEPS = [
    { key: 'personal',    label: 'Personal Details',    icon: User,      optional: false },
    { key: 'company',     label: 'Company Details',     icon: Building2, optional: false },
    { key: 'contacts',    label: 'Contacts',            icon: Users,     optional: true  },
    { key: 'additional',  label: 'Additional Details',  icon: FileText,  optional: true  },
];

// ── Utility ───────────────────────────────────────────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                {label}{required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
            </label>
            {children}
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', borderRadius: 8,
    border: '1px solid #E5E7EB', fontSize: 13, color: '#1E1B4B',
    outline: 'none', boxSizing: 'border-box', background: '#fff',
};

const selectStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', borderRadius: 8,
    border: '1px solid #E5E7EB', fontSize: 13, color: '#1E1B4B',
    outline: 'none', boxSizing: 'border-box', background: '#fff', appearance: 'none',
};

// ── Step 1: Personal Details ──────────────────────────────────────────────────
function StepPersonal({ data, onChange, errors }: {
    data: Record<string, string>;
    onChange: (k: string, v: string) => void;
    errors: Record<string, string>;
}) {
    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                <Field label="First Name" required>
                    <div style={{ position: 'relative' }}>
                        <User size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input value={data.firstName ?? ''} onChange={e => onChange('firstName', e.target.value)}
                            placeholder="John" style={{ ...inputStyle, paddingLeft: 30, borderColor: errors.firstName ? '#EF4444' : '#E5E7EB' }} />
                    </div>
                    {errors.firstName && <p style={{ margin: '3px 0 0', fontSize: 11, color: '#EF4444' }}>{errors.firstName}</p>}
                </Field>
                <Field label="Last Name" required>
                    <div style={{ position: 'relative' }}>
                        <User size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input value={data.lastName ?? ''} onChange={e => onChange('lastName', e.target.value)}
                            placeholder="Smith" style={{ ...inputStyle, paddingLeft: 30, borderColor: errors.lastName ? '#EF4444' : '#E5E7EB' }} />
                    </div>
                    {errors.lastName && <p style={{ margin: '3px 0 0', fontSize: 11, color: '#EF4444' }}>{errors.lastName}</p>}
                </Field>
                <Field label="Email Address" required>
                    <div style={{ position: 'relative' }}>
                        <Mail size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input value={data.email ?? ''} onChange={e => onChange('email', e.target.value)}
                            type="email" placeholder="john@company.com" style={{ ...inputStyle, paddingLeft: 30, borderColor: errors.email ? '#EF4444' : '#E5E7EB' }} />
                    </div>
                    {errors.email && <p style={{ margin: '3px 0 0', fontSize: 11, color: '#EF4444' }}>{errors.email}</p>}
                </Field>
                <Field label="Phone Number">
                    <div style={{ position: 'relative' }}>
                        <Phone size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input value={data.phone ?? ''} onChange={e => onChange('phone', e.target.value)}
                            placeholder="+1 555 000 0000" style={{ ...inputStyle, paddingLeft: 30 }} />
                    </div>
                </Field>
            </div>
            <Field label="Job Title / Role">
                <div style={{ position: 'relative' }}>
                    <Briefcase size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input value={data.jobTitle ?? ''} onChange={e => onChange('jobTitle', e.target.value)}
                        placeholder="e.g. CEO, Procurement Manager" style={{ ...inputStyle, paddingLeft: 30 }} />
                </div>
            </Field>
            <Field label="LinkedIn Profile">
                <div style={{ position: 'relative' }}>
                    <Globe size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input value={data.linkedin ?? ''} onChange={e => onChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/..." style={{ ...inputStyle, paddingLeft: 30 }} />
                </div>
            </Field>
        </div>
    );
}

// ── Step 2: Company Details ───────────────────────────────────────────────────
function StepCompany({ data, onChange, errors }: {
    data: Record<string, string>;
    onChange: (k: string, v: string) => void;
    errors: Record<string, string>;
}) {
    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                <Field label="Company Name" required>
                    <div style={{ position: 'relative' }}>
                        <Building2 size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input value={data.companyName ?? ''} onChange={e => onChange('companyName', e.target.value)}
                            placeholder="Acme Corp" style={{ ...inputStyle, paddingLeft: 30, borderColor: errors.companyName ? '#EF4444' : '#E5E7EB' }} />
                    </div>
                    {errors.companyName && <p style={{ margin: '3px 0 0', fontSize: 11, color: '#EF4444' }}>{errors.companyName}</p>}
                </Field>
                <Field label="Company Website">
                    <div style={{ position: 'relative' }}>
                        <Globe size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input value={data.website ?? ''} onChange={e => onChange('website', e.target.value)}
                            placeholder="https://acmecorp.com" style={{ ...inputStyle, paddingLeft: 30 }} />
                    </div>
                </Field>
                <Field label="Industry" required>
                    <select value={data.industry ?? ''} onChange={e => onChange('industry', e.target.value)}
                        style={{ ...selectStyle, borderColor: errors.industry ? '#EF4444' : '#E5E7EB' }}>
                        <option value="">Select industry…</option>
                        {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                    {errors.industry && <p style={{ margin: '3px 0 0', fontSize: 11, color: '#EF4444' }}>{errors.industry}</p>}
                </Field>
                <Field label="Company Size">
                    <select value={data.companySize ?? ''} onChange={e => onChange('companySize', e.target.value)} style={selectStyle}>
                        <option value="">Select size…</option>
                        {COMPANY_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                    </select>
                </Field>
                <Field label="Country">
                    <div style={{ position: 'relative' }}>
                        <MapPin size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input value={data.country ?? ''} onChange={e => onChange('country', e.target.value)}
                            placeholder="United States" style={{ ...inputStyle, paddingLeft: 30 }} />
                    </div>
                </Field>
                <Field label="Tax / VAT ID">
                    <div style={{ position: 'relative' }}>
                        <Hash size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input value={data.taxId ?? ''} onChange={e => onChange('taxId', e.target.value)}
                            placeholder="GB123456789" style={{ ...inputStyle, paddingLeft: 30 }} />
                    </div>
                </Field>
            </div>
            <Field label="Billing Address">
                <div style={{ position: 'relative' }}>
                    <MapPin size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: 11, pointerEvents: 'none' }} />
                    <textarea value={data.address ?? ''} onChange={e => onChange('address', e.target.value)}
                        rows={2} placeholder="123 Business Ave, Suite 400, New York, NY 10001"
                        style={{ ...inputStyle, paddingLeft: 30, resize: 'vertical' as const }} />
                </div>
            </Field>
        </div>
    );
}

// ── Step 3: Contacts ──────────────────────────────────────────────────────────
function StepContacts({ contacts, onChange }: {
    contacts: ContactRow[];
    onChange: (rows: ContactRow[]) => void;
}) {
    // Track which cards have been explicitly saved by the user
    const [saved, setSaved] = useState<Set<number>>(new Set());

    const addRow = () => onChange([...contacts, { id: Date.now(), name: '', title: '', email: '', phone: '', isPrimary: contacts.length === 0 }]);
    const removeRow = (id: number) => {
        setSaved(prev => { const n = new Set(prev); n.delete(id); return n; });
        onChange(contacts.filter(c => c.id !== id));
    };

    // When a field is edited, un-mark that card as saved so the tick goes back to "unsaved"
    const updateRow = (id: number, field: keyof ContactRow, value: string | boolean) => {
        setSaved(prev => { const n = new Set(prev); n.delete(id); return n; });
        onChange(contacts.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const setPrimary = (id: number) =>
        onChange(contacts.map(c => ({ ...c, isPrimary: c.id === id })));

    // Mark a single card as saved (does NOT create a new card)
    const saveCard = (id: number) => {
        setSaved(prev => new Set([...prev, id]));
    };

    return (
        <div>
            {/* Description — no button here anymore */}
            <p style={{ margin: '0 0 14px', fontSize: 13, color: '#64748B' }}>
                Add contacts for this client. The first contact will be marked as primary.
            </p>

            {contacts.length === 0 ? (
                /* Empty state */
                <div style={{ border: '2px dashed #DDD6FE', borderRadius: 12, padding: '32px 20px', textAlign: 'center', background: '#FDFCFF' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 11, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <Users size={20} color="#C4B5FD" />
                    </div>
                    <p style={{ fontWeight: 600, color: '#7C3AED', margin: '0 0 3px', fontSize: 13 }}>No contacts added yet</p>
                    <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 14px' }}>You can skip this step and add contacts later.</p>
                    <button onClick={addRow}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13, boxShadow: '0 3px 10px rgba(124,58,237,0.25)' }}>
                        <UserPlus size={14} /> Add First Contact
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {contacts.map((c, idx) => (
                        <div key={c.id} style={{ border: `1px solid ${c.isPrimary ? '#DDD6FE' : '#E5E7EB'}`, borderRadius: 10, padding: '13px 14px', background: c.isPrimary ? '#FDFCFF' : '#FAFAFA' }}>

                            {/* Card header: label + Set Primary + [ + Add ] [ 🗑 Delete ] */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 26, height: 26, borderRadius: 7, background: c.isPrimary ? '#7C3AED' : '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={12} color={c.isPrimary ? '#fff' : '#94A3B8'} />
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: c.isPrimary ? '#7C3AED' : '#374151' }}>
                                        Contact {idx + 1}
                                    </span>
                                    {c.isPrimary && (
                                        <span style={{ fontSize: 10, fontWeight: 700, background: '#EDE9FE', color: '#7C3AED', borderRadius: 8, padding: '1px 8px' }}>PRIMARY</span>
                                    )}
                                    {saved.has(c.id) && (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 700, background: '#DCFCE7', color: '#16A34A', borderRadius: 8, padding: '1px 8px' }}>
                                            <Check size={9} strokeWidth={3} /> Saved
                                        </span>
                                    )}
                                </div>

                                {/* Action buttons: Set Primary · Save ✓ · Add · Delete */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {!c.isPrimary && (
                                        <button onClick={() => setPrimary(c.id)} title="Set as primary"
                                            style={{ fontSize: 11, fontWeight: 600, color: '#7C3AED', background: '#F5F3FF', border: '1px solid #EDE9FE', borderRadius: 6, padding: '3px 10px', cursor: 'pointer' }}>
                                            Set Primary
                                        </button>
                                    )}

                                    {/* ── Save / confirm this card ── */}
                                    <button
                                        onClick={() => saveCard(c.id)}
                                        title={saved.has(c.id) ? 'Contact saved' : 'Save this contact'}
                                        style={{
                                            width: 28, height: 28, borderRadius: 7, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            border:      saved.has(c.id) ? '1px solid #BBF7D0' : '1px solid #D1D5DB',
                                            background:  saved.has(c.id) ? '#DCFCE7'           : '#F9FAFB',
                                            color:       saved.has(c.id) ? '#16A34A'           : '#9CA3AF',
                                            transition: 'all 0.18s',
                                        }}
                                        onMouseEnter={e => {
                                            if (!saved.has(c.id)) {
                                                (e.currentTarget as HTMLElement).style.background   = '#DCFCE7';
                                                (e.currentTarget as HTMLElement).style.borderColor  = '#BBF7D0';
                                                (e.currentTarget as HTMLElement).style.color        = '#16A34A';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (!saved.has(c.id)) {
                                                (e.currentTarget as HTMLElement).style.background   = '#F9FAFB';
                                                (e.currentTarget as HTMLElement).style.borderColor  = '#D1D5DB';
                                                (e.currentTarget as HTMLElement).style.color        = '#9CA3AF';
                                            }
                                        }}
                                    >
                                        <Check size={13} strokeWidth={saved.has(c.id) ? 2.8 : 2} />
                                    </button>

                                    {/* ── Delete this contact ── */}
                                    <button onClick={() => removeRow(c.id)} title="Remove contact"
                                        style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid #FEE2E2', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FEE2E2'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#FEF2F2'; }}>
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>

                            {/* Fields */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 3 }}>Full Name</label>
                                    <input value={c.name} onChange={e => updateRow(c.id, 'name', e.target.value)}
                                        placeholder="Full name" style={{ ...inputStyle, fontSize: 12 }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 3 }}>Job Title</label>
                                    <input value={c.title} onChange={e => updateRow(c.id, 'title', e.target.value)}
                                        placeholder="e.g. CTO" style={{ ...inputStyle, fontSize: 12 }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 3 }}>Email</label>
                                    <input value={c.email} onChange={e => updateRow(c.id, 'email', e.target.value)}
                                        type="email" placeholder="email@company.com" style={{ ...inputStyle, fontSize: 12 }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 3 }}>Phone</label>
                                    <input value={c.phone} onChange={e => updateRow(c.id, 'phone', e.target.value)}
                                        placeholder="+1 555 000 0000" style={{ ...inputStyle, fontSize: 12 }} />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add another contact — below the last card */}
                    <button onClick={addRow}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', padding: '9px 0', borderRadius: 9, border: '1.5px dashed #DDD6FE', background: 'transparent', color: '#7C3AED', cursor: 'pointer', fontWeight: 600, fontSize: 12, transition: 'background 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F5F3FF'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                        <UserPlus size={13} /> Add Another Contact
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Step 4: Additional Details ────────────────────────────────────────────────
function StepAdditional({ data, onChange }: {
    data: Record<string, string>;
    onChange: (k: string, v: string) => void;
}) {
    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                <Field label="Project Type">
                    <select value={data.projectType ?? ''} onChange={e => onChange('projectType', e.target.value)} style={selectStyle}>
                        <option value="">Select type…</option>
                        {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </Field>
                <Field label="Payment Terms">
                    <select value={data.paymentTerms ?? ''} onChange={e => onChange('paymentTerms', e.target.value)} style={selectStyle}>
                        <option value="">Select terms…</option>
                        {PAY_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </Field>
                <Field label="Preferred Currency">
                    <div style={{ position: 'relative' }}>
                        <CreditCard size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <select value={data.currency ?? ''} onChange={e => onChange('currency', e.target.value)}
                            style={{ ...selectStyle, paddingLeft: 30 }}>
                            <option value="">Select currency…</option>
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </Field>
                <Field label="Budget Range">
                    <div style={{ position: 'relative' }}>
                        <CreditCard size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input value={data.budget ?? ''} onChange={e => onChange('budget', e.target.value)}
                            placeholder="e.g. $10,000 – $50,000" style={{ ...inputStyle, paddingLeft: 30 }} />
                    </div>
                </Field>
            </div>

            <Field label="Tags / Labels">
                <div style={{ position: 'relative' }}>
                    <TagIcon size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input value={data.tags ?? ''} onChange={e => onChange('tags', e.target.value)}
                        placeholder="e.g. enterprise, priority, partner (comma separated)" style={{ ...inputStyle, paddingLeft: 30 }} />
                </div>
            </Field>

            <Field label="Referral Source">
                <div style={{ position: 'relative' }}>
                    <Layers size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <select value={data.referral ?? ''} onChange={e => onChange('referral', e.target.value)}
                        style={{ ...selectStyle, paddingLeft: 30 }}>
                        <option value="">How did they find us?</option>
                        {['Referral','LinkedIn','Website','Cold Outreach','Event / Conference','Google Search','Social Media','Word of Mouth','Other'].map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
            </Field>

            <Field label="Internal Notes">
                <div style={{ position: 'relative' }}>
                    <MessageSquare size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: 10, pointerEvents: 'none' }} />
                    <textarea value={data.notes ?? ''} onChange={e => onChange('notes', e.target.value)}
                        rows={3} placeholder="Any internal context, special requirements, or reminders about this client…"
                        style={{ ...inputStyle, paddingLeft: 30, resize: 'vertical' as const }} />
                </div>
            </Field>
        </div>
    );
}

// ── Multi-step modal ──────────────────────────────────────────────────────────
export function AddClientModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [step, setStep]       = useState(0);
    const [completed, setDone]  = useState<Set<number>>(new Set());
    const [skipped, setSkipped] = useState<Set<number>>(new Set());
    const [sendInvite, setSendInvite] = useState(true);

    // Form state
    const [personal,   setPersonal]   = useState<Record<string, string>>({});
    const [company,    setCompany]    = useState<Record<string, string>>({});
    const [contacts,   setContacts]   = useState<ContactRow[]>([]);
    const [additional, setAdditional] = useState<Record<string, string>>({});
    const [errors,     setErrors]     = useState<Record<string, string>>({});

    const updatePersonal   = (k: string, v: string) => { setPersonal(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };
    const updateCompany    = (k: string, v: string) => { setCompany(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };
    const updateAdditional = (k: string, v: string) => setAdditional(p => ({ ...p, [k]: v }));

    const validate = (stepIdx: number): boolean => {
        const errs: Record<string, string> = {};
        if (stepIdx === 0) {
            if (!personal.firstName?.trim()) errs.firstName = 'First name is required';
            if (!personal.lastName?.trim())  errs.lastName  = 'Last name is required';
            if (!personal.email?.trim())     errs.email     = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) errs.email = 'Enter a valid email';
        }
        if (stepIdx === 1) {
            if (!company.companyName?.trim()) errs.companyName = 'Company name is required';
            if (!company.industry?.trim())    errs.industry    = 'Industry is required';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleNext = () => {
        if (!validate(step)) return;
        setDone(prev => new Set([...prev, step]));
        setSkipped(prev => { const n = new Set(prev); n.delete(step); return n; });
        setStep(s => s + 1);
    };

    const handleSkip = () => {
        setSkipped(prev => new Set([...prev, step]));
        setDone(prev => { const n = new Set(prev); n.delete(step); return n; });
        setStep(s => s + 1);
    };

    const handleBack = () => { setErrors({}); setStep(s => s - 1); };

    const handleSubmit = () => {
        const clientName = company.companyName || personal.firstName || 'Client';
        if (sendInvite && personal.email) {
            message.success(`"${clientName}" added! Invitation sent to ${personal.email}`);
        } else {
            message.success(`"${clientName}" added successfully! No invitation email sent.`);
        }
        // Reset
        setStep(0); setDone(new Set()); setSkipped(new Set());
        setPersonal({}); setCompany({}); setContacts([]); setAdditional({}); setErrors({});
        setSendInvite(true);
        onClose();
    };

    const handleCancel = () => {
        setStep(0); setDone(new Set()); setSkipped(new Set());
        setPersonal({}); setCompany({}); setContacts([]); setAdditional({}); setErrors({});
        setSendInvite(true);
        onClose();
    };

    const isLastStep  = step === STEPS.length - 1;
    const currentStep = STEPS[step];

    const stepContent = [
        <StepPersonal   key="personal"   data={personal}   onChange={updatePersonal}   errors={errors} />,
        <StepCompany    key="company"    data={company}     onChange={updateCompany}    errors={errors} />,
        <StepContacts   key="contacts"   contacts={contacts} onChange={setContacts} />,
        <StepAdditional key="additional" data={additional}  onChange={updateAdditional} />,
    ];

    if (!open) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Backdrop */}
            <div onClick={handleCancel} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }} />

            {/* Modal */}
            <div style={{ position: 'relative', width: 820, maxWidth: '95vw', maxHeight: '90vh', borderRadius: 16, overflow: 'hidden', display: 'flex', boxShadow: '0 25px 60px rgba(15,23,42,0.25)' }}>

                {/* ── Left navigator ── */}
                <div style={{ width: 226, background: '#1E1B4B', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                    {/* Header */}
                    <div style={{ padding: '22px 18px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#7C3AED,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Briefcase size={14} color="#fff" />
                            </div>
                            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '-0.2px' }}>Add Client</span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11, margin: 0 }}>Step {step + 1} of {STEPS.length}</p>
                    </div>

                    {/* Step list */}
                    <div style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {STEPS.map((s, idx) => {
                            const isActive    = idx === step;
                            const isDone      = completed.has(idx);
                            const isSkipped   = skipped.has(idx);
                            const isReachable = idx <= step || isDone || isSkipped;
                            const Icon        = s.icon;
                            return (
                                <button key={s.key}
                                    onClick={() => isReachable && setStep(idx)}
                                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 9, border: 'none', cursor: isReachable ? 'pointer' : 'default', background: isActive ? 'rgba(167,139,250,0.18)' : 'transparent', width: '100%', textAlign: 'left', transition: 'background 0.15s' }}
                                    onMouseEnter={e => { if (!isActive && isReachable) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                                >
                                    {/* Circle */}
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDone ? '#16A34A' : isSkipped ? '#D97706' : isActive ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.07)', border: isActive ? '2px solid #A78BFA' : isDone ? '2px solid #16A34A' : isSkipped ? '2px solid #D97706' : '2px solid rgba(255,255,255,0.1)' }}>
                                        {isDone    ? <Check size={12} color="#fff" strokeWidth={2.5} />
                                        : isSkipped ? <SkipForward size={11} color="#fff" />
                                        : <Icon size={12} color={isActive ? '#C4B5FD' : 'rgba(255,255,255,0.3)'} />}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ margin: 0, fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? '#E9D5FF' : isDone ? '#86EFAC' : isSkipped ? '#FCD34D' : 'rgba(255,255,255,0.4)', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {s.label}
                                        </p>
                                        <p style={{ margin: 0, fontSize: 10, color: isDone ? '#4ADE80' : isSkipped ? '#FCD34D' : 'rgba(255,255,255,0.2)', lineHeight: 1 }}>
                                            {isDone ? 'Completed' : isSkipped ? 'Skipped' : isActive ? 'In progress' : 'Pending'}
                                        </p>
                                    </div>
                                    {s.optional && (
                                        <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em', flexShrink: 0 }}>OPT</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Progress */}
                    <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Progress</span>
                            <span style={{ fontSize: 10, color: '#A78BFA', fontWeight: 600 }}>
                                {Math.round(((completed.size + skipped.size) / STEPS.length) * 100)}%
                            </span>
                        </div>
                        <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
                            <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#7C3AED,#A855F7)', width: `${((completed.size + skipped.size) / STEPS.length) * 100}%`, transition: 'width 0.4s ease' }} />
                        </div>
                    </div>
                </div>

                {/* ── Right content ── */}
                <div style={{ flex: 1, background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Content header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 26px 14px', borderBottom: '1px solid #F5F3FF', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {(() => { const I = currentStep.icon; return <I size={17} color="#7C3AED" />; })()}
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1E1B4B' }}>{currentStep.label}</h3>
                                    {currentStep.optional && (
                                        <span style={{ fontSize: 10, fontWeight: 700, background: '#FEF3C7', color: '#D97706', borderRadius: 8, padding: '1px 8px', letterSpacing: '0.05em' }}>OPTIONAL</span>
                                    )}
                                </div>
                                <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>Step {step + 1} of {STEPS.length}</p>
                            </div>
                        </div>
                        <button onClick={handleCancel}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4, borderRadius: 6, display: 'flex' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
                            <X size={18} />
                        </button>
                    </div>

                    {/* Scrollable body */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '18px 26px' }}>
                        {stepContent[step]}
                    </div>

                    {/* ── Invite checkbox (last step only) ── */}
                    {isLastStep && (
                        <div style={{ borderTop: '1px solid #EDE9FE', padding: '12px 26px', background: sendInvite ? '#F5FFFE' : '#FAFAFA', flexShrink: 0, transition: 'background 0.2s' }}>
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
                                        {personal.email
                                            ? <><strong style={{ color: '#374151' }}>{personal.email}</strong> will receive an invite link to access the portal</>
                                            : 'Client will receive an email to access their portal'}
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
                    )}

                    {/* Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 26px', borderTop: '1px solid #F5F3FF', flexShrink: 0, background: '#FDFCFF' }}>
                        {/* Back */}
                        <button onClick={handleBack} disabled={step === 0}
                            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px', borderRadius: 8, border: '1px solid #EDE9FE', background: step === 0 ? '#F9FAFB' : '#fff', color: step === 0 ? '#D1D5DB' : '#7C3AED', cursor: step === 0 ? 'default' : 'pointer', fontWeight: 500, fontSize: 13 }}>
                            <ChevronLeft size={14} /> Back
                        </button>

                        {/* Step dots */}
                        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                            {STEPS.map((_, i) => (
                                <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: completed.has(i) ? '#7C3AED' : skipped.has(i) ? '#D97706' : i === step ? '#A78BFA' : '#E5E7EB', transition: 'all 0.2s' }} />
                            ))}
                        </div>

                        {/* Right actions */}
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            {/* Skip Step — available on all optional steps */}
                            {currentStep.optional && (
                                <button onClick={handleSkip}
                                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', color: '#64748B', cursor: 'pointer', fontWeight: 500, fontSize: 13 }}
                                    title="Skip this step without saving any data entered">
                                    <SkipForward size={13} /> Skip Step
                                </button>
                            )}

                            {/* Next */}
                            {!isLastStep && (
                                <button onClick={handleNext}
                                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 18px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13, boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
                                    Next <ChevronRight size={14} />
                                </button>
                            )}

                            {/* Add Client — last step */}
                            {isLastStep && (
                                <button onClick={handleSubmit}
                                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#059669,#10B981)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13, boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}>
                                    <Check size={14} /> Add Client
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Health badge ──────────────────────────────────────────────────────────────
function HealthBadge({ health }: { health: Client['health'] }) {
    const cfg = healthConfig[health];
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {health} <ChevronDown size={11} />
        </span>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const COL_WIDTHS = { name: 260, owner: 160, projects: 100, completion: 200, health: 130, budget: 120, profit: 140, actions: 48 };

export default function ClientsIndex() {
    const [showAdd, setShowAdd]           = useState(false);
    const [search, setSearch]             = useState('');
    const [healthFilter, setHealthFilter] = useState('All');

    const filtered = clients.filter(c =>
        (healthFilter === 'All' || c.health === healthFilter) &&
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalRevenue = clients.reduce((s, c) => s + c.budget,         0);
    const totalProfit  = clients.reduce((s, c) => s + c.profitability,  0);

    return (
        <AppLayout title="Clients">
            <Head title="Clients" />
            <AddClientModal open={showAdd} onClose={() => setShowAdd(false)} />

            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>Clients</h1>
                    <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>
                        {clients.length} clients · {clients.reduce((s, c) => s + c.projects, 0)} total projects
                    </p>
                </div>
                <button onClick={() => setShowAdd(true)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14, boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }}>
                    <Plus size={16} /> Add Client
                </button>
            </div>

            {/* Summary bar */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 24, padding: '16px 24px', background: '#fff', borderRadius: 12, border: '1px solid #E9E4FF', boxShadow: '0 1px 4px rgba(124,58,237,0.06)' }}>
                {[
                    { label: 'Total clients', value: clients.length },
                    { label: 'Total budget',  value: `$${(totalRevenue / 1000).toFixed(0)}k` },
                    { label: 'Total profit',  value: `$${(totalProfit  / 1000).toFixed(0)}k`, green: true },
                    { label: 'Healthy',       value: clients.filter(c => c.health === 'Good').length, green: true },
                    { label: 'At risk',       value: clients.filter(c => c.health === 'At Risk' || c.health === 'Critical').length, red: true },
                ].map(s => (
                    <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
                        <span style={{ fontSize: 22, fontWeight: 700, color: (s as any).green ? '#16A34A' : (s as any).red ? '#DC2626' : '#0F172A', lineHeight: 1.2 }}>{s.value}</span>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '0 12px', height: 36, width: 260 }}>
                    <Search size={14} color="#94A3B8" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients…"
                        style={{ border: 'none', outline: 'none', fontSize: 14, color: '#374151', background: 'transparent', flex: 1 }} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    {['All','Good','At Risk','Critical','Not set'].map(f => (
                        <button key={f} onClick={() => setHealthFilter(f)}
                            style={{ borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer', border: healthFilter === f ? 'none' : '1px solid #E2E8F0', background: healthFilter === f ? '#7C3AED' : '#fff', color: healthFilter === f ? '#fff' : '#64748B' }}>
                            {f}
                        </button>
                    ))}
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#374151', cursor: 'pointer', fontSize: 13 }}>
                        <Filter size={13} /> Filter
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#374151', cursor: 'pointer', fontSize: 13 }}>
                        <SlidersHorizontal size={13} /> Group by
                    </button>
                </div>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E9E4FF', overflow: 'hidden', boxShadow: '0 1px 4px rgba(124,58,237,0.06)' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 44, background: '#FAFAFA', borderBottom: '1px solid #F1F5F9' }}>
                    {[
                        { label: 'NAME',            w: COL_WIDTHS.name,       align: 'left'  },
                        { label: 'OWNER',           w: COL_WIDTHS.owner,      align: 'left'  },
                        { label: 'PROJECTS',        w: COL_WIDTHS.projects,   align: 'center'},
                        { label: 'TASK COMPLETION', w: COL_WIDTHS.completion, align: 'left'  },
                        { label: 'HEALTH',          w: COL_WIDTHS.health,     align: 'left'  },
                        { label: 'BUDGET',          w: COL_WIDTHS.budget,     align: 'right' },
                    ].map(col => (
                        <div key={col.label} style={{ width: col.w, fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: col.align as any }}>{col.label}</div>
                    ))}
                    <div style={{ flex: 1, fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: 'right' }}>PROFITABILITY</div>
                    <div style={{ width: COL_WIDTHS.actions }} />
                </div>

                {/* Rows */}
                {filtered.map((c, i) => (
                    <div key={c.id}
                        style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 60, borderBottom: i < filtered.length - 1 ? '1px solid #F8F5FF' : 'none', transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#FDFCFF'}
                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                    >
                        <div style={{ width: COL_WIDTHS.name, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 8, background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{c.name[0]}</span>
                            </div>
                            <Link href={route('clients.show', c.id)} style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', textDecoration: 'none' }}
                                onMouseEnter={e => ((e.target as HTMLElement).style.color = '#7C3AED')}
                                onMouseLeave={e => ((e.target as HTMLElement).style.color = '#0F172A')}>
                                {c.name}
                            </Link>
                        </div>
                        <div style={{ width: COL_WIDTHS.owner, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Avatar size={26} style={{ background: '#7C3AED', fontSize: 11, fontWeight: 700 }}>{c.owner.avatar}</Avatar>
                            <span style={{ fontSize: 13, color: '#374151' }}>{c.owner.name}</span>
                        </div>
                        <div style={{ width: COL_WIDTHS.projects, textAlign: 'center' }}>
                            <span style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>{c.projects}</span>
                        </div>
                        <div style={{ width: COL_WIDTHS.completion, paddingRight: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{c.taskCompletion}%</span>
                                {c.tasksLeft > 0 && <span style={{ fontSize: 11, color: '#94A3B8' }}>{c.tasksLeft} tasks left</span>}
                            </div>
                            <div style={{ height: 6, borderRadius: 3, background: '#F1F5F9', overflow: 'hidden' }}>
                                <div style={{ height: '100%', borderRadius: 3, width: `${c.taskCompletion}%`, background: c.taskCompletion === 100 ? '#10B981' : c.taskCompletion >= 70 ? '#3B82F6' : '#F59E0B' }} />
                            </div>
                        </div>
                        <div style={{ width: COL_WIDTHS.health }}><HealthBadge health={c.health} /></div>
                        <div style={{ width: COL_WIDTHS.budget, textAlign: 'right' }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>${c.budget.toLocaleString()}</span>
                        </div>
                        <div style={{ flex: 1, textAlign: 'right', paddingRight: 8 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: c.profitPct >= 100 ? '#16A34A' : c.profitPct >= 50 ? '#D97706' : '#DC2626', display: 'block' }}>${c.profitability.toLocaleString()}</span>
                            <span style={{ fontSize: 11, color: c.profitPct >= 100 ? '#16A34A' : '#94A3B8' }}>{c.profitPct}%</span>
                        </div>
                        <div style={{ width: COL_WIDTHS.actions, display: 'flex', justifyContent: 'center' }}>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1', padding: 4, borderRadius: 6, display: 'flex' }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#64748B')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#CBD5E1')}>
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div style={{ padding: '48px 0', textAlign: 'center', color: '#94A3B8' }}>No clients match your filter.</div>
                )}
            </div>
        </AppLayout>
    );
}
