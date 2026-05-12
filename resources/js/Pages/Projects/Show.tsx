import AppLayout from '@/Layouts/AppLayout';
import Badge from '@/Components/Badge';
import Modal from '@/Components/Modal';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronRight, Plus, GripVertical, Paperclip, MessageSquare, Clock, CheckCircle2, MoreHorizontal, X, Upload, FileText, AlertCircle, Link2, Copy, Check, Mail, UserPlus, Trash2, RefreshCw, Eye, Shield, Lock, Zap } from 'lucide-react';

const tabs = ['Overview', 'Kanban', 'Task List', 'Milestones', 'Files', 'Reports', 'Sharing'];

const kanbanCols = [
    {
        id: 'backlog', label: 'Backlog', color: 'bg-slate-100 text-slate-600',
        tasks: [
            { id: 1, title: 'Set up CI/CD pipeline',    priority: 'Medium', assignee: 'DA', comments: 2, attachments: 0, due: 'May 5',  points: 40 },
            { id: 2, title: 'Write API documentation',  priority: 'Low',    assignee: 'SR', comments: 0, attachments: 1, due: 'May 10', points: 20 },
        ],
    },
    {
        id: 'inprogress', label: 'In Progress', color: 'bg-blue-100 text-blue-700',
        tasks: [
            { id: 3, title: 'Design homepage hero section',    priority: 'High',   assignee: 'SA', comments: 5, attachments: 3, due: 'Apr 15', points: 75 },
            { id: 4, title: 'Implement authentication flow',   priority: 'High',   assignee: 'HA', comments: 3, attachments: 1, due: 'Apr 12', points: 85 },
            { id: 5, title: 'Responsive navigation menu',      priority: 'Medium', assignee: 'DA', comments: 1, attachments: 0, due: 'Apr 18', points: 35 },
        ],
    },
    {
        id: 'review', label: 'In Review', color: 'bg-amber-100 text-amber-700',
        tasks: [
            { id: 6, title: 'Color palette & typography', priority: 'Medium', assignee: 'SA', comments: 4, attachments: 2, due: 'Apr 5', points: 50 },
        ],
    },
    {
        id: 'done', label: 'Completed', color: 'bg-green-100 text-green-700',
        tasks: [
            { id: 7, title: 'Project kickoff meeting', priority: 'Low',  assignee: 'HA', comments: 2, attachments: 1, due: 'Mar 20', points: 15 },
            { id: 8, title: 'Wireframe approval',      priority: 'High', assignee: 'SA', comments: 7, attachments: 4, due: 'Mar 25', points: 60 },
        ],
    },
    {
        id: 'reopened', label: 'Reopened', color: 'bg-rose-100 text-rose-700',
        tasks: [
            { id: 9, title: 'Fix broken mobile nav layout', priority: 'High', assignee: 'DA', comments: 3, attachments: 0, due: 'May 14', points: 55 },
        ],
    },
];

// Points helpers
function pointsColor(p: number): { bg: string; text: string; bar: string } {
    if (p <= 30)  return { bg: '#F0FDF4', text: '#16A34A', bar: '#22C55E' }; // green  — easy
    if (p <= 60)  return { bg: '#FFFBEB', text: '#D97706', bar: '#F59E0B' }; // amber  — moderate
    if (p <= 80)  return { bg: '#FFF7ED', text: '#EA580C', bar: '#F97316' }; // orange — hard
    return         { bg: '#FFF1F2', text: '#BE123C', bar: '#F43F5E' };        // rose   — complex
}
function pointsLabel(p: number): string {
    if (p <= 30)  return 'Easy';
    if (p <= 60)  return 'Moderate';
    if (p <= 80)  return 'Hard';
    return 'Complex';
}

const milestones = [
    { name: 'Discovery & Planning', tasks: 5,  done: 5,  due: 'Mar 25', status: 'Completed' },
    { name: 'Design Phase',         tasks: 8,  done: 5,  due: 'Apr 15', status: 'In Progress' },
    { name: 'Development Sprint 1', tasks: 12, done: 2,  due: 'May 1',  status: 'In Progress' },
    { name: 'QA & Testing',         tasks: 6,  done: 0,  due: 'May 15', status: 'Backlog' },
    { name: 'Launch',               tasks: 4,  done: 0,  due: 'May 30', status: 'Backlog' },
];

