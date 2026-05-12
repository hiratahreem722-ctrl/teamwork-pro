/**
 * NewProjectModal
 * 6-step project onboarding flow:
 *   1. Project Details   2. Budget & Payment   3. Timeline
 *   4. Files & Docs      5. Team Assignment     6. Tasks
 */

import { useState, useRef, useCallback } from 'react';
import { message } from 'antd';
import {
    Layers, DollarSign, CalendarRange, FolderOpen, Users, CheckSquare,
    ChevronLeft, ChevronRight, Check, X, SkipForward,
    Plus, Trash2, Upload, FileText, Image, Archive,
    Clock, Target, Repeat, BarChart2, AlertCircle,
    User, Briefcase, MapPin, Flag, Star, Shield,
    GripVertical,
} from 'lucide-react';
import { useS3Upload, formatBytes, fileIcon, S3File } from '@/hooks/useS3Upload';

// ── Palette ───────────────────────────────────────────────────────────────────
const P = '#7C3AED'; // purple
const PL = '#EDE9FE';
const inp: React.CSSProperties = {
    width: '100%', padding: '8px 12px', borderRadius: 8,
    border: '1px solid #E5E7EB', fontSize: 13, color: '#1E1B4B',
    outline: 'none', boxSizing: 'border-box', background: '#fff',
};
const sel: React.CSSProperties = { ...inp, appearance: 'none' as const };

// ── Step registry ─────────────────────────────────────────────────────────────
const STEPS = [
    { key: 'details',  label: 'Project Details',   icon: Layers,        optional: false },
    { key: 'budget',   label: 'Budget & Payment',  icon: DollarSign,    optional: false },
    { key: 'timeline', label: 'Timeline',           icon: CalendarRange, optional: false },
    { key: 'files',    label: 'Files & Documents',  icon: FolderOpen,    optional: true  },
    { key: 'team',     label: 'Team Assignment',    icon: Users,         optional: true  },
    { key: 'tasks',    label: 'Tasks',              icon: CheckSquare,   optional: true  },
];

// ── Mock data ─────────────────────────────────────────────────────────────────
const CLIENTS   = ['Acme Corp','Beta Inc','Gamma Ltd','Delta Co','Epsilon SA','Massive Dynamic','HealthFirst Inc'];
const CATEGORIES = ['Web Development','Mobile App','UI/UX Design','Branding','Marketing','DevOps','Data & Analytics','Consulting','Other'];
const PRIORITIES = ['Low','Medium','High','Critical'];
const STATUSES   = ['Backlog','Planning','In Progress','In Review','On Hold','Completed'];
const CURRENCIES = ['USD ($)','EUR (€)','GBP (£)','AED (د.إ)','PKR (₨)','INR (₹)'];

const TEAM_POOL = [
    { id: 1,  name: 'Sara Kim',      title: 'Senior Developer',  dept: 'Engineering', color: '#7C3AED' },
    { id: 2,  name: 'Hamza Ali',     title: 'UX Designer',       dept: 'Design',      color: '#3B82F6' },
    { id: 3,  name: 'Lisa Park',     title: 'Project Manager',   dept: 'Operations',  color: '#10B981' },
    { id: 4,  name: 'Marcus Chen',   title: 'Backend Developer', dept: 'Engineering', color: '#F59E0B' },
    { id: 5,  name: 'Nina Kovač',    title: 'HR Manager',        dept: 'HR',          color: '#EC4899' },
    { id: 6,  name: 'Ali Hassan',    title: 'Sales Lead',        dept: 'Sales',       color: '#8B5CF6' },
    { id: 7,  name: 'Sophie Turner', title: 'DevOps Engineer',   dept: 'Engineering', color: '#06B6D4' },
    { id: 8,  name: 'Priya Sharma',  title: 'Data Analyst',      dept: 'Analytics',   color: '#A855F7' },
    { id: 9,  name: 'Carlos Ruiz',   title: 'Sales Rep',         dept: 'Sales',       color: '#14B8A6' },
];

