import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import {
    Card, Typography, Button, Table, Modal, InputNumber,
    Select, Avatar, Tooltip, Progress, Tabs, Switch, Tag, Input, Badge,
} from 'antd';
import { CheckSquare, Pencil, AlertTriangle, Settings2, Plus } from 'lucide-react';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { PageProps } from '@/types';

const { Text } = Typography;

// ── Types ─────────────────────────────────────────────────────────────────────

interface EmployeeLeavePolicy {
    id:               number;
    name:             string;
    email:            string;
    casual_allowed:   number;
    casual_used:      number;
    casual_remaining: number;
    sick_allowed:     number;
    sick_used:        number;
    sick_remaining:   number;
    monthly_salary:   number;
    deduction:        number;
    excess_casual:    number;
    excess_sick:      number;
}

interface LeaveRule {
    id:                   number;
    leave_type:           string;
    label:                string;
    days_per_year:        number;
    carry_forward_days:   number;
    is_paid:              boolean;
    deduction_multiplier: number;
    color:                string;
    is_global:            boolean;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const initialEmployees: EmployeeLeavePolicy[] = [
    { id: 1, name: 'Sara Kim',    email: 'sara@acmecorp.com',   casual_allowed: 12, casual_used: 3,  casual_remaining: 9,  sick_allowed: 8, sick_used: 1, sick_remaining: 7, monthly_salary: 5000, deduction: 0,   excess_casual: 0, excess_sick: 0 },
    { id: 2, name: 'Hamza Ali',   email: 'hamza@acmecorp.com',  casual_allowed: 12, casual_used: 14, casual_remaining: 0,  sick_allowed: 8, sick_used: 2, sick_remaining: 6, monthly_salary: 4500, deduction: 409, excess_casual: 2, excess_sick: 0 },
    { id: 3, name: 'Lisa Park',   email: 'lisa@acmecorp.com',   casual_allowed: 12, casual_used: 0,  casual_remaining: 12, sick_allowed: 8, sick_used: 0, sick_remaining: 8, monthly_salary: 6000, deduction: 0,   excess_casual: 0, excess_sick: 0 },
    { id: 4, name: 'Marcus Chen', email: 'marcus@acmecorp.com', casual_allowed: 12, casual_used: 5,  casual_remaining: 7,  sick_allowed: 8, sick_used: 9, sick_remaining: 0, monthly_salary: 5500, deduction: 250, excess_casual: 0, excess_sick: 1 },
    { id: 5, name: 'Nina Kovač',  email: 'nina@acmecorp.com',   casual_allowed: 12, casual_used: 2,  casual_remaining: 10, sick_allowed: 8, sick_used: 0, sick_remaining: 8, monthly_salary: 4800, deduction: 0,   excess_casual: 0, excess_sick: 0 },
];

const initialLeaveRules: LeaveRule[] = [
    { id: 1, leave_type: 'casual', label: 'Casual Leave', days_per_year: 12, carry_forward_days: 5,  is_paid: true, deduction_multiplier: 1,   color: '#3B82F6', is_global: true },
    { id: 2, leave_type: 'sick',   label: 'Sick Leave',   days_per_year: 8,  carry_forward_days: 0,  is_paid: true, deduction_multiplier: 1.5, color: '#7C3AED', is_global: true },
];

const year = 2026;

// ── Edit Leave Limits Modal ────────────────────────────────────────────────────

function EditLeavesModal({ emp, open, onClose, onSave }: {
    emp: EmployeeLeavePolicy | null;
    open: boolean;
    onClose: () => void;
    onSave: (id: number, casual: number, sick: number) => void;
}) {
    const [casual, setCasual] = useState(emp?.casual_allowed ?? 12);
    const [sick,   setSick]   = useState(emp?.sick_allowed   ?? 8);

    if (!emp) return null;

    return (
        <Modal open={open} onCancel={onClose} footer={null}
            title={
                <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>Edit Leave Limits — {emp.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 400, marginTop: 2 }}>
                        Adjust the yearly leave allowance for this employee.
                    </div>
                </div>
            }
            width={420}
        >
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>🌴 Casual Leave Days / Year</label>
                    <InputNumber min={0} max={365} style={{ width: '100%', borderRadius: 8 }} value={casual} onChange={v => setCasual(v ?? 0)} />
                </div>
                <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>🤒 Sick Leave Days / Year</label>
                    <InputNumber min={0} max={365} style={{ width: '100%', borderRadius: 8 }} value={sick} onChange={v => setSick(v ?? 0)} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary"
                        onClick={() => { onSave(emp.id, casual, sick); onClose(); }}
                        style={{ background: 'linear-gradient(135deg,#1E1B4B,#7C3AED)', border: 'none', borderRadius: 8 }}>
                        Save
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ── Edit / Create Rule Modal ──────────────────────────────────────────────────

function RuleModal({ rule, open, onClose, onSave }: {
    rule: LeaveRule | null;
    open: boolean;
    onClose: () => void;
    onSave: (rule: LeaveRule) => void;
}) {
    const isNew = !rule;

    const [leaveType,   setLeaveType]   = useState(rule?.leave_type ?? '');
    const [label,       setLabel]       = useState(rule?.label ?? '');
    const [daysPerYear, setDaysPerYear] = useState(rule?.days_per_year ?? 0);
    const [carryFwd,    setCarryFwd]    = useState(rule?.carry_forward_days ?? 0);
    const [isPaid,      setIsPaid]      = useState(rule?.is_paid ?? true);
    const [multiplier,  setMultiplier]  = useState(String(rule?.deduction_multiplier ?? 1));
    const [color,       setColor]       = useState(rule?.color ?? '#7C3AED');

    if (!open) return null;

    const handleSave = () => {
        onSave({
            id:                   rule?.id ?? Date.now(),
            leave_type:           leaveType,
            label,
            days_per_year:        daysPerYear,
            carry_forward_days:   carryFwd,
            is_paid:              isPaid,
            deduction_multiplier: parseFloat(multiplier),
            color,
            is_global:            false,
        });
        onClose();
    };

    const typeOptions = [
        { label: '🌴 Casual', value: 'casual' },
        { label: '🤒 Sick',   value: 'sick'   },
        { label: '🚨 Emergency', value: 'emergency' },
        { label: '💸 Unpaid',    value: 'unpaid'    },
        { label: '✈️ Annual',    value: 'annual'    },
        { label: '🎉 Other',     value: 'other'     },
    ];

    return (
        <Modal open={open} onCancel={onClose} footer={null}
            title={
                <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>
                        {isNew ? 'Add Leave Rule' : `Edit Rule — ${rule?.label}`}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 400, marginTop: 2 }}>
                        {isNew ? 'Create a company leave rule.' : 'Update your company leave rule.'}
                    </div>
                </div>
            }
            width={480}
        >
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Leave Type</label>
                        <Select style={{ width: '100%' }} value={leaveType || undefined} onChange={setLeaveType}
                            disabled={!isNew} options={typeOptions} placeholder="Select type" />
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Display Label</label>
                        <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Casual Leave" style={{ borderRadius: 8 }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Days / Year</label>
                        <InputNumber min={0} max={365} style={{ width: '100%' }} value={daysPerYear} onChange={v => setDaysPerYear(v ?? 0)} />
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Carry Forward Days</label>
                        <InputNumber min={0} max={365} style={{ width: '100%' }} value={carryFwd} onChange={v => setCarryFwd(v ?? 0)} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Paid Leave</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <Switch checked={isPaid} onChange={setIsPaid} />
                            <Text style={{ fontSize: 13 }}>{isPaid ? 'Paid' : 'Unpaid'}</Text>
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Deduction Multiplier</label>
                        <Select style={{ width: '100%' }} value={multiplier} onChange={setMultiplier}
                            options={[
                                { label: '1.0× — Full day deduction', value: '1'   },
                                { label: '1.5× — 1.5x deduction',    value: '1.5' },
                                { label: '0.5× — Half day deduction', value: '0.5' },
                                { label: '0× — No deduction',         value: '0'   },
                            ]}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={handleSave}
                        style={{ background: 'linear-gradient(135deg,#1E1B4B,#7C3AED)', border: 'none', borderRadius: 8 }}>
                        {isNew ? 'Save Rule' : 'Update Rule'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ── Leave Rules Tab ────────────────────────────────────────────────────────────

function LeaveRulesTab({ rules, onUpdate }: { rules: LeaveRule[]; onUpdate: (rules: LeaveRule[]) => void }) {
    const [editRule,   setEditRule]   = useState<LeaveRule | null>(null);
    const [modalOpen,  setModalOpen]  = useState(false);

    const typeEmoji: Record<string, string> = {
        casual: '🌴', sick: '🤒', emergency: '🚨', unpaid: '💸', annual: '✈️',
    };

    const handleSave = (rule: LeaveRule) => {
        const exists = rules.find(r => r.id === rule.id);
        if (exists) {
            onUpdate(rules.map(r => r.id === rule.id ? rule : r));
        } else {
            onUpdate([...rules, rule]);
        }
    };

    return (
        <div>
            <RuleModal rule={editRule} open={modalOpen} onClose={() => { setEditRule(null); setModalOpen(false); }} onSave={handleSave} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <Text strong style={{ fontSize: 14, color: '#1e293b' }}>Company Leave Rules</Text>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 2 }}>
                        Define leave allowances, deduction policies, and carry-forward rules.
                    </Text>
                </div>
                <Button type="primary" icon={<Plus size={14} />} onClick={() => { setEditRule(null); setModalOpen(true); }}
                    style={{ background: 'linear-gradient(135deg,#1E1B4B,#7C3AED)', border: 'none', borderRadius: 8 }}>
                    Add Rule
                </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                {rules.map(rule => (
                    <Card key={rule.id} style={{
                        borderRadius: 12,
                        border: `2px solid ${rule.is_global ? '#EDE9FE' : rule.color + '44'}`,
                        background: rule.is_global ? '#FAFAFA' : '#fff',
                    }} styles={{ body: { padding: '14px 16px' } }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10, background: rule.color + '22',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                                }}>
                                    {typeEmoji[rule.leave_type] ?? '📋'}
                                </div>
                                <div>
                                    <Text strong style={{ fontSize: 13, color: '#1e293b' }}>{rule.label}</Text>
                                    <br />
                                    <Tag style={{ fontSize: 10, margin: 0, marginTop: 2 }} color={rule.is_global ? 'default' : 'purple'}>
                                        {rule.is_global ? 'Global Default' : 'Custom'}
                                    </Tag>
                                </div>
                            </div>
                            <Tooltip title="Edit rule">
                                <Button size="small" icon={<Pencil size={12} />}
                                    onClick={() => { setEditRule(rule); setModalOpen(true); }}
                                    style={{ borderRadius: 6 }} />
                            </Tooltip>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '8px 10px' }}>
                                <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Days / Year</Text>
                                <Text strong style={{ fontSize: 18, display: 'block', color: rule.color }}>{rule.days_per_year}</Text>
                            </div>
                            <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '8px 10px' }}>
                                <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Carry Forward</Text>
                                <Text strong style={{ fontSize: 18, display: 'block', color: '#64748b' }}>{rule.carry_forward_days}</Text>
                            </div>
                        </div>

