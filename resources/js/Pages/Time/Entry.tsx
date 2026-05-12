import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Card, Select, Button, Tag, Typography, Row, Col, Input, Alert, Segmented } from 'antd';
import { Clock, Play, Square, RotateCcw, Plus, Trash2, Timer, PenLine } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const { Text } = Typography;

const projects = ['Website Redesign', 'Mobile App v2', 'API Integration', 'CRM Dashboard', 'Internal'];
const tasksByProject: Record<string, string[]> = {
    'Website Redesign': ['Design login screen', 'Responsive nav', 'Homepage hero', 'Fix mobile bugs'],
    'Mobile App v2':    ['App icon design', 'Update profile component', 'Dark mode toggle'],
    'API Integration':  ['Write unit tests', 'Code review PR #42', 'Endpoint documentation'],
    'CRM Dashboard':    ['Database schema', 'API endpoints', 'Add pagination'],
    'Internal':         ['Sprint demo slides', 'Team standup', 'Documentation'],
};

interface LogEntry {
    id: number;
    date: string;
    project: string;
    task: string;
    hours: number;
    status: 'Pending' | 'Approved';
}

const initialLogs: LogEntry[] = [
    { id: 1, date: 'Mon Apr 7', project: 'Website Redesign', task: 'Design login screen',      hours: 3.5, status: 'Pending'  },
    { id: 2, date: 'Mon Apr 7', project: 'API Integration',  task: 'Code review PR #42',       hours: 2.0, status: 'Pending'  },
    { id: 3, date: 'Fri Apr 4', project: 'Mobile App v2',    task: 'Update profile component',  hours: 5.0, status: 'Approved' },
    { id: 4, date: 'Thu Apr 3', project: 'Website Redesign', task: 'Responsive nav',            hours: 4.0, status: 'Approved' },
    { id: 5, date: 'Wed Apr 2', project: 'CRM Dashboard',    task: 'Database schema',           hours: 6.5, status: 'Approved' },
];

function fmt(secs: number) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function secsToHours(secs: number) { return Math.round((secs / 3600) * 100) / 100; }

