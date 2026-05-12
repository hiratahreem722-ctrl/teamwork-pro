import { Link, router, usePage } from '@inertiajs/react';
import { Layout, Input, Badge, Avatar, Dropdown, Button } from 'antd';
import { PageProps } from '@/types';
import { Menu, Bell, Search, User, LogOut } from 'lucide-react';
import type { MenuProps } from 'antd';

const { Header } = Layout;

interface Props {
    title: string;
    onMenuClick: () => void;
}

export default function TopBar({ title, onMenuClick }: Props) {
    const { auth } = usePage<PageProps>().props;

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <User size={14} />,
            label: <Link href={route('profile.edit')}>Profile</Link>,
        },
        { type: 'divider' },
        {
            key: 'logout',
            icon: <LogOut size={14} />,
            label: 'Logout',
            danger: true,
            onClick: () => router.post(route('logout')),
        },
    ];

    return (
        <Header style={{
            background: '#fff',
            borderBottom: '1px solid #E2E8F0',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            height: 64,
            lineHeight: '64px',
            flexShrink: 0,
        }}>
            {/* Mobile hamburger — visible on mobile, hidden on lg+ */}
            <Button
                type="text"
                icon={<Menu size={22} />}
                onClick={onMenuClick}
                style={{ color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                className="app-sidebar-hamburger"
            />

            {/* Page title */}
            <span style={{ fontSize: 18, fontWeight: 600, color: '#1e293b', flex: 'none' }}>
                {title}
            </span>

            <div style={{ flex: 1 }} />

            {/* Search */}
            <Input
                prefix={<Search size={14} className="text-slate-400" />}
                placeholder="Search…"
                style={{ width: 192, borderRadius: 8 }}
                className="app-topbar-search"
            />

            {/* Notifications */}
            <Badge count={3} size="small">
                <Button
                    type="text"
                    icon={<Bell size={20} />}
                    style={{ color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                />
            </Badge>

            {/* User dropdown */}
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', borderRadius: 8, padding: '4px 8px' }}
                    className="hover:bg-slate-100 transition-colors"
                >
                    <Avatar style={{ background: '#7C3AED', fontWeight: 600, fontSize: 13 }} size={32}>
                        {auth?.user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                    </Avatar>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#334155' }} className="app-topbar-username">
                        {auth?.user?.name}
                    </span>
                </div>
            </Dropdown>
        </Header>
    );
}
