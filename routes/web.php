<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\S3UploadController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => redirect()->route('login'));

// ── Authenticated routes ────────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard (role-aware)
    Route::get('/dashboard', function () {
        $page = match(auth()->user()->role) {
            'owner'       => 'Dashboard/Owner',
            'super_admin' => 'Dashboard/Admin',
            'manager'     => 'Dashboard/Manager',
            'employee'    => 'Dashboard/Employee',
            'client'      => 'Dashboard/Client',
            default       => 'Dashboard/Employee',
        };
        return Inertia::render($page);
    })->name('dashboard');

    // ── HR & People ─────────────────────────────────────────────────────────
    Route::get('/hr/employees',          fn() => Inertia::render('HR/Employees'))->name('hr.employees');
    Route::get('/hr/employees/{id}',     fn($id) => Inertia::render('HR/Employees', ['employeeId' => $id]))->name('hr.employees.show');
    Route::get('/hr/departments',        fn() => Inertia::render('HR/Departments'))->name('hr.departments');
    Route::get('/hr/leave',              fn() => Inertia::render('HR/Leave'))->name('hr.leave');
    Route::get('/hr/performance',        fn() => Inertia::render('HR/Performance'))->name('hr.performance');

    // ── Payroll ─────────────────────────────────────────────────────────────
    Route::get('/payroll',               fn() => Inertia::render('Payroll/Index'))->name('payroll.index');
    Route::get('/payroll/payslips',      fn() => Inertia::render('Payroll/Payslips'))->name('payroll.payslips');

    // ── CRM & Sales ─────────────────────────────────────────────────────────
    Route::get('/crm/pipeline',          fn() => Inertia::render('CRM/Pipeline'))->name('crm.pipeline');
    Route::get('/crm/leads',             fn() => Inertia::render('CRM/Leads'))->name('crm.leads');
    Route::get('/crm/contacts',          fn() => Inertia::render('CRM/Contacts'))->name('crm.contacts');

    // ── Finance ─────────────────────────────────────────────────────────────
    Route::get('/finance/invoices',      fn() => Inertia::render('Finance/Invoices'))->name('finance.invoices');
    Route::get('/finance/expenses',      fn() => Inertia::render('Finance/Expenses'))->name('finance.expenses');
    Route::get('/finance/reports',       fn() => Inertia::render('Finance/Reports'))->name('finance.reports');

    // ── AI & Automation ─────────────────────────────────────────────────────
    Route::get('/ai/smart-tasks',        fn() => Inertia::render('AI/SmartTasks'))->name('ai.smart-tasks');

    // ── Manager routes ──────────────────────────────────────────────────────
    Route::get('/projects',              fn() => Inertia::render('Projects/Index'))->name('projects.index');
    Route::get('/projects/{id}',         fn($id) => Inertia::render('Projects/Show', ['projectId' => $id]))->name('projects.show');
    Route::get('/clients',               fn() => Inertia::render('Clients/Index'))->name('clients.index');
    Route::get('/clients/{id}',          fn($id) => Inertia::render('Clients/Show', ['clientId' => $id]))->name('clients.show');
    Route::get('/team',                  fn() => Inertia::render('Team/Index'))->name('team.index');
    Route::get('/resources',             fn() => Inertia::render('Resources/Index'))->name('resources.index');
    Route::get('/timesheets',            fn() => Inertia::render('Timesheets/Index'))->name('timesheets.index');
    Route::get('/reports',               fn() => Inertia::render('Reports/Index'))->name('reports.index');

    // ── Onboarding ──────────────────────────────────────────────────────────
    Route::get('/onboarding',            fn() => Inertia::render('Onboarding/Index'))->name('onboarding');

    // ── Owner routes ─────────────────────────────────────────────────────────
    Route::get('/owner/team',            fn() => Inertia::render('Owner/Team'))->name('owner.team');
    Route::post('/owner/invite',         fn() => back())->name('owner.invite');
    Route::delete('/owner/invite/{id}',  fn($id) => back())->name('owner.invite.destroy');
    Route::get('/owner/settings',        fn() => Inertia::render('Owner/Settings'))->name('owner.settings');
    Route::get('/owner/projects',        fn() => Inertia::render('Projects/Index'))->name('owner.projects');
    Route::get('/owner/timesheets',      fn() => Inertia::render('Timesheets/Team'))->name('owner.timesheets');
    Route::get('/owner/reports',         fn() => Inertia::render('Reports/Index'))->name('owner.reports');

    // ── Leave management ─────────────────────────────────────────────────────
    Route::get('/leave/my',              fn() => Inertia::render('Leave/MyLeaves'))->name('leave.my');
    Route::post('/leave/request',        fn() => back())->name('leave.request');
    Route::get('/leave/approvals',       fn() => Inertia::render('Leave/Approvals'))->name('leave.approvals');
    Route::post('/leave/{id}/approve',   fn($id) => back())->name('leave.approve');
    Route::post('/leave/{id}/reject',    fn($id) => back())->name('leave.reject');
    Route::get('/leave/policy',          fn() => Inertia::render('Leave/Policy'))->name('leave.policy');
    Route::post('/leave/policy',         fn() => back())->name('leave.policy.update');
    Route::post('/leave/rules',          fn() => back())->name('leave.rules.store');
    Route::put('/leave/rules/{id}',      fn($id) => back())->name('leave.rules.update');
    Route::delete('/leave/rules/{id}',   fn($id) => back())->name('leave.rules.destroy');
    Route::post('/salary/{id}',          fn($id) => back())->name('salary.set');

    // ── Payroll (extended) ───────────────────────────────────────────────────
    Route::get('/payroll/{id}',          fn($id) => Inertia::render('Payroll/Show'))->name('payroll.show');
    Route::post('/payroll/generate',     fn() => back())->name('payroll.generate');
    Route::post('/payroll/{id}/finalize',fn($id) => back())->name('payroll.finalize');
    Route::delete('/payroll/{id}',       fn($id) => back())->name('payroll.destroy');

    // ── Team timesheets ──────────────────────────────────────────────────────
    Route::get('/timesheets/team',       fn() => Inertia::render('Timesheets/Team'))->name('timesheets.team');

    // ── Client portal ────────────────────────────────────────────────────────
    Route::get('/client/dashboard',      fn() => Inertia::render('Dashboard/Client'))->name('client.dashboard');
    Route::get('/client/project/{id}',   fn($id) => Inertia::render('Projects/Show', ['projectId' => $id]))->name('client.project');
    Route::post('/client/comment',       fn() => back())->name('client.comment');
    Route::post('/client/{id}/projects', fn($id) => back())->name('client.projects.sync');
    Route::post('/project/{id}/client/assign', fn($id) => back())->name('project.client.assign');
    Route::delete('/project/{id}/client/{cid}',fn($id,$cid) => back())->name('project.client.remove');

    // ── Attendance ──────────────────────────────────────────────────────────
    Route::get('/attendance/clock-in',   fn() => Inertia::render('Attendance/ClockIn'))->name('attendance.clockin');

    // ── Employee routes ─────────────────────────────────────────────────────
    Route::get('/my-tasks',              fn() => Inertia::render('Tasks/MyTasks'))->name('tasks.my');
    Route::get('/time-entry',            fn() => Inertia::render('Time/Entry'))->name('time.entry');
    Route::get('/my-timesheets',         fn() => Inertia::render('Time/MyTimesheets'))->name('time.my');
    Route::get('/documents',             fn() => Inertia::render('Documents/Index'))->name('documents.index');
    Route::get('/notifications',         fn() => Inertia::render('Notifications/Index'))->name('notifications.index');

    // ── S3 Direct Upload ─────────────────────────────────────────────────────
    Route::post('/upload/presign',     [S3UploadController::class, 'presign'])->name('upload.presign');
    Route::post('/upload/signed-get',  [S3UploadController::class, 'signedGet'])->name('upload.signed-get');

    // ── Manager Settings ─────────────────────────────────────────────────────
    Route::get('/manager/settings',      fn() => Inertia::render('Manager/Settings'))->name('manager.settings');

    // ── Super Admin routes ──────────────────────────────────────────────────
    Route::get('/admin/tenants',         fn() => Inertia::render('Admin/Tenants'))->name('admin.tenants');
    Route::get('/admin/users',           fn() => Inertia::render('Admin/Users'))->name('admin.users');
    Route::get('/admin/analytics',       fn() => Inertia::render('Admin/Analytics'))->name('admin.analytics');
    Route::get('/admin/billing',         fn() => Inertia::render('Admin/Billing'))->name('admin.billing');
    Route::get('/admin/settings',        fn() => Inertia::render('Admin/Settings'))->name('admin.settings');

    // ── Profile ─────────────────────────────────────────────────────────────
    Route::get('/profile',               [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',             [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile',            [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
