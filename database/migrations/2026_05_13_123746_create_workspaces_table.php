<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('workspaces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('industry')->nullable();
            $table->string('size')->nullable();
            $table->string('website')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('brand_color')->default('#7C3AED');
            $table->string('timezone')->default('UTC');
            $table->string('currency')->default('USD');
            $table->string('pm_view')->default('kanban');
            $table->string('work_style')->nullable();
            $table->json('departments')->nullable();
            $table->json('goals')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('workspaces'); }
};
