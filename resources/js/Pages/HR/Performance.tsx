import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage } from '@inertiajs/react';
import { Form, Select, Button } from 'antd';
import {
    Plus, Star, X, Clock, CheckCircle2, FolderKanban,
    DollarSign, Target, TrendingUp, TrendingDown,
    ChevronRight, Award, Zap, BarChart3, Calendar,
    ArrowLeft, User,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import type { PageProps } from '@/types';

// ── Palette ──────────────────────────────────────────────────────────────────
const P  = '#7C3AED';
const PD = '#1E1B4B';

const card: React.CSSProperties = {
    background: '#fff', border: '1px solid #EDE9FE',
    borderRadius: 12, boxShadow: '0 1px 3px rgba(124,58,237,0.06)',
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface Task { name: string; project: string; status: 'Done' | 'In Progress'; date: string; points: number }
interface Project { name: string; role: string; completion: number; budget: number; contributed: number; status: string }

interface Employee {
    id: number; name: string; initials: string; avatarColor: string;
    department: string; reviewer: string;
    rating: number | null; goalsMet: number | null;
    status: 'Pending' | 'In Progress' | 'Completed';
    // detail-view data keyed by timeframe
    byPeriod: Record<string, {
        hoursWorked: number; tasksCompleted: number; revenue: number;
        goalsAchieved: number; goalsTotal: number;
        tasks: Task[]; projects: Project[];
        weeklyHours: number[]; // 7 values Mon–Sun
    }>;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const employees: Employee[] = [
    {
        id: 1, name: 'Sara Kim', initials: 'SK', avatarColor: '#7C3AED',
        department: 'Engineering', reviewer: 'Lisa Park', rating: 4.8, goalsMet: 96, status: 'Completed',
        byPeriod: {
            'Last Day':    { hoursWorked: 8.5,  tasksCompleted: 5,  revenue: 1200,  goalsAchieved: 2,  goalsTotal: 2,  weeklyHours:[8,0,0,0,0,0,0],  tasks:[{ name:'Fix auth bug', project:'API Integration', status:'Done', date:'Today', points:30 },{ name:'Code review PR #42', project:'Mobile App v2', status:'Done', date:'Today', points:20 }], projects:[{ name:'API Integration', role:'Lead Dev', completion:75, budget:8500, contributed:3400, status:'In Progress' }] },
            'Last Week':   { hoursWorked: 42,   tasksCompleted: 18, revenue: 5800,  goalsAchieved: 4,  goalsTotal: 5,  weeklyHours:[8,9,8,7,9,0,0],  tasks:[{ name:'Fix auth bug', project:'API Integration', status:'Done', date:'Mon', points:30 },{ name:'API endpoint tests', project:'API Integration', status:'Done', date:'Tue', points:40 },{ name:'Homepage hero', project:'Website Redesign', status:'Done', date:'Wed', points:60 },{ name:'Code review', project:'Mobile App v2', status:'Done', date:'Thu', points:20 }], projects:[{ name:'API Integration', role:'Lead Dev', completion:75, budget:8500, contributed:3400, status:'In Progress' },{ name:'Website Redesign', role:'Dev', completion:94, budget:12000, contributed:2400, status:'In Progress' }] },
            'Last 30 Days':{ hoursWorked: 168,  tasksCompleted: 62, revenue: 21000, goalsAchieved: 9,  goalsTotal: 10, weeklyHours:[8,9,8,7,9,0,0],  tasks:[{ name:'Auth system', project:'API Integration', status:'Done', date:'May 2', points:85 },{ name:'DB optimization', project:'API Integration', status:'Done', date:'May 8', points:70 },{ name:'Hero section', project:'Website Redesign', status:'Done', date:'May 12', points:60 },{ name:'Mobile nav', project:'Mobile App v2', status:'In Progress', date:'May 11', points:45 }], projects:[{ name:'API Integration', role:'Lead Dev', completion:75, budget:8500, contributed:5100, status:'In Progress' },{ name:'Website Redesign', role:'Dev', completion:94, budget:12000, contributed:7200, status:'In Progress' },{ name:'Mobile App v2', role:'Contributor', completion:82, budget:28000, contributed:8700, status:'In Progress' }] },
            'Last 60 Days':{ hoursWorked: 336,  tasksCompleted: 118,revenue: 38000, goalsAchieved: 14, goalsTotal: 15, weeklyHours:[8,9,8,7,9,0,0],  tasks:[{ name:'Auth system', project:'API Integration', status:'Done', date:'Apr 2', points:85 },{ name:'DB sharding', project:'API Integration', status:'Done', date:'Apr 15', points:90 },{ name:'CI/CD pipeline', project:'API Integration', status:'Done', date:'May 1', points:70 },{ name:'Mobile nav', project:'Mobile App v2', status:'In Progress', date:'May 11', points:45 }], projects:[{ name:'API Integration', role:'Lead Dev', completion:75, budget:8500, contributed:5100, status:'In Progress' },{ name:'Website Redesign', role:'Dev', completion:94, budget:12000, contributed:9600, status:'In Progress' },{ name:'Mobile App v2', role:'Contributor', completion:82, budget:28000, contributed:11200, status:'In Progress' },{ name:'CRM Implementation', role:'Reviewer', completion:38, budget:45000, contributed:12100, status:'In Progress' }] },
            'Last Year':   { hoursWorked: 1980, tasksCompleted: 620,revenue: 142000,goalsAchieved: 23, goalsTotal: 25, weeklyHours:[8,9,8,7,9,2,0], tasks:[{ name:'Auth system', project:'API Integration', status:'Done', date:'Jan 10', points:85 },{ name:'Payment gateway', project:'E-Commerce', status:'Done', date:'Mar 5', points:95 },{ name:'CI/CD pipeline', project:'API Integration', status:'Done', date:'May 1', points:70 },{ name:'Mobile nav', project:'Mobile App v2', status:'In Progress', date:'May 11', points:45 }], projects:[{ name:'API Integration', role:'Lead Dev', completion:75, budget:8500, contributed:8500, status:'In Progress' },{ name:'Website Redesign', role:'Dev', completion:94, budget:12000, contributed:12000, status:'Completed' },{ name:'Mobile App v2', role:'Contributor', completion:82, budget:28000, contributed:18200, status:'In Progress' },{ name:'E-Commerce Platform', role:'Lead Dev', completion:5, budget:35000, contributed:35000, status:'In Progress' },{ name:'CRM Implementation', role:'Reviewer', completion:38, budget:45000, contributed:45000, status:'In Progress' },{ name:'Brand Identity', role:'Tech Lead', completion:100, budget:6200, contributed:6200, status:'Completed' }] },
        },
    },
    {
        id: 2, name: 'Hamza Ali', initials: 'HA', avatarColor: '#3B82F6',
        department: 'Design', reviewer: 'Lisa Park', rating: 4.5, goalsMet: 90, status: 'Completed',
        byPeriod: {
            'Last Day':    { hoursWorked: 7,    tasksCompleted: 4,  revenue: 900,   goalsAchieved: 1,  goalsTotal: 2,  weeklyHours:[7,0,0,0,0,0,0],  tasks:[{ name:'Wireframe v3', project:'Website Redesign', status:'Done', date:'Today', points:50 }], projects:[{ name:'Website Redesign', role:'Lead Designer', completion:94, budget:12000, contributed:2200, status:'In Progress' }] },
            'Last Week':   { hoursWorked: 38,   tasksCompleted: 14, revenue: 4200,  goalsAchieved: 3,  goalsTotal: 4,  weeklyHours:[7,8,7,8,8,0,0],  tasks:[{ name:'Wireframe v3', project:'Website Redesign', status:'Done', date:'Mon', points:50 },{ name:'Brand colors', project:'Brand Identity Kit', status:'Done', date:'Tue', points:35 },{ name:'Mobile mockups', project:'Mobile App v2', status:'Done', date:'Wed', points:60 }], projects:[{ name:'Website Redesign', role:'Lead Designer', completion:94, budget:12000, contributed:2200, status:'In Progress' },{ name:'Brand Identity Kit', role:'Lead Designer', completion:100, budget:6200, contributed:1800, status:'Completed' }] },
            'Last 30 Days':{ hoursWorked: 152,  tasksCompleted: 55, revenue: 16800, goalsAchieved: 8,  goalsTotal: 9,  weeklyHours:[7,8,7,8,8,0,0],  tasks:[{ name:'Wireframe v3', project:'Website Redesign', status:'Done', date:'May 2', points:50 },{ name:'Design system', project:'Mobile App v2', status:'Done', date:'May 8', points:75 },{ name:'UI components', project:'Website Redesign', status:'In Progress', date:'May 11', points:60 }], projects:[{ name:'Website Redesign', role:'Lead Designer', completion:94, budget:12000, contributed:7200, status:'In Progress' },{ name:'Brand Identity Kit', role:'Lead Designer', completion:100, budget:6200, contributed:4600, status:'Completed' },{ name:'Mobile App v2', role:'Designer', completion:82, budget:28000, contributed:5000, status:'In Progress' }] },
            'Last 60 Days':{ hoursWorked: 304,  tasksCompleted: 102,revenue: 29000, goalsAchieved: 13, goalsTotal: 15, weeklyHours:[7,8,7,8,8,0,0],  tasks:[{ name:'Wireframe v3', project:'Website Redesign', status:'Done', date:'Apr 5', points:50 },{ name:'Design system', project:'Mobile App v2', status:'Done', date:'Apr 18', points:75 },{ name:'UI components', project:'Website Redesign', status:'In Progress', date:'May 11', points:60 }], projects:[{ name:'Website Redesign', role:'Lead Designer', completion:94, budget:12000, contributed:9800, status:'In Progress' },{ name:'Brand Identity Kit', role:'Lead Designer', completion:100, budget:6200, contributed:6200, status:'Completed' },{ name:'Mobile App v2', role:'Designer', completion:82, budget:28000, contributed:13000, status:'In Progress' }] },
            'Last Year':   { hoursWorked: 1800, tasksCompleted: 510,revenue: 98000, goalsAchieved: 20, goalsTotal: 22, weeklyHours:[7,8,7,8,8,2,0], tasks:[{ name:'Wireframe v3', project:'Website Redesign', status:'Done', date:'Jan 12', points:50 },{ name:'Design system', project:'Mobile App v2', status:'Done', date:'Mar 22', points:75 },{ name:'UI components', project:'Website Redesign', status:'Done', date:'May 11', points:60 }], projects:[{ name:'Website Redesign', role:'Lead Designer', completion:94, budget:12000, contributed:12000, status:'In Progress' },{ name:'Brand Identity Kit', role:'Lead Designer', completion:100, budget:6200, contributed:6200, status:'Completed' },{ name:'Mobile App v2', role:'Designer', completion:82, budget:28000, contributed:22400, status:'In Progress' },{ name:'CRM Implementation', role:'UI Designer', completion:38, budget:45000, contributed:18000, status:'In Progress' }] },
        },
    },
    {
        id: 3, name: 'Marcus Chen', initials: 'MC', avatarColor: '#F59E0B',
        department: 'Engineering', reviewer: 'Sophie Turner', rating: 4.2, goalsMet: 84, status: 'Completed',
        byPeriod: {
            'Last Day':    { hoursWorked: 6,    tasksCompleted: 3,  revenue: 700,   goalsAchieved: 1, goalsTotal: 2,  weeklyHours:[6,0,0,0,0,0,0],  tasks:[{ name:'DB query fix', project:'CRM Implementation', status:'Done', date:'Today', points:25 }], projects:[{ name:'CRM Implementation', role:'Backend Dev', completion:38, budget:45000, contributed:1800, status:'In Progress' }] },
            'Last Week':   { hoursWorked: 35,   tasksCompleted: 12, revenue: 3800,  goalsAchieved: 3, goalsTotal: 4,  weeklyHours:[6,7,7,8,7,0,0],  tasks:[{ name:'DB query fix', project:'CRM Implementation', status:'Done', date:'Mon', points:25 },{ name:'Report module', project:'CRM Implementation', status:'Done', date:'Wed', points:55 }], projects:[{ name:'CRM Implementation', role:'Backend Dev', completion:38, budget:45000, contributed:3800, status:'In Progress' }] },
            'Last 30 Days':{ hoursWorked: 140,  tasksCompleted: 48, revenue: 14200, goalsAchieved: 7, goalsTotal: 9,  weeklyHours:[6,7,7,8,7,0,0],  tasks:[{ name:'DB query fix', project:'CRM Implementation', status:'Done', date:'May 2', points:25 },{ name:'Report module', project:'CRM Implementation', status:'Done', date:'May 9', points:55 },{ name:'API gateway', project:'API Integration', status:'In Progress', date:'May 11', points:70 }], projects:[{ name:'CRM Implementation', role:'Backend Dev', completion:38, budget:45000, contributed:9000, status:'In Progress' },{ name:'API Integration', role:'Dev', completion:75, budget:8500, contributed:3400, status:'In Progress' }] },
            'Last 60 Days':{ hoursWorked: 280,  tasksCompleted: 90, revenue: 25000, goalsAchieved:11, goalsTotal: 14, weeklyHours:[6,7,7,8,7,0,0],  tasks:[{ name:'DB query fix', project:'CRM Implementation', status:'Done', date:'Apr 2', points:25 },{ name:'Report module', project:'CRM Implementation', status:'Done', date:'Apr 20', points:55 },{ name:'API gateway', project:'API Integration', status:'In Progress', date:'May 11', points:70 }], projects:[{ name:'CRM Implementation', role:'Backend Dev', completion:38, budget:45000, contributed:14000, status:'In Progress' },{ name:'API Integration', role:'Dev', completion:75, budget:8500, contributed:5100, status:'In Progress' }] },
            'Last Year':   { hoursWorked: 1680, tasksCompleted: 480,revenue: 85000, goalsAchieved:18, goalsTotal: 22, weeklyHours:[6,7,7,8,7,0,0], tasks:[{ name:'DB schema', project:'CRM Implementation', status:'Done', date:'Jan 8', points:80 },{ name:'Report module', project:'CRM Implementation', status:'Done', date:'Mar 15', points:55 },{ name:'API gateway', project:'API Integration', status:'Done', date:'May 5', points:70 }], projects:[{ name:'CRM Implementation', role:'Backend Dev', completion:38, budget:45000, contributed:28000, status:'In Progress' },{ name:'API Integration', role:'Dev', completion:75, budget:8500, contributed:8500, status:'In Progress' },{ name:'Website Redesign', role:'Dev', completion:94, budget:12000, contributed:12000, status:'Completed' }] },
        },
    },
    {
        id: 4, name: 'Lisa Park', initials: 'LP', avatarColor: '#10B981',
        department: 'Operations', reviewer: 'Nina Kovač', rating: 4.7, goalsMet: 94, status: 'Completed',
        byPeriod: {
            'Last Day':    { hoursWorked: 8,    tasksCompleted: 6,  revenue: 1100,  goalsAchieved: 2, goalsTotal: 2,  weeklyHours:[8,0,0,0,0,0,0],  tasks:[{ name:'Sprint review', project:'Mobile App v2', status:'Done', date:'Today', points:30 }], projects:[{ name:'Mobile App v2', role:'PM', completion:82, budget:28000, contributed:2800, status:'In Progress' }] },
            'Last Week':   { hoursWorked: 40,   tasksCompleted: 20, revenue: 5500,  goalsAchieved: 4, goalsTotal: 4,  weeklyHours:[8,8,8,8,8,0,0],  tasks:[{ name:'Sprint review', project:'Mobile App v2', status:'Done', date:'Mon', points:30 },{ name:'Roadmap update', project:'CRM Implementation', status:'Done', date:'Wed', points:40 }], projects:[{ name:'Mobile App v2', role:'PM', completion:82, budget:28000, contributed:5600, status:'In Progress' },{ name:'CRM Implementation', role:'PM', completion:38, budget:45000, contributed:4500, status:'In Progress' }] },
            'Last 30 Days':{ hoursWorked: 160,  tasksCompleted: 72, revenue: 22000, goalsAchieved: 9, goalsTotal: 10, weeklyHours:[8,8,8,8,8,0,0],  tasks:[{ name:'Sprint review', project:'Mobile App v2', status:'Done', date:'May 3', points:30 },{ name:'Roadmap Q2', project:'CRM Implementation', status:'Done', date:'May 10', points:50 },{ name:'Stakeholder report', project:'Mobile App v2', status:'In Progress', date:'May 11', points:35 }], projects:[{ name:'Mobile App v2', role:'PM', completion:82, budget:28000, contributed:14000, status:'In Progress' },{ name:'CRM Implementation', role:'PM', completion:38, budget:45000, contributed:9000, status:'In Progress' }] },
            'Last 60 Days':{ hoursWorked: 320,  tasksCompleted: 138,revenue: 40000, goalsAchieved:14, goalsTotal: 15, weeklyHours:[8,8,8,8,8,0,0],  tasks:[{ name:'Sprint review', project:'Mobile App v2', status:'Done', date:'Apr 3', points:30 },{ name:'Roadmap Q2', project:'CRM Implementation', status:'Done', date:'Apr 22', points:50 },{ name:'Stakeholder report', project:'Mobile App v2', status:'In Progress', date:'May 11', points:35 }], projects:[{ name:'Mobile App v2', role:'PM', completion:82, budget:28000, contributed:19600, status:'In Progress' },{ name:'CRM Implementation', role:'PM', completion:38, budget:45000, contributed:18000, status:'In Progress' }] },
            'Last Year':   { hoursWorked: 1920, tasksCompleted: 720,revenue: 155000,goalsAchieved:22, goalsTotal: 24, weeklyHours:[8,8,8,8,8,1,0], tasks:[{ name:'Q1 Sprint', project:'Mobile App v2', status:'Done', date:'Jan 5', points:30 },{ name:'Product roadmap', project:'CRM Implementation', status:'Done', date:'Feb 18', points:70 },{ name:'Q2 planning', project:'Website Redesign', status:'Done', date:'Apr 1', points:50 }], projects:[{ name:'Mobile App v2', role:'PM', completion:82, budget:28000, contributed:28000, status:'In Progress' },{ name:'CRM Implementation', role:'PM', completion:38, budget:45000, contributed:45000, status:'In Progress' },{ name:'Website Redesign', role:'PM', completion:94, budget:12000, contributed:12000, status:'Completed' },{ name:'Brand Identity Kit', role:'PM', completion:100, budget:6200, contributed:6200, status:'Completed' }] },
        },
    },
    {
        id: 5, name: 'Nina Kovač', initials: 'NK', avatarColor: '#EC4899',
        department: 'HR', reviewer: 'Lisa Park', rating: 4.0, goalsMet: 80, status: 'Completed',
        byPeriod: {
            'Last Day':    { hoursWorked: 7,    tasksCompleted: 4,  revenue: 600,   goalsAchieved: 1, goalsTotal: 2,  weeklyHours:[7,0,0,0,0,0,0],  tasks:[{ name:'Onboarding docs', project:'Internal HR', status:'Done', date:'Today', points:20 }], projects:[{ name:'Internal HR', role:'HR Lead', completion:60, budget:5000, contributed:800, status:'In Progress' }] },
            'Last Week':   { hoursWorked: 35,   tasksCompleted: 15, revenue: 3000,  goalsAchieved: 3, goalsTotal: 4,  weeklyHours:[7,7,7,7,7,0,0],  tasks:[{ name:'Onboarding docs', project:'Internal HR', status:'Done', date:'Mon', points:20 },{ name:'Policy review', project:'Internal HR', status:'Done', date:'Thu', points:30 }], projects:[{ name:'Internal HR', role:'HR Lead', completion:60, budget:5000, contributed:2100, status:'In Progress' }] },
            'Last 30 Days':{ hoursWorked: 140,  tasksCompleted: 55, revenue: 11000, goalsAchieved: 6, goalsTotal: 8,  weeklyHours:[7,7,7,7,7,0,0],  tasks:[{ name:'Onboarding docs', project:'Internal HR', status:'Done', date:'May 2', points:20 },{ name:'Policy review', project:'Internal HR', status:'Done', date:'May 9', points:30 },{ name:'Hiring pipeline', project:'Internal HR', status:'In Progress', date:'May 11', points:45 }], projects:[{ name:'Internal HR', role:'HR Lead', completion:60, budget:5000, contributed:4200, status:'In Progress' }] },
            'Last 60 Days':{ hoursWorked: 280,  tasksCompleted: 100,revenue: 19000, goalsAchieved:10, goalsTotal: 13, weeklyHours:[7,7,7,7,7,0,0],  tasks:[{ name:'Onboarding docs', project:'Internal HR', status:'Done', date:'Apr 2', points:20 },{ name:'Policy review', project:'Internal HR', status:'Done', date:'Apr 18', points:30 },{ name:'Hiring pipeline', project:'Internal HR', status:'In Progress', date:'May 11', points:45 }], projects:[{ name:'Internal HR', role:'HR Lead', completion:60, budget:5000, contributed:5000, status:'In Progress' }] },
            'Last Year':   { hoursWorked: 1680, tasksCompleted: 480,revenue: 62000, goalsAchieved:16, goalsTotal: 20, weeklyHours:[7,7,7,7,7,0,0], tasks:[{ name:'Onboarding revamp', project:'Internal HR', status:'Done', date:'Jan 20', points:60 },{ name:'Policy framework', project:'Internal HR', status:'Done', date:'Mar 10', points:55 },{ name:'Hiring pipeline', project:'Internal HR', status:'Done', date:'May 5', points:45 }], projects:[{ name:'Internal HR', role:'HR Lead', completion:60, budget:5000, contributed:5000, status:'In Progress' }] },
        },
    },
    {
        id: 6, name: 'Priya Sharma', initials: 'PS', avatarColor: '#A855F7',
        department: 'Analytics', reviewer: 'Marcus Chen', rating: 4.6, goalsMet: 92, status: 'Completed',
        byPeriod: {
            'Last Day':    { hoursWorked: 8,    tasksCompleted: 5,  revenue: 1000,  goalsAchieved: 2, goalsTotal: 2,  weeklyHours:[8,0,0,0,0,0,0],  tasks:[{ name:'Dashboard metrics', project:'CRM Implementation', status:'Done', date:'Today', points:40 }], projects:[{ name:'CRM Implementation', role:'Data Analyst', completion:38, budget:45000, contributed:1800, status:'In Progress' }] },
            'Last Week':   { hoursWorked: 40,   tasksCompleted: 18, revenue: 5000,  goalsAchieved: 4, goalsTotal: 4,  weeklyHours:[8,8,8,8,8,0,0],  tasks:[{ name:'Dashboard metrics', project:'CRM Implementation', status:'Done', date:'Mon', points:40 },{ name:'Revenue report', project:'Reports', status:'Done', date:'Thu', points:55 }], projects:[{ name:'CRM Implementation', role:'Data Analyst', completion:38, budget:45000, contributed:3600, status:'In Progress' },{ name:'Reports', role:'Lead Analyst', completion:70, budget:4000, contributed:2000, status:'In Progress' }] },
            'Last 30 Days':{ hoursWorked: 160,  tasksCompleted: 65, revenue: 18000, goalsAchieved: 8, goalsTotal: 9,  weeklyHours:[8,8,8,8,8,0,0],  tasks:[{ name:'Dashboard metrics', project:'CRM Implementation', status:'Done', date:'May 3', points:40 },{ name:'Revenue report', project:'Reports', status:'Done', date:'May 9', points:55 },{ name:'Forecast model', project:'Reports', status:'In Progress', date:'May 11', points:80 }], projects:[{ name:'CRM Implementation', role:'Data Analyst', completion:38, budget:45000, contributed:9000, status:'In Progress' },{ name:'Reports', role:'Lead Analyst', completion:70, budget:4000, contributed:4000, status:'In Progress' }] },
            'Last 60 Days':{ hoursWorked: 320,  tasksCompleted: 120,revenue: 32000, goalsAchieved:13, goalsTotal: 15, weeklyHours:[8,8,8,8,8,0,0],  tasks:[{ name:'Dashboard metrics', project:'CRM Implementation', status:'Done', date:'Apr 3', points:40 },{ name:'Revenue report', project:'Reports', status:'Done', date:'Apr 22', points:55 },{ name:'Forecast model', project:'Reports', status:'In Progress', date:'May 11', points:80 }], projects:[{ name:'CRM Implementation', role:'Data Analyst', completion:38, budget:45000, contributed:13500, status:'In Progress' },{ name:'Reports', role:'Lead Analyst', completion:70, budget:4000, contributed:4000, status:'Completed' }] },
            'Last Year':   { hoursWorked: 1920, tasksCompleted: 600,revenue: 118000,goalsAchieved:21, goalsTotal: 23, weeklyHours:[8,8,8,8,8,1,0], tasks:[{ name:'Annual dashboard', project:'CRM Implementation', status:'Done', date:'Jan 15', points:85 },{ name:'Revenue forecast', project:'Reports', status:'Done', date:'Mar 8', points:75 },{ name:'KPI model', project:'Reports', status:'Done', date:'May 5', points:80 }], projects:[{ name:'CRM Implementation', role:'Data Analyst', completion:38, budget:45000, contributed:27000, status:'In Progress' },{ name:'Reports', role:'Lead Analyst', completion:70, budget:4000, contributed:4000, status:'Completed' }] },
        },
    },
    {
        id: 7, name: 'Sophie Turner', initials: 'ST', avatarColor: '#06B6D4',
        department: 'Engineering', reviewer: 'Lisa Park', rating: null, goalsMet: 60, status: 'In Progress',
        byPeriod: {
            'Last Day':    { hoursWorked: 5,    tasksCompleted: 2,  revenue: 400,   goalsAchieved: 0, goalsTotal: 2,  weeklyHours:[5,0,0,0,0,0,0],  tasks:[{ name:'Unit tests', project:'Mobile App v2', status:'In Progress', date:'Today', points:30 }], projects:[{ name:'Mobile App v2', role:'Dev', completion:82, budget:28000, contributed:700, status:'In Progress' }] },
            'Last Week':   { hoursWorked: 28,   tasksCompleted: 9,  revenue: 2200,  goalsAchieved: 2, goalsTotal: 4,  weeklyHours:[5,6,5,6,6,0,0],  tasks:[{ name:'Unit tests', project:'Mobile App v2', status:'In Progress', date:'Today', points:30 },{ name:'Login flow', project:'Mobile App v2', status:'Done', date:'Wed', points:50 }], projects:[{ name:'Mobile App v2', role:'Dev', completion:82, budget:28000, contributed:2800, status:'In Progress' }] },
            'Last 30 Days':{ hoursWorked: 112,  tasksCompleted: 35, revenue: 8500,  goalsAchieved: 4, goalsTotal: 7,  weeklyHours:[5,6,5,6,6,0,0],  tasks:[{ name:'Unit tests', project:'Mobile App v2', status:'In Progress', date:'Today', points:30 },{ name:'Login flow', project:'Mobile App v2', status:'Done', date:'May 5', points:50 },{ name:'Push notifications', project:'Mobile App v2', status:'Done', date:'May 9', points:65 }], projects:[{ name:'Mobile App v2', role:'Dev', completion:82, budget:28000, contributed:8500, status:'In Progress' }] },
            'Last 60 Days':{ hoursWorked: 224,  tasksCompleted: 68, revenue: 16000, goalsAchieved: 7, goalsTotal: 12, weeklyHours:[5,6,5,6,6,0,0],  tasks:[{ name:'Unit tests', project:'Mobile App v2', status:'In Progress', date:'Today', points:30 },{ name:'Login flow', project:'Mobile App v2', status:'Done', date:'Apr 5', points:50 },{ name:'Push notifications', project:'Mobile App v2', status:'Done', date:'Apr 20', points:65 }], projects:[{ name:'Mobile App v2', role:'Dev', completion:82, budget:28000, contributed:14000, status:'In Progress' }] },
            'Last Year':   { hoursWorked: 1344, tasksCompleted: 350,revenue: 62000, goalsAchieved:12, goalsTotal: 20, weeklyHours:[5,6,5,6,6,0,0], tasks:[{ name:'Architecture design', project:'Mobile App v2', status:'Done', date:'Jan 20', points:85 },{ name:'Core modules', project:'Mobile App v2', status:'Done', date:'Mar 12', points:90 },{ name:'Push notifications', project:'Mobile App v2', status:'Done', date:'May 9', points:65 }], projects:[{ name:'Mobile App v2', role:'Dev', completion:82, budget:28000, contributed:22400, status:'In Progress' }] },
        },
    },
    {
        id: 8, name: 'Tom Wilson', initials: 'TW', avatarColor: '#EF4444',
        department: 'Engineering', reviewer: 'Sophie Turner', rating: null, goalsMet: 45, status: 'In Progress',
        byPeriod: {
            'Last Day':    { hoursWorked: 4,    tasksCompleted: 1,  revenue: 300,   goalsAchieved: 0, goalsTotal: 2,  weeklyHours:[4,0,0,0,0,0,0],  tasks:[{ name:'Bug fix #21', project:'Security Audit', status:'In Progress', date:'Today', points:20 }], projects:[{ name:'Security Audit', role:'Dev', completion:12, budget:15000, contributed:300, status:'In Progress' }] },
            'Last Week':   { hoursWorked: 22,   tasksCompleted: 6,  revenue: 1500,  goalsAchieved: 1, goalsTotal: 3,  weeklyHours:[4,4,5,4,5,0,0],  tasks:[{ name:'Bug fix #21', project:'Security Audit', status:'In Progress', date:'Today', points:20 },{ name:'Pen test setup', project:'Security Audit', status:'Done', date:'Wed', points:45 }], projects:[{ name:'Security Audit', role:'Dev', completion:12, budget:15000, contributed:1500, status:'In Progress' }] },
            'Last 30 Days':{ hoursWorked: 88,   tasksCompleted: 22, revenue: 5800,  goalsAchieved: 2, goalsTotal: 5,  weeklyHours:[4,4,5,4,5,0,0],  tasks:[{ name:'Bug fix #21', project:'Security Audit', status:'In Progress', date:'Today', points:20 },{ name:'Pen test setup', project:'Security Audit', status:'Done', date:'May 2', points:45 },{ name:'Vuln report', project:'Security Audit', status:'Done', date:'May 9', points:60 }], projects:[{ name:'Security Audit', role:'Dev', completion:12, budget:15000, contributed:4200, status:'In Progress' }] },
            'Last 60 Days':{ hoursWorked: 176,  tasksCompleted: 44, revenue: 10000, goalsAchieved: 4, goalsTotal: 9,  weeklyHours:[4,4,5,4,5,0,0],  tasks:[{ name:'Bug fix', project:'Security Audit', status:'Done', date:'Apr 5', points:20 },{ name:'Pen test', project:'Security Audit', status:'Done', date:'Apr 20', points:45 },{ name:'Vuln report', project:'Security Audit', status:'In Progress', date:'May 9', points:60 }], projects:[{ name:'Security Audit', role:'Dev', completion:12, budget:15000, contributed:8400, status:'In Progress' }] },
            'Last Year':   { hoursWorked: 1056, tasksCompleted: 240,revenue: 42000, goalsAchieved: 9, goalsTotal: 18, weeklyHours:[4,4,5,4,5,0,0], tasks:[{ name:'Initial audit', project:'Security Audit', status:'Done', date:'Jan 25', points:70 },{ name:'Pen test framework', project:'Security Audit', status:'Done', date:'Mar 20', points:80 },{ name:'Vuln report', project:'Security Audit', status:'In Progress', date:'May 9', points:60 }], projects:[{ name:'Security Audit', role:'Dev', completion:12, budget:15000, contributed:15000, status:'In Progress' }] },
        },
    },
    {
        id: 9,  name: 'Zara Ahmed',  initials: 'ZA', avatarColor: '#F97316', department: 'Marketing',  reviewer: 'Nina Kovač',   rating: null, goalsMet: null, status: 'Pending',
        byPeriod: {
            'Last Day':    { hoursWorked: 6, tasksCompleted: 2, revenue: 500,  goalsAchieved: 0, goalsTotal: 3, weeklyHours:[6,0,0,0,0,0,0], tasks:[{ name:'Campaign brief', project:'Brand Identity Kit', status:'In Progress', date:'Today', points:25 }], projects:[{ name:'Brand Identity Kit', role:'Marketing', completion:100, budget:6200, contributed:1200, status:'Completed' }] },
            'Last Week':   { hoursWorked: 30, tasksCompleted: 8, revenue: 2500, goalsAchieved: 1, goalsTotal: 3, weeklyHours:[6,6,6,6,6,0,0], tasks:[{ name:'Campaign brief', project:'Brand Identity Kit', status:'Done', date:'Mon', points:25 }], projects:[{ name:'Brand Identity Kit', role:'Marketing', completion:100, budget:6200, contributed:2400, status:'Completed' }] },
            'Last 30 Days':{ hoursWorked: 120, tasksCompleted: 30, revenue: 9000, goalsAchieved: 2, goalsTotal: 3, weeklyHours:[6,6,6,6,6,0,0], tasks:[{ name:'Campaign brief', project:'Brand Identity Kit', status:'Done', date:'May 3', points:25 }], projects:[{ name:'Brand Identity Kit', role:'Marketing', completion:100, budget:6200, contributed:6200, status:'Completed' }] },
            'Last 60 Days':{ hoursWorked: 240, tasksCompleted: 58, revenue: 16000, goalsAchieved: 3, goalsTotal: 3, weeklyHours:[6,6,6,6,6,0,0], tasks:[{ name:'Campaign brief', project:'Brand Identity Kit', status:'Done', date:'Apr 3', points:25 }], projects:[{ name:'Brand Identity Kit', role:'Marketing', completion:100, budget:6200, contributed:6200, status:'Completed' }] },
            'Last Year':   { hoursWorked: 1440, tasksCompleted: 320, revenue: 55000, goalsAchieved: 8, goalsTotal: 10, weeklyHours:[6,6,6,6,6,0,0], tasks:[{ name:'Annual campaign', project:'Brand Identity Kit', status:'Done', date:'Jan 18', points:70 }], projects:[{ name:'Brand Identity Kit', role:'Marketing', completion:100, budget:6200, contributed:6200, status:'Completed' }] },
        },
    },
    {
        id: 10, name: 'Carlos Ruiz', initials: 'CR', avatarColor: '#14B8A6', department: 'Sales',      reviewer: 'Ali Hassan',   rating: null, goalsMet: null, status: 'Pending',
        byPeriod: {
            'Last Day':    { hoursWorked: 7, tasksCompleted: 3, revenue: 800,  goalsAchieved: 0, goalsTotal: 3, weeklyHours:[7,0,0,0,0,0,0], tasks:[{ name:'Client outreach', project:'CRM Implementation', status:'In Progress', date:'Today', points:20 }], projects:[{ name:'CRM Implementation', role:'Sales', completion:38, budget:45000, contributed:1200, status:'In Progress' }] },
            'Last Week':   { hoursWorked: 35, tasksCompleted: 12, revenue: 4000, goalsAchieved: 1, goalsTotal: 3, weeklyHours:[7,7,7,7,7,0,0], tasks:[{ name:'Client outreach', project:'CRM Implementation', status:'Done', date:'Mon', points:20 }], projects:[{ name:'CRM Implementation', role:'Sales', completion:38, budget:45000, contributed:3600, status:'In Progress' }] },
            'Last 30 Days':{ hoursWorked: 140, tasksCompleted: 45, revenue: 14000, goalsAchieved: 2, goalsTotal: 3, weeklyHours:[7,7,7,7,7,0,0], tasks:[{ name:'Client outreach', project:'CRM Implementation', status:'Done', date:'May 3', points:20 },{ name:'Sales report', project:'CRM Implementation', status:'In Progress', date:'May 11', points:40 }], projects:[{ name:'CRM Implementation', role:'Sales', completion:38, budget:45000, contributed:9000, status:'In Progress' }] },
            'Last 60 Days':{ hoursWorked: 280, tasksCompleted: 88, revenue: 26000, goalsAchieved: 3, goalsTotal: 5, weeklyHours:[7,7,7,7,7,0,0], tasks:[{ name:'Client outreach', project:'CRM Implementation', status:'Done', date:'Apr 3', points:20 },{ name:'Sales report', project:'CRM Implementation', status:'Done', date:'Apr 20', points:40 }], projects:[{ name:'CRM Implementation', role:'Sales', completion:38, budget:45000, contributed:18000, status:'In Progress' }] },
            'Last Year':   { hoursWorked: 1680, tasksCompleted: 480, revenue: 98000, goalsAchieved: 10, goalsTotal: 14, weeklyHours:[7,7,7,7,7,0,0], tasks:[{ name:'Annual sales push', project:'CRM Implementation', status:'Done', date:'Jan 10', points:75 },{ name:'Key account mgmt', project:'CRM Implementation', status:'Done', date:'Mar 25', points:65 }], projects:[{ name:'CRM Implementation', role:'Sales', completion:38, budget:45000, contributed:45000, status:'In Progress' }] },
        },
    },
];

const timeframes = ['Last Day', 'Last Week', 'Last 30 Days', 'Last 60 Days', 'Last Year'];
const cycles     = ['Q1 2026', 'Q2 2026', 'Annual 2025'];

const statusConfig: Record<string, { bg: string; color: string }> = {
    Pending:      { bg: '#FEF3C7', color: '#D97706' },
    'In Progress':{ bg: '#EFF6FF', color: '#3B82F6' },
    Completed:    { bg: '#DCFCE7', color: '#16A34A' },
};

// ── Star rating ───────────────────────────────────────────────────────────────
function StarRating({ rating, size = 14 }: { rating: number | null; size?: number }) {
    if (rating === null) return <span style={{ color: '#9CA3AF', fontSize: 13 }}>—</span>;
    const full = Math.floor(rating); const partial = rating % 1;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ display: 'flex', gap: 1 }}>
                {[1,2,3,4,5].map(i => {
                    const isPartial = i === full + 1 && partial > 0;
                    const filled    = i <= full || isPartial;
                    return <Star key={i} size={size} fill={filled ? '#F59E0B' : '#E5E7EB'} color={filled ? '#F59E0B' : '#E5E7EB'} style={{ opacity: isPartial ? 0.6 : 1 }} />;
                })}
            </div>
            <span style={{ fontWeight: 700, color: PD, fontSize: size - 1, marginLeft: 2 }}>{rating}</span>
        </div>
    );
}

