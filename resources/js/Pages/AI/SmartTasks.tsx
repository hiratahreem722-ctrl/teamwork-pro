import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Button, Select, Tag, Typography, Tooltip } from 'antd';
import {
    Sparkles, Zap, CheckCircle2, ChevronRight,
    AlertTriangle, Clock, User, TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

const { Text } = Typography;

// ── Mock data ─────────────────────────────────────────────────────────────────

const teamMembers = [
    { id: 1, name: 'Marcus Chen',      avatar: 'MC', dept: 'Engineering', tasks: 7, capacity: 88 },
    { id: 2, name: 'Hamza Ali',        avatar: 'HA', dept: 'Design',       tasks: 4, capacity: 62 },
    { id: 3, name: 'Sophie Turner',    avatar: 'ST', dept: 'DevOps',       tasks: 3, capacity: 45 },
    { id: 4, name: 'Tom Wilson',       avatar: 'TW', dept: 'Engineering',  tasks: 2, capacity: 30 },
    { id: 5, name: 'Priya Sharma',     avatar: 'PS', dept: 'Analytics',    tasks: 5, capacity: 72 },
    { id: 6, name: 'James Taylor',     avatar: 'JT', dept: 'Engineering',  tasks: 6, capacity: 78 },
    { id: 7, name: 'Aisha Johnson',    avatar: 'AJ', dept: 'Product',      tasks: 8, capacity: 95 },
    { id: 8, name: 'Liam O\'Brien',    avatar: 'LO', dept: 'Sales',        tasks: 4, capacity: 55 },
];

interface AIRec {
    employee: string;
    avatar: string;
    match: number;
    skills: string[];
    reason: string;
}

interface Task {
    id: number;
    title: string;
    project: string;
    priority: 'High' | 'Medium' | 'Low';
    skills: string[];
    hours: number;
    rec: AIRec;
}

const initialTasks: Task[] = [
    {
        id: 1,
        title: 'Build user auth API endpoint',
        project: 'API Integration',
        priority: 'High',
        skills: ['PHP', 'Laravel', 'MySQL'],
        hours: 8,
        rec: { employee: 'Marcus Chen', avatar: 'MC', match: 92, skills: ['PHP', 'Laravel', 'MySQL'], reason: 'Strongest backend expertise on the team' },
    },
    {
        id: 2,
        title: 'Design onboarding flow screens',
        project: 'Mobile App v2',
        priority: 'High',
        skills: ['Figma', 'UX', 'Prototyping'],
        hours: 12,
        rec: { employee: 'Hamza Ali', avatar: 'HA', match: 97, skills: ['Figma', 'UX', 'Prototyping'], reason: 'Perfect skill match, available bandwidth' },
    },
    {
        id: 3,
        title: 'Write Jest unit tests for cart module',
        project: 'E-commerce Platform',
        priority: 'Medium',
        skills: ['Jest', 'React', 'Testing'],
        hours: 6,
        rec: { employee: 'Tom Wilson', avatar: 'TW', match: 88, skills: ['Jest', 'React', 'Testing'], reason: 'Low current load, strong testing background' },
    },
    {
        id: 4,
        title: 'Set up CI/CD pipeline for staging',
        project: 'API Integration',
        priority: 'High',
        skills: ['Docker', 'AWS', 'CI-CD'],
        hours: 10,
        rec: { employee: 'Sophie Turner', avatar: 'ST', match: 95, skills: ['Docker', 'AWS', 'CI-CD'], reason: 'DevOps specialist, 45% capacity free' },
    },
    {
        id: 5,
        title: 'Create quarterly sales report',
        project: 'CRM Implementation',
        priority: 'Medium',
        skills: ['Excel', 'Analytics', 'SQL'],
        hours: 4,
        rec: { employee: 'Priya Sharma', avatar: 'PS', match: 91, skills: ['Excel', 'Analytics', 'SQL'], reason: 'Analytics background, report experience' },
    },
    {
        id: 6,
        title: 'Implement payment gateway integration',
        project: 'Website Redesign',
        priority: 'High',
        skills: ['PHP', 'Stripe', 'Laravel'],
        hours: 16,
        rec: { employee: 'Marcus Chen', avatar: 'MC', match: 85, skills: ['PHP', 'Stripe', 'Laravel'], reason: 'Stripe + Laravel expertise, best available fit' },
    },
    {
        id: 7,
        title: 'Conduct user interviews',
        project: 'Mobile App v2',
        priority: 'Low',
        skills: ['UX Research', 'Communication'],
        hours: 5,
        rec: { employee: 'Hamza Ali', avatar: 'HA', match: 82, skills: ['UX Research', 'Communication'], reason: 'UX background, manageable current load' },
    },
    {
        id: 8,
        title: 'Optimize database queries',
        project: 'CRM Implementation',
        priority: 'Medium',
        skills: ['MySQL', 'SQL', 'Performance'],
        hours: 6,
        rec: { employee: 'Marcus Chen', avatar: 'MC', match: 90, skills: ['MySQL', 'SQL', 'Performance'], reason: 'Deep DB optimization experience' },
    },
];

const aiInsights = [
    { icon: TrendingUp, color: '#16A34A', text: 'Sophie Turner is underutilized at 45% — ideal for infrastructure tasks' },
    { icon: AlertTriangle, color: '#D97706', text: 'Marcus Chen is near capacity at 88% — limit new PHP assignments' },
    { icon: Clock, color: '#3B82F6', text: 'Tom Wilson returns from leave May 17 — queue tasks for then' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const priorityStyle: Record<string, { bg: string; text: string }> = {
    High:   { bg: '#FEE2E2', text: '#DC2626' },
    Medium: { bg: '#FEF3C7', text: '#D97706' },
    Low:    { bg: '#DCFCE7', text: '#16A34A' },
};

function PriorityBadge({ priority }: { priority: 'High' | 'Medium' | 'Low' }) {
    const s = priorityStyle[priority];
    return (
        <span style={{
            background: s.bg, color: s.text,
            borderRadius: 20, padding: '2px 9px', fontSize: 11, fontWeight: 600,
        }}>
            {priority}
        </span>
    );
}

function Avatar({ initials, size = 30, glow }: { initials: string; size?: number; glow?: boolean }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
            color: '#fff', fontSize: size * 0.35, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: glow ? '0 0 0 3px rgba(124,58,237,0.3)' : undefined,
        }}>
            {initials}
        </div>
    );
}

