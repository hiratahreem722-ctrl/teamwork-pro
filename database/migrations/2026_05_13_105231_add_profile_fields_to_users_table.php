<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('job_title')->nullable()->after('role');
            $table->string('department')->nullable()->after('job_title');
            $table->string('phone')->nullable()->after('department');
            $table->string('employee_id')->nullable()->after('phone');
            $table->date('start_date')->nullable()->after('employee_id');
            $table->string('work_type')->nullable()->after('start_date');
            $table->string('timezone')->nullable()->after('work_type');
            $table->string('salary_type')->nullable()->after('timezone');
            $table->decimal('salary_amount', 12, 2)->nullable()->after('salary_type');
            $table->string('currency', 10)->default('USD')->after('salary_amount');
            $table->string('pay_schedule')->nullable()->after('currency');
            $table->json('permissions')->nullable()->after('pay_schedule');
            $table->string('status')->default('active')->after('permissions');
            $table->unsignedBigInteger('invited_by')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'job_title', 'department', 'phone', 'employee_id',
                'start_date', 'work_type', 'timezone',
                'salary_type', 'salary_amount', 'currency', 'pay_schedule',
                'permissions', 'status', 'invited_by',
            ]);
        });
    }
};