                        <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <Tag color={rule.is_paid ? 'green' : 'red'} style={{ fontSize: 11 }}>
                                {rule.is_paid ? '✓ Paid' : '✗ Unpaid'}
                            </Tag>
                            <Tag color="purple" style={{ fontSize: 11 }}>
                                {rule.deduction_multiplier}× deduction
                            </Tag>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// ── Employee Policies Tab ─────────────────────────────────────────────────────

function EmployeePoliciesTab({ employees, year, onUpdateLimits }: {
    employees: EmployeeLeavePolicy[];
    year: number;
    onUpdateLimits: (id: number, casual: number, sick: number) => void;
}) {
    const [editLeave, setEditLeave] = useState<EmployeeLeavePolicy | null>(null);

    const columns: ColumnsType<EmployeeLeavePolicy> = [
        {
            title: 'Employee', key: 'emp',
            render: (_, e) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar style={{ background: '#1E1B4B', fontWeight: 700, flexShrink: 0 }} size={34}>{e.name.charAt(0)}</Avatar>
                    <div>
                        <Text strong style={{ fontSize: 13 }}>{e.name}</Text>
                        <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>{e.email}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: '🌴 Casual', key: 'casual', width: 160,
            render: (_, e) => (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <Text style={{ fontSize: 12 }}>{e.casual_used}/{e.casual_allowed}</Text>
                        <Text style={{ fontSize: 12, color: e.casual_remaining === 0 ? '#ef4444' : '#059669', fontWeight: 600 }}>{e.casual_remaining} left</Text>
                    </div>
                    <Progress
                        percent={Math.min(100, e.casual_allowed > 0 ? (e.casual_used / e.casual_allowed) * 100 : 0)}
                        showInfo={false} size={['100%', 6]}
                        strokeColor={e.casual_remaining === 0 ? '#ef4444' : '#7C3AED'} trailColor="#E2E8F0"
                    />
                </div>
            ),
        },
        {
            title: '🤒 Sick', key: 'sick', width: 160,
            render: (_, e) => (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <Text style={{ fontSize: 12 }}>{e.sick_used}/{e.sick_allowed}</Text>
                        <Text style={{ fontSize: 12, color: e.sick_remaining === 0 ? '#ef4444' : '#059669', fontWeight: 600 }}>{e.sick_remaining} left</Text>
                    </div>
                    <Progress
                        percent={Math.min(100, e.sick_allowed > 0 ? (e.sick_used / e.sick_allowed) * 100 : 0)}
                        showInfo={false} size={['100%', 6]}
                        strokeColor={e.sick_remaining === 0 ? '#ef4444' : '#A855F7'} trailColor="#E2E8F0"
                    />
                </div>
            ),
        },
        {
            title: 'Monthly Salary', key: 'salary',
            render: (_, e) => e.monthly_salary > 0
                ? <Text strong style={{ fontSize: 13 }}>${Number(e.monthly_salary).toLocaleString()}</Text>
                : <Text type="secondary" style={{ fontSize: 12 }}>Not set</Text>,
        },
        {
            title: 'Deduction', key: 'deduction',
            render: (_, e) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {e.deduction > 0 ? (
                        <>
                            <AlertTriangle size={13} color="#EF4444" />
                            <Text style={{ fontSize: 13, color: '#ef4444', fontWeight: 600 }}>-${Number(e.deduction).toFixed(2)}</Text>
                            <Tooltip title={`${e.excess_casual + e.excess_sick} excess day(s)`}>
                                <Text type="secondary" style={{ fontSize: 11 }}>({e.excess_casual + e.excess_sick}d excess)</Text>
                            </Tooltip>
                        </>
                    ) : (
                        <Text type="secondary" style={{ fontSize: 13 }}>—</Text>
                    )}
                </div>
            ),
        },
        {
            title: 'Actions', key: 'actions',
            render: (_, e) => (
                <Tooltip title="Edit leave limits">
                    <Button size="small" icon={<Pencil size={13} />} onClick={() => setEditLeave(e)} style={{ borderRadius: 6 }} />
                </Tooltip>
            ),
        },
    ];

