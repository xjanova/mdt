<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('problems', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->foreignId('reported_by')->constrained('employees')->onDelete('cascade');
            $table->foreignId('branch_id')->constrained()->onDelete('cascade');
            $table->foreignId('assigned_to')->nullable()->constrained('employees')->onDelete('set null');
            $table->foreignId('workflow_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('category', ['stock_display', 'promotion', 'product_damage', 'customer_complaint', 'staff', 'other']);
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', ['open', 'acknowledged', 'in_progress', 'resolved', 'closed'])->default('open');
            $table->integer('progress_percent')->default(0);
            $table->timestamps();
        });

        // รูปภาพประกอบปัญหา
        Schema::create('problem_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('problem_id')->constrained()->onDelete('cascade');
            $table->string('photo_path');
            $table->string('caption')->nullable();
            $table->foreignId('uploaded_by')->constrained('employees')->onDelete('cascade');
            $table->timestamps();
        });

        // ความคิดเห็น / อัพเดทความคืบหน้า
        Schema::create('problem_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('problem_id')->constrained()->onDelete('cascade');
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->text('comment');
            $table->string('photo_path')->nullable();
            $table->integer('progress_update')->nullable(); // % update
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('problem_comments');
        Schema::dropIfExists('problem_photos');
        Schema::dropIfExists('problems');
    }
};
