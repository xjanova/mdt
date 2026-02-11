<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('branch_id')->constrained()->onDelete('cascade');
            $table->date('report_date');
            $table->string('product_name');
            $table->string('product_code')->nullable();
            $table->string('category')->nullable(); // ประตูไม้สัก, ประตูไม้เนื้อแข็ง, ฯลฯ
            $table->integer('quantity');
            $table->decimal('unit_price', 12, 2);
            $table->decimal('total_amount', 12, 2);
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->nullable();
            $table->enum('payment_method', ['cash', 'transfer', 'credit_card', 'installment'])->default('cash');
            $table->enum('status', ['pending', 'confirmed', 'delivered', 'cancelled'])->default('pending');
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_reports');
    }
};