    return (
        <>
            <EditLeavesModal
                emp={editLeave} open={!!editLeave} onClose={() => setEditLeave(null)}
                onSave={(id, casual, sick) => { onUpdateLimits(id, casual, sick); setEditLeave(null); }}
            />
            <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }} styles={{ body: { padding: 0 } }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9' }}>
                    <Text strong style={{ color: '#374151' }}>Employee Leave Settings — {year}</Text>
                </div>
                <Table dataSource={employees} columns={columns} rowKey="id"
                    pagination={false} size="middle" locale={{ emptyText: 'No employees found.' }} />
            </Card>
        </>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function LeavePolicy() {
    const [employees,  setEmployees]  = useState<EmployeeLeavePolicy[]>(initialEmployees);
    const [leaveRules, setLeaveRules] = useState<LeaveRule[]>(initialLeaveRules);

    const totalDeductions = employees.reduce((s, e) => s + e.deduction, 0);

    const handleUpdateLimits = (id: number, casual: number, sick: number) => {
        setEmployees(prev => prev.map(e => {
            if (e.id !== id) return e;
            return {
                ...e,
                casual_allowed:   casual,
                casual_remaining: Math.max(0, casual - e.casual_used),
                excess_casual:    Math.max(0, e.casual_used - casual),
                sick_allowed:     sick,
                sick_remaining:   Math.max(0, sick - e.sick_used),
                excess_sick:      Math.max(0, e.sick_used - sick),
            };
        }));
    };

    const tabItems = [
        {
            key: 'employees',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Employee Policies
                    <Badge count={employees.length} style={{ backgroundColor: '#7C3AED' }} />
                </span>
            ),
            children: <EmployeePoliciesTab employees={employees} year={year} onUpdateLimits={handleUpdateLimits} />,
        },
        {
            key: 'rules',
            label: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Settings2 size={14} /> Leave Rules</span>,
            children: <LeaveRulesTab rules={leaveRules} onUpdate={setLeaveRules} />,
        },
    ];

    return (
        <AppLayout title="Leave Policy">
            <Head title="Leave Policy" />

            {/* Hero */}
            <div style={{
                borderRadius: 16, marginBottom: 24, padding: '26px 30px',
                background: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <CheckSquare size={15} color="rgba(255,255,255,0.7)" />
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Year {year}</Text>
                        </div>
                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 700, display: 'block' }}>Leave Policy & Settings</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                            Define leave rules and manage per-employee allowances.
                        </Text>
                    </div>
                    <div style={{ display: 'flex', gap: 20, textAlign: 'center' }}>
                        <div>
                            <div style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>{employees.length}</div>
                            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Employees</Text>
                        </div>
                        <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
                        <div>
                            <div style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>{leaveRules.length}</div>
                            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Leave Types</Text>
                        </div>
                        {totalDeductions > 0 && (
                            <>
                                <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
                                <div>
                                    <div style={{ fontSize: 26, fontWeight: 800, color: '#fca5a5' }}>-${totalDeductions.toFixed(0)}</div>
                                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Deductions</Text>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                    { label: 'Employees with excess casual', value: employees.filter(e => e.excess_casual > 0).length, color: '#EDE9FE' },
                    { label: 'Employees with excess sick',   value: employees.filter(e => e.excess_sick > 0).length,   color: '#EDE9FE' },
                    { label: 'Salary not configured',        value: employees.filter(e => !e.monthly_salary).length,   color: '#FFFBEB' },
                ].map(s => (
                    <Card key={s.label} style={{ borderRadius: 12, border: '1px solid #EDE9FE', background: s.color }} styles={{ body: { padding: '14px 16px' } }}>
                        <Text style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', display: 'block' }}>{s.value}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{s.label}</Text>
                    </Card>
                ))}
            </div>

            {/* Tabs */}
            <Card style={{ borderRadius: 12, border: '1px solid #EDE9FE' }}>
                <Tabs defaultActiveKey="employees" items={tabItems} tabBarStyle={{ marginBottom: 20 }} />
            </Card>
        </AppLayout>
    );
}
