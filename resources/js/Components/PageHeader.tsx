import { ReactNode } from 'react';

interface Props {
    title: string;
    subtitle?: string;
    action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: Props) {
    return (
        <div className="mb-6 flex items-center justify-between gap-4">
            <div>
                <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
                {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
