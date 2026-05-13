<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('category')->default('General');
            $table->string('file_url')->nullable();
            $table->bigInteger('file_size')->default(0);
            $table->string('file_type')->nullable();
            $table->boolean('is_shared')->default(false);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('documents'); }
};
