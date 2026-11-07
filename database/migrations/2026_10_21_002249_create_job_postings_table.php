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
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('posted_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('region_id')->constrained('regions')->onDelete('cascade');
            $table->foreignId('commune_id')->nullable()->constrained('communes')->nullOnDelete();
            $table->foreignId('category_id')->constrained('career_categories')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('responsibilities');
            $table->text('requeriments');
            $table->enum('employment_type', ['completa', 'parcial', 'plazo_fijo', 'indefinido', 'honorarios', 'practica']);
            $table->enum('work_mode', ['presencial', 'remoto', 'hibrido']);
            $table->string('salary_min')->nullable();
            $table->string('salary_max')->nullable();
            $table->enum('status', ['borrador', 'pendiente', 'publicado', 'cerrado', 'rechazado']);
            $table->timestamp('start_date');
            $table->timestamp('finish_date')->nullable();
            $table->foreignId('approved_by')->constrained('users')->cascadeOnDelete();
            $table->string('rejection_reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};