const files = [
    { name: 'Brand_Guidelines_v3.pdf',  size: '4.2 MB', updated: '2 days ago', versions: 3, uploader: 'Sarah M.' },
    { name: 'Homepage_Wireframe.fig',   size: '1.8 MB', updated: '5 days ago', versions: 5, uploader: 'Dev A.' },
    { name: 'API_Spec_v1.docx',         size: '560 KB', updated: '1 week ago', versions: 2, uploader: 'Hamza A.' },
    { name: 'Project_Timeline.xlsx',    size: '230 KB', updated: '2 weeks ago',versions: 1, uploader: 'Sarah M.' },
];

const priorityVariant: Record<string, 'red'|'amber'|'slate'> = { High: 'red', Medium: 'amber', Low: 'slate' };

function AddTaskModal({ open, onClose, defaultStatus }: { open: boolean; onClose: () => void; defaultStatus?: string }) {
    const [form, setForm] = useState({
        title: '', status: defaultStatus ?? 'Backlog', priority: 'Medium',
        assignee: '', due: '', description: '', estHours: '', estMins: '0', points: 20,
    });
    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
    const setPoints = (v: number) => setForm(f => ({ ...f, points: Math.min(100, Math.max(1, v)) }));

    return (
        <Modal show={open} maxWidth="lg" onClose={onClose}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">Add Task</h2>
                        <p className="text-sm text-slate-500 mt-0.5">Create a new task for this project.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Task Title <span className="text-red-500">*</span></label>
                        <input
                            value={form.title}
                            onChange={e => set('title', e.target.value)}
                            placeholder="e.g. Design homepage hero section"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-0"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select value={form.status} onChange={e => set('status', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-0">
                                <option>Backlog</option>
                                <option>In Progress</option>
                                <option>In Review</option>
                                <option>Completed</option>
                                <option>Reopened</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                            <select value={form.priority} onChange={e => set('priority', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-0">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                            <input type="date" value={form.due} onChange={e => set('due', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-0"
                            />
                        </div>
                    </div>

                    {/* Estimated Time */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Estimated Time to Finish
                            <span className="ml-1.5 text-xs font-normal text-slate-400">(how long will this task take?)</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    type="number"
                                    min="0"
                                    max="999"
                                    value={form.estHours}
                                    onChange={e => set('estHours', e.target.value)}
                                    placeholder="0"
                                    className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-0"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">hrs</span>
                            </div>
                            <select
                                value={form.estMins}
                                onChange={e => set('estMins', e.target.value)}
                                className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-0"
                            >
                                <option value="0">0 min</option>
                                <option value="15">15 min</option>
                                <option value="30">30 min</option>
                                <option value="45">45 min</option>
                            </select>
                            {(form.estHours || form.estMins !== '0') && (
                                <span className="shrink-0 rounded-full bg-brand-50 border border-brand-100 px-3 py-1 text-xs font-semibold text-brand-600">
                                    {[form.estHours && `${form.estHours}h`, form.estMins !== '0' && `${form.estMins}m`].filter(Boolean).join(' ')}
                                </span>
                            )}
                        </div>
                        {/* Quick presets */}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {[['30m','0','30'],['1h','1','0'],['2h','2','0'],['4h','4','0'],['1 day','8','0'],['2 days','16','0']].map(([label, h, m]) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => { set('estHours', h); set('estMins', m); }}
                                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${form.estHours === h && form.estMins === m ? 'border-brand-400 bg-brand-50 text-brand-600' : 'border-slate-200 text-slate-500 hover:border-brand-300 hover:text-brand-500'}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Task Points */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Task Points
                                <span className="ml-1.5 text-xs font-normal text-slate-400">(effort / complexity score, 1–100)</span>
                            </label>
                            {/* Live badge preview */}
                            <PointsBadge points={form.points} />
                        </div>

                        {/* Slider */}
                        <div className="relative mb-2">
                            <input
                                type="range" min={1} max={100} value={form.points}
                                onChange={e => setPoints(Number(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, ${pointsColor(form.points).bar} 0%, ${pointsColor(form.points).bar} ${form.points}%, #E5E7EB ${form.points}%, #E5E7EB 100%)`,
                                }}
                            />
                        </div>

                        {/* Number input + tier labels */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-24">
                                <input
                                    type="number" min={1} max={100} value={form.points}
                                    onChange={e => setPoints(Number(e.target.value))}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 text-center focus:border-brand-400 focus:outline-none focus:ring-0"
                                />
                            </div>
                            <div className="flex flex-1 justify-between text-[10px] font-medium">
                                {([['1','Easy','#16A34A'],['31','Moderate','#D97706'],['61','Hard','#EA580C'],['81','Complex','#BE123C']] as [string,string,string][]).map(([val,lbl,clr]) => (
                                    <button
                                        key={lbl} type="button"
                                        onClick={() => setPoints(Number(val))}
                                        style={{ color: clr, border: `1px solid ${clr}44`, background: `${clr}11`, borderRadius: 20, padding: '2px 10px', cursor: 'pointer', fontWeight: 600, transition: 'opacity 0.15s', opacity: pointsLabel(form.points) === lbl ? 1 : 0.45 }}
                                    >
                                        {lbl}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Contextual hint */}
                        <p className="mt-1.5 text-xs text-slate-400">
                            {form.points <= 30  && '🟢 Low effort — quick wins, simple tasks.'}
                            {form.points > 30 && form.points <= 60  && '🟡 Moderate — a few hours of focused work.'}
                            {form.points > 60 && form.points <= 80  && '🟠 High effort — requires deep focus or collaboration.'}
                            {form.points > 80  && '🔴 Complex — significant work, consider splitting into subtasks.'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
                        <select value={form.assignee} onChange={e => set('assignee', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-0">
                            <option value="">Unassigned</option>
                            <option>Hamza Ahmed</option>
                            <option>Dev Ahmad</option>
                            <option>Sara Rahman</option>
                            <option>Sarah Manager</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea value={form.description} onChange={e => set('description', e.target.value)}
                            rows={3} placeholder="Task details or acceptance criteria..."
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-0 resize-none"
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors">
                        <Plus size={15} /> Add Task
                    </button>
                </div>
            </div>
        </Modal>
    );
}

function UploadFileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState('');

    return (
        <Modal show={open} maxWidth="md" onClose={onClose}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">Upload File</h2>
                        <p className="text-sm text-slate-500 mt-0.5">Add a document to this project's vault.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setFileName(f.name); }}
                    className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${dragging ? 'border-brand-400 bg-brand-100' : 'border-slate-200 bg-slate-50 hover:border-brand-300'}`}
                >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${dragging ? 'bg-brand-600' : 'bg-white border border-slate-200'}`}>
                        <Upload size={20} className={dragging ? 'text-white' : 'text-slate-400'} />
                    </div>
                    {fileName ? (
                        <div className="flex items-center gap-2 text-sm font-medium text-brand-600">
                            <FileText size={16} /> {fileName}
                        </div>
                    ) : (
                        <>
                            <p className="text-sm font-medium text-slate-700">Drop files here or <label className="cursor-pointer text-brand-600 underline">browse<input type="file" className="sr-only" onChange={e => { const f = e.target.files?.[0]; if (f) setFileName(f.name); }} /></label></p>
                            <p className="text-xs text-slate-400">PDF, Word, Excel, Figma — up to 50MB</p>
                        </>
                    )}
                </div>

                {fileName && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                        <FileText size={14} className="text-green-600 shrink-0" />
                        <span className="text-sm text-green-700 truncate flex-1">{fileName}</span>
                        <button onClick={() => setFileName('')} className="text-green-500 hover:text-green-700">
                            <X size={14} />
                        </button>
                    </div>
                )}

                <div className="mt-4 space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-slate-400 font-normal">(optional)</span></label>
                        <input placeholder="Brief description of this file..."
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors">
                        <Upload size={15} /> Upload
                    </button>
                </div>
            </div>
        </Modal>
    );
}

function PointsBadge({ points }: { points: number }) {
    const { bg, text, bar } = pointsColor(points);
    const label = pointsLabel(points);
    return (
        <div style={{ background: bg, borderRadius: 7, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 5, border: `1px solid ${bar}22` }}>
            <Zap size={10} style={{ color: text, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: text, lineHeight: 1 }}>{points}</span>
            <span style={{ fontSize: 10, color: text, opacity: 0.75, lineHeight: 1 }}>{label}</span>
            {/* Mini bar */}
            <div style={{ width: 28, height: 3, borderRadius: 2, background: '#E5E7EB', marginLeft: 2 }}>
                <div style={{ width: `${points}%`, height: '100%', borderRadius: 2, background: bar, transition: 'width 0.3s' }} />
            </div>
        </div>
    );
}

function KanbanCard({ task }: { task: typeof kanbanCols[0]['tasks'][0] }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
            <div className="flex items-start gap-2 mb-2">
                <GripVertical size={14} className="text-slate-300 mt-0.5 shrink-0" />
                <p className="text-sm font-medium text-slate-800 leading-snug flex-1">{task.title}</p>
            </div>
            <div className="flex items-center justify-between mb-2">
                <Badge label={task.priority} variant={priorityVariant[task.priority]} />
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    {task.comments > 0 && <span className="flex items-center gap-0.5"><MessageSquare size={11} />{task.comments}</span>}
                    {task.attachments > 0 && <span className="flex items-center gap-0.5"><Paperclip size={11} />{task.attachments}</span>}
                    <span className="flex items-center gap-0.5"><Clock size={11} />{task.due}</span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">{task.assignee}</div>
                </div>
            </div>
            {/* Points row */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <PointsBadge points={task.points} />
                <span className="text-[10px] text-slate-400">Task Points</span>
            </div>
        </div>
    );
}

// ── Shared-link helpers ──────────────────────────────────────────────────────
function generateToken() {
    return 'tp_' + Math.random().toString(36).slice(2, 11) + Math.random().toString(36).slice(2, 7);
}

const BASE_URL = window.location.origin;

interface ClientAccess {
    id: number;
    name: string;
    email: string;
    role: 'View Only' | 'Can Comment' | 'Full Access';
    status: 'Active' | 'Pending';
    invitedAt: string;
    avatarColor: string;
}

const initialClients: ClientAccess[] = [
    { id: 1, name: 'John Acme',   email: 'john@acmecorp.com',  role: 'Full Access',  status: 'Active',  invitedAt: 'May 1, 2026',  avatarColor: '#7C3AED' },
    { id: 2, name: 'Lisa Acme',   email: 'lisa@acmecorp.com',  role: 'View Only',    status: 'Active',  invitedAt: 'May 3, 2026',  avatarColor: '#3B82F6' },
    { id: 3, name: 'Ray Partner', email: 'ray@partner.io',     role: 'Can Comment',  status: 'Pending', invitedAt: 'May 9, 2026',  avatarColor: '#F59E0B' },
];

const roleColors: Record<string, { bg: string; color: string }> = {
    'Full Access':  { bg: '#EDE9FE', color: '#7C3AED' },
    'Can Comment':  { bg: '#DBEAFE', color: '#2563EB' },
    'View Only':    { bg: '#F1F5F9', color: '#64748B' },
};

export default function ProjectShow() {
    const [activeTab, setActiveTab] = useState('Kanban');
    const [showAddTask, setShowAddTask] = useState(false);
    const [addTaskStatus, setAddTaskStatus] = useState<string | undefined>(undefined);
    const [showUploadFile, setShowUploadFile] = useState(false);

    // Sharing state
    const [magicToken,   setMagicToken]   = useState(generateToken());
    const [linkCopied,   setLinkCopied]   = useState(false);
    const [linkEnabled,  setLinkEnabled]  = useState(true);
    const [linkRole,     setLinkRole]     = useState<ClientAccess['role']>('View Only');
    const [clients,      setClients]      = useState<ClientAccess[]>(initialClients);
    const [inviteEmail,  setInviteEmail]  = useState('');
    const [inviteName,   setInviteName]   = useState('');
    const [inviteRole,   setInviteRole]   = useState<ClientAccess['role']>('View Only');
    const [inviteSent,   setInviteSent]   = useState(false);

    const magicLink = `${BASE_URL}/project/share/${magicToken}`;

    const copyLink = () => {
        navigator.clipboard.writeText(magicLink).then(() => {
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2500);
        });
    };

    const regenerateLink = () => setMagicToken(generateToken());

    const sendInvite = () => {
        if (!inviteEmail) return;
        const newClient: ClientAccess = {
            id: Date.now(), name: inviteName || inviteEmail.split('@')[0],
            email: inviteEmail, role: inviteRole, status: 'Pending',
            invitedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            avatarColor: ['#7C3AED','#3B82F6','#10B981','#F59E0B','#EC4899','#06B6D4'][Math.floor(Math.random()*6)],
        };
        setClients(prev => [...prev, newClient]);
        setInviteEmail(''); setInviteName(''); setInviteSent(true);
        setTimeout(() => setInviteSent(false), 3000);
    };

    const removeClient = (id: number) => setClients(prev => prev.filter(c => c.id !== id));

    const changeRole = (id: number, role: ClientAccess['role']) =>
        setClients(prev => prev.map(c => c.id === id ? { ...c, role } : c));

    const openAddTask = (status?: string) => {
        setAddTaskStatus(status);
        setShowAddTask(true);
    };

    return (
        <AppLayout title="Website Redesign">
            <Head title="Website Redesign" />
            <AddTaskModal open={showAddTask} onClose={() => setShowAddTask(false)} defaultStatus={addTaskStatus} />
            <UploadFileModal open={showUploadFile} onClose={() => setShowUploadFile(false)} />

            {/* Breadcrumb */}
            <nav className="mb-4 flex items-center gap-1 text-sm text-slate-500">
                <Link href={route('projects.index')} className="hover:text-brand-600">Projects</Link>
                <ChevronRight size={14} />
                <span className="text-slate-800 font-medium">Website Redesign</span>
            </nav>

            {/* Project header */}
            <div className="mb-5 flex flex-wrap items-center gap-4 rounded-card border border-slate-200 bg-card p-5 shadow-sm">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-bold text-slate-800">Website Redesign</h2>
                        <Badge label="In Progress" variant="blue" />
                    </div>
                    <p className="text-sm text-slate-500">Client: Acme Corp · Due: Apr 15, 2026 · Budget: $12,000</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-xs text-slate-400">Progress</p>
                        <p className="text-2xl font-bold text-brand-600">65%</p>
                    </div>
                    <button
                        onClick={() => openAddTask()}
                        className="flex items-center gap-2 rounded-btn bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
                    >
                        <Plus size={16} /> Add Task
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-5 flex gap-1 border-b border-slate-200">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab
                                ? 'border-brand-600 text-brand-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ── Overview ── */}
            {activeTab === 'Overview' && (
                <div className="grid gap-5 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="rounded-card border border-slate-200 bg-card p-5 shadow-sm">
                            <h3 className="font-semibold text-slate-700 mb-3">Project Description</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                A full redesign of Acme Corp's public-facing website. Includes new brand alignment, responsive layouts, improved UX flows, and a headless CMS integration for content management. The project spans discovery, design, and development phases.
                            </p>
                        </div>
                        <div className="rounded-card border border-slate-200 bg-card p-5 shadow-sm">
                            <h3 className="font-semibold text-slate-700 mb-3">Milestone Progress</h3>
                            <div className="space-y-3">
                                {milestones.map(m => (
                                    <div key={m.name}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-700">{m.name}</span>
                                            <span className="text-slate-400">{m.done}/{m.tasks} tasks</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-slate-100">
                                            <div className="h-2 rounded-full bg-brand-600" style={{ width: `${(m.done/m.tasks)*100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="rounded-card border border-slate-200 bg-card p-5 shadow-sm">
                            <h3 className="font-semibold text-slate-700 mb-3">Team Members</h3>
                            {['Sarah Manager', 'Hamza A. (Dev)', 'Dev A. (Design)', 'QA Tester'].map(name => (
                                <div key={name} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                                    <div className="h-8 w-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">{name[0]}</div>
                                    <span className="text-sm text-slate-700">{name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-card border border-slate-200 bg-card p-5 shadow-sm">
                            <h3 className="font-semibold text-slate-700 mb-3">Budget</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-slate-500">Total Budget</span><span className="font-medium">$12,000</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Spent</span><span className="font-medium text-amber-600">$7,800</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Remaining</span><span className="font-medium text-green-600">$4,200</span></div>
                                <div className="h-2 rounded-full bg-slate-100 mt-2">
                                    <div className="h-2 rounded-full bg-amber-500" style={{ width: '65%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Kanban ── */}
            {activeTab === 'Kanban' && (
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {kanbanCols.map(col => (
                        <div key={col.id} className="shrink-0 w-72">
                            <div className={`mb-3 flex items-center justify-between rounded-lg px-3 py-2 ${col.color}`}>
                                <span className="text-sm font-semibold">{col.label}</span>
                                <span className="text-xs font-medium opacity-70">{col.tasks.length}</span>
                            </div>
                            <div className="space-y-2 min-h-24">
                                {col.tasks.map(task => <KanbanCard key={task.id} task={task} />)}
                            </div>
                            <button
                                onClick={() => openAddTask(col.label)}
                                className="mt-2 flex w-full items-center gap-2 rounded-lg border-2 border-dashed border-slate-200 px-3 py-2 text-sm text-slate-400 hover:border-brand-400 hover:text-brand-500 transition-colors"
                            >
                                <Plus size={14} /> Add task
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Task List ── */}
            {activeTab === 'Task List' && (
                <div className="rounded-card border border-slate-200 bg-card shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-5 py-3 text-left">Task</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Priority</th>
                                <th className="px-4 py-3 text-left">Points</th>
                                <th className="px-4 py-3 text-left">Assignee</th>
                                <th className="px-4 py-3 text-left">Due</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {kanbanCols.flatMap(col => col.tasks.map(task => (
                                <tr key={task.id} className="hover:bg-slate-50">
                                    <td className="px-5 py-3 font-medium text-slate-800">{task.title}</td>
                                    <td className="px-4 py-3">
                                        <Badge label={col.label} variant={col.id === 'done' ? 'green' : col.id === 'review' ? 'amber' : col.id === 'inprogress' ? 'blue' : col.id === 'reopened' ? 'red' : 'slate'} />
                                    </td>
                                    <td className="px-4 py-3"><Badge label={task.priority} variant={priorityVariant[task.priority]} /></td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <PointsBadge points={task.points} />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">{task.assignee}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">{task.due}</td>
                                    <td className="px-4 py-3"><button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={16} /></button></td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Milestones ── */}
            {activeTab === 'Milestones' && (
                <div className="space-y-4">
                    {milestones.map((m, i) => (
                        <div key={m.name} className="rounded-card border border-slate-200 bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${m.status === 'Completed' ? 'bg-green-100 text-green-600' : m.status === 'In Progress' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {m.status === 'Completed' ? <CheckCircle2 size={16} /> : i + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">{m.name}</h3>
                                        <p className="text-xs text-slate-400">Due {m.due} · {m.tasks} tasks</p>
                                    </div>
                                </div>
                                <Badge label={m.status} variant={m.status === 'Completed' ? 'green' : m.status === 'In Progress' ? 'blue' : 'slate'} />
                            </div>
                            <div className="h-2 rounded-full bg-slate-100">
                                <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: `${(m.done/m.tasks)*100}%` }} />
                            </div>
                            <p className="mt-1 text-xs text-slate-400">{m.done} of {m.tasks} tasks completed</p>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Files ── */}
            {activeTab === 'Files' && (
                <div className="rounded-card border border-slate-200 bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <h3 className="font-semibold text-slate-700">Document Vault</h3>
                        <button
                            onClick={() => setShowUploadFile(true)}
                            className="flex items-center gap-2 rounded-btn bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 transition-colors"
                        >
                            <Plus size={13} /> Upload File
                        </button>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-5 py-3 text-left">File Name</th>
                                <th className="px-4 py-3 text-left">Size</th>
                                <th className="px-4 py-3 text-left">Versions</th>
                                <th className="px-4 py-3 text-left">Uploaded By</th>
                                <th className="px-4 py-3 text-left">Last Updated</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {files.map(f => (
                                <tr key={f.name} className="hover:bg-slate-50">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <Paperclip size={14} className="text-slate-400" />
                                            <span className="font-medium text-slate-800">{f.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">{f.size}</td>
                                    <td className="px-4 py-3"><Badge label={`v${f.versions}`} variant="indigo" /></td>
                                    <td className="px-4 py-3 text-slate-500">{f.uploader}</td>
                                    <td className="px-4 py-3 text-slate-500">{f.updated}</td>
                                    <td className="px-4 py-3">
                                        <button className="text-xs text-brand-600 hover:underline">Download</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Sharing ── */}
            {activeTab === 'Sharing' && (
                <div className="space-y-6">

                    {/* Magic link card */}
                    <div className="rounded-card border border-slate-200 bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 border border-brand-100">
                                <Link2 size={18} className="text-brand-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Shareable Magic Link</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Anyone with this link can access the project with the selected permission level.</p>
                            </div>
                            {/* Enable toggle */}
                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-sm text-slate-500">{linkEnabled ? 'Link active' : 'Link disabled'}</span>
                                <button
                                    onClick={() => setLinkEnabled(e => !e)}
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${linkEnabled ? 'bg-brand-600' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${linkEnabled ? 'translate-x-4' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>

                        {linkEnabled ? (
                            <div className="mt-4 space-y-3">
                                {/* Link display + copy */}
                                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                                    <Lock size={13} className="text-slate-400 shrink-0" />
                                    <span className="flex-1 truncate text-sm text-slate-600 font-mono">{magicLink}</span>
                                    <button
                                        onClick={copyLink}
                                        className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${linkCopied ? 'bg-green-100 text-green-700' : 'bg-brand-600 text-white hover:bg-brand-700'}`}
                                    >
                                        {linkCopied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Link</>}
                                    </button>
                                </div>

                                {/* Link permission + regenerate */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <Eye size={14} className="text-slate-400" />
                                        <span className="text-sm text-slate-500">Anyone with link gets:</span>
                                        <select
                                            value={linkRole}
                                            onChange={e => setLinkRole(e.target.value as ClientAccess['role'])}
                                            className="rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-700 focus:border-brand-400 focus:outline-none"
                                        >
                                            <option>View Only</option>
                                            <option>Can Comment</option>
                                            <option>Full Access</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={regenerateLink}
                                        className="ml-auto flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:border-red-300 hover:text-red-500 transition-colors"
                                    >
                                        <RefreshCw size={12} /> Regenerate Link
                                    </button>
                                </div>

                                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                                    ⚠ Regenerating the link will invalidate the old one. Anyone using the previous link will lose access.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                                <Shield size={16} className="text-slate-400" />
                                <span className="text-sm text-slate-500">Link sharing is disabled. Enable the toggle to share project access via link.</span>
                            </div>
                        )}
                    </div>

                    {/* Invite clients card */}
                    <div className="rounded-card border border-slate-200 bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 border border-brand-100">
                                <UserPlus size={18} className="text-brand-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Invite Clients by Email</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Send a personalised invitation email with a secure one-time access link.</p>
                            </div>
                        </div>

                        {inviteSent && (
                            <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5">
                                <Check size={15} className="text-green-600 shrink-0" />
                                <span className="text-sm font-medium text-green-700">Invitation sent! They'll receive an email with a secure access link.</span>
                            </div>
                        )}

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <input
                                value={inviteName}
                                onChange={e => setInviteName(e.target.value)}
                                placeholder="Client name"
                                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none"
                            />
                            <input
                                value={inviteEmail}
                                onChange={e => setInviteEmail(e.target.value)}
                                placeholder="Email address *"
                                type="email"
                                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none"
                            />
                            <select
                                value={inviteRole}
                                onChange={e => setInviteRole(e.target.value as ClientAccess['role'])}
                                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-brand-400 focus:outline-none"
                            >
                                <option>View Only</option>
                                <option>Can Comment</option>
                                <option>Full Access</option>
                            </select>
                            <button
                                onClick={sendInvite}
                                disabled={!inviteEmail}
                                className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <Mail size={15} /> Send Invite
                            </button>
                        </div>
                    </div>

                    {/* Client access list */}
                    <div className="rounded-card border border-slate-200 bg-card shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                            <h3 className="font-semibold text-slate-700">Client Access ({clients.length})</h3>
                            <span className="text-xs text-slate-400">{clients.filter(c=>c.status==='Active').length} active · {clients.filter(c=>c.status==='Pending').length} pending</span>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 text-left">Client</th>
                                    <th className="px-4 py-3 text-left">Email</th>
                                    <th className="px-4 py-3 text-left">Permission</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Invited</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {clients.map(c => (
                                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: c.avatarColor }}>
                                                    {c.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-slate-800">{c.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">{c.email}</td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={c.role}
                                                onChange={e => changeRole(c.id, e.target.value as ClientAccess['role'])}
                                                className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium focus:border-brand-400 focus:outline-none"
                                                style={{ color: roleColors[c.role].color }}
                                            >
                                                <option>View Only</option>
                                                <option>Can Comment</option>
                                                <option>Full Access</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${c.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-400 text-xs">{c.invitedAt}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {c.status === 'Pending' && (
                                                    <button className="text-xs text-brand-600 hover:underline whitespace-nowrap">Resend</button>
                                                )}
                                                <button onClick={() => removeClient(c.id)} className="text-slate-300 hover:text-red-500 transition-colors" title="Remove access">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {clients.length === 0 && (
                            <div className="py-12 text-center text-slate-400 text-sm">
                                No clients invited yet. Use the form above to send invitations.
                            </div>
                        )}
                    </div>

                    {/* Access info box */}
                    <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                        <AlertCircle size={16} className="text-blue-500 mt-0.5 shrink-0" />
                        <div className="text-sm text-blue-700 space-y-1">
                            <p><strong>View Only</strong> — can see tasks, milestones and files. Cannot make any changes.</p>
                            <p><strong>Can Comment</strong> — same as View Only plus can leave comments on tasks.</p>
                            <p><strong>Full Access</strong> — can view, comment, upload files and update task statuses.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Reports ── */}
            {activeTab === 'Reports' && (
                <div className="grid gap-5 lg:grid-cols-2">
                    <div className="rounded-card border border-slate-200 bg-card p-5 shadow-sm">
                        <h3 className="font-semibold text-slate-700 mb-4">Hours Summary</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Estimated Hours', value: '320h', pct: 100, color: 'bg-slate-300' },
                                { label: 'Logged Hours',    value: '208h', pct: 65,  color: 'bg-brand-600' },
                                { label: 'Billable Hours',  value: '190h', pct: 59,  color: 'bg-green-500' },
                            ].map(r => (
                                <div key={r.label}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600">{r.label}</span>
                                        <span className="font-semibold text-slate-800">{r.value}</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-100">
                                        <div className={`h-2 rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-card border border-slate-200 bg-card p-5 shadow-sm">
                        <h3 className="font-semibold text-slate-700 mb-4">Budget vs Spend</h3>
                        <div className="space-y-3 text-sm">
                            {[
                                { label: 'Total Budget',  value: '$12,000', sub: '' },
                                { label: 'Spent to Date', value: '$7,800',  sub: '65% used' },
                                { label: 'Forecasted',    value: '$11,200', sub: 'On track' },
                                { label: 'Remaining',     value: '$4,200',  sub: '' },
                            ].map(r => (
                                <div key={r.label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                    <span className="text-slate-600">{r.label}</span>
                                    <div className="text-right">
                                        <span className="font-semibold text-slate-800">{r.value}</span>
                                        {r.sub && <span className="block text-xs text-slate-400">{r.sub}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-card border border-slate-200 bg-card p-5 shadow-sm lg:col-span-2">
                        <h3 className="font-semibold text-slate-700 mb-4">Weekly Hours by Member</h3>
                        <div className="space-y-2">
                            {[
                                { name: 'Hamza A.',    hours: 38, max: 40 },
                                { name: 'Dev A.',      hours: 32, max: 40 },
                                { name: 'Sarah M.',    hours: 20, max: 40 },
                                { name: 'QA Tester',   hours: 15, max: 40 },
                            ].map(m => (
                                <div key={m.name} className="flex items-center gap-4">
                                    <span className="w-24 text-sm text-slate-600">{m.name}</span>
                                    <div className="flex-1 h-3 rounded-full bg-slate-100">
                                        <div className="h-3 rounded-full bg-brand-600" style={{ width: `${(m.hours/m.max)*100}%` }} />
                                    </div>
                                    <span className="w-12 text-right text-xs text-slate-500">{m.hours}h</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
