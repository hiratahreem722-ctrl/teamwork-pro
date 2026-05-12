import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import Badge from '@/Components/Badge';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Search, LayoutGrid, List, Users, Calendar, TrendingUp, FolderKanban } from 'lucide-react';
import { useState } from 'react';
import NewProjectModal from './NewProjectModal';
import type { PageProps } from '@/types';

// ── All projects ──────────────────────────────────────────────────────────────
interface Project {
    id: number; name: string; client: string; status: string;
    progress: number; team: number; due: string; budget: string; spent: string;
    // which employees are assigned (by name)
    assignedTo: string[];
    // the employee's role in this project
    memberRoles: Record<string, string>;
}

const projects: Project[] = [
    {
        id: 1, name: 'Website Redesign',    client: 'Acme Corp',  status: 'In Progress', progress: 65,  team: 4, due: 'Apr 15, 2026', budget: '$12,000', spent: '$7,800',
        assignedTo: ['Sara Kim', 'Hamza Ali', 'Marcus Chen', 'Lisa Park'],
        memberRoles: { 'Sara Kim': 'Lead Dev', 'Hamza Ali': 'Lead Designer', 'Marcus Chen': 'Dev', 'Lisa Park': 'PM' },
    },
    {
        id: 2, name: 'Mobile App v2',       client: 'Beta Inc',   status: 'In Review',   progress: 88,  team: 3, due: 'Apr 3, 2026',  budget: '$18,000', spent: '$16,200',
        assignedTo: ['Sara Kim', 'Hamza Ali', 'Lisa Park'],
        memberRoles: { 'Sara Kim': 'Contributor', 'Hamza Ali': 'Designer', 'Lisa Park': 'PM' },
    },
    {
        id: 3, name: 'API Integration',     client: 'Internal',   status: 'Backlog',     progress: 10,  team: 2, due: 'May 1, 2026',  budget: '$6,000',  spent: '$600',
        assignedTo: ['Sara Kim', 'Marcus Chen'],
        memberRoles: { 'Sara Kim': 'Lead Dev', 'Marcus Chen': 'Dev' },
    },
    {
        id: 4, name: 'Brand Identity Kit',  client: 'Gamma Ltd',  status: 'Completed',   progress: 100, team: 3, due: 'Mar 28, 2026', budget: '$4,500',  spent: '$4,300',
        assignedTo: ['Hamza Ali', 'Lisa Park', 'Nina Kovač'],
        memberRoles: { 'Hamza Ali': 'Lead Designer', 'Lisa Park': 'PM', 'Nina Kovač': 'HR Liaison' },
    },
    {
        id: 5, name: 'CRM Dashboard',       client: 'Delta Co',   status: 'In Progress', progress: 42,  team: 5, due: 'May 20, 2026', budget: '$22,000', spent: '$9,200',
        assignedTo: ['Marcus Chen', 'Nina Kovač', 'Priya Sharma', 'Carlos Ruiz', 'Ali Hassan'],
        memberRoles: { 'Marcus Chen': 'Backend Dev', 'Nina Kovač': 'HR Liaison', 'Priya Sharma': 'Data Analyst', 'Carlos Ruiz': 'Sales', 'Ali Hassan': 'QA' },
    },
    {
        id: 6, name: 'E-Commerce Platform', client: 'Epsilon SA', status: 'Backlog',     progress: 5,   team: 6, due: 'Jun 10, 2026', budget: '$35,000', spent: '$1,500',
        assignedTo: ['Sara Kim', 'Marcus Chen', 'Hamza Ali', 'Lisa Park', 'Sophie Turner', 'Ali Hassan'],
        memberRoles: { 'Sara Kim': 'Lead Dev', 'Marcus Chen': 'Dev', 'Hamza Ali': 'Designer', 'Lisa Park': 'PM', 'Sophie Turner': 'Dev', 'Ali Hassan': 'QA' },
    },
];

// Map auth user name → employee name in project data
function resolveEmployeeName(authName: string): string {
    const map: Record<string, string> = {
        'Sara Employee': 'Sara Kim',
        'Sara Kim':      'Sara Kim',
        'Hamza Ali':     'Hamza Ali',
        'Lisa Park':     'Lisa Park',
        'Marcus Chen':   'Marcus Chen',
        'Nina Kovač':    'Nina Kovač',
    };
    return map[authName] ?? authName;
}

