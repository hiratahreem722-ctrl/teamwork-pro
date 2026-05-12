/**
 * useDepartments
 *
 * Provides per-company department data via localStorage.
 * Key format: `tp_departments_<tenantKey>`
 *
 * Built-in departments are always present and cannot be deleted.
 * Custom departments are stored in localStorage and merged at runtime.
 */

import { useState, useEffect, useCallback } from 'react';

export interface Department {
    id: string;
    name: string;
    color: string;
    description: string;
    headCount: number;
    isBuiltIn: boolean;
}

export const BUILT_IN_DEPARTMENTS: Department[] = [
    { id: 'bi_engineering',  name: 'Engineering',  color: '#7C3AED', description: 'Software development and infrastructure',  headCount: 0, isBuiltIn: true },
    { id: 'bi_design',       name: 'Design',       color: '#EC4899', description: 'UX/UI and brand design',                   headCount: 0, isBuiltIn: true },
    { id: 'bi_operations',   name: 'Operations',   color: '#059669', description: 'Business operations and project management', headCount: 0, isBuiltIn: true },
    { id: 'bi_hr',           name: 'HR',           color: '#D97706', description: 'Human resources and recruitment',           headCount: 0, isBuiltIn: true },
    { id: 'bi_sales',        name: 'Sales',        color: '#EF4444', description: 'Sales and business development',            headCount: 0, isBuiltIn: true },
    { id: 'bi_finance',      name: 'Finance',      color: '#0369A1', description: 'Finance, accounting and payroll',           headCount: 0, isBuiltIn: true },
    { id: 'bi_marketing',    name: 'Marketing',    color: '#F97316', description: 'Marketing, content and growth',             headCount: 0, isBuiltIn: true },
    { id: 'bi_analytics',    name: 'Analytics',    color: '#6366F1', description: 'Data analytics and business intelligence',  headCount: 0, isBuiltIn: true },
];

export const DEPT_COLORS = [
    '#7C3AED','#EC4899','#059669','#D97706','#EF4444',
    '#0369A1','#F97316','#6366F1','#14B8A6','#8B5CF6',
    '#10B981','#F59E0B','#3B82F6','#A855F7','#06B6D4',
];

function storageKey(tenantKey: string) {
    return `tp_departments_${tenantKey}`;
}

function loadCustom(tenantKey: string): Department[] {
    try {
        const raw = localStorage.getItem(storageKey(tenantKey));
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveCustom(tenantKey: string, custom: Department[]) {
    try {
        localStorage.setItem(storageKey(tenantKey), JSON.stringify(custom));
    } catch {}
}

export function useDepartments(tenantKey: string) {
    const [custom, setCustom] = useState<Department[]>(() => loadCustom(tenantKey));

    // Re-load if tenantKey changes (company switch)
    useEffect(() => {
        setCustom(loadCustom(tenantKey));
    }, [tenantKey]);

    const persist = useCallback((next: Department[]) => {
        setCustom(next);
        saveCustom(tenantKey, next);
    }, [tenantKey]);

    // Merge built-ins with custom, custom may override built-in descriptions/colors
    // but built-in flag stays true. Custom entries have isBuiltIn: false.
    const departments: Department[] = [
        ...BUILT_IN_DEPARTMENTS,
        ...custom,
    ];

    const addDepartment = useCallback((dept: Omit<Department, 'id' | 'isBuiltIn'>) => {
        const newDept: Department = {
            ...dept,
            id: `custom_${Date.now()}`,
            isBuiltIn: false,
        };
        persist([...custom, newDept]);
        return newDept;
    }, [custom, persist]);

    const updateDepartment = useCallback((id: string, changes: Partial<Omit<Department, 'id' | 'isBuiltIn'>>) => {
        // For built-ins: store an override entry in custom list
        const isBuiltIn = BUILT_IN_DEPARTMENTS.some(d => d.id === id);
        if (isBuiltIn) {
            const existing = BUILT_IN_DEPARTMENTS.find(d => d.id === id)!;
            const overrideIdx = custom.findIndex(d => d.id === `override_${id}`);
            const override: Department = {
                ...existing,
                ...changes,
                id: `override_${id}`,
                isBuiltIn: true,
            };
            if (overrideIdx >= 0) {
                const next = [...custom];
                next[overrideIdx] = override;
                persist(next);
            } else {
                persist([...custom, override]);
            }
        } else {
            persist(custom.map(d => d.id === id ? { ...d, ...changes } : d));
        }
    }, [custom, persist]);

    const deleteDepartment = useCallback((id: string) => {
        // Cannot delete built-in departments
        if (BUILT_IN_DEPARTMENTS.some(d => d.id === id)) return false;
        persist(custom.filter(d => d.id !== id));
        return true;
    }, [custom, persist]);

    // Flat list of names for selects
    const departmentNames = departments.map(d => d.name);

    return {
        departments,
        departmentNames,
        addDepartment,
        updateDepartment,
        deleteDepartment,
    };
}
