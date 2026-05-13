<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('payroll_runs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('period'); // e.g. "May 2026"
            $table->date('processed_date')->nullable();
            $table->integer('employees_count')->default(0);
            $table->decimal('gross', 12, 2)->default(0);
            $table->decimal('deductions', 12, 2)->default(0);
            $table->decimal('net', 12, 2)->default(0);
            $table->string('status')->default('draft'); // draft, scheduled, processed
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('payroll_runs'); }
};
