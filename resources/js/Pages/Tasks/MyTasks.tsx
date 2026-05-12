import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Card, Input, Tag, Button, Segmented, Typography, Badge } from 'antd';
import { CheckCircle2, Circle, Search, ListChecks } from 'lucide-react';
import { useState } from 'react';

const { Text } = Typography;

const initialTasks = [
    { id: 1,  title: 'Design login screen mockup',    project: 'Website Redesign', priority: 'High',   status: 'In Progress', due: 'Today',  done: false },
    { id: 2,  title: 'Write unit tests for auth API', project: 'API Integration',  priority: 'Medium', status: 'Backlog',     due: 'Apr 5',  done: false },
    { id: 3,  title: 'Update user profile component', project: 'Mobile App v2',    priority: 'Low',    status: 'In Review',   due: 'Apr 8',  done: false },
    { id: 4,  title: 'Prepare sprint demo slides',    project: 'Internal',         priority: 'Medium', status: 'Backlog',     due: 'Apr 10', done: false },
    { id: 5,  title: 'Fix responsive nav on mobile',  project: 'Website Redesign', priority: 'High',   status: 'In Progress', due: 'Apr 3',  done: false },
    { id: 6,  title: 'Add pagination to tables',      project: 'CRM Dashboard',    priority: 'Low',    status: 'Backlog',     due: 'Apr 15', done: false },
    { id: 7,  title: 'Implement dark mode toggle',    project: 'Mobile App v2',    priority: 'Medium', status: 'Backlog',     due: 'Apr 20', done: false },
    { id: 8,  title: 'Code review for PR #42',        project: 'API Integration',  priority: 'High',   status: 'In Review',   due: 'Today',  done: false },
    { id: 9,  title: 'Kickoff meeting notes',         project: 'CRM Dashboard',    priority: 'Low',    status: 'Completed',   due: 'Mar 28', done: true  },
    { id: 10, title: 'Authentication flow design',    project: 'Website Redesign', priority: 'High',   status: 'Completed',   due: 'Mar 30', done: true  },
];

const priorityColor: Record<string, string> = { High: 'red', Medium: 'gold', Low: 'default' };
const statusColor: Record<string, string>   = { 'In Progress': 'blue', 'In Review': 'gold', 'Backlog': 'default', 'Completed': 'green' };

const columns = [
    { key: 'Backlog',     label: 'Backlog',     color: '#F1F5F9', textColor: '#64748B', borderColor: '#E2E8F0' },
    { key: 'In Progress', label: 'In Progress', color: '#DBEAFE', textColor: '#1D4ED8', borderColor: '#BFDBFE' },
    { key: 'In Review',   label: 'In Review',   color: '#FEF3C7', textColor: '#92400E', borderColor: '#FDE68A' },
    { key: 'Completed',   label: 'Completed',   color: '#DCFCE7', textColor: '#14532D', borderColor: '#BBF7D0' },
];

const priorityDot: Record<string, string> = { High: '#f87171', Medium: '#fbbf24', Low: '#CBD5E1' };

const filters = ['All', 'In Progress', 'In Review', 'Backlog', 'Completed'];

