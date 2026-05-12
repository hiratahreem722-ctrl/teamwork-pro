export type UserRole = 'owner' | 'super_admin' | 'manager' | 'employee' | 'client';

export interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: 'manager' | 'employee' | 'client';
    created_at: string;
    assigned_project_ids?: number[];
}

export interface LeaveRequest {
    id: number;
    employee?: { name: string; email: string; role: string };
    reviewer?: { name: string };
    type: 'casual' | 'sick';
    start_date: string;
    end_date: string;
    total_days: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    rejection_reason?: string | null;
    created_at: string;
}

export interface LeaveBalance {
    year: number;
    casual_allowed: number;
    casual_used: number;
    casual_remaining: number;
    sick_allowed: number;
    sick_used: number;
    sick_remaining: number;
    excess_casual: number;
    excess_sick: number;
}

export interface EmployeeLeavePolicy {
    id: number;
    name: string;
    email: string;
    casual_allowed: number;
    casual_used: number;
    sick_allowed: number;
    sick_used: number;
}

export interface TeamTimeEntry {
    id: number;
    name: string;
    email: string;
    today_status: 'clocked_in' | 'clocked_out' | 'absent';
    today_hours: number;
    month_hours: number;
    salary?: { gross: number; net: number; deduction: number; currency: string; excess_days: number } | null;
}

export interface TimeLog {
    id: number;
    date: string;
    clock_in: string;
    clock_out: string | null;
    total_hours: number | null;
    status: 'active' | 'completed';
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: UserRole;
    tenant_id?: string | null;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
