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
        Schema::create('papers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type', 20)->default('aporte')->index();
            $table->string('title');
            $table->string('authors_or_journal')->nullable();
            $table->string('scientific_area', 80);
            $table->string('doi_or_link')->nullable();
            $table->string('requester_email')->nullable();
            $table->text('comment')->nullable();
            $table->string('contributed_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('papers');
    }
};
