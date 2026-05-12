import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage } from '@inertiajs/react';
import { Table, Tag, Typography, Progress } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    Clock, LogIn, LogOut, Coffee, Calendar,
    TrendingUp, Timer, MapPin, CheckCircle, AlertCircle, User,
    Users, Search, Filter,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { PageProps } from '@/types';

const { Text } = Typography;

const P_DARK   = '#1E1B4B';
const P_MID    = '#7C3AED';
const P_ACCENT = '#C4B5FD';

const card: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #EDE9FE',
    borderRadius: 14,
    boxShadow: '0 1px 4px rgba(124,58,237,0.07)',
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function nowLabel()  { return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
function dateLabel() { return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); }
function fmtTime(d: Date) { return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); }
function fmtElapsed(secs: number) {
    const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function secsToLabel(secs: number) {
    if (secs < 60) return `${secs}s`;
    const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ── Shared data types ─────────────────────────────────────────────────────────
interface AttendanceRecord {
    key: number;
    date: string;
    day: string;
    clockIn: string;
    clockOut: string;
    totalHrs: string;
    breakTime: string;
    status: 'Present' | 'Late' | 'Half Day' | 'Absent';
    location: 'Office' | 'Remote';
}

const statusCfg: Record<string, { color: string; bg: string }> = {
    Present:    { color: '#16A34A', bg: '#DCFCE7' },
    Late:       { color: '#D97706', bg: '#FEF3C7' },
    'Half Day': { color: '#7C3AED', bg: '#EDE9FE' },
    Absent:     { color: '#DC2626', bg: '#FEE2E2' },
};

const TARGET = 8 * 3600;

// ── My history (employee view) ────────────────────────────────────────────────
const mockHistory: AttendanceRecord[] = [
    { key: 1, date: 'May 10, 2026', day: 'Friday',    clockIn: '08:45 AM', clockOut: '05:55 PM', totalHrs: '9h 10m', breakTime: '45m', status: 'Present',  location: 'Office'  },
    { key: 2, date: 'May 9, 2026',  day: 'Thursday',  clockIn: '09:00 AM', clockOut: '01:30 PM', totalHrs: '4h 30m', breakTime: '0m',  status: 'Half Day', location: 'Remote'  },
    { key: 3, date: 'May 8, 2026',  day: 'Wednesday', clockIn: '08:55 AM', clockOut: '06:10 PM', totalHrs: '9h 15m', breakTime: '1h',  status: 'Present',  location: 'Office'  },
    { key: 4, date: 'May 7, 2026',  day: 'Tuesday',   clockIn: '09:14 AM', clockOut: '05:45 PM', totalHrs: '8h 31m', breakTime: '30m', status: 'Late',     location: 'Remote'  },
    { key: 5, date: 'May 6, 2026',  day: 'Monday',    clockIn: '08:58 AM', clockOut: '06:02 PM', totalHrs: '9h 4m',  breakTime: '1h',  status: 'Present',  location: 'Office'  },
    { key: 6, date: 'May 5, 2026',  day: 'Friday',    clockIn: '09:00 AM', clockOut: '06:00 PM', totalHrs: '9h 0m',  breakTime: '1h',  status: 'Present',  location: 'Office'  },
    { key: 7, date: 'May 4, 2026',  day: 'Thursday',  clockIn: '--',       clockOut: '--',        totalHrs: '--',     breakTime: '--',  status: 'Absent',   location: 'Office'  },
    { key: 8, date: 'May 3, 2026',  day: 'Wednesday', clockIn: '08:50 AM', clockOut: '05:50 PM', totalHrs: '9h 0m',  breakTime: '1h',  status: 'Present',  location: 'Remote'  },
    { key: 9, date: 'May 2, 2026',  day: 'Tuesday',   clockIn: '09:20 AM', clockOut: '06:00 PM', totalHrs: '8h 40m', breakTime: '1h',  status: 'Late',     location: 'Office'  },
    { key: 10,date: 'May 1, 2026',  day: 'Monday',    clockIn: '08:50 AM', clockOut: '05:45 PM', totalHrs: '8h 55m', breakTime: '1h',  status: 'Present',  location: 'Office'  },
];

// ── Manager: all-employee attendance data ─────────────────────────────────────
interface EmployeeAttendance {
    key: number;
    name: string;
    avatar: string;
    department: string;
    clockIn: string;
    clockOut: string;
    totalHrs: string;
    breakTime: string;
    status: 'Present' | 'Late' | 'Half Day' | 'Absent' | 'Clocked In';
    location: 'Office' | 'Remote';
    date: string;
}

const mockEmployeeAttendance: EmployeeAttendance[] = [
    { key: 1,  name: 'Hamza Ahmed',    avatar: 'HA', department: 'Engineering',  clockIn: '08:42 AM', clockOut: '--',       totalHrs: '2h 10m', breakTime: '0m',  status: 'Clocked In', location: 'Office',  date: 'May 11, 2026' },
    { key: 2,  name: 'Dev Ahmad',      avatar: 'DA', department: 'Design',        clockIn: '09:01 AM', clockOut: '--',       totalHrs: '1h 52m', breakTime: '15m', status: 'Clocked In', location: 'Remote',  date: 'May 11, 2026' },
    { key: 3,  name: 'Sara Rahman',    avatar: 'SR', department: 'QA',            clockIn: '09:15 AM', clockOut: '--',       totalHrs: '1h 38m', breakTime: '0m',  status: 'Late',       location: 'Office',  date: 'May 11, 2026' },
    { key: 4,  name: 'Ali Hassan',     avatar: 'AH', department: 'Engineering',  clockIn: '--',       clockOut: '--',       totalHrs: '--',     breakTime: '--',  status: 'Absent',     location: 'Office',  date: 'May 11, 2026' },
    { key: 5,  name: 'Nadia Khan',     avatar: 'NK', department: 'Marketing',     clockIn: '08:55 AM', clockOut: '01:00 PM', totalHrs: '4h 5m',  breakTime: '0m',  status: 'Half Day',   location: 'Remote',  date: 'May 11, 2026' },
    { key: 6,  name: 'Usman Tariq',    avatar: 'UT', department: 'Sales',         clockIn: '08:50 AM', clockOut: '--',       totalHrs: '2h 3m',  breakTime: '30m', status: 'Clocked In', location: 'Office',  date: 'May 11, 2026' },
    { key: 7,  name: 'Fatima Sheikh',  avatar: 'FS', department: 'HR',            clockIn: '08:30 AM', clockOut: '--',       totalHrs: '2h 23m', breakTime: '0m',  status: 'Clocked In', location: 'Office',  date: 'May 11, 2026' },
    { key: 8,  name: 'Bilal Mehmood',  avatar: 'BM', department: 'Engineering',  clockIn: '--',       clockOut: '--',       totalHrs: '--',     breakTime: '--',  status: 'Absent',     location: 'Office',  date: 'May 11, 2026' },
    { key: 9,  name: 'Zara Ahmed',     avatar: 'ZA', department: 'Design',        clockIn: '09:08 AM', clockOut: '--',       totalHrs: '1h 45m', breakTime: '0m',  status: 'Late',       location: 'Remote',  date: 'May 11, 2026' },
    { key: 10, name: 'Omar Siddiqui',  avatar: 'OS', department: 'Finance',       clockIn: '08:58 AM', clockOut: '--',       totalHrs: '1h 55m', breakTime: '15m', status: 'Clocked In', location: 'Office',  date: 'May 11, 2026' },
];

const empStatusCfg: Record<string, { color: string; bg: string }> = {
    ...statusCfg,
    'Clocked In': { color: '#0284C7', bg: '#E0F2FE' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MANAGER VIEW — employee attendance overview
// ═══════════════════════════════════════════════════════════════════════════════
function ManagerAttendanceView({ liveTime }: { liveTime: string }) {
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const departments = ['All', ...Array.from(new Set(mockEmployeeAttendance.map(e => e.department))).sort()];
    const statuses    = ['All', 'Clocked In', 'Late', 'Half Day', 'Absent'];

    const filtered = mockEmployeeAttendance.filter(e => {
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase());
        const matchDept   = deptFilter === 'All' || e.department === deptFilter;
        const matchStatus = statusFilter === 'All' || e.status === statusFilter;
        return matchSearch && matchDept && matchStatus;
    });

    const clockedIn  = mockEmployeeAttendance.filter(e => e.status === 'Clocked In').length;
    const late        = mockEmployeeAttendance.filter(e => e.status === 'Late').length;
    const halfDay     = mockEmployeeAttendance.filter(e => e.status === 'Half Day').length;
    const absent      = mockEmployeeAttendance.filter(e => e.status === 'Absent').length;
    const total       = mockEmployeeAttendance.length;

    const columns: ColumnsType<EmployeeAttendance> = [
        {
            title: 'Employee', key: 'employee', width: 200,
            render: (_, r) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${P_DARK}, ${P_MID})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{r.avatar}</span>
                    </div>
                    <div>
                        <Text strong style={{ fontSize: 13, color: P_DARK, display: 'block' }}>{r.name}</Text>
                        <Text style={{ fontSize: 11, color: '#94a3b8' }}>{r.department}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Date', dataIndex: 'date', key: 'date', width: 130,
            render: v => <Text style={{ fontSize: 12, color: '#64748b' }}>{v}</Text>,
        },
        {
            title: 'Clock In', dataIndex: 'clockIn', key: 'clockIn', width: 120,
            render: v => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <LogIn size={13} color={v === '--' ? '#cbd5e1' : '#16A34A'} />
                    <Text strong style={{ fontSize: 13, color: v === '--' ? '#cbd5e1' : '#374151' }}>{v}</Text>
                </div>
            ),
        },
        {
            title: 'Clock Out', dataIndex: 'clockOut', key: 'clockOut', width: 120,
            render: v => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <LogOut size={13} color={v === '--' ? '#cbd5e1' : '#DC2626'} />
                    <Text style={{ fontSize: 13, color: v === '--' ? '#cbd5e1' : '#374151' }}>{v === '--' ? 'Active' : v}</Text>
                </div>
            ),
        },
        {
            title: 'Work Time', dataIndex: 'totalHrs', key: 'totalHrs', width: 110,
            render: v => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Timer size={13} color={v === '--' ? '#cbd5e1' : P_MID} />
                    <Text strong style={{ fontSize: 13, color: v === '--' ? '#cbd5e1' : P_DARK }}>{v}</Text>
                </div>
            ),
        },
        {
            title: 'Break', dataIndex: 'breakTime', key: 'breakTime', width: 80,
            render: v => <Text style={{ fontSize: 13, color: v === '--' ? '#cbd5e1' : '#64748b' }}>{v}</Text>,
        },
        {
            title: 'Location', dataIndex: 'location', key: 'location', width: 110,
            render: v => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={12} color="#94a3b8" />
                    <Text style={{ fontSize: 12, color: '#64748b' }}>{v}</Text>
                </div>
            ),
        },
        {
            title: 'Status', dataIndex: 'status', key: 'status', width: 120,
            render: (s: string) => {
                const c = empStatusCfg[s] ?? { color: '#94a3b8', bg: '#f1f5f9' };
                return (
                    <Tag style={{ borderRadius: 20, padding: '2px 12px', fontSize: 12, fontWeight: 600, color: c.color, background: c.bg, border: 'none' }}>
                        {s}
                    </Tag>
                );
            },
        },
    ];

    return (
        <>
            {/* Hero */}
            <div style={{
                position: 'relative', marginBottom: 20, overflow: 'hidden', borderRadius: 16,
                background: `linear-gradient(135deg, ${P_DARK} 0%, #312E81 55%, ${P_MID} 100%)`,
                padding: '26px 28px',
            }}>
                <div style={{ position:'absolute', top:-50, right:-50, width:210, height:210, borderRadius:'50%', background:'#4C1D95', opacity:0.3, pointerEvents:'none' }} />
                <div style={{ position:'absolute', bottom:-40, left:-40, width:150, height:150, borderRadius:'50%', background:P_MID, opacity:0.18, pointerEvents:'none' }} />
                <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                        <div style={{ width:48, height:48, borderRadius:13, background:'rgba(167,139,250,0.18)', border:'1px solid rgba(167,139,250,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <Users size={22} color={P_ACCENT} />
                        </div>
                        <div>
                            <Text style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:P_ACCENT, display:'block', marginBottom:2 }}>Attendance</Text>
                            <Text style={{ fontSize:21, fontWeight:800, color:'#fff', display:'block', lineHeight:1.1 }}>Employee Attendance</Text>
                            <Text style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginTop:3, display:'block' }}>{dateLabel()}</Text>
                        </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                        <div style={{ fontFamily:'monospace', fontSize:32, fontWeight:800, color:'#fff', letterSpacing:'-1px' }}>{liveTime}</div>
                        <Text style={{ fontSize:12, color:'rgba(255,255,255,0.5)', display:'block', marginTop:2 }}>Live overview · {total} employees</Text>
                    </div>
                </div>
            </div>

            {/* Summary stat cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:20 }} className="tp-stats-grid">
                {[
                    { label:'Total Employees', value: total,    icon: Users,        color:'#7C3AED', bg:'#EDE9FE' },
                    { label:'Clocked In',      value: clockedIn, icon: CheckCircle,  color:'#0284C7', bg:'#E0F2FE' },
                    { label:'Late Arrivals',   value: late,      icon: AlertCircle,  color:'#D97706', bg:'#FEF3C7' },
                    { label:'Half Day',        value: halfDay,   icon: Clock,        color:'#7C3AED', bg:'#EDE9FE' },
                    { label:'Absent',          value: absent,    icon: User,         color:'#DC2626', bg:'#FEE2E2' },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} style={{ ...card, padding:'18px 20px' }}>
                        <div style={{ width:34, height:34, borderRadius:9, background:bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
                            <Icon size={16} color={color} />
                        </div>
                        <div style={{ fontSize:26, fontWeight:800, color:P_DARK, lineHeight:1 }}>{value}</div>
                        <div style={{ fontSize:12, color:'#94a3b8', marginTop:5 }}>{label}</div>
                    </div>
                ))}
            </div>

            {/* Attendance rate bar */}
            <div style={{ ...card, padding:'18px 22px', marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                    <Text strong style={{ color: P_DARK, fontSize: 14 }}>Today's Attendance Rate</Text>
                    <Text strong style={{ color: P_MID, fontSize: 16 }}>{Math.round(((clockedIn + late + halfDay) / total) * 100)}%</Text>
                </div>
                <div style={{ height: 10, borderRadius: 6, background: '#F1F5F9', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', height: '100%' }}>
                        <div style={{ width: `${(clockedIn / total) * 100}%`, background: '#0284C7', transition: 'width 0.4s' }} />
                        <div style={{ width: `${(late / total) * 100}%`, background: '#F59E0B', transition: 'width 0.4s' }} />
                        <div style={{ width: `${(halfDay / total) * 100}%`, background: P_MID, transition: 'width 0.4s' }} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                    {[['#0284C7','Clocked In',clockedIn],['#F59E0B','Late',late],[P_MID,'Half Day',halfDay],['#DC2626','Absent',absent]] .map(([color, label, count]) => (
                        <div key={String(label)} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: String(color) }} />
                            <Text style={{ fontSize: 11, color: '#64748b' }}>{label}: <strong>{count}</strong></Text>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters + table */}
            <div style={{ ...card, borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #EDE9FE', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:32, height:32, borderRadius:9, background:'#EDE9FE', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Calendar size={15} color={P_MID} />
                        </div>
                        <Text strong style={{ fontSize: 15, color: P_DARK }}>Attendance Log</Text>
                    </div>

                    {/* Search */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '6px 12px', width: 220 }}>
                        <Search size={13} color="#94a3b8" />
                        <input
                            value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search employee..."
                            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#374151', width: '100%' }}
                        />
                    </div>

                    {/* Dept filter */}
                    <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
                        style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '6px 12px', fontSize: 13, color: '#374151', background: '#F8FAFC', outline: 'none', cursor: 'pointer' }}>
                        {departments.map(d => <option key={d}>{d}</option>)}
                    </select>

                    {/* Status filter */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {statuses.map(s => {
                            const active = statusFilter === s;
                            const cfg = s === 'All' ? { color: P_MID, bg: '#EDE9FE' } : (empStatusCfg[s] ?? { color: '#64748b', bg: '#F1F5F9' });
                            return (
                                <button key={s} onClick={() => setStatusFilter(s)}
                                    style={{ border: active ? `1.5px solid ${cfg.color}` : '1.5px solid #E2E8F0', borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', color: active ? cfg.color : '#94a3b8', background: active ? cfg.bg : '#fff' }}>
                                    {s}
                                </button>
                            );
                        })}
                    </div>

                    <Text style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>{filtered.length} of {total} employees</Text>
                </div>

                <Table
                    dataSource={filtered}
                    columns={columns}
                    rowKey="key"
                    pagination={{ pageSize: 10, size: 'small', showSizeChanger: false }}
                    size="middle"
                    scroll={{ x: 900 }}
                    onRow={() => ({
                        onMouseEnter: e => { (e.currentTarget as HTMLTableRowElement).style.background = '#faf5ff'; },
                        onMouseLeave: e => { (e.currentTarget as HTMLTableRowElement).style.background = ''; },
                    })}
                />
            </div>
        </>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMPLOYEE VIEW — personal clock in / out
// ═══════════════════════════════════════════════════════════════════════════════
function EmployeeClockInView({ liveTime }: { liveTime: string }) {
    const [clockedIn,    setClockedIn]    = useState(false);
    const [clockInTime,  setClockInTime]  = useState<Date | null>(null);
    const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
    const [elapsed,      setElapsed]      = useState(0);
    const [breakOn,      setBreakOn]      = useState(false);
    const [breakSecs,    setBreakSecs]    = useState(0);
    const [history,      setHistory]      = useState<AttendanceRecord[]>(mockHistory);
    const [flash,        setFlash]        = useState<'in'|'out'|null>(null);
    const wRef = useRef<ReturnType<typeof setInterval>|null>(null);
    const bRef = useRef<ReturnType<typeof setInterval>|null>(null);

    useEffect(() => {
        if (clockedIn && !breakOn) { wRef.current = setInterval(() => setElapsed(e => e + 1), 1000); }
        else { if (wRef.current) clearInterval(wRef.current); }
        return () => { if (wRef.current) clearInterval(wRef.current); };
    }, [clockedIn, breakOn]);

    useEffect(() => {
        if (breakOn) { bRef.current = setInterval(() => setBreakSecs(b => b + 1), 1000); }
        else { if (bRef.current) clearInterval(bRef.current); }
        return () => { if (bRef.current) clearInterval(bRef.current); };
    }, [breakOn]);

    const doClockIn = () => {
        const now = new Date();
        setClockedIn(true); setClockInTime(now); setClockOutTime(null);
        setElapsed(0); setBreakSecs(0); setBreakOn(false);
        setFlash('in'); setTimeout(() => setFlash(null), 3500);
    };

    const doClockOut = () => {
        const now = new Date();
        setClockedIn(false); setClockOutTime(now); setBreakOn(false);
        const net  = elapsed - breakSecs;
        const late = clockInTime ? (clockInTime.getHours() * 60 + clockInTime.getMinutes()) > 9 * 60 + 5 : false;
        const status: AttendanceRecord['status'] = net < TARGET * 0.5 ? 'Half Day' : late ? 'Late' : 'Present';
        setHistory(prev => [{
            key: Date.now(), date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            day: now.toLocaleDateString('en-US', { weekday: 'long' }),
            clockIn: clockInTime ? fmtTime(clockInTime) : '--', clockOut: fmtTime(now),
            totalHrs: secsToLabel(net), breakTime: secsToLabel(breakSecs), status, location: 'Office',
        }, ...prev]);
        setFlash('out'); setTimeout(() => setFlash(null), 3500);
    };

    const pct    = Math.min(100, Math.round((elapsed / TARGET) * 100));
    const netSec = elapsed - breakSecs;
    const weekHrs    = history.filter(r => r.totalHrs !== '--').reduce((s, r) => {
        const h = parseInt(r.totalHrs); const m = parseInt(r.totalHrs.split('h ')[1] ?? '0');
        return s + h + m / 60;
    }, 0);
    const presentCnt = history.filter(r => r.status === 'Present').length;
    const lateCnt    = history.filter(r => r.status === 'Late').length;
    const absentCnt  = history.filter(r => r.status === 'Absent').length;

    const columns: ColumnsType<AttendanceRecord> = [
        {
            title: 'Date', dataIndex: 'date', key: 'date', width: 160,
            render: (v, r) => (
                <div>
                    <Text strong style={{ fontSize: 13, color: '#1E1B4B', display: 'block' }}>{v}</Text>
                    <Text style={{ fontSize: 12, color: '#94a3b8' }}>{r.day}</Text>
                </div>
            ),
        },
        {
            title: 'Clock In', dataIndex: 'clockIn', key: 'clockIn', width: 130,
            render: v => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <LogIn size={13} color={v === '--' ? '#cbd5e1' : '#16A34A'} />
                    <Text strong style={{ fontSize: 13, color: v === '--' ? '#cbd5e1' : '#374151' }}>{v}</Text>
                </div>
            ),
        },
        {
            title: 'Clock Out', dataIndex: 'clockOut', key: 'clockOut', width: 130,
            render: v => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <LogOut size={13} color={v === '--' ? '#cbd5e1' : '#DC2626'} />
                    <Text strong style={{ fontSize: 13, color: v === '--' ? '#cbd5e1' : '#374151' }}>{v}</Text>
                </div>
            ),
        },
        {
            title: 'Work Time', dataIndex: 'totalHrs', key: 'totalHrs', width: 120,
            render: v => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Timer size={13} color={v === '--' ? '#cbd5e1' : P_MID} />
                    <Text strong style={{ fontSize: 13, color: v === '--' ? '#cbd5e1' : P_DARK }}>{v}</Text>
                </div>
            ),
        },
        {
            title: 'Break', dataIndex: 'breakTime', key: 'breakTime', width: 100,
            render: v => <Text style={{ fontSize: 13, color: v === '--' ? '#cbd5e1' : '#64748b' }}>{v}</Text>,
        },
        {
            title: 'Location', dataIndex: 'location', key: 'location', width: 120,
            render: v => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={12} color="#94a3b8" />
                    <Text style={{ fontSize: 12, color: '#64748b' }}>{v}</Text>
                </div>
            ),
        },
        {
            title: 'Status', dataIndex: 'status', key: 'status', width: 110,
            render: (s: string) => {
                const c = statusCfg[s] ?? { color: '#94a3b8', bg: '#f1f5f9' };
                return (
                    <Tag style={{ borderRadius: 20, padding: '2px 12px', fontSize: 12, fontWeight: 600, color: c.color, background: c.bg, border: 'none' }}>
                        {s}
                    </Tag>
                );
            },
        },
    ];

    return (
        <>
            {/* Hero */}
            <div style={{
                position: 'relative', marginBottom: 20, overflow: 'hidden', borderRadius: 16,
                background: `linear-gradient(135deg, ${P_DARK} 0%, #312E81 55%, ${P_MID} 100%)`,
                padding: '26px 28px',
            }}>
                <div style={{ position:'absolute', top:-50, right:-50, width:210, height:210, borderRadius:'50%', background:'#4C1D95', opacity:0.3, pointerEvents:'none' }} />
                <div style={{ position:'absolute', bottom:-40, left:-40, width:150, height:150, borderRadius:'50%', background:P_MID, opacity:0.18, pointerEvents:'none' }} />
                <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                        <div style={{ width:48, height:48, borderRadius:13, background:'rgba(167,139,250,0.18)', border:'1px solid rgba(167,139,250,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <Clock size={22} color={P_ACCENT} />
                        </div>
                        <div>
                            <Text style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:P_ACCENT, display:'block', marginBottom:2 }}>Attendance</Text>
                            <Text style={{ fontSize:21, fontWeight:800, color:'#fff', display:'block', lineHeight:1.1 }}>Clock In / Out</Text>
                            <Text style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginTop:3, display:'block' }}>{dateLabel()}</Text>
                        </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                        <div style={{ fontFamily:'monospace', fontSize:32, fontWeight:800, color:'#fff', letterSpacing:'-1px' }}>{liveTime}</div>
                        <Text style={{ fontSize:12, color: clockedIn ? '#4ade80' : 'rgba(255,255,255,0.4)', display:'block', marginTop:2 }}>
                            {clockedIn ? (breakOn ? '☕  On Break' : '●  Working') : '○  Not clocked in'}
                        </Text>
                    </div>
                </div>
            </div>

            {/* Flash */}
            {flash && (
                <div style={{
                    marginBottom:16, borderRadius:10, padding:'12px 18px',
                    background: flash==='in' ? '#DCFCE7' : '#FEE2E2',
                    border:`1px solid ${flash==='in' ? '#86efac' : '#fca5a5'}`,
                    display:'flex', alignItems:'center', gap:10,
                }}>
                    <CheckCircle size={17} color={flash==='in' ? '#16A34A' : '#DC2626'} />
                    <Text style={{ fontWeight:600, color: flash==='in' ? '#15803d' : '#b91c1c', fontSize:14 }}>
                        {flash==='in'
                            ? `Clocked in at ${clockInTime ? fmtTime(clockInTime) : ''}`
                            : `Clocked out at ${clockOutTime ? fmtTime(clockOutTime) : ''} — have a great rest!`}
                    </Text>
                </div>
            )}

            {/* Stats row */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }} className="tp-stats-grid">
                {[
                    { label:'Weekly Hours',  value:`${weekHrs.toFixed(1)}h`, icon:TrendingUp,  color:'#7C3AED', bg:'#EDE9FE' },
                    { label:'Days Present',  value:presentCnt,                icon:CheckCircle, color:'#16A34A', bg:'#DCFCE7' },
                    { label:'Late Arrivals', value:lateCnt,                   icon:AlertCircle, color:'#D97706', bg:'#FEF3C7' },
                    { label:'Absent Days',   value:absentCnt,                 icon:User,        color:'#DC2626', bg:'#FEE2E2' },
                ].map(({ label, value, icon:Icon, color, bg }) => (
                    <div key={label} style={{ ...card, padding:'18px 20px' }}>
                        <div style={{ width:34, height:34, borderRadius:9, background:bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
                            <Icon size={16} color={color} />
                        </div>
                        <div style={{ fontSize:26, fontWeight:800, color:'#1E1B4B', lineHeight:1 }}>{value}</div>
                        <div style={{ fontSize:12, color:'#94a3b8', marginTop:5 }}>{label}</div>
                    </div>
                ))}
            </div>

            {/* Clock widget */}
            <div style={{ ...card, padding:'28px 24px', marginBottom:20 }}>
                <div style={{ display:'flex', flexWrap:'wrap', gap:24, alignItems:'center', justifyContent:'center' }}>
                    {/* Progress ring */}
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                        <Progress
                            type="circle"
                            percent={pct}
                            size={160}
                            strokeColor={clockedIn ? (breakOn ? '#F59E0B' : P_MID) : '#e2e8f0'}
                            trailColor="#f8fafc"
                            strokeWidth={8}
                            format={() => (
                                <div style={{ textAlign:'center' }}>
                                    <div style={{ fontFamily:'monospace', fontSize:20, fontWeight:800, color: clockedIn ? (breakOn ? '#D97706' : P_DARK) : '#94a3b8', letterSpacing:'-1px' }}>
                                        {fmtElapsed(elapsed)}
                                    </div>
                                    <div style={{ fontSize:10, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:3 }}>
                                        {clockedIn ? (breakOn ? 'on break' : 'working') : 'not started'}
                                    </div>
                                    <div style={{ fontSize:12, fontWeight:700, color:P_MID, marginTop:5 }}>{pct}% of 8h</div>
                                </div>
                            )}
                        />
                    </div>

                    <div style={{ width:1, height:160, background:'#EDE9FE', flexShrink:0 }} className="tp-hide-mobile" />

                    {/* Session info + buttons */}
                    <div style={{ flex:1, minWidth:260 }}>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:22 }}>
                            {[
                                { label:'Clock In',  value: clockInTime  ? fmtTime(clockInTime)  : '--:--', icon:LogIn,  color:'#16A34A' },
                                { label:'Net Work',  value: secsToLabel(netSec) || '0m',                    icon:Timer,  color:P_MID     },
                                { label:'Break',     value: secsToLabel(breakSecs) || '0m',                 icon:Coffee, color:'#D97706' },
                            ].map(({ label, value, icon:Icon, color }) => (
                                <div key={label} style={{ background:'#fafbff', border:'1px solid #EDE9FE', borderRadius:10, padding:'12px 14px' }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                                        <Icon size={13} color={color} />
                                        <Text style={{ fontSize:11, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</Text>
                                    </div>
                                    <div style={{ fontSize:17, fontWeight:800, color:'#1E1B4B' }}>{value}</div>
                                </div>
                            ))}
                        </div>

                        {!clockedIn ? (
                            <button onClick={doClockIn} style={{
                                width:'100%', padding:'15px 0', border:'none', cursor:'pointer',
                                borderRadius:12, fontSize:15, fontWeight:700, color:'#fff',
                                background:`linear-gradient(135deg, ${P_DARK}, ${P_MID})`,
                                display:'flex', alignItems:'center', justifyContent:'center', gap:9,
                                boxShadow:`0 6px 20px ${P_MID}44`, transition:'opacity 0.18s',
                            }}
                                onMouseEnter={e=>(e.currentTarget.style.opacity='0.88')}
                                onMouseLeave={e=>(e.currentTarget.style.opacity='1')}
                            >
                                <LogIn size={18} /> Clock In
                            </button>
                        ) : (
                            <div style={{ display:'flex', gap:10 }}>
                                <button onClick={doClockOut} style={{
                                    flex:1, padding:'15px 0', border:'none', cursor:'pointer',
                                    borderRadius:12, fontSize:15, fontWeight:700, color:'#fff',
                                    background:'linear-gradient(135deg,#b91c1c,#ef4444)',
                                    display:'flex', alignItems:'center', justifyContent:'center', gap:9,
                                    boxShadow:'0 6px 20px rgba(239,68,68,0.35)', transition:'opacity 0.18s',
                                }}
                                    onMouseEnter={e=>(e.currentTarget.style.opacity='0.88')}
                                    onMouseLeave={e=>(e.currentTarget.style.opacity='1')}
                                >
                                    <LogOut size={18} /> Clock Out
                                </button>
                                <button onClick={()=>setBreakOn(b=>!b)} style={{
                                    padding:'15px 20px', cursor:'pointer', borderRadius:12, fontSize:14, fontWeight:600,
                                    background: breakOn ? '#FEF3C7' : '#f8fafc',
                                    border:`1px solid ${breakOn ? '#F59E0B' : '#e2e8f0'}`,
                                    color: breakOn ? '#B45309' : '#64748b',
                                    display:'flex', alignItems:'center', gap:7, transition:'all 0.18s',
                                }}>
                                    <Coffee size={15} />{breakOn ? 'End Break' : 'Break'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Policy */}
                    <div style={{ width:1, height:160, background:'#EDE9FE', flexShrink:0 }} className="tp-hide-mobile" />
                    <div style={{ minWidth:180, flexShrink:0 }}>
                        <Text style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:10 }}>Policy</Text>
                        {[
                            { dot:'#16A34A', text:'Before 9:05 AM → Present' },
                            { dot:'#D97706', text:'After 9:05 AM → Late'      },
                            { dot:P_MID,     text:'Under 4h net → Half Day'   },
                            { dot:'#DC2626', text:'No clock-in → Absent'      },
                        ].map(({ dot, text }) => (
                            <div key={text} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                                <div style={{ width:8, height:8, borderRadius:'50%', background:dot, flexShrink:0 }} />
                                <Text style={{ fontSize:12, color:'#64748b' }}>{text}</Text>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* History table */}
            <div style={{ ...card, borderRadius:14, overflow:'hidden' }}>
                <div style={{ padding:'18px 20px 16px', borderBottom:'1px solid #EDE9FE', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:32, height:32, borderRadius:9, background:'#EDE9FE', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Calendar size={15} color={P_MID} />
                        </div>
                        <Text style={{ fontWeight:700, fontSize:15, color:'#1E1B4B' }}>Attendance History</Text>
                    </div>
                    <Text style={{ fontSize:12, color:'#94a3b8' }}>{history.length} records</Text>
                </div>
                <Table
                    dataSource={history}
                    columns={columns}
                    rowKey="key"
                    pagination={{ pageSize:10, size:'small', showSizeChanger:false }}
                    size="middle"
                    scroll={{ x:700 }}
                    onRow={() => ({
                        onMouseEnter: e => { (e.currentTarget as HTMLTableRowElement).style.background = '#faf5ff'; },
                        onMouseLeave: e => { (e.currentTarget as HTMLTableRowElement).style.background = ''; },
                    })}
                />
            </div>
        </>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT — role-aware entry point
// ═══════════════════════════════════════════════════════════════════════════════
export default function ClockInOut() {
    const { auth } = usePage<PageProps>().props;
    const role = auth?.user?.role ?? 'employee';
    const isManager = role === 'manager' || role === 'owner' || role === 'super_admin';

    const [liveTime, setLiveTime] = useState(nowLabel());
    useEffect(() => {
        const t = setInterval(() => setLiveTime(nowLabel()), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <AppLayout title={isManager ? 'Employee Attendance' : 'Clock In / Out'}>
            <Head title={isManager ? 'Employee Attendance' : 'Clock In / Out'} />
            {isManager
                ? <ManagerAttendanceView liveTime={liveTime} />
                : <EmployeeClockInView   liveTime={liveTime} />
            }
        </AppLayout>
    );
}
