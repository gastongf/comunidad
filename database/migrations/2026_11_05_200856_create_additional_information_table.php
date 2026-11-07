<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('additional_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('headline', 255)->nullable();
            $table->string('profession', 180)->nullable();
            $table->string('institution', 255)->nullable();
            $table->foreignId('region_id')->nullable()->constrained('regions')->nullOnDelete();
            $table->string('city', 150)->nullable();
            $table->string('postgrad_level', 30)->nullable();
            $table->string('orcid', 19)->nullable()->unique();
            $table->string('cv_path', 500)->nullable();
            $table->boolean('open_to_work')->default(false);
            $table->boolean('is_public')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('additional_information');
    }
};
