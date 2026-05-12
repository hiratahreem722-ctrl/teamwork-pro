import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ListChecks, Clock, CheckCircle2, ArrowUpRight, CalendarRange,
    Receipt, Star, Sparkles, FileText, AlertCircle, User, Phone,
    Mail, MapPin, Building2, Calendar, Download, Eye, Shield,
    TrendingUp, Target, Award, Zap, DollarSign, ChevronRight,
    Briefcase, BadgeCheck, BookOpen, Lock,
} from 'lucide-react';
import AnimatedNumber from '@/Components/AnimatedNumber';
import { useState } from 'react';

// ── Palette ───────────────────────────────────────────────────────────────────
const P  = '#7C3AED';
const PD = '#1E1B4B';
const card = { background: '#fff', borderRadius: 12, border: '1px solid #EDE9FE', boxShadow: '0 1px 3px rgba(124,58,237,0.06)' } as const;

// ── Mock employee (logged-in user's own data) ─────────────────────────────────
const ME = {
    name:       'Sara Rahman',
    initials:   'SR',
    email:      'sara.rahman@teamworkpro.io',
    phone:      '+1 (555) 214-9832',
    department: 'Engineering',
    position:   'Senior Frontend Developer',
    manager:    'Lisa Park',
    startDate:  'March 15, 2023',
    location:   'New York, USA',
    employeeId: 'EMP-00142',
    type:       'Full-time',
    gender:     'Female',
    dob:        'April 22, 1995',
    address:    '24 Maple Street, Brooklyn, NY 11201',
    emergency:  { name: 'Ahmed Rahman', relation: 'Brother', phone: '+1 (555) 309-7712' },
    skills:     ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Tailwind CSS', 'AWS'],
    bio:        'Passionate frontend engineer with 6+ years of experience building scalable web applications. Loves clean code and pixel-perfect UIs.',
};

// ── My Tasks ──────────────────────────────────────────────────────────────────
const myTasks = [
    { title: 'Build user auth API endpoint',   project: 'API Integration',     priority: 'High',   due: 'Today',    status: 'In Progress', aiAssigned: true  },
    { title: 'Review PR — cart module',         project: 'E-comm Platform',     priority: 'High',   due: 'Today',    status: 'Pending',     aiAssigned: false },
    { title: 'Fix login page mobile layout',    project: 'Website Redesign',    priority: 'Medium', due: 'Tomorrow', status: 'Pending',     aiAssigned: true  },
    { title: 'Update API documentation',        project: 'API Integration',     priority: 'Low',    due: 'Jun 3',    status: 'Pending',     aiAssigned: false },
    { title: 'Database query optimisation',     project: 'CRM Implementation',  priority: 'Medium', due: 'Jun 5',    status: 'Pending',     aiAssigned: true  },
];
const priorityColor: Record<string, { bg: string; color: string }> = {
    High:   { bg: '#FEE2E2', color: '#DC2626' },
    Medium: { bg: '#FEF3C7', color: '#D97706' },
    Low:    { bg: '#DCFCE7', color: '#16A34A' },
};
const timeEntries = [
    { project: 'API Integration',  task: 'Auth endpoint',     hours: 3.5, date: 'Today' },
    { project: 'Website Redesign', task: 'Mobile layout fix', hours: 2.0, date: 'Today' },
    { project: 'API Integration',  task: 'Code review',       hours: 1.5, date: 'Yesterday' },
];
const notifications = [
    { msg: 'You have been assigned a new task via AI Smart Assign', time: '2m ago',  type: 'ai' },
    { msg: 'Performance review scheduled for Jun 15',                time: '1h ago',  type: 'hr' },
    { msg: 'May payslip is now available',                           time: '3h ago',  type: 'payroll' },
    { msg: 'Team standup in 15 minutes',                             time: '10h ago', type: 'info' },
];
const notifColors: Record<string, string> = { ai: '#7C3AED', hr: '#3B82F6', payroll: '#059669', info: '#94A3B8' };
const leaveBalance = [
    { type: 'Annual Leave', used: 6,  total: 20, color: '#3B82F6' },
    { type: 'Sick Leave',   used: 2,  total: 10, color: '#F59E0B' },
    { type: 'Study Leave',  used: 0,  total: 5,  color: '#10B981' },
];
const quickLinks = [
    { label: 'Log Time',      icon: Clock,        href: route('time.entry'),       color: P,        bg: '#F5F3FF' },
    { label: 'Request Leave', icon: CalendarRange, href: route('hr.leave'),         color: '#3B82F6',bg: '#EFF6FF' },
    { label: 'View Payslip',  icon: Receipt,       href: '#payslips',              color: '#059669',bg: '#ECFDF5' },
    { label: 'My Documents',  icon: FileText,      href: '#documents',             color: '#D97706',bg: '#FFFBEB' },
    { label: 'Performance',   icon: Star,          href: '#performance',           color: '#EC4899',bg: '#FDF2F8' },
    { label: 'Smart Tasks',   icon: Sparkles,      href: route('ai.smart-tasks'),  color: '#9333EA',bg: '#FAF5FF' },
];

