<?php

namespace App\Http\Controllers;

use App\Mail\TeamInvitation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class TeamMemberController extends Controller
{
    /**
     * List all team members belonging to the authenticated owner's workspace.
     */
    public function index(Request $request)
    {
        $owner = Auth::user();

        $members = User::where('invited_by', $owner->id)
            ->orWhere('id', $owner->id)
            ->orderBy('created_at', 'desc')
            ->get(['id','name','email','role','job_title','department','phone','status','created_at']);

        return response()->json(['members' => $members]);
    }

    /**
     * Add a Manager to the workspace.
     */
    public function storeManager(Request $request): RedirectResponse
    {
        $owner = Auth::user();

        $validated = $request->validate([
            'firstName'    => ['required', 'string', 'max:100'],
            'lastName'     => ['required', 'string', 'max:100'],
            'email'        => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'phone'        => ['nullable', 'string', 'max:30'],
            'dob'          => ['nullable', 'date'],
            'gender'       => ['nullable', 'string', 'max:50'],
            'address'      => ['nullable', 'string', 'max:255'],
            // Role & scope
            'title'        => ['required', 'string', 'max:150'],
            'department'   => ['required', 'string', 'max:100'],
            'reportsTo'    => ['nullable', 'string', 'max:100'],
            'startDate'    => ['nullable', 'date'],
            'employeeId'   => ['nullable', 'string', 'max:50'],
            'workType'     => ['nullable', 'string', 'max:50'],
            'timezone'     => ['nullable', 'string', 'max:100'],
            // Permissions
            'permissions'  => ['nullable', 'array'],
            // Compensation
            'salaryType'   => ['required', 'string', 'in:monthly,yearly,hourly'],
            'salaryAmount' => ['nullable', 'numeric', 'min:0'],
            'currency'     => ['nullable', 'string', 'max:10'],
            'paySchedule'  => ['nullable', 'string', 'max:50'],
            // Options
            'sendInvite'   => ['nullable', 'boolean'],
        ]);

        // Generate a temporary password
        $tempPassword = Str::random(12);

        $manager = User::create([
            'name'             => trim($validated['firstName'] . ' ' . $validated['lastName']),
            'email'            => $validated['email'],
            'password'         => Hash::make($tempPassword),
            'role'             => 'manager',
            'tenant_id'        => $owner->tenant_id ?? (string) $owner->id,
            'job_title'        => $validated['title'],
            'department'       => $validated['department'],
            'phone'            => $validated['phone'] ?? null,
            'employee_id'      => $validated['employeeId'] ?? null,
            'start_date'       => $validated['startDate'] ?? null,
            'work_type'        => $validated['workType'] ?? null,
            'timezone'         => $validated['timezone'] ?? null,
            'salary_type'      => $validated['salaryType'],
            'salary_amount'    => $validated['salaryAmount'] ?? null,
            'currency'         => $validated['currency'] ?? 'USD',
            'pay_schedule'     => $validated['paySchedule'] ?? null,
            'permissions'      => $validated['permissions'] ?? [],
            'status'           => 'active',
            'invited_by'       => $owner->id,
            'email_verified_at'=> now(),
        ]);

        if ($validated['sendInvite'] ?? true) {
            try {
                Mail::to($manager->email)
                    ->send(new TeamInvitation($manager, $owner, $tempPassword, 'manager'));
            } catch (\Exception $e) {
                \Log::warning('Invitation email failed: ' . $e->getMessage());
            }
        }

        return back()->with('success', "Manager \"{$manager->name}\" added successfully! Temporary password: {$tempPassword}");
    }

    /**
     * Add an Employee to the workspace.
     */
    public function storeEmployee(Request $request): RedirectResponse
    {
        $owner = Auth::user();

        $validated = $request->validate([
            'firstName'    => ['required', 'string', 'max:100'],
            'lastName'     => ['required', 'string', 'max:100'],
            'email'        => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'phone'        => ['nullable', 'string', 'max:30'],
            'title'        => ['nullable', 'string', 'max:150'],
            'department'   => ['nullable', 'string', 'max:100'],
            'startDate'    => ['nullable', 'date'],
            'employeeId'   => ['nullable', 'string', 'max:50'],
            'workType'     => ['nullable', 'string', 'max:50'],
            'salaryType'   => ['nullable', 'string', 'max:50'],
            'salaryAmount' => ['nullable', 'numeric', 'min:0'],
            'currency'     => ['nullable', 'string', 'max:10'],
            'sendInvite'   => ['nullable', 'boolean'],
        ]);

        $tempPassword = Str::random(12);

        $employee = User::create([
            'name'             => trim($validated['firstName'] . ' ' . $validated['lastName']),
            'email'            => $validated['email'],
            'password'         => Hash::make($tempPassword),
            'role'             => 'employee',
            'tenant_id'        => $owner->tenant_id ?? (string) $owner->id,
            'job_title'        => $validated['title'] ?? null,
            'department'       => $validated['department'] ?? null,
            'phone'            => $validated['phone'] ?? null,
            'employee_id'      => $validated['employeeId'] ?? null,
            'start_date'       => $validated['startDate'] ?? null,
            'work_type'        => $validated['workType'] ?? null,
            'salary_type'      => $validated['salaryType'] ?? null,
            'salary_amount'    => $validated['salaryAmount'] ?? null,
            'currency'         => $validated['currency'] ?? 'USD',
            'status'           => 'active',
            'invited_by'       => $owner->id,
            'email_verified_at'=> now(),
        ]);

        if ($validated['sendInvite'] ?? true) {
            try {
                Mail::to($employee->email)
                    ->send(new TeamInvitation($employee, $owner, $tempPassword, 'employee'));
            } catch (\Exception $e) {
                \Log::warning('Invitation email failed: ' . $e->getMessage());
            }
        }

        return back()->with('success', "Employee \"{$employee->name}\" added successfully! Temporary password: {$tempPassword}");
    }

    /**
     * Add a Client to the workspace.
     */
    public function storeClient(Request $request): RedirectResponse
    {
        $owner = Auth::user();

        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:200'],
            'email'       => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'phone'       => ['nullable', 'string', 'max:30'],
            'company'     => ['nullable', 'string', 'max:200'],
            'sendInvite'  => ['nullable', 'boolean'],
        ]);

        $tempPassword = Str::random(12);

        $client = User::create([
            'name'              => $validated['name'],
            'email'             => $validated['email'],
            'password'          => Hash::make($tempPassword),
            'role'              => 'client',
            'tenant_id'         => $owner->tenant_id ?? (string) $owner->id,
            'department'        => $validated['company'] ?? null,
            'phone'             => $validated['phone'] ?? null,
            'status'            => 'active',
            'invited_by'        => $owner->id,
            'email_verified_at' => now(),
        ]);

        if ($validated['sendInvite'] ?? true) {
            try {
                Mail::to($client->email)
                    ->send(new TeamInvitation($client, $owner, $tempPassword, 'client'));
            } catch (\Exception $e) {
                \Log::warning('Invitation email failed: ' . $e->getMessage());
            }
        }

        return back()->with('success', "Client \"{$client->name}\" added successfully! Temporary password: {$tempPassword}");
    }

    /**
     * Remove a team member.
     */
    public function destroy(int $id): RedirectResponse
    {
        $owner = Auth::user();

        $member = User::where('id', $id)
            ->where('invited_by', $owner->id)
            ->firstOrFail();

        $member->delete();

        return back()->with('success', "Team member removed.");
    }
}