// ── Shared tiny components ─────────────────────────────────────────────────────
function Label({ text, required }: { text: string; required?: boolean }) {
    return (
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>
            {text}{required && <span style={{ color: '#EF4444', marginLeft: 2 }}>*</span>}
        </label>
    );
}
function Err({ msg }: { msg?: string }) {
    return msg ? <p style={{ margin: '3px 0 0', fontSize: 11, color: '#EF4444' }}>{msg}</p> : null;
}
function G2({ children }: { children: React.ReactNode }) {
    return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>{children}</div>;
}
function FG({ children, full }: { children: React.ReactNode; full?: boolean }) {
    return <div style={{ marginBottom: 14, gridColumn: full ? '1 / -1' : undefined }}>{children}</div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1 — Project Details
// ═══════════════════════════════════════════════════════════════════════════════
function StepDetails({ d, set, err }: { d: any; set: (k: string, v: string) => void; err: any }) {
    return (
        <G2>
            <FG full>
                <Label text="Project Name" required />
                <input value={d.name ?? ''} onChange={e => set('name', e.target.value)}
                    placeholder="e.g. Website Redesign 2026"
                    style={{ ...inp, borderColor: err.name ? '#EF4444' : '#E5E7EB' }} />
                <Err msg={err.name} />
            </FG>
            <FG full>
                <Label text="Description / Scope" />
                <textarea value={d.description ?? ''} onChange={e => set('description', e.target.value)}
                    rows={3} placeholder="Describe the project goals, deliverables and scope of work…"
                    style={{ ...inp, resize: 'vertical' as const }} />
            </FG>
            <FG>
                <Label text="Client" required />
                <select value={d.client ?? ''} onChange={e => set('client', e.target.value)}
                    style={{ ...sel, borderColor: err.client ? '#EF4444' : '#E5E7EB' }}>
                    <option value="">Select client…</option>
                    {CLIENTS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <Err msg={err.client} />
            </FG>
            <FG>
                <Label text="Category" />
                <select value={d.category ?? ''} onChange={e => set('category', e.target.value)} style={sel}>
                    <option value="">Select category…</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </FG>
            <FG>
                <Label text="Priority" />
                <div style={{ display: 'flex', gap: 8 }}>
                    {PRIORITIES.map(p => {
                        const colors: Record<string, { bg: string; border: string; color: string }> = {
                            Low:      { bg: '#F0FDF4', border: '#BBF7D0', color: '#16A34A' },
                            Medium:   { bg: '#FFFBEB', border: '#FDE68A', color: '#D97706' },
                            High:     { bg: '#FFF7ED', border: '#FED7AA', color: '#EA580C' },
                            Critical: { bg: '#FEF2F2', border: '#FECACA', color: '#DC2626' },
                        };
                        const cfg = colors[p];
                        const active = d.priority === p;
                        return (
                            <button key={p} type="button" onClick={() => set('priority', p)}
                                style={{ flex: 1, padding: '6px 0', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1px solid ${active ? cfg.border : '#E5E7EB'}`, background: active ? cfg.bg : '#F9FAFB', color: active ? cfg.color : '#9CA3AF', transition: 'all 0.15s' }}>
                                {p}
                            </button>
                        );
                    })}
                </div>
            </FG>
            <FG>
                <Label text="Visibility" />
                <select value={d.visibility ?? 'Team only'} onChange={e => set('visibility', e.target.value)} style={sel}>
                    {['Public','Team only','Private'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
            </FG>
            <FG full>
                <Label text="Project Tags" />
                <input value={d.tags ?? ''} onChange={e => set('tags', e.target.value)}
                    placeholder="e.g. frontend, redesign, Q2 (comma separated)"
                    style={inp} />
            </FG>
        </G2>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — Budget & Payment
// ═══════════════════════════════════════════════════════════════════════════════
type PayType = 'Hourly' | 'Milestone' | 'Weekly' | 'Monthly';
interface Milestone { id: number; name: string; amount: string; due: string }

function StepBudget({ d, set, err }: { d: any; set: (k: string, v: any) => void; err: any }) {
    const payType: PayType = d.payType ?? 'Hourly';

    const payOptions: { key: PayType; label: string; desc: string; icon: React.ElementType }[] = [
        { key: 'Hourly',     label: 'Hourly',          desc: 'Billed by tracked hours',      icon: Clock     },
        { key: 'Milestone',  label: 'Milestone-Based', desc: 'Payment on deliverables',      icon: Target    },
        { key: 'Weekly',     label: 'Weekly',          desc: 'Fixed weekly retainer',         icon: Repeat    },
        { key: 'Monthly',    label: 'Monthly',         desc: 'Fixed monthly retainer',        icon: BarChart2 },
    ];

    const milestones: Milestone[] = d.milestones ?? [];
    const addMS = () => set('milestones', [...milestones, { id: Date.now(), name: '', amount: '', due: '' }]);
    const removeMS = (id: number) => set('milestones', milestones.filter(m => m.id !== id));
    const updateMS = (id: number, field: keyof Milestone, val: string) =>
        set('milestones', milestones.map(m => m.id === id ? { ...m, [field]: val } : m));

    return (
        <div>
            {/* Payment type cards */}
            <div style={{ marginBottom: 20 }}>
                <Label text="Payment Type" required />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                    {payOptions.map(opt => {
                        const active = payType === opt.key;
                        const Icon = opt.icon;
                        return (
                            <button key={opt.key} type="button" onClick={() => set('payType', opt.key)}
                                style={{ padding: '14px 10px', borderRadius: 10, border: `2px solid ${active ? P : '#E5E7EB'}`, background: active ? PL : '#FAFAFA', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                                <div style={{ width: 34, height: 34, borderRadius: 8, background: active ? P : '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                                    <Icon size={16} color={active ? '#fff' : '#9CA3AF'} />
                                </div>
                                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: active ? P : '#374151' }}>{opt.label}</p>
                                <p style={{ margin: '3px 0 0', fontSize: 10, color: '#9CA3AF', lineHeight: 1.3 }}>{opt.desc}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            <G2>
                {/* Currency */}
                <FG>
                    <Label text="Currency" />
                    <select value={d.currency ?? 'USD ($)'} onChange={e => set('currency', e.target.value)} style={sel}>
                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </FG>

                {payType === 'Hourly' && <>
                    <FG><Label text="Hourly Rate" required /><input value={d.rate ?? ''} onChange={e => set('rate', e.target.value)} placeholder="e.g. 75" type="number" min="0" style={{ ...inp, borderColor: err.rate ? '#EF4444' : '#E5E7EB' }} /><Err msg={err.rate} /></FG>
                    <FG><Label text="Estimated Hours" /><input value={d.estHours ?? ''} onChange={e => set('estHours', e.target.value)} placeholder="e.g. 200" type="number" min="0" style={inp} /></FG>
                    <FG><Label text="Budget Cap" /><input value={d.budgetCap ?? ''} onChange={e => set('budgetCap', e.target.value)} placeholder="Max spend limit" type="number" min="0" style={inp} /></FG>
                </>}

                {(payType === 'Weekly' || payType === 'Monthly') && <>
                    <FG><Label text={`${payType} Rate`} required /><input value={d.rate ?? ''} onChange={e => set('rate', e.target.value)} placeholder={`${payType} amount`} type="number" min="0" style={{ ...inp, borderColor: err.rate ? '#EF4444' : '#E5E7EB' }} /><Err msg={err.rate} /></FG>
                    <FG><Label text={`Number of ${payType === 'Weekly' ? 'Weeks' : 'Months'}`} /><input value={d.periods ?? ''} onChange={e => set('periods', e.target.value)} placeholder="e.g. 12" type="number" min="1" style={inp} /></FG>
                </>}
            </G2>

            {/* Milestone list */}
            {payType === 'Milestone' && (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Label text="Milestones" required />
                        <button type="button" onClick={addMS}
                            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, border: `1px solid ${PL}`, background: '#F5F3FF', color: P, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                            <Plus size={12} /> Add Milestone
                        </button>
                    </div>
                    {milestones.length === 0 && (
                        <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 10px' }}>Add at least one milestone to define payment stages.</p>
                    )}
                    {milestones.map((m, i) => (
                        <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '1fr 110px 130px 28px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                            <input value={m.name} onChange={e => updateMS(m.id, 'name', e.target.value)}
                                placeholder={`Milestone ${i + 1} name`} style={{ ...inp, fontSize: 12 }} />
                            <input value={m.amount} onChange={e => updateMS(m.id, 'amount', e.target.value)}
                                placeholder="Amount" type="number" style={{ ...inp, fontSize: 12 }} />
                            <input value={m.due} onChange={e => updateMS(m.id, 'due', e.target.value)}
                                type="date" style={{ ...inp, fontSize: 12 }} />
                            <button type="button" onClick={() => removeMS(m.id)}
                                style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid #FEE2E2', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))}
                    <Err msg={err.milestones} />
                </div>
            )}

            {/* Total estimate */}
            <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: '#F5F3FF', border: '1px solid #EDE9FE' }}>
                <p style={{ margin: 0, fontSize: 12, color: '#7C3AED', fontWeight: 600 }}>
                    💡 Estimated project value:{' '}
                    {payType === 'Hourly'    && d.rate && d.estHours ? `$${(+d.rate * +d.estHours).toLocaleString()}` :
                     payType === 'Milestone' && milestones.length    ? `$${milestones.reduce((s, m) => s + (+m.amount || 0), 0).toLocaleString()}` :
                     (payType === 'Weekly' || payType === 'Monthly') && d.rate && d.periods ? `$${(+d.rate * +d.periods).toLocaleString()}` :
                     '—'}
                </p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — Timeline
// ═══════════════════════════════════════════════════════════════════════════════
interface Deadline { id: number; name: string; date: string; owner: string }

function StepTimeline({ d, set, err }: { d: any; set: (k: string, v: any) => void; err: any }) {
    const deadlines: Deadline[] = d.deadlines ?? [];
    const addDL = () => set('deadlines', [...deadlines, { id: Date.now(), name: '', date: '', owner: '' }]);
    const removeDL = (id: number) => set('deadlines', deadlines.filter(dl => dl.id !== id));
    const updateDL = (id: number, field: keyof Deadline, val: string) =>
        set('deadlines', deadlines.map(dl => dl.id === id ? { ...dl, [field]: val } : dl));

    return (
        <div>
            <G2>
                <FG>
                    <Label text="Start Date" required />
                    <input value={d.startDate ?? ''} onChange={e => set('startDate', e.target.value)}
                        type="date" style={{ ...inp, borderColor: err.startDate ? '#EF4444' : '#E5E7EB' }} />
                    <Err msg={err.startDate} />
                </FG>
                <FG>
                    <Label text="End / Deadline Date" required />
                    <input value={d.endDate ?? ''} onChange={e => set('endDate', e.target.value)}
                        type="date" style={{ ...inp, borderColor: err.endDate ? '#EF4444' : '#E5E7EB' }} />
                    <Err msg={err.endDate} />
                </FG>
                <FG>
                    <Label text="Project Status" />
                    <select value={d.status ?? 'Backlog'} onChange={e => set('status', e.target.value)} style={sel}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </FG>
                <FG>
                    <Label text="Working Days" />
                    <select value={d.workDays ?? 'Mon–Fri'} onChange={e => set('workDays', e.target.value)} style={sel}>
                        {['Mon–Fri','Mon–Sat','Mon–Sun','Custom'].map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                </FG>
                <FG>
                    <Label text="Estimated Duration" />
                    <input value={d.duration ?? ''} onChange={e => set('duration', e.target.value)}
                        placeholder="e.g. 8 weeks" style={inp} />
                </FG>
                <FG>
                    <Label text="Review Cadence" />
                    <select value={d.cadence ?? ''} onChange={e => set('cadence', e.target.value)} style={sel}>
                        <option value="">Select…</option>
                        {['Daily standups','Weekly review','Bi-weekly sprint','Monthly','Ad-hoc'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </FG>
            </G2>

            {/* Key Deadlines */}
            <div style={{ marginTop: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Label text="Key Deadlines / Milestones" />
                    <button type="button" onClick={addDL}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, border: `1px solid ${PL}`, background: '#F5F3FF', color: P, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                        <Plus size={12} /> Add Deadline
                    </button>
                </div>
                {deadlines.length === 0 && (
                    <p style={{ fontSize: 12, color: '#9CA3AF' }}>No key deadlines added. These are internal checkpoints, separate from the project end date.</p>
                )}
                {deadlines.map(dl => (
                    <div key={dl.id} style={{ display: 'grid', gridTemplateColumns: '1fr 160px 28px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                        <input value={dl.name} onChange={e => updateDL(dl.id, 'name', e.target.value)}
                            placeholder="Deadline name (e.g. Design Review)" style={{ ...inp, fontSize: 12 }} />
                        <input value={dl.date} onChange={e => updateDL(dl.id, 'date', e.target.value)}
                            type="date" style={{ ...inp, fontSize: 12 }} />
                        <button type="button" onClick={() => removeDL(dl.id)}
                            style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid #FEE2E2', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 4 — Files & Documents (S3)
// ═══════════════════════════════════════════════════════════════════════════════
const FILE_CATEGORIES = ['Contract / Agreement','Design Files','Reference / Inspiration','Specs / Requirements','Media / Assets','Other'];

interface ProjectFile extends S3File { category: string }

function StepFiles({ files, onFiles }: { files: ProjectFile[]; onFiles: (f: ProjectFile[]) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const { files: uploading, upload, remove: removeUpload } = useS3Upload({ context: 'projects' });

    // Helper: allows functional updater pattern since onFiles prop only accepts arrays
    const safeOnFiles = (next: ProjectFile[] | ((prev: ProjectFile[]) => ProjectFile[])) => {
        if (typeof next === 'function') onFiles(next(files));
        else onFiles(next);
    };

    const handleFilesFixed = (raw: FileList | File[]) => {
        Array.from(raw).forEach(file => {
            const uid = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
            const fake: ProjectFile = {
                uid, key: `projects/demo/${uid}`, name: file.name,
                size: file.size, type: file.type,
                progress: 0, status: 'uploading', category: 'Other',
            };
            safeOnFiles(prev => [...prev, fake]);

            let prog = 0;
            const iv = setInterval(() => {
                prog += Math.random() * 22 + 8;
                if (prog >= 100) {
                    prog = 100; clearInterval(iv);
                    safeOnFiles(prev => prev.map(f => f.uid === uid ? { ...f, progress: 100, status: 'done' } : f));
                } else {
                    safeOnFiles(prev => prev.map(f => f.uid === uid ? { ...f, progress: Math.round(prog) } : f));
                }
            }, 180);
        });
    };

    const setCategory = (uid: string, cat: string) =>
        onFiles(files.map(f => f.uid === uid ? { ...f, category: cat } : f));

    const removeFile = (uid: string) => onFiles(files.filter(f => f.uid !== uid));

    return (
        <div>
            {/* Drop zone */}
            <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleFilesFixed(e.dataTransfer.files); }}
                onClick={() => inputRef.current?.click()}
                style={{ border: `2px dashed ${dragging ? P : '#DDD6FE'}`, borderRadius: 12, padding: '28px 20px', textAlign: 'center', background: dragging ? '#F5F3FF' : '#FDFCFF', cursor: 'pointer', marginBottom: 16, transition: 'all 0.15s' }}>
                <input ref={inputRef} type="file" multiple style={{ display: 'none' }} onChange={e => e.target.files && handleFilesFixed(e.target.files)} />
                <div style={{ width: 44, height: 44, borderRadius: 11, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                    <Upload size={20} color="#C4B5FD" />
                </div>
                <p style={{ margin: 0, fontWeight: 600, color: '#7C3AED', fontSize: 13 }}>Drop files here or click to browse</p>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: '#9CA3AF' }}>
                    Supports: PDF, DOCX, XLSX, Images, ZIP, Videos — files upload directly to Amazon S3
                </p>
            </div>

            {/* File list */}
            {files.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {files.map(f => (
                        <div key={f.uid} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, border: '1px solid #E5E7EB', background: '#FAFAFA' }}>
                            {/* Icon */}
                            <span style={{ fontSize: 20, flexShrink: 0 }}>{fileIcon(f.type)}</span>

                            {/* Info + progress */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1E1B4B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{f.name}</span>
                                    <span style={{ fontSize: 10, color: '#94A3B8', flexShrink: 0 }}>{formatBytes(f.size)}</span>
                                    {f.status === 'done' && <Check size={13} color="#16A34A" />}
                                    {f.status === 'error' && <AlertCircle size={13} color="#EF4444" />}
                                </div>
                                {f.status === 'uploading' && (
                                    <div style={{ height: 4, borderRadius: 2, background: '#E5E7EB' }}>
                                        <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#7C3AED,#A855F7)', width: `${f.progress}%`, transition: 'width 0.2s' }} />
                                    </div>
                                )}
                                {f.status === 'done' && (
                                    <select value={f.category} onChange={e => setCategory(f.uid, e.target.value)}
                                        style={{ ...sel, fontSize: 11, padding: '3px 8px', marginTop: 2 }}>
                                        {FILE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                )}
                            </div>

                            {/* Remove */}
                            <button type="button" onClick={() => removeFile(f.uid)}
                                style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #FEE2E2', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Trash2 size={11} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* S3 note */}
            <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 9, background: '#F5F3FF', border: '1px solid #EDE9FE', fontSize: 11, color: '#6B7280' }}>
                <strong style={{ color: P }}>🔒 S3 Direct Upload:</strong> Files are uploaded directly from your browser to Amazon S3 using pre-signed PUT URLs — they never pass through the server. Categories and metadata are saved alongside the S3 object key.
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 5 — Team Assignment
// ═══════════════════════════════════════════════════════════════════════════════
interface TeamMemberAssign { id: number; role: string }

function StepTeam({ assigned, setAssigned }: {
    assigned: TeamMemberAssign[];
    setAssigned: (a: TeamMemberAssign[]) => void;
}) {
    const [deptFilter, setDeptFilter] = useState('All');
    const depts = ['All', ...Array.from(new Set(TEAM_POOL.map(m => m.dept)))];

    const isAssigned = (id: number) => assigned.some(a => a.id === id);
    const toggle = (id: number) => {
        if (isAssigned(id)) setAssigned(assigned.filter(a => a.id !== id));
        else setAssigned([...assigned, { id, role: 'Member' }]);
    };
    const setRole = (id: number, role: string) =>
        setAssigned(assigned.map(a => a.id === id ? { ...a, role } : a));

    const filtered = TEAM_POOL.filter(m => deptFilter === 'All' || m.dept === deptFilter);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
                    Select team members and assign their role on this project.
                </p>
                <span style={{ fontSize: 12, fontWeight: 600, color: P, background: PL, borderRadius: 10, padding: '2px 10px' }}>
                    {assigned.length} selected
                </span>
            </div>

            {/* Dept filter */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                {depts.map(d => (
                    <button key={d} type="button" onClick={() => setDeptFilter(d)}
                        style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: deptFilter === d ? 'none' : '1px solid #E5E7EB', background: deptFilter === d ? P : '#fff', color: deptFilter === d ? '#fff' : '#64748B', transition: 'all 0.15s' }}>
                        {d}
                    </button>
                ))}
            </div>

            {/* Members grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.map(m => {
                    const active = isAssigned(m.id);
                    const assignRec = assigned.find(a => a.id === m.id);
                    return (
                        <div key={m.id}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${active ? '#DDD6FE' : '#E5E7EB'}`, background: active ? '#FDFCFF' : '#FAFAFA', cursor: 'pointer', transition: 'all 0.15s' }}
                            onClick={() => toggle(m.id)}>
                            {/* Checkbox */}
                            <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${active ? P : '#D1D5DB'}`, background: active ? P : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                                {active && <Check size={11} color="#fff" strokeWidth={3} />}
                            </div>

                            {/* Avatar */}
                            <div style={{ width: 34, height: 34, borderRadius: 9, background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>{m.name.split(' ').map(w => w[0]).join('')}</span>
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1E1B4B' }}>{m.name}</p>
                                <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>{m.title} · {m.dept}</p>
                            </div>

                            {/* Role selector — only when assigned */}
                            {active && (
                                <select value={assignRec?.role ?? 'Member'}
                                    onChange={e => { e.stopPropagation(); setRole(m.id, e.target.value); }}
                                    onClick={e => e.stopPropagation()}
                                    style={{ ...sel, width: 120, fontSize: 12, padding: '5px 10px' }}>
                                    {['Lead','Member','Reviewer','Observer'].map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 6 — Tasks
// ═══════════════════════════════════════════════════════════════════════════════
interface Task {
    id: number;
    name: string;
    description: string;
    assigneeId: number | null;
    priority: string;
    dueDate: string;
    status: string;
}

function StepTasks({ tasks, setTasks, assignedIds }: {
    tasks: Task[];
    setTasks: (t: Task[]) => void;
    assignedIds: number[];
}) {
    const assignees = TEAM_POOL.filter(m => assignedIds.includes(m.id));

    const addTask = () => setTasks([...tasks, {
        id: Date.now(), name: '', description: '',
        assigneeId: null, priority: 'Medium', dueDate: '', status: 'To Do',
    }]);

    const update = (id: number, field: keyof Task, val: any) =>
        setTasks(tasks.map(t => t.id === id ? { ...t, [field]: val } : t));

    const remove = (id: number) => setTasks(tasks.filter(t => t.id !== id));

    const priorityColor: Record<string, string> = {
        Low: '#16A34A', Medium: '#D97706', High: '#EA580C', Critical: '#DC2626',
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
                    Create initial tasks for this project and assign them to team members.
                </p>
                <button type="button" onClick={addTask}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, border: `1px solid ${PL}`, background: '#F5F3FF', color: P, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>
                    <Plus size={13} /> Add Task
                </button>
            </div>

            {tasks.length === 0 ? (
                <div style={{ border: '2px dashed #DDD6FE', borderRadius: 12, padding: '28px 20px', textAlign: 'center', background: '#FDFCFF' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 11, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <CheckSquare size={20} color="#C4B5FD" />
                    </div>
                    <p style={{ fontWeight: 600, color: P, margin: '0 0 3px', fontSize: 13 }}>No tasks yet</p>
                    <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 12px' }}>You can skip this step and create tasks from the project board later.</p>
                    <button type="button" onClick={addTask}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 16px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg,${P},#A855F7)`, color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>
                        <Plus size={13} /> Add First Task
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {tasks.map((t, idx) => (
                        <div key={t.id} style={{ border: '1px solid #E5E7EB', borderRadius: 10, padding: '12px 14px', background: '#FAFAFA' }}>
                            {/* Task header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                <GripVertical size={13} color="#D1D5DB" />
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF' }}>TASK {idx + 1}</span>
                                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                                    <button type="button" onClick={() => remove(t.id)}
                                        style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #FEE2E2', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Trash2 size={11} />
                                    </button>
                                </div>
                            </div>

                            {/* Fields */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <Label text="Task Name" />
                                    <input value={t.name} onChange={e => update(t.id, 'name', e.target.value)}
                                        placeholder="e.g. Design landing page wireframes"
                                        style={{ ...inp, fontSize: 12 }} />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <Label text="Description" />
                                    <textarea value={t.description} onChange={e => update(t.id, 'description', e.target.value)}
                                        rows={2} placeholder="Optional task description…"
                                        style={{ ...inp, fontSize: 12, resize: 'vertical' as const }} />
                                </div>
                                <div>
                                    <Label text="Assignee" />
                                    <select value={t.assigneeId ?? ''} onChange={e => update(t.id, 'assigneeId', +e.target.value || null)} style={{ ...sel, fontSize: 12 }}>
                                        <option value="">Unassigned</option>
                                        {assignees.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        {assignees.length === 0 && <option disabled>← Assign team members first</option>}
                                    </select>
                                </div>
                                <div>
                                    <Label text="Priority" />
                                    <div style={{ display: 'flex', gap: 5 }}>
                                        {['Low','Medium','High','Critical'].map(p => (
                                            <button key={p} type="button" onClick={() => update(t.id, 'priority', p)}
                                                style={{ flex: 1, padding: '5px 0', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', border: `1px solid ${t.priority === p ? priorityColor[p] + '66' : '#E5E7EB'}`, background: t.priority === p ? priorityColor[p] + '18' : '#F9FAFB', color: t.priority === p ? priorityColor[p] : '#9CA3AF', transition: 'all 0.12s' }}>
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label text="Due Date" />
                                    <input value={t.dueDate} onChange={e => update(t.id, 'dueDate', e.target.value)}
                                        type="date" style={{ ...inp, fontSize: 12 }} />
                                </div>
                                <div>
                                    <Label text="Status" />
                                    <select value={t.status} onChange={e => update(t.id, 'status', e.target.value)} style={{ ...sel, fontSize: 12 }}>
                                        {['To Do','In Progress','In Review','Done','Blocked'].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add another task row */}
                    <button type="button" onClick={addTask}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', padding: '9px 0', borderRadius: 9, border: '1.5px dashed #DDD6FE', background: 'transparent', color: P, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F5F3FF'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                        <Plus size={13} /> Add Another Task
                    </button>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export default function NewProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [step, setStep]       = useState(0);
    const [completed, setDone]  = useState<Set<number>>(new Set());
    const [skipped, setSkipped] = useState<Set<number>>(new Set());
    const [errors, setErrors]   = useState<Record<string, string>>({});

    // Per-step data stores
    const [details,  setDetailsRaw]  = useState<Record<string, any>>({});
    const [budget,   setBudgetRaw]   = useState<Record<string, any>>({ payType: 'Hourly' });
    const [timeline, setTimelineRaw] = useState<Record<string, any>>({ deadlines: [] });
    const [files,    setFiles]       = useState<ProjectFile[]>([]);
    const [assigned, setAssigned]    = useState<{ id: number; role: string }[]>([]);
    const [tasks,    setTasks]       = useState<Task[]>([]);

    const setDetails  = (k: string, v: any) => { setErrors(e => ({ ...e, [k]: '' })); setDetailsRaw(d => ({ ...d, [k]: v })); };
    const setBudget   = (k: string, v: any) => { setErrors(e => ({ ...e, [k]: '' })); setBudgetRaw(d => ({ ...d, [k]: v })); };
    const setTimeline = (k: string, v: any) => { setErrors(e => ({ ...e, [k]: '' })); setTimelineRaw(d => ({ ...d, [k]: v })); };

    const validate = (s: number): boolean => {
        const errs: Record<string, string> = {};
        if (s === 0) {
            if (!details.name?.trim())   errs.name   = 'Project name is required';
            if (!details.client?.trim()) errs.client = 'Client is required';
        }
        if (s === 1) {
            if (budget.payType === 'Hourly' && !budget.rate) errs.rate = 'Hourly rate is required';
            if ((budget.payType === 'Weekly' || budget.payType === 'Monthly') && !budget.rate) errs.rate = 'Rate is required';
            if (budget.payType === 'Milestone' && (!budget.milestones?.length)) errs.milestones = 'Add at least one milestone';
        }
        if (s === 2) {
            if (!timeline.startDate) errs.startDate = 'Start date is required';
            if (!timeline.endDate)   errs.endDate   = 'End date is required';
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
        message.success(`Project "${details.name || 'New Project'}" created successfully!`);
        resetAll();
        onClose();
    };

    const resetAll = () => {
        setStep(0); setDone(new Set()); setSkipped(new Set()); setErrors({});
        setDetailsRaw({}); setBudgetRaw({ payType: 'Hourly' }); setTimelineRaw({ deadlines: [] });
        setFiles([]); setAssigned([]); setTasks([]);
    };

    const handleCancel = () => { resetAll(); onClose(); };

    const isLastStep = step === STEPS.length - 1;
    const curr = STEPS[step];

    const stepContent = [
        <StepDetails  key="d" d={details}   set={setDetails}  err={errors} />,
        <StepBudget   key="b" d={budget}    set={setBudget}   err={errors} />,
        <StepTimeline key="t" d={timeline}  set={setTimeline} err={errors} />,
        <StepFiles    key="f" files={files} onFiles={setFiles} />,
        <StepTeam     key="m" assigned={assigned} setAssigned={setAssigned} />,
        <StepTasks    key="tk" tasks={tasks} setTasks={setTasks} assignedIds={assigned.map(a => a.id)} />,
    ];

    if (!open) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Backdrop */}
            <div onClick={handleCancel} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(3px)' }} />

            {/* Modal shell */}
            <div style={{ position: 'relative', width: 900, maxWidth: '96vw', maxHeight: '92vh', borderRadius: 18, overflow: 'hidden', display: 'flex', boxShadow: '0 30px 70px rgba(15,23,42,0.3)' }}>

                {/* ── LEFT: step navigator ── */}
                <div style={{ width: 234, background: '#1E1B4B', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                    {/* Logo */}
                    <div style={{ padding: '22px 18px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#7C3AED,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Layers size={14} color="#fff" />
                            </div>
                            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>New Project</span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>Step {step + 1} of {STEPS.length}</p>
                    </div>

                    {/* Steps */}
                    <div style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
                        {STEPS.map((s, idx) => {
                            const isActive    = idx === step;
                            const isDone      = completed.has(idx);
                            const isSkipped   = skipped.has(idx);
                            const isReachable = idx <= step || isDone || isSkipped;
                            const Icon        = s.icon;
                            return (
                                <button key={s.key} type="button"
                                    onClick={() => isReachable && setStep(idx)}
                                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 9, border: 'none', cursor: isReachable ? 'pointer' : 'default', background: isActive ? 'rgba(167,139,250,0.18)' : 'transparent', width: '100%', textAlign: 'left', transition: 'background 0.15s' }}
                                    onMouseEnter={e => { if (!isActive && isReachable) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDone ? '#16A34A' : isSkipped ? '#D97706' : isActive ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.07)', border: isActive ? '2px solid #A78BFA' : isDone ? '2px solid #16A34A' : isSkipped ? '2px solid #D97706' : '2px solid rgba(255,255,255,0.1)' }}>
                                        {isDone    ? <Check size={12} color="#fff" strokeWidth={2.5} />
                                        : isSkipped ? <SkipForward size={11} color="#fff" />
                                        : <Icon size={12} color={isActive ? '#C4B5FD' : 'rgba(255,255,255,0.3)'} />}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ margin: 0, fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? '#E9D5FF' : isDone ? '#86EFAC' : isSkipped ? '#FCD34D' : 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.25 }}>
                                            {s.label}
                                        </p>
                                        <p style={{ margin: 0, fontSize: 10, color: isDone ? '#4ADE80' : isSkipped ? '#FCD34D' : isActive ? 'rgba(167,139,250,0.7)' : 'rgba(255,255,255,0.2)', lineHeight: 1 }}>
                                            {isDone ? 'Complete' : isSkipped ? 'Skipped' : isActive ? 'In progress' : 'Pending'}
                                        </p>
                                    </div>
                                    {s.optional && (
                                        <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.06em', flexShrink: 0 }}>OPT</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Progress bar */}
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

                {/* ── RIGHT: content ── */}
                <div style={{ flex: 1, background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 28px 14px', borderBottom: '1px solid #F5F3FF', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {(() => { const I = curr.icon; return <I size={17} color={P} />; })()}
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1E1B4B' }}>{curr.label}</h3>
                                    {curr.optional && (
                                        <span style={{ fontSize: 10, fontWeight: 700, background: '#FEF3C7', color: '#D97706', borderRadius: 8, padding: '1px 8px' }}>OPTIONAL</span>
                                    )}
                                </div>
                                <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>Step {step + 1} of {STEPS.length}</p>
                            </div>
                        </div>
                        <button type="button" onClick={handleCancel}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4, borderRadius: 6, display: 'flex' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
                            <X size={18} />
                        </button>
                    </div>

                    {/* Scrollable content */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
                        {stepContent[step]}
                    </div>

                    {/* Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 28px', borderTop: '1px solid #F5F3FF', flexShrink: 0, background: '#FDFCFF' }}>
                        {/* Back */}
                        <button type="button" onClick={handleBack} disabled={step === 0}
                            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px', borderRadius: 8, border: '1px solid #EDE9FE', background: step === 0 ? '#F9FAFB' : '#fff', color: step === 0 ? '#D1D5DB' : P, cursor: step === 0 ? 'default' : 'pointer', fontWeight: 500, fontSize: 13 }}>
                            <ChevronLeft size={14} /> Back
                        </button>

                        {/* Step dots */}
                        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                            {STEPS.map((_, i) => (
                                <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: completed.has(i) ? P : skipped.has(i) ? '#D97706' : i === step ? '#A78BFA' : '#E5E7EB', transition: 'all 0.2s' }} />
                            ))}
                        </div>

                        {/* Right actions */}
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            {curr.optional && !isLastStep && (
                                <button type="button" onClick={handleSkip}
                                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', color: '#64748B', cursor: 'pointer', fontWeight: 500, fontSize: 13 }}>
                                    <SkipForward size={13} /> Skip Step
                                </button>
                            )}
                            {!isLastStep && (
                                <button type="button" onClick={handleNext}
                                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 20px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg,${P},#A855F7)`, color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13, boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
                                    Next <ChevronRight size={14} />
                                </button>
                            )}
                            {isLastStep && (
                                <>
                                    {curr.optional && (
                                        <button type="button" onClick={handleSkip}
                                            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', color: '#64748B', cursor: 'pointer', fontWeight: 500, fontSize: 13 }}>
                                            <SkipForward size={13} /> Skip &amp; Create
                                        </button>
                                    )}
                                    <button type="button" onClick={handleSubmit}
                                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 22px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#059669,#10B981)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 14px rgba(5,150,105,0.3)' }}>
                                        <Check size={14} /> Create Project
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