// ── Payslip history ───────────────────────────────────────────────────────────
const payslips = [
    { period: 'May 2026',      gross: 7917,  deductions: 1979, net: 5938, tax: 1187, insurance: 792, status: 'Available', date: 'Jun 1, 2026'  },
    { period: 'April 2026',    gross: 7917,  deductions: 1979, net: 5938, tax: 1187, insurance: 792, status: 'Available', date: 'May 1, 2026'  },
    { period: 'March 2026',    gross: 7917,  deductions: 1979, net: 5938, tax: 1187, insurance: 792, status: 'Available', date: 'Apr 1, 2026'  },
    { period: 'February 2026', gross: 7917,  deductions: 1979, net: 5938, tax: 1187, insurance: 792, status: 'Available', date: 'Mar 1, 2026'  },
    { period: 'January 2026',  gross: 7917,  deductions: 1979, net: 5938, tax: 1187, insurance: 792, status: 'Available', date: 'Feb 1, 2026'  },
    { period: 'December 2025', gross: 9500,  deductions: 2375, net: 7125, tax: 1425, insurance: 950, status: 'Available', date: 'Jan 1, 2026'  },
    { period: 'November 2025', gross: 7500,  deductions: 1875, net: 5625, tax: 1125, insurance: 750, status: 'Available', date: 'Dec 1, 2025'  },
    { period: 'October 2025',  gross: 7500,  deductions: 1875, net: 5625, tax: 1125, insurance: 750, status: 'Available', date: 'Nov 1, 2025'  },
];

// ── Performance history ───────────────────────────────────────────────────────
const myPerformance = [
    { cycle: 'Q1 2026', reviewer: 'Lisa Park', rating: 4.8, goalsMet: 96, tasksCompleted: 62, hoursLogged: 168, revenue: 21000, status: 'Completed', date: 'Apr 5, 2026',
      goals: [{ name: 'Complete API Integration module', met: true },{ name: 'Improve code review turnaround', met: true },{ name: 'Mentor junior developer', met: true },{ name: 'Reduce bug count by 20%', met: true },{ name: 'Complete AWS certification', met: false }],
      strengths: ['Technical expertise', 'Code quality', 'Team collaboration'],
      improvements: ['Documentation speed', 'Estimation accuracy'],
      comment: 'Sara consistently delivers high-quality work. Excellent technical skills and a great team player. Continue to work on documentation.',
    },
    { cycle: 'Q4 2025', reviewer: 'Lisa Park', rating: 4.5, goalsMet: 90, tasksCompleted: 58, hoursLogged: 160, revenue: 19500, status: 'Completed', date: 'Jan 10, 2026',
      goals: [{ name: 'Ship Website Redesign phase 2', met: true },{ name: 'On-board new team tool', met: true },{ name: 'Zero critical bugs in prod', met: true },{ name: 'Weekly 1-on-1 with manager', met: true },{ name: 'Launch internal component library', met: false }],
      strengths: ['Reliability', 'Delivery speed', 'Problem solving'],
      improvements: ['Proactive communication', 'Long-term planning'],
      comment: 'Strong quarter with excellent delivery. Sara stepped up well when the team was short-staffed.',
    },
    { cycle: 'Q3 2025', reviewer: 'Marcus Chen', rating: 4.3, goalsMet: 86, tasksCompleted: 54, hoursLogged: 155, revenue: 17800, status: 'Completed', date: 'Oct 8, 2025',
      goals: [{ name: 'Launch new dashboard', met: true },{ name: 'Reduce bundle size by 30%', met: true },{ name: 'Unit test coverage to 80%', met: true },{ name: 'Lead a sprint planning session', met: true },{ name: 'Cross-team collaboration project', met: false }],
      strengths: ['Frontend architecture', 'Performance optimisation'],
      improvements: ['Cross-team communication'],
      comment: 'Good quarter overall. Technical contributions were strong, particularly on performance.',
    },
];

// ── Documents ─────────────────────────────────────────────────────────────────
const myDocuments = [
    { name: 'Employment Contract.pdf',          category: 'Contract',       size: '1.2 MB', uploaded: 'Mar 15, 2023', expires: 'Never',        access: 'View only' },
    { name: 'NDA Agreement.pdf',                category: 'Legal',          size: '840 KB', uploaded: 'Mar 15, 2023', expires: 'Never',        access: 'View only' },
    { name: 'Passport Copy.pdf',                category: 'ID',             size: '2.1 MB', uploaded: 'Mar 16, 2023', expires: 'Apr 22, 2030', access: 'View only' },
    { name: 'AWS Certified Developer.pdf',      category: 'Certification',  size: '560 KB', uploaded: 'Jan 12, 2025', expires: 'Jan 12, 2028', access: 'Download'  },
    { name: 'React Advanced Certification.pdf', category: 'Certification',  size: '490 KB', uploaded: 'Jun 5, 2024',  expires: 'Never',        access: 'Download'  },
    { name: 'Performance Review Q1 2026.pdf',   category: 'HR',             size: '320 KB', uploaded: 'Apr 5, 2026',  expires: 'Never',        access: 'View only' },
    { name: 'Offer Letter.pdf',                 category: 'Contract',       size: '280 KB', uploaded: 'Mar 1, 2023',  expires: 'Never',        access: 'View only' },
    { name: 'Health Insurance Card.pdf',        category: 'Benefits',       size: '1.8 MB', uploaded: 'Jan 1, 2026',  expires: 'Dec 31, 2026', access: 'Download'  },
];
const docCategoryColor: Record<string, { bg: string; color: string }> = {
    Contract:    { bg: '#EDE9FE', color: P },
    Legal:       { bg: '#FEE2E2', color: '#DC2626' },
    ID:          { bg: '#DBEAFE', color: '#1D4ED8' },
    Certification:{ bg: '#D1FAE5', color: '#065F46' },
    HR:          { bg: '#FEF3C7', color: '#92400E' },
    Benefits:    { bg: '#FCE7F3', color: '#9D174D' },
};

