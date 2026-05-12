import { Link, usePage, router } from '@inertiajs/react';
import { Drawer, Avatar, Tooltip } from 'antd';
import { Layout } from 'antd';
import {
    LayoutDashboard, FolderKanban, Users, ClipboardList, BarChart3,
    Clock, FileText, Bell, Settings, CreditCard, Building2, ListChecks,
    LogOut, Briefcase, CalendarRange, Receipt, UserCheck, DollarSign,
    TrendingUp, Target, Wallet, PieChart, Sparkles, ChevronDown,
    ChevronRight, Award, Banknote, Contact, GitBranch, LogIn, Crown,
    CalendarOff, Rocket,
} from 'lucide-react';
import { PageProps, UserRole as Role } from '@/types';
import { useState } from 'react';

const { Sider } = Layout;

// ── Color tokens ────────────────────────────────────────────────────────────
const SIDEBAR_BG   = '#1E1B4B';
const ACTIVE_BG    = 'rgba(167,139,250,0.18)';
const HOVER_BG     = 'rgba(255,255,255,0.06)';
const GROUP_LABEL  = 'rgba(255,255,255,0.28)';
const ITEM_COLOR   = 'rgba(255,255,255,0.72)';
const ACTIVE_COLOR = '#C4B5FD';

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: number;
}

interface NavGroup {
    group: string;
    items: NavItem[];
}

// ── Nav definitions by role ─────────────────────────────────────────────────
const navByRole: Record<Role, NavGroup[]> = {
    owner: [
        {
            group: 'Overview',
            items: [
                { label: 'Dashboard',        href: route('dashboard'),          icon: LayoutDashboard },
            ],
        },
        {
            group: 'Workspace',
            items: [
                { label: 'Projects',         href: route('owner.projects'),     icon: FolderKanban },
                { label: 'Team',             href: route('owner.team'),         icon: Users },
                { label: 'Timesheets',       href: route('owner.timesheets'),   icon: ClipboardList },
                { label: 'Reports',          href: route('owner.reports'),      icon: BarChart3 },
            ],
        },
        {
            group: 'HR',
            items: [
                { label: 'Leave Approvals',  href: route('leave.approvals'),    icon: CalendarOff },
                { label: 'Leave Policy',     href: route('leave.policy'),       icon: Award },
                { label: 'Payroll',          href: route('payroll.index'),      icon: Banknote },
            ],
        },
        {
            group: 'Setup',
            items: [
                { label: 'Onboarding',       href: route('onboarding'),         icon: Rocket },
                { label: 'Settings',         href: route('owner.settings'),     icon: Settings },
            ],
        },
    ],

    super_admin: [
        {
            group: 'Navigation',
            items: [
                { label: 'Dashboard',  href: route('dashboard'),          icon: LayoutDashboard },
                { label: 'Tenants',    href: route('admin.tenants'),      icon: Building2 },
                { label: 'Users',      href: route('admin.users'),        icon: Users },
                { label: 'Analytics',  href: route('admin.analytics'),    icon: BarChart3 },
                { label: 'Billing',    href: route('admin.billing'),      icon: CreditCard },
                { label: 'Settings',   href: route('admin.settings'),     icon: Settings },
            ],
        },
    ],

    manager: [
        {
            group: 'Overview',
            items: [
                { label: 'Dashboard',    href: route('dashboard'),          icon: LayoutDashboard },
            ],
        },
        {
            group: 'Work',
            items: [
                { label: 'Projects',     href: route('projects.index'),     icon: FolderKanban },
                { label: 'Smart Tasks',  href: route('ai.smart-tasks'),     icon: Sparkles },
                { label: 'Resources',    href: route('resources.index'),    icon: CalendarRange },
                { label: 'Timesheets',   href: route('timesheets.index'),   icon: ClipboardList },
            ],
        },
        {
            group: 'HR & People',
            items: [
                { label: 'Employees',        href: route('hr.employees'),       icon: Users },
                { label: 'Attendance',       href: route('attendance.clockin'), icon: LogIn },
                { label: 'Leave Approvals',  href: route('leave.approvals'),    icon: CalendarOff },
                { label: 'Leave Policy',     href: route('leave.policy'),       icon: Award },
                { label: 'Performance',      href: route('hr.performance'),     icon: Award },
            ],
        },
        {
            group: 'CRM & Sales',
            items: [
                { label: 'Pipeline',     href: route('crm.pipeline'),       icon: GitBranch },
                { label: 'Leads',        href: route('crm.leads'),          icon: Target },
                { label: 'Clients',      href: route('clients.index'),      icon: Briefcase },
            ],
        },
        {
            group: 'Finance',
            items: [
                { label: 'Invoices',     href: route('finance.invoices'),   icon: FileText },
                { label: 'Expenses',     href: route('finance.expenses'),   icon: Wallet },
                { label: 'Reports',      href: route('reports.index'),      icon: BarChart3 },
            ],
        },
        {
            group: 'Settings',
            items: [
                { label: 'Settings',     href: route('manager.settings'),   icon: Settings },
            ],
        },
    ],

    employee: [
        {
            group: 'Overview',
            items: [
                { label: 'Dashboard',    href: route('dashboard'),          icon: LayoutDashboard },
            ],
        },
        {
            group: 'My Work',
            items: [
                { label: 'My Tasks',     href: route('tasks.my'),           icon: ListChecks },
                { label: 'Projects',     href: route('projects.index'),     icon: FolderKanban },
                { label: 'Clock In/Out', href: route('attendance.clockin'), icon: LogIn },
                { label: 'Time Entry',   href: route('time.entry'),         icon: Clock },
                { label: 'Timesheets',   href: route('time.my'),            icon: ClipboardList },
            ],
        },
        {
            group: 'HR & Payroll',
            items: [
                { label: 'My Leaves',    href: route('leave.my'),           icon: CalendarOff },
                { label: 'Payslips',     href: route('payroll.payslips'),   icon: Receipt },
                { label: 'Performance',  href: route('hr.performance'),     icon: Award },
            ],
        },
        {
            group: 'More',
            items: [
                { label: 'Documents',    href: route('documents.index'),    icon: FileText },
                { label: 'Notifications',href: route('notifications.index'),icon: Bell },
            ],
        },
    ],

    client: [
        {
            group: 'Overview',
            items: [
                { label: 'Dashboard',    href: route('dashboard'),          icon: LayoutDashboard },
            ],
        },
        {
            group: 'My Account',
            items: [
                { label: 'Projects',     href: route('projects.index'),     icon: FolderKanban },
                { label: 'Invoices',     href: route('finance.invoices'),   icon: Receipt },
                { label: 'Documents',    href: route('documents.index'),    icon: FileText },
                { label: 'Notifications',href: route('notifications.index'),icon: Bell },
            ],
        },
    ],
};

