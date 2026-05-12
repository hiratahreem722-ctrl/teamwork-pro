import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import Badge from '@/Components/Badge';
import { Head } from '@inertiajs/react';
import { Plus, Search, MoreHorizontal, UserCheck } from 'lucide-react';
import { useState } from 'react';

const users = [
    { id: 1, name: 'Hamza Ahmed',   email: 'hamza@ump.test',   role: 'employee',    tenant: 'Acme Corp',  status: 'Active',  lastSeen: '2h ago',    joined: 'Jan 12, 2026' },
    { id: 2, name: 'Dev Ahmad',     email: 'dev@ump.test',     role: 'employee',    tenant: 'Acme Corp',  status: 'Active',  lastSeen: '1h ago',    joined: 'Jan 12, 2026' },
    { id: 3, name: 'Sarah Manager', email: 'manager@ump.test', role: 'manager',     tenant: 'Acme Corp',  status: 'Active',  lastSeen: '30m ago',   joined: 'Jan 10, 2026' },
    { id: 4, name: 'Admin User',    email: 'admin@ump.test',   role: 'super_admin', tenant: '—',          status: 'Active',  lastSeen: '10m ago',   joined: 'Jan 1, 2026'  },
    { id: 5, name: 'Beta Manager',  email: 'bm@beta.test',     role: 'manager',     tenant: 'Beta Inc',   status: 'Active',  lastSeen: 'Yesterday', joined: 'Feb 5, 2026'  },
    { id: 6, name: 'Delta CEO',     email: 'ceo@delta.test',   role: 'manager',     tenant: 'Delta Co',   status: 'Active',  lastSeen: '3h ago',    joined: 'Dec 6, 2025'  },
    { id: 7, name: 'Epsilon User',  email: 'eu@epsilon.test',  role: 'employee',    tenant: 'Epsilon SA', status: 'Trial',   lastSeen: '1 day ago', joined: 'Apr 1, 2026'  },
    { id: 8, name: 'Gamma PM',      email: 'pm@gamma.test',    role: 'manager',     tenant: 'Gamma Ltd',  status: 'Active',  lastSeen: '5h ago',    joined: 'Jan 24, 2026' },
];

const roleVariant: Record<string, 'red'|'indigo'|'blue'|'slate'> = {
    super_admin: 'red', manager: 'indigo', employee: 'blue', client: 'slate'
};

export default function UsersPage() {
    const [search, setSearch] = useState('');
    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout title="Users">
            <Head title="Users" />
            <PageHeader
                title="User Management"
                subtitle={`${users.length} total users`}
                action={
                    <button className="flex items-center gap-2 rounded-btn bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
                        <Plus size={16} /> Add User
                    </button>
                }
            />

            <div className="mb-4 flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 w-60 shadow-sm focus-within:border-brand-400 transition-colors">
                    <Search size={14} className="text-slate-400 shrink-0" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
                        className="flex-1 bg-transparent text-slate-700 placeholder:text-slate-400 text-sm border-0 outline-none ring-0 focus:ring-0 p-0" />
                </div>
                <span className="text-sm text-slate-500">{filtered.length} results</span>
            </div>

            <div className="rounded-card border border-slate-200 bg-card shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-5 py-3 text-left">User</th>
                            <th className="px-4 py-3 text-left">Role</th>
                            <th className="px-4 py-3 text-left">Tenant</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Last Seen</th>
                            <th className="px-4 py-3 text-left">Joined</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50">
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white shrink-0">{u.name[0]}</div>
                                        <div>
                                            <p className="font-medium text-slate-800">{u.name}</p>
                                            <p className="text-xs text-slate-400">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <Badge label={u.role.replace('_', ' ')} variant={roleVariant[u.role]} />
                                </td>
                                <td className="px-4 py-3.5 text-slate-600">{u.tenant}</td>
                                <td className="px-4 py-3.5">
                                    <Badge label={u.status} variant={u.status === 'Active' ? 'green' : 'amber'} />
                                </td>
                                <td className="px-4 py-3.5 text-slate-500">{u.lastSeen}</td>
                                <td className="px-4 py-3.5 text-slate-500 text-xs">{u.joined}</td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <button className="text-slate-400 hover:text-brand-600"><UserCheck size={15} /></button>
                                        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={15} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