// ── Mini bar chart ────────────────────────────────────────────────────────────
function WeekBar({ hours }: { hours: number[] }) {
    const days = ['M','T','W','T','F','S','S'];
    const max  = Math.max(...hours, 1);
    return (
        <div style={{ display:'flex', gap:6, alignItems:'flex-end', height:60 }}>
            {hours.map((h, i) => (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                    <div style={{ width:'100%', borderRadius:4, background: h > 0 ? `linear-gradient(180deg,${P},#A855F7)` : '#F1F5F9', height: `${(h/max)*48}px`, minHeight: h>0?4:0, transition:'height 0.4s' }} />
                    <span style={{ fontSize:10, color:'#94a3b8' }}>{days[i]}</span>
                </div>
            ))}
        </div>
    );
}

// ── Employee Detail Panel ─────────────────────────────────────────────────────
function EmployeeDetailPanel({ emp, timeframe, onClose }: { emp: Employee; timeframe: string; onClose: () => void }) {
    const d = emp.byPeriod[timeframe];
    const goalPct = Math.round((d.goalsAchieved / d.goalsTotal) * 100);
    const goalColor = goalPct >= 90 ? '#16A34A' : goalPct >= 70 ? '#3B82F6' : '#D97706';

    const kpis = [
        { label:'Tasks Completed',  value: d.tasksCompleted, icon: CheckCircle2, color:'#7C3AED', bg:'#F5F3FF', suffix:'' },
        { label:'Hours Worked',     value: d.hoursWorked,    icon: Clock,        color:'#0369A1', bg:'#EFF6FF', suffix:'h' },
        { label:'Revenue Generated',value: `$${d.revenue.toLocaleString()}`, icon: DollarSign, color:'#059669', bg:'#ECFDF5', suffix:'' },
        { label:'Goals Achieved',   value: `${d.goalsAchieved}/${d.goalsTotal}`, icon: Target, color: goalColor, bg: goalPct>=90?'#DCFCE7':goalPct>=70?'#EFF6FF':'#FEF3C7', suffix:'' },
    ];

    return (
        <div style={{ position:'fixed', top:0, right:0, width:'min(720px, 100vw)', height:'100vh', background:'#fff', zIndex:1000, boxShadow:'-6px 0 40px rgba(30,27,75,0.14)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
            {/* Header */}
            <div style={{ background:`linear-gradient(135deg, ${PD} 0%, #312E81 60%, ${P} 100%)`, padding:'24px 28px', flexShrink:0 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                    <button onClick={onClose} style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.12)', border:'none', borderRadius:8, padding:'6px 12px', color:'rgba(255,255,255,0.8)', cursor:'pointer', fontSize:13 }}>
                        <ArrowLeft size={14} /> Back
                    </button>
                    <button onClick={onClose} style={{ background:'rgba(255,255,255,0.1)', border:'none', borderRadius:8, padding:6, cursor:'pointer', color:'rgba(255,255,255,0.7)', display:'flex', alignItems:'center' }}>
                        <X size={16} />
                    </button>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                    <div style={{ width:64, height:64, borderRadius:'50%', background:emp.avatarColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:800, color:'#fff', border:'3px solid rgba(255,255,255,0.3)', flexShrink:0 }}>
                        {emp.initials}
                    </div>
                    <div style={{ flex:1 }}>
                        <div style={{ fontSize:22, fontWeight:800, color:'#fff', marginBottom:4 }}>{emp.name}</div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:8, alignItems:'center' }}>
                            <span style={{ background:'rgba(255,255,255,0.15)', borderRadius:20, padding:'3px 12px', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.9)' }}>{emp.department}</span>
                            <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>Reviewer: {emp.reviewer}</span>
                            <span style={{ background: statusConfig[emp.status].bg, color: statusConfig[emp.status].color, borderRadius:20, padding:'3px 12px', fontSize:12, fontWeight:600 }}>{emp.status}</span>
                        </div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                        <StarRating rating={emp.rating} size={16} />
                        {emp.goalsMet !== null && <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginTop:4 }}>Goals: {emp.goalsMet}%</div>}
                    </div>
                </div>
                {/* Timeframe badge */}
                <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:6 }}>
                    <Calendar size={13} color='rgba(196,181,253,0.8)' />
                    <span style={{ fontSize:12, color:'rgba(196,181,253,0.9)', fontWeight:600 }}>Showing data for: {timeframe}</span>
                </div>
            </div>

            {/* Scrollable body */}
            <div style={{ flex:1, overflowY:'auto', padding:'24px 28px', background:'#F8F7FF' }}>

                {/* KPI cards */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginBottom:20 }}>
                    {kpis.map(k => (
                        <div key={k.label} style={{ ...card, padding:'16px 18px', display:'flex', alignItems:'center', gap:12 }}>
                            <div style={{ width:40, height:40, borderRadius:10, background:k.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                <k.icon size={18} color={k.color} />
                            </div>
                            <div>
                                <div style={{ fontSize:20, fontWeight:800, color:PD, lineHeight:1 }}>{k.value}{k.suffix}</div>
                                <div style={{ fontSize:12, color:'#94a3b8', marginTop:3 }}>{k.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Goals progress + weekly hours side by side */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
                    {/* Goals */}
                    <div style={{ ...card, padding:'18px 20px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                            <div style={{ width:28, height:28, borderRadius:7, background:'#F5F3FF', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <Target size={14} color={P} />
                            </div>
                            <span style={{ fontSize:13, fontWeight:700, color:PD }}>Goals Breakdown</span>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                            <div style={{ flex:1, height:10, borderRadius:5, background:'#EDE9FE', overflow:'hidden' }}>
                                <div style={{ height:'100%', width:`${goalPct}%`, background:`linear-gradient(90deg,${goalColor},${goalColor}99)`, borderRadius:5, transition:'width 0.5s' }} />
                            </div>
                            <span style={{ fontSize:14, fontWeight:800, color:goalColor, minWidth:34 }}>{goalPct}%</span>
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#94a3b8' }}>
                            <span>Achieved: <strong style={{ color:PD }}>{d.goalsAchieved}</strong></span>
                            <span>Total: <strong style={{ color:PD }}>{d.goalsTotal}</strong></span>
                        </div>
                        {/* Goal items */}
                        <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:6 }}>
                            {Array.from({ length: d.goalsTotal }, (_, i) => (
                                <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                                    <CheckCircle2 size={14} color={i < d.goalsAchieved ? '#16A34A' : '#E5E7EB'} fill={i < d.goalsAchieved ? '#16A34A' : 'none'} />
                                    <span style={{ fontSize:12, color: i < d.goalsAchieved ? '#374151' : '#94a3b8' }}>Goal {i + 1}</span>
                                    {i < d.goalsAchieved && <span style={{ marginLeft:'auto', fontSize:10, fontWeight:600, color:'#16A34A' }}>✓ Met</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly hours */}
                    <div style={{ ...card, padding:'18px 20px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                            <div style={{ width:28, height:28, borderRadius:7, background:'#F5F3FF', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <BarChart3 size={14} color={P} />
                            </div>
                            <span style={{ fontSize:13, fontWeight:700, color:PD }}>Weekly Work Pattern</span>
                        </div>
                        <WeekBar hours={d.weeklyHours} />
                        <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, fontSize:12, color:'#94a3b8' }}>
                            <span>Total: <strong style={{ color:PD }}>{d.hoursWorked}h</strong></span>
                            <span>Avg/day: <strong style={{ color:PD }}>{(d.hoursWorked / 5).toFixed(1)}h</strong></span>
                        </div>
                    </div>
                </div>

                {/* Recent tasks */}
                <div style={{ ...card, padding:'18px 20px', marginBottom:16 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                        <div style={{ width:28, height:28, borderRadius:7, background:'#F5F3FF', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <CheckCircle2 size={14} color={P} />
                        </div>
                        <span style={{ fontSize:13, fontWeight:700, color:PD }}>Tasks ({d.tasksCompleted} completed)</span>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                        {d.tasks.map((t, i) => (
                            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:8, background: t.status==='Done' ? '#F0FDF4' : '#FFFBEB', border:`1px solid ${t.status==='Done' ? '#BBF7D0' : '#FDE68A'}` }}>
                                <CheckCircle2 size={15} color={t.status==='Done' ? '#16A34A' : '#D97706'} fill={t.status==='Done' ? '#16A34A' : 'none'} />
                                <div style={{ flex:1, minWidth:0 }}>
                                    <div style={{ fontSize:13, fontWeight:600, color:PD, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.name}</div>
                                    <div style={{ fontSize:11, color:'#94a3b8' }}>{t.project}</div>
                                </div>
                                <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                                    <span style={{ fontSize:11, background: t.status==='Done'?'#DCFCE7':'#FEF3C7', color: t.status==='Done'?'#16A34A':'#D97706', borderRadius:12, padding:'2px 8px', fontWeight:600 }}>{t.status}</span>
                                    <span style={{ fontSize:10, color:'#94a3b8' }}>{t.date}</span>
                                    <div style={{ background:'#EDE9FE', borderRadius:12, padding:'2px 7px', fontSize:11, fontWeight:700, color:P, display:'flex', alignItems:'center', gap:3 }}>
                                        <Zap size={10} color={P} />{t.points}pt
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Projects */}
                <div style={{ ...card, padding:'18px 20px', marginBottom:16 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                        <div style={{ width:28, height:28, borderRadius:7, background:'#F5F3FF', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <FolderKanban size={14} color={P} />
                        </div>
                        <span style={{ fontSize:13, fontWeight:700, color:PD }}>Assigned Projects</span>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                        {d.projects.map((pr, i) => (
                            <div key={i} style={{ padding:'12px 14px', borderRadius:9, border:'1px solid #EDE9FE', background:'#FAFBFF' }}>
                                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                                    <div>
                                        <span style={{ fontSize:13, fontWeight:700, color:PD }}>{pr.name}</span>
                                        <span style={{ fontSize:11, color:'#94a3b8', marginLeft:8 }}>· {pr.role}</span>
                                    </div>
                                    <span style={{ fontSize:11, background: pr.status==='Completed'?'#DCFCE7':pr.completion>=70?'#EFF6FF':'#FEF3C7', color: pr.status==='Completed'?'#16A34A':pr.completion>=70?'#3B82F6':'#D97706', borderRadius:12, padding:'2px 8px', fontWeight:600 }}>{pr.status}</span>
                                </div>
                                {/* Completion bar */}
                                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                    <div style={{ flex:1, height:6, borderRadius:3, background:'#EDE9FE', overflow:'hidden' }}>
                                        <div style={{ height:'100%', width:`${pr.completion}%`, background:`linear-gradient(90deg,${P},#A855F7)`, borderRadius:3 }} />
                                    </div>
                                    <span style={{ fontSize:11, fontWeight:700, color:P, minWidth:28 }}>{pr.completion}%</span>
                                </div>
                                <div style={{ display:'flex', gap:14, marginTop:6, fontSize:11, color:'#94a3b8' }}>
                                    <span>Budget: <strong style={{ color:PD }}>${pr.budget.toLocaleString()}</strong></span>
                                    <span>Contributed: <strong style={{ color:'#059669' }}>${pr.contributed.toLocaleString()}</strong></span>
                                    <span>Share: <strong style={{ color:P }}>{Math.round((pr.contributed/pr.budget)*100)}%</strong></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Revenue breakdown */}
                <div style={{ ...card, padding:'18px 20px', marginBottom:16 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                        <div style={{ width:28, height:28, borderRadius:7, background:'#ECFDF5', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <DollarSign size={14} color='#059669' />
                        </div>
                        <span style={{ fontSize:13, fontWeight:700, color:PD }}>Revenue Contribution</span>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                        {[
                            { label:'Total Generated',  value:`$${d.revenue.toLocaleString()}`,                              color:'#059669', bg:'#ECFDF5' },
                            { label:'Avg per Task',      value:`$${Math.round(d.revenue/Math.max(d.tasksCompleted,1)).toLocaleString()}`, color:P,         bg:'#F5F3FF' },
                            { label:'Avg per Hour',      value:`$${Math.round(d.revenue/Math.max(d.hoursWorked,1)).toLocaleString()}`,   color:'#0369A1', bg:'#EFF6FF' },
                        ].map(r => (
                            <div key={r.label} style={{ background:r.bg, borderRadius:9, padding:'12px 14px', textAlign:'center' }}>
                                <div style={{ fontSize:18, fontWeight:800, color:r.color }}>{r.value}</div>
                                <div style={{ fontSize:11, color:'#94a3b8', marginTop:3 }}>{r.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

// ── New Review Modal ──────────────────────────────────────────────────────────
function NewReviewModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [form] = Form.useForm();
    return open ? (
        <div style={{ position:'fixed', inset:0, zIndex:900, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ position:'absolute', inset:0, background:'rgba(30,27,75,0.5)' }} onClick={onClose} />
            <div style={{ ...card, position:'relative', zIndex:1, padding:28, width:480, borderRadius:16 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                    <h3 style={{ margin:0, fontSize:17, fontWeight:800, color:PD }}>New Performance Review</h3>
                    <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}><X size={18} /></button>
                </div>
                <Form form={form} layout="vertical">
                    <Form.Item name="employee" label="Employee" rules={[{ required:true }]}>
                        <Select placeholder="Select employee">
                            {employees.map(e => <Select.Option key={e.id} value={e.name}>{e.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="reviewer" label="Reviewer" rules={[{ required:true }]}>
                        <Select placeholder="Select reviewer">
                            {['Lisa Park','Nina Kovač','Sophie Turner','Marcus Chen','Ali Hassan'].map(n => <Select.Option key={n} value={n}>{n}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="period" label="Review Period" rules={[{ required:true }]}>
                        <Select placeholder="Select period">
                            {['Q1 2026','Q2 2026','Q3 2026','Q4 2026','Annual 2025'].map(p => <Select.Option key={p} value={p}>{p}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="goals" label="Goals">
                        <Select mode="tags" placeholder="Enter goals (press Enter to add)" />
                    </Form.Item>
                    <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
                        <button onClick={onClose} style={{ padding:'8px 18px', borderRadius:8, border:'1px solid #EDE9FE', background:'#fff', cursor:'pointer', fontSize:13, color:'#374151' }}>Cancel</button>
                        <button onClick={() => { form.resetFields(); onClose(); }} style={{ padding:'8px 18px', borderRadius:8, border:'none', background:`linear-gradient(135deg,${P},${PD})`, color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer' }}>Create Review</button>
                    </div>
                </Form>
            </div>
        </div>
    ) : null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main page
// ═══════════════════════════════════════════════════════════════════════════════
// Map auth name → employee name in mock data
function resolveEmployeeName(authName: string): string {
    const map: Record<string, string> = {
        'Sara Employee': 'Sara Kim',
        'Sara Kim':      'Sara Kim',
        'Hamza Ali':     'Hamza Ali',
        'Lisa Park':     'Lisa Park',
        'Marcus Chen':   'Marcus Chen',
        'Nina Kovač':    'Nina Kovač',
        'Sophie Turner': 'Sophie Turner',
    };
    return map[authName] ?? authName;
}

export default function Performance() {
    const { auth } = usePage<PageProps>().props;
    const role = auth.user.role;
    const isManager = role === 'manager' || role === 'owner' || role === 'super_admin';
    const myName = resolveEmployeeName(auth.user.name);

    // Employees only see their own record
    const visibleEmployees = isManager ? employees : employees.filter(e => e.name === myName);
    // Fallback: if name not matched for an employee, show the first record (demo mode)
    const displayEmployees = (!isManager && visibleEmployees.length === 0) ? [employees[0]] : visibleEmployees;

    const [modalOpen,    setModalOpen]    = useState(false);
    const [selectedCycle,setSelectedCycle]= useState('Q1 2026');
    const [timeframe,    setTimeframe]    = useState('Last 30 Days');
    const [selectedEmp,  setSelectedEmp]  = useState<Employee | null>(null);

    const completed     = displayEmployees.filter(e => e.status === 'Completed');
    const avgRating     = completed.length > 0
        ? (completed.reduce((s,e) => s + (e.rating ?? 0), 0) / completed.length).toFixed(1)
        : '—';
    const topPerformers = displayEmployees.filter(e => e.rating !== null && e.rating >= 4.5).length;
    const reviewsDue    = displayEmployees.filter(e => e.status === 'Pending').length;

    // For employee view: KPIs are their own stats from the selected timeframe
    const myEmp = displayEmployees[0];
    const myPeriod = myEmp?.byPeriod[timeframe];

    type KpiItem = { label: string; value: string | number; color: string; sub: string };
    const kpiCards: KpiItem[] = isManager ? [
        { label: 'Reviews Due',          value: reviewsDue,                 color: '#D97706', sub: 'Awaiting start' },
        { label: 'Completed This Cycle', value: completed.length,           color: '#16A34A', sub: selectedCycle },
        { label: 'Avg Rating',           value: `${avgRating}/5`,           color: '#F59E0B', sub: 'Across all reviews' },
        { label: 'Top Performers',       value: topPerformers,              color: P,         sub: 'Rating ≥ 4.5' },
    ] : myPeriod ? [
        { label: 'Tasks Completed', value: myPeriod.tasksCompleted,                             color: P,         sub: timeframe },
        { label: 'Hours Worked',    value: `${myPeriod.hoursWorked}h`,                          color: '#0369A1', sub: timeframe },
        { label: 'Goals Achieved',  value: `${myPeriod.goalsAchieved}/${myPeriod.goalsTotal}`,  color: '#16A34A', sub: `${Math.round((myPeriod.goalsAchieved / Math.max(myPeriod.goalsTotal, 1)) * 100)}% completion` },
        { label: 'My Rating',       value: myEmp?.rating ? `${myEmp.rating}/5` : 'Pending',     color: '#F59E0B', sub: 'Latest review' },
    ] : [];

    return (
        <AppLayout>
            <Head title="Performance Reviews" />
            <div style={{ padding:'32px 40px', background:'#F5F3FF', minHeight:'100vh' }}>

                {/* Header */}
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
                    <div>
                        <h1 style={{ margin:0, fontSize:26, fontWeight:800, color:PD }}>
                            {isManager ? 'Performance Reviews' : 'My Performance'}
                        </h1>
                        <p style={{ margin:'4px 0 0', color:'#6B7280', fontSize:14 }}>
                            {isManager
                                ? 'Track employee performance, goals, and review cycles'
                                : 'Your personal performance reviews, goals, and ratings'}
                        </p>
                    </div>
                    {isManager && (
                        <button onClick={() => setModalOpen(true)} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:9, border:'none', background:`linear-gradient(135deg,${P},${PD})`, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:`0 4px 14px ${P}44` }}>
                            <Plus size={16} /> New Review
                        </button>
                    )}
                </div>

                {/* KPI cards */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:22 }}>
                    {kpiCards.map(s => (
                        <div key={s.label} style={{ ...card, padding:'20px 24px' }}>
                            <div style={{ fontSize:28, fontWeight:800, color:s.color }}>{s.value}</div>
                            <div style={{ fontSize:14, fontWeight:600, color:PD, marginTop:2 }}>{s.label}</div>
                            <div style={{ fontSize:12, color:'#9CA3AF', marginTop:2 }}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Filter bar */}
                <div style={{ ...card, padding:'14px 18px', marginBottom:16, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                    {/* Review Cycle (managers only) */}
                    {isManager && (
                        <>
                            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                <span style={{ fontSize:13, fontWeight:600, color:'#374151', whiteSpace:'nowrap' }}>Review Cycle:</span>
                                <div style={{ display:'flex', gap:5 }}>
                                    {cycles.map(c => (
                                        <button key={c} onClick={() => setSelectedCycle(c)} style={{ padding:'5px 13px', borderRadius:7, border: selectedCycle===c ? `1.5px solid ${P}` : '1.5px solid #EDE9FE', background: selectedCycle===c ? P : '#fff', color: selectedCycle===c ? '#fff' : '#374151', fontWeight:600, fontSize:12, cursor:'pointer', transition:'all 0.15s' }}>{c}</button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ width:1, height:28, background:'#EDE9FE', flexShrink:0 }} />
                        </>
                    )}

                    {/* Timeframe */}
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <Calendar size={14} color='#94a3b8' />
                        <span style={{ fontSize:13, fontWeight:600, color:'#374151', whiteSpace:'nowrap' }}>Timeframe:</span>
                        <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                            {timeframes.map(t => {
                                const active = timeframe === t;
                                return (
                                    <button key={t} onClick={() => setTimeframe(t)} style={{ padding:'5px 13px', borderRadius:7, border: active ? `1.5px solid ${P}` : '1.5px solid #EDE9FE', background: active ? '#F5F3FF' : '#fff', color: active ? P : '#374151', fontWeight: active ? 700 : 500, fontSize:12, cursor:'pointer', transition:'all 0.15s' }}>{t}</button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Employee self-view: auto-expanded detail */}
                {!isManager && myEmp && (
                    <div style={{ ...card, borderRadius:14, overflow:'hidden', marginBottom:16 }}>
                        {/* Profile banner */}
                        <div style={{ background:`linear-gradient(135deg,${PD},${P})`, padding:'24px 28px', display:'flex', alignItems:'center', gap:20 }}>
                            <div style={{ width:56, height:56, borderRadius:'50%', background:myEmp.avatarColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800, color:'#fff', border:'3px solid rgba(255,255,255,0.3)' }}>{myEmp.initials}</div>
                            <div>
                                <p style={{ margin:0, fontSize:20, fontWeight:800, color:'#fff' }}>{myEmp.name}</p>
                                <p style={{ margin:'3px 0 0', fontSize:13, color:'rgba(255,255,255,0.65)' }}>{myEmp.department} · Reviewed by {myEmp.reviewer}</p>
                            </div>
                            <div style={{ marginLeft:'auto', textAlign:'right' }}>
                                <p style={{ margin:0, fontSize:11, color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Latest Rating</p>
                                <div style={{ marginTop:4 }}><StarRating rating={myEmp.rating} size={16} /></div>
                            </div>
                        </div>
                        {/* Row */}
                        <div style={{ display:'grid', gridTemplateColumns:'2fr 1.2fr 1.2fr 1.4fr 1.4fr 1.2fr 1fr', padding:'14px 20px', gap:8, alignItems:'center', cursor:'pointer', transition:'background 0.12s' }}
                            onClick={() => setSelectedEmp(myEmp)}
                            onMouseEnter={e => (e.currentTarget.style.background='#FAFAFF')}
                            onMouseLeave={e => (e.currentTarget.style.background='')}
                        >
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                <div style={{ width:36, height:36, borderRadius:'50%', background:myEmp.avatarColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff' }}>{myEmp.initials}</div>
                                <span style={{ fontWeight:600, color:PD, fontSize:14 }}>{myEmp.name}</span>
                            </div>
                            <span style={{ background:'#F5F3FF', color:P, borderRadius:6, padding:'3px 10px', fontSize:12, fontWeight:600, border:'1px solid #EDE9FE', display:'inline-block' }}>{myEmp.department}</span>
                            <span style={{ fontSize:13, color:'#374151' }}>{myEmp.reviewer}</span>
                            <StarRating rating={myEmp.rating} />
                            {myPeriod && (() => {
                                const goalsMet = Math.round((myPeriod.goalsAchieved/Math.max(myPeriod.goalsTotal,1))*100);
                                const gColor = goalsMet >= 90 ? '#16A34A' : goalsMet >= 70 ? '#3B82F6' : '#D97706';
                                return (
                                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                        <div style={{ flex:1, height:6, borderRadius:3, background:'#EDE9FE', overflow:'hidden' }}>
                                            <div style={{ height:'100%', width:`${goalsMet}%`, background:gColor, borderRadius:3 }} />
                                        </div>
                                        <span style={{ fontSize:12, fontWeight:700, color:gColor, minWidth:32 }}>{goalsMet}%</span>
                                    </div>
                                );
                            })()}
                            <span style={{ background:statusConfig[myEmp.status].bg, color:statusConfig[myEmp.status].color, borderRadius:20, padding:'3px 12px', fontSize:12, fontWeight:600, display:'inline-block' }}>{myEmp.status}</span>
                            <button
                                onClick={e => { e.stopPropagation(); setSelectedEmp(myEmp); }}
                                style={{ padding:'4px 14px', borderRadius:7, border:`1px solid #EDE9FE`, background:'#fff', color:P, fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}
                                onMouseEnter={e => { e.currentTarget.style.background=P; e.currentTarget.style.color='#fff'; }}
                                onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.color=P; }}
                            >
                                View <ChevronRight size={12} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Manager view: full employee table */}
                {isManager && (
                    <div style={{ ...card, borderRadius:14, overflow:'hidden' }}>
                        <div style={{ display:'grid', gridTemplateColumns:'2fr 1.2fr 1.2fr 1.4fr 1.4fr 1.2fr 1fr', padding:'12px 20px', background:'#FAFBFF', borderBottom:'1px solid #EDE9FE', gap:8 }}>
                            {['EMPLOYEE','DEPARTMENT','REVIEWER','RATING','GOALS MET','STATUS','ACTIONS'].map(h => (
                                <span key={h} style={{ fontSize:11, fontWeight:700, color:'#94a3b8', letterSpacing:'0.08em' }}>{h}</span>
                            ))}
                        </div>

                        {displayEmployees.map((emp, idx) => {
                            const d        = emp.byPeriod[timeframe];
                            const goalsMet = d.goalsAchieved && d.goalsTotal ? Math.round((d.goalsAchieved/d.goalsTotal)*100) : emp.goalsMet;
                            const gColor   = goalsMet !== null ? (goalsMet >= 90 ? '#16A34A' : goalsMet >= 70 ? '#3B82F6' : '#D97706') : '#94a3b8';
                            const cfg      = statusConfig[emp.status];
                            return (
                                <div
                                    key={emp.id}
                                    onClick={() => setSelectedEmp(emp)}
                                    style={{ display:'grid', gridTemplateColumns:'2fr 1.2fr 1.2fr 1.4fr 1.4fr 1.2fr 1fr', padding:'14px 20px', gap:8, borderBottom: idx < displayEmployees.length-1 ? '1px solid #F3F4F6' : 'none', cursor:'pointer', transition:'background 0.12s', alignItems:'center' }}
                                    onMouseEnter={e => (e.currentTarget.style.background='#FAFAFF')}
                                    onMouseLeave={e => (e.currentTarget.style.background='')}
                                >
                                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                        <div style={{ width:36, height:36, borderRadius:'50%', background:emp.avatarColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff', flexShrink:0 }}>{emp.initials}</div>
                                        <span style={{ fontWeight:600, color:PD, fontSize:14 }}>{emp.name}</span>
                                    </div>
                                    <span style={{ background:'#F5F3FF', color:P, borderRadius:6, padding:'3px 10px', fontSize:12, fontWeight:600, border:'1px solid #EDE9FE', display:'inline-block' }}>{emp.department}</span>
                                    <span style={{ fontSize:13, color:'#374151' }}>{emp.reviewer}</span>
                                    <StarRating rating={emp.rating} />
                                    {goalsMet !== null ? (
                                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                            <div style={{ flex:1, height:6, borderRadius:3, background:'#EDE9FE', overflow:'hidden' }}>
                                                <div style={{ height:'100%', width:`${goalsMet}%`, background:gColor, borderRadius:3 }} />
                                            </div>
                                            <span style={{ fontSize:12, fontWeight:700, color:gColor, minWidth:32 }}>{goalsMet}%</span>
                                        </div>
                                    ) : <span style={{ color:'#9CA3AF', fontSize:13 }}>—</span>}
                                    <span style={{ background:cfg.bg, color:cfg.color, borderRadius:20, padding:'3px 12px', fontSize:12, fontWeight:600, display:'inline-block' }}>{emp.status}</span>
                                    <button
                                        onClick={e => { e.stopPropagation(); setSelectedEmp(emp); }}
                                        style={{ padding:'4px 14px', borderRadius:7, border:`1px solid #EDE9FE`, background:'#fff', color:P, fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:5, transition:'all 0.15s' }}
                                        onMouseEnter={e => { e.currentTarget.style.background=P; e.currentTarget.style.color='#fff'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.color=P; }}
                                    >
                                        View <ChevronRight size={12} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Detail panel overlay */}
            {selectedEmp && (
                <>
                    <div style={{ position:'fixed', inset:0, background:'rgba(30,27,75,0.35)', zIndex:999 }} onClick={() => setSelectedEmp(null)} />
                    <EmployeeDetailPanel emp={selectedEmp} timeframe={timeframe} onClose={() => setSelectedEmp(null)} />
                </>
            )}

            {isManager && <NewReviewModal open={modalOpen} onClose={() => setModalOpen(false)} />}
        </AppLayout>
    );
}
