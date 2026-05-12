import { useCountUp } from '@/hooks/useCountUp';

interface AnimatedNumberProps {
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    duration?: number;
    delay?: number;
    className?: string;
    style?: React.CSSProperties;
}

export default function AnimatedNumber({
    value,
    prefix = '',
    suffix = '',
    decimals = 0,
    duration = 1600,
    delay = 0,
    className,
    style,
}: AnimatedNumberProps) {
    const display = useCountUp({ end: value, prefix, suffix, decimals, duration, delay });
    return (
        <span className={className} style={style}>
            {display}
        </span>
    );
}