export default function MyTasks() {
    const [tasks, setTasks]   = useState(initialTasks);
    const [view, setView]     = useState<'list' | 'kanban'>('list');
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    const toggleDone = (id: number) =>
        setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done, status: !t.done ? 'Completed' : 'In Progress' } : t));

    const moveTask = (id: number, newStatus: string) =>
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus, done: newStatus === 'Completed' } : t));

    const filtered = tasks.filter(t =>
        (filter === 'All' || t.status === filter) &&
        t.title.toLowerCase().includes(search.toLowerCase())
    );

    const open      = filtered.filter(t => !t.done);
    const completed = filtered.filter(t => t.done);
    const doneCount = tasks.filter(t => t.done).length;

    return (
        <AppLayout title="My Tasks">
            <Head title="My Tasks" />

            {/* Hero banner */}
            <div style={{ position: 'relative', marginBottom: 24, overflow: 'hidden', borderRadius: 16, background: '#1E3A5F', padding: '32px 28px' }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 208, height: 208, borderRadius: '50%', background: '#1E4D8C', opacity: 0.4, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -32, left: -32, width: 144, height: 144, borderRadius: '50%', background: '#2563EB', opacity: 0.2, pointerEvents: 'none' }} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <ListChecks size={22} color="#0EA5E9" />
                        </div>
                        <div>
                            <Text style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0EA5E9', display: 'block', marginBottom: 2 }}>Employee</Text>
                            <Text style={{ fontSize: 22, fontWeight: 700, color: '#fff', display: 'block' }}>My Tasks</Text>
                            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{open.length} open · {doneCount} completed</Text>
                        </div>
                    </div>
                    <div style={{ display: 'none', alignItems: 'center', gap: 24 }} className="lg:!flex">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{tasks.filter(t => t.due === 'Today').length}</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Due Today</div>
                        </div>
                        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }} />
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#4ade80' }}>{doneCount}</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Done</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Input
                        prefix={<Search size={14} style={{ color: '#94a3b8' }} />}
                        placeholder="Search tasks..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: 240, borderRadius: 8 }}
                    />
                    <Segmented
                        value={view}
                        onChange={v => setView(v as 'list' | 'kanban')}
                        options={[
                            { value: 'list',   label: 'List'  },
                            { value: 'kanban', label: 'Board' },
                        ]}
                    />
                </div>

                {view === 'list' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {filters.map(f => (
                            <Button
                                key={f}
                                size="small"
                                type={filter === f ? 'primary' : 'default'}
                                onClick={() => setFilter(f)}
                                style={{ borderRadius: 20, fontSize: 12, ...(filter === f ? { background: '#2563EB' } : {}) }}
                            >
                                {f}
                            </Button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── LIST VIEW ── */}
            {view === 'list' && (
                <Card style={{ borderRadius: 12, border: '1px solid #E2E8F0' }} styles={{ body: { padding: 0 } }}>
                    <div style={{ padding: '12px 20px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                        <Text style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
                            Open ({open.length})
                        </Text>
                    </div>

                    {open.map(task => (
                        <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px', borderBottom: '1px solid #F1F5F9' }}
                            className="hover:bg-slate-50 transition-colors"
                        >
                            <button onClick={() => toggleDone(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1', padding: 0, flexShrink: 0 }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#22c55e')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#CBD5E1')}
                            >
                                <Circle size={20} />
                            </button>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <Text strong style={{ fontSize: 14, color: '#1e293b', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>{task.project}</Text>
                            </div>
                            <Tag color={statusColor[task.status]} style={{ borderRadius: 12, fontSize: 11 }}>{task.status}</Tag>
                            <Tag color={priorityColor[task.priority]} style={{ borderRadius: 12, fontSize: 11 }}>{task.priority}</Tag>
                            <Text style={{ fontSize: 12, fontWeight: task.due === 'Today' ? 600 : 400, color: task.due === 'Today' ? '#ef4444' : '#94a3b8', flexShrink: 0 }}>{task.due}</Text>
                        </div>
                    ))}

                    {open.length === 0 && (
                        <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                            <CheckCircle2 size={32} color="#4ade80" style={{ marginBottom: 12 }} />
                            <Text type="secondary" style={{ fontSize: 14 }}>All caught up! No open tasks.</Text>
                        </div>
                    )}

                    {completed.length > 0 && (
                        <>
                            <div style={{ padding: '12px 20px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
                                <Text style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
                                    Completed ({completed.length})
                                </Text>
                            </div>
                            {completed.map(task => (
                                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px', borderBottom: '1px solid #F1F5F9', opacity: 0.6 }}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <button onClick={() => toggleDone(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e', padding: 0, flexShrink: 0 }}>
                                        <CheckCircle2 size={20} />
                                    </button>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Text style={{ fontSize: 14, color: '#64748b', textDecoration: 'line-through', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>{task.project}</Text>
                                    </div>
                                    <Text type="secondary" style={{ fontSize: 12, flexShrink: 0 }}>{task.due}</Text>
                                </div>
                            ))}
                        </>
                    )}
                </Card>
            )}

            {/* ── KANBAN VIEW ── */}
            {view === 'kanban' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                    {columns.map(col => {
                        const colTasks = tasks.filter(t =>
                            t.status === col.key &&
                            t.title.toLowerCase().includes(search.toLowerCase())
                        );
                        return (
                            <div key={col.key} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {/* Column header */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 10, border: `1px solid ${col.borderColor}`, padding: '8px 12px' }}>
                                    <span style={{ background: col.color, color: col.textColor, borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{col.label}</span>
                                    <Text type="secondary" style={{ fontSize: 12 }}>{colTasks.length}</Text>
                                </div>

                                {/* Cards */}
                                {colTasks.map(task => (
                                    <Card key={task.id} style={{ borderRadius: 12, border: '1px solid #E2E8F0' }} styles={{ body: { padding: 16 }}}
                                        className="hover:shadow-md transition-shadow"
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: priorityDot[task.priority], flexShrink: 0 }} />
                                            <Text type="secondary" style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.project}</Text>
                                        </div>

                                        <Text style={{ fontSize: 13, fontWeight: 500, color: task.done ? '#94a3b8' : '#1e293b', textDecoration: task.done ? 'line-through' : 'none', lineHeight: 1.4, display: 'block', marginBottom: 12 }}>
                                            {task.title}
                                        </Text>

                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 12, color: task.due === 'Today' ? '#ef4444' : '#94a3b8', fontWeight: task.due === 'Today' ? 600 : 400 }}>
                                                {task.due}
                                            </Text>
                                            <Tag color={priorityColor[task.priority]} style={{ borderRadius: 12, fontSize: 11, margin: 0 }}>{task.priority}</Tag>
                                        </div>

                                        {/* Move actions */}
                                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #F1F5F9', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                            {col.key !== 'Completed'
                                                ? columns.filter(c => c.key !== col.key).map(c => (
                                                    <Button key={c.key} size="small" onClick={() => moveTask(task.id, c.key)}
                                                        style={{ borderRadius: 6, fontSize: 11, height: 22, padding: '0 8px' }}>
                                                        → {c.label}
                                                    </Button>
                                                ))
                                                : (
                                                    <Button size="small" onClick={() => moveTask(task.id, 'In Progress')}
                                                        style={{ borderRadius: 6, fontSize: 11, height: 22, padding: '0 8px' }}>
                                                        ↩ Reopen
                                                    </Button>
                                                )
                                            }
                                        </div>
                                    </Card>
                                ))}

                                {colTasks.length === 0 && (
                                    <div style={{ borderRadius: 12, border: '2px dashed #E2E8F0', padding: '32px 20px', textAlign: 'center' }}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>No tasks</Text>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </AppLayout>
    );
}
