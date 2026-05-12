import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Select, Typography } from 'antd';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { useState } from 'react';

const { Text } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────

interface MonthRow {
    month: string;
    revenue: number;
    expenses: number;
    invoicesSent: number;
}

interface ClientRow {
    client: string;
    revenue: number;
    invoices: number;
}

interface CategoryBar {
    category: string;
    amount: number;
    color: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const monthlyData: MonthRow[] = [
    { month: 'Dec 2025', revenue: 38200, expenses: 12400, invoicesSent: 7 },
    { month: 'Jan 2026', revenue: 41800, expenses: 13900, invoicesSent: 8 },
    { month: 'Feb 2026', revenue: 44500, expenses: 14200, invoicesSent: 9 },
    { month: 'Mar 2026', revenue: 52600, expenses: 15800, invoicesSent: 11 },
    { month: 'Apr 2026', revenue: 58900, expenses: 16700, invoicesSent: 12 },
    { month: 'May 2026', revenue: 48500, expenses: 16200, invoicesSent: 10 },
];

const topClients: ClientRow[] = [
    { client: 'HealthFirst Inc',     revenue: 59700, invoices: 4 },
    { client: 'E-commerce Platform', revenue: 53500, invoices: 5 },
    { client: 'Zeta Solutions',      revenue: 41900, invoices: 4 },
    { client: 'Delta Finance',       revenue: 30200, invoices: 3 },
    { client: 'Beta Manufacturing',  revenue: 18700, invoices: 2 },
    { client: 'Massive Dynamic',     revenue: 23600, invoices: 3 },
];

const totalRevenue = 284500;

const expenseCategories: CategoryBar[] = [
    { category: 'Payroll & Benefits', amount: 52000, color: '#7C3AED' },
    { category: 'Software & Tools',   amount: 12400, color: '#3B82F6' },
    { category: 'Travel',             amount: 8200,  color: '#06B6D4' },
    { category: 'Marketing',          amount: 7600,  color: '#EC4899' },
    { category: 'Equipment',          amount: 4900,  color: '#10B981' },
    { category: 'Office & Admin',     amount: 4100,  color: '#F59E0B' },
];

const totalExpenses = expenseCategories.reduce((s, c) => s + c.amount, 0);
const maxExpense = Math.max(...expenseCategories.map(c => c.amount));

// ─── Shared styles ─────────────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #EDE9FE',
    borderRadius: 12,
    boxShadow: '0 1px 3px rgba(124,58,237,0.06)',
    padding: '20px 24px',
};

function fmt(n: number) { return '$' + n.toLocaleString(); }
function fmtK(n: number) { return n >= 1000 ? '$' + (n / 1000).toFixed(0) + 'k' : '$' + n; }