// ── Star rating ───────────────────────────────────────────────────────────────
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
    const full = Math.floor(rating); const partial = rating % 1;
    return (
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            <div style={{ display:'flex', gap:1 }}>
                {[1,2,3,4,5].map(i => {
                    const isPartial = i === full+1 && partial > 0;
                    const filled    = i <= full || isPartial;
                    return <Star key={i} size={size} fill={filled?'#F59E0B':'#E5E7EB'} color={filled?'#F59E0B':'#E5E7EB'} style={{ opacity: isPartial ? 0.6 : 1 }} />;
                })}
            </div>
            <span style={{ fontWeight:700, color:PD, fontSize:size-1, marginLeft:2 }}>{rating}</span>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB PANELS
// ═══════════════════════════════════════════════════════════════════════════════

// ── Overview ──────────────────────────────────────────────────────────────────
function OverviewTab({ onTabChange }: { onTabChange: (t: string) => void }) {
    const todayTaskCount = myTasks.filter(t => t.due === 'Today').length;
    return (
        <>
            {/* Quick links */}
            <div className="stagger-children tp-quick-grid" style={{ marginBottom: 24 }}>
                {quickLinks.map(q => (
                    <a key={q.label} href={q.href.startsWith('#') ? '#' : q.href}
                        onClick={q.href.startsWith('#') ? (e) => { e.preventDefault(); onTabChange(q.href.slice(1)); } : undefined}
                        className="card-hover"
                        style={{ ...card, padding:'14px 12px', textDecoration:'none', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}
                    >
                        <div style={{ width:36, height:36, borderRadius:10, background:q.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <q.icon size={17} color={q.color} />
                        </div>
                        <span style={{ fontSize:12, fontWeight:600, color:'#374151', textAlign:'center', lineHeight:1.3 }}>{q.label}</span>
                    </a>
                ))}
            </div>

            <div className="tp-main-grid">
                {/* Left: tasks + time */}
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                    <div style={{ ...card, overflow:'hidden' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom:'1px solid #F5F3FF' }}>
                            <span style={{ fontWeight:600, fontSize:15, color:'#0F172A' }}>My Tasks</span>
                            <Link href={route('tasks.my')} style={{ fontSize:12, color:P, display:'flex', alignItems:'center', gap:3, textDecoration:'none' }}>View all <ArrowUpRight size={12} /></Link>
                        </div>
                        <div style={{ display:'flex', padding:'0 18px', height:36, background:'#FAFAFA', borderBottom:'1px solid #F1F5F9', alignItems:'center' }}>
                            {['TASK','PROJECT','PRIORITY','DUE','STATUS'].map((h, idx) => (
                                <div key={h} style={{ flex:idx===0?2:1, fontSize:10, fontWeight:600, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.07em' }}>{h}</div>
                            ))}
                        </div>
                        {myTasks.map((t, i) => (
                            <div key={i} style={{ display:'flex', alignItems:'center', padding:'0 18px', height:54, borderBottom:i<myTasks.length-1?'1px solid #FAF8FF':'none' }}>
                                <div style={{ flex:2, display:'flex', alignItems:'center', gap:8 }}>
                                    <CheckCircle2 size={15} color={t.status==='In Progress'?P:'#CBD5E1'} />
                                    <div>
                                        <p style={{ margin:0, fontSize:13, fontWeight:600, color:'#0F172A' }}>{t.title}</p>
                                        {t.aiAssigned && <span style={{ fontSize:10, background:'#F5F3FF', color:P, borderRadius:4, padding:'1px 5px', fontWeight:600 }}>⚡ AI</span>}
                                    </div>
                                </div>
                                <div style={{ flex:1, fontSize:12, color:'#64748B' }}>{t.project}</div>
                                <div style={{ flex:1 }}><span style={{ fontSize:11, background:priorityColor[t.priority].bg, color:priorityColor[t.priority].color, borderRadius:20, padding:'2px 8px', fontWeight:600 }}>{t.priority}</span></div>
                                <div style={{ flex:1, fontSize:12, color:t.due==='Today'?'#DC2626':'#64748B', fontWeight:t.due==='Today'?600:400 }}>{t.due}</div>
                                <div style={{ flex:1 }}><span style={{ fontSize:11, background:t.status==='In Progress'?'#F5F3FF':'#F1F5F9', color:t.status==='In Progress'?P:'#64748B', borderRadius:20, padding:'2px 8px', fontWeight:600 }}>{t.status}</span></div>
                            </div>
                        ))}
                    </div>

                    <div style={{ ...card, overflow:'hidden' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom:'1px solid #F5F3FF' }}>
                            <span style={{ fontWeight:600, fontSize:15, color:'#0F172A' }}>Today's Time Log</span>
                            <Link href={route('time.entry')} style={{ fontSize:12, color:P, display:'flex', alignItems:'center', gap:3, textDecoration:'none' }}>Log time <ArrowUpRight size={12} /></Link>
                        </div>
                        {timeEntries.map((e, i) => (
                            <div key={i} style={{ display:'flex', alignItems:'center', padding:'12px 18px', borderBottom:i<timeEntries.length-1?'1px solid #FAF8FF':'none', gap:12 }}>
                                <div style={{ width:8, height:8, borderRadius:'50%', background:P, flexShrink:0 }} />
                                <div style={{ flex:1 }}>
                                    <p style={{ margin:0, fontSize:13, fontWeight:600, color:'#0F172A' }}>{e.task}</p>
                                    <p style={{ margin:0, fontSize:11, color:'#94A3B8' }}>{e.project}</p>
                                </div>
                                <span style={{ fontSize:13, fontWeight:700, color:'#374151' }}>{e.hours}h</span>
                            </div>
                        ))}
                        <div style={{ padding:'10px 18px', background:'#FAFAFA', display:'flex', justifyContent:'space-between' }}>
                            <span style={{ fontSize:12, color:'#64748B' }}>Total today</span>
                            <span style={{ fontSize:13, fontWeight:700, color:P }}>{timeEntries.filter(e=>e.date==='Today').reduce((s,e)=>s+e.hours,0)}h</span>
                        </div>
                    </div>
                </div>

                {/* Right sidebar */}
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                    <div style={{ ...card, overflow:'hidden' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:'1px solid #F5F3FF' }}>
                            <span style={{ fontWeight:600, fontSize:14, color:'#0F172A' }}>Notifications</span>
                            <span style={{ background:P, color:'#fff', fontSize:10, borderRadius:10, padding:'1px 7px', fontWeight:700 }}>{notifications.length}</span>
                        </div>
                        {notifications.map((n, i) => (
                            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'11px 14px', borderBottom:i<notifications.length-1?'1px solid #FAF8FF':'none' }}>
                                <div style={{ width:8, height:8, borderRadius:'50%', background:notifColors[n.type], flexShrink:0, marginTop:4 }} />
                                <div>
                                    <p style={{ margin:0, fontSize:12, color:'#374151', lineHeight:1.4 }}>{n.msg}</p>
                                    <p style={{ margin:'3px 0 0', fontSize:10, color:'#94A3B8' }}>{n.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Latest payslip */}
                    <div style={{ ...card, padding:16 }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                            <span style={{ fontWeight:600, fontSize:14, color:'#0F172A' }}>Latest Payslip</span>
                            <button onClick={() => onTabChange('payslips')} style={{ fontSize:12, color:P, background:'none', border:'none', cursor:'pointer', padding:0 }}>View all</button>
                        </div>
                        <div style={{ background:'linear-gradient(135deg,#F5F3FF,#EDE9FE)', borderRadius:10, padding:'14px 16px', marginBottom:10 }}>
                            <p style={{ margin:0, fontSize:12, color:'#6D28D9', fontWeight:600 }}>{payslips[0].period}</p>
                            <p style={{ margin:'4px 0 0', fontSize:26, fontWeight:800, color:PD }}>${payslips[0].net.toLocaleString()}</p>
                            <p style={{ margin:'2px 0 0', fontSize:11, color:'#64748B' }}>Net pay</p>
                        </div>
                        {[{ label:'Gross Pay', value:`$${payslips[0].gross.toLocaleString()}`, color:'#374151' },{ label:'Deductions', value:`-$${payslips[0].deductions.toLocaleString()}`, color:'#DC2626' }].map(r => (
                            <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #F1F5F9' }}>
                                <span style={{ fontSize:12, color:'#64748B' }}>{r.label}</span>
                                <span style={{ fontSize:12, fontWeight:600, color:r.color }}>{r.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Leave balance */}
                    <div style={{ ...card, padding:16 }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                            <span style={{ fontWeight:600, fontSize:14, color:'#0F172A' }}>Leave Balance</span>
                            <Link href={route('hr.leave')} style={{ fontSize:12, color:P, textDecoration:'none' }}>Request</Link>
                        </div>
                        {leaveBalance.map(l => (
                            <div key={l.type} style={{ marginBottom:12 }}>
                                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                                    <span style={{ fontSize:12, color:'#374151', fontWeight:500 }}>{l.type}</span>
                                    <span style={{ fontSize:12, color:'#64748B' }}>{l.total-l.used}/{l.total} days left</span>
                                </div>
                                <div style={{ height:6, borderRadius:3, background:'#F1F5F9' }}>
                                    <div style={{ height:'100%', borderRadius:3, width:`${(l.used/l.total)*100}%`, background:l.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

// ── My Profile ────────────────────────────────────────────────────────────────
function ProfileTab() {
    return (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:20 }}>
            {/* Left: avatar + summary */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ ...card, padding:24, textAlign:'center' }}>
                    <div style={{ width:88, height:88, borderRadius:'50%', background:`linear-gradient(135deg,${PD},${P})`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontSize:28, fontWeight:800, color:'#fff', border:'4px solid #EDE9FE' }}>{ME.initials}</div>
                    <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:PD }}>{ME.name}</h2>
                    <p style={{ margin:'4px 0 8px', fontSize:13, color:'#64748B' }}>{ME.position}</p>
                    <span style={{ background:'#F5F3FF', color:P, borderRadius:20, padding:'4px 14px', fontSize:12, fontWeight:600, border:'1px solid #EDE9FE' }}>{ME.department}</span>
                    <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:8 }}>
                        {[
                            { icon:Mail,      val:ME.email },
                            { icon:Phone,     val:ME.phone },
                            { icon:MapPin,    val:ME.location },
                            { icon:Briefcase, val:ME.type },
                        ].map(({ icon:Icon, val }) => (
                            <div key={val} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'#64748B' }}>
                                <Icon size={13} color='#94a3b8' />
                                <span style={{ textAlign:'left' }}>{val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skills */}
                <div style={{ ...card, padding:20 }}>
                    <h3 style={{ margin:'0 0 12px', fontSize:14, fontWeight:700, color:PD }}>Skills</h3>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                        {ME.skills.map(s => (
                            <span key={s} style={{ background:'#F5F3FF', color:P, border:'1px solid #EDE9FE', borderRadius:20, padding:'4px 12px', fontSize:12, fontWeight:600 }}>{s}</span>
                        ))}
                    </div>
                </div>

                {/* Emergency contact */}
                <div style={{ ...card, padding:20 }}>
                    <h3 style={{ margin:'0 0 12px', fontSize:14, fontWeight:700, color:PD }}>Emergency Contact</h3>
                    <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                        {[
                            { label:'Name',     val:ME.emergency.name },
                            { label:'Relation', val:ME.emergency.relation },
                            { label:'Phone',    val:ME.emergency.phone },
                        ].map(r => (
                            <div key={r.label} style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                                <span style={{ color:'#94a3b8' }}>{r.label}</span>
                                <span style={{ fontWeight:600, color:PD }}>{r.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: detail fields */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {/* Personal info */}
                <div style={{ ...card, padding:24 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
                        <div style={{ width:32, height:32, borderRadius:8, background:'#F5F3FF', display:'flex', alignItems:'center', justifyContent:'center' }}><User size={15} color={P} /></div>
                        <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:PD }}>Personal Information</h3>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px 24px' }}>
                        {[
                            { label:'Full Name',    val:ME.name },
                            { label:'Employee ID',  val:ME.employeeId },
                            { label:'Date of Birth',val:ME.dob },
                            { label:'Gender',       val:ME.gender },
                            { label:'Email',        val:ME.email },
                            { label:'Phone',        val:ME.phone },
                            { label:'Location',     val:ME.location },
                            { label:'Address',      val:ME.address },
                        ].map(f => (
                            <div key={f.label}>
                                <p style={{ margin:'0 0 3px', fontSize:11, fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em' }}>{f.label}</p>
                                <p style={{ margin:0, fontSize:13, fontWeight:600, color:PD }}>{f.val}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Job info */}
                <div style={{ ...card, padding:24 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
                        <div style={{ width:32, height:32, borderRadius:8, background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center' }}><Building2 size={15} color='#3B82F6' /></div>
                        <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:PD }}>Job Information</h3>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px 24px' }}>
                        {[
                            { label:'Department',    val:ME.department },
                            { label:'Position',      val:ME.position },
                            { label:'Manager',       val:ME.manager },
                            { label:'Employment Type',val:ME.type },
                            { label:'Start Date',    val:ME.startDate },
                            { label:'Employee ID',   val:ME.employeeId },
                        ].map(f => (
                            <div key={f.label}>
                                <p style={{ margin:'0 0 3px', fontSize:11, fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em' }}>{f.label}</p>
                                <p style={{ margin:0, fontSize:13, fontWeight:600, color:PD }}>{f.val}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bio */}
                <div style={{ ...card, padding:24 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                        <div style={{ width:32, height:32, borderRadius:8, background:'#FDF2F8', display:'flex', alignItems:'center', justifyContent:'center' }}><BookOpen size={15} color='#EC4899' /></div>
                        <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:PD }}>About Me</h3>
                    </div>
                    <p style={{ margin:0, fontSize:13, color:'#374151', lineHeight:1.7 }}>{ME.bio}</p>
                </div>
            </div>
        </div>
    );
}

// ── Payslips ──────────────────────────────────────────────────────────────────
function PayslipsTab() {
    const [expanded, setExpanded] = useState<number | null>(0);
    const ytdGross = payslips.slice(0,5).reduce((s,p) => s+p.gross, 0);
    const ytdNet   = payslips.slice(0,5).reduce((s,p) => s+p.net, 0);
    const ytdTax   = payslips.slice(0,5).reduce((s,p) => s+p.tax, 0);

    return (
        <div>
            {/* YTD summary */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 }}>
                {[
                    { label:'YTD Gross Earnings', value:`$${ytdGross.toLocaleString()}`, color:'#059669', bg:'#ECFDF5', icon:DollarSign },
                    { label:'YTD Net Pay',         value:`$${ytdNet.toLocaleString()}`,   color:P,          bg:'#F5F3FF', icon:Receipt },
                    { label:'YTD Tax Paid',        value:`$${ytdTax.toLocaleString()}`,   color:'#D97706',  bg:'#FFFBEB', icon:Shield },
                ].map(s => (
                    <div key={s.label} style={{ ...card, padding:'18px 22px', display:'flex', alignItems:'center', gap:14 }}>
                        <div style={{ width:44, height:44, borderRadius:11, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <s.icon size={20} color={s.color} />
                        </div>
                        <div>
                            <div style={{ fontSize:22, fontWeight:800, color:PD }}>{s.value}</div>
                            <div style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Payslip list */}
            <div style={{ ...card, overflow:'hidden' }}>
                <div style={{ padding:'14px 20px', borderBottom:'1px solid #EDE9FE', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:PD }}>Payslip History</h3>
                    <span style={{ fontSize:12, color:'#94a3b8' }}>{payslips.length} records</span>
                </div>
                {payslips.map((p, i) => (
                    <div key={i}>
                        <div
                            onClick={() => setExpanded(expanded === i ? null : i)}
                            style={{ display:'flex', alignItems:'center', padding:'14px 20px', borderBottom:'1px solid #F3F4F6', cursor:'pointer', transition:'background 0.12s', gap:16 }}
                            onMouseEnter={e => (e.currentTarget.style.background='#FAFAFF')}
                            onMouseLeave={e => (e.currentTarget.style.background='')}
                        >
                            <div style={{ width:44, height:44, borderRadius:10, background:'linear-gradient(135deg,#F5F3FF,#EDE9FE)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                <Receipt size={18} color={P} />
                            </div>
                            <div style={{ flex:1 }}>
                                <div style={{ fontSize:14, fontWeight:700, color:PD }}>{p.period}</div>
                                <div style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>Issued: {p.date}</div>
                            </div>
                            <div style={{ textAlign:'right', marginRight:8 }}>
                                <div style={{ fontSize:16, fontWeight:800, color:PD }}>${p.net.toLocaleString()}</div>
                                <div style={{ fontSize:11, color:'#94a3b8' }}>Net pay</div>
                            </div>
                            <span style={{ background:'#DCFCE7', color:'#16A34A', borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:600, flexShrink:0 }}>{p.status}</span>
                            <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                                <button style={{ padding:'5px 12px', borderRadius:7, border:'1px solid #EDE9FE', background:'#fff', fontSize:12, fontWeight:600, color:P, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                                    <Eye size={12} /> View
                                </button>
                                <button style={{ padding:'5px 12px', borderRadius:7, border:'1px solid #EDE9FE', background:'#F5F3FF', fontSize:12, fontWeight:600, color:P, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                                    <Download size={12} /> PDF
                                </button>
                            </div>
                            <ChevronRight size={16} color='#94a3b8' style={{ transition:'transform 0.2s', transform: expanded===i?'rotate(90deg)':'none' }} />
                        </div>
                        {/* Expanded breakdown */}
                        {expanded === i && (
                            <div style={{ padding:'16px 20px 20px 80px', background:'#FAFBFF', borderBottom:'1px solid #F3F4F6' }}>
                                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
                                    {[
                                        { label:'Gross Pay',    value:`$${p.gross.toLocaleString()}`,      color:'#374151' },
                                        { label:'Income Tax',   value:`-$${p.tax.toLocaleString()}`,        color:'#DC2626' },
                                        { label:'Insurance',    value:`-$${p.insurance.toLocaleString()}`,  color:'#D97706' },
                                        { label:'Net Pay',      value:`$${p.net.toLocaleString()}`,         color:'#059669' },
                                    ].map(r => (
                                        <div key={r.label} style={{ background:'#fff', border:'1px solid #EDE9FE', borderRadius:9, padding:'12px 14px' }}>
                                            <div style={{ fontSize:11, color:'#94a3b8', marginBottom:4 }}>{r.label}</div>
                                            <div style={{ fontSize:16, fontWeight:800, color:r.color }}>{r.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Performance ───────────────────────────────────────────────────────────────
function PerformanceTab() {
    const [expanded, setExpanded] = useState<number | null>(0);
    const avgRating = (myPerformance.reduce((s,r) => s+r.rating, 0) / myPerformance.length).toFixed(1);
    const avgGoals  = Math.round(myPerformance.reduce((s,r) => s+r.goalsMet, 0) / myPerformance.length);

    return (
        <div>
            {/* Summary row */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:20 }}>
                {[
                    { label:'Avg Rating',         value:`${avgRating}/5`,                     color:'#F59E0B', bg:'#FFFBEB', icon:Star },
                    { label:'Avg Goals Met',       value:`${avgGoals}%`,                       color:'#059669', bg:'#ECFDF5', icon:Target },
                    { label:'Reviews Completed',   value:myPerformance.length,                 color:P,          bg:'#F5F3FF', icon:BadgeCheck },
                    { label:'Total Revenue Contrib',value:`$${myPerformance.reduce((s,r)=>s+r.revenue,0).toLocaleString()}`, color:'#0369A1', bg:'#EFF6FF', icon:TrendingUp },
                ].map(s => (
                    <div key={s.label} style={{ ...card, padding:'18px 20px', display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:40, height:40, borderRadius:10, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <s.icon size={18} color={s.color} />
                        </div>
                        <div>
                            <div style={{ fontSize:20, fontWeight:800, color:PD }}>{s.value}</div>
                            <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Review cards */}
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {myPerformance.map((r, i) => (
                    <div key={i} style={{ ...card, overflow:'hidden' }}>
                        {/* Header row */}
                        <div
                            onClick={() => setExpanded(expanded===i ? null : i)}
                            style={{ display:'flex', alignItems:'center', padding:'16px 20px', gap:16, cursor:'pointer', transition:'background 0.12s' }}
                            onMouseEnter={e => (e.currentTarget.style.background='#FAFAFF')}
                            onMouseLeave={e => (e.currentTarget.style.background='')}
                        >
                            <div style={{ width:48, height:48, borderRadius:12, background:'linear-gradient(135deg,#F5F3FF,#EDE9FE)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                <Award size={22} color={P} />
                            </div>
                            <div style={{ flex:1 }}>
                                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                                    <span style={{ fontSize:16, fontWeight:800, color:PD }}>{r.cycle}</span>
                                    <span style={{ background:'#DCFCE7', color:'#16A34A', borderRadius:20, padding:'2px 10px', fontSize:11, fontWeight:600 }}>{r.status}</span>
                                </div>
                                <div style={{ fontSize:12, color:'#94a3b8' }}>Reviewed by {r.reviewer} · {r.date}</div>
                            </div>
                            <div style={{ display:'flex', gap:20, alignItems:'center' }}>
                                <div style={{ textAlign:'center' }}>
                                    <StarRating rating={r.rating} size={15} />
                                </div>
                                <div style={{ textAlign:'center' }}>
                                    <div style={{ fontSize:16, fontWeight:800, color: r.goalsMet>=90?'#16A34A':r.goalsMet>=70?'#3B82F6':'#D97706' }}>{r.goalsMet}%</div>
                                    <div style={{ fontSize:10, color:'#94a3b8' }}>Goals Met</div>
                                </div>
                                <div style={{ textAlign:'center' }}>
                                    <div style={{ fontSize:16, fontWeight:800, color:'#0369A1' }}>{r.tasksCompleted}</div>
                                    <div style={{ fontSize:10, color:'#94a3b8' }}>Tasks</div>
                                </div>
                                <div style={{ textAlign:'center' }}>
                                    <div style={{ fontSize:16, fontWeight:800, color:'#059669' }}>${r.revenue.toLocaleString()}</div>
                                    <div style={{ fontSize:10, color:'#94a3b8' }}>Revenue</div>
                                </div>
                            </div>
                            <ChevronRight size={16} color='#94a3b8' style={{ transition:'transform 0.2s', transform:expanded===i?'rotate(90deg)':'none', flexShrink:0 }} />
                        </div>

                        {/* Expanded detail */}
                        {expanded === i && (
                            <div style={{ borderTop:'1px solid #EDE9FE', padding:'20px 24px', background:'#FAFBFF', display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                                {/* Goals */}
                                <div>
                                    <h4 style={{ margin:'0 0 12px', fontSize:13, fontWeight:700, color:PD }}>Goals</h4>
                                    <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                                        {r.goals.map((g, gi) => (
                                            <div key={gi} style={{ display:'flex', alignItems:'center', gap:8 }}>
                                                <CheckCircle2 size={15} color={g.met?'#16A34A':'#E5E7EB'} fill={g.met?'#16A34A':'none'} />
                                                <span style={{ fontSize:12, color: g.met?'#374151':'#94a3b8' }}>{g.name}</span>
                                                {g.met && <span style={{ marginLeft:'auto', fontSize:10, fontWeight:700, color:'#16A34A' }}>✓</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                                    {/* Strengths */}
                                    <div>
                                        <h4 style={{ margin:'0 0 8px', fontSize:13, fontWeight:700, color:'#059669' }}>Strengths</h4>
                                        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                                            {r.strengths.map(s => <span key={s} style={{ background:'#DCFCE7', color:'#065F46', borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:600 }}>{s}</span>)}
                                        </div>
                                    </div>
                                    {/* Improvements */}
                                    <div>
                                        <h4 style={{ margin:'0 0 8px', fontSize:13, fontWeight:700, color:'#D97706' }}>Areas to Improve</h4>
                                        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                                            {r.improvements.map(s => <span key={s} style={{ background:'#FEF3C7', color:'#92400E', borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:600 }}>{s}</span>)}
                                        </div>
                                    </div>
                                    {/* Reviewer comment */}
                                    <div style={{ background:'#fff', border:'1px solid #EDE9FE', borderRadius:9, padding:'12px 14px' }}>
                                        <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8', marginBottom:5 }}>REVIEWER COMMENT</div>
                                        <p style={{ margin:0, fontSize:12, color:'#374151', lineHeight:1.6, fontStyle:'italic' }}>"{r.comment}"</p>
                                        <p style={{ margin:'6px 0 0', fontSize:11, color:'#94a3b8' }}>— {r.reviewer}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Documents ─────────────────────────────────────────────────────────────────
function DocumentsTab() {
    const [catFilter, setCatFilter] = useState('All');
    const cats = ['All', ...Array.from(new Set(myDocuments.map(d => d.category)))];
    const filtered = catFilter === 'All' ? myDocuments : myDocuments.filter(d => d.category === catFilter);

    return (
        <div>
            {/* Filter pills */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16, flexWrap:'wrap' }}>
                {cats.map(c => (
                    <button key={c} onClick={() => setCatFilter(c)}
                        style={{ padding:'6px 14px', borderRadius:20, border: catFilter===c?`1.5px solid ${P}`:'1.5px solid #EDE9FE', background:catFilter===c?'#F5F3FF':'#fff', color:catFilter===c?P:'#64748B', fontWeight:catFilter===c?700:500, fontSize:12, cursor:'pointer', transition:'all 0.15s' }}>
                        {c}
                    </button>
                ))}
                <span style={{ marginLeft:'auto', fontSize:12, color:'#94a3b8' }}>{filtered.length} documents</span>
            </div>

            {/* Docs grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
                {filtered.map((doc, i) => {
                    const cfg = docCategoryColor[doc.category] ?? { bg:'#F1F5F9', color:'#64748B' };
                    return (
                        <div key={i} style={{ ...card, padding:'18px 20px', display:'flex', alignItems:'flex-start', gap:14 }}>
                            <div style={{ width:46, height:46, borderRadius:11, background:cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                <FileText size={20} color={cfg.color} />
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontSize:13, fontWeight:700, color:PD, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:4 }}>{doc.name}</div>
                                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:8 }}>
                                    <span style={{ background:cfg.bg, color:cfg.color, borderRadius:20, padding:'2px 9px', fontSize:11, fontWeight:600 }}>{doc.category}</span>
                                    <span style={{ fontSize:11, color:'#94a3b8' }}>{doc.size}</span>
                                </div>
                                <div style={{ fontSize:11, color:'#94a3b8', marginBottom:2 }}>Uploaded: {doc.uploaded}</div>
                                <div style={{ fontSize:11, color: doc.expires==='Never'?'#94a3b8':'#D97706' }}>
                                    {doc.expires === 'Never' ? '∞ No expiry' : `⏳ Expires: ${doc.expires}`}
                                </div>
                            </div>
                            <div style={{ display:'flex', flexDirection:'column', gap:6, flexShrink:0 }}>
                                <button style={{ padding:'5px 12px', borderRadius:7, border:`1px solid #EDE9FE`, background:'#fff', fontSize:11, fontWeight:600, color:P, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
                                    <Eye size={11} /> View
                                </button>
                                {doc.access === 'Download' && (
                                    <button style={{ padding:'5px 12px', borderRadius:7, border:`1px solid #EDE9FE`, background:'#F5F3FF', fontSize:11, fontWeight:600, color:P, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
                                        <Download size={11} /> PDF
                                    </button>
                                )}
                                {doc.access === 'View only' && (
                                    <span style={{ padding:'5px 10px', borderRadius:7, border:'1px solid #F3F4F6', background:'#FAFAFA', fontSize:11, color:'#94a3b8', display:'flex', alignItems:'center', gap:4 }}>
                                        <Lock size={10} /> View only
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
const TABS = [
    { id:'overview',    label:'Overview',    icon:ListChecks },
    { id:'profile',     label:'My Profile',  icon:User },
    { id:'payslips',    label:'Payslips',    icon:Receipt },
    { id:'performance', label:'Performance', icon:TrendingUp },
    { id:'documents',   label:'Documents',   icon:FileText },
];

export default function EmployeeDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const todayTaskCount = myTasks.filter(t => t.due === 'Today').length;

    return (
        <AppLayout title="My Dashboard">
            <Head title="My Dashboard" />

            {/* Welcome bar */}
            <div className="dashboard-header" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{ width:48, height:48, borderRadius:'50%', background:`linear-gradient(135deg,${PD},${P})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#fff', flexShrink:0 }}>{ME.initials}</div>
                    <div>
                        <h1 style={{ fontSize:20, fontWeight:700, color:'#0F172A', margin:0 }}>Good morning, {ME.name.split(' ')[0]} 👋</h1>
                        <p style={{ color:'#64748B', fontSize:13, margin:'3px 0 0' }}>{ME.position} · {ME.department}</p>
                    </div>
                </div>
                <Link href={route('time.entry')} className="btn-gradient"
                    style={{ display:'inline-flex', alignItems:'center', gap:8, color:'#fff', borderRadius:10, padding:'10px 18px', textDecoration:'none', fontWeight:600, fontSize:14 }}>
                    <Clock size={15} /> Log Time
                </Link>
            </div>

            {/* KPIs */}
            <div className="stagger-children tp-stats-grid" style={{ marginBottom:20 }}>
                {[
                    { label:'Tasks Due Today',  numVal:todayTaskCount,  suffix:'',      color:'#DC2626', bg:'#FEF2F2', icon:AlertCircle  },
                    { label:'Total My Tasks',   numVal:myTasks.length,  suffix:'',      color:P,          bg:'#F5F3FF', icon:ListChecks   },
                    { label:'Hours This Week',  numVal:18.5,            suffix:'h',     color:'#059669', bg:'#ECFDF5', icon:Clock        },
                    { label:'Leave Remaining',  numVal:14,              suffix:' days', color:'#3B82F6', bg:'#EFF6FF', icon:CalendarRange },
                ].map((k, idx) => (
                    <div key={k.label} className="stat-card" style={{ ...card, padding:'18px 20px' }}>
                        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                            <div>
                                <p style={{ fontSize:11, color:'#64748B', fontWeight:600, margin:0, textTransform:'uppercase', letterSpacing:'0.05em' }}>{k.label}</p>
                                <p style={{ fontSize:28, fontWeight:700, color:'#0F172A', margin:'6px 0 0', lineHeight:1 }}>
                                    <AnimatedNumber value={k.numVal} suffix={k.suffix} decimals={k.numVal%1!==0?1:0} delay={idx*100} />
                                </p>
                            </div>
                            <div style={{ width:40, height:40, borderRadius:10, background:k.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <k.icon size={18} color={k.color} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tab bar */}
            <div style={{ display:'flex', gap:2, marginBottom:20, borderBottom:'2px solid #EDE9FE', paddingBottom:0 }}>
                {TABS.map(t => {
                    const active = activeTab === t.id;
                    return (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 18px', borderRadius:'8px 8px 0 0', border:'none', background:active?'#fff':'transparent', color:active?P:'#64748B', fontWeight:active?700:500, fontSize:13, cursor:'pointer', borderBottom:active?`2px solid ${P}`:'2px solid transparent', marginBottom:-2, transition:'all 0.15s' }}>
                            <t.icon size={14} />
                            {t.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab content */}
            {activeTab === 'overview'    && <OverviewTab onTabChange={setActiveTab} />}
            {activeTab === 'profile'     && <ProfileTab />}
            {activeTab === 'payslips'    && <PayslipsTab />}
            {activeTab === 'performance' && <PerformanceTab />}
            {activeTab === 'documents'   && <DocumentsTab />}
        </AppLayout>
    );
}
