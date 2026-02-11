<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ช่องทางสื่อสารระหว่างสาขา / ส่วนกลาง
        Schema::create('communications', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->text('message');
            $table->foreignId('from_employee')->constrained('employees')->onDelete('cascade');
            $table->foreignId('from_branch')->nullable()->constrained('branches')->onDelete('set null');
            $table->enum('type', ['announcement', 'request', 'coordination', 'feedback']);
            $table->enum('status', ['sent', 'read', 'replied', 'resolved'])->default('sent');
            $table->string('photo_path')->nullable();
            $table->timestamps();
        });

        // ผู้รับข้อความ (สาขาที่เกี่ยวข้อง)
        Schema::create('communication_recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('communication_id')->constrained()->onDelete('cascade');
            $table->foreignId('branch_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('employee_id')->nullable()->constrained()->onDelete('set null');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        // ตอบกลับ
        Schema::create('communication_replies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('communication_id')->constrained()->onDelete('cascade');
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->text('message');
            $table->string('photo_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('communication_replies');
        Schema::dropIfExists('communication_recipients');
        Schema::dropIfExists('communications');
    }
};
