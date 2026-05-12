import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Card, Typography, Button, Table, Tag, Modal } from 'antd';
import { ArrowLeft, Lock, RefreshCw, Printer } from 'lucide-react';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { PageProps } from '@/types';

const { Text } = Typography;

// ── Types ─────────────────────────────────────────────────────────────────────

interface RunSummary {
    id:               number;
    month:            number;
    year:             number;
    month_label:      string;
    status:           'draft' | 'finalized';
    employee_count:   number;
    total_gross:      string;
    total_deductions: string;
    total_net:        string;
    currency:         string;
    finalized_at:     string | null;
}

interface EntryRow {
    id:                   number;
    name:                 string;
    email:                string;
    gross_salary:         string;
    daily_rate:           string;
    casual_days_used:     number;
    sick_days_used:       number;
    emergency_days_used:  number;
    unpaid_days_used:     number;
    excess_casual:        number;
    excess_sick:          number;
    excess_emergency:     number;
    leave_deduction:      string;
    unpaid_deduction:     string;
    net_salary:           string;
    currency:             string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const initialRun: RunSummary = {
    id: 1, month: 5, year: 2026,
    month_label: 'May 2026',
    status: 'draft',
    employee_count: 5,
    total_gross:      '42500.00',
    total_deductions: '1200.00',
    total_net:        '41300.00',
    currency: 'USD',
    finalized_at: null,
};

const mockEntries: EntryRow[] = [
    {
        id: 1, name: 'Ali Raza',    email: 'ali@acmecorp.com',
        gross_salary: '8000.00', daily_rate: '363.64',
        casual_days_used: 0, sick_days_used: 0, emergency_days_used: 0, unpaid_days_used: 0,
        excess_casual: 0, excess_sick: 0, excess_emergency: 0,
        leave_deduction: '0.00', unpaid_deduction: '0.00', net_salary: '8000.00', currency: 'USD',
    },
    {
        id: 2, name: 'Sara Malik',  email: 'sara@acmecorp.com',
        gross_salary: '7500.00', daily_rate: '340.91',
        casual_days_used: 2, sick_days_used: 0, emergency_days_used: 0, unpaid_days_used: 0,
        excess_casual: 0, excess_sick: 0, excess_emergency: 0,
        leave_deduction: '0.00', unpaid_deduction: '0.00', net_salary: '7500.00', currency: 'USD',
    },
    {
        id: 3, name: 'Hamza Awan',  email: 'hamza@acmecorp.com',
        gross_salary: '5000.00', daily_rate: '227.27',
        casual_days_used: 3, sick_days_used: 1, emergency_days_used: 0, unpaid_days_used: 0,
        excess_casual: 1, excess_sick: 0, excess_emergency: 0,
        leave_deduction: '454.55', unpaid_deduction: '0.00', net_salary: '4545.45', currency: 'USD',
    },
    {
        id: 4, name: 'Zara Ahmed',  email: 'zara@acmecorp.com',
        gross_salary: '4500.00', daily_rate: '204.55',
        casual_days_used: 0, sick_days_used: 2, emergency_days_used: 0, unpaid_days_used: 0,
        excess_casual: 0, excess_sick: 0, excess_emergency: 0,
        leave_deduction: '0.00', unpaid_deduction: '0.00', net_salary: '4500.00', currency: 'USD',
    },
    {
        id: 5, name: 'Marcus Chen', email: 'marcus@acmecorp.com',
        gross_salary: '6000.00', daily_rate: '272.73',
        casual_days_used: 1, sick_days_used: 3, emergency_days_used: 0, unpaid_days_used: 0,
        excess_casual: 0, excess_sick: 1, excess_emergency: 0,
        leave_deduction: '409.09', unpaid_deduction: '0.00', net_salary: '5590.91', currency: 'USD',
    },
    {
        id: 6, name: 'Lisa Park',   email: 'lisa@acmecorp.com',
        gross_salary: '5500.00', daily_rate: '250.00',
        casual_days_used: 0, sick_days_used: 0, emergency_days_used: 0, unpaid_days_used: 1,
        excess_casual: 0, excess_sick: 0, excess_emergency: 0,
        leave_deduction: '0.00', unpaid_deduction: '250.00', net_salary: '5250.00', currency: 'USD',
    },
];

// ── Payslip Modal ─────────────────────────────────────────────────────────────

function PayslipModal({ entry, run, open, onClose }: {
    entry: EntryRow | null; run: RunSummary; open: boolean; onClose: () => void;
}) {
    if (!entry) return null;

    const gross     = parseFloat(entry.gross_salary);
    const leaveDed  = parseFloat(entry.leave_deduction);
    const unpaidDed = parseFloat(entry.unpaid_deduction);
    const totalDed  = leaveDed + unpaidDed;
    const net       = parseFloat(entry.net_salary);
    const currency  = entry.currency;

    const fmt = (n: number) => `${currency} ${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    return (
        <Modal open={open} onCancel={onClose} footer={null} title={null} width={520}>
            <div style={{ fontFamily: 'monospace' }}>
                <div style={{
                    background: 'linear-gradient(135deg,#1E1B4B,#7C3AED)', borderRadius: '8px 8px 0 0',
                    padding: '20px 24px', marginBottom: 0,
                }}>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 700, display: 'block' }}>PAY SLIP</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{run.month_label}</Text>
                </div>

                <div style={{ border: '1px solid #EDE9FE', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #F1F5F9' }}>
                        <div>
                            <Text strong style={{ fontSize: 14 }}>{entry.name}</Text>
                            <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>{entry.email}</Text>
                        </div>
                        <Tag color={run.status === 'finalized' ? 'green' : 'orange'} style={{ height: 'fit-content' }}>
                            {run.status === 'finalized' ? '✓ Finalized' : 'Draft'}
                        </Tag>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <Text style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', display: 'block', marginBottom: 8 }}>Earnings</Text>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                            <Text style={{ fontSize: 13 }}>Basic Salary</Text>
                            <Text strong style={{ fontSize: 13 }}>{fmt(gross)}</Text>
                        </div>
                    </div>

                    <div style={{ background: '#F5F3FF', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
                        <Text style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', display: 'block', marginBottom: 8 }}>Leave Used This Month</Text>
                        {[
                            { label: '🌴 Casual',    used: entry.casual_days_used,    excess: entry.excess_casual    },
                            { label: '🤒 Sick',      used: entry.sick_days_used,      excess: entry.excess_sick      },
                            { label: '🚨 Emergency', used: entry.emergency_days_used, excess: entry.excess_emergency },
                            { label: '💸 Unpaid',    used: entry.unpaid_days_used,    excess: entry.unpaid_days_used },
                        ].filter(r => r.used > 0).map(r => (
                            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                                <Text style={{ fontSize: 12 }}>{r.label}</Text>
                                <Text style={{ fontSize: 12 }}>
                                    {r.used}d
                                    {r.excess > 0 && <span style={{ color: '#ef4444' }}> ({r.excess} excess)</span>}
                                </Text>
                            </div>
                        ))}
                        {entry.casual_days_used === 0 && entry.sick_days_used === 0 && entry.emergency_days_used === 0 && entry.unpaid_days_used === 0 && (
                            <Text type="secondary" style={{ fontSize: 12 }}>No leave taken this month.</Text>
                        )}
                    </div>

                    {totalDed > 0 && (
                        <div style={{ marginBottom: 12 }}>
                            <Text style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', display: 'block', marginBottom: 8 }}>Deductions</Text>
                            {leaveDed > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                                    <Text style={{ fontSize: 13 }}>Excess Leave Deduction</Text>
                                    <Text style={{ fontSize: 13, color: '#ef4444' }}>-{fmt(leaveDed)}</Text>
                                </div>
                            )}
                            {unpaidDed > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                                    <Text style={{ fontSize: 13 }}>Unpaid Leave Deduction</Text>
                                    <Text style={{ fontSize: 13, color: '#ef4444' }}>-{fmt(unpaidDed)}</Text>
                                </div>
                            )}
                        </div>
                    )}

                    <div style={{ borderTop: '2px solid #EDE9FE', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: 15 }}>Net Salary</Text>
                        <Text strong style={{ fontSize: 20, color: '#059669' }}>{fmt(net)}</Text>
                    </div>

                    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <Button onClick={onClose}>Close</Button>
                        <Button icon={<Printer size={14} />} onClick={() => window.print()}
                            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>Print</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PayrollShow() {
    const [run,       setRun]       = useState<RunSummary>(initialRun);
    const [entries]                 = useState<EntryRow[]>(mockEntries);
    const [slipEntry, setSlipEntry] = useState<EntryRow | null>(null);

    const fmt = (val: string | number, currency = run.currency) =>
        `${currency} ${parseFloat(String(val)).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    const handleFinalize = () => {
        if (!confirm(`Finalize payroll for ${run.month_label}? This cannot be undone.`)) return;
        setRun(prev => ({ ...prev, status: 'finalized', finalized_at: new Date().toISOString() }));
    };

    const handleRegenerate = () => {
        if (!confirm(`Regenerate payroll for ${run.month_label}? Current draft will be overwritten.`)) return;
        alert('Payroll regenerated (mock).');
    };

    const columns: ColumnsType<EntryRow> = [
        {
            title: 'Employee', key: 'emp', fixed: 'left',
            render: (_, e) => (
                <div>
                    <Text strong style={{ fontSize: 13 }}>{e.name}</Text>
                    <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>{e.email}</Text>
                </div>
            ),
        },
        {
            title: 'Gross', key: 'gross',
            render: (_, e) => <Text style={{ fontSize: 13 }}>{fmt(e.gross_salary, e.currency)}</Text>,
        },
        {
            title: 'Leave Used', key: 'leave', width: 180,
            render: (_, e) => (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {e.casual_days_used    > 0 && <Tag color="blue"   style={{ fontSize: 11 }}>C:{e.casual_days_used}d</Tag>}
                    {e.sick_days_used      > 0 && <Tag color="purple" style={{ fontSize: 11 }}>S:{e.sick_days_used}d</Tag>}
                    {e.emergency_days_used > 0 && <Tag color="orange" style={{ fontSize: 11 }}>E:{e.emergency_days_used}d</Tag>}
                    {e.unpaid_days_used    > 0 && <Tag color="red"    style={{ fontSize: 11 }}>U:{e.unpaid_days_used}d</Tag>}
                    {e.casual_days_used === 0 && e.sick_days_used === 0 && e.emergency_days_used === 0 && e.unpaid_days_used === 0 &&
                        <Text type="secondary" style={{ fontSize: 12 }}>None</Text>}
                </div>
            ),
        },
        {
            title: 'Excess', key: 'excess', width: 100,
            render: (_, e) => {
                const total = e.excess_casual + e.excess_sick + e.excess_emergency;
                return total > 0
                    ? <Text style={{ fontSize: 13, color: '#ef4444' }}>{total}d</Text>
                    : <Text type="secondary" style={{ fontSize: 13 }}>—</Text>;
            },
        },
        {
            title: 'Deductions', key: 'deductions',
            render: (_, e) => {
                const total = parseFloat(e.leave_deduction) + parseFloat(e.unpaid_deduction);
                return total > 0
                    ? <Text style={{ fontSize: 13, color: '#ef4444' }}>-{fmt(total, e.currency)}</Text>
                    : <Text type="secondary" style={{ fontSize: 13 }}>—</Text>;
            },
        },
        {
            title: 'Net Salary', key: 'net',
            render: (_, e) => <Text strong style={{ fontSize: 13, color: '#059669' }}>{fmt(e.net_salary, e.currency)}</Text>,
        },
        {
            title: '', key: 'actions', width: 80,
            render: (_, e) => (
                <Button size="small" onClick={() => setSlipEntry(e)} style={{ borderRadius: 6, fontSize: 11 }}>Payslip</Button>
            ),
        },
    ];

    return (
        <AppLayout title={`Payroll — ${run.month_label}`}>
            <Head title={`Payroll — ${run.month_label}`} />
            <PayslipModal entry={slipEntry} run={run} open={!!slipEntry} onClose={() => setSlipEntry(null)} />

            {/* Back + Actions bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Button icon={<ArrowLeft size={14} />} onClick={() => window.history.back()}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    All Payroll Runs
                </Button>
                <div style={{ display: 'flex', gap: 8 }}>
                    {run.status === 'draft' && (
                        <>
                            <Button icon={<RefreshCw size={14} />} onClick={handleRegenerate}
                                style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                Regenerate
                            </Button>
                            <Button type="primary" icon={<Lock size={14} />} onClick={handleFinalize}
                                style={{ background: '#059669', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                                Finalize Payroll
                            </Button>
                        </>
                    )}
                    {run.status === 'finalized' && (
                        <Tag color="green" style={{ fontSize: 13, padding: '4px 10px', borderRadius: 6 }}>
                            ✓ Finalized {run.finalized_at ? new Date(run.finalized_at).toLocaleDateString() : ''}
                        </Tag>
                    )}
                </div>
            </div>

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                    { label: 'Period',      value: run.month_label,       color: '#EDE9FE', text: '#7C3AED' },
                    { label: 'Employees',   value: String(run.employee_count), color: '#EDE9FE', text: '#A855F7' },
                    { label: 'Total Gross', value: fmt(run.total_gross),   color: '#ECFDF5', text: '#059669' },
                    { label: 'Net Payable', value: fmt(run.total_net),     color: '#ECFDF5', text: '#059669' },
                ].map(s => (
                    <Card key={s.label} style={{ borderRadius: 12, border: '1px solid #EDE9FE', background: s.color }} styles={{ body: { padding: '14px 16px' } }}>
                        <Text style={{ fontSize: s.label === 'Period' ? 16 : 18, fontWeight: 700, color: s.text, display: 'block' }}>{s.value}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{s.label}</Text>
                    </Card>
                ))}
            </div>

            {parseFloat(run.total_deductions) > 0 && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 16px', marginBottom: 16 }}>
                    <Text style={{ fontSize: 13, color: '#B91C1C' }}>
                        ⚠️ Total Deductions: <strong>-{fmt(run.total_deductions)}</strong> across {entries.filter(e => parseFloat(e.leave_deduction) + parseFloat(e.unpaid_deduction) > 0).length} employee(s)
                    </Text>
                </div>
            )}

            {/* Table */}
            <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} styles={{ body: { padding: 0 } }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9' }}>
                    <Text strong style={{ color: '#374151' }}>Employee Breakdown — {run.month_label}</Text>
                    <Text type="secondary" style={{ fontSize: 12, marginLeft: 12 }}>Click "Payslip" to view individual payslips</Text>
                </div>
                <Table
                    dataSource={entries}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    size="middle"
                    scroll={{ x: 900 }}
                    locale={{ emptyText: 'No employees found in this payroll run.' }}
                />
            </Card>
        </AppLayout>
    );
}
