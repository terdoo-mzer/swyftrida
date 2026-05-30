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
        Schema::create('trips', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('origin', ['abuja', 'lagos']);
            $table->enum('destination', ['abuja', 'lagos']);
            $table->timestamp('departure_time');
            $table->integer('capacity');
            $table->decimal('price', 10,2);
            $table->enum('status', ['active', 'cancelled']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};
