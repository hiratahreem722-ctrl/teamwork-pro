type Variant = 'blue' | 'green' | 'amber' | 'red' | 'slate' | 'indigo' | 'purple';

const styles: Record<Variant, string> = {
    blue:   'bg-blue-100 text-blue-700',
    green:  'bg-green-100 text-green-700',
    amber:  'bg-amber-100 text-amber-700',
    red:    'bg-red-100 text-red-600',
    slate:  'bg-slate-100 text-slate-600',
    indigo: 'bg-indigo-100 text-indigo-700',
    purple: 'bg-purple-100 text-purple-700',
};

interface Props {
    label: string;
    variant?: Variant;
}

export default function Badge({ label, variant = 'slate' }: Props) {
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[variant]}`}>
            {label}
        </span>
    );
}