// ─── KPI Card ──────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, icon, trend }: {
    label: string; value: string; sub?: string;
    icon: React.ReactNode; trend?: 'up' | 'down';
}) {
    return (
        <div style={{ ...cardStyle, flex: 1, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#1E1B4B', lineHeight: 1 }}>{value}</div>
                {sub && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                        {trend === 'up' && <TrendingUp size={12} style={{ color: '#16A34A' }} />}
                        {trend === 'down' && <TrendingDown size={12} style={{ color: '#DC2626' }} />}
                        <span style={{ fontSize: 12, color: trend === 'up' ? '#16A34A' : trend === 'down' ? '#DC2626' : '#94A3B8' }}>{sub}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Bar Chart (div-based, no library) ────────────────────────────────────────

function BarChart() {
    const maxRev = Math.max(...monthlyData.map(m => m.revenue));

    return (
        <div style={{ ...cardStyle, flex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1E1B4B' }}>Revenue vs Expenses</div>
                    <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Last 6 months</div>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                    {[{ color: '#7C3AED', label: 'Revenue' }, { color: '#EDE9FE', label: 'Expenses', border: '#C4B5FD' }].map(l => (
                        <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color, border: l.border ? `1px solid ${l.border}` : undefined }} />
                            <span style={{ fontSize: 12, color: '#64748B' }}>{l.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chart area */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 180, borderBottom: '1px solid #EDE9FE', paddingBottom: 0 }}>
                {monthlyData.map(m => {
                    const revH = Math.round((m.revenue / maxRev) * 160);
                    const expH = Math.round((m.expenses / maxRev) * 160);
                    return (
                        <div key={m.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, width: 48 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 160 }}>
                                <div
                                    style={{
                                        width: 18, height: revH, background: 'linear-gradient(180deg, #7C3AED 0%, #4F46E5 100%)',
                                        borderRadius: '4px 4px 0 0',
                                        transition: 'height 0.3s',
                                        position: 'relative',
                                    }}
                                    title={fmt(m.revenue)}
                                />
                                <div
                                    style={{
                                        width: 18, height: expH, background: '#EDE9FE',
                                        border: '1px solid #C4B5FD',
                                        borderRadius: '4px 4px 0 0',
                                        transition: 'height 0.3s',
                                    }}
                                    title={fmt(m.expenses)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* X-axis labels */}
            <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 8 }}>
                {monthlyData.map(m => (
                    <div key={m.month} style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center', width: 48 }}>
                        {m.month.split(' ')[0]}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Monthly Table ─────────────────────────────────────────────────────────────

function MonthlyTable() {
    return (
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #EDE9FE' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1E1B4B' }}>Monthly Breakdown</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#F5F3FF' }}>
                        {['MONTH', 'REVENUE', 'EXPENSES', 'PROFIT', 'MARGIN %', 'INVOICES SENT'].map(h => (
                            <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em', textAlign: h === 'MONTH' ? 'left' : 'right', borderBottom: '1px solid #EDE9FE' }}>
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...monthlyData].reverse().map((row, i) => {
                        const profit = row.revenue - row.expenses;
                        const margin = ((profit / row.revenue) * 100).toFixed(1);
                        return (
                            <tr
                                key={row.month}
                                style={{ borderBottom: '1px solid #F8F7FF', transition: 'background 0.15s' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FAFAFF'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
                            >
                                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1E1B4B', fontSize: 13 }}>{row.month}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#16A34A', fontSize: 13 }}>{fmt(row.revenue)}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', color: '#DC2626', fontSize: 13 }}>{fmt(row.expenses)}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#1E1B4B', fontSize: 13 }}>{fmt(profit)}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13 }}>
                                    <span style={{ color: parseFloat(margin) >= 65 ? '#16A34A' : '#D97706', fontWeight: 600 }}>{margin}%</span>
                                </td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', color: '#64748B', fontSize: 13 }}>{row.invoicesSent}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// ─── Top Clients Table ─────────────────────────────────────────────────────────

function TopClientsTable() {
    return (
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', flex: 1 }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #EDE9FE' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1E1B4B' }}>Top Clients by Revenue</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#F5F3FF' }}>
                        {['CLIENT', 'REVENUE', '% OF TOTAL', 'INVOICES'].map(h => (
                            <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em', textAlign: h === 'CLIENT' ? 'left' : 'right', borderBottom: '1px solid #EDE9FE' }}>
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {topClients.sort((a, b) => b.revenue - a.revenue).map((row, i) => {
                        const pct = ((row.revenue / totalRevenue) * 100).toFixed(1);
                        return (
                            <tr
                                key={row.client}
                                style={{ borderBottom: '1px solid #F8F7FF', transition: 'background 0.15s' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FAFAFF'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
                            >
                                <td style={{ padding: '12px 16px', fontSize: 13 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: ['#7C3AED','#3B82F6','#10B981','#F59E0B','#EC4899','#06B6D4'][i] }} />
                                        <span style={{ fontWeight: 600, color: '#1E1B4B' }}>{row.client}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#1E1B4B', fontSize: 13 }}>{fmt(row.revenue)}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                                        <div style={{ width: 60, height: 6, borderRadius: 3, background: '#EDE9FE', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${pct}%`, background: '#7C3AED', borderRadius: 3 }} />
                                        </div>
                                        <span style={{ color: '#64748B', minWidth: 36, textAlign: 'right' }}>{pct}%</span>
                                    </div>
                                </td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', color: '#64748B', fontSize: 13 }}>{row.invoices}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// ─── Expense Breakdown ─────────────────────────────────────────────────────────

function ExpenseBreakdown() {
    return (
        <div style={{ ...cardStyle, flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1E1B4B', marginBottom: 4 }}>Expenses by Category</div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 20 }}>Total: {fmt(totalExpenses)}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {expenseCategories.map(cat => {
                    const pct = ((cat.amount / maxExpense) * 100).toFixed(0);
                    const pctOfTotal = ((cat.amount / totalExpenses) * 100).toFixed(1);
                    return (
                        <div key={cat.category}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>{cat.category}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: '#1E1B4B' }}>
                                    {fmt(cat.amount)} <span style={{ fontWeight: 400, color: '#94A3B8', fontSize: 11 }}>({pctOfTotal}%)</span>
                                </span>
                            </div>
                            <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                                <div
                                    style={{
                                        height: '100%',
                                        width: `${pct}%`,
                                        background: cat.color,
                                        borderRadius: 4,
                                        transition: 'width 0.4s',
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function Reports() {
    const [period, setPeriod] = useState('This Month');

    const grossProfit = 195300;
    const netMargin = 68.7;

    return (
        <AppLayout title="Financial Reports">
            <Head title="Financial Reports" />

            <div style={{ padding: '28px 32px', background: '#F5F3FF', minHeight: '100vh' }}>

                {/* Page header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#1E1B4B' }}>Financial Reports</h1>
                        <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: 14 }}>Executive P&L overview</p>
                    </div>
                    <Select
                        value={period}
                        onChange={setPeriod}
                        style={{ width: 180 }}
                        options={[
                            { label: 'This Month',   value: 'This Month' },
                            { label: 'This Quarter', value: 'This Quarter' },
                            { label: 'This Year',    value: 'This Year' },
                        ]}
                    />
                </div>

                {/* KPI row */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                    <KpiCard
                        label="Revenue"
                        value="$284,500"
                        sub="+12.4% vs last period"
                        icon={<DollarSign size={20} />}
                        trend="up"
                    />
                    <KpiCard
                        label="Expenses"
                        value="$89,200"
                        sub="+3.1% vs last period"
                        icon={<TrendingDown size={20} />}
                        trend="down"
                    />
                    <KpiCard
                        label="Gross Profit"
                        value="$195,300"
                        sub="+18.6% vs last period"
                        icon={<TrendingUp size={20} />}
                        trend="up"
                    />
                    <KpiCard
                        label="Net Margin"
                        value="68.7%"
                        sub="Healthy margin"
                        icon={<Percent size={20} />}
                    />
                </div>

                {/* Bar chart */}
                <div style={{ marginBottom: 24 }}>
                    <BarChart />
                </div>

                {/* Monthly table */}
                <div style={{ marginBottom: 24 }}>
                    <MonthlyTable />
                </div>

                {/* Bottom row: top clients + expense breakdown */}
                <div style={{ display: 'flex', gap: 16 }}>
                    <TopClientsTable />
                    <ExpenseBreakdown />
                </div>
            </div>
        </AppLayout>
    );
}
