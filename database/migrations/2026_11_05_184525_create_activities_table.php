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
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('category', 40)->index();
            $table->string('modality', 30)->default('Online');
            $table->string('institution')->nullable();
            $table->date('event_date')->nullable();
            $table->boolean('is_free')->default(true);
            $table->string('member_discount')->nullable();
            $table->string('contact_or_link')->nullable();
            $table->string('image_path')->nullable();
            $table->text('description');
            $table->string('status', 20)->default('en_revision')->index();
            $table->text('admin_note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