const statusVariant: Record<string, 'blue' | 'amber' | 'slate' | 'green'> = {
    'In Progress': 'blue',
    'In Review':   'amber',
    'Backlog':     'slate',
    'Completed':   'green',
};

const roleColor: Record<string, { bg: string; text: string }> = {
    'Lead Dev':      { bg: '#EDE9FE', text: '#7C3AED' },
    'Dev':           { bg: '#EFF6FF', text: '#2563EB' },
    'Contributor':   { bg: '#F0FDF4', text: '#16A34A' },
    'Lead Designer': { bg: '#FFF7ED', text: '#EA580C' },
    'Designer':      { bg: '#FEF9C3', text: '#CA8A04' },
    'PM':            { bg: '#F0FDFA', text: '#0D9488' },
    'HR Liaison':    { bg: '#FDF4FF', text: '#A21CAF' },
    'Data Analyst':  { bg: '#ECFDF5', text: '#059669' },
    'Backend Dev':   { bg: '#EDE9FE', text: '#6D28D9' },
    'Sales':         { bg: '#FFF1F2', text: '#BE123C' },
    'QA':            { bg: '#FEF3C7', text: '#D97706' },
};

function ProgressBar({ pct }: { pct: number }) {
    const color = pct === 100 ? 'bg-green-500' : pct >= 70 ? 'bg-brand-600' : pct >= 30 ? 'bg-amber-500' : 'bg-red-400';
    return (
        <div className="h-1.5 w-full rounded-full bg-slate-100">
            <div className={`h-1.5 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
        </div>
    );
}

export default function ProjectsIndex() {
    const { auth } = usePage<PageProps>().props;
    const role = auth.user.role;
    const isManager = role === 'manager' || role === 'owner' || role === 'super_admin';
    const myName = resolveEmployeeName(auth.user.name);

    // Employees only see projects they're assigned to
    const myProjects = isManager ? projects : projects.filter(p => p.assignedTo.includes(myName));

    const [view, setView]           = useState<'grid' | 'list'>('grid');
    const [search, setSearch]       = useState('');
    const [filter, setFilter]       = useState('All');
    const [showNewProject, setShowNewProject] = useState(false);

    const statuses = ['All', 'In Progress', 'In Review', 'Backlog', 'Completed'];
    const filtered = myProjects.filter(p =>
        (filter === 'All' || p.status === filter) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout title="Projects">
            <Head title="Projects" />

            <PageHeader
                title={isManager ? 'Projects' : 'My Projects'}
                subtitle={isManager
                    ? `${projects.length} total projects`
                    : `${myProjects.length} project${myProjects.length !== 1 ? 's' : ''} assigned to you`}
                action={isManager ? (
                    <button
                        onClick={() => setShowNewProject(true)}
                        style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)', border: 'none' }}
                        className="flex items-center gap-2 rounded-btn px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                        <Plus size={16} /> New Project
                    </button>
                ) : undefined}
            />

            {/* Empty state for employee with no projects */}
            {!isManager && myProjects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: 16, border: '1px solid #EDE9FE' }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <FolderKanban size={28} color="#7C3AED" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0F172A' }}>No projects assigned yet</h3>
                    <p style={{ margin: '8px 0 0', fontSize: 14, color: '#64748B' }}>Your manager will assign you to projects. Check back soon!</p>
                </div>
            ) : (
                <>
                    {/* Toolbar */}
                    <div className="mb-5 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm w-64 shadow-sm focus-within:border-brand-400 transition-colors">
                                <Search size={14} className="text-slate-400 shrink-0" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search projects..."
                                    className="flex-1 bg-transparent text-slate-700 placeholder:text-slate-400 text-sm border-0 outline-none ring-0 focus:ring-0 p-0"
                                />
                            </div>
                            <div className="ml-auto flex rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
                                <button onClick={() => setView('grid')} style={view === 'grid' ? { background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)', border: 'none' } : {}} className={`p-2 transition-colors ${view === 'grid' ? 'text-white' : 'text-slate-500 hover:bg-slate-50'}`}><LayoutGrid size={16} /></button>
                                <button onClick={() => setView('list')} style={view === 'list' ? { background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)', border: 'none' } : {}} className={`p-2 transition-colors ${view === 'list' ? 'text-white' : 'text-slate-500 hover:bg-slate-50'}`}><List size={16} /></button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {statuses.map(s => (
                                <button key={s} onClick={() => setFilter(s)}
                                    style={filter === s ? { background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)', border: 'none' } : {}}
                                    className={`rounded-full px-3.5 py-1 text-xs font-medium transition-opacity ${filter === s ? 'text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid view */}
                    {view === 'grid' && (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {filtered.map(p => {
                                const myRole = p.memberRoles[myName];
                                const roleStyle = myRole ? (roleColor[myRole] ?? { bg: '#F5F3FF', text: '#7C3AED' }) : null;
                                return (
                                    <Link key={p.id} href={route('projects.show', p.id)} className="block rounded-card border border-slate-200 bg-card p-5 shadow-sm hover:border-brand-400 hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-slate-800 leading-snug">{p.name}</h3>
                                                <p className="text-xs text-slate-400 mt-0.5">{p.client}</p>
                                            </div>
                                            <Badge label={p.status} variant={statusVariant[p.status]} />
                                        </div>

                                        {/* My role badge (employee only) */}
                                        {!isManager && myRole && roleStyle && (
                                            <div style={{ marginBottom: 10 }}>
                                                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: roleStyle.bg, color: roleStyle.text }}>
                                                    Your role: {myRole}
                                                </span>
                                            </div>
                                        )}

                                        <ProgressBar pct={p.progress} />
                                        <p className="mt-1 text-right text-xs text-slate-400">{p.progress}%</p>

                                        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                                            <span className="flex items-center gap-1"><Users size={12} /> {p.team} members</span>
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {p.due}</span>
                                        </div>

                                        {/* Budget only for managers */}
                                        {isManager && (
                                            <div className="mt-2 flex items-center justify-between text-xs">
                                                <span className="text-slate-400">Budget: <span className="font-medium text-slate-600">{p.budget}</span></span>
                                                <span className="text-slate-400">Spent: <span className="font-medium text-slate-600">{p.spent}</span></span>
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* List view */}
                    {view === 'list' && (
                        <div className="rounded-card border border-slate-200 bg-card shadow-sm overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-5 py-3 text-left">Project</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Progress</th>
                                        {!isManager && <th className="px-4 py-3 text-left">My Role</th>}
                                        <th className="px-4 py-3 text-left">Team</th>
                                        <th className="px-4 py-3 text-left">Due Date</th>
                                        {isManager && <th className="px-4 py-3 text-left">Budget</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filtered.map(p => {
                                        const myRole = p.memberRoles[myName];
                                        const roleStyle = myRole ? (roleColor[myRole] ?? { bg: '#F5F3FF', text: '#7C3AED' }) : null;
                                        return (
                                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <Link href={route('projects.show', p.id)} className="font-medium text-slate-800 hover:text-brand-600">{p.name}</Link>
                                                    <p className="text-xs text-slate-400">{p.client}</p>
                                                </td>
                                                <td className="px-4 py-3.5"><Badge label={p.status} variant={statusVariant[p.status]} /></td>
                                                <td className="px-4 py-3.5 w-36">
                                                    <ProgressBar pct={p.progress} />
                                                    <span className="text-xs text-slate-400">{p.progress}%</span>
                                                </td>
                                                {!isManager && (
                                                    <td className="px-4 py-3.5">
                                                        {myRole && roleStyle ? (
                                                            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: roleStyle.bg, color: roleStyle.text }}>
                                                                {myRole}
                                                            </span>
                                                        ) : <span className="text-slate-400 text-xs">—</span>}
                                                    </td>
                                                )}
                                                <td className="px-4 py-3.5 text-slate-600">{p.team}</td>
                                                <td className="px-4 py-3.5 text-slate-600">{p.due}</td>
                                                {isManager && <td className="px-4 py-3.5 text-slate-600">{p.budget}</td>}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {isManager && <NewProjectModal open={showNewProject} onClose={() => setShowNewProject(false)} />}
        </AppLayout>
    );
}
