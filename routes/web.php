<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\S3UploadController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\TimesheetController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\CrmController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => redirect()->route('login'));

// ── Authenticated routes ───────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {

    // ── Dashboard (role-aware) ───────────────────────────────────────────────
    Route::get('/dashboard', function () {
        $user = auth()->user();

        // Owner must complete onboarding before accessing dashboard
        if ($user->role === 'owner') {
            $hasWorkspace = \App\Models\Workspace::where('owner_id', $user->id)->exists();
            if (!$hasWorkspace) {
                return redirect()->route('onboarding');
            }
        }

        $page = match($user->role) {
            'owner'       => 'Dashboard/Owner',
            'super_admin' => 'Dashboard/Admin',
            'manager'     => 'Dashboard/Manager',
            'employee'    => 'Dashboard/Employee',
            'client'      => 'Dashboard/Client',
            default       => 'Dashboard/Employee',
        };
        return Inertia::render($page);
    })->name('dashboard');

    // ── Workspace / Onboarding ───────────────────────────────────────────────
    // Only accessible to owners who haven't completed setup yet
    Route::get('/onboarding', function () {
        $user = auth()->user();
        // Non-owners go straight to dashboard
        if ($user->role !== 'owner') {
            return redirect()->route('dashboard');
        }
        // Owners who already completed onboarding go to dashboard
        $hasWorkspace = \App\Models\Workspace::where('owner_id', $user->id)->exists();
        if ($hasWorkspace) {
            return redirect()->route('dashboard');
        }
        return Inertia::render('Onboarding/Index');
    })->name('onboarding');
    Route::post('/onboarding',       [WorkspaceController::class, 'store'])->name('onboarding.save');
    Route::get('/api/workspace',     [WorkspaceController::class, 'show'])->name('workspace.show');

    // ── Projects ─────────────────────────────────────────────────────────────
    Route::get('/projects',          [ProjectController::class, 'index'])->name('projects.index');
    Route::post('/projects',         [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/projects/{id}',     [ProjectController::class, 'show'])->name('projects.show');
    Route::patch('/projects/{id}',   [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('/projects/{id}',  [ProjectController::class, 'destroy'])->name('projects.destroy');

    // ── Clients ──────────────────────────────────────────────────────────────
    Route::get('/clients', function () {
        $owner = auth()->user();
        $ownerId = $owner->role === 'owner' ? $owner->id : ($owner->invited_by ?? $owner->id);
        $dbClients = \App\Models\User::where('invited_by', $ownerId)
            ->where('role', 'client')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'email'      => $u->email,
                'phone'      => $u->phone ?? '—',
                'company'    => $u->department ?? '—',
                'created_at' => $u->created_at->format('M d, Y'),
            ]);
        return Inertia::render('Clients/Index', ['dbClients' => $dbClients]);
    })->name('clients.index');
    Route::post('/clients',          [ClientController::class, 'store'])->name('clients.store');
    Route::get('/clients/{id}',      [ClientController::class, 'show'])->name('clients.show');
    Route::patch('/clients/{id}',    [ClientController::class, 'update'])->name('clients.update');
    Route::delete('/clients/{id}',   [ClientController::class, 'destroy'])->name('clients.destroy');

    // ── Finance: Invoices ────────────────────────────────────────────────────
    Route::get('/finance/invoices',  [InvoiceController::class, 'index'])->name('finance.invoices');
    Route::post('/finance/invoices', [InvoiceController::class, 'store'])->name('finance.invoices.store');
    Route::patch('/finance/invoices/{id}', [InvoiceController::class, 'update'])->name('finance.invoices.update');

    // ── Finance: Expenses ────────────────────────────────────────────────────
    Route::get('/finance/expenses',  [ExpenseController::class, 'index'])->name('finance.expenses');
    Route::post('/finance/expenses', [ExpenseController::class, 'store'])->name('finance.expenses.store');
    Route::patch('/finance/expenses/{id}', [ExpenseController::class, 'update'])->name('finance.expenses.update');

    // ── Finance: Reports (static for now) ───────────────────────────────────
    Route::get('/finance/reports',   fn() => Inertia::render('Finance/Reports'))->name('finance.reports');

    // ── CRM ──────────────────────────────────────────────────────────────────
    Route::get('/crm/pipeline',      fn() => Inertia::render('CRM/Pipeline'))->name('crm.pipeline');
    Route::get('/crm/leads',         [CrmController::class, 'leads'])->name('crm.leads');
    Route::post('/crm/leads',        [CrmController::class, 'storeLead'])->name('crm.leads.store');
    Route::patch('/crm/leads/{id}',  [CrmController::class, 'updateLead'])->name('crm.leads.update');
    Route::get('/crm/contacts',      [CrmController::class, 'contacts'])->name('crm.contacts');
    Route::post('/crm/contacts',     [CrmController::class, 'storeContact'])->name('crm.contacts.store');

    // ── HR & People ──────────────────────────────────────────────────────────
    Route::get('/hr/employees', function () {
        $owner = auth()->user();
        $ownerId = $owner->role === 'owner' ? $owner->id : ($owner->invited_by ?? $owner->id);
        $dbEmployees = \App\Models\User::where('invited_by', $ownerId)
            ->whereIn('role', ['employee', 'manager'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($u) => [
                'id'        => $u->id,
                'name'      => $u->name,
                'email'     => $u->email,
                'role'      => $u->role,
                'title'     => $u->job_title ?? '—',
                'dept'      => $u->department ?? '—',
                'phone'     => $u->phone ?? '—',
                'status'    => ucfirst($u->status ?? 'active'),
                'salary'    => $u->salary_amount ? '$'.number_format($u->salary_amount, 0) : '—',
                'startDate' => $u->start_date ? $u->start_date->format('M d, Y') : '—',
                'avatar'    => strtoupper(substr($u->name, 0, 2)),
            ]);
        return Inertia::render('HR/Employees', ['dbEmployees' => $dbEmployees]);
    })->name('hr.employees');
    Route::get('/hr/employees/{id}', fn($id) => Inertia::render('HR/Employees', ['employeeId' => $id]))->name('hr.employees.show');
    Route::get('/hr/departments',    fn() => Inertia::render('HR/Departments'))->name('hr.departments');
    Route::get('/hr/leave',          fn() => Inertia::render('HR/Leave'))->name('hr.leave');
    Route::get('/hr/performance',    fn() => Inertia::render('HR/Performance'))->name('hr.performance');

    // ── Leave Management ─────────────────────────────────────────────────────
    Route::get('/leave/my',              [LeaveController::class, 'myLeaves'])->name('leave.my');
    Route::post('/leave/request',        [LeaveController::class, 'request'])->name('leave.request');
    Route::get('/leave/approvals',       [LeaveController::class, 'approvals'])->name('leave.approvals');
    Route::post('/leave/{id}/approve',   [LeaveController::class, 'approve'])->name('leave.approve');
    Route::post('/leave/{id}/reject',    [LeaveController::class, 'reject'])->name('leave.reject');
    Route::get('/leave/policy',          [LeaveController::class, 'policy'])->name('leave.policy');
    Route::post('/leave/policy',         [LeaveController::class, 'updatePolicy'])->name('leave.policy.update');
    Route::post('/leave/rules',          fn() => back())->name('leave.rules.store');
    Route::put('/leave/rules/{id}',      fn($id) => back())->name('leave.rules.update');
    Route::delete('/leave/rules/{id}',   fn($id) => back())->name('leave.rules.destroy');

    // ── Payroll ──────────────────────────────────────────────────────────────
    Route::get('/payroll',               [PayrollController::class, 'index'])->name('payroll.index');
    Route::post('/payroll/generate',     [PayrollController::class, 'generate'])->name('payroll.generate');
    Route::get('/payroll/payslips',      fn() => Inertia::render('Payroll/Payslips'))->name('payroll.payslips');
    Route::get('/payroll/{id}',          fn($id) => Inertia::render('Payroll/Show'))->name('payroll.show');
    Route::post('/payroll/{id}/finalize',fn($id) => back())->name('payroll.finalize');
    Route::delete('/payroll/{id}',       fn($id) => back())->name('payroll.destroy');
    Route::post('/salary/{id}',          fn($id) => back())->name('salary.set');

    // ── Attendance ───────────────────────────────────────────────────────────
    Route::get('/attendance/clock-in',   [AttendanceController::class, 'index'])->name('attendance.clockin');
    Route::post('/attendance/clock-in',  [AttendanceController::class, 'clockIn'])->name('attendance.clock-in');
    Route::post('/attendance/clock-out', [AttendanceController::class, 'clockOut'])->name('attendance.clock-out');

    // ── Timesheets ───────────────────────────────────────────────────────────
    Route::get('/timesheets',            fn() => Inertia::render('Timesheets/Index'))->name('timesheets.index');
    Route::get('/timesheets/team',       fn() => Inertia::render('Timesheets/Team'))->name('timesheets.team');
    Route::get('/my-timesheets',         [TimesheetController::class, 'index'])->name('time.my');
    Route::get('/time-entry',            fn() => Inertia::render('Time/Entry'))->name('time.entry');
    Route::post('/time-entry',           [TimesheetController::class, 'store'])->name('time.entry.store');

    // ── Notifications ────────────────────────────────────────────────────────
    Route::get('/notifications',             [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read',  [NotificationController::class, 'markRead'])->name('notifications.read');
    Route::post('/notifications/read-all',   [NotificationController::class, 'markAllRead'])->name('notifications.read-all');

    // ── Documents ────────────────────────────────────────────────────────────
    Route::get('/documents',             fn() => Inertia::render('Documents/Index'))->name('documents.index');

    // ── Reports ──────────────────────────────────────────────────────────────
    Route::get('/reports',               fn() => Inertia::render('Reports/Index'))->name('reports.index');
    Route::get('/resources',             fn() => Inertia::render('Resources/Index'))->name('resources.index');
    Route::get('/my-tasks',              fn() => Inertia::render('Tasks/MyTasks'))->name('tasks.my');
    Route::get('/team',                  fn() => Inertia::render('Team/Index'))->name('team.index');
    Route::get('/ai/smart-tasks',        fn() => Inertia::render('AI/SmartTasks'))->name('ai.smart-tasks');

    // ── Owner routes ──────────────────────────────────────────────────────────
    Route::get('/owner/team', function () {
        $owner = auth()->user();
        $members = \App\Models\User::where('invited_by', $owner->id)
            ->orderBy('created_at', 'desc')
            ->get(['id','name','email','role','job_title','department','created_at'])
            ->map(fn($u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'email'      => $u->email,
                'role'       => $u->role,
                'job_title'  => $u->job_title,
                'department' => $u->department,
                'created_at' => $u->created_at->format('Y-m-d'),
            ]);
        return Inertia::render('Owner/Team', ['teamMembers' => $members]);
    })->name('owner.team');

    Route::get('/owner/settings',    fn() => Inertia::render('Owner/Settings'))->name('owner.settings');
    Route::get('/owner/projects',    [ProjectController::class, 'index'])->name('owner.projects');
    Route::get('/owner/timesheets',  fn() => Inertia::render('Timesheets/Team'))->name('owner.timesheets');
    Route::get('/owner/reports',     fn() => Inertia::render('Reports/Index'))->name('owner.reports');

    // ── Team Member Management ───────────────────────────────────────────────
    Route::get('/api/team-members',           [TeamMemberController::class, 'index'])->name('team.members');
    Route::post('/owner/invite/manager',      [TeamMemberController::class, 'storeManager'])->name('owner.invite.manager');
    Route::post('/owner/invite/employee',     [TeamMemberController::class, 'storeEmployee'])->name('owner.invite.employee');
    Route::post('/owner/invite/client',       [TeamMemberController::class, 'storeClient'])->name('owner.invite.client');
    Route::post('/owner/invite',              [TeamMemberController::class, 'storeManager'])->name('owner.invite');
    Route::delete('/owner/invite/{id}',       [TeamMemberController::class, 'destroy'])->name('owner.invite.destroy');

    // ── Client portal ────────────────────────────────────────────────────────
    Route::get('/client/dashboard',       fn() => Inertia::render('Dashboard/Client'))->name('client.dashboard');
    Route::get('/client/project/{id}',    fn($id) => Inertia::render('Projects/Show', ['projectId' => $id]))->name('client.project');
    Route::post('/client/comment',        fn() => back())->name('client.comment');
    Route::post('/client/{id}/projects',  fn($id) => back())->name('client.projects.sync');
    Route::post('/project/{id}/client/assign', fn($id) => back())->name('project.client.assign');
    Route::delete('/project/{id}/client/{cid}', fn($id,$cid) => back())->name('project.client.remove');

    // ── Manager Settings ─────────────────────────────────────────────────────
    Route::get('/manager/settings',  fn() => Inertia::render('Manager/Settings'))->name('manager.settings');

    // ── Super Admin ──────────────────────────────────────────────────────────
    Route::get('/admin/tenants',     fn() => Inertia::render('Admin/Tenants'))->name('admin.tenants');
    Route::get('/admin/users',       fn() => Inertia::render('Admin/Users'))->name('admin.users');
    Route::get('/admin/analytics',   fn() => Inertia::render('Admin/Analytics'))->name('admin.analytics');
    Route::get('/admin/billing',     fn() => Inertia::render('Admin/Billing'))->name('admin.billing');
    Route::get('/admin/settings',    fn() => Inertia::render('Admin/Settings'))->name('admin.settings');

    // ── S3 Upload ────────────────────────────────────────────────────────────
    Route::post('/upload/presign',    [S3UploadController::class, 'presign'])->name('upload.presign');
    Route::post('/upload/signed-get', [S3UploadController::class, 'signedGet'])->name('upload.signed-get');

    // ── Profile ──────────────────────────────────────────────────────────────
    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
