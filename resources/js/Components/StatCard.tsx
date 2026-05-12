import { LucideIcon } from 'lucide-react';

interface Props {
    label: string;
    value: string | number;
    icon: LucideIcon;
    change?: string;
    changeType?: 'up' | 'down' | 'neutral';
    color?: 'blue' | 'green' | 'amber' | 'indigo';
}

const colorMap = {
    blue:   { bg: 'bg-blue-50',   icon: 'text-brand-600' },
    green:  { bg: 'bg-green-50',  icon: 'text-green-600' },
    amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600' },
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600' },
};

export default function StatCard({ label, value, icon: Icon, change, changeType = 'neutral', color = 'blue' }: Props) {
    const colors = colorMap[color];

    return (
        <div className="rounded-card border border-slate-200 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
                    {change && (
                        <p className={`mt-1 text-xs font-medium ${
                            changeType === 'up'   ? 'text-green-600' :
                            changeType === 'down' ? 'text-red-500'   :
                            'text-slate-400'
                        }`}>
                            {change}
                        </p>
                    )}
                </div>
                <div className={`rounded-lg p-2.5 ${colors.bg}`}>
                    <Icon size={20} className={colors.icon} strokeWidth={1.75} />
                </div>
            </div>
        </div>
    );
}