const roleLabel: Record<Role, string> = {
    owner:       'Owner',
    super_admin: 'Super Admin',
    manager:     'Manager',
    employee:    'Employee',
    client:      'Client',
};

function getActivePath(): string {
    return window.location.pathname;
}

function isActive(href: string): boolean {
    try {
        const path = new URL(href).pathname;
        const cur  = getActivePath();
        return cur === path || (path !== '/' && cur.startsWith(path));
    } catch {
        return getActivePath().startsWith(href);
    }
}

interface Props { open: boolean; onClose: () => void; }

function SidebarContent({ role, groups, user }: { role: Role; groups: NavGroup[]; user: any }) {
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

    const toggleGroup = (g: string) => setCollapsed(prev => ({ ...prev, [g]: !prev[g] }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: SIDEBAR_BG, position: 'relative', overflow: 'hidden' }}>
            {/* Decorative blobs */}
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: '#3B1FA8', opacity: 0.25, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 100, left: -50, width: 160, height: 160, borderRadius: '50%', background: '#7C3AED', opacity: 0.12, pointerEvents: 'none' }} />

            {/* Logo */}
            <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 1, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#7C3AED,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(124,58,237,0.5)', flexShrink: 0 }}>
                        <span style={{ color: '#fff', fontWeight: 900, fontSize: 14, letterSpacing: '-0.5px' }}>T</span>
                    </div>
                    <div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '-0.3px', lineHeight: 1 }}>Teamwork Pro</div>
                        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 2, lineHeight: 1 }}>Unified Management</div>
                    </div>
                </div>
            </div>

            {/* Nav groups */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0', position: 'relative', zIndex: 1 }}>
                {groups.map(({ group, items }) => {
                    const isCollapsed = collapsed[group];
                    return (
                        <div key={group} style={{ marginBottom: 4 }}>
                            {/* Group label */}
                            <button
                                onClick={() => toggleGroup(group)}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 18px 4px', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <span style={{ fontSize: 10, fontWeight: 700, color: GROUP_LABEL, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{group}</span>
                                {isCollapsed
                                    ? <ChevronRight size={10} color={GROUP_LABEL} />
                                    : <ChevronDown  size={10} color={GROUP_LABEL} />
                                }
                            </button>

                            {/* Items */}
                            {!isCollapsed && items.map(item => {
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px 7px 14px', margin: '1px 8px', borderRadius: 8, textDecoration: 'none', background: active ? ACTIVE_BG : 'transparent', transition: 'background 0.12s', position: 'relative' }}
                                        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = HOVER_BG; }}
                                        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                                    >
                                        {active && (
                                            <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 18, borderRadius: 2, background: '#A78BFA' }} />
                                        )}
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 7, background: active ? 'rgba(167,139,250,0.2)' : 'transparent', flexShrink: 0 }}>
                                            <item.icon size={14} color={active ? ACTIVE_COLOR : ITEM_COLOR} strokeWidth={active ? 2.2 : 1.8} />
                                        </span>
                                        <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? '#E9D5FF' : ITEM_COLOR, flex: 1 }}>{item.label}</span>
                                        {item.badge ? (
                                            <span style={{ background: '#7C3AED', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{item.badge}</span>
                                        ) : null}
                                    </Link>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* User footer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '10px 12px', position: 'relative', zIndex: 1, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderRadius: 10, padding: '8px 10px', background: 'rgba(255,255,255,0.05)' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <Avatar style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', fontWeight: 700, fontSize: 13 }} size={34}>
                            {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                        </Avatar>
                        <span style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: '#4ade80', border: '2px solid #1E1B4B' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3 }}>{user?.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 1 }}>{roleLabel[role]}</div>
                    </div>
                    <Tooltip title="Logout">
                        <button onClick={() => router.post(route('logout'))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                        >
                            <LogOut size={14} />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}

export default function Sidebar({ open, onClose }: Props) {
    const { auth } = usePage<PageProps>().props;
    const role: Role   = auth?.user?.role ?? 'employee';
    const groups       = navByRole[role] ?? [];

    return (
        <>
            <Sider width={224} style={{ background: SIDEBAR_BG, position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100, overflow: 'hidden' }} className="app-sidebar-desktop" trigger={null}>
                <SidebarContent role={role} groups={groups} user={auth?.user} />
            </Sider>
            <Drawer open={open} onClose={onClose} placement="left" width={224}
                styles={{ body: { padding: 0, background: SIDEBAR_BG }, header: { display: 'none' }, wrapper: { boxShadow: 'none' } }}
                className="lg:hidden"
            >
                <SidebarContent role={role} groups={groups} user={auth?.user} />
            </Drawer>
        </>
    );
}
