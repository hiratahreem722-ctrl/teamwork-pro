<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('leave_policies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('type');
            $table->integer('days_allowed')->default(0);
            $table->boolean('carry_forward')->default(false);
            $table->integer('max_carry_days')->default(0);
            $table->boolean('requires_approval')->default(true);
            $table->integer('min_notice_days')->default(1);
            $table->boolean('paid')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('leave_policies'); }
};