function todayLabel() {
    return new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function TimeEntry() {
    const [mode, setMode]       = useState<'timer' | 'manual'>('timer');
    const [project, setProject] = useState<string | undefined>(undefined);
    const [task, setTask]       = useState<string | undefined>(undefined);
    const [note, setNote]       = useState('');
    const [logs, setLogs]       = useState<LogEntry[]>(initialLogs);
    const [nextId, setNextId]   = useState(100);
    const [justSaved, setJustSaved] = useState(false);

    // Timer
    const [elapsed, setElapsed] = useState(0);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Manual
    const [manStart, setManStart] = useState('');
    const [manEnd, setManEnd]     = useState('');
    const [manDate, setManDate]   = useState(new Date().toISOString().slice(0, 10));

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [running]);

    const canAct = !!project && !!task;

    const handleStart = () => { if (!canAct) return; setJustSaved(false); setRunning(true); };

    const handleStop = () => {
        setRunning(false);
        if (elapsed < 30) return;
        addEntry(secsToHours(elapsed), todayLabel());
        setElapsed(0);
    };

    const handleReset = () => { setRunning(false); setElapsed(0); setJustSaved(false); };

    const handleManualSubmit = () => {
        if (!canAct || !manStart || !manEnd) return;
        const [sh, sm] = manStart.split(':').map(Number);
        const [eh, em] = manEnd.split(':').map(Number);
        const totalMins = (eh * 60 + em) - (sh * 60 + sm);
        if (totalMins <= 0) return;
        const d = new Date(manDate);
        const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        addEntry(Math.round((totalMins / 60) * 100) / 100, label);
        setManStart(''); setManEnd('');
    };

    const addEntry = (hours: number, dateLabel: string) => {
        setLogs(prev => [{ id: nextId, date: dateLabel, project: project!, task: task!, hours, status: 'Pending' }, ...prev]);
        setNextId(n => n + 1);
        setNote('');
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 3000);
    };

    const deleteLog = (id: number) => setLogs(prev => prev.filter(l => l.id !== id));
    const totalToday = logs.filter(l => l.date === todayLabel()).reduce((s, l) => s + l.hours, 0);

    const timerBorderColor = running ? '#2563EB' : elapsed > 0 ? '#F59E0B' : '#E2E8F0';
    const clockColor = running ? '#2563EB' : elapsed > 0 ? '#F59E0B' : '#CBD5E1';

    const manualDuration = (() => {
        if (!manStart || !manEnd) return null;
        const [sh, sm] = manStart.split(':').map(Number);
        const [eh, em] = manEnd.split(':').map(Number);
        const mins = (eh * 60 + em) - (sh * 60 + sm);
        if (mins <= 0) return null;
        const h = Math.floor(mins / 60), m = mins % 60;
        return `${h > 0 ? `${h}h ` : ''}${m > 0 ? `${m}m` : ''}`.trim();
    })();

    return (
        <AppLayout title="Time Entry">
            <Head title="Time Entry" />

            {/* Hero */}
            <div style={{ position: 'relative', marginBottom: 24, overflow: 'hidden', borderRadius: 16, background: '#1E3A5F', padding: '32px 28px' }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 208, height: 208, borderRadius: '50%', background: '#1E4D8C', opacity: 0.4, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -32, left: -32, width: 144, height: 144, borderRadius: '50%', background: '#2563EB', opacity: 0.2, pointerEvents: 'none' }} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: running ? '#2563EB' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.3s' }}>
                            <Clock size={22} color="#0EA5E9" />
                        </div>
                        <div>
                            <Text style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0EA5E9', display: 'block', marginBottom: 2 }}>Employee</Text>
                            <Text style={{ fontSize: 22, fontWeight: 700, color: '#fff', display: 'block' }}>Time Tracker</Text>
                            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                                {running ? `Tracking — ${project} · ${task} · ${fmt(elapsed)}` : 'Track time with the timer or log it manually'}
                            </Text>
                        </div>
                    </div>
                    <div style={{ display: 'none', alignItems: 'center', gap: 24 }} className="lg:!flex">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{totalToday.toFixed(1)}h</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Logged Today</div>
                        </div>
                        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }} />
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#fbbf24' }}>{logs.filter(l => l.status === 'Pending').length}</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Pending</div>
                        </div>
                    </div>
                </div>
            </div>

            <Row gutter={[24, 24]}>
                {/* Left column */}
                <Col xs={24} lg={10}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Mode toggle */}
                        <Segmented
                            block
                            value={mode}
                            disabled={running}
                            onChange={v => setMode(v as 'timer' | 'manual')}
                            options={[
                                { value: 'timer',  label: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Timer size={14} /> Timer</span> },
                                { value: 'manual', label: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><PenLine size={14} /> Manual</span> },
                            ]}
                            style={{ borderRadius: 10 }}
                        />

                        {/* Project + Task */}
                        <Card style={{ borderRadius: 16, border: '1px solid #E2E8F0' }}>
                            <Text strong style={{ fontSize: 13, color: '#374151', display: 'block', marginBottom: 12 }}>What are you working on?</Text>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <Select
                                    placeholder="Select project…"
                                    value={project}
                                    onChange={v => { setProject(v); setTask(undefined); }}
                                    disabled={running}
                                    style={{ width: '100%' }}
                                    options={projects.map(p => ({ label: p, value: p }))}
                                    size="large"
                                />
                                <Select
                                    placeholder="Select task…"
                                    value={task}
                                    onChange={setTask}
                                    disabled={!project || running}
                                    style={{ width: '100%' }}
                                    options={(tasksByProject[project ?? ''] ?? []).map(t => ({ label: t, value: t }))}
                                    size="large"
                                />
                                <Input.TextArea
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    disabled={running}
                                    rows={2}
                                    placeholder="Optional note…"
                                    style={{ borderRadius: 8, resize: 'none' }}
                                />
                            </div>
                        </Card>

                        {/* Timer mode */}
                        {mode === 'timer' && (
                            <Card style={{ borderRadius: 16, border: `2px solid ${timerBorderColor}`, transition: 'border-color 0.3s' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                                    <Text strong style={{ color: '#374151' }}>Timer</Text>
                                    {running && (
                                        <Tag color="green" style={{ borderRadius: 12 }}>Running</Tag>
                                    )}
                                    {!running && elapsed > 0 && (
                                        <Tag color="gold" style={{ borderRadius: 12 }}>Paused</Tag>
                                    )}
                                </div>

                                {/* Clock face */}
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, padding: '16px 0' }}>
                                    <div style={{ width: 160, height: 160, borderRadius: '50%', border: `4px solid ${timerBorderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', transition: 'border-color 0.3s' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 24, fontWeight: 700, color: clockColor, letterSpacing: '-1px', transition: 'color 0.3s' }}>
                                                {fmt(elapsed)}
                                            </div>
                                            <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>
                                                {running ? 'elapsed' : 'hh:mm:ss'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {!canAct && !running && (
                                    <Text type="secondary" style={{ fontSize: 12, display: 'block', textAlign: 'center', marginBottom: 12 }}>
                                        Select a project and task above to start
                                    </Text>
                                )}

                                <div style={{ display: 'flex', gap: 8 }}>
                                    {!running ? (
                                        <Button
                                            type="primary"
                                            disabled={!canAct}
                                            onClick={handleStart}
                                            icon={<Play size={15} fill="currentColor" />}
                                            size="large"
                                            block
                                            style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)', border: 'none', borderRadius: 10, fontWeight: 600, color: '#fff' }}
                                        >
                                            {elapsed > 0 ? 'Resume' : 'Start Timer'}
                                        </Button>
                                    ) : (
                                        <Button
                                            danger
                                            type="primary"
                                            onClick={handleStop}
                                            icon={<Square size={14} fill="currentColor" />}
                                            size="large"
                                            block
                                            style={{ background: 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)', border: 'none', borderRadius: 10, fontWeight: 600, color: '#fff' }}
                                        >
                                            Stop & Log Time
                                        </Button>
                                    )}
                                    {(elapsed > 0 || running) && (
                                        <Button
                                            onClick={handleReset}
                                            title="Reset"
                                            size="large"
                                            style={{ borderRadius: 10, flexShrink: 0, width: 44, padding: 0 }}
                                            icon={<RotateCcw size={15} />}
                                        />
                                    )}
                                </div>

                                {justSaved && (
                                    <Alert message="Time logged successfully!" type="success" showIcon style={{ borderRadius: 8, marginTop: 12 }} />
                                )}
                            </Card>
                        )}

                        {/* Manual mode */}
                        {mode === 'manual' && (
                            <Card style={{ borderRadius: 16, border: '1px solid #E2E8F0' }}>
                                <Text strong style={{ fontSize: 13, color: '#374151', display: 'block', marginBottom: 16 }}>Log Time Manually</Text>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>Date</Text>
                                        <input type="date" value={manDate} onChange={e => setManDate(e.target.value)}
                                            style={{ width: '100%', borderRadius: 8, border: '1px solid #E2E8F0', padding: '9px 12px', fontSize: 14, color: '#374151', outline: 'none' }} />
                                    </div>

                                    <Row gutter={12}>
                                        <Col span={12}>
                                            <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>Start Time</Text>
                                            <input type="time" value={manStart} onChange={e => setManStart(e.target.value)}
                                                style={{ width: '100%', borderRadius: 8, border: '1px solid #E2E8F0', padding: '9px 12px', fontSize: 14, color: '#374151', outline: 'none' }} />
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>End Time</Text>
                                            <input type="time" value={manEnd} onChange={e => setManEnd(e.target.value)}
                                                style={{ width: '100%', borderRadius: 8, border: '1px solid #E2E8F0', padding: '9px 12px', fontSize: 14, color: '#374151', outline: 'none' }} />
                                        </Col>
                                    </Row>

                                    {manStart && manEnd && !manualDuration && (
                                        <Text style={{ fontSize: 12, color: '#ef4444' }}>End time must be after start time</Text>
                                    )}
                                    {manualDuration && (
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            Duration: <Text strong style={{ color: '#374151' }}>{manualDuration}</Text>
                                        </Text>
                                    )}

                                    <Button
                                        type="primary"
                                        block
                                        size="large"
                                        disabled={!canAct || !manStart || !manEnd || !manualDuration}
                                        onClick={handleManualSubmit}
                                        icon={<Plus size={15} />}
                                        style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)', border: 'none', borderRadius: 10, fontWeight: 600, color: '#fff' }}
                                    >
                                        Log Time
                                    </Button>

                                    {justSaved && (
                                        <Alert message="Time logged successfully!" type="success" showIcon style={{ borderRadius: 8 }} />
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>
                </Col>

                {/* Right: Time Logs */}
                <Col xs={24} lg={14}>
                    <Card
                        style={{ borderRadius: 16, border: '1px solid #E2E8F0' }}
                        styles={{ body: { padding: 0 } }}
                        title={<span style={{ fontWeight: 600, color: '#374151' }}>Time Logs</span>}
                        extra={<Text type="secondary" style={{ fontSize: 12 }}>{logs.length} entries</Text>}
                    >
                        {logs.length === 0 ? (
                            <div style={{ padding: '64px 20px', textAlign: 'center' }}>
                                <Clock size={28} color="#CBD5E1" style={{ marginBottom: 12 }} />
                                <Text type="secondary" style={{ fontSize: 14 }}>No time logged yet</Text>
                            </div>
                        ) : (
                            logs.map(log => (
                                <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: '1px solid #F1F5F9' }}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Clock size={15} color="#64748b" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Text strong style={{ fontSize: 14, color: '#1e293b', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.task}</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>{log.project} · {log.date}</Text>
                                    </div>
                                    <Text strong style={{ fontSize: 14, color: '#1e293b', flexShrink: 0 }}>{log.hours}h</Text>
                                    <Tag color={log.status === 'Approved' ? 'green' : 'gold'} style={{ borderRadius: 12, fontSize: 11, flexShrink: 0 }}>{log.status}</Tag>
                                    {log.status === 'Pending' && (
                                        <Button
                                            type="text"
                                            icon={<Trash2 size={15} />}
                                            onClick={() => deleteLog(log.id)}
                                            style={{ color: '#CBD5E1', flexShrink: 0 }}
                                            className="hover:!text-red-500"
                                        />
                                    )}
                                </div>
                            ))
                        )}
                    </Card>
                </Col>
            </Row>
        </AppLayout>
    );
}
