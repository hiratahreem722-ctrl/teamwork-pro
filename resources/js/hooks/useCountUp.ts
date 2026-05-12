import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
    start?: number;
    end: number;
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    delay?: number;
}

export function useCountUp({
    start = 0,
    end,
    duration = 1800,
    decimals = 0,
    prefix = '',
    suffix = '',
    delay = 0,
}: UseCountUpOptions) {
    const [value, setValue] = useState(start);
    const [hasStarted, setHasStarted] = useState(false);
    const frameRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setHasStarted(true);
        }, delay);
        return () => clearTimeout(timeout);
    }, [delay]);

    useEffect(() => {
        if (!hasStarted) return;

        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

        const animate = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            const current = start + (end - start) * easedProgress;
            setValue(parseFloat(current.toFixed(decimals)));

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };

        frameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameRef.current);
    }, [hasStarted, start, end, duration, decimals]);

    const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();
    return `${prefix}${formatted}${suffix}`;
}