function CapacityBar({ pct }: { pct: number }) {
    const color = pct > 90 ? '#DC2626' : pct > 70 ? '#D97706' : '#16A34A';
    return (
        <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <Text style={{ fontSize: 11, color: '#94a3b8' }}>Capacity</Text>
                <Text style={{ fontSize: 11, color, fontWeight: 600 }}>{pct}%</Text>
            </div>
            <div style={{ height: 5, borderRadius: 3, background: '#F1F5F9', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 3, background: color, width: `${pct}%`, transition: 'width 0.5s' }} />
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SmartTasks() {
    const [revealedTasks, setRevealedTasks]   = useState<Set<number>>(new Set());
    const [assignedTasks, setAssignedTasks]   = useState<{ task: Task; assignee: string }[]>([]);
    const [unassigned, setUnassigned]         = useState<Task[]>(initialTasks);
    const [manualAssign, setManualAssign]     = useState<Record<number, string | undefined>>({});
    const [autoAssigning, setAutoAssigning]   = useState(false);
    const [autoAssignDone, setAutoAssignDone] = useState(false);

    const handleAISuggest = (id: number) => {
        setRevealedTasks(prev => new Set(prev).add(id));
    };

    const handleAssign = (task: Task, assignee: string) => {
        setAssignedTasks(prev => [...prev, { task, assignee }]);
        setUnassigned(prev => prev.filter(t => t.id !== task.id));
        setRevealedTasks(prev => { const s = new Set(prev); s.delete(task.id); return s; });
    };

    const handleAutoAssign = () => {
        if (autoAssigning) return;
        setAutoAssigning(true);
        // Reveal all first
        setRevealedTasks(new Set(unassigned.map(t => t.id)));
        setTimeout(() => {
            const newAssigned = unassigned.map(t => ({ task: t, assignee: t.rec.employee }));
            setAssignedTasks(prev => [...prev, ...newAssigned]);
            setUnassigned([]);
            setRevealedTasks(new Set());
            setAutoAssigning(false);
            setAutoAssignDone(true);
        }, 1400);
    };

    const memberOptions = teamMembers.map(m => ({ value: m.name, label: m.name }));

    return (
        <AppLayout title="AI Smart Tasks">
            <Head title="AI Smart Tasks" />

            {/* ── Hero ── */}
            <div style={{
                position: 'relative', marginBottom: 24, overflow: 'hidden',
                borderRadius: 16, padding: '32px 28px',
                background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #4C1D95 100%)',
            }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 240, height: 240, borderRadius: '50%', background: '#7C3AED', opacity: 0.2, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -30, left: -30, width: 160, height: 160, borderRadius: '50%', background: '#4F46E5', opacity: 0.15, pointerEvents: 'none' }} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 52, height: 52, borderRadius: 14,
                            background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(167,139,250,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 20px rgba(124,58,237,0.5)',
                        }}>
                            <Sparkles size={24} color="#A78BFA" />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A78BFA' }}>
                                    AI-Powered
                                </Text>
                                <span style={{
                                    background: 'rgba(124,58,237,0.4)', border: '1px solid #7C3AED',
                                    borderRadius: 20, padding: '1px 8px', fontSize: 10, color: '#C4B5FD', fontWeight: 600,
                                }}>
                                    BETA
                                </span>
                            </div>
                            <Text style={{ fontSize: 22, fontWeight: 700, color: '#fff', display: 'block' }}>Smart Task Assignment</Text>
                            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                                AI matches tasks to team members based on skills and availability
                            </Text>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>{unassigned.length}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Unassigned</div>
                        </div>
                        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }} />
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 26, fontWeight: 700, color: '#4ade80' }}>{assignedTasks.length}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Assigned</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Two-panel layout ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '60% 1fr', gap: 20 }}>

                {/* ── LEFT: Unassigned Tasks ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <Text strong style={{ fontSize: 15, color: '#1E1B4B' }}>Unassigned Tasks</Text>
                                <Text style={{ fontSize: 12, color: '#94a3b8', marginLeft: 8 }}>{unassigned.length} pending</Text>
                            </div>
                        </div>

                        {/* Table header */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 80px 1fr 60px 140px 100px',
                            padding: '10px 20px',
                            background: '#FAFAF9',
                            borderBottom: '1px solid #EDE9FE',
                            gap: 8,
                        }}>
                            {['TASK', 'PROJECT', 'PRIORITY', 'SKILLS NEEDED', 'EST.', 'AI RECOMMENDATION', 'ASSIGN'].map(h => (
                                <Text key={h} style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</Text>
                            ))}
                        </div>

                        {unassigned.length === 0 && (
                            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                                <CheckCircle2 size={36} color="#16A34A" style={{ marginBottom: 12 }} />
                                <Text strong style={{ fontSize: 14, color: '#1E1B4B', display: 'block' }}>All tasks assigned!</Text>
                                <Text style={{ fontSize: 13, color: '#94a3b8' }}>Great work — the team is fully loaded.</Text>
                            </div>
                        )}

                        {unassigned.map(task => {
                            const revealed = revealedTasks.has(task.id);
                            return (
                                <div key={task.id}
                                    style={{
                                        borderBottom: '1px solid #F5F3FF',
                                        background: revealed ? '#FDFCFF' : '#fff',
                                        transition: 'background 0.2s',
                                    }}
                                >
                                    {/* Main row */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '2fr 1fr 80px 1fr 60px 140px 100px',
                                        padding: '14px 20px', alignItems: 'center', gap: 8,
                                    }}>
                                        <div>
                                            <Text strong style={{ fontSize: 13, color: '#1E1B4B', display: 'block', lineHeight: 1.3 }}>{task.title}</Text>
                                        </div>
                                        <Text style={{ fontSize: 12, color: '#64748b' }}>{task.project}</Text>
                                        <div><PriorityBadge priority={task.priority} /></div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                            {task.skills.map(s => (
                                                <span key={s} style={{
                                                    background: '#F5F3FF', color: '#7C3AED',
                                                    borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 500,
                                                }}>
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                        <Text style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{task.hours}h</Text>

                                        {/* AI Suggest / Revealed */}
                                        {!revealed ? (
                                            <Button
                                                size="small"
                                                icon={<Sparkles size={12} />}
                                                onClick={() => handleAISuggest(task.id)}
                                                style={{
                                                    background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                                                    border: 'none', color: '#fff', borderRadius: 6,
                                                    fontSize: 11, fontWeight: 600, height: 28,
                                                }}
                                            >
                                                AI Suggest
                                            </Button>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Avatar initials={task.rec.avatar} size={24} glow />
                                                <div>
                                                    <Text style={{ fontSize: 11, fontWeight: 600, color: '#1E1B4B', display: 'block', lineHeight: 1.1 }}>
                                                        {task.rec.employee}
                                                    </Text>
                                                    <span style={{
                                                        background: '#DCFCE7', color: '#16A34A',
                                                        borderRadius: 4, padding: '0 5px', fontSize: 10, fontWeight: 700,
                                                    }}>
                                                        {task.rec.match}%
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Assign */}
                                        <Select
                                            placeholder="Assign..."
                                            size="small"
                                            style={{ width: 95, fontSize: 11 }}
                                            value={manualAssign[task.id]}
                                            onChange={v => setManualAssign(prev => ({ ...prev, [task.id]: v }))}
                                            options={memberOptions}
                                            onSelect={(v: string) => handleAssign(task, v)}
                                        />
                                    </div>

                                    {/* Expanded AI recommendation panel */}
                                    {revealed && (
                                        <div style={{
                                            margin: '0 20px 12px',
                                            background: '#F5F3FF', borderRadius: 8,
                                            border: '1px solid #EDE9FE', padding: '12px 16px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <Sparkles size={14} color="#7C3AED" />
                                                <div>
                                                    <Text style={{ fontSize: 12, color: '#7C3AED', fontWeight: 600 }}>
                                                        AI recommends <strong>{task.rec.employee}</strong> — {task.rec.match}% match
                                                    </Text>
                                                    <Text style={{ fontSize: 11, color: '#64748b', display: 'block' }}>{task.rec.reason}</Text>
                                                    <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                                                        {task.rec.skills.map(s => (
                                                            <span key={s} style={{
                                                                background: '#EDE9FE', color: '#7C3AED',
                                                                borderRadius: 4, padding: '1px 6px', fontSize: 10,
                                                            }}>
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                size="small"
                                                icon={<CheckCircle2 size={12} />}
                                                onClick={() => handleAssign(task, task.rec.employee)}
                                                style={{
                                                    background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                                                    border: 'none', color: '#fff', borderRadius: 6,
                                                    fontSize: 11, fontWeight: 600, flexShrink: 0,
                                                }}
                                            >
                                                Assign
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Assigned Tasks section ── */}
                    {assignedTasks.length > 0 && (
                        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #BBF7D0', overflow: 'hidden' }}>
                            <div style={{ padding: '14px 20px', borderBottom: '1px solid #DCFCE7', background: '#F0FDF4', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <CheckCircle2 size={16} color="#16A34A" />
                                <Text strong style={{ fontSize: 14, color: '#15803d' }}>
                                    Assigned Tasks ({assignedTasks.length})
                                </Text>
                            </div>
                            {assignedTasks.map(({ task, assignee }) => (
                                <div key={task.id} style={{
                                    display: 'flex', alignItems: 'center', gap: 14,
                                    padding: '12px 20px', borderBottom: '1px solid #F0FDF4',
                                }}>
                                    <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Text strong style={{ fontSize: 13, color: '#1E1B4B', display: 'block' }}>{task.title}</Text>
                                        <Text style={{ fontSize: 12, color: '#64748b' }}>{task.project}</Text>
                                    </div>
                                    <PriorityBadge priority={task.priority} />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                                        <Avatar initials={assignee.split(' ').map(n => n[0]).join('').slice(0, 2)} size={24} />
                                        <Text style={{ fontSize: 12, color: '#1E1B4B', fontWeight: 500 }}>{assignee}</Text>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── RIGHT: AI Assistant panel ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* AI Smart Assign card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1E1B4B 0%, #4C1D95 100%)',
                        borderRadius: 12, padding: 20,
                        boxShadow: '0 4px 20px rgba(124,58,237,0.25)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: 'rgba(124,58,237,0.4)', border: '1px solid rgba(167,139,250,0.5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 12px rgba(124,58,237,0.6)',
                            }}>
                                <Sparkles size={18} color="#A78BFA" />
                            </div>
                            <div>
                                <Text strong style={{ color: '#fff', fontSize: 14, display: 'block' }}>AI Smart Assign</Text>
                                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Intelligent task distribution</Text>
                            </div>
                        </div>

                        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, display: 'block', marginBottom: 14, lineHeight: 1.5 }}>
                            AI analyzes skills, workload, and availability to optimally assign all pending tasks.
                        </Text>

                        <Button
                            icon={<Zap size={14} />}
                            onClick={handleAutoAssign}
                            disabled={autoAssigning || unassigned.length === 0}
                            style={{
                                width: '100%', height: 40,
                                background: unassigned.length === 0
                                    ? 'rgba(255,255,255,0.1)'
                                    : 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                                border: 'none', color: '#fff', borderRadius: 8,
                                fontWeight: 600, fontSize: 13,
                                boxShadow: unassigned.length > 0 ? '0 0 20px rgba(124,58,237,0.5)' : undefined,
                            }}
                        >
                            {autoAssigning
                                ? 'Assigning...'
                                : autoAssignDone && unassigned.length === 0
                                    ? 'All Tasks Assigned'
                                    : 'Auto-assign All Tasks'}
                        </Button>
                    </div>

                    {/* Team Availability */}
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', overflow: 'hidden' }}>
                        <div style={{ padding: '14px 16px', borderBottom: '1px solid #EDE9FE' }}>
                            <Text strong style={{ fontSize: 14, color: '#1E1B4B' }}>Team Availability</Text>
                        </div>
                        <div style={{ padding: '8px 0' }}>
                            {teamMembers.map(m => (
                                <div key={m.id} style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '10px 16px', borderBottom: '1px solid #FAFAF9',
                                }}>
                                    <Avatar initials={m.avatar} size={32} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                                            <Text strong style={{ fontSize: 12, color: '#1E1B4B' }}>{m.name}</Text>
                                            <Text style={{ fontSize: 11, color: '#94a3b8' }}>{m.tasks} tasks</Text>
                                        </div>
                                        <CapacityBar pct={m.capacity} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Insights */}
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', overflow: 'hidden' }}>
                        <div style={{
                            padding: '14px 16px', borderBottom: '1px solid #EDE9FE',
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <Sparkles size={14} color="#7C3AED" />
                            <Text strong style={{ fontSize: 14, color: '#1E1B4B' }}>AI Insights</Text>
                        </div>
                        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {aiInsights.map((insight, i) => {
                                const Icon = insight.icon;
                                return (
                                    <div key={i} style={{
                                        display: 'flex', gap: 10,
                                        background: '#FAFAF9', borderRadius: 8,
                                        border: '1px solid #F5F3FF', padding: '10px 12px',
                                    }}>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: 8,
                                            background: `${insight.color}18`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            <Icon size={13} color={insight.color} />
                                        </div>
                                        <Text style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{insight.text}</Text>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
